import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { IncidentManagementTableWithDialogs } from './IncidentManagementTableWithDialogs'
import type { Incident } from '../ui/table/IncidentManagementTable'
import { ORGANISM_META, organismDescription, StorySection, IPhoneMobileFrame } from '@/stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof IncidentManagementTableWithDialogs> = {
  title: 'Flow/Incidents/IncidentManagementTableWithDialogs',
  component: IncidentManagementTableWithDialogs,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'padded',
    docs: {
      description: {
        component: organismDescription(
          'Complete incident management table with integrated Submit, Edit, and Delete dialogs. ' +
          'This "batteries included" component handles all dialog state management internally.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof IncidentManagementTableWithDialogs>

// =============================================================================
// SAMPLE DATA
// =============================================================================

const createSampleIncidents = (): Incident[] => [
  {
    id: '1',
    incidentId: 'INC-000042',
    title: 'Slip and fall in warehouse section B',
    location: 'Warehouse B - Loading Dock',
    reporter: 'John Smith',
    priority: 'draft',
    severity: 'medium',
    status: 'draft',
    ageDays: 3,
  },
  {
    id: '2',
    incidentId: 'INC-000043',
    title: 'Near miss - forklift proximity incident',
    location: 'Distribution Center A',
    reporter: 'Sarah Johnson',
    priority: 'draft',
    severity: 'high',
    status: 'draft',
    ageDays: 1,
  },
  {
    id: '3',
    incidentId: 'INC-000044',
    title: 'Chemical spill near ventilation system',
    location: 'Manufacturing Floor 2',
    reporter: 'Mike Davis',
    priority: 'critical',
    severity: 'critical',
    status: 'reported',
    ageDays: 0,
    overdue: false,
  },
  {
    id: '4',
    incidentId: 'INC-000045',
    title: 'Equipment malfunction - conveyor belt',
    location: 'Assembly Line 3',
    reporter: 'Emily Brown',
    priority: 'high',
    severity: 'high',
    status: 'investigation',
    ageDays: 5,
  },
  {
    id: '5',
    incidentId: 'INC-000046',
    title: 'Minor injury - paper cut during document handling',
    location: 'Office Building 1',
    reporter: 'Alex Chen',
    priority: 'draft',
    severity: 'low',
    status: 'draft',
    ageDays: 7,
  },
  {
    id: '6',
    incidentId: 'INC-000047',
    title: 'Fire alarm triggered - false alarm',
    location: 'Main Office - Floor 3',
    reporter: 'Jessica Lee',
    priority: 'medium',
    severity: 'medium',
    status: 'closed',
    ageDays: 14,
  },
]

const sampleLocations = [
  { value: 'warehouse-a', label: 'Warehouse A', group: 'Distribution' },
  { value: 'warehouse-b', label: 'Warehouse B - Loading Dock', group: 'Distribution' },
  { value: 'dist-center-a', label: 'Distribution Center A', group: 'Distribution' },
  { value: 'office-1', label: 'Office Building 1', group: 'Corporate' },
  { value: 'office-2', label: 'Main Office - Floor 3', group: 'Corporate' },
  { value: 'mfg-1', label: 'Manufacturing Floor 1', group: 'Production' },
  { value: 'mfg-2', label: 'Manufacturing Floor 2', group: 'Production' },
  { value: 'assembly-3', label: 'Assembly Line 3', group: 'Production' },
]

// =============================================================================
// INTERACTIVE DEMO
// =============================================================================

function InteractiveDemo() {
  const [incidents, setIncidents] = useState<Incident[]>(createSampleIncidents)
  const [actionLog, setActionLog] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setActionLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10))
  }

  const handleSubmitSuccess = async (incident: { incidentId: string; id: string }) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000))

    // Update local state - change from draft to reported
    setIncidents((prev) =>
      prev.map((inc): Incident =>
        inc.id === incident.id
          ? { ...inc, status: 'reported', priority: inc.severity }
          : inc
      )
    )
    addLog(`✅ Submitted: ${incident.incidentId} is now active`)
  }

  const handleEditSuccess = async (_data: unknown, incidentId: string) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000))

    const incident = incidents.find((i) => i.id === incidentId)
    addLog(`📝 Edited: ${incident?.incidentId ?? incidentId} saved`)
  }

  const handleDeleteSuccess = async (incident: { incidentId: string; id: string }) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000))

    // Remove from local state
    setIncidents((prev) => prev.filter((inc) => inc.id !== incident.id))
    addLog(`🗑️ Deleted: ${incident.incidentId}`)
  }

  const draftCount = incidents.filter((i) => i.status === 'draft').length
  const activeCount = incidents.filter((i) => i.status !== 'draft').length

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-muted-bg rounded-lg">
        <div>
          <p className="text-sm text-secondary">Total Incidents</p>
          <p className="text-2xl font-bold text-primary">{incidents.length}</p>
        </div>
        <div className="h-10 w-px bg-default" />
        <div>
          <p className="text-sm text-secondary">Drafts</p>
          <p className="text-2xl font-bold text-warning">{draftCount}</p>
        </div>
        <div className="h-10 w-px bg-default" />
        <div>
          <p className="text-sm text-secondary">Active</p>
          <p className="text-2xl font-bold text-success">{activeCount}</p>
        </div>
      </div>

      {/* Table with Dialogs */}
      <IncidentManagementTableWithDialogs
        data={incidents}
        onSubmitSuccess={handleSubmitSuccess}
        onEditSuccess={handleEditSuccess}
        onDeleteSuccess={handleDeleteSuccess}
        locations={sampleLocations}
        onLocationClick={(loc) => addLog(`📍 Navigate to: ${loc}`)}
        onReporterClick={(reporter) => addLog(`👤 View profile: ${reporter}`)}
        onNextStep={(id) => {
          const inc = incidents.find((i) => i.id === id)
          addLog(`➡️ Next step for: ${inc?.incidentId}`)
        }}
      />

      {/* Action Log */}
      <div className="p-4 bg-surface border border-default rounded-lg">
        <h3 className="text-sm font-semibold text-primary mb-3">Action Log</h3>
        {actionLog.length === 0 ? (
          <p className="text-sm text-secondary italic">
            Click table actions to see events logged here...
          </p>
        ) : (
          <div className="space-y-1 font-mono text-xs">
            {actionLog.map((log, i) => (
              <p key={i} className="text-secondary">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => <InteractiveDemo />,
}

export const DraftsOnly: Story = {
  render: () => {
    const drafts = createSampleIncidents().filter((i) => i.status === 'draft')
    return (
      <StorySection
        title="Draft Incidents Only"
        description="Table showing only draft incidents with all three actions available (Submit, Edit, Delete)"
      >
        <IncidentManagementTableWithDialogs
          data={drafts}
          onSubmitSuccess={async (inc) => {
            console.log('Submitted:', inc)
          }}
          onEditSuccess={async (data, id) => {
            console.log('Edited:', id, data)
          }}
          onDeleteSuccess={async (inc) => {
            console.log('Deleted:', inc)
          }}
          locations={sampleLocations}
        />
      </StorySection>
    )
  },
}

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pageSize = 3
    const allIncidents = createSampleIncidents()
    const paginatedData = allIncidents.slice((page - 1) * pageSize, page * pageSize)

    return (
      <StorySection
        title="With Pagination"
        description="Table with pagination enabled - dialogs work seamlessly with paginated data"
      >
        <IncidentManagementTableWithDialogs
          data={paginatedData}
          pagination
          currentPage={page}
          totalItems={allIncidents.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onSubmitSuccess={async (inc) => console.log('Submitted:', inc)}
          onEditSuccess={async (data, id) => console.log('Edited:', id, data)}
          onDeleteSuccess={async (inc) => console.log('Deleted:', inc)}
          locations={sampleLocations}
        />
      </StorySection>
    )
  },
}

export const EmptyState: Story = {
  render: () => (
    <StorySection
      title="Empty State"
      description="When there are no incidents to display"
    >
      <IncidentManagementTableWithDialogs
        data={[]}
        onSubmitSuccess={async () => {}}
        onEditSuccess={async () => {}}
        onDeleteSuccess={async () => {}}
        locations={sampleLocations}
      />
    </StorySection>
  ),
}

export const CustomTransforms: Story = {
  render: () => {
    const incidents = createSampleIncidents().filter((i) => i.status === 'draft')

    return (
      <StorySection
        title="Custom Data Transforms"
        description="Using custom transform functions to add additional data to dialogs"
      >
        <IncidentManagementTableWithDialogs
          data={incidents}
          onSubmitSuccess={async (inc) => console.log('Submitted with category:', inc)}
          onEditSuccess={async (data, id) => console.log('Edited:', id, data)}
          onDeleteSuccess={async (inc) => console.log('Deleted:', inc)}
          locations={sampleLocations}
          // Custom transform to add category to submit dialog
          transformToSubmit={(incident) => ({
            id: incident.id,
            incidentId: incident.incidentId,
            title: incident.title,
            location: incident.location,
            reporter: incident.reporter,
            severity: incident.severity,
            category: 'near_miss', // Add category for submit dialog
          })}
          // Custom transform to add more data for editing
          transformToEdit={(incident) => ({
            id: incident.id,
            incidentId: incident.incidentId,
            title: incident.title,
            location: incident.location,
            reporter: incident.reporter,
            severity: incident.severity,
            category: 'equipment',
            description: 'Pre-filled description for editing...',
            immediateActions: 'Area cordoned off, supervisor notified.',
          })}
        />
      </StorySection>
    )
  },
}

// =============================================================================
// MOBILE STORY
// =============================================================================

function MobileDemo() {
  const [incidents, setIncidents] = useState<Incident[]>(
    createSampleIncidents().filter((i) => i.status === 'draft').slice(0, 3)
  )
  const [actionLog, setActionLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setActionLog((prev) => [message, ...prev].slice(0, 5))
  }

  return (
    <div className="space-y-4">
      <IncidentManagementTableWithDialogs
        data={incidents}
        onSubmitSuccess={async (inc) => {
          await new Promise((r) => setTimeout(r, 800))
          setIncidents((prev) =>
            prev.map((i): Incident =>
              i.id === inc.id ? { ...i, status: 'reported', priority: i.severity } : i
            )
          )
          addLog(`✅ ${inc.incidentId} submitted`)
        }}
        onEditSuccess={async (_data, id) => {
          await new Promise((r) => setTimeout(r, 800))
          const inc = incidents.find((i) => i.id === id)
          addLog(`📝 ${inc?.incidentId} edited`)
        }}
        onDeleteSuccess={async (inc) => {
          await new Promise((r) => setTimeout(r, 800))
          setIncidents((prev) => prev.filter((i) => i.id !== inc.id))
          addLog(`🗑️ ${inc.incidentId} deleted`)
        }}
        locations={sampleLocations}
        hideLegend
        hideBulkActions
      />

      {/* Action log at bottom */}
      {actionLog.length > 0 && (
        <div className="p-3 bg-muted-bg rounded-lg">
          <p className="text-xs font-medium text-secondary mb-1">Recent Actions</p>
          <div className="space-y-0.5 text-xs text-primary">
            {actionLog.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <IPhoneMobileFrame scale={0.85}>
      <div className="p-4 bg-page min-h-full">
        <h1 className="text-lg font-semibold text-primary mb-4">Draft Incidents</h1>
        <MobileDemo />
      </div>
    </IPhoneMobileFrame>
  ),
}
