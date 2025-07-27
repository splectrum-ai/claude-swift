[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_START Workflow

## Trigger
**User-Friendly**: `start sesame`

## Workflow Execution

**Workflow Execution:**
1. Log session start with audit logging
2. Check for incomplete previous session and recover if needed
3. Execute OUTBOX workflow (distribute pending tasks)
4. Execute INBOX workflow (process received tasks)
5. Execute ISSUE workflow triage (review unassigned issues)
6. Log session start completion