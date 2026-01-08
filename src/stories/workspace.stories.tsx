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
  // Root-level item for testing (no parent folder)
  {
    id: 'item-1',
    product: 'flow',
    name: 'Root Item',
    type: 'item',
    href: '/root-item',
    iconName: 'FileText',
    parentId: null,
    sortOrder: 3,
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
  expandFirstFolder = true,
}: {
  nodes: WorkspaceNode[]
  children: React.ReactNode
  /** Whether to auto-expand first folder (default: true) */
  expandFirstFolder?: boolean
}) {
  const initialize = useWorkspaceStore((s) => s.initialize)
  const reset = useWorkspaceStore((s) => s.reset)

  React.useEffect(() => {
    // Reset store to clean state before initializing
    reset()
    initialize(nodes, 'flow')
    // Optionally expand first folder for visibility
    if (expandFirstFolder && nodes.length > 0) {
      const folders = nodes.filter((n) => n.type === 'folder' && n.parentId === null)
      if (folders[0]) {
        useWorkspaceStore.getState().toggleExpand(folders[0].id)
      }
    }
  }, [nodes, initialize, reset, expandFirstFolder])

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

/**
 * Tests folder expand/collapse behavior.
 *
 * Expected behaviors (TDD spec):
 * - Click chevron to toggle expand/collapse
 * - aria-expanded attribute reflects state
 */
export const InteractionExpandCollapse: Story = {
  args: {
    product: 'flow',
    headerLabel: 'My Workspace',
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-surface border border-default rounded-lg">
        <StoreInitializer nodes={MOCK_NODES} expandFirstFolder={false}>
          <Story />
        </StoreInitializer>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for initial render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Find "Archive" folder which starts collapsed (all folders collapsed)
    const archiveNode = await canvas.findByTestId('workspace-node-folder-2')
    expect(archiveNode).toBeInTheDocument()

    // Check initial collapsed state
    expect(archiveNode).toHaveAttribute('aria-expanded', 'false')

    // Find and click the chevron to expand
    const chevron = canvas.getByTestId('workspace-node-folder-2-chevron')
    await userEvent.click(chevron)

    // Verify expanded state
    await waitFor(() => {
      expect(archiveNode).toHaveAttribute('aria-expanded', 'true')
    })

    // Click again to collapse
    await userEvent.click(chevron)

    // Verify collapsed state
    await waitFor(() => {
      expect(archiveNode).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

/**
 * Tests click-to-select behavior.
 *
 * Expected behaviors (TDD spec):
 * - Click node to select it
 * - aria-selected attribute reflects selection
 * - Only one node selected at a time
 */
export const InteractionSelection: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Find folder nodes
    const folder1 = await canvas.findByTestId('workspace-node-folder-1')
    const folder2 = await canvas.findByTestId('workspace-node-folder-2')

    // Initially nothing selected
    expect(folder1).toHaveAttribute('aria-selected', 'false')
    expect(folder2).toHaveAttribute('aria-selected', 'false')

    // Click to select folder-1
    await userEvent.click(folder1)

    await waitFor(() => {
      expect(folder1).toHaveAttribute('aria-selected', 'true')
      expect(folder2).toHaveAttribute('aria-selected', 'false')
    })

    // Click to select folder-2 (should deselect folder-1)
    await userEvent.click(folder2)

    await waitFor(() => {
      expect(folder1).toHaveAttribute('aria-selected', 'false')
      expect(folder2).toHaveAttribute('aria-selected', 'true')
    })
  },
}

/**
 * Tests inline rename behavior.
 *
 * Expected behaviors (TDD spec):
 * - Double-click to enter rename mode
 * - Input appears and receives focus
 * - Enter commits the rename
 * - Escape cancels the rename
 */
export const InteractionInlineRename: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Find Archive folder name element
    const folderNameElement = await canvas.findByTestId('workspace-node-folder-2-name')
    expect(folderNameElement).toHaveTextContent('Archive')

    // Double-click to enter rename mode
    await userEvent.dblClick(folderNameElement)

    // Wait for input to appear
    const input = await canvas.findByTestId('workspace-input-folder-2')
    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()

    // Clear and type new name
    await userEvent.clear(input)
    await userEvent.type(input, 'Archived Items')

    // Press Enter to commit
    await userEvent.keyboard('{Enter}')

    // Input should disappear and name should be updated
    await waitFor(() => {
      expect(canvas.queryByTestId('workspace-input-folder-2')).not.toBeInTheDocument()
    })

    // Verify the name changed
    const updatedName = canvas.getByTestId('workspace-node-folder-2-name')
    expect(updatedName).toHaveTextContent('Archived Items')
  },
}

/**
 * Tests create folder behavior.
 *
 * Expected behaviors (TDD spec):
 * - Click create button adds new folder
 * - New folder enters rename mode immediately
 * - New folder is selected
 */
export const InteractionCreateFolder: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Wait for folder nodes to render (store initialization is async)
    await waitFor(
      () => {
        const folders = canvas.queryAllByTestId(/^workspace-node-folder-/)
        expect(folders.length).toBeGreaterThan(0)
      },
      { timeout: 5000 }
    )

    // Count initial folders
    const initialFolders = canvas.getAllByTestId(/^workspace-node-folder-/)

    // Click create button
    const createButton = canvas.getByTestId('workspace-section-create')
    await userEvent.click(createButton)

    // Wait for new folder to appear with input (rename mode)
    await waitFor(() => {
      const inputs = canvas.getAllByTestId(/^workspace-input-/)
      expect(inputs.length).toBeGreaterThan(0)
    })

    // Get the new input (should have temp-* ID pattern)
    const newInput = await canvas.findByRole('textbox', { name: /rename/i })
    expect(newInput).toHaveFocus()

    // Confirm the rename
    await userEvent.keyboard('{Enter}')

    // Verify folder count increased
    await waitFor(() => {
      const currentFolders = canvas.getAllByTestId(/^workspace-node-/)
      expect(currentFolders.length).toBeGreaterThan(initialFolders.length)
    })
  },
}

