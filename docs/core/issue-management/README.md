# ISSUE Management

**Core Responsibility 3: Issue Wrapper and Repository Organization**

ISSUE manages the generic wrapper structure common to all issues and organizes the issue repository, while WORKFLOW Creation specifies the content within that wrapper.

## Purpose

- **Issue Wrapper** - Generic structure common to all issues regardless of workflow
- **Issue Repository** - Organized storage and retrieval of work items  
- **Milestone Organization** - Structure planned workload for releases
- **Unassigned Parking** - Handle tasks that can't execute or don't belong to releases

## Core Concept

**Issue = Task at rest (generic wrapper + workflow-specific content)**  
**Task = Issue on execution queue**

ISSUE provides the **wrapper**, WORKFLOW Creation provides the **content**.

## Clean Separation of Concerns

### ISSUE Responsibility (The Wrapper)
- ✅ **Common metadata** - ID, title, state, milestone, priority, timestamps
- ✅ **Workflow field** - Which workflow this issue uses  
- ✅ **Work steps structure** - Generic container for work steps
- ✅ **Sign-off structure** - Generic container for sign-off
- ✅ **Repository organization** - Storage, milestones, unassigned area

### WORKFLOW Creation Responsibility (The Content)
- ✅ **Work step content** - What goes in the work steps section
- ✅ **Sign-off criteria** - What goes in the sign-off section
- ✅ **Additional fields** - Any workflow-specific metadata
- ✅ **Content validation** - Ensures content meets workflow requirements

## Issue Wrapper Structure

### Generic Issue Format
```markdown
---
# ISSUE wrapper fields (common to all workflows)
workflow: WORKFLOW_NAME           # Required - which workflow to use
github_id: 123
title: "Issue Title"  
state: "open|closed"
milestone: "v1.2.0|unassigned"
priority: low|medium|high|critical
estimated_effort: S|M|L|XL
created_at: "2025-07-27T10:00:00Z"
updated_at: "2025-07-27T15:00:00Z"
github_updated_at: "2025-07-27T10:00:00Z"
local_updated_at: "2025-07-27T15:00:00Z"
---

# Issue Title

## Work Steps
[WORKFLOW Creation specifies content here]

## Sign-off
[WORKFLOW Creation specifies content here]

[Additional workflow-specific sections as defined by WORKFLOW Creation]
```

## Repository Structure

```
claude/issues/
├── sync.json              # Synchronization metadata
├── templates/             # Generic wrapper templates
├── unassigned/           # Tasks parked (can't execute or no release milestone)
├── v1.2.0/              # Release milestone folders
│   ├── open/            # Active work items for this release
│   └── closed/          # Completed work items (archived)  
└── [milestone]/         # Other milestone folders
    ├── open/
    └── closed/
```

## Integration with WORKFLOW

### Clear Division
```
ISSUE provides:        WORKFLOW Creation fills:
├── Metadata           ├── Work step content
├── Workflow field     ├── Sign-off criteria  
├── Work steps container ├── Additional sections
└── Sign-off container └── Content validation
```

### Workflow Integration Flow
```
ISSUE creates wrapper → 
WORKFLOW Creation fills content → 
WORKFLOW Creation validates content →
Issue ready for execution queue
```

## Milestone-Based Organization

### Release Milestones  
- **Planned workload** organized by target release
- **v1.2.0, v1.3.0, etc.** - specific release targets
- **Open/Closed** structure within each milestone
- **Release planning** through milestone assignment

### Unassigned Area
- **Parking space** for issues that can't execute immediately
- **No release milestone** - issues without clear release target
- **Blocked issues** - dependencies preventing execution
- **Future work** - issues for later prioritization

## Repository Management Functions

### Storage Operations
- **Create wrapper** - New issues with common metadata structure
- **Update metadata** - Modify wrapper fields (title, milestone, priority, etc.)
- **Move between locations** - Milestone assignment, unassigned ↔ milestone  
- **Archive completed** - Move closed issues to archived folders

### Organization Operations
- **Milestone assignment** - Route issues to appropriate release
- **Triage unassigned** - Review unassigned items for milestone placement
- **Housekeeping** - Clean up completed milestones, archive old issues
- **GitHub synchronization** - Bidirectional sync of wrapper metadata

## State Transitions

```
Issue creation (wrapper) → 
WORKFLOW Creation (content) →
Issue (unassigned) →
├── Milestone assignment → Issue (milestone/open) →
│   ├── Execution → Task (execution queue) →
│   └── Completion → Issue (milestone/closed)
└── Parking → Issue (unassigned) - can't execute/no release
```

## Commands

- `issue sesame` - Manage issue repository and milestones
- `issue-manage create <workflow> <title>` - Create wrapper, hand to WORKFLOW Creation
- `issue-manage triage` - Review and organize unassigned items
- `issue-manage sync` - Synchronize wrapper metadata with GitHub  
- `issue-manage housekeeping` - Clean and archive completed work

## Integration Points

### With WORKFLOW Creation
- **Provides**: Generic wrapper structure with containers
- **Receives**: Workflow-specific content for containers  
- **Boundary**: ISSUE = wrapper, WORKFLOW = content

### With TASK Management  
- **Provides**: Complete issue (wrapper + content) for execution
- **Receives**: Execution results and metadata updates

### With RELEASE Management
- **Provides**: Milestone organization and completion status
- **Receives**: Release planning and milestone assignments

## Implementation Status

- [x] Basic issue repository structure
- [x] Milestone-based organization
- [x] GitHub synchronization
- [ ] Clean wrapper-only issue creation  
- [ ] Integration with WORKFLOW Creation for content
- [ ] Automated milestone assignment
- [ ] Enhanced unassigned area management
- [ ] Wrapper-focused repository operations

---

*ISSUE Management - Generic wrapper and repository organization, with content provided by WORKFLOW Creation*