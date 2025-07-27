import { promises as fs, existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load audit configuration from claude/project/audit-config.json
 */
function loadAuditConfig() {
    let currentDir = process.cwd();
    
    // Look for config file by traversing up to find claude/ directory
    while (currentDir !== path.dirname(currentDir)) {
        const claudeDir = path.join(currentDir, 'claude');
        if (existsSync(claudeDir)) {
            // Try local config first (gitignored, machine-specific)
            const localConfigPath = path.join(claudeDir, 'local', 'repo-config.json');
            const projectConfigPath = path.join(claudeDir, 'project', 'repo-config.json');
            const configPath = existsSync(localConfigPath) ? localConfigPath : projectConfigPath;
            try {
                if (existsSync(configPath)) {
                    const configData = JSON.parse(readFileSync(configPath, 'utf8'));
                    return {
                        auditLogPath: configData.auditLogPath,
                        auditLogDirectory: configData.auditLogDirectory,
                        projectRoot: configData.projectRoot
                    };
                }
            } catch (error) {
                console.warn('Could not load audit config:', error.message);
            }
            break;
        }
        currentDir = path.dirname(currentDir);
    }
    
    return null;
}

/**
 * Find the current project root by looking for claude/ directory from cwd (fallback)
 */
function findProjectRoot() {
    let currentDir = process.cwd();
    
    // Keep going up until we find a directory with claude/ subdirectory
    while (currentDir !== path.dirname(currentDir)) { // Stop at filesystem root
        const claudeDir = path.join(currentDir, 'claude');
        try {
            if (existsSync(claudeDir)) {
                return currentDir;
            }
        } catch (error) {
            // Continue searching
        }
        currentDir = path.dirname(currentDir);
    }
    
    // If no claude/ directory found, use current working directory
    return process.cwd();
}

// Try to load configuration first, fallback to path detection
const config = loadAuditConfig();
const PROJECT_ROOT = config ? config.projectRoot : findProjectRoot();
const AUDIT_LOG_PATH = config ? config.auditLogPath : path.join(PROJECT_ROOT, 'claude/project/audit/current/current.log');

/**
 * Format timestamp for audit log entries
 */
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').slice(0, -5);
}

/**
 * Ensure audit log directory exists
 */
async function ensureAuditLogDirectory() {
    const auditDir = path.dirname(AUDIT_LOG_PATH);
    try {
        await fs.mkdir(auditDir, { recursive: true });
    } catch (error) {
        // Directory might already exist, that's okay
    }
}

/**
 * Append a single audit log entry
 */
export async function auditLog(workflow, stepType, context, filePath, description) {
    const timestamp = getTimestamp();
    const entry = `${timestamp}|${workflow}|${stepType}|${context || ''}|${filePath || ''}|${description}`;
    
    try {
        await ensureAuditLogDirectory();
        await fs.appendFile(AUDIT_LOG_PATH, entry + '\n');
        return { success: true, entry };
    } catch (error) {
        console.error('Audit log error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Batch audit log entries for efficient I/O
 */
export async function auditLogBatch(entries) {
    const timestamp = getTimestamp();
    const formatted = entries.map(e => 
        `${timestamp}|${e.workflow}|${e.stepType}|${e.context || ''}|${e.filePath || ''}|${e.description}`
    ).join('\n');
    
    try {
        await ensureAuditLogDirectory();
        await fs.appendFile(AUDIT_LOG_PATH, formatted + '\n');
        return { success: true, count: entries.length };
    } catch (error) {
        console.error('Batch audit log error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Audit log collector for batching operations
 */
export class AuditCollector {
    constructor() {
        this.entries = [];
    }
    
    add(workflow, stepType, context, filePath, description) {
        this.entries.push({ workflow, stepType, context, filePath, description });
        return this;
    }
    
    async flush() {
        if (this.entries.length === 0) return { success: true, count: 0 };
        
        const result = await auditLogBatch(this.entries);
        this.entries = [];
        return result;
    }
    
    get pending() {
        return this.entries.length;
    }
}

/**
 * Read recent audit log entries
 */
export async function readRecentEntries(count = 10) {
    try {
        const content = await fs.readFile(AUDIT_LOG_PATH, 'utf8');
        const lines = content.trim().split('\n').filter(line => line && !line.includes('##APPEND_MARKER'));
        return lines.slice(-count);
    } catch (error) {
        console.error('Read audit log error:', error);
        return [];
    }
}