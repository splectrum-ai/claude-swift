[← Back to Claude-Swift Home](../../README.md)

# Migration Deployment Guide

## Overview

This guide covers the complete migration process from legacy `/claude/` structure to the dual-folder architecture (`/claude-project/` + `/claude-wow/`). The migration uses a sidecar deployment pattern with phased execution and built-in rollback capabilities.

## Architecture Transition

**From (Legacy)**:
```
my-project/
└── claude/                    # Mixed content (tracked)
    ├── workflows/
    ├── audit/
    ├── operational-docs/
    └── project-specific-docs/
```

**To (Target)**:
```
parent-directory/
├── my-project/
│   ├── claude-project/        # Project docs (tracked)
│   │   ├── requirements.md
│   │   ├── architecture.md
│   │   └── team-agreements.md
│   └── claude-wow/            # WoW machinery (ignored)
│       ├── workflows/
│       ├── audit/
│       └── operational-docs/
└── claude-swift/              # Template repo (sidecar)
```

## Migration Phases

### Phase 1: Preparation (Rollback Safe)
1. **Sidecar Setup**
   ```bash
   cd parent-directory/
   git clone https://github.com/SPlectrum/claude-swift.git
   ```

2. **Backup Creation**
   ```bash
   cd my-project/
   cp CLAUDE.md CLAUDE.md.backup
   cp -r claude/ claude.backup/
   ```

3. **Content Analysis**
   - Run migration analysis script from claude-swift
   - Classify existing `/claude/` content as project vs WoW
   - Generate migration plan with content mapping

**Rollback**: Delete claude-swift directory, remove backups

### Phase 2: Structure Deployment (Rollback Safe)
1. **Deploy Dual Structure**
   - Create `/claude-project/` with template content
   - Create `/claude-wow/` with WoW machinery
   - Update `.gitignore` to exclude `claude-wow/`

2. **Content Migration**
   - Extract project-specific content → `/claude-project/`
   - Deploy WoW operational data → `/claude-wow/`
   - Update `CLAUDE.md` to reference new structure

3. **Validation**
   - Start new Claude Code session
   - Verify workflows function with new structure
   - Test critical operations

**Rollback**: 
```bash
cp CLAUDE.md.backup CLAUDE.md
rm -rf claude-project/ claude-wow/
# Restart terminal session
```

### Phase 3: Migration Validation (Rollback Safe)
1. **Operational Testing**
   - Run typical workflows from new structure
   - Verify audit logging works correctly
   - Test session start/end procedures

2. **Content Verification**
   - Confirm all project documentation preserved
   - Verify WoW functionality intact
   - Check gitignore behavior

3. **User Acceptance**
   - Team validation of new structure
   - Confirmation migration meets requirements

**Rollback**: Same as Phase 2

### Phase 4: Cleanup (Point of No Return)
⚠️ **WARNING: After this phase, rollback requires manual reconstruction**

1. **Remove Legacy Structure**
   ```bash
   rm -rf claude/
   rm -rf claude.backup/
   ```

2. **Remove Rollback Files**
   ```bash
   rm CLAUDE.md.backup
   ```

3. **Commit New Structure**
   ```bash
   git add .
   git commit -m "Migrate to claude-project/claude-wow dual structure"
   ```

## Rollback Procedures

### Emergency Rollback (Before Cleanup)
1. **Restore Original Configuration**
   ```bash
   cp CLAUDE.md.backup CLAUDE.md
   rm -rf claude-project/ claude-wow/
   ```

2. **Flush Memory**
   - Exit terminal/Claude Code session
   - Restart terminal
   - Start new Claude Code session

3. **Verify Restoration**
   - Claude loads original operational context
   - System functions as before migration attempt

### Post-Cleanup Recovery
If cleanup has been executed, recovery requires:
1. Manual reconstruction of original structure
2. Content restoration from git history
3. CLAUDE.md recreation from backup or git history

## Migration Script Framework

### Sidecar Migration Command
```bash
# From claude-swift directory
./deploy migrate --target ../my-project --analyze-only
./deploy migrate --target ../my-project --execute
./deploy migrate --target ../my-project --cleanup
```

### Content Classification Rules
- **Project Content**: Requirements, architecture, team agreements, project-specific documentation
- **WoW Content**: Workflows, audit logs, operational procedures, system configuration

### Safety Mechanisms
1. **Mandatory Backups**: All destructive operations require backup creation
2. **Phased Execution**: Clear boundaries between reversible and irreversible phases
3. **Validation Gates**: Required testing between phases
4. **Rollback Documentation**: Clear procedures for every phase

## Success Criteria

### Technical Validation
- ✅ New structure deploys successfully
- ✅ All workflows function correctly
- ✅ GitIgnore behavior correct (claude-wow/ ignored)
- ✅ Audit logging works with new paths

### Content Preservation
- ✅ All project documentation preserved
- ✅ No WoW functionality lost
- ✅ Historical audit data available

### Operational Continuity
- ✅ Team can work with new structure
- ✅ Claude Code operates normally
- ✅ Upgrade path for future enhancements clear

## Post-Migration Benefits

1. **Clean Separation**: Project repos contain only relevant content
2. **Upgrade Safety**: WoW updates don't conflict with project content
3. **Repository Size**: Reduced project repo size (no WoW machinery)
4. **Developer Experience**: Clear boundary between project and operational content
5. **Template Evolution**: Easy upgrades through sidecar claude-swift updates

## Migration Timeline

- **Analysis Phase**: 30 minutes (content classification)
- **Deployment Phase**: 60 minutes (structure creation and content migration)
- **Validation Phase**: 90 minutes (testing and team acceptance)
- **Cleanup Phase**: 15 minutes (irreversible cleanup)

**Total**: ~3 hours with validation breaks between phases

## Support and Troubleshooting

For migration issues:
1. Stop at current phase
2. Use appropriate rollback procedure
3. Review migration logs and analysis output
4. Consult template repository documentation
5. Test fixes in separate branch before retry

Migration success depends on careful phase execution and thorough validation at each step.

---

[← Back to Claude-Swift Home](../README.md)