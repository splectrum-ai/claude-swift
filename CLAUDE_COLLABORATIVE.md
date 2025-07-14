# CLAUDE_COLLABORATIVE.md

Balanced operational guidance for Claude Code - maintaining collaboration while improving efficiency.

## Core Philosophy

**Collaborative Work**: AI and human working together, not AI working alone
**Transparency**: Show thinking and progress, but concisely
**Smart Automation**: Automate routine tasks, collaborate on decisions
**Outcome-Focused**: Process serves the goal, not vice versa

## Streamlined Workflows (Keep the Good Ones)

### Essential Workflows
- **`commit sesame`** → Smart commit with issue tracking
- **`issue sesame`** → Issue cache sync and creation
- **`release sesame`** → Collaborative release process
- **`task sesame`** → Cross-repository communication
- **`sesame`** → Universal "yes, proceed"

### Collaborative Checkpoints
- **`start sesame`** → Light session start (only when needed)
- **`finish sesame`** → Session wrap-up (only for long sessions)

### Planning & Tracking
- **`version sesame`** → Collaborative version planning
- **`next sesame`** → "What should we work on next?"

## Balanced Principles

1. **Show Don't Tell**: Use TodoWrite to show planning, but keep it light
2. **Ask When Uncertain**: Collaborate on decisions, execute routine tasks
3. **Progressive Disclosure**: Start simple, add detail when asked
4. **Audit Light**: Log completions, not every step

## Collaboration Patterns

### For Simple Tasks
```
User: "Fix the typo in README"
AI: [Finds and fixes typo] Fixed the typo in README.md:42
```

### For Complex Tasks
```
User: "Implement user authentication"
AI: I'll help implement user authentication. Let me plan this:
[Uses TodoWrite with 3-5 main tasks]
Starting with the database schema...
[Shows progress, asks when choices needed]
```

### For Decisions
```
AI: I found 3 approaches for this:
1. [Option A - brief description]
2. [Option B - brief description]
3. [Option C - brief description]

Which would you prefer?
User: sesame [or specific choice]
```

## Efficiency Improvements

1. **Conditional Workflows**: Only run heavy workflows when needed
2. **Smart Defaults**: Assume common patterns unless specified
3. **Batch Operations**: Group related tasks together
4. **Context Awareness**: Remember session context without heavy scanning

## What We Keep

✓ **Cache-first approach** - Reliable and fast
✓ **Exact file paths** - Clear communication
✓ **Main branch workflow** - Simple git flow
✓ **Issue integration** - Tracks progress naturally
✓ **Cross-repo tasks** - Powerful coordination

## What We Simplify

- **Mandatory scanning** → Only on request or errors
- **Complex audit logs** → Simple completion tracking
- **Deep workflow nesting** → Flat, clear execution
- **Excessive documentation** → Focus on doing
- **Redundant confirmations** → Trust established patterns

## Collaborative Shortcuts

- **"Let's..."** → AI uses TodoWrite and shows plan
- **"Can you..."** → AI does it directly if simple
- **"Should we..."** → AI presents options
- **"What about..."** → AI investigates and reports
- **Quick approval** → "sesame" to proceed

## Session Flow

1. **Natural Start**: Jump into work (use `start sesame` only for complex sessions)
2. **Transparent Progress**: Show what you're doing with tools
3. **Collaborative Decisions**: Present options for non-obvious choices
4. **Smart Completion**: Commit when logical, wrap up when natural

## Key Insight

The best collaboration happens when:
- The AI shows its work without overwhelming detail
- Decisions are presented clearly with good defaults
- Routine tasks are handled efficiently
- Progress is visible but not verbose
- The human feels in control while the AI handles complexity

This approach maintains the collaborative spirit while reducing cognitive overhead and improving actual productivity.