# CREATE_ISSUE

## Overview
Manual issue creation workflow with standardized metadata structure to ensure compatibility with NEXT_ISSUE recommendations and project organization.

## Workflow Steps

### 1. Initialize Audit Logging
```bash
# Load Node.js audit functions
source claude/scripts/audit-functions.sh

# Start issue creation workflow
audit_log "CREATE_ISSUE" "workflow_start" "issue_creation" "" "Starting CREATE_ISSUE workflow for manual issue creation"
```

### 2. Gather Issue Information
```bash
audit_log "CREATE_ISSUE" "step" "information_gathering" "" "Gathering issue information and metadata"
```
**Required Information:**
- **Title**: Clear, descriptive issue title
- **Description**: What needs to be done and why
- **Priority**: HIGH/MEDIUM/LOW with justification
- **Effort**: S/M/L/XL with estimation reasoning
- **Dependencies**: Blocking relationships and related issues
- **Work Area**: Project-specific label or epic
- **Test Criteria**: Specific validation steps

### 3. Create Issue with Metadata
```bash
audit_log "CREATE_ISSUE" "step" "issue_creation" "" "Creating GitHub issue with standardized metadata"

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

### 4. Apply Labels and Milestone
```bash
audit_log "CREATE_ISSUE" "step" "metadata_assignment" "" "Applying labels and milestone to created issue"

# Add appropriate labels
gh issue edit [ISSUE_NUMBER] --add-label "[priority-label]" --add-label "[work-area-label]"

# Assign to current milestone
gh issue edit [ISSUE_NUMBER] --milestone "[current-milestone]"
```

### 5. Update Dependencies
```bash
audit_log "CREATE_ISSUE" "step" "dependency_updates" "" "Updating dependency relationships for related issues"
```
If the issue has dependencies, update related issues:
```bash
# For issues this blocks - add reference in their description
# For issues this is blocked by - add reference in their description
```

### 6. Refresh Issue Cache
```bash
audit_log "CREATE_ISSUE" "step" "cache_refresh" "" "Refreshing issue cache to include newly created issue"
```
After successful issue creation, update the local issue cache for NEXT_ISSUE performance:
```bash
# Refresh issue cache to include newly created issue
echo "Refreshing issue cache..."
python3 -c "
import json
import subprocess
import sys
from datetime import datetime

try:
    # Fetch current issues from GitHub
    result = subprocess.run(['gh', 'issue', 'list', '--limit', '100', '--json', 'number,title,labels,state,milestone,createdAt,updatedAt'], 
                          capture_output=True, text=True, check=True)
    issues_list = json.loads(result.stdout)
    
    # Convert to cache format (keyed by issue number)
    cache = {}
    for issue in issues_list:
        cache[str(issue['number'])] = {
            **issue,
            'cached_at': datetime.utcnow().isoformat() + 'Z'
        }
    
    # Ensure cache directory exists
    subprocess.run(['mkdir', '-p', 'claude/project/cache'], check=True)
    
    # Write updated cache
    with open('claude/project/cache/issues.json', 'w') as f:
        json.dump(cache, f, indent=2)
    
    print(f'✓ Issue cache updated with {len(cache)} issues')
    
except Exception as e:
    print(f'⚠ Cache update failed: {e}', file=sys.stderr)
    # Don't fail the workflow if cache update fails
"

# Workflow completion logging
audit_log "CREATE_ISSUE" "workflow_complete" "issue_creation" "" "CREATE_ISSUE workflow completed - issue #$ISSUE_NUMBER created with full metadata"
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