# AUDIT_LOGGING

## Overview
Streamlined audit logging using proven Node.js implementation with explicit logging patterns throughout workflows.

## Implementation
**Use Node.js audit functions**: All workflows should load and use the standardized audit functions:

```bash
# Load audit functions at start of any workflow
source claude/wow/scripts/audit-functions.sh

# Use explicit logging throughout workflow
audit_log "WORKFLOW_NAME" "workflow_start" "context" "file_path" "Starting workflow description"
audit_log "WORKFLOW_NAME" "step" "operation" "file_path" "Step description"
audit_log "WORKFLOW_NAME" "workflow_complete" "context" "" "Workflow completed successfully"
```

## Audit Function Reference

### Basic Usage
```bash
audit_log workflow step_type context file_path description
```

### Parameters
- **workflow**: Workflow name (e.g., `COMMIT`, `SESSION_START`) 
- **step_type**: Activity type (`workflow_start`, `step`, `workflow_complete`, `item_complete`)
- **context**: Activity category or operation name
- **file_path**: Relevant file path (use `""` if none)
- **description**: Clear description of activity

### Batch Logging
```bash
# For multiple related operations
audit_log_batch "WORKFLOW_NAME" "batch_operation" "context" "" "Processed 5 tasks successfully"
```

## Log Format
Entries are automatically formatted as:
```
TIMESTAMP|WORKFLOW|STEP_TYPE|CONTEXT|FILE_PATH|DESCRIPTION
```

Example:
```
2025-07-15T04:32:26Z|SESSION_END|workflow_start|session_termination||Starting SESSION_END workflow
```

## Integration Pattern
1. **Load functions**: `source claude/wow/scripts/audit-functions.sh`
2. **Log workflow start**: `audit_log "WORKFLOW" "workflow_start" ...`
3. **Log major steps**: `audit_log "WORKFLOW" "step" ...`
4. **Log completion**: `audit_log "WORKFLOW" "workflow_complete" ...`

## Node.js Implementation
- **Location**: `claude/wow/scripts/lib/audit.js`
- **CLI Interface**: `claude/wow/scripts/cli/audit-log.js`
- **Bash Wrapper**: `claude/wow/scripts/audit-functions.sh`
- **Benefits**: Batch operations, error handling, consistent formatting

## Configuration System
The audit logging system uses a configuration-based approach for cross-repository compatibility:

### Configuration Files (Priority Order)
1. **Local Config** (preferred): `claude/local/audit-config.json` - Machine-specific, gitignored
2. **Project Config** (fallback): `claude/project/audit-config.json` - Shared configuration

### Automatic Configuration
- **SESSION_START**: Automatically creates local config with absolute paths
- **PROJECT_REGISTER**: Sets up local config directory for subprojects
- **Path Resolution**: Scripts automatically find correct audit log location

### Configuration Format
```json
{
  "auditLogPath": "/absolute/path/to/claude/project/audit/current/current.log",
  "auditLogDirectory": "/absolute/path/to/claude/project/audit/current",
  "projectRoot": "/absolute/path/to/repository",
  "scriptsPath": "/absolute/path/to/claude/wow/scripts",
  "configVersion": "1.0.0",
  "generatedBy": "SESSION_START",
  "lastUpdated": "2025-07-16T07:18:00Z"
}
```

This ensures audit logging works reliably across different repository structures without committing machine-specific paths.

---

*Simplified audit logging focused on proven implementation patterns.*