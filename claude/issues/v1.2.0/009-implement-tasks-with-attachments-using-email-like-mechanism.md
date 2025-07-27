---
type: feature
github_id: 66
title: "Implement tasks with attachments using email-like mechanism"
state: "open"
milestone: "v1.2.0"
labels: "[]"
priority: medium
estimated_effort: TBD
github_updated_at: "2025-07-17T07:28:56Z"
local_updated_at: "2025-07-27T07:58:02.795Z"
---

# Implement tasks with attachments using email-like mechanism

Problem Statement
## Cross-Repository Task

**Source**: claude-swift  
**Type**: enhancement  
**Created**: 2025-07-17T06:15:11.057Z  
**Priority**: HIGH

---

## Description
Enhance the TASK_CREATE and INBOX workflows to support file attachments in cross-repository tasks. Use email MIME-like approach with base64 encoding for file transport. INBOX workflow should decode attachments and place them in a standardized git-managed directory structure.

## Priority: HIGH
**Justification:** Enables file sharing through task mechanism, critical for cross-repository coordination and workflow automation

## Dependencies
**Blocks:** 
**Blocked by:** 
**Related:** Audit logging optimization task

## Effort: L
**Estimate:** Well-defined requirements from discussion, clear implementation pattern following email mechanisms

## Test Criteria
**How to verify completion:**
- [ ] TASK_CREATE workflow prompts for file attachments during task creation
- [ ] Task files support YAML metadata with attachment specifications (filename, content-type, encoding)
- [ ] Files encoded as base64 in task file body with clear section markers
- [ ] INBOX workflow automatically decodes attachments
- [ ] Attachments placed in `claude/cache_attachments/issue-{number}/` directory structure
- [ ] GitHub issues reference attachment location in standardized format
- [ ] Attachment directory is git-managed (not gitignored) for full history tracking
- [ ] End-to-end test: create task with attachments, process through INBOX, verify files created correctly

## Work Area: v1.2.0
**Context:** Implementation details from collaborative discussion on email MIME approach

## Technical Requirements

### Task File Format Enhancement
- **YAML metadata** includes attachments array with filename, content-type, encoding
- **Base64 encoding** for all file content (text and binary)
- **Section markers** clearly separate file content in task body
- **Original filenames** preserved for reconstruction

### INBOX Workflow Enhancement  
- **Automatic detection** of tasks with attachments
- **Directory creation**: `claude/cache_attachments/issue-{number}/`
- **Base64 decoding** and file reconstruction
- **Git commit** of attachment files alongside issue creation
- **Issue reference** includes standardized attachment location format

### Directory Structure
```
claude/
├── project/
├── cache_attachments/          # New directory
│   ├── issue-123/
│   │   ├── config.json
│   │   ├── script.sh
│   │   └── workflow.md
│   └── README.md
└── wow/
```

### File Size Considerations
- **Reasonable limits** to prevent repository bloat
- **Error handling** for oversized attachments
- **Compression** consideration for large text files

## Example Enhanced Task Format
```markdown
---
source: repo-a
target: repo-b
attachments:
  - filename: config.json
    content-type: application/json
    encoding: base64
  - filename: script.sh
    content-type: text/x-shellscript
    encoding: base64
---

# Task Title

## Description
Task description

## Attached Files

### config.json
```base64
eyJuYW1lIjoidGVzdCJ9
```

### script.sh
```base64
IyEvYmluL2Jhc2gKZWNobyAiSGVsbG8i
```
```

---

## Dependencies
**Blocks:** None (unless specified in task content)
**Blocked by:** None (unless specified in task content)  
**Related:** Cross-repository communication

## Effort: L
**Estimate:** Cross-repository task processing

## Test Criteria
**How to verify completion:**
- [ ] Task requirements completed as specified
- [ ] Cross-repository coordination successful

## Work Area: cross-repository
**Context:** Task distributed via OUTBOX/INBOX workflow

*This issue was automatically created from an inbox task by the INBOX workflow.*

## Original GitHub Context
What problem does this solve? What user need or business requirement drives this feature?

## Required Work
How will we solve it? High-level approach and key components.

## Work Plan
Technical details, API designs, database changes, step-by-step approach.

## Acceptance Criteria
- [ ] Criterion 1: Specific, testable outcome
- [ ] Criterion 2: Another measurable success condition
- [ ] Criterion 3: Documentation updated

## Technical Considerations
- Architecture decisions
- Dependencies on other features
- Performance implications
- Security considerations

## GitHub Discussion Summary
Key insights from GitHub comments (curated manually)

## Progress Log
- Date: Status update