# Disrupt Design System (DDS) - AI Agent Guidelines

> Last updated: 2025-12-08

> **This document is the single source of truth for AI agents building UI with DDS.**
> Follow these rules exactly. No exceptions.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Decision Tree: Building UI](#decision-tree-building-ui)
3. [Existing Components Reference](#existing-components-reference)
4. [Styling Rules](#styling-rules)
5. [Building New Components](#building-new-components)
6. [Token Reference](#token-reference)
7. [Patterns & Examples](#patterns--examples)
8. [Prohibited Patterns](#prohibited-patterns)

---

## Core Principles

### The Golden Rules

1. **ALWAYS check for existing components first** - Never build what already exists
2. **ALL styling must use design tokens** - No raw colors, no standard Tailwind colors
3. **New components use Radix UI primitives** - For accessibility and behavior
4. **Tokens flow through CSS variables** - Change once, update everywhere

### Agent Workflow

```
Task: Build UI
    |
    v
[1] Search existing components in src/components/ui/
    |
    +--> Component exists? --> USE IT with correct props
    |
    +--> Component doesn't exist?
              |
              v
         [2] Use Radix UI as base (if interactive)
              |
              v
         [3] Style with DDS tokens ONLY
              |
              v
         [4] Create story file for documentation
```

---

## Decision Tree: Building UI

### Step 1: Do I need to build this?

**SEARCH FIRST.** These components already exist:

| Need | Use This Component |
|------|-------------------|
| Button | `<Button variant="primary\|secondary\|accent\|ghost\|destructive">` |
| Text input | `<Input />` |
| Multi-line input | `<Textarea />` |
| Checkbox | `<Checkbox />` |
| Select/dropdown | `<Select>` with `<SelectTrigger>`, `<SelectContent>`, `<SelectItem>` |
| Menu | `<DropdownMenu>` with triggers and items |
| Modal/dialog | `<Dialog>` with `<DialogContent>`, `<DialogHeader>`, etc. |
| Side panel | `<Sheet side="right\|left\|top\|bottom">` |
| Card container | `<Card variant="default\|pricing\|pricingHighlight">` |
| Tooltip | `<Tooltip>` with `<TooltipTrigger>`, `<TooltipContent>` |
| Accordion/FAQ | `<Accordion items={[{question, answer}]}>` |
| Badge/tag | `<Badge variant="default\|secondary\|destructive\|outline">` |
| Separator | `<Separator orientation="horizontal\|vertical">` |
| Loading skeleton | `<Skeleton variant="pulse\|shimmer\|wave">` |
| Form with validation | `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>` |
| Slider/range | `<Slider min={} max={} value={}>` |
| Header/navbar | `<Header navItems={} colorMode="dark\|light">` |
| App header (logged in) | `<AppHeader product="flow\|market\|partner" user={}>` |
| Mobile menu | `<MobileMenu>` |
| Feature card (with icon) | `<FeatureCard iconName="automate\|advice\|adapt\|scale">` |
| Checklist item | `<CheckListItem label="" text="">` |
| Optimized image | `<OptimizedImage sources={} alt="">` |
| Parallax image | `<ParallaxImage images={} intensity={20}>` |
| Quick filter chips | `<QuickFilter variant="default\|info\|warning\|primary">` |
| Animated logo | `<AnimatedLogo colorMode="dark\|light">` |
| Blob background | `<GridBlobBackground scale={1}>` |
| Error boundary | `<ErrorBoundary fallback={}>` |

### Step 2: If component doesn't exist

1. **Is it interactive?** (click, hover, focus, keyboard) → Use Radix UI primitive
2. **Is it layout only?** → Build with standard HTML + DDS tokens
3. **Does it have complex state?** → Consider Radix + React state

---

## Existing Components Reference

### Form Components

```tsx
// Button - Multiple variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent (teal)</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outlined</Button>
<Button size="sm" />  // small
<Button size="lg" />  // large
<Button size="icon" /> // icon only
<Button fullWidth />  // full container width

// Input
<Input placeholder="Enter text..." />
<Input type="email" />
<Input disabled />

// Textarea
<Textarea placeholder="Long text..." rows={4} />

// Checkbox with label
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>

// Select
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
    <SelectItem value="opt2">Option 2</SelectItem>
  </SelectContent>
</Select>

// Form with react-hook-form
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Layout Components

```tsx
// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>

// Card with shadow
<Card shadow="md">...</Card>  // none, sm, md, lg, xl

// Pricing card with animated border
<Card variant="pricingHighlight">...</Card>

// Section layout
<SectionWrapper background="cream">
  <SectionHeading
    label="Features"
    title="What We Offer"
    description="Our capabilities"
  />
  <TwoColumnLayout>
    <Column width="1/2">Left</Column>
    <Column width="1/2">Right</Column>
  </TwoColumnLayout>
</SectionWrapper>

// Page layout
<PageLayout>
  <Header />
  {children}
  <Footer />
</PageLayout>
```

### Overlay Components

```tsx
// Dialog/Modal
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    <div>Modal body content</div>
    <DialogFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Sheet (side panel)
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Panel</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Panel Title</SheetTitle>
    </SheetHeader>
    <div>Panel content</div>
  </SheetContent>
</Sheet>

// Dropdown Menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">?</Button>
    </TooltipTrigger>
    <TooltipContent>
      Helpful information here
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Data Display

```tsx
// Badge
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outlined</Badge>
<Badge shape="pill">Pill shaped</Badge>

// Skeleton loading
<Skeleton className="h-4 w-[200px]" />
<Skeleton variant="shimmer" className="h-12 w-full" />
<SkeletonText lines={3} />
<SkeletonImage aspectRatio="16:9" />

// Accordion
<Accordion
  items={[
    { question: "How does it work?", answer: "Like this..." },
    { question: "What's included?", answer: "Everything..." },
  ]}
  allowMultiple={false}
/>

// Quick filters
<div className="flex gap-2">
  <QuickFilter label="Drafts" count={5} selected={filter === 'drafts'} />
  <QuickFilter label="In Review" count={3} variant="warning" />
  <QuickFilter label="Approved" count={12} variant="info" />
</div>
```

### Navigation

```tsx
// Main header (marketing site)
<Header
  navItems={[
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
  colorMode="dark"  // or "light"
  showContactButton
  contactButtonText="Get Started"
/>

// App header (logged-in user)
<AppHeader
  product="flow"  // or "market" or "partner"
  notificationCount={4}
  user={{
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "/avatar.jpg"  // optional
  }}
  menuItems={[
    { id: 'profile', label: 'Profile', icon: <User /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    { id: 'logout', label: 'Log out', icon: <LogOut />, destructive: true },
  ]}
  onMenuItemClick={(item) => handleMenuAction(item.id)}
/>

// Mobile menu (used internally by Header)
<MobileMenu open={open} onOpenChange={setOpen}>
  <nav>Menu items</nav>
</MobileMenu>
```

### Feature Components

```tsx
// Feature card with animated icon
<FeatureCard
  iconName="automate"  // automate | advice | adapt | scale
  title="Automate Compliance"
  description="Streamline your EHS workflows"
/>

// Checklist item with animated check
<CheckListItem
  label="Step 1"
  text="Complete your profile"
  autoAnimate
/>

// Animated logo
<AnimatedLogo
  colorMode="dark"
  showTagline
  onClick={() => navigate('/')}
/>

// Pricing connector (plus icon between pricing cards)
<PricingConnector spinInterval={3000} />
```

### Image Components

```tsx
// Optimized image with lazy loading
<OptimizedImage
  sources={{
    sm: { avif: '/img-sm.avif', webp: '/img-sm.webp', fallback: '/img-sm.jpg' },
    md: { avif: '/img-md.avif', webp: '/img-md.webp', fallback: '/img-md.jpg' },
    lg: { avif: '/img-lg.avif', webp: '/img-lg.webp', fallback: '/img-lg.jpg' },
  }}
  alt="Description"
  aspectRatio="16:9"
  priority={false}
/>

// Parallax image
<ParallaxImage
  images={{ sm: '/sm.jpg', md: '/md.jpg', lg: '/lg.jpg' }}
  alt="Hero image"
  intensity={20}
/>

// Blur-up image loading
<BlurImage
  images={{ sm: '/sm.jpg', md: '/md.jpg', lg: '/lg.jpg' }}
  placeholder="/tiny-blur.jpg"
  alt="Photo"
/>
```

---

## Styling Rules

### Rule 1: Use Tailwind Classes for ALL Static Styling

**The Golden Rule:** Always use Tailwind classes. Only use `ALIAS` tokens for dynamic/computed values.

```tsx
// GOOD: Static styling with Tailwind classes
<div className="bg-surface text-primary border-default">

// GOOD: Dynamic styling with ALIAS (when value depends on state/props)
<div style={{ backgroundColor: isError ? ALIAS.status.error : ALIAS.background.surface }}>

// BAD: Using ALIAS for static styling
<div style={{ color: ALIAS.text.primary }}>  // Use text-primary class instead
```

### Complete Tailwind Color Reference

```css
/* ============================================================ */
/* TEXT COLORS                                                   */
/* ============================================================ */
text-primary      /* Main body text - #2D3142 */
text-secondary    /* Muted/supporting text - #5E4F7E */
text-tertiary     /* Subtle text, placeholders - #7F6F9F */
text-muted        /* Same as secondary - #5E4F7E */
text-emphasis     /* Emphasized labels - #474F5F */
text-disabled     /* Disabled text - #9F93B7 */
text-inverse      /* Text on dark backgrounds - #FFFFFF */
text-link         /* Link text - #08A4BD */
text-linkHover    /* Link hover - #068397 */
text-error        /* Error messages - #F70D1A */
text-success      /* Success messages - #22C55E */
text-warning      /* Warning messages - #EAB308 */
text-info         /* Info messages - #3B82F6 */

/* Brand text colors */
text-dark         /* Same as primary - #2D3142 */
text-teal         /* Accent teal - #08A4BD */
text-darkPurple   /* Same as secondary - #5E4F7E */

/* ============================================================ */
/* BACKGROUND COLORS                                             */
/* ============================================================ */
bg-surface        /* Cards, panels - #FFFFFF */
bg-surfaceHover   /* Surface hover state - #E8E9EB */
bg-surfaceActive  /* Surface active state - #D1D3D7 */
bg-page           /* Main page background - #FBFBF3 */
bg-cream          /* Same as page - #FBFBF3 */
bg-elevated       /* Elevated surfaces - #FFFFFF */
bg-mutedBg        /* Muted backgrounds - #EFEDF3 */
bg-lightPurple    /* Same as mutedBg - #EFEDF3 */
bg-inverseBg      /* Dark backgrounds - #2D3142 */
bg-dark           /* Same as inverseBg - #2D3142 */
bg-inverseSubtle  /* Subtle dark - #1D1F2A */
bg-accentBg       /* Light teal background - #E6F7FA */
bg-accentStrong   /* Strong teal - #08A4BD */
bg-teal           /* Same as accentStrong - #08A4BD */
bg-tealLight      /* Light teal - #66CFE1 */

/* Status backgrounds */
bg-error          /* Error background - #F70D1A */
bg-errorLight     /* Light error - #FEF2F2 */
bg-errorMuted     /* Muted error - #FEE2E2 */
bg-success        /* Success - #22C55E */
bg-successLight   /* Light success - #F0FDF4 */
bg-successMuted   /* Muted success - #DCFCE7 */
bg-warning        /* Warning - #EAB308 */
bg-warningLight   /* Light warning - #FFFBEB */
bg-warningMuted   /* Muted warning - #FEF3C7 */
bg-info           /* Info - #3B82F6 */
bg-infoLight      /* Light info - #EFF6FF */
bg-infoMuted      /* Muted info - #DBEAFE */

/* Feature indicators */
bg-featureBlue    /* Automate - #3B82F6 */
bg-featureRed     /* Advice - #EF4444 */
bg-featureYellow  /* Adapt - #EAB308 */
bg-featureGreen   /* Scale - #22C55E */
bg-circleBlue     /* Same as featureBlue */
bg-circleRed      /* Same as featureRed */
bg-circleYellow   /* Same as featureYellow */
bg-circleGreen    /* Same as featureGreen */

/* Aging/urgent */
bg-aging          /* Orange urgent - #F97316 */
bg-agingDark      /* Dark orange - #EA580C */
bg-agingLight     /* Light orange - #FFF7ED */

/* Utility */
bg-white          /* Pure white - #FFFFFF */
bg-black          /* Pure black - #000000 */
bg-linkedin       /* LinkedIn blue - #0A66C2 */
bg-transparent    /* Transparent */

/* ============================================================ */
/* BORDER COLORS                                                 */
/* ============================================================ */
border-default    /* Standard borders - #CBD5E1 */
border-slate      /* Same as default - #CBD5E1 */
border-subtle     /* Subtle borders - #D1D3D7 */
border-strong     /* Strong borders - #757B87 */
border-focus      /* Focus rings - #08A4BD */
border-accent     /* Accent borders - #08A4BD */
border-teal       /* Same as accent - #08A4BD */
border-dark       /* Dark borders - #2D3142 */
border-error      /* Error borders - #F70D1A */
border-success    /* Success borders - #22C55E */
border-warning    /* Warning borders - #EAB308 */
border-info       /* Info borders - #3B82F6 */
border-aging      /* Aging borders - #F97316 */
```

### Rule 2: For Dynamic Styles, Use ALIAS Tokens

When you need inline styles (computed values, dynamic props), import ALIAS:

```tsx
import { ALIAS } from '@/constants/designTokens'

// Dynamic background based on prop
<div style={{
  backgroundColor: isError ? ALIAS.status.error : ALIAS.background.surface
}}>

// Computed opacity
<div style={{
  backgroundColor: ALIAS.overlay.dark  // rgba(0,0,0,0.5)
}}>
```

**Available ALIAS tokens:**

```typescript
ALIAS.text.primary       // #2D3142
ALIAS.text.secondary     // #5E4F7E (muted)
ALIAS.text.inverse       // #FFFFFF
ALIAS.text.error         // #F70D1A
ALIAS.text.success       // #16A34A
ALIAS.text.warning       // #CA8A04
ALIAS.text.link          // #08A4BD
ALIAS.text.linkHover     // #068397

ALIAS.background.page    // #FBFBF3 (cream)
ALIAS.background.surface // #FFFFFF
ALIAS.background.inverse // #2D3142
ALIAS.background.accent  // #E6F7FA (light teal)
ALIAS.background.error   // #FEF2F2
ALIAS.background.success // #F0FDF4
ALIAS.background.warning // #FFFBEB

ALIAS.border.default     // #CBD5E1
ALIAS.border.focus       // #08A4BD
ALIAS.border.error       // #F70D1A

ALIAS.interactive.primary      // #2D3142
ALIAS.interactive.primaryHover // #252836
ALIAS.interactive.accent       // #08A4BD
ALIAS.interactive.accentHover  // #068397

ALIAS.status.error       // #F70D1A
ALIAS.status.success     // #22C55E
ALIAS.status.warning     // #EAB308
ALIAS.status.info        // #3B82F6

ALIAS.overlay.light      // rgba(251,251,243,0.3)
ALIAS.overlay.medium     // rgba(0,0,0,0.3)
ALIAS.overlay.dark       // rgba(0,0,0,0.5)
ALIAS.overlay.darkStrong // rgba(0,0,0,0.8)

ALIAS.brand.primary      // #2D3142
ALIAS.brand.secondary    // #08A4BD
ALIAS.brand.accent       // #F70D1A

ALIAS.feature.automate   // #3B82F6 (blue)
ALIAS.feature.advice     // #EF4444 (red)
ALIAS.feature.adapt      // #EAB308 (yellow)
ALIAS.feature.scale      // #22C55E (green)
```

### Rule 3: Use SHADOWS and RADIUS Constants

```tsx
import { SHADOWS, RADIUS } from '@/constants/designTokens'

<div style={{
  boxShadow: SHADOWS.md,
  borderRadius: RADIUS.lg
}}>
```

**Shadow tokens:**
- `SHADOWS.sm` - Subtle (cards)
- `SHADOWS.md` - Medium (dropdowns)
- `SHADOWS.lg` - Strong (modals)
- `SHADOWS.header` - Header specific
- `SHADOWS.footer` - Footer specific

**Radius tokens:**
- `RADIUS.xs` - 4px
- `RADIUS.sm` - 8px
- `RADIUS.md` - 12px
- `RADIUS.lg` - 16px
- `RADIUS.full` - 9999px (pill)

---

## Building New Components

### When to Build New

Only build a new component when:
1. No existing component serves the need
2. The pattern will be reused (not one-off)
3. It requires specific behavior not covered by existing components

### Step-by-Step Process

#### 1. Choose Base

**For interactive components (buttons, inputs, menus, dialogs):**
```tsx
// Use Radix UI primitives
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Tabs from '@radix-ui/react-tabs'
import * as Accordion from '@radix-ui/react-accordion'
import * as Popover from '@radix-ui/react-popover'
import * as Toggle from '@radix-ui/react-toggle'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
```

**For display-only components:**
```tsx
// Use standard HTML elements
<div>, <section>, <article>, <span>, <p>, etc.
```

#### 2. Style with DDS Tokens Only

```tsx
// NEW COMPONENT TEMPLATE
import { cn } from '@/lib/utils'
import { ALIAS, SHADOWS, RADIUS } from '@/constants/designTokens'

interface MyComponentProps {
  variant?: 'default' | 'accent' | 'error'
  children: React.ReactNode
  className?: string
}

export function MyComponent({
  variant = 'default',
  children,
  className
}: MyComponentProps) {
  return (
    <div
      className={cn(
        // Base styles - USE DDS CLASSES ONLY
        'rounded-lg border p-4',
        // Variant styles
        variant === 'default' && 'bg-white border-slate text-dark',
        variant === 'accent' && 'bg-teal text-white border-teal',
        variant === 'error' && 'bg-error text-white border-error',
        className
      )}
      style={{
        boxShadow: SHADOWS.sm,
      }}
    >
      {children}
    </div>
  )
}
```

#### 3. Create Story File

Every component needs a story:

```tsx
// my-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'error'],
    },
  },
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    children: 'Default content',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent content',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error content',
  },
}
```

### Radix UI Styling Patterns

When styling Radix primitives, follow these patterns:

```tsx
// Dialog Example
import * as DialogPrimitive from '@radix-ui/react-dialog'

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Overlay uses DDS overlay token via Tailwind
      'fixed inset-0 z-50 bg-black/50',  // or use ALIAS.overlay.dark inline
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Content uses DDS tokens
        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
        'w-full max-w-lg p-6',
        'bg-white border border-slate rounded-lg',  // DDS classes
        'shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      style={{ boxShadow: SHADOWS.lg }}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
```

---

## Token Reference

### When to Use What

| Situation | Use This |
|-----------|----------|
| Static text color | `className="text-primary"` |
| Static background | `className="bg-surface"` |
| Static border | `className="border-default"` |
| Dynamic color (based on state) | `style={{ color: ALIAS.text.error }}` |
| Shadow | `style={{ boxShadow: SHADOWS.md }}` or `className="shadow-md"` |
| Border radius | `style={{ borderRadius: RADIUS.lg }}` or `className="rounded-lg"` |

### TypeScript Token Imports

```tsx
// Only import what you need
import { ALIAS, SHADOWS, RADIUS } from '@/constants/designTokens'

// Use ALIAS only for dynamic values
const bgColor = isError ? ALIAS.status.error : ALIAS.background.surface

// For static styling, use Tailwind classes instead
<div className="bg-surface text-primary border-default rounded-lg shadow-md">
```

### Shadow Classes

```
shadow-sm    /* Subtle cards */
shadow-md    /* Medium elevation */
shadow-lg    /* Strong elevation - modals */
shadow-xl    /* Extra large */
shadow-image /* Hero images */
shadow-header /* Header glass effect */
```

### Radius Classes

```
rounded-xs   /* 4px - small elements */
rounded-sm   /* 8px - inputs, small cards */
rounded-md   /* 12px - cards, buttons */
rounded-lg   /* 16px - large cards */
rounded-xl   /* 20px - modals */
rounded-2xl  /* 24px - large containers */
rounded-full /* 9999px - pills, avatars */
```

---

## Patterns & Examples

### Common UI Patterns

#### Status Indicator
```tsx
<span className={cn(
  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm',
  status === 'success' && 'bg-circleGreen/10 text-circleGreen',
  status === 'warning' && 'bg-circleYellow/10 text-circleYellow',
  status === 'error' && 'bg-circleRed/10 text-circleRed',
  status === 'info' && 'bg-circleBlue/10 text-circleBlue',
)}>
  <span className="w-2 h-2 rounded-full bg-current" />
  {label}
</span>
```

#### Card with Hover
```tsx
<div className="bg-white border border-slate rounded-lg p-4
                hover:border-teal hover:shadow-md transition-all">
  {content}
</div>
```

#### Section with Background
```tsx
<section className="bg-cream py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4">
    {content}
  </div>
</section>
```

#### Form Field
```tsx
<div className="space-y-2">
  <Label className="text-dark font-medium">{label}</Label>
  <Input
    className="border-slate focus:border-teal focus:ring-teal"
    placeholder={placeholder}
  />
  {error && <p className="text-sm text-red">{error}</p>}
</div>
```

#### Icon Button
```tsx
<button className="p-2 rounded-lg bg-white border border-slate
                   hover:bg-lightPurple hover:border-teal transition-colors">
  <Icon className="w-5 h-5 text-dark" />
</button>
```

#### Nav Link
```tsx
<a className="text-dark hover:text-teal transition-colors font-medium">
  {label}
</a>
```

#### Avatar
```tsx
<div className="w-10 h-10 rounded-full bg-teal text-white
                flex items-center justify-center font-medium">
  {initials}
</div>
```

---

## Prohibited Patterns

### NEVER DO THIS

```tsx
// BAD: Raw hex colors
<div style={{ color: '#2D3142' }}>  // Use text-dark or ALIAS.text.primary

// BAD: Standard Tailwind colors
<div className="bg-slate-100">     // Use bg-lightPurple or bg-cream
<div className="text-gray-600">    // Use text-muted
<div className="border-gray-300">  // Use border-slate

// BAD: Raw rgba
<div style={{ background: 'rgba(0,0,0,0.5)' }}>  // Use ALIAS.overlay.dark

// BAD: Hardcoded shadows
<div style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>  // Use SHADOWS.sm

// BAD: Importing primitives in components
import { ABYSS, CORAL } from '@/constants/designTokens'
<div style={{ color: ABYSS[500] }}>  // Use ALIAS.text.primary

// BAD: Using deprecated BRAND tokens
import { BRAND } from '@/constants/designTokens'
<div style={{ color: BRAND.abyss }}>  // Use ALIAS.brand.primary

// BAD: Building components that exist
const MyButton = () => <button>...</button>  // Use <Button> component
const MyModal = () => <div>...</div>         // Use <Dialog> component

// BAD: Hardcoded z-index
<div style={{ zIndex: 100 }}>  // Use z-50 or import Z_INDEX
```

### ALWAYS DO THIS

```tsx
// GOOD: DDS Tailwind classes
<div className="bg-dark text-white">
<div className="bg-cream text-dark border-slate">
<div className="text-muted hover:text-teal">

// GOOD: ALIAS for dynamic values
import { ALIAS } from '@/constants/designTokens'
<div style={{ backgroundColor: isActive ? ALIAS.interactive.accent : ALIAS.background.surface }}>

// GOOD: SHADOWS and RADIUS
import { SHADOWS, RADIUS } from '@/constants/designTokens'
<div style={{ boxShadow: SHADOWS.md, borderRadius: RADIUS.lg }}>

// GOOD: Using existing components
<Button variant="primary">Click me</Button>
<Card shadow="md"><CardContent>...</CardContent></Card>
<Dialog><DialogContent>...</DialogContent></Dialog>

// GOOD: Radix + DDS tokens for new components
import * as Tabs from '@radix-ui/react-tabs'
<Tabs.Root>
  <Tabs.List className="bg-lightPurple rounded-lg p-1">
    <Tabs.Trigger className="text-dark data-[state=active]:bg-white">
      Tab 1
    </Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
```

---

## Quick Decision Reference

| Question | Answer |
|----------|--------|
| Need a button? | Use `<Button variant="...">` |
| Need an input? | Use `<Input>` or `<Textarea>` |
| Need a modal? | Use `<Dialog>` |
| Need a dropdown? | Use `<Select>` or `<DropdownMenu>` |
| Need a card? | Use `<Card>` |
| Need loading state? | Use `<Skeleton>` |
| Need a tooltip? | Use `<Tooltip>` |
| Building new interactive component? | Use Radix UI primitive |
| Need a static color? | **ALWAYS use Tailwind class** (bg-surface, text-primary, etc.) |
| Need a dynamic color? | Use ALIAS token (only when value depends on state/props) |
| Need shadow? | Use SHADOWS constant or shadow-* class |
| Need radius? | Use RADIUS constant or rounded-* class |

### Styling Decision Tree

```
Need a color?
    │
    ├── Is it STATIC (always the same)?
    │   └── YES → Use Tailwind class: className="bg-surface text-primary"
    │
    └── Is it DYNAMIC (changes based on state/props)?
        └── YES → Use ALIAS: style={{ color: isError ? ALIAS.status.error : ALIAS.text.primary }}
```

---

## File Locations

```
src/
├── components/
│   ├── ui/              # All reusable UI components
│   ├── forms/           # Form-specific components
│   ├── layout/          # Layout components (Header, Footer, PageLayout)
│   └── sections/        # Page section components
├── constants/
│   └── designTokens.ts  # ALL design tokens
├── styles/
│   └── tokens.css       # CSS variable exports
├── lib/
│   └── utils.ts         # cn() utility
└── stories/
    └── demos/           # Demo/showcase components
```

---

## Commands

```bash
# Run Storybook (component development)
npm run storybook

# Lint (checks token usage)
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

---

**Remember:** When in doubt, check existing components first. The goal is consistency across all products using DDS.
