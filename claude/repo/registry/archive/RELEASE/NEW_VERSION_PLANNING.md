[← Back to Workflows](../workflows/) | [← Back to Claude-Swift Home](../../../README.md)

# NEW_VERSION_PLANNING Workflow

**Note:** This is a specialized workflow coordinated by the main VERSION workflow.

## New Version Planning Process

Systematic planning workflow to establish scope, priorities, and work organization for the next version after VERSION_TRANSITION completion.

## Trigger
**User-Friendly**: Coordinated by VERSION workflow (`version sesame`)
**Technical**: `NEW_VERSION_PLANNING`

**Input**: Clean knowledge base and repository from VERSION_TRANSITION
**Output**: Organized next version with clear scope, milestones, and labeled issues for development

## Workflow Steps

### 1. Execute New Version Planning Script
```bash

# Execute comprehensive version planning process
claude/wow/scripts/transition-manage new-version-planning

```

## Script Integration

The new version planning process executes a comprehensive 5-step planning sequence:

### Automated Planning Steps
1. **Version Setup**: Extract version information from configuration and validate readiness
2. **Issue Selection**: Analyze backlog issues and select appropriate scope for version
3. **Milestone Creation**: Create version milestone with scope control and issue assignment
4. **Label Organization**: Set up version labels and filtering for efficient workflow
5. **Scope Validation**: Validate work scope against capacity and refine as needed

### Planning Automation
- **Version configuration analysis**: Read target version and strategy from project config
- **Issue prioritization**: Analyze issue backlog for version inclusion criteria
- **Milestone management**: Create and configure version milestones with proper scope
- **Label management**: Set up version and feature labels for organization
- **Scope validation**: Balance planned work against realistic development capacity

## Simplified Organization Strategy

### Milestone-as-Version Approach
- **Single Version Milestone**: One milestone per version (e.g., `v1.3.0`)
  - Contains all issues planned for that version
  - Provides clear version scope and progress tracking
  - Aligns with release planning and version completion

### Label Strategy
- **Version Labels**: Match milestone names for dual filtering capability
- **Feature Labels**: Categorize issues by feature area or component
- **Minimal Overhead**: Focus on essential categorization only

### Filtering Patterns
- **Version Work**: `claude/wow/scripts/issue-manage list v1.3.0`
- **Feature Work**: `claude/wow/scripts/issue-manage list feature-name`
- **Version + Feature**: `claude/wow/scripts/issue-manage list v1.3.0 feature-name`
- **Dependencies**: Track in issue descriptions and comments

## Work Breakdown Methodology

### Issue Decomposition Criteria
1. **Single Session Completable**: Each child issue finishable in one development session
2. **Clear Acceptance Criteria**: Unambiguous definition of "done"
3. **Minimal Dependencies**: Reduce inter-issue dependencies where possible
4. **Domain Focused**: Each issue primarily within single knowledge domain

### Effort Sizing Approach
- **Complexity Assessment**: Technical complexity and knowledge domain breadth
- **Dependency Analysis**: External dependencies and coordination requirements
- **Risk Evaluation**: Technical risks and unknown factors
- **Resource Requirements**: Specialized knowledge or tools needed

### Scope Validation
- **Version Capacity**: Realistic assessment of development capacity for version timeline
- **Feature Balance**: Ensure balanced distribution of work across different areas
- **Quality Standards**: Include testing, documentation, and review requirements in scope

## Strategic Planning Integration

### Version Type Considerations
- **Major Version**: Multiple features, significant architectural changes, longer timeline
- **Minor Version**: 1-2 features, feature additions, moderate timeline
- **Patch Version**: Bug fixes or critical updates, minimal timeline

### Feature Coordination Strategy
- **Sequential Features**: Features that must be completed in specific order
- **Parallel Features**: Features that can be developed simultaneously
- **Supporting Features**: Infrastructure features that enable other feature development

### Risk Management Planning
- **Technical Risks**: Identify high-risk areas requiring additional planning or research
- **Dependency Risks**: External dependencies that could impact version timeline
- **Scope Risks**: Areas where scope might expand during development

## Success Criteria

- Version information retrieved from configuration (`claude/project/version-config.md`)
- Target version number extracted and validated
- Version issues selected based on strategic priorities and capacity
- Single version milestone created with target version number
- Issue execution order defined with clear rationale
- All selected issues assigned to version milestone

### Work Planning Completeness
- [ ] All planned work aligned with selected version scope
- [ ] Gap analysis completed and missing work items identified
- [ ] Work scope balanced against realistic development capacity
- [ ] Issues properly categorized with feature labels

### Development Readiness
- [ ] All implementation issues have clear acceptance criteria
- [ ] Work items appropriately sized for single-session completion
- [ ] Dependencies between issues documented in descriptions/comments
- [ ] Version scope validated against timeline and resource constraints
- [ ] Version label created and applied to all planned issues
- [ ] Filtering commands tested and documented for development workflow

## Integration with Version Lifecycle

### Pre-Planning Dependencies
- Requires completed VERSION_TRANSITION workflow
- Clean repository and knowledge base
- Updated documentation and onboarding materials
- Version configuration available for information queries

### Post-Planning Outcomes
- Ready-to-execute version scope with organized work breakdown
- Label-based issue organization for efficient filtering
- Clear development priorities and sequencing
- Version tracking through labels and milestones

### Development Phase Preparation
- Development can begin immediately with clear work priorities
- Label filtering provides visibility into version progress
- Issue breakdown supports systematic development approach

## Automation Opportunities

### Milestone Setup Automation
- Automated milestone creation with standard configuration
- Template-based milestone creation for common version patterns
- Automated issue migration from previous version planning

### Work Analysis Automation
- Automated gap analysis comparing planned work to feature requirements
- Issue complexity analysis based on content and labels
- Scope validation against historical development velocity

### Planning Validation
- Automated dependency analysis between issues and milestones
- Timeline feasibility analysis based on work breakdown
- Feature balance validation ensuring appropriate scope distribution

## Future Evolution

### Enhanced Planning Analytics
- Historical feature completion time analysis for better estimation
- Work breakdown pattern analysis for improved decomposition
- Cross-version learning integration for planning improvement

### Collaborative Planning Tools
- Stakeholder input integration for feature prioritization
- Team capacity planning and work assignment optimization
- Risk assessment integration with planning decisions

---

*This workflow ensures systematic and comprehensive planning for each new version, establishing clear scope, organized work breakdown, and effective version management infrastructure for successful version development.*