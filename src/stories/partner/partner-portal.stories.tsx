import type { Meta, StoryObj } from '@storybook/react'
import { PartnerPortalPage } from '../../templates/pages'
import type { Lead } from '../../components/leads/LeadCard'
import type { Partner } from '../../components/partners/PartnersPage'
import { MOCK_PARTNERS } from '../../components/partners/PartnersPage'
import type { Invoice } from '../../components/partners/invoices/types'
import { formatCurrency } from '../../components/partners/invoices/types'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof PartnerPortalPage> = {
  title: 'Partner/Complete App',
  component: PartnerPortalPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Partner Portal - Complete Application Template

This is a fully interactive Partner Portal built using the **AppLayoutShell** and **PartnerPortalPage** components.

## Architecture

The Partner Portal demonstrates the recommended 3-tier architecture:

1. **Tier 1: Primitives** - Button, Card, DataTable, etc.
2. **Tier 2: AppLayoutShell** - Handles layout, navigation, responsive behavior
3. **Tier 3: PartnerPortalPage** - Pre-composed page template with all pages wired

## Usage

\`\`\`tsx
import { PartnerPortalPage } from 'dds'

function App() {
  return (
    <PartnerPortalPage
      user={{ name: 'John Partner', email: 'john@partner.com' }}
      leads={leadsData}
      partners={partnersData}
      invoices={invoicesData}
      badges={{ leads: 6, invoices: 3 }}
      onCreateLead={(data) => api.createLead(data)}
      onPageChange={(pageId) => router.push(pageId)}
    />
  )
}
\`\`\`

## Available Pages

- **Dashboard** - Overview with KPIs and quick actions
- **Leads** - Lead management and tracking
- **Tenant Provisioning** - Create new tenant accounts
- **Tenant Requests** - View and manage pending requests
- **Invoices** - Invoice management and billing
- **Partners** - Partner company management
- **Partner Network** - Network and sub-partner management
- **Pricing Calculator** - Calculate pricing for tenants
- **Settings** - User profile, company info, notifications, security
- **Help** - Documentation, FAQs, and support contact

## Interactive Navigation

Click on sidebar items, bottom navigation (mobile), or use the user menu to navigate between pages. All pages are fully connected and interactive.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnerPortalPage>

// =============================================================================
// MOCK DATA
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
    ],
    subtotal: 77000,
    total: 77000,
    paymentTerms: 'net_30',
    notes: 'Tenant provisioning for Fine Goods corp.',
    createdAt: '2025-12-08T10:00:00Z',
    updatedAt: '2025-12-08T10:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-1208-7603',
    status: 'sent',
    invoiceDate: '2025-12-08',
    dueDate: '2026-01-07',
    company: { name: 'First Lucky Corp', email: 'accounts@firstlucky.com' },
    description: 'Tenant setup for First Lucky Corp',
    lineItems: [
      { id: 'li-7', description: 'Platform Base (Professional, Annual)', type: 'platform', quantity: 1, unitPrice: 60000, total: 60000 },
    ],
    subtotal: 60000,
    total: 60000,
    paymentTerms: 'net_30',
    createdAt: '2025-12-08T09:30:00Z',
    updatedAt: '2025-12-08T09:30:00Z',
  },
  {
    id: '3',
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

// Stats
const leadsStats = {
  totalLeads: { value: 25, trend: '+18%', trendDirection: 'up' as const },
  newLeads: { value: 9, trend: '+5', trendDirection: 'up' as const },
  converted: { value: 1, trend: '4%', trendDirection: 'up' as const },
  highPriority: { value: 8, trend: '+2', trendDirection: 'up' as const },
}

const invoicesStats = {
  totalInvoices: { value: mockInvoices.length, trend: '+3', trendDirection: 'up' as const },
  draft: { value: mockInvoices.filter((i) => i.status === 'draft').length, trend: '+2', trendDirection: 'up' as const },
  unpaid: { value: mockInvoices.filter((i) => i.status === 'sent').length, trend: '-1', trendDirection: 'down' as const },
  overdue: { value: 0, trend: '0', trendDirection: 'neutral' as const },
  totalRevenue: { value: formatCurrency(mockInvoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)), trend: '+15%', trendDirection: 'up' as const },
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete Partner Portal with all pages and working navigation.
 * Click sidebar items or use bottom navigation on mobile to navigate between pages.
 */
export const Default: Story = {
  args: {
    user: {
      name: 'John Partner',
      email: 'john@partnercompany.com',
    },
    leads: sampleLeads,
    partners: extendedPartners,
    invoices: mockInvoices,
    stats: {
      leads: leadsStats,
      invoices: invoicesStats,
    },
    badges: {
      leads: 6,
      'tenant-requests': 3,
      invoices: mockInvoices.filter(i => i.status === 'draft').length,
      partners: 9,
    },
    notificationCount: 4,
    leadPartners: [
      { id: '1', name: 'Acme Partners' },
      { id: '2', name: 'Global Solutions' },
    ],
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
    onCreateLead: (data) => alert(`Lead created for: ${data.companyName}`),
    onEditPartner: (partner, data) => alert(`Partner ${data.companyName} updated`),
    onCreatePartner: (data) => alert(`Partner ${data.companyName} created`),
    onManageUsers: (partner) => alert(`Managing users for: ${partner.name}`),
    onDeletePartner: (partner) => alert(`Partner ${partner.name} deleted`),
    onInvoiceClick: (invoice) => console.log('Invoice clicked:', invoice),
    onInvoiceAction: (invoice, action) => {
      console.log('Invoice action:', action, invoice)
      if (action === 'mark_sent') {
        alert(`Invoice ${invoice.invoiceNumber} marked as sent`)
      }
    },
    onProvisioningComplete: (data) => alert(`Tenant "${data.companyName}" configuration complete!`),

    // Settings callbacks
    onSaveProfile: (profile) => alert(`Profile saved for ${profile.firstName} ${profile.lastName}`),
    onSaveCompany: (company) => alert(`Company "${company.name}" information saved`),
    onSaveNotifications: (notifications) => {
      const enabled = Object.entries(notifications).filter(([, v]) => v).map(([k]) => k)
      alert(`Notification preferences saved. Enabled: ${enabled.length} settings`)
    },
    onChangePassword: () => alert('Password changed successfully!'),
    onChangeAvatar: (file) => alert(`Avatar "${file.name}" uploaded!`),

    // Help callbacks
    onArticleClick: (article) => alert(`Opening article: ${article.title}`),
    onContactSupport: () => alert('Opening support chat...'),
    onHelpSearch: (query) => alert(`Searching help for: "${query}"`),

    // Pricing Calculator callbacks
    commissionPercentage: 15,
    onCalculatePricing: (input, breakdown) => {
      console.log('Pricing calculated:', { input, breakdown })
    },
    onGenerateQuote: (input, breakdown) => {
      alert(`Quote Generated!\n\nCompany: ${input.companySize}\nTier: ${input.tier}\nTotal: $${breakdown.total.toLocaleString()}/year\nYour Commission: $${breakdown.partnerCommission.toLocaleString()}`)
    },

    onMenuItemClick: (item) => {
      if (item.id === 'logout') {
        alert('Logging out...')
      } else {
        console.log('Menu item clicked:', item.id)
      }
    },
  },
}

/**
 * Mobile viewport - shows bottom navigation and responsive layouts
 */
export const Mobile: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Empty state - no data loaded
 */
export const EmptyState: Story = {
  args: {
    user: {
      name: 'New Partner',
      email: 'new@partner.com',
    },
    leads: [],
    partners: [],
    invoices: [],
  },
}

/**
 * Start on a specific page
 */
export const StartOnLeads: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'leads',
  },
}

/**
 * Start on invoices page
 */
export const StartOnInvoices: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'invoices',
  },
}

/**
 * Start on settings page - shows user profile, company info, notifications
 */
export const StartOnSettings: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'settings',
  },
}

/**
 * Start on help page - shows documentation, FAQs, and support
 */
export const StartOnHelp: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'help',
  },
}

/**
 * Start on pricing calculator - calculate tenant pricing and generate quotes
 */
export const StartOnPricingCalculator: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'pricing-calculator',
  },
}

/**
 * Start on partners page - manage partner companies
 */
export const StartOnPartners: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'partners',
  },
}

/**
 * Start on partner network page - view partner hierarchy
 */
export const StartOnPartnerNetwork: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'partner-network',
  },
}

/**
 * Start on tenant provisioning - create new tenant accounts
 */
export const StartOnTenantProvisioning: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenant-provisioning',
  },
}
