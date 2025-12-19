---
name: prevent-primitive-imports
enabled: true
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
  - field: new_text
    operator: regex_match
    pattern: import\s+\{[^}]*(ABYSS|CORAL|SAGE|TEAL|DEEP_CURRENT|DUSK_REEF|WAVE|SUNRISE|ORANGE|HARBOR|SLATE|PRIMITIVES)[^}]*\}\s+from
action: block
---

**🚫 PRIMITIVE Token Import Detected**

You're importing PRIMITIVE tokens (ABYSS, CORAL, etc.) directly, which violates DDS architecture.

**Blocked imports:**
- `import { ABYSS } from '@/constants/designTokens'`
- `import { CORAL, DEEP_CURRENT } from '@/constants/designTokens'`
- `import { WAVE, SUNRISE, ORANGE, HARBOR } from '...'`
- `import { PRIMITIVES } from '...'`

**Why this is blocked:**
- PRIMITIVES are Tier 1 tokens (raw values)
- Direct usage bypasses the semantic token system
- Components AND stories should use semantic Tailwind classes
- Makes future design changes and dark mode harder

**DDS 2-Tier Architecture:**
```
PRIMITIVES → ALIAS → Tailwind classes → Components/Stories
(Tier 1)     (Tier 2)   (semantic)
```

**What to use instead:**

**For components AND stories (preferred):**
```tsx
// ✅ Use Tailwind semantic classes
<div className="bg-surface text-primary border-default">
<div className="text-error bg-error-light">
<div className="bg-accent-strong text-inverse">
<IconText iconClassName="text-accent" textClassName="text-primary">
```

**For dynamic styling only (rare):**
```tsx
// ✅ Import ALIAS, not primitives
import { ALIAS } from '@/constants/designTokens'

<div style={{
  backgroundColor: isError ? ALIAS.status.error : ALIAS.background.surface,
  color: ALIAS.text.primary
}}>
```

**❌ DON'T DO THIS:**
```tsx
import { ABYSS, CORAL } from '@/constants/designTokens'

<div style={{ backgroundColor: ABYSS[500] }}>  // Wrong!
<div style={{ color: CORAL[500] }}>            // Wrong!
```

**Exceptions (file must be in this list):**
- `tailwind-preset.js` - builds Tailwind config
- `designTokens.ts` - defines the tokens
- `ColorPalette.stories.tsx` - displays the palette (documented exception)
