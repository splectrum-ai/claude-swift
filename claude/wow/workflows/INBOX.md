# INBOX

## Overview
Task ingestion workflow that processes inbox tasks by converting them to GitHub issues. Separates task reception from task execution, feeding tasks into the existing issue prioritization system.

## Trigger
**User-Friendly**: `inbox sesame`
**Technical**: `INBOX`

## Purpose
- Process inbox tasks in chronological order
- Convert task files to GitHub issues with automatic milestone assignment
- Enable cross-repository task coordination through issue system
- Batch process all tasks before single cache synchronization
- Maintain clean separation between task ingestion and execution

## Prerequisites
- Repository with claude/inbox/ directory (created by OUTBOX workflow deliveries)
- GitHub CLI authenticated for issue creation
- CREATE_ISSUE workflow available for task conversion

## Scope
**Universal**: Can be executed from any project (base or registered)

## Workflow Steps

### 1. Initialize Audit Logging
```bash
# Load Node.js audit functions
source claude/scripts/audit-functions.sh

# Start inbox workflow
audit_log "INBOX" "workflow_start" "task_ingestion" "" "Starting INBOX workflow to process inbox tasks"
```

### 2. Inbox Scanning
```bash
audit_log "INBOX" "step" "task_discovery" "" "Scanning inbox directory for pending tasks"
```

**Task Discovery:**
```bash
# Ensure inbox directory exists
mkdir -p claude/inbox

# Find all task files in inbox (*.md files with timestamp format)
INBOX_TASKS=$(find claude/inbox -name "????-??-??T??-??-??-???Z_*.md" 2>/dev/null | sort || true)

if [ -z "$INBOX_TASKS" ]; then
    echo "No pending tasks in inbox"
    echo "Inbox directory: $(pwd)/claude/inbox"
    exit 0
fi

TASK_COUNT=$(echo "$INBOX_TASKS" | wc -l)
echo "Found $TASK_COUNT pending tasks in inbox"
echo "Processing in chronological order..."
```

### 3. Task Processing Loop
```bash
audit_log "INBOX" "step" "task_processing" "" "Processing each task file in timestamp order"
```

**Sequential Processing:**
```bash
PROCESSED_COUNT=0
FAILED_COUNT=0

for TASK_FILE in $INBOX_TASKS; do
    TASK_NAME=$(basename "$TASK_FILE")
    echo ""
    echo "Processing: $TASK_NAME"
    
    # Validate task file format
    if ! [[ "$TASK_NAME" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{3}Z_.*\.md$ ]]; then
        echo "✗ Invalid task filename format: $TASK_NAME"
        echo "  Expected: YYYY-MM-DDTHH-MM-SS-sssZ_source_task-name.md"
        ((FAILED_COUNT++))
        continue
    fi
    
    # Parse task metadata from filename
    TIMESTAMP=$(echo "$TASK_NAME" | cut -d'_' -f1)
    SOURCE_INFO=$(echo "$TASK_NAME" | sed 's/^[^_]*_\([^_]*\)_.*$/\1/')
    TASK_SUMMARY=$(echo "$TASK_NAME" | sed 's/^[^_]*_[^_]*_\(.*\)\.md$/\1/' | tr '-' ' ')
    
    echo "  Timestamp: $TIMESTAMP"
    echo "  Source: $SOURCE_INFO"
    echo "  Summary: $TASK_SUMMARY"
    
    # Extract task content and metadata
    if ! TASK_CONTENT=$(cat "$TASK_FILE" 2>/dev/null); then
        echo "✗ Failed to read task file: $TASK_FILE"
        ((FAILED_COUNT++))
        continue
    fi
    
    # Create GitHub issue from task content
    if create_issue_from_task "$TASK_FILE" "$TASK_CONTENT" "$SOURCE_INFO" "$TIMESTAMP"; then
        echo "✓ Converted to GitHub issue successfully"
        
        # Delete processed task file
        if rm "$TASK_FILE"; then
            echo "✓ Task file removed from inbox"
            ((PROCESSED_COUNT++))
        else
            echo "✗ Warning: Failed to remove task file"
            ((PROCESSED_COUNT++))  # Still count as processed since issue was created
        fi
    else
        echo "✗ Failed to create GitHub issue"
        ((FAILED_COUNT++))
    fi
done
```

### 3. Issue Creation Integration
```
INBOX|step|issue_conversion||Convert task content to GitHub issue
```

**Milestone Detection:**
```bash
get_target_milestone() {
    # Check if version-config.md exists and extract target version
    if [ -f "claude/project/version-config.md" ]; then
        local target_version=$(grep "TARGET_VERSION" claude/project/version-config.md | cut -d':' -f2 | cut -d'(' -f1 | tr -d ' ')
        if [ -n "$target_version" ]; then
            echo "$target_version"
            return 0
        fi
    fi
    
    # Fallback: no milestone assignment
    echo ""
    return 1
}
```

