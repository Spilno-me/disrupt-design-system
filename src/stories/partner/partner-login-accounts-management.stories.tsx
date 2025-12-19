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
import {
  PartnerLoginAccountsPage,
  MOCK_LOGIN_ACCOUNTS,
  LoginAccount,
  CreateLoginAccountData,
} from '../../components/partners'
import { PAGE_META, pageDescription } from '../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Partner/Pages/LoginAccounts',
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`Partner login accounts management page within the app shell context. Demonstrates login account CRUD operations with full navigation layout.`),
      },
    },
  },
}

export default meta
type Story = StoryObj

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
    badge: 6,
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
    badge: 9,
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
// EXTENDED MOCK DATA
// =============================================================================

const extendedLoginAccounts: LoginAccount[] = [
  ...MOCK_LOGIN_ACCOUNTS,
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@draxindustries.com.au',
    status: 'active',
    createdAt: new Date('2024-09-20'),
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@draxindustries.com.au',
    status: 'inactive',
    createdAt: new Date('2024-07-10'),
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@draxindustries.com.au',
    status: 'pending',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'r.wilson@draxindustries.com.au',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
]

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function PartnerLoginAccountsFullPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('partners')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleBackClick = () => {
    console.log('Back to partners clicked')
    alert('Navigating back to Partners list')
  }

  const handleCreateLoginAccount = async (data: CreateLoginAccountData) => {
    console.log('Create login account:', data)
    alert(`Login account created for: ${data.email}`)
  }

  const handleResetPassword = async (
    account: LoginAccount,
    mode: 'generate' | 'custom',
    password?: string
  ) => {
    console.log('Reset password:', { account, mode, password })
    if (mode === 'generate') {
      alert(`Password generated for ${account.firstName} ${account.lastName}`)
    } else {
      alert(`Custom password set for ${account.firstName} ${account.lastName}`)
    }
  }

  const handleDeleteLoginAccount = async (account: LoginAccount) => {
    console.log('Delete login account:', account)
    alert(`Login account deleted: ${account.email}`)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* Grid blob background over white */}
      <GridBlobBackground scale={1} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Header */}
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={activeNavItem}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => console.log('Help clicked')}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <PartnerLoginAccountsPage
              partnerName="Drax Industries"
              partnerId="DRX-2024-001"
              loginAccounts={extendedLoginAccounts}
              onBackClick={handleBackClick}
              onCreateLoginAccount={handleCreateLoginAccount}
              onResetPassword={handleResetPassword}
              onDeleteLoginAccount={handleDeleteLoginAccount}
            />
          </main>
        </div>

        {/* Footer - compact on mobile, full on desktop */}
        <AppFooter compactOnMobile />

        {/* Mobile Bottom Navigation */}
        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={handleNavigate}
          maxVisibleItems={3}
          showHelpItem
          onHelpClick={() => console.log('Help clicked')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => <PartnerLoginAccountsFullPage />,
}

// Sidebar expanded by default
function PartnerLoginAccountsExpandedSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('partners')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeNavItem}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onNavigate={(item) => setActiveNavItem(item.id)}
          />

          <main className="flex-1 overflow-auto p-6">
            <PartnerLoginAccountsPage
              partnerName="Drax Industries"
              partnerId="DRX-2024-001"
              loginAccounts={extendedLoginAccounts}
              onBackClick={() => alert('Back to Partners')}
              onCreateLoginAccount={(data) => {
                console.log('Create:', data)
                alert(`Account created: ${data.email}`)
                return Promise.resolve()
              }}
              onResetPassword={(account, mode) => {
                alert(`Password ${mode === 'generate' ? 'generated' : 'set'} for ${account.email}`)
                return Promise.resolve()
              }}
              onDeleteLoginAccount={(account) => {
                alert(`Deleted: ${account.email}`)
                return Promise.resolve()
              }}
            />
          </main>
        </div>

        <AppFooter compactOnMobile />

        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={(item) => setActiveNavItem(item.id)}
          maxVisibleItems={3}
        />
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <PartnerLoginAccountsExpandedSidebar />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PartnerLoginAccountsPage
          partnerName="Drax Industries"
          partnerId="DRX-2024-001"
          loginAccounts={extendedLoginAccounts}
          onBackClick={() => console.log('Back clicked')}
          onCreateLoginAccount={(data) => {
            console.log('Create:', data)
            return Promise.resolve()
          }}
          onResetPassword={(account, mode, password) => {
            console.log('Reset:', { account, mode, password })
            return Promise.resolve()
          }}
          onDeleteLoginAccount={(account) => {
            console.log('Delete:', account)
            return Promise.resolve()
          }}
        />
      </div>
    </div>
  ),
}

// Mobile viewport
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-4">
        <PartnerLoginAccountsPage
          partnerName="Drax Industries"
          partnerId="DRX-2024-001"
          loginAccounts={MOCK_LOGIN_ACCOUNTS}
          onBackClick={() => console.log('Back clicked')}
          onCreateLoginAccount={(data) => {
            console.log('Create:', data)
            return Promise.resolve()
          }}
        />
      </div>
    </div>
  ),
}

// Empty state
export const EmptyLoginAccounts: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PartnerLoginAccountsPage
          partnerName="New Partner Inc"
          partnerId="NPI-2024-001"
          loginAccounts={[]}
          onBackClick={() => console.log('Back clicked')}
          onCreateLoginAccount={(data) => {
            alert(`Account created: ${data.email}`)
            return Promise.resolve()
          }}
        />
      </div>
    </div>
  ),
}

// With mixed statuses
export const MixedStatuses: Story = {
  render: () => {
    const mixedAccounts: LoginAccount[] = [
      {
        id: '1',
        firstName: 'Active',
        lastName: 'User',
        email: 'active@example.com',
        status: 'active',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        firstName: 'Pending',
        lastName: 'User',
        email: 'pending@example.com',
        status: 'pending',
        createdAt: new Date('2024-02-20'),
      },
      {
        id: '3',
        firstName: 'Inactive',
        lastName: 'User',
        email: 'inactive@example.com',
        status: 'inactive',
        createdAt: new Date('2024-03-10'),
      },
    ]

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 p-6">
          <PartnerLoginAccountsPage
            partnerName="Test Partner"
            partnerId="TST-2024-001"
            loginAccounts={mixedAccounts}
            onBackClick={() => console.log('Back clicked')}
            onCreateLoginAccount={(data) => {
              console.log('Create:', data)
              return Promise.resolve()
            }}
            onResetPassword={(account, mode, password) => {
              console.log('Reset:', { account, mode, password })
              return Promise.resolve()
            }}
            onDeleteLoginAccount={(account) => {
              console.log('Delete:', account)
              return Promise.resolve()
            }}
          />
        </div>
      </div>
    )
  },
}

// Loading state
export const Loading: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PartnerLoginAccountsPage
          partnerName="Drax Industries"
          partnerId="DRX-2024-001"
          loginAccounts={[]}
          loading={true}
          onBackClick={() => console.log('Back clicked')}
        />
      </div>
    </div>
  ),
}
