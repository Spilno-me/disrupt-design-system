# DDS - Agent Context

**SINGLE SOURCE OF TRUTH**: `.claude/agent-context.json`

---

## Meta: Writing Rules for Agents

Rules in this file are for **AI agents**, not humans. Optimize accordingly:

| Do | Don't |
|----|-------|
| Terse, scannable format | Verbose explanations |
| Code examples with ✅/❌ | Paragraphs of prose |
| Tables for lookups | Nested bullet lists |
| `keyword: action` patterns | "You should consider..." |
| Symptoms → Fix (direct) | Background context first |

**Template:**
```
## Rule Name (SEVERITY)
Symptom: [what you'll see]
Cause: [one line]
Fix: [code or command]
```

---

## 🌊 Wu Wei (無為) - Effortless Action

**Project Philosophy: Work with the grain, not against it.**

| Principle | Do | Don't | Self-Test |
|-----------|----|----|-----------|
| **Simple over clever** | Let solutions emerge naturally | Over-engineer, premature abstraction | Can a junior dev understand this in 30s? |
| **Add only what's needed** | Three similar lines > abstraction | DRY zealotry, speculative features | Am I solving today's problem or imaginary ones? |
| **Trust the flow** | Use existing patterns first | Invent when existing works | Does agent-context.json already have this? |
| **No force** | Step back if fighting | Hack around the system | Am I working with or against the codebase? |
| **Backwards compat** | ADD new, DEPRECATE old | REMOVE until v3 | Will existing consumers break? |

**Pre-commit checklist:**
- Am I adding more complexity than needed?
- Does an existing pattern already solve this?
- Would deletion be better than addition?

*"The sage does not act, yet nothing is left undone."* — Tao Te Ching

---

## 🎨 BEFORE WRITING ANY COLOR: Read `.claude/color-matrix.json`

**This is NOT optional.** The color matrix defines ALL allowed color combinations.

### Workflow:
1. **Identify background** → Find category (dark/light/accent/subtle)
2. **Look up allowed colors** → text.primary, icons.primary, borders.default
3. **Check FORBIDDEN list** → Never use those combinations

### Quick Reference:
| Background | Text | Icons |
|------------|------|-------|
| `ABYSS[500+]`, dark gradients | `PRIMITIVES.white`, `SLATE[300]` | `PRIMITIVES.white` |
| `DEEP_CURRENT[500+]` | `PRIMITIVES.white` | `PRIMITIVES.white` |
| `PRIMITIVES.white`, `cream` | `ABYSS[500]` | `ABYSS[500]` |
| `SLATE[50-200]` | `ABYSS[500]`, `DUSK_REEF[500]` | `DEEP_CURRENT[500]` |

### Golden Rule:
```
❌ Same color family on itself = INVISIBLE
   ABYSS[200] on ABYSS[500] = WRONG
   DUSK_REEF[500] on DUSK_REEF[600] = WRONG
```

---

## WCAG Contrast Validation

**Read:** `.claude/contrast-matrix.json` for exact ratios

| Level | Category | Ratio | Use |
|-------|----------|-------|-----|
| AA | Normal text | 4.5:1 | Body, labels |
| AA | Large text | 3.0:1 | 18pt+ |
| AA | Graphics | 3.0:1 | Icons, UI |
| AAA | Normal text | 7.0:1 | Enhanced |

### Common Failures:
```
ABYSS[200] on ABYSS[500]    = 3.98:1 FAIL text
DEEP_CURRENT[500] on white  = 3.57:1 FAIL text (OK icons)
```

### If User Specifies Failing Color:
Report: `Contrast {X}:1 - {PASS|FAIL} WCAG AA` + suggest alternative

---

## MDX Text Color Bug (CRITICAL)

**Symptom:** Inline `color` styles show red/coral instead of expected color in MDX files
**Cause:** MDX wraps text in `<p>` → Storybook CSS overrides with `colorPrimary`
**Fix:**
```jsx
// ❌ <div style={{ color: '#fff' }}>Text</div>
// ✅ <div style={{ color: '#fff' }}><span>Text</span></div>
```
**Details:** `.claude/storybook-rules.md` § "MDX Paragraph Wrapping Bug"

---

