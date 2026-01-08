/**
 * usePartnersPageHandlers - All event handlers for PartnersPage
 *
 * Consolidates 10+ useCallback handlers into a single custom hook.
 */

import { useCallback } from 'react'
import type { Partner } from '../types'
import type { FilterState } from '../../shared/SearchFilter/types'
import type { PartnerFormData } from '../EditPartnerDialog'
import { DIALOG_OPEN_DELAY_MS, INITIAL_PAGE } from '../constants'
import type { PartnersPageState, PartnersTab, DialogMode } from './usePartnersPageState'

export interface PartnersPageCallbacks {
  onAddPartner?: () => void
  onViewPartner?: (partner: Partner) => void
  onEditPartner?: (partner: Partner, data: PartnerFormData) => void | Promise<void>
  onCreatePartner?: (data: PartnerFormData) => void | Promise<void>
  onDeletePartner?: (partner: Partner) => void
  onConfirmDelete?: (partner: Partner) => void | Promise<void>
  onTabChange?: (tab: PartnersTab) => void
}

export interface PartnersPageHandlers {
  handleTabChange: (value: string) => void
  handleFiltersChange: (filters: FilterState) => void
  handleSearchChange: (value: string) => void
  handlePageSizeChange: (size: number) => void
  handleViewPartnerClick: (partner: Partner) => void
  handleAddPartnerClick: () => void
  handleDialogSubmit: (data: PartnerFormData) => Promise<void>
  handleDeletePartnerClick: (partner: Partner) => void
  handleDeleteConfirm: (partner: Partner) => Promise<void>
}

export function usePartnersPageHandlers(
  state: PartnersPageState,
  callbacks: PartnersPageCallbacks
): PartnersPageHandlers {
  const {
    setInternalTab, setFilters, setSearchQuery, setCurrentPage, setPageSize,
    setSelectedPartner, setDialogMode, setEditDialogOpen, setIsSubmitting,
    setPartnerToDelete, setDeleteDialogOpen, setIsDeleting,
    dialogMode, selectedPartner,
  } = state

  const {
    onTabChange, onAddPartner, onViewPartner, onEditPartner, onCreatePartner,
    onDeletePartner, onConfirmDelete,
  } = callbacks

  const handleTabChange = useCallback((value: string) => {
    const tab = value as PartnersTab
    setInternalTab(tab)
    onTabChange?.(tab)
  }, [setInternalTab, onTabChange])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(INITIAL_PAGE)
  }, [setFilters, setCurrentPage])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(INITIAL_PAGE)
  }, [setSearchQuery, setCurrentPage])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(INITIAL_PAGE)
  }, [setPageSize, setCurrentPage])

  const handleViewPartnerClick = useCallback((partner: Partner) => {
    if (onViewPartner) {
      onViewPartner(partner)
    } else {
      setSelectedPartner(partner)
      setDialogMode('edit')
      setTimeout(() => setEditDialogOpen(true), DIALOG_OPEN_DELAY_MS)
    }
  }, [onViewPartner, setSelectedPartner, setDialogMode, setEditDialogOpen])

  const handleAddPartnerClick = useCallback(() => {
    if (onAddPartner) {
      onAddPartner()
    } else {
      setSelectedPartner(null)
      setDialogMode('create')
      setEditDialogOpen(true)
    }
  }, [onAddPartner, setSelectedPartner, setDialogMode, setEditDialogOpen])

  const handleDialogSubmit = useCallback(async (data: PartnerFormData) => {
    setIsSubmitting(true)
    try {
      if (dialogMode === 'edit' && selectedPartner && onEditPartner) {
        await onEditPartner(selectedPartner, data)
      } else if (dialogMode === 'create' && onCreatePartner) {
        await onCreatePartner(data)
      }
      setEditDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [dialogMode, selectedPartner, onEditPartner, onCreatePartner, setIsSubmitting, setEditDialogOpen])

  const handleDeletePartnerClick = useCallback((partner: Partner) => {
    if (onDeletePartner) {
      onDeletePartner(partner)
    } else {
      setPartnerToDelete(partner)
      setTimeout(() => setDeleteDialogOpen(true), DIALOG_OPEN_DELAY_MS)
    }
  }, [onDeletePartner, setPartnerToDelete, setDeleteDialogOpen])

  const handleDeleteConfirm = useCallback(async (partner: Partner) => {
    setIsDeleting(true)
    try {
      if (onConfirmDelete) {
        await onConfirmDelete(partner)
      }
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }, [onConfirmDelete, setIsDeleting, setDeleteDialogOpen])

  return {
    handleTabChange,
    handleFiltersChange,
    handleSearchChange,
    handlePageSizeChange,
    handleViewPartnerClick,
    handleAddPartnerClick,
    handleDialogSubmit,
    handleDeletePartnerClick,
    handleDeleteConfirm,
  }
}