**Task-to-Issue Conversion:**
```bash
create_issue_from_task() {
    local task_file="$1"
    
    # Extract task metadata from file
    local source=$(grep "^source:" "$task_file" | cut -d' ' -f2- | tr -d ' ')
    local priority=$(grep "^priority:" "$task_file" | cut -d' ' -f2- | tr -d ' ' | tr '[:lower:]' '[:upper:]')
    local task_type=$(grep "^type:" "$task_file" | cut -d' ' -f2- | tr -d ' ')
    local created=$(grep "^created:" "$task_file" | cut -d' ' -f2- | tr -d ' ')
    local explicit_milestone=$(grep "^milestone:" "$task_file" | cut -d' ' -f2- | tr -d ' ')
    
    # Determine milestone assignment
    local milestone=""
    if [ -n "$explicit_milestone" ]; then
        # Use explicitly specified milestone
        milestone="$explicit_milestone"
        echo "  📌 Using explicit milestone: $milestone"
    else
        # Use target version milestone as default
        milestone=$(get_target_milestone)
        if [ -n "$milestone" ]; then
            echo "  📌 Using target version milestone: $milestone"
        else
            echo "  📌 No milestone assigned (no target version found)"
        fi
    fi
    
    # Extract title (remove "Task: " prefix if present)
    local issue_title
    issue_title=$(grep -m 1 "^# " "$task_file" | sed 's/^# //' | sed 's/^Task: //')
    
    # Extract main content (everything after the frontmatter)
    local task_content
    task_content=$(awk '/^---$/{f++; next} f==2' "$task_file")
    
    # Build CREATE_ISSUE compatible body with task metadata
    local issue_body
    issue_body="## Cross-Repository Task

**Source**: $source  
**Type**: $task_type  
**Created**: $created  
**Priority**: ${priority:-MEDIUM}

---

$task_content

---

## Dependencies
**Blocks:** None (unless specified in task content)
**Blocked by:** None (unless specified in task content)  
**Related:** Cross-repository communication

## Effort: M
**Estimate:** Cross-repository task processing

## Test Criteria
**How to verify completion:**
- [ ] Task requirements completed as specified
- [ ] Cross-repository coordination successful

## Work Area: cross-repository
**Context:** Task distributed via OUTBOX/INBOX workflow

*This issue was automatically created from an inbox task by the INBOX workflow.*"
    
    # Use CREATE_ISSUE workflow for issue creation (includes cache sync)
    local temp_file=$(mktemp)
    echo "$issue_body" > "$temp_file"
    
    # Build gh issue create command with optional milestone
    local create_cmd="gh issue create --title \"$issue_title\" --body-file \"$temp_file\" --label \"cross-repository,inbox-task\""
    if [ -n "$milestone" ]; then
        create_cmd="$create_cmd --milestone \"$milestone\""
    fi
    
    if eval "$create_cmd"; then
        rm "$temp_file"
        return 0
    else
        rm "$temp_file"
        return 1
    fi
}
```

### 4. Issue Cache Update
```
INBOX|step|cache_update||Update issue cache with newly created issues
```

**Cache Synchronization:**
```bash
if [ $PROCESSED_COUNT -gt 0 ]; then
    echo "🔄 Updating issue cache with newly created issues..."
    
    # Execute ISSUE_CACHE workflow to sync all new issues
    python3 -c "
import json
import subprocess
import sys
from datetime import datetime

try:
    # Fetch current issues from GitHub
    result = subprocess.run(['gh', 'issue', 'list', '--limit', '100', '--json', 'number,title,labels,state,milestone,createdAt,updatedAt'], 
                          capture_output=True, text=True, check=True)
    issues_list = json.loads(result.stdout)
    
    # Convert to cache format (keyed by issue number)
    cache = {}
    for issue in issues_list:
        cache[str(issue['number'])] = {
            **issue,
            'cached_at': datetime.utcnow().isoformat() + 'Z'
        }
    
    # Ensure cache directory exists
    subprocess.run(['mkdir', '-p', 'claude/project/cache'], check=True)
    
    # Write updated cache
    with open('claude/project/cache/issues.json', 'w') as f:
        json.dump(cache, f, indent=2)
    
    print(f'✓ Issue cache updated with {len(cache)} issues')
    
except Exception as e:
    print(f'⚠ Cache update failed: {e}', file=sys.stderr)
    # Don't fail the workflow if cache update fails
"
    echo "✓ Issue cache synchronized"
else
    echo "ℹ No issues created - skipping cache update"
fi
```

### 5. Processing Summary
```
INBOX|step|completion_summary||Provide inbox processing completion summary
```

**Completion Report:**
```bash
echo ""
echo "=== INBOX PROCESSING COMPLETE ==="
echo "Tasks processed: $PROCESSED_COUNT"
echo "Tasks failed: $FAILED_COUNT"
echo "Total tasks: $TASK_COUNT"

if [ $PROCESSED_COUNT -gt 0 ]; then
    echo ""
    echo "✓ Successfully converted $PROCESSED_COUNT tasks to GitHub issues"
    echo "✓ Task files removed from inbox"
    echo ""
    echo "Next steps:"
    echo "- Use 'next sesame' to see recommended issues for execution"
    echo "- Check GitHub issues for task details and prioritization"
fi

if [ $FAILED_COUNT -gt 0 ]; then
    echo ""
    echo "⚠ Warning: $FAILED_COUNT tasks failed to process"
    echo "Failed tasks remain in inbox for manual review"
    echo "Check task file format and GitHub authentication"
fi

echo ""
echo "Inbox status: $(find inbox -name "*.md" 2>/dev/null | wc -l) tasks remaining"

# Workflow completion logging
audit_log "INBOX" "workflow_complete" "task_ingestion" "" "INBOX workflow completed - processed $PROCESSED_COUNT tasks, $FAILED_COUNT failed"
```

