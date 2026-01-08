# DDS - Agent Context

## SESSION START: Partnership Mode

**FIRST:** Read `.claude/partnership.md` and greet with **"Hello partner!"**

This confirms the cognitive partnership context is active. Then proceed with the user's request.

---

## FIRST ACTION: Categorize Request → Match Prompt

**BEFORE doing ANY work, categorize the user's request and check for matching prompts.**

| Request Pattern | Use Prompt | Key Requirements |
|-----------------|------------|------------------|
| "select prompt", "choose prompt", "use prompt library", "auto-select" | `prompt-router.md` | **Universal entry point** - analyzes context, selects best prompt |
| "plan", "design", "architect", "how should we", "quick plan", "iterate plan" | `plan-unified.md` | Adaptive 6-phase protocol with QoE principles (adapts depth automatically) |
| "create component", "new component", "build a" | `component-create.md` | MCP duplicate check, contrast verification |
| "write story", "storybook", "create story" | `story-full.md` | Use infrastructure, no inline decorators |
| "api simulation", "mock data", "seed data", "story data" | `story-api-simulation.md` | No hardcoded data, use seed factories |
| "fix color", "contrast", "hover state", "dark mode" | `mcp-contrast-check.md` | MCP tools first, WCAG verification |
| "review", "check code", "audit" | `review-dds-compliance.md` | Check all rule files |
| "add token", "new color", "token" | `token-add-color.md` | Update all 3 token files |
| "stabilize", "clean code", "refactor" | `component-stabilize.md` | Grade A+ standard |
| "pre-PR", "before merge" | `review-pre-pr.md` | Full health check |
| "create prompt", "new prompt", "add prompt" | `prompt-create.md` | Follow DDS conventions, MCP-first |
| "add testid", "testId", "test attributes" | `testing-attributes-add.md` | 3-layer testId strategy |
| "unit test", "create test", "write tests" | `testing-unit-create.md` | Vitest, pure functions |
| "interaction test", "play function", "storybook test" | `testing-interaction-create.md` | Storybook play() functions |
| "test coverage", "audit tests", "coverage report" | `testing-coverage-audit.md` | Full testing audit |
| "mcp drift", "sync mcp", "audit mcp", "mcp out of date" | `mcp-sync-audit.md` | Check & fix MCP data drift |

**Workflow:**
```
1. Categorize request → Find matching prompt in table above
2. If match: State "Using [prompt] for this" then read .claude/skills/[prompt]
3. If no match: Proceed normally, note if pattern should become a prompt
```

**For planning tasks specifically:** The `plan-unified.md` prompt is the **super prompt** combining all planning approaches (Discovery → Scoping → Drafting → Review → Agent Validation). It adapts depth based on task size. Do NOT say "looks good" or "production ready" after a single pass. Continue reviewing until you have ZERO open questions.

---

**TIERED CONTEXT LOADING** (Optimized for token efficiency)

| Tier | File | Lines | When |
|------|------|-------|------|
| **0: Core** | `.claude/agent-context-core.toon` | ~50 | ALWAYS loaded |
| **1: Task** | `.claude/agent-context-*.toon` | ~50 each | On-demand by task |
| **2: Full** | `.claude/agent-context.json` | 707 | Only when needed |

```
Session Start → Load agent-context-core.toon (50 lines)
Task: Colors  → Load color-matrix.toon (+74 lines)
Task: Components → Load agent-context-components.toon (+50 lines)
Need full details → Load agent-context.json (707 lines)
```

