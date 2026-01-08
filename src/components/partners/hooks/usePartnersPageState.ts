/**
 * usePartnersPageState - Manages all state for PartnersPage
 *
 * Consolidates 12+ useState calls into a single custom hook.
 */

import { useState } from 'react'
import type { Partner } from '../types'
import type { FilterState } from '../../shared/SearchFilter/types'
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '../constants'

export type PartnersTab = 'partners' | 'sub-partners'
export type DialogMode = 'edit' | 'create'

export interface PartnersPageState {
  // Tab state
  internalTab: PartnersTab
  setInternalTab: (tab: PartnersTab) => void
  // Search & filter
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: FilterState
  setFilters: (filters: FilterState) => void
  // Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  // Edit dialog
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  selectedPartner: Partner | null
  setSelectedPartner: (partner: Partner | null) => void
  dialogMode: DialogMode
  setDialogMode: (mode: DialogMode) => void
  isSubmitting: boolean
  setIsSubmitting: (submitting: boolean) => void
  // Delete dialog
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  partnerToDelete: Partner | null
  setPartnerToDelete: (partner: Partner | null) => void
  isDeleting: boolean
  setIsDeleting: (deleting: boolean) => void
}

export function usePartnersPageState(): PartnersPageState {
  // Tab state
  const [internalTab, setInternalTab] = useState<PartnersTab>('partners')

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({ status: [], tier: [] })

  // Pagination
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Edit/Create dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [dialogMode, setDialogMode] = useState<DialogMode>('edit')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  return {
    internalTab, setInternalTab,
    searchQuery, setSearchQuery,
    filters, setFilters,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    editDialogOpen, setEditDialogOpen,
    selectedPartner, setSelectedPartner,
    dialogMode, setDialogMode,
    isSubmitting, setIsSubmitting,
    deleteDialogOpen, setDeleteDialogOpen,
    partnerToDelete, setPartnerToDelete,
    isDeleting, setIsDeleting,
  }
}
