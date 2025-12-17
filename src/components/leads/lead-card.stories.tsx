import type { Meta, StoryObj } from '@storybook/react'
import { LeadCard, Lead } from './LeadCard'

const meta: Meta<typeof LeadCard> = {
  title: 'Partner/Components/LeadCard',
  component: LeadCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ORGANISM

Business card displaying lead information with status, priority, and actions. Partner-specific component.`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LeadCard>

const baseLead: Lead = {
  id: '1',
  name: 'Peter Thiel',
  company: 'Founders Fund',
  email: 'peter@foundersfund.com',
  phone: '+1-555-0123',
  priority: 'high',
  score: 92,
  status: 'new',
  source: 'website',
  description: 'Interested in enterprise safety monitoring solution for portfolio companies',
  value: 45000,
  createdAt: '2 months ago',
}

export const Default: Story = {
  args: {
    lead: baseLead,
    onClick: (lead) => console.log('Lead clicked:', lead),
    onActionClick: (lead) => console.log('Action clicked:', lead),
  },
}

export const HighPriority: Story = {
  args: {
    lead: {
      ...baseLead,
      priority: 'high',
      score: 95,
    },
    onClick: (lead) => console.log('Lead clicked:', lead),
  },
}

export const MediumPriority: Story = {
  args: {
    lead: {
      ...baseLead,
      priority: 'medium',
      score: 65,
    },
    onClick: (lead) => console.log('Lead clicked:', lead),
  },
}

export const LowPriority: Story = {
  args: {
    lead: {
      ...baseLead,
      priority: 'low',
      score: 35,
    },
    onClick: (lead) => console.log('Lead clicked:', lead),
  },
}

export const StatusNew: Story = {
  args: {
    lead: {
      ...baseLead,
      status: 'new',
    },
  },
}

export const StatusContacted: Story = {
  args: {
    lead: {
      ...baseLead,
      status: 'contacted',
    },
  },
}

export const StatusQualified: Story = {
  args: {
    lead: {
      ...baseLead,
      status: 'qualified',
    },
  },
}

export const StatusConverted: Story = {
  args: {
    lead: {
      ...baseLead,
      status: 'converted',
      score: 98,
    },
  },
}

export const StatusLost: Story = {
  args: {
    lead: {
      ...baseLead,
      status: 'lost',
      score: 20,
    },
  },
}

export const FromReferral: Story = {
  args: {
    lead: {
      ...baseLead,
      source: 'referral',
      description: 'Referred by existing customer Jane Smith from Acme Corp',
    },
  },
}

export const FromColdOutreach: Story = {
  args: {
    lead: {
      ...baseLead,
      source: 'cold_outreach',
      description: 'Responded to cold email campaign for Q4 promotions',
    },
  },
}

export const NoValue: Story = {
  args: {
    lead: {
      ...baseLead,
      value: 0,
    },
  },
}

export const LongDescription: Story = {
  args: {
    lead: {
      ...baseLead,
      description: 'This is a very long description that should be truncated with line-clamp. Registration form submission. Industry: finance. Company size: 11-50. Message: We are interested in your safety monitoring platform for our growing operations across multiple sites in the Northeast region.',
    },
  },
}

export const MinimalInfo: Story = {
  args: {
    lead: {
      id: '2',
      name: 'John Doe',
      company: 'Unknown Co',
      email: 'john@example.com',
      priority: 'low',
      score: 10,
      status: 'new',
      source: 'other',
      createdAt: '1 day ago',
    },
  },
}

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 w-[850px]">
      <div className="grid grid-cols-2 gap-4">
        <LeadCard
          lead={baseLead}
          onClick={(lead) => console.log('Clicked:', lead)}
        />
        <LeadCard
          lead={{
            ...baseLead,
            id: '2',
            name: 'Lisa May',
            company: 'Novacorp',
            email: 'lisa@novacorp.com',
            priority: 'medium',
            score: 65,
            status: 'contacted',
            source: 'referral',
            value: 8000,
          }}
          onClick={(lead) => console.log('Clicked:', lead)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <LeadCard
          lead={{
            ...baseLead,
            id: '3',
            name: 'Bob Rodriguez',
            company: 'TechStart',
            email: 'bob@techstart.io',
            priority: 'low',
            score: 45,
            status: 'qualified',
            source: 'cold_outreach',
            value: 15000,
          }}
          onClick={(lead) => console.log('Clicked:', lead)}
        />
        <LeadCard
          lead={{
            ...baseLead,
            id: '4',
            name: 'Carol Davis',
            company: 'Global Energy',
            email: 'carol@globalenergy.com',
            priority: 'high',
            score: 88,
            status: 'converted',
            source: 'website',
            value: 120000,
          }}
          onClick={(lead) => console.log('Clicked:', lead)}
        />
      </div>
    </div>
  ),
}
