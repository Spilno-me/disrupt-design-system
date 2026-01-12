# Color Format Rule - ALWAYS Use oklch()

**Date:** 2025-12-13
**Rule:** All color definitions in design tokens MUST use oklch() format

---

## 🎯 The Rule

**When defining colors in `src/styles/tokens.css` or `src/constants/designTokens.ts`:**

```css
/* ❌ WRONG: Hex format */
--ring: #2563EB;
--color-focus: #08A4BD;

/* ❌ WRONG: RGB format */
--ring: rgb(37, 99, 235);
--color-focus: rgb(8, 164, 189);

/* ✅ CORRECT: oklch format */
--ring: oklch(0.533 0.195 264.05);
--color-focus: oklch(0.533 0.195 264.05);
```

---

## 📐 oklch Format

```
oklch(L C H)
      │ │ │
      │ │ └─ Hue (0-360) - Which color (0=red, 120=green, 240=blue)
      │ └─── Chroma - Saturation/vividness (0=gray, higher=vibrant)
      └───── Lightness (0-1) - 0=black, 0.5=medium, 1=white
```

**Examples:**
```css
/* Dark blue (#2563EB) */
oklch(0.533 0.195 264.05)
      │     │     │
      │     │     └─ Blue hue
      │     └─────── Vibrant (high chroma)
      └───────────── Medium-dark (53% lightness)

/* Teal (#08A4BD) */
oklch(0.628 0.084 211.38)

/* Red (#EF4444) */
oklch(0.577 0.245 27.325)
```

---

## 🔄 How to Convert Hex to oklch

### Option 1: Online Tool
1. Go to: https://oklch.com/
2. Enter hex: `#2563EB`
3. Copy oklch value: `oklch(0.533 0.195 264.05)`

### Option 2: Browser DevTools
1. Open DevTools → Elements
2. Find element with color
3. Click color swatch
4. Switch to "oklch" format
5. Copy value

### Option 3: Ask AI
```
"Convert #2563EB to oklch"
→ oklch(0.533 0.195 264.05)
```

---

## 💡 Why oklch?

### 1. Perceptually Uniform
**Problem with hex:**
```css
--blue-500: #3B82F6;   /* Looks bright */
--red-500: #EF4444;    /* Looks BRIGHTER (even at same "500") */
```

**Solution with oklch:**
```css
--blue-500: oklch(0.6 0.195 264);  /* 60% lightness */
--red-500: oklch(0.6 0.22 25);     /* 60% lightness - SAME brightness */
```

### 2. Better Color Scales
**Easy to create scales - just adjust L:**
```css
/* Light to dark - just change first number */
--color-100: oklch(0.95 0.1 264);  /* 95% lightness */
--color-300: oklch(0.8 0.12 264);  /* 80% lightness */
--color-500: oklch(0.6 0.15 264);  /* 60% lightness */
--color-700: oklch(0.4 0.15 264);  /* 40% lightness */
--color-900: oklch(0.2 0.1 264);   /* 20% lightness */
```

### 3. Accessible Contrast (WCAG)
**Easier to calculate contrast ratios:**
```css
--text: oklch(0.2 0 0);    /* 20% lightness */
--bg: oklch(0.98 0 0);     /* 98% lightness */

/* Contrast ≈ 0.98 / 0.2 = ~4.9:1 (WCAG AA compliant) */
```

### 4. Wider Color Gamut
```css
/* oklch can represent colors hex can't (Display P3) */
oklch(0.6 0.35 264);  /* More vibrant than any hex blue */
```

### 5. Consistent with Design System
**Your tokens.css already uses oklch everywhere:**
```css
--border: oklch(0.922 0 0);
--destructive: oklch(0.577 0.245 27.325);
--accent: oklch(0.97 0 0);
--ring: oklch(0.533 0.195 264.05);  /* Now consistent! */
```

---

## 📋 Agent Checklist

When changing colors:

- [ ] Check existing format in tokens.css (it's oklch)
- [ ] Convert hex to oklch (use oklch.com or ask AI)
- [ ] Use oklch() format: `oklch(L C H)`
- [ ] Add comment with hex equivalent: `/* #2563EB */`
- [ ] Verify consistency with other colors in file

---

## 🚫 Common Mistakes

```css
/* ❌ WRONG: Mixed formats */
--blue: #2563EB;              /* Hex */
--red: oklch(0.577 0.245 27); /* oklch */
/* Problem: Inconsistent! */

/* ✅ CORRECT: All oklch */
--blue: oklch(0.533 0.195 264.05);  /* #2563EB */
--red: oklch(0.577 0.245 27.325);   /* #EF4444 */
```

---

## 📚 Resources

- **oklch.com** - Hex to oklch converter
- **MDN** - https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- **Why oklch** - https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl

---

**Last Updated:** 2025-12-13
**Status:** Mandatory for all color definitions in tokens
