# CLAUDE.md

This file provides essential operational guidance for Claude Code when working with this repository.

## Quick Reference

**User-Friendly Sesame Triggers:**
Use natural language with "sesame" suffix:
- `start sesame` → SESSION_START workflow
- `finish sesame` → SESSION_END workflow  
- `release sesame` → RELEASE_PROCESS (full version)
- `patch sesame` → RELEASE_PROCESS (patch mode)
- `next sesame` → NEXT_ISSUE
- `transition sesame` → VERSION_TRANSITION (complete 6-step automation)
- `version sesame` → NEW_VERSION_PLANNING (version setup and issue management)
- `audit sesame` → AUDIT_LOGGING (audit log management and format validation)
- `mandatory sesame` → MANDATORY_RULES_REFRESH (scan and validate all mandatory rules)
- `commit sesame` → COMMIT workflow (intelligent commit with issue closure)
- `issue sesame` → ISSUE_CACHE workflow (issue cache synchronization) or manual issue creation
- `close sesame` → Manual issue closure for occasional needs
- `inbox sesame` → INBOX workflow (task ingestion converting inbox tasks to GitHub issues with milestone assignment)
- `outbox . sesame` → OUTBOX workflow (process self-targeted tasks from outbox to inbox)
- `task [org/repo] sesame` → TASK_CREATE workflow (interactive task creation for cross-repository communication)
- `task . sesame` → TASK_CREATE workflow targeting current repository

**MANDATORY**: When encountering a sesame trigger that is NOT in the above list, you MUST check [claude/project/KEYWORD_REGISTRY.md](./claude/project/KEYWORD_REGISTRY.md) for project-specific workflows before reporting it as unknown.

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

**IMPORTANT**: All rules marked "MANDATORY" override default behavior and MUST be followed exactly.


## Critical File Reference Rule

**MANDATORY FILE PATH SPECIFICATION**: All file references in workflows, documentation, and instructions MUST specify exact file paths.

**Examples:**
- ❌ "log in timelog" → ✅ "log in `claude/project/audit/current/current.log`"
- ❌ "update documentation" → ✅ "update `docs/project-overview.md`"
- ❌ "check the config" → ✅ "check `settings/config.json`"

**Purpose**: Eliminates ambiguity, prevents errors, enables automation, and improves maintainability.

## Critical Audit Logging Rule

**Audit Format and Procedures**: See `claude/wow/workflows/AUDIT_LOGGING.md` for complete audit logging requirements, format specifications, and error handling procedures.
## Critical Workflow Execution Rule

**SESSION_START SPECIAL REQUIREMENT**: When SESSION_START workflow is recognized, Claude MUST check system time first to ensure accurate timestamps for all session activities. If significant uncommitted work is detected, SESSION_START will automatically execute SESSION_END to preserve work before continuing.

## Critical Step-by-Step Execution Rule

**Collaboration Pattern**: See `claude/wow/workflows/OPERATIONAL_RULES.md` for step-by-step execution rules and collaborative decision-making patterns.

## Critical Version Management Rule

**Version Management**: See `claude/wow/workflows/NEW_VERSION_PLANNING.md` for version planning and scope control patterns.

## Critical Backlog to Completion Workflow

**Task Creation Process**: See `claude/wow/docs/backlog-to-completion-workflow.md` for structured decomposition workflow patterns.

## Critical Git Management Rule

**Git Operations**: All work is committed directly to the main branch. See `claude/wow/workflows/GIT_WORKFLOW.md` for simplified git operations.
## Workflow Triggers

**KEYWORD_REGISTRY** → See [claude/wow/KEYWORD_REGISTRY.md](./claude/wow/KEYWORD_REGISTRY.md) - Complete keyword system
**PROJECT_KEYWORD_REGISTRY** → See [claude/project/KEYWORD_REGISTRY.md](./claude/project/KEYWORD_REGISTRY.md) - Project-specific keywords


### Technical Keywords (for documentation)
**SESSION_START** → See [claude/wow/workflows/SESSION_START.md](./claude/wow/workflows/SESSION_START.md)
**RELEASE_PROCESS** → See [claude/wow/workflows/RELEASE_PROCESS.md](./claude/wow/workflows/RELEASE_PROCESS.md)
**VERSION_TRANSITION** → See [claude/wow/workflows/VERSION_TRANSITION.md](./claude/wow/workflows/VERSION_TRANSITION.md)
**NEW_VERSION_PLANNING** → See [claude/wow/workflows/NEW_VERSION_PLANNING.md](./claude/wow/workflows/NEW_VERSION_PLANNING.md)

**Project-specific keywords**: See [claude/project/KEYWORD_REGISTRY.md](./claude/project/KEYWORD_REGISTRY.md)

## Project Context

**Project-Specific Information**: For project-specific context, epic definitions, and version configuration, read the project hook file at `claude/project/project-info.md`.

**Development Strategy**: Uses [Phase-Based Development](./claude/wow/docs/phase-based-development-strategy.md) - breaking roadmap items into phases that combine efficiently across different areas.


## Essential Development Tools

**Required for AI-assisted development**:
- `gh` (GitHub CLI) - Release creation, PR management, project integration
- `rg` (ripgrep) - Fast code searching (preferred over grep)
- `7z` - Archive operations via tools/7zip API
- `git` - Version control via tools/git API
- `node` v14+ - Core runtime

## Key Files for Understanding

**Core Platform**:
- `claude/wow/` - Ways of Working framework

**Development Strategy**:
- `claude/wow/docs/phase-based-development-strategy.md` - Roadmap execution approach
- `claude/wow/docs/main-only-workflow.md` - Simplified direct commit workflow


## Documentation Standards

**Documentation Rules**: See `claude/wow/workflows/OPERATIONAL_RULES.md` for mandatory documentation standards and automatic correction procedures.