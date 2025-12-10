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
import { LeadsPage } from '../../components/leads/LeadsPage'
import { Lead } from '../../components/leads/LeadCard'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/LeadsManagement',
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
  {
    id: '7',
    name: 'David Kim',
    company: 'Pacific Logistics',
    email: 'david.kim@pacificlog.com',
    phone: '+1-555-0702',
    priority: 'medium',
    score: 65,
    status: 'new',
    source: 'partner',
    description: 'Supply chain company needing compliance tracking',
    value: 35000,
    createdAt: '1 week ago',
  },
  {
    id: '8',
    name: 'Sarah Williams',
    company: 'HealthFirst Medical',
    email: 'sarah.w@healthfirst.org',
    phone: '+1-555-0803',
    priority: 'high',
    score: 91,
    status: 'qualified',
    source: 'website',
    description: 'Healthcare provider seeking HIPAA compliance automation',
    value: 120000,
    createdAt: '1 week ago',
  },
  {
    id: '9',
    name: 'James Wilson',
    company: 'BuildRight Construction',
    email: 'jwilson@buildright.com',
    phone: '+1-555-0904',
    priority: 'low',
    score: 38,
    status: 'new',
    source: 'cold_outreach',
    description: 'Construction firm interested in safety compliance',
    value: 15000,
    createdAt: '2 weeks ago',
  },
  {
    id: '10',
    name: 'Emily Brown',
    company: 'GreenLeaf Organics',
    email: 'emily@greenleaf.co',
    phone: '+1-555-1005',
    priority: 'medium',
    score: 58,
    status: 'contacted',
    source: 'referral',
    description: 'Organic food producer needing FDA compliance tools',
    value: 28000,
    createdAt: '2 weeks ago',
  },
  {
    id: '11',
    name: 'Michael Foster',
    company: 'Apex Chemicals',
    email: 'mfoster@apexchem.com',
    phone: '+1-555-1106',
    priority: 'high',
    score: 87,
    status: 'qualified',
    source: 'website',
    description: 'Chemical manufacturer requiring EPA compliance management',
    value: 180000,
    createdAt: '2 weeks ago',
  },
  {
    id: '12',
    name: 'Jennifer Lee',
    company: 'Quantum Tech',
    email: 'jlee@quantumtech.io',
    phone: '+1-555-1207',
    priority: 'low',
    score: 42,
    status: 'new',
    source: 'website',
    description: 'Tech company exploring compliance solutions',
    value: 12000,
    createdAt: '3 weeks ago',
  },
  {
    id: '13',
    name: 'Robert Martinez',
    company: 'Sunrise Energy',
    email: 'rmartinez@sunriseenergy.com',
    phone: '+1-555-1308',
    priority: 'medium',
    score: 69,
    status: 'contacted',
    source: 'partner',
    description: 'Renewable energy company seeking environmental reporting',
    value: 55000,
    createdAt: '3 weeks ago',
  },
  {
    id: '14',
    name: 'Amanda Clark',
    company: 'Metro Transit Authority',
    email: 'aclark@metrotransit.gov',
    phone: '+1-555-1409',
    priority: 'high',
    score: 83,
    status: 'qualified',
    source: 'cold_outreach',
    description: 'Government agency needing fleet safety compliance',
    value: 95000,
    createdAt: '3 weeks ago',
  },
  {
    id: '15',
    name: 'Chris Taylor',
    company: 'Oceanic Shipping',
    email: 'ctaylor@oceanicship.com',
    phone: '+1-555-1510',
    priority: 'medium',
    score: 61,
    status: 'new',
    source: 'website',
    description: 'International shipping company exploring compliance automation',
    value: 42000,
    createdAt: '1 month ago',
  },
  {
    id: '16',
    name: 'Nicole Adams',
    company: 'FreshFarms Agriculture',
    email: 'nadams@freshfarms.com',
    phone: '+1-555-1611',
    priority: 'low',
    score: 35,
    status: 'new',
    source: 'referral',
    description: 'Agricultural business interested in sustainability tracking',
    value: 18000,
    createdAt: '1 month ago',
  },
  {
    id: '17',
    name: 'Daniel White',
    company: 'Sterling Aerospace',
    email: 'dwhite@sterlingaero.com',
    phone: '+1-555-1712',
    priority: 'high',
    score: 94,
    status: 'converted',
    source: 'website',
    description: 'Aerospace manufacturer with strict FAA compliance needs',
    value: 320000,
    createdAt: '1 month ago',
  },
  {
    id: '18',
    name: 'Rachel Green',
    company: 'Pinnacle Hotels',
    email: 'rgreen@pinnaclehotels.com',
    phone: '+1-555-1813',
    priority: 'medium',
    score: 56,
    status: 'contacted',
    source: 'partner',
    description: 'Hotel chain seeking health and safety compliance tools',
    value: 38000,
    createdAt: '1 month ago',
  },
  {
    id: '19',
    name: 'Kevin Scott',
    company: 'DataSecure Inc',
    email: 'kscott@datasecure.com',
    phone: '+1-555-1914',
    priority: 'medium',
    score: 67,
    status: 'new',
    source: 'website',
    description: 'Cybersecurity firm needing SOC 2 compliance management',
    value: 48000,
    createdAt: '1 month ago',
  },
  {
    id: '20',
    name: 'Laura Mitchell',
    company: 'BioGen Pharmaceuticals',
    email: 'lmitchell@biogen.com',
    phone: '+1-555-2015',
    priority: 'high',
    score: 89,
    status: 'qualified',
    source: 'cold_outreach',
    description: 'Pharmaceutical company requiring GMP compliance automation',
    value: 275000,
    createdAt: '2 months ago',
  },
  {
    id: '21',
    name: 'Steven Harris',
    company: 'Mountain Mining Co',
    email: 'sharris@mountainmining.com',
    phone: '+1-555-2116',
    priority: 'medium',
    score: 71,
    status: 'contacted',
    source: 'referral',
    description: 'Mining operation seeking OSHA compliance solutions',
    value: 65000,
    createdAt: '2 months ago',
  },
  {
    id: '22',
    name: 'Michelle Turner',
    company: 'CloudNine Software',
    email: 'mturner@cloudnine.io',
    phone: '+1-555-2217',
    priority: 'low',
    score: 29,
    status: 'lost',
    source: 'website',
    description: 'SaaS company that went with competitor',
    value: 0,
    createdAt: '2 months ago',
  },
  {
    id: '23',
    name: 'Andrew Phillips',
    company: 'Prime Retail Group',
    email: 'aphillips@primeretail.com',
    phone: '+1-555-2318',
    priority: 'medium',
    score: 63,
    status: 'new',
    source: 'partner',
    description: 'Retail chain exploring workplace safety compliance',
    value: 32000,
    createdAt: '2 months ago',
  },
  {
    id: '24',
    name: 'Jessica Moore',
    company: 'Velocity Automotive',
    email: 'jmoore@velocityauto.com',
    phone: '+1-555-2419',
    priority: 'high',
    score: 86,
    status: 'qualified',
    source: 'website',
    description: 'Auto manufacturer needing environmental compliance tracking',
    value: 145000,
    createdAt: '2 months ago',
  },
  {
    id: '25',
    name: 'Thomas Anderson',
    company: 'Matrix Industries',
    email: 'tanderson@matrix.com',
    phone: '+1-555-2520',
    priority: 'low',
    score: 41,
    status: 'new',
    source: 'cold_outreach',
    description: 'Industrial company exploring compliance options',
    value: 22000,
    createdAt: '3 months ago',
  },
]

