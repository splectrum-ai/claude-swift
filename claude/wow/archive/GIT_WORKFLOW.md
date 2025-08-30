[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# GIT_WORKFLOW

## 🚨 Main-Only Git Workflow

**One Branch, Direct Commits, Maximum Simplicity**

## Trigger
**User-Friendly**: N/A (Reference document)
**Technical**: `GIT_WORKFLOW`

### Core Principles
1. **All work on main branch** - No feature branches, no merging
2. **Direct commits** - Stage, commit, push to main
3. **Clear commit messages** - Describe what changed and why
4. **No PRs needed** - Trust in AI accuracy and human oversight

## Basic Git Operations

### Daily Workflow
```bash
# 1. Start session - sync with remote
claude/wow/scripts/git-manage sync

# 2. Make changes...

# 3. Commit your work
claude/wow/scripts/git-manage commit
# Automatically handles: staging, commit message generation, push, issue closure
```

### Automated Commit Message Generation
```bash
# Standard automated commit
claude/wow/scripts/git-manage commit

# Custom commit message
claude/wow/scripts/git-manage commit --message "Brief summary of changes

- Detailed implementation points
- Technical approach and reasoning
- Integration considerations

Context: Business justification for the change"

# Dry run to preview commit
claude/wow/scripts/git-manage commit --dry-run
```

**Generated commit messages follow this format:**
```
Summary of changes

- Implementation details automatically extracted from file changes
- Technical approach inferred from code patterns
- Integration points identified from modified files

Context: Generated from change analysis and git history

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Session Management

### SESSION_START Git Check
```bash
# Ensure repository is synced and check status
claude/wow/scripts/git-manage sync  # Sync with remote
claude/wow/scripts/git-manage status  # Comprehensive status check
```

### SESSION_END Commit Pattern
```bash

# 2. Commit all work using automated script
claude/wow/scripts/git-manage commit --message "Session complete: [summary of work done]"
# Automatically handles staging, commit, push, and issue closure

```

## Issue-Based Work

When working on GitHub issues:
```bash
# The commit script automatically:
# 1. Scans recent work for issue references
# 2. Detects resolved issues from context
# 3. Closes issues with commit references
# 4. Updates local cache and GitHub

claude/wow/scripts/git-manage commit
# Automatically includes issue closure if detected

# Manual issue closure if needed:
claude/wow/scripts/issue-manage close XX
```

## Version Release Workflow

### Creating a Release
```bash

# 2. Create release using automated script
claude/wow/scripts/git-manage release v{VERSION} --message "Release v{VERSION} with latest improvements"
# Automatically handles:
# - Release commit creation
# - Git tag creation and push
# - GitHub release creation
# - Error handling and validation
```

## Common Scenarios

### Fixing a Mistake
```bash
# If you haven't pushed yet
git commit --amend -m "Updated message"

# If you need to undo last commit (but keep changes)
git reset --soft HEAD~1
```

### Checking History
```bash
# View recent commits
git log --oneline -10

# See what changed
git diff
git diff --staged  # for staged changes
```

### Emergency Recovery
```bash
# Reset to remote state (WARNING: loses local changes)
git fetch origin
git reset --hard origin/main
```

## Success Criteria

- All work committed directly to main branch
- Clear commit messages describe changes and rationale
- Repository state remains clean and up-to-date
- Linear history maintained without merge conflicts
- Session boundaries properly tracked through git operations
- Issue references included in relevant commits

## Benefits of Main-Only Workflow

1. **Simplicity** - No branch management overhead
2. **Speed** - Direct commits without PR process
3. **Clarity** - Linear history, easy to understand
4. **AI-Friendly** - Matches single-session work pattern
5. **Less Conflicts** - No merge conflicts between branches

## Best Practices

1. **Commit Frequently** - Small, focused commits
2. **Clear Messages** - Future you will thank present you
3. **Test Before Push** - Ensure changes work
4. **Pull Before Work** - Start with latest code

## Setup Aliases (Optional)

Add to your `.gitconfig`:
```ini
[alias]
    # Quick status
    st = status -sb
    
    # Commit with message
    cm = commit -m
    
    # Add all and commit
    acm = !git add . && git commit -m
    
    # Pull and push shortcuts
    pl = pull origin main
    ps = push origin main
    
    # Quick sync
    sync = !git pull origin main && git push origin main
```

## Migration Note

This workflow replaces the previous branch-based approach. Key differences:
- No more `unplanned` or feature branches
- No PR creation or merging
- No post-PR synchronization needed
- Significantly reduced command complexity

---

*Simplified for AI-assisted collaborative development - focus on creating, not managing.*