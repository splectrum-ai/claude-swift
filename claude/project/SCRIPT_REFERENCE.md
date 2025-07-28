# Script Reference - Claude Project Scripts

Project-level scripts for claude-swift orchestrator operations.

## Overview

Scripts in `claude/project/scripts/` are specific to the claude-swift orchestrator project and handle multi-project management operations.

## Available Scripts

### Project Management Scripts

#### `register-manage`
**Purpose**: Registry and registration management for multi-project orchestration
**Available Commands**: 
- `init` - Initialize workspace
- `add [org/repo]` - Register specific project
- `remove [org/repo]` - Unregister project
- `list` - Show all registered projects
- `status` - Show workspace and registration status

**Examples**:
```bash
claude/project/scripts/register-manage init
claude/project/scripts/register-manage add splectrum/spl1
claude/project/scripts/register-manage list
claude/project/scripts/register-manage status
```

## Integration with WoW Framework

Project scripts complement the WoW framework scripts in `claude/wow/scripts/`. While WoW scripts handle general workflow operations, project scripts handle orchestrator-specific multi-project management.

## Usage Notes

1. Always run project scripts from the claude-swift root directory
2. Project scripts operate on the registered projects in the workspace
3. Use `claude/project/scripts/script-name [command]` for execution
4. Check exit codes for error handling

---

*Project-specific scripts for claude-swift orchestrator operations*