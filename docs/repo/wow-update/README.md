# WOW_UPDATE Service

**Repository Service: Framework Maintenance and Updates**

WOW_UPDATE provides automatic framework maintenance, applying structure updates, migrations, and enhancements whenever repositories are accessed, built on the 4 core responsibilities.

## Purpose

- **Framework Updates** - Apply any WoW framework changes automatically
- **Structure Migration** - Migrate to new folder structures seamlessly  
- **Configuration Updates** - Update configs for new features
- **Backward Compatibility** - Preserve existing functionality during transitions
- **Version Management** - Track and apply incremental framework updates

## Built on Core Responsibilities

WOW_UPDATE is implemented using all 4 core responsibilities:

- **INBOX/OUTBOX** - Update tasks flow through inbox detection
- **TASK** - Framework updates executed as tasks with batching
- **ISSUE** - Update requirements stored as issues when needed
- **WORKFLOW** - WOW_UPDATE workflow with TDC validation

## Trigger Mechanism

**MANDATORY execution** whenever `CLAUDE.md` is read:

```
User accesses repository →
CLAUDE.md read →
Check framework version →
Framework updates needed? →
├── No: Continue normally
└── Yes: Create WOW_UPDATE task → INBOX → TASK execution
```

## TDC Implementation

WOW_UPDATE serves as the **first TDC implementation**, demonstrating the complete framework:

### **Creation Test**
```javascript
// "Is framework update needed and safe to apply?"
function creationTest() {
    return {
        frameworkOutdated: checkFrameworkVersion(),
        structureMissing: checkRequiredStructure(), 
        safeToUpdate: validateBackwardCompatibility(),
        updatesAvailable: getRequiredUpdates()
    };
}
```

### **Execution Process**
```javascript
// Apply required updates incrementally
function executeUpdates(requiredUpdates) {
    for (const update of requiredUpdates) {
        switch(update.type) {
            case 'create_structure':
                createNewFolders(update.spec);
                break;
            case 'migrate_data':
                migrateData(update.source, update.target);
                break;
            case 'update_config':
                updateConfiguration(update.changes);
                break;
        }
    }
}
```

### **Sign-off Test**  
```javascript
// "Are updates properly applied and functional?"
function signOffTest() {
    return {
        structureValid: validateNewStructure(),
        configsUpdated: validateConfigurations(),
        backwardCompatible: testLegacyFunctionality(),
        versionCurrent: checkFrameworkVersion()
    };
}
```

## Framework Version Management

### **Version Tracking**
```json
claude/wow/version.json:
{
  "framework_version": "2.0.0",
  "schema_version": "1.0.0", 
  "last_updated": "2025-07-27T10:00:00Z",
  "required_updates": [
    {
      "id": "create_4core_structure",
      "description": "Create 4 core responsibility structure",
      "version": "2.0.0",
      "type": "structure"
    },
    {
      "id": "setup_repo_folder",
      "description": "Initialize repo-specific folder",
      "version": "2.0.0", 
      "type": "structure"
    }
  ]
}
```

### **Update Types**
- **Structure updates** - New core responsibility folders  
- **Data migrations** - Move data between old/new structures
- **Configuration changes** - Update settings and parameters
- **Script updates** - New or modified management scripts
- **Workflow updates** - New or enhanced workflow definitions

## Current Transition Updates

### **Structure Creation (v2.0.0)**
```
WOW_UPDATE creates:
claude/
├── project/                # PRESERVE - backward compatibility
├── repo/                  # NEW - repository-specific structures  
│   ├── workflows/         # Repository workflows
│   ├── config/           # Repository configuration
│   └── [repo-specific]/   # Based on repository needs
├── tasks/                # NEW - TASK Management
│   ├── inbox/
│   ├── outbox/
│   ├── active/
│   └── completed/
├── issues/               # ENHANCED - new structure + existing
│   ├── unassigned/
│   ├── milestones/       # NEW - enhanced organization
│   └── templates/
└── wow/                  # EXISTING - enhanced framework
```

### **Migration Strategy**
- ✅ **Non-destructive** - Keep all existing functionality
- ✅ **Incremental** - Apply only needed updates
- ✅ **Testable** - Each update validates before proceeding
- ✅ **Rollback-safe** - Original structure preserved

## Task Execution Example

### **WOW_UPDATE Task**
```markdown
---
workflow: WOW_UPDATE
priority: high
source_repo: local
commit_message_part: |
  [Framework] Apply WOW_UPDATE framework maintenance
  
  - Created 4 core responsibility structure (tasks/, issues/, workflows/)
  - Set up repo-specific folder with repository configuration
  - Migrated existing data to enhanced structure
  - Preserved backward compatibility with project/ folder
  
  Context: Framework update to 4-core INBOX-driven architecture
---

# Task: Execute WOW_UPDATE Framework Maintenance

## Execution Context
Framework version: 1.5.0 → 2.0.0
Required updates: create_4core_structure, setup_repo_folder
Backward compatibility: Required

## Issue Content
[Framework update issue with complete specification per WOW_UPDATE workflow]
```

## Integration with Core Responsibilities

### **Task Flow**
```
Framework update needed →
Create WOW_UPDATE task →
INBOX detection →
TASK execution (with batching) →
WORKFLOW execution (TDC tests) →
COMMIT with audit trail →
Task cleanup
```

### **Audit Trail**
All framework updates become part of commit history:
```
[Framework] Apply WOW_UPDATE framework maintenance
- Structure updates applied
- Configurations migrated  
- Backward compatibility preserved
Context: Automatic framework maintenance
Workflow: WOW_UPDATE
```

## Commands

- Automatic execution (no manual commands needed)
- `wow-update-manage status` - Check framework version and pending updates
- `wow-update-manage force` - Force framework update check
- `wow-update-manage rollback` - Rollback recent updates (emergency)

## Benefits

- ✅ **Seamless updates** - Repositories automatically stay current
- ✅ **Zero manual effort** - Updates applied transparently
- ✅ **Full audit trail** - All changes tracked in commit history
- ✅ **TDC demonstration** - Proves framework works end-to-end
- ✅ **Backward compatible** - Never breaks existing functionality
- ✅ **Version aware** - Only applies needed updates

## Implementation Status

- [ ] Framework version detection system
- [ ] WOW_UPDATE workflow with TDC tests
- [ ] Automatic trigger on CLAUDE.md read
- [ ] Structure creation and migration logic
- [ ] Backward compatibility preservation
- [ ] Task-based execution integration
- [ ] Commit-based audit trail

---

*WOW_UPDATE Service - Automatic framework maintenance built on 4 core responsibilities, serving as first TDC implementation*