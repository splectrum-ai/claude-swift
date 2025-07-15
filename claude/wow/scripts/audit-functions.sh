#\!/bin/bash
# Audit logging functions using Node.js implementation

audit_log() {
    local workflow="$1"
    local step_type="$2"
    local context="$3"
    local file_path="$4"
    local description="$5"
    
    # Find the audit script location
    local script_path=""
    local current_dir="$(pwd)"
    
    # Try to find claude/wow/scripts from current directory
    while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/claude/wow/scripts/cli/audit-log.js" ]]; then
            script_path="$current_dir/claude/wow/scripts/cli/audit-log.js"
            break
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Fallback: try reading config for scripts path
    if [[ -z "$script_path" ]]; then
        current_dir="$(pwd)"
        while [[ "$current_dir" != "/" ]]; do
            if [[ -f "$current_dir/claude/project/audit-config.json" ]]; then
                local config_scripts_path=$(grep '"scriptsPath"' "$current_dir/claude/project/audit-config.json" | sed 's/.*"scriptsPath": *"\([^"]*\)".*/\1/')
                if [[ -f "$config_scripts_path/cli/audit-log.js" ]]; then
                    script_path="$config_scripts_path/cli/audit-log.js"
                    break
                fi
            fi
            current_dir="$(dirname "$current_dir")"
        done
    fi
    
    # Execute the audit script
    if [[ -n "$script_path" ]]; then
        node "$script_path" "$workflow" "$step_type" "$context" "$file_path" "$description"
    else
        echo "Error: Could not find audit-log.js script" >&2
        return 1
    fi
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
