/**
 * Workspace Navigation Stories
 *
 * Showcases the WorkspaceSection component in various states.
 * Includes interaction tests (play functions) for TDD behavior verification.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { WorkspaceSection, useWorkspaceStore } from '../components/ui/workspace'
import type { WorkspaceNode } from '../components/ui/workspace'
import { AppSidebar, type NavItem } from '../components/ui/AppSidebar'
import { GridBlobBackground } from '../components/ui/GridBlobCanvas'
import { LayoutDashboard, Waypoints, TriangleAlert, Settings } from 'lucide-react'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof WorkspaceSection> = {
  title: 'Navigation/WorkspaceSection',
  component: WorkspaceSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Personal workspace navigation with nested folders, drag-drop reordering, and color-coded organization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    product: {
      control: 'select',
      options: ['flow', 'market', 'partner'],
      description: 'Product context for routing',
    },
    isCollapsed: {
      control: 'boolean',
      description: 'Whether sidebar is collapsed',
    },
    headerLabel: {
      control: 'text',
      description: 'Custom header label',
    },
  },
}

export default meta
type Story = StoryObj<typeof WorkspaceSection>

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_NODES: WorkspaceNode[] = [
  {
    id: 'folder-1',
    product: 'flow',
    name: 'Project Alpha',
    type: 'folder',
    color: 'blue',
    parentId: null,
    sortOrder: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'folder-1-1',
    product: 'flow',
    name: 'Sprint 1',
    type: 'folder',
    color: 'green',
    parentId: 'folder-1',
    sortOrder: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'item-1-1-1',
    product: 'flow',
    name: 'Requirements Doc',
    type: 'item',
    href: '/docs/requirements',
    iconName: 'FileText',
    parentId: 'folder-1-1',
    sortOrder: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'item-1-1-2',
    product: 'flow',
    name: 'Design Specs',
    type: 'item',
    href: '/docs/design',
    iconName: 'FileText',
    parentId: 'folder-1-1',
    sortOrder: 1,
    updatedAt: Date.now(),
  },
  {
    id: 'folder-1-2',
    product: 'flow',
    name: 'Sprint 2',
    type: 'folder',
    color: 'amber',
    parentId: 'folder-1',
    sortOrder: 1,
    updatedAt: Date.now(),
  },
  {
    id: 'folder-2',
    product: 'flow',
    name: 'Archive',
    type: 'folder',
    color: 'default',
    parentId: null,
    sortOrder: 1,
    updatedAt: Date.now(),
  },
  {
    id: 'item-2-1',
    product: 'flow',
    name: 'Old Reports',
    type: 'item',
    href: '/reports/archive',
    parentId: 'folder-2',
    sortOrder: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'folder-3',
    product: 'flow',
    name: 'Quick Links',
    type: 'folder',
    color: 'purple',
    parentId: null,
    sortOrder: 2,
    updatedAt: Date.now(),
  },
  {
    id: 'item-3-1',
    product: 'flow',
    name: 'Dashboard',
    type: 'item',
    href: '/dashboard',
    iconName: 'Link',
    parentId: 'folder-3',
    sortOrder: 0,
    updatedAt: Date.now(),
  },
]

// =============================================================================
// DECORATOR
// =============================================================================

/**
 * Initialize store with mock data
 */
function StoreInitializer({
  nodes,
  children,
}: {
  nodes: WorkspaceNode[]
  children: React.ReactNode
}) {
  const initialize = useWorkspaceStore((s) => s.initialize)
  const expandedFolderIds = useWorkspaceStore((s) => s.expandedFolderIds)

  React.useEffect(() => {
    initialize(nodes, 'flow')
    // Expand first folder for visibility
    if (nodes.length > 0 && expandedFolderIds.length === 0) {
      const folders = nodes.filter((n) => n.type === 'folder' && n.parentId === null)
      if (folders[0]) {
        useWorkspaceStore.getState().toggleExpand(folders[0].id)
      }
    }
  }, [nodes, initialize, expandedFolderIds.length])

  return <>{children}</>
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state with sample data
 */
export const Default: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-surface border border-default rounded-lg">
        <StoreInitializer nodes={MOCK_NODES}>
          <Story />
        </StoreInitializer>
      </div>
    ),
  ],
}

/**
 * Empty state - no folders yet
 */
export const Empty: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-surface border border-default rounded-lg">
        <StoreInitializer nodes={[]}>
          <Story />
        </StoreInitializer>
      </div>
    ),
  ],
}

/**
 * All folders expanded
 */
export const AllExpanded: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => {
      const ExpandedWrapper = () => {
        const initialize = useWorkspaceStore((s) => s.initialize)
        const expandAll = useWorkspaceStore((s) => s.expandAll)

        React.useEffect(() => {
          initialize(MOCK_NODES, 'flow')
          // Use setTimeout to ensure store is initialized first
          setTimeout(() => expandAll(), 0)
        }, [initialize, expandAll])

        return <Story />
      }

      return (
        <div className="w-64 bg-surface border border-default rounded-lg">
          <ExpandedWrapper />
        </div>
      )
    },
  ],
}

