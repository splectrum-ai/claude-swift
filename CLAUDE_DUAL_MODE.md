# CLAUDE_DUAL_MODE.md

Optimized operational guidance for both interactive (human-AI) and automated (event-driven) execution modes.

## Vision: Event-Driven Architecture

**Current State**: Rigid workflows as atomic units
**Target State**: Decomposed tools triggered by events
**Dual Mode**: Rules that work for both human interaction and automation

## Core Optimization Principles

### 1. Single Pathway Execution
**Rule**: One way to do each operation - no conditional paths
```bash
# ❌ Old: Multiple paths
if cached; then update_cache; update_github
else update_github; wait_for_sync

# ✅ New: Single path
update_cache && update_github
```

### 2. Batch Logging
**Rule**: Collect operations, log once at completion
```bash
# ❌ Old: Log each step
log "step 1"; do_step_1; log "complete"
log "step 2"; do_step_2; log "complete"

# ✅ New: Execute all, log batch
do_step_1 && do_step_2 && log_batch "completed: step_1, step_2"
```

### 3. Event-Ready Design
**Rule**: Each operation is a potential event trigger
- Input: Clear preconditions
- Process: Deterministic execution  
- Output: Defined postconditions/events

## Optimized Workflow Patterns

### SESSION_START (Simplified)
```yaml
trigger: "start sesame"
mode_support: both
operations:
  - check_time           # Event: session_time_verified
  - load_issue_cache     # Event: cache_loaded
  - check_uncommitted    # Event: work_state_known
batch_log: "session_initialized"
```

### COMMIT (Single Path)
```yaml
trigger: "commit sesame"
mode_support: both
operations:
  - stage_changes        # Event: changes_staged
  - detect_issues        # Event: issues_identified  
  - update_cache         # Event: cache_updated
  - commit_changes       # Event: commit_created
  - close_issues         # Event: issues_closed
batch_log: "commit_workflow_complete: {commit_hash}, issues: {closed_issues}"
```

### ISSUE_CACHE (Deterministic)
```yaml
trigger: "issue sesame"
mode_support: both
operations:
  - read_cache           # Event: cache_read
  - fetch_remote         # Event: remote_fetched
  - detect_gaps          # Event: gaps_identified
  - update_cache         # Event: cache_synchronized
batch_log: "cache_sync_complete: {new_issues}, {updated_issues}"
```

## Mode-Specific Behaviors

### Interactive Mode
- **Show progress**: Use TodoWrite for complex operations
- **Request confirmation**: For destructive operations
- **Present options**: When multiple valid approaches exist
- **Batch feedback**: Show summary after operation group

### Automated Mode  
- **Event emission**: Each operation emits completion event
- **No interaction**: Deterministic execution path
- **Error events**: Emit failure events for intervention
- **Audit trail**: Batch log provides execution history

## Implementation Rules

### 1. Tool Decomposition
Each workflow step becomes a standalone tool:
```
COMMIT workflow → stage_tool, detect_tool, update_tool, commit_tool, close_tool
```

### 2. Event Contracts
```typescript
interface OperationEvent {
  operation: string
  status: 'started' | 'completed' | 'failed'
  context: Record<string, any>
  timestamp: string
}
```

### 3. Batch Logging Format
```
[timestamp] workflow_complete: {
  operations: ["op1", "op2", "op3"],
  duration: "X.Xs",
  results: { ... },
  errors: []
}
```

## Optimization Targets

### Remove
- ❌ Multiple execution paths per operation
- ❌ Step-by-step logging (except debugging)
- ❌ Nested workflow calls
- ❌ Redundant confirmations
- ❌ Complex state management

### Retain  
- ✅ Cache-first operations
- ✅ Deterministic execution
- ✅ Clear preconditions
- ✅ Event emission points
- ✅ Batch result logging

## Migration Path

1. **Current**: Monolithic workflows with embedded logic
2. **Phase 1**: Extract tools from workflow steps
3. **Phase 2**: Add event emission to tools
4. **Phase 3**: Create event choreography layer
5. **Target**: Event-driven execution with same rules

## Key Insight

By designing for automation first with interactive mode as an enhancement layer, we achieve:
- **Efficiency**: Single path execution, batch operations
- **Reliability**: Deterministic, event-driven
- **Flexibility**: Same rules work in both modes
- **Scalability**: Ready for distributed execution

The emphasis on process now makes sense - it's building the foundation for event-driven choreography where each operation can be triggered independently while maintaining system coherence.