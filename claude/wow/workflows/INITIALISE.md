# INITIALISE

## Overview
One-time workspace setup and configuration workflow that creates the foundational infrastructure for claude-swift multi-project management.

## Trigger
**User-Friendly**: `initialise sesame` or `init sesame`
**Technical**: `INITIALISE`

## Purpose
Set up claude-swift workspace to manage multiple sub-projects through symlinked project directory structure.

## Prerequisites
- Claude-swift repository cloned and operational
- Write permissions in repository directory
- Target workspace directory exists and is accessible

## Workflow Steps

### 1. Workspace Configuration Prompt
```
INITIALISE|step|workspace_prompt||Interactive workspace root configuration
```

**Prompt User:**
```
=== Claude-Swift Workspace Initialization ===

This will set up a workspace for managing multiple projects.

Enter the full path to your projects workspace root directory:
(This is where your project repositories will be located)

Example: /home/user/workspace
Example: /Users/user/Development  
Example: C:\Users\user\workspace

Workspace root path: 
```

### 2. Path Validation
```
INITIALISE|step|path_validation||Validate workspace path accessibility
```

**Validation Checks:**
1. **Path Exists**: Verify the specified path exists
2. **Directory Access**: Check read/write permissions
3. **Absolute Path**: Ensure path is absolute, not relative
4. **No Conflicts**: Check if `projects/` symlink already exists

**Error Handling:**
- **Path doesn't exist**: Offer to create directory or prompt for different path
- **Permission denied**: Request different path with proper permissions
- **Relative path**: Convert to absolute or request absolute path
- **Existing projects/**: Ask whether to overwrite or abort

### 3. Symlink Creation
```
INITIALISE|step|symlink_creation||Create projects symlink to workspace root
```

**Actions:**
```bash
# Remove existing projects/ if it exists (after user confirmation)
if [ -e "projects" ]; then
    rm -rf projects/
fi

# Create symlink to workspace root
ln -s "$WORKSPACE_PATH" projects

# Verify symlink creation
if [ -L "projects" ] && [ -d "projects" ]; then
    echo "✓ Symlink created: projects/ -> $WORKSPACE_PATH"
else
    echo "✗ Failed to create symlink"
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
- **Workspace Type**: External symlink
- **Initialized**: $(date -u +"%Y-%m-%d")
- **Initialization Method**: INITIALISE workflow
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

✓ Symlink created: projects/ -> $WORKSPACE_PATH
✓ Git ignore updated
✓ Configuration stored
✓ Workspace ready for project management

Next steps:
- Use 'switch [project] sesame' to clone and switch to projects
- Projects will be cloned into: $WORKSPACE_PATH
- Access projects through: ./projects/[project-name]

Workspace ready for claude-swift multi-project operations!
```

## Error Recovery

### Common Issues and Solutions
- **Permission Denied**: Guide user to choose accessible directory
- **Symlink Failure**: Check filesystem support for symlinks
- **Path Resolution**: Help resolve relative vs absolute path issues
- **Existing Directory**: Handle conflicts with existing `projects/` gracefully

### Cleanup on Failure
If initialization fails:
1. Remove partial symlink if created
2. Restore original `projects/` if it existed
3. Clean up any partial configuration changes
4. Provide clear error message with next steps

## Integration Points

### PROJECT_SWITCH Workflow
- PROJECT_SWITCH validates workspace is initialized before operation
- If workspace not initialized, suggests running `initialise sesame`
- PROJECT_SWITCH uses symlinked `projects/` directory for repository management

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

## Template Integration
This workflow is part of the claude-swift WoW template and will be available in all deployed claude-swift instances for workspace initialization.

## Trigger Pattern

```markdown
**INITIALISE** → See [workflows/INITIALISE.md](./workflows/INITIALISE.md)
```

Use when:
- Setting up claude-swift for the first time
- Initializing workspace for multi-project management
- Configuring project directory structure
- Preparing for PROJECT_SWITCH workflow usage