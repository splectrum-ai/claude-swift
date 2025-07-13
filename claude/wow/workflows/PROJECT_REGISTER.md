# PROJECT_REGISTER

## Overview
Automated project registration that creates symlinks to the base project's claude-swift framework, enabling shared operational machinery across multiple projects.

## Trigger
**User-Friendly**: `register [org/repo] sesame` or `register sesame` (interactive)
**Technical**: `PROJECT_REGISTER`

## Purpose
- Register sub-projects with the claude-swift framework
- Create CLAUDE.md and claude/wow symlinks to base project
- Track registered projects in a central registry
- Validate project existence and structure

## Prerequisites
- INITIALISE workflow completed (projects/ symlink exists)
- Base project contains claude/wow framework
- GitHub CLI (`gh`) authenticated for repository access
- Target repository exists locally or is accessible on GitHub

## Workflow Steps

### 1. Repository Input and Validation
```
PROJECT_REGISTER|step|input_validation||Get and validate repository parameter
```

**Repository Input Options:**
- **Parameter provided**: `register org/repo sesame`
- **Interactive prompt**: `register sesame` (prompts for repository)

**Interactive Prompt:**
```
Enter repository in format 'org/repo':
```

**Validation:**
- Format: `org/repo` pattern required
- Repository must exist in workspace

### 2. Base Project Detection
```
PROJECT_REGISTER|step|base_detection||Detect base project path using directory structure
```

**Detection Logic:**
```bash
# Detect base project location
BASE_PROJECT_PATH=$(pwd)
if [ ! -d "projects" ]; then
    echo "Error: Not in valid project structure (no projects/ directory found)"
    echo "Run 'initialise sesame' to set up workspace first"
    exit 1
fi
echo "Base project detected at: $BASE_PROJECT_PATH"
```

### 3. Repository Availability Check
```
PROJECT_REGISTER|step|repository_check||Validate target repository exists locally or on GitHub
```

**Repository Validation and Auto-Clone:**
```bash
# Check if repository exists locally
REPO_PATH="$BASE_PROJECT_PATH/projects/$REPOSITORY"
if [ ! -d "$REPO_PATH" ]; then
    echo "Repository '$REPOSITORY' not found locally. Checking GitHub..."
    
    # Check if repository exists on GitHub
    if gh repo view "$REPOSITORY" >/dev/null 2>&1; then
        echo "Found repository '$REPOSITORY' on GitHub. Cloning..."
        
        # Create org directory if needed
        ORG_DIR="$(dirname "$REPO_PATH")"
        mkdir -p "$ORG_DIR"
        
        # Clone repository
        gh repo clone "$REPOSITORY" "$REPO_PATH"
        echo "✓ Cloned $REPOSITORY to $REPO_PATH"
    else
        echo "Error: Repository '$REPOSITORY' not found locally or on GitHub"
        echo "Available local projects:"
        find "$BASE_PROJECT_PATH/projects/" -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sed 's|.*/projects/||' | head -10 || echo "  (none)"
        echo ""
        echo "Ensure the repository exists on GitHub or clone it manually to projects/$REPOSITORY"
        exit 1
    fi
else
    echo "Found local repository: $REPO_PATH"
fi

TARGET_PATH="$REPO_PATH"
echo "Repository ready: $TARGET_PATH"
```

### 4. Symlink Registration
```
PROJECT_REGISTER|step|symlink_creation||Create CLAUDE.md and claude/wow symlinks
```

**Symlink Creation:**
```bash
# Navigate to target project directory
cd "$TARGET_PATH"

# Create CLAUDE.md symlink (force overwrite)
echo "Creating CLAUDE.md symlink..."
ln -sf "$BASE_PROJECT_PATH/CLAUDE.md" CLAUDE.md

# Create claude/wow symlink (force overwrite)
echo "Creating claude/wow symlink..."
mkdir -p claude
ln -sf "$BASE_PROJECT_PATH/claude/wow" claude/wow

# Verify symlinks
echo "✓ CLAUDE.md -> $(readlink CLAUDE.md)"
echo "✓ claude/wow -> $(readlink claude/wow)"
```

### 5. Project Registry Update
```
PROJECT_REGISTER|step|registry_update||Add project to registered projects list
```

**Registry Management:**
```bash
# Create or update registry file
REGISTRY_FILE="$BASE_PROJECT_PATH/claude/project/registered-projects.json"
mkdir -p "$(dirname "$REGISTRY_FILE")"

# Initialize registry if it doesn't exist
if [ ! -f "$REGISTRY_FILE" ]; then
    echo '{"registered_projects": []}' > "$REGISTRY_FILE"
fi

# Add project to registry (if not already present)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PROJECT_ENTRY="{\"repository\": \"$REPOSITORY\", \"path\": \"$TARGET_PATH\", \"registered_at\": \"$TIMESTAMP\"}"

# Check if project already registered
if ! grep -q "\"repository\": \"$REPOSITORY\"" "$REGISTRY_FILE"; then
    # Add new project entry
    python3 -c "
import json
import sys
with open('$REGISTRY_FILE', 'r') as f:
    data = json.load(f)
data['registered_projects'].append($PROJECT_ENTRY)
with open('$REGISTRY_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
    echo "✓ Added $REPOSITORY to project registry"
else
    echo "✓ Project $REPOSITORY already in registry"
fi
```

### 6. Registration Summary
```
PROJECT_REGISTER|step|completion_summary||Provide registration completion summary
```

