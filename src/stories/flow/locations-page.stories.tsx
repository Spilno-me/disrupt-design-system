/**
 * LocationsPage Stories
 *
 * Storybook stories for the Location Management page.
 * Includes mobile-responsive stories demonstrating:
 * - Bottom sheet for details on mobile
 * - Swipe-to-reveal actions
 * - 44px touch targets
 * - Smart auto-expand during search
 */

import type { Meta, StoryObj } from '@storybook/react'
import { LocationsPage } from '../../flow/components/locations'
import {
  seedLocationsTree as mockLocations,
  seedLocationsTreeExtended as mockLocationsExtended,
  emptyLocations,
} from '@/api'

// =============================================================================
// MOCK INCIDENT DATA FOR RISK SCENARIOS
// =============================================================================

const mockIncidents = [
  // Critical incident at HQ - Production Floor
  {
    id: 'inc-001',
    incidentId: 'INC-2024-001',
    locationId: 'loc-dept-1', // Production Floor
    severity: 'critical' as const,
    type: 'injury',
    status: 'open',
    title: 'Forklift collision resulting in serious injury',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    precisionMarker: { x: 35, y: 45 },
  },
  // High severity at Production Floor
  {
    id: 'inc-002',
    incidentId: 'INC-2024-002',
    locationId: 'loc-dept-1',
    severity: 'high' as const,
    type: 'chemical',
    status: 'investigation',
    title: 'Chemical spill near storage area',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    precisionMarker: { x: 60, y: 30 },
  },
  // Medium severity at Warehouse
  {
    id: 'inc-003',
    incidentId: 'INC-2024-003',
    locationId: 'loc-dept-2', // Warehouse
    severity: 'medium' as const,
    type: 'near_miss',
    status: 'review',
    title: 'Near miss - falling pallet',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Low severity at Warehouse
  {
    id: 'inc-004',
    incidentId: 'INC-2024-004',
    locationId: 'loc-dept-2',
    severity: 'low' as const,
    type: 'equipment',
    status: 'closed',
    title: 'Minor equipment malfunction',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // More incidents at Production Floor (to show trend)
  {
    id: 'inc-005',
    incidentId: 'INC-2024-005',
    locationId: 'loc-dept-1',
    severity: 'medium' as const,
    type: 'injury',
    status: 'closed',
    title: 'Minor hand injury during assembly',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    precisionMarker: { x: 45, y: 55 },
  },
  {
    id: 'inc-006',
    incidentId: 'INC-2024-006',
    locationId: 'loc-dept-1',
    severity: 'high' as const,
    type: 'fire',
    status: 'closed',
    title: 'Small electrical fire contained',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    precisionMarker: { x: 70, y: 25 },
  },
  // Incidents at West Regional
  {
    id: 'inc-007',
    incidentId: 'INC-2024-007',
    locationId: 'loc-zone-1', // Assembly Line A
    severity: 'low' as const,
    type: 'near_miss',
    status: 'closed',
    title: 'Slip hazard identified and resolved',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Recent incident for trend analysis
  {
    id: 'inc-008',
    incidentId: 'INC-2024-008',
    locationId: 'loc-dept-1',
    severity: 'medium' as const,
    type: 'environmental',
    status: 'open',
    title: 'Ventilation system issue reported',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Locations with floor plan images for heatmap demo
const mockLocationsWithFloorPlans = mockLocations.map((loc) => ({
  ...loc,
  // Add floor plan to first location (HQ) for demo
  floorPlanImage:
    loc.id === 'loc-1'
      ? 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
      : undefined,
  children: loc.children?.map((child) => ({
    ...child,
    // Add floor plan to Production Floor
    floorPlanImage:
      child.id === 'loc-dept-1'
        ? 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'
        : undefined,
  })),
}))

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof LocationsPage> = {
  title: 'Flow/Configuration/LocationsPage',
  component: LocationsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Location Management page for managing hierarchical facility locations and environmental zones.

## Features
- **Master-detail layout**: Tree view on left, context panel on right
- **Hierarchical tree**: Expandable/collapsible location hierarchy
- **Search & filter**: Find locations by name, type, or code
- **CRUD operations**: Create, read, update, delete locations
- **Cascade deletion**: Warning when deleting locations with children
- **Copy to clipboard**: Easy copying of location details

## Mobile UX (Responsive)
- **Bottom sheet**: Details open in a bottom sheet on mobile
- **Swipe-to-reveal**: Swipe left on tree items for Edit/Delete actions
- **44px touch targets**: All buttons meet Fitts' Law minimum
- **Smart auto-expand**: Search only expands 2 levels to reduce cognitive load
- **Reduced indentation**: 16px per level (capped at depth 4)

## Usage
\`\`\`tsx
import { LocationsPage } from '@dds/design-system/flow'

<LocationsPage
  locations={locations}
  onLocationCreate={async (data) => { /* ... */ }}
  onLocationUpdate={async (data) => { /* ... */ }}
  onLocationDelete={async (id) => { /* ... */ }}
  onRefresh={async () => { /* ... */ }}
/>
\`\`\`
        `,
      },
    },
  },
  args: {
    locations: mockLocations,
    onLocationCreate: async (data) => console.log('Create:', data),
    onLocationUpdate: async (data) => console.log('Update:', data),
    onLocationDelete: async (id) => console.log('Delete:', id),
    onRefresh: async () => console.log('Refresh'),
  },
  argTypes: {
    locations: {
      description: 'Hierarchical location data',
      control: false,
    },
    isLoading: {
      description: 'Loading state',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof LocationsPage>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state with mock locations (matching the design mockups)
 */
export const Default: Story = {
  args: {
    locations: mockLocations,
  },
}

/**
 * Extended data with deeper hierarchy (facility > building > floor > area)
 */
export const ExtendedHierarchy: Story = {
  args: {
    locations: mockLocationsExtended,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows a deeper hierarchy with buildings, floors, and areas nested under facilities.',
      },
    },
  },
}

/**
 * Empty state when no locations exist
 */
export const EmptyState: Story = {
  args: {
    locations: emptyLocations,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the empty state when no locations have been created yet.',
      },
    },
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    locations: [],
    isLoading: true,
  },
}

/**
 * Interactive demo with simulated async operations
 */
export const InteractiveDemo: Story = {
  args: {
    locations: mockLocations,
    onLocationCreate: async (data) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Created location:', data)
      alert(`Created location: ${data.name}`)
    },
    onLocationUpdate: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Updated location:', data)
      alert(`Updated location: ${data.name}`)
    },
    onLocationDelete: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Deleted location:', id)
      alert(`Deleted location: ${id}`)
    },
    onRefresh: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Refreshed locations')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo with simulated async operations. Click actions to see loading states and alerts.',
      },
    },
  },
}

