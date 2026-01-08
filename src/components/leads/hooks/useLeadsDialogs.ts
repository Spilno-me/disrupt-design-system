/**
 * useLeadsDialogs - Manages dialog open states for leads page
 *
 * Handles:
 * - Create lead dialog state
 * - Creating/submitting state
 */

import { useState, useCallback } from 'react'
import type { CreateLeadFormData } from '../CreateLeadDialog'

export interface UseLeadsDialogsOptions {
  /** Callback when a new lead is created */
  onCreateLead?: (data: CreateLeadFormData) => void | Promise<void>
}

export interface UseLeadsDialogsReturn {
  /** Create dialog open state */
  createDialogOpen: boolean
  /** Set create dialog open state */
  setCreateDialogOpen: (open: boolean) => void
  /** Whether create submission is in progress */
  isCreating: boolean
  /** Handle create lead form submission */
  handleCreateLead: (data: CreateLeadFormData) => Promise<void>
}

export function useLeadsDialogs({
  onCreateLead,
}: UseLeadsDialogsOptions = {}): UseLeadsDialogsReturn {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

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

  return {
    createDialogOpen,
    setCreateDialogOpen,
    isCreating,
    handleCreateLead,
  }
}
