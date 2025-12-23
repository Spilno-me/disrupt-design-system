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
 * // Filled mode (subtle colored fill, works on any background)
 * <ActionTile variant="destructive" appearance="filled" onClick={onDelete}>
 *   <Trash2 className="size-8" />
 * </ActionTile>
 */

const actionTileVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    // Border thickness matches NextStepButton (1px)
    'rounded-xl border',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
    // Pressed: subtle scale for tactile feedback
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        success: [
          // Green - HARBOR colors
          // Hover: solid fill with white text (matches NextStepButton pattern)
          'border-success-strong dark:border-success text-success-strong dark:text-success',
          'hover:bg-success-strong hover:text-on-status hover:border-success-strong',
          'dark:hover:bg-success dark:hover:border-success dark:hover:text-on-status',
          // Pressed: darker shade for tactile feedback
          'active:bg-[var(--brand-harbor-700)] active:border-[var(--brand-harbor-700)] active:text-on-status',
          'dark:active:bg-[var(--brand-harbor-600)] dark:active:border-[var(--brand-harbor-600)]',
          'focus-visible:ring-success',
        ],
        info: [
          // Teal - DEEP_CURRENT colors (brand accent)
          // Use for edit/modify actions - more visible than neutral gray
          'border-accent-strong dark:border-info text-accent-strong dark:text-info',
          'hover:bg-accent-strong hover:text-on-status hover:border-accent-strong',
          'dark:hover:bg-info dark:hover:border-info dark:hover:text-on-status',
          // Pressed: darker shade for tactile feedback
          'active:bg-[var(--brand-deep-current-700)] active:border-[var(--brand-deep-current-700)] active:text-on-status',
          'dark:active:bg-[var(--brand-deep-current-400)] dark:active:border-[var(--brand-deep-current-400)]',
          'focus-visible:ring-info',
        ],
        neutral: [
          // Warm neutral - ABYSS colors (warm dark gray)
          // Hover: solid fill with white text
          'border-strong text-strong',
          'hover:bg-strong hover:text-inverse hover:border-strong',
          // Pressed: darker shade for tactile feedback
          'active:bg-[var(--brand-abyss-800)] active:border-[var(--brand-abyss-800)] active:text-inverse',
          'dark:active:bg-[var(--brand-abyss-300)] dark:active:border-[var(--brand-abyss-300)]',
          'focus-visible:ring-strong',
        ],
        destructive: [
          // Red - CORAL colors
          // Hover: solid fill with white text (matches NextStepButton pattern)
          'border-error text-error',
          'hover:bg-error hover:text-on-status hover:border-error',
          // Pressed: darker shade for tactile feedback
          'active:bg-[var(--brand-coral-700)] active:border-[var(--brand-coral-700)] active:text-on-status',
          'dark:active:bg-[var(--brand-coral-400)] dark:active:border-[var(--brand-coral-400)]',
          'focus-visible:ring-error',
        ],
      },
      appearance: {
        outline: [
          // Transparent background, colored border + icon
          'bg-transparent',
        ],
        filled: [
          // Light tinted background (matches NextStepButton default state)
        ],
      },
      size: {
        xs: 'size-8 rounded-md',    // 32px - for compact table cells
        sm: 'size-10 rounded-lg',   // 40px - for table cells
        md: 'size-12',              // 48px
        lg: 'size-16',              // 64px
        xl: 'size-20',              // 80px
      },
    },
    compoundVariants: [
      // Filled: light tinted fill at rest, solid fill on hover (NextStepButton pattern)
      {
        variant: 'success',
        appearance: 'filled',
        className: 'bg-success-light dark:bg-success/10',
      },
      {
        variant: 'info',
        appearance: 'filled',
        className: 'bg-info-light dark:bg-info/10',
      },
      {
        variant: 'neutral',
        appearance: 'filled',
        className: 'bg-surface-hover dark:bg-strong/10',
      },
      {
        variant: 'destructive',
        appearance: 'filled',
        className: 'bg-error-light dark:bg-error/10',
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
 * - `success` - Green, for positive actions (create, approve, submit)
 * - `info` - Teal, for informational actions (edit, view, modify)
 * - `neutral` - Gray, for low-emphasis actions (settings, options)
 * - `destructive` - Red, for dangerous actions (delete, remove, cancel)
 *
 * Use `appearance` to set the visual style:
 * - `outline` - Transparent bg, colored border, subtle hover fill
 * - `filled` - Subtle colored fill at rest, stronger hover effect
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
