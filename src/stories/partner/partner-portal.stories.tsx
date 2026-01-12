import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { within, userEvent, expect, screen } from 'storybook/test'
import { Users, Zap, UserPlus } from 'lucide-react'
import { PartnerPortalPage, type PartnerPortalPageProps } from '../../templates/pages'
import { CreateLeadDialog } from '../../components/leads/CreateLeadDialog'
import { CreateSubPartnerDialog } from '../../components/partners/CreateSubPartnerDialog'
import type { NetworkPartner } from '../../components/partners/types'
import type { Lead } from '../../components/leads/LeadCard'
import type { Partner } from '../../components/partners/PartnersPage'
import type { UserRole } from '../../components/ui/AppHeader'
import { MOCK_PARTNERS } from '../../components/partners/PartnersPage'
import type { Invoice } from '../../components/partners/invoices/types'
import { formatCurrency } from '../../components/partners/invoices/types'
import type { NotificationSettings } from '../../components/partners/SettingsPage'
import {
  PAGE_META,
  pageDescription,
  IPhoneMobileFrame,
  IPadMobileFrame,
} from '../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof PartnerPortalPage> = {
  title: 'Partner/Complete App',
  component: PartnerPortalPage,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(
          `# Partner Portal - Complete Application Template

This is a fully interactive Partner Portal built using the **AppLayoutShell** and **PartnerPortalPage** components.

## Architecture

The Partner Portal demonstrates the recommended 3-tier architecture:

1. **Tier 1: Primitives** - Button, Card, DataTable, etc.
2. **Tier 2: AppLayoutShell** - Handles layout, navigation, responsive behavior
3. **Tier 3: PartnerPortalPage** - Pre-composed page template with all pages wired

## Available Pages

- **Dashboard** - Overview with KPIs and quick actions
- **Leads** - Lead management and tracking
- **Tenant Requests** - View and manage pending requests
- **Tenants** - Active tenant management (view, edit, suspend)
- **Invoices** - Invoice management and billing
- **My Earnings** - Commission tracking and payouts
- **Partners** - Partner management with Sub-Partners tab
- **Pricing Calculator** - Calculate pricing for tenants
- **Settings** - User profile, company info, notifications, security
- **Help** - Documentation, FAQs, and support contact

## Interactive Navigation

Click on sidebar items, bottom navigation (mobile), or use the user menu to navigate between pages. All pages are fully connected and interactive.`
        ),
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
    status: 'in_progress',
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
    status: 'in_progress',
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
    status: 'in_progress',
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
    status: 'in_progress',
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

// Shared props for Mobile/Tablet frame stories (render component directly for proper corner clipping)
const _defaultPartnerPortalProps = {
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
  badges: {},
  notificationCount: 0,
  leadPartners: [
    { id: '1', name: 'Acme Partners' },
    { id: '2', name: 'Global Solutions' },
  ],
  onLeadClick: (lead: Lead) => console.log('Lead clicked:', lead),
  onLeadAction: (lead: Lead, action: string) => console.log('Lead action:', action, lead),
  onCreateLead: (data: { companyName: string }) => alert(`Lead created for: ${data.companyName}`),
  onEditPartner: (partner: Partner, data: { companyName: string }) => alert(`Partner ${data.companyName} updated`),
  onCreatePartner: (data: { companyName: string }) => alert(`Partner ${data.companyName} created`),
  onManageUsers: (partner: Partner) => alert(`Managing users for: ${partner.name}`),
  onDeletePartner: (partner: Partner) => alert(`Partner ${partner.name} deleted`),
  onInvoiceClick: (invoice: Invoice) => console.log('Invoice clicked:', invoice),
  onInvoiceAction: (invoice: Invoice, action: string) => {
    console.log('Invoice action:', action, invoice)
    if (action === 'mark_sent') {
      alert(`Invoice ${invoice.invoiceNumber} marked as sent`)
    }
  },
  onProvisioningComplete: (data: { companyName: string }) => alert(`Tenant "${data.companyName}" configuration complete!`),
  onSaveProfile: (profile: { firstName: string; lastName: string }) => alert(`Profile saved for ${profile.firstName} ${profile.lastName}`),
  onSaveCompany: (company: { name: string }) => alert(`Company "${company.name}" information saved`),
  onSaveNotifications: (notifications: NotificationSettings) => {
    const enabled = Object.entries(notifications).filter(([, v]) => v).map(([k]) => k)
    alert(`Notification preferences saved. Enabled: ${enabled.length} settings`)
  },
  onChangePassword: () => alert('Password changed successfully!'),
  onChangeAvatar: (file: File) => alert(`Avatar "${file.name}" uploaded!`),
  onArticleClick: (article: { title: string }) => alert(`Opening article: ${article.title}`),
  onContactSupport: () => alert('Opening support chat...'),
  onHelpSearch: (query: string) => alert(`Searching help for: "${query}"`),
  commissionPercentage: 15,
  onCalculatePricing: (input: unknown, breakdown: unknown) => {
    console.log('Pricing calculated:', { input, breakdown })
  },
  onGenerateQuote: (input: { companySize: string; tier: string }, breakdown: { total: number; partnerCommission: number }) => {
    alert(`Quote Generated!\n\nCompany: ${input.companySize}\nTier: ${input.tier}\nTotal: $${breakdown.total.toLocaleString()}/year\nYour Commission: $${breakdown.partnerCommission.toLocaleString()}`)
  },
  onMenuItemClick: (item: { id: string }) => {
    if (item.id === 'logout') {
      alert('Logging out...')
    } else {
      console.log('Menu item clicked:', item.id)
    }
  },
}

