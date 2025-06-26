[← Back to Claude-Swift Home](../../README.md)

# Template System Architecture

## Overview

Claude-swift implements a sophisticated template system for deploying Claude Code ways of working using a battle-tested sidecar deployment pattern. This architecture emerged from v1.0.0 development and was validated through real-world InfoMetis deployment.

## Core Architectural Patterns

### **Sidecar Deployment Pattern**
```
parent-directory/
├── target-project/              # User's actual project
│   ├── claude/project/         # Project docs (tracked)
│   └── claude/wow/             # WoW machinery (tracked)
└── claude-swift/               # Template repo (sidecar)
    ├── template/               # Clean deployment files
    ├── docs/                   # User documentation
    └── CLAUDE.md               # Operational guidance
```

**Benefits Validated**:
- **Zero Template Confusion**: Only one active WoW system per project
- **Clean Content Separation**: Project content completely separate from operational machinery
- **Upgrade Safety**: Template updates never conflict with project documentation
- **Operational Continuity**: Projects continue functioning even with template changes

### **Dual-Folder Architecture**
**claude/project/ (Project-Specific Content)**:
- Project requirements and architecture documentation
- Team agreements and coding standards
- Project-specific configuration and planning
- **Mandatory hooks**: project-info.md, version-config.md, KEYWORD_REGISTRY.md
- Audit trail and todo management

**claude/wow/ (Universal WoW Machinery)**:
- Operational workflows and automation scripts
- Base workflow library reusable across projects
- **WoW system configuration**: Template architecture settings
- Universal governance rules and procedures

### **Hook System Architecture**
**Discovery**: Extensible project customization within standard WoW framework

**Implementation Pattern**:
```markdown
# WoW Workflow with Hook Integration
1. **Pre-Release Validation** (WoW)
2. **Pre-Release Phase** (WoW) → **Calls PROJECT_RELEASE_PROCESS Hook**
3. **Audit Log Archiving Phase** (WoW)
4. **Commit & Integration Phase** (WoW)
5. **Release Artifact Creation** (WoW)
6. **GitHub Release Creation** (WoW)
```

**Hook Benefits**:
- **Project Customization**: Enables project-specific behavior within standard workflows
- **Framework Stability**: Base workflows remain consistent across projects
- **Extensible Pattern**: Other projects can implement their own hooks
- **Separation of Concerns**: Project logic separate from WoW mechanics

## Configuration Management Architecture

### **WoW System Configuration** (`claude/wow/config.md`)
**Purpose**: Template architecture decisions consistent across all projects
- Directory structure patterns
- Audit log formats and paths
- Workflow system configuration
- Tool requirements and dependencies

**Examples**:
```yaml
AUDIT_BASE_PATH: claude/project/audit
CURRENT_AUDIT_PATH: claude/project/audit/current
VERSION_AUDIT_PATTERN: claude/project/audit/v{version}
```

### **Project Configuration** (`claude/project/project-info.md`)
**Purpose**: Project-specific information that projects customize
- Project identity and description
- Repository configuration
- Team structure and collaboration model
- Success criteria and boundaries

**Template Variables**:
```yaml
PROJECT_NAME: claude-swift
REPOSITORY: SPlectrum/claude-swift
DEPLOYMENT_PATTERN: sidecar
```

## Template System Design

### **Clean Template Structure** (`template/`)
**Characteristics**:
- **Zero project-specific content**: Completely generic and reusable
- **Mandatory hooks preserved**: Essential configuration files as minimal templates
- **Documentation structure**: Base folders for project population
- **Deployment ready**: Immediate functionality upon copy

**Template Hierarchy**:
```
template/
├── CLAUDE.md                   # Operational guidance
├── claude/
│   ├── project/
│   │   ├── audit/             # Audit system structure
│   │   ├── project-info.md    # Minimal template
│   │   ├── version-config.md  # Minimal template
│   │   └── KEYWORD_REGISTRY.md # Project-specific keywords
│   └── wow/                   # Complete WoW system
└── docs/                      # Documentation structure
```

### **Release Notes Integration**
**Pattern**: `CLAUDE-SWIFT-v{VERSION}-RELEASE-NOTES.md`
- **Deployment visibility**: Users immediately see what version they're getting
- **Template branding**: Clear claude-swift identity
- **Version tracking**: Exact capabilities and features documented

## Deployment Architecture

### **Operational-First Approach**
**Philosophy**: Prioritize immediate functionality over rigid separation
- **Fresh projects**: Clean sidecar deployment with minimal setup
- **Existing projects**: Operational continuity with gradual migration
- **Mixed content tolerance**: Visible but doesn't block progress
- **Rollback mechanisms**: CLAUDE.md replacement + session restart

### **Backup and Recovery Strategy**
**Pre-deployment backup**:
```bash
# InfoMetis deployment example
cp -r claude/ archive-pre-claude-swift-2025-06-26/
```

**Recovery mechanisms**:
- **Git history**: Complete change visibility and rollback capability
- **Template replacement**: Fresh template copy overwrites customizations
- **Session restart**: Memory flush eliminates conflicting context

### **Deployment Validation**
**Real-world testing**: InfoMetis pilot deployment successful
- **Existing legacy structure**: Successfully migrated without data loss
- **Operational continuity**: No work interruption during transition
- **Template functionality**: Immediate operational capability
- **User experience**: Natural workflow integration

## Quality Assurance Architecture

### **MANDATORY Rule System**
**Governance layer**: Prevents operational drift through automated enforcement
- **File path specification**: Eliminates ambiguity in all references
- **Audit format validation**: Consistent logging across all sessions
- **Documentation compliance**: Automated structure and link validation
- **Branch policy enforcement**: Maintains clean repository state

### **Dual Report Strategy**
**Operational reports**: Complete technical analysis for process improvement
**User-facing reports**: Executive summaries for strategic decision-making

**Integration points**:
- **Version transitions**: Comprehensive development cycle analysis
- **Release processes**: Achievement documentation and strategic assessment
- **Continuous improvement**: Systematic lessons learned capture

## Evolution and Extensibility

### **Template Enhancement Patterns**
**Version vs Fix releases**: Different workflow overhead for different scopes
- **Version releases**: Full audit archiving and strategic assessment
- **Fix releases**: Lightweight updates with development continuity

### **Community Integration Potential**
**Shared template libraries**: Future capability for template distribution
**Collaborative development**: Multiple teams using consistent WoW patterns
**Platform extensions**: Integration with additional development platforms

### **Automation Evolution**
**Current state**: Manual processes with systematic documentation
**Future enhancement**: Progressive automation of validated patterns
**Quality gates**: Automated compliance checking and validation
**CI/CD integration**: Platform connectivity and ecosystem integration

## Architecture Success Metrics

### **Deployment Effectiveness**
- **Zero-friction deployment**: One-command installation to any project
- **Immediate functionality**: Operational capability without configuration
- **Clean separation**: No mixing of template machinery with project content
- **Upgrade safety**: Template updates don't break existing projects

### **Developer Experience**
- **Natural workflow integration**: Intuitive command patterns (`sesame` triggers)
- **Progressive disclosure**: Overview documentation with AI detail integration
- **Quality enforcement**: Automated compliance prevents operational drift
- **Audit accountability**: Complete development history with strategic insights

### **System Maturity**
- **Production validation**: Successful real-world deployment
- **Extensible design**: Hook patterns enable project-specific customization
- **Quality assurance**: Built-in mechanisms maintain operational standards
- **Continuous evolution**: Systematic improvement through lessons learned

---

*Architecture documentation capturing validated patterns from v1.0.0 development and deployment experience*