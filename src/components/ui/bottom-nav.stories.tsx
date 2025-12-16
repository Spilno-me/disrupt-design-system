import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BottomNav } from './BottomNav'
import { AppCard } from './app-card'
import { Home, Users, FileText, Settings, BarChart, Bell, Package, Calendar } from 'lucide-react'
import type { NavItem } from './navigation/types'

const meta: Meta<typeof BottomNav> = {
  title: 'Core/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BottomNav>

// Sample navigation items
const basicNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  { id: 'partners', label: 'Partners', icon: <Users />, href: '/partners', badge: 3 },
  { id: 'reports', label: 'Reports', icon: <FileText />, href: '/reports' },
  { id: 'settings', label: 'Settings', icon: <Settings />, href: '/settings' },
]

const extendedNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  { id: 'partners', label: 'Partners', icon: <Users />, href: '/partners', badge: 5 },
  { id: 'reports', label: 'Reports', icon: <FileText />, href: '/reports' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart />, href: '/analytics', badge: true },
  { id: 'notifications', label: 'Notifications', icon: <Bell />, href: '/notifications', badge: 12 },
  { id: 'inventory', label: 'Inventory', icon: <Package />, href: '/inventory' },
  { id: 'calendar', label: 'Calendar', icon: <Calendar />, href: '/calendar' },
  { id: 'settings', label: 'Settings', icon: <Settings />, href: '/settings' },
]

const groupNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Users />,
    href: '/partners',
    children: [
      { id: 'partners-all', label: 'All Partners', icon: <Users />, href: '/partners/all' },
      { id: 'partners-active', label: 'Active', icon: <Users />, href: '/partners/active', badge: 3 },
      { id: 'partners-pending', label: 'Pending', icon: <Users />, href: '/partners/pending', badge: 7 },
    ],
  },
  { id: 'reports', label: 'Reports', icon: <FileText />, href: '/reports' },
]

/**
 * Default bottom navigation with 3 visible items and More menu.
 * Shows badge indicators and overflow menu behavior.
 */
export const Default: Story = {
  args: {
    items: extendedNavItems,
    activeItemId: 'dashboard',
    maxVisibleItems: 3,
    onNavigate: (item) => console.log('Navigate to:', item.id),
    forceVisible: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-muted-bg pb-16">
        <div className="container mx-auto p-6 space-y-4">
          <AppCard className="p-6">
            <h2 className="text-lg font-semibold mb-2">Main Content Area</h2>
            <p className="text-sm text-muted">Scroll to see the bottom navigation bar fixed at the bottom.</p>
          </AppCard>
        </div>
        <Story />
      </div>
    ),
  ],
}

/**
 * Bottom navigation with nested groups.
 * When a group item in the visible area is tapped, the More menu opens showing its children.
 */
export const WithNestedGroups: Story = {
  args: {
    items: groupNavItems,
    activeItemId: 'partners-active',
    maxVisibleItems: 3,
    onNavigate: (item) => console.log('Navigate to:', item.id),
    forceVisible: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-muted-bg pb-16">
        <div className="container mx-auto p-6 space-y-4">
          <AppCard className="p-6">
            <h2 className="text-lg font-semibold mb-2">Nested Navigation</h2>
            <p className="text-sm text-muted">Tap Partners to see nested items in the More menu.</p>
          </AppCard>
        </div>
        <Story />
      </div>
    ),
  ],
}

/**
 * AllStates demonstrates all configurations and behaviors.
 *
 * **Props:**
 * - `data-slot="bottom-nav"` for the nav element
 * - `data-slot="bottom-nav-tab"` for individual tabs
 * - `data-slot="bottom-nav-more"` for the More button
 *
 * **Features:**
 * - Fixed position at bottom
 * - Badge indicators (count and dot)
 * - More menu with Sheet
 * - Nested groups with expansion
 * - Help menu item
 * - Focus states on all interactive elements
 */
