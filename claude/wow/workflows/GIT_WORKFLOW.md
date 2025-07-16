[← Back to Claude-Swift Home](../../README.md)

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
# 1. Start session - ensure you're on main
git checkout main
git pull origin main

# 2. Make changes...

# 3. Commit your work
git add .
git commit -m "Clear description of changes"
git push origin main
```

### Commit Message Format
```bash
git commit -m "Brief summary of changes

- Detailed point about what changed
- Another detail if needed

Context: Why this change was made"
```

For AI-assisted commits:
```bash
git commit -m "$(cat <<'EOF'
Summary of changes

- Implementation details
- Key modifications

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## Session Management

### SESSION_START Git Check
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main
git status  # Should show clean working tree
```

### SESSION_END Commit Pattern
```bash
# 1. Archive current audit log
mv claude/project/audit/current/current.log claude/project/audit/current/session_$(date -u +%Y-%m-%dT%H-%M-%S)Z.log

# 2. Commit all work
git add .
git commit -m "Session complete: [summary of work done]"
git push origin main

# 3. Create fresh audit log
echo "##APPEND_MARKER_UNIQUE##" > ./claude/project/audit/current/current.log
```

## Issue-Based Work

When working on GitHub issues:
```bash
# Reference issue number in commit
git commit -m "Fix authentication bug (#123)

- Updated token validation
- Added error handling

Closes #123"
```

## Version Release Workflow

### Creating a Release
```bash
# 1. Archive audit logs
mv claude/project/audit/current/current.log claude/project/audit/v{VERSION}/audit_v{VERSION}.log

# 2. Commit version preparation
git add .
git commit -m "Prepare v{VERSION} release"
git push origin main

# 3. Create tag and release
git tag v{VERSION}
git push origin v{VERSION}
gh release create v{VERSION} --title "{PROJECT_NAME} v{VERSION}" --notes-file release-notes.md
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