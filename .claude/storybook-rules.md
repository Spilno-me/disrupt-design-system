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

## CRITICAL: Mobile Bottom Sheets (NOT Modals)

**On mobile (<1024px), ALWAYS use bottom Sheet instead of centered Dialog.**

| Device | Component | Pattern |
|--------|-----------|---------|
| **Mobile** (<lg) | `Sheet side="bottom"` | Full-width, 90vh height, rounded top corners |
| **Desktop** (≥lg) | `Dialog` | Centered modal with max-width |

```tsx
// Mobile-responsive dialog pattern
const isMobile = useIsMobile() // window.innerWidth < 1024

if (isMobile) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>
        {/* Content */}
      </SheetContent>
    </Sheet>
  )
}

// Desktop: use Dialog
return <Dialog>...</Dialog>
```

## CRITICAL: Modal/Sheet Button Alignment

| Platform | Button Layout | Alignment |
|----------|---------------|-----------|
| **Desktop Dialog** | `flex justify-end gap-2` | Right-aligned, horizontal |
| **Mobile Sheet** | `flex flex-col-reverse gap-2` | Full-width, stacked (primary at top) |

```tsx
// Desktop: right-aligned, horizontal
<div className="mt-6 flex justify-end gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</div>

// Mobile: full-width, stacked with primary action at top
<div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t flex flex-col-reverse gap-2">
  <Button variant="outline" className="w-full">Cancel</Button>
  <Button className="w-full">Confirm</Button> {/* Renders at top due to flex-col-reverse */}
</div>
```

**Why `flex-col-reverse` on mobile?**
- Primary action renders at TOP (closer to thumb)
- Cancel at BOTTOM (less prominent)
- Maintains DOM order (Cancel, Confirm) for accessibility

## CRITICAL: Sheet Close Animation

**ALWAYS use `SheetClose` for close/cancel buttons in Sheets to get proper slide-out animation.**

```tsx
// ❌ BAD - bypasses animation, sheet disappears instantly
<Button onClick={() => onOpenChange(false)}>Close</Button>

// ✅ GOOD - proper slide-out animation
import { SheetClose } from '@/components/ui/sheet'

<SheetClose asChild>
  <Button variant="outline">Close</Button>
</SheetClose>
```

**For actions that close after async operation (like Delete):**
- Cancel button: Use `SheetClose` for animation
- Action button: Can use `onOpenChange(false)` after completion (users expect state change)

## CRITICAL: Mobile & Tablet Stories Pattern

**ALWAYS use `storyId` prop to embed stories in device frames.**

Both `IPhoneMobileFrame` and `IPadMobileFrame` support two modes:
- `storyId` - **PREFERRED** - Embeds story in iframe (fixed positioning contained)
- `children` - Direct render (fixed positioning escapes to viewport)

### Why storyId is Required

| Mode | Fixed Position Elements | Why |
|------|------------------------|-----|
| `storyId` (iframe) | Contained in device | Iframe = separate document context |
| `children` (direct) | Escape to viewport | `position: fixed` ignores parent containers |

### iPhone Mobile Story Template

```tsx
import { IPhoneMobileFrame } from '../_infrastructure'

export const MobileFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="category-component--default"
        scale={1}  // Real device size - REQUIRED
      />
    </div>
  ),
}
```

### iPad Tablet Story Template

```tsx
import { IPadMobileFrame } from '../_infrastructure'

export const TabletFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPadMobileFrame
        model="ipadPro11"
        orientation="landscape"  // or "portrait"
        storyId="category-component--default"
        scale={1}  // Real device size - REQUIRED
      />
    </div>
  ),
}
```

### With Safari Browser Chrome (PWA/Web Apps)

```tsx
// iPhone with Safari browser chrome
<IPhoneMobileFrame
  model="iphone16promax"
  storyId="flow-dashboard--incidents-page"
  scale={1}  // Real device size
  showBrowser
  browserUrl="flow.disrupt.app/incidents"
/>

// iPad with Safari browser chrome
<IPadMobileFrame
  model="ipadPro11"
  storyId="flow-dashboard--default"
  scale={1}  // Real device size
  showBrowser
  browserUrl="flow.disrupt.app"
/>
```

### storyId Format

| Story Title | Story Name | storyId |
|-------------|------------|---------|
| `Shared/AIAssistant` | `Default` | `shared-aiassistant--default` |
| `Flow/Dashboard` | `IncidentsPage` | `flow-dashboard--incidents-page` |
| `Core/Button` | `AllStates` | `core-button--all-states` |

**Rule:** Kebab-case title (slashes become dashes) + `--` + kebab-case story name

### Available Device Models

**iPhone Models:**

| Model | Screen Size | Best For |
|-------|-------------|----------|
| `iphone16promax` | 440×956 | **Default** - largest display |
| `iphone16pro` | 402×874 | Standard Pro |
| `iphone16` | 393×852 | Standard size |
| `iphone6` | 375×667 | Compact/legacy testing |

**iPad Models:**

| Model | Screen Size | Best For |
|-------|-------------|----------|
| `ipadPro11` | 834×1194 | **Default** - standard Pro |
| `ipadPro12` | 1024×1366 | Large displays |
| `ipadAir` | 820×1180 | Modern Air |
| `ipadMini` | 744×1133 | Compact tablet |

### iPad Orientation

```tsx
// Landscape (default) - better for dashboards
<IPadMobileFrame model="ipadPro11" storyId="..." />

// Portrait - for mobile-first designs
<IPadMobileFrame model="ipadPro11" orientation="portrait" storyId="..." />
```

### CRITICAL: Real Device Size (scale={1})

**ALWAYS use `scale={1}` for device frame stories.**

Device frames must render at **real physical device dimensions** for accurate UX testing.
Designers and developers need to experience actual touch target sizes and content density.

```tsx
// ✅ REQUIRED - Real device size
<IPhoneMobileFrame
  model="iphone16promax"
  storyId="flow-dashboard--default"
  scale={1}  // 430×932pt - real size
/>

// ❌ FORBIDDEN - Scaled down
<IPhoneMobileFrame
  model="iphone16promax"
  storyId="flow-dashboard--default"
  scale={0.7}  // Distorts perception of touch targets
/>
```

| Why Real Size Matters |
|----------------------|
| Touch target accuracy (44pt minimum) |
| Typography legibility at actual size |
| Content density evaluation |
| Spacing & padding feel |
| Scroll behavior realism |

**Container Pattern for Scrollable Real-Size Frames:**

```tsx
<div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
  <IPhoneMobileFrame model="iphone16promax" storyId="..." scale={1} />
</div>
```

The `overflow-auto` allows scrolling when the device exceeds viewport height.

### Legacy Scales (Comparison Views Only)

Only use scales < 1 for side-by-side device comparison stories:

| Use Case | Scale | Notes |
|----------|-------|-------|
| **Default (single device)** | `1.0` | **Required** - Real size |
| Side-by-side (2 devices) | `0.5-0.55` | Comparison views |
| Device gallery (3+ devices) | `0.4-0.5` | Overview displays |

### Centering Container

**ALWAYS wrap in scrollable centering container:**

```tsx
<div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
  <IPhoneMobileFrame model="iphone16promax" storyId="..." scale={1} />
</div>
```

| Class | Purpose |
|-------|---------|
| `flex justify-center` | Horizontal centering |
| `p-8` | Comfortable padding around device |
| `bg-page` | Page background token (light/dark mode aware) |
| `min-h-screen` | Full viewport height |
| `overflow-auto` | **Critical** - allows scroll when device exceeds viewport |

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