/**
 * Tests overflow menu actions.
 *
 * Expected behaviors (TDD spec):
 * - Click overflow button opens menu
 * - Menu contains expected actions
 * - Clicking action performs it
 */
export const InteractionOverflowMenu: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Dropdown menus render in portals - need to query document body
    const body = within(document.body)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Find folder-2 (Archive) and hover to reveal menu trigger
    const folder2 = await canvas.findByTestId('workspace-node-folder-2')
    await userEvent.hover(folder2)

    // Click overflow menu trigger
    const menuTrigger = canvas.getByTestId('workspace-menu-folder-2-trigger')
    await userEvent.click(menuTrigger)

    // Wait for menu to open (menus render in portal, query body)
    await waitFor(() => {
      expect(body.getByTestId('workspace-menu-folder-2')).toBeInTheDocument()
    })

    // Verify menu has expected items (query body for portal)
    expect(body.getByTestId('workspace-menu-folder-2-rename')).toBeInTheDocument()
    expect(body.getByTestId('workspace-menu-folder-2-color')).toBeInTheDocument()
    expect(body.getByTestId('workspace-menu-folder-2-subfolder')).toBeInTheDocument()
    expect(body.getByTestId('workspace-menu-folder-2-delete')).toBeInTheDocument()

    // Click rename (query body for portal)
    await userEvent.click(body.getByTestId('workspace-menu-folder-2-rename'))

    // Should enter rename mode (back to canvas)
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-input-folder-2')).toBeInTheDocument()
    })

    // Cancel rename with Escape
    await userEvent.keyboard('{Escape}')
  },
}

/**
 * Tests empty state CTA.
 *
 * Expected behaviors (TDD spec):
 * - Empty workspace shows empty state
 * - CTA button creates first folder
 */
export const InteractionEmptyState: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for empty state
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-empty')).toBeInTheDocument()
    })

    // Verify empty state content
    expect(canvas.getByText('Organize your workspace')).toBeInTheDocument()

    // Click CTA button
    const createButton = canvas.getByTestId('workspace-empty-create')
    await userEvent.click(createButton)

    // Should create folder and enter rename mode
    await waitFor(() => {
      const inputs = canvas.getAllByTestId(/^workspace-input-/)
      expect(inputs.length).toBeGreaterThan(0)
    })

    // Empty state should be gone
    expect(canvas.queryByTestId('workspace-empty')).not.toBeInTheDocument()
  },
}

/**
 * Tests duplicate folder via overflow menu.
 *
 * Expected behaviors (TDD spec):
 * - Click overflow menu on folder
 * - Click "Duplicate" option
 * - New folder created with "(copy)" suffix
 * - New folder appears in same parent
 */
