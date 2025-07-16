[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# NEXT_ISSUE

## Overview
Automated workflow for selecting the next GitHub issue to work on, combining recommendation engine with contextual decision factors.

## Trigger
**User-Friendly**: `next sesame`
**Technical**: `NEXT_ISSUE`

## Cache Integration
**Performance Optimization**: Uses local ISSUE_CACHE for instant issue queries instead of GitHub API calls. Requires cache to be populated via `issue sesame` or SESSION_START workflow.

## Workflow Steps

### 1. Cache Validation
```bash
# Ensure cache exists and is reasonably current
if [ ! -f "claude/project/cache/issues.json" ]; then
    echo "Issue cache not found. Running '`issue sesame`' to populate cache..."
    # Execute ISSUE_CACHE workflow to populate cache
    echo "Cache populated. Continuing with issue analysis..."
fi
```

### 2. Get Issue List from Cache
```bash
# Use local cache instead of GitHub API for performance
python3 -c "
import json
with open('claude/project/cache/issues.json', 'r') as f:
    cache = json.load(f)
issues = [issue for issue in cache.values() if issue['state'] == 'OPEN']
print(json.dumps(issues, indent=2))
"
```
**Output**: Current open issues from local cache with metadata for scoring analysis

**Performance Benefit**: Instant local query instead of GitHub API call

### 3. Parse Issue Metadata and Calculate Scores

#### Metadata Extraction
From issue body text, extract:
- **Priority**: HIGH/MEDIUM/LOW (Priority Weight: HIGH=3, MEDIUM=2, LOW=1)
- **Effort**: S/M/L/XL (Effort Factor: S=1, M=2, L=3, XL=4)
- **Dependencies**: Blocks/Blocked by/Related (Impact Factor: blocks count + 1)
- **Work Area**: Epic/label context

#### Score Calculation
```
Score = (Priority Weight × Impact Factor × Readiness) / Effort Factor
Where Readiness = 1 if no blockers, 0.5 if partial, 0 if blocked
```

### 4. Apply Context Filters

#### Milestone Focus
- **Current Milestone**: Active milestone work takes priority
- **Template System**: Core TMPL and TPUB workflow development
- **Priority**: Complete milestone goals systematically

#### Label Consideration
- **Strategic Balance**: Balance milestone features with ongoing maintenance
- **Dependencies**: Consider blocking relationships in issue metadata
- **Project Focus**: Project-specific labels indicate local priority areas

#### Session Context
- **Available Time**: Match issue complexity to time available
- **Current Focus**: Consider context switch costs
- **Energy Level**: Match session type to current energy

### 5. Selection Criteria

#### High Priority (Work Immediately)
- HIGH priority + No blockers + Clear test criteria
- Blocks multiple other issues (high impact)
- Small effort with medium/high priority (quick wins)

#### Medium Priority (Good Options)
- MEDIUM priority + Dependencies satisfied
- Strategic value for template system
- Reasonable effort estimate with clear scope

#### Low Priority (Future Work)
- LOW priority + Nice to have features
- Large effort without clear dependencies
- Background improvements or optimizations

### 5. Recommendation List Generation

Present top-ranked issues (up to 6) with compact format:
- **Line 1**: #XX [Score] [Priority] Title
- **Line 2**: Metadata and rationale for selection
- **Spacing**: One empty line between issues

**Example Format:**
```
#60 [3.0] HIGH Create Comprehensive Workflow Development Guide
Critical template feature - enables extensibility, no blockers, high impact for adoption

#63 [2.0] MEDIUM Update user documentation to reflect current workflow patterns  
User experience improvement - clear scope, ready to start, documentation effort

#61 [1.33] MEDIUM Implement Happy Path + Deferred Exception Prototype
Large scope workflow - v1.2.0 feature, multiple components, significant implementation
```

### 6. Selection Decision

Document final choice:
- **Selected Issue**: Chosen from recommendation list
- **Selection Rationale**: Why this specific issue was chosen
- **Alternative Options**: Other viable choices from the list

## Decision Framework

### Quick Selection (< 2 minutes)
1. Run `gh issue list` command
2. Generate top 3 recommendations with scores
3. Select highest scoring available issue
4. Start work immediately

### Thoughtful Selection (5-10 minutes)
1. Run `gh issue list` command
2. Parse metadata from top 10 issues
3. Calculate scores using metadata formula
4. Present top 6 recommendations with rationale
5. Select from recommendation list
6. Document selection rationale

### Strategic Planning (15+ minutes)
1. Review all current milestone items
2. Analyze dependency chains and label balance
3. Select items that unblock future work
4. Consider project-specific strategic needs

## Integration Patterns

### Session Start Integration
```markdown
**SESSION_START** → **NEXT_ISSUE** → Begin work
```

### Mid-Session Transitions
```markdown
Complete current issue → **NEXT_ISSUE** → Continue with next item
```

### Epic Completion
```markdown
Finish epic phase → **NEXT_ISSUE** → Move to different epic for balance
```

## Automation Enhancements

### Current Automation
- Decision score calculation
- Epic and version assignment
- Session type classification
- Context switch cost assessment

### Future Enhancements
- Personal preference weighting
- Time-based filtering
- Dependency graph analysis
- Epic balance optimization

## Usage Examples

### Example 1: Planning Session Start
```bash
# Get current issues
gh issue list --limit 10 --json number,title,labels,body

# Parse metadata: Issue #63 shows Priority: HIGH, Effort: M, Dependencies: None
# Calculate score: (3 × 1 × 1) / 2 = 1.5
# Select #63 for strategic documentation foundation
# Document: "Selected for strategic foundation - enables template adoption"
```

### Example 2: Project-Specific Focus
```bash
# Review project-specific labeled issues
# Issue #60 shows Priority: MEDIUM, Effort: L, Blocks: 3 issues
# Calculate score: (2 × 4 × 1) / 3 = 2.67
# Select #60 for project enhancement
# Document: "High impact project work - enables multiple dependent issues"
```

### Example 3: Time-Constrained Session
```bash
# Only 30 minutes available
# Filter for Effort: S (small) issues
# Select highest-score small effort item
# Avoid Large/XL items that need longer focus periods
```

## Success Criteria

- Consistent progress across project areas
- Milestone features completed systematically
- Strategic foundation work completed early
- Dependencies resolved before dependent work
- Routine selections completed in under 2 minutes
- Clear selection rationale documented
- No analysis paralysis
- Smooth context transitions

## Usage Guidelines

Use when:
- Starting new session
- Completing current issue
- Needing direction on what to work on next
- Planning upcoming work priorities