// =============================================================================
// INTERACTIVE WRAPPER COMPONENT
// =============================================================================

/** Mock parent partner for sub-partner dialog */
const mockParentPartner: NetworkPartner = {
  id: 'parent-001',
  companyName: 'Demo Partner Company',
  contactName: 'John Partner',
  contactEmail: 'john@partnercompany.com',
  status: 'active',
  monthlyRevenue: 125000,
  metrics: {
    totalLeads: 45,
    conversion: 22,
    commission: 18750,
    totalRevenue: 125000,
  },
  isMasterPartner: true,
}

/**
 * InteractivePartnerPortal - Wrapper that wires Quick Actions to open actual dialogs
 *
 * This wrapper adds dialog state management so Quick Actions in the dashboard
 * actually open the CreateLeadDialog and CreateSubPartnerDialog modals.
 */
function InteractivePartnerPortal(props: PartnerPortalPageProps) {
  const [createLeadOpen, setCreateLeadOpen] = useState(false)
  const [createSubPartnerOpen, setCreateSubPartnerOpen] = useState(false)

  // Custom Quick Actions that open dialogs instead of navigating
  const dashboardConfig = {
    quickActions: [
      {
        id: 'create-lead',
        label: 'Create Lead',
        icon: <Users className="w-4 h-4" />,
        onClick: () => setCreateLeadOpen(true),
        variant: 'primary' as const,
      },
      {
        id: 'create-tenant-request',
        label: 'Create Tenant Request',
        icon: <Zap className="w-4 h-4" />,
        onClick: () => {
          // TenantProvisioningWizard is a full-page wizard, not a dialog
          // Navigation to tenant-provisioning page is the correct behavior
          console.log('Navigate to tenant-provisioning page')
        },
      },
      {
        id: 'add-partner',
        label: 'Add Sub-Partner',
        icon: <UserPlus className="w-4 h-4" />,
        onClick: () => setCreateSubPartnerOpen(true),
      },
    ],
  }

  return (
    <>
      <PartnerPortalPage {...props} dashboardConfig={dashboardConfig} />
      <CreateLeadDialog
        open={createLeadOpen}
        onOpenChange={setCreateLeadOpen}
        onSubmit={(data) => {
          alert(`Lead created: ${data.contactName} at ${data.companyName}`)
          setCreateLeadOpen(false)
        }}
        partners={props.leadPartners}
      />
      <CreateSubPartnerDialog
        open={createSubPartnerOpen}
        onOpenChange={setCreateSubPartnerOpen}
        parentPartner={mockParentPartner}
        onSubmit={(data) => {
          alert(`Sub-partner created: ${data.companyName}`)
          setCreateSubPartnerOpen(false)
        }}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete Partner Portal with all pages and working navigation.
 * Click sidebar items or use bottom navigation on mobile to navigate between pages.
 * Quick Actions now open actual dialogs!
 */
export const Default: Story = {
  render: (args) => <InteractivePartnerPortal {...args} />,
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
    badges: {},
    notificationCount: 0,
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
    onCalculatePricing: (request) => {
      console.log('Pricing calculated:', request)
    },
    onGenerateQuote: (request) => {
      alert(`Quote Generated!\n\nEmployees: ${request.employeeCount}\nProcesses: ${request.processes.length}\nLicenses: ${request.userLicenses.length}`)
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

// =============================================================================
// ROLE-BASED DASHBOARD STORIES
// =============================================================================

/**
 * System Admin role - sees all partners, "Submitted Requests" KPI, commission visible.
 * Dashboard shows aggregate data across all partners.
 */
export const AsSystemAdmin: Story = {
  render: (args) => <InteractivePartnerPortal {...args} />,
  args: {
    ...Default.args,
    user: {
      name: 'Sarah Admin',
      email: 'sarah.admin@emex.com',
      role: 'system_admin' as UserRole,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `**System Admin View**

The System Admin sees:
- **Monthly Revenue** - Aggregate across all partners with tenant count subtitle
- **New Leads** - Clickable → navigates to Leads filtered by status=new
- **Leads in Progress** - Clickable → navigates to Leads filtered by contacted/qualified
- **Submitted Requests** - Pending review count (unique to System Admin)

Quick Actions include "Add Partner" for onboarding new partners.`,
      },
    },
  },
}

/**
 * Partner role - sees own + sub-partner data, "Approved Requests" KPI, no commission.
 * Dashboard shows partner's own sales plus sub-partner aggregates.
 */
export const AsPartner: Story = {
  render: (args) => <InteractivePartnerPortal {...args} />,
  args: {
    ...Default.args,
    user: {
      name: 'John Partner',
      email: 'john@partnercompany.com',
      role: 'partner' as UserRole,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `**Partner View** (Default)

The Partner sees:
- **Monthly Revenue** - Own + sub-partner data with tenant count subtitle
- **New Leads** - Clickable → navigates to Leads filtered by status=new
- **Leads in Progress** - Clickable → navigates to Leads filtered by contacted/qualified
- **Approved Requests** - Ready for provisioning (unique to Partner/Sub-Partner)

Quick Actions include "Add Sub-Partner" for network growth.
Commission is **hidden** in the Pricing Calculator.`,
      },
    },
  },
}

/**
 * Sub-Partner role - sees only own data, "Approved Requests" KPI, no commission.
 * Dashboard shows sub-partner's own sales only.
 */
export const AsSubPartner: Story = {
  render: (args) => <InteractivePartnerPortal {...args} />,
  args: {
    ...Default.args,
    user: {
      name: 'Alex SubPartner',
      email: 'alex@subpartner.io',
      role: 'sub_partner' as UserRole,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `**Sub-Partner View**

The Sub-Partner sees:
- **Monthly Revenue** - Own data only with tenant count subtitle
- **New Leads** - Clickable → navigates to Leads filtered by status=new
- **Leads in Progress** - Clickable → navigates to Leads filtered by contacted/qualified
- **Approved Requests** - Ready for provisioning

Quick Actions do **NOT** include "Add Partner" (limited permissions).
Commission is **hidden** in the Pricing Calculator.`,
      },
    },
  },
}

// =============================================================================
// RESPONSIVE DEVICE STORIES
// =============================================================================

/**
 * Mobile viewport - shows bottom navigation and responsive layouts in an iPhone frame.
 * Uses iframe for real CSS media query support.
 */
export const Mobile: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="partner-complete-app--default"
        scale={1}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Partner Portal in iPhone 16 Pro Max frame with real responsive CSS via iframe.',
      },
    },
  },
}

