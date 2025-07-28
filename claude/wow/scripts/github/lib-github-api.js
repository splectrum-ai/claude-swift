#!/usr/bin/env node

/**
 * GitHub API Client - Bare-conversion friendly implementation using native fetch()
 * 
 * Replaces GitHub CLI commands with lightweight JavaScript API calls
 * Zero external dependencies - uses only Node.js built-in modules
 * 
 * Features:
 * - Authentication via GitHub token
 * - Rate limiting and retry logic
 * - Error handling and logging
 * - JSON output compatibility with gh CLI
 * - Repository auto-detection
 */

import { promises as fs, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub API Client Class
 * 
 * Provides methods for all GitHub operations used in workflows:
 * - Issue management (create, edit, list, view, close)
 * - Release management (create releases)
 * - Repository operations (milestones, labels)
 * - Cache management with delta sync
 */
export class GitHubAPI {
    constructor(options = {}) {
        this.baseURL = 'https://api.github.com';
        this.token = options.token || process.env.GITHUB_TOKEN || this.getGhToken();
        this.userAgent = options.userAgent || 'claude-swift-github-api/1.0.0';
        this.workingDirectory = options.workingDirectory || process.cwd();
        
        // Try config-based detection first, then fallback to git detection
        const configRepo = this.getRepoFromConfig() || {};
        this.owner = options.owner || configRepo.owner || this.detectOwner();
        this.repo = options.repo || configRepo.repo || this.detectRepo();
        
        // Rate limiting configuration
        this.rateLimitRemaining = 5000;
        this.rateLimitReset = Date.now() + 3600000; // 1 hour from now
        this.rateLimitBuffer = 100; // Keep 100 requests in reserve
        
        // Request retry configuration
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second base delay
        
        if (!this.token) {
            throw new Error('GitHub token is required. Set GITHUB_TOKEN environment variable, use "gh auth login", or pass token in options.');
        }
        
        if (!this.owner || !this.repo) {
            throw new Error('Repository owner and name are required. Ensure you are in a git repository or provide owner/repo options.');
        }
    }

    /**
     * Get GitHub token from gh CLI
     */
    getGhToken() {
        try {
            return execSync('gh auth token', { encoding: 'utf8' }).trim();
        } catch (error) {
            // gh CLI not available or not authenticated
            return null;
        }
    }

    /**
     * Get repository from local repo config (preferred method)
     */
    getRepoFromConfig() {
        try {
            // Look for config files in specified working directory
            const configPaths = [
                path.join(this.workingDirectory, 'claude/local/repo-config.json'),
                path.join(this.workingDirectory, 'claude/project/repo-config.json')
            ];
            
            for (const configPath of configPaths) {
                try {
                    const configData = JSON.parse(readFileSync(configPath, 'utf8'));
                    if (configData.projectRoot) {
                        // Extract owner/repo from project root path
                        // Expected format: /path/to/sesameh/claude-swift
                        const pathParts = configData.projectRoot.split('/').filter(Boolean);
                        if (pathParts.length >= 2) {
                            const repo = pathParts[pathParts.length - 1]; // last part (claude-swift)
                            const owner = pathParts[pathParts.length - 2]; // second to last (sesameh)
                            
                            // Return config values if detection succeeded
                            return { owner, repo };
                        }
                    }
                } catch (error) {
                    // Config file doesn't exist or is invalid, try next
                    continue;
                }
            }
        } catch (error) {
            // Config detection failed, keep existing git-detected values
        }
    }

    /**
     * Auto-detect repository owner from git remote
     */
    detectOwner() {
        try {
            const remoteURL = execSync('git remote get-url origin', { 
                encoding: 'utf8', 
                cwd: this.workingDirectory 
            }).trim();
            const match = remoteURL.match(/github\.com[/:]([^/]+)\/([^/]+)(\.git)?$/);
            return match ? match[1] : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Auto-detect repository name from git remote
     */
    detectRepo() {
        try {
            const remoteURL = execSync('git remote get-url origin', { 
                encoding: 'utf8', 
                cwd: this.workingDirectory 
            }).trim();
            const match = remoteURL.match(/github\.com[/:]([^/]+)\/([^/]+)(\.git)?$/);
            return match ? match[2].replace(/\.git$/, '') : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Make authenticated request to GitHub API
     * 
     * @param {string} endpoint - API endpoint (e.g., '/repos/owner/repo/issues')
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - API response
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        
        // Check rate limit before making request
        if (this.rateLimitRemaining <= this.rateLimitBuffer) {
            const resetTime = new Date(this.rateLimitReset);
            const waitTime = Math.max(0, this.rateLimitReset - Date.now());
            
            if (waitTime > 0) {
                console.warn(`Rate limit approaching. Waiting ${Math.ceil(waitTime / 1000)} seconds until reset...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        const headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': this.userAgent,
            'X-GitHub-Api-Version': '2022-11-28',
            ...options.headers
        };
        
        if (options.body && typeof options.body === 'object') {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }
        
        const requestOptions = {
            method,
            headers,
            ...options
        };
        
        // Retry logic with exponential backoff
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await fetch(url, requestOptions);
                
                // Update rate limit tracking from response headers
                this.updateRateLimit(response.headers);
                
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return await response.json();
                    }
                    return await response.text();
                }
                
                // Handle specific error cases
                if (response.status === 403) {
                    const errorData = await response.json().catch(() => ({ message: 'Rate limit exceeded' }));
                    if (errorData.message.includes('rate limit')) {
                        // Wait for rate limit reset
                        const resetTime = parseInt(response.headers.get('x-ratelimit-reset')) * 1000;
                        const waitTime = Math.max(0, resetTime - Date.now());
                        console.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue; // Retry after waiting
                    }
                    throw new Error(`GitHub API access denied: ${errorData.message}`);
                }
                
                if (response.status === 404) {
                    throw new Error(`GitHub API resource not found: ${endpoint}`);
                }
                
                if (response.status >= 500) {
                    // Server error - retry with exponential backoff
                    if (attempt < this.maxRetries) {
                        const delay = this.retryDelay * Math.pow(2, attempt);
                        console.warn(`Server error (${response.status}). Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                
                // Other client errors - don't retry
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`GitHub API error (${response.status}): ${errorData.message}`);
                
            } catch (error) {
                if (attempt === this.maxRetries) {
                    throw error;
                }
                
                // Network error - retry with exponential backoff
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    const delay = this.retryDelay * Math.pow(2, attempt);
                    console.warn(`Network error. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                throw error;
            }
        }
    }

    /**
     * Update rate limit tracking from response headers
     * 
     * @param {Headers} headers - Response headers
     */
    updateRateLimit(headers) {
        const remaining = headers.get('x-ratelimit-remaining');
        const reset = headers.get('x-ratelimit-reset');
        
        if (remaining) {
            this.rateLimitRemaining = parseInt(remaining);
        }
        
        if (reset) {
            this.rateLimitReset = parseInt(reset) * 1000; // Convert to milliseconds
        }
    }

    /**
     * Get current rate limit status
     * 
     * @returns {Object} Rate limit information
     */
    getRateLimit() {
        return {
            remaining: this.rateLimitRemaining,
            reset: new Date(this.rateLimitReset),
            resetIn: Math.max(0, this.rateLimitReset - Date.now())
        };
    }

    /**
     * Test API connection and authentication
     * 
     * @returns {Promise<Object>} User information
     */
    async testConnection() {
        try {
            const user = await this.request('/user');
            return {
                success: true,
                user: user.login,
                rateLimit: this.getRateLimit()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get repository information
     * 
     * @returns {Promise<Object>} Repository data
     */
    async getRepository() {
        return await this.request(`/repos/${this.owner}/${this.repo}`);
    }

    /**
     * List repository issues
     * 
     * @param {Object} options - Query options
     * @param {string} options.state - Issue state (open, closed, all)
     * @param {number} options.per_page - Number of results per page
     * @param {string} options.milestone - Milestone title
     * @param {string} options.labels - Comma-separated list of labels
     * @returns {Promise<Array>} Array of issues
     */
    async listIssues(options = {}) {
        const params = new URLSearchParams();
        
        if (options.state) params.append('state', options.state);
        if (options.per_page) params.append('per_page', options.per_page.toString());
        if (options.milestone) params.append('milestone', options.milestone);
        if (options.labels) params.append('labels', options.labels);
        
        const endpoint = `/repos/${this.owner}/${this.repo}/issues?${params.toString()}`;
        return await this.request(endpoint);
    }

    /**
     * List repository milestones
     * 
     * @param {Object} options - Query options
     * @param {string} options.state - Milestone state (open, closed, all)
     * @param {number} options.per_page - Number of results per page
     * @returns {Promise<Array>} Array of milestones
     */
    async listMilestones(options = {}) {
        const params = new URLSearchParams();
        
        if (options.state) params.append('state', options.state);
        if (options.per_page) params.append('per_page', options.per_page.toString());
        
        const endpoint = `/repos/${this.owner}/${this.repo}/milestones?${params.toString()}`;
        return await this.request(endpoint);
    }

    /**
     * Get a specific issue
     * 
     * @param {number} issueNumber - Issue number
     * @returns {Promise<Object>} Issue data
     */
    async getIssue(issueNumber) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        return await this.request(endpoint);
    }

    /**
     * Create a new issue
     * 
     * @param {Object} data - Issue data
     * @param {string} data.title - Issue title
     * @param {string} data.body - Issue body
     * @param {Array} data.labels - Issue labels
     * @param {string} data.milestone - Milestone title
     * @returns {Promise<Object>} Created issue data
     */
    async createIssue(data) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues`;
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update an existing issue
     * 
     * @param {number} issueNumber - Issue number
     * @param {Object} data - Updated issue data
     * @returns {Promise<Object>} Updated issue data
     */
    async updateIssue(issueNumber, data) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        return await this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * Add labels to an issue
     * 
     * @param {number} issueNumber - Issue number
     * @param {Array} labels - Array of label names
     * @returns {Promise<Object>} Updated issue data
     */
    async addLabelsToIssue(issueNumber, labels) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/labels`;
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({ labels })
        });
    }

    /**
     * Close an issue
     * 
     * @param {number} issueNumber - Issue number
     * @param {string} comment - Optional closing comment
     * @returns {Promise<Object>} Closed issue data
     */
    async closeIssue(issueNumber, comment) {
        // Add comment if provided
        if (comment) {
            const commentEndpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`;
            await this.request(commentEndpoint, {
                method: 'POST',
                body: JSON.stringify({ body: comment })
            });
        }

        // Close the issue
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        return await this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify({ state: 'closed' })
        });
    }

    // Release Management Methods (implemented in next sections)
    // Cache Management Methods (implemented in next sections)
}

/**
 * Create GitHub API client instance with auto-configuration
 * 
 * @param {Object} options - Configuration options
 * @returns {GitHubAPI} Configured API client
 */
export function createGitHubAPI(options = {}) {
    return new GitHubAPI(options);
}

/**
 * CLI helper function for command-line usage
 * 
 * @param {string[]} args - Command line arguments
 * @returns {Promise<void>}
 */
export async function main(args) {
    try {
        const api = createGitHubAPI();
        
        if (args.includes('--test')) {
            const result = await api.testConnection();
            if (result.success) {
                console.log(`✓ Connected to GitHub as ${result.user}`);
                console.log(`Rate limit: ${result.rateLimit.remaining} requests remaining`);
            } else {
                console.error(`✗ Connection failed: ${result.error}`);
                process.exit(1);
            }
        } else {
            console.log('GitHub API Client - Basic configuration:');
            console.log(`Repository: ${api.owner}/${api.repo}`);
            console.log(`Token: ${api.token ? '✓ Configured' : '✗ Missing'}`);
            console.log('\nUse --test to verify connection');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('lib-github-api.js')) {
    main(process.argv.slice(2));
}