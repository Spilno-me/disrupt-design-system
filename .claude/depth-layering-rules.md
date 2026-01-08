# Depth Layering Rules

**Formula:** Closer = Lighter. Both themes. No exceptions.

```tsx
// ❌ Card darker than page
// ✅ Card lighter than page (elevation = brightness)
```

## When to Apply

| Building... | Read this section |
|-------------|-------------------|
| Page layout | Layer Hierarchy, Tokens |
| Cards/panels | Tokens, Shadows |
| Modals/dropdowns | Elevated layer rules |
| Dark mode support | Layer Hierarchy (Dark column) |
| Nested containers | FORBIDDEN |

## Layer Hierarchy

| Depth | Layer | Token | Light | Dark | Shadow |
|-------|-------|-------|-------|------|--------|
| 1 | Elevated | `bg-elevated` | `IVORY[50]` #FFFEF9 | `ABYSS[400]` | `shadow-lg` |
| 2 | Card | `bg-elevated` | `IVORY[50]` #FFFEF9 | `ABYSS[500]` | `shadow-md` |
| 3 | Surface | `bg-surface` | `IVORY[100]` #FAF8F3 | `ABYSS[700]` | `shadow-sm` |
| 4 | SurfaceHover | `bg-surfaceHover` | `IVORY[300]` #E5E2DB | `ABYSS[600]` | — |
| 5 | Page | `bg-page` | `IVORY[400]` #D5D2CB | `ABYSS[900]` | — |

## Glass Transparency Model

**Principle:** Elements closer to the page background reveal more of the underlying blob grid. Elevated elements feel more solid/frosted.

**Dark Mode:** Glass inverts from white to black - same opacity, same blur, different base color.

### Transparency-Depth Mapping

| Depth | Layer | Light Mode | Dark Mode | Blur | Grid Visibility |
|-------|-------|------------|-----------|------|-----------------|
| 5 | Page | N/A (solid `bg-page`) | N/A (solid `bg-page`) | — | Full |
| 4 | SurfaceHover | `bg-white/10` | `bg-black/10` | 1px | High |
| 3 | Surface | `bg-white/20` | `bg-black/20` | 2px | Medium |
| 2 | Card | `bg-white/40` | `bg-black/40` | 4px | Low |
| 1 | Elevated | `bg-white/60` | `bg-black/60` | 8px | Minimal |

### Glass Effect Classes (Light + Dark Mode)

```tsx
// Depth 4 - Most transparent (hover states)
className="bg-white/10 dark:bg-black/10 backdrop-blur-[1px]"

// Depth 3 - Medium transparency (surface cards)
className="bg-white/20 dark:bg-black/20 backdrop-blur-[2px]"

// Depth 2 - Low transparency (primary cards)
className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px]"

// Depth 1 - Minimal transparency (elevated)
className="bg-white/60 dark:bg-black/60 backdrop-blur-[8px]"
```

### When to Use Glass vs Solid

| Context | Use | Why |
|---------|-----|-----|
| Over blob background | Glass | Reveals grid, creates depth |
| Over solid surface | Solid (`bg-elevated`) | No benefit from transparency |
| Nested cards | Border only | Avoid double-frosting |
| Interactive elements | Glass at depth 3-4 | Feel connected to page |
| Primary content (tables) | Glass at depth 2 | Focus attention |
| Overlays (modals) | Glass at depth 1 | Maximum separation |

### Border & Shadow Hierarchy

**Rule:** Glass backgrounds use accent (teal) 2px borders + shadows for lift. Solid backgrounds use solid default borders.

| Depth | Light Glass | Dark Glass | Border | Shadow |
|-------|-------------|------------|--------|--------|
| 4 | `bg-white/10` | `dark:bg-black/10` | `border-2 border-accent` | — |
| 3 | `bg-white/20` | `dark:bg-black/20` | `border-2 border-accent` | `shadow-sm` |
| 2 | `bg-white/40` | `dark:bg-black/40` | `border-2 border-accent` | `shadow-md` |
| 1 | `bg-white/60` | `dark:bg-black/60` | `border-2 border-accent` | `shadow-lg` |

### Glass + Border + Shadow Examples (Light + Dark)

```tsx
// Depth 4 - Most transparent (hover overlays)
className="bg-white/10 dark:bg-black/10 backdrop-blur-[1px] border-2 border-accent"

// Depth 3 - Surface cards (stats, filters, tabs)
className="bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent shadow-sm"

// Depth 2 - Page headers, prominent cards
className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md"

// Depth 1 - Elevated floating elements
className="bg-white/60 dark:bg-black/60 backdrop-blur-[8px] border-2 border-accent shadow-lg"
```

