/**
 * ModulesPage Stories
 *
 * Full page composition for module management with search, filters, and pagination.
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ModulesPage } from '../../../flow/components/modules/ModulesPage'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import {
  mockModules,
  fullPermissions,
  viewOnlyPermissions,
  filterModulesByStatus,
  filterModulesBySearch,
} from '../../../flow/data/mockModules'
import type { ModuleStatus } from '../../../flow/components/modules/helpers'

// =============================================================================
// DECORATORS
// =============================================================================

/**
 * Glass-morphism page wrapper with blob background.
 * Required for Depth 2 glass cards to display correctly.
 */
const GlassPageDecorator = (Story: React.ComponentType) => (
  <div className="relative min-h-screen bg-page overflow-hidden">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10 p-6">
      <Story />
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ModulesPage> = {
  title: 'Flow/Modules/ModulesPage',
  component: ModulesPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ModulesPage

Full page composition for module configuration management.

## Features

- **Page Header**: Title, description, refresh and add buttons
- **SearchFilter**: Text search with status filter dropdown
- **ModulesGrid**: Responsive grid of module cards
- **Pagination**: Page navigation and page size selector

## API Integration

Designed to work with EMEX's existing API:

\`\`\`tsx
import { ModulesPage } from '@dds/design-system/flow'

function ModuleConfigurationPage() {
  const { data, isLoading, error, refetch } = useModules({
    search, status, page, pageSize
  })

  return (
    <ModulesPage
      modules={data?.modules ?? []}
      isLoading={isLoading}
      error={error?.message}
      totalModules={data?.total}
      currentPage={page}
      pageSize={pageSize}
      onSearchChange={setSearch}
      onStatusChange={setStatus}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onOpenModule={(m) => navigate('/modules/' + m.id)}
      onRefresh={refetch}
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    modules: { control: false },
    onSearchChange: { action: 'onSearchChange' },
    onStatusChange: { action: 'onStatusChange' },
    onPageChange: { action: 'onPageChange' },
    onPageSizeChange: { action: 'onPageSizeChange' },
    onOpenModule: { action: 'onOpenModule' },
    onEditModule: { action: 'onEditModule' },
    onToggleModuleStatus: { action: 'onToggleModuleStatus' },
    onCreateEntity: { action: 'onCreateEntity' },
    onAddModule: { action: 'onAddModule' },
    onRefresh: { action: 'onRefresh' },
  },
}

export default meta
type Story = StoryObj<typeof ModulesPage>

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

function InteractiveModulesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ModuleStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter modules based on search and status
  const filteredModules = useMemo(() => {
    let result = mockModules
    if (status !== 'all') {
      result = filterModulesByStatus(result, status)
    }
    if (search) {
      result = filterModulesBySearch(result, search)
    }
    return result
  }, [search, status])

  // Paginate
  const paginatedModules = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredModules.slice(start, start + pageSize)
  }, [filteredModules, page, pageSize])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1)
  }, [search, status])

  return (
    <div className="relative min-h-screen bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10 p-6">
        <ModulesPage
          modules={paginatedModules}
          totalModules={filteredModules.length}
          currentPage={page}
          pageSize={pageSize}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onOpenModule={(m) => alert(`Opening: ${m.name}`)}
          onEditModule={(m) => alert(`Editing: ${m.name}`)}
          onToggleModuleStatus={(m) => alert(`Toggling: ${m.name}`)}
          onCreateEntity={(m) => alert(`Creating entity for: ${m.name}`)}
          onAddModule={() => alert('Add Module clicked')}
          onRefresh={() => alert('Refresh clicked')}
          permissions={fullPermissions}
          title="Modules Configuration"
          description="Manage system modules and their settings"
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - Full page with all features
 */
export const Default: Story = {
  args: {
    modules: mockModules,
    permissions: fullPermissions,
    title: 'Modules',
    description: 'Manage system modules and entity templates',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Interactive - Fully functional with local state
 */
export const Interactive: Story = {
  render: () => <InteractiveModulesPage />,
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    modules: [],
    isLoading: true,
    permissions: fullPermissions,
    title: 'Modules',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Error state
 */
export const Error: Story = {
  args: {
    modules: [],
    error: 'Failed to load modules. Network connection lost.',
    permissions: fullPermissions,
    title: 'Modules',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Empty state - No modules
 */
export const Empty: Story = {
  args: {
    modules: [],
    permissions: fullPermissions,
    title: 'Modules',
    description: 'No modules configured yet',
  },
  decorators: [GlassPageDecorator],
}

/**
 * With pagination - Many modules
 */
export const WithPagination: Story = {
  args: {
    modules: mockModules.slice(0, 4),
    totalModules: mockModules.length,
    currentPage: 1,
    pageSize: 4,
    permissions: fullPermissions,
    title: 'Modules',
  },
  decorators: [GlassPageDecorator],
}

/**
 * View-only permissions
 */
export const ViewOnlyPermissions: Story = {
  args: {
    modules: mockModules,
    permissions: viewOnlyPermissions,
    canAddModule: false,
    title: 'Modules',
    description: 'You have view-only access',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Mobile view - tighter padding
 */
const GlassPageDecoratorMobile = (Story: React.ComponentType) => (
  <div className="relative min-h-screen bg-page overflow-hidden">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10 p-4">
      <Story />
    </div>
  </div>
)

/**
 * Mobile view
 */
export const MobileView: Story = {
  args: {
    modules: mockModules.slice(0, 4),
    permissions: fullPermissions,
    title: 'Modules',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [GlassPageDecoratorMobile],
}

/**
 * Tablet view
 */
export const TabletView: Story = {
  args: {
    modules: mockModules,
    permissions: fullPermissions,
    title: 'Modules',
    description: 'Module configuration and management',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [GlassPageDecoratorMobile],
}
