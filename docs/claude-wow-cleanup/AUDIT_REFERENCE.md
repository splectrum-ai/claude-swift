# Audit Logging Reference

## Overview
Reference guide for using the Node.js audit logging system with explicit logging patterns throughout workflows.

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

## Implementation in Workflows

### Standard Pattern
All workflows should load and use the standardized audit functions:

```bash
# Load audit functions at start of any workflow
source claude/wow/scripts/audit-functions.sh

# Use explicit logging throughout workflow
audit_log "WORKFLOW_NAME" "workflow_start" "context" "file_path" "Starting workflow description"
audit_log "WORKFLOW_NAME" "step" "operation" "file_path" "Step description"
audit_log "WORKFLOW_NAME" "workflow_complete" "context" "" "Workflow completed successfully"
```

### Integration Pattern
1. **Load functions**: `source claude/wow/scripts/audit-functions.sh`
2. **Log workflow start**: `audit_log "WORKFLOW" "workflow_start" ...`
3. **Log major steps**: `audit_log "WORKFLOW" "step" ...`
4. **Log completion**: `audit_log "WORKFLOW" "workflow_complete" ...`

### When to Add Audit Logging
- **Workflow boundaries**: Start and completion of workflows
- **Major steps**: Significant operations or state changes
- **File operations**: When creating, modifying, or deleting files
- **External API calls**: GitHub operations, system commands
- **Decision points**: When workflows make important choices
- **Error handling**: When catching and handling errors

## Log Format
Entries are automatically formatted as:
```
TIMESTAMP|WORKFLOW|STEP_TYPE|CONTEXT|FILE_PATH|DESCRIPTION
```

Example:
```
2025-07-15T04:32:26Z|SESSION_END|workflow_start|session_termination||Starting SESSION_END workflow
```

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

## JavaScript API

### Direct Node.js Usage
```javascript
import { auditLog, auditLogBatch, AuditCollector } from './claude/wow/scripts/lib/audit.js'

// Single entry
await auditLog('WORKFLOW', 'step', 'context', 'file.js', 'Description');

// Batch entries
const entries = [
  { workflow: 'TEST', stepType: 'step', context: 'batch1', filePath: '', description: 'First entry' },
  { workflow: 'TEST', stepType: 'step', context: 'batch2', filePath: '', description: 'Second entry' }
];
await auditLogBatch(entries);

// Collector pattern
const collector = new AuditCollector();
collector.add('WORKFLOW', 'step', 'context1', 'file1.js', 'Description 1');
collector.add('WORKFLOW', 'step', 'context2', 'file2.js', 'Description 2');
await collector.flush(); // Batch write all entries
```

### CLI Usage
```bash
# Direct CLI usage
node claude/wow/scripts/cli/audit-log.js "WORKFLOW" "step" "context" "file.js" "Description"

# Batch operations
node claude/wow/scripts/cli/batch-audit.js workflow_entries.json
```

## Best Practices

### Workflow Development
- Start every workflow with audit logging setup
- Log all major steps and decision points
- Include relevant file paths when operations affect files
- Use descriptive context names for categorization
- Always log workflow completion (success or failure)

### Error Handling
- Log errors with appropriate context
- Include error details in descriptions
- Use consistent error logging patterns
- Don't log sensitive information (passwords, tokens)

### Performance Considerations
- Use batch operations for multiple related entries
- Consider using AuditCollector for complex workflows
- Avoid excessive logging in tight loops
- Log significant events, not every minor operation

---

*Reference guide for developers implementing audit logging in workflows.*