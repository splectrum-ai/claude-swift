# Local Issues Structure

## Overview

Local file-based issue management system synchronized with GitHub issues.

## Directory Structure

```
claude/issues/
├── sync.json          # Synchronization metadata
├── templates/         # Issue templates
│   ├── bug.md
│   ├── feature.md
│   └── task.md
├── unassigned/       # Issues without milestone
├── v1.2.0/          # Version milestone folders
│   └── closed/      # Archived closed issues
└── [milestone]/     # Other milestone folders
```

## Issue Format

```markdown
---
type: feature|bug|task
github_id: 123
title: "Issue Title"
state: "open|closed"
milestone: "v1.2.0"
labels: "[]"
priority: low|medium|high|critical
estimated_effort: S|M|L|XL
github_updated_at: "2025-07-27T10:00:00Z"
local_updated_at: "2025-07-27T15:00:00Z"
---

# Issue Title

## Description
Issue content...
```

## Management Commands

### Script: `issue-manage`

```bash
issue-manage create <type> <title>    # Create new issue
issue-manage list [location]          # List issues
issue-manage show <id>                # Show issue details
issue-manage close <id>               # Close issue
issue-manage triage                   # Review unassigned
issue-manage housekeeping             # Clean closed milestones
issue-manage seed                     # Import from GitHub
issue-manage sync                     # Bidirectional sync
```

### Auto-Initialization

The `issue-manage` script automatically initializes the issues structure on first use:
- Checks `claude/local/repo-config.json` for `issues_seeded` flag
- If not seeded, automatically runs structure initialization
- Creates templates, directories, and sync metadata
- Syncs templates from framework (preserves custom templates)
- Updates configuration to mark as initialized

This ensures issues management works seamlessly without manual setup.

## Synchronization

### `sync` Command
- Pulls updates from GitHub
- Pushes local changes to GitHub
- Updates timestamps after sync
- Tracks sync status in `sync.json`

### Sync Metadata
```json
{
  "last_sync": "2025-07-27T15:55:11.969Z",
  "last_github_fetch": "2025-07-27T15:55:11.969Z",
  "total_issues": 10,
  "sync_version": "2.0.0",
  "bidirectional_sync": true,
  "pulled_from_github": 0,
  "pushed_to_github": 10,
  "conflicts": 0
}
```