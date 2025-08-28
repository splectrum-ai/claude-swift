---
type: task
github_id: 59
title: "Create Audit Reference and Remove AUDIT_LOGGING Workflow"
state: "closed"
milestone: "unassigned"
labels: "[]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-16T07:36:29Z"
local_updated_at: "2025-07-30T17:46:33.930Z"
---

## Cross-Repository Task

**Source**: claude-swift  
**Type**: enhancement  
**Created**: 2025-07-15T04-59-17-205Z  
**Priority**: HIGH
**Effort**: M

---


# Create Audit Reference and Remove AUDIT_LOGGING Workflow

## Description
Replace the AUDIT_LOGGING workflow with a proper audit function reference document and clean up workflow directory structure. The AUDIT_LOGGING workflow has become obsolete since we now have proven Node.js audit functions with explicit logging patterns.

This consolidates audit guidance with the implementation and removes confusion between executable workflows and reference documentation.

## Priority: HIGH
**Justification:** Improves developer experience by eliminating fake "workflows" and providing clear guidance where developers expect to find it. Essential for clean workflow architecture.

## Dependencies
**Blocks:** Workflow development guide creation, clean workflow directory structure
**Blocked by:** None (builds on existing Node.js audit implementation)
**Related:** Explicit audit logging implementation (completed)

## Effort: M
**Estimate:** Medium effort to consolidate guidance, update references, and ensure smooth transition from workflow to reference.

## Test Criteria
**How to verify completion:**
- [ ] Created `claude/scripts/AUDIT_REFERENCE.md` with comprehensive function reference
- [ ] Included audit logging patterns for workflow development
- [ ] Removed `claude/wow/workflows/AUDIT_LOGGING.md`
- [ ] Updated all workflow references to point to new audit reference location
- [ ] Updated KEYWORD_REGISTRY to remove AUDIT_LOGGING workflow trigger
- [ ] Verified no broken links or references to old audit workflow
- [ ] All existing workflows continue to use audit functions correctly
- [ ] Documentation explains when and how to add audit logging to workflows

## Work Area: workflow-optimization
**Context:** Part of streamlining workflow documentation to distinguish between executable workflows and reference materials. Audit logging is tooling, not a workflow.

### Implementation Steps:
1. **Create audit reference**: Move function documentation to `claude/scripts/AUDIT_REFERENCE.md`
2. **Add workflow guidance**: Include patterns for when/how to add audit logging
3. **Remove old workflow**: Delete `claude/wow/workflows/AUDIT_LOGGING.md`
4. **Update references**: Fix all links and keyword registry entries
5. **Validate workflows**: Ensure existing workflows still use audit functions correctly

This creates a cleaner separation between executable workflows and developer reference materials.

🤖 Generated with [Claude Code](https://claude.ai/code)

---

## Dependencies
**Blocks:** None (unless specified in task content)
**Blocked by:** None (unless specified in task content)  
**Related:** Cross-repository communication

## Test Criteria
See task content above for specific verification steps.

🤖 Generated with [Claude Code](https://claude.ai/code) via INBOX workflow

Cross-repository task from claude-swift processed automatically.