/**
 * Single facility (no hierarchy)
 */
export const SingleFacility: Story = {
  args: {
    locations: [
      {
        id: 'loc-single',
        name: 'Standalone Facility',
        type: 'facility',
        code: 'STAND-001',
        description: 'A single facility with no children',
        address: '789 Solo Street, Austin, TX 78701',
        latitude: 30.2672,
        longitude: -97.7431,
        timezone: 'America/Chicago',
        parentId: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows a single facility without any child locations - delete will not show cascade warning.',
      },
    },
  },
}

/**
 * Many locations (performance test)
 */
export const ManyLocations: Story = {
  args: {
    locations: Array.from({ length: 10 }, (_, i) => ({
      id: `facility-${i}`,
      name: `Facility ${i + 1}`,
      type: 'facility' as const,
      code: `FAC-${String(i + 1).padStart(3, '0')}`,
      description: `Facility number ${i + 1}`,
      timezone: 'America/New_York',
      parentId: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      children: Array.from({ length: 5 }, (_, j) => ({
        id: `dept-${i}-${j}`,
        name: `Department ${i + 1}-${j + 1}`,
        type: 'department' as const,
        code: `DEPT-${i + 1}-${j + 1}`,
        description: `Department ${j + 1} of Facility ${i + 1}`,
        timezone: 'America/New_York',
        parentId: `facility-${i}`,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      })),
    })),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Performance test with 10 facilities each containing 5 departments (60 total locations).',
      },
    },
  },
}

// =============================================================================
// MOBILE VIEWPORT STORIES
// =============================================================================

/**
 * Mobile viewport - Default
 *
 * Shows the mobile-responsive layout with:
 * - Full-width tree
 * - Bottom sheet for details (tap a location to open)
 * - Swipe-to-reveal actions (swipe left on tree items)
 * - Larger touch targets (44px minimum)
 */
