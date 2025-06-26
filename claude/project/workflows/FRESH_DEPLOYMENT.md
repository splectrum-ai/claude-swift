[← Back to Claude-Swift Home](../../../README.md)

# FRESH_DEPLOYMENT Sub-Workflow

## Purpose
Deploy claude-swift template system to a fresh project with no existing Claude Code structure.

**Note:** This is a sub-workflow called by the main DEPLOYMENT workflow router.

## Trigger Keywords
- Called via DEPLOYMENT workflow router
- Not directly triggered by user

## Prerequisites
- Target project repository exists
- Claude-swift template repository is available as sidecar
- Git working directory is clean

## Workflow Steps

### 1. Environment Verification
- Verify sidecar deployment pattern (claude-swift adjacent to target project)
- Confirm target project has no existing `/claude/` directory
- Check git status of both repositories

### 2. Template Content Copy
- Copy `template/project/` → `target-project/claude-project/`
- Copy `template/wow/` → `target-project/claude-wow/`
- Preserve directory structure and file permissions

### 3. Configuration Setup
- Copy root `CLAUDE.md` to target project root
- Update CLAUDE.md with project-specific paths
- Initialize audit logging system

### 4. Git Integration
- Add `claude-project/` to git tracking
- Add `claude-wow/` to `.gitignore`
- Create initial commit: "Deploy claude-swift template system"

### 5. Workflow Helpers Setup
- Source git-workflow-helpers.sh from deployed location
- Test basic workflow triggers (start sesame, git sesame)
- Verify session initialization

### 6. Validation
- Test SESSION_START workflow in target project
- Verify audit logging functionality  
- Confirm workflow triggers respond correctly
- Test git workflow integration

## Success Criteria
- Target project has functional claude-project/ and claude-wow/ directories
- CLAUDE.md is properly configured for target project
- All workflow triggers function correctly
- Git integration is working (tracked/ignored appropriately)
- Session workflows initialize successfully

## Rollback Procedure
If deployment fails:
1. Remove `claude-project/` directory
2. Remove `claude-wow/` directory  
3. Remove `CLAUDE.md` from project root
4. Reset `.gitignore` changes
5. Clean up any git commits made during deployment

## Expected Outputs
- Functional claude-swift deployment in target project
- Project ready for Claude Code workflows
- Clean separation between project docs and operational machinery
- Automated git workflow helpers available

## Integration Points
- Updates target project's README.md with workflow trigger documentation
- Provides session continuity through audit logging
- Enables full claude-swift workflow ecosystem

---

*Project Workflow - Executed by Claude instances running claude-swift*