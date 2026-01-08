# Pre-PR Checklist



**Category:** review | **Tags:** review, pr, checklist, mcp, wu-wei, maya, qoe

---

Run pre-PR validation for my changes.

## Philosophy Triad Final Check

Before approving, verify NO violations:
- **Wu Wei**: Is code simple? Working WITH codebase? No premature abstractions?
- **MAYA**: Will users immediately understand? Familiar patterns used?
- **QoE**: Was scope appropriate? Clean completion point? No forced solutions?

## MCP Pre-Flight Checks
```
// For any new/modified components
mcp__dds__get_component({ name: "ModifiedComponent" })

// Validate any color changes
mcp__dds__check_token_usage({ token: "new-color-class" })

// Check dark background contrast
mcp__dds__check_contrast({ background: "dark-bg", foreground: "text-color" })
```

## Execute:
1. `npm run health` - must pass
2. MCP validate all color tokens in changed files
3. MCP verify contrast for dark backgrounds
4. Verify stories use infrastructure
5. Verify exports updated if new components

Report: READY or BLOCKED with specific issues + MCP validation results.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
