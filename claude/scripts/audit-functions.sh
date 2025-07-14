#\!/bin/bash
# Audit logging functions using Node.js implementation

audit_log() {
    local workflow="$1"
    local step_type="$2"
    local context="$3"
    local file_path="$4"
    local description="$5"
    
    node claude/scripts/cli/audit-log.js "$workflow" "$step_type" "$context" "$file_path" "$description"
}

audit_log_bash() {
    local workflow="$1"
    local step_type="$2"
    local context="$3"
    local file_path="$4"
    local description="$5"
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%S)
    
    echo "${timestamp} < /dev/null | ${workflow}|${step_type}|${context}|${file_path}|${description}" >> claude/project/audit/current/current.log
}
