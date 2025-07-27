# Session Management

## Overview

Sessions provide structured start/end boundaries for work periods with automatic task distribution and cleanup.

## Session Start

The `start sesame` command executes:

1. **Audit Logging** - Records session start timestamp
2. **Session Recovery** - Checks for incomplete previous sessions
3. **OUTBOX Processing** - Distributes pending cross-repository tasks (if registered projects exist)
4. **INBOX Processing** - Converts received tasks to GitHub issues
5. **Issue Triage** - Reviews unassigned issues

## Session End

The `finish sesame` command handles:

1. **Session Archival** - Archives current audit log with timestamp
2. **Fresh Log Creation** - Creates new audit log with append marker
3. **Work Summary** - Reports session accomplishments

## Audit Log Structure

Location: `claude/project/audit/current/current.log`

Format: `timestamp|workflow|action|step|details|description`

Example:
```
2025-07-27 15:41:34|SESSION_START|workflow_start|||Starting new session
2025-07-27 15:45:44|SESSION_START|workflow_complete|||Session start workflow completed successfully
```

Archived logs: `claude/project/audit/current/session_YYYY-MM-DDTHH-MM-SSZ.log`