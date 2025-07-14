[← Back to Claude-Swift Home](../../README.md)

# Sidecar Deployment Guide

## Overview

This guide covers deployment of the claude-swift template system using the sidecar pattern. Unlike migration (which transitions legacy systems), deployment handles fresh installs, maintenance updates, and discipline recovery for the dual-folder architecture.

## Deployment Scenarios

### Scenario 1: Fresh Project Deployment
New project with no existing Claude structure.

### Scenario 2: Maintenance Deployment  
Existing dual-folder project requiring WoW updates or template refresh.

### Scenario 3: Discipline Recovery
Existing dual-folder project where operational data discipline was not maintained (content mixed between `claude-project/` and `claude-wow/`).

## Sidecar Architecture

```
parent-directory/
├── my-project/
│   └── claude/
│       ├── project/           # Project docs (tracked)
│       └── wow/               # WoW machinery (tracked for operational risk mitigation)
└── claude-swift/              # Template repo (sidecar)
    ├── template/
    ├── deployment/
    └── claude/                # Source of truth
```

## Pre-Deployment Analysis

### Fresh Project Analysis
```bash
# From parent directory
cd my-project/
./deploy analyze --type fresh
```

**Checks**:
- ✅ No existing Claude structure
- ✅ Project repository clean
- ✅ .gitignore compatibility
- ✅ Deployment prerequisites met

### Maintenance Analysis  
```bash
cd my-project/
./deploy analyze --type maintenance
```

**Checks**:
- ✅ Dual-folder structure exists
- ✅ Operational data discipline maintained
- ⚠️ Content classification validation
- ⚠️ Upgrade compatibility assessment

### Discipline Validation
```bash
cd my-project/
./deploy analyze --type discipline
```

**Validation Rules**:
- `/claude-project/` contains ONLY project-specific content
- `/claude-wow/` contains ONLY WoW operational content
- No audit logs in `/claude-project/`
- No project requirements in `/claude-wow/`

**Discipline Violations**:
- Mixed content detection
- Incorrect file placement identification  
- Content classification recommendations

## Deployment Procedures

### Fresh Project Deployment

1. **Sidecar Setup**
   ```bash
   cd parent-directory/
   git clone https://github.com/SPlectrum/claude-swift.git
   cd claude-swift/
   ```

2. **Deploy Dual Structure**
   ```bash
   ./deploy fresh --target ../my-project
   ```
   
   **Actions**:
   - Create `/claude-project/` with project template content
   - Create `/claude-wow/` with WoW operational machinery
   - Deploy `CLAUDE.md` configured for dual-folder structure
   - Update `.gitignore` to exclude `claude-wow/`

3. **Validation**
   ```bash
   cd ../my-project/
   # Start Claude Code session to verify functionality
   ```

### Maintenance Deployment

1. **Pre-Deployment Backup**
   ```bash
   cd my-project/
   cp CLAUDE.md CLAUDE.md.backup
   cp -r claude-project/ claude-project.backup/
   ```

2. **Execute Maintenance**
   ```bash
   cd ../claude-swift/
   ./deploy maintenance --target ../my-project
   ```
   
   **Actions**:
   - Update `/claude-wow/` with latest WoW machinery
   - Preserve all `/claude-project/` content unchanged
   - Update `CLAUDE.md` if template changes exist
   - Maintain `.gitignore` compliance

3. **Validation & Rollback**
   ```bash
   cd ../my-project/
   # Test functionality - if issues:
   cp CLAUDE.md.backup CLAUDE.md
   rm -rf claude-wow/
   cp -r claude-project.backup/ claude-project/
   # Restart terminal session
   ```

### Discipline Recovery Deployment

⚠️ **Critical**: Discipline violations require careful content separation

1. **Discipline Analysis**
   ```bash
   cd my-project/
   ../claude-swift/deploy analyze --type discipline --detailed
   ```
   
   **Output**:
   - Content classification report
   - Violation identification  
   - Recommended content moves
   - Risk assessment

2. **Create Recovery Plan**
   ```bash
   ../claude-swift/deploy recovery-plan --target .
   ```
   
   **Generates**:
   - Content move commands
   - Backup procedures
   - Validation checklist
   - Rollback instructions

3. **Execute Recovery**
   ```bash
   # Create comprehensive backup
   cp -r claude-project/ claude-project.corrupted.backup/
   cp -r claude-wow/ claude-wow.corrupted.backup/
   cp CLAUDE.md CLAUDE.md.corrupted.backup
   
   # Execute recovery
   ../claude-swift/deploy recovery --target . --execute
   ```