/**
 * Tablet viewport - shows the Partner Portal in an iPad Pro 11" frame.
 * Uses iframe for real CSS media query support.
 */
export const Tablet: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPadMobileFrame
        model="ipadPro11"
        orientation="landscape"
        storyId="partner-complete-app--default"
        scale={1}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Partner Portal in iPad Pro 11" frame (landscape) with real responsive CSS via iframe.',
      },
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
 * Start on tenants page - manage active tenants
 */
export const StartOnTenants: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenants',
  },
}

/**
 * Start on my earnings page - view commissions and payouts
 */
export const StartOnMyEarnings: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'my-earnings',
  },
}

// =============================================================================
// INTERACTION TESTS (play functions)
// DDS owns UI testing per Q4-Testing FAQ
// =============================================================================

/**
 * TenantProvisioning Happy Path - Completes full wizard flow
 *
 * This interaction test validates the complete wizard journey:
 * 1. Step 1: Company Info - fill company details
 * 2. Step 2: Contact & Billing - fill contact and address
 * 3. Step 3: Pricing - select package
 * 4. Step 4: Review & Pay - accept terms
 *
 * @testScope DDS-owned interaction test
 */
export const TenantProvisioningHappyPath: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenant-provisioning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First, select the Classic Wizard method from the method selector
    const wizardMethodButton = await canvas.findByTestId('provisioning-method-wizard', {}, { timeout: 5000 })
    await userEvent.click(wizardMethodButton)

    // Wait for wizard to render
    const wizardForm = await canvas.findByTestId('tenant-wizard-form', {}, { timeout: 5000 })
    await expect(wizardForm).toBeVisible()

    // ==========================================================================
    // STEP 1: Company Info
    // ==========================================================================
    const companyStep = await canvas.findByTestId('company-info-step')
    await expect(companyStep).toBeInTheDocument()

    // Fill company name (required)
    const companyNameInput = await canvas.findByTestId('company-info-company-name')
    await userEvent.clear(companyNameInput)
    await userEvent.type(companyNameInput, 'Acme Environmental Corp', { delay: 10 })

    // Fill legal name
    const legalNameInput = await canvas.findByTestId('company-info-legal-name')
    await userEvent.clear(legalNameInput)
    await userEvent.type(legalNameInput, 'Acme Environmental Corporation LLC', { delay: 10 })

    // Select industry from dropdown (use screen for portal content)
    const industrySelect = canvas.getByTestId('company-info-industry-select')
    await userEvent.click(industrySelect)
    // SelectContent is rendered in a portal - use screen to query document level
    const manufacturingOption = await screen.findByTestId('company-info-industry-manufacturing', {}, { timeout: 3000 })
    await userEvent.click(manufacturingOption)

    // Fill website
    const websiteInput = await canvas.findByTestId('company-info-website')
    await userEvent.clear(websiteInput)
    await userEvent.type(websiteInput, 'https://acme-environmental.com', { delay: 10 })

    // Select employee count (51-200 for mid-market pricing)
    const employeeOption = await canvas.findByTestId('company-info-employees-51-200')
    await userEvent.click(employeeOption)

    // Click Next to proceed to Step 2
    const nextButton = canvas.getByTestId('wizard-nav-next')
    await userEvent.click(nextButton)

    // ==========================================================================
    // STEP 2: Contact & Billing
    // ==========================================================================
    const contactStep = await canvas.findByTestId('contact-billing-step', {}, { timeout: 3000 })
    await expect(contactStep).toBeInTheDocument()

    // Fill contact info
    const contactName = await canvas.findByTestId('contact-billing-name')
    await userEvent.clear(contactName)
    await userEvent.type(contactName, 'Jane Smith', { delay: 10 })

    const contactEmail = await canvas.findByTestId('contact-billing-email')
    await userEvent.clear(contactEmail)
    await userEvent.type(contactEmail, 'jane.smith@acme-environmental.com', { delay: 10 })

    const contactPhone = await canvas.findByTestId('contact-billing-phone')
    await userEvent.clear(contactPhone)
    await userEvent.type(contactPhone, '+1-555-123-4567', { delay: 10 })

    const contactTitle = await canvas.findByTestId('contact-billing-title')
    await userEvent.clear(contactTitle)
    await userEvent.type(contactTitle, 'EHS Director', { delay: 10 })

    // Fill billing address
    const streetInput = await canvas.findByTestId('contact-billing-street')
    await userEvent.clear(streetInput)
    await userEvent.type(streetInput, '123 Industrial Way', { delay: 10 })

    const cityInput = await canvas.findByTestId('contact-billing-city')
    await userEvent.clear(cityInput)
    await userEvent.type(cityInput, 'Chicago', { delay: 10 })

    const stateInput = await canvas.findByTestId('contact-billing-state')
    await userEvent.clear(stateInput)
    await userEvent.type(stateInput, 'IL', { delay: 10 })

    const postalInput = await canvas.findByTestId('contact-billing-postal-code')
    await userEvent.clear(postalInput)
    await userEvent.type(postalInput, '60601', { delay: 10 })

    // Select country (use screen for portal content)
    const countrySelect = canvas.getByTestId('contact-billing-country-select')
    await userEvent.click(countrySelect)
    const usOption = await screen.findByTestId('contact-billing-country-united-states', {}, { timeout: 3000 })
    await userEvent.click(usOption)

    // Click Next to proceed to Step 3
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // ==========================================================================
    // STEP 3: Pricing
    // ==========================================================================
    const pricingStep = await canvas.findByTestId('pricing-step', {}, { timeout: 3000 })
    await expect(pricingStep).toBeInTheDocument()

    // Verify pricing summary panel is present
    const summaryPanel = await canvas.findByTestId('pricing-step-summary-panel')
    await expect(summaryPanel).toBeInTheDocument()

    // Click Next to proceed to Step 4
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // ==========================================================================
    // STEP 4: Review & Pay
    // ==========================================================================
    const reviewStep = await canvas.findByTestId('review-pay-step', {}, { timeout: 3000 })
    await expect(reviewStep).toBeInTheDocument()

    // Verify summary sections are present
    await expect(canvas.getByTestId('review-pay-company-summary')).toBeInTheDocument()
    await expect(canvas.getByTestId('review-pay-contact-summary')).toBeInTheDocument()

    // Accept terms checkbox
    const termsCheckbox = canvas.getByTestId('review-pay-terms-checkbox')
    await userEvent.click(termsCheckbox)

    // Verify submit button is now enabled
    const submitButton = canvas.getByTestId('wizard-nav-submit')
    await expect(submitButton).not.toBeDisabled()

    // Note: We don't actually submit to avoid side effects in tests
    // The form would call onProvisioningComplete callback
  },
}

