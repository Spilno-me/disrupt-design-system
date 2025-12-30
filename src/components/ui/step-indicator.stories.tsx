/**
 * StepIndicator Stories
 *
 * Demonstrates the contrast-compliant step indicator component.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { Button } from './button'

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# StepIndicator

A reusable, WCAG AA contrast-compliant step progress indicator.

## Contrast Compliance

This component uses **bg-primary** (12:1 ratio) for active states instead of bg-accent (3.57:1),
ensuring all text inside step circles meets the **4.5:1 threshold** for normal text.

| State | Background | Text | Ratio | Status |
|-------|------------|------|-------|--------|
| Active | bg-primary | text-inverse | 12:1 | ✅ AA |
| Completed | bg-success | text-inverse | 4.5:1+ | ✅ AA |
| Pending | bg-muted-bg | text-secondary | 7:1+ | ✅ AA |

Arrow separators use **text-tertiary** (3.5:1) which passes the **3.0:1 graphics threshold**.

## Usage

\`\`\`tsx
<StepIndicator
  steps={[
    { id: 'step1', label: 'Account' },
    { id: 'step2', label: 'Profile' },
    { id: 'step3', label: 'Complete' },
  ]}
  currentStep="step2"
  completedSteps={['step1']}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    showLabels: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof StepIndicator>

// =============================================================================
// BASIC EXAMPLES
// =============================================================================

const defaultSteps = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile' },
  { id: 'review', label: 'Review' },
  { id: 'complete', label: 'Complete' },
]

export const Default: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'profile',
    completedSteps: ['account'],
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-secondary mb-4">Small (sm)</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="profile"
          completedSteps={['account']}
          size="sm"
        />
      </div>
      <div>
        <p className="text-sm text-secondary mb-4">Medium (md) - Default</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="profile"
          completedSteps={['account']}
          size="md"
        />
      </div>
      <div>
        <p className="text-sm text-secondary mb-4">Large (lg)</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="profile"
          completedSteps={['account']}
          size="lg"
        />
      </div>
    </div>
  ),
}

export const WithoutLabels: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'review',
    completedSteps: ['account', 'profile'],
    showLabels: false,
  },
}

export const Vertical: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'profile',
    completedSteps: ['account'],
    orientation: 'vertical',
  },
}

// =============================================================================
// ALL STATES
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-secondary mb-2">First Step (no completed)</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="account"
          completedSteps={[]}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-secondary mb-2">Middle Step (partial completed)</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="review"
          completedSteps={['account', 'profile']}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-secondary mb-2">Last Step (all previous completed)</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep="complete"
          completedSteps={['account', 'profile', 'review']}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-secondary mb-2">All Completed</p>
        <StepIndicator
          steps={defaultSteps}
          currentStep=""
          completedSteps={['account', 'profile', 'review', 'complete']}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All step indicator states displayed together for visual comparison.',
      },
    },
  },
}

// =============================================================================
// INDIVIDUAL STATES
// =============================================================================

export const FirstStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'account',
    completedSteps: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'First step active, no completed steps.',
      },
    },
  },
}

export const MiddleStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'review',
    completedSteps: ['account', 'profile'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Middle step active with previous steps completed.',
      },
    },
  },
}

export const LastStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 'complete',
    completedSteps: ['account', 'profile', 'review'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Final step active, all previous steps completed.',
      },
    },
  },
}

export const AllCompleted: Story = {
  args: {
    steps: defaultSteps,
    currentStep: '',
    completedSteps: ['account', 'profile', 'review', 'complete'],
  },
  parameters: {
    docs: {
      description: {
        story: 'All steps marked as completed.',
      },
    },
  },
}

// =============================================================================
// INTERACTIVE DEMO
// =============================================================================

function InteractiveDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const steps = defaultSteps

  const completedSteps = steps.slice(0, currentIndex).map((s) => s.id)
  const currentStep = steps[currentIndex]?.id || ''

  const handleNext = () => {
    if (currentIndex < steps.length) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleStepClick = (stepId: string) => {
    const index = steps.findIndex((s) => s.id === stepId)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }

  return (
    <div className="space-y-8 w-full max-w-lg">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex >= steps.length}
        >
          {currentIndex >= steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>

      <p className="text-center text-sm text-secondary">
        Click completed steps to navigate back. Current: {currentStep || 'All done!'}
      </p>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing step navigation. Click completed steps to go back.',
      },
    },
  },
}

// =============================================================================
// REAL-WORLD EXAMPLES
// =============================================================================

export const UserOnboarding: Story = {
  args: {
    steps: [
      { id: 'password', label: 'Set Password' },
      { id: 'profile', label: 'Profile' },
      { id: 'emergency', label: 'Emergency Contact' },
      { id: 'terms', label: 'Accept Terms' },
    ],
    currentStep: 'emergency',
    completedSteps: ['password', 'profile'],
  },
  parameters: {
    docs: {
      description: {
        story: 'User activation flow with 4 steps.',
      },
    },
  },
}

export const AdminInvitation: Story = {
  args: {
    steps: [
      { id: 'form', label: 'Fill Form' },
      { id: 'sending', label: 'Sending' },
      { id: 'sent', label: 'Email Sent' },
    ],
    currentStep: 'sent',
    completedSteps: ['form', 'sending'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Admin invitation flow with 3 steps.',
      },
    },
  },
}

export const CheckoutFlow: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Cart' },
      { id: 'shipping', label: 'Shipping' },
      { id: 'payment', label: 'Payment' },
      { id: 'confirm', label: 'Confirm' },
    ],
    currentStep: 'payment',
    completedSteps: ['cart', 'shipping'],
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'E-commerce checkout flow.',
      },
    },
  },
}
