# INITIALISE

## Overview
One-time workspace setup and configuration workflow that creates the foundational infrastructure for claude-swift multi-project management.

## Trigger
**User-Friendly**: `initialise sesame` or `init sesame`
**Technical**: `INITIALISE`

## Purpose
Set up claude-swift workspace to manage multiple sub-projects through symlinked project directory structure.

## Scope
**Orchestrator-Only**: This workflow is ONLY available in the claude-swift orchestrator repository. It is NOT available in registered/orchestrated projects.

## Prerequisites
- Claude-swift repository positioned correctly in workspace structure
- Write permissions in repository and workspace directories  
- Workspace follows org/repo directory pattern

## ⚠️ IMPORTANT: Repository Structure Requirements

**INITIALISE requires claude-swift to be positioned correctly in workspace structure.**

**See setup documentation for detailed repository positioning requirements.**

## Workflow Steps

### 1. Repository Structure Validation
```
INITIALISE|step|structure_validation||Validate claude-swift is properly positioned in workspace
```

**Repository Structure Requirements:**
Claude-swift must be positioned so that:
- **Workspace root** is `../..` from claude-swift repository
- **Other repositories** exist as siblings at `../org/repo` level
- **Example structure**:
```
workspace-root/                    # Workspace directory
├── org1/
│   ├── repo1/                     # Project repository
│   ├── repo2/                     # Another project
│   └── claude-swift/              # This repository ← YOU ARE HERE
├── org2/
│   └── repo3/                     # Different org's project
└── personal/
    └── myproject/                 # Personal projects
```

**Pre-requisites Check:**
- Repository must be positioned correctly in workspace structure
- Workspace root (`../..`) must be accessible and writable
- Repository structure follows org/repo pattern

### 2. Automatic Workspace Detection
```
INITIALISE|step|workspace_detection||Automatically detect workspace root from repository position
```

**Automatic Detection:**
```bash
# Detect workspace root as ../.. from current repository
WORKSPACE_PATH=$(cd ../.. && pwd)
echo "Detected workspace root: $WORKSPACE_PATH"

# Validate workspace structure
if [ ! -d "$WORKSPACE_PATH" ]; then
    echo "Error: Workspace root not accessible"
    echo "Ensure claude-swift repository is positioned correctly"
    exit 1
fi

# Check for existing repositories in workspace
echo "Available repositories in workspace:"
find "$WORKSPACE_PATH" -mindepth 2 -maxdepth 2 -type d | head -10
```

### 3. Symlink Creation
```
INITIALISE|step|symlink_creation||Create projects symlink to workspace root
```

**Actions:**
```bash
# Check for existing projects/ directory or symlink
if [ -e "projects" ]; then
    echo "Existing projects/ found - removing to create fresh symlink"
    rm -rf projects/
fi

# Create symlink to automatically detected workspace root
ln -s "$WORKSPACE_PATH" projects

# Verify symlink creation and accessibility
if [ -L "projects" ] && [ -d "projects" ]; then
    echo "✓ Symlink created: projects/ -> $WORKSPACE_PATH"
    echo "✓ Workspace accessible through symlink"
    
    # Show available projects
    echo "Available projects:"
    ls -1 projects/ 2>/dev/null | head -10 || echo "  (workspace empty)"
else
    echo "✗ Failed to create symlink"
    echo "Check file permissions and workspace accessibility"
    exit 1
fi
```

### 4. Git Ignore Configuration
```
INITIALISE|step|gitignore_update||Add projects/ to .gitignore
```

**Actions:**
```bash
# Check if projects/ already in .gitignore
if ! grep -q "^projects/$" .gitignore 2>/dev/null; then
    echo "projects/" >> .gitignore
    echo "✓ Added projects/ to .gitignore"
else
    echo "✓ projects/ already in .gitignore"
fi
```

### 5. Configuration Storage
```
INITIALISE|step|config_storage||Store workspace configuration in project-info.md
```

**Update Configuration:**
Add workspace configuration to `claude/project/project-info.md`:
```markdown
## Workspace Configuration
- **Projects Directory**: Symlinked to $WORKSPACE_PATH
- **Workspace Type**: Automatic detection (../..)
- **Initialized**: $(date -u +"%Y-%m-%d")
- **Initialization Method**: INITIALISE workflow (automatic detection)
```

### 6. Validation and Summary
```
INITIALISE|step|validation||Verify complete workspace setup
```

**Final Checks:**
1. **Symlink Operational**: `projects/` points to correct location
2. **Git Ignore Updated**: `projects/` properly ignored
3. **Configuration Stored**: Workspace details in project-info.md
4. **Directory Access**: Can list contents of workspace through symlink

**Success Summary:**
```
=== Workspace Initialization Complete ===

✓ Workspace automatically detected: $WORKSPACE_PATH
✓ Symlink created: projects/ -> $WORKSPACE_PATH  
✓ Git ignore updated
✓ Configuration stored
✓ Repository structure validated

Next steps:
- Use 'register [org/repo] sesame' to register projects
- Projects accessible through: ./projects/[org]/[repo]
- Create tasks with 'task [repo] sesame'

Workspace ready for claude-swift multi-project operations!

Available projects:
[List of detected org/repo combinations]
```

## Error Recovery

### Common Issues and Solutions
- **Repository Positioning Error**: Claude-swift not in correct workspace structure
  - **Solution**: Move claude-swift to `workspace/org/claude-swift/` structure
  - **Check**: Ensure `../..` from claude-swift is the intended workspace root
- **Permission Denied**: No write access to workspace or repository
  - **Solution**: Ensure user has write permissions to both directories
- **Symlink Failure**: Filesystem doesn't support symlinks
  - **Solution**: Use filesystem that supports symlinks (not FAT32)
- **Workspace Structure**: Existing workspace doesn't follow org/repo pattern
  - **Solution**: Reorganize repositories into org/repo structure before INITIALISE

### Cleanup on Failure
If initialization fails:
1. Remove partial symlink if created
2. Restore original `projects/` if it existed
3. Clean up any partial configuration changes
4. Provide clear error message with next steps

## Integration Points

### PROJECT_REGISTER Workflow
- PROJECT_REGISTER validates workspace is initialized before operation
- If workspace not initialized, suggests running `initialise sesame`
- PROJECT_REGISTER uses symlinked `projects/` directory for repository management

### Audit Logging
All initialization steps logged for troubleshooting and verification.

### SESSION_START Integration
Optional: Check workspace initialization status during session start.

## Security Considerations
- Validate all user input paths for safety
- Prevent symlink to system directories
- Ensure proper permissions on created symlinks
- Audit all filesystem operations

## Success Criteria
- [ ] Interactive workspace path configuration working
- [ ] Symlink creation to user-specified workspace root
- [ ] Automatic .gitignore update for projects/ directory
- [ ] Configuration storage in project-info.md
- [ ] Integration with PROJECT_SWITCH workflow validation
- [ ] Error handling for common failure scenarios
- [ ] Complete audit trail of initialization process

## Orchestrator Integration
This workflow is part of the claude-swift orchestrator and enables workspace initialization for multi-project coordination.

## Trigger Pattern

```markdown
**INITIALISE** → See [claude/project/workflows/INITIALISE.md](./claude/project/workflows/INITIALISE.md)
```

Use when:
- Setting up claude-swift for the first time
- Initializing workspace for multi-project management
- Configuring project directory structure
- Preparing for PROJECT_SWITCH workflow usage