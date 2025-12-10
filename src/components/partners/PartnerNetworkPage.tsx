"use client"

import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  UserPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  TrendingUp,
  
  
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

// =============================================================================
// TYPES
// =============================================================================

export type NetworkPartnerStatus = "active" | "inactive" | "pending"

export interface NetworkPartnerMetrics {
  totalLeads: number
  conversion: number | null // percentage, null if N/A
  commission: number | null // dollar amount, null if N/A
  totalRevenue: number
}

export interface NetworkPartner {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  status: NetworkPartnerStatus
  monthlyRevenue: number
  metrics: NetworkPartnerMetrics
  isMasterPartner: boolean
  subPartners?: NetworkPartner[]
  parentId?: string
}

export interface PartnerNetworkPageProps {
  /** Partner hierarchy data */
  partners?: NetworkPartner[]
  /** Loading state */
  loading?: boolean
  /** Callback when Add Partner is clicked */
  onAddPartner?: () => void
  /** Callback when a partner is edited */
  onEditPartner?: (partner: NetworkPartner) => void
  /** Callback when a partner is viewed */
  onViewPartner?: (partner: NetworkPartner) => void
  /** Callback when Add Sub-Partner is clicked */
  onAddSubPartner?: (parentPartner: NetworkPartner) => void
  /** Callback when a partner is deleted */
  onDeletePartner?: (partner: NetworkPartner) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

export const MOCK_NETWORK_PARTNERS: NetworkPartner[] = [
  {
    id: "1",
    companyName: "Drax Industries",
    contactName: "James Smith",
    contactEmail: "james@draxindustries.com.au",
    status: "active",
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 24,
      conversion: 15.5,
      commission: null,
      totalRevenue: 45000,
    },
    subPartners: [
      {
        id: "1-1",
        companyName: "Drax Sub-Partner A",
        contactName: "Emily Drake",
        contactEmail: "emily@draxsuba.com",
        status: "active",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "1",
        metrics: {
          totalLeads: 8,
          conversion: 12.5,
          commission: 2500,
          totalRevenue: 15000,
        },
      },
      {
        id: "1-2",
        companyName: "Drax Sub-Partner B",
        contactName: "Mike Chen",
        contactEmail: "mike@draxsubb.com",
        status: "pending",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "1",
        metrics: {
          totalLeads: 3,
          conversion: null,
          commission: null,
          totalRevenue: 0,
        },
      },
    ],
  },
  {
    id: "2",
    companyName: "WWE",
    contactName: "John Cena",
    contactEmail: "cena@wwe.com",
    status: "active",
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 42,
      conversion: 22.0,
      commission: null,
      totalRevenue: 125000,
    },
    subPartners: [
      {
        id: "2-1",
        companyName: "WWE Merchandise Partners",
        contactName: "Sarah Lynch",
        contactEmail: "sarah@wwemerchandise.com",
        status: "active",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "2",
        metrics: {
          totalLeads: 15,
          conversion: 18.0,
          commission: 8500,
          totalRevenue: 42000,
        },
      },
    ],
  },
  {
    id: "3",
    companyName: "QuadroCorp",
    contactName: "Master Johnson",
    contactEmail: "mdjokovich@foider.com",
    status: "active",
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 18,
      conversion: 11.0,
      commission: null,
      totalRevenue: 32000,
    },
  },
  {
    id: "4",
    companyName: "Syncra Group",
    contactName: "Arianna Howard",
    contactEmail: "ahoward@syncragroup.com",
    status: "active",
    monthlyRevenue: 0,
    isMasterPartner: true,
    metrics: {
      totalLeads: 31,
      conversion: 19.5,
      commission: null,
      totalRevenue: 78000,
    },
    subPartners: [
      {
        id: "4-1",
        companyName: "Syncra West",
        contactName: "Tom Wilson",
        contactEmail: "tom@syncrawest.com",
        status: "active",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "4",
        metrics: {
          totalLeads: 12,
          conversion: 16.5,
          commission: 4200,
          totalRevenue: 28000,
        },
      },
      {
        id: "4-2",
        companyName: "Syncra East",
        contactName: "Lisa Park",
        contactEmail: "lisa@syncraeast.com",
        status: "active",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "4",
        metrics: {
          totalLeads: 9,
          conversion: 14.0,
          commission: 3100,
          totalRevenue: 22000,
        },
      },
      {
        id: "4-3",
        companyName: "Syncra Central",
        contactName: "David Kim",
        contactEmail: "david@syncracentral.com",
        status: "inactive",
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: "4",
        metrics: {
          totalLeads: 0,
          conversion: null,
          commission: null,
          totalRevenue: 0,
        },
      },
    ],
  },
  {
    id: "5",
    companyName: "FosoComp",
    contactName: "Foso Name",
    contactEmail: "foso@top.com",
    status: "active",
    monthlyRevenue: 0,
    isMasterPartner: false,
    metrics: {
      totalLeads: 7,
      conversion: 8.5,
      commission: 1200,
      totalRevenue: 12000,
    },
  },
]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: NetworkPartnerStatus }) {
  const config: Record<NetworkPartnerStatus, { label: string; className: string }> = {
    active: { label: "active", className: "bg-success-light text-success" },
    inactive: { label: "inactive", className: "bg-muted-bg text-primary" },
    pending: { label: "pending", className: "bg-warning-light text-warning" },
  }

  const { label, className } = config[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  )
}

