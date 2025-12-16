# Rounded Corners Rules

**Agent-only. Apply to all border-radius decisions.**

---

## MANDATORY: Use Design Tokens (CRITICAL)

**NEVER use hardcoded pixel values. ALWAYS use tokens.**

```tsx
// ❌ WRONG: Hardcoded values
<div style={{ borderRadius: '12px' }}>
<div className="rounded-[12px]">

// ✅ CORRECT: Tailwind with DDS preset
<div className="rounded-md">           // 12px

// ✅ CORRECT: Inline styles with tokens
import { RADIUS } from '../constants/designTokens';
<div style={{ borderRadius: RADIUS.md }}>  // 12px
```

---

## Token Reference

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| `none` | 0px | `rounded-none` | Sharp corners |
| `xs` | 4px | `rounded-xs` | Small badges, chips |
| `sm` | 8px | `rounded-sm` / `rounded` | Buttons, inputs |
| `md` | 12px | `rounded-md` | Cards, dialogs |
| `lg` | 16px | `rounded-lg` | Large cards, modals |
| `xl` | 20px | `rounded-xl` | Hero sections |
| `2xl` | 24px | `rounded-2xl` | Feature cards |
| `3xl` | 32px | `rounded-3xl` | Full-width sections |
| `full` | 9999px | `rounded-full` | Pills, avatars |

---

## Nested Corner Formula (CRITICAL)

**Inner Radius + Padding = Outer Radius**

```
┌─────────────────────────────────────┐
│ OUTER (20px = xl)                   │
│   ┌─────────────────────────────┐   │
│   │ 8px padding                 │   │
│   │   ┌─────────────────────┐   │   │
│   │   │ INNER (12px = md)   │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘

Formula: Inner (md/12px) + Padding (sm/8px) = Outer (xl/20px)
```

### Why This Matters

Without this rule, nested corners look misaligned:
```
❌ BAD: Same radius on both = inner corners look "pinched"
✅ GOOD: Outer larger by padding amount = smooth, consistent curve
```

### Common Pairings

| Inner | Padding | Outer | Example |
|-------|---------|-------|---------|
| `xs` (4px) | `xs` (4px) | `sm` (8px) | Badge in chip |
| `xs` (4px) | `sm` (8px) | `md` (12px) | Chip in card |
| `sm` (8px) | `xs` (4px) | `md` (12px) | Button in container |
| `sm` (8px) | `sm` (8px) | `lg` (16px) | Input in form card |
| `md` (12px) | `sm` (8px) | `xl` (20px) | Card in section |
| `md` (12px) | `md` (12px) | `2xl` (24px) | Dialog in overlay |
| `lg` (16px) | `sm` (8px) | `2xl` (24px) | Large card in container |
| `xl` (20px) | `md` (12px) | `3xl` (32px) | Hero in page wrapper |

---

## Code Examples

### Nested Cards
```tsx
// Outer container: xl (20px), padding: sm (8px)
// Inner card: md (12px)
// 12 + 8 = 20 ✓

<div className="rounded-xl p-2">           {/* outer: 20px, padding: 8px */}
  <div className="rounded-md p-4">         {/* inner: 12px */}
    Content here
  </div>
</div>
```

### Button in Container
```tsx
// Container: md (12px), padding: xs (4px)
// Button: sm (8px)
// 8 + 4 = 12 ✓

<div className="rounded-md p-1 bg-slate-100">
  <button className="rounded-sm px-4 py-2">
    Click me
  </button>
</div>
```

### Modal with Header
```tsx
// Modal: lg (16px), padding: 0 (header flush)
// Header section: use rounded-t-lg to match
// Content area: no top rounding, rounded-b-lg at bottom

<div className="rounded-lg overflow-hidden">
  <div className="bg-slate-50 p-4">Header</div>
  <div className="p-6">Content</div>
</div>
```

---

## Decision Tree

```
Need border-radius? Ask:

1. Is this a PILL or AVATAR?
   → Use `full` (9999px)

2. Is this a SMALL element (badge, tag, chip)?
   → Use `xs` (4px) or `sm` (8px)

3. Is this a BUTTON or INPUT?
   → Use `sm` (8px)

4. Is this a CARD or DIALOG?
   → Use `md` (12px) or `lg` (16px)

5. Is this a SECTION or HERO?
   → Use `xl` (20px) or `2xl` (24px)

6. Is this element NESTED inside another rounded element?
   → Apply the formula: Inner + Padding = Outer
```

---

## Anti-Patterns

```tsx
// ❌ WRONG: Hardcoded values
<div style={{ borderRadius: '10px' }}>     // Not on scale!
<div className="rounded-[14px]">           // Arbitrary!

// ❌ WRONG: Same radius on nested elements
<div className="rounded-lg p-4">           // 16px
  <div className="rounded-lg">             // 16px - inner looks pinched!
  </div>
</div>

// ✅ CORRECT: Apply nested formula
<div className="rounded-2xl p-2">          // 24px outer, 8px padding
  <div className="rounded-lg">             // 16px inner (16 + 8 = 24) ✓
  </div>
</div>

// ❌ WRONG: Inconsistent rounding direction
<div className="rounded-tl-lg rounded-br-md">  // Asymmetric without purpose

// ✅ CORRECT: Symmetric or purposeful
<div className="rounded-lg">               // All corners same
<div className="rounded-t-lg">             // Top only (for headers)
```

---

## Special Cases

### Cards with Headers
When a card has a distinct header section:
```tsx
<div className="rounded-lg overflow-hidden">
  <div className="rounded-t-lg bg-slate-50">Header</div>
  <div>Content (no rounding needed)</div>
</div>
```

### Inputs in Forms
```tsx
// Form container and input should follow the formula
<div className="rounded-md p-1 border">    // 12px container, 4px padding
  <input className="rounded-sm w-full" />  // 8px input (8 + 4 = 12) ✓
</div>
```

### Overlays/Modals
```tsx
// Backdrop has no radius, modal does
<div className="fixed inset-0 bg-black/50">           {/* backdrop */}
  <div className="rounded-xl max-w-md mx-auto mt-20"> {/* modal */}
    Content
  </div>
</div>
```

---

## Tailwind Class Reference

```
rounded-none  = 0px    rounded-xl   = 20px
rounded-xs    = 4px    rounded-2xl  = 24px
rounded-sm    = 8px    rounded-3xl  = 32px
rounded       = 8px    rounded-full = 9999px
rounded-md    = 12px
rounded-lg    = 16px
```

### Per-Corner Classes
```
rounded-t-*   = top corners only
rounded-b-*   = bottom corners only
rounded-l-*   = left corners only
rounded-r-*   = right corners only
rounded-tl-*  = top-left only
rounded-tr-*  = top-right only
rounded-bl-*  = bottom-left only
rounded-br-*  = bottom-right only
```
