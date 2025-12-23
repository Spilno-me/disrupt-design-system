/**
 * IncidentManagementTableWithDialogs - Complete incident table with integrated action dialogs
 *
 * @component ORGANISM
 *
 * @description
 * A "batteries included" wrapper around IncidentManagementTable that integrates
 * all action dialogs (Submit, Edit, Delete) with proper state management.
 *
 * Use this component when you want a complete incident management experience
 * without manually wiring up dialog state. For custom dialog handling, use
 * the base IncidentManagementTable component instead.
 *
 * @example
 * ```tsx
 * <IncidentManagementTableWithDialogs
 *   data={incidents}
 *   onSubmitSuccess={(incident) => {
 *     toast.success(`${incident.incidentId} submitted`)
 *     refetch()
 *   }}
 *   onEditSuccess={(data, incidentId) => {
 *     toast.success('Changes saved')
 *     refetch()
 *   }}
 *   onDeleteSuccess={(incident) => {
 *     toast.success('Draft deleted')
 *     refetch()
 *   }}
 *   locations={locationOptions}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import {
  IncidentManagementTable,
  type IncidentManagementTableProps,
  type Incident,
} from '../ui/table/IncidentManagementTable'
import { DeleteIncidentDialog, type IncidentToDelete } from './DeleteIncidentDialog'
import { SubmitIncidentDialog, type IncidentToSubmit } from './SubmitIncidentDialog'
import { EditIncidentFlow, type IncidentToEdit } from './EditIncidentFlow'
import type { IncidentFormData, LocationOption } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentManagementTableWithDialogsProps
  extends Omit<IncidentManagementTableProps, 'onSubmit' | 'onEdit' | 'onDelete'> {
  /**
   * Callback when an incident is successfully submitted.
   * Called after the user confirms in the dialog.
   */
  onSubmitSuccess?: (incident: IncidentToSubmit) => void | Promise<void>

  /**
   * Callback when an incident is successfully edited.
   * Called after the user saves changes in the wizard.
   */
  onEditSuccess?: (data: IncidentFormData, incidentId: string) => void | Promise<void>

  /**
   * Callback when an incident is successfully deleted.
   * Called after the user confirms deletion in the dialog.
   */
  onDeleteSuccess?: (incident: IncidentToDelete) => void | Promise<void>

  /**
   * Available locations for the edit flow location picker.
   */
  locations?: LocationOption[]

  /**
   * Optional callback to transform table incident data to submit dialog format.
   * Useful when your incident data has additional fields not in the base type.
   */
  transformToSubmit?: (incident: Incident) => IncidentToSubmit

  /**
   * Optional callback to transform table incident data to edit dialog format.
   * Useful when you need to fetch additional data before editing.
   */
  transformToEdit?: (incident: Incident) => IncidentToEdit | Promise<IncidentToEdit>

  /**
   * Optional callback to transform table incident data to delete dialog format.
   */
  transformToDelete?: (incident: Incident) => IncidentToDelete
}

// =============================================================================
// DEFAULT TRANSFORMS
// =============================================================================

const defaultTransformToSubmit = (incident: Incident): IncidentToSubmit => ({
  id: incident.id,
  incidentId: incident.incidentId,
  title: incident.title,
  location: incident.location,
  reporter: incident.reporter,
  severity: incident.severity,
})

const defaultTransformToDelete = (incident: Incident): IncidentToDelete => ({
  id: incident.id,
  incidentId: incident.incidentId,
  title: incident.title,
  location: incident.location,
  reporter: incident.reporter,
  severity: incident.severity,
  ageDays: incident.ageDays,
})

const defaultTransformToEdit = (incident: Incident): IncidentToEdit => ({
  id: incident.id,
  incidentId: incident.incidentId,
  title: incident.title,
  location: incident.location,
  reporter: incident.reporter,
  severity: incident.severity,
})

// =============================================================================
// COMPONENT
// =============================================================================

