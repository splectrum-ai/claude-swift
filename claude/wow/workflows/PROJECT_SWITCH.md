# PROJECT_SWITCH

## Overview
Automated project switching between base repository and sub-projects with intelligent symlink management and directory context switching.

## Trigger
**User-Friendly**: `switch [org/repo] sesame` or `switch sesame` (interactive)
**Technical**: `PROJECT_SWITCH`

## Purpose
- Switch Claude's working context between base project and sub-projects
- Manage CLAUDE.md and claude/wow symlinks automatically
- Support "." notation to return to base project
- Validate project existence and structure

## Prerequisites
- INITIALISE workflow completed (projects/ symlink exists)
- Base project contains claude/wow framework
- Target projects exist in workspace (projects/ symlink target)

## Workflow Steps

### 1. Repository Input and Validation
```
PROJECT_SWITCH|step|input_validation||Get and validate repository parameter
```

**Repository Input Options:**
- **Parameter provided**: `switch org/repo sesame`
- **Interactive prompt**: `switch sesame` (prompts for repository)
- **Base project**: `switch . sesame` (return to base)

**Interactive Prompt:**
```
Enter repository in format 'org/repo' or '.' for base project:
```

**Validation:**
- Format: `org/repo` pattern or single `.`
- Special case: `.` means return to base project

### 2. Base Project Detection
```
PROJECT_SWITCH|step|base_detection||Detect base project path using directory structure
```

**Detection Logic:**
```bash
# Detect if we're in a sub-project or base project
if [ -d "../../projects" ]; then
    # We're in a sub-project, base is ../..
    BASE_PROJECT_PATH=$(cd ../.. && pwd)
    echo "Detected base project at: $BASE_PROJECT_PATH"
else
    # We're in base project or invalid location
    BASE_PROJECT_PATH=$(pwd)
    if [ ! -d "projects" ]; then
        echo "Error: Not in valid project structure (no projects/ directory found)"
        exit 1
    fi
fi
```

### 3. Repository Existence Check
```
PROJECT_SWITCH|step|repository_check||Validate target repository exists
```

**For Base Project (repository = "."):**
```bash
# Switching to base project - always valid
TARGET_PATH="$BASE_PROJECT_PATH"
echo "Switching to base project: $TARGET_PATH"
```

**For Sub-Project:**
```bash
# Check if repository exists in projects folder
REPO_PATH="$BASE_PROJECT_PATH/projects/$REPOSITORY"
if [ ! -d "$REPO_PATH" ]; then
    echo "Error: Repository '$REPOSITORY' not found in projects/"
    echo "Available projects:"
    ls -1 "$BASE_PROJECT_PATH/projects/" 2>/dev/null || echo "  (none)"
    exit 1
fi
TARGET_PATH="$REPO_PATH"
echo "Found project: $TARGET_PATH"
```

### 4. Symlink Management
```
PROJECT_SWITCH|step|symlink_management||Create and validate CLAUDE.md and claude/wow symlinks
```

**For Sub-Projects Only (skip for base project):**
```bash
# Navigate to target project directory
cd "$TARGET_PATH"

# Validate projects symlink structure
# The folder that projects points to should be the same as ../.. from base project
BASE_PROJECTS_TARGET=$(cd "$BASE_PROJECT_PATH" && readlink projects)
BASE_PARENT_PATH=$(cd "$BASE_PROJECT_PATH/../.." && pwd)
if [ "$BASE_PROJECTS_TARGET" != "$BASE_PARENT_PATH" ]; then
    echo "Warning: projects/ symlink structure may be inconsistent"
    echo "Expected: $BASE_PARENT_PATH"
    echo "Actual: $BASE_PROJECTS_TARGET"
fi

# Check and create CLAUDE.md symlink
if [ ! -L "CLAUDE.md" ]; then
    echo "Creating CLAUDE.md symlink..."
    ln -sf "$BASE_PROJECT_PATH/CLAUDE.md" CLAUDE.md
else
    # Validate existing symlink points to correct base
    CURRENT_TARGET=$(readlink CLAUDE.md)
    EXPECTED_TARGET="$BASE_PROJECT_PATH/CLAUDE.md"
    if [ "$CURRENT_TARGET" != "$EXPECTED_TARGET" ]; then
        echo "Updating CLAUDE.md symlink target..."
        rm CLAUDE.md
        ln -sf "$BASE_PROJECT_PATH/CLAUDE.md" CLAUDE.md
    fi
fi

# Check and create claude/wow symlink
mkdir -p claude
if [ ! -L "claude/wow" ]; then
    echo "Creating claude/wow symlink..."
    ln -sf "$BASE_PROJECT_PATH/claude/wow" claude/wow
else
    # Validate existing symlink points to correct base
    CURRENT_TARGET=$(readlink claude/wow)
    EXPECTED_TARGET="$BASE_PROJECT_PATH/claude/wow"
    if [ "$CURRENT_TARGET" != "$EXPECTED_TARGET" ]; then
        echo "Updating claude/wow symlink target..."
        rm claude/wow
        ln -sf "$BASE_PROJECT_PATH/claude/wow" claude/wow
    fi
fi

# Verify symlinks
echo "✓ CLAUDE.md -> $(readlink CLAUDE.md)"
echo "✓ claude/wow -> $(readlink claude/wow)"
echo "✓ projects/ symlink structure validated"
```

