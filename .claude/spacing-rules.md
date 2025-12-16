# Spacing Rules - Hierarchical System

**Agent-only. Apply to all layout decisions.**

---

## MANDATORY: Use Design Tokens (CRITICAL)

**NEVER use hardcoded pixel values. ALWAYS use tokens from `designTokens.ts`.**

```tsx
// ❌ WRONG: Hardcoded values
<div style={{ marginTop: '32px', marginBottom: '24px' }}>

// ✅ CORRECT: Design tokens
import { SPACING } from '../constants/designTokens';
<div style={{ marginTop: SPACING.px.spacious, marginBottom: SPACING.px.comfortable }}>
```

### Token Reference for Inline Styles (`SPACING.px`)

| Token | Value | Use Case |
|-------|-------|----------|
| `SPACING.px.micro` | 4px | Icon-to-text, inline |
| `SPACING.px.tight` | 8px | Label + input |
| `SPACING.px.base` | 16px | Within component |
| `SPACING.px.comfortable` | 24px | Between components |
| `SPACING.px.spacious` | 32px | Between sections |
| `SPACING.px.section` | 48px | Major page sections |
| `SPACING.px.page` | 96px | Hero, footer |

### Semantic Aliases

| Token | Value | Use Case |
|-------|-------|----------|
| `SPACING.px.sectionHeadingTop` | 32px | Gap after separator |
| `SPACING.px.sectionHeadingBottom` | 24px | Gap to content |
| `SPACING.px.cardGap` | 20px | Between cards |
| `SPACING.px.cardGapCompact` | 16px | Compact grids |
| `SPACING.px.cardPadding` | 24px | Internal card padding |
| `SPACING.px.gridGap` | 16px | Standard grid gap |

---

## Base Unit: 4px

All spacing derives from 4px. Never use arbitrary values.

```
Scale: 4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64 → 80 → 96
```

---

## Spacing Hierarchy

| Level | Size | Tailwind | Use Case |
|-------|------|----------|----------|
| **Micro** | 2-4px | `gap-0.5`, `gap-1` | Icon-to-text, inline elements |
| **Tight** | 6-8px | `gap-1.5`, `gap-2` | Related items in a group (label + input) |
| **Base** | 12-16px | `gap-3`, `gap-4` | Items within a component |
| **Comfortable** | 20-24px | `gap-5`, `gap-6` | Between components in a section |
| **Spacious** | 32-40px | `gap-8`, `gap-10` | Between sections within a page |
| **Section** | 48-64px | `gap-12`, `gap-16` | Major page sections |
| **Page** | 80-96px | `gap-20`, `gap-24` | Hero to content, footer margins |

---

## The Proximity Principle

```
RULE: Related items = LESS space | Unrelated items = MORE space
```

### Visual Example
```
┌─────────────────────────────────────┐
│  Section Title                       │ ← 8px to subtitle
│  Subtitle text here                  │ ← 24px to content
│                                      │
│  ┌─────────┐ 16px ┌─────────┐       │ ← Cards: 16px gap
│  │  Card 1 │      │  Card 2 │       │
│  └─────────┘      └─────────┘       │
│                                      │ ← 48px to next section
├─────────────────────────────────────┤
│  Next Section                        │
└─────────────────────────────────────┘
```

---

## Component-Level Spacing

### Cards
```tsx
// ✅ CORRECT
<Card className="p-6">           // 24px internal padding
  <CardHeader className="pb-4">  // 16px below header
  <CardContent className="pb-4"> // 16px below content
  <CardFooter>                   // No bottom padding (last element)
</Card>

// Card grid gaps
<div className="grid gap-4">     // 16px between cards (related)
<div className="grid gap-6">     // 24px between cards (more breathing room)
```

### Form Elements
```tsx
// Label to input: tight (8px)
<Label className="mb-2">         // 8px below label

// Between form fields: base (16px)
<div className="space-y-4">      // 16px between fields

// Form sections: comfortable (24px)
<fieldset className="space-y-6"> // 24px between field groups
```

### Buttons
```tsx
// Icon to text: micro (8px)
<Button><Icon className="mr-2" />Text</Button>

// Button groups: tight (8-12px)
<div className="flex gap-2">     // 8px for compact
<div className="flex gap-3">     // 12px for standard
```

