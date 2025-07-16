# CLAUDE_OPTIMIZED.md

Streamlined operational guidance for Claude Code - focused on efficiency and outcomes.

## Core Principles

**Work First**: Complete tasks immediately, document only when necessary
**Single Source**: One clear path for each operation
**Minimal Overhead**: No ceremonial workflows during normal work
**Trust-Based**: No constant validation or compliance checking

## Essential Workflows (5 only)

1. **`commit sesame`** → Smart commit with auto issue closure
2. **`issue sesame`** → Create/sync issues (single unified workflow)  
3. **`release sesame`** → Create release (full or patch based on context)
4. **`task sesame [target]`** → Cross-repository task communication
5. **`sesame`** → Universal "yes/proceed" confirmation

## Simplified Rules

1. **Direct Execution**: Do work immediately without elaborate planning
2. **Cache-First**: Always update local cache before remote operations
3. **Main Branch Only**: Commit directly, no complex git workflows
4. **Exact Paths**: Use full file paths in all references
5. **Outcome Focus**: Skip process when it doesn't add value

## Removed Complexity

- ❌ Mandatory rule scanning on session boundaries
- ❌ Complex audit logging with markers and validation
- ❌ Circular workflow dependencies
- ❌ Propose-before-execute patterns for simple tasks
- ❌ Multiple registries and cross-references
- ❌ Ceremonial session workflows (start/finish)
- ❌ Redundant workflow variations

## Quick Context

- **Issues**: Cached in `claude/project/cache/issues.json`
- **Tasks**: Inbox at `claude/project/inbox/`
- **Current Work**: Track in memory, not elaborate workflows

## Development Tools

- `gh` - GitHub operations
- `rg` - Fast search
- `git` - Version control
- Standard language tools as needed

## When to Use Workflows

Use workflows ONLY when they add value:
- Complex multi-step operations (release process)
- Cross-repository coordination (task system)
- Batch operations (issue management)

For simple tasks, just do the work directly.