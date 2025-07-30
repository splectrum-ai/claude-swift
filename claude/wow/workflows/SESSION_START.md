[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_START Workflow

## Trigger
**User-Friendly**: `start sesame`

## Purpose
Initialize a new work session with proper recovery checks, task processing, and issue synchronization.

## Workflow Execution

### 1. Session Initialization and Recovery
```bash
# Execute session start audit workflow
claude/wow/scripts/audit-manage session-start
```

### 2. Task Distribution and Processing
```bash
# Execute OUTBOX workflow (distribute pending tasks)
claude/wow/scripts/outbox-process

# Execute INBOX workflow (process received tasks)  
claude/wow/scripts/inbox-process
```

### 3. Issue Synchronization and Triage
```bash
# Ensure issue cache is current and perform triage
claude/wow/scripts/issue-manage triage
```

## Success Criteria
- Previous session recovery completed (if needed)
- All pending tasks distributed and processed
- Issue cache synchronized and triaged
- Session ready for productive work

## Integration with SESSION_END
- SESSION_START detects incomplete SESSION_END workflows and completes them
- Ensures clean session boundaries and proper audit trail continuity
- Creates foundation for SESSION_END to properly archive the session

---

*Session initialization workflow with recovery logic and task management integration*