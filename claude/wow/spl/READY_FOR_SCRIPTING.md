# SPL-Ready Functions Analysis

## Functions Ready for Immediate Scripting

These functions have clear interfaces and would benefit from JavaScript implementation NOW:

### 1. **Audit Logging** (Perfect for SPL)
```javascript
// spl/audit.js
export async function auditLog(workflow, stepType, context, filePath, description) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    const entry = `${timestamp}|${workflow}|${stepType}|${context}|${filePath}|${description}`;
    
    // Use SPL file API
    await spl.file.append('claude/project/audit/current/current.log', entry + '\n');
}

// Batch version (implementing our optimization!)
export async function auditLogBatch(entries) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    const formatted = entries.map(e => 
        `${timestamp}|${e.workflow}|${e.stepType}|${e.context}|${e.filePath}|${e.description}`
    ).join('\n');
    
    await spl.file.append('claude/project/audit/current/current.log', formatted + '\n');
}
```

### 2. **Issue Cache Operations** (Great Git API Usage)
```javascript
// spl/issueCache.js
export async function loadIssueCache() {
    try {
        const cache = await spl.file.readJSON('claude/project/cache/issues.json');
        return cache || {};
    } catch {
        return {};
    }
}

export async function updateIssueCache(issueNumber, data) {
    const cache = await loadIssueCache();
    cache[issueNumber] = {
        ...data,
        cached_at: new Date().toISOString()
    };
    await spl.file.writeJSON('claude/project/cache/issues.json', cache);
}

// Using git API
export async function syncIssueFromGitHub(issueNumber) {
    const issue = await spl.git.getIssue(issueNumber);
    await updateIssueCache(issueNumber, issue);
    return issue;
}
```

### 3. **Task File Operations**
```javascript
// spl/tasks.js
export async function createTask(target, title, description, metadata) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace('.', '-');
    const filename = `${timestamp}Z_${target}_${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    
    const content = `---
source: ${await spl.git.getCurrentRepo()}
target: ${target}
created: ${new Date().toISOString()}
priority: ${metadata.priority || 'MEDIUM'}
effort: ${metadata.effort || 'M'}
type: ${metadata.type || 'enhancement'}
work_area: ${metadata.workArea || 'general'}
---

# ${title}

## Description
${description}

${metadata.testCriteria ? '## Test Criteria\n' + metadata.testCriteria : ''}

🤖 Generated with [Claude Code](https://claude.ai/code)`;

    await spl.file.write(`claude/outbox/${filename}`, content);
    return filename;
}
```

### 4. **Event Emission** (Foundation for Choreography)
```javascript
// spl/events.js
export async function emitEvent(eventType, operation, context, payload) {
    const event = {
        timestamp: new Date().toISOString(),
        type: eventType,
        operation,
        context,
        payload
    };
    
    // For now, just log to file
    await spl.file.append('claude/project/events/event.log', JSON.stringify(event) + '\n');
    
    // Future: Publish to event bus
    // await spl.events.publish(eventType, event);
    
    return event;
}
```

## Functions to Script AFTER Optimizations

These need single-path execution first:

### 1. **Commit Workflow Functions**
- Need single-path for issue closure
- Batch operations for efficiency
- Event emissions for choreography

### 2. **Session Management**
- Requires lazy loading implementation
- Needs simplified state management
- Benefits from event architecture

### 3. **GitHub Operations**
- Need batch API patterns
- Require error handling standardization
- Benefit from caching layer

## Recommended Implementation Order

### Phase 1: Script Foundation Functions NOW
1. **audit.js** - Immediate value, enables batch optimization
2. **events.js** - Start collecting events early
3. **cache.js** - Basic cache operations
4. **tasks.js** - Task creation utilities

### Phase 2: After Single-Path Optimization
1. **git-ops.js** - Standardized git operations
2. **github-api.js** - Batched GitHub operations
3. **workflow-utils.js** - Common workflow patterns

### Phase 3: Full Choreography
1. **choreographer.js** - Event-driven execution
2. **tools/*.js** - Decomposed workflow tools
3. **orchestrator.js** - Full automation engine

## Benefits of Starting Now

1. **Immediate Performance**: Batch operations in JavaScript
2. **Type Safety**: If TypeScript supported
3. **Better Testing**: Unit tests for core functions
4. **Gradual Migration**: Replace bash functions incrementally
5. **API Consistency**: Standardized interfaces early

## Example Migration

```bash
# Current bash
audit_log() {
    echo "$(date)|$1|$2|$3|$4|$5" >> claude/project/audit/current/current.log
}

# Becomes SPL
import { auditLog } from './spl/audit.js';
await auditLog('WORKFLOW', 'step', 'context', '', 'description');
```

Start with foundation functions now - they're ready and will provide immediate value!