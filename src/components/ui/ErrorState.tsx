import * as React from 'react'
import { AlertCircle, RefreshCw, XCircle, WifiOff } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from './button'

/**
 * ErrorState - Visual feedback component for error conditions.
 *
 * @component ATOM
 *
 * @description
 * Displays error states when content fails to load or operations fail.
 * Supports different visual variants, predefined/custom icons, and
 * retry functionality. Use as fallback UI for ErrorBoundary.
 *
 * @example
 * ```tsx
 * // Basic error state
 * <ErrorState
 *   title="Failed to load"
 *   message="Please try again"
 *   onRetry={() => refetch()}
 * />
 *
 * // Network error
 * <ErrorState
 *   icon="network"
 *   title="Connection Lost"
 *   message="Check your internet connection"
 *   onRetry={reconnect}
 * />
 *
 * // Prominent error (critical)
 * <ErrorState
 *   variant="prominent"
 *   title="Critical Error"
 *   message="Contact support"
 *   showRetry={false}
 * />
 *
 * // With secondary action
 * <ErrorState
 *   title="Page Not Found"
 *   showRetry={false}
 *   secondaryAction={{ label: "Go Home", onClick: goHome }}
 * />
 * ```
 *
 * @testid
 * - `data-slot="error-state"` - Root container (has role="alert")
 *
 * @accessibility
 * - role="alert" for screen reader announcements
 * - aria-live="polite" for dynamic updates
 */

const errorStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      variant: {
        // Subtle - Minimal styling, blends in
        subtle: 'text-secondary',
        // Default - Standard error state
        default: 'text-primary',
        // Prominent - More visible, bordered container
        prominent: 'bg-error-light border border-error-muted rounded-lg p-8',
      },
      size: {
        // Spacing: base (16px) for sm, comfortable (24px) for md/lg
        sm: 'gap-4 [&_h3]:text-sm [&_p]:text-xs',
        md: 'gap-6 [&_h3]:text-base [&_p]:text-sm',
        lg: 'gap-6 [&_h3]:text-lg [&_p]:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Icon size classes per ErrorState size
const iconSizeClasses = {
  sm: 'size-8',   // 32px
  md: 'size-12',  // 48px
  lg: 'size-16',  // 64px
} as const

// =============================================================================
// ICON MAPPING
// =============================================================================

const iconMap = {
  alert: AlertCircle,
  error: XCircle,
  network: WifiOff,
} as const

type IconType = keyof typeof iconMap

// =============================================================================
// ERROR STATE COMPONENT
// =============================================================================

export interface ErrorStateProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof errorStateVariants> {
  /** Icon to display - defaults to 'alert' */
  icon?: IconType
  /** Custom icon component (overrides icon prop) */
  customIcon?: React.ReactNode
  /** Main error title */
  title?: string
  /** Detailed error message */
  message?: string
  /** Show retry button */
  showRetry?: boolean
  /** Retry button text */
  retryText?: string
  /** Retry button click handler */
  onRetry?: () => void
  /** Show a secondary action button */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Loading state for retry button */
  isRetrying?: boolean
}

function ErrorState({
  className,
  variant,
  size,
  icon = 'alert',
  customIcon,
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  showRetry = true,
  retryText = 'Try again',
  onRetry,
  secondaryAction,
  isRetrying = false,
  ...props
}: ErrorStateProps) {
  const IconComponent = iconMap[icon]

  return (
    <div
      data-slot="error-state"
      className={cn(errorStateVariants({ variant, size }), className)}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Error Icon */}
      <div
        data-slot="error-icon"
        className={cn(
          'shrink-0',
          variant === 'prominent'
            ? 'text-error'
            : variant === 'subtle'
              ? 'text-muted'
              : 'text-error'
        )}
      >
        {customIcon || <IconComponent className={cn('shrink-0', iconSizeClasses[size || 'md'])} />}
      </div>

      {/* Error Content */}
      <div className="space-y-2">
        {title && (
          <h3
            className={cn(
              'font-semibold',
              variant === 'prominent' ? 'text-error' : 'text-primary'
            )}
          >
            {title}
          </h3>
        )}
        {message && (
          <p
            className={cn(
              variant === 'prominent'
                ? 'text-secondary'
                : variant === 'subtle'
                  ? 'text-tertiary'
                  : 'text-secondary'
            )}
          >
            {message}
          </p>
        )}
      </div>

      {/* Actions */}
      {(showRetry || secondaryAction) && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {showRetry && (
            <Button
              variant={variant === 'prominent' ? 'destructive' : 'default'}
              size={size === 'lg' ? 'default' : size === 'sm' ? 'sm' : 'default'}
              onClick={onRetry}
              disabled={isRetrying}
              className="gap-2 overflow-hidden"
            >
              <RefreshCw
                className={cn('size-4 shrink-0', isRetrying && 'animate-spin')}
              />
              {retryText}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size={size === 'lg' ? 'default' : size === 'sm' ? 'sm' : 'default'}
              onClick={secondaryAction.onClick}
              disabled={isRetrying}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

ErrorState.displayName = 'ErrorState'

export { ErrorState, errorStateVariants }
