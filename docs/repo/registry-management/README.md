# REGISTRY Management

**Core Responsibility 6: Workflow Discovery and Management (Transitional)**

REGISTRY provides workflow discovery, resolution, and management capabilities as an embedded service within Claude-Swift, designed for eventual extraction to dedicated repository.

## Purpose

- **Workflow Discovery** - Find available workflows by name, type, or functionality
- **Workflow Resolution** - Determine which workflow definition to use (repository vs WoW vs registry)
- **Standard Library** - Provide collection of proven, reusable workflows
- **Version Management** - Handle workflow versions and dependencies
- **Bootstrap Registry** - Transitional embedded registry for framework development

## Transitional Architecture

### **Current Phase: Embedded Registry**
- **Location**: `claude/registry/` within Claude-Swift
- **Purpose**: Bootstrap the TDC framework with workflow management
- **Scope**: Internal to Claude-Swift development and testing
- **Migration Path**: Extract to dedicated repository when requirements are clear

### **Future Phase: Dedicated Registry**
- **Location**: Separate `workflow-registry` repository
- **Purpose**: Central registry for workflow ecosystem
- **Scope**: Distributed registry serving multiple organizations
- **Benefits**: Scalability, versioning, community workflows

## Registry Structure

### **Embedded Registry Layout**
```
claude/registry/
├── index.json                    # Registry metadata and search index
├── workflows/                    # Standard workflow library
│   ├── DEPLOY/                  # Standard deployment workflow
│   │   ├── creation/
│   │   ├── execution/
│   │   └── sign-off/
│   ├── TEST/                    # Standard testing workflow
│   ├── BUILD/                   # Standard build workflow
│   ├── DOCUMENTATION/           # Documentation workflow
│   └── [additional standard workflows]/
├── api/                         # Registry management scripts
│   ├── search.js               # Workflow search and discovery
│   ├── register.js             # Register new workflows
│   └── resolve.js              # Workflow resolution logic
└── metadata/
    ├── dependencies.json       # Workflow dependency tracking
    └── versions.json           # Workflow version management
```

### **Registry Index Format**
```json
{
  "registry_version": "1.0.0",
  "last_updated": "2025-07-27T10:00:00Z",
  "workflows": {
    "DEPLOY": {
      "name": "DEPLOY",
      "description": "Standard deployment workflow",
      "version": "1.2.0",
      "location": "workflows/DEPLOY",
      "tags": ["deployment", "production", "standard"],
      "dependencies": [],
      "compatibility": ["all"]
    },
    "TEST": {
      "name": "TEST", 
      "description": "Standard testing workflow",
      "version": "1.0.0",
      "location": "workflows/TEST",
      "tags": ["testing", "validation", "standard"],
      "dependencies": ["BUILD"],
      "compatibility": ["javascript", "python", "general"]
    }
  }
}
```

## Workflow Resolution Logic

### **Resolution Hierarchy**
```javascript
function resolveWorkflow(workflowName) {
    // 1. Repository-specific workflow (highest priority)
    if (exists(`claude/workflows/${workflowName}`)) {
        return `claude/workflows/${workflowName}`;
    }
    
    // 2. Registry standard workflow  
    if (registryHasWorkflow(workflowName)) {
        return `claude/registry/workflows/${workflowName}`;
    }
    
    // 3. WoW framework workflow (fallback)
    if (exists(`claude/wow/workflows/${workflowName}`)) {
        return `claude/wow/workflows/${workflowName}`;
    }
    
    // 4. Request/create workflow
    return requestWorkflow(workflowName);
}
```

### **Priority Order:**
1. **Repository workflows** - Project-specific customizations
2. **Registry workflows** - Standard proven workflows  
3. **WoW workflows** - Framework defaults
4. **Dynamic creation** - Generate if missing

## Registry Functions

### **Discovery Operations**
- **Search workflows** by name, tags, or description
- **List available** workflows with metadata
- **Find dependencies** for workflow chains
- **Browse by category** (deployment, testing, etc.)

### **Management Operations**
- **Register workflow** - Add new workflow to registry
- **Update workflow** - Modify existing workflow definition
- **Version workflow** - Manage workflow versions
- **Validate workflow** - Check workflow completeness

### **Resolution Operations**
- **Resolve workflow** - Find appropriate workflow definition
- **Check dependencies** - Validate workflow requirements
- **Load workflow** - Retrieve workflow for execution

## Integration Points

### With WORKFLOW Management
- **Provides**: Workflow discovery and resolution services
- **Receives**: Workflow validation and execution results
- **Enables**: Dynamic workflow loading and standard library access

### With TASK Management
- **Resolves**: Workflow names to actual definitions
- **Provides**: Workflow metadata for task execution
- **Supports**: Dynamic workflow assignment

### With Repository Workflows
- **Registers**: Local repository workflows for discoverability
- **Indexes**: Repository-specific workflow metadata
- **Integrates**: Local workflows with standard library

## Commands

- `registry sesame` - Manage workflow registry
- `registry-manage search <query>` - Find workflows
- `registry-manage list` - Show all available workflows  
- `registry-manage register <workflow>` - Add workflow to registry
- `registry-manage resolve <name>` - Show resolution path for workflow

## Transitional Benefits

### **Bootstrap Phase:**
- ✅ **Quick start** - No external dependencies
- ✅ **Fast iteration** - Direct access to workflows
- ✅ **Requirements discovery** - Learn what registry needs
- ✅ **Proof of concept** - Validate TDC workflow patterns

### **Migration Readiness:**
- ✅ **Clear API** - Registry interface defined for extraction
- ✅ **Standard format** - Workflow definitions ready for migration
- ✅ **Version management** - Workflow versioning patterns established
- ✅ **Dependency tracking** - Workflow relationships mapped

## Migration Path

### **Phase 1: Embedded (Current)**
- Registry embedded in Claude-Swift
- Standard workflow library established
- Resolution patterns proven

### **Phase 2: Extraction**
- Extract registry to dedicated repository
- API becomes network-based
- Registry becomes shared service

### **Phase 3: Distribution**  
- Multiple registry instances
- Federated workflow discovery
- Community workflow ecosystem

## Implementation Status

- [ ] Basic registry structure and index
- [ ] Workflow resolution logic  
- [ ] Standard workflow library (DEPLOY, TEST, BUILD)
- [ ] Registry search and discovery API
- [ ] Integration with WORKFLOW Management
- [ ] Version and dependency management
- [ ] Migration planning for dedicated repository

---

*REGISTRY Management - Transitional workflow discovery service, designed for eventual extraction to dedicated registry*