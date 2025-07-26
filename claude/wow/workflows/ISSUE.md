# ISSUE Workflow - Unified Issue Management

## Trigger
**User-Friendly**: `issue sesame` + natural language request
**Technical**: `ISSUE`

## Purpose
Unified workflow for all GitHub issue operations using natural language parsing.

## Supported Operations

### Issue Closure
**Examples:**
- `issue sesame, can you close #456?`
- `issue sesame, close issue 123 as completed`
- `issue sesame, mark #789 as resolved`

**Sub-workflow**: [CLOSE_ISSUE.md](./ISSUE/CLOSE_ISSUE.md)

### Next Issue Recommendation  
**Examples:**
- `issue sesame, what's next?`
- `issue sesame, show me recommended issues`
- `issue sesame, what should I work on?`

**Sub-workflow**: [NEXT_ISSUE.md](./ISSUE/NEXT_ISSUE.md)

### Issue Cache Management
**Examples:**
- `issue sesame, sync the cache`
- `issue sesame, refresh issue data`
- `issue sesame, update issue cache`

**Sub-workflow**: [ISSUE_CACHE.md](./ISSUE/ISSUE_CACHE.md)

### Issue Creation
**Examples:**
- `issue sesame, create issue for bug fix`
- `issue sesame, new issue: implement feature X`
- `issue sesame, add issue about documentation`

**Sub-workflow**: [CREATE_ISSUE.md](./ISSUE/CREATE_ISSUE.md)

## Workflow Process

### 1. Intent Recognition
Parse natural language to determine operation:
- **Close keywords**: close, mark as, resolve, complete
- **Next keywords**: next, recommend, what should, suggest
- **Cache keywords**: sync, refresh, update, cache
- **Create keywords**: create, new, add, make

### 2. Parameter Extraction
Extract relevant details:
- Issue numbers (#123, 456)
- Descriptions and context
- Labels or metadata

### 3. Sub-workflow Delegation
Route to appropriate sub-workflow with extracted parameters.

### 4. Result Reporting
Provide clear feedback on operation completion.

## Examples

```
User: issue sesame, can you close #456 as completed?
→ Routes to CLOSE_ISSUE.md with issue=456, reason="completed"

User: issue sesame, what's next?  
→ Routes to NEXT_ISSUE.md

User: issue sesame, sync the cache
→ Routes to ISSUE_CACHE.md

User: issue sesame, create issue for fixing the login bug
→ Routes to CREATE_ISSUE.md with description="fixing the login bug"
```

## Benefits
- **Natural language interface** - No need to memorize specific triggers
- **Single entry point** - All issue operations through one workflow
- **Flexible requests** - Claude can parse various phrasings
- **Modular implementation** - Each operation has dedicated sub-workflow

---
*This workflow replaces the separate `close sesame`, `next sesame`, and individual issue triggers with a unified natural language interface.*