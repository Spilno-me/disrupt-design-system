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
import { AppSidebar, NavItem } from '../../../components/ui/AppSidebar'
import { AppHeader } from '../../../components/ui/AppHeader'
import { AppFooter } from '../../../components/ui/AppFooter'
import { BottomNav } from '../../../components/ui/BottomNav'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import { InvoicesPage } from '../../../components/partners/invoices/InvoicesPage'
import type { Invoice, InvoiceAction } from '../../../components/partners/invoices/types'
import { formatCurrency } from '../../../components/partners/invoices/types'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/InvoicesManagement',
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
    badge: 19,
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

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-1208-0172',
    status: 'draft',
    invoiceDate: '2025-12-08',
    dueDate: '2026-01-07',
    company: {
      name: 'Fine Goods corp.',
      address: '233 Orlov Street',
      city: 'New York',
      state: 'NY',
      zip: '09440',
      country: 'US',
      email: 'email@finegoods.io',
      phone: '(155) 580-8934',
    },
    metadata: {
      companySize: 'Enterprise',
      employees: 5011000,
      totalUsers: 670,
      pricingVersion: 'v19-2025-12-08',
    },
    description: 'Tenant provisioning for Fine Goods corp.',
    lineItems: [
      {
        id: 'li-1',
        description: 'Platform Base (ENTERPRISE, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 26000,
        total: 26000,
        metadata: { billingCycle: 'annual', tier: 'Enterprise' },
      },
      {
        id: 'li-2',
        description: 'Premium Process (Annual)',
        type: 'process',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
        metadata: { billingCycle: 'annual' },
      },
      {
        id: 'li-3',
        description: 'Viewer License (Annual)',
        type: 'license',
        quantity: 400,
        unitPrice: 120,
        total: 48000,
        metadata: { billingCycle: 'annual' },
      },
      {
        id: 'li-4',
        description: 'Contributor License (Annual)',
        type: 'license',
        quantity: 200,
        unitPrice: 360,
        total: 72000,
        metadata: { billingCycle: 'annual' },
      },
      {
        id: 'li-5',
        description: 'Power User License (Annual)',
        type: 'license',
        quantity: 50,
        unitPrice: 720,
        total: 36000,
        metadata: { billingCycle: 'annual' },
      },
      {
        id: 'li-6',
        description: 'Creator License (Annual)',
        type: 'license',
        quantity: 20,
        unitPrice: 1800,
        total: 36000,
        metadata: { billingCycle: 'annual' },
      },
    ],
    subtotal: 221000,
    total: 221000,
    paymentTerms: 'net_30',
    notes: 'Tenant provisioning for Fine Goods corp. Contact: email@finegoods.io VAT: Article 196 reverse charge applies for EU customers.',
    pdfUrl: '/mock-invoice.pdf',
    createdAt: '2025-12-08T10:00:00Z',
    updatedAt: '2025-12-08T10:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-1208-7603',
    status: 'draft',
    invoiceDate: '2025-12-08',
    dueDate: '2026-01-07',
    company: {
      name: 'First Lucky Corp',
      address: '456 Silicon Valley Blvd',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
      email: 'accounts@firstlucky.com',
    },
    metadata: {
      companySize: 'Mid-Market',
      employees: 366,
      totalUsers: 366,
      pricingVersion: 'v18-2025-12-01',
    },
    description: 'Tenant setup for First Lucky Corp',
    lineItems: [
      {
        id: 'li-7',
        description: 'Platform Base (Professional, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 60000,
        total: 60000,
      },
      {
        id: 'li-8',
        description: 'Standard Process (Annual)',
        type: 'process',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
      {
        id: 'li-9',
        description: 'User License (Annual)',
        type: 'license',
        quantity: 366,
        unitPrice: 198,
        total: 72400,
      },
    ],
    subtotal: 147400,
    total: 147400,
    paymentTerms: 'net_30',
    createdAt: '2025-12-08T09:30:00Z',
    updatedAt: '2025-12-08T09:30:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-1206-5341',
    status: 'draft',
    invoiceDate: '2025-12-06',
    dueDate: '2026-01-05',
    company: {
      name: 'Good Luck Corp',
      address: '789 Industrial Park',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'US',
      email: 'finance@goodluck.com',
    },
    metadata: {
      companySize: 'Enterprise',
      employees: 330,
      totalUsers: 330,
      pricingVersion: 'v18-2025-12-01',
    },
    description: 'Tenant provisioning for Good Luck Corp',
    lineItems: [
      {
        id: 'li-10',
        description: 'Platform Base (Enterprise, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 75000,
        total: 75000,
      },
      {
        id: 'li-11',
        description: 'Advanced Process Suite (Annual)',
        type: 'process',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
      {
        id: 'li-12',
        description: 'Power User License (Annual)',
        type: 'license',
        quantity: 330,
        unitPrice: 62,
        total: 20400,
      },
    ],
    subtotal: 120400,
    total: 120400,
    paymentTerms: 'net_30',
    createdAt: '2025-12-06T14:15:00Z',
    updatedAt: '2025-12-06T14:15:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-1203-9772',
    status: 'draft',
    invoiceDate: '2025-12-03',
    dueDate: '2026-01-02',
    company: {
      name: 'Freedom Inc',
      address: '321 Innovation Way',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'US',
      email: 'billing@freedom.com',
    },
    description: 'Tenant setup for Freedom Inc',
    lineItems: [
      {
        id: 'li-13',
        description: 'Platform Base (Starter, Annual)',
        type: 'platform',
        quantity: 0,
        unitPrice: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    total: 0,
    paymentTerms: 'net_30',
    createdAt: '2025-12-03T11:00:00Z',
    updatedAt: '2025-12-03T11:00:00Z',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-1203-0358',
    status: 'draft',
    invoiceDate: '2025-12-03',
    dueDate: '2026-01-02',
    company: {
      name: 'Hampden Bakers',
      address: '555 Commerce Street',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'US',
      email: 'ap@hampden.com',
    },
    description: 'Tenant setup for Hampden Bakers',
    lineItems: [
      {
        id: 'li-14',
        description: 'Platform Base (Professional, Monthly)',
        type: 'platform',
        quantity: 0,
        unitPrice: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    total: 0,
    paymentTerms: 'net_30',
    createdAt: '2025-12-03T08:45:00Z',
    updatedAt: '2025-12-03T08:45:00Z',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2025-1027-8234',
    status: 'sent',
    invoiceDate: '2025-10-27',
    dueDate: '2025-11-26',
    company: {
      name: 'Tech Innovations LLC',
      address: '999 Medical Center Drive',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'US',
      email: 'procurement@techinnovations.com',
    },
    description: 'Annual enterprise agreement',
    lineItems: [
      {
        id: 'li-15',
        description: 'Platform Base (Enterprise, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 200000,
        total: 200000,
      },
    ],
    subtotal: 200000,
    total: 200000,
    paymentTerms: 'net_30',
    createdAt: '2025-10-27T16:20:00Z',
    updatedAt: '2025-10-27T16:20:00Z',
  },
  {
    id: '7',
    invoiceNumber: 'INV-2025-1015-4521',
    status: 'overdue',
    invoiceDate: '2025-10-15',
    dueDate: '2025-11-14',
    company: {
      name: 'Startup Ventures Co.',
      address: '123 Startup Lane',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      country: 'US',
      email: 'billing@startupventures.com',
    },
    description: 'Initial setup and onboarding',
    lineItems: [
      {
        id: 'li-16',
        description: 'Platform Base (Starter, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ],
    subtotal: 25000,
    total: 25000,
    paymentTerms: 'net_30',
    createdAt: '2025-10-15T11:00:00Z',
    updatedAt: '2025-10-15T11:00:00Z',
  },
  {
    id: '8',
    invoiceNumber: 'INV-2025-0928-1122',
    status: 'paid',
    invoiceDate: '2025-09-28',
    dueDate: '2025-10-28',
    company: {
      name: 'Global Manufacturing Inc.',
      address: '789 Industrial Park',
      city: 'Detroit',
      state: 'MI',
      zip: '48201',
      country: 'US',
      email: 'finance@globalmfg.com',
    },
    description: 'Q3 2025 Services',
    lineItems: [
      {
        id: 'li-17',
        description: 'Platform Base (Enterprise, Annual)',
        type: 'platform',
        quantity: 1,
        unitPrice: 150000,
        total: 150000,
      },
    ],
    subtotal: 150000,
    total: 150000,
    paymentTerms: 'net_30',
    createdAt: '2025-09-28T14:15:00Z',
    updatedAt: '2025-10-25T10:20:00Z',
  },
  {
    id: '9',
    invoiceNumber: 'INV-2025-0901-5567',
    status: 'partially_paid',
    invoiceDate: '2025-09-01',
    dueDate: '2025-10-01',
    company: {
      name: 'Retail Solutions Group',
      address: '555 Commerce Street',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'US',
      email: 'ap@retailsolutions.com',
    },
    description: 'Monthly services - September 2025',
    lineItems: [
      {
        id: 'li-18',
        description: 'Platform Base (Professional, Monthly)',
        type: 'platform',
        quantity: 1,
        unitPrice: 6000,
        total: 6000,
      },
      {
        id: 'li-19',
        description: 'User License (Monthly)',
        type: 'license',
        quantity: 100,
        unitPrice: 5,
        total: 500,
      },
    ],
    subtotal: 6500,
    total: 6500,
    paymentTerms: 'net_30',
    createdAt: '2025-09-01T08:45:00Z',
    updatedAt: '2025-09-15T15:30:00Z',
  },
]

// Calculate stats from mock data
const stats = {
  totalInvoices: {
    value: mockInvoices.length,
    trend: '+3',
    trendDirection: 'up' as const,
  },
  draft: {
    value: mockInvoices.filter((i) => i.status === 'draft').length,
    trend: '+2',
    trendDirection: 'up' as const,
  },
  unpaid: {
    value: mockInvoices.filter((i) => i.status === 'sent' || i.status === 'partially_paid').length,
    trend: '-1',
    trendDirection: 'down' as const,
  },
  overdue: {
    value: mockInvoices.filter((i) => i.status === 'overdue').length,
    trend: '0',
    trendDirection: 'neutral' as const,
  },
  totalRevenue: {
    value: formatCurrency(
      mockInvoices
        .filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)
    ),
    trend: '+15%',
    trendDirection: 'up' as const,
  },
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function PartnerInvoicesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('invoices')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleInvoiceClick = (invoice: Invoice) => {
    console.log('Opening invoice:', invoice)
  }

  const handleInvoiceAction = (invoice: Invoice, action: InvoiceAction) => {
    console.log('Action for invoice:', action, invoice)
    if (action === 'mark_sent') {
      alert(`Invoice ${invoice.invoiceNumber} marked as sent`)
    }
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
            <InvoicesPage
              invoices={mockInvoices}
              stats={stats}
              onInvoiceClick={handleInvoiceClick}
              onInvoiceAction={handleInvoiceAction}
              onCreateInvoice={() => {
                console.log('Creating invoice')
                alert('Create new invoice')
              }}
              onUpdateInvoice={(invoice, data) => {
                console.log('Updating invoice:', invoice.invoiceNumber, data)
                alert(`Invoice ${invoice.invoiceNumber} updated`)
              }}
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

/**
 * Full Partner Invoices page with sidebar, header, and footer
 */
export const Default: Story = {
  render: () => <PartnerInvoicesPage />,
}

/**
 * Invoices page with sidebar expanded
 */
function PartnerInvoicesPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('invoices')

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
            <InvoicesPage
              invoices={mockInvoices}
              stats={stats}
              onInvoiceClick={(invoice) => console.log('Invoice clicked:', invoice)}
              onCreateInvoice={() => alert('Create new invoice')}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <PartnerInvoicesPageExpanded />,
}

/**
 * Content only - no sidebar/header (for embedding)
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <InvoicesPage
          invoices={mockInvoices}
          stats={stats}
          onInvoiceClick={(invoice) => console.log('Invoice clicked:', invoice)}
          onCreateInvoice={() => alert('Create new invoice')}
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
        <InvoicesPage
          invoices={mockInvoices.slice(0, 5)}
          stats={{
            totalInvoices: { value: 5 },
            draft: { value: 3 },
            unpaid: { value: 1 },
            overdue: { value: 1 },
            totalRevenue: { value: '$150,000' },
          }}
          onInvoiceClick={(invoice) => console.log('Invoice clicked:', invoice)}
        />
      </div>
    </div>
  ),
}

/**
 * Empty state - no invoices
 */
export const EmptyInvoices: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <InvoicesPage
          invoices={[]}
          stats={{
            totalInvoices: { value: 0, trendDirection: 'neutral' },
            draft: { value: 0, trendDirection: 'neutral' },
            unpaid: { value: 0, trendDirection: 'neutral' },
            overdue: { value: 0, trendDirection: 'neutral' },
            totalRevenue: { value: '$0.00' },
          }}
          onCreateInvoice={() => alert('Create new invoice')}
        />
      </div>
    </div>
  ),
}

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <InvoicesPage
          invoices={mockInvoices}
          stats={stats}
          loading={true}
        />
      </div>
    </div>
  ),
}
