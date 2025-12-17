import type { Meta, StoryObj } from '@storybook/react'
import {
  PartnerNetworkPage,
  MOCK_NETWORK_PARTNERS,
  type NetworkPartner,
} from '../../components/partners/PartnerNetworkPage'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof PartnerNetworkPage> = {
  title: 'Partner/Partner Network',
  component: PartnerNetworkPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Partner Network Page

A hierarchical data table component for managing partner relationships. Displays master partners and their sub-partners in an expandable tree structure with performance metrics.

## Features

- **Hierarchical Structure**: Master partners can have nested sub-partners
- **Expandable Rows**: Click chevrons to reveal sub-partners and performance metrics
- **Bulk Actions**: Expand/Collapse all functionality
- **Search & Filter**: Filter by status (Active/Inactive/Pending) and type (Master/Sub)
- **CRUD Operations**: Add, Edit, Delete partners via dialogs
- **Performance Metrics**: Each partner displays leads, conversion, commission, and revenue

## Usage

\`\`\`tsx
import { PartnerNetworkPage } from 'dds'

function MyPage() {
  return (
    <PartnerNetworkPage
      partners={partnerData}
      onAddPartner={() => console.log('Add partner')}
      onEditPartner={(partner) => console.log('Edit', partner)}
      onDeletePartner={(partner) => console.log('Delete', partner)}
      onAddSubPartner={(parent) => console.log('Add sub-partner to', parent)}
    />
  )
}
\`\`\`

## Data Structure

Each partner follows the \`NetworkPartner\` interface:

\`\`\`ts
interface NetworkPartner {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  status: 'active' | 'inactive' | 'pending'
  monthlyRevenue: number
  isMasterPartner: boolean
  metrics: {
    totalLeads: number
    conversion: number | null
    commission: number | null
    totalRevenue: number
  }
  subPartners?: NetworkPartner[]
  parentId?: string
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    partners: {
      description: 'Array of partner data with hierarchical structure',
      control: 'object',
    },
    loading: {
      description: 'Shows loading spinner when true',
      control: 'boolean',
    },
    onAddPartner: {
      description: 'Called when Add Partner button is clicked',
      action: 'onAddPartner',
    },
    onEditPartner: {
      description: 'Called when Edit is selected from partner row menu',
      action: 'onEditPartner',
    },
    onViewPartner: {
      description: 'Called when View is selected from partner row menu',
      action: 'onViewPartner',
    },
    onAddSubPartner: {
      description: 'Called when Add Sub-Partner is selected (master partners only)',
      action: 'onAddSubPartner',
    },
    onDeletePartner: {
      description: 'Called when Delete is confirmed',
      action: 'onDeletePartner',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnerNetworkPage>

// =============================================================================
// EXTENDED MOCK DATA
// =============================================================================

const LARGE_NETWORK: NetworkPartner[] = [
  ...MOCK_NETWORK_PARTNERS,
  {
    id: '6',
    companyName: 'Meridian Partners',
    contactName: 'Rachel Green',
    contactEmail: 'rachel@meridianpartners.com',
    status: 'active',
    monthlyRevenue: 15000,
    isMasterPartner: true,
    metrics: {
      totalLeads: 28,
      conversion: 17.5,
      commission: null,
      totalRevenue: 89000,
    },
    subPartners: [
      {
        id: '6-1',
        companyName: 'Meridian West Coast',
        contactName: 'Joey Tribbiani',
        contactEmail: 'joey@meridianwest.com',
        status: 'active',
        monthlyRevenue: 5000,
        isMasterPartner: false,
        parentId: '6',
        metrics: {
          totalLeads: 10,
          conversion: 15.0,
          commission: 3200,
          totalRevenue: 32000,
        },
      },
      {
        id: '6-2',
        companyName: 'Meridian East Coast',
        contactName: 'Chandler Bing',
        contactEmail: 'chandler@meridianeast.com',
        status: 'active',
        monthlyRevenue: 6500,
        isMasterPartner: false,
        parentId: '6',
        metrics: {
          totalLeads: 12,
          conversion: 18.0,
          commission: 4100,
          totalRevenue: 41000,
        },
      },
    ],
  },
  {
    id: '7',
    companyName: 'Apex Consulting',
    contactName: 'Monica Geller',
    contactEmail: 'monica@apexconsulting.com',
    status: 'pending',
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 5,
      conversion: null,
      commission: null,
      totalRevenue: 0,
    },
  },
  {
    id: '8',
    companyName: 'Northern Alliance',
    contactName: 'Phoebe Buffay',
    contactEmail: 'phoebe@northernalliance.io',
    status: 'inactive',
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 0,
      conversion: null,
      commission: null,
      totalRevenue: 0,
    },
  },
]

const SINGLE_PARTNER: NetworkPartner[] = [
  {
    id: '1',
    companyName: 'Solo Industries',
    contactName: 'Han Solo',
    contactEmail: 'han@soloindustries.com',
    status: 'active',
    monthlyRevenue: 25000,
    isMasterPartner: true,
    metrics: {
      totalLeads: 45,
      conversion: 22.0,
      commission: null,
      totalRevenue: 150000,
    },
  },
]

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view with sample partner hierarchy data.
 * Click on master partner rows to expand and see sub-partners and metrics.
 */
export const Default: Story = {
  args: {
    partners: MOCK_NETWORK_PARTNERS,
    loading: false,
    onAddPartner: () => console.log('Add partner clicked'),
    onEditPartner: (partner) => console.log('Edit partner:', partner.companyName),
    onDeletePartner: (partner) => console.log('Delete partner:', partner.companyName),
    onAddSubPartner: (parent) => console.log('Add sub-partner to:', parent.companyName),
  },
}

/**
 * Loading state shows a spinner while data is being fetched.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
}

/**
 * Empty state when no partners exist in the network.
 * Shows a call-to-action to add the first partner.
 */
export const Empty: Story = {
  args: {
    ...Default.args,
    partners: [],
  },
}

/**
 * Large network with many partners and sub-partners.
 * Demonstrates the component's ability to handle larger datasets.
 */
export const LargeNetwork: Story = {
  args: {
    ...Default.args,
    partners: LARGE_NETWORK,
  },
}

/**
 * Network with a single partner (no sub-partners).
 * Shows how the component handles minimal data.
 */
export const SinglePartner: Story = {
  args: {
    ...Default.args,
    partners: SINGLE_PARTNER,
  },
}

/**
 * Partners with various statuses to demonstrate status indicators.
 * Mix of active, inactive, and pending partners.
 */
export const MixedStatuses: Story = {
  args: {
    ...Default.args,
    partners: [
      {
        id: '1',
        companyName: 'Active Corp',
        contactName: 'John Active',
        contactEmail: 'john@activecorp.com',
        status: 'active',
        monthlyRevenue: 10000,
        isMasterPartner: true,
        metrics: { totalLeads: 20, conversion: 15.0, commission: null, totalRevenue: 50000 },
      },
      {
        id: '2',
        companyName: 'Pending LLC',
        contactName: 'Jane Pending',
        contactEmail: 'jane@pendingllc.com',
        status: 'pending',
        monthlyRevenue: 0,
        isMasterPartner: true,
        metrics: { totalLeads: 3, conversion: null, commission: null, totalRevenue: 0 },
      },
      {
        id: '3',
        companyName: 'Inactive Inc',
        contactName: 'Bob Inactive',
        contactEmail: 'bob@inactiveinc.com',
        status: 'inactive',
        monthlyRevenue: 0,
        isMasterPartner: true,
        metrics: { totalLeads: 0, conversion: null, commission: null, totalRevenue: 12000 },
      },
    ],
  },
}

/**
 * Deep nesting example showing master partner with multiple sub-partners.
 * Demonstrates visual hierarchy and indentation.
 */
export const DeepHierarchy: Story = {
  args: {
    ...Default.args,
    partners: [
      {
        id: '1',
        companyName: 'Global Enterprises',
        contactName: 'CEO Smith',
        contactEmail: 'ceo@globalenterprises.com',
        status: 'active',
        monthlyRevenue: 50000,
        isMasterPartner: true,
        metrics: { totalLeads: 100, conversion: 25.0, commission: null, totalRevenue: 500000 },
        subPartners: [
          {
            id: '1-1',
            companyName: 'Global North America',
            contactName: 'NA Manager',
            contactEmail: 'na@globalenterprises.com',
            status: 'active',
            monthlyRevenue: 15000,
            isMasterPartner: false,
            parentId: '1',
            metrics: { totalLeads: 30, conversion: 20.0, commission: 12000, totalRevenue: 150000 },
          },
          {
            id: '1-2',
            companyName: 'Global Europe',
            contactName: 'EU Manager',
            contactEmail: 'eu@globalenterprises.com',
            status: 'active',
            monthlyRevenue: 18000,
            isMasterPartner: false,
            parentId: '1',
            metrics: { totalLeads: 35, conversion: 22.0, commission: 14000, totalRevenue: 180000 },
          },
          {
            id: '1-3',
            companyName: 'Global Asia Pacific',
            contactName: 'APAC Manager',
            contactEmail: 'apac@globalenterprises.com',
            status: 'active',
            monthlyRevenue: 12000,
            isMasterPartner: false,
            parentId: '1',
            metrics: { totalLeads: 25, conversion: 18.0, commission: 9500, totalRevenue: 120000 },
          },
          {
            id: '1-4',
            companyName: 'Global LATAM',
            contactName: 'LATAM Manager',
            contactEmail: 'latam@globalenterprises.com',
            status: 'pending',
            monthlyRevenue: 0,
            isMasterPartner: false,
            parentId: '1',
            metrics: { totalLeads: 8, conversion: null, commission: null, totalRevenue: 0 },
          },
        ],
      },
    ],
  },
}

/**
 * Mobile viewport - demonstrates responsive behavior.
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
 * Tablet viewport - demonstrates responsive behavior.
 */
export const Tablet: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
