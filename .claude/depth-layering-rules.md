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
| Works in dark mode | ☐ |
