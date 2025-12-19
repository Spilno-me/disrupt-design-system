import type { Meta, StoryObj } from '@storybook/react'
import { LeadsPage } from './LeadsPage'
import { Lead } from './LeadCard'
import { PAGE_META, pageDescription } from '@/stories/_infrastructure'

const meta: Meta<typeof LeadsPage> = {
  title: 'Partner/Components/LeadsPage',
  component: LeadsPage,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`LeadsPage - Full page layout for managing leads

Features:
- Stats cards row showing KPIs
- Search and filter bar
- **Data table for desktop** (md breakpoint and up)
- **Cards for mobile** (below md breakpoint)
- Pagination with page size selector
- Row selection with selection count
- Sortable columns`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof LeadsPage>

// Sample leads data matching the Figma design
const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Peter Thiel',
    company: 'fosocorp22',
    email: 'pthiel@paypal.com',
    phone: '+1555069504',
    priority: 'medium',
    score: 22,
    status: 'new',
    source: 'website',
    description: 'Registration form submission. Industry: finance. Company size: 11-50.',
    value: 0,
    createdAt: '2 months ago',
  },
  {
    id: '2',
    name: 'Lisa May',
    company: 'Novacorp',
    email: 'lisa@disruptinc.io',
    phone: '1 337-501-5023',
    priority: 'medium',
    score: 22,
    status: 'new',
    source: 'website',
    description: 'Registration form submission.',
    value: 0,
    createdAt: '2 months ago',
  },
  {
    id: '3',
    name: 'Carol Davis',
    company: 'Global Energy Corp',
    email: 'carol.davis@globalenergy.com',
    phone: '+1-555-0601',
    priority: 'medium',
    score: 92,
    status: 'new',
    source: 'cold_outreach',
    description: 'Large enterprise deal for environmental monitoring across multiple sites',
    value: 45000,
    createdAt: '2 months ago',
  },
  {
    id: '4',
    name: 'Bob Rodriguez',
    company: 'TechStart Innovations',
    email: 'bob.rodriguez@techstart.com',
    phone: '+1-555-0501',
    priority: 'medium',
    score: 65,
    status: 'new',
    source: 'referral',
    description: 'Startup company looking for automation tools',
    value: 8000,
    createdAt: '2 months ago',
  },
  {
    id: '5',
    name: 'Alice Thompson',
    company: 'ACME Manufacturing',
    email: 'alice.thompson@acme.com',
    phone: '+1-555-0401',
    priority: 'medium',
    score: 85,
    status: 'new',
    source: 'website',
    description: 'Interested in safety monitoring solution for their new facility',
    value: 15000,
    createdAt: '2 months ago',
  },
]

// Extended sample data for pagination testing
const extendedLeads: Lead[] = [
  ...sampleLeads,
  {
    id: '6',
    name: 'David Kim',
    company: 'NextGen Solutions',
    email: 'david.kim@nextgen.io',
    phone: '+1-555-0701',
    priority: 'high',
    score: 88,
    status: 'qualified',
    source: 'referral',
    description: 'Enterprise client interested in full platform deployment',
    value: 75000,
    createdAt: '1 month ago',
  },
  {
    id: '7',
    name: 'Sarah Johnson',
    company: 'Horizon Healthcare',
    email: 'sarah.j@horizon.health',
    phone: '+1-555-0801',
    priority: 'high',
    score: 91,
    status: 'contacted',
    source: 'website',
    description: 'Healthcare provider looking for compliance automation',
    value: 52000,
    createdAt: '3 weeks ago',
  },
  {
    id: '8',
    name: 'Michael Chen',
    company: 'Pacific Trading Co',
    email: 'mchen@pacific-trading.com',
    phone: '+1-555-0901',
    priority: 'low',
    score: 34,
    status: 'new',
    source: 'cold_outreach',
    description: 'Initial contact, needs follow up',
    value: 0,
    createdAt: '1 week ago',
  },
  {
    id: '9',
    name: 'Emily Watson',
    company: 'Stellar Dynamics',
    email: 'e.watson@stellar.io',
    phone: '+1-555-1001',
    priority: 'medium',
    score: 56,
    status: 'contacted',
    source: 'partner',
    description: 'Referred by existing client, mid-market segment',
    value: 22000,
    createdAt: '2 weeks ago',
  },
  {
    id: '10',
    name: 'James Wilson',
    company: 'Capital Investments LLC',
    email: 'jwilson@capital-inv.com',
    phone: '+1-555-1101',
    priority: 'high',
    score: 95,
    status: 'qualified',
    source: 'website',
    description: 'High-value financial services client',
    value: 120000,
    createdAt: '5 days ago',
  },
  {
    id: '11',
    name: 'Rachel Green',
    company: 'Eco Solutions Inc',
    email: 'rachel@ecosolutions.com',
    phone: '+1-555-1201',
    priority: 'medium',
    score: 67,
    status: 'new',
    source: 'website',
    description: 'Sustainability-focused company looking for monitoring tools',
    value: 18000,
    createdAt: '4 days ago',
  },
  {
    id: '12',
    name: 'Daniel Park',
    company: 'Urban Development Corp',
    email: 'dpark@urbandev.co',
    phone: '+1-555-1301',
    priority: 'low',
    score: 28,
    status: 'lost',
    source: 'cold_outreach',
    description: 'Went with competitor solution',
    value: 0,
    createdAt: '3 months ago',
  },
  {
    id: '13',
    name: 'Maria Santos',
    company: 'BioTech Research',
    email: 'maria.santos@biotech.org',
    phone: '+1-555-1401',
    priority: 'high',
    score: 89,
    status: 'converted',
    source: 'referral',
    description: 'Successfully converted to customer - lab monitoring solution',
    value: 45000,
    createdAt: '1 month ago',
  },
  {
    id: '14',
    name: 'Kevin Murphy',
    company: 'Atlas Construction',
    email: 'kmurphy@atlas-const.com',
    phone: '+1-555-1501',
    priority: 'medium',
    score: 72,
    status: 'qualified',
    source: 'website',
    description: 'Construction company needing safety compliance tools',
    value: 35000,
    createdAt: '2 weeks ago',
  },
  {
    id: '15',
    name: 'Jennifer Lee',
    company: 'Digital Marketing Pro',
    email: 'jlee@digitalmarketing.pro',
    phone: '+1-555-1601',
    priority: 'low',
    score: 41,
    status: 'contacted',
    source: 'other',
    description: 'Marketing agency exploring automation options',
    value: 5000,
    createdAt: '1 week ago',
  },
]

