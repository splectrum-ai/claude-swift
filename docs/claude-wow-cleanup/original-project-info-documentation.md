# Original Project Information Documentation

This file contains the detailed project information documentation that was previously in `claude/project/project-info.md` before operational simplification.

## Complete Project Overview
- **PROJECT_NAME**: claude-swift
- **PROJECT_TYPE**: template-system
- **DESCRIPTION**: Sophisticated template system for deploying Claude Code ways of working to any project using sidecar deployment pattern
- **PURPOSE**: Eliminate confusion of mixing project-specific content with operational machinery

## Repository Configuration
- **REPOSITORY**: sesameh/claude-swift
- **PRIMARY_BRANCH**: main
- **DEPLOYMENT_PATTERN**: Clone repository into workspace structure

## Architecture
- **DEPLOYMENT_MODEL**: Multi-project with shared framework via symlinks
- **CONTENT_SEPARATION**: Project-specific content vs shared operational machinery  
- **TEMPLATE_STRUCTURE**: Reusable WoW workflows with project-specific hooks
- **PROJECT_REGISTRY**: Central tracking of registered projects for event-driven choreography

## Development Team
- **PRIMARY_MAINTAINER**: sesameh organization  
- **DEVELOPMENT_APPROACH**: Human-AI collaborative development using claude-swift workflows
- **COLLABORATION_MODEL**: Strategic direction (human) + tactical execution (Claude)

## Project Boundaries
- **SCOPE**: Template system for Claude Code deployment
- **NOT_SCOPE**: Specific project implementation, business logic, application development
- **TARGET_USERS**: Development teams wanting to adopt Claude Code ways of working

## Dependencies
- **RUNTIME**: Claude Code CLI environment
- **TOOLS**: git, gh (GitHub CLI), basic shell utilities
- **PLATFORMS**: Cross-platform (Windows/WSL, macOS, Linux)

## Success Criteria
- **DEPLOYABILITY**: Clean deployment to any target project
- **SEPARATION**: Zero mixing of template machinery with project content
- **USABILITY**: Clear workflow triggers and guidance for users
- **MAINTAINABILITY**: Template updates don't conflict with project documentation

## Key Files for Understanding

**Core Platform**:
- `template/` - Claude-swift template system
- `docs/architecture/template-system-architecture.md` - System architecture
- `docs/deployment/` - Deployment guides and procedures

## Workspace Configuration
- **Projects Directory**: Symlinked to /home/herma
- **Workspace Type**: Automatic detection (../..)
- **Initialized**: 2025-07-14
- **Initialization Method**: INITIALISE workflow (updated to automatic detection)

---

*Historical project information documentation preserved from original claude/project/project-info.md*