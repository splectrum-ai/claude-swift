# Audit Logging

## Overview

Audit logging tracks workflow execution and significant events for operational transparency.

## Implementation

### Script: `audit-manage`

Central audit management script providing:
- `log` - Write audit entries
- `archive-session` - Archive session logs
- `archive-version` - Archive version release logs
- `fresh-log` - Create new log with append marker
- `cleanup` - Remove old archived logs
- `metrics` - Analyze audit patterns

### Usage

```bash
./claude/wow/scripts/audit-manage log <workflow> <action> <step> <details> <description>
```

### Log Format

Pipe-delimited format:
```
timestamp|workflow|action|step|details|description
```

Actions:
- `workflow_start` - Workflow initiation
- `step` - Individual workflow step
- `workflow_complete` - Successful completion
- `workflow_error` - Error condition

### Storage

- **Current**: `claude/project/audit/current/current.log`
- **Archived Sessions**: `claude/project/audit/current/session_*.log`
- **Version Archives**: `claude/project/audit/v*/`

### Append Marker

Fresh logs start with `##APPEND_MARKER_UNIQUE##` to ensure proper concatenation.