const sampleStats = {
  totalLeads: { value: 6, trend: '+12%', trendDirection: 'up' as const },
  newLeads: { value: 0, trend: '+5', trendDirection: 'up' as const },
  converted: { value: 0, trend: '0.0%', trendDirection: 'neutral' as const },
  highPriority: { value: 0, trend: undefined, trendDirection: 'neutral' as const },
  avgResponse: { value: '24h', trend: '-2h', trendDirection: 'up' as const },
}

const extendedStats = {
  totalLeads: { value: 15, trend: '+150%', trendDirection: 'up' as const },
  newLeads: { value: 5, trend: '+3', trendDirection: 'up' as const },
  converted: { value: 1, trend: '6.7%', trendDirection: 'up' as const },
  highPriority: { value: 4, trend: '+2', trendDirection: 'up' as const },
  avgResponse: { value: '18h', trend: '-6h', trendDirection: 'up' as const },
}

export const Default: Story = {
  args: {
    leads: sampleLeads,
    stats: sampleStats,
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}

export const WithPagination: Story = {
  args: {
    leads: extendedLeads,
    stats: extendedStats,
    defaultPageSize: 5,
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}

export const LargeDataset: Story = {
  args: {
    leads: Array.from({ length: 100 }, (_, i) => ({
      ...extendedLeads[i % extendedLeads.length],
      id: `lead-${i + 1}`,
      name: `${extendedLeads[i % extendedLeads.length].name} ${i + 1}`,
      score: Math.floor(Math.random() * 100),
      status: ['new', 'contacted', 'qualified', 'converted', 'lost'][Math.floor(Math.random() * 5)] as Lead['status'],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as Lead['priority'],
      value: Math.floor(Math.random() * 100000),
    })),
    stats: {
      totalLeads: { value: 100, trend: '+500%', trendDirection: 'up' as const },
      newLeads: { value: 25, trend: '+15', trendDirection: 'up' as const },
      converted: { value: 18, trend: '18%', trendDirection: 'up' as const },
      highPriority: { value: 32, trend: '+10', trendDirection: 'up' as const },
      avgResponse: { value: '12h', trend: '-12h', trendDirection: 'up' as const },
    },
    defaultPageSize: 10,
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}

export const WithFilters: Story = {
  args: {
    leads: sampleLeads,
    stats: sampleStats,
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}

export const Loading: Story = {
  args: {
    leads: sampleLeads,
    stats: sampleStats,
    loading: true,
  },
}

export const EmptyState: Story = {
  args: {
    leads: [],
    stats: {
      totalLeads: { value: 0, trend: undefined, trendDirection: 'neutral' },
      newLeads: { value: 0, trend: undefined, trendDirection: 'neutral' },
      converted: { value: 0, trend: '0%', trendDirection: 'neutral' },
    },
  },
}

export const MixedStatuses: Story = {
  args: {
    leads: [
      { ...sampleLeads[0], status: 'new', priority: 'high', score: 95 },
      { ...sampleLeads[1], id: '2b', status: 'contacted', priority: 'medium', score: 75 },
      { ...sampleLeads[2], id: '3b', status: 'qualified', priority: 'low', score: 60 },
      { ...sampleLeads[3], id: '4b', status: 'converted', priority: 'high', score: 88 },
      { ...sampleLeads[4], id: '5b', status: 'lost', priority: 'medium', score: 45 },
    ],
    stats: {
      totalLeads: { value: 5, trend: '+5', trendDirection: 'up' as const },
      newLeads: { value: 1, trend: '+1', trendDirection: 'up' as const },
      converted: { value: 1, trend: '20%', trendDirection: 'up' as const },
      highPriority: { value: 2, trend: '+2', trendDirection: 'up' as const },
    },
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}

export const HighValueLeads: Story = {
  args: {
    leads: extendedLeads.filter((lead) => (lead.value ?? 0) > 30000),
    stats: {
      totalLeads: { value: 5, trend: '+25%', trendDirection: 'up' as const },
      newLeads: { value: 0, trend: '0', trendDirection: 'neutral' as const },
      converted: { value: 1, trend: '20%', trendDirection: 'up' as const },
      highPriority: { value: 3, trend: '+1', trendDirection: 'up' as const },
      avgResponse: { value: '8h', trend: '-16h', trendDirection: 'up' as const },
    },
    onLeadClick: (lead) => console.log('Lead clicked:', lead),
    onLeadAction: (lead, action) => console.log('Lead action:', action, lead),
  },
}
