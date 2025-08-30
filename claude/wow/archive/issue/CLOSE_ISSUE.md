# CLOSE_ISSUE Sub-Workflow

## Purpose

## Trigger
Called from main ISSUE workflow when user requests issue closure.

## Workflow Steps

### 1. Execute Issue Closure Script
```bash

# Execute issue closure with comment and logging
claude/wow/scripts/close-issue [ISSUE_NUMBER] "[CLOSURE_COMMENT]"

```

## Script Integration

The issue closure process delegates to `claude/wow/scripts/close-issue` which handles:
- Issue validation and permissions checking
- Comment addition and issue closure via GitHub API
- Error handling for invalid numbers, permissions, and API failures

---
*Sub-workflow of ISSUE.md - handles issue closure operations*