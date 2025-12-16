---
name: validate-tokens
description: Pre-tool validation to catch token violations before code is written
event: PreToolUse
match_tools:
  - Write
  - Edit
---

# Token Validation Hook

Validate that code being written doesn't contain token violations.

## Trigger

This hook runs BEFORE any Write or Edit tool use that modifies:
- `*.tsx` files
- `*.ts` files (except tokens.ts, designTokens.ts)
- `*.css` files (except tokens.css)

## Validation Rules

### Check for Raw Hex Colors

Pattern: `#[0-9a-fA-F]{3,8}`

```
BLOCK if found:
  - className="bg-[#08A4BD]"
  - style={{ color: '#2D3142' }}
  - fill="#FF0000"
  - stroke="#000"
```

### Check for CSS Color Functions

Pattern: `rgb\(|rgba\(|hsl\(|hsla\(|oklch\(`

```
BLOCK if found:
  - backgroundColor: 'rgb(45, 49, 66)'
  - color: hsl(200, 50%, 50%)
```

### Check for Standard Tailwind Colors

Pattern: `(bg|text|border|ring|fill|stroke)-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d+`

```
BLOCK if found:
  - className="bg-blue-500"
  - className="text-gray-600"
  - className="border-red-300"
```

### Check for Arbitrary Color Values

Pattern: `\[(#|rgb|hsl)[^\]]+\]`

```
BLOCK if found:
  - className="bg-[#fff]"
  - className="text-[rgb(0,0,0)]"
```

## Allowed Patterns

These patterns are ALLOWED (semantic tokens):

```typescript
// Semantic backgrounds
className="bg-surface"
className="bg-muted-bg"
className="bg-accent-bg"
className="bg-inverse"
className="bg-interactive-primary"

// Semantic text
className="text-primary"
className="text-secondary"
className="text-inverse"
className="text-error"

// Semantic borders
className="border-default"
className="border-subtle"
className="border-focus"

// Token imports
import { ALIAS, SHADOWS } from '../constants/tokens'
```

## Response Format

### On Violation

```
BLOCKED: Token violation detected

File: {filename}
Violation: {pattern found}
Line: {code snippet}

Suggestion: Replace with semantic token:
  {violation} → {suggested replacement}

Common replacements:
  bg-white → bg-surface
  text-gray-900 → text-primary
  text-gray-600 → text-secondary
  border-gray-300 → border-default
  bg-blue-500 → bg-interactive-primary
```

### On Pass

```
PASSED: No token violations detected
```

## Exceptions

Skip validation for:
- `src/constants/tokens.ts` (defines tokens)
- `src/constants/designTokens.ts` (defines tokens)
- `src/styles/tokens.css` (generated CSS variables)
- `tailwind-preset.js` (Tailwind config)
- `*.md` files (documentation)
- `*.json` files (configuration)
