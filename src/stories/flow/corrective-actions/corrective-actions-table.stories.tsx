/**
 * Corrective Actions - Table Stories
 *
 * Table-based display matching the EMEX DynamicEntityTable pattern.
 * This is the recommended default view for corrective actions.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { CorrectiveActionsTable } from '../../../flow/components/corrective-actions/CorrectiveActionsTable'
import { mockCorrectiveActions } from '../../../flow/data/mockCorrectiveActions'
import { TooltipProvider } from '../../../components/ui/tooltip'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import { ORGANISM_META, organismDescription } from '../../_infrastructure'

const meta: Meta<typeof CorrectiveActionsTable> = {
  title: 'Flow/Corrective Actions/Table',
  component: CorrectiveActionsTable,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
    docs: {
      description: {
        component: organismDescription(
          'Table-based display for corrective actions. Default view matching EMEX DynamicEntityTable pattern with priority row borders, sorting, and pagination.'
        ),
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="relative p-6 bg-page min-h-screen overflow-hidden">
          <GridBlobBackground scale={1.2} blobCount={2} />
          <div className="relative z-10">
            <Story />
          </div>
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CorrectiveActionsTable>

/**
 * Default table view with priority row borders.
 * This is the recommended view matching the EMEX pattern.
 */
export const Default: Story = {
  args: {
    actions: mockCorrectiveActions,
    onRowClick: (action) => console.log('Clicked', action.id),
    onEdit: (action) => console.log('Edit', action.id),
    pagination: true,
    pageSize: 10,
    currentPage: 1,
  },
}

/**
 * Compact table with smaller padding.
 * Better for dense information display.
 */
export const Compact: Story = {
  args: {
    actions: mockCorrectiveActions,
    compact: true,
    pagination: true,
    pageSize: 10,
    currentPage: 1,
  },
}

/**
 * Table with row selection enabled.
 * Useful for bulk operations.
 */
export const Selectable: Story = {
  args: {
    actions: mockCorrectiveActions,
    selectable: true,
    onSelectionChange: (ids) => console.log('Selected', ids),
    pagination: true,
    pageSize: 10,
    currentPage: 1,
  },
}

/**
 * Table without pagination.
 * Shows all actions in a single view.
 */
export const NoPagination: Story = {
  args: {
    actions: mockCorrectiveActions,
    pagination: false,
  },
}

/**
 * Loading state with skeleton rows.
 */
export const Loading: Story = {
  args: {
    actions: [],
    isLoading: true,
  },
}

/**
 * Empty state when no actions exist.
 */
export const Empty: Story = {
  args: {
    actions: [],
    isLoading: false,
  },
}
