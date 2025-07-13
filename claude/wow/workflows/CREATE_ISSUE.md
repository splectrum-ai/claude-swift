# CREATE_ISSUE

## Overview
Manual issue creation workflow with standardized metadata structure to ensure compatibility with NEXT_ISSUE recommendations and project organization.

## Workflow Steps

### 1. Gather Issue Information
**Required Information:**
- **Title**: Clear, descriptive issue title
- **Description**: What needs to be done and why
- **Priority**: HIGH/MEDIUM/LOW with justification
- **Effort**: S/M/L/XL with estimation reasoning
- **Dependencies**: Blocking relationships and related issues
- **Work Area**: Project-specific label or epic
- **Test Criteria**: Specific validation steps

### 2. Create Issue with Metadata
```bash
gh issue create --title "[Issue Title]" --body "$(cat <<'EOF'
## Description
[Clear description of what needs to be done]

## Priority: [HIGH/MEDIUM/LOW]
**Justification:** [Why this priority level]

## Dependencies
**Blocks:** [List of issues this blocks]
**Blocked by:** [List of issues that must be done first]
**Related:** [Issues that should be considered together]

## Effort: [S/M/L/XL]
**Estimate:** [Brief justification for effort level]

## Test Criteria
**How to verify completion:**
- [ ] [Specific test/validation step]
- [ ] [Another verification step]
- [ ] [Final acceptance criteria]

## Work Area: [Epic Label]
**Context:** [Brief note about which work area this affects]

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

### 3. Apply Labels and Milestone
```bash
# Add appropriate labels
gh issue edit [ISSUE_NUMBER] --add-label "[priority-label]" --add-label "[work-area-label]"

# Assign to current milestone
gh issue edit [ISSUE_NUMBER] --milestone "[current-milestone]"
```

### 4. Update Dependencies
If the issue has dependencies, update related issues:
```bash
# For issues this blocks - add reference in their description
# For issues this is blocked by - add reference in their description
```

## Metadata Standards

### Priority Levels
- **HIGH**: Critical for milestone completion, blocks other work, urgent issues
- **MEDIUM**: Important for milestone goals, moderate impact on other work  
- **LOW**: Nice to have, minimal impact if deferred, background improvements

### Effort Estimates
- **S (Small)**: 1-2 hours, single focused task
- **M (Medium)**: Half day to full day, moderate complexity
- **L (Large)**: 2-3 days, complex task or multiple components
- **XL (Extra Large)**: Week+, major feature or significant refactoring

### Dependency Types
- **Blocks**: Issues that cannot start until this is complete
- **Blocked by**: Issues that must be completed before this can start
- **Related**: Issues that should be considered together but not strict dependencies

## Integration with NEXT_ISSUE

This structure enables smart prioritization using the formula:
```
Score = (Priority Weight × Impact Factor × Readiness) / Effort Factor

Where:
- Priority Weight: HIGH=3, MEDIUM=2, LOW=1
- Impact Factor: Number of issues this blocks + 1
- Readiness: 1 if no blockers, 0.5 if partial blockers, 0 if fully blocked
- Effort Factor: S=1, M=2, L=3, XL=4
```

## Quality Guidelines

### Good Issue Examples
- **Clear scope**: Single, well-defined objective
- **Testable criteria**: Specific validation steps
- **Proper effort estimate**: Realistic complexity assessment
- **Clear dependencies**: Well-identified blocking relationships

### Avoid These Patterns
- **Vague descriptions**: "Fix the thing" or "Make it better"
- **Missing test criteria**: No way to verify completion
- **Unrealistic effort**: Massive scope in small estimate
- **Missing dependencies**: Ignoring prerequisite work

## Template Shortcuts

### Quick Issue Template
```markdown
## Description
[What needs to be done]

## Priority: MEDIUM
**Justification:** [Why this matters]

## Dependencies
**Blocks:** None
**Blocked by:** None
**Related:** None

## Effort: M
**Estimate:** [Time reasoning]

## Test Criteria
**How to verify completion:**
- [ ] [Verification step]

## Work Area: [Label]
**Context:** [Project area]
```

### Bug Report Template
```markdown
## Description
**Bug:** [What's broken]
**Impact:** [How it affects users/system]
**Reproduction:** [Steps to reproduce]

## Priority: HIGH
**Justification:** [Why urgent]

## Dependencies
**Blocks:** [What this breaks]
**Blocked by:** [Prerequisites to fix]
**Related:** [Similar issues]

## Effort: S
**Estimate:** [Fix complexity]

## Test Criteria
**How to verify completion:**
- [ ] Bug no longer reproduces
- [ ] [Additional validation]

## Work Area: BUG
**Context:** [System area affected]
```

## Trigger Pattern

```markdown
**CREATE_ISSUE** → See [workflows/CREATE_ISSUE.md](./workflows/CREATE_ISSUE.md)
```

Use when:
- Creating issues outside formal planning sessions
- Need properly structured issue for NEXT_ISSUE compatibility
- Adding ad-hoc work to project backlog
- Converting informal tasks to tracked issues

## Success Metrics

### Well-Structured Issues
- Contains all required metadata fields
- Clear, testable acceptance criteria
- Realistic effort estimates
- Proper dependency identification

### NEXT_ISSUE Integration
- Issues appear in recommendations with correct scores
- Priority and effort weights applied correctly
- Dependency blocking works as expected
- Milestone assignment enables proper filtering