#!/usr/bin/env node

/**
 * GitHub API Cache - Cache synchronization with delta sync
 * 
 * Implements cache management for GitHub API data:
 * - Issue cache with delta synchronization
 * - Milestone cache management
 * - Performance optimization for workflows
 * - Offline capability with stale data handling
 * 
 * Replaces heavy GitHub CLI usage with efficient caching
 */

import { GitHubIssues } from './github-issues.js';
import { GitHubReleases } from './github-releases.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Cache Management
 */
export class GitHubCache extends GitHubIssues {
    constructor(options = {}) {
        super(options);
        this.cacheDir = options.cacheDir || 'claude/project/cache';
        this.issuesCache = path.join(this.cacheDir, 'issues.json');
        this.milestonesCache = path.join(this.cacheDir, 'milestones.json');
        this.cacheMetadata = path.join(this.cacheDir, 'metadata.json');
        
        // Cache configuration
        this.maxAge = options.maxAge || 3600000; // 1 hour default
        this.maxStaleAge = options.maxStaleAge || 86400000; // 24 hours
        this.batchSize = options.batchSize || 100;
    }

    /**
     * Ensure cache directory exists
     */
    async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    /**
     * Get cache metadata
     * 
     * @returns {Promise<Object>} Cache metadata
     */
    async getCacheMetadata() {
        try {
            const metadata = await fs.readFile(this.cacheMetadata, 'utf8');
            return JSON.parse(metadata);
        } catch (error) {
            return {
                issuesLastSync: null,
                milestonesLastSync: null,
                latestIssueNumber: 0,
                totalIssues: 0,
                syncCount: 0,
                lastError: null
            };
        }
    }

    /**
     * Update cache metadata
     * 
     * @param {Object} updates - Metadata updates
     */
    async updateCacheMetadata(updates) {
        await this.ensureCacheDir();
        const metadata = await this.getCacheMetadata();
        const updatedMetadata = {
            ...metadata,
            ...updates,
            lastUpdate: new Date().toISOString()
        };
        
        await fs.writeFile(this.cacheMetadata, JSON.stringify(updatedMetadata, null, 2));
    }

    /**
     * Load issues from cache
     * 
     * @returns {Promise<Object>} Issues cache
     */
    async loadIssuesCache() {
        try {
            const cache = await fs.readFile(this.issuesCache, 'utf8');
            return JSON.parse(cache);
        } catch (error) {
            return {};
        }
    }

    /**
     * Save issues to cache
     * 
     * @param {Object} issues - Issues cache object
     */
    async saveIssuesCache(issues) {
        await this.ensureCacheDir();
        await fs.writeFile(this.issuesCache, JSON.stringify(issues, null, 2));
    }

    /**
     * Load milestones from cache
     * 
     * @returns {Promise<Array>} Milestones cache
     */
    async loadMilestonesCache() {
        try {
            const cache = await fs.readFile(this.milestonesCache, 'utf8');
            return JSON.parse(cache);
        } catch (error) {
            return [];
        }
    }

    /**
     * Save milestones to cache
     * 
     * @param {Array} milestones - Milestones array
     */
    async saveMilestonesCache(milestones) {
        await this.ensureCacheDir();
        await fs.writeFile(this.milestonesCache, JSON.stringify(milestones, null, 2));
    }

    /**
     * Check if cache is fresh
     * 
     * @param {string} lastSync - Last sync timestamp
     * @returns {boolean} Is cache fresh
     */
    isCacheFresh(lastSync) {
        if (!lastSync) return false;
        const age = Date.now() - new Date(lastSync).getTime();
        return age < this.maxAge;
    }

    /**
     * Check if cache is stale but usable
     * 
     * @param {string} lastSync - Last sync timestamp
     * @returns {boolean} Is cache stale but usable
     */
    isCacheStale(lastSync) {
        if (!lastSync) return false;
        const age = Date.now() - new Date(lastSync).getTime();
        return age > this.maxAge && age < this.maxStaleAge;
    }