export const MobileDefault: Story = {
  args: {
    locations: mockLocations,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
Mobile-optimized layout featuring:
- **Full-width tree**: No side panel, tree uses entire screen
- **Bottom sheet**: Tap a location to open details in a bottom sheet
- **Swipe-to-reveal**: Swipe left on tree items to reveal Edit/Delete actions
- **44px touch targets**: All interactive elements meet minimum size requirements
- **Smart auto-expand**: Search only expands 2 levels deep to reduce cognitive load
        `,
      },
    },
  },
}

/**
 * Mobile viewport - With Sheet Open
 *
 * Simulates the state after selecting a location on mobile.
 * The bottom sheet will open showing location details.
 */
export const MobileWithSheet: Story = {
  args: {
    locations: mockLocations,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile layout with a location selected. Tap any location in the tree to see the bottom sheet in action.',
      },
    },
  },
}

/**
 * Mobile viewport - iPhone 12 Pro
 */
export const MobileiPhone12Pro: Story = {
  args: {
    locations: mockLocations,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12promax',
    },
    docs: {
      description: {
        story: 'iPhone 12 Pro Max viewport (428x926)',
      },
    },
  },
}

/**
 * Tablet viewport - iPad
 *
 * Shows the layout at tablet breakpoint.
 * At lg breakpoint (1024px), switches to desktop layout.
 */
export const TabletIPad: Story = {
  args: {
    locations: mockLocations,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    docs: {
      description: {
        story:
          'iPad viewport (768x1024). This shows mobile layout since it\'s below the lg (1024px) breakpoint.',
      },
    },
  },
}

/**
 * Tablet landscape - Shows desktop layout
 */
export const TabletLandscape: Story = {
  args: {
    locations: mockLocations,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
      viewportRotated: true,
    },
    docs: {
      description: {
        story:
          'iPad in landscape mode (1024x768). This shows the desktop two-panel layout.',
      },
    },
  },
}

// =============================================================================
// RISK INTELLIGENCE STORIES
// =============================================================================

/**
 * Risk Intelligence - Shows locations with incident data
 *
 * Demonstrates the risk intelligence features:
 * - Risk badges on tree items (showing incident counts)
 * - Safety score in location details
 * - Risk tab with breakdown by type
 * - Trend indicators
 */
export const WithRiskData: Story = {
  args: {
    locations: mockLocationsWithFloorPlans,
    incidents: mockIncidents,
    onViewIncident: (incidentId) => {
      console.log('View incident:', incidentId)
      alert(`Viewing incident: ${incidentId}`)
    },
    onViewAllIncidents: (locationId) => {
      console.log('View all incidents for:', locationId)
      alert(`Viewing all incidents for location: ${locationId}`)
    },
    onScheduleAudit: (locationId) => {
      console.log('Schedule audit for:', locationId)
      alert(`Scheduling safety audit for location: ${locationId}`)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates the **Risk Intelligence Center** features:

**Tree View Enhancements:**
- Risk badges show incident counts with severity-based colors
- Critical severity shows pulsing red badge
- Parent locations show rolled-up totals from children

**Location Info Panel:**
- Info tab: Basic location details (unchanged)
- Risk tab (when incidents exist):
  - Safety score (0-100) with circular progress
  - Trend indicator (improving/stable/worsening)
  - Incident breakdown by type (bar chart)
  - Recent incidents list
  - Floor plan heatmap (when available)
  - Peer comparison

**Try these interactions:**
1. Click "HQ Manufacturing" to see the Risk tab
2. Select "Production Floor" to see the worst-affected area
3. Click the Risk tab to see detailed breakdown
4. View the floor plan heatmap showing incident locations
        `,
      },
    },
  },
}

/**
 * Risk Intelligence - Critical Alert State
 *
 * Shows the warning banner when a location has worsening risk trends.
 */
export const RiskCriticalState: Story = {
  args: {
    locations: mockLocationsWithFloorPlans,
    incidents: [
      ...mockIncidents,
      // Add more recent incidents to create a worsening trend
      {
        id: 'inc-009',
        incidentId: 'INC-2024-009',
        locationId: 'loc-dept-1',
        severity: 'critical' as const,
        type: 'injury',
        status: 'open',
        title: 'Second serious injury this week',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'inc-010',
        incidentId: 'INC-2024-010',
        locationId: 'loc-dept-1',
        severity: 'high' as const,
        type: 'chemical',
        status: 'open',
        title: 'Another chemical spill reported',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    onViewIncident: (incidentId) => console.log('View incident:', incidentId),
    onViewAllIncidents: (locationId) =>
      console.log('View all incidents:', locationId),
    onScheduleAudit: (locationId) => console.log('Schedule audit:', locationId),
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows a **critical risk state** with:
- Multiple critical/high severity incidents
- Worsening trend (more incidents than previous period)
- Trending risk alert banner
- Low safety score

This state triggers the recommendation to schedule a safety audit.
        `,
      },
    },
  },
}

/**
 * Risk Intelligence - Clean Record
 *
 * Shows locations with no incidents - demonstrates the "clean" state.
 */
export const RiskCleanRecord: Story = {
  args: {
    locations: mockLocations,
    incidents: [], // No incidents
    onViewAllIncidents: undefined,
    onScheduleAudit: (locationId) => {
      console.log('Schedule proactive audit:', locationId)
      alert(`Scheduling proactive audit for: ${locationId}`)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows locations with a **clean safety record**:
- No risk badges on tree items
- Safety score of 100 (Excellent)
- "No Incidents Recorded" message
- Optional proactive audit scheduling

This is the ideal state for a well-managed facility.
        `,
      },
    },
  },
}

/**
 * Risk Intelligence - Mobile View
 *
 * Shows risk intelligence features on mobile with bottom sheet.
 */
export const RiskMobileView: Story = {
  args: {
    locations: mockLocationsWithFloorPlans,
    incidents: mockIncidents,
    onViewIncident: (incidentId) => console.log('View incident:', incidentId),
    onViewAllIncidents: (locationId) =>
      console.log('View all incidents:', locationId),
    onScheduleAudit: (locationId) => console.log('Schedule audit:', locationId),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
Mobile-responsive risk intelligence:
- Risk badges visible on tree items
- Bottom sheet shows Info/Risk tabs
- Swipe through recent incidents
- Touch-friendly heatmap with zoom

Tap a location with a risk badge to see the Risk tab in the bottom sheet.
        `,
      },
    },
  },
}
