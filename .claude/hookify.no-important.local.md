---
name: no-important
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|css)$
  - field: file_path
    operator: not_contains
    pattern: node_modules
  - field: content
    operator: regex_match
    pattern: !important
---

## Blocked: !important Flag

**CSS Rule:** Fix specificity at source, never use !important.

| Problem | Real Fix |
|---------|----------|
| Style being overridden | Increase selector specificity |
| Tailwind not applying | Check class order, use `!` prefix |
| Third-party conflict | Use `@layer` or scoped styles |

```css
/* ❌ Blocked */
.button { color: white !important; }

/* ✅ Fix specificity */
.card .button { color: white; }

/* ✅ Tailwind override syntax */
<div className="!text-white">
```

**If truly needed:** Document WHY in a comment and ask for review.
