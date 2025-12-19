# Storybook Rules

**Agent-only. Enforce on all story edits.**

---

## CRITICAL: bg-muted vs bg-muted-bg Token Confusion

**`bg-muted` is DARK, `bg-muted-bg` is LIGHT.**

### The Problem
```
bg-muted    → DUSK_REEF[400] (#7F6F9F) → DARK purple
bg-muted-bg → DUSK_REEF[50]  (#EFEDF3) → LIGHT purple
```

Using `bg-muted` with `text-secondary` (DUSK_REEF[500]) creates **dark-on-dark** with ~1.5:1 contrast.

### The Fix
```jsx
// ❌ WRONG - dark on dark
<code className="bg-muted text-secondary">code</code>

// ✅ CORRECT - light background, dark text
<code className="bg-muted-bg text-secondary">code</code>
```

### Token Semantic Difference
| Token | Hex | Use |
|-------|-----|-----|
| `bg-muted` | `#7F6F9F` | Muted foreground elements (icons, disabled text) |
| `bg-muted-bg` | `#EFEDF3` | Muted background surfaces (code blocks, chips) |

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

---

## Modal/Overlay Components in Stories (CRITICAL)

**Problem:** Modals use portals and fixed positioning - they don't render inline in Storybook canvas.

### Solution: Static Previews

For Default/WithForm stories, use plain HTML with dialog styling:

```tsx
// ❌ WRONG - Won't display properly
export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>...</DialogContent>
    </Dialog>
  ),
}

// ✅ CORRECT - Static preview with dialog styling
export const Default: Story = {
  render: () => (
    <div className="bg-surface text-primary font-sans w-full max-w-lg rounded-lg border border-default p-6 shadow-lg">
      <div className="flex flex-col gap-2 text-left">
        <h2 className="text-base font-semibold">Dialog Title</h2>
        <p className="text-sm text-muted">Description text here.</p>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </div>
  ),
}
```

### Interactive Examples in AllStates

Use real Dialog components for interactive demos (user clicks to open):

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Static anatomy diagram */}
      <div className="rounded-lg border border-default bg-surface p-6 shadow-lg max-w-lg">
        {/* ... static structure ... */}
      </div>

      {/* Interactive examples - user clicks to open */}
      <div className="flex gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>...</DialogContent>
        </Dialog>
      </div>
    </div>
  ),
}
```

### Key Points

| Approach | Use For |
|----------|---------|
| Static HTML with dialog classes | Default, WithForm (always visible) |
| Real Dialog with trigger | AllStates interactive demos |
| Never use `defaultOpen` alone | Breaks Storybook rendering |

---

## data-slot vs data-testid

### When to Use Each

| Attribute | Component Type | Who Sets It |
|-----------|---------------|-------------|
| `data-testid` | ATOM, MOLECULE, PAGE | Consumer or auto-generated |
| `data-slot` | Compound components (Dialog, Select) | Component itself (fixed) |

### data-slot Pattern (Compound Components)

Compound components use `data-slot` because:
- Structure is fixed (DialogHeader, DialogContent, etc.)
- Consumer doesn't control internal structure
- Enables targeting specific parts in tests

```tsx
// Component implementation
function DialogContent({ children }) {
  return (
    <div data-slot="dialog-content">
      {children}
      <button data-slot="dialog-close">×</button>
    </div>
  )
}

// Testing
container.querySelector('[data-slot="dialog-content"]')
container.querySelector('[data-slot="dialog-close"]')
```

### Components Using data-slot

- Dialog: `dialog`, `dialog-trigger`, `dialog-content`, `dialog-header`, `dialog-footer`, `dialog-title`, `dialog-description`, `dialog-close`, `dialog-overlay`
- Select: `select-trigger`, `select-content`, `select-item`, `select-separator`
- Sheet: `sheet-trigger`, `sheet-content`, `sheet-header`, `sheet-title`

### data-testid Pattern (Regular Components)

```tsx
// ATOM - Consumer provides
<Button data-testid="submit-btn">Submit</Button>

