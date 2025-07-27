#!/usr/bin/env node

/**
 * GitHub Issues API - Issue management operations
 * 
 * Implements all issue-related operations to replace GitHub CLI commands:
 * - gh issue create → POST /repos/:owner/:repo/issues
 * - gh issue edit → PATCH /repos/:owner/:repo/issues/:number
 * - gh issue list → GET /repos/:owner/:repo/issues
 * - gh issue view → GET /repos/:owner/:repo/issues/:number
 * - gh issue close → PATCH /repos/:owner/:repo/issues/:number
 * 
 * Maintains JSON output compatibility with existing workflows
 */

import { GitHubAPI } from './github-api.js';

/**
 * GitHub Issues API extension
 */
export class GitHubIssues extends GitHubAPI {
    constructor(options = {}) {
        super(options);
    }

    /**
     * List issues - Replaces: gh issue list
     * 
     * @param {Object} options - List options
     * @returns {Promise<Array>} Issues array
     */
    async listIssues(options = {}) {
        const params = new URLSearchParams();
        
        // Map options to API parameters
        if (options.state) params.append('state', options.state);
        if (options.labels) params.append('labels', options.labels);
        if (options.milestone) params.append('milestone', options.milestone);
        if (options.assignee) params.append('assignee', options.assignee);
        if (options.creator) params.append('creator', options.creator);
        if (options.mentioned) params.append('mentioned', options.mentioned);
        if (options.sort) params.append('sort', options.sort);
        if (options.direction) params.append('direction', options.direction);
        if (options.since) params.append('since', options.since);
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);
        
        // Default to open issues, limit 30 per page
        if (!options.state) params.append('state', 'open');
        if (!options.per_page) params.append('per_page', '30');
        
        const endpoint = `/repos/${this.owner}/${this.repo}/issues?${params.toString()}`;
        const issues = await this.request(endpoint);
        