/**
 * TenantProvisioning Step Navigation - Tests back/forward navigation
 *
 * Validates that:
 * - Next button advances to next step
 * - Back button returns to previous step
 * - Cancel button is available
 *
 * @testScope DDS-owned interaction test
 */
export const TenantProvisioningStepNavigation: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenant-provisioning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First, select the Classic Wizard method
    const wizardMethodButton = await canvas.findByTestId('provisioning-method-wizard', {}, { timeout: 5000 })
    await userEvent.click(wizardMethodButton)

    // Wait for wizard
    await canvas.findByTestId('tenant-wizard-form', {}, { timeout: 5000 })

    // Verify we start on Step 1
    const step1 = await canvas.findByTestId('company-info-step')
    await expect(step1).toBeInTheDocument()

    // Fill minimum required field and navigate forward
    const companyName = await canvas.findByTestId('company-info-company-name')
    await userEvent.type(companyName, 'Test Company')

    // Select industry (required) - use screen for portal content
    const industrySelect = canvas.getByTestId('company-info-industry-select')
    await userEvent.click(industrySelect)
    const option = await screen.findByTestId('company-info-industry-manufacturing', {}, { timeout: 3000 })
    await userEvent.click(option)

    // Select employee count (required)
    const employeeOption = await canvas.findByTestId('company-info-employees-51-200')
    await userEvent.click(employeeOption)

    // Go to Step 2
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Verify Step 2 is present
    const step2 = await canvas.findByTestId('contact-billing-step', {}, { timeout: 3000 })
    await expect(step2).toBeInTheDocument()

    // Verify Back button is now present
    const backButton = canvas.getByTestId('wizard-nav-back')
    await expect(backButton).toBeInTheDocument()

    // Go back to Step 1
    await userEvent.click(backButton)

    // Verify we're back on Step 1
    await expect(await canvas.findByTestId('company-info-step')).toBeInTheDocument()

    // Company name should still have our data (form persistence)
    const companyNameAgain = canvas.getByTestId('company-info-company-name')
    await expect(companyNameAgain).toHaveValue('Test Company')
  },
}

