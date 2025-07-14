# TASK_CREATE

## Overview
Interactive task creation workflow that guides users through creating cross-repository tasks with proper metadata and formatting. Tasks are saved to the local outbox folder for distribution via the OUTBOX workflow.

## Trigger
**User-Friendly**: `task sesame`, `task [org/repo] sesame`, or `task . sesame`
**Technical**: `TASK_CREATE`

## Purpose
- Create properly formatted cross-repository tasks
- Guide users through task metadata collection
- Generate standardized filenames and content structure
- Save tasks to local outbox for OUTBOX workflow distribution

## Prerequisites
- Local repository with outbox/ directory capability
- Understanding of target repository requirements
- Clear task description and requirements

## Scope
**Universal**: Can be executed from any project (base or registered)

## Workflow Steps

### 1. Interactive Task Information Collection
```
TASK_CREATE|step|information_gathering||Collect task details through interactive prompts
```

**Task Information Prompts:**
```bash
echo "=== CREATE CROSS-REPOSITORY TASK ==="
echo ""

# Check if target repository provided as parameter
if [ -n "$1" ]; then
    if [ "$1" = "." ]; then
        # Use current repository as target
        CURRENT_REPO_NAME=$(basename "$(pwd)")
        TARGET_INPUT="$CURRENT_REPO_NAME"
        TARGET_REPO="$CURRENT_REPO_NAME"
        echo "Target Repository: $TARGET_INPUT (current repository)"
    else
        TARGET_INPUT="$1"
        echo "Target Repository: $TARGET_INPUT (from parameter)"
        
        # Clean target repository name (extract repo name if org/repo provided)
        if [[ "$TARGET_INPUT" == *"/"* ]]; then
            TARGET_REPO=$(echo "$TARGET_INPUT" | cut -d'/' -f2)
        else
            TARGET_REPO="$TARGET_INPUT"
        fi
    fi
else
    # Prompt for target repository
    echo "Target Repository:"
    echo "Enter the repository that should receive this task (format: org/repo, repo-name, or '.' for current):"
    read -p "Target: " TARGET_INPUT
    
    # Validate target input
    if [ -z "$TARGET_INPUT" ]; then
        echo "Error: Target repository cannot be empty"
        exit 1
    fi
    
    # Handle dot notation for current repository
    if [ "$TARGET_INPUT" = "." ]; then
        CURRENT_REPO_NAME=$(basename "$(pwd)")
        TARGET_INPUT="$CURRENT_REPO_NAME"
        TARGET_REPO="$CURRENT_REPO_NAME"
        echo "Using current repository: $TARGET_REPO"
    else
        # Clean target repository name (extract repo name if org/repo provided)
        if [[ "$TARGET_INPUT" == *"/"* ]]; then
            TARGET_REPO=$(echo "$TARGET_INPUT" | cut -d'/' -f2)
        else
            TARGET_REPO="$TARGET_INPUT"
        fi
    fi
fi

echo ""
echo "Task Summary:"
echo "Enter a brief task name (will be used in filename, use hyphens for spaces):"
read -p "Task name: " TASK_NAME

# Clean task name (replace spaces with hyphens, make lowercase)
TASK_NAME=$(echo "$TASK_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

echo ""
echo "Task Title:"
echo "Enter the full task title (will appear as # heading in task file):"
read -p "Title: " TASK_TITLE

echo ""
echo "Task Description:"
echo "Enter a detailed description of what needs to be done:"
read -p "Description: " TASK_DESCRIPTION

echo ""
echo "Task Priority (HIGH/MEDIUM/LOW):"
read -p "Priority [MEDIUM]: " TASK_PRIORITY
TASK_PRIORITY=${TASK_PRIORITY:-MEDIUM}

# Validate priority
case "${TASK_PRIORITY^^}" in
    HIGH|MEDIUM|LOW) TASK_PRIORITY="${TASK_PRIORITY^^}" ;;
    *) echo "Invalid priority, using MEDIUM"; TASK_PRIORITY="MEDIUM" ;;
esac

echo ""
echo "Priority Justification:"
echo "Explain why this priority level is appropriate:"
read -p "Justification: " PRIORITY_JUSTIFICATION

echo ""
echo "Task Effort (S/M/L/XL):"
read -p "Effort [M]: " TASK_EFFORT
TASK_EFFORT=${TASK_EFFORT:-M}

# Validate effort
case "${TASK_EFFORT^^}" in
    S|M|L|XL) TASK_EFFORT="${TASK_EFFORT^^}" ;;
    *) echo "Invalid effort, using M"; TASK_EFFORT="M" ;;
esac

echo ""
echo "Effort Justification:"
echo "Brief explanation for effort estimate:"
read -p "Estimate reasoning: " EFFORT_JUSTIFICATION

echo ""
echo "Task Type (enhancement/bug/documentation/workflow-update/other):"
read -p "Type [enhancement]: " TASK_TYPE
TASK_TYPE=${TASK_TYPE:-enhancement}

echo ""
echo "Work Area/Epic:"
echo "Which area of the project does this affect? (e.g., v1.1.0, documentation, infrastructure):"
read -p "Work area: " WORK_AREA

echo ""
echo "Dependencies:"
echo "Enter issues this task blocks (comma-separated, or press Enter if none):"
read -p "Blocks: " BLOCKS_ISSUES

echo ""
echo "Enter issues that must be completed before this task (comma-separated, or press Enter if none):"
read -p "Blocked by: " BLOCKED_BY_ISSUES

echo ""
echo "Enter related issues to consider together (comma-separated, or press Enter if none):"
read -p "Related: " RELATED_ISSUES

# Collect test criteria (requirements become test criteria)
echo ""
echo "Test Criteria:"
echo "Enter specific validation steps to verify completion (one per line, press Enter twice when done):"
TEST_CRITERIA=""
while IFS= read -p "- " criterion; do
    if [ -z "$criterion" ]; then
        break
    fi
    TEST_CRITERIA="${TEST_CRITERIA}- [ ] ${criterion}\n"
done

# Optional context
echo ""
echo "Additional Context (optional):"
echo "Enter any additional context or background information:"
read -p "Context: " TASK_CONTEXT

echo ""
echo "=== TASK SUMMARY ==="
echo "Target: $TARGET_REPO"
echo "Name: $TASK_NAME"
echo "Title: $TASK_TITLE"
echo "Priority: $TASK_PRIORITY ($PRIORITY_JUSTIFICATION)"
echo "Effort: $TASK_EFFORT ($EFFORT_JUSTIFICATION)"
echo "Type: $TASK_TYPE"
echo "Work Area: $WORK_AREA"
if [ -n "$BLOCKS_ISSUES" ]; then echo "Blocks: $BLOCKS_ISSUES"; fi
if [ -n "$BLOCKED_BY_ISSUES" ]; then echo "Blocked by: $BLOCKED_BY_ISSUES"; fi
if [ -n "$RELATED_ISSUES" ]; then echo "Related: $RELATED_ISSUES"; fi
echo ""
echo "Proceed with task creation? (y/n)"
read -p "Confirm: " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Task creation cancelled"
    exit 0
fi
```

