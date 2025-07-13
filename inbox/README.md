# Inbox

This folder contains items received from other repositories that need processing.

## Naming Convention

`YYYY-MM-DD_SOURCE-ORG_SOURCE-REPO_ITEM-TYPE_DESCRIPTION.md`

Examples:
- `2025-07-13_sesameh_wow_request_architecture-review.md`
- `2025-07-13_carambah_home-automation_question_p2p-networking-approach.md`

## Processing Workflow

1. Items arrive from other repositories
2. Process according to item type
3. Delete after processing (audit log maintains history)
4. If response needed, create item in `outbox/`

## Item Types

- `request` - Action requested
- `question` - Information needed
- `update` - Information update
- `feedback` - Feedback on architecture/design