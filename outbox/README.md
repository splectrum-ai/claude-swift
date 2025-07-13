# Outbox

This folder contains items ready for delivery to other repositories.

## Naming Convention

`YYYY-MM-DD_TARGET-ORG_TARGET-REPO_ITEM-TYPE_DESCRIPTION.md`

Examples:
- `2025-07-13_sesameh_claude-swift_workflow_simplified-git-workflow.md`
- `2025-07-13_splectrum_api-kafka_schema_streaming-record-format.md`
- `2025-07-14_infometish_pear-package_config_p2p-deployment-spec.md`

## Item Types

- `workflow` - Process or workflow changes
- `schema` - AVRO schema definitions
- `config` - Configuration updates
- `spec` - Specifications or requirements
- `doc` - Documentation updates
- `feature` - Feature proposals

## Content Requirements

Each outbox item MUST be self-contained and include:

### 1. Clear Action Required
- What needs to be done
- Why it needs to be done
- Expected outcome

### 2. Quality Gates / Success Criteria
- Testable success conditions
- Verification steps
- Definition of "done"

### 3. Implementation Guidance
- Specific steps or approach (if relevant)
- Examples or patterns to follow
- Potential gotchas or considerations

### 4. Standard Template Structure
```markdown
# [Title]

**Target**: [org]/[repo]
**Date**: YYYY-MM-DD
**From**: [source-org] ([context])

## Executive Summary
[1-2 sentences: what and why]

## Action Required
[Clear description of what needs to be done]

## Success Criteria / Quality Gates
- [ ] Criterion 1 (how to verify)
- [ ] Criterion 2 (how to verify)
- [ ] Tests pass: [specific tests]

## Implementation Notes
[Optional: specific guidance if needed]

## Questions/Concerns?
Please add any feedback to the inbox of [source] repository.
```

## Processing

Items remain until confirmed delivered and processed by target repository.