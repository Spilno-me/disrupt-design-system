/**
 * Partner Portal - Full Interactive Prototype
 * @module stories/partner/partner-prototype
 *
 * Complete clickable prototype starting from login through all flows.
 * Use admin/admin to log in and explore the entire Partner Portal.
 *
 * @since v2.0
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PartnerPortalPage } from '../../templates/pages'
import { LoginPage } from '../../components/auth/LoginPage'
import type { LoginFormValues } from '../../components/auth/LoginForm'
import type { UserRole } from '../../components/ui/AppHeader'
import type { Lead } from '../../components/leads/LeadCard'
import { MOCK_PARTNERS } from '../../components/partners'
import type { Invoice } from '../../components/partners/invoices/types'
import {
  MOCK_TENANTS,
  MOCK_PASSIVE_INCOME,
  MOCK_TENANTS_STATS_V2,
  type Tenant,
  type ChangeStatusFormData,
} from '../../components/tenants'
import { PAGE_META, pageDescription } from '../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Partner/Full Prototype',
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: pageDescription(`# Partner Portal - Full Interactive Prototype

**Login with: admin@partner.com / admin** (or any email/password)

This is a complete, clickable prototype of the Partner Portal with all flows connected:

## User Journey
1. **Login** → Enter credentials (admin/admin works)
2. **Dashboard** → See KPIs, quick actions
3. **Tenants** → View/Change Status (tabbed V2 interface)
4. **All other pages** → Fully functional navigation

## What's Connected
- ✅ Login → Dashboard transition with loading animation
- ✅ Sidebar navigation between all pages
- ✅ Tenant status changes persist in session
- ✅ KPI widget clicks filter data
- ✅ Dialog flows (View → Change Status)
- ✅ Role-based visibility (try different roles)

## Test Scenarios
1. Login and navigate to Tenants
2. Click a KPI widget to filter
3. Click Actions → Change Status on a tenant
4. Switch between Direct/Passive Income tabs
5. Navigate to other pages and back`),
      },
    },
  },
}

export default meta
type Story = StoryObj

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
    description: 'Interested in enterprise compliance solution',
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
    description: 'Manufacturing company seeking EHS platform',
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
    description: 'Environmental consulting firm',
    value: 25000,
    createdAt: '3 days ago',
  },
]

// Use existing mock partners from the library
const samplePartners = MOCK_PARTNERS

// Mock invoices matching the Invoice interface
const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-0001-0001',
    status: 'paid',
    invoiceDate: '2025-01-01',
    dueDate: '2025-01-31',
    paymentTerms: 'net_30',
    company: {
      name: 'Acme Corp',
      email: 'billing@acme.com',
    },
    metadata: {
      companySize: 'Enterprise',
      employees: 500,
      totalUsers: 50,
    },
    lineItems: [
      { id: 'li1', type: 'platform', description: 'Monthly Subscription', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
    subtotal: 2500,
    tax: 0,
    total: 2500,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-0001-0002',
    status: 'sent',
    invoiceDate: '2025-01-15',
    dueDate: '2025-02-15',
    paymentTerms: 'net_30',
    company: {
      name: 'TechStart Inc',
      email: 'billing@techstart.io',
    },
    metadata: {
      companySize: 'Mid-Market',
      employees: 150,
      totalUsers: 25,
    },
    lineItems: [
      { id: 'li2', type: 'platform', description: 'Monthly Subscription', quantity: 1, unitPrice: 1800, total: 1800 },
    ],
    subtotal: 1800,
    tax: 0,
    total: 1800,
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
  },
]

// =============================================================================
// FULL PROTOTYPE COMPONENT
// =============================================================================

type AppState = 'login' | 'portal'

interface PrototypeState {
  tenants: Tenant[]
  leads: Lead[]
}

function FullPrototype({ userRole = 'partner' as UserRole }) {
  // App state
  const [appState, setAppState] = useState<AppState>('login')
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; role: UserRole } | null>(null)

  // Data state (persists changes during session)
  const [state, setState] = useState<PrototypeState>({
    tenants: MOCK_TENANTS,
    leads: sampleLeads,
  })

  // Login handler - accepts any email/password (prototype mode)
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Accept any valid email/password for prototype
    if (!values.email.includes('@') || values.password.length < 1) {
      throw new Error('Invalid credentials')
    }

    // Set logged in user
    setLoggedInUser({
      name: values.email.split('@')[0],
      email: values.email,
      role: userRole,
    })
  }, [userRole])

  // After login success, transition to portal
  const handleLoginSuccess = useCallback(() => {
    setAppState('portal')
  }, [])

  // Tenant status change handler
  const handleChangeStatus = useCallback(async (tenant: Tenant, data: ChangeStatusFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update tenant in state
    setState((prev) => ({
      ...prev,
      tenants: prev.tenants.map((t) =>
        t.id === tenant.id
          ? {
              ...t,
              status: data.status,
              monthlyPayment: data.status === 'suspended' ? 0 : t.monthlyPayment,
            }
          : t
      ),
    }))

    console.log(`[Prototype] Tenant ${tenant.companyName} status changed to ${data.status}`)
  }, [])

  // View tenant handler
  const handleViewTenant = useCallback((tenant: Tenant) => {
    console.log(`[Prototype] Viewing tenant: ${tenant.companyName}`)
  }, [])

  // Lead handlers
  const handleLeadClick = useCallback((lead: Lead) => {
    console.log(`[Prototype] Lead clicked: ${lead.name}`)
  }, [])

  const handleLeadAction = useCallback((lead: Lead, action: string) => {
    console.log(`[Prototype] Lead action: ${action} on ${lead.name}`)
  }, [])

  // Logout handler
  const handleMenuItemClick = useCallback((item: { id: string }) => {
    if (item.id === 'logout') {
      setAppState('login')
      setLoggedInUser(null)
    }
  }, [])

  // Render login page
  if (appState === 'login') {
    return (
      <LoginPage
        product="partner"
        onLogin={handleLogin}
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={async (email) => {
          console.log(`[Prototype] Password reset requested for: ${email}`)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
        cardStyle="glass-gradient"
        successMessage="Welcome to Partner Portal! Redirecting..."
        successDuration={1500}
      />
    )
  }

  // Render portal
  return (
    <PartnerPortalPage
      user={{
        name: loggedInUser?.name ?? 'Partner User',
        email: loggedInUser?.email ?? 'partner@example.com',
        role: loggedInUser?.role ?? userRole,
      }}
      // Tenants (V2)
      tenants={state.tenants}
      passiveIncomeData={MOCK_PASSIVE_INCOME}
      tenantsStats={MOCK_TENANTS_STATS_V2}
      onViewTenant={handleViewTenant}
      onChangeStatus={handleChangeStatus}
      // Leads
      leads={state.leads}
      onLeadClick={handleLeadClick}
      onLeadAction={handleLeadAction}
      onCreateLead={(data) => {
        console.log(`[Prototype] Creating lead: ${data.companyName}`)
        alert(`Lead created: ${data.companyName}`)
      }}
      leadPartners={[
        { id: '1', name: 'Acme Partners' },
        { id: '2', name: 'Global Solutions' },
      ]}
      // Partners
      partners={samplePartners}
      onEditPartner={(partner, data) => {
        console.log(`[Prototype] Editing partner: ${data.companyName}`)
        alert(`Partner updated: ${data.companyName}`)
      }}
      onCreatePartner={(data) => {
        console.log(`[Prototype] Creating partner: ${data.companyName}`)
        alert(`Partner created: ${data.companyName}`)
      }}
      onManageUsers={(partner) => {
        console.log(`[Prototype] Managing users for: ${partner.name}`)
        alert(`Managing users for: ${partner.name}`)
      }}
      onDeletePartner={(partner) => {
        console.log(`[Prototype] Deleting partner: ${partner.name}`)
        alert(`Partner deleted: ${partner.name}`)
      }}
      // Invoices
      invoices={sampleInvoices}
      onInvoiceClick={(invoice) => {
        console.log(`[Prototype] Invoice clicked: ${invoice.invoiceNumber}`)
      }}
      onInvoiceAction={(invoice, action) => {
        console.log(`[Prototype] Invoice action: ${action} on ${invoice.invoiceNumber}`)
        alert(`Invoice ${invoice.invoiceNumber}: ${action}`)
      }}
      // Settings
      onSaveProfile={(profile) => {
        console.log(`[Prototype] Saving profile:`, profile)
        alert(`Profile saved for ${profile.firstName} ${profile.lastName}`)
      }}
      onSaveCompany={(company) => {
        console.log(`[Prototype] Saving company:`, company)
        alert(`Company "${company.name}" saved`)
      }}
      onSaveNotifications={(notifications) => {
        console.log(`[Prototype] Saving notifications:`, notifications)
        alert('Notification preferences saved')
      }}
      onChangePassword={() => {
        alert('Password changed successfully!')
      }}
      onChangeAvatar={(file) => {
        console.log(`[Prototype] Avatar uploaded:`, file.name)
        alert(`Avatar "${file.name}" uploaded`)
      }}
      // Help
      onArticleClick={(article) => {
        console.log(`[Prototype] Article clicked:`, article.title)
        alert(`Opening article: ${article.title}`)
      }}
      onContactSupport={() => {
        alert('Opening support chat...')
      }}
      onHelpSearch={(query) => {
        console.log(`[Prototype] Help search:`, query)
        alert(`Searching help for: "${query}"`)
      }}
      // Pricing Calculator
      onCalculatePricing={(request) => {
        console.log(`[Prototype] Pricing calculated:`, request)
      }}
      onGenerateQuote={(request) => {
        console.log(`[Prototype] Quote generated:`, request)
        alert(`Quote generated for ${request.employeeCount} employees`)
      }}
      // Navigation
      onMenuItemClick={handleMenuItemClick}
      initialPage="dashboard"
      stats={{
        leads: {
          totalLeads: { value: state.leads.length, trend: '+12%', trendDirection: 'up' },
          newLeads: { value: state.leads.filter((l) => l.status === 'new').length, trend: '+3', trendDirection: 'up' },
          converted: { value: 8, trend: '+2', trendDirection: 'up' },
          highPriority: { value: state.leads.filter((l) => l.priority === 'high').length, trend: '0', trendDirection: 'neutral' },
        },
        invoices: {
          totalInvoices: { value: sampleInvoices.length, trend: '+5%', trendDirection: 'up' },
          draft: { value: 0, trend: '0', trendDirection: 'neutral' },
          unpaid: { value: 1, trend: '-1', trendDirection: 'down' },
          overdue: { value: 0, trend: '0', trendDirection: 'neutral' },
          totalRevenue: { value: '$4,300', trend: '+15%', trendDirection: 'up' },
        },
      }}
    />
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Full prototype starting from login.
 * Use admin/admin or any email/password to log in.
 */
