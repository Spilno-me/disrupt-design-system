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
    pattern: .stories.tsx
  - field: new_text
    operator: regex_match
    pattern: import\s+\{[^}]*(ABYSS|CORAL|SAGE|TEAL|DEEP_CURRENT|DUSK_REEF|WAVE|SUNRISE|ORANGE|HARBOR|SLATE|PRIMITIVES)[^}]*\}\s+from
action: block
---

**🚫 PRIMITIVE Token Import Detected**

You're importing PRIMITIVE tokens (ABYSS, CORAL, SAGE, TEAL, etc.) directly, which violates DDS architecture.

**Blocked imports:**
- `import { ABYSS } from '@/constants/designTokens'`
- `import { CORAL, SAGE } from '@/constants/designTokens'`
- `import { DEEP_CURRENT, DUSK_REEF } from '...'`
- `import { WAVE, SUNRISE, ORANGE, HARBOR } from '...'`
- `import { PRIMITIVES } from '...'`

**Why this is blocked:**
- PRIMITIVES are Tier 1 tokens (raw values)
- Direct usage bypasses the semantic token system (ALIAS)
- Components should use semantic meaning, not raw colors
- Makes future design changes harder

**DDS 2-Tier Architecture:**
```
PRIMITIVES → ALIAS → Components consume via Tailwind
(Tier 1)     (Tier 2)
```

**What to use instead:**

**For static styling (preferred):**
```tsx
// ✅ Use Tailwind semantic classes
<div className="bg-surface text-primary border-default">
<div className="text-error bg-error-light">
<div className="bg-accent-strong text-inverse">
```

**For dynamic styling only:**
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

**From CLAUDE.md:**
> "Components should import ALIAS, not PRIMITIVES"
> "PRIMITIVES are only used in tailwind-preset.js and designTokens.ts"

**Exception:** This rule is disabled for:
- `tailwind-preset.js` (needs primitives to build Tailwind config)
- `designTokens.ts` (defines the tokens)
- Story files (documentation purposes)
