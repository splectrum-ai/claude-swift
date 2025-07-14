# Explicit Audit Logging Pattern

## Problem with Item-Triggered Pattern

**Current Pattern:**
```bash
# Work happens silently
do_complex_workflow
do_more_work
# Log everything after the fact
audit_log "WORKFLOW1" "item_complete" "context" "" "Did workflow 1"
audit_log "WORKFLOW2" "item_complete" "context" "" "Did workflow 2"
```

**Issues:**
- No visibility during execution
- If workflow fails, no audit trail of progress
- Hard to debug which step failed
- Not event-ready for choreography

## Explicit Audit Pattern

**New Pattern:**
```javascript
import { AuditCollector } from './claude/scripts/lib/audit.js'

async function explicitWorkflow() {
    const audit = new AuditCollector()
    
    audit.add("WORKFLOW", "start", "complex_operation", "", "Starting complex workflow")
    
    try {
        await doStep1()
        audit.add("WORKFLOW", "step", "step1_complete", "", "Step 1 completed successfully")
        
        await doStep2()
        audit.add("WORKFLOW", "step", "step2_complete", "", "Step 2 completed successfully")
        
        audit.add("WORKFLOW", "complete", "complex_operation", "", "Workflow completed successfully")
        
    } catch (error) {
        audit.add("WORKFLOW", "error", "workflow_failure", "", `Workflow failed: ${error.message}`)
        throw error
    } finally {
        await audit.flush() // Single I/O operation
    }
}
```

## Benefits

1. **Real-time Visibility**: See progress as it happens
2. **Better Debugging**: Know exactly where failures occur  
3. **Event-Ready**: Each log entry can trigger events
4. **Performance**: Batch operations efficiently
5. **Error Tracking**: Capture failures with context

## Migration Strategy

1. **Keep item_complete for work summaries**
2. **Add explicit logging for complex workflows**  
3. **Use batch collectors for performance**
4. **Emit events from audit entries (future)**

## Example: OUTBOX Workflow

**Before (item-triggered only):**
```bash
# [complex collection and distribution happens]
audit_log "OUTBOX" "item_complete" "workflow" "" "Processed X tasks"
```

**After (explicit + summary):**
```javascript
const audit = new AuditCollector()
audit.add("OUTBOX", "start", "collection", "", "Starting task collection")
// collection logic with step logging
audit.add("OUTBOX", "step", "distribution", "", "Starting task distribution") 
// distribution logic with step logging
audit.add("OUTBOX", "complete", "workflow", "", "OUTBOX workflow completed: X collected, Y distributed")
await audit.flush()
```

This gives us the best of both worlds: detailed execution tracking AND summary completion entries.