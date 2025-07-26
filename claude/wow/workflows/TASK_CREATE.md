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
claude/wow/scripts/audit-log "TASK_CREATE" "workflow_start" "task_creation" "" "Starting task creation workflow"
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

claude/wow/scripts/audit-log "TASK_CREATE" "workflow_complete" "task_creation" "" "Task creation completed successfully"
```

## Template-Based Approach
- **Discussion-driven**: Natural conversation to gather requirements
- **Template consistency**: Standardized format via `task-template.md` 
- **Simple script**: Handles only file operations and timestamps
- **Flexible workflow**: Claude adapts questions based on context
- **Quality control**: Claude validates completeness before creation

## Task Template Structure
**Generated files follow standardized format:**
- **Metadata header**: YAML frontmatter with source/target/priority/effort
- **Task sections**: Description, dependencies, test criteria, work area
- **Filename format**: `TIMESTAMP_target-repo_task-name.md`

## Usage Examples
```bash
# Interactive mode (prompts for target)
task sesame

# Target specific repository
task org/project sesame

# Target current repository
task . sesame
```

## Integration Points
- **OUTBOX**: Distributes created tasks to target repositories
- **INBOX**: Target repositories process delivered tasks
- **Issue tracking**: Tasks become GitHub issues via INBOX workflow

---

*Simplified task creation workflow that delegates implementation to scripts.*