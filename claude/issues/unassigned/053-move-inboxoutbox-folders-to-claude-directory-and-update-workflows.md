---
type: bug
github_id: 48
title: "Move inbox/outbox folders to claude directory and update workflows"
state: "closed"
milestone: "unassigned"
labels: "["bug"]"
priority: high
estimated_effort: TBD
github_updated_at: "2025-07-14T10:47:52Z"
local_updated_at: "2025-07-30T17:46:39.096Z"
---

The inbox / outbox folders are currently in the root of the repo. This is a mistake. Move the inbox / outbox folders to claude and update the affected workflows to reflect this. The current structure has inbox/ and outbox/ folders at the root level, but they should be organized under the claude/ directory to maintain consistency with the claude framework organization pattern.

## Priority: MEDIUM
**Justification:** Organizational improvement for consistency with claude framework structure - affects code organization but not functionality

## Effort: M
**Estimate:** Multiple workflow files need path updates, testing required to ensure all references work correctly

## Test Criteria
**How to verify completion:**
- [ ] inbox/ folder moved from root to claude/inbox/
- [ ] outbox/ folder moved from root to claude/outbox/
- [ ] All workflow files updated to reference new paths (claude/inbox/, claude/outbox/)
- [ ] INBOX workflow references updated to claude/inbox/
- [ ] OUTBOX workflow references updated to claude/outbox/
- [ ] TASK_CREATE workflow references updated to claude/outbox/
- [ ] Any other workflow files referencing these directories updated
- [ ] README files in moved directories updated if needed
- [ ] All existing functionality verified working with new paths
- [ ] No broken path references remain in codebase

## Work Area: infrastructure
**Context:** Bug report task for maintaining consistent claude framework organization

🤖 Generated with [Claude Code](https://claude.ai/code)
