# Typography Rules - App UI Hierarchy

**Agent-only. Apply to all app UI typography decisions.**

---

## Font System

**Two fonts allowed: Fixel (UI) + JetBrains Mono (code/technical)**

| Font | Tailwind | Use |
|------|----------|-----|
| **Fixel** | `font-sans` | All UI text - headings, body, labels |
| **JetBrains Mono** | `font-mono` | Code snippets, token paths, technical IDs |

```tsx
// ✅ CORRECT - Fixel for UI
<h1 className="text-2xl font-semibold">Dashboard</h1>
<p className="text-sm">Description text</p>

// ✅ CORRECT - JetBrains Mono for code/technical
<code className="font-mono text-sm">GRADIENTS.heroOverlay</code>
<span className="font-mono text-xs">TXN-2024-00123</span>
<pre className="font-mono text-sm">const x = 1;</pre>
```

### `font-mono` Allowed ONLY For:
| Use Case | Example |
|----------|---------|
| Code snippets | `const x = 1;` |
| Token paths | `GRADIENTS.heroOverlay` |
| Technical IDs | `TXN-2024-00123` |
| API responses | `{ "status": "ok" }` |
| Timestamps (tabular) | `14:32:05` |

### ⛔ FORBIDDEN Fonts
| Font | Status |
|------|--------|
| `font-serif` | ⛔ Never use |
| `font-display` | ⛔ Website only, not app |
| Any other font | ⛔ Do not import |

```tsx
// ❌ WRONG - font-mono for non-code content
<h1 className="font-mono">Dashboard</h1>
<label className="font-mono">Email</label>
<p className="font-mono">Description text</p>
```

---

## MANDATORY: Use Design Tokens (CRITICAL)

**NEVER hardcode font sizes. ALWAYS use Tailwind classes from the preset.**

```tsx
// ❌ WRONG: Hardcoded values
<h1 style={{ fontSize: '24px' }}>Title</h1>
<p style={{ fontSize: '14px' }}>Text</p>

// ✅ CORRECT: Tailwind classes
<h1 className="text-2xl font-semibold">Title</h1>
<p className="text-sm">Text</p>
```

---

## The Golden Rules of UI Typography

### 1. Visual Hierarchy = Information Hierarchy

```
RULE: Most important → Largest & Boldest
      Least important → Smallest & Lightest
```

### 2. Maximum 3-4 Sizes Per View

```
❌ BAD: 8 different font sizes on one page
✅ GOOD: Title (24px) → Section (18px) → Body (14px) → Caption (12px)
```

### 3. Weight Creates Emphasis, Not Size

```
❌ BAD: Making labels bigger to stand out
✅ GOOD: Using font-semibold on same-size text
```

### 4. Line Length = Readability

```
Optimal: 45-75 characters per line
Desktop body text: max-w-prose (65ch)
```

---

## App Typography Scale

| Role | Size | Weight | Tailwind | Use Case |
|------|------|--------|----------|----------|
| **Page Title** | 24px | 600 | `text-2xl font-semibold` | Top-level page headings |
| **Section Title** | 18px | 600 | `text-lg font-semibold` | Section headings, modal titles |
| **Card Title** | 16px | 600 | `text-base font-semibold` | Card headers, subsections |
| **Body** | 14px | 400 | `text-sm` | Primary content, descriptions |
| **Body Emphasis** | 14px | 500 | `text-sm font-medium` | Labels, important body text |
| **Code** | 14px | 400 | `font-mono text-sm` | Code snippets, token paths |
| **Caption** | 12px | 400 | `text-xs` | Metadata, help text, timestamps |
| **Code Small** | 12px | 400 | `font-mono text-xs` | Inline code, technical IDs |
| **Overline** | 11px | 500 | `text-[11px] font-medium uppercase tracking-wide` | Category labels, badges |

---

## Component Patterns

