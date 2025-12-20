---
name: consult-prompt-library
enabled: true
event: UserPromptSubmit
conditions: []
action: warn
---

## Reminder: Consult Prompt Library

**BEFORE starting any task**, check `.claude/prompt-library.md` for matching template.

**Task → Template mapping:**

| Request Contains | Use Template |
|------------------|--------------|
| "create story", "storybook" | Create Full Story for Component |
| "new component", "build component" | Create New UI Component |
| "stabilize", "fix component" | Stabilize Existing Component |
| "add color", "new token" | Add New Color Token |
| "audit", "check tokens" | Audit Token Usage |
| "documentation", "mdx" | Create MDX Documentation Page |
| "review", "compliance" | Code Review for DDS Compliance |
| "pre-pr", "before merge" | Pre-PR Checklist |

**If template exists:**
1. Follow template's REQUIREMENTS exactly
2. Read all referenced `.claude/*.md` files
3. Respect FORBIDDEN items
4. Deliver in expected OUTPUT format

**If no template:** Proceed with standard DDS rules from CLAUDE.md
