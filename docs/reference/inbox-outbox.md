# Inbox/Outbox System

## Overview

Cross-repository task distribution system enabling communication between registered projects.

## Outbox Processing

### Script: `outbox-process`

**When registered projects exist**:
- Collects tasks from all registered projects' outbox folders
- Routes tasks to target repositories' inbox folders
- Cleans up distributed tasks

**When no registered projects exist**:
- Creates tasks in local outbox for future collection

### Task Creation

```bash
task sesame          # Interactive mode
task . sesame        # Current repository
task [repo] sesame   # Specific repository
```

Creates `.md` files in `claude/outbox/[target-repo]/`

## Inbox Processing

### Script: `inbox-process`

Converts inbox tasks to GitHub issues:
- Reads tasks from `claude/inbox/`
- Creates GitHub issues with proper milestone assignment
- Moves processed tasks to `claude/inbox/processed/`

## Task Format

```markdown
# Task Title

**Type**: feature|bug|enhancement|task
**Priority**: low|medium|high|critical
**Target Milestone**: v1.2.0 (optional)

## Description
Task details...
```

## Directory Structure

```
claude/
├── inbox/           # Received tasks
│   └── processed/   # Completed tasks
└── outbox/          # Tasks to send
    └── [repo-name]/ # Target repository folders
```