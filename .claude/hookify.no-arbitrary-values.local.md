---
name: no-arbitrary-values
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (className="[^"]*\[[\d]+(px|rem|em|%)\][^"]*"|className="[^"]*\[#[0-9A-Fa-f]+\][^"]*"|w-\[\d|h-\[\d|p-\[\d|m-\[\d|gap-\[\d|text-\[\d|z-\[\d)
---

## Warning: Arbitrary Tailwind Value

**Use design tokens instead of arbitrary values.**

| Detected | Token Alternative |
|----------|-------------------|
| `w-[200px]` | `w-48`, `w-52`, `w-56` |
| `h-[100px]` | `h-24`, `h-28`, `h-32` |
| `p-[10px]` | `p-2`, `p-2.5`, `p-3` |
| `gap-[12px]` | `gap-3` |
| `text-[14px]` | `text-sm` |
| `z-[999]` | `z-50`, `z-modal` |
| `[#FF0000]` | Use semantic token |

```tsx
// ❌ Arbitrary values
<div className="w-[200px] h-[100px] p-[10px] text-[14px]">

// ✅ Design tokens
<div className="w-52 h-24 p-2.5 text-sm">
```

**Exception:** One-off values with documented reason.
