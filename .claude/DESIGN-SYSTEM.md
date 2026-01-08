# DDS Visual Design System

**Agent-only. Structured rules.**

---

## Shadows

### Rule: Elevation = Importance + Interactivity

```
INTERACTIVE/IMPORTANT → LARGER shadow (closer to user)
DATA-ONLY/SECONDARY   → SMALLER shadow (further from user)
```

### Lookup Table

| Shadow | Use | Examples |
|--------|-----|----------|
| `xl` | Critical attention | Alerts, error dialogs |
| `lg` | Interactive overlays | Modals, sheets, drawers |
| `elevated` | Premium emphasis | KPIs, CTAs, featured cards |
| `md` | Standard | Cards, buttons, dropdowns |
| `sm` | Data display | Tags, badges, stats |
| `none` | Flat | Inline buttons, links |

### Decision

```
interactive?
├─ immediate_attention? → xl/lg
├─ featured/CTA? → elevated
└─ standard → md
data_only?
├─ important → md
└─ secondary → sm
```

### Values

```typescript
sm: '0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08)'
md: '0 2px 8px -1px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.08)'
elevated: '0 3px 12px -1px rgba(0,0,0,0.14), 0 10px 28px -4px rgba(0,0,0,0.10)'
lg: '0 4px 16px -2px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.08)'
xl: '0 8px 24px -4px rgba(0,0,0,0.12), 0 12px 32px -6px rgba(0,0,0,0.08)'
```

### Physics (2-layer system)

- **Umbra**: 12-14% opacity, close, sharp
- **Penumbra**: 6-10% opacity, far, soft
- Rule: opacity DECREASES with distance

---

## Colors

### Rule: oklch() format ONLY

```css
❌ --ring: #2563EB
❌ --ring: rgb(37, 99, 235)
✅ --ring: oklch(0.533 0.195 264.05)
```

### Format

```
oklch(L C H)
L = Lightness (0-1)
C = Chroma (saturation)
H = Hue (0-360)
```

### Automation

```bash
# ALWAYS run after editing designTokens.ts
npm run generate-tokens
```

---

## Typography

| Context | Font | Class |
|---------|------|-------|
| Website marketing | Pilat Extended | `font-display` |
| App UI | Fixel | `font-sans` |
| Code | Monospace | `font-mono` |

---

## Spacing

### Website (generous)

```
sectionPaddingY: py-16 lg:py-24
sectionPaddingX: px-6 lg:px-10
contentGap: gap-12 lg:gap-16
```

### App (compact)

```
pageContainer: p-6
cardPadding: p-4 or p-6
formGap: gap-2
sectionGap: gap-6
```

---

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Tags |
| sm | 8px | Inputs, buttons |
| md | 12px | Cards (default) |
| lg | 16px | Large cards |
| xl | 20px | Modals |
| full | 9999px | Pills, avatars |

---

## Animation

| Speed | Duration | Use |
|-------|----------|-----|
| fast | 150ms | Hover |
| normal | 200ms | Default |
| smooth | 300ms | Modals |
| slow | 500ms | Prominent |

Default easing: `ease-out`

---

## Maintenance Triggers

| Change | Update |
|--------|--------|
| Visual pattern | DESIGN-SYSTEM.md + DesignTokens.mdx + CHANGELOG |
| Token | `npm run generate-tokens` + DESIGN-SYSTEM.md if new pattern |
| New component | component-registry.json + CHANGELOG + stories |
