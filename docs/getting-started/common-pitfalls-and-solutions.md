[← Back to Claude-Swift Home](../../README.md)

# Common Pitfalls and Solutions

*Lessons learned from real v1.0.0 deployment experience*

## Initial Setup Pitfalls

### Pitfall: Skipping Project Configuration
**Symptom**: Workflows reference `[project-name]` placeholders instead of your actual project
**Cause**: Not customizing `claude/project/project-info.md` and `version-config.md`
**Solution**:
```bash
# Essential first step - customize these files
edit claude/project/project-info.md
edit claude/project/version-config.md
```
**Prevention**: Make project configuration the first step of deployment

### Pitfall: Wrong Branch State
**Symptom**: "Branch verification failed" or unexpected git behavior
**Cause**: Claude-swift expects `unplanned` branch as default working branch
**Solution**:
```bash
# Create and switch to unplanned branch
git checkout -b unplanned
git push -u origin unplanned

# Verify in Claude Code
start sesame  # Should now pass branch verification
```
**Prevention**: Set up branch structure before first session

### Pitfall: Missing GitHub CLI Authentication
**Symptom**: Release workflows fail with authentication errors
**Cause**: GitHub CLI not configured for your account/organization
**Solution**:
```bash
# Authenticate GitHub CLI
gh auth login
gh auth status  # Verify successful authentication

# Test with simple command
gh repo view  # Should show your repository info
```
**Prevention**: Complete GitHub CLI setup during initial deployment

## Workflow Usage Pitfalls

### Pitfall: Forgetting Session Management
**Symptom**: Inconsistent work tracking, unclear progress
**Cause**: Not using `start sesame` and `finish sesame` consistently
**Solution**: Build session habits:
```bash
# Always start work sessions
start sesame

# Always end work sessions
finish sesame
```
**Benefits Proven**: 100% session compliance in v1.0.0 led to excellent progress tracking
**Prevention**: Make session commands muscle memory

### Pitfall: Working on Main Branch
**Symptom**: Accidental commits to main, merge conflicts
**Cause**: Not following claude-swift branch management rules
**Solution**: 
- Always work on `unplanned` for unplanned work
- Create feature branches for planned work: `feature/issue-123`
- Use `git sesame` for branch management assistance
**Prevention**: Let claude-swift manage your git workflow

### Pitfall: Ignoring Choice Points
**Symptom**: Scope creep, unfocused work sessions
**Cause**: Not respecting claude-swift's choice point architecture
**Solution**: After each completed step, consciously choose:
- Continue with related next step
- Switch to different priority  
- Address urgent issues
- End session cleanly
**Benefits**: Prevents tunnel vision, enables dynamic re-prioritization

## Configuration Pitfalls

### Pitfall: Mixing Template with Project Content
**Symptom**: Template contamination, deployment issues
**Cause**: Editing template system files instead of project configuration
**Solution**: 
- ✅ Edit files in `claude/project/` (your project)
- ❌ Don't edit files in `claude/wow/` (template system)
- Use project hooks for customization
**Prevention**: Understand template vs project file boundaries

### Pitfall: Inconsistent Documentation Structure
**Symptom**: Broken links, missing back-links, disorganized docs
**Cause**: Not following claude-swift documentation standards
**Solution**: All documentation files must:
- Include back-link to README.md at top: `[← Back to Project Home](../README.md)`
- Be placed in appropriate `docs/` subdirectory
- Follow established naming conventions
**Prevention**: Use `docs sesame` workflow for documentation creation

### Pitfall: Incorrect Audit Log Format
**Symptom**: Workflow tracking failures, inconsistent logging
**Cause**: Manual audit log edits not following required format
**Solution**: Never manually edit audit logs - let workflows handle logging
**Format**: `TIMESTAMP|WORKFLOW|STEP_TYPE|CONTEXT|FILE_PATH|DESCRIPTION`
**Prevention**: Use workflow commands instead of manual log edits

## Development Process Pitfalls

