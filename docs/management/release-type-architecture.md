[← Back to Claude-Swift Home](../../README.md)

# Release Type Architecture

## Overview

Claude-swift implements a dual release architecture that distinguishes between **Version Releases** (major development cycles) and **Fix Releases** (incremental improvements and bug fixes). This architecture ensures appropriate workflow overhead for different types of releases.

## Release Type Definitions

### **Version Release** (1.0.0 → 1.1.0 or 2.0.0)
**Purpose**: Major development cycle completion with strategic impact
**Characteristics**:
- Complete development cycle closure
- Full audit archiving and history preservation
- Comprehensive strategic release notes
- Version transition with fresh development start
- Complete workflow reset for next development cycle

**Examples**: 1.0.0 → 1.1.0, 1.5.0 → 2.0.0, 2.3.0 → 3.0.0

### **Fix Release** (1.0.0 → 1.0.1, 1.0.2, etc.)
**Purpose**: Incremental improvements, bug fixes, and minor enhancements
**Characteristics**:
- Continues current development cycle
- No audit archiving - maintains current logs
- Concise release notes focused on changes
- Version increment without cycle reset
- Maintains development continuity

**Examples**: 1.0.0 → 1.0.1, 1.2.3 → 1.2.4, 2.1.0 → 2.1.1

## Workflow Architecture

### **Current Implementation**
- **`release sesame`** → **VERSION_RELEASE** process (full workflow)
- Implemented for v1.0.0 foundation release

### **Needed Implementation**
- **`fix release sesame`** → **FIX_RELEASE** process (lightweight workflow)
- **Release type detection** within release workflows
- **Dual hook system** for different release customizations

## Release Process Comparison

| Aspect | Version Release | Fix Release |
|--------|----------------|-------------|
| **Audit Logs** | Archive to `audit/v{VERSION}/` | Continue in `audit/current/` |
| **Release Notes** | Comprehensive strategic assessment | Concise change summary |
| **Development Cycle** | Complete closure + fresh start | Continues current cycle |
| **Version Pattern** | Major.Minor bump | Patch increment only |
| **Workflow Weight** | Full workflow execution | Lightweight process |
| **Archive Creation** | Complete historical preservation | No archiving |
| **Next Development** | Version transition required | Immediate continuation |

## Semantic Versioning Integration

### **Version Release Triggers**
- **Major Version** (1.0.0 → 2.0.0): Breaking changes, architectural shifts
- **Minor Version** (1.0.0 → 1.1.0): New features, workflow capabilities, significant enhancements

### **Fix Release Triggers**
- **Patch Version** (1.0.0 → 1.0.1): Bug fixes, documentation improvements, minor workflow refinements

## Proposed Workflow Implementation

### **Release Type Detection**
```bash
# release sesame workflow enhancement:
echo "Release Type:"
echo "1. Version Release (1.x.0, x.0.0) - Full development cycle completion"
echo "2. Fix Release (1.0.x) - Bug fixes and incremental improvements"
read -p "Select release type [1/2]: " RELEASE_TYPE
```

### **Hook System Architecture**
```bash
# Dual hook implementation:
PROJECT_VERSION_RELEASE_PROCESS.md  # Full workflow customization
PROJECT_FIX_RELEASE_PROCESS.md      # Lightweight workflow customization
```

### **Workflow Integration**
```bash
# release sesame execution:
if [[ $RELEASE_TYPE == "1" ]]; then
    execute_version_release_workflow
else
    execute_fix_release_workflow
fi
```

## Fix Release Workflow Design

### **Simplified Process Steps**
1. **Pre-Release Validation**: Repository clean state check
2. **Fix Release Hook**: `PROJECT_FIX_RELEASE_PROCESS` customization
3. **Lightweight Commit**: Changes without audit archiving
4. **Tag Creation**: Patch version increment
5. **GitHub Release**: Concise release notes
6. **Branch Management**: Return to unplanned, continue development

### **No Audit Archiving**
- Current audit logs **continue uninterrupted**
- No session log archiving or concatenation
- Development history remains in `audit/current/`
- No development cycle reset

### **Concise Release Notes Template**
```markdown
# Claude-Swift v{VERSION} - Fix Release

## 🔧 Changes in this Release
- [List of specific fixes, improvements, or minor enhancements]
- [Each item should be concise and user-focused]

## 🐛 Bug Fixes
- [Specific bug fixes with brief descriptions]

## 📚 Documentation Updates
- [Any documentation improvements or corrections]

## ⚡ Minor Enhancements
- [Small improvements or workflow refinements]

---
*Fix release maintaining development continuity - no cycle reset required.*
```

## Benefits of Dual Architecture

### **Development Efficiency**
- **Appropriate overhead** for release scope and impact
- **Maintains momentum** for incremental improvements
- **Preserves development flow** for ongoing work

### **Release Quality**
- **Comprehensive documentation** for major releases
- **Focused communication** for incremental changes
- **Clear versioning strategy** aligned with development impact

### **Operational Excellence**
- **Flexible release cadence** based on development needs
- **Reduced friction** for minor improvements and bug fixes
- **Strategic milestone marking** for major achievements

## Implementation Priority

### **High Priority**
1. **PROJECT_FIX_RELEASE_PROCESS** hook creation
2. **Fix release workflow** implementation in WoW system
3. **Release type detection** in `release sesame` trigger

### **Medium Priority**
1. **Automated version increment** logic for fix releases
2. **Release notes template** standardization
3. **Workflow documentation** and usage guidelines

### **Future Enhancements**
1. **Automated release type suggestion** based on changes
2. **Integration with semantic versioning** validation
3. **Release analytics** and pattern tracking

## Integration with Existing System

### **Backward Compatibility**
- Current **`release sesame`** continues as VERSION_RELEASE
- All existing workflows and hooks remain functional
- No breaking changes to established patterns

### **Forward Evolution**
- **`fix release sesame`** or similar trigger for fix releases
- **Enhanced release type detection** within existing triggers
- **Gradual migration** to dual-type release system

## Success Metrics

### **Process Efficiency**
- Reduced overhead for incremental releases
- Faster release cycle for bug fixes and minor improvements
- Maintained quality for major version releases

### **Development Continuity**
- Uninterrupted development flow for fix releases
- Clear milestone marking for version releases
- Appropriate documentation depth for release scope

---

*This architecture enables claude-swift to maintain both strategic development cycles and responsive incremental improvements with appropriate process overhead for each release type.*