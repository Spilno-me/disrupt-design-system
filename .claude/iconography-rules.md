# Iconography Rules

**NEVER emojis. ALWAYS Lucide React.**

```tsx
// ❌ <span>🎨</span>
// ✅ import { Palette } from 'lucide-react'; <Palette size={24} />
```

## Sizes

| Size | px | Use |
|------|-----|-----|
| XS | 16 | Inline text, badges |
| SM | 20 | Buttons, inputs |
| MD | 24 | Navigation, default |
| LG | 32 | Feature highlights |
| XL | 48 | Empty states, heroes |

## Emoji → Lucide

| Emoji | Lucide |
|-------|--------|
| 🎨 | `Palette` |
| 📱 | `Smartphone` |
| 💡 | `Lightbulb` |
| ⚠️ | `AlertTriangle` |
| ✨ | `Sparkles` |
| ⚡ | `Zap` |
| 🌙 | `Moon` |
| ☀️ | `Sun` |

Browse: https://lucide.dev

## Colors

| Context | Color |
|---------|-------|
| Interactive | `DEEP_CURRENT[600]` |
| Muted | `SLATE[400]` |
| On dark | `PRIMITIVES.white` |
| Error | `CORAL[600]` |

## Props

```tsx
icon: React.ReactNode  // ✅ Accepts Lucide
// icon: string        // ❌ Would require emoji
```

**Allowed symbols:** `✓` `✕` `→` (typographic, not emoji)