### 2. Task File Generation
```
TASK_CREATE|step|file_generation||Generate task filename and content structure
```

**Filename Generation:**
```bash
# Generate timestamp with milliseconds
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")-$(printf "%03d" $((RANDOM % 1000)))Z

# Create filename: TIMESTAMP_target-repo_task-name.md
TASK_FILENAME="${TIMESTAMP}_${TARGET_REPO}_${TASK_NAME}.md"

echo "Generated filename: $TASK_FILENAME"
```

**Task Content Generation:**
```bash
# Determine source repository
SOURCE_REPO=""
if [ -f "claude/project/project-info.md" ]; then
    # Extract repository from project-info.md
    SOURCE_REPO=$(grep "REPOSITORY" claude/project/project-info.md | sed 's/.*REPOSITORY.*: *\([^[:space:]]*\).*/\1/' || echo "unknown")
else
    # Fallback: try to get from git remote
    SOURCE_REPO=$(git remote get-url origin 2>/dev/null | sed 's/.*[/:]\([^/]*\/[^/]*\)\.git.*/\1/' || echo "unknown")
fi

# Generate task content with CREATE_ISSUE compatible metadata
TASK_CONTENT="---
source: $SOURCE_REPO
target: $TARGET_INPUT
created: $(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
priority: $TASK_PRIORITY
effort: $TASK_EFFORT
type: $TASK_TYPE
work_area: $WORK_AREA
---

# $TASK_TITLE

## Description
$TASK_DESCRIPTION

## Priority: $TASK_PRIORITY
**Justification:** $PRIORITY_JUSTIFICATION

## Dependencies
$(if [ -n "$BLOCKS_ISSUES" ]; then echo "**Blocks:** $BLOCKS_ISSUES"; fi)
$(if [ -n "$BLOCKED_BY_ISSUES" ]; then echo "**Blocked by:** $BLOCKED_BY_ISSUES"; fi)
$(if [ -n "$RELATED_ISSUES" ]; then echo "**Related:** $RELATED_ISSUES"; fi)

## Effort: $TASK_EFFORT
**Estimate:** $EFFORT_JUSTIFICATION

## Test Criteria
**How to verify completion:**
$(echo -e "$TEST_CRITERIA")

## Work Area: $WORK_AREA
**Context:** ${TASK_CONTEXT:-Cross-repository task created via TASK_CREATE workflow}

🤖 Generated with [Claude Code](https://claude.ai/code)"

echo "✓ Task content generated"
```

