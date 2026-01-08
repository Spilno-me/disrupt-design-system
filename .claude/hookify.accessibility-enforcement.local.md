---
name: accessibility-enforcement
enabled: false  # DEPRECATED: Use code-quality instead (detects actual violations)
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<div\s+onClick|<span\s+onClick|role=.button|tabIndex)
---

## A11y: Use Semantic HTML

| Pattern | Problem | Fix |
|---------|---------|-----|
| `<div onClick>` | No keyboard | `<button>` |
| `<span onClick>` | No semantics | `<button>` |
| `role="button"` | Incomplete | `<button>` |
| `tabIndex={0}` | Workaround | Semantic element |

```tsx
// ❌ Inaccessible
<div onClick={fn} className="btn">Click</div>

// ✅ Accessible
<button onClick={fn} className="btn">Click</button>

// ✅ Complex interactions → Radix
<Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
```

Focus: `focus:ring-2 focus:ring-accent` | Contrast: `.claude/contrast-matrix.json`
