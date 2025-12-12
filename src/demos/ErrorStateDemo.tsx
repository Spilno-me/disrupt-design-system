import * as React from 'react'
import { ErrorState } from '../components/ui/ErrorState'
import { Database } from 'lucide-react'

/**
 * ErrorState Component Demo
 *
 * This demo showcases the ErrorState component - a comprehensive
 * failed loading state component for the DDS design system.
 */
export function ErrorStateDemo() {
  const [isRetrying1, setIsRetrying1] = React.useState(false)
  const [isRetrying2, setIsRetrying2] = React.useState(false)
  const [isRetrying3, setIsRetrying3] = React.useState(false)

  const handleRetry = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  return (
    <div className="min-h-screen bg-page p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">ErrorState Component</h1>
          <p className="text-secondary">
            A comprehensive failed loading state component with multiple variants
          </p>
        </div>

        {/* Variants Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Variants</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Subtle */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">Subtle</h3>
              <ErrorState
                variant="subtle"
                size="sm"
                title="No data available"
                message="The requested content could not be loaded."
                showRetry
                onRetry={() => handleRetry(setIsRetrying1)}
                isRetrying={isRetrying1}
              />
            </div>

            {/* Default */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">Default</h3>
              <ErrorState
                title="Failed to load data"
                message="We encountered an error while loading this content."
                showRetry
                onRetry={() => handleRetry(setIsRetrying2)}
                isRetrying={isRetrying2}
              />
            </div>

            {/* Prominent */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">Prominent</h3>
              <ErrorState
                variant="prominent"
                title="Critical Error"
                message="A serious error occurred. Please contact support."
                showRetry
                onRetry={() => handleRetry(setIsRetrying3)}
                isRetrying={isRetrying3}
              />
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Icon Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Alert Icon */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <ErrorState
                icon="alert"
                size="sm"
                title="Warning"
                message="There was a problem processing your request."
                showRetry={false}
              />
            </div>

            {/* Error Icon */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <ErrorState
                icon="error"
                size="sm"
                title="Error"
                message="An unexpected error occurred."
                showRetry={false}
              />
            </div>

            {/* Network Icon */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <ErrorState
                icon="network"
                size="sm"
                title="Connection Lost"
                message="Please check your internet connection."
                showRetry={false}
              />
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* API Error */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">API Error</h3>
              <ErrorState
                variant="prominent"
                icon="error"
                title="API Request Failed"
                message="The server returned an error (500). Our team has been notified."
                showRetry
                retryText="Retry Request"
                onRetry={() => console.log('Retry API')}
              />
            </div>

            {/* Network Error with Custom Icon */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">Database Error</h3>
              <ErrorState
                customIcon={<Database className="text-error" />}
                title="Database Connection Failed"
                message="Could not connect to the database server."
                showRetry
                onRetry={() => console.log('Retry database')}
              />
            </div>

            {/* No Retry */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">Access Denied</h3>
              <ErrorState
                title="Access Denied"
                message="You do not have permission to view this content."
                showRetry={false}
              />
            </div>

            {/* With Secondary Action */}
            <div className="bg-surface rounded-lg p-8 border border-default">
              <h3 className="text-sm font-medium text-secondary mb-4">With Actions</h3>
              <ErrorState
                title="Failed to Save"
                message="Your changes could not be saved."
                showRetry
                retryText="Save Again"
                onRetry={() => console.log('Save again')}
                secondaryAction={{
                  label: 'Discard',
                  onClick: () => console.log('Discard'),
                }}
              />
            </div>
          </div>
        </section>

        {/* Size Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Sizes</h2>
          <div className="bg-surface rounded-lg p-12 border border-default space-y-8">
            <div>
              <p className="text-xs text-tertiary mb-2">Small</p>
              <ErrorState
                size="sm"
                title="Error loading"
                message="Please try again"
                showRetry
                onRetry={() => console.log('Retry')}
              />
            </div>
            <div>
              <p className="text-xs text-tertiary mb-2">Medium (Default)</p>
              <ErrorState
                size="md"
                title="Failed to load data"
                message="We encountered an error while loading this content."
                showRetry
                onRetry={() => console.log('Retry')}
              />
            </div>
            <div>
              <p className="text-xs text-tertiary mb-2">Large</p>
              <ErrorState
                size="lg"
                title="Something went wrong"
                message="We could not complete your request at this time. Please try again later."
                showRetry
                onRetry={() => console.log('Retry')}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
