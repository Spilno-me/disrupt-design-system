import type { Meta, StoryObj } from '@storybook/react'
import { GenericErrorPage } from './GenericErrorPage'

const meta = {
  title: 'Shared/Feedback/GenericErrorPage',
  component: GenericErrorPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A minimal, clean full-page error display for critical application errors, maintenance pages, or catastrophic failures. Features a bold red title, readable gray message, and a prominent action button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Error title',
      table: {
        defaultValue: { summary: 'Something went wrong' },
      },
    },
    message: {
      control: 'text',
      description: 'Error message',
      table: {
        defaultValue: {
          summary: 'We apologize for the inconvenience. Please try refreshing the page.',
        },
      },
    },
    buttonText: {
      control: 'text',
      description: 'Button text',
      table: {
        defaultValue: { summary: 'Refresh Page' },
      },
    },
    showButton: {
      control: 'boolean',
      description: 'Show or hide the action button',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onRetry: {
      description: 'Custom retry handler (default: window.location.reload)',
      action: 'retry',
    },
  },
} satisfies Meta<typeof GenericErrorPage>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default error page - the standard "Something went wrong" message
 */
export const Default: Story = {
  args: {},
}

/**
 * Connection error with custom message
 */
export const ConnectionError: Story = {
  args: {
    title: 'Connection Failed',
    message:
      'Unable to connect to the server. Please check your internet connection and try again.',
    buttonText: 'Try Again',
  },
}

/**
 * Authentication error requiring login
 */
export const SessionExpired: Story = {
  args: {
    title: 'Session Expired',
    message:
      'Your session has expired for security reasons. Please refresh the page to log in again.',
    buttonText: 'Refresh & Login',
  },
}

/**
 * Data load failure
 */
export const DataLoadError: Story = {
  args: {
    title: 'Failed to Load Data',
    message:
      "We couldn't load the requested information. This might be a temporary issue. Please try again.",
    buttonText: 'Reload Data',
  },
}

/**
 * Server error (500)
 */
export const ServerError: Story = {
  args: {
    title: 'Server Error',
    message:
      "We're experiencing technical difficulties. Our team has been notified and is working on a fix. Please try refreshing the page.",
    buttonText: 'Refresh Page',
  },
}

/**
 * Maintenance mode without button
 */
export const Maintenance: Story = {
  args: {
    title: 'Scheduled Maintenance',
    message:
      "We're performing scheduled maintenance to improve your experience. We'll be back at 10:00 PM EST. Thank you for your patience.",
    showButton: false,
  },
}

/**
 * System unavailable
 */
export const SystemUnavailable: Story = {
  args: {
    title: 'System Unavailable',
    message:
      'The system is temporarily unavailable. Please try again in a few minutes. If the problem persists, contact support.',
    buttonText: 'Check Again',
  },
}

/**
 * Access denied
 */
export const AccessDenied: Story = {
  args: {
    title: 'Access Denied',
    message:
      "You don't have permission to access this resource. If you believe this is an error, please contact your administrator.",
    buttonText: 'Go Back',
  },
}

/**
 * Custom styling example
 */
export const CustomStyling: Story = {
  args: {
    title: 'Custom Error',
    message: 'This example shows how you can customize the styling.',
    buttonText: 'Custom Action',
    titleClassName: 'text-purple-600',
    messageClassName: 'text-purple-500',
    buttonClassName: 'bg-purple-600 hover:bg-purple-700',
  },
}

/**
 * With custom retry handler
 */
export const WithCustomHandler: Story = {
  args: {
    title: 'Action Required',
    message: 'Click the button below to perform a custom action.',
    buttonText: 'Custom Action',
    onRetry: () => {
      alert('Custom retry handler executed!')
    },
  },
}
