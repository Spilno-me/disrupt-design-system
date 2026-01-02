/**
 * Corrective Actions - Page Stories
 *
 * Stories for the full page component with table/grid views.
 * Page includes GridBlobBackground, PageActionPanel header, and glass panel content.
 *
 * Related stories:
 * - Table component: corrective-actions-table.stories.tsx
 * - Grid component: corrective-actions-grid.stories.tsx (if needed)
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CorrectiveActionsPage } from '../../../flow/components/corrective-actions/CorrectiveActionsPage'
import { mockCorrectiveActions } from '../../../flow/data/mockCorrectiveActions'
import { TooltipProvider } from '../../../components/ui/tooltip'
import { ORGANISM_META, organismDescription } from '../../_infrastructure'

const meta: Meta<typeof CorrectiveActionsPage> = {
  title: 'Flow/Corrective Actions/Page',
  component: CorrectiveActionsPage,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'fullscreen',
    // Disable color-contrast rule - pages use animated GridBlobBackground canvas
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
    docs: {
      description: {
        component: organismDescription(
          'Full page layout for corrective actions management. Matches EMEX EntityListPage pattern with table-based default view, status tab filtering, and view toggle. Includes GridBlobBackground, PageActionPanel header, and glass panel content.'
        ),
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CorrectiveActionsPage>

// =============================================================================
// PAGE STORIES
// =============================================================================

/**
 * Default page view with table (EMEX pattern).
 * Table view is now default, matching EMEX EntityListPage pattern.
 */
export const Default: Story = {
  args: {
    actions: mockCorrectiveActions,
    onActionClick: (action) => console.log('View', action.id),
    onCreate: () => console.log('Create new'),
    onEdit: (action) => console.log('Edit', action.id),
    onExport: () => console.log('Export'),
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
  },
}

/**
 * Custom title and subtitle for specific use cases.
 */
export const CustomTitle: Story = {
  args: {
    actions: mockCorrectiveActions,
    title: 'EHS Corrective Actions',
    subtitle: 'Track and manage corrective and preventive actions from incidents and audits',
    onActionClick: (action) => console.log('View', action.id),
    onCreate: () => console.log('Create new'),
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
  },
}

/**
 * Loading state with skeleton rows.
 */
export const Loading: Story = {
  args: {
    actions: [],
    isLoading: true,
    onCreate: () => console.log('Create new'),
  },
}

/**
 * Read-only view with limited permissions.
 * No create button, no edit actions in the table.
 */
export const ReadOnly: Story = {
  args: {
    actions: mockCorrectiveActions,
    permissions: {
      canView: true,
      canEdit: false,
      canCreate: false,
      canDelete: false,
      canApprove: false,
      canRequestExtension: false,
    },
  },
}

/**
 * Empty state with no actions.
 * Shows empty table and allows creating new action.
 */
export const Empty: Story = {
  args: {
    actions: [],
    onCreate: () => console.log('Create new'),
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
  },
}