// MOLECULE - Auto-generated from props
<LeadCard lead={lead} />
// → data-testid="lead-card-123"
```

---

## STORY INFRASTRUCTURE (MANDATORY)

**All new stories MUST use the story infrastructure.**

Location: `src/stories/_infrastructure/`

### Why Infrastructure?

| Problem | Solution |
|---------|----------|
| Inconsistent backgrounds/widths | `STORY_WIDTHS`, `withStoryContainer()` |
| Copy-paste decorators | Shared decorators imported once |
| Different spacing patterns | `STORY_SPACING` constants |
| Atomic level confusion | `createAtomMeta()`, `createMoleculeMeta()` factories |
| Hallucinated variations | Templates enforce structure |

### Quick Start

```tsx
import {
  createAtomMeta,       // or createMoleculeMeta, createOrganismMeta
  StorySection,
  StoryFlex,
  STORY_SPACING,
} from '@/stories/_infrastructure'
```

---

## Meta Presets (Use These)

**IMPORTANT:** Storybook's CSF indexer requires static object literals.
Use spread syntax, NOT factory functions.

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ATOM_META, atomDescription } from '@/stories/_infrastructure'

// ATOM (Button, Input, Badge)
const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: { component: atomDescription('Primary interactive element.') },
    },
  },
  argTypes: { variant: { control: 'select', options: ['default', 'outline'] } },
}

// MOLECULE (Card, Dialog, Form)
const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: { component: moleculeDescription('Container with sections.') },
    },
  },
}

// ORGANISM (AppHeader, DataTable)
const meta: Meta<typeof AppHeader> = {
  title: 'Shared/AppHeader',
  component: AppHeader,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: { component: organismDescription('App header.') },
    },
  },
  decorators: [withFullscreen('200px')],
}
```

### What Presets Provide

| Preset | Layout | Type Badge | Tags |
|--------|--------|------------|------|
| `ATOM_META` | centered | ATOM | autodocs |
| `MOLECULE_META` | centered | MOLECULE | autodocs |
| `ORGANISM_META` | fullscreen | ORGANISM | autodocs |
| `TEMPLATE_META` | fullscreen | TEMPLATE | autodocs |
| `PAGE_META` | fullscreen | PAGE | autodocs |

---

## Shared Decorators (Use These)

```tsx
import {
  withStoryContainer,   // Standard padding + width
  withDarkBackground,   // Dark context
  withFullscreen,       // Layout components
} from '@/stories/_infrastructure'

// In meta config:
decorators: [withStoryContainer('atom')]

// Per-story:
OnDarkBackground: {
  decorators: [withDarkBackground()],
}
```

### Width Constants

```tsx
STORY_WIDTHS = {
  atom: 'max-w-md',      // 448px
  molecule: 'max-w-xl',  // 576px
  organism: 'max-w-4xl', // 896px
  page: 'max-w-7xl',     // 1280px
  full: 'w-full',
}
```

---

## Section Components (Use These)

```tsx
import { StorySection, StoryFlex, StoryGrid, StoryInfoBox } from '@/stories/_infrastructure'

// AllStates structure:
export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      <StorySection title="Variants" description="All visual variants">
        <StoryFlex>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
        </StoryFlex>
      </StorySection>

      <StorySection title="Sizes">
        <StoryFlex align="center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </StoryFlex>
      </StorySection>

      <StoryInfoBox>
        <strong>Keyboard:</strong> Tab to navigate, Enter to activate.
      </StoryInfoBox>
    </div>
  ),
}
```

### Spacing Constants

```tsx
STORY_SPACING = {
  variants: 'gap-4',        // Between items in grid/flex
  sections: 'space-y-8',    // Between sections in AllStates
  sectionContent: 'space-y-4', // Section title to content
  container: 'p-6',         // Padding inside containers
}
```

---

## ATOM Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ATOM_META, atomDescription, StoryFlex } from '@/stories/_infrastructure'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription('Primary interactive element for user actions.'),
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Button', variant: 'default', size: 'default' },
}

export const Variants: Story = {
  render: () => (
    <StoryFlex>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </StoryFlex>
  ),
}

export const Sizes: Story = {
  render: () => (
    <StoryFlex align="center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </StoryFlex>
  ),
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
```

---

## MOLECULE Story Template

```tsx
import type { StoryObj } from '@storybook/react'
import { createMoleculeMeta, StorySection, STORY_SPACING } from '@/stories/_infrastructure'
import { Card, CardHeader, CardTitle, CardContent } from './card'

const meta = createMoleculeMeta({
  title: 'Core/Card',
  component: Card,
  description: 'Container with header, content, and footer sections.',
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined'] },
  },
})

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader><CardTitle>Title</CardTitle></CardHeader>
      <CardContent>Content goes here.</CardContent>
    </Card>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      <StorySection title="Variants">
        <div className="flex gap-6">
          <Card variant="default"><CardContent>Default</CardContent></Card>
          <Card variant="outlined"><CardContent>Outlined</CardContent></Card>
        </div>
      </StorySection>
    </div>
  ),
}
```

---

## ORGANISM Story Template

```tsx
import type { StoryObj } from '@storybook/react'
import {
  createOrganismMeta,
  StorySection,
  StoryAnatomy,
  StoryInfoBox,
  withFullscreen,
  STORY_SPACING,
} from '@/stories/_infrastructure'
import { AppHeader } from './AppHeader'

const meta = createOrganismMeta({
  title: 'Shared/App Shell/AppHeader',
  component: AppHeader,
  description: 'Application header with logo, notifications, and user menu.',
  decorators: [withFullscreen('200px')],
})

export default meta
type Story = StoryObj<typeof AppHeader>

const sampleUser = { name: 'Jane Doe', email: 'jane@example.com' }

