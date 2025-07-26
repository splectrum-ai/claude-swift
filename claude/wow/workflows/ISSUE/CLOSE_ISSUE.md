# CLOSE_ISSUE Sub-Workflow

## Purpose
Close specific GitHub issues with proper comment and audit logging.

## Trigger
Called from main ISSUE workflow when user requests issue closure.

## Workflow Steps

### 1. Execute Issue Closure Script
```bash
claude/wow/scripts/audit-log "CLOSE_ISSUE" "workflow_start" "issue_closure" "" "Starting CLOSE_ISSUE workflow"

# Execute issue closure with comment and logging
claude/wow/scripts/close-issue [ISSUE_NUMBER] "[CLOSURE_COMMENT]"

claude/wow/scripts/audit-log "CLOSE_ISSUE" "workflow_complete" "issue_closure" "" "Issue closure completed successfully"
```

## Script Integration

The issue closure process delegates to `claude/wow/scripts/close-issue` which handles:
- Issue validation and permissions checking
- Comment addition and issue closure via GitHub API
- Audit logging with issue details
- Error handling for invalid numbers, permissions, and API failures

---
*Sub-workflow of ISSUE.md - handles issue closure operations*