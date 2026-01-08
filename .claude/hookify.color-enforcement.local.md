---
name: color-enforcement
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?|css)$
  - field: file_path
    operator: not_regex_match
    pattern: (designTokens\.ts|tailwind-preset\.js|generate-tokens|ColorPalette\.stories\.tsx|tokens\.css|styles\.css)
  - field: content
    operator: regex_match
    pattern: (#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}(?![0-9A-Fa-f])|rgb\(|rgba\(|(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d)
---

## Blocked: Non-Token Color

**What was detected:** Raw hex, rgb(), or standard Tailwind color

### Use DDS Tokens Instead:

| Need | Semantic Token |
|------|----------------|
| Text | `text-primary`, `text-secondary`, `text-muted`, `text-error`, `text-success` |
| Background | `bg-surface`, `bg-page`, `bg-muted-bg`, `bg-accent-strong`, `bg-error-light` |
| Border | `border-default`, `border-subtle`, `border-accent`, `border-error` |

### Color Decision Flow:
```
1. Semantic first  → text-error, bg-warning (conveys meaning)
2. Contextual      → text-primary, bg-surface (UI structure)
3. Primitive last  → text-abyss-500 (only when no semantic fit)
```

### Dynamic Colors (JS only):
```tsx
import { ALIAS } from '@/constants/designTokens'
<div style={{ backgroundColor: ALIAS.background.surface }}>
```

**Ref:** `src/data/color-intelligence.json`, `.claude/color-intelligence.toon`, `.claude/css-styling-rules.md`
**MCP:** `mcp__dds__get_color_recommendation`, `mcp__dds__check_contrast`
