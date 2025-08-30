# Claude-Swift: INBOX-Driven Development Framework

Claude-Swift provides a simplified, INBOX-driven framework for AI-assisted development with cross-repository task coordination.

## Core Principle: INBOX as the Driver

**Everything starts with the INBOX.** Tasks arrive, get processed through workflows, and result in commits. This creates a clean, auditable development process where git commits serve as the complete audit trail.

## Architecture Overview

### Four Core Responsibilities (Infrastructure)

#### 1. **[INBOX/OUTBOX Management](core/inbox-outbox/)**
- **INBOX**: Queue of executable tasks (the main driver)
- **OUTBOX**: Cross-repository task distribution  
- **Task transport**: Pure identification and distribution layer

#### 2. **[TASK Execution & Management](core/task-management/)**
- **Execution wrapper**: Context around issues for execution
- **Dual-batching**: Flexible tasks→commits and commits→pushes parameters
- **Task lifecycle**: INBOX → active → completed → commit → cleanup

#### 3. **[ISSUE Management](core/issue-management/)**
- **Generic wrapper**: Common structure for all workflow types
- **Repository organization**: Milestone-based storage and retrieval
- **Data structure**: Compile-time integration with WORKFLOW

#### 4. **[WORKFLOW Management](core/workflow-management/)**
- **Process definitions**: Self-contained creation, execution, sign-off
- **TDC validation**: Test-driven creation with quality gates
- **Runtime integration**: External system connections during execution

### Repository Services (Built on Core)

#### **[WOW_UPDATE](repo/wow-update/)** - Framework Maintenance
- **Automatic updates**: Framework maintenance via TDC workflow
- **First TDC implementation**: Demonstrates complete framework end-to-end
- **Mandatory execution**: Triggered on CLAUDE.md read

#### **[RELEASE Management](repo/release-management/)** - Release Coordination  
- **Generic + custom**: WoW defaults with repository-specific overrides
- **Task-driven**: Release processes executed as tasks
- **Milestone integration**: Version and patch release workflows

#### **[REGISTRY](repo/registry-management/)** - Workflow Discovery (Transitional)
- **Workflow discovery**: Find and resolve available workflows
- **Standard library**: Collection of proven workflow definitions
- **Migration path**: Embedded → dedicated repository

## Test-Driven Creation (TDC) Framework

Claude-Swift will **pilot an appropriate TDC implementation** - demonstrating Test-Driven Creation as a universal pattern for intelligent system development.

### TDC Pattern
```
State Test → Detection → Creation Response
├── Predefined: Execute established workflows  
└── AI-Driven: Create contextually appropriate solutions
```

### Repository as TDC Laboratory
- **State Detection** = Creation Tests for repository health
- **Automated Triggers** = Creation responses to state changes
- **AI Interventions** = Adaptive creation based on context analysis
- **Learning Evolution** = Triggers evolve from rigid to intelligent

### TDC Examples in Practice
| State Test | Detection | Creation Response |
|------------|-----------|-------------------|
| "Repository should process all tasks" | `inbox/*.md exists` | Execute INBOX workflow |
| "Development should maintain momentum" | Commit patterns, issue velocity | Adaptive workflow or AI intervention |
| "Releases should be milestone-driven" | Milestone completion % | Release workflow or completion strategy |

This positions Claude-Swift as both a practical development framework and a **TDC implementation pilot** that demonstrates the universal creation pattern in action.

## Dual-Mode Operation

### Interactive Mode (Manual)
- User triggers: `inbox sesame`, `issue sesame`, `release sesame`
- Manual workflow execution via sesame commands
- User-driven task processing and issue management

### Event-Driven Mode (Automated)
- **State detection**: Repository automatically detects work states
- **Trigger automation**: State changes trigger appropriate workflows
- **Background processing**: Continuous monitoring and execution

### State-Based Triggers

| Repository State | Automated Response |
|-----------------|-------------------|
| `inbox/*.md files exist` | Execute INBOX workflow |
| `outbox/*.md files exist` | Execute OUTBOX workflow |
| `current milestone has unresolved issues` | Prompt issue triage |
| `milestone 100% complete` | Trigger RELEASE workflow |
| `session boundary detected` | Execute SESSION_START/END |
| `uncommitted changes exist` | Prompt commit workflow |

## Development Flow

### Task-Driven Flow
```
INBOX Task → Workflow Assignment → Execution Path:
├── Direct: Execute Workflow → Commit → Archive
└── Issue: Create Issue+Milestone → [Later] Work Issue → Commit → Close
```

### Issue-Driven Flow  
```
Issue Selection → Work Execution → Commit with Context → Issue Deletion
```

### Cross-Repository Coordination
```
Local Task → OUTBOX → Target Repository INBOX → Execution → Result
```

## Commit-Based Audit Trail

**Commits ARE the audit trail.** Every workflow action results in a meaningful commit that serves as the permanent record:

```
[Issue #42] Fix user session timeout

- Increase session duration to 60 minutes
- Add activity-based refresh logic

Context: Users experiencing frequent logouts
Closes #42
```

## Framework Structure

```
claude/
├── wow/           # Ways of Working framework (shared)
│   ├── scripts/   # Core management scripts
│   └── workflows/ # Workflow definitions  
├── project/       # Project-specific configuration
├── issues/        # Local issue storage + GitHub sync
├── inbox/         # Incoming tasks (the driver)
└── outbox/        # Cross-repository task distribution
```

## Key Commands (Sesame Triggers)

### Core Operations
- `start sesame` - Initialize session (state check + setup)
- `finish sesame` - Complete session (commit + cleanup)
- `inbox sesame` - Process inbox tasks
- `issue sesame` - Manage issues and milestones
- `release sesame` - Execute release workflow

### Task Management
- `task sesame` - Create cross-repository tasks
- `outbox sesame` - Distribute outbox tasks

### Development
- `commit sesame` - Intelligent commit with issue closure

## Implementation Phases

### Phase 1: Core Framework ✅
- [x] INBOX-driven task processing
- [x] Issue-milestone integration  
- [x] Commit-based audit trail
- [x] Cross-repository task distribution

### Phase 2: Dual-Mode Operation 🔄
- [ ] State detection mechanisms
- [ ] Event-driven triggers
- [ ] Background automation
- [ ] Interactive/automatic mode switching

### Phase 3: Workflow Ecosystem 📋  
- [ ] Specialized workflow library
- [ ] Domain-specific task types
- [ ] Advanced release management
- [ ] Integration patterns

## Benefits

- **🎯 Single Entry Point**: Everything flows through INBOX
- **⚡ Automated Workflows**: State-driven execution reduces manual overhead  
- **🔍 Complete Traceability**: Git commits provide full audit trail
- **🌐 Cross-Repository**: Seamless task coordination across projects
- **📊 Milestone-Driven**: Issues tied to releases for proper planning
- **🤖 AI-Optimized**: Designed for AI-assisted development patterns

---

*INBOX-driven development framework optimized for AI-assisted, cross-repository software development.*