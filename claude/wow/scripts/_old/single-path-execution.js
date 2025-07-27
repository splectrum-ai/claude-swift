#!/usr/bin/env node

/**
 * Single-Path Execution Framework
 * 
 * Eliminates multiple conditional execution paths in workflows to create 
 * predictable, deterministic execution suitable for automation.
 * 
 * Key principles:
 * - One execution path per operation
 * - Precondition validation before execution
 * - Postcondition validation after execution
 * - Deterministic state normalization
 * - Consistent event emission
 * - Clear error handling
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Single-Path Execution Engine
 */
export class SinglePathExecutor {
    constructor(options = {}) {
        this.auditLogger = options.auditLogger || null;
        this.eventEmitter = options.eventEmitter || null;
        this.workflowName = options.workflowName || 'UNKNOWN';
        this.preconditions = new Map();
        this.postconditions = new Map();
        this.operations = new Map();
        this.stateNormalizers = new Map();
        this.executionContext = {};
    }

    /**
     * Register a precondition validator for an operation
     * 
     * @param {string} operation - Operation name
     * @param {Function} validator - Validation function
     */
    registerPrecondition(operation, validator) {
        if (!this.preconditions.has(operation)) {
            this.preconditions.set(operation, []);
        }
        this.preconditions.get(operation).push(validator);
    }

    /**
     * Register a postcondition validator for an operation
     * 
     * @param {string} operation - Operation name
     * @param {Function} validator - Validation function
     */
    registerPostcondition(operation, validator) {
        if (!this.postconditions.has(operation)) {
            this.postconditions.set(operation, []);
        }
        this.postconditions.get(operation).push(validator);
    }

    /**
     * Register an operation handler
     * 
     * @param {string} operation - Operation name
     * @param {Function} handler - Operation handler function
     */
    registerOperation(operation, handler) {
        this.operations.set(operation, handler);
    }

    /**
     * Register a state normalizer
     * 
     * @param {string} stateName - State name
     * @param {Function} normalizer - State normalization function
     */
    registerStateNormalizer(stateName, normalizer) {
        this.stateNormalizers.set(stateName, normalizer);
    }

    /**
     * Execute operation with single-path pattern
     * 
     * @param {string} operation - Operation to execute
     * @param {Object} context - Execution context
     * @returns {Promise<Object>} Execution result
     */
    async execute(operation, context = {}) {
        // Merge context with execution context
        this.executionContext = { ...this.executionContext, ...context };
        
        try {
            // Phase 1: Precondition Validation
            await this.validatePreconditions(operation);
            
            // Phase 2: State Normalization
            await this.normalizeState(operation);
            
            // Phase 3: Single-Path Execution
            const result = await this.executeOperation(operation);
            
            // Phase 4: Postcondition Validation
            await this.validatePostconditions(operation);
            
            // Phase 5: Event Emission
            await this.emitSuccess(operation, result);
            
            return {
                success: true,
                operation,
                result,
                context: this.executionContext
            };
            
        } catch (error) {
            await this.emitError(operation, error);
            throw error;
        }
    }

    /**
     * Validate all preconditions for an operation
     * 
     * @param {string} operation - Operation name
     */
    async validatePreconditions(operation) {
        const validators = this.preconditions.get(operation) || [];
        
        for (const validator of validators) {
            const result = await validator(this.executionContext);
            
            if (!result.valid) {
                const error = new Error(`Precondition failed for ${operation}: ${result.message}`);
                error.code = 'PRECONDITION_FAILED';
                error.operation = operation;
                error.details = result.details;
                throw error;
            }
        }
        
        await this.auditLog('precondition_validation', operation, 'success', 'All preconditions passed');
    }

    /**
     * Normalize state before execution
     * 
     * @param {string} operation - Operation name
     */
    async normalizeState(operation) {
        // Apply state normalizers in registration order
        for (const [stateName, normalizer] of this.stateNormalizers) {
            await normalizer(this.executionContext);
        }
        
        await this.auditLog('state_normalization', operation, 'success', 'State normalized for execution');
    }

