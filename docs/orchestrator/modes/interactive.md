# Interactive Orchestration Mode

## Overview

Interactive orchestration is the current operational mode of claude-swift, where human intelligence guides strategic decisions while AI handles tactical execution. This mode emphasizes real-time collaboration between human and AI to coordinate work across multiple projects.

## Core Principles

### Human-in-the-Loop Coordination
- **Strategic Control**: Humans decide what to work on and when
- **Tactical Execution**: AI handles implementation details
- **Choice Points**: Every step completion presents options
- **Synchronous Decisions**: Real-time interaction drives progress

### Collaborative Intelligence
- **Shared Context**: Built through audit logs and session history
- **Progressive Understanding**: AI learns project patterns over time
- **Creative Partnership**: AI as thought partner, not just executor
- **Transparent Operations**: All actions visible and reversible

## How Interactive Mode Works

### 1. Session-Based Interaction
```bash
start sesame         # Initialize context
next sesame         # AI analyzes and recommends
[work happens]      # Collaborative execution
finish sesame       # Capture learnings
```

### 2. Cross-Project Coordination
```bash
# In orchestrator terminal
outbox sesame       # Human triggers distribution
inbox sesame        # Human processes tasks

# In project terminals
task . sesame       # Human creates tasks
next sesame        # AI recommends priorities
```

### 3. Decision Points
Every workflow includes natural pause points:
- After completing a step
- Before structural changes
- When switching contexts
- At session boundaries

## Behavioral Patterns

### Step-by-Step Execution
- Complete one meaningful step
- Present options
- Human chooses next action
- Prevents tunnel vision

### Propose → Review → Execute
- AI proposes actions with rationale
- Human reviews and approves
- AI executes approved actions
- Creates quality gates for future automation

### Outcome-First Optimization
- Focus on results over process
- Activate workflows only when needed
- Minimize ceremonial overhead
- Optimize for human+AI efficiency

## Integration with Task System

### Asynchronous Task Exchange
While interaction is synchronous, task routing is asynchronous:
1. Create tasks during interactive sessions
2. Tasks queue in outbox
3. Human triggers distribution when ready
4. Recipients process at their convenience

### GitHub Issue Integration
Tasks convert to issues, enabling:
- Standard workflow integration
- Priority scoring
- Dependency tracking
- Progress visualization

## Benefits of Interactive Mode

### For Developers
- Maintain control while leveraging AI
- Learn from AI's analysis
- Build context incrementally
- Reduce cognitive load

### For Teams
- Coordinate without meetings
- Share context through tasks
- Maintain autonomy
- Standardize practices

### For Projects
- Consistent execution patterns
- Accumulated knowledge
- Reduced onboarding time
- Higher quality outcomes

## Limitations and Future

### Current Limitations
- Requires human presence
- Synchronous coordination only
- Manual trigger points
- Limited parallelization

### Future: Event-Driven Mode
Interactive mode provides the foundation for future event-driven choreography:
- Quality gates from Propose-Execute pattern
- Audit trails for automation training
- Established task routing infrastructure
- Proven workflow patterns

## Best Practices

### Effective Sessions
1. Start with clear intent
2. Use AI for analysis and recommendations
3. Make decisions at natural boundaries
4. Capture learnings in audit log

### Cross-Project Work
1. Batch task creation
2. Regular distribution cycles
3. Process inbox before new work
4. Maintain project focus

### Collaboration Patterns
1. Frame requests clearly
2. Provide context when needed
3. Trust AI's analysis
4. Celebrate completed steps

## See Also

- [Collaboration Patterns](../../collaboration/patterns.md) - Deep dive into working with Claude
- [Task Routing](../task-routing.md) - How tasks flow between projects
- [Event-Driven Mode](./event-driven.md) - Future autonomous coordination