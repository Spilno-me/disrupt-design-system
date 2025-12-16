---
name: component-patterns
description: Use when building components. Covers CVA variants, Radix composition, data-slot, accessibility patterns, and mobile-first responsive design.
---

# Component Patterns Knowledge

## Core Patterns

### 1. CVA (Class Variance Authority)

CVA manages variant styles cleanly.

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      // Variant groups
      variant: {
        default: "bg-interactive-primary text-inverse hover:bg-interactive-hover",
        secondary: "bg-surface text-primary border border-default",
        destructive: "bg-interactive-danger text-inverse",
        ghost: "text-primary hover:bg-surface-hover",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    // Compound variants (combinations)
    compoundVariants: [
      {
        variant: "default",
        size: "lg",
        className: "font-semibold", // Extra bold for large default buttons
      },
    ],
    // Defaults when props not provided
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Type-safe props extraction
type ButtonProps = VariantProps<typeof buttonVariants>
// Results in: { variant?: 'default' | 'secondary' | ... , size?: 'sm' | ... }
```

**Why CVA?**
- Type-safe variants
- Clean separation of concerns
- Easy to extend
- Works with any styling solution

---

### 2. Radix Slot (asChild Pattern)

Radix Slot allows component composition without wrapper divs.

```typescript
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

function Button({ asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}

// Usage: renders as <button>
<Button>Click me</Button>

// Usage: renders as <a> with button styles
<Button asChild>
  <a href="/home">Go home</a>
</Button>

// Usage: renders as Next.js Link
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

**Why Slot?**
- No extra DOM nodes
- Preserves child element semantics
- Works with any child component
- Essential for navigation components

---

### 3. data-slot Attribute

Mark component parts for testing and debugging.

```typescript
function Card({ children, ...props }: CardProps) {
  return (
    <div data-slot="card" {...props}>
      {children}
    </div>
  )
}

function CardHeader({ children, ...props }: CardHeaderProps) {
  return (
    <div data-slot="card-header" {...props}>
      {children}
    </div>
  )
}

function CardContent({ children, ...props }: CardContentProps) {
  return (
    <div data-slot="card-content" {...props}>
      {children}
    </div>
  )
}
```

**Benefits**:
- Test selectors: `[data-slot="card-header"]`
- DevTools identification
- CSS targeting if needed
- Documentation

---

### 4. cn() Utility

Merge classes safely with clsx + tailwind-merge.

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage**:
```typescript
// Merges without conflicts
cn("px-4 py-2", "px-6")
// Result: "py-2 px-6" (px-6 wins)

// Conditional classes
cn("base-class", isActive && "active-class", className)

// Array syntax
cn(["flex", "items-center"], className)
```

**Why both clsx AND twMerge?**
- clsx: handles conditionals, arrays, objects
- twMerge: resolves Tailwind conflicts correctly

---

### 5. Compound Components

Related components that work together.

```typescript
// Parent provides context
const CardContext = React.createContext<{ size: string }>({ size: 'default' })

function Card({ size = 'default', children, ...props }: CardProps) {
  return (
    <CardContext.Provider value={{ size }}>
      <div data-slot="card" {...props}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

// Children consume context
function CardTitle({ children, ...props }: CardTitleProps) {
  const { size } = React.useContext(CardContext)
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-semibold",
        size === 'sm' && "text-sm",
        size === 'default' && "text-base",
        size === 'lg' && "text-lg",
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

// Attach to parent
Card.Title = CardTitle
Card.Content = CardContent
Card.Footer = CardFooter

// Usage
<Card size="lg">
  <Card.Title>Hello</Card.Title>
  <Card.Content>Body text</Card.Content>
</Card>
```

---

## Accessibility Patterns

### Focus Management

```typescript
// Always include focus-visible styles
className={cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-focus",
  "focus-visible:ring-offset-2",
)}
```

### Disabled States

```typescript
className={cn(
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
)}

// Also support aria-disabled
<button
  disabled={disabled}
  aria-disabled={disabled}
>
```

### Error States

```typescript
// Use aria-invalid for form errors
<input
  aria-invalid={hasError}
  className={cn(
    hasError && "border-error ring-error/20",
  )}
/>

// Always pair with error message
{hasError && (
  <p id="email-error" className="text-error text-sm">
    {errorMessage}
  </p>
)}
<input aria-describedby={hasError ? "email-error" : undefined} />
```

### Keyboard Navigation

```typescript
// For custom interactive elements
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }}
>
```

---

## Mobile-First Responsive

### Touch Targets

```typescript
// 48px minimum touch target on mobile, 40px on desktop
className="h-12 md:h-10"

// More padding for touch
className="px-4 md:px-3"
```

### Text Sizing

```typescript
// Prevent iOS zoom on inputs (16px minimum)
className="text-base md:text-sm"

// Placeholder also needs 16px+ on mobile
className="placeholder:text-base md:placeholder:text-sm"
```

### Responsive Pattern

```typescript
// Always mobile-first
className={cn(
  // Mobile (default)
  "flex flex-col gap-4 p-4",
  // Tablet
  "md:flex-row md:gap-6 md:p-6",
  // Desktop
  "lg:gap-8 lg:p-8",
)}
```

---

## Props Interface Pattern

```typescript
// Extend native element props
export interface ButtonProps
  extends React.ComponentProps<"button">,  // All button attrs
    VariantProps<typeof buttonVariants> {  // CVA variants
  asChild?: boolean                        // Slot composition
}

// For polymorphic components
export interface BoxProps<T extends React.ElementType = "div">
  extends React.ComponentPropsWithoutRef<T> {
  as?: T
}
```

---

## Export Pattern

```typescript
// Component file
export { Button, buttonVariants }
export type { ButtonProps }

// index.ts
export { Button, buttonVariants } from './components/ui/button'
export type { ButtonProps } from './components/ui/button'
```
