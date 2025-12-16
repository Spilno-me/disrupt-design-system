---
description: Generate a token-constrained UI component
argument-hint: ComponentName (e.g., Button, Card, Input)
---

# Generate Component: $ARGUMENTS

Create a production-ready **$ARGUMENTS** component with strict token constraints.

If no component name provided, ask the user for one.

---

## TOKEN CONSTRAINTS (CRITICAL)

### FORBIDDEN - Will Fail Validation

```typescript
// Raw colors - NEVER USE
className="bg-[#08A4BD]"
style={{ color: '#2D3142' }}

// Standard Tailwind colors - NEVER USE
className="bg-blue-500 text-red-600 border-gray-300"

// Arbitrary color values - NEVER USE
className="text-[rgb(0,0,0)]"
```

### REQUIRED - Token Classes Only

```typescript
// Semantic backgrounds
className="bg-surface"
className="bg-muted-bg"
className="bg-interactive-primary"

// Semantic text
className="text-primary"
className="text-secondary"
className="text-inverse"

// Semantic borders
className="border-default"
className="border-focus"

// Interactive states
className="bg-interactive-primary hover:bg-interactive-hover"
```

---

## Component Template

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-focus focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-interactive-primary text-inverse hover:bg-interactive-hover',
        secondary: 'bg-surface text-primary border border-default hover:bg-surface-hover',
        destructive: 'bg-interactive-danger text-inverse hover:bg-interactive-danger-hover',
        ghost: 'text-primary hover:bg-surface-hover',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-12 md:h-10 px-4 text-base md:text-sm',
        lg: 'h-14 md:h-12 px-6 text-lg md:text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ComponentProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean
}

function Component({ className, variant, size, asChild = false, ...props }: ComponentProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="component-name"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

---

## Required Patterns

1. **data-slot** - `data-slot="button"` for testing
2. **asChild** - Radix Slot for composition
3. **CVA** - Consistent variant API
4. **Focus states** - `focus-visible:ring-2 focus-visible:ring-focus`
5. **Disabled states** - `disabled:pointer-events-none disabled:opacity-50`
6. **Mobile-first** - `h-12 md:h-10` (48px mobile, 40px desktop)

---

## Files to Generate

1. `src/components/ui/{name}.tsx`
2. `src/components/ui/{name}.stories.tsx`
3. Update `src/index.ts` with exports

---

## Validation

Before completing, verify:
- Zero raw hex colors
- Zero standard Tailwind colors
- All colors use semantic tokens
- data-slot present
- Focus/disabled states included
