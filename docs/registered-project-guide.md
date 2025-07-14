[← Back to Claude-Swift](../README.md)

# Guide for Registered Projects

This guide explains what workflows are available when your project is registered with the Claude-Swift orchestrator.

## What Happens When You're Registered

When your project is registered with Claude-Swift:

1. You receive a symlink to the universal WoW workflows
2. Your `claude/wow/` directory points to the orchestrator's workflows
3. You get access to ALL universal workflows
4. You do NOT get orchestrator-specific workflows

## Available Workflows in Your Project

### ✅ What You CAN Use

All universal workflows are available via sesame triggers:

**Session Management**
- `start sesame` - Begin a work session
- `finish sesame` - End session with cleanup

**Task & Issue Management**
- `next sesame` - Get prioritized work recommendations
- `issue sesame` - Sync issue cache or create structured GitHub issues
- `inbox sesame` - Process tasks sent to your inbox (auto-assigns target version milestone)
- `outbox . sesame` - Process self-targeted tasks (universal workflow)
- `task [target] sesame` - Create tasks for other projects

**Development Operations**
- `commit sesame` - Intelligent commits with issue linking
- `audit sesame` - Check audit log health

**Release Management**
- `release sesame` - Full version releases
- `patch sesame` - Patch releases
- `version sesame` - Plan next version
- `transition sesame` - Post-release automation

### ❌ What You CANNOT Use

Orchestrator-only workflows are NOT available:

- `initialise sesame` - ❌ Only for orchestrator setup
- `register [repo] sesame` - ❌ Only orchestrator can register projects
- `outbox sesame` - ❌ Only orchestrator distributes tasks

## How Task Communication Works

### Sending Tasks
1. Create a task in your project: `task target-repo sesame`
2. Task goes to your local `claude/outbox/`
3. Orchestrator runs `outbox sesame` to collect it
4. Task is delivered to target's `claude/inbox/`

### Receiving Tasks
1. Tasks arrive in your `claude/inbox/`
2. Run `inbox sesame` to convert them to GitHub issues
   - Issues are automatically assigned to your target version milestone
   - Override with explicit `milestone:` field in task files if needed
3. Use `next sesame` to prioritize work

## Directory Structure in Your Project

```
your-project/
├── claude/
│   ├── wow/                    # → Symlink to orchestrator workflows
│   │   └── workflows/          # All universal workflows
│   ├── inbox/                  # Tasks sent to you
│   ├── outbox/                 # Tasks you create
│   └── project/                # Your project-specific config
│       └── audit/              # Your audit logs
└── CLAUDE.md                   # → Symlink to orchestrator CLAUDE.md
```

## Key Points

1. **Workflows are shared** - All projects use identical workflows
2. **Updates are automatic** - When orchestrator updates, you get updates
3. **No local workflow copies** - Everything runs from symlinks
4. **Project independence** - Your work stays in your repository

## Common Questions

**Q: Can I modify workflows?**
A: No, workflows are symlinked from the orchestrator. Modifications should be proposed to the orchestrator.

**Q: Why can't I use `outbox sesame`?**
A: Only the orchestrator has the `projects/` directory structure needed for task distribution.

**Q: How do I know which workflows are available?**
A: Check `claude/wow/workflows/` - if it's there, you can use it.

**Q: What if I need a custom workflow?**
A: Create it in your `claude/project/workflows/` directory. It will be local to your project only.

## Summary

As a registered project, you get:
- ✅ All universal workflows for development
- ✅ Task communication via inbox/outbox (including self-targeted tasks)
- ✅ Automatic milestone assignment from target version
- ✅ Local issue caching for performance
- ✅ Automatic workflow updates
- ❌ No orchestrator-specific capabilities
- ❌ No ability to register other projects

---

[← Back to Claude-Swift](../README.md) | [← Workflow Architecture](workflow-architecture.md)