import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'
import { AppCard } from './app-card'
import { Database, ServerCrash } from 'lucide-react'

const meta: Meta<typeof ErrorState> = {
  title: 'Shared/Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      // Card padding: 24px (SPACING.px.cardPadding)
      <AppCard className="w-full max-w-md p-6">
        <Story />
      </AppCard>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ErrorState>

/**
 * Default error state with retry button.
 * Use when content fails to load and user can retry.
 */
export const Default: Story = {
  args: {
    title: 'Failed to load data',
    message: 'We encountered an error while loading this content. Please try again.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

/**
 * AllStates demonstrates all variants, sizes, icons, and action combinations.
 *
 * **Variants:** subtle, default, prominent
 * **Sizes:** sm, md, lg
 * **Icons:** alert, error, network (or custom)
 *
 * **Props:**
 * - `data-slot="error-state"` for testing
 * - `role="alert"` for accessibility
 */
export const AllStates: Story = {
  render: () => (
    // Section spacing: 48px (SPACING.px.section) between major sections
    <div className="space-y-12 max-w-2xl">
      {/* Anatomy */}
      <AppCard className="p-6">
        <h3 className="text-sm font-semibold mb-4">ErrorState Anatomy</h3>
        {/* Comfortable gap: 24px between anatomy items */}
        <div className="flex items-start gap-6">
          <AppCard variant="flat" className="flex-1 p-4 border-dashed text-xs">
            {/* Tight spacing: 4px between related tree items */}
            <div className="space-y-1 text-muted">
              <div>ErrorState (root, role="alert")</div>
              <div className="ml-2">|- Icon (alert | error | network | custom)</div>
              <div className="ml-2">|- Title</div>
              <div className="ml-2">|- Message</div>
              <div className="ml-2">|- Actions (retry + secondary)</div>
            </div>
          </AppCard>
          <div className="flex-1">
            <div className="text-xs font-medium mb-2">data-slot:</div>
            <code className="text-xs text-muted">error-state, error-icon</code>
          </div>
        </div>
      </AppCard>

      {/* Variants */}
      <div>
        {/* Section title to content: 16px (base) */}
        <h3 className="text-sm font-semibold mb-4">Variants</h3>
        {/* Comfortable gap: 24px between variant cards */}
        <div className="grid gap-6">
          <AppCard className="p-6 pb-8">
            {/* Label to content: 16px (base) */}
            <p className="text-xs text-muted mb-4">subtle - minimal styling</p>
            <ErrorState
              variant="subtle"
              size="sm"
              title="No data available"
              message="The requested content could not be loaded."
              showRetry
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">default - standard error</p>
            <ErrorState
              variant="default"
              size="sm"
              title="Failed to load"
              message="Something went wrong. Please try again."
              showRetry
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">prominent - critical error</p>
            <ErrorState
              variant="prominent"
              size="sm"
              title="Critical Error"
              message="A serious error occurred. Please contact support."
              showRetry
            />
          </AppCard>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Sizes</h3>
        {/* Base gap: 16px between related cards in grid */}
        <div className="grid grid-cols-3 gap-4 items-start">
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">sm</p>
            <ErrorState size="sm" title="Error" message="Try again" showRetry />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">md (default)</p>
            <ErrorState size="md" title="Error" message="Try again" showRetry />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">lg</p>
            <ErrorState size="lg" title="Error" message="Try again" showRetry />
          </AppCard>
        </div>
      </div>

      {/* Icons */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Icons</h3>
        {/* Base gap: 16px between related icon cards */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">alert (default)</p>
            <ErrorState
              size="sm"
              icon="alert"
              title="Warning"
              message="Problem processing request"
              showRetry={false}
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">error</p>
            <ErrorState
              size="sm"
              icon="error"
              title="Error"
              message="Unexpected error"
              showRetry={false}
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">network</p>
            <ErrorState
              size="sm"
              icon="network"
              title="Connection Lost"
              message="Check internet connection"
              showRetry={false}
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">custom (Database)</p>
            <ErrorState
              size="sm"
              customIcon={<Database className="text-error" />}
              title="Database Error"
              message="Could not connect"
              showRetry={false}
            />
          </AppCard>
        </div>
      </div>

      {/* Action States */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Action Configurations</h3>
        {/* Base gap: 16px between action cards */}
        <div className="grid gap-4">
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">No actions</p>
            <ErrorState
              size="sm"
              title="Access Denied"
              message="You don't have permission"
              showRetry={false}
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">Secondary action only</p>
            <ErrorState
              size="sm"
              title="Page Not Found"
              message="The page doesn't exist"
              showRetry={false}
              secondaryAction={{ label: 'Go Home', onClick: () => {} }}
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">Both actions</p>
            <ErrorState
              size="sm"
              title="Failed to Save"
              message="Changes could not be saved"
              showRetry
              retryText="Save Again"
              secondaryAction={{ label: 'Discard', onClick: () => {} }}
            />
          </AppCard>
        </div>
      </div>

      {/* Contextual Examples */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Common Use Cases</h3>
        {/* Base gap: 16px between example cards */}
        <div className="grid gap-4">
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">API Error (prominent)</p>
            <ErrorState
              variant="prominent"
              size="sm"
              icon="error"
              title="API Request Failed"
              message="Server returned error (500). Team notified."
              showRetry
              retryText="Retry Request"
            />
          </AppCard>
          <AppCard className="p-6 pb-8">
            <p className="text-xs text-muted mb-4">File Upload Error</p>
            <ErrorState
              size="sm"
              customIcon={<ServerCrash className="text-error" />}
              title="Upload Failed"
              message="Check file size and format"
              showRetry
              secondaryAction={{ label: 'Choose Different File', onClick: () => {} }}
            />
          </AppCard>
        </div>
      </div>
    </div>
  ),
}

/**
 * Interactive retry demonstration.
 * Shows loading state during retry with attempt counter.
 */
export const InteractiveRetry: Story = {
  render: () => {
    const [isRetrying, setIsRetrying] = React.useState(false)
    const [attemptCount, setAttemptCount] = React.useState(0)

    const handleRetry = () => {
      setIsRetrying(true)
      setAttemptCount((prev) => prev + 1)

      // Simulate API retry
      setTimeout(() => {
        setIsRetrying(false)
      }, 2000)
    }

    return (
      <ErrorState
        title="Network Request Failed"
        message={
          attemptCount > 0
            ? `Failed after ${attemptCount} attempt${attemptCount > 1 ? 's' : ''}. Please try again.`
            : 'Unable to connect to the server. Please check your connection.'
        }
        icon="network"
        showRetry
        retryText="Retry"
        isRetrying={isRetrying}
        onRetry={handleRetry}
      />
    )
  },
}
