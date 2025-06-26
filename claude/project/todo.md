# Repository Todo List

## Current Session Items (2025-06-26)

**Interactive Sidecar Deployment Learning** ✅ COMPLETE:
- [x] Research existing sidecar patterns in codebase
- [x] Found sophisticated existing architecture - no new infrastructure needed
- [x] Fix documentation inconsistency: claude-project/ vs /claude/project/
- [x] Document pragmatic deployment strategy (rigid vs operational)
- [x] Manual template sync: /claude/ → /template/ + CLAUDE.md copy
- [x] Clean hook files to generic minimal templates
- [x] Deploy claude-swift sidecar to InfoMetis using operational-first approach
- [x] Create comprehensive deployment results documentation
- [x] Update CLAUDE.md with sesame magic word clarification

**Outstanding Items for Future Sessions**:
- [ ] Check correctness of claude-swift documentation against actual implementation
- [ ] Create instructions for populating project directories after deployment
- [ ] Create TEMPLATE_PUBLISH workflow

**Key Discovery**: claude-swift already implements battle-tested sidecar deployment pattern with dual-folder architecture.

**Critical Insight**: All files in /claude/project/ root are mandatory hooks - template correctly preserves only audit/ and todo.md structure.

---

*All planning complete - see GitHub issues for implementation tracking.*

---

*This file maintains persistent todo items and discussion topics across development sessions.*

---

[← Back to Claude-Swift Home](../../README.md)