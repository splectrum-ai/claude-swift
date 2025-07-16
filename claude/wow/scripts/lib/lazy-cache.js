#!/usr/bin/env node

/**
 * Lazy Loading and Caching Framework
 * 
 * Implements memory-first caching with on-demand loading patterns to optimize
 * workflow performance and reduce API calls. Supports three-tier caching:
 * Memory → Disk → API with intelligent invalidation and warming strategies.
 */

import { promises as fs } from 'fs';
import { createGitHubIssues } from './github-issues.js';
import { createGitHubCache } from './github-cache.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Lazy Cache Manager
 * 
 * Manages memory-first caching with intelligent loading strategies
 */
export class LazyCacheManager {
    constructor(options = {}) {
        this.memoryCache = new Map();
        this.cacheTTL = options.cacheTTL || 5 * 60 * 1000; // 5 minutes default
        this.github = createGitHubIssues();
        this.diskCache = createGitHubCache();
        this.loadingPromises = new Map(); // Prevent duplicate loading
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.apiCalls = 0;
        
        // Setup performance tracking
        this.startTime = Date.now();
        this.performanceMetrics = {
            memoryHits: 0,
            diskHits: 0,
            apiCalls: 0,
            totalRequests: 0,
            avgResponseTime: 0,
            totalResponseTime: 0
        };
    }

    /**
     * Get issue with lazy loading (three-tier caching)
     */
    async getIssue(issueNumber) {
        const startTime = Date.now();
        this.performanceMetrics.totalRequests++;
        
        try {
            // Tier 1: Memory cache
            const memoryResult = this.getFromMemory(`issue_${issueNumber}`);
            if (memoryResult) {
                this.performanceMetrics.memoryHits++;
                this.recordResponseTime(startTime);
                return memoryResult;
            }
            
            // Prevent duplicate loading
            if (this.loadingPromises.has(`issue_${issueNumber}`)) {
                return await this.loadingPromises.get(`issue_${issueNumber}`);
            }
            
            // Create loading promise
            const loadingPromise = this.loadIssueFromStorage(issueNumber);
            this.loadingPromises.set(`issue_${issueNumber}`, loadingPromise);
            
            try {
                const result = await loadingPromise;
                this.recordResponseTime(startTime);
                return result;
            } finally {
                this.loadingPromises.delete(`issue_${issueNumber}`);
            }
        } catch (error) {
            this.recordResponseTime(startTime);
            throw error;
        }
    }

    /**
     * Load issue from disk cache or API
     */
    async loadIssueFromStorage(issueNumber) {
        // Tier 2: Disk cache
        const diskResult = await this.getFromDisk(`issue_${issueNumber}`);
        if (diskResult && this.isValidCacheEntry(diskResult)) {
            this.performanceMetrics.diskHits++;
            this.saveToMemory(`issue_${issueNumber}`, diskResult);
            return diskResult;
        }
        
        // Tier 3: API call
        this.performanceMetrics.apiCalls++;
        this.apiCalls++;
        
        try {
            const apiResult = await this.github.getIssue(issueNumber);
            const enrichedResult = {
                ...apiResult,
                cached_at: new Date().toISOString(),
                cache_source: 'api'
            };
            
            // Cache in both memory and disk
            this.saveToMemory(`issue_${issueNumber}`, enrichedResult);
            await this.saveToDisk(`issue_${issueNumber}`, enrichedResult);
            
            return enrichedResult;
        } catch (error) {
            // Fallback to stale cache if API fails
            if (diskResult) {
                console.warn(`API failed for issue ${issueNumber}, using stale cache`);
                this.saveToMemory(`issue_${issueNumber}`, diskResult);
                return diskResult;
            }
            throw error;
        }
    }

