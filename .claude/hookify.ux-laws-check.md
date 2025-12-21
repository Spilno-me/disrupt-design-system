---
name: ux-laws-check
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.(tsx|ts)$
---

## UX Laws Check

| Law | Constraint | Value |
|-----|------------|-------|
| Fitts | Touch target | `min-h-11 min-w-11` (44px) |
| Hick | Max options | 5-7 choices |
| Miller | Visible items | 7±2 max |
| Von Restorff | Primary action | Visually distinct |
| Doherty | Loading feedback | >400ms → spinner |

```tsx
// ❌ Violations
<Select options={allItems} />        // 20+ options
<button className="p-1">X</button>   // Tiny target
<Button>Save</Button><Button>Save</Button>  // No hierarchy

// ✅ Compliant
<Select options={grouped} maxVisible={7} />
<button className="min-h-11 p-3">X</button>
<Button variant="primary">Save</Button>
```

Ref: `.claude/ux-laws-rules.md`
