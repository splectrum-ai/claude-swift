[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# TO_INBOX Workflow

## Overview
Universal workflow that processes tasks in the current repository's outbox directory, specifically handling self-targeted tasks by moving them from outbox to inbox for local processing.

## Trigger
**User-Friendly**: `to-inbox sesame`
**Technical**: `TO_INBOX`

## Purpose
- Process self-targeted tasks from outbox directory
- Move outbox tasks targeting current repository to inbox
- Enable task queuing and processing within single repository
- Maintain audit trail of task movement operations

## Scope
**Universal**: This workflow is available in ALL repositories (wow framework) and processes tasks targeting the current repository only.

## Prerequisites
- Repository has `claude/outbox/` directory structure
- Repository has `claude/inbox/` directory structure
- Tasks in outbox follow standard naming convention

## Task File Format
Tasks should be named: `TIMESTAMP_TARGET-REPO_DESCRIPTION.md`

Example: `2025-07-16T23-45-00Z_claude-swift_update-documentation.md`

## Workflow Steps

### 1. Repository Detection
```bash
audit_log "TO_INBOX" "step" "repository_detection" "" "Detect current repository name and validate outbox directory"
```

**Actions:**
```bash
# Get current repository name
CURRENT_REPO=$(basename $(git rev-parse --show-toplevel))

# Validate outbox directory exists
if [ ! -d "claude/outbox" ]; then
    echo "❌ No outbox directory found at claude/outbox"
    exit 1
fi

echo "📂 Processing outbox for repository: $CURRENT_REPO"
```

### 2. Task Discovery
```bash
audit_log "TO_INBOX" "step" "task_discovery" "" "Scan outbox directory for self-targeted tasks"
```

**Actions:**
```bash
# Find all task files in outbox
OUTBOX_TASKS=$(find claude/outbox -name "*.md" -not -name "README.md" 2>/dev/null)

if [ -z "$OUTBOX_TASKS" ]; then
    echo "✅ No tasks found in outbox"
    exit 0
fi

echo "🔍 Found $(echo "$OUTBOX_TASKS" | wc -l) task files in outbox"
```

### 3. Self-Target Filtering
```bash
audit_log "TO_INBOX" "step" "self_target_filtering" "" "Filter tasks that target current repository"
```

**Actions:**
```bash
SELF_TARGETED_TASKS=""
PROCESSED_COUNT=0

for task_file in $OUTBOX_TASKS; do
    # Extract target repository from filename
    # Format: TIMESTAMP_TARGET-REPO_DESCRIPTION.md
    TARGET_REPO=$(basename "$task_file" | cut -d'_' -f2)
    
    if [ "$TARGET_REPO" = "$CURRENT_REPO" ]; then
        SELF_TARGETED_TASKS="$SELF_TARGETED_TASKS $task_file"
        PROCESSED_COUNT=$((PROCESSED_COUNT + 1))
    fi
done

echo "📋 Found $PROCESSED_COUNT self-targeted tasks for $CURRENT_REPO"
```

### 4. Task Processing
```bash
audit_log "TO_INBOX" "step" "task_processing" "" "Move self-targeted tasks from outbox to inbox"
```

**Actions:**
```bash
if [ $PROCESSED_COUNT -eq 0 ]; then
    echo "✅ No self-targeted tasks to process"
    exit 0
fi

# Ensure inbox directory exists
mkdir -p claude/inbox

# Process each self-targeted task
for task_file in $SELF_TARGETED_TASKS; do
    task_name=$(basename "$task_file")
    
    echo "📤 Processing task: $task_name"
    
    # Move task from outbox to inbox
    mv "$task_file" "claude/inbox/$task_name"
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Moved to inbox: $task_name"
    else
        echo "  ❌ Failed to move: $task_name"
    fi
done

echo "🎉 Processed $PROCESSED_COUNT self-targeted tasks"
```

### 5. Audit Logging
```bash
audit_log "TO_INBOX" "step" "audit_logging" "" "Record task processing in audit log"
```

**Actions:**
```bash
# Use optimized Node.js audit logging
source claude/wow/scripts/audit-functions.sh

# Log each processed task
for task_file in $SELF_TARGETED_TASKS; do
    task_name=$(basename "$task_file")
    audit_log "TO_INBOX" "task_processed" "$task_name" "" "Moved self-targeted task from outbox to inbox"
done
```

## Integration Points

### SESSION_START Integration
- SESSION_START can automatically trigger TO_INBOX workflow when outbox tasks are detected
- Part of session initialization for processing pending work

### INBOX Integration
- TO_INBOX workflow feeds tasks into INBOX workflow
- Creates seamless task processing pipeline
- Tasks moved to inbox can be processed by `inbox sesame` trigger

### Task Creation Integration
- Works with TASK_CREATE workflow when tasks target current repository
- Handles self-referential task creation patterns
- Supports task queuing for later processing

## Example Usage

### Manual Processing
```bash
# Process all self-targeted tasks in outbox
`to-inbox sesame`
```

### Automated Processing
```bash
# Check for self-targeted tasks during session start
if [ -n "$(find claude/outbox -name "*_${CURRENT_REPO}_*.md" 2>/dev/null)" ]; then
    echo "Self-targeted tasks detected, processing..."
    # Execute TO_INBOX workflow
fi
```

## Task File Structure
Each task file should contain:

```markdown
# Task: [Brief Description]

## Context
[Background information about the task]

## Requirements
[What needs to be done]

## Acceptance Criteria
[How to know the task is complete]

## Priority
[HIGH/MEDIUM/LOW]

## Milestone (Optional)
[Specific milestone - if not specified, uses target version from `claude/project/version-config.md`]

## Created
[Timestamp and source]
```

## Success Criteria
- All self-targeted tasks moved from outbox to inbox
- Audit trail maintained for all task movements
- No tasks left in outbox targeting current repository
- Inbox ready for processing via INBOX workflow

## Error Handling

### Missing Directories
```bash
# Auto-create missing directories
mkdir -p claude/outbox claude/inbox
```

### Invalid Task Files
```bash
# Skip malformed task files
if [[ ! "$task_file" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}Z_.*_.*\.md$ ]]; then
    echo "⚠️  Skipping malformed task file: $task_file"
    continue
fi
```

### File System Errors
```bash
# Handle move failures gracefully
if ! mv "$task_file" "claude/inbox/$task_name"; then
    echo "❌ Failed to move $task_name - leaving in outbox"
    continue
fi
```

## Benefits

### Self-Contained Processing
- Each repository can process its own tasks independently
- No dependencies on external orchestrator systems
- Works in any repository with proper directory structure

### Task Queuing
- Tasks can be created and queued for later processing
- Supports asynchronous task management
- Enables batch processing of related tasks

### Audit Trail
- Complete tracking of task movement operations
- Integration with existing audit logging system
- Supports forensic analysis of task processing

---

*Universal workflow for processing self-targeted tasks from outbox to inbox across all repositories.*