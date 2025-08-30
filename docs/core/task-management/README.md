# TASK Management

**Core Responsibility 2: Execution Wrapper and Lifecycle Management**

TASK provides execution wrapper around issues, manages task lifecycle from INBOX to completion, and handles flexible batching for commits and pushes.

## Purpose

- **Execution Wrapper** - Provide execution context and progress tracking around issues
- **Task Lifecycle** - Manage tasks from INBOX through execution to completion
- **Batching Control** - Flexible batching parameters for commits and pushes
- **Commit Coordination** - Aggregate task contributions into meaningful commits

## Core Concept

**Task = Execution wrapper around Issue**
- **Contains**: Fully specified issue (wrapper + workflow content)
- **Provides**: Execution context, progress tracking, local information
- **Contributes**: Commit message part for batched commits

## Task Structure

### Task Wrapper Format
```markdown
---
# TASK wrapper fields (execution context)
task_id: uuid
status: inbox|in-progress|completed
workflow: WORKFLOW_NAME
priority: low|medium|high|critical
started_at: "2025-07-27T10:00:00Z"
completed_at: null
source_repo: org/repo (if cross-repository)
local_context: "Additional repository-specific information"
commit_message_part: "What this task accomplished for batch commit"
---

# Task: [Issue Title]

## Execution Context
Local repository information and execution notes...

## Issue Content
[Fully specified issue - wrapper + workflow content]
```

## Task Lifecycle

### Complete Flow
```
INBOX detection → 
Task creation (in-progress/) →
Workflow execution → 
Task completion (completed/) →
[Batching logic] →
Commit creation →
[Batching logic] →
Push to remote →
Task cleanup
```

### Directory Structure
```
claude/tasks/
├── in-progress/          # Currently executing tasks
├── completed/           # Finished tasks awaiting commit/cleanup
└── archive/            # Historical task records (optional)
```

## Two-Level Batch Tuning

### **Level 1: Task Completion → Commit**
Controls how many completed tasks accumulate before creating a commit.

**Parameter**: `tasks_per_commit`
- `1` - Individual commit per task
- `3` - Commit every 3 completed tasks  
- `5` - Commit every 5 completed tasks
- `session` - Single commit at session end

### **Level 2: Commit → Push**  
Controls how many commits accumulate before pushing to remote.

**Parameter**: `commits_per_push`
- `1` - Push every commit immediately
- `2` - Push every 2 commits
- `3` - Push every 3 commits  
- `session` - Single push at session end

### Batch Strategy Examples

#### **Immediate Mode**
```
tasks_per_commit: 1
commits_per_push: 1
# Every task → immediate commit → immediate push
```

#### **Micro-Batch Mode**
```
tasks_per_commit: 3
commits_per_push: 2  
# 3 tasks per commit, 2 commits per push
```

#### **Session Mode**
```
tasks_per_commit: session
commits_per_push: session
# All session tasks → single commit → single push at session end
```

#### **Mixed Mode**
```
tasks_per_commit: 5
commits_per_push: session
# Commit every 5 tasks, push only at session end
```

## Task Nesting Capability

### Simple Task
```
Task contains:
└── Issue for direct execution (e.g., "Fix bug #123")
```

### Nested Task  
```
Task contains:
└── Issue for meta-operation (e.g., "Add work item to current milestone")
    └── Which creates another issue in the repository
```

### Cross-Repository Task
```
Remote repo task contains:
└── Fully specified issue for local execution
    └── Issue already contains all necessary context from source repo
```

## Commit Message Aggregation

### Individual Task Contribution
```markdown
commit_message_part: |
  [Issue #42] Fix user session timeout
  - Increase session duration to 60 minutes  
  - Add activity-based refresh logic
  Context: Users experiencing frequent logouts
```

### Batched Commit Result
```
[Session] Complete development session

- [Issue #42] Fix user session timeout
  - Increase session duration to 60 minutes
  - Add activity-based refresh logic
  Context: Users experiencing frequent logouts

- [Issue #43] Update documentation
  - Add session timeout configuration guide
  - Update troubleshooting section  
  Context: Documentation was outdated

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Integration Points

### With INBOX/OUTBOX
- **Receives**: Tasks from INBOX detection
- **Provides**: Task execution and lifecycle management

### With ISSUE Management  
- **Receives**: Issue structure (wrapper + content) from tasks
- **Provides**: Task execution context and local repository information

### With WORKFLOW Management
- **Calls**: Workflow execution processes
- **Receives**: Workflow completion status and results
- **Integrates**: Runtime workflow execution

### With RELEASE Management
- **Coordinates**: Task completion with milestone progress
- **Provides**: Task completion data for release readiness

## State Transitions

```
Task States:
├── inbox → INBOX detection creates task
├── in-progress → Task executing via workflow  
├── completed → Task finished, awaiting commit
└── [cleanup] → Task removed after commit/push
```

## Commands

- `task sesame` - Process tasks (INBOX → execution → completion)
- `task-manage status` - Show task pipeline status
- `task-manage batch-commit` - Force batch commit of completed tasks
- `task-manage batch-push` - Force batch push of pending commits
- `task-manage configure` - Set batch tuning parameters

## Benefits

- ✅ **Execution context** - Rich wrapper around issues for execution
- ✅ **Flexible batching** - Two-level tuning for different work patterns
- ✅ **Commit quality** - Aggregated meaningful commit messages
- ✅ **Recovery options** - Completed tasks preserved until cleanup
- ✅ **Cross-repository** - Handle tasks from remote repositories
- ✅ **Nested operations** - Tasks can create other issues/tasks

## Implementation Status

- [ ] Task wrapper structure with execution context
- [ ] Task lifecycle management (in-progress → completed)
- [ ] Two-level batch tuning system
- [ ] Commit message aggregation from completed tasks
- [ ] Cross-repository task handling  
- [ ] Nested task capability
- [ ] Integration with workflow execution

---

*TASK Management - Execution wrapper with flexible batching for optimized commit and push strategies*