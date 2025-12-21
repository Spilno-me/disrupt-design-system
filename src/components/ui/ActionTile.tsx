import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * ActionTile - Square icon button for common actions (create, edit, delete)
 *
 * @example
 * // Outline mode (for dark backgrounds)
 * <ActionTile variant="success" onClick={onCreate}>
 *   <Rocket className="size-8" />
 * </ActionTile>
 *
 * @example
 * // Filled mode (for light backgrounds)
 * <ActionTile variant="destructive" appearance="filled" onClick={onDelete}>
 *   <Trash2 className="size-8" />
 * </ActionTile>
 */

const actionTileVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    'rounded-xl border-2',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        success: [
          // Green - HARBOR colors
          'border-success text-success',
          'focus-visible:ring-success',
        ],
        neutral: [
          // Gray - SLATE colors
          'border-default text-secondary',
          'focus-visible:ring-default',
        ],
        destructive: [
          // Red - CORAL colors
          'border-error text-error',
          'focus-visible:ring-error',
        ],
      },
      appearance: {
        outline: [
          // Transparent background, colored border + icon
          'bg-transparent',
        ],
        filled: [
          // Light tinted background
        ],
      },
      size: {
        sm: 'size-12',
        md: 'size-16',
        lg: 'size-20',
      },
    },
    compoundVariants: [
      // Filled backgrounds per variant
      {
        variant: 'success',
        appearance: 'filled',
        className: 'bg-success-light hover:bg-success-muted',
      },
      {
        variant: 'neutral',
        appearance: 'filled',
        className: 'bg-surface hover:bg-muted',
      },
      {
        variant: 'destructive',
        appearance: 'filled',
        className: 'bg-error-light hover:bg-error-muted',
      },
      // Outline hover states
      {
        variant: 'success',
        appearance: 'outline',
        className: 'hover:bg-success/10',
      },
      {
        variant: 'neutral',
        appearance: 'outline',
        className: 'hover:bg-default/10',
      },
      {
        variant: 'destructive',
        appearance: 'outline',
        className: 'hover:bg-error/10',
      },
    ],
    defaultVariants: {
      variant: 'neutral',
      appearance: 'outline',
      size: 'md',
    },
  }
)

export interface ActionTileProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionTileVariants> {
  /** Content to render inside the tile (typically an icon) */
  children: React.ReactNode
  /** Accessible label for the action */
  'aria-label': string
}

/**
 * ActionTile - Square icon button for common actions
 *
 * Use `variant` to set the semantic color:
 * - `success` - Green, for positive actions (create, approve, complete)
 * - `neutral` - Gray, for neutral actions (edit, view, settings)
 * - `destructive` - Red, for dangerous actions (delete, remove, cancel)
 *
 * Use `appearance` to set the visual style:
 * - `outline` - Transparent bg with colored border (for dark backgrounds)
 * - `filled` - Tinted background with colored border (for light backgrounds)
 */
const ActionTile = React.forwardRef<HTMLButtonElement, ActionTileProps>(
  ({ className, variant, appearance, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="action-tile"
        className={cn(actionTileVariants({ variant, appearance, size }), className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ActionTile.displayName = 'ActionTile'

export { ActionTile, actionTileVariants }
