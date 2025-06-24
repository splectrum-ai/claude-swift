# Template Cleanup Procedures

## Overview

This document outlines the systematic cleanup of project-specific information from template content to create deployable, generic template files. Understanding these cleanup procedures is essential for:

- Maintaining clean template boundaries
- Planning project information migration during deployment
- Understanding what content needs to be recreated in target projects
- Ensuring template reusability across different projects

## Cleanup Categories

### 1. Project Context and Domain Information

**What to Remove:**
- Specific project names and objectives
- Domain-specific terminology and concepts
- Project-specific architectural decisions
- Business context and requirements
- Project timeline and milestone references

**Example Cleanups:**
```markdown
BEFORE (Project-Specific):
## spl1 Context
**Transition Repository**: spl1 focuses on repository restructure, external install workflows, and core API enhancements. See [Federated Monorepo Design](./docs/federated-monorepo-design.md) for transition strategy.

AFTER (Template Generic):
## Project Intelligence
See `claude/project/` for project-specific goals, priorities, and domain knowledge.
```

### 2. File Path References to Project Content

**What to Update:**
- References to project-specific documentation
- Links to project architecture documents
- Paths pointing to project implementation files
- References to project-specific configuration

**Example Cleanups:**
```markdown
BEFORE (Project-Specific):
- `modules/spl/spl.js` - Core utility library
- `docs/federated-monorepo-design.md` - Transition strategy

AFTER (Template Generic):
- `claude/project/architecture.md` - Project architecture overview (if applicable)
- `claude/project/implementation-guide.md` - Project implementation details (if applicable)
```

### 3. Operational Data and Audit History

**What to Remove:**
- Actual audit log entries with project activities
- Session history from project development
- Operational metrics and reports
- Version-specific change logs
- Project-specific learning entries

**Example Cleanups:**
```
BEFORE (Real Project Data):
audit/current/current.log - Contains actual project session history
audit/v0.6.1/audit_v0.6.1.log - Contains project version history

AFTER (Template Structure):
audit/current/current.log - Empty file with just header structure
audit/v0.6.1/ - Folder removed (version-specific)
```

### 4. Project-Specific Tools and Automation

**What to Genericize:**
- Tool scripts with hardcoded project paths
- Automation referencing specific project structure
- Project-specific utility functions
- Custom tools built for specific project needs

**Example Cleanups:**
```javascript
BEFORE (Project-Specific):
// repository-maintenance-analyzer.js
const PROJECT_ROOT = '/path/to/spl1';
const MODULES_PATH = './modules/spl/';

AFTER (Template Generic):
// repository-maintenance-analyzer.js  
const PROJECT_ROOT = process.cwd();
const MODULES_PATH = './src/'; // Configurable path
```

### 5. Version and Release Information

**What to Remove:**
- Specific version numbers and release notes
- Project milestone achievements
- Version-specific documentation
- Release planning tied to project timelines

**Example Cleanups:**
```markdown
BEFORE (Project-Specific):
## spl1 Version 0.6.1 Achievements
- Repository restructure completed
- External install workflow implemented

AFTER (Template Generic):
## Version Management
See `claude/project/version-history.md` for project version tracking.
```

### 6. Workflow Context and Examples

**What to Genericize:**
- Workflow examples using project-specific scenarios
- Command examples with project paths
- Project-specific workflow customizations
- Domain-specific workflow variations

**Example Cleanups:**
```markdown
BEFORE (Project-Specific):
Example: "Create GitHub issue for AVRO prototype implementation"
Command: `gh issue create --title "Implement AVRO service for spl1"`

AFTER (Template Generic):
Example: "Create GitHub issue for feature implementation"  
Command: `gh issue create --title "Implement [FEATURE_NAME]"`
```

## Cleanup Execution Log

### Phase 1: Content Audit
*Document what project-specific content was identified in each template file*

**Files Requiring Cleanup:**
- [ ] `template/CLAUDE.md` - Project context section, file references
- [ ] `template/workflows/*.md` - Project examples, domain references
- [ ] `template/tools/*.js` - Hardcoded paths, project assumptions
- [ ] `template/audit/` - Real operational data removal
- [ ] `template/operational-docs/*.md` - Project documentation migration

### Phase 2: Systematic Content Removal

#### CLAUDE.md Cleanup
**Removed:**
- Specific project context ("spl1 Context" section)
- References to project-specific documents
- Project-specific development strategy details

**Replaced With:**
- Generic project intelligence references
- Template system update instructions
- Configurable project context placeholders

#### Workflow Documentation Cleanup
**Removed:**
- Project-specific command examples
- Domain-specific terminology
- Project milestone references
- Specific architectural assumptions

**Replaced With:**
- Generic workflow patterns
- Configurable examples
- Template-agnostic procedures
- Universal operational guidance

#### Tools Script Cleanup
**Removed:**
- Hardcoded project paths
- Project-specific configuration
- Custom project utilities
- Domain-specific automation

**Replaced With:**
- Configurable path variables
- Generic utility functions
- Template-compatible automation
- Universal tool interfaces

#### Audit System Cleanup
**Removed:**
- All real audit log entries
- Project session history
- Version-specific metrics
- Operational learning entries

**Replaced With:**
- Empty audit structure
- Template audit format examples
- Generic logging templates
- Clean operational baseline

#### Operational Documentation Cleanup
**Removed:**
- Project-specific processes
- Domain knowledge documentation
- Project decision history
- Implementation-specific guides

**Replaced With:**
- Generic operational templates
- Configurable procedure frameworks
- Template usage instructions
- Universal best practices

### Phase 3: Template Validation

**Validation Checklist:**
- [ ] No project names or specific references remain
- [ ] All file paths point to generic locations
- [ ] Examples use placeholder content
- [ ] Tools work with configurable parameters
- [ ] Documentation applies to any project
- [ ] Audit structure is clean but functional

## Migration Planning for Target Projects

### Content That Must Be Recreated
**Project Intelligence Documentation:**
- Project objectives and context
- Domain-specific terminology
- Architectural decisions
- Implementation strategies

**Operational History:**
- Audit logs and session history
- Version tracking and milestones
- Learning and improvement records
- Project-specific metrics

**Custom Tooling:**
- Project-specific automation
- Domain-specific utilities
- Custom workflow extensions
- Integration-specific tools

### Content Migration Process
1. **Before Deployment**: Extract project information from template areas
2. **During Deployment**: Deploy clean template content
3. **After Deployment**: Recreate project information in `claude/project/`
4. **Validation**: Ensure no project intelligence was lost

## Template Maintenance Guidelines

### Ongoing Cleanup Discipline
- Never commit project-specific content to templates
- Regular audits for project information drift
- Clear boundaries between template and project content
- Documentation of cleanup procedures for future maintainers

### Template Evolution Process
- Improvements come from multiple project deployments
- Generic solutions preferred over project-specific fixes
- Template changes validated across different project types
- Cleanup procedures updated with new content categories

---

*This cleanup documentation ensures template deployments preserve project intelligence while providing clean, reusable operational frameworks.*