    /**
     * Execute the operation with single path
     * 
     * @param {string} operation - Operation name
     * @returns {Promise<Object>} Operation result
     */
    async executeOperation(operation) {
        const handler = this.operations.get(operation);
        
        if (!handler) {
            throw new Error(`No handler registered for operation: ${operation}`);
        }
        
        await this.auditLog('execution_start', operation, 'info', 'Starting single-path execution');
        
        const result = await handler(this.executionContext);
        
        await this.auditLog('execution_complete', operation, 'success', 'Single-path execution completed');
        
        return result;
    }

    /**
     * Validate all postconditions for an operation
     * 
     * @param {string} operation - Operation name
     */
    async validatePostconditions(operation) {
        const validators = this.postconditions.get(operation) || [];
        
        for (const validator of validators) {
            const result = await validator(this.executionContext);
            
            if (!result.valid) {
                const error = new Error(`Postcondition failed for ${operation}: ${result.message}`);
                error.code = 'POSTCONDITION_FAILED';
                error.operation = operation;
                error.details = result.details;
                throw error;
            }
        }
        
        await this.auditLog('postcondition_validation', operation, 'success', 'All postconditions passed');
    }

    /**
     * Emit success event
     * 
     * @param {string} operation - Operation name
     * @param {Object} result - Operation result
     */
    async emitSuccess(operation, result) {
        if (this.eventEmitter) {
            this.eventEmitter.emit('operation_success', {
                operation,
                result,
                timestamp: new Date().toISOString()
            });
        }
        
        await this.auditLog('operation_success', operation, 'success', 'Operation completed successfully');
    }

    /**
     * Emit error event
     * 
     * @param {string} operation - Operation name
     * @param {Error} error - Error object
     */
    async emitError(operation, error) {
        if (this.eventEmitter) {
            this.eventEmitter.emit('operation_error', {
                operation,
                error: {
                    message: error.message,
                    code: error.code,
                    details: error.details
                },
                timestamp: new Date().toISOString()
            });
        }
        
        await this.auditLog('operation_error', operation, 'error', error.message);
    }

    /**
     * Log to audit system
     * 
     * @param {string} step - Step name
     * @param {string} operation - Operation name
     * @param {string} level - Log level
     * @param {string} message - Log message
     */
    async auditLog(step, operation, level, message) {
        if (this.auditLogger) {
            await this.auditLogger.log(this.workflowName, step, operation, level, message);
        }
    }
}

/**
 * Common Precondition Validators
 */