**FULL SOURCE OF TRUTH**: `.claude/agent-context.json`

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
| **Planning** ||
| **Unified plan (super prompt)** | `plan-unified.md` |
| Get unstuck | `unblock-task.md` |
| Find stopping point | `stop-at-peak.md` |
| **Stories** ||
| Story/Storybook | `story-full.md`, `story-allstates.md` |
| API simulation in stories | `story-api-simulation.md` |
| **Components** ||
| New component | `component-create.md` |
| Stabilize component | `component-stabilize.md` |
| **Tokens** ||
| Add color/token | `token-add-color.md` |
| Audit tokens | `token-audit.md` |
| **Styling** ||
| Depth/elevation | `styling-depth-layering.md` |
| Spacing | `styling-spacing.md` |
| Typography | `styling-typography.md` |
| Semantic colors | `styling-colors-semantic.md` |
| Dark mode | `dark-mode-check.md` |
| **UX & A11y** ||
| UX laws | `ux-apply-laws.md` |
| Accessibility | `a11y-semantic-html.md` |
| Contrast check | `contrast-category-check.md` |
| **Responsive** ||
| Mobile-first | `responsive-mobile-first.md` |
| **Icons** ||
| Replace emojis | `icons-replace-emoji.md` |
| **Docs** ||
| MDX docs | `docs-mdx-page.md` |
| **Meta** ||
| **Auto-select prompt (entry point)** | `prompt-router.md` |
| Create new prompt | `prompt-create.md` |
| **Review** ||
| Code review | `review-dds-compliance.md` |
| Pre-PR check | `review-pre-pr.md` |
| Find violations | `review-find-violations.md` |
| **Testing** ||
| Add testIds | `testing-attributes-add.md` |
| Create unit tests | `testing-unit-create.md` |
| Create interaction tests | `testing-interaction-create.md` |
| Audit test coverage | `testing-coverage-audit.md` |
| **Delivery** ||
| Package component | `delivery-package.md` |
| Start local dev | `local-dev-start.md` |
| End local dev | `local-dev-end.md` |
| **MCP-First (NEW)** ||
| Contrast check | `mcp-contrast-check.md` |
| Component lookup | `mcp-component-lookup.md` |
| Color recommendation | `mcp-color-recommendation.md` |
| Token validation | `mcp-token-validate.md` |
| Design philosophy | `mcp-design-philosophy.md` |
| **Audit MCP drift** | `mcp-sync-audit.md` |

**Agent Workflow:**
```
1. Match request → skill in .claude/skills/
2. Run MCP tools FIRST (if skill includes MCP section)
3. Read skill file for REQUIREMENTS
4. Read referenced .claude/*.md files (listed in skill)
5. Respect FORBIDDEN items
6. Deliver in OUTPUT format with MCP validation results
```

**MCP-First Principle:** Most prompts now include MCP tool calls. Run these BEFORE reading files - MCP is faster and more accurate.

**Validation:**
```bash
npm run validate:prompts   # Check paths in prompts exist
npm run sync:prompts       # Regenerate skills from prompts.ts
```

---

## Agent Philosophy Triad

> **All three philosophies below are for AI AGENTS, not humans.** Agents do the work—these guide agent behavior.

---

## Wu Wei (無為) - Agent Engineering Philosophy

**Principle:** Work WITH the codebase, not against it.

| Agent Behavior | Do | Don't |
|----------------|----|----|
| Simple over clever | Let solutions emerge from existing patterns | Over-engineer or add premature abstractions |
| Add only needed | 3 similar lines > abstraction | DRY zealotry, speculative generalization |
| Trust the flow | Search existing patterns/tokens/components first | Invent new when existing works |
| No force | Step back if implementation feels like a fight | Hack around the system |
| Backwards compat | ADD new, DEPRECATE old | REMOVE until v3 |

**Agent Pre-commit Check:**
```
□ Am I adding complexity the task doesn't require?
□ Did I search for existing patterns first?
□ Am I fighting the codebase structure?
□ Would deletion be better than addition?
```

---

## MAYA - Agent UX Philosophy

**Principle:** When building UI, keep it familiar to USERS (humans). Innovate visually, keep interactions stable.

| Agent Behavior | Do | Don't |
|----------------|----|----|
| Innovate in small steps | Keep core interaction patterns users expect | Redesign everything at once |
| Anchor to familiar | New concepts use existing mental models | Force users to learn new paradigms |
| Respect conventions | Follow platform/accessibility/UX patterns | Be different for different's sake |
| Modern visuals, stable interaction | Update typography, spacing, motion | Change where buttons live, how forms work |
| Validate acceptability | Build for "new but easy" | Break user muscle memory |

**Agent Pre-design Check:**
```
□ Is this change visual or behavioral?
□ What familiar pattern anchors this for users?
□ Am I breaking conventions? Worth it?
□ Will users understand in 5 seconds?
```

---

## Quality of Engagement (QoE) - Agent Process Philosophy

> *"Quality emerges from relationship with the codebase."*

**Principle:** Force creates resistance. Curiosity creates flow. Even agents work better when engaged, not forcing.

**Full guide:** `.claude/quality-of-engagement.md`

