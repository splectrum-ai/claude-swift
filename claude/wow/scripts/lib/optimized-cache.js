#!/usr/bin/env node

/**
 * Optimized GitHub Cache with Lazy Loading
 * 
 * Replaces the existing GitHub cache with performance-optimized lazy loading patterns.
 * Implements incremental updates, smart synchronization, and memory-first caching.
 */

import { promises as fs } from 'fs';
import { createGitHubIssues } from './github-issues.js';
import { createLazyCacheManager } from './lazy-cache.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Optimized GitHub Cache
 */
export class OptimizedGitHubCache {
    constructor(options = {}) {
        this.github = createGitHubIssues();
        this.lazyCache = createLazyCacheManager({
            cacheTTL: options.cacheTTL || 10 * 60 * 1000 // 10 minutes
        });
        this.syncInProgress = false;
        this.lastFullSync = null;
        this.incrementalThreshold = options.incrementalThreshold || 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Smart sync - chooses between incremental and full sync
     */
    async smartSync() {
        if (this.syncInProgress) {
            console.log('⏳ Sync already in progress, skipping');
            return;
        }

        this.syncInProgress = true;
        
        try {
            const metadata = await this.getCacheMetadata();
            const timeSinceLastSync = Date.now() - new Date(metadata.issuesLastSync || 0).getTime();
            
            if (timeSinceLastSync < this.incrementalThreshold && metadata.issuesLastSync) {
                console.log('🔄 Running incremental sync...');
                await this.incrementalSync();
            } else {
                console.log('🔄 Running full sync...');
                await this.fullSync();
            }
            
            this.lastFullSync = Date.now();
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Incremental sync - only sync changed items
     */
    async incrementalSync() {
        try {
            const metadata = await this.getCacheMetadata();
            const since = metadata.issuesLastSync;
            
            if (!since) {
                console.log('No previous sync found, running full sync');
                await this.fullSync();
                return;
            }
            
            // Get issues updated since last sync
            const updatedIssues = await this.getUpdatedIssuesSince(since);
            
            if (updatedIssues.length === 0) {
                console.log('✓ No updates since last sync');
                return;
            }
            
            console.log(`📋 Found ${updatedIssues.length} updated issues`);
            
            // Update cache for changed issues
            const issuesCache = await this.loadIssuesCache();
            let updatedCount = 0;
            
            for (const issue of updatedIssues) {
                issuesCache[issue.number] = {
                    ...issue,
                    cached_at: new Date().toISOString()
                };
                
                // Update memory cache
                this.lazyCache.saveToMemory(`issue_${issue.number}`, issuesCache[issue.number]);
                updatedCount++;
            }
            
            // Save updated cache
            await this.saveIssuesCache(issuesCache);
            
            // Update metadata
            await this.updateCacheMetadata({
                issuesLastSync: new Date().toISOString(),
                syncCount: (metadata.syncCount || 0) + 1,
                lastUpdate: new Date().toISOString(),
                incrementalUpdate: true,
                updatedIssues: updatedCount
            });
            
            console.log(`✓ Incremental sync completed: ${updatedCount} issues updated`);
            
        } catch (error) {
            console.error('❌ Incremental sync failed:', error.message);
            // Fallback to full sync
            await this.fullSync();
        }
    }

    /**
     * Full sync - complete cache rebuild
     */
    async fullSync() {
        try {
            console.log('📋 Fetching all issues...');
            const allIssues = await this.github.listIssues({ state: 'all' });
            
            console.log('🎯 Fetching all milestones...');
            const allMilestones = await this.github.listMilestones();
            
            // Build issues cache
            const issuesCache = {};
            const now = new Date().toISOString();
            
            for (const issue of allIssues) {
                issuesCache[issue.number] = {
                    ...issue,
                    cached_at: now
                };
                
                // Update memory cache
                this.lazyCache.saveToMemory(`issue_${issue.number}`, issuesCache[issue.number]);
            }
            
            // Build milestones cache
            const milestonesCache = {};
            for (const milestone of allMilestones) {
                milestonesCache[milestone.number] = {
                    ...milestone,
                    cached_at: now
                };
            }
            
            // Save to disk
            await this.saveIssuesCache(issuesCache);
            await this.saveMilestonesCache(milestonesCache);
            
            // Update metadata
            await this.updateCacheMetadata({
                issuesLastSync: now,
                milestonesLastSync: now,
                latestIssueNumber: Math.max(...allIssues.map(i => i.number)),
                totalIssues: allIssues.length,
                syncCount: 1,
                lastUpdate: now,
                fullSync: true
            });
            
            console.log(`✓ Full sync completed: ${allIssues.length} issues, ${allMilestones.length} milestones`);
            
        } catch (error) {
            console.error('❌ Full sync failed:', error.message);
            throw error;
        }
    }

    /**
     * Get issues updated since timestamp
     */
    async getUpdatedIssuesSince(since) {
        try {
            // GitHub API doesn't directly support "updated since" so we'll use a workaround
            const allIssues = await this.github.listIssues({ state: 'all' });
            const sinceDate = new Date(since);
            
            return allIssues.filter(issue => {
                const updatedAt = new Date(issue.updatedAt);
                return updatedAt > sinceDate;
            });
        } catch (error) {
            console.error('Error fetching updated issues:', error.message);
            return [];
        }
    }

    /**
     * Lazy loading interface methods
     */
    async getIssue(issueNumber) {
        return await this.lazyCache.getIssue(issueNumber);
    }

    async getOpenIssues() {
        // Get all issues from cache and filter for open ones
        const issuesCache = await this.loadIssuesCache();
        const openIssues = Object.values(issuesCache).filter(issue => issue.state === 'OPEN');
        return openIssues;
    }

    async getIssues(issueNumbers) {
        return await this.lazyCache.getIssues(issueNumbers);
    }

    /**
     * Cache status with performance metrics
     */
    async getCacheStatus() {
        const metadata = await this.getCacheMetadata();
        const performance = this.lazyCache.getPerformanceMetrics();
        
        const now = new Date();
        const issuesAge = metadata.issuesLastSync ? 
            (now - new Date(metadata.issuesLastSync)) / 1000 : null;
        const milestonesAge = metadata.milestonesLastSync ? 
            (now - new Date(metadata.milestonesLastSync)) / 1000 : null;
        
        return {
            issuesCache: {
                exists: !!metadata.issuesLastSync,
                fresh: issuesAge ? issuesAge < 300 : false, // 5 minutes
                ageSeconds: issuesAge,
                totalIssues: metadata.totalIssues || 0,
                lastSync: metadata.issuesLastSync
            },
            milestonesCache: {
                exists: !!metadata.milestonesLastSync,
                fresh: milestonesAge ? milestonesAge < 300 : false,
                ageSeconds: milestonesAge,
                lastSync: metadata.milestonesLastSync
            },
            performance: {
                ...performance,
                syncInProgress: this.syncInProgress,
                lastFullSync: this.lastFullSync
            },
            metadata
        };
    }

    /**
     * Cache warming for common operations
     */
    async warmCache(strategy = 'session_start') {
        console.log(`🔥 Warming cache for ${strategy} operations`);
        
        switch (strategy) {
            case 'session_start':
                // Warm most common session start operations
                await this.lazyCache.warmCache('common');
                await this.lazyCache.warmCache('recent');
                break;
                
            case 'next_issue':
                // Warm for issue recommendation
                await this.lazyCache.warmCache('milestone');
                break;
                
            case 'commit':
                // Warm for commit operations
                await this.lazyCache.warmCache('recent');
                break;
                
            default:
                await this.lazyCache.warmCache(strategy);
        }
        
        console.log('✓ Cache warming completed');
    }

    /**
     * Cache file operations
     */
    async loadIssuesCache() {
        try {
            const content = await fs.readFile('claude/cache/issues.json', 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return {};
        }
    }

    async saveIssuesCache(cache) {
        await fs.mkdir('claude/cache', { recursive: true });
        await fs.writeFile('claude/cache/issues.json', JSON.stringify(cache, null, 2));
    }

    async loadMilestonesCache() {
        try {
            const content = await fs.readFile('claude/cache/milestones.json', 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return {};
        }
    }

    async saveMilestonesCache(cache) {
        await fs.mkdir('claude/cache', { recursive: true });
        await fs.writeFile('claude/cache/milestones.json', JSON.stringify(cache, null, 2));
    }

    async getCacheMetadata() {
        try {
            const content = await fs.readFile('claude/cache/metadata.json', 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return {
                issuesLastSync: null,
                milestonesLastSync: null,
                latestIssueNumber: 0,
                totalIssues: 0,
                syncCount: 0,
                lastError: null,
                lastUpdate: null
            };
        }
    }

    async updateCacheMetadata(updates) {
        const current = await this.getCacheMetadata();
        const updated = { ...current, ...updates };
        
        await fs.mkdir('claude/cache', { recursive: true });
        await fs.writeFile('claude/cache/metadata.json', JSON.stringify(updated, null, 2));
    }

    /**
     * Performance optimization features
     */
    async preloadForWorkflow(workflowName) {
        console.log(`📚 Preloading cache for ${workflowName} workflow`);
        
        switch (workflowName) {
            case 'NEXT_ISSUE':
                await this.preloadOpenIssues();
                break;
                
            case 'COMMIT':
                await this.preloadRecentIssues();
                break;
                
            case 'INBOX':
                await this.preloadMilestones();
                break;
                
            default:
                console.log(`No specific preload strategy for ${workflowName}`);
        }
    }

    async preloadOpenIssues() {
        try {
            const openIssues = await this.getOpenIssues();
            console.log(`✓ Preloaded ${openIssues.length} open issues`);
        } catch (error) {
            console.warn(`Preload failed: ${error.message}`);
        }
    }

    async preloadRecentIssues() {
        try {
            const openIssues = await this.getOpenIssues();
            const recentIssues = openIssues
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 10);
            
            await this.getIssues(recentIssues.map(i => i.number));
            console.log(`✓ Preloaded ${recentIssues.length} recent issues`);
        } catch (error) {
            console.warn(`Preload failed: ${error.message}`);
        }
    }

    async preloadMilestones() {
        try {
            const milestones = await this.loadMilestonesCache();
            console.log(`✓ Preloaded ${Object.keys(milestones).length} milestones`);
        } catch (error) {
            console.warn(`Preload failed: ${error.message}`);
        }
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        return this.lazyCache.getPerformanceMetrics();
    }

    printPerformanceReport() {
        this.lazyCache.printPerformanceReport();
    }

    /**
     * Manual cache management
     */
    async evictStaleEntries() {
        this.lazyCache.evictOldEntries();
    }

    async clearCache() {
        this.lazyCache.memoryCache.clear();
        console.log('✓ Memory cache cleared');
    }

    async rebuildCache() {
        await this.clearCache();
        await this.fullSync();
        console.log('✓ Cache rebuilt');
    }
}

/**
 * Create optimized cache instance
 */
export function createOptimizedCache(options = {}) {
    return new OptimizedGitHubCache(options);
}

/**
 * CLI interface for testing optimized cache
 */
export async function main(args) {
    const command = args[0];
    const param = args[1];
    
    if (!command) {
        console.log('Optimized GitHub Cache');
        console.log('Usage: node optimized-cache.js <command> [param]');
        console.log('');
        console.log('Commands:');
        console.log('  smart-sync              - Run smart synchronization');
        console.log('  incremental-sync        - Run incremental sync');
        console.log('  full-sync              - Run full synchronization');
        console.log('  status                 - Show cache status');
        console.log('  warm-cache [strategy]  - Warm cache with strategy');
        console.log('  test-performance       - Run performance test');
        console.log('  get-issue <number>     - Get specific issue');
        console.log('  get-open-issues        - Get all open issues');
        console.log('  preload <workflow>     - Preload for workflow');
        console.log('  clear-cache            - Clear memory cache');
        console.log('  rebuild-cache          - Rebuild entire cache');
        return;
    }
    
    const cache = createOptimizedCache();
    
    try {
        switch (command) {
            case 'smart-sync':
                await cache.smartSync();
                break;
                
            case 'incremental-sync':
                await cache.incrementalSync();
                break;
                
            case 'full-sync':
                await cache.fullSync();
                break;
                
            case 'status':
                const status = await cache.getCacheStatus();
                console.log('📊 Cache Status:');
                console.log(JSON.stringify(status, null, 2));
                break;
                
            case 'warm-cache':
                const strategy = param || 'session_start';
                await cache.warmCache(strategy);
                break;
                
            case 'test-performance':
                console.log('🚀 Running performance test...');
                const startTime = Date.now();
                
                // Test various operations
                await cache.smartSync();
                await cache.getOpenIssues();
                await cache.getIssue(52);
                await cache.getIssues([54, 55, 60]);
                await cache.warmCache('common');
                
                const endTime = Date.now();
                console.log(`✓ Performance test completed in ${endTime - startTime}ms`);
                cache.printPerformanceReport();
                break;
                
            case 'get-issue':
                if (!param) {
                    console.error('Please provide issue number');
                    return;
                }
                const issue = await cache.getIssue(parseInt(param));
                console.log(`✓ Issue #${issue.number}: ${issue.title}`);
                break;
                
            case 'get-open-issues':
                const openIssues = await cache.getOpenIssues();
                console.log(`✓ Found ${openIssues.length} open issues`);
                openIssues.forEach(issue => {
                    console.log(`  #${issue.number}: ${issue.title}`);
                });
                break;
                
            case 'preload':
                if (!param) {
                    console.error('Please provide workflow name');
                    return;
                }
                await cache.preloadForWorkflow(param);
                break;
                
            case 'clear-cache':
                await cache.clearCache();
                break;
                
            case 'rebuild-cache':
                await cache.rebuildCache();
                break;
                
            default:
                console.error(`Unknown command: ${command}`);
        }
    } catch (error) {
        console.error('✗ Cache operation failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2));
}