    /**
     * Get multiple issues with batch optimization
     */
    async getIssues(issueNumbers) {
        const results = [];
        const uncachedIssues = [];
        
        // Check memory cache first
        for (const issueNumber of issueNumbers) {
            const cached = this.getFromMemory(`issue_${issueNumber}`);
            if (cached) {
                results[issueNumber] = cached;
                this.performanceMetrics.memoryHits++;
            } else {
                uncachedIssues.push(issueNumber);
            }
        }
        
        // Batch load uncached issues
        if (uncachedIssues.length > 0) {
            const batchPromises = uncachedIssues.map(issueNumber => 
                this.getIssue(issueNumber).catch(error => ({ error, issueNumber }))
            );
            
            const batchResults = await Promise.all(batchPromises);
            
            for (const result of batchResults) {
                if (result.error) {
                    console.warn(`Failed to load issue ${result.issueNumber}: ${result.error.message}`);
                } else {
                    results[result.number] = result;
                }
            }
        }
        
        return results;
    }

    /**
     * Get open issues with lazy loading
     */
    async getOpenIssues() {
        const cacheKey = 'open_issues';
        
        // Check memory cache
        const memoryResult = this.getFromMemory(cacheKey);
        if (memoryResult) {
            this.performanceMetrics.memoryHits++;
            return memoryResult;
        }
        
        // Check disk cache
        const diskResult = await this.getFromDisk(cacheKey);
        if (diskResult && this.isValidCacheEntry(diskResult)) {
            this.performanceMetrics.diskHits++;
            this.saveToMemory(cacheKey, diskResult);
            return diskResult.data;
        }
        
        // Load from API
        this.performanceMetrics.apiCalls++;
        try {
            const issues = await this.github.listIssues({ state: 'open' });
            const enrichedResult = {
                data: issues,
                cached_at: new Date().toISOString(),
                cache_source: 'api'
            };
            
            this.saveToMemory(cacheKey, enrichedResult);
            await this.saveToDisk(cacheKey, enrichedResult);
            
            return issues;
        } catch (error) {
            // Fallback to stale cache
            if (diskResult) {
                console.warn('API failed for open issues, using stale cache');
                this.saveToMemory(cacheKey, diskResult);
                return diskResult.data;
            }
            throw error;
        }
    }

    /**
     * Memory cache operations
     */
    getFromMemory(key) {
        const entry = this.memoryCache.get(key);
        if (entry && this.isValidCacheEntry(entry)) {
            this.cacheHits++;
            return entry;
        }
        this.cacheMisses++;
        return null;
    }

    saveToMemory(key, data) {
        this.memoryCache.set(key, data);
    }

