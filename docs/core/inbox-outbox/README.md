# INBOX/OUTBOX Management

**Core Responsibility 1: Task Transport Layer**

INBOX/OUTBOX is the pure transport layer - it identifies, moves, and distributes tasks but doesn't care about their content or structure.

## Purpose

- **INBOX**: Identify tasks for execution and initiate them
- **OUTBOX**: Distribute tasks to other repository INBOXes
- **Transport Only**: Move tasks around, don't analyze or modify them

## INBOX Responsibility

### Core Function
- **Identify tasks** in the inbox folder
- **Initiate task execution** (hand off to TASK Management)
- **Process in order** (chronological, priority-based, etc.)

### What INBOX Does NOT Do
- ❌ **Task structure validation** (that's TASK Management)
- ❌ **Workflow execution** (that's WORKFLOW Management)
- ❌ **Content analysis** (just transport)

### INBOX Flow
```
INBOX detects task → Hands to TASK Management → Done
```

## OUTBOX Responsibility

### Core Function
- **Distribute tasks** to other repository INBOXes
- **Cross-repository coordination**
- **Task delivery** to target repositories

### What OUTBOX Does NOT Do
- ❌ **Task content analysis** (just distribution)
- ❌ **Task creation** (receives pre-formed tasks)
- ❌ **Workflow decisions** (just moves tasks)

### OUTBOX Flow
```
OUTBOX finds tasks → Distributes to target INBOXes → Done
```

### Availability
- **OUTBOX workflow**: Only available in repositories that can dispatch
- **Distribution mechanism**: TBD (implementation detail)

## Clean Separation of Concerns

| Responsibility | Handles |
|----------------|---------|
| **INBOX/OUTBOX** | Task identification & distribution (plumbing) |
| **TASK Management** | Task structure, validation, execution logic |
| **WORKFLOW Management** | How workflows actually run |
| **ISSUE Management** | Issue creation and milestone tracking |
| **RELEASE Management** | Milestone completion and releases |

## Commands

- `inbox sesame` - Process all tasks in inbox folder
- `outbox sesame` - Distribute tasks to target repositories (dispatch-capable repos only)

## Integration Points

- **Hands tasks to**: TASK Management for execution
- **Receives tasks from**: TASK Management (for OUTBOX distribution)
- **Works with**: Any task format (transport agnostic)

## Implementation Status

- [x] Basic INBOX task identification
- [x] OUTBOX cross-repository distribution
- [ ] Order-based processing (priority, chronological)
- [ ] Simplified handoff to TASK Management
- [ ] Transport-only focus (remove analysis logic)

---

*INBOX/OUTBOX Management - The transport layer that moves tasks around*