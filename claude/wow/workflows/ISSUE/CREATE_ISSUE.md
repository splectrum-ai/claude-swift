[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# CREATE_ISSUE

## Overview
Manual issue creation workflow with standardized metadata structure to ensure compatibility with NEXT_ISSUE recommendations and project organization.

## Trigger
**User-Friendly**: `issue sesame` (manual issue creation)
**Technical**: `CREATE_ISSUE`

## Workflow Steps

### 1. Collect Issue Details Through Discussion
**Claude collects issue information conversationally:**
- Title and description
- Priority (HIGH/MEDIUM/LOW) with justification
- Effort estimate (S/M/L/XL) with reasoning
- Dependencies (blocks/blocked by/related)
- Work area and test criteria

### 2. Create Issue with Standardized Template
**Claude creates issue using collected information:**
```bash
claude/wow/scripts/audit-log "CREATE_ISSUE" "workflow_start" "issue_creation" "" "Starting CREATE_ISSUE workflow"

# Create issue with standardized metadata template
claude/wow/scripts/create-issue-interactive

claude/wow/scripts/audit-log "CREATE_ISSUE" "workflow_complete" "issue_creation" "" "Issue creation completed successfully"
```

## Script Integration

The issue creation process delegates to `claude/wow/scripts/create-issue-interactive` which handles:
- Conversational collection of issue information (title, description, priority, effort, dependencies)
- Template-based issue creation using `claude/wow/templates/issue-template.md`
- GitHub issue creation with standardized metadata structure
- Milestone assignment and audit logging

**Usage**: Claude collects information through discussion, then calls the script with environment variables containing the collected data.

---
*Sub-workflow of ISSUE.md - handles interactive issue creation*