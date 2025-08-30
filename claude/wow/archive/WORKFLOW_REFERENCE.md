# Workflow Reference - Claude WoW Workflows

Reference guide to all workflows in the Claude Ways of Working system.

## Core Session Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| SESSION_START | `workflows/SESSION_START.md` | Session initialization and setup |
| SESSION_END | `workflows/SESSION_END.md` | Session termination and cleanup |

## Development Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| COMMIT | `workflows/COMMIT.md` | Intelligent commit with issue closure |
| GIT_WORKFLOW | `workflows/GIT_WORKFLOW.md` | Git operations and branch management |
| DOCUMENTATION_WORKFLOW | `workflows/DOCUMENTATION_WORKFLOW.md` | Documentation standards and creation |
| OPERATIONAL_RULES | `workflows/OPERATIONAL_RULES.md` | Development rules and standards |

## Issue Management Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| ISSUE | `workflows/ISSUE.md` | Unified issue management orchestrator |
| CREATE_ISSUE | `workflows/ISSUE/CREATE_ISSUE.md` | Interactive issue creation |
| CLOSE_ISSUE | `workflows/ISSUE/CLOSE_ISSUE.md` | Issue closure with comments |
| NEXT_ISSUE | `workflows/ISSUE/NEXT_ISSUE.md` | Issue recommendation engine |
| ISSUE_CACHE | `workflows/ISSUE/ISSUE_CACHE.md` | Local issue caching |

## Release Management Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| RELEASE | `workflows/RELEASE.md` | Unified release management orchestrator |
| FULL_RELEASE | `workflows/RELEASE/FULL_RELEASE.md` | Complete version release process |
| PATCH_RELEASE | `workflows/RELEASE/PATCH_RELEASE.md` | Patch release process |
| VERSION_TRANSITION | `workflows/RELEASE/VERSION_TRANSITION.md` | Post-release transition processing |
| NEW_VERSION_PLANNING | `workflows/RELEASE/NEW_VERSION_PLANNING.md` | Next version planning |
| VERSION | `workflows/VERSION.md` | Version coordination workflow |

## Task Management Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| INBOX | `workflows/INBOX.md` | Task ingestion and GitHub issue creation |
| OUTBOX | `workflows/OUTBOX.md` | Cross-repository task distribution |
| TASK_CREATE | `workflows/TASK_CREATE.md` | Interactive task creation |

## Workflow Structure

### Orchestrator Pattern
Main workflows (`ISSUE`, `RELEASE`) act as orchestrators that delegate to sub-workflows and scripts.

### Script Integration
All workflows delegate implementation to scripts in `claude/wow/scripts/` for:
- Consistent execution patterns
- Maintainable implementation
- Reusable components

### Template System
Workflows use templates from `claude/wow/templates/` for:
- Standardized content generation
- Consistent formatting
- Extensible design

## Project-Specific Workflows

**Important**: Projects may define additional workflows in their own workflow reference:
- `claude/project/WORKFLOW_REFERENCE.md` - Project-specific workflow extensions
- Project workflows extend but do not override WoW workflows
- Check project reference for additional available workflows

## Usage

**Trigger Information**: See `CLAUDE.md` for user-friendly sesame triggers  
**Script Details**: See `SCRIPT_REFERENCE.md` for implementation scripts  
**Templates**: See `TEMPLATE_REFERENCE.md` for content templates

---

*Comprehensive reference to all Claude Ways of Working workflows*