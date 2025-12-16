---
name: wcag-contrast
description: Use when checking color accessibility, validating contrast ratios, or choosing accessible color combinations.
---

# WCAG Contrast Knowledge

## Quick Reference

| Use Case | Minimum Ratio | WCAG Level |
|----------|---------------|------------|
| Normal text (<18pt) | **4.5:1** | AA |
| Large text (≥18pt or ≥14pt bold) | **3.0:1** | AA |
| UI components & graphics | **3.0:1** | AA |
| Enhanced accessibility | **7.0:1** | AAA |

---

## Understanding Contrast Ratios

### The Formula

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)

Where:
- L1 = relative luminance of lighter color
- L2 = relative luminance of darker color
- Result ranges from 1:1 (identical) to 21:1 (black/white)
```

### Relative Luminance Calculation

```javascript
function getLuminance(r, g, b) {
  // Convert 0-255 to 0-1
  const [rs, gs, bs] = [r, g, b].map(c => c / 255)

  // Apply gamma correction
  const [rL, gL, bL] = [rs, gs, bs].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )

  // Weighted sum (human eye sensitivity)
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL
}

function getContrastRatio(color1, color2) {
  const L1 = getLuminance(...color1) // [r, g, b]
  const L2 = getLuminance(...color2)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}
```

---

## Common Color Combinations

### PASSING Examples ✅

| Foreground | Background | Ratio | Use |
|------------|------------|-------|-----|
| #000000 (black) | #FFFFFF (white) | 21:1 | Any text |
| #1F2937 (gray-800) | #FFFFFF (white) | 14.7:1 | Body text |
| #374151 (gray-700) | #FFFFFF (white) | 10.3:1 | Body text |
| #4B5563 (gray-600) | #FFFFFF (white) | 7.0:1 | Body text (AAA) |
| #6B7280 (gray-500) | #FFFFFF (white) | 4.6:1 | Body text (AA) |
| #FFFFFF (white) | #1E40AF (blue-800) | 8.6:1 | Button text |
| #FFFFFF (white) | #047857 (green-700) | 5.0:1 | Success button |
| #FFFFFF (white) | #B91C1C (red-700) | 5.8:1 | Error button |

### FAILING Examples ❌

| Foreground | Background | Ratio | Problem |
|------------|------------|-------|---------|
| #9CA3AF (gray-400) | #FFFFFF (white) | 2.9:1 | Too light for text |
| #D1D5DB (gray-300) | #FFFFFF (white) | 1.6:1 | Nearly invisible |
| #3B82F6 (blue-500) | #FFFFFF (white) | 3.2:1 | Fails AA for small text |
| #10B981 (green-500) | #FFFFFF (white) | 2.4:1 | Too light |
| #EF4444 (red-500) | #FFFFFF (white) | 3.0:1 | Borderline, fails AA text |

---

## Safe Defaults by Background

### On White/Light Backgrounds

```
TEXT:
  ✅ Primary text: gray-800 to gray-900 (10:1+)
  ✅ Secondary text: gray-600 to gray-700 (5:1+)
  ⚠️ Tertiary text: gray-500 (4.6:1, minimum AA)
  ❌ Placeholder: gray-400 (2.9:1, FAILS)

SOLUTION for placeholders:
  Use gray-500 (#6B7280) not gray-400
```

### On Dark Backgrounds (gray-800+)

```
TEXT:
  ✅ Primary: white (14:1+)
  ✅ Secondary: gray-300 (8:1+)
  ✅ Tertiary: gray-400 (5:1+)
  ❌ Muted: gray-500 (3.2:1, FAILS for small text)
```

### On Brand Colors

```
BLUE BACKGROUNDS:
  blue-600 (#2563EB) + white = 4.5:1 ✅ (barely AA)
  blue-700 (#1D4ED8) + white = 5.9:1 ✅
  blue-800 (#1E40AF) + white = 8.6:1 ✅

GREEN BACKGROUNDS:
  green-600 (#059669) + white = 3.7:1 ❌ (use green-700)
  green-700 (#047857) + white = 5.0:1 ✅

RED BACKGROUNDS:
  red-600 (#DC2626) + white = 4.1:1 ❌ (use red-700)
  red-700 (#B91C1C) + white = 5.8:1 ✅
```

---

## UI Component Contrast (3:1)

For non-text UI elements:

```
BORDERS:
  ✅ gray-300 on white = 1.6:1 ❌ (too subtle)
  ✅ gray-400 on white = 2.9:1 ⚠️ (borderline)
  ✅ gray-500 on white = 4.6:1 ✅

ICONS:
  Follow same rules as large text (3:1 minimum)
  gray-500 on white = 4.6:1 ✅

FOCUS RINGS:
  Blue-500 on white = 3.2:1 ✅ (meets 3:1 for UI)
```

---

## Practical Guidelines

### Text on Solid Backgrounds

```typescript
// Light backgrounds
className="bg-white text-gray-900"        // 14.7:1 ✅
className="bg-gray-50 text-gray-800"      // 12.6:1 ✅
className="bg-gray-100 text-gray-700"     // 8.1:1 ✅

// Dark backgrounds
className="bg-gray-900 text-white"        // 14.7:1 ✅
className="bg-gray-800 text-gray-100"     // 11.7:1 ✅

// Brand backgrounds (verify contrast!)
className="bg-blue-700 text-white"        // 5.9:1 ✅
className="bg-green-700 text-white"       // 5.0:1 ✅
className="bg-red-700 text-white"         // 5.8:1 ✅
```

### Form Elements

```typescript
// Input text (must be 4.5:1)
className="text-gray-900"                 // ✅

// Placeholder (often fails!)
className="placeholder:text-gray-500"     // 4.6:1 ✅
// NOT: placeholder:text-gray-400         // 2.9:1 ❌

// Labels
className="text-gray-700"                 // 7.0:1 ✅

// Help text
className="text-gray-600"                 // 5.0:1 ✅
```

### Disabled States

```typescript
// Disabled elements are EXEMPT from contrast requirements
// BUT should still be distinguishable
className="disabled:text-gray-400 disabled:opacity-50"
```

---

## Testing Tools

### Programmatic

```javascript
// Use in CI/validation scripts
function checkContrast(fg, bg) {
  const ratio = getContrastRatio(hexToRgb(fg), hexToRgb(bg))
  return {
    ratio: ratio.toFixed(2),
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaa: ratio >= 7.0,
  }
}
```

### Browser DevTools

1. Chrome: Inspect element → Color picker → Shows contrast ratio
2. Firefox: Accessibility Inspector → Check contrast
3. axe DevTools extension: Full page audit

### Online Tools

- WebAIM Contrast Checker
- Colour Contrast Analyser
- Stark (Figma plugin)

---

## Color Matrix Integration

Your `.claude/contrast-matrix.json` should pre-calculate ratios:

```json
{
  "white": {
    "gray-900": { "ratio": 14.7, "aa": true, "aaa": true },
    "gray-800": { "ratio": 10.3, "aa": true, "aaa": true },
    "gray-700": { "ratio": 7.0, "aa": true, "aaa": true },
    "gray-600": { "ratio": 5.0, "aa": true, "aaa": false },
    "gray-500": { "ratio": 4.6, "aa": true, "aaa": false },
    "gray-400": { "ratio": 2.9, "aa": false, "aaa": false },
  }
}
```

Agent can look up ratios instantly instead of calculating.
