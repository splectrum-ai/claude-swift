# PROJECT_SWITCH Workflow

## Overview
Automated project switching with optional GitHub repository cloning and environment setup for subdirectory-based development workflows.

## Trigger
**User-Friendly**: `switch [project] sesame`
**Technical**: `PROJECT_SWITCH`

## Purpose
- Switch working directory to project subdirectory
- Clone GitHub repository if project doesn't exist locally
- Set up claude framework symlinks automatically
- Establish clean project context for development work

## Prerequisites
- GitHub CLI (`gh`) configured for authentication
- Base repository with claude/wow framework available
- GitHub organization/naming pattern configured
- Write access to projects directory

## Workflow Steps

### 1. Parameter Validation
- Extract project name from trigger: `switch [project] sesame`
- Validate project name format (alphanumeric, hyphens, underscores)
- Determine target directory: `projects/[project]/`

### 2. Directory Check and Setup
```bash
# Check if project directory exists
if [ ! -d "projects/[project]" ]; then
    # Directory doesn't exist - proceed to clone
    echo "Project directory not found. Attempting to clone repository..."
else
    # Directory exists - proceed to switch
    echo "Project directory found. Switching to existing project..."
fi
```

### 3. Repository Cloning (if needed)
```bash
# Determine repository URL using GitHub org pattern
REPO_URL="git@github.com:[ORG]/[project].git"

# Create projects directory if it doesn't exist
mkdir -p projects

# Clone repository
cd projects
gh repo clone [ORG]/[project]
cd ..
```

### 4. Framework Symlink Setup
```bash
# Navigate to project directory
cd projects/[project]

# Create claude directory structure
mkdir -p claude

# Set up symlinks to shared framework
ln -sf ../../claude/wow claude/wow
ln -sf ../../CLAUDE.md CLAUDE.md

# Confirm symlinks created successfully
ls -la claude/
ls -la CLAUDE.md
```

### 5. Project Context Initialization
```bash
# Check if project has its own claude/project directory
if [ ! -d "claude/project" ]; then
    echo "Creating project-specific claude directory structure..."
    mkdir -p claude/project
    
    # Create minimal project files if they don't exist
    if [ ! -f "claude/project/project-info.md" ]; then
        echo "# Project Info\n\nProject: [project]\nCreated: $(date)" > claude/project/project-info.md
    fi
fi
```

### 6. Working Directory Switch
```bash
# Change to project directory
cd projects/[project]

# Confirm location
pwd
echo "Successfully switched to project: [project]"
```

### 7. Optional Session Initialization
```bash
# Optionally trigger session start for clean context
# Uncomment if desired:
# SESSION_START
```

## Configuration

### GitHub Organization Setup
Configure your GitHub organization in `claude/project/project-info.md`:

```markdown
## Project Switch Configuration
- **GitHub Organization**: your-org-name
- **Default Branch**: main
- **Project Directory**: projects/
```

### Directory Structure
```
base-repo/
├── claude/
│   ├── wow/           # Shared framework
│   └── project/       # Base project config
├── CLAUDE.md          # Base configuration
├── projects/          # Development projects (gitignored)
│   ├── app1/          # Project 1
│   │   ├── claude/
│   │   │   ├── wow -> ../../claude/wow (symlink)
│   │   │   └── project/    # Project-specific config
│   │   └── CLAUDE.md -> ../../CLAUDE.md (symlink)
│   └── app2/          # Project 2
└── .gitignore         # Contains: projects/
```

## Error Handling

### Repository Not Found
```bash
if ! gh repo clone [ORG]/[project] 2>/dev/null; then
    echo "Error: Repository [ORG]/[project] not found or not accessible"
    echo "Please check:"
    echo "- Repository exists at github.com/[ORG]/[project]"
    echo "- You have access permissions"
    echo "- GitHub CLI is authenticated"
    return 1
fi
```

### Permission Issues
```bash
if [ ! -w "projects/" ]; then
    echo "Error: No write permission to projects directory"
    return 1
fi
```

### Symlink Creation Failures
```bash
if [ ! -L "claude/wow" ]; then
    echo "Warning: Failed to create claude/wow symlink"
    echo "Manual setup may be required"
fi
```

## Success Criteria
- Project directory exists at `projects/[project]/`
- Working directory changed to project location
- Symlinks properly established for shared framework
- Project context ready for development work

## Integration Points
- **SESSION_START**: Optional clean session initialization
- **Git workflows**: Project-specific git operations
- **AUDIT_LOGGING**: Log project switch operations
- **.gitignore**: Ensure projects/ directory is ignored in base repo

## Usage Examples

### Switch to existing project
```bash
switch myapp sesame
# Result: cd projects/myapp (if exists)
```

### Clone and switch to new project
```bash
switch newproject sesame
# Result: 
# 1. git clone git@github.com:myorg/newproject.git projects/newproject
# 2. Set up symlinks
# 3. cd projects/newproject
```

### With session initialization
```bash
switch webapp sesame
start sesame
# Result: Clean project context with session boundaries
```

## Notes
- Projects directory should be added to base repository's `.gitignore`
- Each project maintains independent git history
- Shared claude/wow framework stays synchronized across all projects
- Project-specific configuration goes in each project's `claude/project/` directory
- GitHub organization name should be configured in project settings