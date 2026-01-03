import type { Meta, StoryObj } from '@storybook/react'
import { BulkActionsToolbar, BulkAction } from './BulkActionsToolbar'
import {
  MOLECULE_META,
  moleculeDescription,
  withStoryContainer,
  StorySection,
  StoryFlex,
} from '@/stories/_infrastructure'

const meta: Meta<typeof BulkActionsToolbar> = {
  title: 'Partner/Components/BulkActionsToolbar',
  component: BulkActionsToolbar,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Toolbar for bulk operations on selected leads including assign, delete, export, and status updates.'),
      },
    },
  },
  decorators: [withStoryContainer('molecule')],
}

export default meta
type Story = StoryObj<typeof BulkActionsToolbar>

const samplePartners = [
  { id: 'p1', name: 'Acme Partners' },
  { id: 'p2', name: 'Global Solutions' },
  { id: 'p3', name: 'Tech Distributors' },
]

export const Default: Story = {
  args: {
    selectedCount: 5,
    totalCount: 100,
    onAction: (action: BulkAction, data) => console.log('Bulk action:', action, data),
    onClearSelection: () => console.log('Selection cleared'),
    onSelectAll: () => console.log('Select all'),
    availablePartners: samplePartners,
  },
}

export const FewSelected: Story = {
  args: {
    selectedCount: 2,
    totalCount: 50,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
    availablePartners: samplePartners,
  },
}

export const AllSelected: Story = {
  args: {
    selectedCount: 100,
    totalCount: 100,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
    availablePartners: samplePartners,
  },
}

export const WithDisabledActions: Story = {
  args: {
    selectedCount: 3,
    totalCount: 50,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
    disabledActions: ['delete', 'assign'],
    availablePartners: samplePartners,
  },
}

export const NoPartners: Story = {
  args: {
    selectedCount: 5,
    totalCount: 100,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
    availablePartners: [],
  },
}

export const Loading: Story = {
  args: {
    selectedCount: 5,
    totalCount: 100,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
    loading: true,
    availablePartners: samplePartners,
  },
}

export const NoneSelected: Story = {
  args: {
    selectedCount: 0,
    totalCount: 100,
    onAction: (action) => console.log('Action:', action),
    onClearSelection: () => console.log('Cleared'),
  },
}

// =============================================================================
// ALL STATES (Required per Storybook Rules)
// =============================================================================

export const AllStates: Story = {
  render: () => {
    const handleAction = (action: BulkAction, data?: Record<string, unknown>) =>
      console.log('Bulk action:', action, data)
    const handleClear = () => console.log('Selection cleared')
    const handleSelectAll = () => console.log('Select all')

    return (
      <div className="space-y-8">
        <StorySection title="Selection States">
          <StoryFlex direction="column" align="start">
            <BulkActionsToolbar
              selectedCount={5}
              totalCount={100}
              onAction={handleAction}
              onClearSelection={handleClear}
              onSelectAll={handleSelectAll}
              availablePartners={samplePartners}
            />
            <BulkActionsToolbar
              selectedCount={2}
              totalCount={50}
              onAction={handleAction}
              onClearSelection={handleClear}
              onSelectAll={handleSelectAll}
              availablePartners={samplePartners}
            />
            <BulkActionsToolbar
              selectedCount={100}
              totalCount={100}
              onAction={handleAction}
              onClearSelection={handleClear}
              availablePartners={samplePartners}
            />
          </StoryFlex>
        </StorySection>

        <StorySection title="Disabled Actions">
          <StoryFlex direction="column" align="start">
            <BulkActionsToolbar
              selectedCount={3}
              totalCount={50}
              onAction={handleAction}
              onClearSelection={handleClear}
              disabledActions={['delete', 'assign']}
              availablePartners={samplePartners}
            />
          </StoryFlex>
        </StorySection>

        <StorySection title="Loading State">
          <StoryFlex direction="column" align="start">
            <BulkActionsToolbar
              selectedCount={5}
              totalCount={100}
              onAction={handleAction}
              onClearSelection={handleClear}
              loading={true}
              availablePartners={samplePartners}
            />
          </StoryFlex>
        </StorySection>

        <StorySection title="No Partners Available">
          <StoryFlex direction="column" align="start">
            <BulkActionsToolbar
              selectedCount={5}
              totalCount={100}
              onAction={handleAction}
              onClearSelection={handleClear}
              availablePartners={[]}
            />
          </StoryFlex>
        </StorySection>
      </div>
    )
  },
}
