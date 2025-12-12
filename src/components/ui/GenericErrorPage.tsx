/**
 * Generic Error Page Component
 * Minimal, clean full-page error display for critical application errors
 */

import * as React from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface GenericErrorPageProps {
  /** Error title (default: "Something went wrong") */
  title?: string
  /** Error message (default: "We apologize for the inconvenience...") */
  message?: string
  /** Button text (default: "Refresh Page") */
  buttonText?: string
  /** Custom retry handler (default: window.location.reload) */
  onRetry?: () => void
  /** Show button (default: true) */
  showButton?: boolean
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the title */
  titleClassName?: string
  /** Additional CSS classes for the message */
  messageClassName?: string
  /** Additional CSS classes for the button */
  buttonClassName?: string
}

// =============================================================================
// GENERIC ERROR PAGE COMPONENT
// =============================================================================

/**
 * GenericErrorPage - Minimal full-page error display
 *
 * A clean, centered error page component designed for critical application errors,
 * maintenance pages, or catastrophic failures. Features a bold red title, readable
 * gray message, and a prominent action button.
 *
 * @example
 * ```tsx
 * // Basic usage - shows default "Something went wrong"
 * <GenericErrorPage />
 *
 * // Custom error
 * <GenericErrorPage
 *   title="Connection Failed"
 *   message="Unable to connect to the server. Please check your internet connection."
 *   buttonText="Try Again"
 *   onRetry={handleRetry}
 * />
 *
 * // Error without button
 * <GenericErrorPage
 *   title="Maintenance Mode"
 *   message="The system is currently undergoing maintenance. Please check back later."
 *   showButton={false}
 * />
 * ```
 */
export const GenericErrorPage = React.forwardRef<
  HTMLDivElement,
  GenericErrorPageProps
>(
  (
    {
      title = 'Something went wrong',
      message = 'We apologize for the inconvenience. Please try refreshing the page.',
      buttonText = 'Refresh Page',
      onRetry,
      showButton = true,
      className,
      titleClassName,
      messageClassName,
      buttonClassName,
    },
    ref
  ) => {
    const handleRetry = () => {
      if (onRetry) {
        onRetry()
      } else {
        window.location.reload()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex items-center justify-center bg-page px-4',
          className
        )}
      >
        <div className="max-w-xl w-full text-center space-y-6">
          {/* Error Title */}
          <h1
            className={cn(
              'text-3xl font-bold text-error',
              titleClassName
            )}
          >
            {title}
          </h1>

          {/* Error Message */}
          <p
            className={cn(
              'text-lg text-secondary leading-relaxed',
              messageClassName
            )}
          >
            {message}
          </p>

          {/* Refresh Button */}
          {showButton && (
            <button
              onClick={handleRetry}
              className={cn(
                'inline-flex items-center justify-center px-6 py-3',
                'bg-inverse-bg text-inverse text-base font-medium rounded-lg',
                'hover:bg-inverse-bg/90 active:bg-inverse-bg',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                buttonClassName
              )}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    )
  }
)

GenericErrorPage.displayName = 'GenericErrorPage'

export default GenericErrorPage
