---
name: prevent-raw-hex-colors
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: new_text
    operator: regex_match
    pattern: (?:color|background|border)(?::|=|\s*:\s*['"`])\s*#[0-9A-Fa-f]{3,8}
action: block
---

**🚫 Raw Hex Color Detected**

You're adding raw hex color values to code, which violates DDS styling rules.

**Why this is blocked:**
- Raw hex colors bypass the design token system
- Changes to brand colors won't propagate
- Inconsistency across components

**What to use instead:**

**For static styling (preferred):**
```tsx
// Use Tailwind semantic classes
<div className="bg-surface text-primary border-default">
<div className="text-error bg-error-light">
```

**For dynamic styling only:**
```tsx
import { ALIAS } from '@/constants/designTokens'

<div style={{
  backgroundColor: isError ? ALIAS.status.error : ALIAS.background.surface
}}>
```

**From CLAUDE.md:**
> ALL styling must use design tokens - No raw colors

**Available DDS classes:**
- Text: `text-primary`, `text-secondary`, `text-error`, `text-success`
- Background: `bg-surface`, `bg-page`, `bg-accent-strong`, `bg-error-light`
- Border: `border-default`, `border-accent`, `border-error`
