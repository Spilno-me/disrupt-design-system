import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Zap,
  ClipboardList,
  FileText,
  Building2,
  Network,
  DollarSign,
  Settings,
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { HelpPage } from '../../components/partners/HelpPage'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof HelpPage> = {
  title: 'Pages/Partner/Help',
  component: HelpPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Help Page

A comprehensive help and documentation center for the Partner Portal.

## Features
- Search functionality
- Quick access links to docs, videos, and support
- Popular articles section
- FAQ accordion
- Contact support section
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HelpPage>

// =============================================================================
// NAVIGATION DATA
// =============================================================================

const partnerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users />,
    href: '/leads',
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <Zap />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
  },
  {
    id: 'partner-network',
    label: 'Partner Network',
    icon: <Network />,
    href: '/partner-network',
  },
  {
    id: 'pricing-calculator',
    label: 'Pricing Calculator',
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function HelpFullPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState('help')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />

      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={2}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu:', item.id)}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={activeNavItem}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => setActiveNavItem('help')}
            />
          </div>

          <main className="flex-1 overflow-auto">
            <HelpPage
              onArticleClick={(article) => {
                console.log('Article clicked:', article)
                alert(`Opening: ${article.title}`)
              }}
              onContactSupport={() => {
                console.log('Contact support clicked')
                alert('Opening support chat...')
              }}
              onSearch={(query) => {
                console.log('Search query:', query)
                alert(`Searching for: ${query}`)
              }}
            />
          </main>
        </div>

        <AppFooter compactOnMobile />

        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={handleNavigate}
          maxVisibleItems={4}
          showHelpItem
          onHelpClick={() => setActiveNavItem('help')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default help page with full layout
 */
export const Default: Story = {
  render: () => <HelpFullPage />,
}

/**
 * Help page with sidebar expanded
 */
function HelpPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('help')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={2}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile' },
            { id: 'settings', label: 'Settings' },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={() => {}}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeNavItem}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onNavigate={(item) => setActiveNavItem(item.id)}
            showHelpItem
          />

          <main className="flex-1 overflow-auto">
            <HelpPage
              onArticleClick={(article) => alert(`Opening: ${article.title}`)}
              onContactSupport={() => alert('Opening support...')}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <HelpPageExpanded />,
}

/**
 * Content only (no layout) for embedding
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <HelpPage
          onArticleClick={(article) => console.log('Article:', article)}
          onContactSupport={() => console.log('Contact support')}
          onSearch={(query) => console.log('Search:', query)}
        />
      </div>
    </div>
  ),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <HelpPage
          onArticleClick={(article) => alert(`Opening: ${article.title}`)}
          onContactSupport={() => alert('Opening support...')}
        />
      </div>
    </div>
  ),
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <HelpFullPage />,
}
