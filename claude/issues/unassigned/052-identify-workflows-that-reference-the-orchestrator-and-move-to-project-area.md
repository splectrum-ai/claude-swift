---
type: feature
github_id: 49
title: "Identify workflows that reference the orchestrator and move to project area"
state: "closed"
milestone: "unassigned"
labels: "["enhancement","v1.1.0"]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-14T15:36:46Z"
local_updated_at: "2025-07-30T17:46:39.095Z"
---

source: sesameh/claude-swift
target: claude-swift
created: 2025-07-14T18:57:12.789Z
priority: HIGH
effort: L
type: workflow-update
work_area: v1.1.0
---

# Identify workflows that reference the orchestrator and move to project area

## Description
Identify workflows that reference the orchestrator (claude-swift, the repo with the projects folder) and move the workflows into the project area. This needs analysis first before implementation.

## Priority: HIGH
**Justification:** Critical architectural cleanup to properly separate orchestrator-specific workflows from generic WoW framework

## Dependencies

## Effort: L
**Estimate:** Analysis-focused task with well-defined scope and clear migration patterns

## Test Criteria
**How to verify completion:**
- [ ] All workflows analyzed for orchestrator references
- [ ] Orchestrator-specific workflows identified and categorized
- [ ] Migration plan designed for moving workflows to project area
- [ ] Implementation approach validated before execution
- [ ] Clear separation between generic WoW and orchestrator-specific functionality

## Work Area: v1.1.0
**Context:** Architectural improvement to properly organize workflows by scope - generic framework vs orchestrator-specific functionality

🤖 Generated with [Claude Code](https://claude.ai/code)
