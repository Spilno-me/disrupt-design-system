import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DeleteIncidentDialog, type IncidentToDelete } from './DeleteIncidentDialog'
import { SubmitIncidentDialog, type IncidentToSubmit } from './SubmitIncidentDialog'
import { EditIncidentFlow, type IncidentToEdit } from './EditIncidentFlow'
import { ActionTile } from '../ui/ActionTile'
import { Rocket, Pencil, Trash2 } from 'lucide-react'
import { MOLECULE_META, moleculeDescription, StorySection, StoryFlex } from '@/stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Flow/Incidents/Action Dialogs',
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Confirmation dialogs for incident management actions: Submit, Edit, and Delete. These dialogs are triggered from the IncidentManagementTable action buttons.'),
      },
    },
  },
}

export default meta

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleIncidentForDelete: IncidentToDelete = {
  id: 'inc-001',
  incidentId: 'INC-000042',
  title: 'Slip and fall in warehouse section B',
  location: 'Warehouse B - Loading Dock',
  reporter: 'John Smith',
  severity: 'medium',
  ageDays: 3,
}

const criticalIncidentForDelete: IncidentToDelete = {
  id: 'inc-002',
  incidentId: 'INC-000099',
  title: 'Chemical spill near ventilation system',
  location: 'Manufacturing Floor 2',
  reporter: 'Sarah Johnson',
  severity: 'critical',
  ageDays: 0,
}

const sampleIncidentForSubmit: IncidentToSubmit = {
  id: 'inc-003',
  incidentId: 'INC-000043',
  title: 'Near miss - forklift proximity incident',
  location: 'Distribution Center A',
  reporter: 'Mike Davis',
  severity: 'high',
  category: 'near_miss',
}

const lowSeverityIncident: IncidentToSubmit = {
  id: 'inc-004',
  incidentId: 'INC-000044',
  title: 'Minor equipment malfunction - resolved',
  location: 'Office Building 1',
  reporter: 'Emily Brown',
  severity: 'low',
  category: 'equipment',
}

const sampleIncidentForEdit: IncidentToEdit = {
  id: 'inc-005',
  incidentId: 'INC-000045',
  title: 'Ergonomic hazard at workstation 7',
  location: 'Office Building 2',
  locationCode: 'OFF-B2-W7',
  reporter: 'Alex Chen',
  severity: 'low',
  category: 'injury',
  description: 'Reported repetitive strain from improper desk setup.',
  immediateActions: 'Workstation flagged for ergonomic assessment.',
  dateTime: '2024-01-15T10:30',
  injuryInvolved: false,
  medicalAttention: false,
  witnesses: ['Tom Wilson'],
  additionalNotes: 'Employee has requested ergonomic equipment.',
}

const sampleLocations = [
  { value: 'warehouse-a', label: 'Warehouse A', group: 'Distribution' },
  { value: 'warehouse-b', label: 'Warehouse B', group: 'Distribution' },
  { value: 'office-1', label: 'Office Building 1', group: 'Corporate' },
  { value: 'office-2', label: 'Office Building 2', group: 'Corporate' },
  { value: 'mfg-1', label: 'Manufacturing Floor 1', group: 'Production' },
  { value: 'mfg-2', label: 'Manufacturing Floor 2', group: 'Production' },
]

// =============================================================================
// DELETE INCIDENT DIALOG STORIES
// =============================================================================

function DeleteIncidentDemo({ incident }: { incident: IncidentToDelete }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeleting(false)
    setDeleted(true)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono text-xs text-secondary mb-1">{incident.incidentId}</p>
            <h3 className="font-semibold text-primary">{incident.title}</h3>
            <p className="text-sm text-secondary">{incident.location}</p>
          </div>
          <ActionTile
            variant="destructive"
            appearance="filled"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={deleted}
            aria-label="Delete incident"
          >
            <Trash2 className="size-4" />
          </ActionTile>
        </div>
      </div>

      <DeleteIncidentDialog
        open={open}
        onOpenChange={setOpen}
        incident={incident}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {deleted && (
        <div className="p-4 bg-error-light border border-error rounded-lg max-w-md">
          <h4 className="font-semibold text-error mb-2">Draft Deleted</h4>
          <p className="text-sm text-primary">
            {incident.incidentId} has been permanently removed.
          </p>
        </div>
      )}
    </div>
  )
}

