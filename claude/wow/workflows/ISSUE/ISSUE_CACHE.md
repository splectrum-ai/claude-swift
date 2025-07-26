[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# ISSUE_CACHE Workflow

## Overview
Local cache management for GitHub issues and milestones to improve performance and reduce API calls. Maintains synchronized cache of issue metadata for efficient workflow operations.

## Trigger
**User-Friendly**: `issue sesame`
**Technical**: `ISSUE_CACHE`
**SESSION_START Integration**: Automatically called during session start for cache validation

## Workflow Steps

### 1. Execute Issue Cache Synchronization Script
```bash
claude/wow/scripts/audit-log "ISSUE_CACHE" "workflow_start" "cache_synchronization" "" "Starting ISSUE_CACHE workflow"

# Execute simple GitHub-only cache synchronization
claude/wow/scripts/issue-cache-sync

claude/wow/scripts/audit-log "ISSUE_CACHE" "workflow_complete" "cache_synchronization" "" "Issue cache synchronization completed successfully"
```

## Script Integration

The issue cache process delegates to `claude/wow/scripts/issue-cache-sync` which handles:
- GitHub API issue and milestone fetching using existing `gh-issue` and `gh-api` scripts
- Simple cache directory creation and JSON file management
- Cache file updates with timestamps and metadata
- Performance optimization through local storage of GitHub data

**Cache Structure**: Creates `claude/cache/` with `issues.json`, `milestones.json`, and `metadata.json`

**Design**: Simple GitHub-only implementation without complex sync/gap detection logic

---
*Performance-optimized issue management through simple local caching*