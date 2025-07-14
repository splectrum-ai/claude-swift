# SESSION_START Workflow

## ⚠️ MANDATORY SESSION INITIALIZATION ⚠️

**MANDATORY SESSION INITIALIZATION**: When any new Claude session begins, Claude MUST execute this system check and initialization sequence.

**TRIGGER**: Any new Claude session initiation

**MANDATORY SYSTEM CHECK:**
1. **SCAN ALL MANDATORY RULES**: Review CLAUDE.md and workflow files for all rules marked "MANDATORY"
2. **VERIFY COMPLIANCE**: Check current repository state against each MANDATORY rule
3. **EXECUTE REQUIRED WORKFLOWS**: Run any workflows needed to achieve compliance
4. **CONFIRM CLEAN STATE**: Ensure all MANDATORY requirements satisfied before proceeding

**SESSION INITIALIZATION:**
1. **PREVIOUS SESSION RECOVERY**: Complete any incomplete SESSION_END workflows detected
2. **ISSUE CACHE VALIDATION**: Execute ISSUE_CACHE workflow for complete cache synchronization
3. **INBOX PROCESSING**: Check and process any received cross-repository tasks
4. **OUTBOX DISTRIBUTION**: For base repositories, optionally distribute pending outbox tasks
5. **ISSUE REVIEW**: Show current issues from cache and assess work priorities
6. **SESSION OUTCOME DOCUMENTATION**: Present session summary if previous session had high-value outcomes

## SYSTEM CHECK PROCEDURE

### Initialize Audit Logging
```bash
# Load Node.js audit functions
source claude/scripts/audit-functions.sh

# Start session with explicit logging
audit_log "SESSION_START" "workflow_start" "session_initialization" "" "Starting new session with mandatory system checks"
```

**MANDATORY Rule Scanning:**
```bash
audit_log "SESSION_START" "step" "mandatory_scan" "" "Scanning CLAUDE.md and workflow files for MANDATORY requirements"
```
- Search CLAUDE.md for all \"**MANDATORY\" labeled rules
- Search workflow files for MANDATORY requirements
- Verify current state compliance with each rule
- Execute workflows automatically to resolve any violations

**Common MANDATORY Rules:**
- Branch Policy: Clean repository state or completed PR cycle
- Workflow Logging: Proper audit log format and accountability
- File Path Specification: All references must specify exact paths
- Step-by-Step Execution: Single-step completion with choice points

## INBOX/OUTBOX INTEGRATION

### **Inbox Processing**
At session start, check for incoming cross-repository tasks:
```bash
audit_log "SESSION_START" "step" "inbox_check" "" "Checking for received cross-repository tasks"
```

**Inbox Check Procedure:**
1. **Scan Inbox Directory**: Check `claude/inbox/` for any pending task files
2. **Task Count Assessment**: If tasks found, show count and brief summary
3. **Mandatory Processing**: Automatically execute INBOX workflow if tasks present
4. **Session Integration**: Process as part of SESSION_START workflow execution
5. **Log Processing Results**:
   ```bash
   audit_log "SESSION_START" "step" "inbox_processing" "" "Processed $task_count inbox tasks into GitHub issues"
   ```

**Example Output:**
```
✓ Found 3 pending tasks in inbox:
  - 2025-07-14T10-30-00Z_claude-swift_update-workflows.md (from splectrum)
  - 2025-07-14T10-31-00Z_claude-swift_bug-fix.md (from spl1)
  - 2025-07-14T10-32-00Z_claude-swift_documentation.md (from InfoMetis)

Executing INBOX workflow to convert tasks to GitHub issues...
```

### **Outbox Distribution** 
For base repositories (with `projects/` directory), check for pending distribution:
```bash
audit_log "SESSION_START" "step" "outbox_check" "" "Checking for pending task distribution"
```

**Outbox Check Procedure:**
1. **Base Repository Detection**: Check if current repo has `projects/` directory
2. **Registry Validation**: Verify project registry exists and is populated
3. **Self-Targeted Task Check**: Check base repository's own `claude/outbox/` for self-targeted tasks
4. **Outbox Scanning**: Check registered projects for pending outbox tasks
5. **Distribution Summary**: Show task count and target repositories
6. **Mandatory Distribution**: Automatically execute OUTBOX workflow if tasks present
7. **Session Integration**: Process as part of SESSION_START workflow execution
8. **Log Distribution Results**:
   ```bash
   audit_log "SESSION_START" "step" "outbox_distribution" "" "Distributed $task_count tasks across $repo_count repositories"
   ```

**Example Output:**
```
✓ Base repository detected with 2 registered projects
✓ Found 6 pending tasks for distribution:
  - claude/outbox: 2 self-targeted tasks
  - projects/jules-tenbos/splectrum/outbox: 2 tasks
  - projects/sesameh/spl1/outbox: 2 tasks

Executing OUTBOX workflow to distribute tasks to target repositories...
```

**Skip Conditions:**
- **Not Base Repository**: Skip outbox check if no `projects/` directory
- **No Registry**: Skip if project registry doesn't exist
- **No Registered Projects**: Skip if registry is empty
- **No Pending Tasks**: Skip if no outbox tasks found

## SESSION RECOVERY

**Previous Session Verification:**
- Check current audit log for complete SESSION_END workflow
- Complete any incomplete workflows from previous session
- Resolve any outstanding compliance violations

## UNCOMMITTED WORK CHECK

**MANDATORY Uncommitted Work Assessment:**
1. **Check Git Status**: Run `git status` to identify any uncommitted changes
2. **Evaluate Significance**: Determine if changes represent meaningful work
3. **Apply Significance Rules**: Check audit log and change patterns
4. **Execute Appropriate Action**: SESSION_END for significant, approval for unclear, discard for insignificant

