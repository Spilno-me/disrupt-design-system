# Typography Rules

**Two fonts: Fixel (UI) + JetBrains Mono (code)**

| Font | Tailwind | Use |
|------|----------|-----|
| Fixel | `font-sans` | All UI |
| JetBrains | `font-mono` | Code, tokens, IDs |

**FORBIDDEN:** `font-serif`, `font-display`, any other

## `font-mono` Only For

Code snippets, token paths (`GRADIENTS.heroOverlay`), technical IDs (`TXN-2024-00123`), API responses, timestamps

## Scale

| Role | Size | Weight | Tailwind |
|------|------|--------|----------|
| Page Title | 24 | 600 | `text-2xl font-semibold` |
| Section Title | 18 | 600 | `text-lg font-semibold` |
| Card Title | 16 | 600 | `text-base font-semibold` |
| Body | 14 | 400 | `text-sm` |
| Body Emphasis | 14 | 500 | `text-sm font-medium` |
| Code | 14 | 400 | `font-mono text-sm` |
| Caption | 12 | 400 | `text-xs` |
| Overline | 11 | 500 | `text-[11px] font-medium uppercase tracking-wide` |

## Golden Rules

1. **Hierarchy:** Important = Larger+Bolder
2. **Max 3-4 sizes** per view
3. **Weight for emphasis**, not size
4. **Line length:** 45-75 chars optimal

## Colors

| Element | Token | Tailwind |
|---------|-------|----------|
| Primary | `ABYSS[500]` | `text-primary` |
| Secondary | `ABYSS[400]` | `text-secondary` |
| Muted | `DUSK_REEF[500]` | `text-muted` |
| Disabled | `DUSK_REEF[300]` | `text-disabled` |
| Link | `DEEP_CURRENT[500]` | `text-link` |
| Error | `CORAL[500]` | `text-error` |
| Success | `HARBOR[500]` | `text-success` |

## Weights

| Weight | Value | Use |
|--------|-------|-----|
| Normal | 400 | Body, descriptions |
| Medium | 500 | Labels, navigation |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Extreme emphasis only |

## Spacing

| Relationship | Class |
|--------------|-------|
| Title→Subtitle | `mt-1` |
| Title→Body | `mt-2` |
| Paragraph→Paragraph | `mt-4` |
| Section→Section | `mt-6`/`mt-8` |

## Line Height

| Use | Tailwind |
|-----|----------|
| Headings | `leading-tight` |
| UI elements | `leading-snug` |
| Body | `leading-normal` |
| Long-form | `leading-relaxed` |

## A11y

- Min 12px (`text-xs`)
- Body min 14px
- Contrast: 4.5:1 normal, 3:1 large (18px+)

## Quick Ref

```
PAGE_TITLE:    text-2xl font-semibold text-primary
SECTION:       text-lg font-semibold text-primary
CARD_TITLE:    text-base font-semibold text-primary
BODY:          text-sm text-primary
LABEL:         text-sm font-medium text-primary
CAPTION:       text-xs text-muted
TABLE_HEADER:  text-xs font-medium text-muted uppercase tracking-wide
CODE:          font-mono text-sm
```
