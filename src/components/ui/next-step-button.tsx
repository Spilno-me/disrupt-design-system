/**
 * NextStepButton Component
 *
 * A severity-coded navigation button used in workflow progression.
 * Uses semantic severity colors that adapt to light/dark themes.
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=464-12469
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export type NextStepSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

// =============================================================================
// PLAY ICON COMPONENT
// =============================================================================

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5.5 3.5L12.5 8L5.5 12.5V3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// SEVERITY STYLING
// =============================================================================

/**
 * Severity color classes with WCAG AA contrast compliance.
 *
 * Light theme: Uses darker shades (600-700) for 4.5:1+ contrast on white/cream
 * Dark theme: Uses lighter shades (400-500) for 4.5:1+ contrast on dark (ABYSS)
 *
 * Token strategy:
 * - `error` token auto-switches (CORAL[600] light → CORAL[400] dark)
 * - Other severities use `dark:` prefix since -dark/-strong variants don't auto-switch
 * - Hover text uses `text-on-status` (always white) for colored backgrounds
 *
 * Each severity defines:
 * - border: Outline color (default state)
 * - text: Text/icon color (default state)
 * - hoverBg: Fill color on hover
 * - hoverText: Text color on hover fill
 * - accentLine: Bottom accent stripe
 */
const severityClasses: Record<
  NextStepSeverity,
  {
    border: string
    text: string
    hoverBg: string
    hoverText: string
    accentLine: string
  }
> = {
  critical: {
    // error token auto-switches: CORAL[600] light (4.83:1) → CORAL[400] dark (5.92:1)
    border: 'border-error',
    text: 'text-error',
    hoverBg: 'group-hover:bg-error',
    hoverText: 'group-hover:text-on-status',
    accentLine: 'bg-error',
  },
  high: {
    // Light: aging-dark = ORANGE[600] (5.18:1) | Dark: aging = ORANGE[400] (5.85:1)
    border: 'border-aging-dark dark:border-aging',
    text: 'text-aging-dark dark:text-aging',
    hoverBg: 'group-hover:bg-aging-dark dark:group-hover:bg-aging',
    hoverText: 'group-hover:text-on-status',
    accentLine: 'bg-aging-dark dark:bg-aging',
  },
  medium: {
    // Light: warning-dark = SUNRISE[700] (4.92:1) | Dark: warning = SUNRISE[400] (8.54:1)
    border: 'border-warning-dark dark:border-warning',
    text: 'text-warning-dark dark:text-warning',
    hoverBg: 'group-hover:bg-warning-dark dark:group-hover:bg-warning',
    hoverText: 'group-hover:text-on-status',
    accentLine: 'bg-warning-dark dark:bg-warning',
  },
  low: {
    // Light: success-strong = HARBOR[700] (5.02:1) | Dark: success = HARBOR[400] (7.19:1)
    border: 'border-success-strong dark:border-success',
    text: 'text-success-strong dark:text-success',
    hoverBg: 'group-hover:bg-success-strong dark:group-hover:bg-success',
    hoverText: 'group-hover:text-on-status',
    accentLine: 'bg-success-strong dark:bg-success',
  },
  none: {
    // Light: teal = DEEP_CURRENT[700] (7.02:1) | Dark: accent-strong = DEEP_CURRENT[400] (5.50:1)
    border: 'border-teal dark:border-accent-strong',
    text: 'text-teal dark:text-accent-strong',
    hoverBg: 'group-hover:bg-teal dark:group-hover:bg-accent-strong',
    hoverText: 'group-hover:text-on-status',
    accentLine: 'bg-teal dark:bg-accent-strong',
  },
}

// =============================================================================
// CVA VARIANTS
// =============================================================================

const nextStepButtonVariants = cva(
  // Base styles
  [
    'group relative inline-flex items-center',
    'font-sans text-xs font-medium',
    'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

// =============================================================================
// COMPONENT
// =============================================================================

export interface NextStepButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof nextStepButtonVariants> {
  /** Severity level determines the color scheme */
  severity?: NextStepSeverity
  /** Custom label text */
  children?: React.ReactNode
}

/**
 * NextStepButton - Severity-coded workflow navigation button
 *
 * Used in EHS compliance workflows to indicate next actions with
 * severity-appropriate color coding. Adapts to light/dark themes
 * with WCAG AA compliant contrast ratios.
 *
 * @example
 * ```tsx
 * // Severity variants
 * <NextStepButton severity="critical" />
 * <NextStepButton severity="high" />
 * <NextStepButton severity="medium" />
 * <NextStepButton severity="low" />
 * <NextStepButton severity="none" />
 *
 * // With custom label
 * <NextStepButton severity="high">Continue</NextStepButton>
 *
 * // Sizes
 * <NextStepButton severity="low" size="sm" />
 * <NextStepButton severity="none" size="lg" />
 * ```
 */
const NextStepButton = React.forwardRef<HTMLButtonElement, NextStepButtonProps>(
  (
    {
      className,
      severity = 'none',
      size,
      children = 'Next Step',
      disabled,
      ...props
    },
    ref
  ) => {
    const colors = severityClasses[severity]

    return (
      <button
        ref={ref}
        type="button"
        data-slot="next-step-button"
        data-severity={severity}
        disabled={disabled}
        className={cn(nextStepButtonVariants({ size }), className)}
        {...props}
      >
        {/* Main button container with border */}
        <span
          data-slot="next-step-button-container"
          className={cn(
            'inline-flex items-center rounded-md border bg-transparent transition-colors duration-200',
            colors.border,
            colors.hoverBg,
            size === 'sm' && 'h-8',
            size === 'md' && 'h-9',
            size === 'lg' && 'h-10'
          )}
        >
          {/* Text section */}
          <span
            data-slot="next-step-button-label"
            className={cn(
              'px-3 transition-colors duration-200',
              colors.text,
              colors.hoverText
            )}
          >
            {children}
          </span>

          {/* Vertical divider */}
          <span
            data-slot="next-step-button-divider"
            className={cn(
              'w-px h-5 transition-colors duration-200',
              colors.border.replace('border-', 'bg-'),
              'group-hover:bg-current group-hover:opacity-30'
            )}
            aria-hidden="true"
          />

          {/* Icon section */}
          <span
            data-slot="next-step-button-icon"
            className={cn(
              'flex items-center justify-center w-8 transition-colors duration-200',
              colors.text,
              colors.hoverText
            )}
          >
            <PlayIcon />
          </span>
        </span>

        {/* Bottom accent line */}
        <span
          data-slot="next-step-button-accent"
          className={cn(
            'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full',
            colors.accentLine
          )}
          aria-hidden="true"
        />
      </button>
    )
  }
)

NextStepButton.displayName = 'NextStepButton'

// =============================================================================
// EXPORTS
// =============================================================================

export { NextStepButton, nextStepButtonVariants }
