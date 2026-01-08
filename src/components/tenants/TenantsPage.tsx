"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  Eye,
  Pencil,
  PauseCircle,
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { formatCurrency } from "../../lib/format"

// Extracted modules
import { TENANT_FILTER_GROUPS } from "./constants/filter.constants"
import type { Tenant, TenantStatus, SubscriptionPackage, TenantsPageProps, TenantFormData } from "./types"
import { MOCK_TENANTS } from "./data/mock-tenants"

// UI components
import { Badge } from "../ui/badge"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../shared/SearchFilter/types"
import { DataTableStatusDot, type DotStatusMapping } from "../ui/table"
import { ActionTile } from "../ui/ActionTile"
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { PageActionPanel } from "../ui/PageActionPanel"

// Dialogs
import { ViewTenantDialog } from "./ViewTenantDialog"
import { EditTenantDialog } from "./EditTenantDialog"
import { SuspendTenantDialog } from "./SuspendTenantDialog"

// Re-export types for external consumers
export type { TenantStatus, SubscriptionPackage, Tenant, TenantsPageProps, TenantFormData }
export { MOCK_TENANTS }

// =============================================================================
// STATUS MAPPING
// =============================================================================

export const TENANT_DOT_STATUS_MAP: DotStatusMapping = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  overdue: { label: "Overdue", variant: "warning" },
}

// =============================================================================
// HELPERS
// =============================================================================

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

