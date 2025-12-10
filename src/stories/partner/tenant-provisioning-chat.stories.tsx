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
import { TenantProvisioningChat, TenantChatFormData } from '../../components/provisioning'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof TenantProvisioningChat> = {
  title: 'Pages/Partner/TenantProvisioningChat',
  component: TenantProvisioningChat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TenantProvisioningChat>

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

const completedTenantData: TenantChatFormData = {
  companyName: 'Acme Manufacturing Co.',
  industry: 'Manufacturing',
  companySize: '201-500',
  contactEmail: 'john.smith@acmemfg.com',
  contactName: 'John Smith',
  contactPhone: '+1 (555) 123-4567',
  billingStreet: '123 Industrial Blvd',
  billingCity: 'Detroit',
  billingState: 'MI',
  billingZip: '48201',
  billingCountry: 'United States',
  pricingTier: 'Professional',
  billingCycle: 'Annually (Save 20%)',
}

// =============================================================================
// STANDALONE CHAT COMPONENT
// =============================================================================

function StandaloneChatDemo() {
  const [completedData, setCompletedData] = useState<TenantChatFormData | null>(null)

  const handleComplete = (data: TenantChatFormData) => {
    console.log('Tenant created:', data)
    setCompletedData(data)
  }

  const handleCancel = () => {
    console.log('Cancelled')
    alert('Provisioning cancelled')
  }

  return (
    <div className="h-screen w-full bg-page p-4">
      <div className="h-full max-w-2xl mx-auto">
        <TenantProvisioningChat
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
      {completedData && (
        <div className="fixed bottom-4 right-4 p-4 bg-success-light border border-success rounded-lg text-sm text-success">
          Tenant "{completedData.companyName}" created!
        </div>
      )}
    </div>
  )
}

// =============================================================================
// IN-PAGE CHAT (WITH FULL LAYOUT)
// =============================================================================

function InPageChatDemo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('tenant-provisioning')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleComplete = (data: TenantChatFormData) => {
    console.log('Tenant created:', data)
    alert(`Tenant "${data.companyName}" has been created!`)
  }

  const handleCancel = () => {
    console.log('Cancelled - would go back to method selector')
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

          {/* Page Content - Chat fills the space */}
          <main className="flex-1 overflow-hidden">
            <TenantProvisioningChat
              onComplete={handleComplete}
              onCancel={handleCancel}
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
// COMPLETED FLOW DEMO (PRE-FILLED)
// =============================================================================

function CompletedFlowDemo() {
  return (
    <div className="h-screen w-full bg-page p-4">
      <div className="h-full max-w-2xl mx-auto bg-surface border border-default flex flex-col">
        {/* Simulated completed state */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default">
          <div>
            <h2 className="font-semibold text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal" />
              Tenant Setup Assistant
            </h2>
            <p className="text-xs text-secondary">Completed</p>
          </div>
          <div className="text-sm text-success font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-success rounded-full" />
            Complete
          </div>
        </div>

        {/* Simulated conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted-bg text-primary">
              <p className="text-sm">Welcome! Let's set up a new tenant. What's the company name?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-teal text-inverse">
              <p className="text-sm">Acme Manufacturing Co.</p>
            </div>
          </div>

          {/* Industry */}
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted-bg text-primary">
              <p className="text-sm">Great! What industry is Acme Manufacturing Co. in?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-teal text-inverse">
              <p className="text-sm">Manufacturing</p>
            </div>
          </div>

          {/* Company size */}
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted-bg text-primary">
              <p className="text-sm">How many employees does the company have?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-teal text-inverse">
              <p className="text-sm">201-500</p>
            </div>
          </div>

          {/* More messages would continue... */}
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted-bg text-primary">
              <p className="text-sm">Creating tenant...</p>
            </div>
          </div>

          {/* Success message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted-bg text-primary">
              <p className="text-sm">Tenant 'Acme Manufacturing Co.' has been created successfully!</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mt-4">
            <div className="border border-default rounded-lg bg-surface p-4">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <span className="w-5 h-5 text-success">&#10003;</span>
                Tenant Created Successfully
              </h3>

              <div className="space-y-4">
                {/* Company Info */}
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">{completedTenantData.companyName}</p>
                    <p className="text-sm text-secondary">{completedTenantData.industry} - {completedTenantData.companySize} employees</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">{completedTenantData.contactName}</p>
                    <p className="text-sm text-secondary">{completedTenantData.contactEmail}</p>
                    <p className="text-sm text-secondary">{completedTenantData.contactPhone}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">{completedTenantData.pricingTier} Plan</p>
                    <p className="text-sm text-secondary">{completedTenantData.billingCycle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Standalone chat component - the chat fills its container.
 * Best for embedding in modals or dedicated pages.
 */
export const Default: Story = {
  render: () => <StandaloneChatDemo />,
}

/**
 * Chat embedded in the full Partner Portal layout with sidebar,
 * header, and footer. Shows how the chat integrates with the app.
 */
export const InPage: Story = {
  render: () => <InPageChatDemo />,
}

/**
 * Shows the chat after all questions have been answered,
 * displaying the summary card with tenant details.
 */
export const WithCompletedFlow: Story = {
  render: () => <CompletedFlowDemo />,
}

/**
 * Mobile viewport - shows responsive behavior
 */
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

          <main className="flex-1 overflow-hidden">
            <TenantProvisioningChat
              onComplete={(data) => console.log('Complete:', data)}
              onCancel={() => console.log('Cancel')}
            />
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
