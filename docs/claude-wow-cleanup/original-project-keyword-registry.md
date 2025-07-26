# PROJECT KEYWORD_REGISTRY

This file maintains project-specific workflow trigger keywords that extend the base WoW KEYWORD_REGISTRY.

## Project-Specific Workflow Keywords

| Keyword | File | Purpose | Trigger Context | Sesame Alias |
|---------|------|---------|-----------------|--------------|
| **INITIALISE** | `workflows/INITIALISE.md` | One-time workspace setup and multi-project configuration | Workspace initialization, symlink setup, project directory structure | `initialise sesame`, `init sesame` |
| **PROJECT_REGISTER** | `workflows/PROJECT_REGISTER.md` | Automated project registration with symlink creation and registry tracking | Project setup for claude-swift framework, symlink management, registry updates | `register [org/repo] sesame` |
| **OUTBOX** | `workflows/OUTBOX.md` | Cross-repository task distribution and routing workflow | Task collection from registered projects, central distribution to target inboxes | `outbox sesame` |

## Future Project Keywords

Reserved for claude-swift specific workflows when needed:

| Epic | Potential Keywords | Status |
|------|-------------------|--------|
| **DEPLOY** | DEPLOYMENT_AUTOMATION | Not yet created |
| **SIDECAR** | SIDECAR_DEPLOYMENT | Not yet created |
| **HOOK** | HOOK_MANAGEMENT | Not yet created |

## Sesame Alias Mapping

```
initialise sesame → INITIALISE
init sesame      → INITIALISE
register sesame  → PROJECT_REGISTER
outbox sesame    → OUTBOX
```

## Registry Inheritance

This project registry extends the base WoW workflows located at `../wow/WORKFLOW_REFERENCE.md`. All base workflow keywords are inherited and available in this project context.

## Usage Pattern

For project-specific workflows:
```markdown
**PROJECT_KEYWORD** → See [workflows/PROJECT_FILENAME.md](./workflows/PROJECT_FILENAME.md)
```

For inherited WoW workflows, refer to the base workflow reference at `../wow/WORKFLOW_REFERENCE.md`.