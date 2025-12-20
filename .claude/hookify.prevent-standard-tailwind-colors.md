---
name: prevent-standard-tailwind-colors
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: file_path
    operator: not_contains
    pattern: .stories.tsx
  - field: file_path
    operator: not_contains
    pattern: _archive/
  - field: file_path
    operator: not_contains
    pattern: /stories/demos/
  - field: new_text
    operator: regex_match
    pattern: (bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d
action: block
---

## Blocked: Standard Tailwind Color

DDS uses custom primitives, not Tailwind defaults.

```tsx
// ❌ Blocked
<div className="bg-slate-100 text-gray-600 border-gray-300">

// ✅ Use DDS semantic
<div className="bg-surface text-secondary border-default">
```

| Tailwind | DDS |
|----------|-----|
| `bg-slate-50/100` | `bg-page` / `bg-muted-bg` |
| `bg-white` | `bg-surface` |
| `text-gray-600/700` | `text-secondary` / `text-muted` |
| `text-gray-900` | `text-primary` |
| `border-gray-200/300` | `border-default` / `border-subtle` |
| `bg-blue-*` | `bg-accent-strong` / `bg-info` |
| `text-blue-*` | `text-accent` / `text-link` |
| `bg-red-*` | `bg-error` / `bg-error-light` |
| `text-red-*` | `text-error` |

**Excluded:** `*.stories.tsx`, `_archive/`, `/stories/demos/`
