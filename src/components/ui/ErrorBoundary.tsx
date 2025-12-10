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
 * Error boundary component to catch and handle React errors gracefully.
 * Prevents entire app from crashing when a component fails.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
