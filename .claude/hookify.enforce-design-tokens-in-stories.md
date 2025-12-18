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

Stories MUST use design system tokens to accurately reflect the actual component colors.

**Why this is critical for stories:**
- Stories demonstrate the design system to developers
- Raw colors don't reflect actual token values
- Updates to design tokens won't show in Storybook
- Misleading color reference for implementers

**Required approach for stories:**

```tsx
// ❌ BAD - Raw hex colors
const colors = {
  primary: "#08A4BD",
  secondary: "#2D3142"
}

// ✅ GOOD - Design system tokens
import { DEEP_CURRENT, ABYSS, CORAL, PRIMITIVES } from '@/constants/designTokens'

const colors = {
  primary: DEEP_CURRENT[500],
  secondary: ABYSS[500]
}
```

**Available token imports:**
```tsx
import {
  DEEP_CURRENT,  // Teal scale
  ABYSS,         // Dark navy scale
  CORAL,         // Red scale
  HARBOR,        // Green scale
  WAVE,          // Blue scale
  SUNRISE,       // Yellow scale
  ORANGE,        // Orange scale
  DUSK_REEF,     // Purple scale
  SLATE,         // Gray scale
  PRIMITIVES,    // white, black, cream, linkedIn
  ALIAS          // Semantic tokens
} from '@/constants/designTokens'
```

**Stories are documentation** - they must show the real design system!
