[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# NEXT_ISSUE

## Overview
Automated workflow for selecting the next GitHub issue to work on, combining recommendation engine with contextual decision factors.

## Trigger
**User-Friendly**: `next sesame`
**Technical**: `NEXT_ISSUE`

## Workflow Steps

### 1. Execute Issue Recommendation Script
```bash

# Execute GitHub-based issue recommendation with scoring
claude/wow/scripts/issue-manage list

```

## Script Integration

The issue recommendation process delegates to `claude/wow/scripts/issue-manage list` which handles:
- GitHub issue fetching with body content for metadata parsing
- Priority/effort/dependency extraction from issue body text
- Score calculation using formula: `(Priority Weight × Impact Factor × Readiness) / Effort Factor`
- Top-ranked issue recommendations with rationale
- Milestone focus and context filtering

**Scoring Formula**: 
- Priority Weight: HIGH=3, MEDIUM=2, LOW=1
- Impact Factor: blocks count + 1  
- Readiness: 1 if no blockers, 0.5 if partial, 0 if blocked
- Effort Factor: S=1, M=2, L=3, XL=4

**Output**: Top 6 recommendations with scores, priorities, and selection rationale

---
*Intelligent issue selection through automated scoring and contextual analysis*