/**
 * TenantProvisioning Validation Errors - Tests form validation
 *
 * Validates that:
 * - Required field validation triggers
 * - Error messages are displayed
 * - Cannot proceed without valid data
 *
 * @testScope DDS-owned interaction test
 */
export const TenantProvisioningValidation: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenant-provisioning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First, select the Classic Wizard method
    const wizardMethodButton = await canvas.findByTestId('provisioning-method-wizard', {}, { timeout: 5000 })
    await userEvent.click(wizardMethodButton)

    // Wait for wizard
    await canvas.findByTestId('tenant-wizard-form', {}, { timeout: 5000 })

    // Step 1 is present
    await expect(await canvas.findByTestId('company-info-step')).toBeInTheDocument()

    // Try to click Next without filling required fields
    const nextButton = canvas.getByTestId('wizard-nav-next')
    await userEvent.click(nextButton)

    // We should still be on Step 1 (validation failed)
    // The form validation should prevent navigation
    await expect(await canvas.findByTestId('company-info-step')).toBeInTheDocument()

    // Now fill just the company name but not industry
    const companyName = canvas.getByTestId('company-info-company-name')
    await userEvent.type(companyName, 'Test Company')

    // Try Next again - should still fail (industry required)
    await userEvent.click(nextButton)
    await expect(await canvas.findByTestId('company-info-step')).toBeInTheDocument()
  },
}

