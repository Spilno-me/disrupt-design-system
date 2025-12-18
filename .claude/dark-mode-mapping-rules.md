# Dark Mode Mapping Rules - Scale Inversion System

**Agent-only. Apply when creating Light/Dark theme mappings.**

---

## Core Principle: Scale Inversion

**Rule:** Light mode values map to their inverted position on the color scale.

```
Formula: Dark = (Max + Min) - Light

For DDS 50-900 scale: Dark = 950 - Light
```

---

## Quick Reference: DDS Scale Mapping

| Light Mode | Dark Mode | Sum |
|------------|-----------|-----|
| `50` | `900` | 950 |
| `100` | `800` | 950 |
| `200` | `700` | 950 |
| `300` | `600` | 950 |
| `400` | `500` | 950 |
| `500` | `400` | 950 |
| `600` | `300` | 950 |
| `700` | `200` | 950 |
| `800` | `100` | 950 |
| `900` | `50` | 950 |

---

## Why This Works

```
Light Theme:              Dark Theme:
┌─────────────────┐       ┌─────────────────┐
│ Bg: 50 (light)  │       │ Bg: 900 (dark)  │
│ ┌─────────────┐ │       │ ┌─────────────┐ │
│ │Surface: 100 │ │  -->  │ │Surface: 800 │ │
│ │ ┌─────────┐ │ │       │ │ ┌─────────┐ │ │
│ │ │Card: 200│ │ │       │ │ │Card: 700│ │ │
│ │ └─────────┘ │ │       │ │ └─────────┘ │ │
│ └─────────────┘ │       │ └─────────────┘ │
└─────────────────┘       └─────────────────┘
```

**Contrast hierarchy preserved:** 1-step separation in light = 1-step separation in dark.

---

## DDS Semantic Token Mappings

### Background Tokens

| Semantic Token | Light Mode | Dark Mode |
|----------------|------------|-----------|
| `background.page` | `PRIMITIVES.cream` | `ABYSS[900]` |
| `background.surface` | `PRIMITIVES.white` | `ABYSS[800]` |
| `background.surfaceHover` | `ABYSS[50]` | `ABYSS[700]` |
| `background.surfaceActive` | `ABYSS[100]` | `ABYSS[600]` |
| `background.elevated` | `PRIMITIVES.white` | `ABYSS[700]` |
| `background.muted` | `DUSK_REEF[50]` | `DUSK_REEF[900]` |
| `background.inverse` | `ABYSS[500]` | `PRIMITIVES.white` |

### Text Tokens

| Semantic Token | Light Mode | Dark Mode |
|----------------|------------|-----------|
| `text.primary` | `ABYSS[500]` | `SLATE[100]` |
| `text.secondary` | `DUSK_REEF[500]` | `DUSK_REEF[300]` |
| `text.tertiary` | `DUSK_REEF[400]` | `DUSK_REEF[400]` |
| `text.disabled` | `DUSK_REEF[300]` | `DUSK_REEF[600]` |
| `text.inverse` | `PRIMITIVES.white` | `ABYSS[500]` |

### Border Tokens

| Semantic Token | Light Mode | Dark Mode |
|----------------|------------|-----------|
| `border.default` | `SLATE[300]` | `SLATE[600]` |
| `border.subtle` | `ABYSS[100]` | `ABYSS[800]` |
| `border.strong` | `ABYSS[300]` | `ABYSS[600]` |

---

## Two-Tier Architecture (Figma Variables)

### Tier 1: Primitives Collection

Raw color values only. No modes.

```
Collection: "Primitives"
├── Color/
│   ├── Abyss/
│   │   ├── 50   → #E8E9EB
│   │   ├── 100  → #D1D3D7
│   │   ├── ...
│   │   └── 900  → #0C0D12
│   ├── DeepCurrent/
│   │   ├── 50   → #E6F7FA
│   │   └── ...
│   └── [other palettes]
```

### Tier 2: Alias Collection (with Modes)

Semantic tokens referencing primitives. Has Light/Dark columns.

