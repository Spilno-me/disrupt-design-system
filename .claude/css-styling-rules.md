# CSS Styling Rules

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
