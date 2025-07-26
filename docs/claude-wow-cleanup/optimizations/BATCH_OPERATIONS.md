# Batch Operations Optimization

## Current Problems
- Individual audit log appends for each operation
- Sequential API calls for issue operations
- Multiple file I/O operations
- Excessive workflow overhead

## Optimization Patterns

### 1. Batch Audit Logging
```bash
# Current: Individual appends
audit_log "WORKFLOW" "step1" "context" "" "Step 1 complete"
audit_log "WORKFLOW" "step2" "context" "" "Step 2 complete"
audit_log "WORKFLOW" "step3" "context" "" "Step 3 complete"

# Optimized: Collect and batch
AUDIT_BATCH=()
AUDIT_BATCH+=("WORKFLOW|step1|context||Step 1 complete")
AUDIT_BATCH+=("WORKFLOW|step2|context||Step 2 complete")
AUDIT_BATCH+=("WORKFLOW|step3|context||Step 3 complete")

# Write once at completion
timestamp=$(date -u +%Y-%m-%dT%H:%M:%S)
for entry in "${AUDIT_BATCH[@]}"; do
    echo "${timestamp}|${entry}"
done >> claude/project/audit/current/current.log
```

### 2. Batch Issue Operations
```bash
# Current: Sequential operations
for issue in $ISSUES_TO_CLOSE; do
    update_cache $issue
    gh issue close $issue
done

# Optimized: Batch operations
# Collect all changes
CACHE_UPDATES=()
GITHUB_OPERATIONS=()

for issue in $ISSUES_TO_CLOSE; do
    CACHE_UPDATES+=("$issue:closed")
    GITHUB_OPERATIONS+=("close:$issue")
done

# Execute in batches
update_cache_batch "${CACHE_UPDATES[@]}"
execute_github_batch "${GITHUB_OPERATIONS[@]}"
```

### 3. Batch File Operations
```bash
# Current: Individual file creates
create_file "file1.md" "content1"
create_file "file2.md" "content2"
create_file "file3.md" "content3"

# Optimized: Batch creation
FILES=(
    "file1.md:content1"
    "file2.md:content2"
    "file3.md:content3"
)
create_files_batch "${FILES[@]}"
emit_event "files_created" "${#FILES[@]}"
```

## Implementation Strategy

1. **Identify Batch Opportunities**
   - Audit logging (always batch)
   - Issue operations (cache + GitHub)
   - File operations (creation/modification)
   - API calls (use bulk endpoints)

2. **Batch Boundaries**
   - Workflow completion
   - Logical operation groups
   - Error boundaries
   - Transaction semantics

3. **Error Handling**
   - Atomic batch operations
   - Rollback on failure
   - Partial success tracking

## Benefits
- 80% reduction in file I/O
- Improved performance
- Atomic operations
- Better error recovery