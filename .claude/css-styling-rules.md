# CSS Styling Rules

## Token Selection Priority

**Semantic tokens first.** Always prefer tokens that convey meaning.

| Priority | Token Type | Example | When to Use |
|----------|-----------|---------|-------------|
| **1st** | Semantic | `text-warning`, `bg-error`, `border-success` | Color conveys **meaning** |
| **2nd** | Contextual | `text-primary`, `bg-surface`, `border-default` | UI structure (text, backgrounds) |
| **3rd** | Primitive | `text-abyss-500`, `bg-coral-200` | Only when neither above fits |

```tsx
// ✅ GOOD - Semantic: self-documenting, theme-aware
<Badge className="border-warning text-warning">Investigation</Badge>

// ❌ AVOID - Primitive: meaning unclear, may break in themes
<Badge className="border-amber-500 text-amber-600">Investigation</Badge>
```

**Why semantic first:**
- Self-documenting (code reads as intent)
- Theme-aware (dark mode automatic)
- Consistent (all warnings look the same)
- Maintainable (change once, updates everywhere)

**When to use primitives:**
- Decorative elements (no semantic meaning)
- Brand illustrations, custom gradients
- One-off visual effects

---

## General Rules

| Rule | Do | Don't |
|------|----|----|
| **Tailwind** | `className="p-4 bg-abyss-500"` | `style={{ padding: '16px' }}` |
| **!important** | Fix specificity at source | `color: white !important` |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Style ignored | Increase specificity or Tailwind variant |
| Style overridden | Check cascade, use `@layer` |
| Need `!important` | Refactor competing styles |

## Exceptions

- MDX docs: inline styles OK for isolated examples
- Third-party: only when no Tailwind alternative (document why)

## Patterns

```tsx
// Layout:  flex items-center justify-between gap-4
// Spacing: p-4 m-2 space-y-4
// Colors:  bg-abyss-500 text-white border-slate-200
// Type:    text-sm font-medium text-slate-600
// RWD:     flex-col md:flex-row | p-4 md:p-6 lg:p-8
```
