/**
 * ModuleCard Stories
 *
 * Displays individual module cards with status, metadata, and management actions.
 * Used in the modules configuration interface.
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ModuleCard } from '../../../flow/components/modules/ModuleCard'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import {
  mockModules,
  fullPermissions,
  viewOnlyPermissions,
  editorPermissions,
  noPermissions,
} from '../../../flow/data/mockModules'

// =============================================================================
// DECORATORS
// =============================================================================

/**
 * Glass-morphism card wrapper with blob background.
 * Required for Depth 2 glass cards to display correctly.
 */
const GlassCardDecorator = (Story: React.ComponentType) => (
  <div className="relative min-h-[400px] bg-page overflow-hidden p-8">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10 max-w-md">
      <Story />
    </div>
  </div>
)

/**
 * Grid comparison decorator for multiple cards.
 */
const GlassGridDecorator = (Story: React.ComponentType) => (
  <div className="relative min-h-[600px] bg-page overflow-hidden p-8">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10">
      <Story />
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ModuleCard> = {
  title: 'Flow/Modules/ModuleCard',
  component: ModuleCard,
  decorators: [GlassCardDecorator],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ModuleCard

Displays an individual EMEX module with its status, metadata, and management actions.

## Features

- **Module Icon**: Color-coded based on module type (incidents=warning, actions=accent, etc.)
- **Status Badge**: Active (green), Inactive (gray), Draft (outline)
- **Metadata**: Code, version, entity template count, creation/update dates
- **Actions**: View, Edit, Toggle Status, Create Entity (permission-based)

## UX Compliance

- **Fitts' Law**: 44px touch targets on action buttons
- **Hick's Law**: Maximum 4 visible actions
- **Permission Visibility**: Disabled (not hidden) when user lacks permission
- **Primary Color**: Default variant for actions (not green)

## Usage

\`\`\`tsx
import { ModuleCard } from '@dds/design-system/flow'

<ModuleCard
  module={module}
  onOpen={(m) => navigate('/modules/' + m.id)}
  onEdit={(m) => openEditSheet(m)}
  onToggleStatus={(m) => toggleStatus(m)}
  onCreateEntity={(m) => openCreateSheet(m)}
  permissions={userPermissions}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    module: { control: false },
    onOpen: { action: 'onOpen' },
    onEdit: { action: 'onEdit' },
    onToggleStatus: { action: 'onToggleStatus' },
    onCreateEntity: { action: 'onCreateEntity' },
  },
}

export default meta
type Story = StoryObj<typeof ModuleCard>

// =============================================================================
// SAMPLE DATA
// =============================================================================

const activeModule = mockModules.find((m) => m.status === 'active' && m.primaryEntityTemplate)!
const inactiveModule = mockModules.find((m) => m.status === 'inactive')!
const draftModule = mockModules.find((m) => m.status === 'draft')!
const incidentModule = mockModules.find((m) => m.code.includes('incident'))!
const actionModule = mockModules.find((m) => m.code.includes('corrective'))!

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - Active module with full permissions
 */
export const Default: Story = {
  args: {
    module: activeModule,
    permissions: fullPermissions,
  },
}

/**
 * Active module status (green badge)
 */
export const ActiveStatus: Story = {
  args: {
    module: activeModule,
    permissions: fullPermissions,
  },
}

/**
 * Inactive module status (gray badge)
 */
export const InactiveStatus: Story = {
  args: {
    module: inactiveModule,
    permissions: fullPermissions,
  },
}

/**
 * Draft module status (outline badge) - cannot be toggled
 */
export const DraftStatus: Story = {
  args: {
    module: draftModule,
    permissions: fullPermissions,
  },
}

/**
 * Incident Management module - warning color icon
 */
export const IncidentModule: Story = {
  args: {
    module: incidentModule,
    permissions: fullPermissions,
  },
}

/**
 * Corrective Actions module - accent color icon
 */
export const CorrectiveActionsModule: Story = {
  args: {
    module: actionModule,
    permissions: fullPermissions,
  },
}

/**
 * View-only permissions - only View is enabled
 */
export const ViewOnlyPermissions: Story = {
  args: {
    module: activeModule,
    permissions: viewOnlyPermissions,
  },
  parameters: {
    docs: {
      description: {
        story: 'When user only has view permission, Edit, Toggle, and Create buttons are disabled (not hidden).',
      },
    },
  },
}

/**
 * Editor permissions - View, Edit, Create enabled
 */
export const EditorPermissions: Story = {
  args: {
    module: activeModule,
    permissions: editorPermissions,
  },
}

/**
 * No permissions - entire action section hidden
 */
export const NoPermissions: Story = {
  args: {
    module: activeModule,
    permissions: noPermissions,
  },
  parameters: {
    docs: {
      description: {
        story: 'When user has no permissions, the entire action footer is hidden (not just individual buttons).',
      },
    },
  },
}

/**
 * Module without primary entity - Create button hidden
 */
export const NoPrimaryEntity: Story = {
  args: {
    module: inactiveModule, // Inactive module has no primary entity
    permissions: fullPermissions,
  },
}

/**
 * Clickable card - Opens module on click
 */
export const ClickableCard: Story = {
  args: {
    module: activeModule,
    permissions: fullPermissions,
    onOpen: () => alert('Module opened!'),
  },
}

/**
 * All status variants side by side
 */
export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 max-w-md">
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">Active</p>
        <ModuleCard module={activeModule} permissions={fullPermissions} />
      </div>
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">Inactive</p>
        <ModuleCard module={inactiveModule} permissions={fullPermissions} />
      </div>
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">Draft</p>
        <ModuleCard module={draftModule} permissions={fullPermissions} />
      </div>
    </div>
  ),
  decorators: [GlassGridDecorator],
  parameters: {
    docs: {
      description: {
        story: 'Shows all three module status variants: Active (green), Inactive (gray), and Draft (outline).',
      },
    },
  },
}

/**
 * Permission comparison - Same module with different permission levels
 */
export const PermissionComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 max-w-md">
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">Full Permissions</p>
        <ModuleCard module={activeModule} permissions={fullPermissions} />
      </div>
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">View Only</p>
        <ModuleCard module={activeModule} permissions={viewOnlyPermissions} />
      </div>
      <div>
        <p className="text-xs text-tertiary mb-2 font-medium">No Permissions</p>
        <ModuleCard module={activeModule} permissions={noPermissions} />
      </div>
    </div>
  ),
  decorators: [GlassGridDecorator],
}
