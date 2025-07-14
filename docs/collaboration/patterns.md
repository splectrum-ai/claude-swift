# Collaboration Patterns

Core interaction patterns that make human-AI collaboration effective in claude-swift.

## Propose → Review → Execute

### Pattern Overview
The foundational pattern for all significant changes. AI proposes complete plans, human reviews and approves, then AI executes with confidence.

### When to Use
- File/folder operations
- Multi-step workflows
- Structural changes
- Any irreversible action

### Example
```
Human: "We need to update the documentation structure"
AI: "I propose to:
1. Archive existing docs to docs/archive/
2. Create new structure: orchestrator/, collaboration/, reference/
3. Write new README focused on orchestration
This will preserve existing content while clarifying our new model.
May I proceed?"
Human: "sesame"
AI: *Executes plan step by step*
```

### Benefits
- Clear decision points
- Reversible planning
- Audit trail of decisions
- Natural quality gates for automation

## Step-by-Step with Choice Points

### Pattern Overview
Complete one meaningful step, then pause to present options. Prevents tunnel vision and enables dynamic prioritization.

### When to Use
- Long workflows
- Complex tasks
- Uncertain paths
- Discovery work

### Example
```
AI: "✅ Archived documentation to docs/archive/"
AI: "Next, I could:
1. Create new orchestrator overview (recommended)
2. Update README with new positioning
3. Stop here and review archived content
What would you prefer?"
Human: "Let's do the README first"
```

### Benefits
- Maintains flexibility
- Prevents overcommitment
- Allows context switches
- Celebrates incremental progress

## Outcome-First Optimization

### Pattern Overview
Focus on desired outcomes rather than prescribed processes. Activate only necessary workflows to achieve results.

### When to Use
- Clear end goals
- Process flexibility exists
- Efficiency matters
- Standard workflows feel heavy

### Example
```
Human: "I need these docs updated to reflect orchestrator model"
AI: Instead of full documentation workflow, proposes:
- Direct updates to key files
- Archive rather than delete
- Focus on user-facing content
Human: "Perfect, let's go"
```

### Benefits
- Reduced overhead
- Faster results
- Pragmatic solutions
- Maintains quality

## Ceremonial Boundaries

### Pattern Overview
Use start/finish sesame only when their ceremony adds value. Otherwise, work flows naturally without artificial boundaries.

### When to Use
- **Start**: Beginning focused work sessions
- **Finish**: Completing significant work with git operations
- **Skip**: Quick questions, minor tasks, explorations

### Example
```
# Full ceremony for major work:
Human: "start sesame"
AI: *Loads context, checks status*
[2 hours of work]
Human: "finish sesame"
AI: *Commits, pushes, summarizes*

# No ceremony for quick task:
Human: "What's in the inbox?"
AI: *Checks and reports directly*
```

### Benefits
- Reduces friction
- Natural workflow
- Ceremony when valuable
- Efficiency by default

## Universal Affirmation: "Sesame"

### Pattern Overview
Single word approval for AI proposals. Embodies trust, efficiency, and joy in collaboration.

### When to Use
- Approving proposals
- Confirming directions
- Agreeing with analysis
- Any positive response

### Example
```
AI: "Should I create issues for these 3 tasks?"
Human: "sesame"

AI: "I found 5 files to update. Shall I proceed?"
Human: "sesame"
```

### Benefits
- Minimal friction
- Clear communication
- Trust building
- Joyful interaction

## Context Building

### Pattern Overview
Progressive accumulation of shared understanding through interactions, audit logs, and explicit context sharing.

### When to Use
- Starting new projects
- Complex domains
- Team knowledge
- Long-term work

### Example
```
Session 1:
Human: "This project uses event sourcing"
AI: *Notes architecture pattern*

Session 5:
AI: "Given the event sourcing architecture, I recommend..."
Human: "Exactly! You remembered"
```

### Benefits
- Reduces repeated explanations
- Improves recommendations
- Builds working relationship
- Enables complex collaboration

## Intelligent Clarification

### Pattern Overview
AI asks for clarification only when truly needed, inferring from context when possible.

### When to Use
- Ambiguous requests
- Multiple valid interpretations
- Critical decisions
- Missing information

### Example
```
Good:
Human: "Update the docs"
AI: "I see we're working on orchestrator documentation. 
Shall I continue with the collaboration section?"

Bad:
Human: "Update the docs"
AI: "Which docs? What kind of update? What format?"
```

### Benefits
- Reduces back-and-forth
- Shows understanding
- Maintains flow
- Builds confidence

## Creative Exploration

### Pattern Overview
Use AI as thought partner for exploring possibilities rather than just executing known solutions.

### When to Use
- Design decisions
- Problem solving
- Architecture choices
- Process improvements

### Example
```
Human: "How should we handle cross-project dependencies?"
AI: "Let me explore some options:
1. Event-driven: Projects emit events, orchestrator routes
2. Pull-based: Projects poll for updates
3. Push-based: Direct notification system
Each has trade-offs..."
Human: "Tell me more about event-driven"
AI: *Expands on architecture, examples, implications*
```

### Benefits
- Discovers novel solutions
- Considers trade-offs
- Sparks insights
- True collaboration

## Error Recovery with Grace

### Pattern Overview
When things go wrong, focus on recovery and learning rather than blame or excessive apology.

### When to Use
- Mistakes happen
- Unexpected results
- System failures
- Misunderstandings

### Example
```
AI: *Deletes wrong file*
Human: "That was the wrong file"
AI: "I'll restore it from git: `git checkout HEAD -- file.md`"
AI: "Restored. The issue was unclear file paths. 
Should we establish a convention?"
Human: "Good idea"
```

### Benefits
- Fast recovery
- Learning opportunity
- Maintains momentum
- Builds resilience

## Celebration of Progress

### Pattern Overview
Acknowledge and celebrate completed work, no matter how small. Progress compounds through recognition.

### When to Use
- Task completion
- Milestone achievement
- Problem solving
- Learning moments

### Example
```
AI: "✅ Documentation restructure complete!"
Human: "Awesome work"
AI: "The new structure really clarifies the orchestrator model. 
Ready for the next challenge?"
```

### Benefits
- Maintains motivation
- Recognizes effort
- Builds positive association
- Encourages continuation

## Anti-Patterns to Avoid

### Command-Only Interaction
❌ Human issues commands, AI obeys silently
✅ Dialogue with context and reasoning

### Over-Apologizing
❌ "I'm sorry, I apologize, forgive me..."
✅ "Let me fix that" or "Here's what happened"

### Information Overwhelm
❌ Dumping all possible information
✅ Relevant context with progressive detail

### Rigid Process
❌ Following workflows regardless of need
✅ Outcome-first optimization

### Hidden Logic
❌ AI makes decisions without explanation
✅ Transparent reasoning and options

## Combining Patterns

The patterns work together:

```
Human: "Let's refactor the workflows" 
AI: Proposes plan (Propose-Execute)
Human: "sesame" (Universal Affirmation)
AI: Completes step 1
AI: "Next options..." (Step-by-Step)
Human: "Actually, let's explore alternatives" (Creative Exploration)
AI: Presents architectural options
Human: "I like option 2, implement it"
AI: Executes with outcome focus (Outcome-First)
AI: "✅ Refactoring complete!" (Celebration)
```

## See Also

- [Overview](./overview.md) - Philosophy behind these patterns
- [Lessons Learned](./lessons-learned.md) - How we discovered these patterns
- [Operational Rules](../../claude/wow/workflows/OPERATIONAL_RULES.md) - Mandatory patterns