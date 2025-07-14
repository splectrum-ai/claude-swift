import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const AUDIT_LOG_PATH = path.join(PROJECT_ROOT, 'claude/project/audit/current/current.log');

/**
 * Format timestamp for audit log entries
 */
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').slice(0, -5);
}

/**
 * Append a single audit log entry
 */
export async function auditLog(workflow, stepType, context, filePath, description) {
    const timestamp = getTimestamp();
    const entry = `${timestamp}|${workflow}|${stepType}|${context || ''}|${filePath || ''}|${description}`;
    
    try {
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