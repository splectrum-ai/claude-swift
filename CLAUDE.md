# CLAUDE.md

This file provides essential operational guidance for Claude Code when working with this repository.

## Quick Reference

**User-Friendly Sesame Triggers:**
Use natural language with "sesame" suffix:
- `start sesame` → SESSION_START workflow
- `finish sesame` → SESSION_END workflow  
- `release sesame` → RELEASE workflow (unified release management: target version executes full sequence, patch executes patch-only)
- `commit sesame` → COMMIT workflow (intelligent commit with issue closure)
- `issue sesame` → ISSUE workflow (unified issue management with natural language: close, next, cache, create)
- `inbox sesame` → INBOX workflow (task ingestion converting inbox tasks to GitHub issues with milestone assignment)
- `to-inbox sesame` → TO_INBOX workflow (process self-targeted tasks from outbox to inbox) - UNIVERSAL
- `outbox sesame` → OUTBOX workflow (collect and distribute cross-repository tasks) - ORCHESTRATOR ONLY
- `task sesame` → TASK_CREATE workflow (interactive task creation: specify target [org]/[repo] or use current)

**MANDATORY PROJECT CONTEXT**: Before working on any substantive task, Claude MUST read the project-specific context in `claude/project/project-info.md` to understand project identity and any specific requirements. This ensures work aligns with project objectives and follows project-specific patterns.

**MANDATORY SCRIPT CONTEXT**: Before working on any substantive task, Claude MUST read the script tools reference `claude/wow/SCRIPT_REFERENCE.md` to understand how to use the script toolsn for any specific requirements.

**Single-Word Sesame Magic Word:**
**`sesame`** (standalone) → **Universal positive affirmation**
- **Meaning**: "Yes", "I agree", "Go ahead", "Proceed", "Approved"
- **Usage**: Response to proposals, options, or requests for confirmation
- **Context**: Replaces verbose confirmations with elegant single-word approval
- **Reference**: "Open Sesame" - the magic word that opens possibilities

**Critical Workflow Principles:**
- **Outcome-First Optimization**: Question when rules add value vs. create overhead - optimize for outcomes, activate process only when needed
- **Ceremonial Workflow Boundaries**: `start sesame` and `finish sesame` workflows exist for critical session boundaries but should be completely ignored during normal work - zero cognitive load until explicitly triggered
- **Item-Triggered Audit Logging**: When work 'feels' like a discrete item, execute the work completely, then log multiple `item_complete` entries reflecting each workflow used during completion. Log any observations about what went badly or issues encountered, then forget - fire and forget approach
- **Single-Step Completion**: Each step is DONE, then choose next action
- **File Path Specification**: All references MUST specify exact paths
- **Repository State**: All work committed directly to main branch

## Key Files for Understanding

**Core Platform**:
- `claude/wow/` - Ways of Working framework
- `claude/local/repo-config.json` - Local repository-specific configuration for scripts and workflows (instance-specific settings only)

## Documentation Standards

**Documentation Rules**: See `claude/wow/workflows/OPERATIONAL_RULES.md` for mandatory documentation standards and automatic correction procedures.