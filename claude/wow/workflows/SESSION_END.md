[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_END Workflow

## Trigger
**User-Friendly**: `finish sesame`

## Purpose
Properly terminate a work session with learning capture, work commitment, and audit log archiving.

## Workflow Execution

### 1. Session Termination and Archive
```bash
# Execute complete session end workflow (commit + archive)
claude/wow/scripts/session-manage end-session
```

## Success Criteria
- All work committed to repository
- Audit log archived with timestamp
- Fresh audit log ready for next session
- Clean handoff to next session

## Integration with SESSION_START
- Creates clean session boundary for SESSION_START to detect
- SESSION_START will verify clean termination by looking for `SESSION_END | workflow_complete`
- Archive provides historical context for future sessions
- Fresh log ensures SESSION_START has clean starting point

---

*Session termination workflow with learning capture and proper archival*