export const DeleteDialog: StoryObj = {
  render: () => <DeleteIncidentDemo incident={sampleIncidentForDelete} />,
}

export const DeleteDialogCritical: StoryObj = {
  render: () => <DeleteIncidentDemo incident={criticalIncidentForDelete} />,
}

export const DeleteDialogOpen: StoryObj = {
  render: () => (
    <DeleteIncidentDialog
      open={true}
      onOpenChange={() => {}}
      incident={sampleIncidentForDelete}
      onConfirm={() => {}}
    />
  ),
}

export const DeleteDialogDeleting: StoryObj = {
  render: () => (
    <DeleteIncidentDialog
      open={true}
      onOpenChange={() => {}}
      incident={sampleIncidentForDelete}
      onConfirm={() => {}}
      isDeleting={true}
    />
  ),
}

// =============================================================================
// SUBMIT INCIDENT DIALOG STORIES
// =============================================================================

function SubmitIncidentDemo({ incident }: { incident: IncidentToSubmit }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono text-xs text-secondary mb-1">{incident.incidentId}</p>
            <h3 className="font-semibold text-primary">{incident.title}</h3>
            <p className="text-sm text-secondary">{incident.location}</p>
          </div>
          <ActionTile
            variant="success"
            appearance="filled"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={submitted}
            aria-label="Submit incident"
          >
            <Rocket className="size-4" />
          </ActionTile>
        </div>
      </div>

      <SubmitIncidentDialog
        open={open}
        onOpenChange={setOpen}
        incident={incident}
        onConfirm={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {submitted && (
        <div className="p-4 bg-success-light border border-success rounded-lg max-w-md">
          <h4 className="font-semibold text-success mb-2">Incident Submitted</h4>
          <p className="text-sm text-primary">
            {incident.incidentId} is now active and assigned for investigation.
          </p>
        </div>
      )}
    </div>
  )
}

export const SubmitDialog: StoryObj = {
  render: () => <SubmitIncidentDemo incident={sampleIncidentForSubmit} />,
}

export const SubmitDialogLowSeverity: StoryObj = {
  render: () => <SubmitIncidentDemo incident={lowSeverityIncident} />,
}

export const SubmitDialogOpen: StoryObj = {
  render: () => (
    <SubmitIncidentDialog
      open={true}
      onOpenChange={() => {}}
      incident={sampleIncidentForSubmit}
      onConfirm={() => {}}
    />
  ),
}

export const SubmitDialogSubmitting: StoryObj = {
  render: () => (
    <SubmitIncidentDialog
      open={true}
      onOpenChange={() => {}}
      incident={sampleIncidentForSubmit}
      onConfirm={() => {}}
      isSubmitting={true}
    />
  ),
}

// =============================================================================
// EDIT INCIDENT FLOW STORIES
// =============================================================================

function EditIncidentDemo({ incident }: { incident: IncidentToEdit }) {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaved(true)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono text-xs text-secondary mb-1">{incident.incidentId}</p>
            <h3 className="font-semibold text-primary">{incident.title}</h3>
            <p className="text-sm text-secondary">{incident.location}</p>
          </div>
          <ActionTile
            variant="info"
            appearance="filled"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="Edit incident"
          >
            <Pencil className="size-4" />
          </ActionTile>
        </div>
      </div>

      <EditIncidentFlow
        open={open}
        onOpenChange={setOpen}
        incident={incident}
        onSave={handleSave}
        locations={sampleLocations}
      />

      {saved && (
        <div className="p-4 bg-info-light border border-info rounded-lg max-w-md">
          <h4 className="font-semibold text-info mb-2">Changes Saved</h4>
          <p className="text-sm text-primary">
            {incident.incidentId} has been updated successfully.
          </p>
        </div>
      )}
    </div>
  )
}

export const EditFlow: StoryObj = {
  render: () => <EditIncidentDemo incident={sampleIncidentForEdit} />,
}

// =============================================================================
// ALL ACTIONS TOGETHER
// =============================================================================