### Page Header
```tsx
<header className="mb-8">
  <h1 className="text-2xl font-semibold text-primary">
    Dashboard
  </h1>
  <p className="text-sm text-secondary mt-1">
    Your environmental metrics at a glance
  </p>
</header>
```

### Card
```tsx
<div className="bg-surface rounded-md p-4">
  <h3 className="text-base font-semibold text-primary">
    Card Title
  </h3>
  <p className="text-sm text-secondary mt-2">
    Description or content goes here.
  </p>
  <span className="text-xs text-muted mt-3 block">
    Last updated 2 hours ago
  </span>
</div>
```

### Form Field
```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-primary">
    Email Address
  </label>
  <input className="text-sm" />
  <p className="text-xs text-muted">
    We'll never share your email with anyone.
  </p>
</div>
```

### Data Table
```tsx
<table>
  <thead>
    <tr>
      <th className="text-xs font-medium text-muted uppercase tracking-wide">
        Name
      </th>
      <th className="text-xs font-medium text-muted uppercase tracking-wide">
        Status
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-sm text-primary font-medium">John Doe</td>
      <td className="text-sm text-secondary">Active</td>
    </tr>
  </tbody>
</table>
```

### Empty State
```tsx
<div className="text-center py-12">
  <Icon className="w-12 h-12 text-muted mx-auto mb-4" />
  <h3 className="text-base font-semibold text-primary">
    No results found
  </h3>
  <p className="text-sm text-secondary mt-1 max-w-sm mx-auto">
    Try adjusting your search or filters to find what you're looking for.
  </p>
</div>
```

### List Item
```tsx
<div className="flex items-center gap-3 py-3">
  <Avatar className="w-10 h-10" />
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-primary truncate">
      Primary text
    </p>
    <p className="text-xs text-muted truncate">
      Secondary text
    </p>
  </div>
  <span className="text-xs text-muted">
    2h ago
  </span>
</div>
```

### Stat/Metric
```tsx
<div>
  <span className="text-xs font-medium text-muted uppercase tracking-wide">
    Total Revenue
  </span>
  <p className="text-2xl font-semibold text-primary mt-1">
    $45,231
  </p>
  <span className="text-xs text-success">
    +12.5% from last month
  </span>
</div>
```

---

## Weight Usage Guide

| Weight | Value | Tailwind | Use For |
|--------|-------|----------|---------|
| **Normal** | 400 | `font-normal` | Body text, descriptions, paragraphs |
| **Medium** | 500 | `font-medium` | Labels, emphasized body, navigation |
| **Semibold** | 600 | `font-semibold` | Headings, titles, buttons |
| **Bold** | 700 | `font-bold` | Rare - only for extreme emphasis |

### Weight Hierarchy Example
```
Page Title:    font-semibold (600)
Section Title: font-semibold (600)
Card Title:    font-semibold (600)
Label:         font-medium (500)
Body:          font-normal (400)
Caption:       font-normal (400)
```

---

## Color Combinations

| Element | Color Token | Tailwind |
|---------|-------------|----------|
| Primary text | `ABYSS[500]` | `text-primary` |
| Secondary text | `ABYSS[400]` | `text-secondary` |
| Muted/caption | `DUSK_REEF[500]` | `text-muted` |
| Disabled | `DUSK_REEF[300]` | `text-disabled` |
| Link | `DEEP_CURRENT[500]` | `text-link` |
| Error | `CORAL[500]` | `text-error` |
| Success | `HARBOR[500]` | `text-success` |

---

## Line Height Reference

| Use Case | Line Height | Tailwind |
|----------|-------------|----------|
| Headings | 1.25 | `leading-tight` |
| UI elements (buttons, labels) | 1.25-1.375 | `leading-tight` / `leading-snug` |
| Body text | 1.5 | `leading-normal` |
| Long-form content | 1.625 | `leading-relaxed` |

---

## Spacing Between Text Elements

