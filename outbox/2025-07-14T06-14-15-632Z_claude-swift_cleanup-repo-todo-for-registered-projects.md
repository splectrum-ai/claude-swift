---
source: sesameh/claude-swift
target: claude-swift
created: 2025-07-14T06:14:15.632Z
priority: HIGH
effort: M
type: workflow-update
work_area: v1.1.0
---

# Create cleanup task for registered projects repo todo removal

## Description
The repo todo file is located in claude/project/ folder in the claude-swift template. We need to create a cleanup task for all registered projects to remove this file since it should only exist in the base template. Additionally, this cleanup task should be added as an initial task to be sent to all newly registered repositories.

## Priority: HIGH
**Justification:** Critical for maintaining clean project separation and preventing confusion between template machinery and project-specific content

## Dependencies

## Effort: M
**Estimate:** Medium complexity requiring updates to registration process and distribution to existing projects

## Test Criteria
**How to verify completion:**
- [ ] Cleanup task created and distributed to all registered projects
- [ ] Registration process updated to include cleanup task for new projects
- [ ] claude/project/todo.md removed from all registered projects
- [ ] Template remains unchanged in base repository

## Work Area: v1.1.0
**Context:** Cross-repository task created via TASK_CREATE workflow

🤖 Generated with [Claude Code](https://claude.ai/code)