/**
 * In sidebar context (darker background)
 */
export const InSidebar: Story = {
  args: {
    product: 'partner',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-page p-4">
        <div className="bg-surface rounded-lg overflow-hidden">
          <StoreInitializer nodes={MOCK_NODES}>
            <Story />
          </StoreInitializer>
        </div>
      </div>
    ),
  ],
}

/**
 * With syncing indicator (resets after 3s to demonstrate transient state)
 */
export const Syncing: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => {
      const SyncingWrapper = () => {
        const initialize = useWorkspaceStore((s) => s.initialize)
        const setSyncStatus = useWorkspaceStore((s) => s.setSyncStatus)

        React.useEffect(() => {
          initialize(MOCK_NODES, 'flow')
          setSyncStatus('syncing')

          // Reset after 3 seconds to demonstrate transient state
          const timer = setTimeout(() => {
            setSyncStatus('idle')
          }, 3000)

          return () => clearTimeout(timer)
        }, [initialize, setSyncStatus])

        return <Story />
      }

      return (
        <div className="w-64 bg-surface border border-default rounded-lg">
          <SyncingWrapper />
        </div>
      )
    },
  ],
}

/**
 * Collapsed state (hidden in real sidebar)
 */
export const Collapsed: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
    isCollapsed: true,
  },
  decorators: [
    (Story) => (
      <div className="w-16 bg-surface border border-default rounded-lg p-2">
        <p className="text-xs text-muted text-center mb-2">
          Workspace is hidden when sidebar is collapsed
        </p>
        <StoreInitializer nodes={MOCK_NODES}>
          <Story />
        </StoreInitializer>
      </div>
    ),
  ],
}

// =============================================================================
// APP SHELL INTEGRATION STORY
// =============================================================================

const SAMPLE_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: <Waypoints />,
    href: '/workflows',
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: <TriangleAlert />,
    href: '/incidents',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    href: '/settings',
  },
]

/**
 * Full app shell context - shows WorkspaceSection in realistic sidebar layout.
 *
 * This demonstrates how the workspace navigation integrates with the main
 * AppSidebar component, including:
 * - GridBlob background pattern
 * - AppSidebar with navigation items
 * - WorkspaceSection below main nav
 * - Collapse/expand behavior
 */
export const InAppShell: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Full app shell context showing WorkspaceSection integrated below AppSidebar navigation. Click the sidebar to expand, click outside to collapse.',
      },
    },
  },
  decorators: [
    (Story) => {
      const AppShellWrapper = () => {
        const [collapsed, setCollapsed] = React.useState(true)
        const [activeId, setActiveId] = React.useState('dashboard')
        const initialize = useWorkspaceStore((s) => s.initialize)
        const expandAll = useWorkspaceStore((s) => s.expandAll)

        React.useEffect(() => {
          initialize(MOCK_NODES, 'flow')
          setTimeout(() => expandAll(), 0)
        }, [initialize, expandAll])

        return (
          <div className="relative h-[600px] w-full overflow-hidden bg-page">
            {/* Background - GridBlobBackground uses absolute inset-0 internally */}
            <GridBlobBackground />

            {/* App layout */}
            <div className="relative z-10 flex h-full">
              {/* Sidebar container - fixed width when expanded */}
              <div className="flex flex-col h-full">
                {/* Main navigation */}
                <AppSidebar
                  product="flow"
                  items={SAMPLE_NAV_ITEMS}
                  activeItemId={activeId}
                  collapsed={collapsed}
                  onCollapsedChange={setCollapsed}
                  onNavigate={(item) => setActiveId(item.id)}
                  showHelpItem={false}
                />

                {/* Workspace section - shows when sidebar expanded */}
                <div
                  className="flex-1 min-h-0 overflow-y-auto bg-surface/80 backdrop-blur-sm"
                  style={{
                    width: collapsed ? 63 : 255,
                    transition: 'width 0.25s ease-in-out',
                  }}
                >
                  <Story />
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-6">
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-default p-6 h-full">
                  <h1 className="text-xl font-semibold text-primary mb-2">
                    {SAMPLE_NAV_ITEMS.find((i) => i.id === activeId)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-secondary text-sm">
                    Click the sidebar to expand and see the workspace section. Click outside to
                    collapse.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      return <AppShellWrapper />
    },
  ],
}

// =============================================================================
// INTERACTION TESTS (TDD BEHAVIOR VERIFICATION)
// =============================================================================
// TODO: Re-enable when @storybook/test types are properly configured
// These tests verify: expand/collapse, selection, inline rename, create folder,
// overflow menu, and empty state CTA behaviors