/**
 * TenantProvisioning Terms Required - Tests terms checkbox validation
 *
 * Validates that the submit button is disabled until terms are accepted.
 *
 * @testScope DDS-owned interaction test
 */
export const TenantProvisioningTermsRequired: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialPage: 'tenant-provisioning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First, select the Classic Wizard method
    const wizardMethodButton = await canvas.findByTestId('provisioning-method-wizard', {}, { timeout: 5000 })
    await userEvent.click(wizardMethodButton)

    // Wait for wizard
    await canvas.findByTestId('tenant-wizard-form', {}, { timeout: 5000 })

    // Quick fill Step 1 (use screen for portal content)
    await userEvent.type(canvas.getByTestId('company-info-company-name'), 'Test Co')
    await userEvent.click(canvas.getByTestId('company-info-industry-select'))
    await userEvent.click(await screen.findByTestId('company-info-industry-manufacturing', {}, { timeout: 3000 }))
    await userEvent.click(canvas.getByTestId('company-info-employees-51-200'))
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Quick fill Step 2
    await canvas.findByTestId('contact-billing-step', {}, { timeout: 3000 })
    await userEvent.type(canvas.getByTestId('contact-billing-name'), 'John Doe')
    await userEvent.type(canvas.getByTestId('contact-billing-email'), 'john@test.com')
    await userEvent.type(canvas.getByTestId('contact-billing-street'), '123 Main St')
    await userEvent.type(canvas.getByTestId('contact-billing-city'), 'Chicago')
    await userEvent.type(canvas.getByTestId('contact-billing-state'), 'IL')
    await userEvent.type(canvas.getByTestId('contact-billing-postal-code'), '60601')
    await userEvent.click(canvas.getByTestId('contact-billing-country-select'))
    await userEvent.click(await screen.findByTestId('contact-billing-country-united-states', {}, { timeout: 3000 }))
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Skip Step 3 (Pricing)
    await canvas.findByTestId('pricing-step', {}, { timeout: 3000 })
    await userEvent.click(canvas.getByTestId('wizard-nav-next'))

    // Now on Step 4 (Review)
    await canvas.findByTestId('review-pay-step', {}, { timeout: 3000 })

    // Submit button is enabled, but clicking without accepting terms triggers validation
    const submitButton = canvas.getByTestId('wizard-nav-submit')
    await expect(submitButton).not.toBeDisabled()

    // Verify terms checkbox exists and is unchecked
    const termsCheckbox = canvas.getByTestId('review-pay-terms-checkbox')
    await expect(termsCheckbox).not.toBeChecked()

    // Accept terms
    await userEvent.click(termsCheckbox)

    // Verify checkbox is now checked
    await expect(termsCheckbox).toBeChecked()

    // Uncheck terms to verify toggle works
    await userEvent.click(termsCheckbox)

    // Verify checkbox is unchecked again
    await expect(termsCheckbox).not.toBeChecked()
  },
}
