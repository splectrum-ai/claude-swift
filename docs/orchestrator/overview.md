# Orchestrator Overview

## Architecture

Claude-swift orchestrator provides centralized coordination for multiple projects while maintaining individual project autonomy.

### Components

**1. Orchestrator (Base Repository)**
- Central hub for all coordination activities
- Maintains master workflow definitions
- Routes tasks between projects
- Manages project registry

**2. Registered Projects**
- Individual repositories with their own git history
- Receive synchronized workflows from orchestrator
- Maintain project-specific content in `claude/project/`
- Execute work through interactive Claude sessions

**3. Task Communication System**
- **Inbox**: Receives tasks from other projects
- **Outbox**: Holds tasks destined for other projects
- **Distribution**: Orchestrator collects and routes tasks
- **Processing**: Tasks convert to GitHub issues

## How It Works

### Project Registration
```bash
register org/repo sesame
```
- Clones project if not present locally
- Creates symlink in `projects/` directory
- Updates `registered-projects.json` registry
- Synchronizes workflows to project

### Task Flow
1. **Creation**: Project creates task via `task [target] sesame`
2. **Collection**: Orchestrator runs `outbox sesame` to gather tasks
3. **Distribution**: Tasks routed to target project inboxes
4. **Processing**: Target runs `inbox sesame` to create issues

### Workflow Synchronization
- Master workflows live in orchestrator's `claude/wow/`
- Projects receive identical operational workflows
- Updates propagate during registration or sync operations
- Project-specific workflows remain independent

## Key Principles

### Separation of Concerns
- **Orchestrator**: Coordination and routing only
- **Projects**: Actual work execution
- **Workflows**: Shared operational patterns
- **Content**: Project-specific data remains isolated

### Asynchronous Coordination
- No direct project-to-project communication
- Task routing happens through orchestrator mediation
- Projects operate independently between sync points
- Loose coupling enables flexible scheduling

### Unified Operations
- All projects use identical sesame triggers
- Consistent workflow behavior across ecosystem
- Shared audit patterns and standards
- Common collaboration patterns

## Benefits

### For Development Teams
- Work on multiple related projects seamlessly
- Share tasks without context switching
- Maintain consistent practices across projects
- Leverage collective workflow improvements

### For Project Management
- Centralized view of cross-project activities
- Task dependencies across repository boundaries
- Unified reporting and audit trails
- Simplified onboarding for new projects

### For AI Collaboration
- Claude maintains context across projects
- Consistent interaction patterns everywhere
- Accumulated knowledge benefits all projects
- Reduced learning curve for new domains