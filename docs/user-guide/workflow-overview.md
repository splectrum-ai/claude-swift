[← Back to Claude-Swift Home](../../README.md)

# Workflow Overview

Complete guide to all claude-swift workflows and their capabilities for collaborative AI project management.

## Core Session Management

### `start sesame` - Session Initialization
**Purpose**: Begin a new work session with proper setup and context loading.

**What it does:**
- Initializes workspace and loads project context
- Verifies clean repository state
- Presents current todo list for task selection
- Sets up audit logging for the session

**When to use**: At the beginning of every work session

### `finish sesame` - Session Completion
**Purpose**: End work session with automated git workflow and session archiving.

**What it does:**
- Commits all current work with proper messages
- Executes complete git workflow (push → PR → merge)
- Archives session audit logs
- Transfers incomplete work to persistent todo list

**When to use**: At the end of every work session

## Daily Development Workflows

### `next sesame` - Intelligent Work Recommendations
**Purpose**: Get AI-powered recommendations for the next most valuable work item.

**What it does:**
- Analyzes all available issues using smart prioritization
- Considers dependencies, effort, priority, and impact
- Provides scored recommendations with clear reasoning
- Suggests optimal task sequences for maximum productivity

**When to use**: When deciding what to work on next

### `todo sesame` - Task Management
**Purpose**: Manage your persistent todo list across sessions.

**What it does:**
- Add, update, and complete todo items
- Maintain cross-session continuity
- Integrate with audit logging for progress tracking
- Provide clear task prioritization and organization

**When to use**: For ongoing task management and planning

### `planning sesame` - Strategic Project Planning
**Purpose**: High-level project planning and work organization.

**What it does:**
- Organize work into logical phases and priorities
- Create and manage project roadmaps
- Balance planned vs. unplanned work allocation
- Integrate with version planning and milestone management

**When to use**: For strategic planning sessions and project organization

## Version Lifecycle Management

### `version sesame` - Version Setup and Issue Management
**Purpose**: Set up new versions and organize issues for development.

**What it does:**
- Create version milestones with clear scope
- Organize issues by epic and priority
- Set up dependency tracking and effort estimation
- Apply smart labeling for filtering and organization

**When to use**: When starting work on a new version

### `release sesame` - Release Process Management
**Purpose**: Execute complete release process with quality assurance.

**What it does:**
- Validate release readiness and completeness
- Archive audit logs for version history
- Create release artifacts and documentation
- Ensure clean state for next version development

**When to use**: When ready to release a completed version

### `transition sesame` - Version Analysis and Optimization
**Purpose**: Comprehensive analysis and knowledge extraction from completed version.

**What it does:**
- Analyze audit logs for development insights
- Update documentation with lessons learned
- Extract strategic patterns and process improvements
- Generate user-facing reports and onboarding materials
- Validate readiness for next version development

**When to use**: After version release to process learnings and prepare for next version

## Utility Workflows

### `project sesame` - Template and Project Updates
**Purpose**: Synchronize with template updates and manage project configuration.

**What it does:**
- Synchronize with latest claude-swift template
- Merge template updates with project customizations
- Update project configuration and settings
- Resolve conflicts between template and project changes

**When to use**: When template updates are available or project configuration needs updating

### `issue sesame` - Manual Issue Creation
**Purpose**: Create individual issues outside of planning workflows.

**What it does:**
- Create properly structured issues with all required fields
- Apply appropriate labels and milestone assignments
- Set up dependency tracking and effort estimation
- Integrate with existing project organization

**When to use**: For ad-hoc issue creation outside formal planning sessions

### `close sesame` - Manual Issue Closure
**Purpose**: Close issues outside normal workflow completion.

**What it does:**
- Properly close issues with appropriate reasoning
- Update related dependencies and blockers
- Maintain audit trail of closure decisions
- Ensure clean project state after closure

**When to use**: For closing issues that don't follow normal completion workflow

## Workflow Integration

### **Natural Work Flow:**
1. `start sesame` → Begin session
2. `next sesame` → Get work recommendation
3. Work on recommended task
4. Update `todo sesame` → Mark progress
5. `finish sesame` → End session

### **Version Management Flow:**
1. `version sesame` → Set up new version
2. `planning sesame` → Organize work
3. Daily development cycle
4. `release sesame` → Release version
5. `transition sesame` → Analyze and optimize

### **Strategic Planning Flow:**
1. `planning sesame` → High-level planning
2. `version sesame` → Version-specific organization
3. `issue sesame` → Additional issue creation as needed
4. Regular `next sesame` → Optimal work sequencing

## Magic Word

### `sesame` (standalone)
**Purpose**: Universal positive affirmation for confirmations.

**Usage**: Respond "sesame" to any proposal, option, or request for confirmation.
**Meaning**: "Yes", "I agree", "Go ahead", "Proceed", "Approved"

---

*This workflow ecosystem provides comprehensive collaborative AI capabilities for intelligent project management and continuous optimization.*