**Completion Report:**
```bash
echo ""
echo "=== PROJECT REGISTRATION COMPLETE ==="
echo "Registered project: $REPOSITORY"
echo "Project path: $TARGET_PATH"
echo "Framework: Symlinked to base project"
echo "CLAUDE.md: $(readlink CLAUDE.md 2>/dev/null)"
echo "claude/wow: $(readlink claude/wow 2>/dev/null)"
echo "Registry updated: $REGISTRY_FILE"
echo ""
echo "Project is now ready for claude-swift operations!"
echo "Use absolute paths or navigate to project directory for work."
```

## Workflow Architecture

### Directory Structure
```
base-project/                    # Base repository 
├── claude/
│   ├── wow/                    # Shared framework (source)
│   ├── project/                # Base project config
│   │   └── registered-projects.json  # Registry of registered projects
├── CLAUDE.md                   # Base configuration (source)
├── projects/ -> [workspace]    # Symlink to workspace root (from INITIALISE)
└── .gitignore                  # Contains: projects/

workspace-root/                 # Workspace root (from INITIALISE configuration)
├── org1/
│   └── repo1/                  # Registered sub-project
│       ├── CLAUDE.md -> [base]/CLAUDE.md (symlink)
│       ├── claude/
│       │   ├── wow -> [base]/claude/wow (symlink)
│       │   └── project/        # Project-specific config
│       └── [project files...]
└── org2/
    └── repo2/                  # Another registered sub-project
```

### Project Registry
The registry file `claude/project/registered-projects.json` tracks:
```json
{
  "registered_projects": [
    {
      "repository": "org1/repo1", 
      "path": "/workspace/org1/repo1",
      "registered_at": "2025-07-14T01:30:00Z"
    }
  ]
}
```

### Symlink Targets
All symlinks in registered projects point to the base project:
- `CLAUDE.md` → `$BASE_PROJECT_PATH/CLAUDE.md`
- `claude/wow` → `$BASE_PROJECT_PATH/claude/wow`

## Error Handling

### Invalid Project Structure
```bash
if [ ! -d "projects" ]; then
    echo "Error: Invalid project structure (no projects/ directory found)"
    echo "Run 'initialise sesame' to set up workspace first"
    exit 1
fi
```

### Repository Not Found
```bash
if [ ! -d "$REPO_PATH" ] && ! gh repo view "$REPOSITORY" >/dev/null 2>&1; then
    echo "Error: Repository '$REPOSITORY' not found locally or on GitHub"
    echo "Available local projects:"
    find "$BASE_PROJECT_PATH/projects/" -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sed 's|.*/projects/||' | head -10 || echo "  (none)"
    echo ""
    echo "Ensure the repository exists on GitHub or clone it manually to projects/$REPOSITORY"
    exit 1
fi
```

### GitHub Authentication Issues
```bash
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: GitHub CLI not authenticated"
    echo "Run 'gh auth login' to authenticate with GitHub"
    exit 1
fi
```

### Clone Failures
```bash
if ! gh repo clone "$REPOSITORY" "$REPO_PATH" 2>/dev/null; then
    echo "Error: Failed to clone repository '$REPOSITORY'"
    echo "Check repository permissions and network connectivity"
    echo "You may need to clone manually: gh repo clone $REPOSITORY projects/$REPOSITORY"
    exit 1
fi
```

### Registry File Issues
```bash
if [ ! -w "$(dirname "$REGISTRY_FILE")" ]; then
    echo "Warning: Cannot write to registry directory"
    echo "Registry update skipped - check permissions"
fi
```

## Success Criteria
- CLAUDE.md and claude/wow symlinks created in target project
- Project added to registered projects registry
- Symlinks point to correct base project paths
- Clear confirmation of registration completion

## Integration Points
- **INITIALISE**: Requires workspace to be initialized first
- **AUDIT_LOGGING**: Log all project registration operations
- **All workflows**: Registered projects can access shared framework through symlinks

## Usage Examples

### Register existing local project
```bash
# Direct mode - project already exists locally
register jules-tenbos/splectrum sesame
# Result: Creates symlinks and adds to registry
```

### Register project with auto-clone
```bash
# Direct mode - project doesn't exist locally, will auto-clone from GitHub
register sesameh/claude-prince2 sesame
# Result: 
# - Checks GitHub for repository
# - Clones to projects/sesameh/claude-prince2/
# - Creates symlinks and adds to registry
```

### Interactive mode
```bash
register sesame
# Prompts: Enter repository in format 'org/repo':
# User types: jules-tenbos/new-project
# Workflow automatically handles local vs GitHub lookup
```

### Error handling
```bash
register nonexistent/repo sesame
# Result: Error message - not found locally or on GitHub
```

## Workflow Integration Pattern

This workflow enables the claude-swift multi-project architecture:
1. **Base project**: Template development and framework updates
2. **Registered projects**: Individual projects with shared framework access
3. **Symlink magic**: All projects use same claude/wow framework
4. **Registry tracking**: Know which projects are part of the system

## Registry Management

View registered projects:
```bash
cat claude/project/registered-projects.json
```

Projects can be worked with using absolute paths or by navigating to their directories.

## Trigger Pattern

```markdown
**PROJECT_REGISTER** → See [workflows/PROJECT_REGISTER.md](./workflows/PROJECT_REGISTER.md)
```

Use when:
- Adding new projects to claude-swift framework
- Setting up symlinks for existing projects  
- Auto-cloning and registering GitHub repositories
- Migrating from independent to shared framework
- Establishing project registry for multi-project workspace