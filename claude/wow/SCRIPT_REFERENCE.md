# Script Reference - Claude Workflow Scripts

Comprehensive reference for all executable scripts in the Claude workflow system.

## Overview

All scripts use Node.js with shebang execution (`#!/usr/bin/env node`) and can be called directly:
```bash
claude/wow/scripts/script-name [options]
```

**Only the main script files in `claude/wow/scripts/` directory can be executed directly. Subdirectory scripts are internal/support files.**

## Available Scripts

### Core Management Scripts

#### `audit-manage`
**Purpose**: Centralized audit operations and management  
**Available Commands**: 
- `log <workflow> <action> <step> <details> <description>` - Basic audit logging
- `archive-session` - Archive current log for session end
- `archive-version <version>` - Archive logs for version release
- `fresh-log` - Create fresh audit log with marker
- `cleanup [--days N]` - Clean up old logs (default 30 days)
- `metrics` - Run audit metrics analysis

**Examples**:
```bash
audit-manage log SESSION_START workflow_start session_init
audit-manage archive-session
audit-manage archive-version v1.2.3
```

#### `git-manage`
**Purpose**: Unified git operations management  
**Available Commands**: 
- `status` - Enhanced git status with workflow output
- `sync` - Repository synchronization with remote
- `clean` - Safe workspace cleanup operations
- `info` - Repository information and metadata
- `release` - Git tag and release creation
- `commit` - Intelligent commit workflow with issue detection

#### `github-manage`
**Purpose**: Unified GitHub operations management  
**Available Commands**: 
- `issue` - Issue management operations
- `release` - Release management operations
- `api` - Generic GitHub API operations

#### `issue-manage`
**Purpose**: Local issue management operations  
**Available Commands**: 
- `create <type> <title>` - Create new issue
- `import <file>` - Import issue from task file
- `list [location]` - List issues (all/unassigned/v1.0/etc)
- `show <id>` - Show issue details
- `close <id|milestone>` - Close issue or milestone
- `triage` - Review unassigned issues
- `housekeeping` - Remove closed milestones
- `seed [--dry-run] [--state=open|closed]` - Import from GitHub
- `sync [--dry-run] [--state=open|all]` - Bidirectional sync with GitHub

#### `project-manage`
**Purpose**: Project-level management operations  
**Available Commands**: 
- `init-issues` - Initialize local issues structure
- `sync-templates` - Sync templates from framework (preserves custom)
- `validate` - Validate project structure
- `setup` - Complete project setup (init + sync + validate)

#### `transition-manage`
**Purpose**: Unified transition and version management operations  
**Available Commands**: 
- `version-transition` - Execute full version transition process
- `new-version-planning` - Plan next version development
- `patch-release [version]` - Execute patch release workflow
- `knowledge-sync [args]` - Synchronize knowledge base
- `knowledge-update [args]` - Update knowledge base documentation
- `maintenance-analysis [args]` - Analyze repository maintenance needs
- `strategic-analysis [args]` - Generate strategic insights
- `readiness-validation [args]` - Validate version readiness
- `get-started [args]` - Generate onboarding documentation

**Examples**:
```bash
transition-manage version-transition
transition-manage patch-release v1.2.1
transition-manage knowledge-sync --target docs
```

### Task and Workflow Scripts

#### `task-create`
**Purpose**: Task creation and management  
**Note**: Script has execution issues (shebang line ending problem)

#### `inbox-process`
**Purpose**: Process inbox tasks and convert to issues  
**Behavior**: Processes tasks from inbox directory, creates GitHub issues

#### `outbox-process`
**Purpose**: Collect and distribute cross-repository tasks  
**Behavior**: Routes tasks between repositories in orchestrator mode

## Integration Patterns

### Workflow Usage
```bash
# In workflow files
claude/wow/scripts/audit-manage log "WORKFLOW" "start" "init" "" "Starting workflow"
claude/wow/scripts/git-manage status
claude/wow/scripts/git-manage commit --message "Auto-generated commit"
claude/wow/scripts/issue-manage close 123
claude/wow/scripts/transition-manage version-transition
```

### Error Handling
All scripts follow consistent error handling:
- Exit code 0 for success
- Exit code 1 for user errors
- Exit code 2 for system errors
- Structured error messages to stderr

### Getting Help
Execute any script without arguments to see available commands:
```bash
claude/wow/scripts/audit-manage     # Shows all audit-manage commands
claude/wow/scripts/git-manage       # Shows all git-manage commands
claude/wow/scripts/issue-manage     # Shows all issue-manage commands
```

## Support Files and Libraries

### Internal Support Directories
- `audit/` - Audit-specific libraries and analyzers
- `git/` - Git operation implementations
- `github/` - GitHub API implementations
- `transition/` - Version transition engines
- `lib/` - Shared library modules
- `_old/` - Deprecated/legacy scripts (archived)

**Note**: Files in subdirectories are not directly executable and are used internally by the main scripts.

## Best Practices

### Script Execution
1. Always use full paths in workflows: `claude/wow/scripts/script-name`
2. Check exit codes for error handling
3. Use help (no arguments) to discover available commands
4. Include audit logging for workflow steps

### Error Recovery
1. Scripts provide meaningful error messages
2. Use `--dry-run` flags when available for testing
3. Check logs in `claude/project/audit/current/current.log`
4. Scripts are designed to be idempotent when possible

---

*All scripts are designed for AI-assisted development workflows with consistent interfaces and comprehensive error handling.*