### 3. Outbox Directory Setup
```
TASK_CREATE|step|outbox_setup||Ensure outbox directory exists and is properly configured
```

**Outbox Preparation:**
```bash
# Ensure outbox directory exists
mkdir -p claude/outbox

# Create outbox README if it doesn't exist
if [ ! -f "claude/outbox/README.md" ]; then
    cat > "claude/outbox/README.md" << 'EOF'
# Outbox

This directory contains cross-repository tasks awaiting distribution.

## File Format
- **Filename**: `YYYY-MM-DDTHH-MM-SS-sssZ_target-repo_task-name.md`
- **Content**: Standardized task format with metadata header

## Workflow Integration
- Tasks created here via `task sesame` (TASK_CREATE workflow)
- Tasks distributed via `outbox sesame` (OUTBOX workflow)
- Tasks processed at target via `inbox sesame` (INBOX workflow)

## Status
- Files in this directory are **pending distribution**
- Files are moved during OUTBOX workflow execution
- Empty directory indicates all tasks have been distributed
EOF
    echo "✓ Created outbox README"
fi

echo "✓ Outbox directory ready: $(pwd)/outbox"
```

### 4. Task File Creation
```
TASK_CREATE|step|file_creation||Write task file to outbox directory
```

**File Writing:**
```bash
# Write task content to file
TASK_FILE_PATH="claude/outbox/$TASK_FILENAME"

if echo "$TASK_CONTENT" > "$TASK_FILE_PATH"; then
    echo "✓ Task file created: $TASK_FILE_PATH"
else
    echo "✗ Failed to create task file"
    echo "Check directory permissions and disk space"
    exit 1
fi

# Verify file was created correctly
if [ -f "$TASK_FILE_PATH" ] && [ -s "$TASK_FILE_PATH" ]; then
    echo "✓ Task file verified ($(wc -l < "$TASK_FILE_PATH") lines)"
else
    echo "✗ Task file verification failed"
    exit 1
fi
```

### 5. Task Creation Summary
```
TASK_CREATE|step|completion_summary||Provide task creation completion summary
```

**Completion Report:**
```bash
echo ""
echo "=== TASK CREATION COMPLETE ==="
echo "Task file: $TASK_FILENAME"
echo "Location: $(pwd)/claude/outbox/"
echo "Target repository: $TARGET_REPO"
echo "Task title: $TASK_TITLE"
echo "Priority: $TASK_PRIORITY"
echo "Type: $TASK_TYPE"
echo ""
echo "File size: $(ls -lh "$TASK_FILE_PATH" | awk '{print $5}')"
echo "Lines: $(wc -l < "$TASK_FILE_PATH")"
echo ""
echo "Next steps:"
echo "1. Review task file: cat claude/outbox/$TASK_FILENAME"
echo "2. Distribute task: outbox sesame (from base repository)"
echo "3. Target repository will receive task in their inbox"
echo "4. Target can process: inbox sesame (converts to GitHub issue)"
echo ""
echo "Task is ready for distribution! 🚀"
```

## Task Template Structure

**Generated Task File Format:**
```markdown
---
source: current-org/current-repo
target: target-org/target-repo
created: 2025-07-14T16:30:45.123Z
priority: HIGH
effort: M
type: enhancement
work_area: v1.1.0
---

# Implement New Feature X

## Description
Detailed description of what needs to be implemented, including context and background information.

## Priority: HIGH
**Justification:** Critical for v1.1.0 release and blocks other features

## Dependencies
**Blocks:** #45, #47
**Blocked by:** #42
**Related:** #44, #46

## Effort: M
**Estimate:** Medium complexity with well-defined requirements and existing patterns

## Test Criteria
**How to verify completion:**
- [ ] Feature implemented according to specifications
- [ ] Unit tests written and passing
- [ ] Integration tests cover new functionality
- [ ] Documentation updated
- [ ] Manual testing completed

## Work Area: v1.1.0
**Context:** Part of enhanced multi-project workspace capabilities for v1.1.0 milestone

🤖 Generated with [Claude Code](https://claude.ai/code)
```

