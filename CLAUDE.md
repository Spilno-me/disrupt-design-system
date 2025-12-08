# Disrupt Design System (DDS) - Project Guidelines

## Overview

This is the Disrupt Design System project - a React/TypeScript component library with Storybook documentation. All components must use the centralized design tokens system.

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Storybook 8
- Vite

---

## CRITICAL: Design System Rules

### No Custom Values - Use Design Tokens Only

**NEVER use raw/hardcoded values in components.** All colors, shadows, spacing, typography, and other visual properties MUST come from the design token system.

#### Token File Location
```
src/constants/designTokens.ts
```

---

## 3-Tier Token Architecture

The design system follows a strict 3-tier architecture. **This MUST be respected at all times.**

### Tier 1: PRIMITIVES (Raw Values)
Location in code: `ABYSS`, `DEEP_CURRENT`, `DUSK_REEF`, `CORAL`, `WAVE`, `SUNRISE`, `HARBOR`, `SLATE`, `PRIMITIVES`, `SHADOWS`, `RADIUS`, `TYPOGRAPHY`, `BREAKPOINTS`, `Z_INDEX`

**Contains only raw values:**
- Color scales (ABYSS[50-900], CORAL[50-900], etc.)
- Single primitives (PRIMITIVES.white, PRIMITIVES.black, PRIMITIVES.cream)
- Shadows, radius, typography, breakpoints, z-index

**Rules:**
- NO semantic naming here
- Components should NEVER import Tier 1 directly

### Tier 2: ALIAS (Semantic Tokens)
Location in code: `ALIAS`

**Semantic token groups:**
- `ALIAS.text.*` - Text colors
- `ALIAS.background.*` - Surface colors
- `ALIAS.border.*` - Border colors
- `ALIAS.icon.*` - Icon colors
- `ALIAS.interactive.*` - Interactive states
- `ALIAS.status.*` - Status colors (error, success, warning, info)
- `ALIAS.overlay.*` - Overlay colors
- `ALIAS.brand.*` - Brand colors
- `ALIAS.feature.*` - Feature indicator colors
- `ALIAS.shadow.*` - Semantic shadows

**Rules:**
- References PRIMITIVES only
- NO raw hex/rgba values
- Components CAN import ALIAS for inline styles

### Tier 3: MAPPED (Component Tokens)
Location in code: `MAPPED`

**Component-specific mappings:**
- `MAPPED.button.*` - Button variants
- `MAPPED.input.*` - Input fields
- `MAPPED.card.*` - Cards
- `MAPPED.header.*` - Header
- `MAPPED.badge.*` - Badges
- `MAPPED.alert.*` - Alerts
- `MAPPED.modal.*` - Modals
- etc.

**Rules:**
- References ALIAS only (never PRIMITIVES directly)
- NO raw values
- Use for component-specific styling

### Tailwind Integration
Location in code: `COLORS`

Tailwind classes map to ALIAS tokens:
- `bg-dark` → `ALIAS.brand.primary`
- `bg-teal` → `ALIAS.brand.secondary`
- `text-muted` → `ALIAS.text.secondary`
- `bg-error` → `ALIAS.status.error`
- etc.

---

## Prohibited Patterns

### NEVER DO THIS:

```tsx
// BAD - Raw hex color
<div style={{ color: '#2D3142' }}>

// BAD - Raw rgba
<div style={{ background: 'rgba(0,0,0,0.5)' }}>

// BAD - Raw shadow
<div style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>

// BAD - Importing PRIMITIVES directly in components
import { ABYSS } from '@/constants/designTokens';
<div style={{ color: ABYSS[500] }}>

// BAD - Using deprecated BRAND tokens
import { BRAND } from '@/constants/designTokens';
<div style={{ color: BRAND.abyss }}>
```

### ALWAYS DO THIS:

```tsx
// GOOD - Tailwind class (preferred)
<div className="text-dark bg-surface">

// GOOD - ALIAS token for inline styles
import { ALIAS } from '@/constants/designTokens';
<div style={{ color: ALIAS.text.primary }}>

// GOOD - MAPPED token for component-specific
import { MAPPED } from '@/constants/designTokens';
<div style={{ background: MAPPED.card.bg }}>

// GOOD - Tailwind with token-mapped colors
<div className="bg-dark text-white hover:bg-dark/90">
```

---

## Quick Reference: Common Tokens

### Colors (Tailwind Classes)
| Class | Use For |
|-------|---------|
| `bg-dark` | Primary dark background |
| `bg-teal` | Accent/brand secondary |
| `bg-cream` | Page background |
| `bg-surface` | Card/panel background |
| `text-dark` | Primary text |
| `text-muted` | Secondary text |
| `text-white` | Inverse text |
| `bg-error` | Error state |

### ALIAS Tokens (Inline Styles)
| Token | Use For |
|-------|---------|
| `ALIAS.text.primary` | Primary text color |
| `ALIAS.text.secondary` | Secondary/muted text |
| `ALIAS.text.inverse` | Text on dark backgrounds |
| `ALIAS.background.surface` | Card backgrounds |
| `ALIAS.background.page` | Page background |
| `ALIAS.border.default` | Default borders |
| `ALIAS.status.error` | Error states |
| `ALIAS.status.success` | Success states |
| `ALIAS.interactive.primary` | Button primary bg |

### Shadows
| Token | Use For |
|-------|---------|
| `SHADOWS.sm` | Subtle elevation |
| `SHADOWS.md` | Cards, dropdowns |
| `SHADOWS.lg` | Modals, popovers |
| `SHADOWS.header` | Header shadow |

### Radius
| Token | Value |
|-------|-------|
| `RADIUS.xs` | 4px |
| `RADIUS.sm` | 8px |
| `RADIUS.md` | 12px |
| `RADIUS.lg` | 16px |
| `RADIUS.full` | 9999px |

---

## BRAND Tokens are DEPRECATED

The `BRAND` export exists only for backward compatibility. **DO NOT USE in new code.**

| Deprecated | Use Instead |
|------------|-------------|
| `BRAND.abyss` | `ALIAS.brand.primary` |
| `BRAND.deepCurrent` | `ALIAS.brand.secondary` |
| `BRAND.redCoral` | `ALIAS.status.error` |
| `BRAND.duskReef` | `ALIAS.brand.tertiary` |
| `BRAND.tideFoam` | `ALIAS.background.page` |
| `BRAND.wave` | `ALIAS.feature.automate` |
| `BRAND.sunrise` | `ALIAS.feature.adapt` |
| `BRAND.harbor` | `ALIAS.feature.scale` |

---

## Component Development Checklist

When building or modifying components:

- [ ] No raw hex colors - use Tailwind classes or ALIAS tokens
- [ ] No raw rgba values - use ALIAS.overlay.* tokens
- [ ] No raw shadows - use SHADOWS.* or Tailwind shadow classes
- [ ] No raw border-radius - use RADIUS.* tokens
- [ ] No BRAND.* imports - use ALIAS equivalents
- [ ] No direct PRIMITIVES imports - use ALIAS or MAPPED
- [ ] Colors match semantic intent (error = red, success = green, etc.)

---

## File Structure

```
src/
├── components/
│   ├── ui/           # Base UI components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── sections/     # Page sections
├── constants/
│   └── designTokens.ts   # ALL DESIGN TOKENS HERE
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── stories/          # Storybook documentation
```

---

## Storybook

Run Storybook for component development:
```bash
npm run storybook
```

All components should have accompanying `.stories.tsx` files with proper documentation.
