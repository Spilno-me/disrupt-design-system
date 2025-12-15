# Storybook Rules

**Agent-only. Enforce on all story edits.**

---

## CRITICAL: MDX Paragraph Wrapping Bug

**This cost hours of debugging. NEVER FORGET.**

### The Problem
MDX automatically wraps standalone text in `<p>` tags. Storybook's docs CSS applies `colorPrimary` (Ferrari Red) to `<p>` elements, **overriding your inline styles**.

```jsx
// What you write:
<div style={{ color: '#ffffff' }}>
  White text
</div>

// What MDX renders:
<div style="color: rgb(255, 255, 255);">
  <p>White text</p>  <!-- <p> has red color from Storybook! -->
</div>
```

### The Fix (Two Options)

**Option 1: Wrap text in `<span>`**
```jsx
<div style={{ color: '#ffffff' }}>
  <span>White text</span>  {/* No <p> wrapper = color works */}
</div>
```

**Option 2: Global CSS fix (already in styles.css)**
```css
.sbdocs-content div[style*="color"] p {
  color: inherit !important;
}
```

### Symptoms
- Inline `color` styles appear to "not work"
- Text shows as red/coral instead of expected color
- Only affects MDX docs, not .stories.tsx files
- `style` attribute in DOM shows correct value, but text is wrong color

### When This Happens
- Any styled text in MDX files (Introduction.mdx, Colors.mdx, etc.)
- Custom hero sections, branded content, dark backgrounds
- Any inline `color` or `PRIMITIVES.white` usage

---

## Two Rules

1. **Reflect Reality** - Stories show actual component behavior, NO hardcoded overrides
2. **Composition Only** - Stories compose exported components, NO custom functions

---

## Rule 1: No Style Overrides

```tsx
// ✅ CORRECT
<Input autoFocus />

// ❌ WRONG
<Input className="!border-blue-600" />
```

**Change flow:**
```
Need different appearance?
→ Change component/tokens FIRST
→ Story reflects automatically
→ NEVER hardcode in story
```

---

## Rule 2: No Custom Components

```tsx
// ❌ WRONG - function in story
function CustomCard({ title }) {
  return <Card><CardTitle>{title}</CardTitle></Card>
}

// ✅ CORRECT - inline composition
render: () => (
  <Card><CardTitle>Test</CardTitle></Card>
)
```

**Reusable pattern?** → Extract as real component, export, then use in stories.

---

## States

Use real browser mechanisms:

```tsx
<Input autoFocus />           // focus
<Checkbox defaultChecked />   // checked
<Input disabled />            // disabled
<Input aria-invalid="true" /> // error
```

Hover: Document "hover to see" (can't auto-hover)

---

## AllStates Story (Required)

Every stabilized component needs:

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <section>
        <h4 className="text-sm font-semibold mb-4">Variants</h4>
        {/* all variants */}
      </section>
      <section>
        <h4 className="text-sm font-semibold mb-4">Focus (Click)</h4>
        <Input autoFocus />
      </section>
    </div>
  )
}
```

---

## Checklist

- [ ] `autoFocus` for focus (not className)
- [ ] Real variants (not hardcoded)
- [ ] No `function` declarations
- [ ] No `const Component = () =>`
- [ ] Uses exported components only
- [ ] Has AllStates story

---

## Copy-Paste Patterns

### Basic Component Story

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './component-name'

const meta: Meta<typeof ComponentName> = {
  title: 'UI/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: { children: 'Default' },
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <section>
        <h4 className="text-sm font-semibold text-muted mb-4">Variants</h4>
        <div className="flex flex-wrap gap-4">
          <ComponentName variant="default">Default</ComponentName>
          <ComponentName variant="secondary">Secondary</ComponentName>
        </div>
      </section>
      <section>
        <h4 className="text-sm font-semibold text-muted mb-4">States</h4>
        <div className="flex flex-wrap gap-4">
          <ComponentName disabled>Disabled</ComponentName>
          <ComponentName autoFocus>Focused (click)</ComponentName>
        </div>
      </section>
    </div>
  ),
}
```

### Compound Component (Select, Dialog)

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <section>
        <h4 className="text-sm font-semibold text-muted mb-4">Default</h4>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </section>
      <section>
        <h4 className="text-sm font-semibold text-muted mb-4">With Focus</h4>
        <Select>
          <SelectTrigger className="w-[200px]" autoFocus>
            <SelectValue placeholder="Focused trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
          </SelectContent>
        </Select>
      </section>
    </div>
  ),
}
```

### Form Control with States

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <section>
        <h4 className="text-sm font-semibold text-muted mb-4">States</h4>
        <div className="space-y-4 max-w-sm">
          <Input placeholder="Default" />
          <Input placeholder="Focused" autoFocus />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Error" aria-invalid="true" />
        </div>
      </section>
    </div>
  ),
}
```

### Loading/Skeleton Pattern

```tsx
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 max-w-md">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
}
```

---

## Section Header Pattern

Always use consistent styling for AllStates sections:

```tsx
<h4 className="text-sm font-semibold text-muted mb-4">Section Title</h4>
```
