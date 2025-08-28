---
type: feature
github_id: 41
title: "Update SESSION_START to automatically execute SESSION_END for significant uncommitted work"
state: "closed"
milestone: "Claude Swift as root, with sub project work bench"
labels: "["enhancement","v1.1.0"]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-13T15:18:53Z"
local_updated_at: "2025-07-30T17:46:39.100Z"
github_milestone: "Claude Swift as root, with sub project work bench"
---

## Summary
Modify SESSION_START workflow to automatically execute SESSION_END when significant uncommitted work is detected, with user approval requested when significance is unclear.

## Current Problem
- SESSION_START detects uncommitted work but requires manual decision
- Risk of losing work or improper session boundaries
- Complexity in determining appropriate actions

## Proposed Solution
When SESSION_START detects uncommitted work:
1. **Significant work detected** → Automatically execute SESSION_END
2. **Significance unclear** → Ask user for approval
3. **Insignificant work** → Discard as currently implemented

## Implementation Details

### 1. Update Uncommitted Work Check Section
Replace current "Handle Appropriately" logic with:
```markdown
**Uncommitted Work Actions:**
1. **Significant Changes Detected**:
   - Automatically execute SESSION_END workflow
   - Complete proper commit and session closure
   - Resume SESSION_START after SESSION_END completes

2. **Unclear Significance**:
   - Present changes to user with: `git diff --stat`
   - Ask: "Uncommitted changes detected. Are these significant? (yes/no)"
   - If yes: Execute SESSION_END
   - If no: Discard with `git checkout .`

3. **Insignificant Changes**:
   - Discard without commit (current behavior)
```

### 2. Significance Detection Rules
**Automatically Significant:**
- Any audit log entries for current session beyond SESSION_START
- Code changes (*.js, *.py, *.md in src/, lib/, etc.)
- Configuration file changes
- New files created
- Workflow modifications

**Requires User Approval:**
- Documentation-only changes
- README updates
- Minor formatting changes
- Changes without audit trail

### 3. SESSION_END Integration
- SESSION_END should complete fully before resuming SESSION_START
- Clear message: "Completing previous session before starting new one..."
- Maintain session continuity in audit logs

## Benefits
- **Prevents work loss** - Significant work always properly committed
- **Cleaner boundaries** - Sessions properly closed before new ones
- **Reduced complexity** - Automatic handling of common case
- **User control** - Approval requested only when needed

## Success Criteria
- [ ] SESSION_START automatically triggers SESSION_END for significant work
- [ ] User approval mechanism works for unclear cases
- [ ] No work lost between sessions
- [ ] Audit logs show clear session boundaries
- [ ] Simplified decision tree in workflow

## Testing Scenarios
1. Start session with significant uncommitted work → Should auto-execute SESSION_END
2. Start session with formatting changes only → Should request approval
3. Start session with no changes → Should proceed normally
4. Start session after interrupted SESSION_END → Should complete recovery

## Prerequisites for Main-Only Workflow
This change simplifies SESSION_START and makes it easier to later remove branch management (issue #40), as session boundaries will be cleaner.

## Labels
- `enhancement` - Workflow improvement
- `v1.1.0` - Part of workflow optimization

🤖 Generated with [Claude Code](https://claude.ai/code)
