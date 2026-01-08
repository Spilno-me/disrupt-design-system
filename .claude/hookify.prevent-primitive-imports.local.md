---
name: prevent-primitive-imports
enabled: false  # DEPRECATED: Use primitive-import-block instead
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: file_path
    operator: not_contains
    pattern: tailwind-preset.js
  - field: file_path
    operator: not_contains
    pattern: designTokens.ts
  - field: file_path
    operator: not_contains
    pattern: ColorPalette.stories.tsx
  - field: content
    operator: regex_match
    pattern: import\s+\{[^}]*(ABYSS|CORAL|SAGE|TEAL|DEEP_CURRENT|DUSK_REEF|WAVE|SUNRISE|ORANGE|HARBOR|SLATE|PRIMITIVES)[^}]*\}\s+from
action: block
---

## Blocked: PRIMITIVE Import

```
PRIMITIVES → ALIAS → Tailwind → Components
(Tier 1)     (Tier 2)  (semantic)
```

```tsx
// ❌ Blocked
import { ABYSS, CORAL } from '@/constants/designTokens'
<div style={{ backgroundColor: ABYSS[500] }}>

// ✅ Tailwind semantic (preferred)
<div className="bg-surface text-primary border-default">

// ✅ Dynamic only - ALIAS
import { ALIAS } from '@/constants/designTokens'
<div style={{ backgroundColor: ALIAS.background.surface }}>
```

**Exceptions:** `tailwind-preset.js`, `designTokens.ts`, `ColorPalette.stories.tsx`
