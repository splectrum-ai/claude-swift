# Template Reference - Claude Workflow Templates

Comprehensive reference for all template files used in Claude workflow system.

## Overview

Templates use placeholder syntax with double curly braces for variable substitution:
```
{{VARIABLE_NAME}}
```

All templates are stored in `claude/wow/templates/` and used by workflow scripts for consistent content generation.

## Template Categories

### Issue Templates

#### `issue-template.md`
**Purpose**: Standardized GitHub issue creation with metadata structure  
**Used by**: `claude/wow/scripts/create-issue-interactive`  
**Workflow**: CREATE_ISSUE workflow (`issue sesame`)

**Placeholders:**
- `{{DESCRIPTION}}` - Issue description and context
- `{{PRIORITY}}` - Priority level (HIGH/MEDIUM/LOW)
- `{{PRIORITY_JUSTIFICATION}}` - Reasoning for priority level
- `{{EFFORT}}` - Effort estimate (S/M/L/XL)
- `{{EFFORT_JUSTIFICATION}}` - Reasoning for effort estimate
- `{{BLOCKS}}` - Issues this blocks (comma-separated or "None")
- `{{BLOCKED_BY}}` - Issues blocking this (comma-separated or "None")
- `{{RELATED}}` - Related issues (comma-separated or "None")
- `{{TEST_CRITERIA}}` - Verification steps (checklist format)
- `{{WORK_AREA}}` - Feature area or component label
- `{{WORK_CONTEXT}}` - Additional context about work area

**Template Structure:**
```markdown
## Description
{{DESCRIPTION}}

## Priority: {{PRIORITY}}
**Justification:** {{PRIORITY_JUSTIFICATION}}

## Dependencies
**Blocks:** {{BLOCKS}}
**Blocked by:** {{BLOCKED_BY}}
**Related:** {{RELATED}}

## Effort: {{EFFORT}}
**Estimate:** {{EFFORT_JUSTIFICATION}}

## Test Criteria
**How to verify completion:**
{{TEST_CRITERIA}}

## Work Area: {{WORK_AREA}}
**Context:** {{WORK_CONTEXT}}

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### Task Templates

#### `task-template.md`
**Purpose**: Cross-repository task creation for orchestrator workflows  
**Used by**: `claude/wow/scripts/task-create`  
**Workflow**: TASK_CREATE workflow (`task sesame`)

**Placeholders:**
- `{{TITLE}}` - Task title
- `{{DESCRIPTION}}` - Task description and requirements
- `{{PRIORITY}}` - Task priority (HIGH/MEDIUM/LOW)
- `{{TARGET_REPO}}` - Target repository identifier
- `{{SOURCE_REPO}}` - Source repository identifier
- `{{CREATED_DATE}}` - Task creation timestamp
- `{{TASK_TYPE}}` - Type of task (feature, bug, enhancement, etc.)

**Template Structure:**
```markdown
---
source: {{SOURCE_REPO}}
target: {{TARGET_REPO}}
type: {{TASK_TYPE}}
priority: {{PRIORITY}}
created: {{CREATED_DATE}}
---

# {{TITLE}}

## Description
{{DESCRIPTION}}

## Priority
{{PRIORITY}}

## Context
Cross-repository task created from {{SOURCE_REPO}} for implementation in {{TARGET_REPO}}.

*This task was automatically generated using the Claude task creation workflow.*
```

## Template Usage Patterns

### Script Integration
Templates are loaded and processed by scripts using this pattern:

1. **Load Template**:
   ```javascript
   const template = fs.readFileSync('claude/wow/templates/template-name.md', 'utf8');
   ```

2. **Fill Placeholders**:
   ```javascript
   let filledTemplate = template;
   Object.keys(data).forEach(key => {
       const placeholder = `{{${key.toUpperCase()}}}`;
       filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), data[key] || 'Not specified');
   });
   ```

3. **Use Result**:
   ```javascript
   // Write to file, create GitHub issue, etc.
   ```

### Placeholder Conventions

- **ALL_CAPS**: Placeholder names use uppercase with underscores
- **Default Values**: Scripts should provide fallbacks for missing data
- **Consistent Naming**: Related placeholders use consistent prefixes
- **Clear Purpose**: Placeholder names clearly indicate their content

## Future Template Expansion

### Planned Issue Templates
Based on natural language detection patterns:

- `bug-report-template.md` - Bug-specific issue template
- `feature-request-template.md` - Feature request template  
- `enhancement-template.md` - Enhancement/improvement template
- `documentation-template.md` - Documentation task template

### Template Selection Logic
Future enhancement: Detect issue type from natural language and select appropriate template:

```javascript
function selectIssueTemplate(description) {
    if (description.includes('bug') || description.includes('error')) {
        return 'bug-report-template.md';
    } else if (description.includes('feature') || description.includes('add')) {
        return 'feature-request-template.md';
    }
    // Default to general template
    return 'issue-template.md';
}
```

### Template Validation
Planned validation for template consistency:

- Verify all placeholders are replaced
- Check required fields are present
- Validate template syntax
- Ensure consistent formatting

## Template Guidelines

### Creating New Templates

1. **Use Clear Placeholders**: `{{DESCRIPTIVE_NAME}}` not `{{VAR1}}`
2. **Provide Structure**: Consistent sections and formatting
3. **Include Generation Footer**: `🤖 Generated with [Claude Code](https://claude.ai/code)`
4. **Document Placeholders**: Add to this reference when creating new templates
5. **Test with Scripts**: Ensure placeholder replacement works correctly

### Template Standards

- **Markdown Format**: All templates use Markdown
- **Consistent Headers**: Use `##` for main sections
- **Clear Labels**: Bold labels for metadata (`**Priority:**`)
- **Placeholder Safety**: Handle missing data gracefully
- **Generation Attribution**: Include generation footer

### Best Practices

- **Single Responsibility**: Each template serves one specific purpose
- **Extensible Design**: Easy to add new placeholders without breaking existing usage
- **Clear Documentation**: Each template documented in this reference
- **Version Control**: Templates are versioned with the workflow system
- **Testing**: Validate templates work with their intended scripts

---

*Comprehensive template system enabling consistent, structured content generation across all Claude workflows.*