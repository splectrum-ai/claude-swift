# NEXT_ISSUE

## Overview
Automated workflow for selecting the next GitHub issue to work on, combining recommendation engine with contextual decision factors.

## Workflow Steps

### 1. Get Issue List and Metadata
```bash
gh issue list --limit 10 --json number,title,labels,body
```
**Output**: Current issues with embedded metadata for scoring analysis

### 2. Parse Issue Metadata and Calculate Scores

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

### 3. Apply Context Filters

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

### 4. Selection Criteria

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

### 5. Decision Documentation

When selecting an issue, document:
- **Issue Number**: `#XX`
- **Epic**: Which epic it belongs to
- **Rationale**: Why this issue was selected
- **Context**: Current focus and decision factors

## Decision Framework

### Quick Selection (< 2 minutes)
1. Run `gh issue list` command
2. Find first HIGH priority issue with no blockers
3. Start work immediately

### Thoughtful Selection (5-10 minutes)
1. Run `gh issue list` command
2. Parse metadata from top 10 issues
3. Calculate scores using metadata formula
4. Select highest scoring available issue
5. Document selection rationale

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

# Parse metadata: Issue #32 shows Priority: HIGH, Effort: M, Dependencies: None
# Calculate score: (3 × 1 × 1) / 2 = 1.5
# Select #32 for strategic documentation foundation
# Document: "Selected for strategic foundation - enables template adoption"
```

### Example 2: Project-Specific Focus
```bash
# Review project-specific labeled issues
# Issue #5 shows Priority: MEDIUM, Effort: L, Blocks: 3 issues
# Calculate score: (2 × 4 × 1) / 3 = 2.67
# Select #5 for project enhancement
# Document: "High impact project work - enables multiple dependent issues"
```

### Example 3: Time-Constrained Session
```bash
# Only 30 minutes available
# Filter for Effort: S (small) issues
# Select highest-score small effort item
# Avoid Large/XL items that need longer focus periods
```

## Success Metrics

### Effective Selection
- Consistent progress across project areas
- Milestone features completed systematically
- Strategic foundation work completed early
- Dependencies resolved before dependent work

### Workflow Efficiency
- < 2 minutes for routine selections
- Clear selection rationale documented
- No analysis paralysis
- Smooth context transitions

## Trigger Pattern

```markdown
**NEXT_ISSUE** → See [workflows/NEXT_ISSUE.md](./workflows/NEXT_ISSUE.md)
```

Use when:
- Starting new session
- Completing current issue
- Needing direction on what to work on next
- Planning upcoming work priorities