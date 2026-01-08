---
name: prompt-router
enabled: true
event: prompt
action: remind
conditions:
  - field: user_prompt
    operator: regex_match
    pattern: \b(plan|design|architect|implement|create\s+(new\s+)?component|build\s+a|write\s+story|storybook|fix\s+color|contrast|dark\s+mode|review|audit|add\s+token|stabilize|refactor|clean\s+code|pre-PR|ux|accessibility|a11y|spacing|typography|icons|responsive|mobile|package|deliver)\b
---

## Prompt Library Match Detected

Your request may match an existing prompt template. **Before proceeding:**

### Option 1: Auto-Select (Recommended)
Say: **"use prompt library"** or **"select prompt"**

This will run `.claude/skills/prompt-router.md` which:
1. Analyzes your request context
2. Selects the best matching prompt
3. Executes it with proper structure

### Option 2: Direct Selection
Check CLAUDE.md "FIRST ACTION" table for direct matches:

| Pattern Detected | Prompt to Use |
|------------------|---------------|
| plan/design/architect | `plan-unified.md` |
| create component | `component-create.md` |
| fix color/contrast | `mcp-contrast-check.md` |
| dark mode | `dark-mode-check.md` |
| write story | `story-full.md` |
| review/audit | `review-dds-compliance.md` |
| stabilize/refactor | `component-stabilize.md` |
| add token | `token-add-color.md` |

### Why Use Prompts?
- Consistent, high-quality output
- MCP tools run automatically
- Anti-patterns prevented by design
- Philosophy triad (Wu Wei, MAYA, QoE) built-in

