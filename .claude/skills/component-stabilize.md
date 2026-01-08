# Stabilize Component to Clean Code A+



**Category:** components | **Tags:** stabilization, clean-code, refactoring, production-ready, mcp, wu-wei, qoe
**Variables:** `{COMPONENT}`
**Read first:** `.claude/clean-code-rules.md`, `.claude/core-components-stabilization.md`

---

Stabilize {COMPONENT} to Clean Code A+ standard.

## Philosophy Triad Mindset

**Wu Wei (Engineering):**
- Work WITH the existing code structure, not against it
- Simplify without over-engineering—delete > add
- If refactoring feels like a fight, scope may be too large

**QoE (Process):**
- Make it smaller: stabilize one aspect at a time
- Allow ugliness: functional first, polish after
- Stop at coherent points: don't refactor everything at once

## PRE-FLIGHT: MCP Checks
```
mcp__dds__get_component({ name: "{COMPONENT}" })  // Get current status/variants
mcp__dds__get_design_tokens({ category: "colors" })  // Reference for token fixes
```

READ RULES:
- `.claude/clean-code-rules.md` (grading rubric)
- `.claude/core-components-stabilization.md` (tracking)

## PHASE 1: ANALYZE

1. Read component file
2. Grade current state (A+ to F):
   | Grade | Criteria |
   |-------|----------|
   | A+ | Functions <30 lines, single responsibility, named constants, semantic tokens |
   | A | Functions <40 lines, minor naming issues |
   | B | Functions <60 lines, some magic numbers |
   | C | Functions >60 lines, multiple responsibilities |
   | D/F | God functions, hardcoded values, no structure |

## PHASE 2: REFACTOR (apply in order)

1. **Extract constants** (top of file, SCREAMING_SNAKE)
   ```tsx
   const ANIMATION_DURATION_MS = 1500
   const BORDER_RADIUS = '12px'
   ```

2. **Add section headers**
   ```tsx
   // =============================================================================
   // CONSTANTS | VARIANTS | TYPES | HOOKS | SUB-COMPONENTS | MAIN COMPONENT
   // =============================================================================
   ```

3. **Extract hooks** (custom logic → `useXxx` function)

4. **Extract sub-components** (repeated JSX → named function with props interface)

5. **Semantic tokens** - validate with MCP:
   ```
   mcp__dds__check_token_usage({ token: "bg-white" })  // Should suggest bg-surface
   mcp__dds__check_token_usage({ token: "text-gray-500" })  // Should suggest text-muted
   ```
   ```tsx
   // ❌ 'text-white', 'border-[var(--brand-abyss-300)]'
   // ✅ 'text-inverse', 'border-strong'
   ```

6. **Contrast verification** (for any dark backgrounds):
   ```
   mcp__dds__check_contrast({ background: "ABYSS[800]", foreground: "SLATE[200]" })
   ```

7. **Document primitive exceptions** (if primitives unavoidable, explain WHY)

## PHASE 3: TRACK

Update `.claude/core-components-stabilization.md`:
- Change status: `⬜ TODO` → `✅ STABILIZED`
- Add entry: `**{COMPONENT}** - ATOM, clean code A+, semantic tokens`

## PHASE 4: VERIFY

Run: `npm run typecheck && npm run lint`

OUTPUT:
- Clean code A+ component
- Updated tracking doc
- Grade improvement summary (e.g., "B → A+")
- MCP validation results

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