    /**
     * Full cache synchronization - Initial or forced sync
     * 
     * @param {Object} options - Sync options
     * @returns {Promise<Object>} Sync result
     */
    async fullSync(options = {}) {
        console.log('🔄 Starting full cache synchronization...');
        
        try {
            const metadata = await this.getCacheMetadata();
            
            // Get all issues
            console.log('📋 Fetching all issues...');
            const allIssues = await this.listIssues({
                state: 'all',
                per_page: 100
            });
            
            // Convert to cache format (keyed by issue number)
            const issuesCache = {};
            let latestIssueNumber = 0;
            
            for (const issue of allIssues) {
                issuesCache[issue.number] = {
                    ...issue,
                    cached_at: new Date().toISOString()
                };
                latestIssueNumber = Math.max(latestIssueNumber, issue.number);
            }
            
            // Get all milestones
            console.log('🎯 Fetching all milestones...');
            const milestones = await this.listMilestones();
            
            // Save to cache
            await this.saveIssuesCache(issuesCache);
            await this.saveMilestonesCache(milestones);
            
            // Update metadata
            await this.updateCacheMetadata({
                issuesLastSync: new Date().toISOString(),
                milestonesLastSync: new Date().toISOString(),
                latestIssueNumber: latestIssueNumber,
                totalIssues: allIssues.length,
                syncCount: metadata.syncCount + 1,
                lastError: null
            });
            
            console.log(`✓ Full sync completed: ${allIssues.length} issues, ${milestones.length} milestones`);
            
            return {
                success: true,
                issuesCount: allIssues.length,
                milestonesCount: milestones.length,
                latestIssueNumber: latestIssueNumber,
                syncType: 'full'
            };
            
        } catch (error) {
            console.error(`❌ Full sync failed: ${error.message}`);
            
            await this.updateCacheMetadata({
                lastError: {
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    syncType: 'full'
                }
            });
            
            throw error;
        }
    }

    /**
     * Delta cache synchronization - Only sync changed issues
     * 
     * @param {Object} options - Sync options
     * @returns {Promise<Object>} Sync result
     */
    async deltaSync(options = {}) {
        console.log('🔄 Starting delta cache synchronization...');
        
        try {
            const metadata = await this.getCacheMetadata();
            const issuesCache = await this.loadIssuesCache();
            
            if (!metadata.issuesLastSync) {
                console.log('📋 No previous sync found, performing full sync...');
                return await this.fullSync(options);
            }
            
            // Get issues updated since last sync
            const since = metadata.issuesLastSync;
            console.log(`📋 Fetching issues updated since ${since}...`);
            
            const updatedIssues = await this.getIssuesUpdatedSince(since);
            
            if (updatedIssues.length === 0) {
                console.log('✓ No updated issues found, cache is current');
                return {
                    success: true,
                    issuesCount: Object.keys(issuesCache).length,
                    updatedCount: 0,
                    syncType: 'delta'
                };
            }
            
            // Update cache with changed issues
            let updatedCount = 0;
            for (const issue of updatedIssues) {
                issuesCache[issue.number] = {
                    ...issue,
                    cached_at: new Date().toISOString()
                };
                updatedCount++;
            }
            
            // Check for new issues by comparing latest issue number
            const currentLatestIssueNumber = await this.getLatestIssueNumber();
            if (currentLatestIssueNumber > metadata.latestIssueNumber) {
                console.log(`📋 Found new issues: ${metadata.latestIssueNumber + 1} to ${currentLatestIssueNumber}`);
                
                // Fetch new issues
                for (let i = metadata.latestIssueNumber + 1; i <= currentLatestIssueNumber; i++) {
                    try {
                        const issue = await this.getIssue(i);
                        issuesCache[issue.number] = {
                            ...issue,
                            cached_at: new Date().toISOString()
                        };
                        updatedCount++;
                    } catch (error) {
                        // Issue might not exist (deleted or never created)
                        console.warn(`⚠️  Issue #${i} not found, skipping...`);
                    }
                }
            }
            
            // Update milestones if needed
            let milestonesCount = 0;
            if (!metadata.milestonesLastSync || !this.isCacheFresh(metadata.milestonesLastSync)) {
                console.log('🎯 Updating milestones cache...');
                const milestones = await this.listMilestones();
                await this.saveMilestonesCache(milestones);
                milestonesCount = milestones.length;
            }
            
            // Save updated cache
            await this.saveIssuesCache(issuesCache);
            
            // Update metadata
            await this.updateCacheMetadata({
                issuesLastSync: new Date().toISOString(),
                milestonesLastSync: milestonesCount > 0 ? new Date().toISOString() : metadata.milestonesLastSync,
                latestIssueNumber: currentLatestIssueNumber,
                totalIssues: Object.keys(issuesCache).length,
                syncCount: metadata.syncCount + 1,
                lastError: null
            });
            
            console.log(`✓ Delta sync completed: ${updatedCount} issues updated, ${milestonesCount} milestones updated`);
            
            return {
                success: true,
                issuesCount: Object.keys(issuesCache).length,
                updatedCount: updatedCount,
                milestonesCount: milestonesCount,
                syncType: 'delta'
            };
            
        } catch (error) {
            console.error(`❌ Delta sync failed: ${error.message}`);
            
            await this.updateCacheMetadata({
                lastError: {
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    syncType: 'delta'
                }
            });
            
            throw error;
        }
    }

