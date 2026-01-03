import type { Meta, StoryObj } from '@storybook/react'
import { ActivityTimeline, Activity } from './ActivityTimeline'
import { MOLECULE_META, moleculeDescription } from '@/stories/_infrastructure'

const meta: Meta<typeof ActivityTimeline> = {
  title: 'Partner/Components/ActivityTimeline',
  component: ActivityTimeline,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Vertical timeline displaying lead activity history with icons, timestamps, and metadata.'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] p-4 bg-surface">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ActivityTimeline>

const sampleActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    description: 'Initial discovery call - discussed pain points and current solutions',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    performedBy: 'Sarah Johnson',
    metadata: { duration: 45 },
  },
  {
    id: '2',
    type: 'email',
    description: 'Sent follow-up email with product overview and pricing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    performedBy: 'Sarah Johnson',
  },
  {
    id: '3',
    type: 'status_change',
    description: 'Lead status updated based on engagement level',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    metadata: { oldStatus: 'new', newStatus: 'contacted' },
  },
  {
    id: '4',
    type: 'meeting',
    description: 'Product demo scheduled with technical team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    performedBy: 'Mike Chen',
    metadata: { duration: 60 },
  },
  {
    id: '5',
    type: 'note',
    description: 'Decision maker identified: VP of Operations. Budget approval needed from CFO.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    performedBy: 'Sarah Johnson',
  },
]

export const Default: Story = {
  args: {
    activities: sampleActivities,
    onActivityClick: (activity) => console.log('Activity clicked:', activity),
  },
}

export const WithConversion: Story = {
  args: {
    activities: [
      ...sampleActivities,
      {
        id: '6',
        type: 'converted',
        description: 'Lead successfully converted to customer',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        performedBy: 'Sarah Johnson',
      },
    ],
  },
}

export const WithLoss: Story = {
  args: {
    activities: [
      ...sampleActivities.slice(0, 3),
      {
        id: '6',
        type: 'lost',
        description: 'Lead lost - went with competitor due to pricing',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        performedBy: 'Sarah Johnson',
      },
    ],
  },
}

export const Loading: Story = {
  args: {
    activities: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    activities: [],
    emptyMessage: 'No activities recorded for this lead yet',
  },
}

export const SingleActivity: Story = {
  args: {
    activities: [sampleActivities[0]],
  },
}
