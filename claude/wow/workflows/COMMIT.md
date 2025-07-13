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
```
COMMIT|step|change_assessment||Analyze current changes and git status
```

**Actions:**
1. Run `git status` to identify changed files
2. Run `git diff --stat` to see scope of changes
3. Check for untracked files that should be included
4. Validate changes represent a logical commit unit

### 2. Issue Detection
```
COMMIT|step|issue_detection||Scan changes and context for resolved issues
```

**Actions:**
1. Check recent audit log entries for issue references
2. Search commit message context for issue numbers (#123)
3. Analyze changed files against open GitHub issues
4. Identify issues that this work resolves

### 3. Commit Message Generation
```
COMMIT|step|message_generation||Generate descriptive commit message
```

**Format varies by context:**

**Manual Commit (`commit sesame`):**
```
Brief summary of changes

- Detailed implementation point
- Another key change
- Reference to methodology or approach used

[Context: Why this change was needed]
[Closes #123] (if issue resolved)

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**SESSION_END Integration:**
```
Session complete: [session summary]

- Key accomplishments from session
- Major changes implemented
- Issues resolved during session

[Session context and learnings]
[Closes #123, #124] (if issues resolved)

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4. Commit Execution
```
COMMIT|step|commit_execution||Stage, commit, and push changes
```

**Actions:**
```bash
# Stage all changes
git add .

# Commit with generated message
git commit -m "Generated commit message"

# Push to main
git push origin main
```

### 5. Issue Closure
```
COMMIT|step|issue_closure||Close resolved GitHub issues
```

**Actions:**
1. For each detected resolved issue:
   ```bash
   gh issue close #123 -c "Resolved in commit: [commit-hash]"
   ```
2. Add comment explaining resolution
3. Log issue closure in audit log

## Interactive Prompts

### Issue Resolution Confirmation
When potential issue resolution is detected:
```
Detected potential issue resolution:
- Issue #123: "Bug in authentication flow"
- Changes: Modified auth.js, added error handling

Does this commit resolve issue #123? (yes/no):
```

### Commit Message Review
```
Generated commit message:
---
Fix authentication flow bug

- Updated token validation logic
- Added proper error handling for expired tokens
- Improved user feedback for auth failures

Context: Resolves intermittent login failures reported by users
Closes #123

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
---

Proceed with this commit? (yes/edit/cancel):
```

## Smart Detection Patterns

### Issue Reference Detection
- **Audit log scanning**: Look for recent `#123` references
- **File change analysis**: Match changed files to issue descriptions
- **Commit context**: Analyze work done against open issues
- **User confirmation**: Always confirm before closing issues

### Commit Message Intelligence
- **Change scope**: Single file vs multiple files
- **Change type**: feat/fix/docs/refactor based on changes
- **Implementation details**: Extract key changes from diffs
- **Context preservation**: Include why change was needed

## Error Handling

### No Changes Detected
```
No changes detected for commit.
Run 'git status' to verify current state.
```

### Merge Conflicts
```
Merge conflicts detected. Resolve conflicts before committing:
git status  # See conflicted files
# Resolve conflicts manually
git add .   # Stage resolved files
commit sesame  # Retry commit
```

### Push Failures
```
Push failed. Syncing with remote:
git pull origin main --rebase
# Resolve any conflicts
git push origin main
```

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

### Audit Logging Integration
- All commit operations logged in audit trail
- Issue closures recorded for accountability
- Commit hashes preserved for reference

## Success Criteria
- All changes staged and committed successfully
- Descriptive commit message generated
- Resolved issues automatically closed
- Changes pushed to main branch
- Audit trail complete

## Usage Examples

### Simple Commit
```
commit sesame
# Result: Analyzes changes, generates message, commits and pushes
```

### With Issue Resolution
```
# After working on issue #123
commit sesame
# Result: Commits changes and closes issue #123 automatically
```

### Multiple Issues
```
# After fixing bugs #123 and #124
commit sesame
# Result: Commits changes and closes both issues with references
```

## Benefits
- **Eliminates manual commit composition**
- **Ensures consistent commit format**
- **Automatically manages issue lifecycle**
- **Provides intelligent change detection**
- **Maintains clean git history**
- **Integrates with existing workflows**

---

*Streamlined commit workflow optimized for AI-assisted development with automatic issue management.*