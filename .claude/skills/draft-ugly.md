# Create Ugly First Draft

> **QoE:** Allow ugliness

**Category:** components | **Tags:** draft, ugly, qoe, iteration
**Variables:** `{COMPONENT}`

---

Create ugly first draft of {COMPONENT}.

## QoE Principle: Allow Ugliness

> "Give permission to fail, be messy, be wrong. The need to be good kills curiosity."

## Rules for Ugly Draft

1. **No abstractions** - Inline everything
2. **Hardcode values** - Magic numbers are fine
3. **Skip edge cases** - Happy path only
4. **Copy-paste allowed** - Don't DRY yet
5. **No comments needed** - Code explains itself later
6. **Skip tests** - Verify manually

## What Makes This Different

| Normal Prompt | Ugly Draft |
|---------------|------------|
| MCP duplicate check | Skip it |
| Semantic tokens | Hardcode colors |
| CVA variants | Inline className |
| TypeScript strict | `any` is fine |
| Error handling | Let it crash |

## The Deal

After ugly draft works:
1. Show it working (screenshot/demo)
2. THEN refactor with proper patterns
3. THEN run `component-stabilize` prompt

## FORBIDDEN
- Perfectionism
- "But we should..."
- Premature optimization
- Checking if pattern exists

OUTPUT: Working ugly code. Refactor comes LATER.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
