# Dark Mode Rules

**Formula:** `Dark = 950 - Light`

| Light | Dark |
|-------|------|
| 50 | 900 |
| 100 | 800 |
| 200 | 700 |
| 300 | 600 |
| 400 | 500 |
| 500 | 400 |

## Semantic Tokens

| Token | Light | Dark |
|-------|-------|------|
| **Background** |||
| page | `cream` | `ABYSS[900]` |
| surface | `white` | `ABYSS[800]` |
| surfaceHover | `ABYSS[50]` | `ABYSS[700]` |
| elevated | `white` | `ABYSS[700]` |
| inverse | `ABYSS[500]` | `white` |
| **Text** |||
| primary | `ABYSS[500]` | `SLATE[100]` |
| secondary | `DUSK_REEF[500]` | `DUSK_REEF[300]` |
| disabled | `DUSK_REEF[300]` | `DUSK_REEF[600]` |
| inverse | `white` | `ABYSS[500]` |
| **Border** |||
| default | `SLATE[300]` | `SLATE[600]` |
| subtle | `ABYSS[100]` | `ABYSS[800]` |
| strong | `ABYSS[300]` | `ABYSS[600]` |

## Status Exceptions

Status colors shift 1 step lighter (not inverted):

| Token | Light | Dark |
|-------|-------|------|
| error | `CORAL[500]` | `CORAL[400]` |
| success | `HARBOR[500]` | `HARBOR[400]` |
| warning | `SUNRISE[500]` | `SUNRISE[400]` |

## Figma Variables

**Tier 1 (Primitives):** Raw hex values, no modes
**Tier 2 (Alias):** Semantic tokens with Light/Dark columns

```
Collection: "Colors"
├── Modes: [Light] [Dark]
├── Background/Page → Light: cream | Dark: Abyss/900
├── Text/Primary    → Light: Abyss/500 | Dark: Slate/100
└── Border/Default  → Light: Slate/300 | Dark: Slate/600
```

## Decision

| Token Type | Rule |
|------------|------|
| Background | Invert (50↔900) |
| Text on dark | Light values (100-300) |
| Text on light | Dark values (500-700) |
| Status | Shift 1 step lighter |
| Border | Invert (300↔600) |

## Anti-Pattern

```tsx
// ❌ Hardcoded: isDark ? '#0C0D12' : '#FBFBF3'
// ✅ Token: var(--background-page)
```
