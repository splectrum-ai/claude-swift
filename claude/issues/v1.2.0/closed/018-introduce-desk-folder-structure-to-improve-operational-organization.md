---
type: task
github_id: 67
title: "Introduce desk folder structure to improve operational organization"
state: "open"
milestone: "v1.2.0"
labels: "[]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-30T15:12:29Z"
local_updated_at: "2025-07-30T08:56:39.515Z"
---

# Introduce desk folder structure to improve operational organization

Objective
## Cross-Repository Task

**Source**: claude-swift  
**Type**: workflow-update  
**Created**: 2025-07-17T06:38:42.803Z  
**Priority**: MEDIUM

---

## Description
Reorganize the claude/ directory structure by introducing a "desk" folder that groups all active operational directories together. This improves visual clarity and creates an intuitive workspace metaphor where the desk contains everything you're actively working with, while project/ contains archived/historical data.

## Priority: MEDIUM
**Justification:** Improves organization and usability of core operational infrastructure - inbox, outbox, cache, and audit logging

## Dependencies
**Blocks:** 
**Blocked by:** 
**Related:** Task attachments implementation, audit logging optimization

## Effort: M
**Estimate:** Requires systematic migration of directory references across all workflows, updating documentation, and ensuring compatibility

## Test Criteria
**How to verify completion:**
- [ ] New directory structure implemented: `claude/desk/` containing inbox/, outbox/, cache/, attachments/, current.log
- [ ] Historical audit logs remain in `claude/project/audit/` for archival
- [ ] All workflow files updated to use new paths (SESSION_START, SESSION_END, INBOX, OUTBOX, ISSUE_CACHE, etc.)
- [ ] CLAUDE.md updated with new directory structure references
- [ ] All existing functionality works with new paths
- [ ] Migration preserves all existing data without loss
- [ ] README.md in desk/ folder explains the workspace concept

## Work Area: v1.2.0
**Context:** Collaborative discussion on grouping core operational directories for better organization

## Technical Requirements

### New Directory Structure
```
claude/
├── desk/                     # Active workspace
│   ├── inbox/               # Incoming tasks to process
│   ├── outbox/              # Outgoing tasks to distribute
│   ├── cache/               # Working data (issues/milestones)
│   ├── attachments/         # Task attachments (when implemented)
│   ├── current.log          # Active session audit log
│   └── README.md            # Desk overview
├── project/
│   ├── audit/               # Archived audit logs
│   │   ├── session_2025-07-16T21-15-22Z.log
│   │   ├── session_2025-07-17T05-28-02Z.log
│   │   └── ...
│   └── ...
├── wow/                     # Ways of Working framework
└── local/                   # Local config
```

### Migration Requirements
- **Data Preservation**: All existing inbox/outbox/cache data must be preserved
- **Path Updates**: Update all workflow references from `claude/inbox/` to `claude/desk/inbox/`
- **Audit Log Migration**: Move `claude/project/audit/current/current.log` to `claude/desk/current.log`
- **Compatibility**: Ensure all existing workflows continue to function

### Affected Workflows
- SESSION_START, SESSION_END - audit log paths
- INBOX, OUTBOX - task processing paths
- ISSUE_CACHE - cache directory paths
- TASK_CREATE - outbox paths
- All audit logging functions

### Workspace Metaphor Benefits
- **Intuitive**: Everyone understands desk workspace concept
- **Natural Language**: "Check your desk", "clear your desk"
- **Operational Focus**: Active work vs archived storage
- **Visual Clarity**: All automation infrastructure grouped together

### Documentation Updates
- Update CLAUDE.md file path references
- Update workflow documentation
- Create desk/README.md explaining workspace concept
- Update audit configuration paths

## Implementation Notes
- Consider creating migration script to move existing data
- Update audit configuration to use new paths
- Test all workflows after migration
- Ensure gitignore rules still apply appropriately

---

## Dependencies
**Blocks:** None (unless specified in task content)
**Blocked by:** None (unless specified in task content)  
**Related:** Cross-repository communication

## Effort: M
**Estimate:** Cross-repository task processing

## Test Criteria
**How to verify completion:**
- [ ] Task requirements completed as specified
- [ ] Cross-repository coordination successful

## Work Area: cross-repository
**Context:** Task distributed via OUTBOX/INBOX workflow

*This issue was automatically created from an inbox task by the INBOX workflow.*

## Original GitHub Context
What needs to be accomplished?

## Current State
Description of current situation.

## Required Work
- Specific work to be done
- Systems or components affected
- Dependencies to consider

## Work Plan
Step-by-step approach to complete the task.

## Acceptance Criteria
- [ ] How to verify the work is complete
- [ ] Quality standards met
- [ ] Documentation updated if needed

## GitHub Discussion Summary
Key insights from GitHub comments (curated manually)

## Progress Log
- Date: Status update