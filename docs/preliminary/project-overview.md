# Claude-Swift Ways of Working Template System

## Project Overview

This repository creates the template system for Claude-Swift operational workflows that can be deployed to any project repository. The system enables consistent AI-assisted development practices across multiple projects while maintaining local operational data integrity.

**Future Evolution**: This repository serves as the foundational template for claude-swift ways of working. When different operational approaches are needed, this repository can be cloned to create specialized templates (e.g., claude-enterprise, claude-research, etc.).

## Core Problem Statement

Currently, each project repository requires its own custom setup of Claude operational files (workflows, audit systems, documentation standards). This leads to:
- Duplicated effort in setting up operational systems
- Inconsistent ways of working across projects  
- Difficulty in upgrading operational practices
- No centralized source of truth for best practices

## Solution Architecture

### Claude-Swift Template Repository
This repository serves as the claude-swift template containing:
- Standard workflow definitions
- Audit logging frameworks
- Operational documentation templates
- Tool automation scripts
- Best practice guidelines

### Deployment Mechanism
The template system will deploy to target project repositories with:
- Smart separation of template vs local content
- Upgrade-safe mechanisms that preserve local operational data
- Version control for template updates
- Customization capabilities for project-specific needs

## Key Design Principles

### 1. Template vs Local Data Separation
- **Template Content**: Workflows, base rules, standard tools (can be overwritten on upgrade)
- **Local Operational Data**: Audit logs, project todos, current session state (must be preserved)

### 2. Upgrade Safety
- Template updates never overwrite local operational data
- Clear versioning system for template evolution
- Rollback capabilities for failed upgrades

### 3. Project Agnostic Design
- Works with any programming language or framework
- Configurable to match project-specific needs
- No assumptions about project structure outside `/claude/` folder

### 4. Template Family Architecture
- Claude-swift as foundational template repository
- Future template variants created by cloning this repository
- Multiple deployment target repositories per template type
- Each deployment maintains its own operational state
- Template improvements feed back to respective template repositories

## Current State Analysis

This repository currently contains both:
- Template content being developed (root-level folders)
- Operational data from previous project usage (`/claude/` folder)

The immediate task is to clean up the existing operational data and establish clear boundaries between template and deployment content.

## Success Criteria

1. **Template Completeness**: Comprehensive set of workflows and tools ready for deployment
2. **Deployment Automation**: One-command deployment to any target repository
3. **Upgrade Safety**: Template updates preserve all local operational data
4. **Documentation**: Clear setup and usage instructions for project teams
5. **Validation**: Successful deployment and operation in multiple test repositories

## Next Steps

1. Clean up existing `/claude/` operational data
2. Design folder structure for template vs local content separation
3. Define upgrade rules and mechanisms
4. Create deployment automation
5. Test with multiple target repositories
6. Document complete setup and usage procedures