**Filename Convention:**
- **Format**: `YYYY-MM-DDTHH-MM-SS-sssZ_target-repo_task-name.md`
- **Example**: `2025-07-14T16-30-45-123Z_claude-swift_implement-feature-x.md`

## Interactive Prompts

### Target Repository
- **Prompt**: "Enter the repository that should receive this task"
- **Format**: Accepts `org/repo` or just `repo-name`
- **Processing**: Extracts repo name for filename

### Task Name
- **Prompt**: "Enter a brief task name (use hyphens for spaces)"
- **Processing**: Converts to lowercase, replaces invalid chars with hyphens
- **Example**: "Fix Bug in Parser" → "fix-bug-in-parser"

### Task Details
- **Title**: Full descriptive title for the task
- **Description**: Detailed explanation of requirements
- **Priority**: normal (default), high, low
- **Type**: enhancement (default), bug, documentation, workflow-update, other

### Requirements Collection
- **Interactive**: Line-by-line requirement entry
- **Format**: Each requirement becomes a checkbox item
- **Termination**: Empty line stops collection

## Error Handling

### Invalid Input Validation
```bash
# Target repository validation
if [ -z "$TARGET_REPO" ]; then
    echo "Error: Target repository cannot be empty"
    exit 1
fi

# Task name validation
if [ -z "$TASK_NAME" ]; then
    echo "Error: Task name cannot be empty"
    exit 1
fi
```

### File Creation Failures
```bash
if ! echo "$TASK_CONTENT" > "$TASK_FILE_PATH"; then
    echo "Error: Failed to create task file"
    echo "Check directory permissions and disk space"
    exit 1
fi
```

### Directory Access Issues
```bash
if [ ! -w "outbox" ]; then
    echo "Error: Cannot write to outbox directory"
    echo "Check directory permissions"
    exit 1
fi
```

## Success Criteria
- Interactive prompts collect all required task information
- Task filename follows standardized timestamp format
- Task content includes proper metadata header and structure
- Task file successfully written to outbox directory
- Clear next steps provided for task distribution

## Integration Points
- **OUTBOX**: Downstream workflow that distributes created tasks
- **INBOX**: Ultimate target workflow that processes delivered tasks
- **Project Info**: Source repository detection for metadata
- **AUDIT_LOGGING**: Log all task creation operations

## Usage Examples

### Create a new task
```bash
# Interactive task creation (prompts for target)
task sesame
# Result: Guided prompts for all task details, file created in outbox/

# Direct target specification
task sesameh/claude-swift sesame
# Result: Target pre-filled, prompts for remaining details, file created in outbox/

# Direct target with repo name only
task splectrum sesame
# Result: Target set to "splectrum", prompts for remaining details
```

### Example interaction flow

**Interactive Mode (no target parameter):**
```bash
$ task sesame
=== CREATE CROSS-REPOSITORY TASK ===

Target Repository:
Enter the repository that should receive this task (format: org/repo or just repo-name):
Target: sesameh/claude-swift

Task Summary:
Enter a brief task name (will be used in filename, use hyphens for spaces):
Task name: Update documentation

Task Title:
Enter the full task title (will appear as # heading in task file):
Title: Update user documentation for v1.1.0

Task Description:
Enter a detailed description of what needs to be done:
Description: Update all user-facing documentation to reflect new workflow capabilities

Task Priority (HIGH/MEDIUM/LOW):
Priority [MEDIUM]: HIGH

Priority Justification:
Explain why this priority level is appropriate:
Justification: Critical for v1.1.0 adoption - users need current documentation

Task Effort (S/M/L/XL):
Effort [M]: L

Effort Justification:
Brief explanation for effort estimate:
Estimate reasoning: Multiple documentation files need updates, comprehensive review required

Task Type (enhancement/bug/documentation/workflow-update/other):
Type [enhancement]: documentation

Work Area/Epic:
Which area of the project does this affect? (e.g., v1.1.0, documentation, infrastructure):
Work area: v1.1.0

Dependencies:
Enter issues this task blocks (comma-separated, or press Enter if none):
Blocks: 

Enter issues that must be completed before this task (comma-separated, or press Enter if none):
Blocked by: 39

Enter related issues to consider together (comma-separated, or press Enter if none):
Related: 24, 32

Test Criteria:
Enter specific validation steps to verify completion (one per line, press Enter twice when done):
- All documentation files updated with new workflow information
- Examples tested and verified working
- Documentation review completed by team

Additional Context (optional):
Enter any additional context or background information:
Context: Following v1.1.0 release with INBOX/OUTBOX workflows

=== TASK SUMMARY ===
Target: claude-swift
Name: update-documentation
Title: Update user documentation for v1.1.0
Priority: HIGH (Critical for v1.1.0 adoption - users need current documentation)
Effort: L (Multiple documentation files need updates, comprehensive review required)
Type: documentation
Work Area: v1.1.0
Blocked by: 39
Related: 24, 32

Proceed with task creation? (y/n)
Confirm: y

✓ Task file created: outbox/2025-07-14T16-30-45-123Z_claude-swift_update-documentation.md
```

