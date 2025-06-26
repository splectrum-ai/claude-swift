[← Back to Claude-Swift Home](../../README.md)

# Documentation Organization Strategy

## Core Principles

### **Concise Overview Approach**
- **Keep docs short and focused** - overview-level information only
- **Leverage Claude for details** - docs point to "Ask Claude about..." for deeper exploration
- **High-level visibility** - show what's important/expected, not exhaustive detail
- **Maintainable content** - less text to keep current and accurate

### **Progressive Entry Points**
- **Multiple learning paths** based on experience level
- **Clear prerequisites** - honest about what we assume you know
- **Practical focus** - get people productive quickly

## Proposed Directory Structure

### **`docs/getting-started/`** - Entry Points & Learning Paths
**Purpose**: Onboarding guides based on real v1.0.0 deployment experience
- `quick-start-guide.md` - Get productive with claude-swift in 10 minutes
- `essential-workflows-reference.md` - Daily workflows with proven usage patterns
- `common-pitfalls-and-solutions.md` - Lessons learned from real deployments
- `expected-knowledge.md` - Prerequisites checklist based on actual requirements
- `first-week-guide.md` - Structured onboarding for new users
- `team-setup-guide.md` - Multi-user deployment and collaboration

### **`docs/guides/`** - Development Guides
**Purpose**: Practical how-to documentation
- `how-to.md`
- `creating-new-apps.md`
- `implementing-new-api.md`
- `app-development.md`
- `release-and-install-process.md`
- `current-development-process.md`

### **`docs/architecture/`** - System Design
**Purpose**: Core platform architecture and design decisions
- `project-overview.md`
- `federated-monorepo-design.md`
- `container-unified-entity-strategy.md`
- `spl-data-layer.md`
- `schema-and-repo-notes.md`
- `container-registry-strategy.md`
- `se1-container-engine-architecture.md`

### **`docs/api/`** - API References
**Purpose**: Technical API documentation
- `execute-api-properties.md`
- `package-api-properties.md`
- `7zip-command-line-api.md`
- `spl-package-api-analysis.md`
- `api-status.md`

### **`docs/workflows/`** - Development Processes
**Purpose**: How we develop and work together
- `branching-strategy.md`
- `phase-based-development-strategy.md`
- `phase-based-implementation-guide.md`
- `tdd-workflow-architecture.md`
- `testing-frameworks.md`
- `operational-tdd-framework.md`
- `backlog-to-completion-workflow.md`
- `code-quality-patterns.md`

### **`docs/integration/`** - External Systems
**Purpose**: Integration with external tools and systems
- `avro-service-definitions-communication.md`
- `avro-schema-architecture.md`
- `avro-queue-folder-service-design.md`
- `bare-minimal-dependency-architecture.md`
- `qubes-os-overview.md`
- `qubes-splectrum-integration.md`
- `prince2-integration-approach.md`
- `itil-integration-approach.md`

### **`docs/management/`** - Project Management
**Purpose**: Planning, tracking, and project organization
- `spl1-epics-overview.md`
- `github-project-setup.md`
- `versioning-strategy.md`
- `decision-log.md`
- `lessons-learned.md`

### **`docs/specifications/`** - Technical Specifications
**Purpose**: Detailed technical specifications and standards
- `se-1-git-workflow-enforcement-spec.md`
- `audit-log-architecture.md`
- `audit-log-migration-plan.md`
- `claude-directory-specification.md`
- `subdirectory-claude-md-plan.md`

### **`docs/knowledge/`** - Institutional Knowledge & Insights
**Purpose**: Accumulated insights and institutional knowledge explaining the "why" behind decisions
- `collaborative-development-patterns.md` - Validated human-AI collaboration patterns from v1.0.0
- `development-best-practices.md` - Proven best practices extracted from successful v1.0.0 patterns
- `workflow-effectiveness-guide.md` - Data-driven workflow optimization insights and recommendations
- `design-rationale.md` - Why we made key architectural choices
- `troubleshooting-guide.md` - Common issues and their solutions
- `terminology.md` - Claude-swift specific terms and definitions
- `historical-context.md` - How we got here, evolution of decisions
- `technology-choices.md` - Why we chose specific technologies/approaches
- `performance-insights.md` - What we've learned about performance

