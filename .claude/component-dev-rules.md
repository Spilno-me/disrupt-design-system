# Component Development Rules (Wu Wei)

**Philosophy: Effortless Action. Work WITH the system, not against it.**

## Pre-Build Checklist

| Question | If Yes | If No |
|----------|--------|-------|
| Does existing component solve this? | Use it. Stop. | Continue |
| Is there real use case (Figma/ticket)? | Continue | Don't build |
| Will this break existing consumers? | STOP. Deprecate instead. | Continue |
| Am I adding >3 props? | Step back. Simplify. | Continue |

## Decision Table

| Situation | Action |
|-----------|--------|
| Need new component | Check `agent-context.json` registry first |
| Need new variant | Requires Figma design or ticket |
| Need new prop | Ask: "Is this solving today's problem?" |
| Fighting the implementation | STOP. Find natural path. |
| Complex logic emerging | Split into smaller components |

## API Design

### Props

| Do | Don't |
|----|-------|
| Minimal props that solve real use cases | Props "just in case" |
| `variant` enum for visual styles | Boolean props that combine |
| Composition over configuration | Mega-components with 10+ props |
| Children for flexible content | `leftIcon`, `rightIcon`, `prefix`, `suffix` |

```tsx
// ❌ Over-configured
<Button
  leftIcon={<Icon />}
  rightIcon={<ChevronDown />}
  iconSpacing={8}
  loading
  loadingPosition="left"
/>

// ✅ Composable
<Button>
  <Icon /> Label <ChevronDown />
</Button>

<Button disabled>
  <Spinner /> Loading...
</Button>
```

### Variants

| Do | Don't |
|----|-------|
| 3-5 variants that exist in designs | Every possible variation |
| Semantic names (`primary`, `destructive`) | Generic names (`type1`, `type2`) |
| Single `variant` prop | Multiple boolean flags |

```tsx
// ❌ Boolean explosion
<Card elevated bordered rounded interactive />

// ✅ Single variant
<Card variant="elevated" />
```

### Sizes

| Do | Don't |
|----|-------|
| `sm`, `md`, `lg` (3 sizes) | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| Size only if designs require it | Size prop on every component |
| Consistent across components | Different size scales per component |

## Implementation

### Token Usage

| Do | Don't |
|----|-------|
| `bg-surface`, `text-primary` | `bg-white`, `text-gray-900` |
| `rounded-md`, `shadow-md` | `rounded-[12px]`, inline styles |
| `gap-4`, `p-6` | `gap-[18px]`, `padding: 23px` |

```tsx
// ❌ Hardcoded
<div style={{ backgroundColor: '#08A4BD', borderRadius: '12px' }}>

// ✅ Tokens
<div className="bg-accent-strong rounded-md">
```

### Primitives

| Need | Use |
|------|-----|
| Dialog/Modal | `@radix-ui/react-dialog` |
| Select/Dropdown | `@radix-ui/react-select` |
| Tabs | `@radix-ui/react-tabs` |
| Tooltip | `@radix-ui/react-tooltip` |
| Accordion | `@radix-ui/react-accordion` |
| Checkbox/Radio | `@radix-ui/react-checkbox`, `react-radio-group` |

```tsx
// ❌ DIY accessibility
<div onClick={toggle} onKeyDown={handleKeys} role="button" tabIndex={0}>

// ✅ Radix handles it
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>
```

### Styling

| Do | Don't |
|----|-------|
| `cva()` for variants | Ternary chains |
| `cn()` for merging | String concatenation |
| Tailwind classes | CSS modules, styled-components |

```tsx
// ✅ Standard pattern
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-dark text-inverse hover:bg-dark/90",
        secondary: "bg-muted-bg text-primary hover:bg-muted-bg/80",
        destructive: "bg-error text-inverse hover:bg-error/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

## Backwards Compatibility

### Safe Changes (MINOR bump)

- Add optional prop
- Add new variant to existing prop
- Add new component
- Bug fixes
- Performance improvements

### Breaking Changes (STOP until v3)

- Rename prop
- Remove prop
- Change prop type
- Change default value
- Remove export

### Migration Pattern

```tsx
// When evolving API, support both:
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  /** @deprecated Use `variant="destructive"` instead */
  danger?: boolean;
}

function Button({ variant, danger, ...props }: ButtonProps) {
  // Resolve legacy prop
  const resolvedVariant = variant ?? (danger ? 'destructive' : 'primary');

  // Warn on deprecated usage
  if (danger !== undefined) {
    console.warn('[DDS] Button: `danger` prop is deprecated. Use `variant="destructive"`');
  }

  return <button className={buttonVariants({ variant: resolvedVariant })} {...props} />;
}
```

## Component Checklist

| Requirement | Validation |
|-------------|------------|
| Types | Full TypeScript, exported |
| Tokens | Zero hardcoded colors/spacing |
| A11y | Radix primitive or manual ARIA |
| Variants | `cva()` pattern |
| Export | Added to `src/index.ts` |
| Story | AllStates story with all variants |
| Registry | Updated `agent-context.json` |

## Red Flags (STOP signals)

| Signal | Action |
|--------|--------|
| Adding 5+ props at once | Split into multiple components |
| Complex conditional rendering | Extract sub-components |
| Inline styles appearing | Use tokens |
| Copy-pasting from another component | Extract shared primitive |
| "Just in case" additions | Remove. Add when needed. |
| Fighting TypeScript | Design is wrong. Rethink. |

## Quick Decisions

| Question | Answer |
|----------|--------|
| New component or extend existing? | Extend if 80%+ same |
| Prop or children? | Children for content, props for behavior |
| One component or compound? | Compound if >3 subparts |
| Controlled or uncontrolled? | Support both via Radix pattern |
| Add size prop? | Only if designs have multiple sizes |