**Parameter Mode (target specified):**
```bash
$ task sesameh/claude-swift sesame
=== CREATE CROSS-REPOSITORY TASK ===

Target Repository: sesameh/claude-swift (from parameter)

Task Summary:
Enter a brief task name (will be used in filename, use hyphens for spaces):
Task name: Fix critical bug

Task Title:
Enter the full task title (will appear as # heading in task file):
Title: Fix critical authentication bug in v1.1.0

Task Description:
Enter a detailed description of what needs to be done:
Description: Authentication fails for new users after v1.1.0 deployment

Task Priority (HIGH/MEDIUM/LOW):
Priority [MEDIUM]: HIGH

Priority Justification:
Explain why this priority level is appropriate:
Justification: Blocking new user onboarding - affects production

Task Effort (S/M/L/XL):
Effort [M]: S

Effort Justification:
Brief explanation for effort estimate:
Estimate reasoning: Isolated issue with known fix pattern

Task Type (enhancement/bug/documentation/workflow-update/other):
Type [enhancement]: bug

Work Area/Epic:
Which area of the project does this affect? (e.g., v1.1.0, documentation, infrastructure):
Work area: v1.1.0

Dependencies:
Enter issues this task blocks (comma-separated, or press Enter if none):
Blocks: 45, 46

Enter issues that must be completed before this task (comma-separated, or press Enter if none):
Blocked by: 

Enter related issues to consider together (comma-separated, or press Enter if none):
Related: 44

Test Criteria:
Enter specific validation steps to verify completion (one per line, press Enter twice when done):
- Authentication works for new users
- Existing users unaffected
- Integration tests pass

Additional Context (optional):
Enter any additional context or background information:
Context: Introduced in v1.1.0 release, affecting production

=== TASK SUMMARY ===
Target: claude-swift
Name: fix-critical-bug
Title: Fix critical authentication bug in v1.1.0
Priority: HIGH (Blocking new user onboarding - affects production)
Effort: S (Isolated issue with known fix pattern)
Type: bug
Work Area: v1.1.0
Blocks: 45, 46
Related: 44

Proceed with task creation? (y/n)
Confirm: y

✓ Task file created: outbox/2025-07-14T16-30-45-123Z_claude-swift_fix-critical-bug.md
```

## Workflow Benefits

### User Experience
- **Flexible Input**: Optional target parameter or interactive prompts
- **Guided Creation**: Interactive prompts ensure complete task information
- **Format Consistency**: Standardized templates and filenames
- **Error Prevention**: Validation and confirmation steps
- **Streamlined Workflow**: Skip target prompt when destination is known

### Integration
- **Seamless Distribution**: Files ready for OUTBOX workflow
- **Metadata Rich**: Complete source/target information for routing
- **Issue Integration**: Tasks become GitHub issues via INBOX workflow

### Automation
- **Timestamp Generation**: Precise ordering for task processing
- **Source Detection**: Automatic repository identification
- **Template Population**: Consistent task structure

## Trigger Pattern

```markdown
**TASK_CREATE** → See [workflows/TASK_CREATE.md](./workflows/TASK_CREATE.md)
```

Use when:
- Creating cross-repository tasks for other teams/projects
- Requesting work from external repositories
- Coordinating multi-project initiatives
- Establishing formal task communication channels

**Usage Patterns:**
- `task sesame` - Interactive mode, prompts for target repository
- `task [org/repo] sesame` - Direct mode, target pre-specified
- `task [repo-name] sesame` - Direct mode with repo name only