/**
 * Corrective Actions - Details Page Stories
 *
 * Stories for the detail view components.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CorrectiveActionDetailsPage } from '../../../flow/components/corrective-actions/CorrectiveActionDetailsPage'
import { CorrectiveActionHeader } from '../../../flow/components/corrective-actions/CorrectiveActionHeader'
import { CorrectiveActionTimeline } from '../../../flow/components/corrective-actions/CorrectiveActionTimeline'
import { CorrectiveActionSidebar } from '../../../flow/components/corrective-actions/CorrectiveActionSidebar'
import { mockCorrectiveActions, mockTimeline } from '../../../flow/data/mockCorrectiveActions'
import { TooltipProvider } from '../../../components/ui/tooltip'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'

// =============================================================================
// HEADER STORIES
// =============================================================================

const headerMeta: Meta<typeof CorrectiveActionHeader> = {
  title: 'Flow/Corrective Actions/Details/Header',
  component: CorrectiveActionHeader,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative bg-page p-6 min-h-[200px] overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default headerMeta
type HeaderStory = StoryObj<typeof CorrectiveActionHeader>

const urgentAction = mockCorrectiveActions.find((a) => a.priority === 'urgent')!
const completedAction = mockCorrectiveActions.find((a) => a.status === 'completed')!

export const HeaderDefault: HeaderStory = {
  args: {
    action: urgentAction,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
  },
}

export const HeaderCompleted: HeaderStory = {
  args: {
    action: completedAction,
    onBack: () => console.log('Back'),
    onEdit: () => console.log('Edit'),
  },
}

// =============================================================================
// TIMELINE STORIES
// =============================================================================

// Get first action's timeline events
const timelineEvents = mockTimeline[mockCorrectiveActions[0]?.id] || []

export const TimelineDefault: StoryObj<typeof CorrectiveActionTimeline> = {
  render: () => (
    <div className="relative max-w-md bg-page p-6 min-h-[400px] overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10">
        <CorrectiveActionTimeline events={timelineEvents} />
      </div>
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
}

export const TimelineLimited: StoryObj<typeof CorrectiveActionTimeline> = {
  render: () => (
    <div className="relative max-w-md bg-page p-6 min-h-[300px] overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10">
        <CorrectiveActionTimeline events={timelineEvents} maxEvents={3} />
      </div>
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
}

export const TimelineEmpty: StoryObj<typeof CorrectiveActionTimeline> = {
  render: () => (
    <div className="relative max-w-md bg-page p-6 min-h-[200px] overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10">
        <CorrectiveActionTimeline events={[]} />
      </div>
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
}

// =============================================================================
// SIDEBAR STORIES
// =============================================================================

export const SidebarInProgress: StoryObj<typeof CorrectiveActionSidebar> = {
  render: () => {
    const inProgressAction = mockCorrectiveActions.find(
      (a) => a.status === 'in-progress'
    )!
    return (
      <div className="relative bg-page p-6 min-h-[500px] overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 w-80 bg-surface border border-default rounded-xl p-6">
          <CorrectiveActionSidebar
            action={inProgressAction}
            onSubmitCompletion={() => console.log('Submit completion')}
            onRequestExtension={() => console.log('Request extension')}
          />
        </div>
      </div>
    )
  },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
}

export const SidebarCompleted: StoryObj<typeof CorrectiveActionSidebar> = {
  render: () => (
    <div className="relative bg-page p-6 min-h-[500px] overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10 w-80 bg-surface border border-default rounded-xl p-6">
        <CorrectiveActionSidebar
          action={completedAction}
          permissions={{
            canView: true,
            canEdit: false,
            canCreate: false,
            canDelete: false,
            canApprove: true,
            canRequestExtension: false,
          }}
          onRequestClosure={() => console.log('Request closure')}
        />
      </div>
    </div>
  ),
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
}

// =============================================================================
// FULL DETAILS PAGE STORIES
// =============================================================================

/**
 * Default details page with urgent priority action.
 * Includes GridBlobBackground and glass panel content.
 */
export const DetailsPageDefault: StoryObj<typeof CorrectiveActionDetailsPage> = {
  render: () => (
    <TooltipProvider>
      <CorrectiveActionDetailsPage
        action={urgentAction}
        timelineEvents={mockTimeline[urgentAction?.id] || []}
        onBack={() => console.log('Back')}
        onEdit={() => console.log('Edit')}
        onSubmitCompletion={() => console.log('Submit completion')}
        onRequestExtension={() => console.log('Request extension')}
      />
    </TooltipProvider>
  ),
  parameters: {
    layout: 'fullscreen',
    // Disable color-contrast - GridBlobBackground canvas
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}

/**
 * Completed action with closure approval permissions.
 */
export const DetailsPageCompleted: StoryObj<typeof CorrectiveActionDetailsPage> = {
  render: () => (
    <TooltipProvider>
      <CorrectiveActionDetailsPage
        action={completedAction}
        timelineEvents={mockTimeline[completedAction?.id] || []}
        permissions={{
          canView: true,
          canEdit: false,
          canCreate: false,
          canDelete: false,
          canApprove: true,
          canRequestExtension: false,
        }}
        onBack={() => console.log('Back')}
        onRequestClosure={() => console.log('Request closure')}
      />
    </TooltipProvider>
  ),
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}

/**
 * Loading state with skeleton UI.
 */
export const DetailsPageLoading: StoryObj<typeof CorrectiveActionDetailsPage> = {
  render: () => (
    <TooltipProvider>
      <CorrectiveActionDetailsPage
        action={urgentAction}
        timelineEvents={[]}
        isLoading={true}
      />
    </TooltipProvider>
  ),
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}