export const Default: Story = {
  render: () => <FullPrototype />,
}

/**
 * Login as System Admin - sees all partners, submitted requests.
 */
export const AsSystemAdmin: Story = {
  render: () => <FullPrototype userRole="system_admin" />,
  parameters: {
    docs: {
      description: {
        story: `**System Admin View**

Login with admin/admin to see the System Admin perspective:
- All partners visible
- Submitted Requests KPI (unique to admins)
- Full access to all tabs`,
      },
    },
  },
}

/**
 * Login as Sub-Partner - limited visibility.
 */
export const AsSubPartner: Story = {
  render: () => <FullPrototype userRole="sub_partner" />,
  parameters: {
    docs: {
      description: {
        story: `**Sub-Partner View**

Login with admin/admin to see the Sub-Partner perspective:
- Only own tenants visible
- Passive Income tab hidden
- Limited quick actions`,
      },
    },
  },
}

/**
 * Skip login - start directly in portal (for quick testing).
 */
export const SkipLogin: Story = {
  render: () => {
    const [tenants, setTenants] = useState(MOCK_TENANTS)

    const handleChangeStatus = async (tenant: Tenant, data: ChangeStatusFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenant.id ? { ...t, status: data.status } : t
        )
      )
    }

    return (
      <PartnerPortalPage
        user={{
          name: 'Quick Test User',
          email: 'test@partner.com',
          role: 'partner',
        }}
        tenants={tenants}
        passiveIncomeData={MOCK_PASSIVE_INCOME}
        tenantsStats={MOCK_TENANTS_STATS_V2}
        onChangeStatus={handleChangeStatus}
        leads={sampleLeads}
        partners={samplePartners}
        invoices={sampleInvoices}
        initialPage="tenants"
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `**Quick Test Mode**

Skips login and starts directly on the Tenants page.
Use this for rapid testing of tenant flows.`,
      },
    },
  },
}
