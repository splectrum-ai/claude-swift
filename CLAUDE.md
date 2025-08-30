# CLAUDE.md

This file provides essential operational guidance for Claude Code when working with this repository.

## Quick Reference

**User-Friendly Sesame Triggers:**
Core responsibilities with natural language "sesame" suffix:
- `inbox sesame` → INBOX management (task ingestion and processing)
- `outbox sesame` → OUTBOX management (task distribution and routing)
- `task sesame` → TASK execution and management
- `issue sesame` → ISSUE data management and operations
- `workflow sesame` → WORKFLOW process management


**MANDATORY WORKFLOW DOCUMENTATION**: It is MANDATORY to read workflow documentation before executing any workflow. Core responsibility workflows are documented in `claude/wow/workflows/[responsibility-name]/` folders. All workflow-specific information is contained within the workflow folder.

**Single-Word Sesame Magic Word:**
**`sesame`** (standalone) → **Universal positive affirmation**
- **Meaning**: "Yes", "I agree", "Go ahead", "Proceed", "Approved"
- **Usage**: Response to proposals, options, or requests for confirmation
- **Context**: Replaces verbose confirmations with elegant single-word approval
- **Reference**: "Open Sesame" - the magic word that opens possibilities

**Critical Workflow Principles:**
- **Task-Based Execution**: Each step is a task which is posted in inbox, moved to active during execution and into completed when execution is finished. The info in the completed task will be used for commits. Committed completed tasks are deleted.
- **File Path Specification**: All references MUST specify exact paths
- **Repository State**: All work committed directly to main branch

## Key Files for Understanding

**Core Platform**:
- `claude/wow/` - Ways of Working framework
- `claude/local/repo-config.json` - Local repository-specific configuration for scripts and workflows (instance-specific settings only)

**SPL Execution**: Use repository-configured command tool from `claude/local/repo-config.json`
- **Command Path**: `./spl_execute` (repository-context aware)
- **Install Target**: Configured in `claude/local/repo-config.json`
- **Usage Pattern**: `./spl_execute {install} {command} [args...]`
- **Example**: `./spl_execute {configured_install} spl/console/log "hello world"`
- **Status**: Active development use with repository-aware routing