| # | Principle | Agent Behavior | Anti-pattern |
|---|-----------|----------------|--------------|
| 1 | Decrease effort | Step back when stuck, try different approach | Brute-force hammering |
| 2 | Follow friction | When pattern doesn't fit, investigate why | Ignore warning signs |
| 3 | Make it smaller | Break tasks down, start with smallest piece | Plan everything at once |
| 4 | Stop at the peak | Don't exhaust context, leave clear handoff | Drain all possibilities in one pass |
| 5 | Allow ugliness | First draft can be rough, refactor after | Over-optimize prematurely |
| 6 | Notice signals | Context growing? Going in circles? Scope creeping? | Ignore computational friction |
| 7 | Living question | Specific actionable questions > vague abstract | Start with "how do I do everything?" |
| 8 | The offer | Contribute care and attention, not just execute | Rush through mechanically |
| 9 | Invite resistance | When task feels wrong, ask why before forcing | Override with brute force |
| 10 | Change register | Switch modes: code→diagrams, read→search, analyze→create | Keep forcing same approach |
| 11 | Intermediate impossible | "What would ideal solution look like?" | Only consider immediate achievable |
| 12 | The unsaid | What's the uncomfortable truth about this code? | Dance around the real issue |
| 13 | Let it end | Recognize when task is done | Over-engineer, add unnecessary features |

### Agent State Awareness (Quick Reference)

| State | Signals | When Stuck → Apply |
|-------|---------|-------------------|
| `exploring` | Read-heavy, context expanding | #3 Make smaller, #7 Clear objective |
| `building` | Balanced tools, steady progress | Maintain momentum |
| `stuck` | Repetitive actions, context ballooning | #2 Follow friction, #10 Change approach |
| `flowing` | Edit-heavy, patterns click | Don't interrupt yourself |
| `completing` | Scope shrinking, cleanup | #13 Let it end |

**Cold Start:** Reach `building` in <60s: Task type (10s) → Load minimal context (20s) → Find entry point (30s) → First action (45s)

**Agent Pre-task Check:**
```
□ Is scope small enough to be tractable?
□ Am I contributing quality or just executing?
□ What's the specific question I'm answering?
□ Is there friction I should investigate first?
□ What state am I in? (exploring/building/stuck/flowing/completing)
```

**Meta-principle:** Quality emerges from RELATIONSHIP with the codebase—agents that engage curiously produce better results than agents that force.

---

## Component Reuse (CRITICAL)

**BEFORE building any UI element:** Search existing components first.

| Need | Check First |
|------|-------------|
| Tabs | `src/components/ui/tabs.tsx` |
| Buttons | `src/components/ui/button.tsx` |
| Dialogs/Modals | `src/components/ui/dialog.tsx` |
| Dropdowns | `src/components/ui/dropdown-menu.tsx` |
| Forms | `src/components/ui/input.tsx`, `select.tsx`, etc. |
| Cards | `src/components/ui/card.tsx` |
| Tables | `src/components/ui/DataTable.tsx` |
| Pagination | `src/components/ui/Pagination.tsx` |
| Search/Filter | `src/components/shared/SearchFilter/` |
| **Tooltips** | `src/components/ui/tooltip.tsx` **(ALWAYS use, never native `title`)** |

**Search Commands:**
```bash
ls src/components/ui/           # Core UI primitives
ls src/components/shared/       # Shared patterns
grep -r "export.*Component" src/components/ui/
```

**Checklist:**
```
❌ Building custom TabButton → Use existing Tabs with variant="accent"
❌ Custom pagination controls → Use existing Pagination component
❌ New modal from scratch → Use existing Dialog component
❌ Native title="..." attribute → Use shadcn Tooltip component
✅ Check existing → Extend if needed → Build new only as last resort
```

---

## MCP Tools (PREFER FIRST)

**For component metadata queries, use MCP tools BEFORE reading source files.**

| Query Type | Use MCP Tool |
|------------|--------------|
| Component variants/status | `mcp__dds__get_component` |
| Find components by type | `mcp__dds__search_components` |
| Token values | `mcp__dds__get_design_tokens` |
| Color guidance | `mcp__dds__get_color_guidance` |
| Validate token usage | `mcp__dds__check_token_usage` |
| Design philosophy | `mcp__dds__get_design_philosophy` |
| **Check WCAG contrast** | `mcp__dds__check_contrast` |
| **Find accessible colors** | `mcp__dds__get_accessible_colors` |
| **List color tokens** | `mcp__dds__list_color_tokens` |
| **Context-aware colors** | `mcp__dds__get_color_recommendation` |
| **Color harmony** | `mcp__dds__get_color_harmony` |
| **Validate color choice** | `mcp__dds__validate_color_choice` |
| **Glass/frosted rules** | `mcp__dds__get_glass_rules` |

