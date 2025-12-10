import { Component, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary for SearchFilter components.
 * Catches errors and displays a fallback UI.
 */
export class SearchFilterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error('[SearchFilter] Error caught by boundary:', error, errorInfo)

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div
          className={cn(
            'flex items-center justify-center gap-3 p-3',
            'bg-error-light border border-error/20 rounded-md',
            'text-sm text-error'
          )}
          role="alert"
        >
          <span>Search unavailable</span>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-2 py-1 text-xs font-medium bg-error text-inverse rounded hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
