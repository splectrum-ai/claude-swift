# In-Repository Issue Management System

## Overview

A file-based issue management system that stores authoritative issue data directly in the repository, organized by milestone and automatically synchronized with GitHub.

## Design Principles

- **Repository-first**: Issues live in repo files, not external systems
- **Milestone-centric**: Issues organized by version/milestone for clear delivery focus
- **Automated triage**: Regular workflow processes unassigned items
- **Single-concern repos**: Designed for focused implementation repositories
- **Lifecycle management**: Released milestones are archived, keeping active structure clean

## Directory Structure

```
claude/issues/
├── v1.0/                    # Current milestone (lowest version number)
│   ├── README.md           # Milestone metadata: title, description, target date
│   ├── 001-auth-system.md  # Open issues in milestone
│   ├── 002-user-dashboard.md
│   └── closed/             # Completed issues for this milestone
│       └── 003-setup-database.md
├── v2.0/                   # Next milestone
│   ├── README.md
│   ├── 005-api-redesign.md
│   └── closed/
├── unassigned/             # New issues awaiting triage
│   └── 011-investigate-bug.md
└── .issue-counter          # Tracks next available issue ID
```

## File Formats

### Issue Files (`{id}-{slug}.md`)

```markdown
---
id: 001
title: "Implement user authentication system"
priority: high
labels: [feature, security]
assignee: null
created: 2025-01-15T10:30:00Z
updated: 2025-01-15T10:30:00Z
github_issue: 42
---

# Implement user authentication system

## Description
Detailed description of the issue...

## Acceptance Criteria
- [ ] User can register with email/password
- [ ] User can login securely
- [ ] Password reset functionality

## Implementation Notes
Technical details and considerations...
```

### Milestone README.md

```markdown
# Milestone v1.0 - Core Platform

**Target Date**: 2025-03-01
**Status**: In Progress

## Description
Initial release focusing on core authentication and user management features.

## Goals
- Establish secure user authentication
- Basic user dashboard
- Foundation for future features

## Success Criteria
- All authentication flows working
- User can manage basic profile
- Security audit completed
```

## Workflows

### Issue Creation

New issues are always created in `unassigned/` with auto-incremented ID:

```bash
# Create new issue
issue sesame create "Fix login validation bug"
# → Creates unassigned/012-fix-login-validation-bug.md
```

### Triage Workflow

Regular triage during SESSION_START processes unassigned issues:

```bash
# Review and assign unassigned issues
triage sesame
```

**Triage Logic:**
1. **Current milestone**: Issues that fit current sprint/version
2. **Next milestone**: Future features or larger scope items
3. **Leave unassigned**: Unclear scope, needs more investigation

### Milestone Management

**Current Milestone Detection:**
- Scan milestone folders (exclude `unassigned/`)
- Lowest semantic version number = current milestone
- Next lowest = next milestone

**Milestone Completion:**
When milestone is released:
1. Archive milestone data to release notes
2. Remove milestone folder from active structure
3. Next milestone becomes current

### Maintenance Tasks

Urgent maintenance items can be directly assigned to current milestone:

```bash
# Create issue directly in current milestone
issue sesame maintenance "Critical security patch" --priority critical
```

## Automation Features

### Auto-Assignment Rules

Issues can be automatically assigned based on:
- **Keywords**: "security" → current milestone with high priority
- **Pattern matching**: "bug", "fix" → current milestone
- **Cross-repo tasks**: External requests → unassigned for triage

### GitHub Synchronization

Bi-directional sync maintains GitHub issues as secondary system:
- Local changes push to GitHub
- GitHub comments/updates pull to local
- GitHub remains source for discussions, local for workflow

## Implementation Benefits

1. **Version Control**: Issues evolve with code in same commits
2. **Offline Capability**: Full functionality without GitHub API
3. **Milestone Focus**: Clear delivery-oriented organization
4. **Automated Triage**: Reduces manual issue management overhead
5. **Clean History**: Released milestones archived, active work visible
6. **Git Integration**: Issue references work naturally in commits
7. **Portability**: Issues survive platform migrations

## Migration Path

1. **Phase 1**: Implement local file system with basic workflows
2. **Phase 2**: Add GitHub sync for existing issues
3. **Phase 3**: Enhance automation and triage intelligence
4. **Phase 4**: Cross-repository task coordination

## Operational Integration

- **SESSION_START**: Execute triage workflow
- **COMMIT**: Reference and auto-close completed issues
- **INBOX**: Convert external tasks to local issues
- **RELEASE**: Archive completed milestones

This system transforms issue management from external overhead into integrated development workflow.