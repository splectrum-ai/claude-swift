[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_START Workflow

## Trigger
**User-Friendly**: `start sesame`

## Workflow Execution

```bash
# Start session with audit logging
claude/wow/scripts/audit-log "SESSION_START" "workflow_start" "session_initialization" "" "Starting new session initialization"

# Check for incomplete previous session and recover if needed
# (Check audit log, complete any missing SESSION_END steps)

# Execute workflows in order
outbox sesame
inbox sesame
issue sesame triage

# Complete session start
claude/wow/scripts/audit-log "SESSION_START" "workflow_complete" "session_initialization" "" "SESSION_START completed"
```