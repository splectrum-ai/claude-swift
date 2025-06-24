# Template Repository Structure Design

## Proposed Folder Structure

The claude-swift template repository is organized to clearly separate template content, development operational data, and documentation:

```
claude-swift/                       # Template repository root
├── template/                       # Clean template content for deployment
│   ├── workflows/                  # Template workflow definitions
│   ├── tools/                     # Template automation scripts  
│   ├── audit/                     # Template audit structure (empty logs)
│   └── operational-docs/          # Template documentation templates
├── docs/                          # Template system documentation
│   ├── project-overview.md        # Overall project objectives
│   ├── self-contained-template-update-architecture.md
│   ├── template-merge-procedures.md    # Claude merge instructions
│   └── deployment-guide.md        # Initial setup guide
└── claude/                        # Development operational data
    ├── workflows/                 # Our working workflow definitions
    ├── tools/                    # Our working automation scripts
    ├── audit/                    # Our development audit logs
    └── operational-docs/         # Our development documentation
```

## Folder Purpose Definitions

### `/template/` - Deployment-Ready Content
- **Purpose**: Clean, deployable template content
- **Contents**: Base workflows, tools, and documentation structures
- **State**: Production-ready, tested, documented
- **Deployment**: Direct copy to target project's `/claude/` folder
- **Updates**: Can be completely overwritten during template updates

### `/docs/` - Template System Documentation  
- **Purpose**: Documents the template system itself
- **Contents**: Architecture, procedures, guides for template usage
- **Audience**: Template maintainers and project implementers
- **Scope**: Meta-documentation about the template system
- **Updates**: Version-controlled improvements to template system

### `/claude/` - Development Operational Data
- **Purpose**: Our working operational environment for developing this template
- **Contents**: Live development workflows, audit logs, working documentation
- **State**: Active development environment with real operational data
- **Usage**: Used while building and refining the template
- **Updates**: Normal operational evolution during template development

## Content Flow Process

### 1. Development Phase
- Work in `/claude/` with full operational environment
- Refine workflows, tools, and procedures through real usage
- Build up operational knowledge and best practices

### 2. Template Creation Phase  
- Extract proven content from `/claude/` to `/template/`
- Clean up project-specific references and data
- Create generalized, reusable versions
- Document deployment procedures

### 3. Template Distribution Phase
- Projects deploy content from `/template/` to their `/claude/` folder
- Template improvements flow back to `/template/` directory
- `/claude/` continues as development environment for template enhancements

## Current State Analysis

**Existing Structure** (needs reorganization):
```
claude-swift/                       # Current state
├── workflows/                      # Root-level template content (to move)
├── tools/                         # Root-level template content (to move)  
├── audit/                         # Root-level template content (to move)
├── operational-docs/              # Root-level template content (to move)
├── docs/                          # Template documentation (correct location)
└── claude/                        # Development operational data (correct)
    ├── workflows/                 # Our development workflows  
    ├── tools/                    # Our development tools
    ├── audit/                    # Our development audit logs
    └── operational-docs/         # Our development docs
```

## Reorganization Requirements

### Move to `/template/` Structure:
1. Create `/template/` directory
2. Move root-level folders into `/template/`:
   - `workflows/` → `template/workflows/`  
   - `tools/` → `template/tools/`
   - `audit/` → `template/audit/`
   - `operational-docs/` → `template/operational-docs/`
3. Clean template content of project-specific data
4. Update all references to new structure

### Benefits of New Structure:
- **Clear Separation**: Template vs development content clearly distinguished
- **Deployment Clarity**: Target projects know exactly what to deploy
- **Update Safety**: Template updates only affect `/template/` content
- **Development Continuity**: `/claude/` remains active for ongoing template development
- **Documentation Organization**: `/docs/` contains meta-documentation about template system

## Implementation Priority

**High Priority** (enables template deployment):
1. Create `/template/` structure
2. Move and clean root-level content  
3. Update documentation references
4. Create initial deployment procedures

**Medium Priority** (enhances usability):
1. Refine template content based on deployment testing
2. Add comprehensive deployment validation
3. Create template customization guides

This structure enables the self-contained update architecture while maintaining clear boundaries between template and operational content.