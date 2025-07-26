# Original WoW System Configuration Documentation

This file contains the detailed configuration documentation that was previously in `claude/wow/config.md` before simplification.

## Complete Directory Structure

### **Audit System** (Full Specification)
- **AUDIT_BASE_PATH**: `claude/project/audit`
- **CURRENT_AUDIT_PATH**: `claude/project/audit/current`
- **VERSION_AUDIT_PATTERN**: `claude/project/audit/v{version}`
- **CONSOLIDATED_LOG_PATTERN**: `audit_v{version}.log`
- **CURRENT_LOG_FILE**: `current.log`
- **SESSION_LOG_PATTERN**: `session_{timestamp}.log`

### **Documentation Paths**
- **PROJECT_DOCS_PATH**: `claude/project/docs`
- **PROJECT_WORKFLOWS_PATH**: `claude/project/workflows`
- **WOW_WORKFLOWS_PATH**: `claude/wow/workflows`
- **USER_DOCS_PATH**: `docs`

### **Configuration Files** (Complete Set)
- **PROJECT_INFO**: `claude/project/project-info.md`
- **VERSION_CONFIG**: `claude/project/version-config.md`
- **PROJECT_KEYWORDS**: `claude/project/KEYWORD_REGISTRY.md`
- **WOW_KEYWORDS**: `claude/wow/KEYWORD_REGISTRY.md`
- **PROJECT_TODO**: `claude/project/todo.md`

### **Template Structure**
- **TEMPLATE_BASE_PATH**: `template`
- **TEMPLATE_CLAUDE_PATH**: `template/claude`
- **TEMPLATE_DOCS_PATH**: `template/docs`

## Detailed System Configuration

### **Audit Log Format** (Full Specification)
- **FORMAT**: `TIMESTAMP|WORKFLOW|STEP_TYPE|CONTEXT|FILE_PATH|DESCRIPTION`
- **TIMESTAMP_FORMAT**: ISO 8601 with Z suffix (e.g., `2025-06-26T10:16:22Z`)
- **FIELD_SEPARATOR**: `|` (pipe character)
- **EMPTY_FIELD**: `||` (double pipe for empty values)
- **APPEND_MARKER**: `##APPEND_MARKER_UNIQUE##`

### **Version Management** (Complete)
- **VERSION_PATTERN**: `semantic (major.minor.patch)`
- **ARCHIVE_PATTERN**: `v{major}.{minor}.{patch}`
- **RELEASE_ARTIFACT_PATTERN**: `{project-name}-v{version}-RELEASE-NOTES.md`

### **Branch Management** (Legacy)
- **DEFAULT_BRANCH**: `unplanned` (Note: Now uses main-only workflow)
- **INTEGRATION_BRANCH**: `main`
- **ISSUE_BRANCH_PATTERN**: `feature/issue-{number}` or `bugfix/issue-{number}`

## Automation Configuration (Historical)

### **Script Locations** (Pre-Consolidation)
- **AUTOMATION_SCRIPTS**: `claude/wow/automation/` (Now: `claude/wow/scripts`)
- **PROJECT_SCRIPTS**: `claude/project/scripts/` (if needed)

### **Report Output Locations**
- **OPERATIONAL_REPORTS**: `claude/project/docs/`
- **USER_FACING_REPORTS**: `docs/reports/`
- **STRATEGIC_ANALYSIS**: `claude/project/docs/`

### **Tool Requirements**
- **GIT_REQUIRED**: `true`
- **GITHUB_CLI_REQUIRED**: `true` 
- **NODE_MIN_VERSION**: `14.0.0`
- **SHELL_ENVIRONMENT**: `bash-compatible`

## Integration Points

### **External Dependencies**
- **CLAUDE_CODE_CLI**: Required runtime environment
- **GITHUB_REPOSITORY**: Required for issue tracking and release management
- **FILE_SYSTEM**: Cross-platform compatibility (Windows/WSL, macOS, Linux)

### **Template Deployment**
- **DEPLOYMENT_PATTERN**: `sidecar` (adjacent to target projects)
- **CONTENT_SEPARATION**: Project docs (tracked) vs WoW machinery (configurable)
- **ROLLBACK_MECHANISM**: CLAUDE.md replacement + session restart

---

*Historical configuration documentation preserved from original claude/wow/config.md*