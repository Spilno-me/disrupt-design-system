/**
 * Floor Plan Uploader Stories
 *
 * Admin component for uploading and managing floor plan images for locations.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FloorPlanUploader, type FloorPlanUploadItem } from './FloorPlanUploader'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof FloorPlanUploader> = {
  title: 'Components/FloorPlanUploader',
  component: FloorPlanUploader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Floor Plan Uploader (Admin)

Upload and manage floor plan images for facility locations.

## Features
- Drag & drop file upload
- Support for multiple floor plans per location
- Image preview with thumbnails
- Rename, reorder, and delete plans
- File validation (type and size)

## Usage
\`\`\`tsx
import { FloorPlanUploader } from '@dds/design-system/core'

function LocationForm() {
  const [floorPlans, setFloorPlans] = useState([])

  return (
    <FloorPlanUploader
      floorPlans={floorPlans}
      onChange={setFloorPlans}
      maxPlans={5}
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FloorPlanUploader>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Empty state - ready for uploads.
 * Shows the drop zone with instructions.
 */
export const Empty: Story = {
  render: function Render() {
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([])

    return (
      <div className="w-[500px] space-y-4">
        <div className="p-3 bg-muted-bg/50 rounded-lg border border-default">
          <p className="text-xs text-tertiary mb-1">Admin Component</p>
          <p className="text-sm text-secondary">
            This component is used in the admin panel for location management.
          </p>
        </div>

        <FloorPlanUploader
          floorPlans={floorPlans}
          onChange={setFloorPlans}
        />

        <div className="text-xs text-tertiary">
          {floorPlans.length} floor plan(s) added
        </div>
      </div>
    )
  },
}

/**
 * With existing floor plans.
 * Shows how uploaded floor plans appear with controls.
 */
export const WithExisting: Story = {
  render: function Render() {
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([
      {
        imageUrl: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=200&fit=crop',
        name: 'Main Floor Layout',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
        name: 'Second Floor',
      },
    ])

    return (
      <div className="w-[500px] space-y-4">
        <FloorPlanUploader
          floorPlans={floorPlans}
          onChange={setFloorPlans}
        />

        <div className="p-3 bg-muted-bg rounded-lg text-xs">
          <p className="font-medium mb-1">Current Floor Plans:</p>
          <ul className="space-y-1">
            {floorPlans.map((fp, i) => (
              <li key={fp.imageUrl || i} className="text-secondary">
                {i + 1}. {fp.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Single file mode.
 * Restricts to one floor plan only.
 */
export const SingleFile: Story = {
  render: function Render() {
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([])

    return (
      <div className="w-[500px] space-y-4">
        <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
          <p className="text-xs text-warning font-medium mb-1">Single File Mode</p>
          <p className="text-sm text-secondary">
            Set <code className="text-xs bg-muted-bg px-1 rounded">maxPlans={'{1}'}</code> to limit to one floor plan.
          </p>
        </div>

        <FloorPlanUploader
          floorPlans={floorPlans}
          onChange={setFloorPlans}
          maxPlans={1}
        />
      </div>
    )
  },
}

/**
 * Disabled state.
 * Shows uploaded plans but prevents modifications.
 */
export const Disabled: Story = {
  render: function Render() {
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([
      {
        imageUrl: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=200&fit=crop',
        name: 'Building A - Ground Floor',
      },
    ])

    return (
      <div className="w-[500px] space-y-4">
        <FloorPlanUploader
          floorPlans={floorPlans}
          onChange={setFloorPlans}
          disabled
        />

        <p className="text-xs text-tertiary">
          Disabled state - used when viewing read-only location details.
        </p>
      </div>
    )
  },
}

/**
 * Custom max plans.
 * Shows configuration for maximum number of plans.
 */
export const CustomMaxPlans: Story = {
  render: function Render() {
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([])

    return (
      <div className="w-[500px] space-y-4">
        <div className="p-3 bg-info/10 rounded-lg border border-info/20">
          <p className="text-xs text-info font-medium mb-1">Custom Limit</p>
          <p className="text-sm text-secondary">
            Max 3 floor plans allowed.
          </p>
        </div>

        <FloorPlanUploader
          floorPlans={floorPlans}
          onChange={setFloorPlans}
          maxPlans={3}
        />
      </div>
    )
  },
}

/**
 * Form integration example.
 * Shows how to use within a location management form.
 */
export const FormIntegration: Story = {
  render: function Render() {
    const [locationName, setLocationName] = useState('Warehouse A - Section 1')
    const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([])
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2000)
    }

    return (
      <form onSubmit={handleSubmit} className="w-[500px] space-y-6">
        <h2 className="text-lg font-semibold text-primary">Edit Location</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Location Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-3 py-2 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Floor Plans
          </label>
          <FloorPlanUploader
            floorPlans={floorPlans}
            onChange={setFloorPlans}
            maxPlans={5}
          />
          <p className="text-xs text-tertiary">
            Upload floor plan images to enable precise incident marking.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm border border-default rounded-lg hover:bg-muted-bg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-strong transition-colors"
          >
            {submitted ? 'Saved!' : 'Save Location'}
          </button>
        </div>
      </form>
    )
  },
}
