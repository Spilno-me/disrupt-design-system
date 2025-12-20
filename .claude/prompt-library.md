# DDS Prompt Library

**Human-to-Agent prompt templates for consistent, high-quality results.**

Copy the prompt, replace `{COMPONENT}` with your component name, paste to agent.

---

## Story Creation

### Create Full Story for Component

```
Create a complete Storybook story for {COMPONENT}.

REQUIREMENTS:
1. Read `.claude/storybook-rules.md` first
2. Import from `src/stories/_infrastructure`:
   - Meta preset: ATOM_META, MOLECULE_META, or ORGANISM_META
   - Decorators: withStoryContainer, withDarkBackground
   - Components: StorySection, StoryFlex, StoryGrid
3. Stories to include:
   - Default (basic usage)
   - AllStates (all variants, sizes, states in sections)
   - WithForm (if form-related)
   - OnDarkBackground (if applicable)

FORBIDDEN:
- Inline decorators like `(Story) => <div>...</div>`
- Hardcoded colors or spacing
- Custom wrapper functions
- Emojis in code

OUTPUT: Single .stories.tsx file ready to use.
```

### Create AllStates Story Only

```
Create an AllStates story for {COMPONENT}.

Read `.claude/storybook-rules.md` and use infrastructure from `src/stories/_infrastructure`.

Structure:
- StorySection for each category (Variants, Sizes, States)
- StoryFlex or StoryGrid for layout
- Real component props (no CSS overrides)
- Include: default, hover (via decorator), focus, disabled, error states

Use withStoryContainer('{atom|molecule}') decorator.
```

---

## Component Development

### Create New UI Component

```
Create a new UI component: {COMPONENT}

BEFORE WRITING:
1. Read `.claude/component-dev-rules.md`
2. Read `.claude/color-matrix.json` for allowed colors
3. Check existing similar components in `src/components/ui/`

REQUIREMENTS:
- Use DDS tokens only (PRIMITIVES, ALIAS, SHADOWS, RADIUS)
- CVA for variants: `class-variance-authority`
- Forward ref pattern
- data-slot attributes for compound components
- TypeScript strict

FORBIDDEN:
- Hardcoded hex colors
- Tailwind standard colors (red-500, blue-600)
- Custom CSS outside tokens

OUTPUT: Component file + story file + update to index.ts exports.
```

### Stabilize Existing Component

```
Stabilize {COMPONENT} per DDS standards.

CHECKLIST:
1. Read `.claude/core-components-stabilization.md`
2. Verify all colors use DDS tokens
3. Add AllStates story if missing
4. Add data-testid or data-slot attributes
5. Update `.claude/agent-context.json` registry

Run `npm run health` after changes.
```

---

## Token Operations

### Add New Color Token

```
Add a new color token: {TOKEN_NAME} with value {HEX_VALUE}

MUST UPDATE ALL 3 FILES (manual sync required):
1. `src/constants/designTokens.ts` - TypeScript source
2. `src/styles.css` - @theme block
3. `tailwind-preset.js` - for NPM consumers

After changes, run:
- `npm run validate:tokens` - verify sync
- `npm run health` - full check

Read `.claude/color-matrix.json` to verify contrast compliance.
```

### Audit Token Usage

```
Audit {COMPONENT} for token compliance.

Check for:
1. Hardcoded hex colors → replace with tokens
2. Tailwind standard colors (red-500) → replace with DDS palette
3. Hardcoded shadows → use SHADOWS tokens
4. Hardcoded spacing → use SPACING tokens
5. Hardcoded radius → use RADIUS tokens

Reference: `src/constants/designTokens.ts` for available tokens.
Report findings in table format: Line | Issue | Fix
```

---

## Documentation

### Create MDX Documentation Page

```
Create MDX documentation for {TOPIC} in `src/stories/foundation/`.

REQUIREMENTS:
1. Read `.claude/storybook-rules.md` - especially MDX Paragraph Bug
2. Import from infrastructure: `import { DocSection } from '../_infrastructure'`
3. Use `<span>` inside colored divs (MDX bug workaround)
4. Use Lucide icons, not emojis
5. Live component demos where applicable

Structure:
- Overview section
- Usage examples with code
- Do/Don't examples
- Token reference table
```

### Update CLAUDE.md

```
Update CLAUDE.md with new rule: {RULE_DESCRIPTION}

REQUIREMENTS:
1. Keep format terse (for agents, not humans)
2. Use table format for lookups
3. Include ✅/❌ code examples
4. Add to appropriate section
5. Update lazy load references if new file created

Run `npm run health` to verify docs sync.
```

---

## Review & Validation

### Code Review for DDS Compliance

```
Review {FILE_PATH} for DDS compliance.

Check against:
1. `.claude/color-matrix.json` - color combinations
2. `.claude/contrast-matrix.json` - WCAG compliance
3. `.claude/spacing-rules.md` - spacing hierarchy
4. `.claude/typography-rules.md` - font usage (Fixel only)
5. `.claude/iconography-rules.md` - no emojis

Report format:
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|

Severity: CRITICAL (blocks), WARNING (should fix), INFO (suggestion)
```

### Pre-PR Checklist

```
Run pre-PR validation for my changes.

Execute:
1. `npm run health` - must pass
2. Check modified files against DDS rules
3. Verify no hardcoded colors/spacing
4. Verify stories use infrastructure
5. Verify exports updated if new components

Report: READY or BLOCKED with specific issues.
```

---

## Quick Commands

| Task | Prompt |
|------|--------|
| Health check | `Run npm run health and report results` |
| Token sync | `Verify tokens are synced across all 3 files` |
| Find component | `Find where {COMPONENT} is defined and used` |
| List violations | `Find all hardcoded hex colors in src/components` |

---

## Template Variables

| Variable | Replace With |
|----------|--------------|
| `{COMPONENT}` | Component name (e.g., `Button`, `Card`) |
| `{FILE_PATH}` | Full path to file |
| `{TOKEN_NAME}` | Token name (e.g., `accent.hover`) |
| `{HEX_VALUE}` | Hex color (e.g., `#08A4BD`) |
| `{TOPIC}` | Documentation topic |
| `{RULE_DESCRIPTION}` | New rule to add |
