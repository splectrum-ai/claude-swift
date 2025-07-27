# FULL_RELEASE Sub-Workflow

## Purpose
Execute complete release sequence: release → transition → version planning.

## Trigger
Called from main RELEASE workflow when user requests target version release.

## Input
- Target version (optional, can be determined automatically)
- Release notes or changelog updates

## Process Sequence

### 1. Release Process
Execute release creation and publishing:
- Build and package release
- Create GitHub release
- Update version tags
- Publish release notes

### 2. Version Transition  
Execute version transition workflow:
- Archive current version artifacts
- Update version tracking
- Clean up temporary files
- Prepare for next version

### 3. Version Planning
Execute new version planning:
- Set up next version milestone
- Plan upcoming features
- Update roadmap and priorities
- Initialize new version tracking

## Sub-workflows Referenced
1. **PATCH_RELEASE.md** - For the actual release creation
2. **VERSION_TRANSITION.md** - For version transition steps  
3. **NEW_VERSION_PLANNING.md** - For next version setup

## Audit Logging
- Log start of full release sequence
- Track completion of each phase
- Record any issues or exceptions
- Final completion confirmation

## Success Criteria
- Release successfully published
- Version transition completed
- Next version planning initialized
- All audit logs properly recorded

---
*Sub-workflow of RELEASE.md - handles complete release lifecycle*