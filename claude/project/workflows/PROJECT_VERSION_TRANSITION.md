[← Back to Claude-Swift Home](../../../README.md)

# PROJECT_VERSION_TRANSITION Hook

## Overview

Project-specific VERSION_TRANSITION customization hook for claude-swift. This hook is called during VERSION_TRANSITION workflow to provide claude-swift specific customizations.

**Trigger**: Called automatically during `transition sesame` execution within WoW VERSION_TRANSITION Step 3 (Repository Maintenance)

## Hook Customization Steps

### 1. Execute Template Synchronization Sub-Workflow
```bash
# Call shared TEMPLATE_SYNCHRONIZATION workflow
# See: claude/wow/workflows/TEMPLATE_SYNCHRONIZATION.md
# Executes: archive → copy → reset → cleanup → validate
```

**Reference**: Uses shared `TEMPLATE_SYNCHRONIZATION` sub-workflow for consistent, reliable template maintenance.
**Purpose**: Ensure template/ folder stays synchronized with main repository changes throughout development.

### 2. Project File Reset to Generic Template Format
```bash
# Reset version-config.md to generic template values
# - PROJECT_NAME: claude-swift → [project-name]
# - Remove claude-swift specific configuration values
# - Reset to template placeholder format

# Reset project-info.md to generic template format
# - Remove claude-swift specific project information
# - Reset to template placeholder format

# Clean project-specific files not needed in template
# - Remove audit analysis reports
# - Remove version-specific audit archives  
# - Remove project-specific workflow files
# - Reset current audit log to empty state
```

**Configuration Reset Requirements**:
- Replace claude-swift specific values with template placeholders
- Remove completed project-specific content
- Preserve generic template structure and workflow framework
- Ensure template deployability to any project

### 3. Template Validation
```bash
# Validate template structure integrity
# - Verify all template placeholders are properly formatted
# - Check for any remaining claude-swift contamination
# - Confirm workflow framework completeness
# - Validate template deployment readiness
```

**Quality Gates**:
- Template purity verification (no claude-swift specifics remain)
- Template structure validation
- Workflow system completeness
- Project deployment readiness

### 4. Template Synchronization Completion
```bash
# Log completion of template synchronization
echo "YYYY-MM-DDTHH:MM:SSZ|PROJECT_VERSION_TRANSITION|workflow_complete|template_sync|template/|Template synchronization complete - ready for future deployment" >> claude/project/audit/current/current.log
```

**Ready State**: Template synchronized and ready for deployment to new projects.

## Hook Integration with WoW VERSION_TRANSITION

### WoW Workflow Structure with Hook Integration
1. **Step 1: Audit Analysis & Processing** (WoW)
2. **Step 2: Knowledge Base Synchronization** (WoW)
3. **Step 3: Repository Maintenance** (WoW) → **Calls PROJECT_VERSION_TRANSITION Hook**
4. **Step 4: Strategic Analysis & Pattern Recognition** (WoW)
5. **Step 5: Knowledge Base Updates** (WoW)
6. **Step 6: Get Started Documentation** (WoW)
7. **Step 7: Next Version Preparation** (WoW)

### Hook Execution Context
- **Called By**: WoW VERSION_TRANSITION during Step 3 (Repository Maintenance)
- **Purpose**: Template system synchronization and maintenance
- **Output**: Clean template/ folder ready for deployment
- **Integration**: Seamless handoff to WoW workflow continuation

## Claude-Swift Specific Requirements

### Template Synchronization Strategy
- **Blind Copy Approach**: Archive current template, copy main repository, reset project files
- **Generic Template Reset**: Remove all claude-swift specifics, restore template placeholders
- **Workflow Framework Preservation**: Maintain complete WoW system in template

### Template Purity Standards
- Zero claude-swift specific content in project configuration files
- All project placeholders properly formatted for template deployment
- Complete workflow framework available for new projects
- Template deployable to any target project without modification

### Quality Standards
- Template structure integrity maintained
- All workflow triggers and frameworks available
- Documentation properly templated with placeholders
- Clean separation between template machinery and project specifics

## Benefits

### **Hook Pattern Benefits**
- Enables project-specific template maintenance within standard WoW framework
- Maintains separation of concerns (template maintenance vs generic version transition)
- Provides extensible pattern for other template projects

### **Template Quality**
- Ensures template stays synchronized with main repository
- Validates template deployability and purity
- Maintains template system integrity across versions

### **Development Continuity**
- Documents template maintenance patterns
- Enables consistent template updates across versions
- Preserves template system quality for future deployments

---

*Project Hook - Claude-swift specific customization for WoW VERSION_TRANSITION Step 3*