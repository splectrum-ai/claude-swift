[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# ISSUE_CACHE Workflow

## Overview
Local cache management for GitHub issues and milestones to improve performance and reduce API calls. Maintains synchronized cache of issue metadata for efficient workflow operations.

## Trigger
**User-Friendly**: `issue sesame`
**Technical**: `ISSUE_CACHE`
**SESSION_START Integration**: Automatically called during session start for cache validation

## Purpose
- Cache GitHub issues and milestones locally for performance
- Reduce GitHub API calls during issue management workflows
- Maintain synchronized cache with automatic gap detection
- Provide fast access to issue metadata for workflow operations

## Cache Structure

### Directory Layout
```
claude/project/cache/
├── issues.json          # Cached issue data
├── milestones.json      # Cached milestone data
└── metadata.json        # Cache metadata and sync timestamps
```

### Cache Format
**issues.json**:
```json
{
  "49": {
    "number": 49,
    "title": "Identify workflows that reference the orchestrator and move to project area",
    "state": "open",
    "labels": ["enhancement", "v1.1.0"],
    "milestone": null,
    "created_at": "2025-07-14T13:39:27Z",
    "updated_at": "2025-07-14T13:39:27Z",
    "cached_at": "2025-07-14T21:27:43Z"
  }
}
```

**milestones.json**:
```json
{
  "4": {
    "number": 4,
    "title": "Claude Swift as root, with sub project work bench",
    "state": "open",
    "description": "Transform claude-swift into a root workspace framework...",
    "created_at": "2025-07-13T14:20:00Z",
    "cached_at": "2025-07-14T21:27:43Z"
  }
}
```

**metadata.json**:
```json
{
  "last_sync": "2025-07-14T21:27:43Z",
  "cache_version": "1.0.0",
  "last_issue_number": 50,
  "last_milestone_number": 4
}
```

## Update Strategy

### Cache-First Approach
**Write-Through Pattern**: Cache is always updated first, then synchronized to GitHub
1. **Local Updates**: Modify cache immediately for instant access
2. **Remote Sync**: Push changes to GitHub API
3. **Failure Handling**: Track sync failures and retry logic
4. **Consistency**: Cache remains authoritative source

### New Issue Creation Flow
1. **Create GitHub Issue**: Use GitHub API to create issue
2. **Trigger Gap Detection**: Run cache update to capture new issue
3. **Auto-Synchronization**: New issue automatically cached

## Workflow Steps

### 1. Initialize Audit Logging
```bash
# Load Node.js audit functions
source claude/wow/scripts/audit-functions.sh

# Start issue cache workflow
audit_log "ISSUE_CACHE" "workflow_start" "cache_synchronization" "" "Starting ISSUE_CACHE workflow for cache management"
```

### 2. Cache Initialization
```bash
audit_log "ISSUE_CACHE" "step" "cache_init" "" "Initializing cache directory and metadata"
```

**Actions:**
1. Create cache directory if missing: `mkdir -p claude/project/cache`
2. Initialize metadata.json with default values
3. Log cache initialization

### 3. Gap Detection
```bash
audit_log "ISSUE_CACHE" "step" "gap_detection" "" "Checking for missing issues/milestones in cache"
```

**Gap Detection Logic:**
```bash
# Get highest cached issue number
LAST_CACHED_ISSUE=$(jq -r 'keys | map(tonumber) | max // 0' claude/project/cache/issues.json 2>/dev/null || echo "0")

# Get highest GitHub issue number
LATEST_GITHUB_ISSUE=$(gh issue list --state all --limit 1 --json number --jq '.[0].number // 0')

# Calculate gap
if [ "$LATEST_GITHUB_ISSUE" -gt "$LAST_CACHED_ISSUE" ]; then
    echo "Gap detected: Issues $((LAST_CACHED_ISSUE + 1)) to $LATEST_GITHUB_ISSUE need caching"
    CACHE_NEEDED=true
else
    echo "Cache up to date: No gaps detected"
    CACHE_NEEDED=false
fi
```

### 4. Issue Population
```bash
audit_log "ISSUE_CACHE" "step" "issue_population" "" "Caching missing open issues from GitHub"
```

**Population Process:**
```bash
if [ "$CACHE_NEEDED" = "true" ]; then
    echo "Caching missing issues..."
    
    # Get all open issues from GitHub
    gh issue list --state open --limit 100 --json number,title,state,labels,milestone,createdAt,updatedAt > temp_issues.json
    
    # Get current cache or create empty
    CURRENT_CACHE=$(cat claude/project/cache/issues.json 2>/dev/null || echo "{}")
    
    # Merge new issues with existing cache
    jq --argjson current "$CURRENT_CACHE" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
        reduce .[] as $issue (
            $current; 
            .[$issue.number | tostring] = ($issue + {cached_at: $timestamp})
        )
    ' temp_issues.json > claude/project/cache/issues.json
    
    rm temp_issues.json
    echo "✓ Issues cached successfully"
fi
```

### 5. Milestone Population
```bash
audit_log "ISSUE_CACHE" "step" "milestone_population" "" "Caching milestone data from GitHub"
```

**Milestone Caching:**
```bash
# Get all milestones from GitHub
gh api repos/:owner/:repo/milestones --jq '.[]' > temp_milestones.json

# Get current cache or create empty
CURRENT_MILESTONE_CACHE=$(cat claude/project/cache/milestones.json 2>/dev/null || echo "{}")

# Merge milestones with existing cache
jq --argjson current "$CURRENT_MILESTONE_CACHE" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
    reduce .[] as $milestone (
        $current; 
        .[$milestone.number | tostring] = ($milestone + {cached_at: $timestamp})
    )
' temp_milestones.json > claude/project/cache/milestones.json

rm temp_milestones.json
echo "✓ Milestones cached successfully"
```

### 5. Cache Cleanup
```
ISSUE_CACHE|step|cache_cleanup||Remove closed issues/milestones from cache
```

**Cleanup Process:**
```bash
# Remove closed issues from cache
jq 'with_entries(select(.value.state == "open"))' claude/project/cache/issues.json > temp_issues_clean.json
mv temp_issues_clean.json claude/project/cache/issues.json

# Remove closed milestones from cache
jq 'with_entries(select(.value.state == "open"))' claude/project/cache/milestones.json > temp_milestones_clean.json
mv temp_milestones_clean.json claude/project/cache/milestones.json

echo "✓ Cache cleanup completed"
```

### 6. Issue Update Detection
```
ISSUE_CACHE|step|update_detection||Detect and sync changed issues
```

**Change Detection Logic:**
```bash
# Check for updated issues since last sync
LAST_SYNC=$(jq -r '.last_sync' claude/project/cache/metadata.json)

# Get issues updated since last sync
UPDATED_ISSUES=$(gh issue list --state all --search "updated:>$LAST_SYNC" --json number,updatedAt)

if [ "$(echo "$UPDATED_ISSUES" | jq 'length')" -gt 0 ]; then
    echo "Detected $(echo "$UPDATED_ISSUES" | jq 'length') updated issues"
    
    # Update each changed issue in cache
    echo "$UPDATED_ISSUES" | jq -r '.[].number' | while read issue_num; do
        echo "Updating issue #$issue_num in cache"
        
        # Get latest issue data from GitHub
        ISSUE_DATA=$(gh issue view "$issue_num" --json number,title,state,labels,milestone,createdAt,updatedAt)
        
        # Update cache with new data
        jq --argjson issue_data "$ISSUE_DATA" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
           '.[$issue_data.number | tostring] = ($issue_data + {cached_at: $timestamp})' \
           claude/project/cache/issues.json > temp_cache.json
        mv temp_cache.json claude/project/cache/issues.json
    done
fi
```

### 7. Cache Update Functions
```
ISSUE_CACHE|step|cache_functions||Implement cache update and sync functions
```

**Update Issue in Cache:**
```bash
update_cached_issue() {
    local issue_num=$1
    local field=$2
    local value=$3
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    # Update cache first (cache-first approach)
    python3 -c "
import json, sys

# Load current cache
with open('claude/project/cache/issues.json', 'r') as f:
    cache = json.load(f)

# Update the field
if '$issue_num' in cache:
    cache['$issue_num']['$field'] = '$value'
    cache['$issue_num']['cached_at'] = '$timestamp'
    cache['$issue_num']['needs_sync'] = True
    
    # Write updated cache
    with open('claude/project/cache/issues.json', 'w') as f:
        json.dump(cache, f, indent=2)
    
    print(f'✓ Updated issue #$issue_num field $field in cache')
else:
    print(f'✗ Issue #$issue_num not found in cache')
"
}
```

**Sync Cache to GitHub:**
```bash
sync_to_github() {
    local issue_num=$1
    
    # Get cached issue data
    CACHED_ISSUE=$(jq --arg num "$issue_num" '.[$num]' claude/project/cache/issues.json)
    
    if [ "$CACHED_ISSUE" != "null" ]; then
        # Check if sync needed
        NEEDS_SYNC=$(echo "$CACHED_ISSUE" | jq -r '.needs_sync // false')
        
        if [ "$NEEDS_SYNC" = "true" ]; then
            echo "Syncing issue #$issue_num to GitHub..."
            
            # Extract fields for GitHub update
            TITLE=$(echo "$CACHED_ISSUE" | jq -r '.title')
            LABELS=$(echo "$CACHED_ISSUE" | jq -r '.labels[].name' | tr '\n' ',' | sed 's/,$//')
            
            # Update GitHub issue
            if gh issue edit "$issue_num" --title "$TITLE" --add-label "$LABELS"; then
                # Mark as synced in cache
                jq --arg num "$issue_num" 'del(.[$num].needs_sync)' \
                   claude/project/cache/issues.json > temp_cache.json
                mv temp_cache.json claude/project/cache/issues.json
                
                echo "✓ Issue #$issue_num synced to GitHub"
            else
                echo "✗ Failed to sync issue #$issue_num to GitHub"
            fi
        fi
    fi
}
```

### 8. New Issue Creation
```
ISSUE_CACHE|step|new_issue_creation||Create new issue and update cache
```

**Create Issue Flow:**
```bash
create_new_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo "Creating new issue: $title"
    
    # Create issue in GitHub first
    NEW_ISSUE_URL=$(gh issue create --title "$title" --body "$body" --label "$labels")
    NEW_ISSUE_NUM=$(echo "$NEW_ISSUE_URL" | grep -o '[0-9]*$')
    
    if [ -n "$NEW_ISSUE_NUM" ]; then
        echo "✓ Created GitHub issue #$NEW_ISSUE_NUM"
        
        # Trigger gap detection to capture new issue
        echo "Running gap detection to cache new issue..."
        LATEST_GITHUB_ISSUE=$(gh issue list --state all --limit 1 --json number --jq '.[0].number // 0')
        
        # Get new issue data and add to cache
        NEW_ISSUE_DATA=$(gh issue view "$NEW_ISSUE_NUM" --json number,title,state,labels,milestone,createdAt,updatedAt)
        TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
        
        # Add to cache
        jq --argjson new_issue "$NEW_ISSUE_DATA" --arg timestamp "$TIMESTAMP" \
           '.[$new_issue.number | tostring] = ($new_issue + {cached_at: $timestamp})' \
           claude/project/cache/issues.json > temp_cache.json
        mv temp_cache.json claude/project/cache/issues.json
        
        echo "✓ Issue #$NEW_ISSUE_NUM cached locally"
        return 0
    else
        echo "✗ Failed to create GitHub issue"
        return 1
    fi
}
```

### 9. Metadata Update
```
ISSUE_CACHE|step|metadata_update||Update cache metadata and sync timestamp
```

**Metadata Update:**
```bash
# Update metadata with sync timestamp
jq --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
   --argjson last_issue "$LATEST_GITHUB_ISSUE" \
   --argjson last_milestone "$(jq 'keys | map(tonumber) | max // 0' claude/project/cache/milestones.json)" \
   '{
     last_sync: $timestamp,
     cache_version: "1.0.0",
     last_issue_number: $last_issue,
     last_milestone_number: $last_milestone
   }' > claude/project/cache/metadata.json

echo "✓ Metadata updated"
```

## Integration Points

### SESSION_START Integration
```
SESSION_START|step|issue_cache_validation||Validate and update issue cache
```

**Session Start Integration:**
1. Check cache existence and validity
2. Perform gap detection automatically
3. Update cache if gaps detected
4. Log cache status in audit log

### Issue Creation Integration
**Cache-First New Issue Flow:**
```bash
# Method 1: Direct creation with auto-caching
create_new_issue "Issue Title" "Issue body content" "enhancement,v1.1.0"

# Method 2: GitHub creation + gap detection
gh issue create --title "New Issue" --body "Description" --label "enhancement"
`issue sesame`  # Triggers gap detection to cache new issue
```

### Issue Update Integration
**Cache-First Update Pattern:**
```bash
# Update issue metadata in cache first
update_cached_issue 50 "title" "Updated Issue Title"
update_cached_issue 50 "priority" "HIGH"

# Sync changes to GitHub
sync_to_github 50
```

### Issue Closure Integration
**Automatic Cache Cleanup:**
```bash
# When closing issues, cache cleanup happens automatically
gh issue close 50 -c "Completed"
`issue sesame`  # Cleanup removes closed issues from cache
```

### Workflow Integration Examples
**NEXT_ISSUE with Cache:**
```bash
# Fast local issue queries instead of GitHub API
get_cached_issue() {
    local issue_num=$1
    jq -r --arg num "$issue_num" '.[$num] // empty' claude/project/cache/issues.json
}

# Get issues by label without API calls
get_issues_by_label() {
    local label=$1
    jq -r --arg label "$label" '.[] | select(.labels[].name == $label)' claude/project/cache/issues.json
}
```

## Cache Utilities

### Cache Query Functions
```bash
# Get cached issue by number
get_cached_issue() {
    local issue_num=$1
    jq -r --arg num "$issue_num" '.[$num] // empty' claude/project/cache/issues.json
}

# Get all cached issues with label
get_issues_by_label() {
    local label=$1
    jq -r --arg label "$label" '.[] | select(.labels[] == $label)' claude/project/cache/issues.json
}

# Get issues by milestone
get_issues_by_milestone() {
    local milestone=$1
    jq -r --arg milestone "$milestone" '.[] | select(.milestone.title == $milestone)' claude/project/cache/issues.json
}
```

### Cache Validation
```bash
# Validate cache integrity
validate_cache() {
    if [ ! -f claude/project/cache/issues.json ]; then
        echo "Cache missing - running full cache rebuild"
        return 1
    fi
    
    if [ ! -f claude/project/cache/metadata.json ]; then
        echo "Metadata missing - cache rebuild required"
        return 1
    fi
    
    return 0
}
```

## Performance Benefits

### Before Cache
- Every issue query hits GitHub API
- Network latency for each operation
- API rate limits affect workflow speed
- No offline issue information access

### After Cache
- Local issue queries (instantaneous)
- Reduced GitHub API calls by ~80%
- Faster workflow execution
- Offline issue information available
- Batch updates during cache sync

## Error Handling

### Cache Corruption
```bash
# Detect and recover from cache corruption
if ! jq empty claude/project/cache/issues.json 2>/dev/null; then
    echo "Cache corruption detected - rebuilding from GitHub"
    rm claude/project/cache/issues.json
    # Trigger full cache rebuild
fi
```

### GitHub API Failures
```bash
# Handle GitHub API rate limiting
if ! gh issue list --state open --limit 1 &>/dev/null; then
    echo "GitHub API unavailable - using cached data"
    echo "Warning: Cache may not reflect latest changes"
fi
```

### Missing Cache Directory
```bash
# Auto-create cache directory if missing
if [ ! -d claude/project/cache ]; then
    mkdir -p claude/project/cache
    echo "Created missing cache directory"
fi

# Workflow completion logging
audit_log "ISSUE_CACHE" "workflow_complete" "cache_synchronization" "" "ISSUE_CACHE workflow completed - cache synchronized with $new_issues new issues and $updated_issues updated issues"
```

## Success Criteria
- Local cache contains all open issues and milestones
- Cache automatically detects and fills gaps
- Closed issues/milestones removed from cache
- SESSION_START integration working
- Performance improvement measurable
- Cache survives session boundaries
- Manual `issue sesame` trigger working

## Future Enhancements
- **Incremental Sync**: Only sync changed issues
- **Cache Compression**: Reduce cache file size
- **Multi-Repository**: Cache for multiple repositories
- **Search Index**: Fast text search within cached issues
- **Conflict Resolution**: Handle concurrent cache updates

---

*Performance-optimized issue management through intelligent local caching with automatic synchronization and gap detection.*