function MetricBadge({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string | number
  variant?: "default" | "blue" | "green" | "purple"
}) {
  const colorClasses = {
    default: "text-primary",
    blue: "text-info",
    green: "text-success",
    purple: "text-secondary",
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted">{label}</span>
      <span className={cn("text-sm font-semibold", colorClasses[variant])}>
        {value}
      </span>
    </div>
  )
}

function PartnerMetricsRow({ metrics }: { metrics: NetworkPartnerMetrics }) {
  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-muted-bg/50 border-t border-default">
      <MetricBadge
        label="Total Leads"
        value={metrics.totalLeads}
        variant="blue"
      />
      <MetricBadge
        label="Conversion"
        value={metrics.conversion !== null ? `${metrics.conversion}%` : "N/A"}
        variant="green"
      />
      <MetricBadge
        label="Commission"
        value={metrics.commission !== null ? `$${metrics.commission.toLocaleString()}` : "N/A"}
        variant="purple"
      />
      <MetricBadge
        label="Total Revenue"
        value={`$${metrics.totalRevenue.toLocaleString()}`}
        variant="default"
      />
    </div>
  )
}

// =============================================================================
// PARTNER ROW COMPONENT
// =============================================================================

interface PartnerRowProps {
  partner: NetworkPartner
  depth?: number
  isExpanded?: boolean
  onToggleExpand?: () => void
  onView?: (partner: NetworkPartner) => void
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
}

