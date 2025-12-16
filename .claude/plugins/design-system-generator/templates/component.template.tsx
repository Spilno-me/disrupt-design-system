/**
 * Component Template
 *
 * Replace {{ComponentName}} with your component name (PascalCase)
 * Replace {{componentName}} with camelCase version
 * Replace {{component-name}} with kebab-case version
 * Replace {{element}} with the HTML element (button, div, input, etc.)
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

// =============================================================================
// VARIANTS - Use ONLY semantic token classes
// =============================================================================

const {{componentName}}Variants = cva(
  // Base styles (always applied)
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium',
    'transition-colors duration-200',
    // Focus - REQUIRED for accessibility
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus',
    'focus-visible:ring-offset-2',
    // Disabled - REQUIRED
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      // Visual variants
      variant: {
        default: [
          'bg-interactive-primary',
          'text-inverse',
          'hover:bg-interactive-hover',
          'active:bg-interactive-active',
        ],
        secondary: [
          'bg-surface',
          'text-primary',
          'border border-default',
          'hover:bg-surface-hover',
        ],
        destructive: [
          'bg-interactive-danger',
          'text-inverse',
          'hover:bg-interactive-danger-hover',
        ],
        ghost: [
          'text-primary',
          'hover:bg-surface-hover',
        ],
        link: [
          'text-link',
          'underline-offset-4',
          'hover:underline',
        ],
      },
      // Size variants (mobile-first)
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-12 md:h-10 px-4 text-base md:text-sm', // 48px mobile, 40px desktop
        lg: 'h-14 md:h-12 px-6 text-lg md:text-base',
        icon: 'h-12 w-12 md:h-10 md:w-10',
      },
    },
    // Compound variants (optional)
    compoundVariants: [
      // Example: Large default buttons get extra font weight
      // {
      //   variant: 'default',
      //   size: 'lg',
      //   className: 'font-semibold',
      // },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

export interface {{ComponentName}}Props
  extends React.ComponentProps<'{{element}}'>,
    VariantProps<typeof {{componentName}}Variants> {
  /**
   * Render as child element (Radix Slot pattern)
   * Allows composition: <Button asChild><Link href="/">Home</Link></Button>
   */
  asChild?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * {{ComponentName}} component
 *
 * @example
 * // Default usage
 * <{{ComponentName}}>Click me</{{ComponentName}}>
 *
 * @example
 * // With variants
 * <{{ComponentName}} variant="secondary" size="lg">Large Secondary</{{ComponentName}}>
 *
 * @example
 * // As child (composition)
 * <{{ComponentName}} asChild>
 *   <a href="/home">Go home</a>
 * </{{ComponentName}}>
 */
function {{ComponentName}}({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: {{ComponentName}}Props) {
  const Comp = asChild ? Slot : '{{element}}'

  return (
    <Comp
      data-slot="{{component-name}}"
      className={cn({{componentName}}Variants({ variant, size }), className)}
      {...props}
    />
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { {{ComponentName}}, {{componentName}}Variants }