export const InteractionDuplicateFolder: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Verify Archive folder exists (sanity check)
    await waitFor(() => {
      expect(canvas.getByText('Archive')).toBeInTheDocument()
    })

    // Hover on folder-2 (Archive) to reveal menu
    const folder2 = await canvas.findByTestId('workspace-node-folder-2')
    await userEvent.hover(folder2)

    // Click overflow menu trigger
    const menuTrigger = canvas.getByTestId('workspace-menu-folder-2-trigger')
    await userEvent.click(menuTrigger)

    // Wait for menu to open (portal renders to body)
    await waitFor(() => {
      expect(body.getByTestId('workspace-menu-folder-2')).toBeInTheDocument()
    })

    // Click duplicate
    await userEvent.click(body.getByTestId('workspace-menu-folder-2-duplicate'))

    // Verify new folder created with "(copy)" suffix
    // Note: New folder has auto-generated ID (temp-*), so we verify by text content
    await waitFor(() => {
      expect(canvas.getByText('Archive (copy)')).toBeInTheDocument()
    })
  },
}

/**
 * Tests duplicate item via overflow menu.
 *
 * Expected behaviors (TDD spec):
 * - Click overflow menu on item
 * - Click "Duplicate" option
 * - New item created with "(copy)" suffix
 * - New item has same href as original
 */
export const InteractionDuplicateItem: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Find item-1 (Root Item) and hover to reveal menu
    const item1 = await canvas.findByTestId('workspace-node-item-1')
    await userEvent.hover(item1)

    // Click overflow menu trigger
    const menuTrigger = canvas.getByTestId('workspace-menu-item-1-trigger')
    await userEvent.click(menuTrigger)

    // Wait for menu to open
    await waitFor(() => {
      expect(body.getByTestId('workspace-menu-item-1')).toBeInTheDocument()
    })

    // Click duplicate
    await userEvent.click(body.getByTestId('workspace-menu-item-1-duplicate'))

    // Verify new item created with "(copy)" suffix
    await waitFor(() => {
      expect(canvas.getByText('Root Item (copy)')).toBeInTheDocument()
    })
  },
}

/**
 * Tests delete via overflow menu.
 *
 * Expected behaviors (TDD spec):
 * - Click overflow menu on node
 * - Click "Delete" option
 * - Node is removed from workspace
 */
export const InteractionDeleteViaMenu: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Wait for item-1 to render (store initialization is async)
    await waitFor(
      () => {
        expect(canvas.getByTestId('workspace-node-item-1')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    // Hover on item-1 to reveal menu
    const item1 = await canvas.findByTestId('workspace-node-item-1')
    await userEvent.hover(item1)

    // Click overflow menu trigger
    const menuTrigger = canvas.getByTestId('workspace-menu-item-1-trigger')
    await userEvent.click(menuTrigger)

    // Wait for menu to open
    await waitFor(() => {
      expect(body.getByTestId('workspace-menu-item-1')).toBeInTheDocument()
    })

    // Click delete
    await userEvent.click(body.getByTestId('workspace-menu-item-1-delete'))

    // Verify node is removed
    await waitFor(() => {
      expect(canvas.queryByTestId('workspace-node-item-1')).not.toBeInTheDocument()
    })
  },
}

/**
 * Tests color picker via overflow menu.
 *
 * Expected behaviors (TDD spec):
 * - Click overflow menu on folder
 * - Hover "Change Color" submenu
 * - Click a color (e.g., blue)
 * - Folder icon color changes
 */
export const InteractionColorPicker: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Wait for render
    await waitFor(() => {
      expect(canvas.getByTestId('workspace-section')).toBeInTheDocument()
    })

    // Verify folder-2 (Archive) exists and has default color
    const folder2 = await canvas.findByTestId('workspace-node-folder-2')
    const folderIconBefore = canvas.getByTestId('workspace-node-folder-2-icon')
    // SVG elements: use getAttribute('class') instead of className (which is SVGAnimatedString)
    expect(folderIconBefore.getAttribute('class')).toContain('text-muted') // default color

    // Hover to reveal menu
    await userEvent.hover(folder2)

    // Click overflow menu trigger
    const menuTrigger = canvas.getByTestId('workspace-menu-folder-2-trigger')
    await userEvent.click(menuTrigger)

    // Wait for menu to open (portal renders to body)
    await waitFor(() => {
      expect(body.getByTestId('workspace-menu-folder-2')).toBeInTheDocument()
    })

    // Click on color submenu trigger to open it
    const colorSubmenu = body.getByTestId('workspace-menu-folder-2-color')
    await userEvent.click(colorSubmenu)

    // Wait for color picker to appear
    await waitFor(() => {
      expect(body.getByTestId('workspace-color-picker')).toBeInTheDocument()
    })

    // Click blue color
    await userEvent.click(body.getByTestId('workspace-color-blue'))

    // Verify folder icon now has blue color class
    await waitFor(() => {
      const folderIconAfter = canvas.getByTestId('workspace-node-folder-2-icon')
      expect(folderIconAfter.getAttribute('class')).toContain('text-info')
    })
  },
}