| Relationship | Spacing | Tailwind |
|--------------|---------|----------|
| Title → Subtitle | 4px | `mt-1` |
| Title → Body | 8px | `mt-2` |
| Paragraph → Paragraph | 16px | `mt-4` / `space-y-4` |
| Section → Section | 24-32px | `mt-6` / `mt-8` |

---

## Anti-Patterns

```tsx
// ❌ WRONG: Too many font sizes
<h1 className="text-3xl">...</h1>
<h2 className="text-xl">...</h2>
<h3 className="text-lg">...</h3>
<h4 className="text-base">...</h4>
<p className="text-sm">...</p>
<span className="text-xs">...</span>
<small className="text-[10px]">...</small>  // 7 different sizes!

// ✅ CORRECT: Consistent scale (3-4 sizes)
<h1 className="text-2xl font-semibold">...</h1>   // 24px
<h2 className="text-lg font-semibold">...</h2>    // 18px
<p className="text-sm">...</p>                     // 14px
<span className="text-xs text-muted">...</span>   // 12px

// ❌ WRONG: Using size for emphasis
<span className="text-lg">Important!</span>

// ✅ CORRECT: Using weight for emphasis
<span className="text-sm font-semibold">Important!</span>

// ❌ WRONG: Bold everywhere
<p className="font-bold">Lorem ipsum dolor sit amet...</p>
<p className="font-bold">Consectetur adipiscing elit...</p>

// ✅ CORRECT: Normal weight for body, bold for emphasis
<p>Lorem ipsum <strong>dolor sit amet</strong>...</p>
<p>Consectetur adipiscing elit...</p>

// ❌ WRONG: Using display font in app UI
<h1 className="font-display">Dashboard</h1>

// ✅ CORRECT: Fixel for app UI
<h1 className="font-sans text-2xl font-semibold">Dashboard</h1>
```

---

## Decision Tree

```
Need typography? Ask:

1. What LEVEL of importance?
   - Page level     → text-2xl font-semibold
   - Section level  → text-lg font-semibold
   - Component level → text-base font-semibold
   - Supporting     → text-sm
   - Metadata       → text-xs text-muted

2. Does it need EMPHASIS?
   - Heading/title  → font-semibold
   - Label          → font-medium
   - Body text      → font-normal

3. What COLOR conveys the meaning?
   - Primary content → text-primary
   - Secondary info  → text-secondary
   - Help/caption    → text-muted
   - Status         → text-error/success/warning
```

---

## Accessibility Requirements

| Criterion | Requirement |
|-----------|-------------|
| Minimum size | 12px (text-xs) - never smaller |
| Body text minimum | 14px (text-sm) recommended |
| Touch target text | 14px+ for clickable text |
| Contrast ratio | 4.5:1 for normal text, 3:1 for large (18px+) |
| Line length | Max 80 characters, optimal 45-75 |

---

## Responsive Considerations

```tsx
// Page titles can scale down on mobile
<h1 className="text-xl md:text-2xl font-semibold">
  Dashboard
</h1>

// Body text stays consistent
<p className="text-sm">  // Always 14px
  Content here
</p>

// Never go below text-xs (12px) on any device
<span className="text-xs">  // Minimum size
  Caption
</span>
```

---

## Quick Reference

```
PAGE TITLE:     text-2xl font-semibold text-primary
SECTION TITLE:  text-lg font-semibold text-primary
CARD TITLE:     text-base font-semibold text-primary
BODY:           text-sm text-primary (or text-secondary)
LABEL:          text-sm font-medium text-primary
CAPTION:        text-xs text-muted
TABLE HEADER:   text-xs font-medium text-muted uppercase tracking-wide
BUTTON:         text-sm font-medium
BADGE:          text-xs font-medium
CODE BLOCK:     font-mono text-sm
INLINE CODE:    font-mono text-xs
TOKEN PATH:     font-mono text-xs text-muted
```
