# Workflow Implementation Principle

## Core Principle
**Any part of workflow that can be scripted, should be scripted rather than detailed in natural language.**

## Implementation Guidelines

### Script vs Document
- **Script it**: Repeatable, technical operations with clear inputs/outputs
- **Document it**: Strategic decisions, context, or human judgment calls

### Examples

#### ❌ Bad - Natural Language Detail
```markdown
### 2. Work Completion and Commitment
- Check git status for uncommitted changes
- Review each change for completeness
- Stage appropriate files with git add
- Create descriptive commit message
- Execute git commit with message
```

#### ✅ Good - Script Delegation  
```markdown
### 2. Work Completion and Commitment
```bash
# Execute COMMIT workflow to handle any outstanding work
claude/wow/scripts/git-manage commit
```

## Audit Logging Pattern

### Current Issue
Workflows cluttered with individual audit calls:
```bash
claude/wow/scripts/audit-manage log "SESSION_START" "workflow_start" "session_init" ""
claude/wow/scripts/audit-manage log "SESSION_START" "step" "recovery_check" ""
claude/wow/scripts/audit-manage log "SESSION_START" "workflow_complete" "session_ready" ""
```

### Better Approach
Consolidated audit workflows:
```bash
claude/wow/scripts/audit-manage session-start
claude/wow/scripts/audit-manage session-end
```

## Implementation Locations

### Audit-Manage Commands to Add
**File**: `claude/wow/scripts/audit-manage`

**New Commands:**
- `session-start` - Handle all SESSION_START logging and recovery check
- `session-end` - Handle all SESSION_END logging and archive session

### Where to Apply This Principle
**Review all workflows in:**
- `claude/wow/workflows/*.md`
- `claude/project/workflows/*.md`

**Look for:**
- Multiple sequential script calls that could be consolidated
- Natural language descriptions of technical operations
- Repeated patterns across workflows

## Benefits
- **Cleaner workflows** focused on orchestration
- **Consistent implementation** across all operations
- **Easier maintenance** - logic centralized in scripts
- **Better testability** - scripts can be tested independently
- **Reduced cognitive load** - workflows show what, scripts show how

## Review Checklist
Before finalizing any workflow:
- [ ] Could any natural language steps be scripted?
- [ ] Are there repeated audit logging patterns?
- [ ] Can multiple script calls be consolidated?
- [ ] Does the workflow focus on orchestration rather than implementation?

---

*Principle: Workflows orchestrate, scripts implement*