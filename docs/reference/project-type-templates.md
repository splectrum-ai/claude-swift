# Project Type Templates

Pre-configured workflow suites for specialized project domains that can be deployed as project templates or embedded in task-delivered workflows.

## Overview

Project type templates provide domain-specific ways of working that combine:
- **Specialized Issue Templates** - Domain-specific issue structures
- **Workflow Procedures** - Step-by-step implementation guidelines  
- **Quality Gates** - Domain-appropriate acceptance criteria
- **Tooling Integration** - Relevant tools and automation
- **Documentation Standards** - Specialized reporting formats

## Available Project Types

### API Wrapper Projects

**Purpose**: Development workflows for third-party integrations and API wrappers

**Specialized Workflows:**
- API Discovery and Analysis
- Authentication Strategy Implementation
- Error Handling and Retry Logic
- Rate Limiting and Throttling
- Documentation Generation
- Integration Testing Procedures
- Version Compatibility Management

**Issue Templates:**
- `api-analysis.md` - Third-party API assessment
- `wrapper-implementation.md` - API wrapper development
- `integration-testing.md` - End-to-end testing procedures
- `documentation-update.md` - API documentation standards

### Planning Projects

**Purpose**: Strategic planning and coordination methodologies

**Specialized Workflows:**
- Stakeholder Requirements Gathering
- Architecture Decision Records (ADRs)
- Risk Assessment and Mitigation
- Resource Planning and Allocation
- Timeline Development and Tracking
- Cross-Project Dependency Management
- Strategic Review and Approval Processes

**Issue Templates:**
- `requirement-gathering.md` - Stakeholder requirement collection
- `architecture-decision.md` - ADR creation and review
- `risk-assessment.md` - Risk analysis and mitigation planning
- `resource-planning.md` - Resource allocation and scheduling

### Security Projects

**Purpose**: Security-specific assessment and implementation workflows

**Specialized Workflows:**
- Threat Modeling and Analysis
- Security Code Review Procedures
- Vulnerability Assessment Protocols
- Penetration Testing Guidelines
- Security Documentation Standards
- Compliance Verification Processes
- Incident Response Procedures

**Issue Templates:**
- `threat-model.md` - Threat modeling and analysis
- `security-review.md` - Security-focused code review
- `vulnerability-assessment.md` - Security vulnerability analysis
- `compliance-check.md` - Regulatory compliance verification

### Performance Projects

**Purpose**: Optimization and benchmarking procedures

**Specialized Workflows:**
- Performance Baseline Establishment
- Load Testing and Stress Testing
- Profiling and Bottleneck Analysis
- Optimization Implementation
- Performance Regression Testing
- Monitoring and Alerting Setup
- Performance Documentation

**Issue Templates:**
- `performance-baseline.md` - Performance baseline establishment
- `load-testing.md` - Load and stress testing procedures
- `optimization-task.md` - Performance optimization implementation
- `monitoring-setup.md` - Performance monitoring configuration

### Documentation Projects

**Purpose**: Technical writing and knowledge management workflows

**Specialized Workflows:**
- Content Strategy Development
- Technical Writing Standards
- Review and Approval Processes
- Version Control for Documentation
- User Experience Research
- Accessibility Compliance
- Multi-format Publishing

**Issue Templates:**
- `content-strategy.md` - Documentation strategy development
- `technical-writing.md` - Technical document creation
- `doc-review.md` - Documentation review and approval
- `accessibility-audit.md` - Documentation accessibility review

## Template Structure

Each project type template includes:

```
project-type-template/
├── claude/
│   ├── issues/
│   │   └── templates/
│   │       ├── domain-specific-1.md
│   │       ├── domain-specific-2.md
│   │       └── domain-specific-3.md
│   ├── project/
│   │   ├── project-info.md          # Project type identity
│   │   ├── workflows/               # Domain-specific workflows
│   │   │   ├── DOMAIN_WORKFLOW_1.md
│   │   │   ├── DOMAIN_WORKFLOW_2.md
│   │   │   └── QUALITY_GATES.md
│   │   └── docs/
│   │       ├── domain-standards.md
│   │       ├── tooling-guide.md
│   │       └── best-practices.md
│   └── local/
│       └── repo-config.json         # Domain-specific configuration
└── README.md                        # Project type overview
```

## Task-Delivered Template Usage

When used in task-delivered workflows:

### Template Embedding
```markdown
# Task: Implement Payment Gateway Wrapper

## Embedded Workflow: API Wrapper Project Type

### Specialized Procedures:
1. API Discovery and Analysis (embedded workflow)
2. Authentication Strategy Implementation
3. Error Handling and Retry Logic
4. Integration Testing Procedures

### Quality Gates:
- [ ] API analysis document completed
- [ ] Authentication flow implemented and tested
- [ ] Error scenarios handled with appropriate retries
- [ ] Integration tests achieve 95% coverage
- [ ] Documentation meets API wrapper standards

### Issue Template: api-wrapper-implementation.md
[Template content embedded here...]
```

### Dynamic Activation
When task is processed into issue:
1. Issue template automatically applied
2. Specialized workflow procedures activated
3. Quality gates configured
4. Domain-specific tooling enabled
5. Reporting standards applied

## Benefits

### For Requesting Projects
- **Consistent Quality**: Standardized domain expertise
- **Reduced Coordination**: Clear expectations embedded in tasks
- **Quality Assurance**: Built-in quality gates and standards
- **Predictable Deliverables**: Known formats and structures

### For Receiving Projects
- **Domain Guidance**: Step-by-step specialized procedures
- **Quality Enhancement**: Access to expert methodologies
- **Learning Opportunity**: Exposure to domain best practices
- **Tool Integration**: Pre-configured domain-specific tools

### For Organizations
- **Knowledge Sharing**: Domain expertise distributed across teams
- **Standards Consistency**: Unified approaches to common problem domains
- **Quality Improvement**: Consistent high-quality deliverables
- **Efficiency Gains**: Reduced ramp-up time for specialized work

## Implementation Notes

1. **Template Registry**: Maintain central registry of available project types
2. **Version Management**: Project type templates should be versioned
3. **Customization**: Allow project-specific customization of base templates
4. **Migration**: Support migration between project types as needs evolve
5. **Validation**: Ensure templates meet domain-specific quality standards

---

*Project type templates enable domain expertise to flow through the task delivery system, creating specialized temporary behavioral overlays in receiving projects.*