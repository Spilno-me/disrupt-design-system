---
description: Generate, customize, or validate design tokens
argument-hint: "generate" | "customize" | "validate" | "export"
---

# Token Management: $ARGUMENTS

Manage design tokens based on the action specified.

## Actions

### If action is "generate"

Create a complete 2-tier token architecture from brand colors.

**Steps:**
1. Use AskUserQuestion to gather brand colors (primary, accent)
2. Generate color scales (50-900 for each color)
3. Create TIER 1: PRIMITIVES (raw color values)
4. Create TIER 2: ALIAS (semantic mappings referencing PRIMITIVES)
5. Generate Tailwind preset (consumes ALIAS tokens)
6. Generate CSS variables file
7. Create color-matrix.json for valid combinations

### If action is "customize"

Modify existing tokens:
1. Read current `src/constants/tokens.ts`
2. Ask what to modify (brand colors, semantic mappings, new categories)
3. Regenerate affected files
4. Validate WCAG contrast

### If action is "validate"

Scan codebase for token violations:

**Violation patterns to find:**
- Raw hex: `#[0-9a-fA-F]{3,8}`
- CSS functions: `rgb(`, `hsl(`, `oklch(`
- Standard Tailwind: `bg-blue-500`, `text-gray-600`
- Arbitrary colors: `bg-[#fff]`

**Report format:**
```
VIOLATION: Raw hex color
  File: src/components/ui/button.tsx:42
  Code: className="bg-[#08A4BD]"
  Fix:  className="bg-accent"
```

### If action is "export"

Export tokens in various formats:
- CSS Variables (default)
- JSON (for tooling)
- SCSS Variables
- Figma Tokens

---

## 2-Tier Token Architecture

### TIER 1: Primitives
Raw color values - the palette (no semantic meaning):
```typescript
const PRIMITIVES = {
  ABYSS: { 50: '...', 100: '...', ..., 900: '...' },    // Dark neutrals
  DEEP_CURRENT: { 50: '...', ..., 900: '...' },         // Teal scale
  DUSK_REEF: { 50: '...', ..., 900: '...' },            // Purple scale
  CORAL: { 50: '...', ..., 900: '...' },                // Red scale
}
```

### TIER 2: Aliases
Semantic meanings mapped to primitives:
```typescript
const ALIAS = {
  text: { primary, secondary, tertiary, disabled, inverse },
  background: { page, surface, hover, muted, accent },
  border: { default, subtle, strong, focus, error },
  interactive: { primary, hover, active, danger },
}
```

Components consume ALIAS tokens directly via Tailwind classes (bg-surface, text-primary).

---

## Default: Show Help

If no action provided, explain available actions and ask user to choose.
