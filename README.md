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

### Fresh Project Deployment
```bash
# Setup
mkdir my-workspace/
cd my-workspace/
git clone https://github.com/user/my-project.git
git clone https://github.com/SPlectrum/claude-swift.git

# Deploy
cd claude-swift/
./deploy fresh --target ../my-project

# Setup automated git workflow (prevents sync issues)
source claude/scripts/git-workflow-helpers.sh
```

### Existing Project Migration
```bash
# Migrate from legacy /claude/ structure
cd claude-swift/
./deploy migrate --target ../my-project --analyze
./deploy migrate --target ../my-project --execute
```

## Documentation

### Core Guides
- **[Migration Deployment Guide](docs/deployment/migration-deployment-guide.md)** - Complete migration from legacy structure
- **[Sidecar Deployment Guide](docs/deployment/sidecar-deployment-guide.md)** - Fresh installs and maintenance
- **[Pre-Deployment Impact Analysis](docs/deployment/pre-deployment-impact-analysis.md)** - Safety procedures
- **[Template Cleanup Procedures](docs/deployment/template-cleanup-procedures.md)** - Content preparation

### Architecture Documents
- **[Project Overview](docs/preliminary/project-overview.md)** - Template system objectives
- **[Template Repository Structure](docs/preliminary/template-repository-structure.md)** - System organization
- **[Self-Contained Template Update Architecture](docs/preliminary/self-contained-template-update-architecture.md)** - Update mechanisms
- **[Event-Driven Workflow Testing Architecture](docs/preliminary/event-driven-workflow-testing-architecture.md)** - Testing framework
- **[Event-Driven Reminder System](docs/preliminary/event-driven-reminder-system.md)** - Automation capabilities
- **[Template Enhancement Suggestions](docs/preliminary/template-enhancement-suggestions.md)** - Future improvements

### Research & Analysis
- **[Ecosystem Competitive Analysis](docs/research/ecosystem-competitive-analysis.md)** - Market landscape and positioning

### Operational Workflows
- **[CLAUDE.md](CLAUDE.md)** - Master operational configuration
- **[Repository Todo Workflow](claude/workflows/REPO_TODO_WORKFLOW.md)** - Todo management system
- **[Keyword Registry](claude/workflows/KEYWORD_REGISTRY.md)** - Complete workflow triggers
- **[Session Start Workflow](claude/workflows/SESSION_START.md)** - Session initialization
- **[Session End Workflow](claude/workflows/SESSION_END.md)** - Session completion
- **[Git Workflow](claude/workflows/GIT_WORKFLOW.md)** - Automated version control with sync helpers
- **[GitHub Workflow](claude/workflows/GITHUB_WORKFLOW.md)** - Repository integration
- **[Operational Rules](claude/workflows/OPERATIONAL_RULES.md)** - Core behavioral rules
- **[Essential Commands](claude/workflows/ESSENTIAL_COMMANDS.md)** - Key operation commands
- **[Release Process](claude/workflows/RELEASE_PROCESS.md)** - Version release procedures
- **[Planned vs Unplanned Work](claude/workflows/PLANNED_VS_UNPLANNED.md)** - Work classification
- **[Version Transition](claude/workflows/VERSION_TRANSITION.md)** - Version management
- **[New Version Planning](claude/workflows/NEW_VERSION_PLANNING.md)** - Version planning
- **[Workflow Recommendation](claude/workflows/WORKFLOW_RECOMMENDATION.md)** - Intelligent suggestions
- **[Documentation Workflow](claude/workflows/DOCUMENTATION_WORKFLOW.md)** - Documentation standards and compliance

### Project Planning
- **[Phase-Based Development Strategy](claude/workflows/phase-based-development-strategy.md)** - PRINCE2-inspired approach
- **[Phase-Based Implementation Guide](claude/workflows/phase-based-implementation-guide.md)** - Step-by-step workflow
- **[Branching Strategy](claude/workflows/branching-strategy.md)** - GitHub Flow with TDD
- **[Current Development Process](claude/project/docs/current-development-process.md)** - Active workflow
- **[Repository Todo List](claude/project/todo.md)** - Cross-session continuity
- **[Dual Report Strategy](claude/project/docs/dual-report-strategy.md)** - Process improvement

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
- `start sesame` → Session initialization
- `finish sesame` → Session completion  
- `git sesame` → Git workflow
- `github sesame` → GitHub workflow
- `todo sesame` → Repository todo management
- `planning sesame` → Planned vs unplanned work
- `next sesame` → Next issue selection
- `transition sesame` → Version transition
- `docs sesame` → Documentation workflow

## Development Status

**Current Phase**: Template system implementation
- ✅ Architecture design complete
- ✅ Deployment guides created
- 🔄 Script implementation in progress
- 🔄 Testing and validation pending

## Contributing

This template system follows strict operational discipline:
- All changes logged in audit system
- Repository todo list managed via REPO_TODO_WORKFLOW
- Phase-based development with clear milestones
- Comprehensive testing before deployment

## Support

For deployment issues:
1. Run pre-deployment analysis
2. Check deployment guides for procedures
3. Use rollback mechanisms if needed
4. Review audit logs for troubleshooting

---

**Template Evolution**: This repository serves as both development environment and deployable template. Clone to create variants for different project types or organizational needs.