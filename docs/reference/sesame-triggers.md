# Sesame Triggers Reference

Core workflow triggers available in the claude-swift framework.

## Session Management

- `start sesame` - Initialize work session (runs OUTBOX, INBOX, issue triage)
- `finish sesame` - End session with cleanup

## Git Operations

- `commit sesame` - Intelligent commit with issue detection
- `release sesame` - Execute version release process
- `issue sesame` - Issue management operations
- `inbox sesame` - Process inbox tasks to GitHub issues
- `to-inbox sesame` - Move self-targeted tasks to inbox
- `outbox sesame` - Distribute tasks across registered projects (when registered projects exist)
- `task sesame` - Create cross-repository task

## Single Word Usage

`sesame` (standalone) - Universal positive affirmation ("Yes", "Proceed", "Continue")

## Common Workflows

### Starting Work
```bash
start sesame      # Initializes session
```

### Task Distribution
```bash
# From any project with registered projects
outbox sesame     # Collect and distribute tasks

# In any repository  
inbox sesame      # Process received tasks
```

### Creating Tasks
```bash
task sesame       # Interactive task creation
task . sesame     # Task for current repository
task [repo] sesame # Task for specific repository
```