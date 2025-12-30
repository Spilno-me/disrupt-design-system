"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  Plus,
  Pencil,
  Users,
  Trash2,
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils"

// Extracted modules
import { PARTNER_FILTER_GROUPS } from "./constants"
import type { Partner, PartnerStatus, PartnerTier, PartnersPageProps } from "./types"
import { MOCK_PARTNERS } from "./data"
import { TierBadge, PartnerId } from "./components"
import { formatDate } from "./utils"

// UI components
import { Button } from "../ui/button"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { Pagination } from "../ui/Pagination"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../shared/SearchFilter/types"
import { EditPartnerDialog, PartnerFormData } from "./EditPartnerDialog"
import { DeletePartnerDialog } from "./DeletePartnerDialog"
import { DataTableStatusDot, DataTableActions, PARTNER_DOT_STATUS_MAP, type ActionItem } from "../ui/table"

// Re-export types for external consumers
export type { PartnerStatus, PartnerTier, Partner, PartnersPageProps }
export { MOCK_PARTNERS }

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PartnersPage - A complete partners management page
 *
 * Features:
 * - Header with title, subtitle, and Add Partner button
 * - Search input and status filter
 * - Data table with partner information
 * - Action buttons for view, manage users, and delete
 * - Pagination
 */
export function PartnersPage({
  partners = MOCK_PARTNERS,
  onAddPartner,
  onViewPartner,
  onEditPartner,
  onCreatePartner,
  onManageUsers,
  onDeletePartner,
  onConfirmDelete,
  loading = false,
  className,
}: PartnersPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    tier: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Edit/Create Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter partners based on search and filters
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.partnerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter (if any selected)
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(partner.status)

      // Tier filter (if any selected)
      const matchesTier =
        filters.tier.length === 0 || filters.tier.includes(partner.tier)

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [partners, searchQuery, filters])

  // Paginated partners
  const paginatedPartners = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredPartners.slice(startIndex, startIndex + pageSize)
  }, [filteredPartners, currentPage, pageSize])

  // Handle filter changes
  const handleFiltersChange = React.useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Handle view/edit partner click
  const handleViewPartnerClick = React.useCallback((partner: Partner) => {
    if (onViewPartner) {
      onViewPartner(partner)
    } else {
      setSelectedPartner(partner)
      setDialogMode("edit")
      setTimeout(() => setEditDialogOpen(true), 150)
    }
  }, [onViewPartner])

  // Handle add partner click
  const handleAddPartnerClick = React.useCallback(() => {
    if (onAddPartner) {
      onAddPartner()
    } else {
      setSelectedPartner(null)
      setDialogMode("create")
      setEditDialogOpen(true)
    }
  }, [onAddPartner])

  // Handle dialog submit
  const handleDialogSubmit = React.useCallback(async (data: PartnerFormData) => {
    setIsSubmitting(true)
    try {
      if (dialogMode === "edit" && selectedPartner && onEditPartner) {
        await onEditPartner(selectedPartner, data)
      } else if (dialogMode === "create" && onCreatePartner) {
        await onCreatePartner(data)
      }
      setEditDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [dialogMode, selectedPartner, onEditPartner, onCreatePartner])

  // Handle delete partner click
  const handleDeletePartnerClick = React.useCallback((partner: Partner) => {
    if (onDeletePartner) {
      onDeletePartner(partner)
    } else {
      setPartnerToDelete(partner)
      setTimeout(() => setDeleteDialogOpen(true), 150)
    }
  }, [onDeletePartner])

  // Handle delete confirmation
  const handleDeleteConfirm = React.useCallback(async (partner: Partner) => {
    setIsDeleting(true)
    try {
      if (onConfirmDelete) {
        await onConfirmDelete(partner)
      }
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }, [onConfirmDelete])

  // Define partner actions using unified system
  const partnerActions: ActionItem<Partner>[] = [
    {
      id: 'edit',
      label: 'Edit Partner',
      icon: Pencil,
      onClick: (row) => handleViewPartnerClick(row),
    },
    {
      id: 'manage-users',
      label: 'Manage Users',
      icon: Users,
      onClick: (row) => onManageUsers?.(row),
    },
    {
      id: 'delete',
      label: 'Delete Partner',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row) => handleDeletePartnerClick(row),
    },
  ]

  // Column definitions
  /* eslint-disable no-restricted-syntax */
  const columns: ColumnDef<Partner>[] = [
    {
      id: "partner",
      header: "Partner",
      sortable: true,
      sortValue: (row) => row.name,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg">
            <Building2 className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">{row.name}</span>
            <PartnerId id={row.partnerId} />
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      sortable: true,
      sortValue: (row) => row.contactName,
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-primary">{row.contactName}</span>
          <span className="text-xs text-muted">{row.contactEmail}</span>
        </div>
      ),
    },
    {
      id: "tier",
      header: "Tier",
      sortable: true,
      sortValue: (row) => row.tier,
      accessor: (row) => <TierBadge tier={row.tier} />,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => <DataTableStatusDot status={row.status} mapping={PARTNER_DOT_STATUS_MAP} />,
    },
    {
      id: "created",
      header: "Created",
      sortable: true,
      sortValue: (row) => row.createdAt,
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      align: "right",
      width: "50px",
      sticky: "right",
      accessor: (row) => (
        <DataTableActions
          actions={partnerActions}
          row={row}
          maxVisible={0}
          align="right"
        />
      ),
    },
  ]
  /* eslint-enable no-restricted-syntax */

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Partners</h1>
          <p className="text-muted mt-1">
            Manage partner organizations and relationships
          </p>
        </div>
        <Button
          variant="accent"
          onClick={handleAddPartnerClick}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilter
        placeholder="Search partners..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value)
          setCurrentPage(1)
        }}
        filterGroups={PARTNER_FILTER_GROUPS}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Data Table */}
      <DataTable
        data={paginatedPartners}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        hoverable
        bordered
        emptyState={
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchQuery || filters.status.length > 0 || filters.tier.length > 0
                ? "No partners found"
                : "No partners yet"}
            </h3>
            <p className="text-muted text-sm max-w-sm text-center">
              {searchQuery || filters.status.length > 0 || filters.tier.length > 0
                ? "No partners match your search criteria. Try adjusting your filters."
                : "Get started by adding your first partner organization."}
            </p>
          </div>
        }
      />

      {/* Pagination */}
      {filteredPartners.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredPartners.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          showPageSizeSelector={false}
          showFirstLastButtons={false}
          resultsTextFormat={(start, end, total) =>
            `Showing ${start} to ${end} of ${total} results`
          }
        />
      )}

      {/* Edit/Create Partner Dialog */}
      <EditPartnerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        partner={selectedPartner}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        mode={dialogMode}
      />

      {/* Delete Partner Dialog */}
      <DeletePartnerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        partner={partnerToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default PartnersPage
