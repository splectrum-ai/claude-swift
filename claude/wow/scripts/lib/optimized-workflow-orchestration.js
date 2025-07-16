#!/usr/bin/env node

/**
 * Optimized Workflow Orchestration with Lazy Loading
 * 
 * Enhanced workflow orchestration that uses lazy loading patterns to dramatically
 * improve performance. Replaces heavy upfront loading with on-demand patterns.
 */

import { createSinglePathExecutor } from './single-path-execution.js';
import { createGitHubIssues } from './github-issues.js';
import { createOptimizedCache } from './optimized-cache.js';
import { createLazyRulesManager } from './lazy-cache.js';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Optimized NEXT_ISSUE Workflow with Lazy Loading
 */
export class OptimizedNextIssueWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('NEXT_ISSUE', options);
        this.github = createGitHubIssues();
        this.cache = createOptimizedCache();
        this.rules = createLazyRulesManager();
        this.setupOperations();
    }

    setupOperations() {
        // Register optimized preconditions
        this.executor.registerPrecondition('next_issue_operation', this.validateNextIssuePreconditions.bind(this));
        this.executor.registerPostcondition('next_issue_operation', this.validateNextIssuePostconditions.bind(this));
        
        // Register optimized operations
        this.executor.registerOperation('recommend_next_issue', this.executeNextIssueRecommendation.bind(this));
        
        // Register lazy state normalizers
        this.executor.registerStateNormalizer('next_issue_state', this.normalizeNextIssueState.bind(this));
    }

    async validateNextIssuePreconditions(context) {
        try {
            // Lazy rule checking - only check relevant rules
            const ruleResults = await this.rules.checkRulesForOperation('next_issue');
            
            const failedRules = ruleResults.filter(({ result }) => !result.valid);
            if (failedRules.length > 0) {
                return {
                    valid: false,
                    message: `Rule validation failed: ${failedRules.map(r => r.rule).join(', ')}`,
                    details: { failedRules }
                };
            }
            
            // Check cache status - but don't force sync
            const cacheStatus = await this.cache.getCacheStatus();
            if (!cacheStatus.issuesCache.exists) {
                return {
                    valid: false,
                    message: 'Issue cache not initialized',
                    details: { reason: 'cache_not_initialized' }
                };
            }
            
            // Don't check for open issues upfront - let lazy loading handle it
            return {
                valid: true,
                message: 'Next issue preconditions satisfied',
                details: { cacheStatus: cacheStatus.issuesCache.fresh ? 'fresh' : 'stale' }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Next issue precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    async validateNextIssuePostconditions(context) {
        try {
            if (!context.recommendedIssue) {
                return {
                    valid: false,
                    message: 'No issue recommendation generated',
                    details: { reason: 'no_recommendation' }
                };
            }

            return {
                valid: true,
                message: 'Next issue postconditions satisfied',
                details: { 
                    recommendedIssue: context.recommendedIssue.number,
                    performance: context.performanceMetrics
                }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Next issue postcondition validation failed',
                details: { error: error.message }
            };
        }
    }

    async normalizeNextIssueState(context) {
        try {
            const startTime = Date.now();
            
            // Smart sync - only sync if needed
            if (!context.test) {
                await this.cache.smartSync();
            }
            
            // Preload for this workflow
            await this.cache.preloadForWorkflow('NEXT_ISSUE');
            
            // Set up scoring criteria
            context.scoringCriteria = {
                labelPriority: { 'high': 10, 'medium': 5, 'low': 2 },
                labelType: { 'bug': 8, 'enhancement': 5, 'documentation': 3 },
                milestoneWeight: 5,
                ageWeight: 0.1
            };
            
            context.normalizedNextIssueState = 'ready';
            context.normalizationTime = Date.now() - startTime;
            
        } catch (error) {
            throw new Error(`Next issue state normalization failed: ${error.message}`);
        }
    }

    async executeNextIssueRecommendation(context) {
        const { scoringCriteria } = context;
        const startTime = Date.now();
        
        try {
            // Lazy load open issues
            console.log('📋 Loading open issues...');
            const openIssues = await this.cache.getOpenIssues();
            
            if (!Array.isArray(openIssues) || openIssues.length === 0) {
                throw new Error('No open issues found for recommendation');
            }
            
            // Score issues using lazy loading
            const issueScores = [];
            for (const issue of openIssues) {
                const score = this.calculateIssueScore(issue, scoringCriteria);
                issueScores.push({
                    issue,
                    score,
                    breakdown: score.breakdown
                });
            }
            
            // Sort by score
            issueScores.sort((a, b) => b.score.total - a.score.total);
            
            const recommendedIssue = issueScores[0].issue;
            
            context.issueScores = issueScores;
            context.recommendedIssue = recommendedIssue;
            context.performanceMetrics = {
                executionTime: Date.now() - startTime,
                issuesEvaluated: openIssues.length,
                cachePerformance: this.cache.getPerformanceReport()
            };
            
            return {
                recommendedIssue: {
                    number: recommendedIssue.number,
                    title: recommendedIssue.title,
                    score: issueScores[0].score.total
                },
                totalScored: issueScores.length,
                scoringBreakdown: issueScores[0].breakdown,
                performanceMetrics: context.performanceMetrics,
                message: `Recommended issue #${recommendedIssue.number}: ${recommendedIssue.title}`
            };
            
        } catch (error) {
            throw new Error(`Next issue recommendation failed: ${error.message}`);
        }
    }

    calculateIssueScore(issue, criteria) {
        let total = 0;
        const breakdown = {};
        
        // Label scoring
        let labelScore = 0;
        if (issue.labels) {
            for (const label of issue.labels) {
                const labelName = label.name || label;
                if (criteria.labelPriority[labelName]) {
                    labelScore += criteria.labelPriority[labelName];
                }
                if (criteria.labelType[labelName]) {
                    labelScore += criteria.labelType[labelName];
                }
            }
        }
        breakdown.labels = labelScore;
        total += labelScore;
        
        // Milestone scoring
        let milestoneScore = 0;
        if (issue.milestone) {
            milestoneScore = criteria.milestoneWeight;
        }
        breakdown.milestone = milestoneScore;
        total += milestoneScore;
        
        // Age scoring
        let ageScore = 0;
        if (issue.createdAt) {
            const createdDate = new Date(issue.createdAt);
            const daysSinceCreation = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
            ageScore = Math.max(0, 30 - daysSinceCreation) * criteria.ageWeight;
        }
        breakdown.age = ageScore;
        total += ageScore;
        
        return {
            total: Math.round(total * 100) / 100,
            breakdown
        };
    }

    async executeNextIssue(context = {}) {
        const startTime = Date.now();
        
        try {
            const result = await this.executor.execute('recommend_next_issue', context);
            
            // Add overall performance metrics
            result.overallPerformance = {
                totalExecutionTime: Date.now() - startTime,
                normalizationTime: context.normalizationTime,
                executionTime: context.performanceMetrics?.executionTime
            };
            
            return result;
        } catch (error) {
            console.error(`Optimized NEXT_ISSUE execution failed: ${error.message}`);
            throw error;
        }
    }
}

/**
 * Optimized SESSION_START Workflow with Lazy Loading
 */
export class OptimizedSessionStartWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('SESSION_START', options);
        this.cache = createOptimizedCache();
        this.rules = createLazyRulesManager();
        this.setupOperations();
    }

    setupOperations() {
        this.executor.registerPrecondition('session_start_operation', this.validateSessionStartPreconditions.bind(this));
        this.executor.registerPostcondition('session_start_operation', this.validateSessionStartPostconditions.bind(this));
        this.executor.registerOperation('initialize_session', this.executeSessionInitialization.bind(this));
        this.executor.registerStateNormalizer('session_state', this.normalizeSessionState.bind(this));
    }

    async validateSessionStartPreconditions(context) {
        try {
            // Lazy rule checking - only check session-relevant rules
            const ruleResults = await this.rules.checkRulesForOperation('session_start');
            
            const failedRules = ruleResults.filter(({ result }) => !result.valid);
            if (failedRules.length > 0) {
                return {
                    valid: false,
                    message: `Session start rule validation failed: ${failedRules.map(r => r.rule).join(', ')}`,
                    details: { failedRules }
                };
            }
            
            return {
                valid: true,
                message: 'Session start preconditions satisfied',
                details: { rulesChecked: ruleResults.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Session start precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    async validateSessionStartPostconditions(context) {
        try {
            if (!context.sessionInitialized) {
                return {
                    valid: false,
                    message: 'Session not properly initialized',
                    details: { reason: 'session_not_initialized' }
                };
            }

            return {
                valid: true,
                message: 'Session start postconditions satisfied',
                details: { 
                    sessionState: 'ready',
                    performanceMetrics: context.performanceMetrics
                }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Session start postcondition validation failed',
                details: { error: error.message }
            };
        }
    }

    async normalizeSessionState(context) {
        try {
            const startTime = Date.now();
            
            // Skip heavy operations in test mode
            if (context.test) {
                context.normalizedSessionState = 'test';
                return;
            }
            
            // Lazy commit handling
            await this.commitIfNeeded();
            
            // Smart cache sync - only if needed
            await this.cache.smartSync();
            
            // Warm cache for session operations
            await this.cache.warmCache('session_start');
            
            // Ensure minimal directory structure
            await this.ensureMinimalDirectoryStructure();
            
            context.normalizedSessionState = 'ready';
            context.normalizationTime = Date.now() - startTime;
            
        } catch (error) {
            throw new Error(`Session state normalization failed: ${error.message}`);
        }
    }

    async executeSessionInitialization(context) {
        const startTime = Date.now();
        
        try {
            // Initialize audit logging (lazy)
            await this.initializeAuditLogging();
            
            // Check inbox/outbox without heavy processing
            await this.checkInboxOutboxStatus();
            
            context.sessionInitialized = true;
            context.performanceMetrics = {
                executionTime: Date.now() - startTime,
                cachePerformance: this.cache.getPerformanceReport()
            };
            
            return {
                sessionState: 'ready',
                timestamp: new Date().toISOString(),
                performanceMetrics: context.performanceMetrics,
                message: 'Session initialized successfully'
            };
            
        } catch (error) {
            throw new Error(`Session initialization failed: ${error.message}`);
        }
    }

    async commitIfNeeded() {
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim().length > 0) {
                console.log('⚡ Auto-committing uncommitted changes...');
                execSync('git add -A');
                execSync('git commit -m "Auto-commit for optimized session start"');
            }
        } catch (error) {
            console.warn(`Commit-if-needed failed: ${error.message}`);
        }
    }

    async ensureMinimalDirectoryStructure() {
        const requiredDirs = [
            'claude/inbox',
            'claude/outbox',
            'claude/cache',
            'claude/project/audit/current'
        ];
        
        for (const dir of requiredDirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                // Ignore errors - directory might already exist
            }
        }
    }

    async initializeAuditLogging() {
        const auditFile = 'claude/project/audit/current/current.log';
        
        try {
            await fs.access(auditFile);
        } catch (error) {
            await fs.writeFile(auditFile, '##APPEND_MARKER_UNIQUE##\n');
        }
    }

    async checkInboxOutboxStatus() {
        try {
            const [inboxFiles, outboxFiles] = await Promise.all([
                fs.readdir('claude/inbox').catch(() => []),
                fs.readdir('claude/outbox').catch(() => [])
            ]);
            
            const inboxTasks = inboxFiles.filter(f => f.endsWith('.md') && f !== 'README.md');
            const outboxTasks = outboxFiles.filter(f => f.endsWith('.md') && f !== 'README.md');
            
            if (inboxTasks.length > 0) {
                console.log(`📥 ${inboxTasks.length} inbox tasks available - run 'inbox sesame' to process`);
            }
            
            if (outboxTasks.length > 0) {
                console.log(`📤 ${outboxTasks.length} outbox tasks available - run 'to-inbox sesame' to process`);
            }
        } catch (error) {
            console.warn(`Inbox/outbox check failed: ${error.message}`);
        }
    }

    async executeSessionStart(context = {}) {
        const startTime = Date.now();
        
        try {
            const result = await this.executor.execute('initialize_session', context);
            
            result.overallPerformance = {
                totalExecutionTime: Date.now() - startTime,
                normalizationTime: context.normalizationTime,
                target: '<1000ms',
                achieved: Date.now() - startTime < 1000
            };
            
            return result;
        } catch (error) {
            console.error(`Optimized SESSION_START execution failed: ${error.message}`);
            throw error;
        }
    }
}

/**
 * Factory functions
 */
export function createOptimizedNextIssueOrchestrator(options = {}) {
    return new OptimizedNextIssueWorkflowOrchestrator(options);
}

export function createOptimizedSessionStartOrchestrator(options = {}) {
    return new OptimizedSessionStartWorkflowOrchestrator(options);
}

/**
 * CLI interface for testing optimized workflows
 */
export async function main(args) {
    const workflow = args[0];
    const operation = args[1];
    
    if (!workflow) {
        console.log('Optimized Workflow Orchestration Engine');
        console.log('Usage: node optimized-workflow-orchestration.js <workflow> <operation>');
        console.log('');
        console.log('Workflows:');
        console.log('  next-issue     - Optimized NEXT_ISSUE workflow');
        console.log('  session-start  - Optimized SESSION_START workflow');
        console.log('');
        console.log('Operations:');
        console.log('  test           - Test workflow execution');
        console.log('  execute        - Execute workflow');
        console.log('  benchmark      - Run performance benchmark');
        return;
    }
    
    try {
        switch (workflow) {
            case 'next-issue':
                const nextIssueOrchestrator = createOptimizedNextIssueOrchestrator();
                if (operation === 'test') {
                    console.log('🚀 Testing optimized NEXT_ISSUE workflow...');
                    const result = await nextIssueOrchestrator.executeNextIssue({ test: true });
                    console.log('✓ Optimized NEXT_ISSUE workflow test completed');
                    console.log(`⚡ Performance: ${result.overallPerformance.totalExecutionTime}ms`);
                    console.log(JSON.stringify(result, null, 2));
                } else if (operation === 'benchmark') {
                    console.log('📊 Running NEXT_ISSUE benchmark...');
                    const iterations = 3;
                    const times = [];
                    
                    for (let i = 0; i < iterations; i++) {
                        const start = Date.now();
                        await nextIssueOrchestrator.executeNextIssue();
                        const time = Date.now() - start;
                        times.push(time);
                        console.log(`  Iteration ${i + 1}: ${time}ms`);
                    }
                    
                    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
                    console.log(`📈 Average execution time: ${avgTime.toFixed(2)}ms`);
                    console.log(`🎯 Target (<1000ms): ${avgTime < 1000 ? '✓' : '✗'}`);
                } else {
                    console.log('🚀 Executing optimized NEXT_ISSUE workflow...');
                    const result = await nextIssueOrchestrator.executeNextIssue();
                    console.log('✓ Optimized NEXT_ISSUE workflow completed');
                    console.log(`⚡ Performance: ${result.overallPerformance.totalExecutionTime}ms`);
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            case 'session-start':
                const sessionStartOrchestrator = createOptimizedSessionStartOrchestrator();
                if (operation === 'test') {
                    console.log('🚀 Testing optimized SESSION_START workflow...');
                    const result = await sessionStartOrchestrator.executeSessionStart({ test: true });
                    console.log('✓ Optimized SESSION_START workflow test completed');
                    console.log(`⚡ Performance: ${result.overallPerformance.totalExecutionTime}ms`);
                    console.log(JSON.stringify(result, null, 2));
                } else if (operation === 'benchmark') {
                    console.log('📊 Running SESSION_START benchmark...');
                    const iterations = 3;
                    const times = [];
                    
                    for (let i = 0; i < iterations; i++) {
                        const start = Date.now();
                        await sessionStartOrchestrator.executeSessionStart();
                        const time = Date.now() - start;
                        times.push(time);
                        console.log(`  Iteration ${i + 1}: ${time}ms`);
                    }
                    
                    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
                    console.log(`📈 Average execution time: ${avgTime.toFixed(2)}ms`);
                    console.log(`🎯 Target (<1000ms): ${avgTime < 1000 ? '✓' : '✗'}`);
                } else {
                    console.log('🚀 Executing optimized SESSION_START workflow...');
                    const result = await sessionStartOrchestrator.executeSessionStart();
                    console.log('✓ Optimized SESSION_START workflow completed');
                    console.log(`⚡ Performance: ${result.overallPerformance.totalExecutionTime}ms`);
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            default:
                console.error(`Unknown workflow: ${workflow}`);
                process.exit(1);
        }
    } catch (error) {
        console.error('✗ Optimized workflow orchestration failed');
        console.error(`Error: ${error.message}`);
        if (error.details) {
            console.error(`Details: ${JSON.stringify(error.details, null, 2)}`);
        }
        process.exit(1);
    }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2));
}