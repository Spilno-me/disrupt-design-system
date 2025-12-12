import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'
import { Database, ServerCrash } from 'lucide-react'

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays error states when content fails to load. Supports different variants, icons, and retry functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['subtle', 'default', 'prominent'],
      description: 'Visual style of the error state',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the error state',
    },
    icon: {
      control: 'select',
      options: ['alert', 'error', 'network'],
      description: 'Predefined icon to display',
    },
    title: {
      control: 'text',
      description: 'Main error title',
    },
    message: {
      control: 'text',
      description: 'Detailed error message',
    },
    showRetry: {
      control: 'boolean',
      description: 'Show retry button',
    },
    retryText: {
      control: 'text',
      description: 'Text for retry button',
    },
    isRetrying: {
      control: 'boolean',
      description: 'Loading state for retry button',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-8 bg-page rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ErrorState>

// =============================================================================
// BASIC VARIANTS
// =============================================================================

export const Default: Story = {
  args: {
    title: 'Failed to load data',
    message: 'We encountered an error while loading this content. Please try again.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    title: 'No data available',
    message: 'The requested content could not be loaded.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const Prominent: Story = {
  args: {
    variant: 'prominent',
    title: 'Critical Error',
    message: 'A serious error occurred. Please contact support if this persists.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

// =============================================================================
// SIZES
// =============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Error loading',
    message: 'Please try again',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    title: 'Failed to load data',
    message: 'We encountered an error while loading this content.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Something went wrong',
    message: 'We could not complete your request at this time. Please try again later.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

// =============================================================================
// ICONS
// =============================================================================

export const AlertIcon: Story = {
  args: {
    icon: 'alert',
    title: 'Warning',
    message: 'There was a problem processing your request.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const ErrorIcon: Story = {
  args: {
    icon: 'error',
    title: 'Error',
    message: 'An unexpected error occurred.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

export const NetworkError: Story = {
  args: {
    icon: 'network',
    title: 'Connection Lost',
    message: 'Please check your internet connection and try again.',
    showRetry: true,
    retryText: 'Reconnect',
    onRetry: () => console.log('Reconnect clicked'),
  },
}

export const CustomIcon: Story = {
  args: {
    customIcon: <Database className="text-error" />,
    title: 'Database Error',
    message: 'Could not connect to the database. Please contact your administrator.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

// =============================================================================
// STATES
// =============================================================================

export const NoRetryButton: Story = {
  args: {
    title: 'Access Denied',
    message: 'You do not have permission to view this content.',
    showRetry: false,
  },
}

export const WithSecondaryAction: Story = {
  args: {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    showRetry: false,
    secondaryAction: {
      label: 'Go Home',
      onClick: () => console.log('Go Home clicked'),
    },
  },
}

export const WithBothActions: Story = {
  args: {
    title: 'Failed to Save',
    message: 'Your changes could not be saved. Please try again or discard changes.',
    showRetry: true,
    retryText: 'Save Again',
    onRetry: () => console.log('Save Again clicked'),
    secondaryAction: {
      label: 'Discard',
      onClick: () => console.log('Discard clicked'),
    },
  },
}

export const Retrying: Story = {
  args: {
    title: 'Connection Timeout',
    message: 'The server took too long to respond.',
    showRetry: true,
    isRetrying: true,
    onRetry: () => console.log('Retry clicked'),
  },
}

// =============================================================================
// CONTEXTUAL EXAMPLES
// =============================================================================

export const APIError: Story = {
  args: {
    variant: 'prominent',
    icon: 'error',
    title: 'API Request Failed',
    message: 'The server returned an error (500). Our team has been notified.',
    showRetry: true,
    retryText: 'Retry Request',
    onRetry: () => console.log('Retry API request'),
  },
}

export const FileUploadError: Story = {
  args: {
    customIcon: <ServerCrash className="text-error" />,
    title: 'Upload Failed',
    message: 'The file could not be uploaded. Please check the file size and format.',
    showRetry: true,
    retryText: 'Try Again',
    secondaryAction: {
      label: 'Choose Different File',
      onClick: () => console.log('Choose file clicked'),
    },
    onRetry: () => console.log('Retry upload'),
  },
}

export const EmptyState: Story = {
  args: {
    variant: 'subtle',
    icon: 'alert',
    title: 'No Results Found',
    message: 'Try adjusting your search or filters.',
    showRetry: false,
    secondaryAction: {
      label: 'Clear Filters',
      onClick: () => console.log('Clear filters clicked'),
    },
  },
}

// =============================================================================
// INTERACTIVE EXAMPLE
// =============================================================================

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
