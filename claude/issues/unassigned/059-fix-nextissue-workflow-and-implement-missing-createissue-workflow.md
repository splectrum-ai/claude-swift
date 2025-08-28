---
type: bug
github_id: 42
title: "Fix NEXT_ISSUE workflow and implement missing CREATE_ISSUE workflow"
state: "closed"
milestone: "Claude Swift as root, with sub project work bench"
labels: "[]"
priority: high
estimated_effort: TBD
github_updated_at: "2025-07-13T17:01:23Z"
local_updated_at: "2025-07-30T17:46:39.100Z"
github_milestone: "Claude Swift as root, with sub project work bench"
---

## Summary
The NEXT_ISSUE workflow contains outdated references to non-existent automation scripts, and the documented CREATE_ISSUE workflow (triggered by `issue sesame`) is missing its implementation file.

## Priority: HIGH
**Justification:** Core workflow functionality is broken/missing, affecting daily development efficiency

## Dependencies
**Blocks:** Daily issue selection and creation workflows
**Blocked by:** None - ready to implement
**Related:** Issue structure documentation in `claude/wow/docs/issue-structure-and-prioritization.md`

## Effort: M
**Estimate:** Half-day to update NEXT_ISSUE and create CREATE_ISSUE workflow with proper metadata integration

## Test Criteria
**How to verify completion:**
- [ ] NEXT_ISSUE workflow uses current `gh issue list` approach instead of non-existent scripts
- [ ] NEXT_ISSUE workflow properly references milestone-based prioritization
- [ ] CREATE_ISSUE workflow file exists and implements `issue sesame` functionality
- [ ] CREATE_ISSUE workflow includes proper metadata template (Priority, Effort, Dependencies)
- [ ] Both workflows integrate with existing issue structure documentation
- [ ] Test `next sesame` and `issue sesame` triggers work correctly

## Work Area: CORE
**Context:** Core workflow infrastructure that affects daily development operations

## Current Issues
1. **NEXT_ISSUE.md** references `node status/project-automation.js recommend` which doesn't exist
2. **NEXT_ISSUE.md** had hardcoded version references instead of milestone-based approach
3. **CREATE_ISSUE workflow missing** - `issue sesame` trigger documented but no implementation file
4. **Metadata integration gap** - CREATE_ISSUE needs to enforce structure for NEXT_ISSUE recommendations

## Implementation Plan
1. Complete NEXT_ISSUE workflow fixes (milestone-based, remove script references)
2. Create CREATE_ISSUE.md workflow file implementing `issue sesame` functionality
3. Ensure CREATE_ISSUE includes metadata template from issue-structure-and-prioritization.md
4. Add CREATE_ISSUE to KEYWORD_REGISTRY.md
5. Test both workflows work correctly

## Labels
- `enhancement` - Workflow infrastructure improvement
- `HIGH` - Critical functionality fix

🤖 Generated with [Claude Code](https://claude.ai/code)
