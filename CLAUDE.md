# DDS - Agent Context

**SOURCE OF TRUTH**: `.claude/agent-context.json`

## Meta: Writing Rules for Agents

| Do | Don't |
|----|-------|
| Terse, scannable | Verbose prose |
| Code: ✅/❌ | Paragraphs |
| Tables for lookup | Nested bullets |
| `symptom → fix` | "Consider..." |

## Estimation Rules

**All estimates are for AGENTS, not humans.** Humans won't do the work.

| Task Type | Agent Time |
|-----------|------------|
| Simple refactor | 5-10 min |
| Multi-file migration | 15-30 min |
| New component | 10-20 min |
| Complex feature | 30-60 min |

```
❌ "This would take a developer 2-3 hours..."
✅ "Agent estimate: ~15 min"
```

---

## Prompt Library & Skills

**Single source of truth:** `src/components/shared/PromptLibrary/prompts.ts`

**Auto-generated:**
- `.claude/prompt-library.md` - Human-readable reference
- `.claude/skills/*.md` - Agent-consumable skill files

| Request Type | Skill File |
|--------------|------------|
| Story/Storybook | `story-full.md`, `story-allstates.md` |
| New component | `component-create.md` |
| Stabilize component | `component-stabilize.md` |
| Add color/token | `token-add-color.md` |
| Audit tokens | `token-audit.md` |
| MDX docs | `docs-mdx-page.md` |
| Code review | `review-dds-compliance.md` |
| Pre-PR check | `review-pre-pr.md` |

**Agent Workflow:**
```
1. Match request → skill in .claude/skills/
2. Read skill file for REQUIREMENTS
3. Read referenced .claude/*.md files (listed in skill)
4. Respect FORBIDDEN items
5. Deliver in OUTPUT format
```

**Validation:**
```bash
npm run validate:prompts   # Check paths in prompts exist
npm run sync:prompts       # Regenerate skills from prompts.ts
```

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

**Version Bump Checklist:**

| Change | Bump | Update |
|--------|------|--------|
| New component/feature | MINOR | package.json, changelog.json, **README.md** |
| Architecture change | MINOR+ | package.json, changelog.json, CLAUDE.md, **README.md** |
| Breaking change | MAJOR | package.json, changelog.json, v3-breaking-changes.md, **README.md** |
| Bug fix | PATCH | package.json, changelog.json |
| New subpath export | MINOR | package.json, changelog.json, **README.md** (Package Architecture) |

**README Drift Prevention:**
```
BEFORE PR: Does this change affect consumers?
├── New import path? → Update README Package Architecture
├── New component category? → Update README Components list
├── New setup step? → Update README Quick Start
└── API change? → Update README Usage examples
```

---

## Quick Commands

```bash
npm run typecheck && npm run lint && npm run build
npm run health            # full validation suite
npm run validate:tokens   # check token drift
npm run validate:prompts  # check prompt path drift
npm run sync:prompts      # regenerate skills from prompts.ts
```

---

## Package Architecture (Multi-Package)

| Subpath | Purpose | Components |
|---------|---------|------------|
| `@dds/core` | Shared across ALL products | Button, Card, Input, tokens, utils |
| `@dds/flow` | Flow EHS mobile app | MobileNavButton, MobileNavBar, QuickActionButton |

**Import Pattern:**
```tsx
import { Button } from '@dds/design-system/core'
import { MobileNavButton } from '@dds/design-system/flow'
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
| **UX/Usability** | `.claude/ux-laws-rules.md` |
| **Components** | `.claude/component-dev-rules.md` |
| **Colors** | `.claude/color-matrix.json` |
| **Contrast/WCAG** | `.claude/contrast-matrix.json` |
| **Dark mode** | `.claude/dark-mode-mapping-rules.md` |
| **Depth/Elevation** | `.claude/depth-layering-rules.md` |
| **Spacing** | `.claude/spacing-rules.md` |
| **Border radius** | `.claude/rounded-corners-rules.md` |
| **Typography** | `.claude/typography-rules.md` |
| **Icons** | `.claude/iconography-rules.md` |
| **CSS/Tailwind** | `.claude/css-styling-rules.md` |
| **MDX/Storybook** | `.claude/storybook-rules.md` |
| **Writing stories** | `.claude/storybook-rules.md` + `src/stories/_infrastructure/` |
| **Tests** | `.claude/testing-quick-ref.md` |
| **Delivery** | `.claude/delivery-package-guide.md` |
| **Prompt templates** | `.claude/skills/*.md` (task-specific skill files) |
