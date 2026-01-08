# Fix iOS Safari Compatibility



**Category:** ux | **Tags:** ios, safari, mobile, compatibility, safe-area
**Variables:** `{COMPONENT}`

---

Fix iOS Safari compatibility issues in {COMPONENT}.

READ FIRST: `src/stories/developers/BrowserCompatibility.mdx`

## iOS Safari Common Issues

| Issue | Problem | Fix |
|-------|---------|-----|
| **100vh** | Excludes Safari UI | Use `dvh` or `min-h-[100dvh]` |
| **Safe Area** | Content under notch | Use `safe-area-inset-*` |
| **Momentum Scroll** | Janky overflow | `-webkit-overflow-scrolling: touch` |
| **Input Zoom** | Font <16px triggers zoom | Min font-size 16px |
| **Position Fixed** | Breaks with keyboard | Use absolute or transform |

## Viewport Height Units

```css
/* ❌ Broken - doesn't account for Safari UI */
height: 100vh;

/* ✅ Fixed - dynamic viewport height */
height: 100dvh;
min-height: 100dvh;
```

```tsx
// Tailwind classes
<div className="min-h-[100dvh]">  {/* Dynamic */}
<div className="min-h-[100svh]">  {/* Small - keyboard up */}
<div className="min-h-[100lvh]">  {/* Large - keyboard down */}
```

## Safe Area Utilities

```tsx
// Bottom navigation - avoid home indicator
<nav className="pb-[env(safe-area-inset-bottom)]">

// Fullscreen modal - avoid notch
<div className="
  pt-[env(safe-area-inset-top)]
  pb-[env(safe-area-inset-bottom)]
  pl-[env(safe-area-inset-left)]
  pr-[env(safe-area-inset-right)]
">
```

## iOS 26+ "Liquid Glass" Issues

```tsx
// ❌ Colors may render incorrectly
<div className="bg-[#FF0000]">

// ✅ Use CSS variables for reliable colors
<div className="bg-error">  {/* Semantic token */}
```

## Testing Checklist

| Device | Check |
|--------|-------|
| iPhone notch | Content not clipped |
| iPhone Dynamic Island | Header visible |
| iPad | Landscape safe areas |
| iOS keyboard | Input fields accessible |
| Portrait → Landscape | Layout reflows correctly |

## Quick Fixes

```tsx
// Prevent input zoom
<input className="text-base" />  {/* 16px minimum */}

// Fix sticky header in Safari
<header className="sticky top-0 z-50 transform-gpu">

// Smooth scrolling container
<div className="overflow-y-auto -webkit-overflow-scrolling-touch">
```

## Output
- Fixed viewport heights
- Safe area insets applied
- Input font sizes ≥16px
- Tested on iOS Safari

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
