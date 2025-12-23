/**
 * EditIncidentFlow - Convenience wrapper for editing existing incidents
 *
 * @component MOLECULE
 *
 * @description
 * A wrapper around IncidentReportingFlow preconfigured for edit mode.
 * Transforms table incident data into form format and displays the
 * wizard with edit-specific messaging.
 *
 * Use this when the user clicks "Edit" on an incident in the table.
 * It handles the data transformation from table format to form format.
 *
 * @example
 * ```tsx
 * <EditIncidentFlow
 *   open={editOpen}
 *   onOpenChange={setEditOpen}
 *   incident={incidentToEdit}
 *   onSave={handleSaveIncident}
 *   locations={locationOptions}
 * />
 * ```
 */

import * as React from 'react'
import { IncidentReportingFlow } from './IncidentReportingFlow'
import type { IncidentFormData, LocationOption, IncidentCategory, SeverityLevel } from './types'
import type { IncidentSeverity } from '../ui/table/IncidentStatusBadge'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentToEdit {
  /** Unique identifier */
  id: string
  /** Display ID (e.g., INC-000001) */
  incidentId: string
  /** Incident title */
  title: string
  /** Location where incident occurred */
  location: string
  /** Location code if available */
  locationCode?: string
  /** Person who reported the incident */
  reporter: string
  /** Severity level */
  severity: IncidentSeverity
  /** Category of incident */
  category?: string
  /** Description of the incident */
  description?: string
  /** Immediate actions taken */
  immediateActions?: string
  /** Date and time of incident */
  dateTime?: string
  /** Whether injury was involved */
  injuryInvolved?: boolean
  /** Whether medical attention was required */
  medicalAttention?: boolean
  /** List of witnesses */
  witnesses?: string[]
  /** Additional notes */
  additionalNotes?: string
}

export interface EditIncidentFlowProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Incident to edit */
  incident: IncidentToEdit | null
  /** Callback when save is confirmed */
  onSave: (data: IncidentFormData, incidentId: string) => void | Promise<void>
  /** Available locations for the location picker */
  locations?: LocationOption[]
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Transforms table incident data into form data format
 */
function transformToFormData(incident: IncidentToEdit): Partial<IncidentFormData> {
  return {
    title: incident.title,
    category: (incident.category as IncidentCategory) || '',
    severity: (incident.severity as SeverityLevel) || '',
    location: incident.location,
    locationCode: incident.locationCode || '',
    description: incident.description || '',
    immediateActions: incident.immediateActions || '',
    dateTime: incident.dateTime || new Date().toISOString().slice(0, 16),
    injuryInvolved: incident.injuryInvolved ?? false,
    medicalAttention: incident.medicalAttention ?? false,
    witnesses: incident.witnesses || [],
    additionalNotes: incident.additionalNotes || '',
    photos: [], // Photos can't be restored - user would need to re-upload
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditIncidentFlow({
  open,
  onOpenChange,
  incident,
  onSave,
  locations = [],
}: EditIncidentFlowProps) {
  const handleSubmit = async (data: IncidentFormData) => {
    if (incident) {
      await onSave(data, incident.id)
    }
  }

  // Don't render if no incident
  if (!incident) return null

  const initialData = transformToFormData(incident)

  return (
    <IncidentReportingFlow
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      initialData={initialData}
      locations={locations}
      title="Edit Incident"
      description={`Editing draft ${incident.incidentId}. Make changes and save.`}
    />
  )
}

EditIncidentFlow.displayName = 'EditIncidentFlow'

export default EditIncidentFlow
