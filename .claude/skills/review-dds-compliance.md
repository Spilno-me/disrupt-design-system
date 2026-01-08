# Code Review for DDS Compliance



**Category:** review | **Tags:** review, compliance, quality, mcp, wu-wei, maya, qoe
**Variables:** `{FILE_PATH}`
**Read first:** `.claude/ux-laws-rules.md`, `.claude/spacing-rules.md`, `.claude/typography-rules.md`, `.claude/iconography-rules.md`

---

Review {FILE_PATH} for DDS compliance.

## Philosophy Triad Check (report violations)

| Philosophy | Check For | Violation Signal |
|------------|-----------|------------------|
| **Wu Wei** | Over-engineering, fighting patterns | Premature abstraction, ignoring existing utilities |
| **MAYA** | User confusion, broken conventions | Novel interactions where familiar ones work |
| **QoE** | Scope creep, forced solutions | Complexity growing unexpectedly, hacks over investigation |

## MCP-First Validation (run for each color found)
```
// Validate token usage
mcp__dds__check_token_usage({ token: "found-token-or-color" })

// Check contrast for any dark backgrounds
mcp__dds__check_contrast({ background: "bg-color", foreground: "text-color" })

// Get color guidance for context
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
```

## Check Against Rules:
1. `.claude/ux-laws-rules.md` - UX principles (Fitts, Hick, Miller, etc.)
2. `.claude/spacing-rules.md` - spacing hierarchy
3. `.claude/typography-rules.md` - font usage (Fixel only)
4. `.claude/iconography-rules.md` - no emojis

Report format:
| Line | Issue | MCP Result | Severity | Fix |
|------|-------|------------|----------|-----|

Severity: CRITICAL (blocks), WARNING (should fix), INFO (suggestion)

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
