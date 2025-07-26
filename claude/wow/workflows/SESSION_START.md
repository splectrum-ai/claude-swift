[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_START Workflow

## Session Initialization

**SESSION INITIALIZATION**: When any new Claude session begins, Claude should execute this initialization sequence to ensure clean startup.

## Trigger
**User-Friendly**: `start sesame`
**Technical**: `SESSION_START`

**SESSION INITIALIZATION:**
1. **PREVIOUS SESSION RECOVERY**: Complete any incomplete SESSION_END workflows detected
2. **ISSUE CACHE VALIDATION**: Execute ISSUE_CACHE workflow for complete cache synchronization
3. **INBOX PROCESSING**: Check and process any received cross-repository tasks
4. **OUTBOX DISTRIBUTION**: For base repositories, optionally distribute pending outbox tasks
5. **ISSUE REVIEW**: Show current issues from cache and assess work priorities

## Workflow Execution

### Initialize Audit Logging
```bash
# Load Node.js audit functions
# Automated audit logging - no manual sourcing required

# Start session with explicit logging
claude/wow/scripts/audit-log "SESSION_START" "workflow_start" "session_initialization" "" "Starting new session initialization"
```

## Task Processing

### **Inbox Processing**
```bash
# Execute INBOX workflow
inbox sesame
```

### **Outbox Distribution** 
```bash
# Execute OUTBOX workflow
outbox sesame
```

## SESSION RECOVERY

**Previous Session Verification:**
- Check current audit log for complete SESSION_END workflow
- Complete any incomplete workflows from previous session


## INCOMPLETE WORKFLOW DETECTION

### **Previous Session Check**
At the start of each session, Claude MUST:
1. **Check audit log existence**: Verify `claude/project/audit/current/current.log` exists
   - If missing, check for recent session archives in `claude/project/audit/`
   - If session archive exists but no current.log, this indicates interrupted SESSION_END after git operations
   - Create fresh current.log: `claude/wow/scripts/audit-manage fresh-log`
   - Log recovery: Add entry indicating SESSION_END recovery completed
2. **Read the current audit log** to check the last entry
3. If last entry is `SESSION_END | workflow_complete:` with no subsequent activities, previous session ended cleanly
4. If last entry shows incomplete SESSION_END (workflow_start logged but no workflow_complete), complete the missing steps:
   - Check audit log for incomplete workflows from previous session
   - Complete any outstanding workflow steps identified
   - Capture any obvious learnings from previous session's work
   - Stage and commit any uncommitted changes with session summary

### **Recovery Actions**
When detecting incomplete SESSION_END:
```
Previous session had incomplete SESSION_END workflow. Completing missing steps:
- [List specific recovery actions taken]
- Session continuity restored
```

When detecting missing current.log with session archive present:
```
Previous SESSION_END completed git operations but was interrupted before creating fresh audit log:
- Found session archive: session_TIMESTAMP.log
- Created fresh current.log with clean marker
- SESSION_END recovery completed - session continuity restored
```

## Issue Health Check

### **Ensure Issue List is Current**
```bash
# Execute ISSUE workflow to verify issue list is up to date
issue sesame, sync the cache
```


## Success Criteria

- Previous session recovery completed successfully
- All audit log entries properly formatted
- Clear starting point established for session work