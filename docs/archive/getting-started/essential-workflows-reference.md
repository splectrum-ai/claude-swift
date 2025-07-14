[← Back to Claude-Swift Home](../../README.md)

# Essential Workflows Reference

*Daily workflows based on proven v1.0.0 usage patterns*

## Session Management (100% Compliance Achieved)

### `start sesame` - Begin Work Session
**Purpose**: Initialize work session with proper state verification
**Frequency**: Every work session start
**What it does**:
- Verifies correct branch state (unplanned default)
- Checks system time for accurate audit timestamps
- Initializes audit logging infrastructure
- Confirms MANDATORY rule compliance

**Example**:
```
> start sesame
✅ Branch verification: unplanned (correct)
✅ System time: 2025-06-26T13:30:00Z
✅ Audit logging: initialized
✅ Ready for work
```

### `finish sesame` - End Work Session  
**Purpose**: Clean session completion with state preservation
**Frequency**: Every work session end
**What it does**:
- Archives session accomplishments
- Verifies clean repository state
- Updates persistent todo management
- Logs completion with next steps

**Example**:
```
> finish sesame
✅ Session achievements logged
✅ Repository state: clean
✅ Todo list updated
✅ Ready for next session
```

## Task Management

### `todo sesame` - Repository Todo Management
**Purpose**: Maintain cross-session continuity and task tracking
**Frequency**: Daily or per session
**What it does**:
- Displays current repository todo list
- Enables adding/updating/completing tasks
- Maintains discussion topics across sessions
- Provides work prioritization

**Example**:
```
> todo sesame
Current todos:
1. [ ] Set up release automation
2. [x] Create documentation structure  
3. [ ] Implement user authentication

Add/update todos? y/n
```

### `next sesame` - Get Next Issue
**Purpose**: Systematic work prioritization and issue management
**Frequency**: When starting new work
**What it does**:
- Analyzes current project state
- Suggests next highest-priority work
- Integrates with GitHub issues if available
- Provides context for decision-making

## Git & Version Control

### `git sesame` - Git Workflow Assistance
**Purpose**: Guided git operations following claude-swift patterns
**Frequency**: For all git operations
**What it does**:
- Enforces branch management rules
- Guides commit and PR creation
- Manages branch switching protocols
- Handles merge conflict resolution

**Example**:
```
> git sesame
Current: unplanned branch with 3 changes
Options:
1. Commit changes and create PR
2. Switch to feature branch
3. Sync with main branch
4. Review changes
```

### `planning sesame` - Switch Work Types
**Purpose**: Navigate between planned and unplanned work
**Frequency**: When changing work focus
**What it does**:
- Manages transition between work types
- Handles branch switching protocols  
- Updates work context and tracking
- Maintains clean work separation

## Project Operations

### `release sesame` - Release Management
**Purpose**: Systematic project release creation
**Frequency**: When creating releases
**What it does**:
- Validates release readiness
- Creates comprehensive release notes
- Manages version configuration updates
- Handles GitHub release creation

**Example**:
```
> release sesame
Analyzing project for v1.1.0 release...
✅ All planned work complete
✅ Documentation current
✅ Tests passing
Ready to create release? y/n
```

### `docs sesame` - Documentation Workflows
**Purpose**: Systematic documentation creation and maintenance
**Frequency**: When working with documentation
**What it does**:
- Ensures documentation standards compliance
- Manages documentation structure
- Validates links and references
- Applies template patterns

### `project sesame` - Project Automation
**Purpose**: Project-specific automation and workflows
**Frequency**: Project-dependent
**What it does**:
- Executes project-specific automation
- Manages project configuration
- Handles custom workflow patterns
- Integrates with project tools

## Workflow Discovery & Help

### `commands sesame` - List Available Workflows
**Purpose**: Discover available workflows and commands
**Frequency**: When learning or troubleshooting
**What it displays**:
- All available sesame workflows
- Brief descriptions of each
- Usage patterns and examples
- Workflow categorization

### `rules sesame` - Operational Rules
**Purpose**: Review operational rules and guidelines
**Frequency**: When uncertain about procedures
**What it displays**:
- MANDATORY rules and compliance requirements
- Workflow execution patterns
- Quality standards and best practices
- Troubleshooting guidance

## Workflow Usage Patterns

### Daily Workflow Pattern (Proven Effective)
```bash
# Morning startup
start sesame
todo sesame          # Review priorities
next sesame          # Get work recommendation

# Development work
git sesame           # As needed for git operations
docs sesame          # When updating documentation

# Session completion
finish sesame
```

### Weekly Workflow Pattern
```bash
# Monday planning
planning sesame      # Set weekly focus
project sesame       # Review project automation

# Mid-week maintenance  
docs sesame          # Documentation updates
todo sesame          # Priority adjustments

# Friday wrap-up
release sesame       # If ready for release
finish sesame        # Clean week completion
```

### Release Workflow Pattern
```bash
# Pre-release
todo sesame          # Verify completion
docs sesame          # Documentation current
git sesame           # Clean repository state

# Release execution
release sesame       # Create release

# Post-release
planning sesame      # Next version planning
```

## Workflow Effectiveness Tips

### High-Impact Habits (From v1.0.0 Analysis)
1. **100% Session Compliance**: Always use start/finish sesame
2. **Regular Todo Management**: Keep cross-session continuity
3. **Git Workflow Discipline**: Use git sesame for all operations
4. **Documentation Maintenance**: Use docs sesame systematically

### Efficiency Multipliers
1. **Batch Similar Work**: Group documentation, git operations, etc.
2. **Use Choice Points**: Respect workflow pause points for better decisions
3. **Trust the System**: Let workflows handle compliance and standards
4. **Regular Planning**: Use planning sesame to stay focused

### Quality Assurance Integration
1. **Workflow Validation**: Workflows include built-in quality checks
2. **Standard Compliance**: Automatic adherence to project standards
3. **Audit Trail**: Complete workflow execution tracking
4. **Error Prevention**: Guided operations prevent common mistakes

## Troubleshooting Workflows

### When Workflows Don't Work
1. **Check Prerequisites**: Verify basic setup and authentication
2. **Verify Location**: Must be in project root with claude/ folder
3. **Review Configuration**: Check project-info.md and version-config.md
4. **Reset Session**: Try start sesame to reinitialize

### When Git Gets Complicated
1. **Use git sesame**: Guided resolution for git issues
2. **Check Branch State**: Verify you're on correct branch
3. **Review Remote Status**: Ensure connectivity and authentication
4. **Ask for Help**: Workflows provide context-specific guidance

### When Documentation Breaks
1. **Use docs sesame**: Systematic documentation validation
2. **Check Standards**: Verify back-links and file placement
3. **Follow Patterns**: Copy structure from working examples
4. **Validate Links**: Run documentation compliance checking

## Advanced Workflow Integration

### Custom Project Workflows
- Extend standard workflows with project-specific hooks
- Create PROJECT_* workflows for specialized operations
- Integrate with external tools and systems
- Maintain compatibility with core template system

### Team Collaboration Patterns
- Standardize workflow usage across team members
- Share workflow patterns and configurations
- Integrate with team processes and tools
- Maintain consistent quality standards

---

*Essential Workflows Reference - Your daily toolkit for effective claude-swift usage*