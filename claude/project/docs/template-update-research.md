# Template Update Research

## Overview

Research and findings from manual template update procedures, specifically focusing on updating existing dual-folder projects (like InfoMetis) with latest claude-swift template improvements.

## Research Objectives

1. **WoW Validation** - Identify user amendments in target repository that conflict with template updates
2. **Project Scaffolding Assessment** - Determine which template scaffolding applies to existing projects
3. **Selective Deployment** - Develop procedures for updating only appropriate parts while preserving customizations
4. **Procedure Development** - Create operational workflow for template updates based on real findings

## Manual Verification Cases

### Case 1: InfoMetis Repository Update
**Target**: Update InfoMetis with v1.0.1 claude-swift improvements
**Date**: 2025-07-06
**Scope**: Update WoW framework with enhanced GitHub workflows and operational rules

#### Pre-Update Analysis

**Current InfoMetis State:**
- WoW version: Pre-v1.0.1 (missing recent enhancements)
- CLAUDE.md differences: InfoMetis has additional rules not in template
- Project customizations: InfoMetis-specific content and rules

**Template Changes Since Last Update:**
- Enhanced GITHUB_WORKFLOW with mandatory issue closure
- Improved SESSION_START with uncommitted work handling
- Updated OPERATIONAL_RULES with broader collaborative decision-making
- Enhanced DOCUMENTATION_WORKFLOW with patch release policy

#### Verification Steps
*Document each step as performed*

1. **WoW Drift Analysis**
   - [ ] Compare InfoMetis `claude/wow/` against template
   - [ ] Identify user modifications that need preservation
   - [ ] Note conflicts with template updates

2. **Project Structure Assessment**
   - [ ] Review InfoMetis `claude/project/` structure
   - [ ] Determine which template scaffolding applies
   - [ ] Identify customizations to preserve

3. **Selective Update Testing**
   - [ ] Test updating specific WoW files
   - [ ] Validate preservation of customizations
   - [ ] Document update conflicts and resolutions

#### Findings
*Capture discoveries as they happen*

**CLAUDE.md Comparison Results:**
- InfoMetis has **additional rules** not in template:
  - "Critical Session Start Git Status Rule" (detailed git status checking)
  - "Critical Workflow Optimization Rule" (mandatory workflow improvements)
- Template has **new features** not in InfoMetis:
  - "Universal positive affirmation" sesame magic word
  - Updated VERSION_TRANSITION (6-step vs 5-step)
- Core structure is identical (same file reference rules, audit format rules)

**WoW Modifications Found:**
- **Major workflow files with differences** (12 files total):
  - GITHUB_WORKFLOW.md, SESSION_START.md, DOCUMENTATION_WORKFLOW.md
  - AUDIT_LOGGING.md, NEW_VERSION_PLANNING.md, RELEASE_PROCESS.md
  - SESSION_END.md, VERSION_TRANSITION.md
- **Files only in template** (InfoMetis missing):
  - `config.md` - WoW system configuration (NEW - valuable addition)
  - `workflows/TEMPLATE_SYNCHRONIZATION.md` - Template sync workflow (claude-swift specific)
- **Files only in InfoMetis** (template missing):
  - `automation/project-automation.js` - **LEGACY FILE FOR REMOVAL**
    - Old 449-line GitHub Projects v2 automation script from deprecated workflow
    - Previously used for planned work management via GitHub projects
    - No longer needed - should be removed from InfoMetis
- **Automation scripts differ**: Multiple .js files have differences

**Key Missing Enhancements in InfoMetis:**
- **GITHUB_WORKFLOW.md**: Missing Quick Start Commands, Integration Points, mandatory rules
- **SESSION_START.md**: Missing UNCOMMITTED WORK CHECK procedures  
- **DOCUMENTATION_WORKFLOW.md**: Missing superseded documentation lifecycle rules
- **config.md**: Missing entire WoW system configuration file

**Project Scaffolding Compatibility:**
- **InfoMetis has scaffolding NOT in template:**
  - `docs/README.md` - Project documentation directory placeholder
  - `workflows/README.md` - Project workflows directory placeholder  
  - `audit/session_*.log` files - Actual session history (project-specific data)
- **Template has scaffolding NOT in InfoMetis:**
  - `workflows/PROJECT_VERSION_TRANSITION.md` - Claude-swift specific version transition hook
- **Scaffolding Assessment:**
  - InfoMetis README files are generic placeholder scaffolding (good for template)
  - Template's PROJECT_VERSION_TRANSITION is claude-swift specific (not applicable to InfoMetis)
  - Session logs are real project data (should not be in template)

**InfoMetis-Specific Content Found in WoW (Should be cleaned up):**
- **GITHUB_WORKFLOW.md**: References to "SPlectrum Engines" epic
- **AUDIT_LOGGING.md**: Reference to "SPlectrum development activities"  
- **RELEASE_PROCESS.md**: Reference to "SPlectrum.exe, SPlectrum.7z packages"
- **Automation scripts**: Multiple references to SPlectrum paths and operations
  - `archive-audit-logs.js`: Hardcoded SPlectrum paths (/mnt/c/SPlectrum/spl1/)
  - `get-started-generator.js`: SPlectrum-specific content generation

