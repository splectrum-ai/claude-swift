[← Back to Claude-Swift Home](../../../README.md)

# DEPLOYMENT Workflow

## Purpose
Main deployment workflow that detects target environment and routes to appropriate deployment strategy.

## Trigger Keywords
- `deployment sesame`
- `DEPLOYMENT`

## Overview
This workflow acts as an intelligent router that:
1. Analyzes the target project environment
2. Detects existing Claude Code structures
3. Presents appropriate deployment options to the user
4. Routes to specialized sub-workflows based on user choice

## Workflow Steps

### 1. Environment Detection
**Target Project Analysis:**
- Verify sidecar deployment pattern (claude-swift adjacent to target project)
- Check for existing `/claude/` directory
- Analyze existing structure if present
- Detect git repository status

**Classification Logic:**
```
No /claude/ directory → FRESH deployment candidate
/claude/ with mixed content → MIGRATION deployment candidate  
/claude-project/ and /claude-wow/ exist → MAINTENANCE/UPDATE candidate
Invalid structure → ERROR state requiring manual intervention
```

### 2. User Option Presentation
Based on environment detection, present relevant options:

**For Fresh Projects (no /claude/):**
```
Detected: Fresh project with no existing Claude Code structure

Deployment Options:
1. Clean Installation - Deploy complete claude-swift template system
2. Cancel - Exit without changes

Choose option [1-2]:
```

**For Legacy Projects (mixed /claude/):**
```
Detected: Legacy /claude/ structure with mixed content

Deployment Options:
1. Migration - Migrate to claude-swift dual-folder architecture
2. Analysis Only - Generate migration report without changes
3. Cancel - Exit without changes

Choose option [1-3]:
```

**For Dual-Folder Projects:**
```
Detected: Existing claude-swift deployment

Deployment Options:
1. Update - Update operational machinery (claude-wow/)
2. Maintenance - Verify and repair deployment
3. Cancel - Exit without changes

Choose option [1-3]:
```

### 3. Sub-Workflow Routing
Route to appropriate specialized workflow based on user selection:

**Clean Installation:** → `FRESH_DEPLOYMENT` sub-workflow
**Migration:** → `MIGRATION_DEPLOYMENT` sub-workflow  
**Analysis Only:** → `MIGRATION_ANALYSIS` sub-workflow
**Update:** → `TEMPLATE_UPDATE` sub-workflow
**Maintenance:** → `DEPLOYMENT_MAINTENANCE` sub-workflow

### 4. Post-Deployment Actions
After sub-workflow completion:
- Verify successful deployment
- Test basic workflow functionality
- Provide usage guidance
- Log deployment completion

## Error Handling

### Invalid Environment
- Ambiguous directory structures
- Conflicting configurations
- Git repository issues
- Permission problems

**Response:** Present diagnostic information and manual resolution steps

### Sub-Workflow Failures
- Monitor sub-workflow execution
- Capture error states
- Provide rollback guidance where possible
- Log failure details for troubleshooting

## Integration Points

### With Sub-Workflows
- **FRESH_DEPLOYMENT** - Clean installation for new projects
- **MIGRATION_DEPLOYMENT** - Legacy structure migration  
- **MIGRATION_ANALYSIS** - Risk assessment without changes
- **TEMPLATE_UPDATE** - Operational machinery updates
- **DEPLOYMENT_MAINTENANCE** - Repair and validation

### With User Experience
- Clear option presentation
- Informed decision making
- Safe default recommendations
- Comprehensive error messaging

## Success Criteria
- Accurate environment detection
- Appropriate option presentation
- Successful sub-workflow routing
- Completed deployment with verification
- User understanding of next steps

## Expected Outputs
- Environment analysis report
- User-selected deployment path
- Successful sub-workflow execution
- Functional claude-swift deployment
- Usage guidance and next steps

---

*Project Workflow - Main deployment orchestrator executed by Claude instances running claude-swift*