### Pitfall: Skipping Architecture Planning
**Symptom**: Frequent rework, unclear direction, scope creep
**Cause**: Jumping into implementation without proper planning
**Solution**: Follow proven architecture-first pattern:
1. Problem analysis and documentation
2. Solution design and validation
3. Concentrated implementation using prepared foundation
**Evidence**: v1.0.0 saw 64% efficiency gain with architecture-first approach
**Prevention**: Always plan before implementing

### Pitfall: Manual Compliance Checking
**Symptom**: Inconsistent quality, missed compliance issues
**Cause**: Manual checking instead of systematic validation
**Solution**: Use built-in workflows:
- `rules sesame` - Review compliance requirements
- Let workflows handle compliance checking automatically
- Create project-specific quality gates
**Prevention**: Trust the system, don't manually override

### Pitfall: Inadequate Testing Before Release
**Symptom**: Deployment failures, integration issues
**Cause**: Not validating with real-world scenarios
**Solution**: Follow InfoMetis validation pattern:
- Deploy to staging/test environment first
- Validate with actual use cases
- Gather feedback before wide release
**Evidence**: 100% deployment success rate with interactive validation
**Prevention**: Always validate before release

## Collaboration Pitfalls

### Pitfall: Unclear Approval Protocols
**Symptom**: Confusion about decision-making, workflow stalls
**Cause**: Not understanding human-AI collaboration boundaries
**Solution**: Use "sesame" protocol:
- Claude presents options and recommendations
- Human provides strategic direction with "sesame" approval
- Clear separation: human strategy, AI tactics
**Prevention**: Establish clear approval patterns early

### Pitfall: Information Overload
**Symptom**: Too much detail, lost in documentation
**Cause**: Not leveraging claude-swift's overview approach
**Solution**: Focus on:
- High-level overview in documentation
- Use "Ask Claude about..." for details on demand
- Keep documentation concise and actionable
**Prevention**: Follow overview-level content strategy

### Pitfall: Lost Work Context
**Symptom**: Forgetting previous work, repeated discussions
**Cause**: Not using persistent todo management
**Solution**: 
- Use `todo sesame` to maintain cross-session continuity
- Update `claude/project/todo.md` regularly
- Reference previous work in session planning
**Prevention**: Make todo management routine

## Recovery Strategies

### When Workflows Aren't Working
1. **Check basic setup**: Project configuration, branch state, authentication
2. **Verify directory**: Must be in project root with `claude/` folder
3. **Review error messages**: Often indicate specific configuration issues
4. **Start fresh session**: `start sesame` reinitializes state

### When Git Gets Confused
1. **Use claude-swift git help**: `git sesame` for guided resolution
2. **Check branch state**: Should be on `unplanned` or feature branch
3. **Verify remote connectivity**: `git remote -v` and `gh auth status`
4. **Reset to known good state**: Create new branch from main if needed

### When Documentation Is Broken
1. **Check back-links**: All docs need `[← Back to ...]` at top
2. **Verify file placement**: Must be in `docs/` hierarchy
3. **Run link validation**: Use `docs sesame` for systematic checking
4. **Reference working examples**: Copy patterns from working files

## Success Patterns (Anti-Pitfalls)

### Architecture-First Development
- **Pattern**: Plan thoroughly before implementing
- **Evidence**: 64% efficiency gain in v1.0.0
- **Application**: Use for all significant features

### Interactive Validation
- **Pattern**: Test with real scenarios before release
- **Evidence**: 100% deployment success rate
- **Application**: Create staging environments for validation

### Session Discipline
- **Pattern**: Consistent session start/end protocols
- **Evidence**: 100% compliance led to excellent tracking
- **Application**: Make session management automatic

### Template System Respect
- **Pattern**: Work within template boundaries
- **Evidence**: Clean deployments with zero contamination
- **Application**: Use project hooks for customization

---

*Common Pitfalls Guide - Learn from v1.0.0 experience to avoid common mistakes*