    /**
     * Smart cache sync - Chooses best sync strategy
     * 
     * @param {Object} options - Sync options
     * @returns {Promise<Object>} Sync result
     */
    async smartSync(options = {}) {
        const metadata = await this.getCacheMetadata();
        
        // Force full sync if requested
        if (options.force) {
            return await this.fullSync(options);
        }
        
        // Use delta sync if cache exists and is not too old
        if (metadata.issuesLastSync && this.isCacheStale(metadata.issuesLastSync)) {
            console.log('📋 Cache is stale but usable, attempting delta sync...');
            try {
                return await this.deltaSync(options);
            } catch (error) {
                console.log('❌ Delta sync failed, falling back to full sync...');
                return await this.fullSync(options);
            }
        }
        
        // Use full sync for first time or very old cache
        if (!metadata.issuesLastSync || !this.isCacheStale(metadata.issuesLastSync)) {
            return await this.fullSync(options);
        }
        
        // Cache is fresh, no sync needed
        console.log('✓ Cache is fresh, no sync needed');
        return {
            success: true,
            issuesCount: metadata.totalIssues,
            updatedCount: 0,
            syncType: 'skip'
        };
    }

    /**
     * Get cached issues with fallback to API
     * 
     * @param {Object} options - Query options
     * @returns {Promise<Array>} Issues array
     */
    async getCachedIssues(options = {}) {
        const metadata = await this.getCacheMetadata();
        
        // Check if cache is available and not expired
        if (metadata.issuesLastSync && 
            (this.isCacheFresh(metadata.issuesLastSync) || this.isCacheStale(metadata.issuesLastSync))) {
            
            console.log('📋 Using cached issues...');
            const cache = await this.loadIssuesCache();
            let issues = Object.values(cache);
            
            // Apply filters
            if (options.state && options.state !== 'all') {
                issues = issues.filter(issue => issue.state === options.state.toUpperCase());
            }
            
            if (options.labels) {
                issues = issues.filter(issue => 
                    issue.labels.some(label => label.name === options.labels)
                );
            }
            
            if (options.milestone) {
                issues = issues.filter(issue => 
                    issue.milestone && issue.milestone.title === options.milestone
                );
            }
            
            // Sort by number descending (most recent first)
            issues.sort((a, b) => b.number - a.number);
            
            // Apply limit
            if (options.limit) {
                issues = issues.slice(0, parseInt(options.limit));
            }
            
            return issues;
        }
        
        // Cache is not available or expired, use API
        console.log('📋 Cache expired or unavailable, fetching from API...');
        return await this.listIssues(options);
    }

    /**
     * Get cached milestones with fallback to API
     * 
     * @returns {Promise<Array>} Milestones array
     */
    async getCachedMilestones() {
        const metadata = await this.getCacheMetadata();
        
        // Check if cache is available and not expired
        if (metadata.milestonesLastSync && 
            (this.isCacheFresh(metadata.milestonesLastSync) || this.isCacheStale(metadata.milestonesLastSync))) {
            
            console.log('🎯 Using cached milestones...');
            return await this.loadMilestonesCache();
        }
        
        // Cache is not available or expired, use API
        console.log('🎯 Cache expired or unavailable, fetching from API...');
        return await this.listMilestones();
    }

