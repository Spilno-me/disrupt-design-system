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
  ProvisioningMethodSelector,
  ProvisioningMethod,
  TenantProvisioningChat,
  TenantChatFormData,
  TenantProvisioningWizard,
  TenantFormData,
} from '../../components/provisioning'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/TenantProvisioning',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// MOCK DATA
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
// PAGE CONTENT COMPONENT
// =============================================================================

function TenantProvisioningContent() {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)

  const handleSelectMethod = (method: ProvisioningMethod) => {
    console.log('Selected method:', method)
    setSelectedMethod(method)
  }

  const handleBack = () => {
    setSelectedMethod(null)
  }

  const handleChatComplete = (data: TenantChatFormData) => {
    console.log('Tenant created:', data)
    alert(`Tenant "${data.companyName}" has been created successfully!`)
  }

  const handleWizardComplete = (data: TenantFormData) => {
    console.log('Tenant created via wizard:', data)
    alert(`Tenant "${data.companyName}" has been created successfully!\n\nPackage: ${data.package}\nPayment: ${data.paymentMethod}`)
  }

  // Show Chat Assistant
  if (selectedMethod === 'chat') {
    return (
      <div className="flex flex-col h-full">
        {/* Chat takes full space with its own back button */}
        <TenantProvisioningChat
          onComplete={handleChatComplete}
          onCancel={handleBack}
        />
      </div>
    )
  }

  // Show Wizard
  if (selectedMethod === 'wizard') {
    return (
      <TenantProvisioningWizard
        onSubmit={handleWizardComplete}
        onCancel={handleBack}
        commissionPercentage={15}
      />
    )
  }

  // Show Method Selector (default)
  return (
    <div className="p-6 lg:p-8">
      {/* Method Selector */}
      <ProvisioningMethodSelector
        onSelectMethod={handleSelectMethod}
      />
    </div>
  )
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function TenantProvisioningPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('tenant-provisioning')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
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
          <main className="flex-1 overflow-auto">
            <TenantProvisioningContent />
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
  render: () => <TenantProvisioningPage />,
}

// Sidebar expanded by default
function TenantProvisioningPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('tenant-provisioning')

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

          <main className="flex-1 overflow-auto">
            <TenantProvisioningContent />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <TenantProvisioningPageExpanded />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <TenantProvisioningContent />
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
  render: () => {
    const [activeNavItem, setActiveNavItem] = useState('tenant-provisioning')

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
              { id: 'profile', label: 'Profile' },
              { id: 'settings', label: 'Settings' },
              { id: 'logout', label: 'Log out', destructive: true },
            ]}
            onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
          />

          <main className="flex-1 overflow-auto">
            <TenantProvisioningContent />
          </main>

          <AppFooter compactOnMobile />

          <BottomNav
            items={partnerNavItems}
            activeItemId={activeNavItem}
            onNavigate={(item) => setActiveNavItem(item.id)}
            maxVisibleItems={3}
            showHelpItem
            onHelpClick={() => console.log('Help clicked')}
          />
        </div>
      </div>
    )
  },
}

// Component story for ProvisioningMethodSelector alone
export const MethodSelectorOnly: Story = {
  render: () => (
    <div className="p-8 bg-page min-h-screen">
      <ProvisioningMethodSelector
        onSelectMethod={(method) => {
          console.log('Selected:', method)
          alert(`Selected: ${method}`)
        }}
      />
    </div>
  ),
}
