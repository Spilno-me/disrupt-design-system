/**
 * useLeadsDialogs - Manages dialog open states for leads page
 *
 * Handles:
 * - Create lead dialog state
 * - Edit lead dialog state
 * - Delete lead dialog state
 * - View lead navigation
 */

import { useState, useCallback } from 'react'
import type { Lead } from '../LeadCard'
import type { CreateLeadFormData } from '../CreateLeadDialog'

export interface UseLeadsDialogsOptions {
  /** Callback when a new lead is created */
  onCreateLead?: (data: CreateLeadFormData) => void | Promise<void>
  /** Callback when a lead is edited */
  onEditLead?: (leadId: string, data: CreateLeadFormData) => void | Promise<void>
  /** Callback when a lead is deleted */
  onDeleteLead?: (lead: Lead) => void | Promise<void>
}

export interface UseLeadsDialogsReturn {
  // Create dialog
  /** Create dialog open state */
  createDialogOpen: boolean
  /** Set create dialog open state */
  setCreateDialogOpen: (open: boolean) => void
  /** Whether create submission is in progress */
  isCreating: boolean
  /** Handle create lead form submission */
  handleCreateLead: (data: CreateLeadFormData) => Promise<void>

  // Edit dialog
  /** Edit dialog open state */
  editDialogOpen: boolean
  /** Set edit dialog open state */
  setEditDialogOpen: (open: boolean) => void
  /** Lead being edited */
  leadToEdit: Lead | null
  /** Whether edit submission is in progress */
  isEditing: boolean
  /** Open edit dialog with a specific lead */
  openEditDialog: (lead: Lead) => void
  /** Handle edit lead form submission */
  handleEditLead: (leadId: string, data: CreateLeadFormData) => Promise<void>

  // Delete dialog
  /** Delete dialog open state */
  deleteDialogOpen: boolean
  /** Set delete dialog open state */
  setDeleteDialogOpen: (open: boolean) => void
  /** Lead to be deleted */
  leadToDelete: Lead | null
  /** Whether delete is in progress */
  isDeleting: boolean
  /** Open delete dialog with a specific lead */
  openDeleteDialog: (lead: Lead) => void
  /** Handle delete confirmation */
  handleDeleteLead: (lead: Lead) => Promise<void>

  // View dialog
  /** View dialog open state */
  viewDialogOpen: boolean
  /** Set view dialog open state */
  setViewDialogOpen: (open: boolean) => void
  /** Lead being viewed */
  leadToView: Lead | null
  /** Open view dialog with a specific lead */
  openViewDialog: (lead: Lead) => void
}

export function useLeadsDialogs({
  onCreateLead,
  onEditLead,
  onDeleteLead,
}: UseLeadsDialogsOptions = {}): UseLeadsDialogsReturn {
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [leadToView, setLeadToView] = useState<Lead | null>(null)

  // Create handlers
  const handleCreateLead = useCallback(async (data: CreateLeadFormData) => {
    if (!onCreateLead) return
    setIsCreating(true)
    try {
      await onCreateLead(data)
      setCreateDialogOpen(false)
    } finally {
      setIsCreating(false)
    }
  }, [onCreateLead])

  // Edit handlers
  const openEditDialog = useCallback((lead: Lead) => {
    setLeadToEdit(lead)
    setEditDialogOpen(true)
  }, [])

  const handleEditLead = useCallback(async (leadId: string, data: CreateLeadFormData) => {
    if (!onEditLead) return
    setIsEditing(true)
    try {
      await onEditLead(leadId, data)
      setEditDialogOpen(false)
      setLeadToEdit(null)
    } finally {
      setIsEditing(false)
    }
  }, [onEditLead])

  // Delete handlers
  const openDeleteDialog = useCallback((lead: Lead) => {
    setLeadToDelete(lead)
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteLead = useCallback(async (lead: Lead) => {
    if (!onDeleteLead) return
    setIsDeleting(true)
    try {
      await onDeleteLead(lead)
      setDeleteDialogOpen(false)
      setLeadToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }, [onDeleteLead])

  // View handlers
  const openViewDialog = useCallback((lead: Lead) => {
    setLeadToView(lead)
    setViewDialogOpen(true)
  }, [])

  return {
    // Create
    createDialogOpen,
    setCreateDialogOpen,
    isCreating,
    handleCreateLead,

    // Edit
    editDialogOpen,
    setEditDialogOpen,
    leadToEdit,
    isEditing,
    openEditDialog,
    handleEditLead,

    // Delete
    deleteDialogOpen,
    setDeleteDialogOpen,
    leadToDelete,
    isDeleting,
    openDeleteDialog,
    handleDeleteLead,

    // View
    viewDialogOpen,
    setViewDialogOpen,
    leadToView,
    openViewDialog,
  }
}
