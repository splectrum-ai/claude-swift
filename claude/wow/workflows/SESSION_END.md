[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# SESSION_END Workflow

## Trigger
**User-Friendly**: `finish sesame`

## Purpose
Properly terminate a work session with learning capture, work commitment, and audit log archiving.

## Workflow Execution

### 1. Session Termination and Archive

**IMPORTANT**: Always provide a meaningful commit message that summarizes the work completed in the session.

```bash
# Execute complete session end workflow WITH meaningful commit message
claude/wow/scripts/session-manage end-session --message "Descriptive summary of work completed"

# Examples of good commit messages:
# --message "Implement user authentication with JWT tokens and password hashing"
# --message "Fix responsive design issues in mobile navigation component"  
# --message "Add comprehensive test suite for payment processing module"
# --message "Refactor database queries for improved performance and caching"
```

**Commit Message Guidelines**:
- Describe WHAT was accomplished, not just what was changed
- Include key technical decisions or architectural changes
- Mention major bug fixes, new features, or refactoring efforts
- Be specific enough that future developers understand the session's value
- Avoid generic messages like "Update files" or "Various changes"

## Success Criteria
- All work committed to repository
- Audit log archived with timestamp
- Fresh audit log ready for next session
- Clean handoff to next session

## Integration with SESSION_START
- Creates clean session boundary for SESSION_START to detect
- SESSION_START will verify clean termination by looking for `SESSION_END | workflow_complete`
- Archive provides historical context for future sessions
- Fresh log ensures SESSION_START has clean starting point

---

*Session termination workflow with learning capture and proper archival*