### Colored Glass

**Rule:** Colored glass follows the same opacity/blur rules as white glass. Border uses same color but +20% opacity for contrast.

| Depth | Background | Border | Formula |
|-------|------------|--------|---------|
| 4 | `color/10` | `color/30` | bg + 20% |
| 3 | `color/20` | `color/40` | bg + 20% |
| 2 | `color/40` | `color/60` | bg + 20% |
| 1 | `color/60` | `color/80` | bg + 20% |

**Colors:** warning, error, success, info, accent

```tsx
// Depth 3 Warning glass (alert metric card)
className="bg-warning/20 backdrop-blur-[2px] border-2 border-warning/40 shadow-sm"

// Depth 3 Error glass (critical alert)
className="bg-error/20 backdrop-blur-[2px] border-2 border-error/40 shadow-sm"

// Depth 2 Success glass (confirmation card)
className="bg-success/40 backdrop-blur-[4px] border-2 border-success/60 shadow-md"

// Depth 3 Info glass (info panel)
className="bg-info/20 backdrop-blur-[2px] border-2 border-info/40 shadow-sm"

// Depth 4 Accent glass (hover state - no shadow)
className="bg-accent/10 backdrop-blur-[1px] border-2 border-accent/30"
```

## FORBIDDEN

| Pattern | Why | Fix |
|---------|-----|-----|
| Page lighter than card | Inverts depth perception | Use `bg-page` for page |
| Elevated without shadow | Looks flat despite bg | Add `shadow-md` or `shadow-lg` |
| Raw colors for layers | Breaks dark mode | Use semantic tokens |
| Skip >2 shade steps | Jarring contrast | Use intermediate layer |
| Nested same-shade no border | Elements merge | Add `border` or different shade |

## Decision Table

| Situation | Action |
|-----------|--------|
| Modal over content | `bg-elevated shadow-lg` |
| Card on page | `bg-elevated shadow-md` |
| Sidebar/panel | `bg-surface shadow-sm` |
| Main page background | `bg-page` |
| Card inside card | Same bg + `border border-default` |
| Dropdown menu | `bg-elevated shadow-lg` |
| Tooltip | `bg-elevated shadow-lg` |
| Hover state on surface | `hover:bg-surfaceHover` |

## Red Flags (STOP)

| Signal | Problem | Action |
|--------|---------|--------|
| Using `bg-white` for page | Will be wrong in dark mode | Use `bg-page` |
| Using `bg-gray-*` anywhere | Not a DDS token | Find semantic equivalent |
| Card appears "sunken" | Wrong depth order | Check parent is darker |
| Elements visually merge | Same shade, no border | Add border or elevation |
| Inline `backgroundColor:` | Hardcoded, breaks themes | Use Tailwind token class |

## Anti-Patterns

```tsx
// ❌ WRONG: Page lighter than content
<div className="bg-white">
  <div className="bg-gray-100">  // Card darker = inverted

// ✅ CORRECT: Page darker, card lighter
<div className="bg-page">
  <div className="bg-elevated shadow-md">

// ❌ WRONG: Elevated without shadow
<div className="bg-elevated">

// ✅ CORRECT: Elevation needs shadow
<div className="bg-elevated shadow-md">

// ❌ WRONG: Nested cards, no distinction
<Card className="bg-elevated">
  <Card className="bg-elevated">  // Merge visually

// ✅ CORRECT: Border separates same-shade
<Card className="bg-elevated">
  <Card className="bg-elevated border border-default">
```

## Component Patterns

```tsx
// Page layout
<main className="bg-page min-h-screen">
  <aside className="bg-surface shadow-sm">
    <nav>...</nav>
  </aside>
  <section className="bg-surface">
    <Card className="bg-elevated shadow-md">
      ...
    </Card>
  </section>
</main>

// Modal
<Dialog>
  <DialogContent className="bg-elevated shadow-lg">
    ...
  </DialogContent>
</Dialog>

// Dropdown
<DropdownContent className="bg-elevated shadow-lg">
  <DropdownItem className="hover:bg-surfaceHover">
    ...
  </DropdownItem>
</DropdownContent>
```

## Validation Checklist

| Check | Pass |
|-------|------|
| Elevated elements have shadows | ☐ |
| Closer elements are lighter | ☐ |
| No shade skipping >2 steps | ☐ |
| Using semantic tokens only | ☐ |
| Nested same-shade has border | ☐ |
| Glass has `dark:bg-black/XX` variant | ☐ |
| Works in dark mode | ☐ |