    /**
     * Clear cache - For troubleshooting
     * 
     * @returns {Promise<void>}
     */
    async clearCache() {
        try {
            await fs.unlink(this.issuesCache);
            console.log('🗑️  Issues cache cleared');
        } catch (error) {
            // File might not exist
        }
        
        try {
            await fs.unlink(this.milestonesCache);
            console.log('🗑️  Milestones cache cleared');
        } catch (error) {
            // File might not exist
        }
        
        try {
            await fs.unlink(this.cacheMetadata);
            console.log('🗑️  Cache metadata cleared');
        } catch (error) {
            // File might not exist
        }
    }

    /**
     * Get cache status
     * 
     * @returns {Promise<Object>} Cache status
     */
    async getCacheStatus() {
        const metadata = await this.getCacheMetadata();
        
        return {
            issuesCache: {
                exists: await fs.access(this.issuesCache).then(() => true).catch(() => false),
                lastSync: metadata.issuesLastSync,
                fresh: metadata.issuesLastSync ? this.isCacheFresh(metadata.issuesLastSync) : false,
                stale: metadata.issuesLastSync ? this.isCacheStale(metadata.issuesLastSync) : false,
                totalIssues: metadata.totalIssues
            },
            milestonesCache: {
                exists: await fs.access(this.milestonesCache).then(() => true).catch(() => false),
                lastSync: metadata.milestonesLastSync,
                fresh: metadata.milestonesLastSync ? this.isCacheFresh(metadata.milestonesLastSync) : false,
                stale: metadata.milestonesLastSync ? this.isCacheStale(metadata.milestonesLastSync) : false
            },
            metadata: metadata,
            rateLimit: this.getRateLimit()
        };
    }
}

/**
 * Create GitHub Cache client
 * 
 * @param {Object} options - Configuration options
 * @returns {GitHubCache} Cache client
 */
export function createGitHubCache(options = {}) {
    return new GitHubCache(options);
}

/**
 * CLI interface for cache operations
 */
export async function main(args) {
    try {
        const cache = createGitHubCache();
        const command = args[0];
        
        switch (command) {
            case 'sync':
                const forceSync = args.includes('--force');
                const fullSync = args.includes('--full');
                
                let result;
                if (fullSync) {
                    result = await cache.fullSync({ force: forceSync });
                } else {
                    result = await cache.smartSync({ force: forceSync });
                }
                
                console.log(JSON.stringify(result, null, 2));
                break;
                
            case 'status':
                const status = await cache.getCacheStatus();
                console.log(JSON.stringify(status, null, 2));
                break;
                
            case 'clear':
                await cache.clearCache();
                console.log('✓ Cache cleared');
                break;
                
            case 'issues':
                const issuesOptions = {};
                if (args.includes('--state')) issuesOptions.state = args[args.indexOf('--state') + 1];
                if (args.includes('--milestone')) issuesOptions.milestone = args[args.indexOf('--milestone') + 1];
                if (args.includes('--limit')) issuesOptions.limit = args[args.indexOf('--limit') + 1];
                
                const issues = await cache.getCachedIssues(issuesOptions);
                console.log(JSON.stringify(issues, null, 2));
                break;
                
            case 'milestones':
                const milestones = await cache.getCachedMilestones();
                console.log(JSON.stringify(milestones, null, 2));
                break;
                
            case 'test':
                const testResult = await cache.testConnection();
                if (testResult.success) {
                    console.log(`✓ Connected to GitHub as ${testResult.user}`);
                    const cacheStatus = await cache.getCacheStatus();
                    console.log(`Issues cache: ${cacheStatus.issuesCache.exists ? '✓' : '✗'} (${cacheStatus.issuesCache.totalIssues} issues)`);
                    console.log(`Milestones cache: ${cacheStatus.milestonesCache.exists ? '✓' : '✗'}`);
                    console.log(`Rate limit: ${testResult.rateLimit.remaining} requests remaining`);
                } else {
                    console.error(`✗ Connection failed: ${testResult.error}`);
                    process.exit(1);
                }
                break;
                
            default:
                console.log('GitHub Cache API - Available commands:');
                console.log('  sync [--force] [--full] - Synchronize cache with GitHub');
                console.log('  status - Show cache status');
                console.log('  clear - Clear all cache files');
                console.log('  issues [--state open|closed|all] [--milestone title] [--limit n] - Get cached issues');
                console.log('  milestones - Get cached milestones');
                console.log('  test - Test connection and cache status');
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