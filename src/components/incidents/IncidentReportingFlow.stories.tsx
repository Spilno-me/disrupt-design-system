import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { IncidentReportingFlow } from './IncidentReportingFlow'
import type { IncidentFormData, LocationOption } from './types'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof IncidentReportingFlow> = {
  title: 'Flow/IncidentReportingFlow',
  component: IncidentReportingFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-page wizard for incident reporting. Clean, focused experience with 5 steps:

1. **Classification** - Category, severity, title
2. **Description** - What happened, immediate actions
3. **Location & Time** - Where and when
4. **Impact** - Injury info, witnesses
5. **Evidence & Review** - Photos, notes, summary

Two variants:
- \`variant="page"\` - Inline page (for dedicated routes)
- \`variant="overlay"\` - Full-screen modal overlay
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof IncidentReportingFlow>

// =============================================================================
// SAMPLE DATA
// =============================================================================

const SAMPLE_FLOOR_PLAN = 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=400&fit=crop'

const SAMPLE_LOCATIONS: LocationOption[] = [
  { value: 'bldg-a-floor-1', label: 'Building A - Floor 1', group: 'Main Campus', floorPlanImage: SAMPLE_FLOOR_PLAN },
  { value: 'bldg-a-floor-2', label: 'Building A - Floor 2', group: 'Main Campus', floorPlanImage: SAMPLE_FLOOR_PLAN },
  { value: 'bldg-b-floor-1', label: 'Building B - Floor 1', group: 'Main Campus', floorPlanImage: SAMPLE_FLOOR_PLAN },
  { value: 'warehouse-1', label: 'Warehouse 1', group: 'Storage Facilities', floorPlanImage: SAMPLE_FLOOR_PLAN },
  { value: 'warehouse-2', label: 'Warehouse 2', group: 'Storage Facilities', floorPlanImage: SAMPLE_FLOOR_PLAN },
  { value: 'parking-north', label: 'North Parking Lot', group: 'Outdoor Areas' },
  { value: 'parking-south', label: 'South Parking Lot', group: 'Outdoor Areas' },
  { value: 'loading-dock', label: 'Loading Dock', group: 'Outdoor Areas' },
]

// =============================================================================
// STORIES
// =============================================================================

function OverlayDemo() {
  const [open, setOpen] = useState(false)
  const [submittedData, setSubmittedData] = useState<IncidentFormData | null>(null)

  const handleSubmit = async (data: IncidentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmittedData(data)
    console.log('Incident submitted:', data)
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h2 className="text-xl font-semibold">Incident Reporting</h2>
        <p className="text-sm text-emphasis max-w-md">
          Full-page wizard opens as an overlay. Clean, focused experience.
        </p>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Report Incident
        </Button>

        {submittedData && (
          <div className="mt-8 p-4 bg-success-light rounded-lg max-w-md mx-auto">
            <p className="text-sm font-medium text-success-strong">
              Incident submitted successfully!
            </p>
            <p className="text-xs text-success-strong mt-1">
              Title: {submittedData.title}
            </p>
          </div>
        )}
      </div>

      <IncidentReportingFlow
        variant="overlay"
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
        locations={SAMPLE_LOCATIONS}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <OverlayDemo />,
}

export const OverlayOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <>
        <div className="fixed bottom-4 right-4 z-[60]">
          <Button onClick={() => setOpen(true)}>Reopen</Button>
        </div>
        <IncidentReportingFlow
          variant="overlay"
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Submitted:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
          onCancel={() => setOpen(false)}
          locations={SAMPLE_LOCATIONS}
        />
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Opens immediately to show the full wizard layout.',
      },
    },
  },
}

export const InlinePage: Story = {
  render: () => (
    <IncidentReportingFlow
      variant="page"
      onSubmit={async (data) => console.log('Submitted:', data)}
      onCancel={() => console.log('Cancelled - would navigate back')}
      locations={SAMPLE_LOCATIONS}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline page variant - use when the wizard is a dedicated route.',
      },
    },
  },
}

export const WithPrefilledData: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <IncidentReportingFlow
        variant="overlay"
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => console.log('Updated:', data)}
        onCancel={() => setOpen(false)}
        locations={SAMPLE_LOCATIONS}
        initialData={{
          category: 'near_miss',
          severity: 'medium',
          title: 'Forklift near-miss in warehouse',
          description: 'A forklift nearly struck a pedestrian in Warehouse 1.',
          location: 'warehouse-1',
        }}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-filled data for editing an existing draft.',
      },
    },
  },
}
