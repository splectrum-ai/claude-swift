[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# COMMIT Workflow

## Overview
Intelligent commit workflow that stages changes, creates descriptive commit messages, and automatically closes GitHub issues if work resolves them.

## Trigger
**User-Friendly**: `commit sesame`
**Technical**: `COMMIT`
**SESSION_END Integration**: Automatically called during SESSION_END step 3

## Purpose
- Stage all current changes for commit
- Generate intelligent commit message based on changes and context
- Detect if work resolves any GitHub issues
- Commit changes with proper attribution
- Push to main branch
- Close resolved issues automatically

## Dual Context Support
- **Manual Usage**: `commit sesame` for mid-session commits
- **SESSION_END Integration**: Automatic execution during session closure with session-aware messaging

## Prerequisites
- Clean working directory or meaningful changes
- GitHub CLI (`gh`) configured for issue management
- Current work represents a logical commit unit

## Workflow Steps

### 1. Change Assessment

**Actions:**
1. Run `claude/wow/scripts/git-manage status` to get comprehensive repository status
2. Analyze changed files, staged/unstaged status, and scope of changes
3. Check for untracked files that should be included
4. Validate changes represent a logical commit unit

### 2. Issue Detection

**Actions:**
1. Search commit message context for issue numbers (#XX)
2. Analyze changed files against open GitHub issues
3. Identify issues that this work resolves

### 3. Commit Message Generation

**Issue-Driven Commit Message Format:**

**Standard Development Commit:**
```
[Issue #XX] Brief action summary

- Key implementation detail
- Workflow step completed
- Technical approach if non-obvious

Context: [Business reason from issue]
Closes #XX

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Session Boundary Commits:**
```
[Session] Initialize/Complete development session

- Key accomplishments or setup actions
- Issues resolved: #XX, #YY
- Workspace state changes

Context: [Session purpose or completion summary]
Workflow: SESSION_START/SESSION_END

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Workflow Action Commits:**
```
[Workflow] Brief workflow action summary

- Configuration changes made
- System state modifications
- Dependencies updated

Context: [Why workflow action was needed]
Workflow: [WORKFLOW_NAME]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4. Commit Execution

**Actions:**
```bash
# Execute automated commit script with generated message
claude/wow/scripts/git-manage commit --message "Generated commit message"

# The commit script automatically handles:
# - Staging all changes (git add .)
# - Creating commit with message
# - Pushing to main branch
# - Issue detection and closure
# - Error handling and recovery
```

### 5. Issue Closure

**Actions:**
The automated commit script handles issue closure automatically:
1. **Issue Detection**: Scans commit context for resolved issues
2. **GitHub API Integration**: Uses `claude/wow/scripts/issue-manage` to close issues
3. **Cache-first closure**: Updates local cache, then syncs to GitHub

**Manual issue closure** (if needed):
```bash
# Close specific issue with commit reference
claude/wow/scripts/issue-manage close XX
```

### 6. Workflow Completion

## Smart Detection Patterns

### Issue Reference Detection
- **File change analysis**: Match changed files to issue descriptions
- **Commit context**: Analyze work done against open issues
- **User confirmation**: Always confirm before closing issues

### Commit Message Guidelines

**Core Principle**: Every commit resolves an atomic issue. The commit message captures essential issue context concisely before the issue is closed and removed.

**Content Rules:**

**1. Subject Line:**
- Start with `[Issue #XX]` for traceability
- Use imperative mood: "Fix", "Add", "Update", "Remove"
- Max 50 characters after issue prefix
- Be specific: "Fix user login timeout" not "Fix bug"

**2. Implementation Details:**
- 2-4 bullet points maximum
- Focus on **what changed**, not what stayed the same
- Include technical approach only if non-obvious
- Skip obvious changes (like "updated tests")

**3. Context Line:**
- Single line explaining **business need** from issue description
- Format: `Context: [reason from issue]`
- Essential since issue will be deleted

**4. Workflow Attribution:**
- Add `Workflow: SESSION_START` for setup commits
- Add `Workflow: RELEASE` for release-related commits
- Skip for obvious workflows (COMMIT, normal development)

**5. Git History Integration:**
- Git commit timestamp provides complete timeline
- Every workflow action that makes changes = commit
- Commit messages serve as complete development history

## Error Handling

The `commit` script handles common scenarios automatically:
- **No changes**: Exits gracefully with status message
- **Merge conflicts**: Provides clear guidance on resolution steps
- **Push failures**: Attempts sync and retry with recovery options

## Integration Points

### SESSION_END Integration
- **Automatic Execution**: COMMIT workflow is automatically called during SESSION_END step 3
- **Session-Aware Messaging**: Generates session summary commits instead of generic messages
- **Complete Closure**: Ensures all session work is committed and issues are properly closed
- **Zero Manual Effort**: Issue tracking happens automatically at session end

### Issue Workflow Integration
- Detects when work resolves GitHub issues
- Provides clean closure with commit references
- Maintains issue tracking accuracy

- All commit operations tracked in git history
- Issue closures recorded in commit messages
- Commit hashes provide complete traceability

## Success Criteria
- All changes staged and committed successfully
- Descriptive commit message generated
- Resolved issues automatically closed
- Changes pushed to main branch
- Complete git history maintained

## Usage Examples

### Standard Development Commit
```
# After completing issue #42
`commit sesame`
# Result: 
# [Issue #42] Fix user session timeout
#
# - Increase session duration to 60 minutes
# - Add activity-based refresh logic
#
# Context: Users experiencing frequent logouts
# Closes #42
```

### Session Boundary Commit
```
# At session start/end
`commit sesame`
# Result:
# [Session] Complete development session
#
# - Issues #42, #43 resolved
# - Workspace cleaned for next session
#
# Context: End development session with 2 issues completed
# Workflow: SESSION_END
```

### Workflow Action Commit
```
# After configuration changes
`commit sesame`
# Result:
# [Workflow] Update project registration
#
# - Add splectrum/infometis to registry
# - Create framework symlinks
#
# Context: Register new project for claude-swift management
# Workflow: PROJECT_REGISTER
```

## Benefits
- **Eliminates manual commit composition** - Automated message generation
- **Ensures consistent commit format** - Standardized issue-driven format
- **Automatically manages issue lifecycle** - Close and delete issues after commit
- **Maintains clean git history** - Each commit represents atomic work unit
- **Preserves issue context** - Business reason captured before issue deletion
- **Integrates with existing workflows** - Session and workflow boundary tracking

---

*Streamlined commit workflow optimized for AI-assisted development with automatic issue management.*