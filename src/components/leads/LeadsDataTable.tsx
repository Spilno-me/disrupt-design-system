"use client"

import * as React from "react"
import { useMemo } from "react"
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
} from "lucide-react"
import { DataTable, ColumnDef, SortDirection, RowPriority } from "../ui/DataTable"
import { SeverityIndicator, SeverityLevel } from "../ui/SeverityIndicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { StatusBadge, LEAD_STATUS_CONFIG, EmailLink, ScoreBadge } from "../ui/table"

// =============================================================================
// TYPES
// =============================================================================

export interface LeadsDataTableProps {
  /** Array of leads to display */
  leads: Lead[]
  /** Whether rows are selectable with checkboxes */
  selectable?: boolean
  /** Selected lead IDs */
  selectedLeads?: Set<string>
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void
  /** Callback when a lead is clicked */
  onLeadClick?: (lead: Lead) => void
  /** Callback when an action is clicked */
  onActionClick?: (lead: Lead, action: LeadAction) => void
  /** Current sort column */
  sortColumn?: string | null
  /** Current sort direction */
  sortDirection?: SortDirection
  /** Callback when sort changes */
  onSortChange?: (column: string, direction: SortDirection) => void
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/** Avatar with initials fallback */
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    )
  }

  return (
    <div className="w-8 h-8 rounded-full bg-accent-strong text-inverse flex items-center justify-center font-semibold text-xs flex-shrink-0">
      {initials}
    </div>
  )
}

/** Name cell with avatar */
function NameCell({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={lead.name} avatarUrl={lead.avatarUrl} />
      <span className="font-medium text-primary truncate">{lead.name}</span>
    </div>
  )
}

/** Company cell */
function CompanyCell({ company }: { company: string }) {
  return (
    <div className="flex items-center gap-1.5 text-primary">
      <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
      <span className="truncate">{company}</span>
    </div>
  )
}

/** Map LeadPriority to SeverityLevel */
function mapPriorityToSeverity(priority: LeadPriority): SeverityLevel {
  const mapping: Record<LeadPriority, SeverityLevel> = {
    high: 'high',
    medium: 'medium',
    low: 'low',
  }
  return mapping[priority]
}

/** Map LeadPriority to RowPriority for table border colors */
function mapLeadPriorityToRowPriority(priority: LeadPriority): RowPriority {
  const mapping: Record<LeadPriority, RowPriority> = {
    high: 'high',
    medium: 'medium',
    low: 'low',
  }
  return mapping[priority]
}

/** Source label */
function SourceLabel({ source }: { source: LeadSource }) {
  const sourceLabels: Record<LeadSource, string> = {
    website: "Website",
    referral: "Referral",
    cold_outreach: "Cold Outreach",
    partner: "Partner",
    other: "Other",
  }

  return (
    <span className="text-primary text-sm">
      {sourceLabels[source]}
    </span>
  )
}

/** Format currency */
function formatCurrency(value: number): string {
  if (value === 0) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Actions cell with dropdown */
function ActionsCell({
  lead: _lead,
  onAction,
}: {
  lead: Lead
  onAction?: (action: LeadAction) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onAction?.("view")
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onAction?.("edit")
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Lead
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onAction?.("delete")
          }}
          className="text-error focus:text-error"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// LEADS DATA TABLE COMPONENT
// =============================================================================

/**
 * LeadsDataTable - A data table specialized for displaying leads
 *
 * Features:
 * - All standard DataTable features (sorting, selection, etc.)
 * - Lead-specific columns with proper formatting
 * - Priority, Score, and Status badges
 * - Actions dropdown per row
 *
 * @example
 * ```tsx
 * <LeadsDataTable
 *   leads={leadsData}
 *   selectedLeads={selectedIds}
 *   onSelectionChange={setSelectedIds}
 *   onLeadClick={(lead) => router.push(`/leads/${lead.id}`)}
 *   onActionClick={(lead, action) => handleAction(lead, action)}
 * />
 * ```
 */
export function LeadsDataTable({
  leads,
  selectable = false,
  selectedLeads = new Set(),
  onSelectionChange,
  onLeadClick,
  onActionClick,
  sortColumn,
  sortDirection,
  onSortChange,
  loading = false,
  className,
}: LeadsDataTableProps) {
  /* eslint-disable no-restricted-syntax -- minWidth/width values are CSS column widths, not spacing */
  // Define columns
  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessor: (row) => <NameCell lead={row} />,
        sortable: true,
        sortValue: (row) => row.name.toLowerCase(),
        minWidth: "200px",
      },
      {
        id: "company",
        header: "Company",
        accessor: (row) => <CompanyCell company={row.company} />,
        sortable: true,
        sortValue: (row) => row.company.toLowerCase(),
        minWidth: "150px",
      },
      {
        id: "email",
        header: "Email",
        accessor: (row) => <EmailLink email={row.email} />,
        sortable: true,
        sortValue: (row) => row.email.toLowerCase(),
        minWidth: "180px",
      },
      {
        id: "phone",
        header: "Phone",
        accessor: (row) => (
          <span className="text-primary">{row.phone || "-"}</span>
        ),
        minWidth: "130px",
      },
      {
        id: "priority",
        header: "Priority",
        accessor: (row) => (
          <SeverityIndicator level={mapPriorityToSeverity(row.priority)} size="sm" />
        ),
        sortable: true,
        sortValue: (row) => {
          const order = { high: 3, medium: 2, low: 1 }
          return order[row.priority]
        },
        minWidth: "60px",
        align: "center",
      },
      {
        id: "score",
        header: "Score",
        accessor: (row) => <ScoreBadge score={row.score} />,
        sortable: true,
        sortValue: (row) => row.score,
        minWidth: "70px",
        align: "center",
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => <StatusBadge status={row.status} statusConfig={LEAD_STATUS_CONFIG} />,
        sortable: true,
        sortValue: (row) => row.status,
        minWidth: "100px",
      },
      {
        id: "source",
        header: "Source",
        accessor: (row) => <SourceLabel source={row.source} />,
        sortable: true,
        sortValue: (row) => row.source,
        minWidth: "100px",
      },
      {
        id: "value",
        header: "Deal Value",
        accessor: (row) => (
          <span className="font-medium text-primary">
            {formatCurrency(row.value ?? 0)}
          </span>
        ),
        sortable: true,
        sortValue: (row) => row.value ?? 0,
        minWidth: "100px",
        align: "right",
      },
      {
        id: "actions",
        header: "",
        accessor: (row) => (
          <ActionsCell
            lead={row}
            onAction={(action) => onActionClick?.(row, action)}
          />
        ),
        width: "50px",
        align: "center",
      },
    ],
    [onActionClick]
  )
  /* eslint-enable no-restricted-syntax */

  // Empty state
  const emptyState = (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
        <Building2 className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">No leads found</h3>
      <p className="text-sm text-muted max-w-sm text-center">
        No leads match your current filters. Try adjusting your search or add new leads.
      </p>
    </div>
  )

  return (
    <DataTable
      data={leads}
      columns={columns}
      getRowId={(row) => row.id}
      selectable={selectable}
      selectedRows={selectedLeads}
      onSelectionChange={onSelectionChange}
      onRowClick={onLeadClick}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      loading={loading}
      loadingRows={10}
      emptyState={emptyState}
      stickyHeader
      hoverable
      bordered
      className={className}
      getRowPriority={(row) => mapLeadPriorityToRowPriority(row.priority)}
    />
  )
}

export default LeadsDataTable
