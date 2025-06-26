[← Back to Claude-Swift Home](../../../README.md)

# MIGRATION_DEPLOYMENT Sub-Workflow

## Purpose
Migrate existing projects from legacy `/claude/` mixed structure to claude-swift dual-folder architecture.

**Note:** This is a sub-workflow called by the main DEPLOYMENT workflow router.

## Trigger Keywords
- Called via DEPLOYMENT workflow router
- Not directly triggered by user

## Prerequisites
- Target project has existing `/claude/` directory with mixed content
- Claude-swift template repository is available as sidecar
- Git working directory is clean
- Backup of current state created

## Workflow Phases

### Phase 1: Analysis (Reversible)
**Content Classification:**
- Scan existing `/claude/` directory structure
- Classify content as project-docs vs operational-machinery
- Generate migration report with file-by-file analysis
- Identify potential conflicts or issues

**Safety Validation:**
- Verify backup is complete and valid
- Check for uncommitted changes
- Confirm rollback procedures are ready
- Test rollback on analysis results

### Phase 2: Project Content Migration (Reversible)
**Project Documentation Extraction:**
- Move project requirements, architecture docs → `claude-project/docs/`
- Move team agreements, coding standards → `claude-project/docs/`
- Preserve git history for moved files where possible
- Update internal cross-references

**Validation Gate:**
- Verify all project content properly migrated
- Test that project documentation is accessible
- Confirm no business content lost
- Allow rollback to Phase 1 state

### Phase 3: Operational Migration (Irreversible)
**WoW Content Deployment:**
- Replace operational workflows with claude-swift templates
- Migrate custom workflows to new structure
- Update audit logs to new format
- Deploy git-workflow-helpers

**Final Integration:**
- Replace root CLAUDE.md with claude-swift version
- Update `.gitignore` for new structure
- Configure workflow triggers
- Initialize new audit logging

### Phase 4: Cleanup and Validation
**Legacy Cleanup:**
- Remove original `/claude/` directory
- Clean up temporary migration files
- Update project documentation references

**System Validation:**
- Test all workflow triggers
- Verify session initialization
- Confirm git integration
- Validate audit logging

## Migration Decision Points

### After Phase 1 (Analysis)
**Continue if:**
- Migration report shows clear content classification
- No critical conflicts identified
- Rollback procedures tested successfully

**Stop if:**
- Content classification is ambiguous
- Critical business content cannot be safely moved
- Rollback procedures fail

### After Phase 2 (Project Migration)  
**Continue if:**
- All project content successfully migrated
- Documentation structure is clean
- Cross-references updated correctly

**Stop if:**
- Project content migration incomplete
- Documentation structure unclear
- Business continuity at risk

## Success Criteria
- Clean separation achieved (project docs vs operational machinery)
- All workflow triggers function correctly  
- Git integration working (appropriate tracking/ignoring)
- Session workflows initialize successfully
- Project documentation preserved and accessible
- Operational capabilities maintained or improved

## Rollback Procedures

### From Phase 1 or 2:
1. Restore from backup
2. Remove any temporary files
3. Reset git state to pre-migration
4. Verify original functionality

### From Phase 3 (Limited):
**Cannot fully rollback once operational migration completes**
- Can restore project content from backup
- Must manually reconstruct operational environment
- May require manual workflow reconfiguration

## Risk Mitigation
- **Comprehensive Analysis Phase** - Understand before acting
- **Phased Approach** - Clear rollback boundaries
- **Validation Gates** - Required testing between phases  
- **Content Preservation** - No business data loss
- **Backup Strategy** - Complete state preservation

## Expected Outputs
- Target project converted to claude-swift dual-folder architecture
- Clean separation between project docs and operational machinery
- Preserved project documentation and team agreements
- Enhanced operational capabilities through claude-swift workflows
- Maintained git history where possible

---

*Project Workflow - Executed by Claude instances running claude-swift*