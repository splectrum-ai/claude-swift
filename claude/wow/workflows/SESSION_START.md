[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_START Workflow

## Trigger
**User-Friendly**: `start sesame`

## Purpose
Initialize a new work session with proper recovery checks, task processing, and issue synchronization.

## Workflow Execution

### 1. Session Initialization and Recovery
```bash
# Check session state and handle recovery
claude/wow/scripts/session-manage start-initialize
```

### 2. Complete Session Start Workflow  
```bash
# Execute task processing and issue triage
claude/wow/scripts/session-manage start-complete
```

## Success Criteria
- Previous session recovery completed (if needed)
- All pending tasks distributed and processed
- Issues synchronized with GitHub (bidirectional)
- Issue cache synchronized and triaged
- Session ready for productive work

## Integration with SESSION_END
- SESSION_START detects incomplete SESSION_END workflows and completes them
- Ensures clean session boundaries and proper audit trail continuity
- Creates foundation for SESSION_END to properly archive the session

---

*Session initialization workflow with recovery logic and task management integration*