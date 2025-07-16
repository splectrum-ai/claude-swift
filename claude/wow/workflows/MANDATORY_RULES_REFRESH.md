[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# MANDATORY_RULES_REFRESH Workflow

## Overview

The MANDATORY_RULES_REFRESH workflow provides systematic scanning, validation, and enforcement of all mandatory rules across the codebase. This workflow ensures complete compliance with all "MANDATORY" labeled requirements and provides corrective actions for any violations.

## Core Purpose

### 1. Rule Discovery
- **Comprehensive Scanning**: Search all files for "MANDATORY" or "**MANDATORY" labeled rules
- **Complete Inventory**: Create complete list of all mandatory requirements
- **Source Tracking**: Identify exact file paths and line numbers for each rule

### 2. Compliance Validation
- **Current State Assessment**: Check repository state against each mandatory rule
- **Violation Detection**: Identify any non-compliance issues
- **Impact Analysis**: Determine severity and urgency of violations

### 3. Corrective Actions
- **Automatic Correction**: Apply fixes for rules that can be automatically resolved
- **Manual Action Items**: Create specific tasks for rules requiring manual intervention
- **Verification**: Confirm all corrections are properly applied

## Workflow Execution Steps

### Step 1: Rule Scanning
```bash
audit_log "MANDATORY_RULES_REFRESH" "step" "rule_scanning" "" "Scan all files for mandatory rules"
```

**Actions:**
1. Search `CLAUDE.md` for all "**MANDATORY" entries
2. Search `claude/wow/workflows/*.md` for all "MANDATORY" entries
3. Search `claude/project/` files for mandatory requirements
4. Create comprehensive inventory with file paths and descriptions

### Step 2: Compliance Check
```bash
audit_log "MANDATORY_RULES_REFRESH" "step" "compliance_check" "" "Validate current state against all mandatory rules"
```

**Actions:**
1. Check each mandatory rule against current repository state
2. Identify violations, partial compliance, or missing implementations
3. Categorize issues by severity and correction complexity
4. Document findings with specific violation details

### Step 3: Automatic Corrections
```bash
audit_log "MANDATORY_RULES_REFRESH" "step" "auto_corrections" "" "Apply automatic fixes for correctable violations"
```

**Actions:**
1. Fix audit log format violations
2. Correct file path specification issues
3. Apply documentation structure corrections
4. Update workflow logging compliance

### Step 4: Manual Action Planning
```bash
audit_log "MANDATORY_RULES_REFRESH" "step" "manual_actions" "" "Create action items for manual corrections"
```

**Actions:**
1. Create specific tasks for rules requiring manual intervention
2. Prioritize actions by impact and urgency
3. Provide clear instructions for each correction
4. Set deadlines for completion

### Step 5: Verification
```bash
audit_log "MANDATORY_RULES_REFRESH" "step" "verification" "" "Verify all corrections are properly applied"
```

**Actions:**
1. Re-scan all mandatory rules for compliance
2. Confirm automatic corrections are working
3. Validate manual action items are properly defined
4. Ensure no new violations were introduced

## Key Mandatory Rules Categories

### 1. Audit Logging Rules
- **Format Compliance**: All entries must follow `TIMESTAMP|WORKFLOW|STEP_TYPE|CONTEXT|FILE_PATH|DESCRIPTION`
- **Marker Management**: All entries before `##APPEND_MARKER_UNIQUE##`
- **File Creation Logging**: All new files must be logged

### 2. File Path Specification
- **Exact Paths**: All file references must specify complete paths
- **No Ambiguity**: Eliminate relative or unclear references
- **Standardized Format**: Use consistent path notation

### 3. Workflow Execution Rules
- **Single-Step Completion**: Each step must be complete before next
- **Choice Points**: Mandatory pause and option presentation
- **Collaborative Decision-Making**: All significant decisions through dialogue

### 4. Documentation Standards
- **Location Requirements**: All docs in `docs/` directory
- **Back Link Requirements**: All docs must link to README.md
- **Structure Compliance**: Mandatory document structure

### 5. Session Management
- **SESSION_START Requirements**: Timestamp checking, system validation
- **SESSION_END Requirements**: Complete workflow logging
- **Workflow Logging**: All custom workflows must be logged

## Integration Points

### CONNECTION TO SESSION_START
- MANDATORY_RULES_REFRESH complements SESSION_START system check
- Provides deeper rule validation beyond basic compliance
- Can be triggered independently for rule troubleshooting

### CONNECTION TO OPERATIONAL_RULES
- Ensures all operational rules marked as mandatory are enforced
- Validates collaborative decision-making patterns
- Confirms step-by-step execution compliance

### CONNECTION TO AUDIT_LOGGING
- Validates audit log format compliance
- Checks marker management correctness
- Ensures workflow logging completeness

## Success Metrics

### Compliance Indicators
- **100% Rule Discovery**: All mandatory rules identified and catalogued
- **Complete Validation**: Every rule checked against current state
- **Zero Violations**: All compliance issues resolved
- **Automated Verification**: Systematic validation of corrections

### Quality Indicators
- **Comprehensive Coverage**: No mandatory rules missed
- **Accurate Detection**: All violations properly identified
- **Effective Corrections**: All fixes properly applied
- **Sustainable Compliance**: Rules remain enforced over time

## Trigger Usage

### When to Use MANDATORY_RULES_REFRESH
- **Session Start Issues**: When SESSION_START detects compliance problems
- **Workflow Failures**: When workflows fail due to rule violations
- **Periodic Maintenance**: Regular compliance validation
- **Rule Updates**: After adding or modifying mandatory rules

## Trigger
**User-Friendly**: `mandatory sesame`
**Technical**: `MANDATORY_RULES_REFRESH`

### Integration with Sesame System
- **Purpose**: Quick access to complete mandatory rule validation
- **Context**: Troubleshooting, maintenance, compliance verification

## Archival Considerations

### Rule Evolution Tracking
- **Historical Compliance**: Track rule compliance over time
- **Violation Patterns**: Identify recurring compliance issues
- **Correction Effectiveness**: Measure success of automatic corrections
- **Rule Impact**: Analyze effectiveness of mandatory rules

### Development Process Improvement
- **Rule Refinement**: Improve rules based on compliance data
- **Automation Opportunities**: Identify rules for automatic enforcement
- **Documentation Updates**: Enhance rule clarity and accessibility
- **Training Needs**: Identify areas requiring additional guidance

---

*This workflow ensures systematic mandatory rule compliance and provides the foundation for reliable, consistent operational execution.*