[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# RELEASE_PROCESS Workflow

**Note:** This is a specialized workflow coordinated by the main VERSION workflow.

## Trigger
**User-Friendly**: `release sesame` or `patch sesame`
**Technical**: `RELEASE_PROCESS`

## Overview

Complete release process for version closure including log archiving, historical preservation, and release artifact creation.

## Workflow Steps

### 1. Pre-Release Validation
- Verify all issues closed
- Confirm all current version work completed
- Validate repository clean state

### 2. Audit Log Archiving Phase
```bash
# Create version archive directory
mkdir -p claude/project/audit/v{VERSION}

# Move current audit logs to version archive
mv claude/project/audit/current/* claude/project/audit/v{VERSION}/

# Concatenate all session files into single version audit log
cat claude/project/audit/v{VERSION}/*.log > claude/project/audit/v{VERSION}/audit_v{VERSION}.log
rm claude/project/audit/v{VERSION}/*_session*.log

# Ensure current directory is clean for next version
# (VERSION_TRANSITION workflow will process the archived audit data)
```

### 3. Commit & Integration Phase
```bash
# Commit archiving changes
git add claude/project/audit/
git commit -m "Archive v{VERSION} audit logs and prepare for release

- Move claude/project/audit/current/* to claude/project/audit/v{VERSION}/
- Concatenate session logs into audit_v{VERSION}.log
- Preserve complete development audit trail

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Commit and push directly to main
git push origin main
```

### 4. Release Artifact Creation
```bash
# Read project configuration
source claude/project/version-config.md
source claude/project/project-info.md

# Execute project-specific build commands
for cmd in "${BUILD_COMMANDS[@]}"; do
    echo "Executing: $cmd"
    eval $cmd
done

# Execute project-specific test commands  
for cmd in "${TEST_COMMANDS[@]}"; do
    echo "Testing: $cmd"
    eval $cmd
done

# Create release artifacts
for cmd in "${ARTIFACT_COMMANDS[@]}"; do
    echo "Creating artifact: $cmd"
    eval $cmd
done
```

### 5. GitHub Release Creation
```bash
# Create version tag
git tag v{VERSION}
git push origin v{VERSION}

# Create GitHub release with release notes
gh release create v{VERSION} --title "{PROJECT_NAME} v{VERSION}" --notes "$(cat release_notes.md)" {ARTIFACT_NAME}.7z
```

## Release Workflow Execution

### Mandatory Workflow Logging
```bash
# Initialize audit logging
source claude/wow/scripts/audit-functions.sh

# Log workflow start
audit_log "RELEASE_PROCESS" "workflow_start" "release" "" "Starting RELEASE_PROCESS workflow with `release sesame` trigger"

# Log each major step
audit_log "RELEASE_PROCESS" "step" "archive_logs" "" "Archive logs with version stamps"
audit_log "RELEASE_PROCESS" "step" "reset_logs" "" "Reset logs for next version"
audit_log "RELEASE_PROCESS" "step" "commit_changes" "" "Commit archiving changes to main"
audit_log "RELEASE_PROCESS" "step" "create_artifacts" "" "Create release artifacts and test installation"
audit_log "RELEASE_PROCESS" "step" "create_release" "" "Create version tag and GitHub release"

# Log workflow completion
audit_log "RELEASE_PROCESS" "workflow_complete" "release" "" "v{VERSION} release created successfully"
```

## Version Strategy
**Loaded from Project Hooks:**
- Version strategy and numbering patterns defined in `claude/project/version-config.md`
- Project-specific release criteria and artifact configuration
- Development phases and milestone structure

## Integration Points

### Version Management
- Follows Critical Version Management Rule from CLAUDE.md
- Maintains complete historical tracking through archived logs
- Clean separation between version development cycles

### Development Continuity  
- Archived logs preserve complete development history
- Fresh logs enable clean start for next version
- Historical audit trail remains accessible for future reference

### Release Artifacts
- Git tags for version identification
- GitHub releases with comprehensive release notes
- Self-extracting archive for distribution

## Benefits

### Historical Preservation
- Complete development history maintained in archived logs
- Learning documentation preserved for future reference  
- Decision context available for retrospective analysis

### Clean Version Transitions
- Fresh start for next version development
- Clear separation between version cycles
- Systematic release preparation process

### Release Accountability
- Comprehensive release notes documenting achievements
- Complete traceability from planning through implementation
- Systematic version closure process

## Release Execution Lessons (v0.6.1 Experience)

### First Release Insights
Based on the first "`release sesame`" execution for v0.6.1, the following refinements and patterns have been identified:

#### **Planning vs Implementation Releases**
- **Planning Releases** (like v0.6.1): Focus on architectural documentation, no binary artifacts
- **Implementation Releases**: Include tested binary artifacts and deployment packages
- **Release Type** should be determined during release planning phase

#### **Release Notes Generation Pattern**
```markdown
# Release Notes Template

## 🎯 Release Overview
[High-level description of release purpose and achievements]

## 📊 Milestone Completion Summary
[Table format showing epic progress and issue completion]

## 🏗️ Major Architectural Achievements
[Detailed breakdown by epic with key accomplishments]

## 📈 Implementation Readiness
[What's prepared for next version implementation]

## 🔧 Development Infrastructure Improvements
[Workflow and tooling enhancements]

## 📚 Key Documentation Created
[New documentation and knowledge assets]

## 🚀 Strategic Impact
[Long-term implications and positioning]

## 🔮 Next Version Outlook
[Planned focus and transition strategy]

## 📋 Version Statistics
[Quantified achievements and metrics]
```

#### **Project Management Integration**
- **GitHub Project Cleanup**: Projects should be archived/deleted after release to maintain focus
- **Issue Migration**: Implementation issues created during planning belong to next version
- **Milestone Closure**: All Phase milestones should be completed before version release
- **Historical Record**: Release notes serve as permanent record when projects are cleaned

### Artifact Strategy by Release Type

#### **Planning Releases**
- **Documentation Focus**: Comprehensive architecture and planning documentation
- **No Binary Artifacts**: Skip self-extract creation and installation packages
- **Historical Preservation**: Emphasis on complete development history archiving
- **Strategic Record**: Detailed achievement summaries for lasting reference

#### **Implementation Releases**
- **Binary Artifacts**: Include tested SPlectrum.exe, SPlectrum.7z packages
- **Installation Documentation**: Updated INSTALL.md and deployment guides
- **Testing Validation**: Include release testing results and validation reports
- **User-Focused**: Emphasis on feature delivery and usability improvements

### Version Strategy Guidelines

#### **Version Numbering Strategy**
- **Major.Minor.Patch** format (e.g., 0.6.1)
- **Planning Phases**: Increment minor version (0.6.0 → 0.6.1)
- **Implementation Phases**: Increment patch version (0.6.1 → 0.6.2)
- **Major Features**: Increment minor version (0.6.x → 0.7.0)
- **Breaking Changes**: Increment major version (0.x.x → 1.0.0, 1.x.x → 2.0.0)

#### **Release Criteria**
**Planning Release Criteria:**
- All Phase 1 planning issues completed across target epics
- Comprehensive architectural documentation created
- Implementation roadmap established with clear next steps
- Development infrastructure improvements documented

**Implementation Release Criteria:**
- Core functionality implemented and tested
- Binary artifacts validated through testing workflow
- Documentation updated to reflect implementation changes
- User-facing improvements ready for deployment

#### **Release Timing Strategy**
- **Natural Completion Points**: Release when meaningful work units are complete
- **Planning Completion**: When architectural foundations are established
- **Implementation Milestones**: When significant functionality is working and tested
- **Avoid Arbitrary Timing**: Release based on work completion, not calendar schedule

### Workflow Evolution Documentation

#### **Process Improvements Identified**
1. **Release Notes Generation**: Template-based approach ensures comprehensive coverage
2. **Artifact Decision Point**: Early determination of artifact requirements per release type
3. **Project Cleanup Integration**: Systematic approach to project archival and cleanup
4. **Documentation Verification**: Checklist approach for ensuring complete documentation

#### **Future Workflow Enhancements**
- **Automated Testing Integration**: Include release testing validation in workflow
- **Documentation Cross-References**: Ensure all architecture docs are linked and complete
- **Release Type Detection**: Automatic identification of planning vs implementation releases
- **Stakeholder Communication**: Standardized release announcement and communication patterns

#### **Integration Points for Enhancement**
- **CI/CD Integration**: Future automation of release artifact creation and testing
- **Quality Gates**: Automated checks for documentation completeness and link validation
- **Release Analytics**: Metrics collection on release frequency, size, and impact
- **Stakeholder Feedback**: Systematic collection of release feedback for process improvement

### Release Process Evolution Strategy

#### **Continuous Improvement**
- **Post-Release Reviews**: Document lessons learned after each release
- **Process Refinement**: Update workflow based on actual execution experience
- **Tool Enhancement**: Improve automation and reduce manual effort over time
- **Documentation Maturation**: Evolve documentation standards based on user feedback

#### **Scalability Considerations**
- **Team Growth**: Process designed to support multiple contributors
- **Release Frequency**: Workflow optimized for regular, systematic releases
- **Complexity Management**: Clear separation of concerns and workflow responsibilities
- **Quality Maintenance**: Systematic approaches to maintaining high release quality

This documentation captures the practical insights from executing the first systematic release workflow and provides guidance for future release process evolution.