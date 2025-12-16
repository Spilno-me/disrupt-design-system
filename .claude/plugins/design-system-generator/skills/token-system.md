---
name: token-system
description: Use when questions arise about the 2-tier token architecture, token naming, or how tokens flow from primitives to components.
---

# Design Token System Knowledge

## Overview

Design systems use a **2-tier token architecture** to manage colors, spacing, typography, and other design values.

```
TIER 1: PRIMITIVES     →   Raw values (hex, px, font names)
           ↓
TIER 2: ALIASES        →   Semantic meanings (text.primary, bg.surface)
           ↓
Components consume ALIAS tokens via Tailwind classes (bg-surface, text-primary)
```

---

## TIER 1: Primitives

**What**: Raw design values with no semantic meaning.

**Examples**:
```typescript
const PRIMITIVES = {
  // Color scales
  BLUE: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... 200-800
    900: '#1e3a8a',
  },

  // Absolute values
  white: '#ffffff',
  black: '#000000',

  // Spacing
  space: {
    1: '4px',
    2: '8px',
    // ...
  },

  // Typography
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
}
```

**Why separate?**
- Single source of truth for raw values
- Easy to update brand colors globally
- Supports multiple themes from same primitives

---

## TIER 2: Aliases

**What**: Semantic tokens that describe PURPOSE, not appearance.

**Naming Pattern**: `category.role`

```typescript
const ALIAS = {
  // What the color IS FOR, not what it looks like
  text: {
    primary: PRIMITIVES.GRAY[900],     // Main body text
    secondary: PRIMITIVES.GRAY[600],   // Muted text
    inverse: PRIMITIVES.white,         // Text on dark bg
    link: PRIMITIVES.BLUE[600],        // Hyperlinks
    error: PRIMITIVES.RED[600],        // Error messages
  },

  background: {
    page: PRIMITIVES.GRAY[50],         // Page background
    surface: PRIMITIVES.white,         // Cards, modals
    surfaceHover: PRIMITIVES.GRAY[100],// Hover state
    inverse: PRIMITIVES.GRAY[900],     // Dark sections
  },

  border: {
    default: PRIMITIVES.GRAY[300],     // Standard borders
    focus: PRIMITIVES.BLUE[500],       // Focus rings
    error: PRIMITIVES.RED[500],        // Error states
  },

  interactive: {
    primary: PRIMITIVES.BLUE[600],     // Primary buttons
    primaryHover: PRIMITIVES.BLUE[700],// Hover state
    danger: PRIMITIVES.RED[600],       // Destructive actions
  },
}
```

**Why aliases?**
- Meaning is clear: `text.error` vs `RED[600]`
- Easy to maintain: change `text.primary` once, updates everywhere
- Theme-friendly: dark theme just remaps aliases

---

## Tailwind Consumption Layer

Components consume ALIAS tokens via Tailwind classes. This is NOT a separate tier - it's how components access the 2-tier system.

### CSS Variables (Generated)

```css
/* tokens.css - generated from ALIAS tokens */
:root {
  --color-text-primary: #111827;
  --color-bg-surface: #ffffff;
  --color-border-default: #d1d5db;
}
```

### Tailwind Config

```javascript
// tailwind-preset.js - maps CSS vars to classes
colors: {
  'primary': 'var(--color-text-primary)',
  'surface': 'var(--color-bg-surface)',
}
```

### Component Usage

```tsx
// Components use semantic Tailwind classes
<div className="bg-surface text-primary border border-default">
  <button className="bg-interactive-primary text-inverse">
    Click me
  </button>
</div>
```

---

## Token Flow Example

```
User defines:    Primary brand = #2563eb (blue)
                           ↓
TIER 1:          BLUE[600] = '#2563eb'
                           ↓
TIER 2:          interactive.primary = BLUE[600]
                           ↓
CSS Variable:    --color-interactive-primary: #2563eb
                           ↓
Tailwind:        'interactive-primary': 'var(--color-interactive-primary)'
                           ↓
Usage:           className="bg-interactive-primary"
```

---

## Common Questions

### Q: When do I use PRIMITIVES directly?

**Never in components.** Primitives are only referenced by ALIAS tokens.

```typescript
// ❌ Wrong - using primitive in component
className={`bg-[${PRIMITIVES.BLUE[600]}]`}

// ✅ Correct - using alias via Tailwind class
className="bg-interactive-primary"
```

### Q: How do I add a new color?

1. Add to PRIMITIVES (if new scale needed)
2. Create ALIAS mapping
3. Add CSS variable
4. Add to Tailwind config
5. Update color-matrix.json

### Q: How do themes work?

Themes remap ALIAS tokens to different PRIMITIVES:

```typescript
// Light theme
ALIAS.background.page = PRIMITIVES.GRAY[50]  // Light gray

// Dark theme
ALIAS.background.page = PRIMITIVES.GRAY[900] // Dark gray
```

CSS variables update, Tailwind classes stay the same.

### Q: What's the color-matrix.json for?

Defines which color combinations are ALLOWED for:
- AI agents (prevents bad contrast)
- Documentation (shows valid combos)
- Linting (can validate usage)
