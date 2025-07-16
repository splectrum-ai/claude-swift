[← Back to Claude-Swift](../README.md)

# Workflow Architecture

This document explains the distinction between universal WoW (Ways of Working) workflows and project-specific workflows in the Claude-Swift framework.

## Overview

Claude-Swift uses a **dual-layer workflow architecture**:

1. **Universal WoW Workflows** - Available in ALL repositories using the framework
2. **Project-Specific Workflows** - Only available in the orchestrator repository (claude-swift)

## Workflow Categories

### Universal WoW Workflows (`claude/wow/workflows/`)

These workflows are part of the core framework and work identically in:
- The orchestrator repository (claude-swift)
- All registered/orchestrated repositories (e.g., splectrum, spl1, InfoMetis)

**Universal Workflow List:**
- `SESSION_START` / `SESSION_END` - Session management
- `NEXT_ISSUE` - Issue prioritization and selection
- `COMMIT` - Intelligent commit with issue closure
- `CREATE_ISSUE` / `ISSUE_CACHE` - Issue management and local caching
- `INBOX` / `OUTBOX` / `TASK_CREATE` - Task processing and creation
- `RELEASE_PROCESS` / `VERSION_TRANSITION` - Release management
- `NEW_VERSION_PLANNING` - Version planning
- `AUDIT_LOGGING` - Audit trail management
- `MANDATORY_RULES_REFRESH` - Rule compliance
- `GIT_WORKFLOW` - Git operations
- `OPERATIONAL_RULES` - Development standards
- `DOCUMENTATION_WORKFLOW` - Documentation management

### Project-Specific Workflows (`claude/project/workflows/`)

These workflows are **ONLY** available in the orchestrator repository (claude-swift) and enable multi-project management:

**Orchestrator-Only Workflows:**
- `INITIALISE` - One-time workspace setup for multi-project management
- `PROJECT_REGISTER` - Register sub-projects with the orchestrator
- `OUTBOX` - Distribute tasks across registered projects

## Key Differences

### Universal Workflows
- Work in **any** repository with the WoW framework
- Handle single-repository operations
- No dependency on workspace structure
- Can be used by both orchestrator and orchestrated repos

### Project-Specific Workflows  
- Work **only** in the orchestrator repository
- Require `projects/` directory structure
- Enable cross-repository operations
- Manage the relationship between multiple projects

## Architecture Diagram

```mermaid
graph TD
    subgraph "Orchestrator (claude-swift)"
        O1[claude/]
        O2[wow/workflows/]
        O3[project/workflows/]
        O4[projects/]
        
        O1 --> O2
        O1 --> O3
        
        O2 --> O2A[SESSION_START.md]
        O2 --> O2B[NEXT_ISSUE.md]
        O2 --> O2C[INBOX.md]
        O2 --> O2D[TO_INBOX.md]
        O2 --> O2E[ISSUE_CACHE.md]
        O2 --> O2F[Universal workflows...]
        
        O3 --> O3A[INITIALISE.md]
        O3 --> O3B[PROJECT_REGISTER.md]
        O3 --> O3C[OUTBOX.md]
        
        O4 --> O4A[org1/repo1/]
        O4 --> O4B[org2/repo2/]
    end
    
    subgraph "Registered Repo (e.g., splectrum)"
        R1[claude/]
        R2[wow/workflows/]
        R3[❌ No projects/]
        
        R1 --> R2
        
        R2 --> R2A[SESSION_START.md]
        R2 --> R2B[NEXT_ISSUE.md]
        R2 --> R2C[INBOX.md]
        R2 --> R2D[TO_INBOX.md]
        R2 --> R2E[ISSUE_CACHE.md]
        R2 --> R2F[Universal workflows...]
    end
    
    O2 -.->|Synced to all repos| R2
    O3A -.->|Setup workspace| O4
    O3B -.->|Register projects| O4
    O3C -.->|Cross-repo distribution| R2C
    
    style O2 fill:#e8f5e8
    style O3 fill:#fff3e0
    style R2 fill:#e8f5e8
    style R3 fill:#ffebee
    style O4 fill:#f3e5f5
```

## Workflow Availability

| Workflow | Orchestrator | Registered Repos | Trigger | Description |
|----------|--------------|------------------|---------|-------------|
| SESSION_START | ✅ | ✅ | `start sesame` | Session initialization |
| NEXT_ISSUE | ✅ | ✅ | `next sesame` | Issue prioritization |
| INBOX | ✅ | ✅ | `inbox sesame` | Process tasks to issues (with milestone assignment) |
| TO_INBOX | ✅ | ✅ | `to-inbox sesame` | Process self-targeted tasks |
| TASK_CREATE | ✅ | ✅ | `task [target] sesame` | Create cross-repository tasks |
| ISSUE_CACHE | ✅ | ✅ | `issue sesame` | Local issue caching |
| INITIALISE | ✅ | ❌ | `initialise sesame` | Setup orchestrator workspace |
| PROJECT_REGISTER | ✅ | ❌ | `register [repo] sesame` | Register projects for orchestration |
| OUTBOX (Cross-repo) | ✅ | ❌ | `outbox sesame` | Distribute tasks to all registered projects |

## Usage Examples

### In Orchestrator (claude-swift)
```bash
# Universal workflows work
start sesame                    # Session initialization
next sesame                     # Find next issue to work on
to-inbox sesame                 # Process self-targeted tasks
inbox sesame                    # Convert tasks to GitHub issues
issue sesame                    # Sync issue cache

# Project-specific workflows also work
initialise sesame               # Setup workspace (one-time)
register org/repo sesame        # Register new projects
outbox sesame                   # Distribute tasks to all projects
```

### In Registered Repo (e.g., splectrum)
```bash
# Universal workflows work
start sesame                    # Session initialization
next sesame                     # Find next issue to work on
to-inbox sesame                 # Process self-targeted tasks
inbox sesame                    # Convert tasks to GitHub issues
issue sesame                    # Sync issue cache

# Project-specific workflows NOT available
initialise sesame               # ❌ Error: workflow not found
register org/repo sesame        # ❌ Error: workflow not found
outbox sesame                   # ❌ Error: workflow not found
```

## Implementation Notes

1. **CLAUDE.md Behavior**: When a sesame trigger is not found in the universal list, Claude checks `claude/project/KEYWORD_REGISTRY.md` for project-specific workflows.

2. **Workflow Discovery**: The MANDATORY rule in CLAUDE.md ensures project-specific workflows are found when working in the orchestrator.

3. **Task Flow**: 
   - Tasks created with `TASK_CREATE` (universal)
   - Distributed by `OUTBOX` (orchestrator-only)
   - Received by `INBOX` (universal)

4. **Cache Management**: Both `CREATE_ISSUE` and `INBOX` workflows update the issue cache for `NEXT_ISSUE` performance.

## Summary

The dual-layer architecture enables:
- **Portability**: Universal workflows work identically everywhere
- **Specialization**: Orchestrator has additional capabilities
- **Separation**: Clear boundaries between single-repo and multi-repo operations
- **Consistency**: Same operational patterns across all projects

---

[← Back to Claude-Swift](../README.md) | [Registered Project Guide →](registered-project-guide.md)