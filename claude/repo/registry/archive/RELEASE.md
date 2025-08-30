# RELEASE Workflow - Unified Release Management

## Trigger
**User-Friendly**: `release sesame` + natural language request
**Technical**: `RELEASE`

## Purpose
Unified workflow for all release operations using natural language parsing.

## Supported Operations

### Full Release (Target Version)
**Examples:**
- `release sesame, target version`
- `release sesame, create new version release`
- `release sesame, full release workflow`

**Process**: Executes complete release sequence:
1. **Release Creation** - Build and publish release
2. **Version Transition** - Archive and clean up
3. **Version Planning** - Set up next version

**Sub-workflow**: [FULL_RELEASE.md](./RELEASE/FULL_RELEASE.md)

### Patch Release
**Examples:**
- `release sesame, patch`
- `release sesame, patch release`
- `release sesame, hotfix release`

**Process**: Executes patch-only release (no transition/planning)

**Sub-workflow**: [PATCH_RELEASE.md](./RELEASE/PATCH_RELEASE.md)

## Workflow Process

### 1. Intent Recognition
Parse natural language to determine release type:
- **Full release keywords**: target, version, full, complete, new version
- **Patch keywords**: patch, hotfix, quick, fix

### 2. Parameter Extraction
Extract relevant details:
- Version numbers (1.2.0, v2.0.0)
- Release notes or descriptions
- Urgency indicators

### 3. Sub-workflow Delegation
Route to appropriate release workflow:
- **Full release** → FULL_RELEASE.md (includes transition + planning)
- **Patch release** → PATCH_RELEASE.md (release only)

### 4. Result Reporting
Provide clear feedback on release completion and next steps.

## Examples

```
User: release sesame, target version
→ Routes to FULL_RELEASE.md (complete sequence)

User: release sesame, patch
→ Routes to PATCH_RELEASE.md (patch only)

User: release sesame, create new version release
→ Routes to FULL_RELEASE.md (complete sequence)

User: release sesame, hotfix release
→ Routes to PATCH_RELEASE.md (patch only)
```

## Benefits
- **Natural language interface** - No need to memorize separate triggers
- **Single entry point** - All release operations through one workflow
- **Intelligent orchestration** - Automatically sequences related workflows
- **Flexible requests** - Claude can parse various phrasings

---
*This workflow replaces the separate `release sesame`, `patch sesame`, `transition sesame`, and `version sesame` triggers with a unified natural language interface.*