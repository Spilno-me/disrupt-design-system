# Spacing Rules - Hierarchical System

**Agent-only. Apply to all layout decisions.**

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
// ❌ WRONG: Arbitrary values
<div style={{ padding: '13px' }}>    // Not on scale
<div className="gap-[22px]">         // Arbitrary

// ❌ WRONG: Same spacing everywhere
<div className="space-y-4">
  <Title />      // 16px - too much for title→subtitle
  <Subtitle />   // 16px - OK
  <Content />    // 16px - too little for content separation
</div>

// ✅ CORRECT: Hierarchical
<div>
  <Title className="mb-2" />     // 8px - tight
  <Subtitle className="mb-6" />  // 24px - comfortable
  <Content />
</div>
```

---

## MDX Documentation Spacing

For Storybook MDX files:

```jsx
// Hero to content
marginBottom: '48px'    // 48px after hero sections

// Between major sections
marginBottom: '48px'    // Use --- markdown separator

// Within sections
marginBottom: '32px'    // Between component showcases
marginBottom: '24px'    // Between related content
marginBottom: '16px'    // Between list items

// Card grids
gap: '20px'            // Standard card gap
gap: '16px'            // Compact card gap
gap: '24px'            // Spacious card gap

// Internal card padding
padding: '24px'        // Standard cards
padding: '20px'        // Compact cards
padding: '32px'        // Feature/hero cards
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
