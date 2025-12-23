/**
 * Location Picker Stories
 *
 * Mobile-optimized location selector with GPS-first UX.
 * Designed for field workers who need to quickly capture location.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LocationPicker } from './LocationPicker'
import type { LocationNode, LocationValue } from './types'

// =============================================================================
// SAMPLE DATA
// =============================================================================

// Sample floor plan image (a placeholder for demo purposes)
// In production, this would be an actual uploaded floor plan image
const SAMPLE_FLOOR_PLAN = 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=400&fit=crop'

const sampleLocations: LocationNode[] = [
  {
    id: 'warehouses',
    label: 'Warehouses',
    icon: 'warehouse',
    selectable: false,
    children: [
      {
        id: 'wh-a-1',
        label: 'Warehouse A - Section 1',
        selectable: true,
        floorPlanImage: SAMPLE_FLOOR_PLAN,
      },
      {
        id: 'wh-a-2',
        label: 'Warehouse A - Section 2',
        selectable: true,
        floorPlanImage: SAMPLE_FLOOR_PLAN,
      },
      { id: 'wh-b', label: 'Warehouse B', selectable: true },
      { id: 'storage-c', label: 'Storage Room C', selectable: true },
      { id: 'chemical', label: 'Chemical Storage', selectable: true },
    ],
  },
  {
    id: 'production',
    label: 'Production',
    icon: 'factory',
    selectable: false,
    children: [
      {
        id: 'prod-floor-a',
        label: 'Production Floor - Building A',
        selectable: true,
        floorPlanImage: SAMPLE_FLOOR_PLAN,
      },
      {
        id: 'assembly-1',
        label: 'Assembly Line 1',
        selectable: true,
        floorPlanImage: SAMPLE_FLOOR_PLAN,
      },
      { id: 'assembly-2', label: 'Assembly Line 2', selectable: true },
      { id: 'assembly-3', label: 'Assembly Line 3', selectable: true },
      { id: 'quality-lab', label: 'Quality Control Lab', selectable: true },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics',
    icon: 'parking',
    selectable: false,
    children: [
      { id: 'loading-east', label: 'Loading Dock - East Wing', selectable: true },
      { id: 'loading-west', label: 'Loading Dock - West Wing', selectable: true },
      { id: 'shipping', label: 'Shipping Department', selectable: true },
      { id: 'receiving', label: 'Receiving Area', selectable: true },
      { id: 'parking-a', label: 'Parking Lot A', selectable: true },
      { id: 'parking-b', label: 'Parking Lot B', selectable: true },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: 'building',
    selectable: false,
    children: [
      { id: 'utility-3b', label: 'Utility Room 3B', selectable: true },
      { id: 'maintenance', label: 'Maintenance Shop', selectable: true },
      { id: 'compressor', label: 'Compressor Building', selectable: true },
      { id: 'boiler', label: 'Boiler Room', selectable: true },
      { id: 'hvac', label: 'HVAC Equipment Area', selectable: true },
      { id: 'server', label: 'Server Room', selectable: true },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    icon: 'building',
    selectable: false,
    children: [
      { id: 'office-f1', label: 'Office Building - Floor 1', selectable: true },
      { id: 'office-f2', label: 'Office Building - Floor 2', selectable: true },
      { id: 'office-f3', label: 'Office Building - Floor 3', selectable: true },
      { id: 'break-north', label: 'Break Room - North', selectable: true },
      { id: 'break-south', label: 'Break Room - South', selectable: true },
      { id: 'conf-101', label: 'Conference Room 101', selectable: true },
      { id: 'conf-102', label: 'Conference Room 102', selectable: true },
    ],
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: 'outdoor',
    selectable: false,
    children: [
      { id: 'tank-farm', label: 'Outdoor Tank Farm', selectable: true },
      { id: 'roof', label: 'Roof Access', selectable: true },
      { id: 'entrance-main', label: 'Main Entrance', selectable: true },
      { id: 'entrance-back', label: 'Back Entrance', selectable: true },
    ],
  },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof LocationPicker> = {
  title: 'Components/LocationPicker',
  component: LocationPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Location Picker (Mobile-Optimized)

A location selector designed for **field workers** on mobile devices.

## UX Philosophy
- **GPS is PRIMARY** - Big button at top, one tap to capture location
- **Recent locations** - Quick access to commonly used areas
- **48px touch targets** - Easy to tap on small screens
- **Bottom sheet** - Full location list opens from bottom on mobile

## UX Flow
1. **Primary**: Tap "Use My Current Location" (GPS)
2. **Secondary**: Tap a recent location
3. **Tertiary**: Browse all locations via search

## Features
- GPS with what3words conversion
- Recent locations (localStorage)
- Searchable hierarchical tree
- Bottom sheet modal on mobile
- 48px minimum touch targets (Fitts' Law)

## Usage
\`\`\`tsx
import { LocationPicker, type LocationNode } from '@dds/design-system/core'

const locations: LocationNode[] = [
  {
    id: 'warehouses',
    label: 'Warehouses',
    icon: 'warehouse',
    children: [
      { id: 'wh-a', label: 'Warehouse A' },
    ]
  }
]

<LocationPicker
  locations={locations}
  value={value}
  onChange={setValue}
  showGps
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LocationPicker>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state - GPS-first UX for field workers.
 * The GPS button is prominent, followed by recent locations.
 */