4. **Post-Recovery Validation**
   ```bash
   ../claude-swift/deploy analyze --type discipline
   # Should show: ✅ All discipline checks passed
   ```

## Rollback Procedures

### Standard Rollback (Maintenance/Fresh)
```bash
cd my-project/
cp CLAUDE.md.backup CLAUDE.md
rm -rf claude-project/ claude-wow/
# Restart terminal session for memory flush
```

### Discipline Recovery Rollback
```bash
cd my-project/
cp CLAUDE.md.corrupted.backup CLAUDE.md
rm -rf claude-project/ claude-wow/
cp -r claude-project.corrupted.backup/ claude-project/
cp -r claude-wow.corrupted.backup/ claude-wow/
# Restart terminal session
```

## Deployment Commands Reference

### Analysis Commands
```bash
./deploy analyze --type [fresh|maintenance|discipline]
./deploy analyze --type discipline --detailed
./deploy validate --target ../project-name
```

### Deployment Commands  
```bash
./deploy fresh --target ../project-name
./deploy maintenance --target ../project-name
./deploy recovery --target ../project-name
```

### Utility Commands
```bash
./deploy backup --target ../project-name
./deploy rollback --target ../project-name
./deploy cleanup --target ../project-name
```

## Content Discipline Rules

### claude-project/ (Tracked Content)
**Allowed**:
- Project requirements and specifications
- Architecture documentation
- Team agreements and processes
- Project-specific operational guidelines
- Custom workflow adaptations

**Forbidden**:
- Audit logs
- WoW workflow definitions
- Template system documentation
- Operational machinery

### claude-wow/ (Ignored Content)
**Allowed**:
- WoW workflow definitions
- Audit logs and operational history
- Template system documentation
- Operational machinery and utilities

**Forbidden**:
- Project-specific documentation
- Requirements and specifications
- Team agreements
- Custom business logic

## Deployment Safety

### Backup Strategy
- **Always backup** before deployment operations
- **Preserve original state** until validation complete
- **Document rollback path** for every deployment type

### Validation Gates
- **Pre-deployment**: System compatibility and prerequisite checks
- **Post-deployment**: Functionality verification and discipline validation
- **Operational**: Claude Code session testing with new structure

### Risk Mitigation
- **Phased deployment**: Separate backup, deployment, and validation phases
- **Automated rollback**: Scripts for rapid restoration of previous state
- **Discipline monitoring**: Ongoing validation of content separation

## Troubleshooting

### Common Issues

**Issue**: Deployment fails due to existing content conflicts
**Solution**: Run discipline analysis, resolve violations, retry deployment

**Issue**: Claude Code doesn't recognize new structure after deployment  
**Solution**: Verify CLAUDE.md deployment, restart terminal session

**Issue**: Git tracking incorrect files after deployment
**Solution**: Verify .gitignore deployment, run `git status` to confirm ignored files

**Issue**: Rollback doesn't restore full functionality
**Solution**: Ensure terminal session restart for memory flush, verify backup completeness

### Support Escalation
1. Run full deployment analysis with `--detailed` flag
2. Collect deployment logs and error output
3. Document current project state and attempted operations
4. Test rollback procedures before requesting assistance

## Post-Deployment Operations

### Regular Maintenance
- Periodic discipline validation
- Template system updates via maintenance deployment
- Backup rotation and cleanup

### Upgrade Path
- Monitor claude-swift template repository for updates
- Execute maintenance deployment for template upgrades
- Validate operational continuity after upgrades

### Team Onboarding  
- Document dual-folder structure for new team members
- Establish content discipline training
- Provide rollback procedures for emergency situations

## Success Metrics

**Technical Success**:
- ✅ Dual-folder structure deployed correctly
- ✅ Operational data discipline maintained
- ✅ Claude Code functions with new structure
- ✅ Git tracking behavior correct

**Operational Success**:
- ✅ Team adopts new structure successfully
- ✅ WoW functionality preserved/enhanced
- ✅ Project development continues uninterrupted
- ✅ Upgrade/maintenance procedures validated

**Quality Success**:
- ✅ Content separation maintained over time
- ✅ No operational discipline violations
- ✅ Clear understanding of rollback procedures
- ✅ Successful template system evolution path established

---

[← Back to Claude-Swift Home](../README.md)