        // Transform to match gh CLI output format
        return issues.map(issue => ({
            number: issue.number,
            title: issue.title,
            state: issue.state.toUpperCase(), // gh CLI uses uppercase
            labels: issue.labels.map(label => ({ name: label.name })),
            milestone: issue.milestone ? {
                title: issue.milestone.title,
                number: issue.milestone.number
            } : null,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            body: issue.body,
            user: {
                login: issue.user.login
            },
            assignees: issue.assignees.map(assignee => ({ login: assignee.login })),
            url: issue.html_url
        }));
    }

    /**
     * Get single issue - Replaces: gh issue view
     * 
     * @param {number} issueNumber - Issue number
     * @returns {Promise<Object>} Issue object
     */
    async getIssue(issueNumber) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        const issue = await this.request(endpoint);
        
        // Transform to match gh CLI output format
        return {
            number: issue.number,
            title: issue.title,
            state: issue.state.toUpperCase(),
            labels: issue.labels.map(label => ({ name: label.name })),
            milestone: issue.milestone ? {
                title: issue.milestone.title,
                number: issue.milestone.number
            } : null,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            body: issue.body,
            user: {
                login: issue.user.login
            },
            assignees: issue.assignees.map(assignee => ({ login: assignee.login })),
            url: issue.html_url
        };
    }

    /**
     * Create issue - Replaces: gh issue create
     * 
     * @param {Object} issueData - Issue creation data
     * @returns {Promise<Object>} Created issue
     */
    async createIssue(issueData) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues`;
        
        const body = {
            title: issueData.title,
            body: issueData.body || '',
            labels: issueData.labels || [],
            assignees: issueData.assignees || [],
            milestone: issueData.milestone || null
        };
        
        const issue = await this.request(endpoint, {
            method: 'POST',
            body: body
        });
        
        // Transform to match gh CLI output format
        return {
            number: issue.number,
            title: issue.title,
            state: issue.state.toUpperCase(),
            labels: issue.labels.map(label => ({ name: label.name })),
            milestone: issue.milestone ? {
                title: issue.milestone.title,
                number: issue.milestone.number
            } : null,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            body: issue.body,
            user: {
                login: issue.user.login
            },
            assignees: issue.assignees.map(assignee => ({ login: assignee.login })),
            url: issue.html_url
        };
    }

    /**
     * Update issue - Replaces: gh issue edit
     * 
     * @param {number} issueNumber - Issue number
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated issue
     */
    async updateIssue(issueNumber, updateData) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        
        const body = {};
        if (updateData.title !== undefined) body.title = updateData.title;
        if (updateData.body !== undefined) body.body = updateData.body;
        if (updateData.state !== undefined) body.state = updateData.state;
        if (updateData.labels !== undefined) body.labels = updateData.labels;
        if (updateData.assignees !== undefined) body.assignees = updateData.assignees;
        if (updateData.milestone !== undefined) body.milestone = updateData.milestone;
        
        const issue = await this.request(endpoint, {
            method: 'PATCH',
            body: body
        });
        
        // Transform to match gh CLI output format
        return {
            number: issue.number,
            title: issue.title,
            state: issue.state.toUpperCase(),
            labels: issue.labels.map(label => ({ name: label.name })),
            milestone: issue.milestone ? {
                title: issue.milestone.title,
                number: issue.milestone.number
            } : null,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            body: issue.body,
            user: {
                login: issue.user.login
            },
            assignees: issue.assignees.map(assignee => ({ login: assignee.login })),
            url: issue.html_url
        };
    }

    /**
     * Close issue - Replaces: gh issue close
     * 
     * @param {number} issueNumber - Issue number
     * @param {string} comment - Optional closing comment
     * @returns {Promise<Object>} Closed issue
     */
    async closeIssue(issueNumber, comment = null) {
        // Add comment if provided
        if (comment) {
            await this.addIssueComment(issueNumber, comment);
        }
        
        // Close the issue
        return await this.updateIssue(issueNumber, { state: 'closed' });
    }

    /**
     * Add comment to issue
     * 
     * @param {number} issueNumber - Issue number
     * @param {string} comment - Comment text
     * @returns {Promise<Object>} Comment object
     */
    async addIssueComment(issueNumber, comment) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`;
        
        const commentData = await this.request(endpoint, {
            method: 'POST',
            body: { body: comment }
        });
        
        return {
            id: commentData.id,
            body: commentData.body,
            user: {
                login: commentData.user.login
            },
            createdAt: commentData.created_at,
            updatedAt: commentData.updated_at,
            url: commentData.html_url
        };
    }

    /**
     * Add labels to issue - Replaces: gh issue edit --add-label
     * 
     * @param {number} issueNumber - Issue number
     * @param {string[]} labels - Labels to add
     * @returns {Promise<Object>} Updated issue
     */
    async addLabelsToIssue(issueNumber, labels) {
        const endpoint = `/repos/${this.owner}/${this.repo}/issues/${issueNumber}/labels`;
        
        await this.request(endpoint, {
            method: 'POST',
            body: { labels }
        });
        
        return await this.getIssue(issueNumber);
    }

    /**
     * Set milestone for issue - Replaces: gh issue edit --milestone
     * 
     * @param {number} issueNumber - Issue number
     * @param {string} milestoneTitle - Milestone title
     * @returns {Promise<Object>} Updated issue
     */
    async setIssueMilestone(issueNumber, milestoneTitle) {
        // First, get milestone number by title
        const milestones = await this.listMilestones();
        const milestone = milestones.find(m => m.title === milestoneTitle);
        
        if (!milestone) {
            throw new Error(`Milestone "${milestoneTitle}" not found`);
        }
        
        return await this.updateIssue(issueNumber, { milestone: milestone.number });
    }

    /**
     * Get milestones - Replaces: gh api repos/:owner/:repo/milestones
     * 
     * @returns {Promise<Array>} Milestones array
     */
    async listMilestones() {
        const endpoint = `/repos/${this.owner}/${this.repo}/milestones`;
        const milestones = await this.request(endpoint);
        
        // Transform to match expected format
        return milestones.map(milestone => ({
            number: milestone.number,
            title: milestone.title,
            description: milestone.description,
            state: milestone.state,
            createdAt: milestone.created_at,
            updatedAt: milestone.updated_at,
            dueOn: milestone.due_on,
            closedAt: milestone.closed_at
        }));
    }

    /**
     * Search issues - Enhanced search capabilities
     * 
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Array>} Search results
     */
    async searchIssues(query, options = {}) {
        const params = new URLSearchParams();
        
        // Build search query
        let searchQuery = `repo:${this.owner}/${this.repo} ${query}`;
        
        if (options.state) searchQuery += ` state:${options.state}`;
        if (options.labels) searchQuery += ` label:${options.labels}`;
        if (options.milestone) searchQuery += ` milestone:"${options.milestone}"`;
        if (options.assignee) searchQuery += ` assignee:${options.assignee}`;
        if (options.author) searchQuery += ` author:${options.author}`;
        if (options.updated) searchQuery += ` updated:${options.updated}`;
        
        params.append('q', searchQuery);
        if (options.sort) params.append('sort', options.sort);
        if (options.order) params.append('order', options.order);
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);
        
        const endpoint = `/search/issues?${params.toString()}`;
        const result = await this.request(endpoint);
        
        // Transform to match gh CLI output format
        return result.items.map(issue => ({
            number: issue.number,
            title: issue.title,
            state: issue.state.toUpperCase(),
            labels: issue.labels.map(label => ({ name: label.name })),
            milestone: issue.milestone ? {
                title: issue.milestone.title,
                number: issue.milestone.number
            } : null,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            body: issue.body,
            user: {
                login: issue.user.login
            },
            assignees: issue.assignees.map(assignee => ({ login: assignee.login })),
            url: issue.html_url
        }));
    }

    /**
     * Get issues updated since timestamp - For cache synchronization
     * 
     * @param {string} since - ISO timestamp
     * @returns {Promise<Array>} Updated issues
     */
    async getIssuesUpdatedSince(since) {
        return await this.listIssues({
            state: 'all',
            sort: 'updated',
            direction: 'desc',
            since: since,
            per_page: 100
        });
    }

    /**
     * Get latest issue number - For cache management
     * 
     * @returns {Promise<number>} Latest issue number
     */
    async getLatestIssueNumber() {
        const issues = await this.listIssues({
            state: 'all',
            sort: 'created',
            direction: 'desc',
            per_page: 1
        });
        
        return issues.length > 0 ? issues[0].number : 0;
    }
}

