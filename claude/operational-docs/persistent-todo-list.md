# Repository Todo List

## Current Topics for Discussion

### Template-Claude Sync Workflow Development
- **Status**: 🔄 NEW PRIORITY  
- **Context**: Internal sync rules for maintaining /claude/ source of truth and /template/ deployment
- **Sync Stages**:
  1. **Template cleanup** → Clean project-specific data from template
  2. **Migration merge** → Clean template → /claude/ (establish source of truth)
  3. **Development activity** → Interactive freestyle rule improvement in /claude/
  4. **Staging merge** → /claude/ → /template/ (prepare deployment)
- **Current Tasks**:
  - ⏳ Complete template cleanup (prerequisite)
  - ⏳ Design migration merge workflow (template → claude)
  - ⏳ Design staging merge workflow (`sync template sesame`)

### Claude-Swift Template System Development
- **Status**: 🔄 IN PROGRESS
- **Context**: Converting this repository to claude-swift ways of working template system
- **Current Phase**: Template creation and cleanup
- **Completed Tasks**:
  - ✅ Document project overview and objectives (`docs/preliminary/project-overview.md`)
  - ✅ Document self-contained template update architecture (`docs/preliminary/self-contained-template-update-architecture.md`)
  - ✅ Document template repository structure (`docs/preliminary/template-repository-structure.md`)
  - ✅ Document event-driven workflow testing architecture (`docs/preliminary/event-driven-workflow-testing-architecture.md`)
  - ✅ Create template folder structure and move root-level content (`template/`)
  - ✅ Create deployment procedures folder (`deployment/`)
  - ✅ Create template CLAUDE.md for project root deployment (`template/CLAUDE.md`)
  - ✅ Document pre-deployment impact analysis (`deployment/pre-deployment-impact-analysis.md`)
  - ✅ Document template cleanup procedures (`deployment/template-cleanup-procedures.md`)
  - ✅ Document enhancement suggestions (`docs/preliminary/template-enhancement-suggestions.md`)
  - ✅ Document event-driven reminder system (`docs/preliminary/event-driven-reminder-system.md`)

- **Remaining Tasks**:
  - ✅ Finish setting up git repository for WoW (create unplanned branch, fix branching workflow)
  - ⏳ Clean up project-specific data from template content (remove audit logs, project docs)
  - ⏳ Create basic template-merge-procedures.md for Claude
  - ⏳ Create simple deployment-guide.md with step-by-step instructions
  - ⏳ Test template deployment on a sample project
  - ⏳ Implement standardized project information API (claude/project/ schema)
  - ⏳ Add missing information reporting rules to template workflows
  - ⏳ Create health check workflow for system validation
  - ⏳ Move existing /claude/ content to new structure (workflows → template/, project docs → claude/project/)
  - ⏳ Update all file references in template content to use new structure
- **Architecture Goal**: Template repository that can deploy to any project with upgrade-safe mechanisms
- **Future Evolution**: Clone this repo to create different template variants as needed



---

*This file maintains persistent todo items and discussion topics across development sessions.*