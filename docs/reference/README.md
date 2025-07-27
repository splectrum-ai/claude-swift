# Claude-Swift Reference Documentation

Core system documentation for the claude-swift framework.

## Key Components

### [Framework Overview](framework-overview.md)
Understanding claude-swift as a framework provider.

### [Sesame Triggers](sesame-triggers.md)
Command triggers for workflow execution.

### [Session Management](session-management.md)
Work session boundaries with automatic task processing.

### [Audit Logging](audit-logging.md)
Workflow execution tracking and metrics.

### [Inbox/Outbox System](inbox-outbox.md)
Cross-repository task distribution.

### [Local Issues](local-issues.md)
File-based issue management synchronized with GitHub.

## Quick Start

1. **Start Session**: `start sesame`
2. **Process Tasks**: `inbox sesame`
3. **Work on Issues**: Use `issue-manage` commands
4. **Sync with GitHub**: `issue-manage sync`
5. **End Session**: `finish sesame`

## Scripts Location

All management scripts are in `claude/wow/scripts/`:
- `audit-manage` - Audit log operations
- `issue-manage` - Local issue management
- `inbox-process` - Task to issue conversion
- `outbox-process` - Task distribution
- `task-create` - Cross-repository task creation