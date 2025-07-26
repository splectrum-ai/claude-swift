[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_END Workflow

## Session Termination

**SESSION TERMINATION**: When any Claude session ends, Claude should execute this session closure sequence to preserve work and maintain continuity.

## Trigger
**User-Friendly**: `finish sesame`
**Technical**: `SESSION_END`

**SESSION TERMINATION:**
1. **COMPLETE OUTSTANDING WORK**: Ensure all workflow steps and GitHub issues are properly completed
2. **CAPTURE SESSION LEARNINGS**: Document insights in appropriate files
3. **COMMIT ALL WORK**: Commit all changes directly to main branch

## Workflow Execution

### Initialize Audit Logging
```bash
# Load Node.js audit functions
# Automated audit logging - no manual sourcing required

# Start session end workflow
claude/wow/scripts/audit-log "SESSION_END" "workflow_start" "session_termination" "" "Starting SESSION_END workflow for session closure"
```

## Session Completion Steps

### **1. Issue and Learning Management**
```bash
claude/wow/scripts/audit-log "SESSION_END" "step" "issue_management" "" "Updating GitHub issues and capturing session learnings"
```
- Ensure all GitHub issues are properly updated and closed if completed
- Document session learnings in appropriate docs/ files
- Log session completion with `item_complete` audit entries for major accomplishments

### **2. Git Operations and Clean Handoff**
```bash
claude/wow/scripts/audit-log "SESSION_END" "step" "git_operations" "" "Executing COMMIT workflow for session closure"
```
**INTELLIGENT: COMMIT workflow integration for session closure:**

1. **Execute COMMIT workflow:**
   - Validate audit log completeness for session work
   - Automatically assess all session changes
   - Detect and resolve any GitHub issues worked on during session
   - Generate intelligent commit message with session context
   - Stage, commit, and push all changes to main
   - Close resolved issues with commit references
2. **Archive complete session log** → `claude/project/audit/current/session_TIMESTAMPZ.log`
   ```bash
   # Create timestamp with Z suffix for UTC
   timestamp=$(date -u +%Y-%m-%dT%H-%M-%SZ)
   
   # Archive session log in current directory (belongs to target version until release)
   claude/wow/scripts/audit-manage archive-session
   
   claude/wow/scripts/audit-log "SESSION_END" "step" "log_archiving" "" "Archiving session audit log to current/session_${timestamp}.log"
   ```
3. **Create fresh current.log** with clean marker: Handled automatically by audit-manage archive-session
   ```bash
   claude/wow/scripts/audit-log "SESSION_END" "step" "log_reset" "" "Created fresh audit log for next session"
   ```
4. **Log SESSION_END completion** in fresh audit log
   ```bash
   claude/wow/scripts/audit-log "SESSION_END" "workflow_complete" "session_termination" "" "SESSION_END workflow completed - session archived and repository prepared for next session"
   ```

**Benefits**: 
- **Audit validation** - COMMIT workflow validates complete session audit before committing
- **Complete session archive** - Archived log contains complete session including commit entries
- **Intelligent issue management** - Issues resolved during session are automatically closed
- **Quality commit messages** - AI-generated descriptions of session work
- **Zero manual overhead** - Issue tracking happens automatically
- **Perfect consistency** - Archived session log = complete session record




## Success Criteria

- Clear accomplishments documented in audit log
- All audit log entries properly formatted
- Clear handoff state for future sessions


