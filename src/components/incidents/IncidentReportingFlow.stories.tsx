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
    layout: 'centered',
    docs: {
      description: {
        component: `
Multi-step wizard for incident reporting. Opens as a side sheet on desktop
and full-page on mobile. Features 5 steps:

1. **Classification** - Category, severity, title
2. **Description** - What happened, immediate actions
3. **Location & Time** - Where and when
4. **Impact** - Injury info, witnesses
5. **Evidence & Review** - Photos, notes, summary

Uses existing Wizard components from the provisioning module.
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

// Sample floor plan placeholder for demo purposes
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
// INTERACTIVE DEMO
// =============================================================================

function InteractiveDemo() {
  const [open, setOpen] = useState(false)
  const [submittedData, setSubmittedData] = useState<IncidentFormData | null>(null)

  const handleSubmit = async (data: IncidentFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmittedData(data)
    console.log('Incident submitted:', data)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Incident Reporting Demo</h2>
        <p className="text-sm text-emphasis max-w-md mx-auto">
          Click the button below to open the incident reporting wizard.
          The wizard will slide in from the right.
        </p>
        <Button
          variant="destructive"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          Report Incident
        </Button>
      </div>

      <IncidentReportingFlow
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        locations={SAMPLE_LOCATIONS}
      />

      {submittedData && (
        <div className="mt-8 p-4 bg-success-light rounded-lg max-w-md mx-auto">
          <p className="text-sm font-medium text-success-strong">
            Incident submitted successfully!
          </p>
          <p className="text-xs text-success-strong mt-1">
            Title: {submittedData.title}
          </p>
          <p className="text-xs text-success-strong">
            Category: {submittedData.category} | Severity: {submittedData.severity}
          </p>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => <InteractiveDemo />,
}

export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Reopen</Button>
        <IncidentReportingFlow
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Submitted:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
          locations={SAMPLE_LOCATIONS}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Opens the wizard immediately to show the full flow.',
      },
    },
  },
}

export const WithPrefilledData: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="space-y-4">
        <p className="text-sm text-emphasis">
          This demo shows the wizard with pre-filled data (e.g., for editing a draft).
        </p>
        <Button onClick={() => setOpen(true)}>Edit Draft Incident</Button>
        <IncidentReportingFlow
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => console.log('Updated:', data)}
          locations={SAMPLE_LOCATIONS}
          initialData={{
            category: 'near_miss',
            severity: 'medium',
            title: 'Forklift near-miss in warehouse',
            description: 'A forklift nearly struck a pedestrian in Warehouse 1.',
            location: 'warehouse-1',
          }}
        />
      </div>
    )
  },
}

export const WithoutLocations: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="space-y-4">
        <p className="text-sm text-emphasis">
          When no locations are provided, shows a free-text input instead of dropdown.
        </p>
        <Button onClick={() => setOpen(true)}>Report Incident</Button>
        <IncidentReportingFlow
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => console.log('Submitted:', data)}
          // No locations prop - will show text input
        />
      </div>
    )
  },
}
