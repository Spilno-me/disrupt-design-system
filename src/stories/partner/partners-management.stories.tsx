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
import { PartnersPage, Partner, MOCK_PARTNERS, PartnerFormData } from '../../components/partners'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/PartnersManagement',
  parameters: {
    layout: 'fullscreen',
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

const extendedPartners: Partner[] = [
  ...MOCK_PARTNERS,
  {
    id: '10',
    name: 'Apex Manufacturing',
    partnerId: 'APX-2024-010',
    contactName: 'David Chen',
    contactEmail: 'd.chen@apexmfg.com',
    tier: 'Premium',
    status: 'active',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '11',
    name: 'Northern Solutions',
    partnerId: 'NRS-2024-011',
    contactName: 'Amanda White',
    contactEmail: 'a.white@northernsolutions.io',
    tier: 'Standard',
    status: 'pending',
    createdAt: new Date('2024-10-15'),
  },
  {
    id: '12',
    name: 'Pacific Trading Co.',
    partnerId: 'PTC-2024-012',
    contactName: 'Kevin Park',
    contactEmail: 'k.park@pacifictrading.com',
    tier: 'Enterprise',
    status: 'active',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: '13',
    name: 'Summit Analytics',
    partnerId: 'SAN-2024-013',
    contactName: 'Lisa Monroe',
    contactEmail: 'l.monroe@summitanalytics.co',
    tier: 'Premium',
    status: 'inactive',
    createdAt: new Date('2024-11-10'),
  },
  {
    id: '14',
    name: 'Horizon Dynamics',
    partnerId: 'HRD-2024-014',
    contactName: 'James Wilson',
    contactEmail: 'j.wilson@horizondynamics.net',
    tier: 'Standard',
    status: 'active',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: '15',
    name: 'Quantum Systems',
    partnerId: 'QSY-2024-015',
    contactName: 'Rachel Green',
    contactEmail: 'r.green@quantumsys.io',
    tier: 'Enterprise',
    status: 'active',
    createdAt: new Date('2024-12-01'),
  },
]

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function PartnerPartnersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('partners')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleManageUsers = (partner: Partner) => {
    console.log('Manage users for:', partner)
    alert(`Managing users for: ${partner.name}`)
  }

  const handleConfirmDelete = (partner: Partner) => {
    console.log('Delete confirmed for:', partner)
    alert(`Partner ${partner.name} deleted successfully!`)
  }

  const handleEditPartner = (partner: Partner, data: PartnerFormData) => {
    console.log('Edit partner:', partner, data)
    alert(`Partner ${data.companyName} updated successfully!`)
  }

  const handleCreatePartner = (data: PartnerFormData) => {
    console.log('Create partner:', data)
    alert(`Partner ${data.companyName} created successfully!`)
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
            <PartnersPage
              partners={extendedPartners}
              onEditPartner={handleEditPartner}
              onCreatePartner={handleCreatePartner}
              onManageUsers={handleManageUsers}
              onConfirmDelete={handleConfirmDelete}
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
  render: () => <PartnerPartnersPage />,
}

// Sidebar expanded by default
function PartnerPartnersPageExpanded() {
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
            <PartnersPage
              partners={extendedPartners}
              onEditPartner={(partner, data) => {
                console.log('Edit partner:', partner, data)
                alert(`Partner ${data.companyName} updated!`)
              }}
              onCreatePartner={(data) => {
                console.log('Create partner:', data)
                alert(`Partner ${data.companyName} created!`)
              }}
              onManageUsers={(partner) => alert(`Managing users: ${partner.name}`)}
              onConfirmDelete={(partner) => alert(`Partner ${partner.name} deleted!`)}
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
  render: () => <PartnerPartnersPageExpanded />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PartnersPage
          partners={extendedPartners}
          onEditPartner={(partner, data) => console.log('Edit:', partner, data)}
          onCreatePartner={(data) => console.log('Create:', data)}
          onManageUsers={(partner) => console.log('Users:', partner)}
          onConfirmDelete={(partner) => console.log('Delete confirmed:', partner)}
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
        <PartnersPage
          partners={MOCK_PARTNERS.slice(0, 5)}
          onEditPartner={(partner, data) => console.log('Edit:', partner, data)}
          onCreatePartner={(data) => console.log('Create:', data)}
        />
      </div>
    </div>
  ),
}

// Empty state
export const EmptyPartners: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PartnersPage
          partners={[]}
          onCreatePartner={(data) => alert(`Partner ${data.companyName} created!`)}
        />
      </div>
    </div>
  ),
}

// With mixed statuses and tiers
export const MixedData: Story = {
  render: () => {
    const mixedPartners: Partner[] = [
      {
        id: '1',
        name: 'Active Standard Partner',
        partnerId: 'ASP-001',
        contactName: 'John Active',
        contactEmail: 'john@active.com',
        tier: 'Standard',
        status: 'active',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Pending Premium Partner',
        partnerId: 'PPP-002',
        contactName: 'Jane Pending',
        contactEmail: 'jane@pending.com',
        tier: 'Premium',
        status: 'pending',
        createdAt: new Date('2024-02-20'),
      },
      {
        id: '3',
        name: 'Inactive Enterprise Partner',
        partnerId: 'IEP-003',
        contactName: 'Bob Inactive',
        contactEmail: 'bob@inactive.com',
        tier: 'Enterprise',
        status: 'inactive',
        createdAt: new Date('2024-03-10'),
      },
      {
        id: '4',
        name: 'Active Enterprise Partner',
        partnerId: 'AEP-004',
        contactName: 'Alice Enterprise',
        contactEmail: 'alice@enterprise.com',
        tier: 'Enterprise',
        status: 'active',
        createdAt: new Date('2024-04-05'),
      },
      {
        id: '5',
        name: 'Pending Standard Partner',
        partnerId: 'PSP-005',
        contactName: 'Charlie Pending',
        contactEmail: 'charlie@pending.com',
        tier: 'Standard',
        status: 'pending',
        createdAt: new Date('2024-05-12'),
      },
    ]

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 p-6">
          <PartnersPage
            partners={mixedPartners}
            onEditPartner={(partner, data) => console.log('Edit:', partner, data)}
            onCreatePartner={(data) => console.log('Create:', data)}
            onManageUsers={(partner) => console.log('Users:', partner)}
            onConfirmDelete={(partner) => console.log('Delete confirmed:', partner)}
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
        <PartnersPage
          partners={[]}
          loading={true}
          onCreatePartner={() => {}}
        />
      </div>
    </div>
  ),
}
