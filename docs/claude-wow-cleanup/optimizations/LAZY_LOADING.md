# Lazy Loading & Caching Optimization

## Current Problems
- SESSION_START loads everything upfront
- Full issue cache sync on every operation
- Mandatory rule scanning even when not needed
- Heavy initialization blocking work

## Optimization Patterns

### 1. Lazy Issue Cache
```bash
# Current: Always load full cache
load_issue_cache() {
    CACHE=$(cat claude/project/cache/issues.json)
    validate_cache
    sync_with_github
}

# Optimized: Load on demand
get_issue() {
    local issue_num=$1
    # Check memory cache first
    if [ -z "${ISSUE_CACHE[$issue_num]}" ]; then
        # Load single issue if needed
        ISSUE_CACHE[$issue_num]=$(load_single_issue $issue_num)
    fi
    echo "${ISSUE_CACHE[$issue_num]}"
}
```

### 2. Lazy Mandatory Rules
```bash
# Current: Scan all rules on SESSION_START
scan_mandatory_rules
validate_compliance
fix_violations

# Optimized: Check only when relevant
check_rule_if_needed() {
    local operation=$1
    # Only check rules relevant to operation
    case "$operation" in
        "file_create") check_file_rules ;;
        "commit") check_commit_rules ;;
        *) return 0 ;;
    esac
}
```

### 3. Incremental Cache Updates
```bash
# Current: Full cache rebuild
rebuild_entire_cache() {
    fetch_all_issues
    fetch_all_milestones
    write_cache
}

# Optimized: Incremental updates
update_cache_incremental() {
    local last_update=$(get_cache_timestamp)
    local changes=$(fetch_changes_since $last_update)
    apply_changes_to_cache $changes
    update_cache_timestamp
}
```

### 4. Memory-First Pattern
```bash
# Global caches (populated on demand)
declare -A ISSUE_CACHE
declare -A MILESTONE_CACHE
declare -A RULE_CACHE

# Check memory before disk
get_cached_value() {
    local cache_name=$1
    local key=$2
    
    # Memory first
    local cache_var="${cache_name}[$key]"
    if [ -n "${!cache_var}" ]; then
        echo "${!cache_var}"
        return 0
    fi
    
    # Then disk
    load_from_disk $cache_name $key
}
```

## Implementation Strategy

1. **Identify Heavy Operations**
   - Issue cache loading
   - Mandatory rule scanning
   - GitHub API calls
   - File system scans

2. **Add Caching Layers**
   - Memory cache (fastest)
   - Disk cache (persistent)
   - API cache (rate limit friendly)

3. **Lazy Loading Triggers**
   - First access
   - Explicit refresh
   - Event-driven updates

## Benefits
- SESSION_START from 10s to <1s
- Reduced API calls
- Lower memory footprint
- Faster workflow execution