/**
 * Create GitHub Issues API client
 * 
 * @param {Object} options - Configuration options
 * @returns {GitHubIssues} Issues API client
 */
export function createGitHubIssues(options = {}) {
    return new GitHubIssues(options);
}

/**
 * CLI interface for issue operations
 */
export async function main(args) {
    try {
        const issues = createGitHubIssues();
        const command = args[0];
        
        switch (command) {
            case 'list':
                const listOptions = {};
                if (args.includes('--state')) listOptions.state = args[args.indexOf('--state') + 1];
                if (args.includes('--milestone')) listOptions.milestone = args[args.indexOf('--milestone') + 1];
                if (args.includes('--label')) listOptions.labels = args[args.indexOf('--label') + 1];
                if (args.includes('--limit')) listOptions.per_page = args[args.indexOf('--limit') + 1];
                
                const issuesList = await issues.listIssues(listOptions);
                console.log(JSON.stringify(issuesList, null, 2));
                break;
                
            case 'view':
                const issueNumber = parseInt(args[1]);
                if (!issueNumber) {
                    throw new Error('Issue number is required');
                }
                
                const issue = await issues.getIssue(issueNumber);
                console.log(JSON.stringify(issue, null, 2));
                break;
                
            case 'create':
                const titleIndex = args.indexOf('--title');
                const bodyIndex = args.indexOf('--body');
                const milestoneIndex = args.indexOf('--milestone');
                const labelIndex = args.indexOf('--label');
                
                if (titleIndex === -1 || titleIndex + 1 >= args.length) {
                    throw new Error('--title is required');
                }
                
                const createData = {
                    title: args[titleIndex + 1],
                    body: bodyIndex !== -1 ? args[bodyIndex + 1] : ''
                };
                
                if (milestoneIndex !== -1) {
                    createData.milestone = args[milestoneIndex + 1];
                }
                
                if (labelIndex !== -1) {
                    createData.labels = [args[labelIndex + 1]];
                }
                
                const newIssue = await issues.createIssue(createData);
                console.log(newIssue.url);
                break;
                
            case 'close':
                const closeNumber = parseInt(args[1]);
                const commentIndex = args.indexOf('-c');
                
                if (!closeNumber) {
                    throw new Error('Issue number is required');
                }
                
                const comment = commentIndex !== -1 ? args[commentIndex + 1] : null;
                const closedIssue = await issues.closeIssue(closeNumber, comment);
                console.log(`Issue #${closedIssue.number} closed`);
                break;
                
            case 'test':
                const testResult = await issues.testConnection();
                if (testResult.success) {
                    console.log(`✓ Connected to GitHub as ${testResult.user}`);
                    const repoInfo = await issues.getRepository();
                    console.log(`Repository: ${repoInfo.full_name}`);
                    console.log(`Rate limit: ${testResult.rateLimit.remaining} requests remaining`);
                } else {
                    console.error(`✗ Connection failed: ${testResult.error}`);
                    process.exit(1);
                }
                break;
                
            default:
                console.log('GitHub Issues API - Available commands:');
                console.log('  list [--state open|closed|all] [--milestone title] [--label name] [--limit n]');
                console.log('  view <issue-number>');
                console.log('  create --title "Title" [--body "Body"] [--milestone "Milestone"] [--label "Label"]');
                console.log('  close <issue-number> [-c "Comment"]');
                console.log('  test');
                console.log('');
                console.log('Environment variables:');
                console.log('  GITHUB_TOKEN - GitHub personal access token (required)');
                break;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2));
}