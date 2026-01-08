import { useState, useMemo, useCallback } from 'react'
import type { FilterState } from '../../shared/SearchFilter/types'
import type { SortDirection } from '../../ui/DataTable'
import type { Invoice, InvoiceAction } from './types'
import type { EditInvoiceFormData } from './EditInvoiceDialog'
import { filterInvoices, sortInvoices, paginateItems } from './invoices.utils'

// =============================================================================
// TYPES
// =============================================================================

export interface UseInvoicesStateOptions {
  invoices: Invoice[]
  defaultPageSize?: number
  onInvoiceClick?: (invoice: Invoice) => void
  onInvoiceAction?: (invoice: Invoice, action: InvoiceAction) => void
  onUpdateInvoice?: (invoice: Invoice, data: EditInvoiceFormData) => void | Promise<void>
}

export interface InvoicesDialogState {
  previewSheetOpen: boolean
  pdfDialogOpen: boolean
  editDialogOpen: boolean
  selectedInvoice: Invoice | null
  isUpdating: boolean
}

export interface InvoicesFilterState {
  searchValue: string
  filters: FilterState
}

export interface InvoicesPaginationState {
  currentPage: number
  pageSize: number
}

export interface InvoicesSortState {
  sortColumn: string | null
  sortDirection: SortDirection
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * useInvoicesState - Manages all state for the InvoicesPage component
 *
 * Extracts dialog, filter, sort, pagination, and selection state management
 * into a single cohesive hook with clear separation of concerns.
 */
export function useInvoicesState({
  invoices,
  defaultPageSize = 10,
  onInvoiceClick,
  onInvoiceAction,
  onUpdateInvoice,
}: UseInvoicesStateOptions) {
  // -------------------------------------------------------------------------
  // Dialog/Sheet State
  // -------------------------------------------------------------------------
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // -------------------------------------------------------------------------
  // Filter State
  // -------------------------------------------------------------------------
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    terms: [],
  })

  // -------------------------------------------------------------------------
  // Selection State
  // -------------------------------------------------------------------------
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())

  // -------------------------------------------------------------------------
  // Sort State
  // -------------------------------------------------------------------------
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // -------------------------------------------------------------------------
  // Pagination State
  // -------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // -------------------------------------------------------------------------
  // Derived Data
  // -------------------------------------------------------------------------
  const filteredInvoices = useMemo(
    () => filterInvoices(invoices, searchValue, filters),
    [invoices, searchValue, filters]
  )

  const sortedInvoices = useMemo(
    () => sortInvoices(filteredInvoices, sortColumn, sortDirection),
    [filteredInvoices, sortColumn, sortDirection]
  )

  const paginatedInvoices = useMemo(
    () => paginateItems(sortedInvoices, currentPage, pageSize),
    [sortedInvoices, currentPage, pageSize]
  )

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((column: string, direction: SortDirection) => {
    setSortColumn(direction ? column : null)
    setSortDirection(direction)
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleCardClick = useCallback(
    (invoice: Invoice) => {
      setSelectedInvoice(invoice)
      setPreviewSheetOpen(true)
      onInvoiceClick?.(invoice)
    },
    [onInvoiceClick]
  )

  const handleUpdateInvoice = useCallback(
    async (data: EditInvoiceFormData) => {
      if (!selectedInvoice || !onUpdateInvoice) return
      setIsUpdating(true)
      try {
        await onUpdateInvoice(selectedInvoice, data)
        setEditDialogOpen(false)
      } finally {
        setIsUpdating(false)
      }
    },
    [selectedInvoice, onUpdateInvoice]
  )

  const handleInvoiceAction = useCallback(
    (invoice: Invoice, action: InvoiceAction) => {
      setSelectedInvoice(invoice)

      switch (action) {
        case 'copy':
          navigator.clipboard.writeText(invoice.invoiceNumber)
          break
        case 'preview':
          setPreviewSheetOpen(true)
          break
        case 'download':
          if (invoice.pdfUrl) window.open(invoice.pdfUrl, '_blank')
          break
        case 'edit':
          if (invoice.status === 'draft') setEditDialogOpen(true)
          break
        case 'mark_sent':
        case 'delete':
          onInvoiceAction?.(invoice, action)
          break
      }

      onInvoiceAction?.(invoice, action)
    },
    [onInvoiceAction]
  )

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------
  return {
    // Dialog state
    dialogState: {
      previewSheetOpen,
      pdfDialogOpen,
      editDialogOpen,
      selectedInvoice,
      isUpdating,
      setPreviewSheetOpen,
      setPdfDialogOpen,
      setEditDialogOpen,
    },

    // Filter state
    filterState: {
      searchValue,
      filters,
      handleSearchChange,
      handleFiltersChange,
    },

    // Selection state
    selectionState: {
      selectedInvoices,
      setSelectedInvoices,
    },

    // Sort state
    sortState: {
      sortColumn,
      sortDirection,
      handleSortChange,
    },

    // Pagination state
    paginationState: {
      currentPage,
      pageSize,
      setCurrentPage,
      handlePageSizeChange,
    },

    // Derived data
    data: {
      filteredInvoices,
      sortedInvoices,
      paginatedInvoices,
    },

    // Handlers
    handlers: {
      handleCardClick,
      handleInvoiceAction,
      handleUpdateInvoice,
    },
  }
}
