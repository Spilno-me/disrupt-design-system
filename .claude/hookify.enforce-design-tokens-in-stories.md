---
name: enforce-design-tokens-in-stories
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.stories\.tsx?$
  - field: new_text
    operator: regex_match
    pattern: (?:['"`]#[0-9A-Fa-f]{3,8}['"`]|:\s*#[0-9A-Fa-f]{3,8})
action: block
---

## Blocked: Raw Color in Story

Stories model best practices. Use semantic classes only.

```tsx
// ❌ Blocked - raw hex
<div style={{ color: "#08A4BD" }}>

// ❌ Blocked - primitive import
import { DEEP_CURRENT } from '@/constants/designTokens'
<div style={{ color: DEEP_CURRENT[500] }}>
```

```tsx
// ✅ Semantic classes
<div className="text-accent bg-surface border-default">
<div className="text-error bg-error-light">
```

| Category | Classes |
|----------|---------|
| Text | `text-primary`, `text-secondary`, `text-accent`, `text-error` |
| Background | `bg-surface`, `bg-page`, `bg-muted-bg`, `bg-accent-strong` |
| Border | `border-default`, `border-accent`, `border-error` |

**Exception:** `ColorPalette.stories.tsx` (displays palette values)
