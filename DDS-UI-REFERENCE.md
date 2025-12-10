# Disrupt Design System (DDS) - UI Mockup Reference

> Version 1.1.2 | Last updated: 2025-12-09
> **Use this document to generate UI mockups that match DDS specifications exactly.**

---

## Table of Contents

1. [Brand Colors](#brand-colors)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Shadows & Effects](#shadows--effects)
6. [Animation Guidelines](#animation-guidelines)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Common Patterns](#common-patterns)

---

## Brand Colors

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Abyss (Dark)** | `#2D3142` | Primary text, dark backgrounds, buttons |
| **Teal (Accent)** | `#08A4BD` | Links, accents, focus states, CTAs |
| **Cream (Page)** | `#FBFBF3` | Page backgrounds |
| **White** | `#FFFFFF` | Cards, surfaces, elevated elements |

### Secondary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Dark Purple** | `#5E4F7E` | Secondary/muted text |
| **Light Purple** | `#EFEDF3` | Muted backgrounds, disabled inputs |
| **Slate** | `#CBD5E1` | Borders, dividers |

### Status Colors

| Status | Main | Light Background | Border |
|--------|------|------------------|--------|
| **Error** | `#F70D1A` | `#FEF2F2` | `#F70D1A` |
| **Success** | `#22C55E` | `#F0FDF4` | `#22C55E` |
| **Warning** | `#EAB308` | `#FFFBEB` | `#EAB308` |
| **Info** | `#3B82F6` | `#EFF6FF` | `#3B82F6` |

### Feature Colors (Icons/Indicators)

| Feature | Color | Hex |
|---------|-------|-----|
| Automate | Blue | `#3B82F6` |
| Advice | Red | `#EF4444` |
| Adapt | Yellow | `#EAB308` |
| Scale | Green | `#22C55E` |

### Special Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Aging/Urgent** | `#F97316` | Urgent indicators, aging items |
| **LinkedIn** | `#0A66C2` | Social buttons |
| **Teal Light** | `#66CFE1` | Hover states, light accents |
| **Teal Background** | `#E6F7FA` | Accent background areas |

---

## Typography

### Font Families

| Type | Font | Fallback |
|------|------|----------|
| **Display** | Pilat Extended | Arial, sans-serif |
| **Body** | Fixel | system-ui, sans-serif |
| **Mono** | ui-monospace | monospace |

### Font Sizes

| Name | Size | Line Height | Use Case |
|------|------|-------------|----------|
| xs | 12px | 16px | Captions, labels |
| sm | 14px | 20px | Small text, helper text |
| base | 16px | 24px | Body text |
| lg | 18px | 28px | Large body |
| xl | 20px | 28px | Subheadings |
| 2xl | 24px | 32px | Section titles |
| 3xl | 30px | 36px | Page titles |
| 4xl | 36px | 40px | Hero mobile |
| 5xl | 48px | 1 | Hero tablet |
| 6xl | 60px | 1 | Hero desktop |
| 7xl | 72px | 1 | Large hero |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#2D3142` | Main body text |
| Secondary | `#5E4F7E` | Muted/supporting text |
| Tertiary | `#7F6F9F` | Placeholders, subtle text |
| Disabled | `#9F93B7` | Disabled text |
| Inverse | `#FFFFFF` | Text on dark backgrounds |
| Link | `#08A4BD` | Links |
| Link Hover | `#068397` | Link hover state |

---

## Spacing & Layout

### Spacing Scale (4px base)

| Token | Value |
|-------|-------|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |
| 24 | 96px |

### Container Widths

| Element | Max Width |
|---------|-----------|
| Container | 1440px |
| Header | 1440px |
| Hero Frame | 1440px |

### Common Spacing Patterns

| Pattern | Mobile | Desktop |
|---------|--------|---------|
| Section Padding Y | 64px | 96px |
| Container Padding X | 16px | 40px |
| Component Gap | 16px | 16px |
| Card Padding | 16px-24px | 24px-32px |

### Border Radius

| Name | Value | Use Case |
|------|-------|----------|
| xs | 4px | Small elements, badges |
| sm | 8px | Inputs, small cards |
| md | 12px | Cards, buttons |
| lg | 16px | Large cards |
| xl | 20px | Modals |
| 2xl | 24px | Large containers |
| full | 9999px | Pills, avatars |

---

## Components

### Button

**Sizes:**
- Small: Height 32px, padding 12px horizontal
- Default: Height 40px, padding 16px horizontal
- Large: Height 48px, padding 24px horizontal
- Icon: 40px × 40px square

**Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary (default) | `#2D3142` | White | None |
| Secondary | `#EFEDF3` | `#2D3142` | None |
| Accent | `#08A4BD` | White | None |
| Outline | Transparent | `#2D3142` | `#CBD5E1` |
| Ghost | Transparent | `#2D3142` | None |
| Destructive | `#F70D1A` | White | None |
| Link | Transparent | `#08A4BD` | None (underline) |

**States:**
- Hover: Slightly darker background
- Focus: 3px teal ring at 30% opacity
- Disabled: 50% opacity, no pointer

**Special Effect:** Electric glass border animation on hover (teal gradient sweep)

---

### Input

**Dimensions:**
- Height: 40px
- Padding: 12px horizontal
- Border radius: 8px

**States:**

| State | Border | Background |
|-------|--------|------------|
| Default | `#CBD5E1` | White |
| Focus | `#08A4BD` | White |
| Error | `#F70D1A` | White |
| Disabled | `#CBD5E1` | `#EFEDF3` |

**Focus Ring:** 3px teal at 30% opacity

---

### Card

**Default Card:**
- Background: White
- Border: 1px `#CBD5E1`
- Border radius: 12px
- Padding: 16px-24px

**Shadow Options:**
- none: No shadow
- sm: `0 1px 2px rgba(0,0,0,0.05)`
- md: `0 4px 6px -1px rgba(0,0,0,0.1)`
- lg: `0 10px 15px -3px rgba(0,0,0,0.1)`
- xl: `0 20px 25px -5px rgba(0,0,0,0.1)`

**Pricing Card Variants:**
- `pricing`: Dashed border
- `pricingHighlight`: Animated marching ants border (teal)

**Card Structure:**
```
┌─────────────────────────────┐
│ CardHeader                  │
│   CardTitle                 │
│   CardDescription           │
├─────────────────────────────┤
│ CardContent                 │
│                             │
├─────────────────────────────┤
│ CardFooter                  │
└─────────────────────────────┘
```

---

### Select/Dropdown

**Trigger:**
- Height: 40px
- Same styling as Input
- Chevron icon on right

**Content Panel:**
- Background: White
- Border: 1px `#CBD5E1`
- Border radius: 8px
- Shadow: md
- Max height: 300px (scrollable)

**Item:**
- Padding: 8px 12px
- Hover: `#EFEDF3` background
- Selected: Teal text with checkmark

---

### Dialog/Modal

**Overlay:**
- Background: `rgba(0,0,0,0.8)`
- Backdrop blur: 2px

**Content:**
- Background: White
- Border radius: 16px
- Max width: 500px
- Shadow: lg
- Padding: 24px

**Structure:**
```
┌─────────────────────────────┐
│ [X] Close                   │
├─────────────────────────────┤
│ DialogHeader                │
│   DialogTitle               │
│   DialogDescription         │
├─────────────────────────────┤
│ Content                     │
├─────────────────────────────┤
│ DialogFooter                │
│   [Cancel] [Confirm]        │
└─────────────────────────────┘
```

---

### Sheet (Side Panel)

**Sides:** left, right, top, bottom

**Dimensions:**
- Width (left/right): 75% max 400px
- Height (top/bottom): 30% auto

**Styling:**
- Background: White
- Shadow on open side
- Same overlay as Dialog

---

### Badge

**Sizes:**
- Default padding: 4px 10px
- Font size: 12px

**Variants:**

| Variant | Background | Text |
|---------|------------|------|
| Default | `#2D3142` | White |
| Secondary | `#EFEDF3` | `#2D3142` |
| Destructive | `#F70D1A` | White |
| Outline | Transparent | `#2D3142` (border) |

**Shapes:**
- Default: border-radius 4px
- Pill: border-radius 9999px

---

### Tooltip

- Background: `#2D3142`
- Text: White
- Border radius: 8px
- Padding: 8px 12px
- Arrow pointer
- Shadow: sm
- Font size: 12px

---

### Skeleton (Loading)

**Variants:**
- Pulse: Opacity fade animation
- Shimmer: Left-to-right gradient sweep
- Wave: Breathing opacity effect

**Base Color:** `#E2E8F0` (light gray)

---

### Accordion

**Item Structure:**
```
┌─────────────────────────────────┐
│ Question Text            [▼]   │ ← Dashed border bottom
├─────────────────────────────────┤
│ Answer Content                  │ ← Teal glass background
│ (when expanded)                 │    rgba(8,164,189,0.05)
└─────────────────────────────────┘
```

**Animation:** 200ms ease-in-out height transition

---

### QuickFilter (Status Chips)

**Variants:**

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| Default | `#F1F5F9` | `#475569` | Drafts |
| Info | `#E6F7FA` | `#08A4BD` | Reported |
| Warning | `#FFF7ED` | `#F97316` | Aging, Reviews |
| Primary | `#2D3142` | White | In Progress |

**Structure:**
```
┌──────────────────┐
│ [Icon] Label (5) │
└──────────────────┘
```

**Sizes:**
- sm: Height 28px
- md: Height 32px
- lg: Height 36px

---

### Header (Marketing)

**Dimensions:**
- Height: 82px
- Max width: 1440px

**Styling:**
- Background: `rgba(251,251,243,0.3)` (cream 30%)
- Backdrop blur: 8px
- Border bottom: 1px `#08A4BD`
- Position: Fixed

**Structure:**
```
┌─────────────────────────────────────────────────┐
│ [Logo]    Nav Items...           [CTA Button]  │
└─────────────────────────────────────────────────┘
```

---

### AppHeader (Application)

**Dimensions:**
- Height: 55px
- Full width

**Styling:**
- Background: Dark gradient with wave pattern
- Logo container: Rounded left edge

**Structure:**
```
┌─────────────────────────────────────────────────┐
│ [Product Logo]          [🔔 Badge] [Avatar ▼]  │
└─────────────────────────────────────────────────┘
```

---

### FeatureCard

**Structure:**
```
┌─────────────────────────────────┐
│                                 │
│     ╭───╮  ← Rotating dashed   │
│     │ ⚡ │     circle (58px)    │
│     ╰───╯                       │
│                                 │
│     Title                       │
│     Description text            │
│                                 │
└─────────────────────────────────┘
```

**Feature Colors:**
- Automate: Blue `#3B82F6`
- Advice: Red `#EF4444`
- Adapt: Yellow `#EAB308`
- Scale: Green `#22C55E`

---

## Shadows & Effects

### Shadow Tokens

| Name | Value | Use Case |
|------|-------|----------|
| sm | `0 1px 2px 0 rgba(0,0,0,0.05)` | Subtle cards |
| md | `0 4px 6px -1px rgba(0,0,0,0.1)` | Dropdowns |
| lg | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals |
| xl | `0 20px 25px -5px rgba(0,0,0,0.1)` | Popovers |
| header | `0px 2px 4px 5px rgba(0,0,0,0.15)` | Header |
| image | `0 6px 12px -2px rgba(0,0,0,0.3)` | Hero images |

### Overlay Opacities

| Name | Value | Use Case |
|------|-------|----------|
| Light | `rgba(251,251,243,0.3)` | Header glass |
| Medium | `rgba(0,0,0,0.3)` | Light overlay |
| Dark | `rgba(0,0,0,0.5)` | Standard overlay |
| Dark Strong | `rgba(0,0,0,0.8)` | Modal backdrop |

### Focus Ring

- Color: `#08A4BD` at 30% opacity
- Width: 3px
- Style: Ring (not border)

### Electric Effect (Buttons/Icons)

- Gradient: Teal to transparent sweep
- Glow: `0 0 15px rgba(8,164,189,0.5)`
- Animation: Linear sweep 1.5s infinite

---

## Animation Guidelines

### Duration Scale

| Speed | Duration | Use Case |
|-------|----------|----------|
| Instant | 100ms | Micro-interactions |
| Fast | 150-200ms | Hovers, toggles |
| Normal | 300ms | Standard transitions |
| Smooth | 400ms | Page transitions |
| Slow | 500ms | Complex animations |

### Easing Functions

| Name | Value | Use Case |
|------|-------|----------|
| Ease Out | `cubic-bezier(0.4, 0, 0.1, 1)` | Enter animations |
| Ease In Out | `ease-in-out` | Toggle states |
| Spring | `cubic-bezier(0.32, 0.72, 0, 1)` | Carousel |

### Common Animations

**Hover Transitions:**
```
transition: all 200ms ease-in-out
```

**Accordion Expand:**
```
height: 0 → auto
opacity: 0 → 1
duration: 200ms
easing: ease-in-out
```

**Modal Enter:**
```
opacity: 0 → 1
scale: 0.95 → 1
duration: 200ms
```

**Skeleton Shimmer:**
```
translateX: -100% → 100%
duration: 1.5s
infinite loop
```

---

## Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Tablet portrait |
| md | 768px | Tablet landscape |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

### Mobile-First Approach

Always design mobile first, then add responsive overrides:

```
Mobile (default) → sm → md → lg → xl → 2xl
```

### Typography Scaling

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero Title | 36px | 48px | 60-72px |
| Section Title | 24px | 30px | 36px |
| Body | 16px | 16px | 16px |
| Caption | 12px | 12px | 14px |

### Spacing Scaling

| Element | Mobile | Desktop |
|---------|--------|---------|
| Section Padding | 64px | 96px |
| Container Padding | 16px | 40px |
| Grid Gap | 16px | 24px |

---

## Common Patterns

### Status Indicator

```
┌─────────────┐
│ ● Active    │  ← Colored dot + text
└─────────────┘
```

Colors by status:
- Success: Green dot/text
- Warning: Yellow dot/text
- Error: Red dot/text
- Info: Blue dot/text

### Form Field

```
┌─────────────────────────────┐
│ Label                       │
├─────────────────────────────┤
│ [Input field            ]   │
├─────────────────────────────┤
│ Helper text or error        │
└─────────────────────────────┘
```

Gap between elements: 8px

### Section Layout

```
┌─────────────────────────────────────────────────┐
│                 Section Wrapper                 │
│  ┌───────────────────────────────────────────┐  │
│  │              Section Heading              │  │
│  │  Label (optional)                         │  │
│  │  Title                                    │  │
│  │  Description (optional)                   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │              Content Area                 │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Two-Column Layout

```
┌─────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │                  │  │                  │    │
│  │    Column 1      │  │    Column 2      │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

Gap: 24-48px

### Card Grid

```
┌─────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ Card │  │ Card │  │ Card │  │ Card │       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────────────────┘
```

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Gap: 16-24px

### Navigation Pattern

```
Mobile:                    Desktop:
┌────────────────┐         ┌─────────────────────────────┐
│ [Logo]    [☰] │         │ [Logo]  Nav  Nav  Nav [CTA] │
└────────────────┘         └─────────────────────────────┘
```

### Pricing Cards Layout

```
┌─────────────────────────────────────────────────┐
│  ┌────────┐  [+]  ┌────────┐  [+]  ┌────────┐  │
│  │ Basic  │       │  Pro   │       │ Enter- │  │
│  │        │       │(highlight)     │ prise  │  │
│  └────────┘       └────────┘       └────────┘  │
└─────────────────────────────────────────────────┘
```

The [+] connector spins periodically.

---

## Z-Index Layers

| Layer | Z-Index | Elements |
|-------|---------|----------|
| Background | 0 | Decorative elements |
| Content | 1 | Standard content |
| Dropdown | 10 | Menus, selects |
| Sticky | 20 | Sticky elements |
| Header | 50 | Navigation header |
| Modal | 100 | Dialogs, sheets |
| Tooltip | 150 | Tooltips, popovers |

---

## Icon Guidelines

**Primary Icon Library:** Lucide React

**Sizes:**
- Small: 16px
- Default: 20px
- Large: 24px

**Colors:**
- Match text color by context
- Accent icons: Teal `#08A4BD`
- Feature icons: Use feature colors

**Common Icons:**
- Navigation: ChevronDown, ChevronRight, Menu, X
- Actions: Plus, Trash, Edit, Save
- Status: Check, AlertCircle, Info, XCircle
- Features: Zap (automate), MessageSquare (advice), RefreshCw (adapt), TrendingUp (scale)

---

## Quick Reference Card

### Most Used Colors
```
Primary Text:     #2D3142
Secondary Text:   #5E4F7E
Accent/Links:     #08A4BD
Page Background:  #FBFBF3
Card Background:  #FFFFFF
Borders:          #CBD5E1
Error:            #F70D1A
Success:          #22C55E
```

### Most Used Spacing
```
Tiny:     4px
Small:    8px
Medium:   16px
Large:    24px
XLarge:   32px
Section:  64-96px
```

### Most Used Radii
```
Small:    8px (inputs, badges)
Medium:   12px (cards, buttons)
Large:    16px (modals)
Full:     9999px (pills, avatars)
```

---

**End of Reference Document**
