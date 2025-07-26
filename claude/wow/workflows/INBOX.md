[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# INBOX

## Overview
Task ingestion workflow that processes inbox tasks by converting them to GitHub issues with automatic milestone assignment. Feeds cross-repository tasks into the existing issue prioritization system.

## Trigger
**User-Friendly**: `inbox sesame`
**Technical**: `INBOX`

## Purpose
- Process inbox tasks in chronological order
- Convert task files to GitHub issues with automatic milestone assignment
- Enable cross-repository task coordination through issue system
- Maintain clean separation between task ingestion and execution

## Prerequisites
- Repository with claude/inbox/ directory (created by OUTBOX workflow deliveries)
- GitHub CLI authenticated for issue creation

## Scope
**Universal**: Can be executed from any project

## Workflow Steps

### 1. Execute Inbox Processing Script
```bash
claude/wow/scripts/audit-log "INBOX" "workflow_start" "task_ingestion" "" "Starting INBOX workflow to process inbox tasks"

# Execute inbox processing script
claude/wow/scripts/inbox-process

claude/wow/scripts/audit-log "INBOX" "workflow_complete" "task_ingestion" "" "INBOX workflow completed"
```

## Script Integration
- **Task discovery**: Scan inbox directory for pending task files
- **Format validation**: Ensure task files follow timestamp naming convention
- **Milestone assignment**: Auto-assign based on target version configuration
- **Issue conversion**: Convert task content to GitHub issues
- **File cleanup**: Remove processed tasks from inbox
- **Cache synchronization**: Update issue cache with new issues
- **Error handling**: Leave failed tasks for retry

## Task File Processing
**Expected format**: Timestamped markdown files with YAML frontmatter
- **Input**: `YYYY-MM-DDTHH-MM-SS-sssZ_source_task-name.md`
- **Output**: GitHub issues with cross-repository metadata
- **Cleanup**: Processed files removed from inbox

## Error Handling
- **Invalid format**: Tasks remain in inbox with error messages
- **GitHub failures**: Tasks remain for retry after authentication fix
- **Partial success**: Successful conversions proceed, failures logged

## Integration Points
- **OUTBOX**: Source workflow that delivers tasks to inbox
- **GitHub Issues**: Converts tasks to trackable issues
- **Milestone system**: Auto-assigns based on target version
- **Issue cache**: Synchronizes after batch processing

## Usage Examples
```bash
# Process all inbox tasks
inbox sesame

# Result: All valid tasks converted to issues, invalid ones remain for review
```

## Workflow Benefits
- **Separation of concerns**: Task reception vs execution
- **GitHub integration**: Full issue lifecycle and prioritization
- **Error resilience**: Failed tasks remain for retry
- **Audit trail**: Complete processing history

---

*Simplified inbox processing workflow that delegates implementation to scripts.*