const getPackageVariant = (pkg: SubscriptionPackage) => {
  switch (pkg) {
    case "enterprise":
      return "default" as const
    case "professional":
      return "info" as const
    case "starter":
      return "secondary" as const
    default:
      return "secondary" as const
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * TenantsPage - A complete tenants management page
 *
 * Features:
 * - Header with title, subtitle
 * - Search input and status/package filters
 * - Data table with tenant information
 * - Action buttons for view, edit, and suspend
 * - Pagination
 */
export function TenantsPage({
  tenants = MOCK_TENANTS,
  onViewTenant,
  onEditTenant,
  onSuspendTenant,
  onActivateTenant,
  loading = false,
  className,
}: TenantsPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    subscriptionPackage: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // View Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  // Edit Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Suspend Dialog state
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [tenantToSuspend, setTenantToSuspend] = useState<Tenant | null>(null)
  const [isSuspending, setIsSuspending] = useState(false)

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter (if any selected)
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(tenant.status)

      // Package filter (if any selected)
      const matchesPackage =
        filters.subscriptionPackage.length === 0 ||
        filters.subscriptionPackage.includes(tenant.subscriptionPackage)

      return matchesSearch && matchesStatus && matchesPackage
    })
  }, [tenants, searchQuery, filters])

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTenants.slice(startIndex, startIndex + pageSize)
  }, [filteredTenants, currentPage, pageSize])

  // Handle filter changes
  const handleFiltersChange = React.useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Handle view tenant click
  const handleViewTenantClick = React.useCallback((tenant: Tenant) => {
    if (onViewTenant) {
      onViewTenant(tenant)
    } else {
      setSelectedTenant(tenant)
      setTimeout(() => setViewDialogOpen(true), 150)
    }
  }, [onViewTenant])

  // Handle edit tenant click
  const handleEditTenantClick = React.useCallback((tenant: Tenant) => {
    setTenantToEdit(tenant)
    setTimeout(() => setEditDialogOpen(true), 150)
  }, [])

  // Handle edit dialog submit
  const handleEditSubmit = React.useCallback(async (data: TenantFormData) => {
    setIsSubmitting(true)
    try {
      if (tenantToEdit && onEditTenant) {
        await onEditTenant(tenantToEdit, data)
      }
      setEditDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [tenantToEdit, onEditTenant])

  // Handle suspend tenant click
  const handleSuspendTenantClick = React.useCallback((tenant: Tenant) => {
    setTenantToSuspend(tenant)
    setTimeout(() => setSuspendDialogOpen(true), 150)
  }, [])

  // Handle suspend confirmation
  const handleSuspendConfirm = React.useCallback(async (tenant: Tenant) => {
    setIsSuspending(true)
    try {
      if (onSuspendTenant) {
        await onSuspendTenant(tenant)
      }
      setSuspendDialogOpen(false)
    } finally {
      setIsSuspending(false)
    }
  }, [onSuspendTenant])

  // Render tenant actions using ActionTile pattern (≤3 actions = visible buttons)
  const renderTenantActions = React.useCallback((tenant: Tenant) => (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="neutral"
            appearance="filled"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleViewTenantClick(tenant)
            }}
            aria-label="View tenant"
          >
            <Eye className="size-4" />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          View Tenant
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="info"
            appearance="filled"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleEditTenantClick(tenant)
            }}
            aria-label="Edit tenant"
          >
            <Pencil className="size-4" />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          Edit Tenant
        </TooltipContent>
      </Tooltip>
      {tenant.status === "active" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionTile
              variant="destructive"
              appearance="filled"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                handleSuspendTenantClick(tenant)
              }}
              aria-label="Suspend tenant"
            >
              <PauseCircle className="size-4" />
            </ActionTile>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            Suspend Tenant
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  ), [handleViewTenantClick, handleEditTenantClick, handleSuspendTenantClick])

  // Column definitions
  /* eslint-disable no-restricted-syntax */
  const columns: ColumnDef<Tenant>[] = [
    {
      id: "tenant",
      header: "Tenant",
      sortable: true,
      sortValue: (row) => row.companyName,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg">
            <Building2 className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">{row.companyName}</span>
            <span className="text-xs text-muted">{row.contactEmail}</span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => <DataTableStatusDot status={row.status} mapping={TENANT_DOT_STATUS_MAP} />,
    },
    {
      id: "package",
      header: "Package",
      sortable: true,
      sortValue: (row) => row.subscriptionPackage,
      accessor: (row) => (
        <Badge variant={getPackageVariant(row.subscriptionPackage)} className="capitalize">
          {row.subscriptionPackage}
        </Badge>
      ),
    },
    {
      id: "revenue",
      header: "Monthly Revenue",
      sortable: true,
      sortValue: (row) => row.monthlyRevenue,
      accessor: (row) => (
        <span className="text-sm font-medium text-primary">
          {formatCurrency(row.monthlyRevenue)}
        </span>
      ),
    },
    {
      id: "users",
      header: "Users",
      sortable: true,
      sortValue: (row) => row.userCount,
      accessor: (row) => (
        <span className="text-sm text-primary">{row.userCount}</span>
      ),
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
      header: "Actions",
      align: "right",
      width: "100px",
      sticky: "right",
      accessor: (row) => renderTenantActions(row),
    },
  ]
  /* eslint-enable no-restricted-syntax */

  return (
    <main
      data-slot="tenants-page"
      data-testid="tenants-page"
      className={cn("min-h-screen", className)}
    >
      {/* Content - no extra background, page background comes from shell */}
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Page Action Panel - replaces manual header */}
        <PageActionPanel
          icon={<Building2 className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Tenants"
          subtitle="Manage active customers and subscriptions"
        />

        {/* Glass container for main content */}
        <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Search and Filter Bar */}
            <SearchFilter
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              filterGroups={TENANT_FILTER_GROUPS}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="bg-surface border border-default rounded-lg"
              data-testid="tenants-search-filter"
            />

            {/* Data Table */}
            <DataTable
              data={paginatedTenants}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loading}
              hoverable
              bordered
              // Pagination embedded in table footer
              pagination
              currentPage={currentPage}
              totalItems={filteredTenants.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[10, 25, 50]}
              data-testid="tenants-table"
              emptyState={
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {searchQuery || filters.status.length > 0 || filters.subscriptionPackage.length > 0
                      ? "No tenants found"
                      : "No tenants yet"}
                  </h3>
                  <p className="text-muted text-sm max-w-sm text-center">
                    {searchQuery || filters.status.length > 0 || filters.subscriptionPackage.length > 0
                      ? "No tenants match your search criteria. Try adjusting your filters."
                      : "Tenants will appear here once they complete the onboarding process."}
                  </p>
                </div>
              }
            />
          </div>
        </section>
      </div>

      {/* View Tenant Dialog */}
      <ViewTenantDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        tenant={selectedTenant}
        onEdit={handleEditTenantClick}
        onSuspend={handleSuspendTenantClick}
        onActivate={onActivateTenant ? (t) => onActivateTenant(t) : undefined}
      />

      {/* Edit Tenant Dialog */}
      <EditTenantDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tenant={tenantToEdit}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Suspend Tenant Dialog */}
      <SuspendTenantDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        tenant={tenantToSuspend}
        onConfirm={handleSuspendConfirm}
        isSuspending={isSuspending}
      />
    </main>
  )
}

export default TenantsPage
