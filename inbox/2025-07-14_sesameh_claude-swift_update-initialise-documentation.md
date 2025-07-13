# Update User Documentation for Automatic INITIALISE Workflow

**Target**: sesameh/claude-swift
**Date**: 2025-07-14
**From**: claude-swift (workflow development)

## Executive Summary

Update user-facing documentation to reflect the new automatic workspace detection in INITIALISE workflow, replacing the previous manual path prompt approach.

## Changes Made

INITIALISE workflow updated from:
- **Old**: Interactive prompt for workspace path
- **New**: Automatic detection using `../..` from repository location

## Documentation Updates Required

### 1. Repository Structure Requirements
Users must understand **before cloning** that claude-swift needs specific positioning:

```
workspace-root/                     # Any name - user's workspace
├── org1/                          # Organization directories  
│   ├── project1/                  # Individual project repositories
│   ├── project2/
│   └── claude-swift/              # ← Must be positioned here
├── org2/
│   └── another-project/
└── personal/
    ├── my-project/
    └── side-project/
```

### 2. Setup Instructions
Clear step-by-step guide:
1. Create workspace directory
2. Create organization directory 
3. Clone claude-swift into org directory
4. Run `initialise sesame` (automatic detection)

### 3. Error Prevention
Common mistakes to avoid:
- Cloning claude-swift at workspace root
- Not following org/repo structure
- Expecting manual path configuration

## Files Requiring Updates

### Primary Documentation
- [ ] `README.md` - Update installation/setup section
- [ ] `docs/getting-started/quick-start-guide.md` - Repository positioning requirements
- [ ] `docs/deployment/sidecar-deployment-guide.md` - Workspace structure setup

### Secondary Documentation  
- [ ] `docs/getting-started/common-pitfalls-and-solutions.md` - Add positioning errors
- [ ] Any deployment guides referencing INITIALISE workflow

## Implementation Notes

### Clear Warning Required
Documentation must emphasize **repository positioning is critical** before cloning.

### Visual Examples
Include directory tree examples showing correct vs incorrect positioning.

### Troubleshooting
Document how to fix incorrect positioning after cloning.

## Success Criteria

- [ ] Users understand repository structure requirements before setup
- [ ] Setup instructions reflect automatic detection approach  
- [ ] Common positioning errors documented with solutions
- [ ] All deployment guides updated consistently
- [ ] Quick-start guide tests successfully with new approach

## Benefits

1. **Prevents setup errors**: Clear requirements upfront
2. **Reduces support issues**: Fewer positioning mistakes
3. **Simplifies workflow**: No manual path configuration
4. **Improves adoption**: Clearer setup process

## Priority

**HIGH** - Users attempting setup with old documentation will encounter errors with the updated INITIALISE workflow.

## Related Changes

- INITIALISE workflow updated to automatic detection (completed)
- PROJECT_SWITCH workflow uses same detection logic (completed)
- Documentation updates (this task)