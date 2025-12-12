import * as React from 'react'
import { AlertCircle, RefreshCw, XCircle, WifiOff } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from './button'

// =============================================================================
// ERROR STATE VARIANTS
// =============================================================================

const errorStateVariants = cva(
  'flex flex-col items-center justify-center gap-4 text-center',
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
        sm: 'gap-2 [&_svg]:size-8 [&_h3]:text-sm [&_p]:text-xs',
        md: 'gap-3 [&_svg]:size-12 [&_h3]:text-base [&_p]:text-sm',
        lg: 'gap-4 [&_svg]:size-16 [&_h3]:text-lg [&_p]:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

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
        className={cn(
          'shrink-0',
          variant === 'prominent'
            ? 'text-error'
            : variant === 'subtle'
              ? 'text-muted'
              : 'text-error'
        )}
      >
        {customIcon || <IconComponent className="shrink-0" />}
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

export { ErrorState, errorStateVariants }
