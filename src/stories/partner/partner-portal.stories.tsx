import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
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
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

// Import all page components
import { LeadsPage } from '../../components/leads/LeadsPage'
import { Lead } from '../../components/leads/LeadCard'
import { PartnersPage, Partner, MOCK_PARTNERS, PartnerFormData } from '../../components/partners'
import {
  PartnerNetworkPage,
  MOCK_NETWORK_PARTNERS,
} from '../../components/partners'
import { InvoicesPage } from '../../components/partners/invoices/InvoicesPage'
import type { Invoice, InvoiceAction } from '../../components/partners/invoices/types'
import { formatCurrency } from '../../components/partners/invoices/types'
import {
  ProvisioningMethodSelector,
  ProvisioningMethod,
  TenantProvisioningChat,
  TenantChatFormData,
} from '../../components/provisioning'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/PartnerPortal',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Partner Portal - Complete Application

This is a fully interactive Partner Portal that combines all pages into a single working application.
Navigate between pages using the sidebar or bottom navigation on mobile.

## Available Pages

- **Dashboard** - Overview with KPIs and quick actions
- **Leads** - Lead management and tracking
- **Tenant Provisioning** - Create new tenant accounts
- **Tenant Requests** - View and manage pending requests
- **Invoices** - Invoice management and billing
- **Partners** - Partner company management
- **Partner Network** - Network and sub-partner management
- **Pricing Calculator** - Calculate pricing for tenants
        `,
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
    badge: 3,
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
// MOCK DATA - LEADS
// =============================================================================

const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Peter Thiel',
    company: 'Founders Fund',
    email: 'pthiel@foundersfund.com',
    phone: '+1-555-0101',
    priority: 'high',
    score: 95,
    status: 'qualified',
    source: 'referral',
    description: 'Interested in enterprise compliance solution for portfolio companies',
    value: 150000,
    createdAt: '1 day ago',
  },
  {
    id: '2',
    name: 'Lisa Chen',
    company: 'Novacorp Industries',
    email: 'lisa.chen@novacorp.io',
    phone: '+1-337-501-5023',
    priority: 'high',
    score: 88,
    status: 'contacted',
    source: 'website',
    description: 'Manufacturing company seeking EHS automation platform',
    value: 75000,
    createdAt: '2 days ago',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    company: 'EcoTech Solutions',
    email: 'marcus@ecotech.com',
    phone: '+1-555-0202',
    priority: 'medium',
    score: 72,
    status: 'new',
    source: 'website',
    description: 'Environmental consulting firm looking for client management tools',
    value: 25000,
    createdAt: '3 days ago',
  },
  {
    id: '4',
    name: 'Carol Davis',
    company: 'Global Energy Corp',
    email: 'carol.davis@globalenergy.com',
    phone: '+1-555-0601',
    priority: 'high',
    score: 92,
    status: 'qualified',
    source: 'cold_outreach',
    description: 'Large enterprise deal for environmental monitoring across multiple sites',
    value: 250000,
    createdAt: '4 days ago',
  },
  {
    id: '5',
    name: 'Bob Rodriguez',
    company: 'TechStart Innovations',
    email: 'bob.rodriguez@techstart.io',
    phone: '+1-555-0501',
    priority: 'low',
    score: 45,
    status: 'new',
    source: 'referral',
    description: 'Startup company looking for automation tools',
    value: 8000,
    createdAt: '5 days ago',
  },
  {
    id: '6',
    name: 'Alice Thompson',
    company: 'ACME Manufacturing',
    email: 'alice.thompson@acme.com',
    phone: '+1-555-0401',
    priority: 'medium',
    score: 78,
    status: 'contacted',
    source: 'website',
    description: 'Interested in safety monitoring solution for their new facility',
    value: 45000,
    createdAt: '1 week ago',
  },
]

const leadsStats = {
  totalLeads: { value: 25, trend: '+18%', trendDirection: 'up' as const },
  newLeads: { value: 9, trend: '+5', trendDirection: 'up' as const },
  converted: { value: 1, trend: '4%', trendDirection: 'up' as const },
  highPriority: { value: 8, trend: '+2', trendDirection: 'up' as const },
  avgResponse: { value: '18h', trend: '-6h', trendDirection: 'up' as const },
}

// =============================================================================
// MOCK DATA - INVOICES
// =============================================================================

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
      { id: 'li-1', description: 'Platform Base (ENTERPRISE, Annual)', type: 'platform', quantity: 1, unitPrice: 26000, total: 26000 },
      { id: 'li-2', description: 'Premium Process (Annual)', type: 'process', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: 'li-3', description: 'Viewer License (Annual)', type: 'license', quantity: 400, unitPrice: 120, total: 48000 },
      { id: 'li-4', description: 'Contributor License (Annual)', type: 'license', quantity: 200, unitPrice: 360, total: 72000 },
      { id: 'li-5', description: 'Power User License (Annual)', type: 'license', quantity: 50, unitPrice: 720, total: 36000 },
      { id: 'li-6', description: 'Creator License (Annual)', type: 'license', quantity: 20, unitPrice: 1800, total: 36000 },
    ],
    subtotal: 221000,
    total: 221000,
    paymentTerms: 'net_30',
    notes: 'Tenant provisioning for Fine Goods corp.',
    createdAt: '2025-12-08T10:00:00Z',
    updatedAt: '2025-12-08T10:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-1208-7603',
    status: 'draft',
    invoiceDate: '2025-12-08',
    dueDate: '2026-01-07',
    company: { name: 'First Lucky Corp', email: 'accounts@firstlucky.com' },
    description: 'Tenant setup for First Lucky Corp',
    lineItems: [
      { id: 'li-7', description: 'Platform Base (Professional, Annual)', type: 'platform', quantity: 1, unitPrice: 60000, total: 60000 },
      { id: 'li-8', description: 'Standard Process (Annual)', type: 'process', quantity: 1, unitPrice: 15000, total: 15000 },
      { id: 'li-9', description: 'User License (Annual)', type: 'license', quantity: 366, unitPrice: 198, total: 72400 },
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
    company: { name: 'Good Luck Corp', email: 'finance@goodluck.com' },
    description: 'Tenant provisioning for Good Luck Corp',
    lineItems: [
      { id: 'li-10', description: 'Platform Base (Enterprise, Annual)', type: 'platform', quantity: 1, unitPrice: 75000, total: 75000 },
      { id: 'li-11', description: 'Advanced Process Suite (Annual)', type: 'process', quantity: 1, unitPrice: 25000, total: 25000 },
      { id: 'li-12', description: 'Power User License (Annual)', type: 'license', quantity: 330, unitPrice: 62, total: 20400 },
    ],
    subtotal: 120400,
    total: 120400,
    paymentTerms: 'net_30',
    createdAt: '2025-12-06T14:15:00Z',
    updatedAt: '2025-12-06T14:15:00Z',
  },
  {
    id: '6',
    invoiceNumber: 'INV-2025-1027-8234',
    status: 'sent',
    invoiceDate: '2025-10-27',
    dueDate: '2025-11-26',
    company: { name: 'Tech Innovations LLC', email: 'procurement@techinnovations.com' },
    description: 'Annual enterprise agreement',
    lineItems: [
      { id: 'li-15', description: 'Platform Base (Enterprise, Annual)', type: 'platform', quantity: 1, unitPrice: 200000, total: 200000 },
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
    company: { name: 'Startup Ventures Co.', email: 'billing@startupventures.com' },
    description: 'Initial setup and onboarding',
    lineItems: [
      { id: 'li-16', description: 'Platform Base (Starter, Annual)', type: 'platform', quantity: 1, unitPrice: 25000, total: 25000 },
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
    company: { name: 'Global Manufacturing Inc.', email: 'finance@globalmfg.com' },
    description: 'Q3 2025 Services',
    lineItems: [
      { id: 'li-17', description: 'Platform Base (Enterprise, Annual)', type: 'platform', quantity: 1, unitPrice: 150000, total: 150000 },
    ],
    subtotal: 150000,
    total: 150000,
    paymentTerms: 'net_30',
    createdAt: '2025-09-28T14:15:00Z',
    updatedAt: '2025-10-25T10:20:00Z',
  },
]

const invoicesStats = {
  totalInvoices: { value: mockInvoices.length, trend: '+3', trendDirection: 'up' as const },
  draft: { value: mockInvoices.filter((i) => i.status === 'draft').length, trend: '+2', trendDirection: 'up' as const },
  unpaid: { value: mockInvoices.filter((i) => i.status === 'sent' || i.status === 'partially_paid').length, trend: '-1', trendDirection: 'down' as const },
  overdue: { value: mockInvoices.filter((i) => i.status === 'overdue').length, trend: '0', trendDirection: 'neutral' as const },
  totalRevenue: { value: formatCurrency(mockInvoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)), trend: '+15%', trendDirection: 'up' as const },
}

// =============================================================================
// MOCK DATA - PARTNERS
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
]

// =============================================================================
// PAGE COMPONENTS
// =============================================================================

// Dashboard Page
function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <span className="text-sm text-secondary">Welcome back, John</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">$1.2M</p>
              </div>
              <div className="flex items-center gap-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Active Partners</p>
                <p className="text-2xl font-bold text-primary">24</p>
              </div>
              <div className="flex items-center gap-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                +3
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Open Leads</p>
                <p className="text-2xl font-bold text-primary">18</p>
              </div>
              <div className="flex items-center gap-1 text-warning text-sm">
                <TrendingDown className="w-4 h-4" />
                -2
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Pending Invoices</p>
                <p className="text-2xl font-bold text-primary">$45K</p>
              </div>
              <div className="flex items-center gap-1 text-error text-sm">
                <AlertTriangle className="w-4 h-4" />
                1 overdue
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface border-default">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
              <Clock className="w-5 h-5 text-teal" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">New lead from website</p>
                <p className="text-xs text-secondary">Lisa Chen - Novacorp Industries</p>
              </div>
              <span className="text-xs text-muted">2h ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Invoice paid</p>
                <p className="text-xs text-secondary">Global Manufacturing - $150,000</p>
              </div>
              <span className="text-xs text-muted">1d ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
              <Zap className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Tenant provisioned</p>
                <p className="text-xs text-secondary">Fine Goods corp. - 670 users</p>
              </div>
              <span className="text-xs text-muted">2d ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate('tenant-provisioning')}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                New Tenant Provisioning
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate('leads')}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                View All Leads
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate('invoices')}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manage Invoices
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate('partners')}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Partner Management
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Tenant Provisioning Page Content
function TenantProvisioningContent() {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)

  const handleMethodSelect = (method: ProvisioningMethod) => {
    setSelectedMethod(method)
    console.log('Selected method:', method)
  }

  const handleChatComplete = (data: TenantChatFormData) => {
    console.log('Chat completed with data:')
    alert(`Tenant "${data.companyName}" configuration complete!`)
  }

  if (!selectedMethod) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary mb-6">Tenant Provisioning</h1>
        <ProvisioningMethodSelector onSelectMethod={handleMethodSelect} />
      </div>
    )
  }

  if (selectedMethod === 'chat') {
    return (
      <div className="h-full">
        <TenantProvisioningChat
          onComplete={handleChatComplete}
          onCancel={() => setSelectedMethod(null)}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="mb-4">
        Back to method selection
      </Button>
      <h2 className="text-xl font-semibold text-primary">Manual Wizard</h2>
      <p className="text-secondary mt-2">Manual wizard form would go here...</p>
    </div>
  )
}

// Tenant Requests Page (placeholder)
function TenantRequestsContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">Tenant Requests</h1>
      <Card className="bg-surface border-default">
        <CardContent className="p-8 text-center">
          <ClipboardList className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">Pending Requests</h2>
          <p className="text-secondary mb-4">3 tenant requests are awaiting review</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning-light border border-warning">
              <div>
                <p className="font-medium text-primary">Fine Goods Corp</p>
                <p className="text-sm text-secondary">Pending payment verification</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted-bg border border-subtle">
              <div>
                <p className="font-medium text-primary">Tech Innovations LLC</p>
                <p className="text-sm text-secondary">Pending approval</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted-bg border border-subtle">
              <div>
                <p className="font-medium text-primary">Northern Solutions</p>
                <p className="text-sm text-secondary">Pending approval</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Pricing Calculator Page (placeholder)
function PricingCalculatorContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">Pricing Calculator</h1>
      <Card className="bg-surface border-default">
        <CardContent className="p-8 text-center">
          <DollarSign className="w-12 h-12 text-teal mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">Calculate Tenant Pricing</h2>
          <p className="text-secondary mb-4">Use the chat-based provisioning for interactive pricing</p>
          <Button variant="accent">Open Pricing Chat</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// MAIN PARTNER PORTAL COMPONENT
// =============================================================================

function PartnerPortal() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleNavigate = useCallback((item: NavItem) => {
    setCurrentPage(item.id)
  }, [])

  const handlePageNavigate = useCallback((pageId: string) => {
    setCurrentPage(pageId)
  }, [])

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handlePageNavigate} />

      case 'leads':
        return (
          <LeadsPage
            leads={sampleLeads}
            stats={leadsStats}
            onLeadClick={(lead) => console.log('Lead clicked:', lead)}
            onLeadAction={(lead, action) => console.log('Lead action:', action, lead)}
            onCreateLead={(data) => alert(`Lead created for: ${data.companyName}`)}
            partners={[
              { id: '1', name: 'Acme Partners' },
              { id: '2', name: 'Global Solutions' },
            ]}
          />
        )

      case 'tenant-provisioning':
        return <TenantProvisioningContent />

      case 'tenant-requests':
        return <TenantRequestsContent />

      case 'invoices':
        return (
          <InvoicesPage
            invoices={mockInvoices}
            stats={invoicesStats}
            onInvoiceClick={(invoice) => console.log('Invoice clicked:', invoice)}
            onInvoiceAction={(invoice: Invoice, action: InvoiceAction) => {
              console.log('Invoice action:', action, invoice)
              if (action === 'mark_sent') {
                alert(`Invoice ${invoice.invoiceNumber} marked as sent`)
              }
            }}
            onCreateInvoice={() => alert('Create new invoice')}
            onUpdateInvoice={(invoice) => alert(`Invoice ${invoice.invoiceNumber} updated`)}
          />
        )

      case 'partners':
        return (
          <div className="p-6">
            <PartnersPage
              partners={extendedPartners}
              onEditPartner={(partner: Partner, data: PartnerFormData) => alert(`Partner ${data.companyName} updated`)}
              onCreatePartner={(data: PartnerFormData) => alert(`Partner ${data.companyName} created`)}
              onManageUsers={(partner: Partner) => alert(`Managing users for: ${partner.name}`)}
              onConfirmDelete={(partner: Partner) => alert(`Partner ${partner.name} deleted`)}
            />
          </div>
        )

      case 'partner-network':
        return (
          <div className="p-6">
            <PartnerNetworkPage
              partners={MOCK_NETWORK_PARTNERS}
              onEditPartner={(partner) => alert(`Editing partner: ${partner.companyName}`)}
              onAddSubPartner={(parent) => alert(`Adding sub-partner under: ${parent.companyName}`)}
              onDeletePartner={(partner) => alert(`Partner ${partner.companyName} deleted`)}
            />
          </div>
        )

      case 'pricing-calculator':
        return <PricingCalculatorContent />

      default:
        return <DashboardPage onNavigate={handlePageNavigate} />
    }
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* Grid blob background */}
      <GridBlobBackground scale={1} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Header */}
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={4}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => {
            if (item.id === 'logout') {
              alert('Logging out...')
            } else {
              console.log('Menu item clicked:', item.id)
            }
          }}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={currentPage}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => alert('Opening help documentation...')}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {renderPageContent()}
          </main>
        </div>

        {/* Footer - compact on mobile */}
        <AppFooter compactOnMobile />

        {/* Mobile Bottom Navigation */}
        <BottomNav
          items={partnerNavItems}
          activeItemId={currentPage}
          onNavigate={handleNavigate}
          maxVisibleItems={4}
          showHelpItem
          onHelpClick={() => alert('Opening help...')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete Partner Portal with all pages and working navigation.
 * Click sidebar items or use bottom navigation on mobile to navigate between pages.
 */
export const Default: Story = {
  render: () => <PartnerPortal />,
}

/**
 * Mobile viewport - shows bottom navigation and responsive layouts
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <PartnerPortal />,
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
  render: () => <PartnerPortal />,
}
