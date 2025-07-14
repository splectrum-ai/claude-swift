# Sesame Triggers Reference

Complete list of all sesame triggers available in claude-swift orchestrator and registered projects.

## Orchestration Triggers

### Project Management
- `initialise sesame` - Initialize orchestrator workspace (one-time setup)
- `register [org/repo] sesame` - Register a project for orchestration
- `outbox sesame` - Distribute tasks across all registered projects (orchestrator only)
- `outbox . sesame` - Process self-targeted tasks from outbox to inbox (universal)
- `inbox sesame` - Process received tasks into GitHub issues with milestone assignment

### Task Creation
- `task [repo] sesame` - Create task for specific repository
- `task . sesame` - Create task for current repository
- `task sesame` - Interactive task creation (prompts for target)

## Workflow Triggers

### Session Management
- `start sesame` - Begin work session with context loading
- `finish sesame` - End session with git operations and cleanup
- `next sesame` - Get prioritized issue recommendations (up to 6)

### Version Management
- `version sesame` - Plan new version with issue creation
- `release sesame` - Execute full version release process
- `patch sesame` - Create patch release (bug fixes only)
- `transition sesame` - Automated 6-step version transition

### Git Operations
- `commit sesame` - Intelligent commit with issue tracking
- `git sesame` - Status, add, commit, push workflow

### Documentation
- `audit sesame` - Validate and analyze audit logs

## Specialized Triggers

### Validation
- `mandatory sesame` - Refresh and validate all mandatory rules

### Issue Management
- `issue sesame` - Manual issue creation or issue cache synchronization
- `close sesame` - Manual issue closure

## Usage Patterns

### Starting Work
```bash
# In any repository (orchestrator or project)
start sesame
outbox . sesame     # Process self-targeted tasks (universal)
inbox sesame        # Convert inbox tasks to GitHub issues
next sesame         # See what to work on

# Cross-project task distribution (orchestrator only)
outbox sesame       # Distribute tasks to all registered projects
```

### Creating Cross-Project Tasks
```bash
# From project A, create task for project B
task project-b sesame

# From orchestrator, distribute
outbox sesame       # Cross-repository distribution

# In project B
inbox sesame        # Converts to GitHub issue with milestone assignment

# Self-targeted tasks (any repository)
task . sesame       # Create task for current repository
outbox . sesame     # Move to inbox for processing
inbox sesame        # Convert to GitHub issue
```

### Releasing Versions
```bash
# Plan the version
version sesame      # Creates version issues

# Develop features
next sesame        # Work through issues

# Release
release sesame     # Or patch sesame for fixes
```

## Magic Word Usage

### Single Word: `sesame`
When used alone, `sesame` acts as universal confirmation:
- "Yes"
- "Proceed"  
- "I agree"
- "Continue"

Example:
```
Claude: "Should I create these 3 issues for the new feature?"
User: sesame
```

## Tips

### Efficient Orchestration
1. Run `outbox . sesame` in any repository to process self-targeted tasks
2. Run `outbox sesame` in orchestrator to distribute cross-repository tasks
3. Process inbox before starting new work with `inbox sesame`
4. Use `task . sesame` for same-project tasks (creates local outbox tasks)
5. New issues automatically get target version milestone unless overridden

### Project Switching
```bash
# Terminal 1: Orchestrator
outbox sesame       # Distribute tasks

# Terminal 2: Project A
inbox sesame        # Get new tasks
next sesame         # Work on them

# Terminal 3: Project B  
inbox sesame        # Get new tasks
next sesame         # Work on them
```

### Batch Operations
```bash
# Create multiple tasks quickly
task project-a sesame
task project-b sesame  
task . sesame

# Then distribute all at once
outbox sesame
```