# CLAUDE_COLLABORATIVE_DEBUGGING.md

How dual-mode execution enables powerful collaborative debugging and system understanding.

## The Power of Same Logic, Different Modes

### Production Mode (Automated)
```yaml
event: issue_created
choreography:
  - cache_update → github_sync → notification
execution: 50ms, silent, event-driven
```

### Debug Mode (Collaborative)
```yaml
trigger: "issue sesame"
execution:
  AI: "I'll sync the issue cache. Let me check current state..."
  AI: "Found 3 issues in cache, 5 on GitHub"
  AI: "Detected 2 new issues: #45, #46"
  Human: "Why is #44 missing?"
  AI: "Let me check... #44 is closed but still in cache. This suggests 
       the cache cleanup didn't run properly last time."
  Human: "Should we fix that now?"
  AI: "Yes, I'll clean up the cache and document this edge case."
```

## Collaborative Debugging Patterns

### 1. Step-Through Execution
**Automated**: Operations execute in milliseconds
**Collaborative**: Pause at each step for inspection
```
Human: "Run commit workflow but show me each step"
AI: [Shows staged changes] "These files will be committed"
Human: "Why is config.json included?"
AI: "It has this change: [shows diff]. Should I unstage it?"
Human: "sesame"
```

### 2. State Inspection
**Automated**: Internal state invisible
**Collaborative**: Examine state at any point
```
AI: "Cache state before update: 15 issues, 3 closed"
AI: "GitHub API returned: 17 issues, 1 closed"  
AI: "Discrepancy detected - shall I show the differences?"
```

### 3. Decision Point Exploration
**Automated**: Follows predetermined rules
**Collaborative**: Discuss edge cases
```
AI: "The commit message references #123 but it's not in cache"
Human: "That's odd, when was the cache last synced?"
AI: "2 hours ago. The issue might be new. Checking GitHub..."
AI: "Found it - created 30 minutes ago. This reveals a gap in our sync frequency"
```

### 4. Error Investigation
**Automated**: Emits error event and continues
**Collaborative**: Deep dive into root cause
```
AI: "GitHub API call failed with 403"
Human: "What was the full request?"
AI: [Shows request details] "Rate limit exceeded. We have 0/5000 requests remaining"
Human: "When does it reset?"
AI: "In 47 minutes. Should we implement exponential backoff?"
```

## Benefits of Collaborative Mode

### 1. Learning System Behavior
- See exactly how automated workflows will execute
- Understand decision logic and edge cases
- Identify optimization opportunities

### 2. Debugging Production Issues
- Replay failed automated executions interactively
- Inspect state at each step
- Test fixes before deploying

### 3. System Evolution
- Discover new patterns through exploration
- Identify missing event handlers
- Refine choreography rules

### 4. Knowledge Transfer
- New team members learn by walking through
- Document edge cases as they're discovered
- Build intuition about system behavior

## Implementation Patterns

### Dual-Mode Tool Design
```python
def update_cache(mode='automated', context=None):
    if mode == 'collaborative':
        print(f"Current cache: {cache.stats()}")
        if context.confirm("Proceed with update?"):
            result = perform_update()
            print(f"Update complete: {result}")
            context.discuss_if_needed(result)
    else:
        result = perform_update()
        emit_event('cache_updated', result)
    return result
```

### Progressive Disclosure
```yaml
collaborative_levels:
  - silent: Execute normally
  - notify: Show major operations
  - verbose: Show all operations
  - debug: Show operations + state
  - interactive: Pause for discussion
```

### Debugging Commands
- `debug sesame [workflow]` - Run workflow in debug mode
- `replay sesame [event-id]` - Replay automated execution interactively
- `trace sesame on/off` - Toggle execution tracing
- `state sesame` - Inspect current system state

## Real-World Example

### Production Incident
**Automated system**: Creates 50 duplicate issues due to sync error

### Collaborative Debugging
```
Human: "debug sesame issue"
AI: "Running issue sync in debug mode..."
AI: "Cache has 50 issues, GitHub has 100"
AI: "Detecting gaps... found 50 new issues with identical titles"
Human: "That's wrong, show me the detection logic"
AI: [Shows code] "It's comparing by title only, not considering issue body"
Human: "So if titles match, it thinks they're different issues?"
AI: "Exactly. The deduplication logic is flawed. Should I:
     1. Fix the logic to compare title + body
     2. Add issue hash for better deduplication
     3. Clean up the duplicates first"
Human: "Let's do 3 then 2"
AI: "Cleaning duplicates... Fixed. Now implementing content hashing..."
```

## Key Insight

The ability to run **identical logic** in collaborative mode transforms debugging from "checking logs after failure" to "understanding behavior as it happens". This creates a tight feedback loop where:

- **Automated mode** provides efficiency at scale
- **Collaborative mode** provides understanding and evolution
- **Same rules** ensure consistency between modes
- **Progressive automation** starts collaborative, graduates to automated

This is why the process emphasis is crucial - it's not bureaucracy, it's building a system that can teach us about itself while running efficiently in production.