---

## Section-Level Spacing

### Page Structure
```tsx
// Hero section
<section className="py-24">      // 96px vertical (page level)

// Content sections
<section className="py-16">      // 64px vertical (section level)

// Within sections
<div className="space-y-12">     // 48px between major blocks
<div className="space-y-6">      // 24px between related content
```

### Headers
```tsx
// Page title to description: tight
<h1 className="mb-2">Title</h1>  // 8px

// Description to content: comfortable
<p className="mb-6">Desc</p>     // 24px

// Section title to content: base
<h2 className="mb-4">Section</h2> // 16px
```

---

## Quick Reference Table

| Context | Spacing | Class |
|---------|---------|-------|
| Icon ↔ Text | 8px | `gap-2`, `mr-2` |
| Label ↔ Input | 8px | `mb-2` |
| Input ↔ Input | 16px | `space-y-4` |
| Card ↔ Card | 16-24px | `gap-4`, `gap-6` |
| Title ↔ Subtitle | 8px | `mb-2` |
| Title ↔ Content | 16-24px | `mb-4`, `mb-6` |
| Section ↔ Section | 48-64px | `py-12`, `py-16` |
| Page margins | 24-40px | `px-6`, `px-10` |

---

## Anti-Patterns

```tsx
// ❌ WRONG: Hardcoded pixel values (use tokens!)
<div style={{ marginTop: '32px' }}>  // Use SPACING.px.spacious
<div style={{ gap: '24px' }}>        // Use SPACING.px.comfortable

// ❌ WRONG: Arbitrary values
<div style={{ padding: '13px' }}>    // Not on scale
<div className="gap-[22px]">         // Arbitrary

// ❌ WRONG: Same spacing everywhere
<div className="space-y-4">
  <Title />      // 16px - too much for title→subtitle
  <Subtitle />   // 16px - OK
  <Content />    // 16px - too little for content separation
</div>

// ✅ CORRECT: Use tokens + hierarchical spacing
import { SPACING } from '../constants/designTokens';
<div style={{ marginTop: SPACING.px.spacious }}>  // Token-based
<div>
  <Title className="mb-2" />     // 8px - tight
  <Subtitle className="mb-6" />  // 24px - comfortable
  <Content />
</div>
```

---

## MDX Documentation Spacing

For Storybook MDX files - **ALWAYS use `SPACING.px` tokens**:

```jsx
import { SPACING } from './brand/BrandComponents';
// or: import { SPACING } from '../constants/designTokens';

// Section headings (after --- separator)
<h2 style={{
  marginTop: SPACING.px.sectionHeadingTop,    // 32px
  marginBottom: SPACING.px.sectionHeadingBottom // 24px
}}>

// Hero to content
marginBottom: SPACING.px.section     // 48px

// Between component showcases
marginBottom: SPACING.px.spacious    // 32px

// Between related content
marginBottom: SPACING.px.comfortable // 24px

// Card grids
gap: SPACING.px.cardGap              // 20px - standard
gap: SPACING.px.cardGapCompact       // 16px - compact
gap: SPACING.px.comfortable          // 24px - spacious

// Internal card padding
padding: SPACING.px.cardPadding      // 24px - standard
padding: SPACING.px.base             // 16px - compact
padding: SPACING.px.spacious         // 32px - feature cards
```

---

## Decision Tree

```
Need spacing? Ask:

1. Are items DIRECTLY related (label+input, icon+text)?
   → Use TIGHT (8px)

2. Are items in the SAME group (form fields, card content)?
   → Use BASE (16px)

3. Are items SEPARATE components in same section?
   → Use COMFORTABLE (24px)

4. Are items in DIFFERENT sections?
   → Use SPACIOUS (32-48px)

5. Is this a MAJOR page division (hero, footer)?
   → Use SECTION/PAGE (64-96px)
```

---

## Tailwind Spacing Reference

```
gap-0.5 = 2px   gap-6  = 24px   gap-16 = 64px
gap-1   = 4px   gap-8  = 32px   gap-20 = 80px
gap-2   = 8px   gap-10 = 40px   gap-24 = 96px
gap-3   = 12px  gap-12 = 48px
gap-4   = 16px  gap-14 = 56px
gap-5   = 20px
```
