# OUTBOX

## Overview
Cross-repository task distribution workflow that collects tasks from registered project outboxes and routes them to target project inboxes. Acts as the central message broker in the event-driven choreography system.

## Trigger
**User-Friendly**: `outbox sesame`
**Technical**: `OUTBOX`

## Purpose
- Collect outbox tasks from all registered projects
- Distribute tasks to target project inboxes
- Enable asynchronous cross-repository communication
- Maintain audit trail of task routing operations

## Prerequisites
- INITIALISE workflow completed (projects/ symlink exists)
- PROJECT_REGISTER registry populated with target projects
- Base repository with projects/ directory (sesameh org repositories only)
- GitHub CLI authenticated for accessing registered projects

## Security Constraint
**CRITICAL**: This workflow can ONLY be executed from sesameh organization repositories that contain a `projects/` directory. This prevents unauthorized task injection and ensures controlled distribution.

## Workflow Steps

### 1. Execution Context Validation
```
OUTBOX|step|security_check||Validate execution from authorized base repository
```

**Security Validation:**
```bash
# Verify we're in a base repository with projects directory
if [ ! -d "projects" ]; then
    echo "Error: OUTBOX workflow can only be executed from base repositories"
    echo "This workflow requires a projects/ directory (sesameh org repositories only)"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Verify we have the project registry
REGISTRY_FILE="claude/project/registered-projects.json"
if [ ! -f "$REGISTRY_FILE" ]; then
    echo "Error: Project registry not found at $REGISTRY_FILE"
    echo "Run PROJECT_REGISTER workflow to register projects first"
    exit 1
fi

echo "✓ Authorized base repository verified"
echo "✓ Project registry found"
```

### 2. Registered Projects Discovery
```
OUTBOX|step|registry_scan||Load registered projects from registry
```

**Registry Processing:**
```bash
# Read registered projects from JSON registry
if ! command -v python3 >/dev/null 2>&1; then
    echo "Error: python3 required for JSON processing"
    exit 1
fi

# Extract registered project paths
REGISTERED_PROJECTS=$(python3 -c "
import json
with open('$REGISTRY_FILE', 'r') as f:
    data = json.load(f)
for project in data['registered_projects']:
    print(project['path'])
")

if [ -z "$REGISTERED_PROJECTS" ]; then
    echo "No registered projects found in registry"
    echo "Use 'register [org/repo] sesame' to register projects first"
    exit 0
fi

echo "✓ Found $(echo "$REGISTERED_PROJECTS" | wc -l) registered projects"
```

### 3. Outbox Collection Phase
```
OUTBOX|step|collection||Collect outbox tasks from all registered projects
```

**Task Collection:**
```bash
# Ensure base outbox directory exists
mkdir -p claude/outbox

COLLECTED_COUNT=0
echo "=== COLLECTION PHASE ==="

# Process each registered project
for PROJECT_PATH in $REGISTERED_PROJECTS; do
    if [ -d "$PROJECT_PATH/outbox" ]; then
        PROJECT_NAME=$(basename "$PROJECT_PATH")
        ORG_NAME=$(basename "$(dirname "$PROJECT_PATH")")
        
        # Find outbox tasks (*.md files with timestamp format)
        OUTBOX_TASKS=$(find "$PROJECT_PATH/claude/outbox" -name "????-??-??T??-??-??-???Z_*.md" 2>/dev/null || true)
        
        if [ -n "$OUTBOX_TASKS" ]; then
            echo "Collecting from $ORG_NAME/$PROJECT_NAME:"
            
            for TASK_FILE in $OUTBOX_TASKS; do
                TASK_NAME=$(basename "$TASK_FILE")
                
                # Move task to base outbox
                mv "$TASK_FILE" "claude/outbox/$TASK_NAME"
                echo "  ✓ Collected: $TASK_NAME"
                ((COLLECTED_COUNT++))
            done
        fi
    fi
done

echo "✓ Collection complete: $COLLECTED_COUNT tasks collected"
```

### 4. Task Distribution Phase
```
OUTBOX|step|distribution||Distribute tasks to target project inboxes
```

**Task Routing:**
```bash
echo "=== DISTRIBUTION PHASE ==="

# Find all tasks in base outbox
BASE_OUTBOX_TASKS=$(find claude/outbox -name "????-??-??T??-??-??-???Z_*.md" 2>/dev/null | sort || true)

if [ -z "$BASE_OUTBOX_TASKS" ]; then
    echo "No tasks to distribute"
    exit 0
fi

DISTRIBUTED_COUNT=0
FAILED_COUNT=0

for TASK_FILE in $BASE_OUTBOX_TASKS; do
    TASK_NAME=$(basename "$TASK_FILE")
    
    # Extract target repository from filename: TIMESTAMP_target-repo_task-name.md
    TARGET_REPO=$(echo "$TASK_NAME" | sed 's/^[^_]*_\([^_]*\)_.*$/\1/')
    
    if [ -z "$TARGET_REPO" ]; then
        echo "✗ Invalid task filename format: $TASK_NAME"
        ((FAILED_COUNT++))
        continue
    fi
    
    # Find target project path in registry
    TARGET_PATH=$(python3 -c "
import json
with open('$REGISTRY_FILE', 'r') as f:
    data = json.load(f)
for project in data['registered_projects']:
    repo_name = project['repository'].split('/')[-1]
    if repo_name == '$TARGET_REPO':
        print(project['path'])
        break
" 2>/dev/null)
    
    if [ -z "$TARGET_PATH" ] || [ ! -d "$TARGET_PATH" ]; then
        echo "✗ Target repository '$TARGET_REPO' not found or inaccessible"
        echo "  Task remains in outbox: $TASK_NAME"
        ((FAILED_COUNT++))
        continue
    fi
    
    # Ensure target inbox exists
    mkdir -p "$TARGET_PATH/claude/inbox"
    
    # Move task to target inbox
    if mv "$TASK_FILE" "$TARGET_PATH/claude/inbox/$TASK_NAME"; then
        echo "✓ Delivered to $TARGET_REPO: $TASK_NAME"
        ((DISTRIBUTED_COUNT++))
    else
        echo "✗ Failed to deliver to $TARGET_REPO: $TASK_NAME"
        ((FAILED_COUNT++))
    fi
done

echo "✓ Distribution complete: $DISTRIBUTED_COUNT delivered, $FAILED_COUNT failed"
```

