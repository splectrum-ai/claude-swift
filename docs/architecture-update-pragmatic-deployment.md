[← Back to Claude-Swift Home](../README.md)

# Architecture Update: Pragmatic Deployment Strategy

## Critical Architectural Decisions (2025-06-26)

### 1. Directory Structure Correction

**CORRECTED ARCHITECTURE**: `/claude/project/` and `/claude/wow/` (subdirectories)
**INCORRECT DOCUMENTATION**: `claude-project/` and `claude-wow/` (top-level directories)

**Actual Implementation**:
```
my-project/
└── claude/
    ├── project/           # Project docs
    └── wow/               # WoW machinery
```

**Status**: All documentation being systematically updated to reflect actual implementation.

### 2. Pragmatic Gitignore Strategy

**NEW POLICY**: **Both `/claude/project/` and `/claude/wow/` are TRACKED** for operational risk mitigation.

**Rationale**:
- **Operational Continuity**: Prevents work stoppages due to discipline violations
- **Change Visibility**: All Claude AI updates to workflows captured
- **Recovery Options**: Git history provides complete rollback capabilities
- **Risk Mitigation**: Mixed content visible but doesn't block progress

### 3. Deployment Strategy Matrix

| Deployment Type | Discipline Enforcement | Gitignore Strategy | Priority |
|----------------|----------------------|-------------------|----------|
| **Fresh Install** | Rigid separation enforced | Educational guidance only | Architectural purity |
| **Existing Install** | Soft warnings only | Track everything | Operational continuity |
| **Legacy Migration** | Guidance-based | Track everything | Work continuity |

### 4. Operational vs Architectural Priority

**Core Principle**: **Operational soundness over architectural purity** for existing installations.

**Fresh Installs**:
- ✅ Enforce rigid separation from day one
- ✅ Strong discipline enforcement prevents bad habits
- ✅ Clean architecture maintenance

**Existing Installs**:
- ✅ Track everything to avoid work disruption  
- ✅ Soft warnings instead of blocking errors
- ✅ Migration path available but not forced
- ✅ Gradual improvement over time

## Implementation Timeline

### Phase 1: Documentation Corrections (Current)
- [x] Identify all instances of incorrect path references
- [ ] Systematically update all documentation files
- [ ] Update deployment guides to reflect pragmatic strategy
- [ ] Document mixed-mode deployment procedures

### Phase 2: Workflow Updates
- [ ] Update deployment workflows to support both strategies
- [ ] Create mixed-mode deployment procedures
- [ ] Update validation scripts for pragmatic approach
- [ ] Document rollback procedures for both modes

### Phase 3: Template Updates  
- [ ] Update template files to reflect new architecture
- [ ] Ensure fresh installs use corrected structure
- [ ] Maintain backward compatibility for existing installs

## Key Benefits

### Operational Benefits
- **No Work Stoppages**: Discipline issues don't block progress
- **Complete Audit Trail**: All changes captured in git history
- **Flexible Recovery**: Multiple rollback options available
- **Gradual Improvement**: Architecture can evolve over time

### Technical Benefits
- **Accurate Documentation**: Reflects actual implementation
- **Consistent Naming**: Eliminates confusion between docs and reality
- **Better Tooling**: Tools can rely on consistent path structure
- **Easier Maintenance**: Single source of truth for architecture

## Migration Guidance

### For InfoMetis Deployment
- **Approach**: Operational-first strategy
- **Tracking**: All existing `/claude/` content tracked
- **Structure**: Add new `/claude/project/` and `/claude/wow/` subdirectories
- **Discipline**: Mixed state acceptable for legacy migration
- **Future**: Gradual separation improvement over time

## Quality Assurance

### Documentation Validation
- [ ] All instances of `claude-project/` corrected to `/claude/project/`
- [ ] All instances of `claude-wow/` corrected to `/claude/wow/`
- [ ] Gitignore strategy updated to reflect tracking policy
- [ ] Deployment guides updated for pragmatic approach

### Operational Validation
- [ ] InfoMetis deployment successful with operational-first approach
- [ ] Existing workflows function correctly with new structure
- [ ] Rollback procedures validated for both deployment modes
- [ ] Template system updated for fresh installs

## Success Metrics

### Technical Success
- ✅ Documentation consistent with implementation
- ✅ No work disruption during architecture updates
- ✅ All deployment modes function correctly
- ✅ Git tracking behavior predictable and reliable

### Operational Success  
- ✅ Teams can continue work during transitions
- ✅ Architecture improvements don't block progress
- ✅ Clear migration path for existing projects
- ✅ New projects start with clean architecture

---

*This document captures the architectural decisions made during interactive sidecar deployment learning session on 2025-06-26.*

[← Back to Claude-Swift Home](../README.md)