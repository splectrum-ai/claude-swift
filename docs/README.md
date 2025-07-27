# Claude-Swift Documentation

Claude-swift provides the Ways of Working (WoW) framework used by all registered projects. Each project runs its own Claude sessions independently.

## Core Documentation

### [Reference](reference/)
- [Sesame Triggers](reference/sesame-triggers.md) - Command reference
- [Session Management](reference/session-management.md) - Work sessions
- [Audit Logging](reference/audit-logging.md) - Event tracking
- [Inbox/Outbox](reference/inbox-outbox.md) - Task distribution
- [Local Issues](reference/local-issues.md) - Issue management

### [Getting Started](getting-started/)
Quick start guide for new users.

### [Registered Project Guide](registered-project-guide.md)
Integration guide for projects using the framework.

## Framework Structure

```
claude/
├── wow/           # Ways of Working framework (from claude-swift)
│   ├── scripts/   # Management scripts
│   └── workflows/ # Workflow definitions
├── project/       # Project-specific configuration (each project)
│   └── audit/     # Project-specific audit logs
├── issues/        # Local issue storage
├── inbox/         # Received tasks
└── outbox/        # Outgoing tasks
```

**Note**: The `claude/wow/` directory comes from claude-swift and is shared by all projects. The `claude/project/` directory is specific to each individual project.

## Key Commands

- `start sesame` - Begin work session
- `issue-manage sync` - Sync issues with GitHub
- `inbox sesame` - Process received tasks
- `finish sesame` - End work session