export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>(null)

    return (
      <div className="w-[380px] space-y-4">
        <div className="p-3 bg-muted-bg/50 rounded-lg border border-default">
          <p className="text-xs text-tertiary mb-1">📱 Mobile-First Design</p>
          <p className="text-sm text-secondary">
            GPS button is prominent. Touch targets are 48px minimum.
          </p>
        </div>

        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          showGps
          placeholder="Browse all locations"
        />

        {value && (
          <div className="p-3 bg-muted-bg rounded-lg text-xs">
            <p className="font-medium mb-1">Selected:</p>
            <pre className="text-primary overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Mobile viewport simulation.
 * Shows how the component looks on a phone screen.
 */
export const MobileView: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>(null)

    return (
      <div className="w-[320px] bg-surface border border-default rounded-2xl overflow-hidden shadow-xl">
        {/* Fake phone header */}
        <div className="bg-abyss-900 text-white px-4 py-2 flex justify-between text-xs">
          <span>9:41</span>
          <span>📶 100%</span>
        </div>

        {/* App content */}
        <div className="p-4 space-y-4">
          <h1 className="text-lg font-semibold text-primary">Report Incident</h1>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Where did this happen? <span className="text-error">*</span>
            </label>
            <LocationPicker
              locations={sampleLocations}
              value={value}
              onChange={setValue}
              showGps
              placeholder="Browse locations"
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * With pre-selected location.
 * Shows the selected state with change option.
 */
export const WithSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>({
      id: 'assembly-3',
      path: ['Production', 'Assembly Line 3'],
      label: 'Assembly Line 3',
    })

    return (
      <div className="w-[380px]">
        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          showGps
        />
      </div>
    )
  },
}

/**
 * GPS location selected.
 * Shows what3words address from GPS capture.
 */
export const GpsLocation: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>({
      id: 'gps-123',
      path: ['Current Location'],
      label: '///filled.count.soap',
      what3words: 'filled.count.soap',
      coordinates: { lat: 51.5152, lng: -0.1830 },
    })

    return (
      <div className="w-[380px]">
        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          showGps
        />
      </div>
    )
  },
}

/**
 * Without GPS option.
 * Just the browse locations interface.
 */
export const WithoutGps: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>(null)

    return (
      <div className="w-[380px]">
        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          showGps={false}
          placeholder="Select a location"
        />
      </div>
    )
  },
}

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[380px]">
      <LocationPicker
        locations={sampleLocations}
        value={{
          id: 'wh-a-1',
          path: ['Warehouses', 'Warehouse A - Section 1'],
          label: 'Warehouse A - Section 1',
        }}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}

/**
 * Error state for validation.
 */
export const ErrorState: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>(null)

    return (
      <div className="w-[380px] space-y-2">
        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          error
          showGps
        />
        <p className="text-sm text-error">Please select a location</p>
      </div>
    )
  },
}

/**
 * Form integration example.
 * Shows how to use in a real incident report form.
 */
export const FormExample: Story = {
  render: function Render() {
    const [location, setLocation] = useState<LocationValue | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (location) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 2000)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Incident Location <span className="text-error">*</span>
          </label>
          <LocationPicker
            locations={sampleLocations}
            value={location}
            onChange={setLocation}
            showGps
            error={!location && submitted}
            placeholder="Where did it happen?"
          />
          <p className="text-xs text-tertiary">
            Use GPS for your current location, or browse the list
          </p>
        </div>

        <button
          type="submit"
          disabled={!location}
          className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50 hover:bg-accent-strong transition-colors"
        >
          {submitted ? '✓ Submitted!' : 'Continue'}
        </button>
      </form>
    )
  },
}

/**
 * Floor Plan Marker demo.
 * When a location has a floor plan image, users can click to mark the exact spot.
 * This is useful for indoor incidents where GPS isn't precise enough.
 */
export const WithFloorPlan: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>({
      id: 'wh-a-1',
      path: ['Warehouses', 'Warehouse A - Section 1'],
      label: 'Warehouse A - Section 1',
      floorPlanImage: SAMPLE_FLOOR_PLAN,
    })

    return (
      <div className="w-[380px] space-y-4">
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-xs text-accent font-medium mb-1">Floor Plan Precision</p>
          <p className="text-sm text-secondary">
            Select a location with a floor plan, then click on the image to mark the exact spot.
          </p>
        </div>

        <LocationPicker
          locations={sampleLocations}
          value={value}
          onChange={setValue}
          showGps
        />

        {value?.precisionMarker && (
          <div className="p-3 bg-muted-bg rounded-lg text-xs">
            <p className="font-medium mb-1">Precision Marker:</p>
            <pre className="text-primary overflow-x-auto">
              {JSON.stringify(value.precisionMarker, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Floor Plan in mobile context.
 * Shows the floor plan marker in a simulated mobile device frame.
 */
export const FloorPlanMobile: Story = {
  render: function Render() {
    const [value, setValue] = useState<LocationValue | null>({
      id: 'assembly-1',
      path: ['Production', 'Assembly Line 1'],
      label: 'Assembly Line 1',
      floorPlanImage: SAMPLE_FLOOR_PLAN,
    })

    return (
      <div className="w-[320px] bg-surface border border-default rounded-2xl overflow-hidden shadow-xl">
        {/* Fake phone header */}
        <div className="bg-abyss-900 text-white px-4 py-2 flex justify-between text-xs">
          <span>9:41</span>
          <span>📶 100%</span>
        </div>

        {/* App content */}
        <div className="p-4 space-y-4">
          <h1 className="text-lg font-semibold text-primary">Report Incident</h1>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Where did this happen? <span className="text-error">*</span>
            </label>
            <LocationPicker
              locations={sampleLocations}
              value={value}
              onChange={setValue}
              showGps
            />
          </div>

          <p className="text-xs text-tertiary text-center">
            Tap on the floor plan to mark the exact spot
          </p>
        </div>
      </div>
    )
  },
}