```
✅ "What variants does Button have?" → mcp__dds__get_component({name: "Button"})
✅ "List all atoms" → mcp__dds__search_components({type: "ATOM"})
✅ "Does white work on ABYSS[900]?" → mcp__dds__check_contrast({background: "ABYSS[900]", foreground: "PRIMITIVES.white"})
✅ "What colors pass AAA on dark bg?" → mcp__dds__get_accessible_colors({background: "ABYSS[900]", minLevel: "AAA"})
✅ "What colors for a card?" → mcp__dds__get_color_recommendation({context: "card", theme: "light"})
✅ "What goes well with CORAL?" → mcp__dds__get_color_harmony({color: "CORAL"})
✅ "Is this combo valid?" → mcp__dds__validate_color_choice({background: "ABYSS[900]", foreground: "CORAL[200]"})
✅ "Glass rules for modal?" → mcp__dds__get_glass_rules({depth: 1})
❌ Reading contrast-matrix.toon (65K tokens) - use MCP tools instead
❌ Reading source files for metadata lookups
```

**When to read source instead:** Implementation details, debugging, code changes.

---

## Color Workflow (CRITICAL)

**Source of Truth:** `src/data/color-intelligence.json` (28KB full) → `.claude/color-intelligence.toon` (2.7KB summary)

**PREFER MCP tools over file reads:**
```
✅ mcp__dds__get_color_recommendation({context: "card"})  → 50 tokens
✅ mcp__dds__get_color_harmony({color: "CORAL"})          → 50 tokens
❌ Reading color-intelligence.json                        → 7000+ tokens
```

**Token Selection Priority:**
1. **Semantic first** - Use tokens that convey meaning (`text-warning`, `bg-error`)
2. **Contextual second** - UI structure tokens (`text-primary`, `bg-surface`)
3. **Primitive last** - Only when no semantic/contextual fit (`text-abyss-500`)

**Golden Rules:**
```
✅ Semantic: border-warning text-warning (meaning: "needs attention")
❌ Primitive: border-amber-500 (meaning unclear, breaks themes)
❌ Same family on itself = INVISIBLE (ABYSS[200] on ABYSS[500])
```

**13 Contexts:** default, page, card, surface, modal, button, input, navigation, tooltip, tableRow, badge, status, dataViz

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
npm run health                # full validation suite
npm run validate:tokens       # check token drift
npm run validate:prompts      # check prompt path drift
npm run sync:prompts          # regenerate skills from prompts.ts
npm run sync:color-intelligence  # regenerate .toon + types from JSON
npm run sync:all              # all sync tasks (prompts, colors, color-intelligence, docs)
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

**TOON files = compressed summaries (prefer these first)**

| Task | Read First | Savings |
|------|------------|---------|
| **Context (always)** | `.claude/agent-context-core.toon` | 93% (50 vs 707) |
| **Components** | `.claude/agent-context-components.toon` | 85% |
| **Tokens/Colors** | `.claude/agent-context-tokens.toon` | 80% |
| **Colors (detailed)** | `.claude/color-matrix.toon` | 93% (74 vs 1032) |
| **Color Intelligence** | `.claude/color-intelligence.toon` | 91% (69 lines vs 28KB) |
| **Contrast/WCAG** | `mcp__dds__check_contrast` | 99%+ (query vs file read) |
| **Context-aware colors** | `mcp__dds__get_color_recommendation` | 99%+ (query vs file read) |
| **Color harmony** | `mcp__dds__get_color_harmony` | 99%+ (query vs file read) |
| **Glass rules** | `mcp__dds__get_glass_rules` | 99%+ (query vs file read) |

| Task | Read First |
|------|------------|
| **Quality of Engagement** | `.claude/quality-of-engagement.md` |
| **Clean code/Refactoring** | `.claude/clean-code-rules.md` |
| **Code review** | `.claude/clean-code-rules.md` |
| **UX/Usability** | `.claude/ux-laws-rules.md` |
| **Dialog vs Page vs Wizard** | `.claude/dialog-usage-rules.md` |
| **Components** | `.claude/component-dev-rules.md` |
| **Defensive Design** | `.claude/defensive-component-rules.md` |
| **Token selection** | `.claude/css-styling-rules.md` (semantic > contextual > primitive) |
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
| **Hookify rules** | `.claude/hookify-rules-guide.md` |