### 5. Distribution Summary
```
OUTBOX|step|completion_summary||Provide outbox workflow completion summary
```

**Completion Report:**
```bash
echo ""
echo "=== OUTBOX WORKFLOW COMPLETE ==="
echo "Collection: $COLLECTED_COUNT tasks gathered from registered projects"
echo "Distribution: $DISTRIBUTED_COUNT tasks delivered successfully"
if [ $FAILED_COUNT -gt 0 ]; then
    echo "Failures: $FAILED_COUNT tasks remain in outbox (see errors above)"
    echo "Check target repositories and retry outbox workflow"
else
    echo "Status: All tasks distributed successfully"
fi
echo "Registry: $(echo "$REGISTERED_PROJECTS" | wc -l) registered projects processed"
echo ""
echo "Next steps:"
echo "- Target repositories can run 'inbox sesame' to process received tasks"
echo "- Use 'next sesame' to see recommended issues after task processing"
```

## Task File Format

**Filename Convention**: `YYYY-MM-DDTHH-MM-SS-sssZ_target-repo_task-name.md`
- **Timestamp**: Full ISO 8601 with milliseconds for precise ordering
- **Target Repo**: Repository name (not org/repo, just repo name)
- **Task Name**: Descriptive identifier with hyphens

**Example Filenames**:
```
2025-07-14T15-30-45-123Z_claude-swift_update-workflows.md
2025-07-14T15-31-02-456Z_splectrum_migrate-to-v2.md
2025-07-14T15-31-15-789Z_spl1_workflow-refresh.md
```

**Task Content Structure**:
```markdown
---
source: jules-tenbos/splectrum
target: sesameh/claude-swift
created: 2025-07-14T15:30:45.123Z
priority: normal
type: workflow-update
---

# Task: Update to Latest Workflows

## Description
Update target repository to use latest v2 workflow patterns.

## Requirements
- [ ] Update SESSION_START workflow
- [ ] Add MANDATORY_RULES_REFRESH workflow
- [ ] Test all sesame triggers

## Context
Following claude-swift v1.1.0 release, workflow synchronization needed.
```

## Error Handling

### Invalid Execution Context
```bash
if [ ! -d "projects" ]; then
    echo "Error: OUTBOX workflow requires base repository with projects/ directory"
    echo "This security constraint prevents unauthorized task distribution"
    exit 1
fi
```

### Missing Project Registry
```bash
if [ ! -f "$REGISTRY_FILE" ]; then
    echo "Error: Project registry not found"
    echo "Run PROJECT_REGISTER to register projects first"
    exit 1
fi
```

### Target Repository Not Found
```bash
if [ ! -d "$TARGET_PATH" ]; then
    echo "Warning: Target repository '$TARGET_REPO' not accessible"
    echo "Task remains in outbox for manual handling"
    # Task file remains in outbox for retry
fi
```

### Collection Failures
```bash
if ! mv "$TASK_FILE" "claude/outbox/$TASK_NAME"; then
    echo "Warning: Failed to collect task from $PROJECT_PATH"
    echo "Check file permissions and disk space"
    # Original task remains in source outbox
fi
```

## Success Criteria
- All registered projects scanned for outbox tasks
- Tasks successfully collected into base outbox
- Tasks routed to correct target project inboxes
- Failed deliveries remain in base outbox with clear error messages
- Complete audit trail of all operations

## Integration Points
- **PROJECT_REGISTER**: Uses registry to discover registered projects
- **INBOX**: Target workflow for processing delivered tasks
- **AUDIT_LOGGING**: Log all task collection and distribution operations
- **Security**: Restricted to sesameh organization base repositories

## Usage Examples

### Distribute all pending tasks
```bash
# Run from sesameh/claude-swift or other base repository
outbox sesame
# Result: Collects from all registered projects, distributes to targets
```

### Error scenarios
```bash
# From non-base repository
outbox sesame
# Result: Error - only base repositories can run OUTBOX

# No registered projects
outbox sesame  
# Result: No tasks to process, suggests registering projects
```

## Directory Structure

**Before OUTBOX**:
```
sesameh/claude-swift/claude/outbox/          # Base outbox (empty)
projects/org1/repo1/claude/outbox/           # Has pending tasks
projects/org2/repo2/claude/outbox/           # Has pending tasks
```

**After OUTBOX**:
```
sesameh/claude-swift/claude/outbox/          # Empty (all distributed)
projects/org1/repo1/claude/outbox/           # Empty (collected)
projects/org2/repo2/claude/outbox/           # Empty (collected)
projects/target-org/target-repo/claude/inbox/  # Received tasks
```

## Trigger Pattern

```markdown
**OUTBOX** → See [workflows/OUTBOX.md](./workflows/OUTBOX.md)
```

Use when:
- Distributing cross-repository tasks
- Centralizing task routing operations
- Implementing event-driven choreography
- Processing accumulated outbox tasks from multiple projects