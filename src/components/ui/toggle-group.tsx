/**
 * ToggleGroup - A set of toggle buttons
 *
 * Based on Radix UI ToggleGroup with DDS styling
 */

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// =============================================================================
// TOGGLE GROUP
// =============================================================================

const toggleGroupVariants = cva(
  'inline-flex items-center rounded-lg bg-muted-bg p-1 gap-1',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

type ToggleGroupProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof toggleGroupVariants>

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ size }), className)}
    {...props}
  />
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

// =============================================================================
// TOGGLE GROUP ITEM
// =============================================================================

const toggleGroupItemVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all',
    'text-secondary hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-surface data-[state=on]:text-primary data-[state=on]:shadow-sm',
  ],
  {
    variants: {
      size: {
        default: 'h-8 px-3',
        sm: 'h-7 px-2.5',
        lg: 'h-9 px-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> &
  VariantProps<typeof toggleGroupItemVariants>

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupItemVariants({ size }), className)}
    {...props}
  />
))
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants }
export type { ToggleGroupProps, ToggleGroupItemProps }
