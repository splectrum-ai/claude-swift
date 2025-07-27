---
type: task
github_id: 68
title: "Create UNREGISTER workflow for removing projects from claude-swift framework"
state: "open"
milestone: "v1.2.0"
labels: "[]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-17T07:30:20Z"
local_updated_at: "2025-07-27T07:58:02.791Z"
---

# Create UNREGISTER workflow for removing projects from claude-swift framework

Objective
## Cross-Repository Task

**Source**: claude-swift  
**Type**: workflow-update  
**Created**: 2025-07-17T07:20:07.542Z  
**Priority**: MEDIUM

---

## Description
Implement a comprehensive UNREGISTER workflow that cleanly removes projects from the claude-swift framework. This workflow should remove symlinks from the target project, remove the project from the registered projects registry, and provide validation to ensure complete cleanup.

## Priority: MEDIUM
**Justification:** Complements existing PROJECT_REGISTER workflow with proper cleanup capabilities for framework management

## Dependencies
**Blocks:** 
**Blocked by:** 
**Related:** PROJECT_REGISTER workflow, desk folder structure implementation

## Effort: M
**Estimate:** Well-defined scope - reverse of PROJECT_REGISTER workflow with validation and cleanup steps

## Test Criteria
**How to verify completion:**
- [ ] UNREGISTER workflow created at `claude/project/workflows/UNREGISTER.md`
- [ ] Trigger pattern: `unregister [org/repo] sesame` and `unregister sesame` (interactive)
- [ ] Removes CLAUDE.md and claude/wow symlinks from target project
- [ ] Removes project from `claude/project/registered-projects.json` registry
- [ ] Validates project exists and is registered before attempting removal
- [ ] Provides comprehensive validation of cleanup completion
- [ ] Handles error cases: project not found, not registered, symlinks already removed
- [ ] Includes rollback capability if unregistration fails partially
- [ ] Updates CLAUDE.md with new unregister trigger reference

## Work Area: v1.2.0
**Context:** Framework management capability for multi-project orchestration

## Technical Requirements

### Workflow Structure
- **Location**: `claude/project/workflows/UNREGISTER.md`
- **Trigger**: `unregister [org/repo] sesame` or `unregister sesame` (interactive)
- **Scope**: Orchestrator-only (like PROJECT_REGISTER)

### Core Functionality
1. **Repository Input and Validation**
   - Accept `org/repo` parameter or prompt interactively
   - Validate repository format and existence
   - Check if project is currently registered

2. **Symlink Removal**
   - Remove `CLAUDE.md` symlink from project root
   - Remove `claude/wow` symlink from project claude/ directory
   - Validate symlinks are removed successfully

3. **Registry Management**
   - Remove project entry from `claude/project/registered-projects.json`
   - Update registry file with proper JSON formatting
   - Validate registry update success

4. **Validation and Cleanup**
   - Verify all symlinks are removed
   - Confirm project removed from registry
   - Validate project directory structure remains intact
   - Provide comprehensive cleanup report

### Error Handling
- Project not found locally
- Project not in registry
- Symlinks already removed or broken
- Registry file corruption or access issues
- Partial cleanup failures with rollback

### Safety Features
- Confirmation prompt before removal
- Dry-run capability to preview changes
- Rollback mechanism for failed operations
- Preservation of project files and structure

### Integration Points
- **AUDIT_LOGGING**: Log all unregistration operations
- **PROJECT_REGISTER**: Reverse operation counterpart
- **KEYWORD_REGISTRY**: Add unregister trigger

## Implementation Notes
- Follow same pattern as PROJECT_REGISTER but in reverse
- Use absolute path awareness for symlink removal
- Ensure JSON registry manipulation is robust
- Provide clear success/failure feedback
- Include comprehensive validation steps

## Example Usage
```bash
# Direct mode
unregister jules-tenbos/splectrum sesame

# Interactive mode  
unregister sesame
# Prompts: Enter repository to unregister (format 'org/repo'):
```

## Validation Requirements
- Verify symlinks removed without affecting project files
- Confirm registry updated correctly
- Ensure project can be re-registered cleanly after unregistration
- Test error handling for various edge cases

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