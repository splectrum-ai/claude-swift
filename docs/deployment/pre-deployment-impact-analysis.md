# Pre-Deployment Impact Analysis

## Overview

Before deploying any claude-swift template update, a comprehensive impact analysis must be performed to ensure informed deployment decisions and proper post-deployment adaptation planning.

## Analysis Workflow

### Step 1: Generate Comprehensive Comparison Report

**Compare Current vs Template:**
- Analyze all folders in `claude/` (excluding `project/`) against `template/` folders
- Generate detailed diff report showing:
  - Files to be added
  - Files to be removed  
  - Files to be modified
  - Content changes within modified files

**Report Structure:**
```
Impact Analysis Report - [DATE]
Template Version: [CURRENT] → [NEW]

=== FILES TO BE ADDED ===
+ claude/workflows/NEW_WORKFLOW.md
+ claude/tools/new-automation-tool.js

=== FILES TO BE REMOVED ===  
- claude/workflows/deprecated-workflow.md
- claude/docs/outdated-guide.md

=== FILES TO BE MODIFIED ===
~ claude/workflows/SESSION_START.md (47 lines changed)
~ claude/tools/project-automation.js (12 lines changed)

=== CONTENT CHANGES PREVIEW ===
[Key changes highlighted with context]
```

### Step 2: Risk Assessment and Categorization

**Template Update Changes (Low Risk)**
- Expected version improvements documented in `/docs/version-changes/`
- Standard template evolution
- Aligned with published upgrade notes

**Local Modifications (Medium Risk)**  
- Files modified from original template state
- Custom enhancements or fixes applied locally
- Will be lost unless backed up or re-applied

**Project Information Drift (High Risk)**
- Project-specific content embedded in template files
- Information that should be in `claude/project/` but exists in template areas
- Requires migration to proper location before deployment

**Custom Additions (Medium Risk)**
- Non-template files added to template folders
- Local tools or workflows not part of template
- Need evaluation for preservation or migration

### Step 3: Training and Adaptation Planning

**Behavior Change Assessment:**
- Identify workflow modifications that will change Claude's behavior
- Highlight new operational patterns users need to learn
- Document removed capabilities that users may rely on

**Project Information Migration Needs:**
- Identify project-specific content in template areas
- Plan migration to `claude/project/` structure
- Ensure no project intelligence is lost during deployment

**Training Requirements:**
- **Immediate**: Critical behavior changes requiring immediate user awareness
- **Short-term**: New features and capabilities to learn over next sessions
- **Long-term**: Deprecated patterns to phase out gradually

## User Decision Framework

### Option 1: Deploy Immediately
**When Appropriate:**
- Low-risk changes only
- No critical project information at risk
- User comfortable with immediate behavior changes

**Deployment Process:**
1. Execute template replacement
2. Provide immediate post-deployment briefing
3. Schedule follow-up training sessions

### Option 2: Prepare First
**When Appropriate:**
- Significant local modifications present
- Project information needs migration
- Complex behavior changes require preparation

**Preparation Process:**
1. Backup current template areas
2. Migrate project information to proper locations
3. Document local modifications for re-application
4. Plan user training sessions
5. Schedule deployment at appropriate time

### Option 3: Abort Deployment
**When Appropriate:**
- High-risk changes with unclear consequences
- Critical project deadlines requiring stable system
- Insufficient time for proper impact assessment

**Alternative Actions:**
1. Maintain current template version
2. Plan future deployment window
3. Monitor template evolution for better upgrade opportunity

## Post-Deployment Adaptation Support

### Immediate Stabilization (First Session)
- **System Validation**: Verify all workflows execute correctly
- **Critical Changes Brief**: Highlight must-know behavior changes
- **Quick Reference**: Provide cheat sheet for new patterns

### Behavior Settlement (2-5 Sessions)
- **Workflow Familiarization**: Practice new operational patterns
- **Feature Discovery**: Explore new capabilities and tools
- **Pattern Migration**: Transition from old to new approaches

### Long-term Optimization (Ongoing)
- **Efficiency Gains**: Leverage new template capabilities fully
- **Best Practice Evolution**: Adapt working patterns to template improvements  
- **Feedback Integration**: Report template effectiveness and suggest improvements

## Training Scenarios by Change Type

### Workflow Modifications
**Training Focus**: New execution patterns, changed commands, updated procedures
**Duration**: 1-2 sessions for familiarization
**Method**: Guided practice with real project tasks

### Tool Updates
**Training Focus**: New tool capabilities, changed interfaces, configuration updates
**Duration**: Immediate for critical tools, ongoing for advanced features
**Method**: Hands-on demonstration with current project context

### Documentation Restructure
**Training Focus**: New information locations, updated references, changed organization
**Duration**: Reference-based learning over multiple sessions
**Method**: Progressive discovery during normal workflow execution

### Behavioral Rules Changes
**Training Focus**: New mandatory patterns, changed workflow priorities, updated standards
**Duration**: Immediate enforcement with gradual habit formation
**Method**: Active coaching during workflow execution

## Impact Analysis Checklist

**Pre-Analysis:**
- [ ] Current template version identified
- [ ] Target template version specified
- [ ] Backup of current system created
- [ ] Impact analysis tools prepared

**During Analysis:**
- [ ] Complete file comparison generated
- [ ] Risk categories assessed for each change
- [ ] Project information drift identified
- [ ] Training requirements documented
- [ ] User decision options prepared

**Post-Analysis:**
- [ ] Comprehensive impact report delivered
- [ ] Risk assessment presented clearly
- [ ] Training plan outlined
- [ ] User decision documented
- [ ] Next steps agreed upon

## Success Criteria

**Informed Decision Making:**
- User understands full scope of changes
- Risks and consequences clearly communicated
- Adequate time provided for decision

**Smooth Deployment:**
- No unexpected behavior changes
- No loss of project information
- System stability maintained

**Effective Adaptation:**
- User successfully adopts new patterns
- Template capabilities fully utilized
- Working efficiency maintained or improved

---

*This impact analysis framework ensures template deployments enhance rather than disrupt project operations through informed decision-making and comprehensive adaptation support.*