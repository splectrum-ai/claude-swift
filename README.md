# Claude-Swift Template System

A sophisticated template system for deploying Claude Code ways of working (WoW) to any project using a sidecar deployment pattern with dual-folder architecture.

## Overview

Claude-swift provides a comprehensive template system that eliminates the confusion of mixing project-specific content with operational machinery. It uses a clean separation model where project documentation and WoW operational data exist in separate, appropriately managed directories.

## Architecture

### Sidecar Deployment Pattern
```
parent-directory/
├── my-project/
│   ├── claude-project/        # Project docs (tracked in git)
│   └── claude-wow/            # WoW machinery (gitignored)
└── claude-swift/              # Template repo (sidecar)
```

### Benefits
- **Zero Confusion**: Only one active WoW system per project
- **Clean Separation**: Project content stays separate from operational machinery
- **Upgrade Safety**: Template updates don't conflict with project documentation
- **Repository Focus**: Projects contain only relevant business content

## Quick Start

### Template System Usage
```bash
# Clone claude-swift template repository
git clone https://github.com/SPlectrum/claude-swift.git
cd claude-swift/

# Setup automated git workflow helpers
source claude/wow/automation/git-workflow-helpers.sh

# Deploy to target project (Claude instance detects scenario and presents options)
deploy sesame

# Start working with Claude Code workflows
# Use workflow triggers like: start sesame, git sesame, docs sesame
```

### Development Status
**Current Phase**: Template system implementation
- ✅ Architecture design complete
- ✅ Deployment guides created  
- 🔄 Deployment scripts in development
- 🔄 Testing and validation pending

## Documentation

### Core Deployment Guides
- **[Migration Deployment Guide](docs/deployment/migration-deployment-guide.md)** - Complete migration from legacy structure
- **[Sidecar Deployment Guide](docs/deployment/sidecar-deployment-guide.md)** - Fresh installs and maintenance
- **[Pre-Deployment Impact Analysis](docs/deployment/pre-deployment-impact-analysis.md)** - Safety procedures
- **[Template Cleanup Procedures](docs/deployment/template-cleanup-procedures.md)** - Content preparation

### Architecture & Design
- **[Project Overview](docs/preliminary/project-overview.md)** - Template system objectives
- **[Template Repository Structure](docs/preliminary/template-repository-structure.md)** - System organization
- **[Self-Contained Template Update Architecture](docs/preliminary/self-contained-template-update-architecture.md)** - Update mechanisms
- **[Event-Driven Workflow Testing Architecture](docs/preliminary/event-driven-workflow-testing-architecture.md)** - Testing framework
- **[Event-Driven Reminder System](docs/preliminary/event-driven-reminder-system.md)** - Automation capabilities
- **[Template Enhancement Suggestions](docs/preliminary/template-enhancement-suggestions.md)** - Future improvements

### Research & Analysis
- **[Ecosystem Competitive Analysis](docs/research/ecosystem-competitive-analysis.md)** - Market landscape and positioning

## Claude Operational System

### Master Configuration
- **[CLAUDE.md](CLAUDE.md)** - Master operational configuration

### Workflow System
- **[Keyword Registry](claude/wow/KEYWORD_REGISTRY.md)** - Complete workflow triggers
- **[Session Start Workflow](claude/wow/workflows/SESSION_START.md)** - Session initialization
- **[Session End Workflow](claude/wow/workflows/SESSION_END.md)** - Session completion
- **[Git Workflow](claude/wow/workflows/GIT_WORKFLOW.md)** - Automated version control
- **[GitHub Workflow](claude/wow/workflows/GITHUB_WORKFLOW.md)** - Repository integration
- **[Documentation Workflow](claude/wow/workflows/DOCUMENTATION_WORKFLOW.md)** - Documentation standards
- **[Repository Todo Workflow](claude/wow/workflows/REPO_TODO_WORKFLOW.md)** - Todo management system