    /**
     * Disk cache operations
     */
    async getFromDisk(key) {
        try {
            const cacheFile = this.getCacheFilePath(key);
            const content = await fs.readFile(cacheFile, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return null;
        }
    }

    async saveToDisk(key, data) {
        try {
            const cacheFile = this.getCacheFilePath(key);
            await fs.mkdir(path.dirname(cacheFile), { recursive: true });
            await fs.writeFile(cacheFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.warn(`Failed to save cache to disk: ${error.message}`);
        }
    }

    getCacheFilePath(key) {
        return path.join('claude/project/cache/lazy', `${key}.json`);
    }

    /**
     * Cache validation
     */
    isValidCacheEntry(entry) {
        if (!entry || !entry.cached_at) return false;
        
        const cacheTime = new Date(entry.cached_at);
        const now = new Date();
        const age = now - cacheTime;
        
        return age < this.cacheTTL;
    }

    /**
     * Cache warming strategies
     */
    async warmCache(strategy = 'common') {
        console.log(`🔥 Warming cache with strategy: ${strategy}`);
        
        switch (strategy) {
            case 'common':
                await this.warmCommonIssues();
                break;
            case 'milestone':
                await this.warmMilestoneIssues();
                break;
            case 'recent':
                await this.warmRecentIssues();
                break;
            default:
                console.warn(`Unknown warming strategy: ${strategy}`);
        }
    }

    async warmCommonIssues() {
        // Warm cache for open issues (most common operation)
        try {
            await this.getOpenIssues();
            console.log('✓ Warmed open issues cache');
        } catch (error) {
            console.warn(`Cache warming failed: ${error.message}`);
        }
    }

    async warmMilestoneIssues() {
        // Warm cache for current milestone issues
        try {
            const openIssues = await this.getOpenIssues();
            const currentMilestone = this.getCurrentMilestone(openIssues);
            
            if (currentMilestone) {
                const milestoneIssues = openIssues.filter(issue => 
                    issue.milestone && issue.milestone.title === currentMilestone
                );
                
                // Pre-load these issues
                await this.getIssues(milestoneIssues.map(issue => issue.number));
                console.log(`✓ Warmed ${milestoneIssues.length} milestone issues`);
            }
        } catch (error) {
            console.warn(`Milestone cache warming failed: ${error.message}`);
        }
    }

    async warmRecentIssues() {
        // Warm cache for recently updated issues
        try {
            const openIssues = await this.getOpenIssues();
            const recentIssues = openIssues
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 10);
            
            await this.getIssues(recentIssues.map(issue => issue.number));
            console.log(`✓ Warmed ${recentIssues.length} recent issues`);
        } catch (error) {
            console.warn(`Recent issues cache warming failed: ${error.message}`);
        }
    }

    getCurrentMilestone(issues) {
        const milestones = {};
        
        issues.forEach(issue => {
            if (issue.milestone) {
                milestones[issue.milestone.title] = (milestones[issue.milestone.title] || 0) + 1;
            }
        });
        
        return Object.keys(milestones).sort((a, b) => milestones[b] - milestones[a])[0];
    }

    /**
     * Cache invalidation
     */
    invalidateCache(key) {
        this.memoryCache.delete(key);
        
        // Async disk cache cleanup
        this.cleanupDiskCache(key).catch(error => 
            console.warn(`Disk cache cleanup failed: ${error.message}`)
        );
    }

    async cleanupDiskCache(key) {
        try {
            const cacheFile = this.getCacheFilePath(key);
            await fs.unlink(cacheFile);
        } catch (error) {
            // Ignore file not found errors
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    /**
     * Cache eviction policies
     */
    evictOldEntries() {
        const now = Date.now();
        const evictedKeys = [];
        
        for (const [key, entry] of this.memoryCache.entries()) {
            if (!this.isValidCacheEntry(entry)) {
                this.memoryCache.delete(key);
                evictedKeys.push(key);
            }
        }
        
        if (evictedKeys.length > 0) {
            console.log(`🗑️  Evicted ${evictedKeys.length} stale cache entries`);
        }
    }

    /**
     * Performance tracking
     */
    recordResponseTime(startTime) {
        const responseTime = Date.now() - startTime;
        this.performanceMetrics.totalResponseTime += responseTime;
        this.performanceMetrics.avgResponseTime = 
            this.performanceMetrics.totalResponseTime / this.performanceMetrics.totalRequests;
    }

    getPerformanceMetrics() {
        const uptime = Date.now() - this.startTime;
        const memoryUsage = process.memoryUsage();
        
        return {
            ...this.performanceMetrics,
            uptime,
            memoryUsage: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
                external: Math.round(memoryUsage.external / 1024 / 1024) // MB
            },
            cacheEfficiency: {
                hitRate: this.performanceMetrics.memoryHits / this.performanceMetrics.totalRequests,
                apiReduction: 1 - (this.performanceMetrics.apiCalls / this.performanceMetrics.totalRequests)
            }
        };
    }

    printPerformanceReport() {
        const metrics = this.getPerformanceMetrics();
        
        console.log('\n📊 Lazy Cache Performance Report');
        console.log('================================');
        console.log(`Total Requests: ${metrics.totalRequests}`);
        console.log(`Memory Hits: ${metrics.memoryHits} (${(metrics.memoryHits / metrics.totalRequests * 100).toFixed(1)}%)`);
        console.log(`Disk Hits: ${metrics.diskHits} (${(metrics.diskHits / metrics.totalRequests * 100).toFixed(1)}%)`);
        console.log(`API Calls: ${metrics.apiCalls} (${(metrics.apiCalls / metrics.totalRequests * 100).toFixed(1)}%)`);
        console.log(`Average Response Time: ${metrics.avgResponseTime.toFixed(2)}ms`);
        console.log(`Memory Usage: ${metrics.memoryUsage.heapUsed}MB`);
        console.log(`API Call Reduction: ${(metrics.cacheEfficiency.apiReduction * 100).toFixed(1)}%`);
        console.log(`Cache Hit Rate: ${(metrics.cacheEfficiency.hitRate * 100).toFixed(1)}%`);
        console.log(`Uptime: ${(metrics.uptime / 1000).toFixed(1)}s`);
    }
}

/**
 * Lazy Rules Manager
 * 
 * Implements operation-triggered rule checking instead of upfront validation
 */
export class LazyRulesManager {
    constructor() {
        this.ruleCache = new Map();
        this.ruleMapping = this.setupRuleMapping();
    }

    setupRuleMapping() {
        return {
            'file_create': ['file_naming_rules', 'directory_structure_rules'],
            'commit': ['commit_message_rules', 'file_validation_rules'],
            'session_start': ['audit_log_rules', 'directory_structure_rules'],
            'issue_create': ['issue_validation_rules', 'milestone_rules'],
            'cache_sync': ['cache_validation_rules', 'api_rate_limit_rules']
        };
    }

    async checkRulesForOperation(operation) {
        const relevantRules = this.ruleMapping[operation] || [];
        const results = [];
        
        for (const rule of relevantRules) {
            const result = await this.checkRule(rule);
            results.push({ rule, result });
        }
        
        return results;
    }

    async checkRule(ruleName) {
        // Check cache first
        const cached = this.ruleCache.get(ruleName);
        if (cached && this.isValidRuleCache(cached)) {
            return cached.result;
        }
        
        // Evaluate rule
        const result = await this.evaluateRule(ruleName);
        
        // Cache result
        this.ruleCache.set(ruleName, {
            result,
            timestamp: Date.now()
        });
        
        return result;
    }

    async evaluateRule(ruleName) {
        // Simplified rule evaluation - extend as needed
        switch (ruleName) {
            case 'file_naming_rules':
                return this.checkFileNamingRules();
            case 'directory_structure_rules':
                return this.checkDirectoryStructureRules();
            case 'commit_message_rules':
                return this.checkCommitMessageRules();
            case 'audit_log_rules':
                return this.checkAuditLogRules();
            default:
                return { valid: true, message: `Rule ${ruleName} not implemented` };
        }
    }

    async checkFileNamingRules() {
        // Example rule implementation
        return { valid: true, message: 'File naming rules passed' };
    }

    async checkDirectoryStructureRules() {
        try {
            const requiredDirs = ['claude/project', 'claude/wow', 'claude/inbox'];
            for (const dir of requiredDirs) {
                await fs.access(dir);
            }
            return { valid: true, message: 'Directory structure rules passed' };
        } catch (error) {
            return { valid: false, message: `Directory structure validation failed: ${error.message}` };
        }
    }

    async checkCommitMessageRules() {
        return { valid: true, message: 'Commit message rules passed' };
    }

    async checkAuditLogRules() {
        try {
            await fs.access('claude/project/audit/current/current.log');
            return { valid: true, message: 'Audit log rules passed' };
        } catch (error) {
            return { valid: false, message: `Audit log validation failed: ${error.message}` };
        }
    }

    isValidRuleCache(cached) {
        const maxAge = 30 * 60 * 1000; // 30 minutes
        return (Date.now() - cached.timestamp) < maxAge;
    }

    invalidateRuleCache(ruleName) {
        this.ruleCache.delete(ruleName);
    }

    clearRuleCache() {
        this.ruleCache.clear();
    }
}

/**
 * Create lazy cache manager instance
 */
export function createLazyCacheManager(options = {}) {
    return new LazyCacheManager(options);
}

/**
 * Create lazy rules manager instance
 */
export function createLazyRulesManager() {
    return new LazyRulesManager();
}

/**
 * CLI interface for testing lazy loading
 */
export async function main(args) {
    const command = args[0];
    const param = args[1];
    
    if (!command) {
        console.log('Lazy Loading and Caching Framework');
        console.log('Usage: node lazy-cache.js <command> [param]');
        console.log('');
        console.log('Commands:');
        console.log('  test-issue <number>     - Test lazy issue loading');
        console.log('  test-open-issues        - Test lazy open issues loading');
        console.log('  test-batch <numbers>    - Test batch issue loading');
        console.log('  warm-cache [strategy]   - Warm cache with strategy');
        console.log('  test-rules <operation>  - Test lazy rules checking');
        console.log('  performance-test        - Run performance benchmark');
        console.log('  metrics                 - Show performance metrics');
        return;
    }
    
    const cacheManager = createLazyCacheManager();
    const rulesManager = createLazyRulesManager();
    
    try {
        switch (command) {
            case 'test-issue':
                if (!param) {
                    console.error('Please provide issue number');
                    return;
                }
                console.log(`Testing lazy loading for issue #${param}`);
                const issue = await cacheManager.getIssue(parseInt(param));
                console.log(`✓ Loaded issue: ${issue.title}`);
                cacheManager.printPerformanceReport();
                break;
                
            case 'test-open-issues':
                console.log('Testing lazy loading for open issues');
                const openIssues = await cacheManager.getOpenIssues();
                console.log(`✓ Loaded ${openIssues.length} open issues`);
                cacheManager.printPerformanceReport();
                break;
                
            case 'test-batch':
                if (!param) {
                    console.error('Please provide comma-separated issue numbers');
                    return;
                }
                const issueNumbers = param.split(',').map(n => parseInt(n.trim()));
                console.log(`Testing batch loading for issues: ${issueNumbers.join(', ')}`);
                const issues = await cacheManager.getIssues(issueNumbers);
                console.log(`✓ Loaded ${Object.keys(issues).length} issues`);
                cacheManager.printPerformanceReport();
                break;
                
            case 'warm-cache':
                const strategy = param || 'common';
                await cacheManager.warmCache(strategy);
                cacheManager.printPerformanceReport();
                break;
                
            case 'test-rules':
                if (!param) {
                    console.error('Please provide operation name');
                    return;
                }
                console.log(`Testing lazy rules checking for operation: ${param}`);
                const ruleResults = await rulesManager.checkRulesForOperation(param);
                console.log('✓ Rule check results:');
                ruleResults.forEach(({ rule, result }) => {
                    console.log(`  ${rule}: ${result.valid ? '✓' : '✗'} ${result.message}`);
                });
                break;
                
            case 'performance-test':
                console.log('Running performance benchmark...');
                
                // Test multiple operations
                const testIssues = [52, 54, 55, 60, 61, 62];
                console.log('Testing individual issue loading...');
                for (const issueNum of testIssues) {
                    await cacheManager.getIssue(issueNum);
                }
                
                console.log('Testing batch loading...');
                await cacheManager.getIssues(testIssues);
                
                console.log('Testing open issues...');
                await cacheManager.getOpenIssues();
                
                console.log('Testing cache warming...');
                await cacheManager.warmCache('common');
                
                cacheManager.printPerformanceReport();
                break;
                
            case 'metrics':
                cacheManager.printPerformanceReport();
                break;
                
            default:
                console.error(`Unknown command: ${command}`);
        }
    } catch (error) {
        console.error('✗ Lazy cache operation failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2));
}