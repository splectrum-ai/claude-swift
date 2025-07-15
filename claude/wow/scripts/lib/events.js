import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const EVENT_LOG_PATH = path.join(PROJECT_ROOT, 'claude/project/events/event.log');
const EVENT_DIR = path.join(PROJECT_ROOT, 'claude/project/events');

// Event type definitions for consistency
export const EventTypes = {
    WORKFLOW_START: 'workflow_start',
    WORKFLOW_COMPLETE: 'workflow_complete',
    WORKFLOW_ERROR: 'workflow_error',
    CACHE_UPDATED: 'cache_updated',
    ISSUE_CREATED: 'issue_created',
    ISSUE_CLOSED: 'issue_closed',
    TASK_CREATED: 'task_created',
    TASK_PROCESSED: 'task_processed',
    FILE_CREATED: 'file_created',
    FILE_MODIFIED: 'file_modified',
    VALIDATION_PASSED: 'validation_passed',
    VALIDATION_FAILED: 'validation_failed'
};

/**
 * Emit an event
 */
export async function emitEvent(eventType, operation, context, payload) {
    const event = {
        id: generateEventId(),
        timestamp: new Date().toISOString(),
        type: eventType,
        operation,
        context,
        payload,
        version: '1.0'
    };
    
    try {
        await fs.mkdir(EVENT_DIR, { recursive: true });
        await fs.appendFile(EVENT_LOG_PATH, JSON.stringify(event) + '\n');
        
        // Future: Emit to event bus
        // await eventBus.publish(eventType, event);
        
        return { success: true, event };
    } catch (error) {
        console.error('Event emission error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Batch emit multiple events
 */
export async function emitEventsBatch(events) {
    const timestamp = new Date().toISOString();
    const formatted = events.map(e => {
        const event = {
            id: generateEventId(),
            timestamp,
            type: e.type,
            operation: e.operation,
            context: e.context,
            payload: e.payload,
            version: '1.0'
        };
        return JSON.stringify(event);
    }).join('\n');
    
    try {
        await fs.mkdir(EVENT_DIR, { recursive: true });
        await fs.appendFile(EVENT_LOG_PATH, formatted + '\n');
        return { success: true, count: events.length };
    } catch (error) {
        console.error('Batch event emission error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Event collector for batching
 */
export class EventCollector {
    constructor() {
        this.events = [];
    }
    
    add(type, operation, context, payload) {
        this.events.push({ type, operation, context, payload });
        return this;
    }
    
    async flush() {
        if (this.events.length === 0) return { success: true, count: 0 };
        
        const result = await emitEventsBatch(this.events);
        this.events = [];
        return result;
    }
    
    get pending() {
        return this.events.length;
    }
}

/**
 * Read recent events
 */
export async function readRecentEvents(count = 10, filter = null) {
    try {
        const content = await fs.readFile(EVENT_LOG_PATH, 'utf8');
        const lines = content.trim().split('\n').filter(Boolean);
        const events = lines.map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        }).filter(Boolean);
        
        const filtered = filter ? 
            events.filter(e => e.type === filter) : events;
            
        return filtered.slice(-count);
    } catch (error) {
        // File doesn't exist yet
        return [];
    }
}

/**
 * Generate unique event ID
 */
function generateEventId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `evt_${timestamp}_${random}`;
}

/**
 * Create workflow event helper
 */
export function workflowEvent(workflowName, status, details = {}) {
    const eventType = status === 'start' ? EventTypes.WORKFLOW_START :
                     status === 'complete' ? EventTypes.WORKFLOW_COMPLETE :
                     EventTypes.WORKFLOW_ERROR;
                     
    return emitEvent(eventType, workflowName, 'workflow', details);
}