[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# TASK_CREATE

## Overview
Interactive task creation workflow for cross-repository communication. Creates properly formatted tasks with metadata and saves them to outbox for distribution.

## Trigger
**User-Friendly**: `task sesame`, `task [org/repo] sesame`, `task . sesame`
**Technical**: `TASK_CREATE`

## Purpose
- Create standardized cross-repository tasks
- Guide interactive task metadata collection  
- Generate timestamp-based filenames
- Save to outbox for OUTBOX workflow distribution

## Prerequisites
- Local repository with outbox capability
- Clear task description and requirements

## Scope
**Universal**: Can be executed from any project

## Workflow Steps

### 1. Collect Task Details Through Discussion
```bash
claude/wow/scripts/audit-manage log "TASK_CREATE" "workflow_start" "task_creation" "" "Starting task creation workflow"
```

**Claude collects task information conversationally:**
- Target repository (org/repo, repo-name, or current)
- Task title and description
- Priority (HIGH/MEDIUM/LOW) with justification
- Effort estimate (S/M/L/XL) with reasoning
- Task type and work area
- Dependencies (blocks, blocked by, related issues)
- Test criteria for completion verification
- Additional context

### 2. Generate Task Content from Template
**Claude fills template with collected information:**
- Load template from `claude/wow/templates/task-template.md`
- Replace placeholders with actual values
- Generate proper YAML frontmatter and content structure

### 3. Create Task File
```bash
# Pipe completed task content to creation script
echo "$TASK_CONTENT" | claude/wow/scripts/task-create

claude/wow/scripts/audit-manage log "TASK_CREATE" "workflow_complete" "task_creation" "" "Task creation completed successfully"
```

## Template-Based Approach
- **Discussion-driven**: Natural conversation to gather requirements
- **Template consistency**: Standardized format via `task-template.md` 
- **Simple script**: Handles only file operations and timestamps
- **Flexible workflow**: Claude adapts questions based on context
- **Quality control**: Claude validates completeness before creation

## Task File Structure
**Tasks consist of transport header + issue payload:**

### Transport Header (Required)
```yaml
---
target: jules-tenbos/splectrum          # Destination repository
source: splectrum/spl1                  # Source repository
created: 2025-07-30T04:23:01.838Z      # Creation timestamp
description: Task created from splectrum/spl1 issue #28 - Title
---
```

### Payload: Issue Content
**Two scenarios:**

#### 1. Existing Issue → Task
- Use existing issue content "as is" (already follows template)
- Include complete issue frontmatter and content

#### 2. New Task → Issue  
- Create issue content using appropriate template (feature/bug/task)
- Use `issue-manage create <type> <title> --dry-run` to generate template content
- ✅ **Available**: `issue-manage` supports `--dry-run` flag for content generation without saving

### Example Task File (Existing Issue)
```markdown
---
target: jules-tenbos/splectrum
source: splectrum/spl1
created: 2025-07-30T04:23:01.838Z
description: Task created from splectrum/spl1 issue #28 - Git Workflow Enforcement
---

---
type: feature
github_id: null
title: "Git Workflow Enforcement Engine Prototype"
state: open
milestone: unassigned
labels: ["enhancement","SE"]
priority: medium
estimated_effort: TBD
github_updated_at: null
local_updated_at: null
---

## Problem Statement
Current git workflows require manual execution...
```

### Filename Format
`TIMESTAMP_target-repo_task-name.md`

## Usage Examples

### Creating Tasks from Existing Issues
```bash
# Interactive mode (prompts for target)
task sesame

# Target specific repository
task org/project sesame

# Target current repository
task . sesame
```

### Creating New Tasks with Generated Issue Content
```bash
# Generate issue content for task payload
ISSUE_CONTENT=$(./claude/wow/scripts/issue-manage create feature "New Feature Name" --dry-run 2>/dev/null | sed -n '/--- GENERATED ISSUE CONTENT ---/,/--- END CONTENT ---/p' | sed '1d;$d')

# Create task with transport header + generated payload
cat > claude/outbox/task-file.md << EOF
---
target: jules-tenbos/splectrum
source: splectrum/spl1
created: $(date -Iseconds)
description: New task - Feature Name
---

$ISSUE_CONTENT
EOF
```

## Integration Points
- **OUTBOX**: Distributes created tasks to target repositories
- **INBOX**: Target repositories process delivered tasks
- **Issue tracking**: Tasks become GitHub issues via INBOX workflow

---

*Simplified task creation workflow that delegates implementation to scripts.*