# Dark Mode Rules

**Formula:** `Dark = 950 - Light`

| Light | Dark |
|-------|------|
| 50 | 900 |
| 100 | 800 |
| 200 | 700 |
| 300 | 600 |
| 400 | 500 |
| 500 | 400 |

## Semantic Tokens

| Token | Light | Dark |
|-------|-------|------|
| **Background** |||
| page | `cream` | `ABYSS[900]` |
| surface | `white` | `ABYSS[800]` |
| surfaceHover | `ABYSS[50]` | `ABYSS[700]` |
| elevated | `white` | `ABYSS[700]` |
| inverse | `ABYSS[500]` | `white` |
| **Text** |||
| primary | `ABYSS[500]` | `SLATE[100]` |
| secondary | `DUSK_REEF[500]` | `DUSK_REEF[300]` |
| disabled | `DUSK_REEF[300]` | `DUSK_REEF[600]` |
| inverse | `white` | `ABYSS[500]` |
| **Border** |||
| default | `SLATE[300]` | `SLATE[600]` |
| subtle | `ABYSS[100]` | `ABYSS[800]` |
| strong | `ABYSS[300]` | `ABYSS[600]` |

## Status Exceptions

Status colors shift 1 step lighter (not inverted):

| Token | Light | Dark |
|-------|-------|------|
| error | `CORAL[500]` | `CORAL[400]` |
| success | `HARBOR[500]` | `HARBOR[400]` |
| warning | `SUNRISE[500]` | `SUNRISE[400]` |

## Figma Variables

**Tier 1 (Primitives):** Raw hex values, no modes
**Tier 2 (Alias):** Semantic tokens with Light/Dark columns

```
Collection: "Colors"
├── Modes: [Light] [Dark]
├── Background/Page → Light: cream | Dark: Abyss/900
├── Text/Primary    → Light: Abyss/500 | Dark: Slate/100
└── Border/Default  → Light: Slate/300 | Dark: Slate/600
```

## Decision

| Token Type | Rule |
|------------|------|
| Background | Invert (50↔900) |
| Text on dark | Light values (100-300) |
| Text on light | Dark values (500-700) |
| Status | Shift 1 step lighter |
| Border | Invert (300↔600) |

## Status Tinted Backgrounds (Banners, Alerts)

**Problem:** Solid inverted colors for "light" backgrounds feel heavy in dark mode.

| Component | Light Mode | Dark Mode |
|-----------|------------|-----------|
| Background | `bg-success-light` (solid #F0FDF4) | `bg-success/10` (10% opacity) |
| Text | `text-success-dark` (harbor-800) | `text-success` (harbor-400) |
| Border | `border-success/20` | `border-success/20` (same) |

**Pattern:**
```tsx
// ✅ Correct - airy feel in both modes
className="bg-success-light dark:bg-success/10 text-success-dark dark:text-success"

// ❌ Wrong - solid dark block, oppressive
className="bg-success-light text-success-dark"  // dark mode uses harbor-900, harbor-800
```

**Why opacity?** Preserves visual "weight" relationship - a subtle tint should feel subtle in both themes.

## Theme-Aware Assets (Logos, Icons)

**Naming convention is counterintuitive:**
- `*-dark.svg` = Dark-colored content → for **light** backgrounds (light mode)
- `*-light.svg` = Light-colored content → for **dark** backgrounds (dark mode)

**Dark mode detection must check BOTH locations:**
```tsx
// Tailwind standard applies .dark to <html>
// Storybook addon-themes applies .dark to <body>
const isDark = document.documentElement.classList.contains('dark')
            || document.body.classList.contains('dark')
```

**Pattern:**
```tsx
const logoSrc = isDarkMode
  ? LOGOS.partner.light   // light logo for dark backgrounds
  : LOGOS.partner.dark    // dark logo for light backgrounds
```

## Anti-Pattern

```tsx
// ❌ Hardcoded: isDark ? '#0C0D12' : '#FBFBF3'
// ✅ Token: var(--background-page)
```