export const Default: Story = {
  args: { product: 'flow', user: sampleUser, notificationCount: 4 },
}

export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      <StoryAnatomy
        slots={[
          { name: 'app-header', description: 'Main container' },
          { name: 'logo', description: 'Logo section' },
          { name: 'user-menu', description: 'User dropdown' },
        ]}
      />

      <StorySection title="Product Variants">
        <div className="space-y-4">
          <AppHeader product="flow" user={sampleUser} />
          <AppHeader product="market" user={sampleUser} />
        </div>
      </StorySection>

      <StoryInfoBox>
        <strong>Keyboard:</strong> Tab to navigate, Esc to close menus.
      </StoryInfoBox>
    </div>
  ),
}
```

---

## Forbidden Patterns

```tsx
// ❌ Inline decorators - use shared decorators
decorators: [(Story) => <div className="w-[600px] p-5"><Story /></div>]

// ❌ Hardcoded widths - use STORY_WIDTHS
<div className="w-[500px]">

// ❌ Inconsistent spacing - use STORY_SPACING
<div className="space-y-12">  // Should be space-y-8

// ❌ Custom section headers - use StorySection
<h3 className="text-lg font-semibold mb-4">Title</h3>

// ❌ Raw meta without presets - use spread + xxxDescription
const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  // Missing ...ATOM_META spread!
}

// ❌ Factory functions (breaks Storybook indexer)
const meta = createAtomMeta({ ... })  // CSF requires static object literal
```

---

## Migration Checklist

When updating existing stories:

- [ ] Import from `@/stories/_infrastructure`
- [ ] Add `...ATOM_META` (or MOLECULE/ORGANISM) spread to meta
- [ ] Add `xxxDescription()` helper for type badge in description
- [ ] Replace inline decorators with `withStoryContainer()` etc.
- [ ] Replace `<div className="flex gap-4">` with `<StoryFlex>`
- [ ] Replace `<div className="space-y-8">` with `STORY_SPACING.sections`
- [ ] Replace custom section headers with `<StorySection>`
- [ ] Add `<StoryAnatomy>` for organisms with data-slots
- [ ] Verify AllStates story uses infrastructure components

---

## CRITICAL: MDX Page Structure (No Separators)

**NEVER use `---` markdown separators for spacing. Use `Section` component.**

### The Problem

```mdx
{/* ❌ WRONG - Separators create ugly lines, inconsistent spacing */}
<BrandHero title="Page" />

---

<h2>First Section</h2>
content...

---

<h2>Second Section</h2>
```

### The Solution

Use `Section` wrapper component with `SectionHeader`:

```mdx
{/* ✅ CORRECT - Section component handles vertical rhythm */}
import { Section, SectionHeader } from './foundation/DocComponents';

<BrandHero title="Page" />

<Section first>
  <SectionHeader title="First Section" description="Optional description" />
  {/* Content here */}
</Section>

<Section>
  <SectionHeader title="Second Section" icon={<Palette size={24} />} />
  {/* Content here */}
</Section>
```

### MDX Page Template

Every documentation page should follow this structure:

```mdx
{/* 1. Imports */}
import { Meta } from '@storybook/addon-docs/blocks';
import { SomeIcon } from 'lucide-react';
import { BrandHero, PRIMITIVES } from './brand/BrandComponents';
import { Section, SectionHeader, CodeBlock } from './foundation/DocComponents';

<Meta title="Category/Page Name" />

{/* 2. Hero (always first) */}
<BrandHero
  title="Page Title"
  description="Brief description of the page content."
  gradient="primary"
  decorativeIcon={<SomeIcon size={180} color={PRIMITIVES.white} strokeWidth={1} />}
/>

{/* 3. Sections with proper spacing */}
<Section first>
  <SectionHeader title="First Section" />
  {/* Content: grids, cards, code blocks, etc. */}
</Section>

<Section>
  <SectionHeader title="Second Section" icon={<Icon size={24} />} />
  {/* More content */}
</Section>

<Section>
  <SectionHeader title="Third Section" description="With description" />
  {/* More content */}
</Section>
```

### Spacing Reference

| Component | Built-in Spacing |
|-----------|-----------------|
| `<Section first>` | `marginTop: 0` (after hero) |
| `<Section>` | `marginTop: 48px` (between sections) |
| `<SectionHeader>` | `marginBottom: 16px` (to content) |

### Content Grid Pattern

For card grids within sections, use `SPACING.px.gridGap`:

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: SPACING.px.gridGap,  // 16px
}}>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### When to Use Raw `<h2>`

Only use raw `<h2>` with manual spacing if you need custom styling:

```jsx
{/* Only when SectionHeader doesn't fit your needs */}
<h2 style={{
  marginTop: SPACING.px.sectionHeadingTop,
  marginBottom: SPACING.px.sectionHeadingBottom,
}}>
  Custom Title
</h2>
```
