# DDS - Agent Context

**SOURCE OF TRUTH**: `.claude/agent-context.json`

## Meta: Writing Rules for Agents

| Do | Don't |
|----|-------|
| Terse, scannable | Verbose prose |
| Code: ✅/❌ | Paragraphs |
| Tables for lookup | Nested bullets |
| `symptom → fix` | "Consider..." |

---

## Wu Wei (無為) - Effortless Action

| Principle | Do | Don't |
|-----------|----|----|
| Simple over clever | Let solutions emerge | Over-engineer |
| Add only needed | 3 similar lines > abstraction | DRY zealotry |
| Trust the flow | Existing patterns first | Invent when existing works |
| No force | Step back if fighting | Hack around system |
| Backwards compat | ADD new, DEPRECATE old | REMOVE until v3 |

**Pre-commit:** Am I adding complexity? Does pattern exist? Delete > add?

---

## Color Workflow (CRITICAL)

**BEFORE any color:** Read `.claude/color-matrix.json`

1. Identify background category (dark/light/accent/subtle)
2. Look up allowed: text.primary, icons.primary, borders.default
3. Check FORBIDDEN list

**Golden Rule:**
```
❌ Same family on itself = INVISIBLE
   ABYSS[200] on ABYSS[500] = WRONG
```

---

## Git Commits (CRITICAL)

**NEVER add Co-Authored-By lines.**
```
❌ Co-Authored-By: Claude...
✅ Clean commit message
```

---

## Quick Commands

```bash
npm run typecheck && npm run lint && npm run build
npm run validate:tokens   # check token drift
```

---

## Token Architecture (3-File System)

| File | Purpose |
|------|---------|
| `src/constants/designTokens.ts` | Source of truth (TypeScript) |
| `src/styles.css` @theme | Tailwind v4 CSS-first |
| `tailwind-preset.js` | NPM package preset |

**Update:** Color changes → all 3 files | Semantic alias → TS + CSS

---

## Lazy Load (ALWAYS read before task)

| Task | Read First |
|------|------------|
| **Components** | `.claude/component-dev-rules.md` |
| **Colors** | `.claude/color-matrix.json` |
| **Contrast/WCAG** | `.claude/contrast-matrix.json` |
| **Dark mode** | `.claude/dark-mode-mapping-rules.md` |
| **Spacing** | `.claude/spacing-rules.md` |
| **Border radius** | `.claude/rounded-corners-rules.md` |
| **Typography** | `.claude/typography-rules.md` |
| **Icons** | `.claude/iconography-rules.md` |
| **CSS/Tailwind** | `.claude/css-styling-rules.md` |
| **MDX/Storybook** | `.claude/storybook-rules.md` |
| **Writing stories** | `.claude/storybook-rules.md` + `src/stories/_infrastructure/` |
| **Tests** | `.claude/testing-quick-ref.md` |
| **Delivery** | `.claude/delivery-package-guide.md` |
| **Prompt templates** | `.claude/prompt-library.md` |
