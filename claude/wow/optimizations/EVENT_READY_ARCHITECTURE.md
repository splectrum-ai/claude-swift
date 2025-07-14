# Event-Ready Architecture Optimization

## Vision
Transform workflows into event-emitting tools ready for choreography while maintaining backward compatibility.

## Event Design Patterns

### 1. Standardized Event Format
```bash
# Event structure
emit_event() {
    local event_type=$1
    local operation=$2
    local context=$3
    local payload=$4
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
    
    # Dual-mode: Log for now, emit later
    echo "${timestamp}|EVENT|${event_type}|${operation}|${context}|${payload}" >> claude/project/events/event.log
    
    # Future: Publish to event bus
    # publish_to_bus "$event_type" "$payload"
}
```

### 2. Tool Decomposition
```bash
# Current: Monolithic workflow
COMMIT_WORKFLOW() {
    validate_changes
    stage_files
    create_commit
    detect_issues
    close_issues
}

# Future: Decomposed tools
commit_tools/
├── validate_changes.sh    # Emits: changes_validated
├── stage_files.sh         # Emits: files_staged
├── create_commit.sh       # Emits: commit_created
├── detect_issues.sh       # Emits: issues_detected
└── close_issues.sh        # Emits: issues_closed
```

### 3. Event Choreography Ready
```yaml
# Future choreography definition
choreography:
  name: commit_flow
  triggers:
    - event: changes_detected
  
  flow:
    - on: changes_detected
      emit: validation_requested
    
    - on: changes_validated
      emit: staging_requested
    
    - on: files_staged
      emit: commit_requested
    
    - on: commit_created
      parallel:
        - emit: issue_detection_requested
        - emit: audit_log_requested
    
    - on: issues_detected
      emit: issue_closure_requested
```

### 4. Dual-Mode Execution
```bash
# Tool with dual-mode support
stage_files_tool() {
    local mode=${MODE:-interactive}
    local files=("$@")
    
    # Pre-conditions
    validate_git_state || emit_event "error" "git_state_invalid"
    
    # Operation
    if [ "$mode" = "interactive" ]; then
        echo "Staging ${#files[@]} files..."
        show_file_list "${files[@]}"
    fi
    
    git add "${files[@]}"
    
    # Post-conditions & Events
    emit_event "files_staged" "stage_files" "" "${#files[@]} files"
    
    # Return state for choreography
    echo "{"
    echo "  \"status\": \"success\","
    echo "  \"files_count\": ${#files[@]},"
    echo "  \"next_events\": [\"commit_requested\"]"
    echo "}"
}
```

## Implementation Roadmap

### Phase 1: Event Instrumentation
- Add emit_event to existing workflows
- Create event log infrastructure
- Maintain backward compatibility

### Phase 2: Tool Extraction
- Extract discrete operations from workflows
- Standardize input/output contracts
- Create tool registry

### Phase 3: Choreography Layer
- Implement event bus
- Create choreography engine
- Define flow definitions

### Phase 4: Full Migration
- Replace workflows with choreographed tools
- Enable distributed execution
- Add monitoring and observability

## Benefits
- Gradual migration path
- No breaking changes
- Ready for automation
- Enables distributed execution
- Better observability