**Update Conflicts:**
- InfoMetis WoW has project-specific content that needs cleaning during template updates

**Successful Update Procedures:**
- ✅ **CLAUDE.md Updates Applied**: Updated InfoMetis CLAUDE.md with template improvements
  - Added "Single-Word Sesame Magic Word" section 
  - Updated VERSION_TRANSITION reference (5-step → 6-step)
  - Simple file edits, no conflicts encountered
- ✅ **Legacy File Cleanup**: Removed obsolete automation from InfoMetis
  - Deleted `claude/wow/automation/project-automation.js` (449 lines)
  - Legacy GitHub Projects v2 automation no longer needed
  - Clean removal, no dependencies found
- ✅ **Complete WoW Update**: Copied template WoW to InfoMetis WoW
  - All 12+ workflow files updated with v1.0.1 enhancements
  - Added new `config.md` WoW system configuration
  - Added `TEMPLATE_SYNCHRONIZATION.md` workflow  
  - Automation scripts updated with template placeholders
  - SPlectrum contamination cleaned up automatically
- ✅ **WoW Synchronization Verified**: InfoMetis WoW now matches template WoW perfectly
  - Zero file differences after update
  - Complete synchronization achieved

#### Lessons Learned
*Document insights for workflow development*

**InfoMetis Rules Worth Considering for Claude-Swift:**
- **Workflow Optimization Concept**: InfoMetis has "Critical Workflow Optimization Rule" requiring immediate rule additions when failures occur
- **Alternative Approach**: Instead of disruptive immediate rule changes, implement failure reporting system
  - Structured failure logging during sessions
  - Periodic review and analysis of failure patterns  
  - Evidence-based workflow improvements during version planning
  - Visibility reports for systematic optimization
- **Implementation**: Could add `claude/project/docs/workflow-failure-log.md` for ongoing issue capture

**InfoMetis Scaffolding Worth Adding to Claude-Swift Template:**
- **`claude/project/docs/README.md`** - Generic documentation directory placeholder
  - Explains purpose: project requirements, architecture, team agreements
  - Provides usage guidance for project-specific documentation
  - Includes note about removing file once documentation is added
- **`claude/project/workflows/README.md`** - Generic workflows directory placeholder
  - Explains purpose: custom workflow adaptations, project procedures
  - Provides guidance for extending base WoW system
  - Includes note about removing file once workflows are added

**What Works:**
- **Selective CLAUDE.md updates** - Simple file edits for non-controversial improvements
- **Full WoW directory synchronization** - Complete copy operation cleanly replaces all content
- **Legacy file identification and removal** - Manual cleanup of obsolete project-specific automation
- **Template placeholder system** - Automatic cleanup of project contamination during copy
- **Directory comparison validation** - Confirms complete synchronization success

**What Doesn't Work:**
- **File-by-file WoW updates** - Too many files with substantial changes (12+ workflows)
- **Preserving InfoMetis WoW customizations** - Legacy SPlectrum content was contamination, not valuable customizations

**Procedure Improvements Needed:**
- **Automated contamination detection** - Scan for project-specific references before update
- **Legacy file detection** - Identify obsolete files for removal during updates
- **Project scaffolding integration** - Systematic way to add valuable InfoMetis scaffolding to template
- **Verification automation** - Automated diff checking for update confirmation

## Research Conclusions

### Template Update Procedure Proven Effective

**Manual verification successfully updated InfoMetis with v1.0.1 claude-swift improvements through:**

1. **Selective Component Updates** - CLAUDE.md updated with targeted improvements
2. **Complete Framework Replacement** - WoW directory fully synchronized with template  
3. **Legacy Cleanup** - Obsolete automation removed during update process
4. **Verification Confirmation** - Zero differences achieved between InfoMetis and template

### Recommended TEMPLATE_UPDATE_WORKFLOW Elements

1. **Pre-Update Analysis**
   - Scan for project-specific contamination in target WoW
   - Identify legacy files for removal
   - Document target project customizations worth preserving

2. **Selective Update Strategy**
   - CLAUDE.md: File-level edits for non-controversial improvements
   - WoW: Complete directory replacement for comprehensive updates
   - Project: Preserve existing content, assess scaffolding needs

3. **Post-Update Validation**
   - Directory comparison to confirm synchronization
   - Functionality verification of updated workflows
   - Documentation of changes applied

### Automation Opportunities

- **Contamination Scanner**: Automated detection of project-specific references
- **Legacy File Detection**: Pattern matching for obsolete automation files
- **Scaffolding Analyzer**: Compare project structures for valuable additions
- **Update Verification**: Automated diff checking and reporting

### Risk Mitigation Strategies

- **Backup Creation**: Full repository backup before template updates
- **Staged Application**: Update components incrementally with validation
- **Rollback Capability**: CLAUDE.md replacement pattern for quick recovery
- **User Confirmation**: Interactive approval for significant changes detected

## Next Steps

