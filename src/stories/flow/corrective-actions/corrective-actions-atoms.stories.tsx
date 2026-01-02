/**
 * Corrective Actions - Atom Components Stories
 *
 * Stories for status badge, priority indicator, and due date display atoms.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CorrectiveActionStatusBadge } from '../../../flow/components/corrective-actions/CorrectiveActionStatusBadge'
import { PriorityIndicator } from '../../../flow/components/corrective-actions/PriorityIndicator'
import { DueDateDisplay } from '../../../flow/components/corrective-actions/DueDateDisplay'
import type { CorrectiveActionStatus, CorrectiveActionPriority } from '../../../flow/components/corrective-actions/types'

// =============================================================================
// STATUS BADGE STORIES
// =============================================================================

const statusMeta: Meta<typeof CorrectiveActionStatusBadge> = {
  title: 'Flow/Corrective Actions/Atoms/StatusBadge',
  component: CorrectiveActionStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default statusMeta
type StatusStory = StoryObj<typeof CorrectiveActionStatusBadge>

export const AllStatuses: StatusStory = {
  render: () => {
    const statuses: CorrectiveActionStatus[] = [
      'assigned',
      'in-progress',
      'pending-approval',
      'completed',
      'closed',
      'deferred',
    ]
    return (
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <CorrectiveActionStatusBadge key={status} status={status} />
        ))}
      </div>
    )
  },
}

export const Sizes: StatusStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <CorrectiveActionStatusBadge status="in-progress" size="sm" />
      <CorrectiveActionStatusBadge status="in-progress" size="default" />
      <CorrectiveActionStatusBadge status="in-progress" size="lg" />
    </div>
  ),
}

export const WithoutIcon: StatusStory = {
  render: () => (
    <CorrectiveActionStatusBadge status="completed" showIcon={false} />
  ),
}

// =============================================================================
// PRIORITY INDICATOR STORIES
// =============================================================================

export const AllPriorities: StoryObj<typeof PriorityIndicator> = {
  render: () => {
    const priorities: CorrectiveActionPriority[] = ['low', 'medium', 'high', 'urgent']
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {priorities.map((priority) => (
            <PriorityIndicator key={priority} priority={priority} />
          ))}
        </div>
      </div>
    )
  },
}

export const PriorityVariants: StoryObj<typeof PriorityIndicator> = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-secondary mb-2">Badge (default)</p>
        <div className="flex gap-3">
          <PriorityIndicator priority="urgent" variant="badge" />
          <PriorityIndicator priority="high" variant="badge" />
        </div>
      </div>
      <div>
        <p className="text-sm text-secondary mb-2">Dot</p>
        <div className="flex gap-4">
          <PriorityIndicator priority="urgent" variant="dot" />
          <PriorityIndicator priority="high" variant="dot" />
        </div>
      </div>
      <div>
        <p className="text-sm text-secondary mb-2">Bar</p>
        <div className="flex gap-4">
          <PriorityIndicator priority="low" variant="bar" />
          <PriorityIndicator priority="medium" variant="bar" />
          <PriorityIndicator priority="high" variant="bar" />
          <PriorityIndicator priority="urgent" variant="bar" />
        </div>
      </div>
    </div>
  ),
}

// =============================================================================
// DUE DATE DISPLAY STORIES
// =============================================================================

export const DueDateStates: StoryObj<typeof DueDateDisplay> = {
  render: () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-secondary mb-2">Future</p>
          <DueDateDisplay dueDate={nextWeek} status="assigned" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-2">Tomorrow</p>
          <DueDateDisplay dueDate={tomorrow} status="in-progress" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-2">Today</p>
          <DueDateDisplay dueDate={today} status="in-progress" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-2">Overdue (1 day)</p>
          <DueDateDisplay dueDate={yesterday} status="assigned" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-2">Overdue (7 days)</p>
          <DueDateDisplay dueDate={lastWeek} status="in-progress" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-2">Completed</p>
          <DueDateDisplay dueDate={yesterday} status="completed" />
        </div>
      </div>
    )
  },
}

export const DueDateFormats: StoryObj<typeof DueDateDisplay> = {
  render: () => {
    const date = new Date()
    date.setDate(date.getDate() + 3)

    return (
      <div className="space-y-3">
        <div>
          <p className="text-sm text-secondary mb-1">Date format</p>
          <DueDateDisplay dueDate={date} status="assigned" format="date" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-1">Relative format</p>
          <DueDateDisplay dueDate={date} status="assigned" format="relative" />
        </div>
        <div>
          <p className="text-sm text-secondary mb-1">Both formats</p>
          <DueDateDisplay dueDate={date} status="assigned" format="both" />
        </div>
      </div>
    )
  },
}