**Significance Detection Rules:**

**Automatically Significant (triggers SESSION_END):**
- Audit log contains work entries for current session (beyond SESSION_START)
- Code file changes (*.js, *.py, *.ts, *.go, etc.)
- Workflow file modifications (*.md in workflows/)
- Configuration file changes
- New files created
- Multiple files changed

**Requires User Approval:**
- Documentation-only changes (single file)
- README updates only
- Minor formatting changes
- Changes without corresponding audit log entries
- When significance is unclear

**Insignificant Changes (auto-discard):**
- Current audit log shows only SESSION_START entry
- Whitespace or formatting only
- No functional changes detected
- Temporary or test files

**Uncommitted Work Actions:**

1. **Significant Changes Detected**:
   ```
   Significant uncommitted work detected. Executing SESSION_END to preserve work...
   ```
   - Automatically execute SESSION_END workflow
   - Complete proper commit and session closure  
   - Resume SESSION_START after SESSION_END completes

2. **Unclear Significance**:
   ```
   Uncommitted changes detected:
   [Show git diff --stat output]
   
   Are these changes significant? (yes/no):
   ```
   - If yes: Execute SESSION_END workflow
   - If no: Discard with `git checkout .`

3. **Insignificant Changes**:
   ```
   Minor uncommitted changes detected. Discarding...
   ```
   - Discard without commit using `git checkout .`
   - Continue with SESSION_START

## INCOMPLETE WORKFLOW DETECTION

### **Previous Session Check**
At the start of each session, Claude MUST:
1. **Check audit log existence**: Verify `claude/project/audit/current/current.log` exists
   - If missing, check for recent session archives in `claude/project/audit/`
   - If session archive exists but no current.log, this indicates interrupted SESSION_END after git operations
   - Create fresh current.log: `echo "##APPEND_MARKER_UNIQUE##" > ./claude/project/audit/current/current.log`
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

## INTEGRATION WITH OTHER WORKFLOWS

### **Connection to SESSION_END**
- SESSION_START complements SESSION_END for complete session boundaries
- Time tracking bookends enable session duration analysis
- Learning capture builds on work accomplished since session start

### **Connection to PLANNED_VS_UNPLANNED**
- Initialize session with clear planned vs unplanned work classification
- Set expectations for session scope and outcomes
- Align session goals with project planning framework

### **Connection to GIT_WORKFLOW**
- SESSION_START uses GIT_WORKFLOW patterns for git operations
- Implements the MANDATORY 13-step sequence to prevent sync issues
- Includes branch synchronization that eliminates drift problems
- Maintains separation of concerns: session management vs detailed git implementation

### **Connection to ISSUE_CACHE Workflow**
- **Automatic Cache Sync**: Executes complete ISSUE_CACHE workflow during session initialization
- **Gap Detection**: Identifies and caches missing issues since last session
- **Cache Cleanup**: Removes closed issues and milestones from local cache
- **Performance Optimization**: Ensures cache is current for fast issue queries during session
- **No Logic Duplication**: Delegates all cache management to specialized ISSUE_CACHE workflow

### **Issue Cache Integration Step**
```bash
audit_log "SESSION_START" "step" "issue_cache_validation" "" "Executing ISSUE_CACHE workflow for complete cache sync"
```

**Implementation:**
```bash
echo "Validating and updating issue cache..."
# Execute complete ISSUE_CACHE workflow (issue sesame)
# - Gap detection: Add missing issues
# - Cache cleanup: Remove closed issues  
# - Milestone sync: Update milestone data
# - Metadata update: Record sync timestamp
audit_log "SESSION_START" "step" "issue_cache_validation" "" "Cache validation completed - $new_issues new issues, $closed_issues closed issues processed"
echo "✓ Cache validation completed"
```

### **Session Completion Logging**
```bash
audit_log "SESSION_START" "workflow_complete" "session_initialization" "" "SESSION_START workflow completed - session initialized with clean state and current caches"
```

### **Connection to INBOX/OUTBOX Workflows**
- **INBOX Integration**: Automatically checks for received cross-repository tasks at session start
- **OUTBOX Integration**: For base repositories, scans for pending task distribution
- **Mandatory Processing**: Automatically executes INBOX and OUTBOX workflows when tasks are detected
- **Session Automation**: Task processing is part of SESSION_START workflow execution, not optional
- **Issue Creation**: INBOX processing creates GitHub issues that are automatically cached for prioritization

### **Connection to PROJECT_REGISTER**
- Uses project registry to discover registered projects for outbox scanning
- Validates workspace configuration before attempting task distribution
- Enables multi-project coordination through session initialization

### **Connection to GITHUB_WORKFLOW**
- Verify any issues assigned for session work are properly configured
- Check that current milestone and epic assignments are accurate
- Prepare GitHub integration for session activities

## SUCCESS METRICS

### **Session Initialization Indicators**
- Clear session goals established from cached issue analysis
- Previous session recovery completed successfully
- Repository state verified as clean and compliant
- Session boundaries clearly marked for analysis

### **Quality Indicators**
- All audit log entries properly formatted
- No incomplete workflows or orphaned task tracking from previous session
- Relevant documentation reflects current state
- Clear starting point established for session work

## ARCHIVAL CONSIDERATIONS

### **Session Continuity**
- Session patterns help identify productive initialization workflows
- Learning accumulation guides session preparation
- Time distribution analysis improves session planning
- Session outcome tracking validates preparation approaches

### **Development Process Improvement**
- Before version releases, review accumulated session initialization data
- Incorporate insights into development workflow documentation
- Archive significant session preparation outcomes with version history
- Use session data to improve development processes

---

*This workflow ensures systematic session initialization that preserves knowledge, maintains data integrity, and enables continuous improvement of development processes.*