### Operational Rules & Commands
- **[Operational Rules](claude/wow/workflows/OPERATIONAL_RULES.md)** - Core behavioral rules
- **[Essential Commands](claude/wow/workflows/ESSENTIAL_COMMANDS.md)** - Key operation commands
- **[Planned vs Unplanned Work](claude/wow/workflows/PLANNED_VS_UNPLANNED.md)** - Work classification
- **[Version Management](claude/wow/workflows/VERSION.md)** - Version orchestrator with state detection and routing
- **[Version Transition](claude/wow/workflows/VERSION_TRANSITION.md)** - Version transition sub-workflow
- **[Version Planning](claude/wow/workflows/NEW_VERSION_PLANNING.md)** - Version planning sub-workflow  
- **[Release Process](claude/wow/workflows/RELEASE_PROCESS.md)** - Release execution sub-workflow
- **[Workflow Recommendation](claude/wow/workflows/WORKFLOW_RECOMMENDATION.md)** - Intelligent suggestions

### Development Strategy
- **[Phase-Based Development Strategy](claude/wow/docs/phase-based-development-strategy.md)** - PRINCE2-inspired approach
- **[Branching Strategy](claude/wow/docs/branching-strategy.md)** - GitHub Flow with TDD

### Project Management
- **[Repository Todo List](claude/project/todo.md)** - Cross-session continuity
- **[Dual Report Strategy](claude/project/docs/dual-report-strategy.md)** - Process improvement
- **[Project Development Workflow](claude/project/docs/project-development-workflow.md)** - Current workflow practices

### Deployment Workflows
- **[Deployment](claude/project/workflows/DEPLOYMENT.md)** - Main deployment orchestrator with scenario detection
- **[Fresh Deployment](claude/project/workflows/FRESH_DEPLOYMENT.md)** - Clean installation for new projects
- **[Migration Deployment](claude/project/workflows/MIGRATION_DEPLOYMENT.md)** - Legacy structure migration

## Key Features

### Deployment Scenarios
- **Fresh Installation**: New projects with no existing Claude structure
- **Migration**: Transition from legacy `/claude/` mixed structure  
- **Maintenance**: Updates to existing dual-folder deployments
- **Discipline Recovery**: Fix mixed content violations

### Content Separation Rules
- **`/claude-project/` (Tracked)**: Project requirements, architecture, team agreements
- **`/claude-wow/` (Ignored)**: Workflows, audit logs, operational machinery

### Safety Mechanisms
- **Built-in Rollback**: CLAUDE.md replacement + session restart
- **Phased Migration**: Clear boundaries between reversible/irreversible phases
- **Content Analysis**: Automated classification of existing content
- **Validation Gates**: Required testing between deployment phases

## Workflow Triggers

Use natural language with "sesame" suffix:
- `deploy sesame` → Deployment orchestrator (detects scenario and presents options)
- `start sesame` → Session initialization
- `finish sesame` → Session completion  
- `git sesame` → Git workflow
- `github sesame` → GitHub workflow
- `todo sesame` → Repository todo management
- `version sesame` → Version management orchestrator (detects state and presents options)
- `planning sesame` → Planned vs unplanned work
- `next sesame` → Next issue selection
- `docs sesame` → Documentation workflow

## Development Status

**Current Phase**: Template system implementation
- ✅ Architecture design complete
- ✅ Deployment guides created  
- 🔄 Deployment scripts in development
- 🔄 Testing and validation pending

## Contributing

This template system follows strict operational discipline:
- All changes logged in audit system
- Repository todo list managed via REPO_TODO_WORKFLOW
- Phase-based development with clear milestones
- Comprehensive testing before deployment

## Support

For template usage and workflow questions:
1. Check documentation in docs/ directory
2. Review workflow guides in claude/wow/workflows/
3. Use workflow triggers (start sesame, docs sesame, etc.)
4. Review audit logs for troubleshooting

---

**Template Evolution**: This repository serves as both development environment and deployable template. Clone to create variants for different project types or organizational needs.