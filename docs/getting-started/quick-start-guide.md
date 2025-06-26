[← Back to Claude-Swift Home](../../README.md)

# Claude-Swift Quick Start Guide

*Get productive with claude-swift in 10 minutes*

## Prerequisites Checklist

### Required Tools
- ✅ **Claude Code CLI** - Primary development environment
- ✅ **Git** - Version control (claude-swift uses git workflows)
- ✅ **GitHub CLI (gh)** - Release and PR management
- ✅ **Basic shell environment** - Windows/WSL, macOS, or Linux

### Required Knowledge
- **Basic Git operations** - commit, push, pull, branch management
- **Command line comfort** - navigating directories, running commands
- **Text editor familiarity** - editing markdown and configuration files

### Project Prerequisites
- **GitHub repository** - Where you want to deploy claude-swift
- **Development branch strategy** - Recommended: main + unplanned branches
- **Project documentation** - At least a basic README.md

## 5-Minute Deployment

### Step 1: Download Claude-Swift Template
```bash
# Download the latest release
gh release download --repo SPlectrum/claude-swift --pattern "claude-swift-template.7z"

# Extract to your project directory
7z x claude-swift-template.7z
cp -r claude-swift-template/* /path/to/your/project/
```

### Step 2: Configure Your Project
```bash
# Edit project configuration
edit claude/project/project-info.md
edit claude/project/version-config.md

# Initialize your first session
claude code  # (Claude Code CLI)
```

### Step 3: First Workflow Test
In Claude Code, try your first workflow:
```
start sesame
```
You should see session initialization and branch verification.

### Step 4: Verify Installation
```
commands sesame
```
This displays available workflow commands - if you see the list, installation is successful!

## Essential Workflows (Your Daily Tools)

### Session Management
- `start sesame` - Begin a work session
- `finish sesame` - End session cleanly
- `git sesame` - Git workflow assistance

### Task Management  
- `todo sesame` - Repository todo management
- `next sesame` - Get next issue to work on
- `planning sesame` - Switch between planned/unplanned work

### Project Operations
- `release sesame` - Create project releases
- `docs sesame` - Documentation workflows
- `project sesame` - Project automation

## Common First-Day Tasks

### 1. Set Up Your Project Information
Edit `claude/project/project-info.md`:
```markdown
- **PROJECT_NAME**: [Your Project Name]
- **PROJECT_TYPE**: [application/library/service]
- **DESCRIPTION**: [Brief project description]
- **PURPOSE**: [Why this project exists]
```

### 2. Configure Version Management
Edit `claude/project/version-config.md`:
```markdown
- **CURRENT_VERSION**: [0.1.0]
- **VERSION_PATTERN**: [semantic/date/custom]
- **RELEASE_TYPE**: [application/library/service]
```

### 3. Add Your First Todo Items
```
todo sesame
```
Add your project goals and immediate next steps.

### 4. Create Your First Documentation
```
docs sesame
```
Set up your project documentation structure.

## Troubleshooting Common Issues

### "Workflow not found" Error
**Solution**: Check that you're in the project root directory with `claude/` folder present.

### "Branch verification failed"  
**Solution**: Claude-swift expects `unplanned` branch as default. Create it:
```bash
git checkout -b unplanned
git push -u origin unplanned
```

### "Session initialization error"
**Solution**: Verify your git configuration and GitHub CLI authentication:
```bash
git config --list
gh auth status
```

### Template Files Still Have Placeholders
**Solution**: Edit the configuration files in `claude/project/` to replace `[placeholder]` values with your project specifics.

## Next Steps

### Week 1: Foundation Setup
1. ✅ Complete project configuration
2. ✅ Set up branch strategy (main + unplanned)
3. ✅ Create initial project documentation
4. ✅ Practice session management workflows

### Week 2: Workflow Integration
1. ✅ Establish daily workflow patterns
2. ✅ Set up release process
3. ✅ Create project-specific workflows
4. ✅ Practice git workflow integration

### Month 1: Advanced Usage
1. ✅ Customize project hooks for your workflow
2. ✅ Set up automated quality gates
3. ✅ Integrate with team processes
4. ✅ Establish documentation maintenance

## Getting Help

### Built-in Help
- `commands sesame` - List all available workflows
- `rules sesame` - Show operational rules and guidelines

### Documentation
- **[Architecture Guide](../architecture/template-system-architecture.md)** - How claude-swift works
- **[Deployment Guide](../deployment/sidecar-deployment-guide.md)** - Detailed deployment instructions
- **[Best Practices](../knowledge/development-best-practices.md)** - Proven patterns for success

### Community
- **GitHub Issues** - Report problems or request features
- **Discussions** - Ask questions and share experiences
- **Wiki** - Community-contributed guides and tips

## Success Indicators

After your first week, you should be able to:
- ✅ Start and end sessions cleanly
- ✅ Navigate between planned and unplanned work
- ✅ Create and manage project todos
- ✅ Run basic git workflows with assistance
- ✅ Generate project documentation

You're successfully using claude-swift when:
- Work sessions are well-organized and tracked
- Documentation stays current with development
- Git workflows are smooth and consistent
- Project planning is systematic and clear

---

*Quick Start Guide - Get productive with claude-swift in 10 minutes*