/**
 * StepsPage Stories
 *
 * Stories for the Steps page where users view and manage
 * tasks/steps from different incidents.
 *
 * Mock data imported from API seed layer (single source of truth).
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StepsPage } from './StepsPage'
import { seedMySteps, seedTeamSteps, generateManySteps } from '@/api'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof StepsPage> = {
  title: 'Flow/StepsPage',
  component: StepsPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Steps Page displays tasks/steps from different incidents that require user attention.

## Features
- **Tab Navigation**: Switch between "My Steps" and "Team Steps"
- **Search & Filters**: Search by text, filter by severity and status
- **Expandable Rows**: Click to expand and see step description
- **Next Step Button**: Navigates to the linked incident's overview page
- **Aging Indicator**: Visual indicator of how long the step has been open
- **Pagination**: Navigate through large lists of steps

## Usage
\`\`\`tsx
<StepsPage
  mySteps={mySteps}
  teamSteps={teamSteps}
  onNextStep={(step) => navigate(\`/incidents/\${step.incidentDbId}\`)}
  onIncidentClick={(dbId, id) => navigate(\`/incidents/\${dbId}\`)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'radio',
      options: ['my-steps', 'team-steps'],
    },
    defaultPageSize: {
      control: { type: 'select' },
      options: [5, 10, 25, 50],
    },
    isLoading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof StepsPage>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view with My Steps tab active
 */
export const Default: Story = {
  args: {
    mySteps: seedMySteps,
    teamSteps: seedTeamSteps,
    activeTab: 'my-steps',
  },
}

/**
 * Team Steps tab active
 */
export const TeamSteps: Story = {
  args: {
    mySteps: seedMySteps,
    teamSteps: seedTeamSteps,
    activeTab: 'team-steps',
  },
}

/**
 * Empty state - no steps to display
 */
export const EmptyState: Story = {
  args: {
    mySteps: [],
    teamSteps: [],
    activeTab: 'my-steps',
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    mySteps: seedMySteps,
    teamSteps: seedTeamSteps,
    isLoading: true,
  },
}

/**
 * With interactive handlers
 */
export const Interactive: Story = {
  args: {
    mySteps: seedMySteps,
    teamSteps: seedTeamSteps,
    onNextStep: (step) => {
      console.log('Next step clicked:', step)
      alert(`Navigating to incident: ${step.incidentId}`)
    },
    onIncidentClick: (dbId, incidentId) => {
      console.log('Incident clicked:', { dbId, incidentId })
      alert(`Opening incident: ${incidentId}`)
    },
    onAssigneeClick: (person) => {
      console.log('Assignee clicked:', person)
      alert(`Opening profile for: ${person.name}`)
    },
    onReporterClick: (person) => {
      console.log('Reporter clicked:', person)
      alert(`Opening profile for: ${person.name}`)
    },
    onLocationClick: (location) => {
      console.log('Location clicked:', location)
      alert(`Opening location: ${location}`)
    },
    onTabChange: (tab) => {
      console.log('Tab changed to:', tab)
    },
  },
}

/**
 * Different page sizes
 */
export const CustomPageSize: Story = {
  args: {
    mySteps: [...seedMySteps, ...seedMySteps.map((s, i) => ({ ...s, id: `${s.id}-dup-${i}` }))],
    teamSteps: seedTeamSteps,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 15],
  },
}

/**
 * Many steps (for testing pagination) - uses generateManySteps from API seed
 */
export const ManySteps: Story = {
  args: {
    mySteps: generateManySteps(50),
    teamSteps: seedTeamSteps,
    defaultPageSize: 10,
  },
}
