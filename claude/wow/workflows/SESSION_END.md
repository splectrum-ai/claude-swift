[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_END Workflow

## Session Termination

**SESSION TERMINATION**: When any Claude session ends, Claude should execute this session closure sequence to preserve work and maintain continuity.

## Trigger
**User-Friendly**: `finish sesame`
**Technical**: `SESSION_END`

**SESSION TERMINATION:**
1. **OUTBOX DISTRIBUTION**: For base repositories, distribute pending outbox tasks
2. **COMPLETE OUTSTANDING WORK**: Ensure all workflow steps and GitHub issues are properly completed
3. **COMMIT ALL WORK**: Commit all changes directly to main branch

## Workflow Execution

```bash
# Start session end workflow
claude/wow/scripts/audit-manage log "SESSION_END" "workflow_start" "session_termination" "" "Starting SESSION_END workflow for session closure"
```

## Session Completion Steps

### **1. Outbox Distribution**
- Execute OUTBOX workflow (distribute pending tasks)

### **2. Complete Session Work**
- Execute COMMIT workflow (handles all git operations and issue closure)
- Archive session and prepare for next session
- Log SESSION_END completion