```
Collection: "Colors" (or "Alias")
├── Modes: [Light] [Dark]
│
├── Background/
│   ├── Page      → Light: Primitives.cream    | Dark: Abyss/900
│   ├── Surface   → Light: Primitives.white    | Dark: Abyss/800
│   └── Elevated  → Light: Primitives.white    | Dark: Abyss/700
│
├── Text/
│   ├── Primary   → Light: Abyss/500           | Dark: Slate/100
│   └── Secondary → Light: DuskReef/500        | Dark: DuskReef/300
│
└── Border/
    └── Default   → Light: Slate/300           | Dark: Slate/600
```

---

## Naming Convention (Slash Hierarchy)

```
✅ CORRECT: Slash naming creates folder hierarchy
   Color/Background/Page
   Color/Text/Primary
   Color/Border/Default

❌ WRONG: Flat naming
   ColorBackgroundPage
   color-background-page
   bgPage
```

---

## Implementation Workflow

### Step 1: Create Primitives
```
1. Open Local Variables panel
2. Create collection: "Primitives"
3. Add colors with slash naming: Color/Abyss/500
4. Enter raw hex values
```

### Step 2: Create Alias Collection with Modes
```
1. Create collection: "Colors" (or "Alias")
2. Add mode column: "Dark"
3. Rename "Mode 1" to "Light"
4. Create semantic variables: Background/Page
5. Set Light value → reference Primitives
6. Set Dark value → reference inverted Primitives
```

### Step 3: Apply to Designs
```
1. Select frame/element
2. Set fill → choose semantic variable (e.g., Background/Page)
3. Switch modes via Appearance panel
4. Entire design updates automatically
```

---

## Status Token Exceptions

Status colors do NOT fully invert. They adjust for dark backgrounds:

| Token | Light Mode | Dark Mode | Reason |
|-------|------------|-----------|--------|
| `status.error` | `CORAL[500]` | `CORAL[400]` | Brighter on dark |
| `status.success` | `HARBOR[500]` | `HARBOR[400]` | Brighter on dark |
| `status.warning` | `SUNRISE[500]` | `SUNRISE[400]` | Brighter on dark |
| `status.errorLight` | `CORAL[50]` | `CORAL[900]` | Standard inversion |

**Rule:** Base status colors shift 1 step lighter in dark mode for visibility.

---

## Anti-Patterns

```tsx
// ❌ WRONG: Hardcoding both themes
const bgColor = isDark ? '#0C0D12' : '#FBFBF3';

// ✅ CORRECT: Use semantic token with mode
// In Figma: Apply Background/Page variable
// In code: Use CSS custom property that changes with theme
const bgColor = 'var(--background-page)';
```

```tsx
// ❌ WRONG: Same color for both modes
Light: ABYSS[500]
Dark:  ABYSS[500]  // No contrast on dark bg!

// ✅ CORRECT: Inverted mapping
Light: ABYSS[500]
Dark:  SLATE[100]  // High contrast on dark bg
```

---

## Decision Tree

```
Creating a dark mode token?

1. Is it a BACKGROUND token?
   → Invert: Light 50 → Dark 900, Light 100 → Dark 800, etc.

2. Is it a TEXT token on dark background?
   → Use light values: SLATE[100-300], PRIMITIVES.white

3. Is it a TEXT token on light background?
   → Use dark values: ABYSS[500], DUSK_REEF[500]

4. Is it a STATUS color (error, success, warning)?
   → Base: shift 1 step lighter for dark mode
   → Background: standard inversion

5. Is it a BORDER token?
   → Standard inversion: Light 300 → Dark 600
```

---

## Figma Quick Actions

| Action | Shortcut |
|--------|----------|
| Open Local Variables | Right panel → Local variables |
| Create variable | `+` button → Color |
| Reference another variable | Click color → Variables → Select |
| Add mode | Collection header → `+` |
| Switch mode | Select frame → Appearance → Mode dropdown |

---

## Validation Checklist

Before finalizing dark mode mappings:

- [ ] All semantic tokens reference Primitives (not raw hex)
- [ ] Background tokens invert correctly (50↔900, 100↔800, etc.)
- [ ] Text on dark backgrounds uses light values (100-300)
- [ ] Text on light backgrounds uses dark values (500-700)
- [ ] Status colors shift 1 step lighter in dark mode
- [ ] Contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)
- [ ] No same-family colors on themselves (ABYSS on ABYSS)