## Task File Processing

**Expected Task File Format**:
```markdown
---
source: org1/project1
target: org2/project2
created: 2025-07-14T15:30:45.123Z
priority: normal
type: feature-request
---

# Task: Implement Feature X

## Description
Add support for feature X as discussed in cross-team meeting.

## Requirements
- [ ] Design API interface
- [ ] Implement core functionality
- [ ] Add comprehensive tests

## Context
This feature enables better integration between our repositories.
```

**Resulting GitHub Issue**:
- **Title**: "Task: Implement Feature X"
- **Labels**: "cross-repository", "inbox-task"
- **Body**: Includes source metadata + original task content
- **Integration**: Enters normal NEXT_ISSUE prioritization flow

## Error Handling

### No Tasks Found
```bash
if [ -z "$INBOX_TASKS" ]; then
    echo "No pending tasks in inbox"
    echo "Tasks are delivered here by the OUTBOX workflow"
    exit 0
fi
```

### Invalid Task Format
```bash
if ! [[ "$TASK_NAME" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{3}Z_.*\.md$ ]]; then
    echo "Invalid task filename format: $TASK_NAME"
    echo "Expected: YYYY-MM-DDTHH-MM-SS-sssZ_source_task-name.md"
    # Task remains in inbox for manual review
fi
```

### GitHub Issue Creation Failure
```bash
if ! gh issue create --title "$issue_title" --body-file "$temp_file"; then
    echo "Failed to create GitHub issue for task: $TASK_NAME"
    echo "Check GitHub CLI authentication and repository permissions"
    # Task remains in inbox for retry
fi
```

### File System Errors
```bash
if ! rm "$TASK_FILE"; then
    echo "Warning: Task processed but file removal failed"
    echo "Manual cleanup may be required: $TASK_FILE"
    # Issue was created successfully, this is a minor cleanup issue
fi
```

## Success Criteria
- All valid inbox tasks converted to GitHub issues
- Task files removed after successful processing
- Issues created with appropriate labels and metadata
- Failed tasks remain in inbox with clear error messages
- Complete audit trail of processing operations

## Integration Points
- **OUTBOX**: Source workflow that delivers tasks to inbox
- **CREATE_ISSUE**: Underlying workflow for GitHub issue creation
- **NEXT_ISSUE**: Downstream workflow for issue prioritization
- **AUDIT_LOGGING**: Log all inbox processing operations

### Milestone Assignment Strategy
- **Default Behavior**: Issues automatically assigned to TARGET_VERSION milestone from `claude/project/version-config.md`
- **Explicit Override**: Tasks can specify `milestone:` field to use different milestone
- **Fallback**: No milestone assigned if no target version configured and no explicit milestone specified
- **Integration**: Ensures all issues align with current development version by default

## Usage Examples

### Process all inbox tasks
```bash
# Run from any project directory
inbox sesame
# Result: All inbox tasks converted to GitHub issues
```

### Empty inbox scenario
```bash
inbox sesame
# Result: "No pending tasks in inbox" - normal state
```

### Error recovery
```bash
# After fixing GitHub authentication issues
inbox sesame
# Result: Retry processing of failed tasks
```

## Workflow Benefits

### Separation of Concerns
- **Task Reception**: OUTBOX handles delivery
- **Task Ingestion**: INBOX converts to issues  
- **Task Execution**: NEXT_ISSUE prioritizes work

### GitHub Integration
- **Issue Tracking**: Full GitHub issue lifecycle
- **Prioritization**: Uses existing NEXT_ISSUE scoring
- **Collaboration**: Standard GitHub issue workflows

### Error Resilience
- **Failed Processing**: Tasks remain for retry
- **Partial Success**: Successful conversions proceed
- **Audit Trail**: Complete processing history

## Directory Structure

**Before INBOX**:
```
project/claude/inbox/
├── 2025-07-14T15-30-45-123Z_project1_implement-feature.md
├── 2025-07-14T15-31-02-456Z_project2_add-integration.md
└── 2025-07-14T15-31-15-789Z_project3_update-api.md
```

**After INBOX**:
```
project/claude/inbox/                       # Empty (all processed)
GitHub Issues:                       # New issues created
- "Task: Implement Feature X"
- "Task: Add Integration Support"  
- "Task: Update API Interface"
```

## Trigger Pattern

```markdown
**INBOX** → See [workflows/INBOX.md](./workflows/INBOX.md)
```

Use when:
- Processing received cross-repository tasks
- Converting inbox tasks to actionable GitHub issues
- Integrating external tasks into project workflow
- Maintaining clean inbox state