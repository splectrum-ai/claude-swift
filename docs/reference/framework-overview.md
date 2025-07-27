# Claude-Swift Framework Overview

## Architecture

Claude-swift is a **framework provider**, not an orchestrator. It provides the Ways of Working (WoW) system that enables:

1. **Framework Distribution**: The `claude/wow/` directory containing scripts and workflows
2. **Task Routing**: Any project with registered projects can distribute tasks via outbox process
3. **Project Independence**: Each project runs its own Claude sessions and manages its own state

## Project Structure

Each project using the framework has:

```
project-root/
├── claude/
│   ├── wow/          # Symlink to claude-swift's WoW framework
│   ├── project/      # Project-specific configuration
│   │   ├── audit/    # Project's own audit logs
│   │   └── *.md      # Project-specific docs
│   ├── issues/       # Project's local issues
│   ├── inbox/        # Tasks received from other projects
│   └── outbox/       # Tasks to send to other projects
```

## Registered Projects

Projects register with claude-swift to:
- Receive the WoW framework via symlink
- Participate in cross-project task distribution
- Maintain independent operation

Current registered projects:
- splectrum/spl1
- jules-tenbos/splectrum
- carambah/carambah
- infometish/InfoMetis

## Key Concepts

- **Framework Provider**: Claude-swift provides tools and workflows
- **Project Autonomy**: Each project operates independently
- **Task Distribution**: Any project can act as a distributor if it has registered projects
- **Session Independence**: Each project runs its own Claude sessions
- **Registration**: Projects can implement PROJECT_REGISTER workflow to manage their own registrations