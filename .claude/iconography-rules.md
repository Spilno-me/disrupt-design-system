# Iconography Rules - No Emojis Policy

**Agent-only. Apply to all icon usage decisions.**

---

## CRITICAL: No Emojis in Design System

**NEVER use emojis. ALWAYS use Lucide React icons.**

```tsx
// ❌ WRONG: Emoji usage
<span>🎨</span>
icon="📱"
icon: '💡'

// ✅ CORRECT: Lucide icons
import { Palette, Smartphone, Lightbulb } from 'lucide-react';
<Palette size={24} />
icon={<Smartphone size={24} />}
```

---

## Why No Emojis?

| Issue | Impact |
|-------|--------|
| **Inconsistent rendering** | Emojis look different on Mac, Windows, Android, iOS |
| **No brand control** | Can't apply brand colors to emojis |
| **Poor accessibility** | Screen readers handle SVG icons better |
| **Visual inconsistency** | Emojis have varying visual weights and styles |
| **No customization** | Can't adjust stroke width, size proportionally |

---

## Icon Library

**We use Lucide React** - consistent 24x24 grid, 2px stroke width.

```tsx
import { IconName } from 'lucide-react';
```

Browse icons: https://lucide.dev

---

## Standard Sizes

| Size | Pixels | Use Case |
|------|--------|----------|
| XS | 16px | Inline text, badges |
| SM | 20px | Buttons, inputs, form icons |
| MD | 24px | Navigation, cards, default |
| LG | 32px | Feature highlights |
| XL | 48px | Empty states, heroes |

---

## Icon Container Pattern

When displaying icons in documentation or cards, wrap in a container:

```tsx
// Standard icon container
<div style={{
  width: '40px',           // or 48px, 56px depending on context
  height: '40px',
  borderRadius: RADIUS.sm,
  background: DEEP_CURRENT[50],  // or other appropriate background
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
  <IconName size={20} color={DEEP_CURRENT[600]} />
</div>
```

---

## Emoji to Icon Mapping

Common replacements:

| Emoji | Lucide Icon | Import |
|-------|-------------|--------|
| 🎨 | `Palette` | `import { Palette } from 'lucide-react'` |
| 📱 | `Smartphone` | `import { Smartphone } from 'lucide-react'` |
| 💡 | `Lightbulb` | `import { Lightbulb } from 'lucide-react'` |
| ℹ️ | `Info` | `import { Info } from 'lucide-react'` |
| ⚠️ | `AlertTriangle` | `import { AlertTriangle } from 'lucide-react'` |
| 🔗 | `Link2` | `import { Link2 } from 'lucide-react'` |
| 📚 | `BookOpen` | `import { BookOpen } from 'lucide-react'` |
| ✨ | `Sparkles` | `import { Sparkles } from 'lucide-react'` |
| 📐 | `Maximize2` | `import { Maximize2 } from 'lucide-react'` |
| 🧩 | `Puzzle` | `import { Puzzle } from 'lucide-react'` |
| ⚡ | `Zap` | `import { Zap } from 'lucide-react'` |
| 📄 | `FileText` | `import { FileText } from 'lucide-react'` |
| 🌙 | `Moon` | `import { Moon } from 'lucide-react'` |
| ☀️ | `Sun` | `import { Sun } from 'lucide-react'` |
| 🚧 | `Construction` | `import { Construction } from 'lucide-react'` |
| 📥 | `Download` | `import { Download } from 'lucide-react'` |
| 📊 | `Presentation` | `import { Presentation } from 'lucide-react'` |
| 📋 | `ClipboardList` | `import { ClipboardList } from 'lucide-react'` |

---

## Exceptions

**Acceptable Unicode symbols** (semantic markers, not emojis):

- `✓` / `✕` - Checkmark and X for do/don't lists
- `→` - Arrows in documentation

These are typographic symbols, not emojis.

---

## Icon Colors

Icons should use semantic colors from the design system:

```tsx
// Interactive context
<Icon color={DEEP_CURRENT[600]} />

// Muted/secondary
<Icon color={SLATE[400]} />

// On dark backgrounds
<Icon color={PRIMITIVES.white} />

// Error state
<Icon color={CORAL[600]} />
```

---

## Icon + Text Spacing

Follow spacing rules for icon-text combinations:

```tsx
// Icon + Text: 8px gap (micro spacing)
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Icon size={16} />
  <span>Label text</span>
</div>
```

---

## Component Props

When creating components that accept icons, use `React.ReactNode`:

```tsx
interface ComponentProps {
  icon: React.ReactNode;  // ✅ Accepts Lucide icons
  // icon: string;        // ❌ Would require emoji strings
}
```
