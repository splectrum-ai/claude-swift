# PROJECT KEYWORD_REGISTRY

This file maintains project-specific workflow trigger keywords that extend the base WoW KEYWORD_REGISTRY.

## Epic-Specific Keywords

Reserved for epic-specific workflows when needed:

| Epic | Potential Keywords | Status |
|------|-------------------|--------|
| **RR** | REPOSITORY_RESTRUCTURE | Not yet created |
| **SE** | SPECTRUM_ENGINES | Not yet created |
| **CAE** | CORE_API_ENHANCEMENT | Not yet created |
| **TDD** | TEST_DRIVEN_DEVELOPMENT | Not yet created |
| **BARE** | BARE_MIGRATION | Not yet created |
| **NFD** | NEW_FUNCTIONALITY | Not yet created |
| **AVRO** | AVRO_INTEGRATION | Not yet created |

## Project-Specific Customizations

### ESSENTIAL_COMMANDS Customization
- **SPL Platform Operations**: Core SPL execution commands for SPlectrum platform

## Registry Inheritance

This project registry extends the base WoW registry located at `../wow/KEYWORD_REGISTRY.md`. All base workflow keywords are inherited and available in this project context.

## Usage Pattern

For project-specific workflows:
```markdown
**EPIC_KEYWORD** → See [../wow/workflows/EPIC_FILENAME.md](../wow/workflows/EPIC_FILENAME.md)
```

For inherited WoW workflows, refer to the base registry at `../wow/KEYWORD_REGISTRY.md`.