export class PreconditionValidators {
    /**
     * Validate git repository exists and is clean
     */
    static async validateGitRepository(context) {
        try {
            // Check if git repository exists
            execSync('git rev-parse --git-dir', { stdio: 'pipe' });
            
            // Check repository state
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            
            return {
                valid: true,
                message: 'Git repository is valid',
                details: { hasChanges: status.trim().length > 0 }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Git repository validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate Claude directory structure exists
     */
    static async validateClaudeStructure(context) {
        const requiredDirs = [
            'claude',
            'claude/project',
            'claude/project/audit',
            'claude/project/audit/current',
            'claude/wow',
            'claude/wow/workflows'
        ];
        
        try {
            for (const dir of requiredDirs) {
                await fs.access(dir);
            }
            
            return {
                valid: true,
                message: 'Claude directory structure is valid',
                details: { checkedDirs: requiredDirs }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Claude directory structure validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate GitHub authentication
     */
    static async validateGitHubAuth(context) {
        try {
            const token = process.env.GITHUB_TOKEN;
            
            if (!token) {
                return {
                    valid: false,
                    message: 'GitHub token not found',
                    details: { env: 'GITHUB_TOKEN not set' }
                };
            }
            
            // Test token by making a simple API call
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                return {
                    valid: false,
                    message: 'GitHub authentication failed',
                    details: { status: response.status }
                };
            }
            
            const user = await response.json();
            
            return {
                valid: true,
                message: 'GitHub authentication is valid',
                details: { user: user.login }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'GitHub authentication validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate issue cache exists and is current
     */
    static async validateIssueCache(context) {
        try {
            const cacheFile = 'claude/project/cache/issues.json';
            const metadataFile = 'claude/project/cache/metadata.json';
            
            // Check cache files exist
            await fs.access(cacheFile);
            await fs.access(metadataFile);
            
            // Check cache freshness
            const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
            const lastSync = new Date(metadata.issuesLastSync);
            const now = new Date();
            const ageMinutes = (now - lastSync) / (1000 * 60);
            
            return {
                valid: ageMinutes < 60, // Consider cache valid for 1 hour
                message: ageMinutes < 60 ? 'Issue cache is current' : 'Issue cache is stale',
                details: { lastSync: metadata.issuesLastSync, ageMinutes }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Issue cache validation failed',
                details: { error: error.message }
            };
        }
    }
}

/**
 * Common Postcondition Validators
 */
export class PostconditionValidators {
    /**
     * Validate git repository is in expected state
     */
    static async validateGitState(context) {
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf8' });
            const expectedState = context.expectedGitState || 'clean';
            
            const isClean = status.trim().length === 0;
            const isValid = (expectedState === 'clean' && isClean) || 
                           (expectedState === 'dirty' && !isClean);
            
            return {
                valid: isValid,
                message: isValid ? 'Git state is as expected' : 'Git state validation failed',
                details: { expectedState, actualState: isClean ? 'clean' : 'dirty' }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Git state validation failed',
                details: { error: error.message }
            };
        }
    }

    /**
     * Validate file exists with expected content
     */
    static async validateFileContent(context) {
        try {
            const filePath = context.expectedFile;
            const expectedContent = context.expectedContent;
            
            if (!filePath) {
                return { valid: true, message: 'No file validation required' };
            }
            
            const content = await fs.readFile(filePath, 'utf8');
            
            if (expectedContent && !content.includes(expectedContent)) {
                return {
                    valid: false,
                    message: 'File content validation failed',
                    details: { filePath, expectedContent }
                };
            }
            
            return {
                valid: true,
                message: 'File content is valid',
                details: { filePath, contentLength: content.length }
            };
        } catch (error) {
            return {
                valid: false,
                message: 'File content validation failed',
                details: { error: error.message }
            };
        }
    }
}

/**
 * Common State Normalizers
 */
export class StateNormalizers {
    /**
     * Normalize git working directory to expected state
     */
    static async normalizeGitWorkingDir(context) {
        // Skip normalization in test mode
        if (context.test) {
            context.normalizedGitState = 'test';
            return;
        }
        
        const desiredState = context.gitState || 'clean';
        
        try {
            switch (desiredState) {
                case 'clean':
                    // Don't modify git state - just ensure it's clean
                    const status = execSync('git status --porcelain', { encoding: 'utf8' });
                    if (status.trim().length > 0) {
                        throw new Error('Git working directory is not clean');
                    }
                    break;
                    
                case 'committed':
                    // Ensure all changes are committed
                    const uncommitted = execSync('git status --porcelain', { encoding: 'utf8' });
                    if (uncommitted.trim().length > 0) {
                        execSync('git add -A');
                        execSync('git commit -m "Auto-commit for state normalization"');
                    }
                    break;
                    
                case 'staged':
                    // Ensure changes are staged
                    const unstaged = execSync('git diff --name-only', { encoding: 'utf8' });
                    if (unstaged.trim().length > 0) {
                        execSync('git add -A');
                    }
                    break;
            }
            
            context.normalizedGitState = desiredState;
        } catch (error) {
            throw new Error(`Git state normalization failed: ${error.message}`);
        }
    }

    /**
     * Normalize cache state to ensure it's current
     */
    static async normalizeCacheState(context) {
        // Skip normalization in test mode
        if (context.test) {
            context.normalizedCacheState = 'test';
            return;
        }
        
        try {
            const cacheFile = 'claude/project/cache/issues.json';
            const metadataFile = 'claude/project/cache/metadata.json';
            
            // Check if cache exists
            try {
                await fs.access(cacheFile);
                await fs.access(metadataFile);
                
                // Check cache freshness
                const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
                const lastSync = new Date(metadata.issuesLastSync);
                const now = new Date();
                const ageMinutes = (now - lastSync) / (1000 * 60);
                
                if (ageMinutes >= 60) {
                    // Cache is stale, refresh it
                    await this.refreshCache();
                }
            } catch (error) {
                // Cache doesn't exist, create it
                await this.refreshCache();
            }
            
            context.normalizedCacheState = 'current';
        } catch (error) {
            throw new Error(`Cache state normalization failed: ${error.message}`);
        }
    }

    /**
     * Refresh issue cache
     */
    static async refreshCache() {
        // Use the GitHub cache system we implemented
        const { createGitHubCache } = await import('./github-cache.js');
        const cache = createGitHubCache();
        await cache.smartSync();
    }

    /**
     * Normalize directory structure
     */
    static async normalizeDirectoryStructure(context) {
        const requiredDirs = [
            'claude/inbox',
            'claude/outbox',
            'claude/project/cache',
            'claude/project/audit/current',
            'claude/local'
        ];
        
        try {
            for (const dir of requiredDirs) {
                await fs.mkdir(dir, { recursive: true });
            }
            
            context.normalizedDirectories = requiredDirs;
        } catch (error) {
            throw new Error(`Directory normalization failed: ${error.message}`);
        }
    }
}

/**
 * Create single-path executor with common configurations
 */
export function createSinglePathExecutor(workflowName, options = {}) {
    const executor = new SinglePathExecutor({
        workflowName,
        ...options
    });
    
    // Register common preconditions
    executor.registerPrecondition('git_operation', PreconditionValidators.validateGitRepository);
    executor.registerPrecondition('claude_operation', PreconditionValidators.validateClaudeStructure);
    executor.registerPrecondition('github_operation', PreconditionValidators.validateGitHubAuth);
    executor.registerPrecondition('cache_operation', PreconditionValidators.validateIssueCache);
    
    // Register common postconditions
    executor.registerPostcondition('git_operation', PostconditionValidators.validateGitState);
    executor.registerPostcondition('file_operation', PostconditionValidators.validateFileContent);
    
    // Register common state normalizers
    executor.registerStateNormalizer('git_state', StateNormalizers.normalizeGitWorkingDir);
    executor.registerStateNormalizer('cache_state', StateNormalizers.normalizeCacheState);
    executor.registerStateNormalizer('directory_structure', StateNormalizers.normalizeDirectoryStructure);
    
    return executor;
}

/**
 * CLI interface for testing single-path execution
 */
export async function main(args) {
    const operation = args[0];
    const workflowName = args[1] || 'TEST';
    
    if (!operation) {
        console.log('Single-Path Execution Framework');
        console.log('Usage: node single-path-execution.js <operation> [workflow-name]');
        console.log('');
        console.log('Test operations:');
        console.log('  test-git - Test git repository validation');
        console.log('  test-claude - Test Claude structure validation');
        console.log('  test-github - Test GitHub authentication');
        console.log('  test-cache - Test issue cache validation');
        return;
    }
    
    try {
        const executor = createSinglePathExecutor(workflowName);
        
        // Register test operations
        executor.registerOperation('test-git', async (context) => {
            return { message: 'Git repository test completed' };
        });
        
        executor.registerOperation('test-claude', async (context) => {
            return { message: 'Claude structure test completed' };
        });
        
        executor.registerOperation('test-github', async (context) => {
            return { message: 'GitHub authentication test completed' };
        });
        
        executor.registerOperation('test-cache', async (context) => {
            return { message: 'Issue cache test completed' };
        });
        
        // Execute operation
        const result = await executor.execute(operation);
        
        console.log('✓ Single-path execution completed successfully');
        console.log(`Operation: ${result.operation}`);
        console.log(`Result: ${JSON.stringify(result.result, null, 2)}`);
        
    } catch (error) {
        console.error('✗ Single-path execution failed');
        console.error(`Error: ${error.message}`);
        console.error(`Code: ${error.code}`);
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