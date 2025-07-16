#!/usr/bin/env node

/**
 * Workflow Orchestration Engine
 * 
 * Converts complex conditional workflows to single-path execution patterns.
 * Implements specific orchestration for SESSION_START, COMMIT, and INBOX workflows.
 */

import { createSinglePathExecutor, PreconditionValidators, PostconditionValidators, StateNormalizers } from './single-path-execution.js';
import { createGitHubIssues } from './github-issues.js';
import { createGitHubCache } from './github-cache.js';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

/**
 * COMMIT Workflow Orchestration
 * 
 * Converts complex conditional COMMIT workflow to single-path execution:
 * - Eliminates conditional issue closure paths
 * - Implements deterministic cache-first approach
 * - Adds consistent event emission points
 */
export class CommitWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('COMMIT', options);
        this.github = createGitHubIssues();
        this.setupOperations();
    }

    setupOperations() {
        // Register COMMIT-specific preconditions
        this.executor.registerPrecondition('commit_operation', this.validateCommitPreconditions.bind(this));
        
        // Register COMMIT-specific postconditions
        this.executor.registerPostcondition('commit_operation', this.validateCommitPostconditions.bind(this));
        
        // Register COMMIT operations
        this.executor.registerOperation('commit_with_issue_closure', this.executeCommitWithIssueClosure.bind(this));
        this.executor.registerOperation('commit_without_issues', this.executeCommitWithoutIssues.bind(this));
        
        // Register state normalizers
        this.executor.registerStateNormalizer('commit_state', this.normalizeCommitState.bind(this));
    }

    /**
     * Validate preconditions for COMMIT workflow
     */
    async validateCommitPreconditions(context) {
        try {
            // Check git repository state
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim().length === 0) {
                return {
                    valid: false,
                    message: 'No changes to commit',
                    details: { reason: 'clean_working_directory' }
                };
            }
            
            // Check for audit log entries (if required)
            if (context.requireAuditValidation) {
                const auditValid = await this.validateAuditEntries();
                if (!auditValid.valid) {
                    return auditValid;
                }
            }
            
            return {
                valid: true,
                message: 'Commit preconditions satisfied',
                details: { changedFiles: status.trim().split('\n').length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Commit precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate postconditions for COMMIT workflow
     */
    async validateCommitPostconditions(context) {
        try {
            // Verify commit was created
            const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' });
            
            if (!lastCommit.trim()) {
                return {
                    valid: false,
                    message: 'No commit found after commit operation',
                    details: { reason: 'missing_commit' }
                };
            }
            
            // Verify working directory is clean
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim().length > 0) {
                return {
                    valid: false,
                    message: 'Working directory not clean after commit',
                    details: { reason: 'uncommitted_changes' }
                };
            }
            
            // Verify issues were closed if expected
            if (context.expectedClosedIssues && context.expectedClosedIssues.length > 0) {
                const closureValid = await this.validateIssueClosures(context.expectedClosedIssues);
                if (!closureValid.valid) {
                    return closureValid;
                }
            }
            
            return {
                valid: true,
                message: 'Commit postconditions satisfied',
                details: { commit: lastCommit.trim() }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Commit postcondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Normalize state for COMMIT workflow
     */
    async normalizeCommitState(context) {
        try {
            // Ensure all changes are staged
            execSync('git add -A');
            
            // Detect issues that should be closed
            const detectedIssues = await this.detectResolvedIssues();
            context.resolvedIssues = detectedIssues;
            
            // Ensure cache is current for issue operations
            await this.ensureCacheIsCurrentForIssues(detectedIssues);
            
            // Generate commit message
            context.commitMessage = await this.generateCommitMessage(detectedIssues);
            
            context.normalizedCommitState = 'ready';
        } catch (error) {
            throw new Error(`Commit state normalization failed: ${error.message}`);
        }
    }

    /**
     * Execute commit with issue closure (single path)
     */
    async executeCommitWithIssueClosure(context) {
        const { commitMessage, resolvedIssues } = context;
        
        try {
            // Step 1: Create commit
            execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
            const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
            
            // Step 2: Push to remote
            execSync('git push origin main', { encoding: 'utf8' });
            
            // Step 3: Close issues (cache-first approach)
            const closedIssues = [];
            for (const issueNumber of resolvedIssues) {
                try {
                    await this.github.closeIssue(issueNumber, `Resolved in commit: ${commitHash}`);
                    closedIssues.push(issueNumber);
                } catch (error) {
                    console.warn(`Warning: Failed to close issue #${issueNumber}: ${error.message}`);
                }
            }
            
            context.expectedClosedIssues = closedIssues;
            
            return {
                commitHash,
                closedIssues,
                message: `Committed ${commitHash} and closed ${closedIssues.length} issues`
            };
        } catch (error) {
            throw new Error(`Commit with issue closure failed: ${error.message}`);
        }
    }

    /**
     * Execute commit without issues (single path)
     */
    async executeCommitWithoutIssues(context) {
        const { commitMessage } = context;
        
        try {
            // Step 1: Create commit
            execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
            const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
            
            // Step 2: Push to remote
            execSync('git push origin main', { encoding: 'utf8' });
            
            return {
                commitHash,
                closedIssues: [],
                message: `Committed ${commitHash} without issue closure`
            };
        } catch (error) {
            throw new Error(`Commit without issues failed: ${error.message}`);
        }
    }

    /**
     * Detect resolved issues from context
     */
    async detectResolvedIssues() {
        try {
            // Check recent audit log for issue references
            const auditLog = await fs.readFile('claude/project/audit/current/current.log', 'utf8');
            const recentEntries = auditLog.split('\n').slice(-20); // Last 20 entries
            
            const issueNumbers = [];
            const issuePattern = /#(\d+)/g;
            
            for (const entry of recentEntries) {
                let match;
                while ((match = issuePattern.exec(entry)) !== null) {
                    const issueNumber = parseInt(match[1]);
                    if (!issueNumbers.includes(issueNumber)) {
                        issueNumbers.push(issueNumber);
                    }
                }
            }
            
            // Also check git diff for issue references
            const diff = execSync('git diff --cached', { encoding: 'utf8' });
            let match;
            while ((match = issuePattern.exec(diff)) !== null) {
                const issueNumber = parseInt(match[1]);
                if (!issueNumbers.includes(issueNumber)) {
                    issueNumbers.push(issueNumber);
                }
            }
            
            return issueNumbers;
        } catch (error) {
            console.warn(`Warning: Issue detection failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Ensure cache is current for issue operations
     */
    async ensureCacheIsCurrentForIssues(issueNumbers) {
        if (issueNumbers.length === 0) return;
        
        try {
            const cache = createGitHubCache();
            
            // Check if cache is current for the specific issues
            const cacheStatus = await cache.getCacheStatus();
            
            if (!cacheStatus.issuesCache.fresh) {
                // Cache is stale, refresh it
                await cache.smartSync();
            }
            
            // Verify specific issues exist in cache
            const issuesCache = await cache.loadIssuesCache();
            for (const issueNumber of issueNumbers) {
                if (!issuesCache[issueNumber]) {
                    // Issue not in cache, refresh
                    await cache.smartSync();
                    break;
                }
            }
        } catch (error) {
            console.warn(`Warning: Cache validation failed: ${error.message}`);
        }
    }

    /**
     * Generate commit message based on changes and issues
     */
    async generateCommitMessage(resolvedIssues) {
        try {
            // Get file changes
            const stat = execSync('git diff --cached --stat', { encoding: 'utf8' });
            const files = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim().split('\n');
            
            // Generate summary based on changes
            let summary = 'Update project files';
            
            if (files.length === 1) {
                summary = `Update ${path.basename(files[0])}`;
            } else if (files.some(f => f.includes('claude/wow/scripts'))) {
                summary = 'Implement workflow optimization improvements';
            } else if (files.some(f => f.includes('claude/project'))) {
                summary = 'Update project configuration';
            } else if (files.some(f => f.includes('docs'))) {
                summary = 'Update documentation';
            }
            
            // Build detailed message
            const details = [];
            
            if (stat.includes('insertion')) {
                const insertions = stat.match(/(\d+) insertion/);
                if (insertions) {
                    details.push(`Added ${insertions[1]} lines`);
                }
            }
            
            if (stat.includes('deletion')) {
                const deletions = stat.match(/(\d+) deletion/);
                if (deletions) {
                    details.push(`Removed ${deletions[1]} lines`);
                }
            }
            
            details.push(`Modified ${files.length} files`);
            
            // Build full message
            let message = summary;
            
            if (details.length > 0) {
                message += '\n\n- ' + details.join('\n- ');
            }
            
            if (resolvedIssues.length > 0) {
                const issueRefs = resolvedIssues.map(n => `#${n}`).join(', ');
                message += `\n\nCloses ${issueRefs}`;
            }
            
            message += '\n\n🤖 Generated with [Claude Code](https://claude.ai/code)\n\nCo-Authored-By: Claude <noreply@anthropic.com>';
            
            return message;
        } catch (error) {
            return `Auto-commit: ${new Date().toISOString()}\n\n🤖 Generated with [Claude Code](https://claude.ai/code)\n\nCo-Authored-By: Claude <noreply@anthropic.com>`;
        }
    }

    /**
     * Validate audit entries exist for recent work
     */
    async validateAuditEntries() {
        try {
            const auditLog = await fs.readFile('claude/project/audit/current/current.log', 'utf8');
            const entries = auditLog.split('\n');
            
            if (entries.length < 2) {
                return {
                    valid: false,
                    message: 'No recent audit entries found',
                    details: { reason: 'empty_audit_log' }
                };
            }
            
            // Check for recent entries (within last hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentEntries = entries.filter(entry => {
                const match = entry.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                if (!match) return false;
                
                const entryTime = new Date(match[1]);
                return entryTime > oneHourAgo;
            });
            
            if (recentEntries.length === 0) {
                return {
                    valid: false,
                    message: 'No recent audit entries found',
                    details: { reason: 'no_recent_entries' }
                };
            }
            
            return {
                valid: true,
                message: 'Audit entries validation passed',
                details: { recentEntries: recentEntries.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Audit validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate that issues were properly closed
     */
    async validateIssueClosures(expectedClosedIssues) {
        try {
            const cache = createGitHubCache();
            const issuesCache = await cache.loadIssuesCache();
            
            for (const issueNumber of expectedClosedIssues) {
                const issue = issuesCache[issueNumber];
                
                if (!issue) {
                    return {
                        valid: false,
                        message: `Issue #${issueNumber} not found in cache`,
                        details: { issueNumber }
                    };
                }
                
                if (issue.state !== 'CLOSED') {
                    return {
                        valid: false,
                        message: `Issue #${issueNumber} was not closed`,
                        details: { issueNumber, state: issue.state }
                    };
                }
            }
            
            return {
                valid: true,
                message: 'All expected issues were closed',
                details: { closedIssues: expectedClosedIssues }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Issue closure validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Execute COMMIT workflow with single-path pattern
     */
    async executeCommit(context = {}) {
        // Determine operation based on context
        const operation = context.resolvedIssues && context.resolvedIssues.length > 0 
            ? 'commit_with_issue_closure' 
            : 'commit_without_issues';
        
        return await this.executor.execute(operation, context);
    }
}

/**
 * SESSION_START Workflow Orchestration
 * 
 * Converts complex SESSION_START workflow to single-path execution:
 * - Replaces complex uncommitted work handling with deterministic approach
 * - Implements single path for session initialization
 * - Adds clear state validation checkpoints
 */
export class SessionStartWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('SESSION_START', options);
        this.setupOperations();
    }

    setupOperations() {
        // Register SESSION_START-specific preconditions
        this.executor.registerPrecondition('session_start_operation', this.validateSessionStartPreconditions.bind(this));
        
        // Register SESSION_START-specific postconditions  
        this.executor.registerPostcondition('session_start_operation', this.validateSessionStartPostconditions.bind(this));
        
        // Register SESSION_START operations
        this.executor.registerOperation('initialize_session', this.executeSessionInitialization.bind(this));
        
        // Register state normalizers
        this.executor.registerStateNormalizer('session_state', this.normalizeSessionState.bind(this));
    }

    /**
     * Validate preconditions for SESSION_START workflow
     */
    async validateSessionStartPreconditions(context) {
        try {
            // Check Claude directory structure
            const requiredDirs = ['claude', 'claude/project', 'claude/wow'];
            for (const dir of requiredDirs) {
                await fs.access(dir);
            }
            
            // Check git repository exists
            execSync('git rev-parse --git-dir', { stdio: 'pipe' });
            
            return {
                valid: true,
                message: 'Session start preconditions satisfied',
                details: { checkedDirs: requiredDirs }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Session start precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate postconditions for SESSION_START workflow
     */
    async validateSessionStartPostconditions(context) {
        try {
            // Verify session is ready
            if (!context.sessionInitialized) {
                return {
                    valid: false,
                    message: 'Session not properly initialized',
                    details: { reason: 'session_not_initialized' }
                };
            }
            
            // Verify git state is clean
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim().length > 0) {
                return {
                    valid: false,
                    message: 'Git state not clean after session start',
                    details: { reason: 'uncommitted_changes' }
                };
            }
            
            return {
                valid: true,
                message: 'Session start postconditions satisfied',
                details: { sessionState: 'ready' }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Session start postcondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Normalize state for SESSION_START workflow
     */
    async normalizeSessionState(context) {
        try {
            // Step 1: Handle uncommitted work (deterministic)
            await this.commitIfNeeded();
            
            // Step 2: Ensure cache is current
            await this.ensureCacheReady();
            
            // Step 3: Ensure directory structure
            await this.ensureDirectoryStructure();
            
            context.normalizedSessionState = 'ready';
        } catch (error) {
            throw new Error(`Session state normalization failed: ${error.message}`);
        }
    }

    /**
     * Execute session initialization (single path)
     */
    async executeSessionInitialization(context) {
        try {
            // Step 1: Initialize audit logging
            await this.initializeAuditLogging();
            
            // Step 2: Process inbox/outbox if needed
            await this.processInboxOutbox();
            
            // Step 3: Mark session as ready
            context.sessionInitialized = true;
            
            return {
                sessionState: 'ready',
                timestamp: new Date().toISOString(),
                message: 'Session initialized successfully'
            };
        } catch (error) {
            throw new Error(`Session initialization failed: ${error.message}`);
        }
    }

    /**
     * Deterministic commit-if-needed logic
     */
    async commitIfNeeded() {
        try {
            const workState = await this.getWorkState();
            
            switch (workState) {
                case 'clean':
                    // No action needed
                    break;
                    
                case 'staged':
                    execSync('git commit -m "Auto-commit staged changes for session start"');
                    break;
                    
                case 'modified':
                    execSync('git add -A');
                    execSync('git commit -m "Auto-commit modified files for session start"');
                    break;
                    
                case 'untracked':
                    execSync('git add -A');
                    execSync('git commit -m "Auto-commit new files for session start"');
                    break;
                    
                default:
                    throw new Error(`Unknown work state: ${workState}`);
            }
        } catch (error) {
            throw new Error(`Commit-if-needed failed: ${error.message}`);
        }
    }

    /**
     * Get deterministic work state
     */
    async getWorkState() {
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            if (status.trim().length === 0) {
                return 'clean';
            }
            
            const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
            const modified = execSync('git diff --name-only', { encoding: 'utf8' });
            
            if (staged.trim().length > 0) {
                return 'staged';
            }
            
            if (modified.trim().length > 0) {
                return 'modified';
            }
            
            return 'untracked';
        } catch (error) {
            throw new Error(`Work state detection failed: ${error.message}`);
        }
    }

    /**
     * Ensure cache is ready for session
     */
    async ensureCacheReady() {
        try {
            const cache = createGitHubCache();
            const status = await cache.getCacheStatus();
            
            if (!status.issuesCache.fresh) {
                await cache.smartSync();
            }
        } catch (error) {
            console.warn(`Warning: Cache preparation failed: ${error.message}`);
        }
    }

    /**
     * Ensure directory structure exists
     */
    async ensureDirectoryStructure() {
        const requiredDirs = [
            'claude/inbox',
            'claude/outbox',
            'claude/project/cache',
            'claude/project/audit/current',
            'claude/local'
        ];
        
        for (const dir of requiredDirs) {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    /**
     * Initialize audit logging
     */
    async initializeAuditLogging() {
        try {
            // Check if audit log exists
            const auditFile = 'claude/project/audit/current/current.log';
            
            try {
                await fs.access(auditFile);
            } catch (error) {
                // Create audit log if it doesn't exist
                await fs.writeFile(auditFile, '##APPEND_MARKER_UNIQUE##\n');
            }
        } catch (error) {
            throw new Error(`Audit logging initialization failed: ${error.message}`);
        }
    }

    /**
     * Process inbox/outbox if needed
     */
    async processInboxOutbox() {
        try {
            // Check for pending inbox tasks
            const inboxTasks = await this.findInboxTasks();
            
            if (inboxTasks.length > 0) {
                console.log(`Found ${inboxTasks.length} inbox tasks - consider running 'inbox sesame'`);
            }
            
            // Check for pending outbox tasks  
            const outboxTasks = await this.findOutboxTasks();
            
            if (outboxTasks.length > 0) {
                console.log(`Found ${outboxTasks.length} outbox tasks - consider running 'to-inbox sesame'`);
            }
        } catch (error) {
            console.warn(`Warning: Inbox/outbox processing failed: ${error.message}`);
        }
    }

    /**
     * Find inbox tasks
     */
    async findInboxTasks() {
        try {
            const inboxDir = 'claude/inbox';
            const files = await fs.readdir(inboxDir);
            return files.filter(f => f.endsWith('.md') && f !== 'README.md');
        } catch (error) {
            return [];
        }
    }

    /**
     * Find outbox tasks
     */
    async findOutboxTasks() {
        try {
            const outboxDir = 'claude/outbox';
            const files = await fs.readdir(outboxDir);
            return files.filter(f => f.endsWith('.md') && f !== 'README.md');
        } catch (error) {
            return [];
        }
    }

    /**
     * Execute SESSION_START workflow with single-path pattern
     */
    async executeSessionStart(context = {}) {
        return await this.executor.execute('initialize_session', context);
    }
}

/**
 * Create workflow orchestrators with common configurations
 */
export function createCommitOrchestrator(options = {}) {
    return new CommitWorkflowOrchestrator(options);
}

export function createSessionStartOrchestrator(options = {}) {
    return new SessionStartWorkflowOrchestrator(options);
}

/**
 * INBOX Workflow Orchestration
 * 
 * Converts complex INBOX workflow to single-path execution:
 * - Processes inbox tasks deterministically
 * - Converts tasks to GitHub issues with consistent milestone assignment
 * - Maintains event-driven architecture for automation
 */
export class InboxWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('INBOX', options);
        this.github = createGitHubIssues();
        this.cache = createGitHubCache();
        this.setupOperations();
    }

    setupOperations() {
        // Register INBOX-specific preconditions
        this.executor.registerPrecondition('inbox_operation', this.validateInboxPreconditions.bind(this));
        
        // Register INBOX-specific postconditions
        this.executor.registerPostcondition('inbox_operation', this.validateInboxPostconditions.bind(this));
        
        // Register INBOX operations
        this.executor.registerOperation('process_inbox_tasks', this.executeInboxProcessing.bind(this));
        
        // Register state normalizers
        this.executor.registerStateNormalizer('inbox_state', this.normalizeInboxState.bind(this));
    }

    /**
     * Validate preconditions for INBOX workflow
     */
    async validateInboxPreconditions(context) {
        try {
            // Check inbox directory exists
            await fs.access('claude/inbox');
            
            // Check cache is current
            const cacheStatus = await this.cache.getCacheStatus();
            if (!cacheStatus.issuesCache.fresh) {
                return {
                    valid: false,
                    message: 'Issue cache is stale - refresh required',
                    details: { reason: 'stale_cache' }
                };
            }
            
            // Check for inbox tasks
            const inboxTasks = await this.findInboxTasks();
            if (inboxTasks.length === 0) {
                return {
                    valid: false,
                    message: 'No inbox tasks found to process',
                    details: { reason: 'no_inbox_tasks' }
                };
            }
            
            return {
                valid: true,
                message: 'Inbox preconditions satisfied',
                details: { taskCount: inboxTasks.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Inbox precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate postconditions for INBOX workflow
     */
    async validateInboxPostconditions(context) {
        try {
            // Verify inbox tasks were processed
            const remainingTasks = await this.findInboxTasks();
            
            if (remainingTasks.length > 0) {
                return {
                    valid: false,
                    message: 'Inbox tasks still remain after processing',
                    details: { remainingTasks: remainingTasks.length }
                };
            }
            
            // Verify GitHub issues were created
            if (!context.createdIssues || context.createdIssues.length === 0) {
                return {
                    valid: false,
                    message: 'No GitHub issues created from inbox tasks',
                    details: { reason: 'no_issues_created' }
                };
            }
            
            return {
                valid: true,
                message: 'Inbox postconditions satisfied',
                details: { createdIssues: context.createdIssues.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Inbox postcondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Normalize state for INBOX workflow
     */
    async normalizeInboxState(context) {
        try {
            // Ensure cache is current
            await this.cache.smartSync();
            
            // Load inbox tasks
            const inboxTasks = await this.findInboxTasks();
            context.inboxTasks = inboxTasks;
            
            // Get current milestones for assignment
            const milestonesCache = await this.cache.loadMilestonesCache();
            context.availableMilestones = Object.values(milestonesCache);
            
            // Determine target milestone (current milestone logic)
            context.targetMilestone = await this.determineTargetMilestone(context.availableMilestones);
            
            context.normalizedInboxState = 'ready';
        } catch (error) {
            throw new Error(`Inbox state normalization failed: ${error.message}`);
        }
    }

    /**
     * Execute inbox processing (single path)
     */
    async executeInboxProcessing(context) {
        const { inboxTasks, targetMilestone } = context;
        const createdIssues = [];
        
        try {
            // Process each inbox task deterministically
            for (const task of inboxTasks) {
                const taskContent = await this.loadTaskContent(task);
                const issueData = this.parseInboxTask(taskContent);
                
                // Create GitHub issue
                const newIssue = await this.github.createIssue({
                    title: issueData.title,
                    body: issueData.body,
                    labels: issueData.labels,
                    milestone: targetMilestone ? targetMilestone.number : null
                });
                
                createdIssues.push({
                    number: newIssue.number,
                    title: newIssue.title,
                    taskFile: task
                });
                
                // Remove processed task file
                await fs.unlink(path.join('claude/inbox', task));
            }
            
            // Update cache with new issues
            await this.cache.smartSync();
            
            context.createdIssues = createdIssues;
            
            return {
                processedTasks: inboxTasks.length,
                createdIssues: createdIssues.length,
                targetMilestone: targetMilestone ? targetMilestone.title : null,
                message: `Processed ${inboxTasks.length} inbox tasks into ${createdIssues.length} GitHub issues`
            };
        } catch (error) {
            throw new Error(`Inbox processing failed: ${error.message}`);
        }
    }

    /**
     * Find inbox tasks
     */
    async findInboxTasks() {
        try {
            const inboxDir = 'claude/inbox';
            const files = await fs.readdir(inboxDir);
            return files.filter(f => f.endsWith('.md') && f !== 'README.md');
        } catch (error) {
            return [];
        }
    }

    /**
     * Load task content
     */
    async loadTaskContent(taskFile) {
        const taskPath = path.join('claude/inbox', taskFile);
        return await fs.readFile(taskPath, 'utf8');
    }

    /**
     * Parse inbox task markdown
     */
    parseInboxTask(content) {
        const lines = content.split('\n');
        let title = '';
        let body = '';
        let labels = [];
        
        // Extract title (first # heading)
        const titleMatch = lines.find(line => line.startsWith('# '));
        if (titleMatch) {
            title = titleMatch.substring(2).trim();
        }
        
        // Extract labels from metadata
        const labelsMatch = lines.find(line => line.startsWith('Labels: '));
        if (labelsMatch) {
            labels = labelsMatch.substring(8).split(',').map(l => l.trim());
        }
        
        // Extract body (everything after first line)
        body = lines.slice(1).join('\n').trim();
        
        return { title, body, labels };
    }

    /**
     * Determine target milestone
     */
    async determineTargetMilestone(milestones) {
        // Find current milestone (simplified logic)
        const currentMilestone = milestones.find(m => 
            m.title.includes('current') || m.state === 'open'
        );
        
        return currentMilestone || milestones[0] || null;
    }

    /**
     * Execute INBOX workflow with single-path pattern
     */
    async executeInbox(context = {}) {
        return await this.executor.execute('process_inbox_tasks', context);
    }
}

export function createInboxOrchestrator(options = {}) {
    return new InboxWorkflowOrchestrator(options);
}

/**
 * NEXT_ISSUE Workflow Orchestration
 * 
 * Converts complex NEXT_ISSUE workflow to single-path execution:
 * - Deterministic issue selection based on priority scoring
 * - Eliminates multiple conditional paths for issue recommendation
 * - Implements consistent scoring algorithm for automated decision making
 */
export class NextIssueWorkflowOrchestrator {
    constructor(options = {}) {
        this.executor = createSinglePathExecutor('NEXT_ISSUE', options);
        this.github = createGitHubIssues();
        this.cache = createGitHubCache();
        this.setupOperations();
    }

    setupOperations() {
        // Register NEXT_ISSUE-specific preconditions
        this.executor.registerPrecondition('next_issue_operation', this.validateNextIssuePreconditions.bind(this));
        
        // Register NEXT_ISSUE-specific postconditions
        this.executor.registerPostcondition('next_issue_operation', this.validateNextIssuePostconditions.bind(this));
        
        // Register NEXT_ISSUE operations
        this.executor.registerOperation('recommend_next_issue', this.executeNextIssueRecommendation.bind(this));
        
        // Register state normalizers
        this.executor.registerStateNormalizer('next_issue_state', this.normalizeNextIssueState.bind(this));
    }

    /**
     * Validate preconditions for NEXT_ISSUE workflow
     */
    async validateNextIssuePreconditions(context) {
        try {
            // Check cache is current
            const cacheStatus = await this.cache.getCacheStatus();
            if (!cacheStatus.issuesCache.fresh) {
                return {
                    valid: false,
                    message: 'Issue cache is stale - refresh required',
                    details: { reason: 'stale_cache' }
                };
            }
            
            // Check for open issues
            const issuesCache = await this.cache.loadIssuesCache();
            const openIssues = Object.values(issuesCache).filter(issue => issue.state === 'OPEN');
            
            if (openIssues.length === 0) {
                return {
                    valid: false,
                    message: 'No open issues found for recommendation',
                    details: { reason: 'no_open_issues' }
                };
            }
            
            return {
                valid: true,
                message: 'Next issue preconditions satisfied',
                details: { openIssues: openIssues.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Next issue precondition validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate postconditions for NEXT_ISSUE workflow
     */
    async validateNextIssuePostconditions(context) {
        try {
            // Verify recommendation was made
            if (!context.recommendedIssue) {
                return {
                    valid: false,
                    message: 'No issue recommendation generated',
                    details: { reason: 'no_recommendation' }
                };
            }
            
            // Verify scoring was applied
            if (!context.issueScores || context.issueScores.length === 0) {
                return {
                    valid: false,
                    message: 'No issue scoring data available',
                    details: { reason: 'no_scoring_data' }
                };
            }
            
            return {
                valid: true,
                message: 'Next issue postconditions satisfied',
                details: { 
                    recommendedIssue: context.recommendedIssue.number,
                    scoredIssues: context.issueScores.length
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

    /**
     * Normalize state for NEXT_ISSUE workflow
     */
    async normalizeNextIssueState(context) {
        try {
            // Ensure cache is current
            await this.cache.smartSync();
            
            // Load open issues
            const issuesCache = await this.cache.loadIssuesCache();
            const openIssues = Object.values(issuesCache).filter(issue => issue.state === 'OPEN');
            context.openIssues = openIssues;
            
            // Load milestones for priority context
            const milestonesCache = await this.cache.loadMilestonesCache();
            context.milestones = Object.values(milestonesCache);
            
            // Initialize scoring context
            context.scoringCriteria = {
                labelPriority: { 'high': 10, 'medium': 5, 'low': 2 },
                labelType: { 'bug': 8, 'enhancement': 5, 'documentation': 3 },
                milestoneWeight: 5,
                ageWeight: 0.1 // Per day
            };
            
            context.normalizedNextIssueState = 'ready';
        } catch (error) {
            throw new Error(`Next issue state normalization failed: ${error.message}`);
        }
    }

    /**
     * Execute next issue recommendation (single path)
     */
    async executeNextIssueRecommendation(context) {
        const { openIssues, scoringCriteria, milestones } = context;
        
        try {
            // Score all open issues deterministically
            const issueScores = openIssues.map(issue => {
                const score = this.calculateIssueScore(issue, scoringCriteria, milestones);
                return {
                    issue,
                    score,
                    breakdown: score.breakdown
                };
            });
            
            // Sort by score (deterministic)
            issueScores.sort((a, b) => b.score.total - a.score.total);
            
            // Select top issue
            const recommendedIssue = issueScores[0].issue;
            
            context.issueScores = issueScores;
            context.recommendedIssue = recommendedIssue;
            
            return {
                recommendedIssue: {
                    number: recommendedIssue.number,
                    title: recommendedIssue.title,
                    score: issueScores[0].score.total
                },
                totalScored: issueScores.length,
                scoringBreakdown: issueScores[0].breakdown,
                message: `Recommended issue #${recommendedIssue.number}: ${recommendedIssue.title}`
            };
        } catch (error) {
            throw new Error(`Next issue recommendation failed: ${error.message}`);
        }
    }

    /**
     * Calculate deterministic issue score
     */
    calculateIssueScore(issue, criteria, milestones) {
        let total = 0;
        const breakdown = {};
        
        // Label priority scoring
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
        
        // Age scoring (newer issues get slight priority)
        let ageScore = 0;
        if (issue.created_at) {
            const createdDate = new Date(issue.created_at);
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

    /**
     * Execute NEXT_ISSUE workflow with single-path pattern
     */
    async executeNextIssue(context = {}) {
        return await this.executor.execute('recommend_next_issue', context);
    }
}

export function createNextIssueOrchestrator(options = {}) {
    return new NextIssueWorkflowOrchestrator(options);
}

/**
 * CLI interface for testing workflow orchestration
 */
export async function main(args) {
    const workflow = args[0];
    const operation = args[1];
    
    if (!workflow) {
        console.log('Workflow Orchestration Engine');
        console.log('Usage: node workflow-orchestration.js <workflow> <operation>');
        console.log('');
        console.log('Workflows:');
        console.log('  commit - COMMIT workflow orchestration');
        console.log('  session-start - SESSION_START workflow orchestration');
        console.log('  inbox - INBOX workflow orchestration');
        console.log('  next-issue - NEXT_ISSUE workflow orchestration');
        console.log('');
        console.log('Operations:');
        console.log('  test - Test workflow execution');
        console.log('  execute - Execute workflow');
        return;
    }
    
    try {
        switch (workflow) {
            case 'commit':
                const commitOrchestrator = createCommitOrchestrator();
                if (operation === 'test') {
                    console.log('Testing COMMIT workflow orchestration...');
                    const result = await commitOrchestrator.executeCommit({ test: true });
                    console.log('✓ COMMIT workflow test completed');
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    console.log('Executing COMMIT workflow...');
                    const result = await commitOrchestrator.executeCommit();
                    console.log('✓ COMMIT workflow completed');
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            case 'session-start':
                const sessionStartOrchestrator = createSessionStartOrchestrator();
                if (operation === 'test') {
                    console.log('Testing SESSION_START workflow orchestration...');
                    const result = await sessionStartOrchestrator.executeSessionStart({ test: true });
                    console.log('✓ SESSION_START workflow test completed');
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    console.log('Executing SESSION_START workflow...');
                    const result = await sessionStartOrchestrator.executeSessionStart();
                    console.log('✓ SESSION_START workflow completed');
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            case 'inbox':
                const inboxOrchestrator = createInboxOrchestrator();
                if (operation === 'test') {
                    console.log('Testing INBOX workflow orchestration...');
                    const result = await inboxOrchestrator.executeInbox({ test: true });
                    console.log('✓ INBOX workflow test completed');
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    console.log('Executing INBOX workflow...');
                    const result = await inboxOrchestrator.executeInbox();
                    console.log('✓ INBOX workflow completed');
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            case 'next-issue':
                const nextIssueOrchestrator = createNextIssueOrchestrator();
                if (operation === 'test') {
                    console.log('Testing NEXT_ISSUE workflow orchestration...');
                    const result = await nextIssueOrchestrator.executeNextIssue({ test: true });
                    console.log('✓ NEXT_ISSUE workflow test completed');
                    console.log(JSON.stringify(result, null, 2));
                } else {
                    console.log('Executing NEXT_ISSUE workflow...');
                    const result = await nextIssueOrchestrator.executeNextIssue();
                    console.log('✓ NEXT_ISSUE workflow completed');
                    console.log(JSON.stringify(result, null, 2));
                }
                break;
                
            default:
                console.error(`Unknown workflow: ${workflow}`);
                process.exit(1);
        }
    } catch (error) {
        console.error('✗ Workflow orchestration failed');
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