export function IncidentManagementTableWithDialogs({
  data,
  onSubmitSuccess,
  onEditSuccess,
  onDeleteSuccess,
  locations = [],
  transformToSubmit = defaultTransformToSubmit,
  transformToEdit = defaultTransformToEdit,
  transformToDelete = defaultTransformToDelete,
  ...tableProps
}: IncidentManagementTableWithDialogsProps) {
  // Dialog state
  const [submitDialog, setSubmitDialog] = useState<{
    open: boolean
    incident: IncidentToSubmit | null
    isSubmitting: boolean
  }>({ open: false, incident: null, isSubmitting: false })

  const [editDialog, setEditDialog] = useState<{
    open: boolean
    incident: IncidentToEdit | null
  }>({ open: false, incident: null })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    incident: IncidentToDelete | null
    isDeleting: boolean
  }>({ open: false, incident: null, isDeleting: false })

  // Find incident by ID helper
  const findIncidentById = useCallback(
    (id: string) => data.find((inc) => inc.id === id),
    [data]
  )

  // Handle submit action from table
  const handleSubmitClick = useCallback(
    (id: string) => {
      const incident = findIncidentById(id)
      if (incident) {
        setSubmitDialog({
          open: true,
          incident: transformToSubmit(incident),
          isSubmitting: false,
        })
      }
    },
    [findIncidentById, transformToSubmit]
  )

  // Handle edit action from table
  const handleEditClick = useCallback(
    async (id: string) => {
      const incident = findIncidentById(id)
      if (incident) {
        const editData = await Promise.resolve(transformToEdit(incident))
        setEditDialog({
          open: true,
          incident: editData,
        })
      }
    },
    [findIncidentById, transformToEdit]
  )

  // Handle delete action from table
  const handleDeleteClick = useCallback(
    (id: string) => {
      const incident = findIncidentById(id)
      if (incident) {
        setDeleteDialog({
          open: true,
          incident: transformToDelete(incident),
          isDeleting: false,
        })
      }
    },
    [findIncidentById, transformToDelete]
  )

  // Handle submit confirmation
  const handleSubmitConfirm = useCallback(
    async (incident: IncidentToSubmit) => {
      setSubmitDialog((prev) => ({ ...prev, isSubmitting: true }))
      try {
        await onSubmitSuccess?.(incident)
        setSubmitDialog({ open: false, incident: null, isSubmitting: false })
      } catch (error) {
        setSubmitDialog((prev) => ({ ...prev, isSubmitting: false }))
        throw error
      }
    },
    [onSubmitSuccess]
  )

  // Handle edit save
  const handleEditSave = useCallback(
    async (formData: IncidentFormData, incidentId: string) => {
      await onEditSuccess?.(formData, incidentId)
      setEditDialog({ open: false, incident: null })
    },
    [onEditSuccess]
  )

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(
    async (incident: IncidentToDelete) => {
      setDeleteDialog((prev) => ({ ...prev, isDeleting: true }))
      try {
        await onDeleteSuccess?.(incident)
        setDeleteDialog({ open: false, incident: null, isDeleting: false })
      } catch (error) {
        setDeleteDialog((prev) => ({ ...prev, isDeleting: false }))
        throw error
      }
    },
    [onDeleteSuccess]
  )

  return (
    <>
      {/* Main Table */}
      <IncidentManagementTable
        data={data}
        onSubmit={handleSubmitClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        {...tableProps}
      />

      {/* Submit Confirmation Dialog */}
      <SubmitIncidentDialog
        open={submitDialog.open}
        onOpenChange={(open) =>
          setSubmitDialog((prev) => ({ ...prev, open, incident: open ? prev.incident : null }))
        }
        incident={submitDialog.incident}
        onConfirm={handleSubmitConfirm}
        isSubmitting={submitDialog.isSubmitting}
      />

      {/* Edit Flow (Sheet/Wizard) */}
      <EditIncidentFlow
        open={editDialog.open}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, open, incident: open ? prev.incident : null }))
        }
        incident={editDialog.incident}
        onSave={handleEditSave}
        locations={locations}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteIncidentDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open, incident: open ? prev.incident : null }))
        }
        incident={deleteDialog.incident}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteDialog.isDeleting}
      />
    </>
  )
}

IncidentManagementTableWithDialogs.displayName = 'IncidentManagementTableWithDialogs'

export default IncidentManagementTableWithDialogs
