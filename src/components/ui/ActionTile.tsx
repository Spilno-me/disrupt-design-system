import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// =============================================================================
// LESSON LEARNED (SVG Icon Colors)
// =============================================================================
// Never rely on `currentColor` for SVG icons in hover states.
// Always explicitly target the SVG with `[&_svg]:[stroke:...]` for reliable
// color changes. This is a common gotcha in component libraries.
//
// Why: CSS `color` property inheritance through SVGs is unreliable due to:
// - SVG elements creating new stacking contexts
// - `currentColor` resolving at SVG level, not cascading from parent
// - CSS specificity battles between utility classes
//
// Solution: Use `hover:[&_svg]:[stroke:white]` instead of `hover:text-white`
// =============================================================================

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Active/pressed state colors per variant.
 * Uses primitive tokens because semantic "active" tokens don't exist.
 * These are darker shades for tactile feedback on press.
 */
const ACTIVE_STATES = {
  success: {
    light: 'active:bg-[var(--brand-harbor-700)] active:border-[var(--brand-harbor-700)]',
    dark: 'dark:active:bg-[var(--brand-harbor-600)] dark:active:border-[var(--brand-harbor-600)]',
  },
  info: {
    light: 'active:bg-[var(--brand-deep-current-700)] active:border-[var(--brand-deep-current-700)]',
    dark: 'dark:active:bg-[var(--brand-deep-current-400)] dark:active:border-[var(--brand-deep-current-400)]',
  },
  neutral: {
    light: 'active:bg-[var(--brand-abyss-700)] active:border-[var(--brand-abyss-700)]',
    dark: 'dark:active:bg-[var(--brand-abyss-300)] dark:active:border-[var(--brand-abyss-300)]',
  },
  destructive: {
    light: 'active:bg-[var(--brand-coral-700)] active:border-[var(--brand-coral-700)]',
    dark: 'dark:active:bg-[var(--brand-coral-400)] dark:active:border-[var(--brand-coral-400)]',
  },
} as const

// =============================================================================
// VARIANTS
// =============================================================================

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
    // Force white SVG icons on hover/active (overrides currentColor inheritance)
    'hover:[&_svg]:[stroke:white] active:[&_svg]:[stroke:white]',
  ],
  {
    variants: {
      variant: {
        success: [
          // Semantic: green for positive actions (create, approve, submit)
          'border-success-strong dark:border-success text-success-strong dark:text-success',
          'hover:bg-success-strong hover:border-success-strong hover:text-on-status',
          'dark:hover:bg-success dark:hover:border-success dark:hover:text-on-status',
          'active:text-on-status',
          ACTIVE_STATES.success.light,
          ACTIVE_STATES.success.dark,
          'focus-visible:ring-success',
        ],
        info: [
          // Semantic: teal for informational actions (edit, view, modify)
          'border-accent-strong dark:border-info text-accent-strong dark:text-info',
          // Using [600] for hover: DEEP_CURRENT[500] fails WCAG (2.98:1), [600] passes AA (4.47:1)
          'hover:bg-[var(--brand-deep-current-600)] hover:border-[var(--brand-deep-current-600)] hover:text-on-status',
          'dark:hover:bg-info dark:hover:border-info dark:hover:text-on-status',
          'active:text-on-status',
          ACTIVE_STATES.info.light,
          ACTIVE_STATES.info.dark,
          'focus-visible:ring-info',
        ],
        neutral: [
          // Contextual: gray for low-emphasis actions (settings, options)
          'border-strong text-secondary',
          'hover:bg-inverse-bg hover:text-on-status hover:border-inverse-bg',
          'active:text-on-status',
          ACTIVE_STATES.neutral.light,
          // Dark mode: use border-default (visible) instead of border-muted (invisible on dark bg)
          'dark:border-default dark:text-muted',
          'dark:hover:bg-muted dark:hover:border-muted dark:hover:text-on-status',
          ACTIVE_STATES.neutral.dark,
          'focus-visible:ring-muted',
        ],
        destructive: [
          // Semantic: red for dangerous actions (delete, remove, cancel)
          'border-error text-error',
          'hover:bg-error hover:border-error hover:text-on-status',
          'active:text-on-status',
          ACTIVE_STATES.destructive.light,
          ACTIVE_STATES.destructive.dark,
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
      // Filled appearance: subtle tinted background at rest
      { variant: 'success', appearance: 'filled', className: 'bg-success-light dark:bg-success/10' },
      { variant: 'info', appearance: 'filled', className: 'bg-info-light dark:bg-info/10' },
      { variant: 'neutral', appearance: 'filled', className: 'bg-subtle dark:bg-elevated' },
      { variant: 'destructive', appearance: 'filled', className: 'bg-error-light dark:bg-error/10' },
    ],
    defaultVariants: {
      variant: 'neutral',
      appearance: 'filled',  // Default: filled style with subtle tinted background
      size: 'md',
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

export interface ActionTileProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionTileVariants> {
  /** Content to render inside the tile (typically an icon) */
  children: React.ReactNode
  /** Accessible label for the action */
  'aria-label': string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActionTile - Square icon button for common actions.
 *
 * Variants: success (create), info (edit), neutral (settings), destructive (delete)
 * Appearance: outline (transparent) or filled (tinted background)
 *
 * @component ATOM
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