function PartnerRow({
  partner,
  depth = 0,
  isExpanded = false,
  onToggleExpand,
  onView,
  onEdit,
  onAddSubPartner,
  onDelete,
}: PartnerRowProps) {
  const [showMetrics, setShowMetrics] = useState(false)
  const hasSubPartners = partner.subPartners && partner.subPartners.length > 0
  const indentPadding = depth * 32

  return (
    <div className="group">
      {/* Main row */}
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-3 border-b border-default",
          "transition-colors hover:bg-accent-bg/30",
          depth > 0 && "bg-muted-bg/20"
        )}
        style={{ paddingLeft: `${16 + indentPadding}px` }}
      >
        {/* Expand/collapse button or spacer */}
        <div className="w-6 flex-shrink-0">
          {hasSubPartners ? (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded hover:bg-accent-bg transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Company icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-info-light flex-shrink-0">
          <FileText className="h-4 w-4 text-info" />
        </div>

        {/* Company info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary truncate">
              {partner.companyName}
            </span>
            {partner.isMasterPartner && (
              <span className="text-xs text-accent bg-accent-bg px-1.5 py-0.5 rounded">
                Master
              </span>
            )}
          </div>
          <div className="text-sm text-muted truncate">
            {partner.contactName} &bull; {partner.contactEmail}
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <StatusBadge status={partner.status} />
        </div>

        {/* Monthly Revenue */}
        <div className="w-28 flex-shrink-0 text-right">
          <span className="text-sm text-primary font-medium">
            ${partner.monthlyRevenue.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setShowMetrics(!showMetrics)
              onView?.(partner)
            }}
            aria-label="View details"
          >
            <Eye className="h-4 w-4 text-muted" />
          </Button>

          {partner.isMasterPartner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddSubPartner?.(partner)}
              aria-label="Add sub-partner"
            >
              <UserPlus className="h-4 w-4 text-muted" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(partner)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Partner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowMetrics(!showMetrics)}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {showMetrics ? "Hide Metrics" : "Show Metrics"}
              </DropdownMenuItem>
              {partner.isMasterPartner && (
                <DropdownMenuItem onClick={() => onAddSubPartner?.(partner)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Sub-Partner
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(partner)}
                className="text-error focus:text-error focus:bg-error-light"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Partner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metrics row (collapsible) */}
      {showMetrics && (
        <div style={{ paddingLeft: `${indentPadding}px` }}>
          <PartnerMetricsRow metrics={partner.metrics} />
        </div>
      )}

      {/* Sub-partners (nested) */}
      {isExpanded && partner.subPartners?.map((subPartner) => (
        <PartnerRowWrapper
          key={subPartner.id}
          partner={subPartner}
          depth={depth + 1}
          onView={onView}
          onEdit={onEdit}
          onAddSubPartner={onAddSubPartner}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// Wrapper to manage individual expand state
function PartnerRowWrapper({
  partner,
  depth = 0,
  onView,
  onEdit,
  onAddSubPartner,
  onDelete,
  defaultExpanded = false,
}: {
  partner: NetworkPartner
  depth?: number
  onView?: (partner: NetworkPartner) => void
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <PartnerRow
      partner={partner}
      depth={depth}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
      onView={onView}
      onEdit={onEdit}
      onAddSubPartner={onAddSubPartner}
      onDelete={onDelete}
    />
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PartnerNetworkPage({
  partners = MOCK_NETWORK_PARTNERS,
  loading = false,
  onAddPartner,
  onEditPartner,
  onViewPartner,
  onAddSubPartner,
  onDeletePartner,
  className,
}: PartnerNetworkPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allExpanded, setAllExpanded] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Filter partners based on search
  const filteredPartners = useMemo(() => {
    if (!searchQuery) return partners

    const query = searchQuery.toLowerCase()

    const filterPartner = (partner: NetworkPartner): NetworkPartner | null => {
      const matchesSearch =
        partner.companyName.toLowerCase().includes(query) ||
        partner.contactName.toLowerCase().includes(query) ||
        partner.contactEmail.toLowerCase().includes(query)

      // Check sub-partners
      const filteredSubPartners = partner.subPartners
        ?.map(filterPartner)
        .filter((p): p is NetworkPartner => p !== null)

      // Include if partner matches or has matching sub-partners
      if (matchesSearch || (filteredSubPartners && filteredSubPartners.length > 0)) {
        return {
          ...partner,
          subPartners: filteredSubPartners,
        }
      }

      return null
    }

    return partners.map(filterPartner).filter((p): p is NetworkPartner => p !== null)
  }, [partners, searchQuery])

  // Expand/Collapse all
  const handleExpandAll = useCallback(() => {
    const getAllIds = (partners: NetworkPartner[]): string[] => {
      return partners.flatMap((p) => [
        p.id,
        ...(p.subPartners ? getAllIds(p.subPartners) : []),
      ])
    }
    setExpandedIds(new Set(getAllIds(partners)))
    setAllExpanded(true)
  }, [partners])

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set())
    setAllExpanded(false)
  }, [])

  // Count total partners including sub-partners
  const totalPartnerCount = useMemo(() => {
    const countPartners = (partners: NetworkPartner[]): number => {
      return partners.reduce((acc, p) => {
        return acc + 1 + (p.subPartners ? countPartners(p.subPartners) : 0)
      }, 0)
    }
    return countPartners(partners)
  }, [partners])

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
          onClick={onAddPartner}
          className="self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            disabled={allExpanded}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCollapseAll}
            disabled={!allExpanded && expandedIds.size === 0}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Partners count */}
      <div className="text-sm text-muted">
        {totalPartnerCount} partner{totalPartnerCount !== 1 ? "s" : ""} in network
      </div>

      {/* Partner Table */}
      <div className="rounded-lg border border-default bg-surface overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-muted-bg/50 border-b border-default text-sm font-medium text-muted">
          <div className="w-6 flex-shrink-0" /> {/* Expand button space */}
          <div className="w-9 flex-shrink-0" /> {/* Icon space */}
          <div className="flex-1">Partner</div>
          <div className="w-20 flex-shrink-0">Status</div>
          <div className="w-28 flex-shrink-0 text-right">Monthly Revenue</div>
          <div className="w-28 flex-shrink-0 text-right">Actions</div>
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
              <Button variant="accent" onClick={onAddPartner}>
                <Plus className="h-4 w-4" />
                Add Partner
              </Button>
            )}
          </div>
        )}

        {/* Partner rows */}
        {!loading && filteredPartners.length > 0 && (
          <div>
            {filteredPartners.map((partner) => (
              <PartnerRowWrapper
                key={partner.id}
                partner={partner}
                defaultExpanded={allExpanded}
                onView={onViewPartner}
                onEdit={onEditPartner}
                onAddSubPartner={onAddSubPartner}
                onDelete={onDeletePartner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerNetworkPage
