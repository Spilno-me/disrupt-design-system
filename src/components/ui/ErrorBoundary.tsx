import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Fallback UI to show when error occurs */
  fallback?: ReactNode
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Component name for error logging */
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary - Catches and handles React errors gracefully.
 *
 * @component ATOM (class component for error catching)
 *
 * @description
 * Error boundaries catch JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI instead of crashing the whole app.
 * Must be a class component as React hooks don't support error boundaries.
 *
 * @example
 * ```tsx
 * // Basic usage with fallback
 * <ErrorBoundary fallback={<ErrorState title="Something went wrong" />}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With error callback for logging
 * <ErrorBoundary
 *   componentName="Dashboard"
 *   fallback={<ErrorState />}
 *   onError={(error, info) => logToService(error, info)}
 * >
 *   <Dashboard />
 * </ErrorBoundary>
 *
 * // Silent failure (no UI)
 * <ErrorBoundary fallback={null}>
 *   <OptionalWidget />
 * </ErrorBoundary>
 * ```
 *
 * @testid
 * No data-slot (class component wraps children, no DOM element of its own).
 * Test by throwing errors in child components.
 *
 * @accessibility
 * - Use meaningful fallback UI for screen readers
 * - Consider aria-live regions in fallback for error announcements
 *
 * @see CanvasErrorBoundary - Silent failure for visual components
 * @see SectionErrorBoundary - Placeholder for section failures
 * @see ErrorState - Recommended fallback component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary'
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, componentName } = this.props

    // Log error with component context
    console.error(
      `[ErrorBoundary${componentName ? `: ${componentName}` : ''}] Caught error:`,
      error,
      errorInfo
    )

    // Call optional error callback
    onError?.(error, errorInfo)
  }

  render(): ReactNode {
    const { hasError } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Return fallback UI or null (silent failure)
      return fallback ?? null
    }

    return children
  }
}

/**
 * Error boundary specifically for canvas/visual components.
 * Shows nothing on failure (graceful degradation).
 */
export function CanvasErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      componentName="Canvas"
      fallback={null}
      onError={(error) => {
        console.warn('Canvas rendering failed, showing fallback:', error.message)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for section components.
 * Shows a minimal placeholder on failure.
 */
export function SectionErrorBoundary({
  children,
  sectionName,
}: {
  children: ReactNode
  sectionName: string
}) {
  return (
    <ErrorBoundary
      componentName={sectionName}
      fallback={
        <div className="py-16 text-center text-disabled">
          <p>Unable to load section</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
