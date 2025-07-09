[← Back to Claude-Swift Home](../../../README.md)

# TEMPLATE_SYNCHRONIZATION Sub-Workflow

## Overview

Shared template synchronization workflow for claude-swift. Used by multiple workflows that need to keep template/ folder synchronized with main repository state.

**Used By**: 
- Standalone `template sesame` trigger
- Any workflow requiring template synchronization

## Synchronization Recipe

### 1. Archive Current Template State
```bash
# Create archive of current template
mkdir -p template/archive
mv template/* template/archive/ 2>/dev/null || echo "Archive created"
```

**Purpose**: Preserve current template state for comparison and rollback if needed.

### 2. Blind Copy Current Repository State  
```bash
# Copy current claude/ directory and CLAUDE.md to template
cp -r claude/ template/
cp CLAUDE.md template/
```

**Purpose**: Synchronize template with latest repository state using simple, reliable blind copy.

### 3. Reset Project-Specific Files to Generic Template Format
```bash
# Copy clean hook files from archive as starting point
cp template/archive/claude/project/*.md template/claude/project/
# Review and make any additional cleanup if necessary
```

**Optimization**: Copy cleaned hook files from archive backup, then review for any additional cleanup needed

**Project Hook Files Reset** (copied from archive, then reviewed):
- `template/claude/project/version-config.md` → Generic template placeholders
- `template/claude/project/project-info.md` → Generic template placeholders  
- `template/claude/project/KEYWORD_REGISTRY.md` → Empty sections for project-specific content
- `template/claude/project/todo.md` → Empty sections for project-specific content

**Reset Pattern**:
- Start with clean archive versions (avoids manual placeholder replacement)
- Review copied files for any remaining project-specific content
- Make targeted fixes only where needed
- Preserve template structure and workflow framework

### 4. Remove Project-Specific Files Not Needed in Template
```bash
# Remove all files and folders from all project subfolders
rm -rf template/claude/project/*/
# Put clean audit log in place
mkdir -p template/claude/project/audit/current
echo "##APPEND_MARKER_UNIQUE##" > template/claude/project/audit/current/current.log
# Create empty docs folder with generic README to preserve structure
mkdir -p template/claude/project/docs
echo -e "# Project Documentation\n\nThis directory is reserved for project-specific documentation.\n\nCurrently empty - no project-specific documentation files are maintained.\n\n---\n\n*Project documentation structure maintained for future use.*" > template/claude/project/docs/README.md
```

**Cleanup Scope**:
- **Remove all files and folders from all project subfolders** (docs/, workflows/, audit/, etc.)
- **No historical documentation preserved** - templates start completely clean
- **Create clean audit/current/current.log** with only the append marker
- **Create empty docs/ folder with generic README** to preserve directory structure

### 5. Template Validation
```bash
# Validate template structure and content
# - Check for remaining claude-swift specific content
# - Verify template placeholder format
# - Confirm workflow framework completeness
```

**Quality Gates**:
- No claude-swift specific content remains
- All placeholders properly formatted
- Complete workflow framework preserved
- Template ready for deployment

## Integration Points

### As Sub-Workflow
This can be called from other workflows:

```bash
# Call template synchronization
echo "YYYY-MM-DDTHH:MM:SSZ|PARENT_WORKFLOW|step|template_sync_start||Starting template synchronization sub-workflow" >> claude/project/audit/current/current.log

# Execute TEMPLATE_SYNCHRONIZATION steps 1-5

echo "YYYY-MM-DDTHH:MM:SSZ|PARENT_WORKFLOW|step|template_sync_complete||Template synchronization sub-workflow complete" >> claude/project/audit/current/current.log
```

### As Project Hook
Individual projects can implement `PROJECT_*` hooks that call this shared workflow:

```bash
# In PROJECT_VERSION_TRANSITION.md or PROJECT_RELEASE_PROCESS.md
# Call shared TEMPLATE_SYNCHRONIZATION workflow
# Add any project-specific template customizations
```

## Recipe Benefits

### **Simplicity**
- **Blind copy approach** eliminates complex file comparison logic
- **Archive-first strategy** provides safety net and reference point
- **Systematic steps** are easy to understand and maintain

### **Reliability** 
- **No missed files** - complete directory copy ensures nothing is overlooked
- **Atomic operation** - each step is complete before proceeding
- **Rollback capability** - archive enables recovery if needed

### **Maintainability**
- **Clear separation** between sync mechanics and project-specific customization
- **Reusable pattern** across multiple workflows
- **Documented process** enables consistent execution

### **Template Quality**
- **Complete synchronization** ensures template reflects current repository state
- **Generic reset** maintains template deployability
- **Validation steps** ensure template purity and quality

## Workflow Logging

```bash
# Standard logging pattern for template synchronization
TIMESTAMP|PARENT_WORKFLOW|step|template_archive||Created template archive in template/archive/
TIMESTAMP|PARENT_WORKFLOW|step|template_copy||Copied claude/ and CLAUDE.md to template/ 
TIMESTAMP|PARENT_WORKFLOW|step|template_reset||Reset project files to generic template format
TIMESTAMP|PARENT_WORKFLOW|step|template_cleanup||Removed project-specific files from template
TIMESTAMP|PARENT_WORKFLOW|step|template_validation||Validated template structure and content
```

## Success Criteria

- [ ] Current template state archived in `template/archive/`
- [ ] Repository state copied to `template/` (claude/ + CLAUDE.md)
- [ ] Project configuration files reset to generic template format
- [ ] Project-specific files removed from template
- [ ] Template validated for purity and deployability
- [ ] Template ready for deployment to new projects

---

*Project Workflow - Template synchronization recipe for claude-swift*