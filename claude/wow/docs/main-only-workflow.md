[← Back to Claude-Swift Home](../../../README.md)

# Main-Only Workflow Strategy

## Philosophy

**One Branch, Direct Commits, Maximum Simplicity**

The main-only workflow is optimized for AI-assisted collaborative development where:
- Sessions are focused and complete
- AI provides high accuracy with human oversight
- Overhead reduction enables creative flow
- Trust replaces process gates

## Core Principles

### 1. Single Branch Development
- **All work happens on main branch**
- No feature branches, no development branches
- No branch management overhead
- Linear commit history

### 2. Direct Commit Pattern
```
Work → Stage → Commit → Push → Continue
```

No intermediate steps:
- No PR creation
- No code review process
- No merge conflicts between branches
- No post-merge synchronization

### 3. Session-Based Boundaries
- **SESSION_START**: Sync with main, begin work
- **Work Phase**: Make changes, commit frequently
- **SESSION_END**: Archive work, push final state
- Clean handoff between sessions

## Implementation Strategy

### Daily Operations
```bash
# Session start
git checkout main
git pull origin main

# Work and commit
git add .
git commit -m "Description of changes"
git push origin main

# Continue working...
```

### Session Management
```bash
# SESSION_END pattern
mv current.log session_TIMESTAMP.log
git add .
git commit -m "Session complete: [summary]"
git push origin main
echo "##APPEND_MARKER_UNIQUE##" > current.log
```

### Issue-Based Work
```bash
# Reference issues in commits
git commit -m "Fix authentication bug (#123)

- Updated token validation
- Added error handling

Closes #123"
```

## Benefits

### Efficiency Gains
- **80% reduction** in git commands
- **No merge conflicts** between branches
- **Faster sessions** without branch overhead
- **Simplified training** for new contributors

### Quality Improvements
- **Linear history** easier to understand
- **Clear commits** show progression
- **Session boundaries** preserve context
- **Direct accountability** in commit messages

### AI Alignment
- **Matches single-session work** pattern
- **Reduces cognitive load** for AI
- **Eliminates branch state management**
- **Focuses on creation over process**

## Risk Mitigation

### Quality Assurance
- **Good commit messages** for history tracking
- **Frequent commits** to preserve progress
- **Session boundaries** for accountability
- **Robust backup strategy** via git history

### Error Recovery
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Amend commit message
git commit --amend -m "Updated message"

# Emergency reset to remote
git reset --hard origin/main
```

### Collaboration Patterns
- **Trust-based development** with human oversight
- **Clear commit attribution** via Co-Authored-By
- **Issue tracking** for coordination
- **Documentation** in commit messages

## Migration from Branch-Based

### What's Removed
- Feature branches (`git checkout -b feature/name`)
- Pull requests (`gh pr create`, `gh pr merge`)
- Branch synchronization (`git merge main`)
- Post-PR cleanup workflows

### What's Simplified
- **Git workflow**: 3 commands instead of 15
- **Session management**: Direct commit instead of PR cycle
- **Conflict resolution**: Eliminated merge conflicts
- **Mental model**: One branch, linear progression

### What's Enhanced
- **Commit quality**: More descriptive messages
- **Session boundaries**: Clearer handoffs
- **Development speed**: Faster iteration
- **Focus**: More time creating, less managing

## Success Metrics

### Operational
- Reduced git command complexity by 80%
- Eliminated merge conflicts
- Faster session completion
- Simplified error recovery

### Quality
- Clear linear commit history
- Descriptive commit messages
- Preserved session context
- Maintained accountability

### Developer Experience
- Reduced cognitive load
- Faster onboarding
- More time creating
- Less time managing process

## Best Practices

### Commit Frequency
- **Small, focused commits** for clear history
- **Functional units** that make sense together
- **Clear descriptions** of what and why

### Message Quality
- **Descriptive summaries** in first line
- **Implementation details** in body
- **Context and reasoning** when helpful
- **Issue references** when applicable

### Session Management
- **Clean start** with main sync
- **Regular commits** during work
- **Proper closure** with session archive
- **Clear handoff** for next session

---

*This strategy represents a fundamental shift from process-heavy to trust-based development, optimized for AI-assisted collaborative work.*