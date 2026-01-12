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

**🚫 Standard Tailwind Color Detected**

You're using standard Tailwind color classes (bg-slate-, text-gray-, etc.) in production code, which violates DDS rules.

**Blocked patterns:**
- `bg-slate-*`, `bg-gray-*`, `bg-blue-*`, etc.
- `text-gray-*`, `text-slate-*`, `text-blue-*`, etc.
- `border-gray-*`, `border-slate-*`, etc.

**Why this is blocked:**
- DDS uses custom primitive scales, not standard Tailwind colors
- `SLATE` in DDS is different from Tailwind's `slate`
- Standard Tailwind colors bypass DDS design tokens
- Brand consistency requires DDS semantic classes

**Use DDS semantic classes instead:**

```tsx
// ❌ DON'T USE standard Tailwind
<div className="bg-slate-100 text-gray-600 border-gray-300">

// ✅ USE DDS semantic classes
<div className="bg-surface text-secondary border-default">
<div className="bg-page text-primary border-subtle">
<div className="bg-muted-bg text-muted border-strong">
```

**Common replacements:**
| Standard Tailwind | DDS Semantic Class |
|------------------|-------------------|
| `bg-slate-50/100` | `bg-page` or `bg-muted-bg` |
| `bg-white` | `bg-surface` |
| `text-gray-600/700` | `text-secondary` or `text-muted` |
| `text-gray-900` | `text-primary` |
| `border-gray-200/300` | `border-default` or `border-subtle` |
| `bg-blue-*` | `bg-accent-strong` or `bg-info` |
| `text-blue-*` | `text-accent` or `text-link` |
| `bg-red-*` | `bg-error` or `bg-error-light` |
| `text-red-*` | `text-error` |

**From CLAUDE.md:**
> ALL styling must use design tokens - No raw colors, no standard Tailwind colors

**Note:** Stories and demos are excluded from this rule.

**Full DDS color reference:** See CLAUDE.md or `tailwind-preset.js`
