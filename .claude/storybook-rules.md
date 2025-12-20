# Storybook Rules

## CRITICAL: Use Infrastructure (NEVER inline decorators)

**ALWAYS** import from `src/stories/_infrastructure`:

```tsx
// ❌ FORBIDDEN - inline decorators
decorators: [(Story) => <div className="p-4 max-w-sm"><Story /></div>]

// ✅ REQUIRED - use infrastructure
import { withStoryContainer, StorySection, StoryFlex } from '../_infrastructure'
decorators: [withStoryContainer('atom')]
```

| What | Import |
|------|--------|
| Container | `withStoryContainer('atom' | 'molecule' | 'organism')` |
| Dark preview | `withDarkBackground()` |
| Sections | `<StorySection title="Variants">` |
| Layout | `<StoryFlex>` or `<StoryGrid cols={3}>` |
| Meta preset | `ATOM_META`, `MOLECULE_META`, `ORGANISM_META` |

---

## CRITICAL: Token Confusion

| Token | Hex | Use |
|-------|-----|-----|
| `bg-muted` | `#7F6F9F` DARK | Muted foreground (icons) |
| `bg-muted-bg` | `#EFEDF3` LIGHT | Muted background (code blocks) |

```jsx
// ❌ <code className="bg-muted text-secondary">  // dark on dark
// ✅ <code className="bg-muted-bg text-secondary">
```

## CRITICAL: MDX Paragraph Bug

MDX wraps text in `<p>` which gets Storybook's red color.

```jsx
// ❌ <div style={{ color: '#fff' }}>White text</div>
// ✅ <div style={{ color: '#fff' }}><span>White text</span></div>
```

## Two Rules

1. **Reflect Reality** - NO hardcoded overrides
2. **Composition Only** - NO custom functions

```tsx
// ✅ <Input autoFocus />
// ❌ <Input className="!border-blue-600" />

// ❌ function CustomCard() {...}
// ✅ render: () => <Card><CardTitle>Test</CardTitle></Card>
```

## States (Use Real Mechanisms)

```tsx
<Input autoFocus />           // focus
<Checkbox defaultChecked />   // checked
<Input disabled />            // disabled
<Input aria-invalid="true" /> // error
```

## AllStates (Required)

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <section>
        <h4 className="text-sm font-semibold mb-4">Variants</h4>
        {/* variants */}
      </section>
    </div>
  )
}
```

## Infrastructure (MANDATORY)

Import from `@/stories/_infrastructure`

### Meta Presets

| Preset | Layout |
|--------|--------|
| `ATOM_META` | centered |
| `MOLECULE_META` | centered |
| `ORGANISM_META` | fullscreen |

```tsx
const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: { description: { component: atomDescription('...') } },
  },
}
```

### Decorators

```tsx
withStoryContainer('atom')  // Standard padding+width
withDarkBackground()        // Dark context
withFullscreen('200px')     // Layout components
```

### Widths

```tsx
STORY_WIDTHS = { atom: 'max-w-md', molecule: 'max-w-xl', organism: 'max-w-4xl' }
```

### Components

```tsx
<StorySection title="Variants">
  <StoryFlex>
    <Button variant="default">Default</Button>
  </StoryFlex>
</StorySection>
```

### Spacing

```tsx
STORY_SPACING = { variants: 'gap-4', sections: 'space-y-8', container: 'p-6' }
```

## Modal/Overlay Stories

| Approach | Use For |
|----------|---------|
| Static HTML with dialog classes | Default (always visible) |
| Real Dialog with trigger | Interactive demos |
| Never `defaultOpen` alone | Breaks rendering |

```tsx
// Static preview
<div className="bg-surface rounded-lg border p-6 shadow-lg max-w-lg">
  <h2>Dialog Title</h2>
</div>
```

## data-slot vs data-testid

| Attribute | Component | Who Sets |
|-----------|-----------|----------|
| `data-testid` | Atom/Molecule/Page | Consumer |
| `data-slot` | Compound (Dialog, Select) | Component (fixed) |

## MDX Page Structure

**NEVER `---` separators. Use `Section` component.**

```mdx
import { Section, SectionHeader } from './foundation/DocComponents';

<BrandHero title="Page" />

<Section first>
  <SectionHeader title="First" />
  {/* content */}
</Section>

<Section>
  <SectionHeader title="Second" />
</Section>
```

| Component | Spacing |
|-----------|---------|
| `<Section first>` | marginTop: 0 |
| `<Section>` | marginTop: 48px |
| `<SectionHeader>` | marginBottom: 16px |

## Forbidden

```tsx
// ❌ Inline decorators
decorators: [(Story) => <div className="w-[600px]"><Story /></div>]

// ❌ Hardcoded widths - use STORY_WIDTHS
// ❌ Custom section headers - use StorySection
// ❌ Factory functions (breaks indexer)
const meta = createAtomMeta({...})  // Must use spread
```

## Migration Checklist

| Required | Pattern |
|----------|---------|
| Import | `@/stories/_infrastructure` |
| Meta | `...ATOM_META` spread |
| Description | `xxxDescription()` helper |
| Decorators | `withStoryContainer()` not inline |
| Layout | `<StorySection>`, `<StoryFlex>` |
| Spacing | `STORY_SPACING.sections` |
