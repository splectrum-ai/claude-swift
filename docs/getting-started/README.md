# Getting Started with Claude-Swift Orchestrator

## Prerequisites

Before starting, ensure you have:
- Claude Code CLI installed and accessible
- GitHub CLI (`gh`) authenticated
- Git configured with your credentials
- A GitHub account with repository access

## Quick Start

### 1. Set Up Orchestrator

```bash
# Clone the orchestrator repository
git clone https://github.com/sesameh/claude-swift.git
cd claude-swift

# Initialize the orchestrator workspace
initialise sesame
```

This creates the necessary directory structure and symlinks for project management.

### 2. Register Your First Project

```bash
# Register an existing GitHub repository
register your-org/your-repo sesame

# Or register a local repository
register path/to/local/repo sesame
```

The registration process:
- Clones the repository (if from GitHub)
- Creates a symlink in the `projects/` directory
- Synchronizes operational workflows
- Updates the project registry

### 3. Start Working

```bash
# In the orchestrator terminal
start sesame          # Begin a work session
next sesame          # Get task recommendations
outbox sesame        # Distribute tasks to projects
inbox sesame         # Process received tasks

# Create tasks for projects
task your-repo sesame     # Task for specific project
task . sesame            # Task for current project
```

### 4. Work in Project Context

Open a new terminal for project-specific work:

```bash
cd projects/your-org/your-repo
claude code .

# In Claude Code
start sesame         # Project-specific session
next sesame         # Work on project tasks
finish sesame       # Complete session
```

## Core Concepts

### Orchestrator Terminal
- Used for coordination tasks
- Manages cross-project operations
- Runs distribution workflows
- Maintains project registry

### Project Terminals
- Used for actual development work
- Standard git operations
- Project-specific Claude sessions
- Local task creation

### Task Lifecycle
1. Create task in any project
2. Task saved to project outbox
3. Orchestrator collects tasks
4. Routes to target inbox
5. Target processes to GitHub issue
6. Standard issue workflow begins

## Common Operations

### Managing Multiple Projects
```bash
# Register additional projects
register org/project-a sesame
register org/project-b sesame

# List registered projects
ls -la projects/
```

### Cross-Project Tasks
```bash
# From project-a, create task for project-b
task project-b sesame

# From orchestrator, distribute all tasks
outbox sesame
```

### Synchronizing Workflows
```bash
# Update all projects with latest workflows
# (Run from orchestrator after workflow changes)
for proj in projects/*/*; do
  rsync -av claude/wow/ "$proj/claude/wow/"
done
```

## Next Steps

- Read the [Orchestrator Overview](../orchestrator/overview.md) for architecture details
- Check [Sesame Triggers Reference](../reference/sesame-triggers.md) for all commands
- Explore workflow documentation in `claude/wow/workflows/`

## Getting Help

If you encounter issues:
1. Run `audit sesame` to check system health
2. Review the audit log for error details
3. Check GitHub issues for similar problems
4. Create a new issue with reproduction steps