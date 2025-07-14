# PROJECT KEYWORD_REGISTRY

This file maintains project-specific workflow trigger keywords that extend the base WoW KEYWORD_REGISTRY.

## Project-Specific Workflow Keywords

Currently no project-specific workflows are defined.

## Future Project Keywords

Reserved for claude-swift specific workflows when needed:

| Epic | Potential Keywords | Status |
|------|-------------------|--------|
| **DEPLOY** | DEPLOYMENT_AUTOMATION | Not yet created |
| **SIDECAR** | SIDECAR_DEPLOYMENT | Not yet created |
| **HOOK** | HOOK_MANAGEMENT | Not yet created |

## Sesame Alias Mapping

Currently no project-specific sesame triggers are defined.

## Registry Inheritance

This project registry extends the base WoW registry located at `../wow/KEYWORD_REGISTRY.md`. All base workflow keywords are inherited and available in this project context.

## Usage Pattern

For project-specific workflows:
```markdown
**PROJECT_KEYWORD** → See [workflows/PROJECT_FILENAME.md](./workflows/PROJECT_FILENAME.md)
```

For inherited WoW workflows, refer to the base registry at `../wow/KEYWORD_REGISTRY.md`.