1. ✅ **Complete InfoMetis Manual Update** - Successfully executed and documented
2. **Execute spl1 Legacy Migration** - CURRENT: Final legacy repository migration + v1.0.1 updates
3. **Develop Operational Workflow** - Create formal TEMPLATE_UPDATE_WORKFLOW based on proven findings
4. **Test Procedure on Additional Projects** - Validate workflow with other repositories (claude-prince2)
5. **Create Automation Tools** - Build tooling to support the manual procedures
6. **Add InfoMetis Scaffolding to Template** - Integrate valuable README.md placeholders into claude-swift template

---

### Case 2: spl1 Legacy Migration (CURRENT)
**Target**: Migrate spl1 from legacy single-folder to modern dual-folder + v1.0.1 updates
**Date**: 2025-07-06
**Scope**: Final legacy migration with operational content consolidation

#### Phase 1: Pre-Migration Analysis & Planning
**Status**: Complete

**spl1 Legacy Structure Documented:**
```
spl1/claude/
├── audit/ → claude/project/audit/
├── operational-docs/ → claude/project/docs/ (curated)
├── tools/ → claude/wow/automation/
└── workflows/ → claude/wow/workflows/
```

**Valuable Operational Content Identified:**
- `docs-organization-strategy.md` - Concise overview approach, progressive entry points
- `current-development-process.md` - GitHub Projects integration patterns
- `operational-tdd-framework.md` - Process quality testing methodology
- `dual-report-strategy.md` - Operational reporting patterns
- 15+ additional operational docs with potential template insights

**Unique spl1 Workflows:**
- `operational-tdd-framework.md` - TDD for development processes
- `se-1-git-workflow-enforcement-spec.md` - Git workflow enforcement patterns
- `backlog-to-completion-workflow.md`, `branching-strategy.md`, etc.

**Legacy Cleanup Required:**
- Path references: `claude/audit/` → `claude/project/audit/`
- Remove single-folder structure after migration
- Clean spl1-specific content from workflows

**Backup Created**: `/home/herma/SPlectrum/spl1/claude.backup`

#### Phase 2: Content Evaluation & Extraction
**Status**: Complete

**Operational Documentation Triage Results:**
- **RETAIN**: 8 files (spl1-specific/historical content)
- **COPY_TO_CLAUDE_SWIFT**: 11 files → `claude/project/docs/spl1-operational-insights/`
- **DELETE**: 1 file (superseded project API research)

**Files Copied to Claude-Swift for Future Evaluation:**
- claude-installable-component-requirement.md (architectural insights)
- claude-intervention-workflows.md (workflow analysis)
- docs-organization-strategy.md (documentation patterns)
- dual-report-strategy.md (reporting methodologies)
- project-decision-framework.md (decision-making approaches)
- repository-maintenance-analysis-plan.md (maintenance strategies)
- simplified-se-workflow-design.md (workflow design principles)
- strategic-analysis-plan-step4.md (version transition methodology)
- workflow-se-execution-flows.md (automation patterns)
- workflow-se-transformation-analysis.md (workflow evolution insights)

**Files to Retain in spl1 Migration:**
- current-development-process.md, persistent-todo-list.md
- release-and-install-process.md, session-summary-version-transition-prototypes.md
- repository-maintenance-tasks-v0.6.1.md, v0.6.1-metrics-report.md
- version-readiness-assessment-plan-step5.md, version-transition-implementation-status.md

#### Phase 3: Structural Migration
**Status**: Complete

**Migration Actions Executed:**
- Created dual-folder structure (`claude/project/` and `claude/wow/`)
- Migrated content to new locations:
  - `audit/` → `claude/project/audit/`
  - `tools/` → `claude/project/automation/`
  - `operational-docs/` → `claude/project/docs/` (8 retained files)
- Applied template WoW framework (complete directory copy)
- Applied template project scaffolding
- Removed legacy directories (`operational-docs/` and `workflows/`)
- Replaced CLAUDE.md with v1.0.1 template version
- Created `spl1-project-context.md` to preserve project-specific content
- Updated CLAUDE.md to reference project context instead of generic placeholders

**Key Learning**: Without a formal hook system, manually preserving project-specific content in `claude/project/docs/` and updating CLAUDE.md references is an effective pattern.

#### Phase 4: Validation & Cleanup
**Status**: Complete

**Cleanup Actions:**
- Fixed KEYWORD_REGISTRY.md - replaced claude-swift epics with spl1's seven epics (RR, SE, CAE, TDD, BARE, NFD, AVRO)
- Removed persistent-todo-list.md - content already merged into standard todo.md
- Documented template contamination issue for claude-swift fix

**Template Contamination Found:**
- **Issue**: Template's `claude/project/KEYWORD_REGISTRY.md` contained claude-swift specific content instead of generic placeholders
- **Impact**: Projects receiving template get claude-swift epics instead of their own
- **Fix Required**: Update claude-swift TEMPLATE_SYNCHRONIZATION workflow to properly genericize KEYWORD_REGISTRY.md
- **Pattern**: Should use `[EPIC_NAME]` placeholders like other hook files

**Migration Complete**: spl1 successfully migrated from legacy single-folder to modern dual-folder architecture with v1.0.1 enhancements

---

*Research log for developing template update procedures through manual verification and real-world testing.*