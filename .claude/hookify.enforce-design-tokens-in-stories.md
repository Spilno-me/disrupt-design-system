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

**🚫 Raw Color Value in Story File Detected**

Stories MUST use **semantic Tailwind classes** to model best practices for developers.

**Why this is critical for stories:**
- Stories demonstrate the design system to developers
- Stories should model what component code looks like
- Using primitives in stories teaches bad habits
- Semantic classes ensure dark mode compatibility

**Required approach for stories:**

```tsx
// ❌ BAD - Raw hex colors
<div style={{ color: "#08A4BD" }}>

// ❌ BAD - Primitive imports (except ColorPalette.stories.tsx)
import { DEEP_CURRENT } from '@/constants/designTokens'
<div style={{ color: DEEP_CURRENT[500] }}>

// ✅ GOOD - Semantic Tailwind classes
<div className="text-accent bg-surface border-default">
<div className="text-error bg-error-light">
<div className="text-success bg-success-light">
<IconText iconClassName="text-accent" textClassName="text-primary">
```

**Available semantic classes:**

| Category | Classes |
|----------|---------|
| Text | `text-primary`, `text-secondary`, `text-muted`, `text-accent`, `text-error`, `text-success` |
| Background | `bg-surface`, `bg-page`, `bg-muted-bg`, `bg-accent-strong`, `bg-error-light` |
| Border | `border-default`, `border-accent`, `border-error` |
| Status | `text-error`, `text-success`, `text-warning`, `text-info` |

**ONE Exception:** `ColorPalette.stories.tsx` may import PRIMITIVES to **display** the palette values (documented in the file).

**Stories are documentation** - they must model best practices!
