#!/usr/bin/env node

/**
 * Repository Configuration - Unified config system for all scripts
 * 
 * Provides centralized repository configuration management:
 * - Repository detection from config files
 * - Working directory context
 * - GitHub API settings
 * - Git repository information
 * - Fallback to git detection
 * 
 * Replaces scattered config reading across multiple scripts with single source of truth
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Repository Configuration Class
 */
export class RepoConfig {
    constructor(options = {}) {
        this.workingDirectory = options.workingDirectory || process.cwd();
        this.config = this.loadConfig();
        
        // Repository information with fallback to git detection
        this.owner = this.config.owner || this.detectOwner();
        this.repo = this.config.repo || this.detectRepo();
        this.projectRoot = this.config.projectRoot || this.detectProjectRoot();
        this.gitRemote = this.config.gitRemote || this.detectGitRemote();
        
        // Validate that we have repository information
        if (!this.owner || !this.repo) {
            throw new Error('Unable to determine repository owner/name. Ensure you are in a git repository or provide repo-config.json');
        }
    }
    
    /**
     * Load configuration from repo-config.json files with auto-generation
     */
    loadConfig() {
        const configPaths = [
            path.join(this.workingDirectory, 'claude/local/repo-config.json'),
            path.join(this.workingDirectory, 'claude/project/repo-config.json')
        ];
        
        // Try to load existing config
        for (const configPath of configPaths) {
            try {
                const configData = JSON.parse(readFileSync(configPath, 'utf8'));
                
                // Extract repository info from projectRoot if available
                if (configData.projectRoot && !configData.owner && !configData.repo) {
                    const repoInfo = this.extractRepoFromPath(configData.projectRoot);
                    if (repoInfo) {
                        configData.owner = repoInfo.owner;
                        configData.repo = repoInfo.repo;
                    }
                }
                
                return configData;
            } catch (error) {
                // Config file doesn't exist or is invalid, try next
                continue;
            }
        }
        
        // No config found - try to auto-generate from git repository
        try {
            const generatedConfig = this.generateConfigFromGit();
            if (generatedConfig) {
                this.saveConfig(generatedConfig);
                console.log(`📝 Auto-generated repo-config.json for ${generatedConfig.owner}/${generatedConfig.repo}`);
                return generatedConfig;
            }
        } catch (error) {
            // Auto-generation failed, return empty config for fallback detection
        }
        
        // Return empty config - will use fallback git detection
        return {};
    }
    
    /**
     * Generate configuration from git repository information
     */
    generateConfigFromGit() {
        try {
            const projectRoot = this.detectProjectRoot();
            const gitRemote = this.detectGitRemote();
            const repoInfo = this.extractRepoFromPath(projectRoot);
            
            if (!repoInfo || !gitRemote) {
                throw new Error('Unable to detect repository information from git');
            }
            
            const config = {
                auditLogPath: `${projectRoot}/claude/project/audit/current/current.log`,
                auditLogDirectory: `${projectRoot}/claude/project/audit/current`,
                projectRoot: projectRoot,
                scriptsPath: `${projectRoot}/claude/wow/scripts`,
                owner: repoInfo.owner,
                repo: repoInfo.repo,
                gitRemote: gitRemote,
                configVersion: '2.0.0',
                generatedBy: 'AUTO_GENERATION',
                lastUpdated: new Date().toISOString()
            };
            
            return config;
        } catch (error) {
            return null;
        }
    }

    /**
     * Save configuration to local repo-config.json file
     */
    saveConfig(config) {
        try {
            const localConfigDir = path.join(this.workingDirectory, 'claude/local');
            const localConfigPath = path.join(localConfigDir, 'repo-config.json');
            
            // Ensure directory exists
            mkdirSync(localConfigDir, { recursive: true });
            
            // Write config file
            writeFileSync(localConfigPath, JSON.stringify(config, null, 2));
            
            return localConfigPath;
        } catch (error) {
            console.warn(`Warning: Could not save repo-config.json: ${error.message}`);
            return null;
        }
    }

