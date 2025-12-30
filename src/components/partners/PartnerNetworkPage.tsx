"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import {
  Plus,
  ChevronsDownUp,
  ChevronsUpDown,
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils"

// Extracted modules
import { PARTNER_NETWORK_FILTER_GROUPS } from "./constants"
import type {
  NetworkPartner,
  NetworkPartnerStatus,
  NetworkPartnerMetrics,
  PartnerNetworkPageProps,
} from "./types"
import { MOCK_NETWORK_PARTNERS } from "./data"
import { PartnerRowWrapper } from "./components"
import { usePartnerFiltering, usePartnerCount, usePartnerExpansion } from "./hooks"

// UI components
import { Button } from "../ui/button"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../shared/SearchFilter/types"
import { EditNetworkPartnerDialog, NetworkPartnerFormData } from "./EditNetworkPartnerDialog"
import { DeleteNetworkPartnerDialog } from "./DeleteNetworkPartnerDialog"
import { CreateSubPartnerDialog, SubPartnerFormData } from "./CreateSubPartnerDialog"

// Re-export types for external consumers
export type { NetworkPartnerStatus, NetworkPartnerMetrics, NetworkPartner, PartnerNetworkPageProps }
export { MOCK_NETWORK_PARTNERS }

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PartnerNetworkPage({
  partners = MOCK_NETWORK_PARTNERS,
  loading = false,
  onAddPartner,
  onEditPartner,
  onViewPartner: _onViewPartner,
  onAddSubPartner,
  onDeletePartner,
  className,
}: PartnerNetworkPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<FilterState>({ status: [], type: [] })

  // Use extracted hooks
  const { expandedIds, allExpanded, expandAll, collapseAll, toggleExpand } = usePartnerExpansion(partners)
  const filteredPartners = usePartnerFiltering({ partners, searchQuery, filters: statusFilters })
  const totalPartnerCount = usePartnerCount(partners)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subPartnerDialogOpen, setSubPartnerDialogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<NetworkPartner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog handlers
  const handleAddPartnerClick = useCallback(() => {
    setSelectedPartner(null)
    setCreateDialogOpen(true)
    onAddPartner?.()
  }, [onAddPartner])

  const handleEditPartnerClick = useCallback((partner: NetworkPartner) => {
    setSelectedPartner(partner)
    setEditDialogOpen(true)
    onEditPartner?.(partner)
  }, [onEditPartner])

  const handleDeletePartnerClick = useCallback((partner: NetworkPartner) => {
    setSelectedPartner(partner)
    setDeleteDialogOpen(true)
  }, [])

  const handleAddSubPartnerClick = useCallback((parent: NetworkPartner) => {
    setSelectedPartner(parent)
    setSubPartnerDialogOpen(true)
    onAddSubPartner?.(parent)
  }, [onAddSubPartner])

  const handleCreateSubmit = useCallback(async (data: NetworkPartnerFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Create partner:', data)
    setIsSubmitting(false)
    setCreateDialogOpen(false)
  }, [])

  const handleEditSubmit = useCallback(async (data: NetworkPartnerFormData, partner?: NetworkPartner) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Update partner:', partner?.id, data)
    setIsSubmitting(false)
    setEditDialogOpen(false)
  }, [])

  const handleDeleteConfirm = useCallback(async (partner: NetworkPartner) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Delete partner:', partner.id)
    onDeletePartner?.(partner)
    setIsSubmitting(false)
    setDeleteDialogOpen(false)
  }, [onDeletePartner])

  const handleSubPartnerSubmit = useCallback(async (data: SubPartnerFormData, parent: NetworkPartner) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Create sub-partner under:', parent.id, data)
    setIsSubmitting(false)
    setSubPartnerDialogOpen(false)
  }, [])

  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Partner Hierarchy</h1>
          <p className="text-muted mt-1 max-w-2xl">
            Manage your partner network structure and relationships. Sub-partners are
            nested under their parent companies with visual indicators.
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

      {/* Search Bar */}
      <div>
        <SearchFilter
          placeholder="Search partners..."
          value={searchQuery}
          onChange={setSearchQuery}
          filterGroups={PARTNER_NETWORK_FILTER_GROUPS}
          filters={statusFilters}
          onFiltersChange={setStatusFilters}
        />
      </div>

      {/* Partner Table */}
      <div className="rounded-lg border border-default bg-surface overflow-hidden">
        {/* Table Toolbar - Count + Expand/Collapse */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted-bg/30 border-b border-default">
          <span className="text-sm text-muted font-medium">
            {totalPartnerCount} partner{totalPartnerCount !== 1 ? "s" : ""} in network
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAll}
              disabled={allExpanded}
              className="h-7 px-2 text-xs"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              disabled={!allExpanded && expandedIds.size === 0}
              className="h-7 px-2 text-xs"
            >
              <ChevronsDownUp className="h-3.5 w-3.5" />
              Collapse
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-muted-bg/50 border-b border-default text-sm font-medium text-muted">
          <div className="w-6 flex-shrink-0" /> {/* Expand button space */}
          <div className="w-9 flex-shrink-0" /> {/* Icon space */}
          <div className="flex-1">Partner</div>
          <div className="w-12 flex-shrink-0 text-center">Status</div>
          <div className="w-36 flex-shrink-0 text-right">Monthly Revenue</div>
          <div className="w-20 flex-shrink-0 text-right">Actions</div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal" />
              <span className="text-sm text-muted">Loading partners...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPartners.length === 0 && (
          <div className="flex flex-col items-center py-12 px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchQuery ? "No partners found" : "No partners yet"}
            </h3>
            <p className="text-muted text-sm max-w-sm text-center mb-4">
              {searchQuery
                ? "No partners match your search criteria. Try adjusting your search."
                : "Get started by adding your first partner to the network."}
            </p>
            {!searchQuery && (
              <Button variant="accent" onClick={handleAddPartnerClick}>
                <Plus className="h-4 w-4" />
                Add Partner
              </Button>
            )}
          </div>
        )}

        {/* Partner rows */}
        {!loading && filteredPartners.length > 0 && (
          <div className="[&>.group:last-child>div:first-child]:border-b-0">
            {filteredPartners.map((partner) => (
              <PartnerRowWrapper
                key={partner.id}
                partner={partner}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
                onEdit={handleEditPartnerClick}
                onAddSubPartner={handleAddSubPartnerClick}
                onDelete={handleDeletePartnerClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EditNetworkPartnerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        partner={null}
        mode="create"
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      <EditNetworkPartnerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        partner={selectedPartner}
        mode="edit"
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteNetworkPartnerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        partner={selectedPartner}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
      />

      <CreateSubPartnerDialog
        open={subPartnerDialogOpen}
        onOpenChange={setSubPartnerDialogOpen}
        parentPartner={selectedPartner}
        onSubmit={handleSubPartnerSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default PartnerNetworkPage