function AllActionsDemo() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const incident = {
    id: 'inc-demo',
    incidentId: 'INC-000100',
    title: 'Demo incident - all actions available',
    location: 'Warehouse A',
    locationCode: 'WH-A',
    reporter: 'Demo User',
    severity: 'medium' as const,
    category: 'near_miss',
    ageDays: 2,
  }

  return (
    <StorySection title="All Incident Actions" description="Draft incidents have all three actions available">
      <StoryFlex>
        <div className="p-6 bg-surface border border-default rounded-lg min-w-[500px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-xs text-secondary mb-1">{incident.incidentId}</p>
              <h3 className="font-semibold text-primary">{incident.title}</h3>
              <p className="text-sm text-secondary">{incident.location} • Reported by {incident.reporter}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-default">
            <ActionTile
              variant="success"
              appearance="filled"
              size="sm"
              onClick={() => setSubmitOpen(true)}
              aria-label="Submit incident"
            >
              <Rocket className="size-4" />
            </ActionTile>
            <ActionTile
              variant="info"
              appearance="filled"
              size="sm"
              onClick={() => setEditOpen(true)}
              aria-label="Edit incident"
            >
              <Pencil className="size-4" />
            </ActionTile>
            <ActionTile
              variant="destructive"
              appearance="filled"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete incident"
            >
              <Trash2 className="size-4" />
            </ActionTile>
            <span className="ml-2 text-sm text-secondary">Click any action to open its dialog</span>
          </div>
        </div>
      </StoryFlex>

      <SubmitIncidentDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        incident={incident}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 1000))
          setSubmitOpen(false)
        }}
      />

      <EditIncidentFlow
        open={editOpen}
        onOpenChange={setEditOpen}
        incident={incident}
        onSave={async () => {
          await new Promise((r) => setTimeout(r, 1000))
          setEditOpen(false)
        }}
        locations={sampleLocations}
      />

      <DeleteIncidentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        incident={incident}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 1000))
          setDeleteOpen(false)
        }}
      />
    </StorySection>
  )
}

export const AllActions: StoryObj = {
  render: () => <AllActionsDemo />,
}

// =============================================================================
// TABLE INTEGRATION EXAMPLE
// =============================================================================

function TableIntegrationDemo() {
  const [incidents, setIncidents] = useState([
    { ...sampleIncidentForDelete, status: 'draft' as const },
    { ...criticalIncidentForDelete, status: 'draft' as const },
    { ...sampleIncidentForSubmit, status: 'draft' as const, ageDays: 1 },
  ])
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; incident: IncidentToDelete | null }>({
    open: false,
    incident: null,
  })
  const [submitDialog, setSubmitDialog] = useState<{ open: boolean; incident: IncidentToSubmit | null }>({
    open: false,
    incident: null,
  })

  return (
    <StorySection title="Table Integration" description="How the dialogs integrate with the incident table">
      <div className="border border-default rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted-bg">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-primary">ID</th>
              <th className="text-left p-3 text-sm font-semibold text-primary">Title</th>
              <th className="text-left p-3 text-sm font-semibold text-primary">Location</th>
              <th className="text-right p-3 text-sm font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default">
            {incidents.map((incident) => (
              <tr key={incident.id} className="bg-surface">
                <td className="p-3 font-mono text-xs text-secondary">{incident.incidentId}</td>
                <td className="p-3 text-sm text-primary">{incident.title}</td>
                <td className="p-3 text-sm text-secondary">{incident.location}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionTile
                      variant="success"
                      appearance="filled"
                      size="xs"
                      onClick={() => setSubmitDialog({ open: true, incident })}
                      aria-label="Submit incident"
                    >
                      <Rocket className="size-4" />
                    </ActionTile>
                    <ActionTile
                      variant="destructive"
                      appearance="filled"
                      size="xs"
                      onClick={() => setDeleteDialog({ open: true, incident })}
                      aria-label="Delete incident"
                    >
                      <Trash2 className="size-4" />
                    </ActionTile>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubmitIncidentDialog
        open={submitDialog.open}
        onOpenChange={(open) => setSubmitDialog({ ...submitDialog, open })}
        incident={submitDialog.incident}
        onConfirm={async (inc) => {
          await new Promise((r) => setTimeout(r, 1000))
          setIncidents((prev) => prev.filter((i) => i.id !== inc.id))
          setSubmitDialog({ open: false, incident: null })
        }}
      />

      <DeleteIncidentDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        incident={deleteDialog.incident}
        onConfirm={async (inc) => {
          await new Promise((r) => setTimeout(r, 1000))
          setIncidents((prev) => prev.filter((i) => i.id !== inc.id))
          setDeleteDialog({ open: false, incident: null })
        }}
      />
    </StorySection>
  )
}

export const TableIntegration: StoryObj = {
  render: () => <TableIntegrationDemo />,
}
