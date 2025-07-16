[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_END Workflow

## ⚠️ MANDATORY SESSION TERMINATION ⚠️

**MANDATORY SESSION TERMINATION**: When any Claude session ends, Claude MUST execute this system check and termination sequence.

## Trigger
**User-Friendly**: `finish sesame`
**Technical**: `SESSION_END`

**MANDATORY SYSTEM CHECK:**
1. **SCAN ALL MANDATORY RULES**: Review CLAUDE.md and workflow files for all rules marked "MANDATORY"
2. **VERIFY SESSION COMPLIANCE**: Ensure all MANDATORY rules were followed during session
3. **EXECUTE REQUIRED WORKFLOWS**: Run any workflows needed to resolve violations
4. **CONFIRM CLEAN HANDOFF**: Ensure repository meets all MANDATORY requirements for session end

**SESSION TERMINATION:**
1. **COMPLETE OUTSTANDING WORK**: Ensure all workflow steps and GitHub issues are properly completed
2. **CAPTURE SESSION LEARNINGS**: Document insights in appropriate files
3. **MANDATORY: COMMIT ALL WORK**: MUST commit all changes directly to main branch

## SYSTEM CHECK PROCEDURE

### Initialize Audit Logging
```bash
# Load Node.js audit functions
source claude/wow/scripts/audit-functions.sh

# Start session end workflow
audit_log "SESSION_END" "workflow_start" "session_termination" "" "Starting SESSION_END workflow with mandatory compliance checks"
```

**MANDATORY Rule Verification:**
```bash
audit_log "SESSION_END" "step" "mandatory_verification" "" "Verifying session compliance with all MANDATORY rules"
```
- Search CLAUDE.md for all \"**MANDATORY\" labeled rules
- Search workflow files for MANDATORY requirements  
- Verify session activities complied with each rule
- Execute required workflows to resolve any violations

**Common Compliance Checks:**
- Repository State: All changes committed to main
- Issue Management: All GitHub issues have appropriate status
- Step-by-Step Pattern: Work followed single-step completion rules

## SESSION COMPLETION CHECKLIST

### **1. System Compliance Verification**
```bash
audit_log "SESSION_END" "step" "compliance_verification" "" "Completing MANDATORY system check and resolving any violations"
```
- Complete MANDATORY system check procedure above
- Resolve any violations before session termination

### **2. Issue and Learning Management**
```bash
audit_log "SESSION_END" "step" "issue_management" "" "Updating GitHub issues and capturing session learnings"
```
- Ensure all GitHub issues are properly updated and closed if completed
- Document session learnings in appropriate docs/ files

### **3. Git Operations and Clean Handoff**
```bash
audit_log "SESSION_END" "step" "git_operations" "" "Executing COMMIT workflow for session closure"
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
   cp claude/project/audit/current/current.log "claude/project/audit/current/session_${timestamp}.log"
   
   audit_log "SESSION_END" "step" "log_archiving" "" "Archiving session audit log to current/session_${timestamp}.log"
   ```
3. **Create fresh current.log** with clean marker: `echo "##APPEND_MARKER_UNIQUE##" > ./claude/project/audit/current/current.log`
   ```bash
   audit_log "SESSION_END" "step" "log_reset" "" "Created fresh audit log for next session"
   ```
4. **Log SESSION_END completion** in fresh audit log
   ```bash
   audit_log "SESSION_END" "workflow_complete" "session_termination" "" "SESSION_END workflow completed - session archived and repository prepared for next session"
   ```

**Benefits**: 
- **Audit validation** - COMMIT workflow validates complete session audit before committing
- **Complete session archive** - Archived log contains complete session including commit entries
- **Intelligent issue management** - Issues resolved during session are automatically closed
- **Quality commit messages** - AI-generated descriptions of session work
- **Zero manual overhead** - Issue tracking happens automatically
- **Perfect consistency** - Archived session log = complete session record

## SESSION OUTCOME DOCUMENTATION

### **High-Value Sessions**
For sessions with significant outcomes, consider creating brief session summary:
- Major architectural decisions made
- Key documents created or updated
- Issues created with strategic importance
- Learnings that impact future development approach

### **Learning Capture Categories**
- **Technical Learnings**: Architecture, implementation patterns, tool usage
- **Process Learnings**: Workflow improvements, efficiency gains
- **Strategic Learnings**: Long-term vision insights, planning approaches
- **Tool Learnings**: Better ways to use development tools or AI capabilities
- **Knowledge Gaps**: Prerequisites or concepts new team members would need
- **Onboarding Insights**: What understanding is required before working on specific components

## INCOMPLETE WORKFLOW DETECTION

### **Session Start Workflow Check**
At the start of each session, Claude MUST:
1. Read the timelog to check the last entry
2. If last entry is `SESSION_END | session_end:` with no subsequent activities, previous session ended cleanly
3. If last entry shows incomplete SESSION_END (session_end logged but activities after), complete the missing steps:
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

## INTEGRATION WITH OTHER WORKFLOWS

### **Connection to SESSION_START**
- SESSION_END complements SESSION_START for complete session boundaries
- Time tracking bookends enable session duration analysis
- Learning capture builds on work accomplished since session start

### **Connection to Work Planning**
- Review session accomplishments
- Document effectiveness of work prioritization
- Note any insights for future sessions

### **Connection to Git Operations**
- SESSION_END commits all work directly to main
- Simple 4-step process ensures clean handoff
- No branch management or synchronization needed
- Focus on preserving work and session continuity

### **Connection to GITHUB_WORKFLOW**
- Ensure any issues created during session are properly configured
- Check that issues have appropriate labels, milestones, and epic assignments
- Verify commit messages provide clear context for changes

## SUCCESS METRICS

### **Session Effectiveness Indicators**
- Clear accomplishments documented in timelog
- Learning insights captured for future reference
- Outstanding work properly tracked in GitHub issues
- Session boundaries clearly marked for analysis

### **Quality Indicators**
- All timelog entries properly formatted
- No incomplete workflows or orphaned task tracking
- Relevant documentation updated with session insights
- Clear handoff state for future sessions

## ARCHIVAL CONSIDERATIONS

### **Long-term Session Data**
- Session patterns help identify productive workflows
- Learning accumulation guides platform evolution
- Time distribution analysis improves planning accuracy
- Session outcome tracking validates development approaches

### **Release Preparation**
- Before version releases, review accumulated session learnings
- Incorporate insights into release documentation
- Archive significant session outcomes with version history
- Use session data to improve development processes

---

*This workflow ensures systematic session termination that preserves knowledge, maintains data integrity, and enables continuous improvement of development processes.*