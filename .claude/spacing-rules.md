# Spacing Rules

**Base: 4px. NEVER arbitrary values. ALWAYS tokens.**

```tsx
// ❌ style={{ marginTop: '32px' }}
// ✅ style={{ marginTop: SPACING.px.spacious }}
```

## Tokens

| Token | px | Tailwind | Use |
|-------|-----|----------|-----|
| micro | 4 | `gap-1` | Icon↔text |
| tight | 8 | `gap-2` | Label↔input |
| base | 16 | `gap-4` | Within component |
| comfortable | 24 | `gap-6` | Between components |
| spacious | 32 | `gap-8` | Between sections |
| section | 48 | `gap-12` | Major sections |
| page | 96 | `gap-24` | Hero, footer |

## Semantic

| Token | px | Use |
|-------|-----|-----|
| sectionHeadingTop | 32 | After separator |
| sectionHeadingBottom | 24 | To content |
| cardGap | 20 | Between cards |
| cardGapCompact | 16 | Compact grids |
| cardPadding | 24 | Card internal |
| gridGap | 16 | Standard grid |

## Quick Reference

| Relationship | px | Tailwind |
|--------------|-----|----------|
| Icon↔Text | 8 | `gap-2` |
| Label↔Input | 8 | `mb-2` |
| Input↔Input | 16 | `space-y-4` |
| Card↔Card | 16-24 | `gap-4`/`gap-6` |
| Title↔Subtitle | 8 | `mb-2` |
| Title↔Content | 16-24 | `mb-4`/`mb-6` |
| Section↔Section | 48-64 | `py-12`/`py-16` |

## Decision

| Relationship | Token |
|--------------|-------|
| Directly related (label+input) | tight (8) |
| Same group (form fields) | base (16) |
| Separate components | comfortable (24) |
| Different sections | spacious (32-48) |
| Page divisions (hero) | section/page (64-96) |

## Component Patterns

```tsx
// Card
<Card className="p-6">           // 24px padding
  <CardHeader className="pb-4">  // 16px below

// Form
<Label className="mb-2">         // 8px to input
<div className="space-y-4">      // 16px between fields

// Button group
<div className="flex gap-2">     // 8px compact
<div className="flex gap-3">     // 12px standard

// Page
<section className="py-24">      // 96px hero
<section className="py-16">      // 64px content
```

## Tailwind Scale

```
gap-1=4  gap-5=20  gap-12=48  gap-20=80
gap-2=8  gap-6=24  gap-14=56  gap-24=96
gap-3=12 gap-8=32  gap-16=64
gap-4=16 gap-10=40
```
