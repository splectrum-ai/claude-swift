# PROJECT KEYWORD_REGISTRY

This file maintains project-specific workflow trigger keywords that extend the base WoW KEYWORD_REGISTRY.

## Epic-Specific Keywords

Reserved for claude-swift specific workflows when needed:

| Epic | Potential Keywords | Status |
|------|-------------------|--------|
| **TEMPLATE** | TEMPLATE_ENHANCEMENT | Not yet created |
| **DEPLOY** | DEPLOYMENT_AUTOMATION | Not yet created |
| **DOCS** | DOCUMENTATION_WORKFLOW | Available |
| **SIDECAR** | SIDECAR_DEPLOYMENT | Not yet created |
| **HOOK** | HOOK_MANAGEMENT | Not yet created |
| **TEMPLATE_PUBLISH** | TEMPLATE_PUBLISH_WORKFLOW | Not yet created |
| **RELEASE** | PROJECT_RELEASE_PROCESS | Available |

## Project-Specific Customizations

### ESSENTIAL_COMMANDS Customization
- **Claude-Swift Operations**: Template management, sidecar deployment, and workflow automation commands

## Registry Inheritance

This project registry extends the base WoW registry located at `../wow/KEYWORD_REGISTRY.md`. All base workflow keywords are inherited and available in this project context.

## Usage Pattern

For project-specific workflows:
```markdown
**EPIC_KEYWORD** → See [../wow/workflows/EPIC_FILENAME.md](../wow/workflows/EPIC_FILENAME.md)
```

For inherited WoW workflows, refer to the base registry at `../wow/KEYWORD_REGISTRY.md`.