### **`docs/reference/`** - Quick References
**Purpose**: Quick lookup information and utilities
- `prerequisites.md`
- `quick-reference.md`
- `node-dependency-audit.md`
- `test-app-development.md`
- `boot-app-functionality.md`

### **`docs/preliminary/`** - Project Startup Content (Bootstrap Only)
**Purpose**: Initial ideas gathering and project setup when nothing exists yet
**Lifecycle**: **BOOTSTRAP ONLY** - used when starting from scratch, removed after organized docs structure established
**Content**:
- Initial architecture brainstorming and idea collection
- Project setup exploration and approach investigation
- Bootstrap documentation before formal structure exists
- **Usage Pattern**: Only appears during initial project creation (like claude-swift v1.0.0 development)

### **`docs/future/`** - Next Version Enhancement Concepts (Permanent)
**Purpose**: Validated concepts and enhancement ideas for future versions
**Lifecycle**: **PERMANENT** archive feeding next version planning
**Content**:
- Future architecture concepts validated but not implemented
- Enhancement ideas for next-version planned work
- Strategic evolution pathways and feature concepts
- **Version Transition Flow**: Implemented concepts removed, new concepts added

## Documentation Content Strategy

### **Overview-Level Content**
- **Key concepts only** - not exhaustive explanations
- **Essential commands** - core functionality, not every option
- **Important patterns** - highlight what matters most
- **Clear assumptions** - explicit about prerequisite knowledge

### **Claude Integration Points**
Each document should include:
- **"Ask Claude about..."** sections for deeper exploration
- **Specific prompts** for getting detailed help
- **References to CLAUDE.md workflows** for operational guidance

### **Knowledge Base Integration**
- **Getting Started** references knowledge base for deeper context
- **Knowledge base** captures "why" and accumulated wisdom
- **Cross-references** between getting-started and knowledge for learning progression

### **Example Document Structure**
```markdown
# Document Title

## Overview
Brief description of what this covers (2-3 sentences)

## Key Concepts
- Bullet point list of essential ideas
- Keep to 5-7 main points maximum

## Essential Commands/Patterns
```bash
# Core commands only
./spl_execute basic-example
```

## Next Steps
- Link to related docs
- **Ask Claude about**: "detailed configuration options for..."
- **Ask Claude about**: "troubleshooting when..."

## See Also
- Related documentation links
```

### **Migration Approach**
1. **Create subfolder structure** first
2. **Move files to appropriate subfolders** 
3. **Update README.md links** to reflect new structure
4. **Gradually refactor content** to overview-level approach
5. **Add Claude integration points** as content is reviewed

### **Version Transition Documentation Lifecycle**

#### **Project Bootstrap (v1.0.0 Pattern)**
1. **Initial State**: Nothing exists, ideas gathered in `docs/preliminary/`
2. **Structure Creation**: Organized docs folder structure established
3. **Content Organization**: Preliminary content graduates to permanent folders or moves to `docs/future/`
4. **Production Ready**: `docs/preliminary/` removed, organized docs reflects v1.0.0 starting position

#### **Version Transition (v1.1.0+ Pattern)**
1. **Version Planning**: Planned work selected from `docs/future/` concepts
2. **Documentation Update**: `docs/` folder updated to reflect new version starting position
3. **Implementation**: Planned work implements selected future concepts
4. **Version Completion**: Completed concepts removed from `docs/future/`, new concepts added
5. **Next Cycle**: `docs/` represents new stable starting position for next version

### **Benefits**
- **Faster onboarding** - people find what they need quickly
- **Lower maintenance** - less detailed content to keep current
- **Better discoverability** - clear organization and entry points  
- **Leverages AI** - Claude provides the deep detail on demand
- **Practical focus** - gets people productive rather than comprehensive

This strategy prioritizes **actionable overview** over **comprehensive reference**, making documentation more useful and maintainable while leveraging Claude for detailed guidance.