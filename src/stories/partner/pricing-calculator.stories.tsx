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
import { PricingCalculator, PricingInput, PricingBreakdown } from '../../components/partners/PricingCalculator'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof PricingCalculator> = {
  title: 'Pages/Partner/PricingCalculator',
  component: PricingCalculator,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Pricing Calculator

An interactive pricing calculator for partners to estimate costs for potential tenants.

## Features
- Company size and tier selection
- User license distribution (Viewer, Contributor, Power User, Creator)
- Monthly vs Annual billing toggle with 20% annual discount
- Real-time pricing breakdown
- Partner commission calculation
- Quote generation capability
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PricingCalculator>

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

function PricingCalculatorPage({ commissionPercentage = 15 }: { commissionPercentage?: number }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('pricing-calculator')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleCalculate = (input: PricingInput, breakdown: PricingBreakdown) => {
    console.log('Calculated pricing:', { input, breakdown })
  }

  const handleGenerateQuote = (input: PricingInput, breakdown: PricingBreakdown) => {
    console.log('Generating quote for:', { input, breakdown })
    alert(
      `Quote Generated!\n\nTotal: $${breakdown.total.toLocaleString()}/year\nCommission: $${breakdown.partnerCommission.toLocaleString()}`
    )
  }

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

          <main className="flex-1 overflow-auto p-6">
            <PricingCalculator
              commissionPercentage={commissionPercentage}
              onCalculate={handleCalculate}
              onGenerateQuote={handleGenerateQuote}
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
          onHelpClick={() => console.log('Help clicked')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default pricing calculator with standard 15% commission
 */
export const Default: Story = {
  render: () => <PricingCalculatorPage />,
}

/**
 * Calculator with higher commission rate (20%)
 */
export const HighCommission: Story = {
  render: () => <PricingCalculatorPage commissionPercentage={20} />,
}

/**
 * Calculator with lower commission rate (10%)
 */
export const LowCommission: Story = {
  render: () => <PricingCalculatorPage commissionPercentage={10} />,
}

/**
 * Sidebar expanded view
 */
function PricingCalculatorPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('pricing-calculator')

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
          />

          <main className="flex-1 overflow-auto p-6">
            <PricingCalculator
              commissionPercentage={15}
              onCalculate={(input, breakdown) => console.log('Calculated:', input, breakdown)}
              onGenerateQuote={(input, breakdown) => {
                alert(`Quote: $${breakdown.total.toLocaleString()}/year`)
              }}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <PricingCalculatorPageExpanded />,
}

/**
 * Content only (no layout) for embedding
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-6">
        <PricingCalculator
          commissionPercentage={15}
          onCalculate={(input, breakdown) => console.log('Calculated:', input, breakdown)}
          onGenerateQuote={(input, breakdown) => {
            console.log('Generate quote:', input, breakdown)
            alert(`Quote generated for $${breakdown.total.toLocaleString()}/year`)
          }}
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
      <div className="relative z-10 p-4">
        <PricingCalculator
          commissionPercentage={15}
          onCalculate={(input, breakdown) => console.log('Calculated:', input, breakdown)}
          onGenerateQuote={(input, breakdown) => {
            alert(`Quote: $${breakdown.total.toLocaleString()}`)
          }}
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
  render: () => <PricingCalculatorPage />,
}

/**
 * Standalone component for testing
 */
export const Standalone: Story = {
  render: () => (
    <div className="p-6 bg-page min-h-screen">
      <PricingCalculator
        commissionPercentage={15}
        onCalculate={(input, breakdown) => {
          console.log('Input:', input)
          console.log('Breakdown:', breakdown)
        }}
        onGenerateQuote={(input, breakdown) => {
          console.log('Generating quote...')
          console.log('Input:', input)
          console.log('Breakdown:', breakdown)
          alert(
            `Quote Generated!\n\nCompany Size: ${input.companySize}\nTier: ${input.tier}\nUsers: ${input.totalUsers}\n\nTotal: $${breakdown.total.toLocaleString()}/year\nYour Commission: $${breakdown.partnerCommission.toLocaleString()}`
          )
        }}
      />
    </div>
  ),
}