### 5. Directory Context Switch
```
PROJECT_SWITCH|step|directory_switch||Switch Claude's working directory to target project
```

**Directory Switch:**
```bash
# Change to target directory
cd "$TARGET_PATH"

# Confirm location and provide feedback
CURRENT_DIR=$(pwd)
if [ "$REPOSITORY" = "." ]; then
    echo "✓ Switched to base project: $CURRENT_DIR"
else
    echo "✓ Switched to project '$REPOSITORY': $CURRENT_DIR"
fi

# Show current project context
if [ -f "CLAUDE.md" ]; then
    echo "✓ Claude framework available"
else
    echo "ℹ Base project - native Claude framework"
fi
```

### 6. Success Summary
```
PROJECT_SWITCH|step|completion_summary||Provide switch completion summary
```

**Completion Report:**
```bash
echo ""
echo "=== PROJECT SWITCH COMPLETE ==="
if [ "$REPOSITORY" = "." ]; then
    echo "Current context: Base project (claude-swift)"
    echo "Framework: Native claude/wow"
else
    echo "Current context: $REPOSITORY"
    echo "Framework: Symlinked to base project"
    echo "CLAUDE.md: $(readlink CLAUDE.md 2>/dev/null || echo 'N/A')"
    echo "claude/wow: $(readlink claude/wow 2>/dev/null || echo 'N/A')"
fi
echo "Working directory: $(pwd)"
echo "Ready for Claude operations!"
```

## Workflow Architecture

### Directory Structure
```
base-project/                    # Base repository (detected dynamically)
├── claude/
│   ├── wow/                    # Shared framework (source)
│   └── project/                # Base project config
├── CLAUDE.md                   # Base configuration (source)
├── projects/ -> [workspace]    # Symlink to workspace root (from INITIALISE)
└── .gitignore                  # Contains: projects/

workspace-root/                 # Workspace root (from INITIALISE configuration)
├── org1/
│   └── repo1/                  # Sub-project
│       ├── CLAUDE.md -> [base]/CLAUDE.md (symlink)
│       ├── claude/
│       │   ├── wow -> [base]/claude/wow (symlink)
│       │   └── project/        # Project-specific config
│       └── [project files...]
└── org2/
    └── repo2/                  # Another sub-project
```

### Symlink Targets
All symlinks in sub-projects point back to the dynamically detected base project:
- `CLAUDE.md` → `$BASE_PROJECT_PATH/CLAUDE.md`
- `claude/wow` → `$BASE_PROJECT_PATH/claude/wow`

### Dynamic Path Resolution
The workflow automatically detects paths without hardcoding:
- **Base project**: Detected via `../../projects` check or current directory
- **Workspace root**: Resolved via `projects/` symlink target
- **Symlink targets**: Calculated relative to detected base project path

## Error Handling

### Invalid Project Structure
```bash
if [ ! -d "projects" ] && [ ! -d "../../projects" ]; then
    echo "Error: Invalid project structure"
    echo "Run 'initialise sesame' to set up workspace first"
    exit 1
fi
```

### Repository Not Found
```bash
if [ ! -d "$REPO_PATH" ]; then
    echo "Error: Repository '$REPOSITORY' not found in projects/"
    echo "Available projects:"
    ls -1 "$BASE_PROJECT_PATH/projects/" 2>/dev/null || echo "  (none)"
    echo ""
    echo "Ensure the repository exists in the workspace directory"
    exit 1
fi
```

### Symlink Creation Failures
```bash
if [ ! -L "CLAUDE.md" ] || [ ! -L "claude/wow" ]; then
    echo "Warning: Some symlinks failed to create"
    echo "Check file permissions and disk space"
    echo "Manual symlink creation may be required"
fi
```

## Success Criteria
- Claude's working directory switched to target project
- For sub-projects: CLAUDE.md and claude/wow symlinks created/validated
- For base project: returned to original base directory
- Clear confirmation of current project context

## Integration Points
- **INITIALISE**: Requires workspace to be initialized first
- **AUDIT_LOGGING**: Log all project switch operations
- **SESSION workflows**: Work in switched project context
- **All workflows**: Access shared framework through symlinks

## Usage Examples

### Switch to existing sub-project
```bash
# Interactive mode
switch sesame
# Prompts: Enter repository in format 'org/repo' or '.' for base project:
# User types: sesameh/claude-swift

# Direct mode
switch sesameh/claude-swift sesame
# Result: Switches to projects/sesameh/claude-swift/
```

### Return to base project
```bash
switch . sesame
# Result: Returns to base claude-swift repository
```

### Error handling
```bash
switch nonexistent/repo sesame
# Result: Error message listing available projects
```

## Workflow Integration Pattern

This workflow enables seamless multi-project development:
1. **Base project**: Template development and framework updates
2. **Sub-projects**: Individual project work with shared framework
3. **Symlink magic**: All projects use same claude/wow framework
4. **Context switching**: Easy movement between projects

## Trigger Pattern

```markdown
**PROJECT_SWITCH** → See [workflows/PROJECT_SWITCH.md](./workflows/PROJECT_SWITCH.md)
```

Use when:
- Switching between base project and sub-projects
- Setting up symlinks for new projects
- Need to work in different project context
- Returning from sub-project to base template work