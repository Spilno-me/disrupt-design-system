/**
 * ModulesGrid Stories
 *
 * Responsive grid container for displaying module cards.
 * Includes loading, empty, and error states.
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ModulesGrid } from '../../../flow/components/modules/ModulesGrid'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import {
  mockModules,
  fullPermissions,
  filterModulesByStatus,
} from '../../../flow/data/mockModules'

// =============================================================================
// DECORATORS
// =============================================================================

/**
 * Glass-morphism grid wrapper with blob background.
 * Required for Depth 2 glass cards to display correctly.
 */
const GlassGridDecorator = (Story: React.ComponentType) => (
  <div className="relative min-h-screen bg-page overflow-hidden p-6">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10">
      <Story />
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ModulesGrid> = {
  title: 'Flow/Modules/ModulesGrid',
  component: ModulesGrid,
  decorators: [GlassGridDecorator],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ModulesGrid

A responsive grid container for displaying module cards.

## Features

- **Responsive Layout**: 1 column on mobile, 2 columns on tablet+
- **Loading State**: Skeleton cards while loading
- **Empty State**: Message when no modules match filters
- **Error State**: Error message with retry button

## Usage

\`\`\`tsx
import { ModulesGrid } from '@dds/design-system/flow'

<ModulesGrid
  modules={modules}
  isLoading={isLoading}
  error={error}
  onOpen={(m) => navigate('/modules/' + m.id)}
  onEdit={(m) => openEditSheet(m)}
  permissions={userPermissions}
  hasFilters={hasActiveFilters}
  onClearFilters={clearFilters}
  onRetry={refetch}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    modules: { control: false },
    onOpen: { action: 'onOpen' },
    onEdit: { action: 'onEdit' },
    onToggleStatus: { action: 'onToggleStatus' },
    onCreateEntity: { action: 'onCreateEntity' },
    onClearFilters: { action: 'onClearFilters' },
    onRetry: { action: 'onRetry' },
  },
}

export default meta
type Story = StoryObj<typeof ModulesGrid>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - All modules in grid
 */
export const Default: Story = {
  args: {
    modules: mockModules,
    permissions: fullPermissions,
  },
}

/**
 * Active modules only
 */
export const ActiveModulesOnly: Story = {
  args: {
    modules: filterModulesByStatus(mockModules, 'active'),
    permissions: fullPermissions,
  },
}

/**
 * Few modules - Demonstrates responsive layout
 */
export const FewModules: Story = {
  args: {
    modules: mockModules.slice(0, 3),
    permissions: fullPermissions,
  },
}

/**
 * Single module
 */
export const SingleModule: Story = {
  args: {
    modules: mockModules.slice(0, 1),
    permissions: fullPermissions,
  },
}

/**
 * Loading state - Shows skeleton cards
 */
export const Loading: Story = {
  args: {
    modules: [],
    isLoading: true,
    permissions: fullPermissions,
  },
}

/**
 * Empty state - No modules available
 */
export const Empty: Story = {
  args: {
    modules: [],
    permissions: fullPermissions,
  },
}

/**
 * Empty state with filters - No matching modules
 */
export const EmptyWithFilters: Story = {
  args: {
    modules: [],
    hasFilters: true,
    emptySearchMessage: 'No modules match "xyz"',
    permissions: fullPermissions,
  },
}

/**
 * Error state - Failed to load
 */
export const Error: Story = {
  args: {
    modules: [],
    error: 'Failed to load modules. Please check your connection and try again.',
    permissions: fullPermissions,
  },
}

/**
 * Mobile view - Single column layout
 */
export const MobileView: Story = {
  args: {
    modules: mockModules.slice(0, 4),
    permissions: fullPermissions,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet view - Two column layout
 */
export const TabletView: Story = {
  args: {
    modules: mockModules.slice(0, 4),
    permissions: fullPermissions,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Interactive - With all callbacks
 */
export const Interactive: Story = {
  args: {
    modules: mockModules,
    permissions: fullPermissions,
    onOpen: (module) => alert(`Opening: ${module.name}`),
    onEdit: (module) => alert(`Editing: ${module.name}`),
    onToggleStatus: (module) => alert(`Toggling: ${module.name}`),
    onCreateEntity: (module) => alert(`Creating entity for: ${module.name}`),
  },
}
