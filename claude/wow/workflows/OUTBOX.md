[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# OUTBOX

## Overview
Cross-repository task distribution workflow that collects tasks from registered project outboxes and routes them to target project inboxes. Acts as the central message broker in the event-driven choreography system.

## Trigger
**User-Friendly**: `outbox sesame`
**Technical**: `OUTBOX`

## Purpose
- Collect outbox tasks from all registered projects
- Distribute tasks to target project inboxes based on filename routing
- Enable asynchronous cross-repository communication
- Maintain audit trail of task routing operations

## Prerequisites
- Universal availability with intelligent mode detection
- Orchestrator mode: Requires projects/ directory and registered-projects.json
- Universal mode: Works in any repository for self-targeted tasks

## Scope
**Universal**: Available in all repositories with intelligent behavior:
- **Orchestrator mode**: Processes all registered projects + cross-repository routing
- **Universal mode**: Processes local outbox only, routes self-targeted tasks to inbox

## Workflow Steps

### 1. Execute Task Distribution Script
```bash
claude/wow/scripts/audit-log "OUTBOX" "workflow_start" "task_distribution" "" "Starting cross-repository task distribution workflow"

# Execute task distribution script
claude/wow/scripts/outbox-process

claude/wow/scripts/audit-log "OUTBOX" "workflow_complete" "task_distribution" "" "OUTBOX workflow completed"
```

## Script Integration
- **Mode detection**: Automatically detect orchestrator vs universal mode
- **Registry processing**: Load registered projects (orchestrator mode only)
- **Task collection**: Gather from registered projects (orchestrator) or local only (universal)
- **Smart routing**: Route self-targeted to local inbox, cross-repo via registry
- **Error handling**: Leave failed tasks in outbox with clear error messages
- **Universal compatibility**: Works in any repository with appropriate behavior

## Task Routing Logic
**Filename convention**: `TIMESTAMP_target-repo_task-name.md`
- **Collection**: Gather tasks from all registered project outboxes
- **Routing**: Extract target repository from filename, deliver to target's inbox
- **Self-targeting**: Handle tasks targeting base repository (route to local inbox)

## Security Constraints
- **Base repository only**: Requires projects/ directory to prevent unauthorized distribution
- **Registry-based routing**: Only routes to registered projects for security
- **Audit logging**: Complete trail of all task movements

## Integration Points
- **PROJECT_REGISTER**: Uses registry to discover registered projects
- **INBOX**: Target workflow for processing delivered tasks
- **TO_INBOX**: Handles self-targeted task routing within repositories

## Usage Examples
```bash
# Distribute all pending tasks (from orchestrator only)
outbox sesame

# Result: Collects from all registered projects, distributes to target inboxes
```

## Error Handling
- **Unauthorized execution**: Error if not in base repository with projects/
- **Missing registry**: Error if project registry not found
- **Target not found**: Tasks remain in outbox for manual handling
- **Collection failures**: Original tasks remain in source outbox

## Workflow Benefits
- **Central coordination**: Single point for cross-repository task distribution
- **Security enforcement**: Controlled execution from authorized repositories
- **Reliable delivery**: Failed tasks remain for retry, complete audit trail
- **Scalable routing**: Handles multiple registered projects efficiently

---

*Orchestrator-only workflow for cross-repository task distribution.*