const sampleStats = {
  totalLeads: { value: 25, trend: '+18%', trendDirection: 'up' as const },
  newLeads: { value: 9, trend: '+5', trendDirection: 'up' as const },
  converted: { value: 1, trend: '4%', trendDirection: 'up' as const },
  highPriority: { value: 8, trend: '+2', trendDirection: 'up' as const },
  avgResponse: { value: '18h', trend: '-6h', trendDirection: 'up' as const },
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function PartnerLeadsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('leads')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleLeadClick = (lead: Lead) => {
    console.log('Opening lead:', lead)
    alert(`Opening lead: ${lead.name}`)
  }

  const handleLeadAction = (lead: Lead, action: string) => {
    console.log('Action for lead:', action, lead)
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
            <LeadsPage
              leads={sampleLeads}
              stats={sampleStats}
              onLeadClick={handleLeadClick}
              onLeadAction={handleLeadAction}
              onCreateLead={(data) => {
                console.log('Creating lead:', data)
                alert(`Lead created for: ${data.companyName}`)
              }}
              partners={[
                { id: '1', name: 'Acme Partners' },
                { id: '2', name: 'Global Solutions' },
                { id: '3', name: 'Tech Innovators' },
              ]}
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
  render: () => <PartnerLeadsPage />,
}

// Sidebar expanded by default
function PartnerLeadsPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('leads')

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
            <LeadsPage
              leads={sampleLeads}
              stats={sampleStats}
              onLeadClick={(lead) => console.log('Lead clicked:', lead)}
              onCreateLead={(data) => {
                console.log('Creating lead:', data)
                alert(`Lead created for: ${data.companyName}`)
              }}
              partners={[
                { id: '1', name: 'Acme Partners' },
                { id: '2', name: 'Global Solutions' },
                { id: '3', name: 'Tech Innovators' },
              ]}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <PartnerLeadsPageExpanded />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <LeadsPage
          leads={sampleLeads}
          stats={sampleStats}
          onLeadClick={(lead) => console.log('Lead clicked:', lead)}
          onCreateLead={(data) => {
            console.log('Creating lead:', data)
            alert(`Lead created for: ${data.companyName}`)
          }}
          partners={[
            { id: '1', name: 'Acme Partners' },
            { id: '2', name: 'Global Solutions' },
          ]}
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
      <div className="relative z-10">
        <LeadsPage
          leads={sampleLeads.slice(0, 3)}
          stats={{
            totalLeads: sampleStats.totalLeads,
            newLeads: sampleStats.newLeads,
            converted: sampleStats.converted,
          }}
          onLeadClick={(lead) => console.log('Lead clicked:', lead)}
        />
      </div>
    </div>
  ),
}

// Empty state
export const EmptyLeads: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <LeadsPage
          leads={[]}
          stats={{
            totalLeads: { value: 0, trendDirection: 'neutral' },
            newLeads: { value: 0, trendDirection: 'neutral' },
            converted: { value: 0, trend: '0%', trendDirection: 'neutral' },
          }}
        />
      </div>
    </div>
  ),
}

// Tablet viewport
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <PartnerLeadsPage />,
}

// Loading state
export const Loading: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <LeadsPage
          leads={[]}
          stats={sampleStats}
          loading={true}
        />
      </div>
    </div>
  ),
}