export const AllStates: Story = {
  render: () => {
    const [activeId, setActiveId] = React.useState('dashboard')

    return (
      // Page spacing: 64px between major sections
      <div className="space-y-16 max-w-4xl mx-auto p-6 pb-24">
        {/* Anatomy */}
        <AppCard className="p-6">
          <h3 className="text-sm font-semibold mb-4">BottomNav Anatomy</h3>
          {/* Comfortable gap: 24px between anatomy items */}
          <div className="flex items-start gap-6">
            <AppCard variant="flat" className="flex-1 p-4 border-dashed text-xs">
              {/* Tight spacing: 4px between related tree items */}
              <div className="space-y-1 text-muted">
                <div>BottomNav (root, data-slot="bottom-nav")</div>
                <div className="ml-2">|- BottomNavTab[] (visible items)</div>
                <div className="ml-4">|- Icon + Badge</div>
                <div className="ml-4">|- Label</div>
                <div className="ml-2">|- MoreTab (if overflow)</div>
                <div className="ml-2">|- Sheet (More menu)</div>
                <div className="ml-4">|- SheetNavItem[] | SheetNavGroup[]</div>
                <div className="ml-4">|- SheetHelpItem (optional)</div>
              </div>
            </AppCard>
            <div className="flex-1">
              <div className="text-xs font-medium mb-2">data-slot:</div>
              <code className="text-xs text-muted">
                bottom-nav, bottom-nav-tab, bottom-nav-more
              </code>
            </div>
          </div>
        </AppCard>

        {/* Basic Configuration */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Basic Configuration (4 items)</h3>
          <AppCard className="p-6">
            <p className="text-xs text-muted mb-4">All items visible, no More menu</p>
            <div className="relative h-[400px] bg-muted-bg rounded-md overflow-hidden border border-default">
              <div className="p-4">
                <p className="text-sm text-muted">Content area</p>
              </div>
              <BottomNav
                items={basicNavItems}
                activeItemId={activeId}
                onNavigate={(item) => setActiveId(item.id)}
                maxVisibleItems={4}
                showHelpItem={false}
                embedded
              />
            </div>
          </AppCard>
        </div>

        {/* Overflow Configuration */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Overflow Configuration (8 items, 3 visible)</h3>
          <AppCard className="p-6">
            <p className="text-xs text-muted mb-4">Shows More menu for overflow items</p>
            <div className="relative h-[400px] bg-muted-bg rounded-md overflow-hidden border border-default">
              <div className="p-4">
                <p className="text-sm text-muted">Tap More to see additional items</p>
              </div>
              <BottomNav
                items={extendedNavItems}
                activeItemId={activeId}
                onNavigate={(item) => setActiveId(item.id)}
                maxVisibleItems={3}
                showHelpItem={true}
                onHelpClick={() => console.log('Help clicked')}
                embedded
              />
            </div>
          </AppCard>
        </div>

        {/* Badge Variations */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Badge Variations</h3>
          <AppCard className="p-6">
            <p className="text-xs text-muted mb-4">Count badges and dot indicators</p>
            <div className="relative h-[400px] bg-muted-bg rounded-md overflow-hidden border border-default">
              <div className="p-4 space-y-2">
                <p className="text-sm font-medium">Badge Types:</p>
                <ul className="text-xs text-muted space-y-1">
                  <li>• Partners: Count badge (5)</li>
                  <li>• Analytics: Dot indicator (true)</li>
                  <li>• Notifications: High count (12)</li>
                </ul>
              </div>
              <BottomNav
                items={extendedNavItems}
                activeItemId="partners"
                onNavigate={(item) => setActiveId(item.id)}
                maxVisibleItems={3}
                showHelpItem={false}
                embedded
              />
            </div>
          </AppCard>
        </div>

        {/* Nested Groups */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Nested Groups</h3>
          <AppCard className="p-6">
            <p className="text-xs text-muted mb-4">Groups expand in More menu</p>
            <div className="relative h-[400px] bg-muted-bg rounded-md overflow-hidden border border-default">
              <div className="p-4">
                <p className="text-sm text-muted">Tap Partners to see nested items</p>
              </div>
              <BottomNav
                items={groupNavItems}
                activeItemId="partners-active"
                onNavigate={(item) => setActiveId(item.id)}
                maxVisibleItems={3}
                showHelpItem={false}
                embedded
              />
            </div>
          </AppCard>
        </div>

        {/* States */}
        <div>
          <h3 className="text-sm font-semibold mb-4">States</h3>
          {/* Base gap: 16px between state cards */}
          <div className="grid grid-cols-2 gap-4">
            <AppCard className="p-6">
              <p className="text-xs text-muted mb-4">Active State</p>
              <div className="relative h-[300px] bg-muted-bg rounded-md overflow-hidden border border-default">
                <BottomNav
                  items={basicNavItems}
                  activeItemId="partners"
                  onNavigate={(item) => setActiveId(item.id)}
                  maxVisibleItems={4}
                  showHelpItem={false}
                  embedded
                />
              </div>
            </AppCard>

            <AppCard className="p-6">
              <p className="text-xs text-muted mb-4">With Help Item</p>
              <div className="relative h-[300px] bg-muted-bg rounded-md overflow-hidden border border-default">
                <BottomNav
                  items={basicNavItems.slice(0, 3)}
                  activeItemId="dashboard"
                  onNavigate={(item) => setActiveId(item.id)}
                  maxVisibleItems={3}
                  showHelpItem={true}
                  onHelpClick={() => console.log('Help')}
                  embedded
                />
              </div>
            </AppCard>

            <AppCard className="p-6">
              <p className="text-xs text-muted mb-4">Custom More Label</p>
              <div className="relative h-[300px] bg-muted-bg rounded-md overflow-hidden border border-default">
                <BottomNav
                  items={extendedNavItems}
                  activeItemId="dashboard"
                  onNavigate={(item) => setActiveId(item.id)}
                  maxVisibleItems={3}
                  moreLabel="Menu"
                  showHelpItem={false}
                  embedded
                />
              </div>
            </AppCard>

            <AppCard className="p-6">
              <p className="text-xs text-muted mb-4">Disabled Items</p>
              <div className="relative h-[300px] bg-muted-bg rounded-md overflow-hidden border border-default">
                <BottomNav
                  items={[
                    ...basicNavItems.slice(0, 2),
                    { ...basicNavItems[2], disabled: true },
                    basicNavItems[3],
                  ]}
                  activeItemId="dashboard"
                  onNavigate={(item) => setActiveId(item.id)}
                  maxVisibleItems={4}
                  showHelpItem={false}
                  embedded
                />
              </div>
            </AppCard>
          </div>
        </div>

        {/* Focus Behavior */}
        <AppCard className="p-6">
          <h3 className="text-sm font-semibold mb-4">Focus Behavior</h3>
          <div className="text-xs text-muted space-y-2">
            <p>
              <strong>Tab navigation:</strong> Use Tab to navigate between visible tabs and the More button
            </p>
            <p>
              <strong>Focus indicator:</strong> focus-visible:bg-accent-bg on all interactive elements
            </p>
            <p>
              <strong>More menu:</strong> Sheet component handles focus management for menu items
            </p>
            <p>
              <strong>Groups:</strong> ChevronRight indicates expandable groups in More menu
            </p>
          </div>
        </AppCard>
      </div>
    )
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-muted-bg">
        <Story />
      </div>
    ),
  ],
}
