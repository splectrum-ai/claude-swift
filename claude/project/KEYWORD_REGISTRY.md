# PROJECT KEYWORD_REGISTRY

This file maintains project-specific workflow trigger keywords that extend the base WoW KEYWORD_REGISTRY.

## Project-Specific Workflow Keywords

| Keyword | File | Purpose | Trigger Context | Sesame Alias |
|---------|------|---------|-----------------|--------------|
| **TEMPLATE_SYNCHRONIZATION** | `TEMPLATE_SYNCHRONIZATION.md` | Template synchronization workflow | Template updates and synchronization | `template sesame` |
| **DEPLOYMENT** | `DEPLOYMENT.md` | Main deployment workflow router | Sidecar deployment operations | `deployment sesame` |

## Future Project Keywords

Reserved for claude-swift specific workflows when needed:

| Epic | Potential Keywords | Status |
|------|-------------------|--------|
| **DEPLOY** | DEPLOYMENT_AUTOMATION | Not yet created |
| **SIDECAR** | SIDECAR_DEPLOYMENT | Not yet created |
| **HOOK** | HOOK_MANAGEMENT | Not yet created |

## Sesame Alias Mapping

Project-specific sesame triggers:

```
template sesame → TEMPLATE_SYNCHRONIZATION
deployment sesame → DEPLOYMENT
```

## Registry Inheritance

This project registry extends the base WoW registry located at `../wow/KEYWORD_REGISTRY.md`. All base workflow keywords are inherited and available in this project context.

## Usage Pattern

For project-specific workflows:
```markdown
**PROJECT_KEYWORD** → See [workflows/PROJECT_FILENAME.md](./workflows/PROJECT_FILENAME.md)
```

For inherited WoW workflows, refer to the base registry at `../wow/KEYWORD_REGISTRY.md`.