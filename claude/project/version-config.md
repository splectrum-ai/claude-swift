[← Back to Claude-Swift Home](../../../README.md)

# Project Version Configuration

## Project Identity
- **PROJECT_NAME**: claude-swift
- **ARTIFACT_NAME**: claude-swift-template
- **INSTALL_PATH**: /mnt/c/SPlectrum/claude-swift
- **REPOSITORY**: SPlectrum/claude-swift

## Version Strategy
- **CURRENT_VERSION**: 1.0.1
- **VERSION_PATTERN**: semantic (major.minor.patch)
- **RELEASE_TYPE**: template-system
- **TARGET_VERSION**: 1.1.0 (enhanced automation and testing framework)

## Version Numbering Rules
- **Major Version**: Template architecture changes, breaking compatibility
- **Minor Version**: New workflow capabilities, deployment scenarios
- **Patch Version**: Bug fixes, documentation improvements, workflow refinements

## Release Configuration
- **RELEASE_ARTIFACTS**: ["template/", "docs/", "CLAUDE.md", "README.md", "CLAUDE-SWIFT-v1.0.1-RELEASE-NOTES.md"]
- **ARTIFACT_COMMANDS**: [
  "cp -r template/ {ARTIFACT_NAME}/",
  "cp -r docs/ {ARTIFACT_NAME}/docs/", 
  "cp CLAUDE.md {ARTIFACT_NAME}/",
  "cp README.md {ARTIFACT_NAME}/",
  "cp template/CLAUDE-SWIFT-v1.0.1-RELEASE-NOTES.md {ARTIFACT_NAME}/CLAUDE-SWIFT-v1.0.1-RELEASE-NOTES.md",
  "7z a {ARTIFACT_NAME}.7z {ARTIFACT_NAME}/"
]

## Build and Test Configuration
- **BUILD_COMMANDS**: ["# Template system - no build required"]
- **TEST_COMMANDS**: [
  "# Validate template structure",
  "# Test workflow trigger recognition", 
  "# Verify documentation links",
  "# Check deployment guide completeness"
]
- **VALIDATION_COMMANDS**: [
  "# Verify all workflows have back-links",
  "# Check for SPlectrum contamination",
  "# Validate template variable usage"
]

## Development Phases
- **Phase 1**: Template architecture and deployment guides (COMPLETE)
- **Phase 2**: Workflow system implementation (IN PROGRESS)
  - v1.0.1: Unplanned workflow fixes and improvements
- **Phase 3**: Testing and validation framework (PLANNED)
- **Phase 4**: Documentation and user guides (PLANNED)

## Integration Points
- **DEPLOYMENT_TYPE**: sidecar-template
- **TARGET_PROJECTS**: Any project requiring Claude Code ways of working
- **COMPATIBILITY**: Claude Code CLI environments
- **DEPENDENCIES**: git, gh (GitHub CLI), basic shell environment

---

*Project Hook - Version configuration for claude-swift template system*