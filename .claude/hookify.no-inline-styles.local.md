---
name: no-inline-styles
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: file_path
    operator: not_contains
    pattern: .stories.tsx
  - field: content
    operator: regex_match
    pattern: style=\{\{[^}]*(padding|margin|width|height|fontSize|color|background)[^}]*\}\}
---

## Warning: Inline Style Detected

**Use Tailwind classes instead of inline styles.**

| Detected | Tailwind Alternative |
|----------|---------------------|
| `style={{ padding: '16px' }}` | `className="p-4"` |
| `style={{ margin: '8px' }}` | `className="m-2"` |
| `style={{ width: '100%' }}` | `className="w-full"` |
| `style={{ fontSize: '14px' }}` | `className="text-sm"` |
| `style={{ color: '...' }}` | `className="text-primary"` |
| `style={{ background: '...' }}` | `className="bg-surface"` |

```tsx
// ❌ Inline styles
<div style={{ padding: '16px', marginTop: '8px' }}>

// ✅ Tailwind
<div className="p-4 mt-2">
```

**Exceptions:**
- Dynamic values from JS: `style={{ '--progress': percent }}`
- Stories for demos
