[← Back to Claude-Swift Home](../README.md)

# Template Publish Procedure

*Documentation of manual template sync performed 2025-06-26 during interactive sidecar deployment learning.*

## Overview

The template publish procedure synchronizes changes from the development `/claude/` directory to the deployment-ready `/template/` structure, ensuring clean, generic templates for fresh project deployments.

## Core Requirements

### 1. Source Synchronization
- **Source**: `/claude/` directory (active development structure)
- **Target**: `/template/claude/` (clean deployment template)
- **Root File**: `CLAUDE.md` copied to `/template/CLAUDE.md`

### 2. Content Filtering Rules

**Include**: Everything from `/claude/` structure
**Exclude**: 
- Any existing `/template/` subdirectories not part of `/claude/` structure
- Project-specific content that should not be in generic templates

### 3. Project Directory Cleaning

**Critical Rule**: `/claude/project/` root files are **mandatory hooks** that must be preserved.

**Mandatory Hook Files** (preserve in template):
- `KEYWORD_REGISTRY.md`
- `project-info.md` 
- `todo.md`
- `version-config.md`
- `audit/` directory structure
- `workflows/` directory (empty)
- `docs/` directory (empty)

**Remove from Template**:
- Claude-swift specific content in hook files
- All contents of subdirectories (workflows/*.md, docs/*.md, audit/*.log)
- Any project-specific data

### 4. Hook File Sanitization

**For each mandatory hook file**:
- Remove project-specific content
- Preserve generic structure and format
- Update back-links to be project-agnostic
- Clear audit logs (leave only marker)

## Manual Procedure Executed

### Step 1: Clean Sync
```bash
# Remove old template structure
rm -rf template/project/ template/wow/

# Copy current claude structure
cp -r claude/ template/
cp CLAUDE.md template/
```

### Step 2: Content Filtering
```bash
# Remove non-claude content from template
find template/ -type f -name "*" | grep -v "^template/claude/" | grep -v "^template/CLAUDE.md$"
# (Manual review and cleanup of any found files)
```

### Step 3: Project Hook Sanitization
```bash
# Clean claude-swift specific content from mandatory hooks
# For todo.md: Replace project-specific content with generic template
# For audit logs: Clear all logs, preserve structure
rm -rf template/claude/project/audit/current/*.log
echo "##APPEND_MARKER_UNIQUE##" > template/claude/project/audit/current/current.log

# Clean hook files to generic minimal templates
# project-info.md: Keep only WoW-required fields (PROJECT_NAME, PROJECT_TYPE, DESCRIPTION, PURPOSE)
# version-config.md: Replace specifics with [placeholder] format
# KEYWORD_REGISTRY.md: Remove project-specific keywords, keep structure
```

### Step 4: Directory Structure Preparation
```bash
# Remove project-specific workflow and documentation content
rm -rf template/claude/project/workflows/*
rm -rf template/claude/project/docs/*

# Ensure empty directories exist
mkdir -p template/claude/project/docs/
mkdir -p template/claude/project/workflows/
```

### Step 5: Informational Files
```bash
# Add README.md files to empty directories explaining their purpose
# template/claude/project/workflows/README.md
# template/claude/project/docs/README.md
```

## Key Insights Discovered

### 1. Hook Files Architecture
- **ALL** files in `/claude/project/` root are mandatory hooks
- Directory contents are **NOT** hooks (can be project-specific)
- Empty directories serve as structural hooks with informational files

### 2. Content Classification
- **Hooks**: Essential structure and integration points
- **Content**: Project-specific data that gets replaced during deployment
- **Directories**: Structural containers that may be empty in templates

### 3. Sanitization Requirements
- Generic templates must not contain deployment-source specifics
- Back-links must be project-agnostic (`../../README.md` not `../claude-swift/README.md`)
- Audit logs must be empty but preserve marker structure

## Quality Assurance Checklist

### Pre-Publish Validation
- [ ] All `/claude/` content copied to `/template/claude/`
- [ ] `CLAUDE.md` copied to `/template/CLAUDE.md`
- [ ] No files in `/template/` outside of expected structure
- [ ] All mandatory hook files present in `/template/claude/project/`

### Content Sanitization Validation
- [ ] Claude-swift specific content removed from hook files
- [ ] project-info.md contains only WoW-required fields (PROJECT_NAME, PROJECT_TYPE, DESCRIPTION, PURPOSE)
- [ ] version-config.md uses [placeholder] format for all values
- [ ] KEYWORD_REGISTRY.md contains only generic structure
- [ ] Audit logs cleared (only marker remains)
- [ ] Todo list reset to generic template
- [ ] Back-links updated to be project-agnostic
- [ ] Workflow and docs directories empty but present
- [ ] Informational README.md files added to empty directories

### Structure Validation
- [ ] `/template/claude/project/` contains only mandatory hook files and directories
- [ ] `/template/claude/wow/` contains complete WoW system
- [ ] Directory structure matches `/claude/` exactly
- [ ] No orphaned or extra files

## Automation Requirements

### TEMPLATE_PUBLISH Workflow Needs
1. **Automated sync**: `/claude/` → `/template/claude/`
2. **Content filtering**: Remove non-claude template content  
3. **Hook sanitization**: Clean project-specific data from hooks
4. **Structure validation**: Ensure mandatory hooks present
5. **Quality gates**: Validate template integrity before completion

### Future Enhancements
- Automated back-link correction
- Template content validation rules
- Hook file format verification
- Integration with release workflows

## Operational Impact

### Benefits
- **Clean Templates**: New deployments start with generic, uncontaminated templates
- **Consistent Structure**: All deployments follow identical architectural patterns
- **Reduced Errors**: Eliminates project-specific contamination in new deployments
- **Maintainable System**: Template updates propagate cleanly to new deployments

### Considerations
- **Manual Process**: Currently requires careful manual execution
- **Validation Critical**: Template corruption affects all future deployments
- **Documentation Dependency**: Process must be precisely documented for automation

---

*This procedure was developed through interactive learning during InfoMetis sidecar deployment preparation on 2025-06-26.*

[← Back to Claude-Swift Home](../README.md)