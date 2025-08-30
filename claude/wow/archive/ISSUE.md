# ISSUE Workflow - Local Issue Management

## Trigger
**User-Friendly**: `issue sesame` + command

## Purpose
Local file-based issue management system with milestone organization.

## Supported Operations

### Issue Creation
**Examples:**
- `issue sesame create feature "User authentication system"`
- `issue sesame create bug "Login validation error"`
- `issue sesame create task "Update documentation"`

### Issue Listing
**Examples:**
- `issue sesame list` - All issues
- `issue sesame list unassigned` - Unassigned issues only
- `issue sesame list v1.0` - Issues in v1.0 milestone

### Issue Details
**Examples:**
- `issue sesame show 001` - Show specific issue

### Issue Triage
**Examples:**
- `issue sesame triage` - Review unassigned issues for milestone assignment

## Workflow Execution

### **1. Issue Triage**
Review and organize unassigned issues:
```bash
# Review unassigned issues for milestone assignment
claude/wow/scripts/issue-manage triage
```

### **2. Issue Management**
Core issue operations:
```bash
# Create new issue
claude/wow/scripts/issue-manage create feature "Feature name"
claude/wow/scripts/issue-manage create bug "Bug description" 
claude/wow/scripts/issue-manage create task "Task description"

# List issues
claude/wow/scripts/issue-manage list              # All issues
claude/wow/scripts/issue-manage list unassigned   # Unassigned only
claude/wow/scripts/issue-manage list open         # Open issues

# Show issue details
claude/wow/scripts/issue-manage show 001
```

## File Structure
- **claude/issues/v1.0/** - v1.0 milestone issues
- **claude/issues/v1.0/closed/** - Completed v1.0 issues
- **claude/issues/unassigned/** - New issues awaiting triage
- **claude/issues/templates/** - Issue templates (feature, bug, task)

## Benefits
- **Repository-first** - Issues stored with code
- **Milestone-centric** - Clear delivery organization
- **Template-driven** - Consistent issue structure
- **Local workflow** - No external dependencies