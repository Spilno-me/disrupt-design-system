---
name: primitive-import-block
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: file_path
    operator: not_regex_match
    pattern: (tailwind-preset\.js|designTokens\.ts|ColorPalette\.stories\.tsx|tokens\.css)
  - field: content
    operator: regex_match
    pattern: import\s+\{[^}]*(ABYSS|CORAL|SAGE|TEAL|DEEP_CURRENT|DUSK_REEF|WAVE|SUNRISE|ORANGE|HARBOR|SLATE|PRIMITIVES)[^}]*\}\s+from\s+['"]@
---

## Blocked: Primitive Token Import

**Token hierarchy:**
```
PRIMITIVES → ALIAS → Tailwind → Components
(Tier 1)     (Tier 2)  (semantic)
     ↑          ↑          ↑
  BLOCKED    Dynamic    Preferred
```

### Instead use:

```tsx
// ❌ Blocked - direct primitive
import { ABYSS, CORAL } from '@/constants/designTokens'
<div style={{ color: ABYSS[500] }}>

// ✅ Preferred - Tailwind semantic
<div className="text-primary bg-surface border-default">

// ✅ Dynamic only - use ALIAS
import { ALIAS } from '@/constants/designTokens'
<div style={{ backgroundColor: ALIAS.background.surface }}>
```

**Exceptions:** Token definition files, ColorPalette story
