[← Back to Claude-Swift Home](../../README.md)

# Get Started with Claude-Swift

*Start collaborating with Claude more effectively in your project*

## What You'll Achieve

After following this guide, you'll have:
- ✅ **Structured collaboration** - Clear workflows for working with Claude
- ✅ **Session management** - Organized starts and stops for your work
- ✅ **Progress tracking** - Automatic logging of what gets done
- ✅ **Consistent handoffs** - Clean transitions between work sessions

## What You Need

- **Claude Code CLI** - Your primary development environment
- **A GitHub repository** - Where your project lives
- **Basic Git knowledge** - You can commit, push, and pull

## Quick Setup

### 1. Add Claude-Swift to Your Project
```bash
# In your project directory
curl -L https://github.com/SPlectrum/claude-swift/releases/latest/download/claude-swift-template.zip -o claude-swift.zip
unzip claude-swift.zip
```

### 2. Start Your First Session
Open Claude Code in your project and type:
```
start sesame
```

Claude will:
- Set up your workspace structure
- Initialize session tracking
- Prepare your project for structured collaboration

### 3. Try a Basic Workflow
Ask Claude to help with something, then end cleanly:
```
finish sesame
```

This ensures all your work is properly saved and tracked.

## What Just Happened?

Claude-swift created an organized workspace in your project:
- **Session tracking** - Every work session is logged
- **Clean handoffs** - You can stop and start work cleanly
- **Progress continuity** - Claude remembers what you were working on

Test your installation by typing:
```
commands sesame
```
If you see a list of available workflows, installation is successful!

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