## Spacing Hierarchy (4px Base)

**Rule:** Related items = LESS space | Unrelated items = MORE space

| Level | Size | Tailwind | Use |
|-------|------|----------|-----|
| Micro | 4-8px | `gap-1`, `gap-2` | Icon↔text, label↔input |
| Base | 12-16px | `gap-3`, `gap-4` | Items within component |
| Comfortable | 20-24px | `gap-5`, `gap-6` | Between components |
| Spacious | 32-48px | `gap-8`, `gap-12` | Between sections |
| Page | 64-96px | `gap-16`, `gap-24` | Hero, footer, major divisions |

**Quick decisions:**
```
Label → Input:  8px (gap-2)
Input → Input:  16px (space-y-4)
Card → Card:    16-24px (gap-4, gap-6)
Section → Section: 48-64px (py-12, py-16)
```

**Details:** `.claude/spacing-rules.md`

---

## Border Radius (Nested Corners)

**Rule:** Inner Radius + Padding = Outer Radius

| Token | Value | Tailwind | Use |
|-------|-------|----------|-----|
| `xs` | 4px | `rounded-xs` | Badges, chips |
| `sm` | 8px | `rounded-sm` | Buttons, inputs |
| `md` | 12px | `rounded-md` | Cards, dialogs |
| `lg` | 16px | `rounded-lg` | Large cards |
| `xl` | 20px | `rounded-xl` | Sections |
| `2xl` | 24px | `rounded-2xl` | Feature cards |

**Nested formula examples:**
```
Inner md (12px) + Padding sm (8px) = Outer xl (20px)
Inner sm (8px)  + Padding xs (4px) = Outer md (12px)
```

**Details:** `.claude/rounded-corners-rules.md`

---

## Typography Hierarchy (App UI)

**Rule:** Apps use ONLY Fixel. Max 3-4 sizes per view. Weight for emphasis, not size.

**⛔ FORBIDDEN:** `font-mono`, `font-serif`, `font-display`, any other font family.

| Role | Tailwind | Use |
|------|----------|-----|
| Page Title | `text-2xl font-semibold` | Top-level headings |
| Section Title | `text-lg font-semibold` | Section headings |
| Card Title | `text-base font-semibold` | Card headers |
| Body | `text-sm` | Primary content |
| Label | `text-sm font-medium` | Form labels |
| Caption | `text-xs text-muted` | Metadata, help text |

**Golden rules:**
```
1. Visual hierarchy = Information hierarchy
2. Max 3-4 font sizes per view
3. Use weight (font-semibold) not size for emphasis
4. 45-75 characters per line (max-w-prose)
5. ONLY Fixel font - no mono, serif, or display fonts
```

**Details:** `.claude/typography-rules.md`

---

## Iconography (No Emojis)

**Rule:** NEVER use emojis. ALWAYS use Lucide React icons.

```tsx
// ❌ icon="🎨"
// ✅ icon={<Palette size={24} />}
```

| Size | Pixels | Use |
|------|--------|-----|
| XS | 16px | Inline, badges |
| SM | 20px | Buttons, inputs |
| MD | 24px | Navigation, cards |
| LG | 32px | Features |
| XL | 48px | Heroes, empty states |

**Details:** `.claude/iconography-rules.md`

---

## Quick Commands

```bash
npm run typecheck && npm run lint && npm run build
npm run generate-tokens  # after token changes
```

## Lazy Load (task-specific)

| Task | Read |
|------|------|
| **Color combinations** | **`.claude/color-matrix.json`** |
| **Contrast ratios** | **`.claude/contrast-matrix.json`** |
| **Spacing/layout** | **`.claude/spacing-rules.md`** |
| **Border radius** | **`.claude/rounded-corners-rules.md`** |
| **Typography** | **`.claude/typography-rules.md`** |
| **Icons (no emojis)** | **`.claude/iconography-rules.md`** |
| Detailed tokens | `src/stories/DesignTokens.mdx` |
| Writing stories | `.claude/storybook-rules.md` |
| Writing tests | `.claude/testing-quick-ref.md` |
| Stabilization | `.claude/core-components-stabilization.md` |
| **Delivery packages** | **`.claude/delivery-package-guide.md`** |
