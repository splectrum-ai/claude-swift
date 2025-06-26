[← Back to Claude-Swift Home](../../../README.md)

# PROJECT_RELEASE_PROCESS Hook

## Overview

Project-specific pre-release customization hook for claude-swift. This hook is called during the Pre-Release Phase of the WoW RELEASE_PROCESS workflow to provide claude-swift specific customizations.

**Trigger**: Called automatically during `release sesame` execution within WoW RELEASE_PROCESS Pre-Release Phase

## Hook Customization Steps

### 1. Development Achievement Review
```bash
# Review current development progress
cat claude/project/audit/current/current.log
cat claude/project/todo.md
git log --oneline -10
```

**Purpose**: Gather comprehensive understanding of development achievements for release notes content.

### 2. Release Notes Creation (Override Default)
```bash
# Override WoW default release notes with claude-swift specific naming and content
# WoW Default: Standard release notes naming
# Project Override: docs/reports/v{VERSION}-release-notes.md
```

**Naming Override**: Project-specific branding and comprehensive content structure  
**Content Requirements**:
- 🎯 Release Overview with deployment model
- 📊 Milestone Completion Summary (table format)
- 🏗️ Major Architectural Achievements by epic area
- 📈 Implementation Readiness capabilities
- 🔧 Development Infrastructure Improvements
- 📚 Key Documentation Created
- 🚀 Strategic Impact assessment
- 🔮 Next Version Outlook planning
- 📋 Version Statistics and metrics

### 3. Template Release Notes Deployment
```bash
# Copy release notes to template with claude-swift branding
cp docs/reports/v{VERSION}-release-notes.md template/CLAUDE-SWIFT-v{VERSION}-RELEASE-NOTES.md
```

**Purpose**: Ensure release notes deploy with template for user visibility.

### 4. Version Configuration Update
```bash
# Update claude/project/version-config.md
# - CURRENT_VERSION: old → new version
# - TARGET_VERSION: set next planned version
# - Add new release notes to RELEASE_ARTIFACTS and ARTIFACT_COMMANDS
```

**Configuration Updates**:
- Version progression following semantic versioning
- Artifact commands updated to include versioned release notes
- Target version planning for next development cycle

### 5. Project-Specific Validation
```bash
# Validate claude-swift specific requirements
# - Check for SPlectrum contamination removal
# - Verify template structure integrity
# - Confirm all documentation has proper back-links
# - Validate workflow trigger completeness
```

**Quality Gates**:
- Template purity verification
- Documentation compliance checking
- Workflow system validation
- Project identity confirmation

### 6. Release Preparation Completion
```bash
# Log completion of pre-release steps
echo "YYYY-MM-DDTHH:MM:SSZ|PROJECT_RELEASE_PROCESS|workflow_complete|release_ready|claude/project/version-config.md|Pre-release preparation complete for v{VERSION}" >> claude/project/audit/current/current.log
```

**Ready State**: All project-specific preparation complete, ready for main RELEASE_PROCESS execution.

## Hook Integration with WoW RELEASE_PROCESS

### WoW Workflow Structure with Hook Integration
1. **Pre-Release Validation** (WoW)
2. **Pre-Release Phase** (WoW) → **Calls PROJECT_RELEASE_PROCESS Hook** 
3. **Audit Log Archiving Phase** (WoW)
4. **Commit & Integration Phase** (WoW)
5. **Release Artifact Creation** (WoW)
6. **GitHub Release Creation** (WoW)

### Hook Execution Context
- **Called By**: WoW RELEASE_PROCESS during Pre-Release Phase
- **Purpose**: Project-specific customizations (naming, content, validation)
- **Output**: Customized assets ready for standard release mechanics
- **Integration**: Seamless handoff to WoW workflow continuation

## Claude-Swift Specific Configuration

### Release Notes Template
- Follow comprehensive template structure from RELEASE_PROCESS.md
- Include strategic impact and next version outlook
- Emphasize template system capabilities and deployment benefits
- Document development productivity improvements

### Version Strategy
- **Major Version**: Template architecture changes, breaking compatibility
- **Minor Version**: New workflow capabilities, deployment scenarios  
- **Patch Version**: Bug fixes, documentation improvements, workflow refinements

### Quality Standards
- Zero SPlectrum platform contamination
- Complete MANDATORY rule compliance
- All documentation properly back-linked
- Template deployment validation

## Benefits

### **Hook Pattern Benefits**
- Enables project-specific customization within standard WoW framework
- Maintains separation of concerns (project vs generic release logic)
- Provides extensible pattern for other projects to implement

### **Release Quality**
- Ensures comprehensive release notes creation
- Validates project-specific requirements
- Maintains template system integrity

### **Development Continuity**
- Documents project-specific release patterns
- Enables consistent release preparation across versions
- Preserves institutional knowledge for release processes

---

*Project Hook - Claude-swift specific customization for WoW RELEASE_PROCESS Pre-Release Phase*