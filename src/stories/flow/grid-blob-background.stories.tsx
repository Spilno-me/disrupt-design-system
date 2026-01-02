/**
 * GridBlobBackground Stories
 *
 * Decorative background component with animated colored grid lines.
 * Features a subtle base grid with colored "flashlight" effects that animate across.
 */
import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
} from '../_infrastructure'
import { GridBlobBackground, BlobSection } from '../../components/ui/GridBlobCanvas'
import { MetricsDashboardWidget } from '../../flow/components/dashboard'

// =============================================================================
// SAMPLE CONTENT
// =============================================================================

function SampleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-elevated dark:bg-abyss-900 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-secondary">{children}</p>
    </div>
  )
}

/** Generate chart dates relative to current date */
function getRecentDates(count: number = 6): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dates: string[] = []

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(1)
    d.setMonth(d.getMonth() - Math.floor(i / 2))
    const day = i % 2 === 0 ? 1 : 15
    dates.push(`${months[d.getMonth()]} ${day}`)
  }
  return dates
}

const recentDates = getRecentDates(6)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof BlobSection> = {
  title: 'Flow/GridBlobBackground',
  component: BlobSection,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: moleculeDescription(`
Decorative background component with animated colored grid lines.

**Default Behavior (color-grid):**
- Subtle, barely visible base grid pattern
- Animated colored "flashlight" effect on grid lines
- Two color blobs (accent + success) animate independently

**Features:**
- Configurable blob colors
- Single or dual blob mode
- Works in both light and dark modes
- Perfect for executive dashboards and landing pages

**Use Cases:**
- Dashboard page backgrounds
- Landing page hero sections
- Card container backgrounds
- Any area needing a polished, modern aesthetic
        `),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['color-grid', 'static', 'animated'],
      description: 'color-grid (default): animated colored grid lines',
    },
    blobCount: {
      control: 'select',
      options: [1, 2],
      description: 'Number of color blobs (default: 2)',
    },
    primaryBlobColor: {
      control: 'text',
      description: 'Primary blob color (default: accent)',
    },
    secondaryBlobColor: {
      control: 'text',
      description: 'Secondary blob color (default: success)',
    },
  },
}

export default meta
type Story = StoryObj<typeof BlobSection>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default - animated colored grid lines with accent and success colors.
 * This is the standard background for dashboards and pages.
 */
export const Default: Story = {
  args: {
    className: 'min-h-screen p-8 bg-page',
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SampleCard title="Dashboard Widget">
          Place your dashboard widgets here. The background provides a modern,
          polished aesthetic.
        </SampleCard>
        <SampleCard title="Another Widget">
          The animated grid creates subtle visual interest without distracting
          from your content.
        </SampleCard>
      </div>
    ),
  },
}

/**
 * Single blob - only the primary color animates.
 */
export const SingleBlob: Story = {
  args: {
    blobCount: 1,
    className: 'min-h-screen p-8 bg-page',
    children: (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-primary mb-4">Single Color Blob</h2>
        <p className="text-secondary">Only the primary (accent) color animates</p>
      </div>
    ),
  },
}

/**
 * Custom colors - warning and info.
 */
export const CustomColors: Story = {
  args: {
    primaryBlobColor: 'var(--color-warning)',
    secondaryBlobColor: 'var(--color-info)',
    className: 'min-h-screen p-8 bg-page',
    children: (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-primary mb-4">Custom Colors</h2>
        <p className="text-secondary">Warning (yellow) and Info (blue) grid lines</p>
      </div>
    ),
  },
}

/**
 * With MetricsDashboardWidget - realistic dashboard usage.
 */
export const WithDashboardWidget: Story = {
  args: {
    className: 'min-h-screen p-8 bg-page',
    children: (
      <div className="max-w-2xl">
        <MetricsDashboardWidget
          metrics={[
            { label: 'Scope', value: 356, trend: '+32%', color: 'info' },
            { label: 'Started', value: 64, color: 'warning' },
            { label: 'Completed', value: 192, color: 'success' },
          ]}
          chartData={[
            { date: recentDates[0], scope: 280, started: 40, completed: 150 },
            { date: recentDates[1], scope: 295, started: 45, completed: 158 },
            { date: recentDates[2], scope: 310, started: 52, completed: 168 },
            { date: recentDates[3], scope: 330, started: 58, completed: 178 },
            { date: recentDates[4], scope: 350, started: 62, completed: 188 },
            { date: recentDates[5], scope: 356, started: 64, completed: 192 },
          ]}
          borderStyle="glass-gradient"
        />
      </div>
    ),
  },
}

/**
 * AllStates - Comprehensive showcase of all configurations.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="Default (2 Blobs)">
        <BlobSection className="min-h-[200px] p-8 rounded-xl bg-page">
          <div className="text-center py-8">
            <p className="text-primary font-medium">Accent + Success colored grid lines</p>
          </div>
        </BlobSection>
      </StorySection>

      <StorySection title="Single Blob">
        <BlobSection blobCount={1} className="min-h-[200px] p-8 rounded-xl bg-page">
          <div className="text-center py-8">
            <p className="text-primary font-medium">Single accent color blob</p>
          </div>
        </BlobSection>
      </StorySection>

      <StorySection title="Custom Colors (Warning + Info)">
        <BlobSection
          primaryBlobColor="var(--color-warning)"
          secondaryBlobColor="var(--color-info)"
          className="min-h-[200px] p-8 rounded-xl bg-page"
        >
          <div className="text-center py-8">
            <p className="text-primary font-medium">Yellow and blue grid lines</p>
          </div>
        </BlobSection>
      </StorySection>

      <StorySection title="Custom Colors (Error + Success)">
        <BlobSection
          primaryBlobColor="var(--color-error)"
          secondaryBlobColor="var(--color-success)"
          className="min-h-[200px] p-8 rounded-xl bg-page"
        >
          <div className="text-center py-8">
            <p className="text-primary font-medium">Red and green grid lines</p>
          </div>
        </BlobSection>
      </StorySection>

      <StorySection title="With Dashboard Widget">
        <BlobSection className="min-h-[400px] p-8 rounded-xl bg-page">
          <div className="max-w-xl">
            <MetricsDashboardWidget
              metrics={[
                { label: 'Active', value: 128, trend: '+12', color: 'info' },
                { label: 'Resolved', value: 95, trend: '+8', color: 'success' },
              ]}
              chartData={[
                { date: 'Week 1', active: 100, resolved: 70 },
                { date: 'Week 2', active: 110, resolved: 78 },
                { date: 'Week 3', active: 118, resolved: 85 },
                { date: 'Week 4', active: 128, resolved: 95 },
              ]}
              borderStyle="glass-gradient"
            />
          </div>
        </BlobSection>
      </StorySection>
    </div>
  ),
}
