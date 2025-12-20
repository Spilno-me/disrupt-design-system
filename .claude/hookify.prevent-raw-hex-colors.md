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

## Blocked: Raw Hex Color

```tsx
// ❌ Blocked
<div style={{ backgroundColor: '#08A4BD' }}>

// ✅ Tailwind semantic (preferred)
<div className="bg-surface text-primary border-default">
<div className="text-error bg-error-light">

// ✅ Dynamic only - use ALIAS
import { ALIAS } from '@/constants/designTokens'
<div style={{ backgroundColor: ALIAS.background.surface }}>
```

| Category | Classes |
|----------|---------|
| Text | `text-primary`, `text-secondary`, `text-error`, `text-success` |
| Background | `bg-surface`, `bg-page`, `bg-accent-strong`, `bg-error-light` |
| Border | `border-default`, `border-accent`, `border-error` |
