/**
 * Corrective Actions - Card Stories
 *
 * Stories for the CorrectiveActionCard component.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CorrectiveActionCard } from '../../../flow/components/corrective-actions/CorrectiveActionCard'
import { mockCorrectiveActions } from '../../../flow/data/mockCorrectiveActions'
import { TooltipProvider } from '../../../components/ui/tooltip'

const meta: Meta<typeof CorrectiveActionCard> = {
  title: 'Flow/Corrective Actions/Card',
  component: CorrectiveActionCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-[380px]">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CorrectiveActionCard>

// Get mock actions for different scenarios
const urgentAction = mockCorrectiveActions.find((a) => a.priority === 'urgent')!
const highAction = mockCorrectiveActions.find((a) => a.priority === 'high')!
const completedAction = mockCorrectiveActions.find((a) => a.status === 'completed')!
const deferredAction = mockCorrectiveActions.find((a) => a.status === 'deferred')!

export const Default: Story = {
  args: {
    action: mockCorrectiveActions[0],
    onClick: () => console.log('Card clicked'),
    onEdit: () => console.log('Edit clicked'),
    onRequestExtension: () => console.log('Extension requested'),
  },
}

export const UrgentOverdue: Story = {
  args: {
    action: urgentAction,
    onClick: () => console.log('Card clicked'),
  },
}

export const HighPriorityDueToday: Story = {
  args: {
    action: highAction,
    onClick: () => console.log('Card clicked'),
  },
}

export const Completed: Story = {
  args: {
    action: completedAction,
    onClick: () => console.log('Card clicked'),
  },
}

export const Deferred: Story = {
  args: {
    action: deferredAction,
    onClick: () => console.log('Card clicked'),
  },
}

export const AllPriorities: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-4 w-[800px]">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: () => (
    <>
      {mockCorrectiveActions.slice(0, 4).map((action) => (
        <CorrectiveActionCard
          key={action.id}
          action={action}
          onClick={() => console.log('Clicked', action.id)}
        />
      ))}
    </>
  ),
}

export const WithoutClickHandler: Story = {
  args: {
    action: mockCorrectiveActions[0],
    // No onClick - card won't be clickable
  },
}
