# RELEASE Management

**Core Responsibility 5: Generic Release Processes with Repository-Specific Customization**

RELEASE provides generic release workflows through WoW framework, with optional repository-specific customization through project workflows, creating release execution as tasks.

## Purpose

- **Generic Release Processes** - Default version and patch release workflows for all repositories
- **Repository Customization** - Optional project-specific release workflows
- **Release Task Creation** - Generate executable tasks for release processes
- **Fallback Logic** - Use generic defaults when no custom workflows exist

## Two-Component Architecture

### **Generic Component (WoW Framework)**
- **Default workflows** for version and patch releases
- **Standard release logic** applicable to all repositories  
- **Fallback implementation** when no project-specific workflows exist
- **Release task generation** using standard patterns

### **Repository-Specific Component (Project Workflows)**
- **Custom release workflows** tailored to specific repository needs
- **Override default behavior** when repository has special requirements
- **Project-specific release steps** and validation
- **Repository context integration** (build systems, deployment, etc.)

## Architecture Flow

```
Release triggered → 
Check for repo-specific workflow →
├── Found: Use project VERSION_RELEASE/PATCH_RELEASE workflow
└── Not found: Use generic WoW default workflow
→ Generate release tasks → Execute via TASK Management
```

## Two Release Types

### **Version Releases**
**Milestone-based releases** (v1.2.0, v1.3.0, etc.)

#### Generic Default Process:
- Validate milestone completion (all issues closed)
- Generate release notes from milestone issues
- Create version tag and release
- Update milestone status to released
- Archive completed milestone

#### Custom Override:
```
Project workflow: claude/project/workflows/VERSION_RELEASE/
├── creation/ - Custom version release validation
├── execution/ - Repository-specific release steps  
└── sign-off/ - Custom completion criteria
```

### **Patch Releases**  
**Hotfix releases** outside normal milestone cycle

#### Generic Default Process:
- Validate patch readiness (critical fixes ready)
- Generate patch notes from included fixes
- Create patch version tag (v1.2.1, v1.2.2, etc.)
- Deploy patch release
- Update tracking systems

#### Custom Override:
```
Project workflow: claude/project/workflows/PATCH_RELEASE/
├── creation/ - Custom patch validation
├── execution/ - Repository-specific patch steps
└── sign-off/ - Custom patch completion criteria  
```

## Release as Task Creation

### Release Tasks Generated
When release is triggered, RELEASE Management **creates executable tasks**:

```
Release trigger → Generate release tasks → INBOX → TASK Management execution
```

### Example Version Release Task
```markdown
---
workflow: VERSION_RELEASE  
priority: high
source_repo: local
commit_message_part: |
  [Release] v1.2.0 version release
  - Complete milestone with 15 issues
  - Generate release notes and documentation
  Context: Scheduled version release for milestone completion
---

# Task: Execute v1.2.0 Version Release

## Execution Context  
Milestone: v1.2.0
Issues completed: 15
Release type: version

## Issue Content
[Release issue with complete specification per VERSION_RELEASE workflow]
```

## Workflow Selection Logic

### **Discovery Process:**
```javascript
function getReleasekWorkflow(releaseType, repository) {
    // Check for repository-specific workflow
    const customWorkflow = `claude/project/workflows/${releaseType}_RELEASE`;
    if (workflowExists(customWorkflow)) {
        return customWorkflow;
    }
    
    // Fallback to generic WoW default
    return `claude/wow/workflows/${releaseType}_RELEASE_DEFAULT`;
}
```

### **Fallback Strategy:**
- **Primary**: Use repository-specific workflow if exists
- **Fallback**: Use generic WoW default workflow  
- **No failure**: Always have executable release process

## Integration Points

### With ISSUE Management
- **Reads**: Milestone completion status, issue lists
- **Validates**: Release readiness based on milestone state
- **Archives**: Completed milestones after release

### With TASK Management  
- **Creates**: Release execution tasks
- **Integrates**: Release processes through standard task execution
- **Benefits**: Release gets same batching, commit, and lifecycle management

### With WORKFLOW Management
- **Uses**: Repository-specific release workflows when available
- **Provides**: Generic default workflows when none exist  
- **Validates**: Release execution through workflow creation/sign-off tests

## Commands

- `release sesame` - Execute release process (version or patch)
- `release-manage version` - Trigger version release for completed milestone
- `release-manage patch` - Trigger patch release for critical fixes
- `release-manage status` - Check release readiness and milestone status

## Repository Structure

### Generic Workflows (WoW)
```
claude/wow/workflows/
├── VERSION_RELEASE_DEFAULT/
│   ├── creation/ - Standard version validation
│   ├── execution/ - Generic version release steps
│   └── sign-off/ - Standard completion check
└── PATCH_RELEASE_DEFAULT/
    ├── creation/ - Standard patch validation  
    ├── execution/ - Generic patch release steps
    └── sign-off/ - Standard completion check
```

### Repository-Specific Overrides
```
claude/project/workflows/
├── VERSION_RELEASE/ (optional)
│   ├── creation/ - Custom version validation
│   ├── execution/ - Repo-specific version steps
│   └── sign-off/ - Custom completion criteria
└── PATCH_RELEASE/ (optional)
    ├── creation/ - Custom patch validation
    ├── execution/ - Repo-specific patch steps  
    └── sign-off/ - Custom completion criteria
```

## Benefits

- ✅ **Universal coverage** - Every repository gets release capability
- ✅ **Customization flexibility** - Override defaults when needed
- ✅ **Task-driven execution** - Release benefits from task management features
- ✅ **Consistent interface** - Same `release sesame` command everywhere
- ✅ **No configuration required** - Works out-of-box with defaults
- ✅ **Repository-specific logic** - Custom workflows for special needs

## State-Based Triggers (TDC Implementation)

| State Test | Detection | Creation Response |
|------------|-----------|-------------------|
| "Milestone should be released when complete" | All milestone issues closed | Create version release task |
| "Critical fixes should become patches" | High-priority fixes ready | Create patch release task |
| "Releases should be properly validated" | Pre-release checks | Execute release validation workflow |

## Implementation Status

- [ ] Generic VERSION_RELEASE_DEFAULT workflow
- [ ] Generic PATCH_RELEASE_DEFAULT workflow  
- [ ] Workflow selection logic (custom vs default)
- [ ] Release task generation system
- [ ] Integration with milestone completion detection
- [ ] Repository-specific workflow override capability
- [ ] Release readiness validation

---

*RELEASE Management - Generic release processes with repository-specific customization through task-driven execution*