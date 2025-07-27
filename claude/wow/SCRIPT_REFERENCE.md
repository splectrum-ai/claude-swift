# Script Reference - Claude Workflow Scripts

Comprehensive reference for all executable scripts in the Claude workflow system.

## Overview

All scripts use Node.js with shebang execution (`#!/usr/bin/env node`) and can be called directly:
```bash
claude/wow/scripts/script-name [options]
```

## Script Categories

### Core Workflow Scripts

#### `audit-log`
**Purpose**: Centralized audit logging for all workflow activities  
**Usage**: `audit-log <workflow> <action> <step> <details> <description>`  
**Example**: 
```bash
audit-log "COMMIT" "step" "change_assessment" "" "Analyzing current changes"
```

#### `audit-manage`
**Purpose**: Audit log management and archiving operations  
**Usage**: `audit-manage <command> [options]`  
**Commands**: `archive-session`, `cleanup`, `validate`

**Note**: Commit operations are now available through `git-manage commit` (see Git Operations section)

### Git Operations

#### `git-manage`
**Purpose**: Unified git operations management  
**Usage**: `git-manage <command> [options]`  
**Commands**: 
- `status` - Enhanced git status with workflow output
- `sync` - Repository synchronization with remote
- `clean` - Safe workspace cleanup operations  
- `info` - Repository information and metadata
- `release` - Git tag and release creation
- `commit` - Intelligent commit workflow with issue detection

#### `git-status`
**Purpose**: Enhanced git status with workflow-friendly output  
**Usage**: `git-status [--porcelain] [--verbose]`  
**Output**: Structured status information for workflow consumption

#### `git-sync`
**Purpose**: Synchronize repository with remote, handle conflicts  
**Usage**: `git-sync [--force] [--dry-run]`  
**Features**: Auto-pull, conflict detection, branch synchronization

#### `git-clean`
**Purpose**: Clean repository state, remove untracked files  
**Usage**: `git-clean [--dry-run] [--force]`  
**Safety**: Dry-run mode for preview before execution

#### `git-info`
**Purpose**: Extract repository information and metadata  
**Usage**: `git-info [--format json|text]`  
**Output**: Branch, commit info, remote URLs, repository state

#### `git-release`
**Purpose**: Git operations for release creation and tagging  
**Usage**: `git-release <version> [--notes "text"]`  
**Features**: Tag creation, release branch management

### GitHub Integration

#### `gh-api`
**Purpose**: Generic GitHub API operations with authentication  
**Usage**: `gh-api <endpoint> [--method GET|POST|PUT] [--data "json"]`  
**Features**: Rate limiting, error handling, response formatting

#### `gh-issue`
**Purpose**: GitHub issue management operations  
**Usage**: `gh-issue <action> [options]`  
**Actions**: `create`, `close`, `list`, `update`, `comment`  
**Example**:
```bash
gh-issue create --title "Bug fix" --body "Description" --labels "bug,priority"
gh-issue close 123 --comment "Fixed in latest commit"
```

#### `gh-release`
**Purpose**: GitHub release creation and management  
**Usage**: `gh-release <action> <version> [options]`  
**Actions**: `create`, `update`, `delete`, `list`  
**Features**: Asset uploads, release notes, draft releases

### File and Directory Operations

#### `ensure-directory`
**Purpose**: Create directory structure with proper permissions  
**Usage**: `ensure-directory <path> [--mode 755]`  
**Features**: Recursive creation, permission setting, existence checking

#### `move-file`
**Purpose**: Safe file movement with backup and rollback  
**Usage**: `move-file <source> <destination> [--backup]`  
**Safety**: Atomic operations, backup creation, error recovery

### Analysis and Optimization Tools

#### `audit-manage metrics`
**Purpose**: Analyze audit logs for workflow performance metrics  
**Usage**: `audit-manage metrics [--period days] [--format json|report]`  
**Output**: Workflow timing, frequency analysis, performance insights

#### `transition-manage`
**Purpose**: Unified transition and version management operations  
**Usage**: `transition-manage <command> [options]`  
**Commands**: 
- `maintenance-analysis` - Analyze repository health and maintenance needs  
- `strategic-analysis` - High-level strategic analysis of project progress  
- `readiness-validation` - Validate repository readiness for version releases  
- `version-transition` - Execute full version transition process  
- `new-version-planning` - Plan next version development  
- `patch-release` - Execute patch release workflow  
- `knowledge-sync` - Synchronize knowledge base  
- `knowledge-update` - Update knowledge base documentation
- `get-started` - Generate onboarding documentation from development experience

### Knowledge Management

**Note**: Knowledge management operations are now available through `transition-manage`:
- `transition-manage knowledge-update` - Update project knowledge base
- `transition-manage knowledge-sync` - Synchronize knowledge across components

**Note**: Onboarding documentation generation is now available through `transition-manage get-started`

### Archive and Cleanup

#### `archive-audit-logs.js`
**Purpose**: Archive completed audit logs for long-term storage  
**Usage**: `archive-audit-logs [--compress] [--destination path]`  
**Features**: Compression, timestamping, organized storage

### Utility Scripts

#### `debug-repo.js`
**Purpose**: Repository debugging and diagnostic information  
**Usage**: `debug-repo [--verbose] [--check-all]`  
**Output**: System state, configuration issues, dependency problems

### Legacy Scripts

#### `audit-functions.sh`
**Purpose**: Legacy bash functions for audit logging  
**Status**: Deprecated - use `audit-log` instead  
**Migration**: Node.js scripts provide better functionality

#### `git-workflow-helpers.sh`
**Purpose**: Legacy bash helpers for git operations  
**Status**: Deprecated - use individual `git-*` scripts instead

## Integration Patterns

### Workflow Usage
```bash
# In workflow files
claude/wow/scripts/audit-manage log "WORKFLOW" "start" "init" "" "Starting workflow"
claude/wow/scripts/git-manage status --porcelain
claude/wow/scripts/git-manage commit --message "Auto-generated commit"
```

### Error Handling
All scripts follow consistent error handling:
- Exit code 0 for success
- Exit code 1 for user errors
- Exit code 2 for system errors
- Structured error messages to stderr

### Output Formats
Scripts support multiple output formats:
- `--format json` for machine consumption
- `--format text` for human readable (default)
- `--quiet` for minimal output
- `--verbose` for detailed output

## Library Modules (`lib/` directory)

### Core Libraries
- `audit.js` - Audit logging functionality
- `cache.js` - Caching operations
- `events.js` - Event emission system
- `github-api.js` - GitHub API wrapper
- `repo-config.js` - Repository configuration

### Specialized Libraries
- `github-cache.js` - GitHub data caching
- `github-issues.js` - Issue management
- `github-releases.js` - Release management
- `tasks.js` - Task file operations
- `workflow-orchestration.js` - Workflow coordination

## Best Practices

### Script Execution
1. Always use full paths in workflows
2. Check exit codes for error handling
3. Use appropriate output formats for context
4. Include audit logging for workflow steps

### Error Recovery
1. Most scripts support `--dry-run` for testing
2. Use `--verbose` for debugging issues
3. Check logs in `claude/project/audit/current/current.log`
4. Scripts are designed to be idempotent when possible

### Performance
1. Use batch operations when available
2. Cache-enabled scripts for repeated operations
3. Lazy loading for expensive operations
4. Event-driven patterns for non-blocking workflows

---

*All scripts are designed for AI-assisted development workflows with consistent interfaces and comprehensive error handling.*