    /**
     * Extract repository owner/name from project root path
     */
    extractRepoFromPath(projectRoot) {
        try {
            // Expected format: /path/to/owner/repo
            const pathParts = projectRoot.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                const repo = pathParts[pathParts.length - 1]; // last part
                const owner = pathParts[pathParts.length - 2]; // second to last
                return { owner, repo };
            }
        } catch (error) {
            // Path parsing failed
        }
        return null;
    }
    
    /**
     * Detect repository owner from git remote (fallback)
     */
    detectOwner() {
        try {
            const remoteURL = execSync('git remote get-url origin', { 
                cwd: this.workingDirectory,
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim();
            
            const match = remoteURL.match(/github\.com[/:]([^/]+)\/([^/]+)(?:\.git)?$/);
            return match ? match[1] : null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Detect repository name from git remote (fallback)
     */
    detectRepo() {
        try {
            const remoteURL = execSync('git remote get-url origin', { 
                cwd: this.workingDirectory,
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim();
            
            const match = remoteURL.match(/github\.com[/:]([^/]+)\/([^/]+)(?:\.git)?$/);
            return match ? match[2].replace(/\.git$/, '') : null;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Detect project root from git (fallback)
     */
    detectProjectRoot() {
        try {
            return execSync('git rev-parse --show-toplevel', { 
                cwd: this.workingDirectory,
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim();
        } catch (error) {
            return this.workingDirectory;
        }
    }
    
    /**
     * Detect git remote URL (fallback)
     */
    detectGitRemote() {
        try {
            return execSync('git remote get-url origin', { 
                cwd: this.workingDirectory,
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim();
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get GitHub API configuration
     */
    getGitHubConfig() {
        return {
            owner: this.owner,
            repo: this.repo,
            workingDirectory: this.workingDirectory,
            token: process.env.GITHUB_TOKEN
        };
    }
    
    /**
     * Get git configuration
     */
    getGitConfig() {
        return {
            workingDirectory: this.workingDirectory,
            projectRoot: this.projectRoot,
            remote: this.gitRemote
        };
    }
    
    /**
     * Get repository URLs
     */
    getRepositoryUrls() {
        const baseUrl = `https://github.com/${this.owner}/${this.repo}`;
        return {
            web: baseUrl,
            api: `https://api.github.com/repos/${this.owner}/${this.repo}`,
            clone: `${baseUrl}.git`,
            ssh: `git@github.com:${this.owner}/${this.repo}.git`
        };
    }
    
    /**
     * Get full repository information
     */
    getRepositoryInfo() {
        return {
            owner: this.owner,
            repo: this.repo,
            name: this.repo,
            fullName: `${this.owner}/${this.repo}`,
            projectRoot: this.projectRoot,
            workingDirectory: this.workingDirectory,
            remote: this.gitRemote,
            urls: this.getRepositoryUrls(),
            configSource: this.config ? 'config-file' : 'git-detection'
        };
    }
    
    /**
     * Execute git command with proper working directory
     */
    gitCommand(command, description = 'git command') {
        try {
            return execSync(command, {
                cwd: this.workingDirectory,
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim();
        } catch (error) {
            throw new Error(`Git command failed (${description}): ${error.message}`);
        }
    }
}

/**
 * Create repository configuration instance
 */
export function createRepoConfig(options = {}) {
    return new RepoConfig(options);
}

/**
 * Get repository configuration for current directory
 */
export function getRepoConfig(workingDirectory = null) {
    return createRepoConfig({ workingDirectory: workingDirectory || process.cwd() });
}

/**
 * CLI interface for testing configuration
 */
export async function main(args) {
    try {
        const workingDir = args.includes('--directory') ? args[args.indexOf('--directory') + 1] : process.cwd();
        const config = createRepoConfig({ workingDirectory: workingDir });
        
        if (args.includes('--json')) {
            console.log(JSON.stringify(config.getRepositoryInfo(), null, 2));
        } else {
            const info = config.getRepositoryInfo();
            console.log('📊 Repository Configuration');
            console.log('═'.repeat(40));
            console.log(`Repository: ${info.fullName}`);
            console.log(`Project Root: ${info.projectRoot}`);
            console.log(`Working Dir: ${info.workingDirectory}`);
            console.log(`Config Source: ${info.configSource}`);
            console.log(`Web URL: ${info.urls.web}`);
            console.log(`API URL: ${info.urls.api}`);
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