"use client"

import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  UserPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  TrendingUp,
  Building2,
} from "lucide-react"
import { cn } from "../../lib/utils"

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

// Easing curves as tuples for TypeScript compatibility
const easeOut = [0.4, 0, 0.2, 1] as const
const easeIn = [0.4, 0, 1, 1] as const

const slideDownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 12,
    marginBottom: 0,
    transition: {
      height: { duration: 0.25, ease: easeOut },
      opacity: { duration: 0.2, delay: 0.05 },
      marginTop: { duration: 0.25, ease: easeOut },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      height: { duration: 0.2, ease: easeIn },
      opacity: { duration: 0.15 },
      marginTop: { duration: 0.2 },
    },
  },
}

const expandedContentVariants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: easeOut },
      opacity: { duration: 0.25, delay: 0.05 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: easeIn },
      opacity: { duration: 0.15 },
    },
  },
}
import { Button } from "../ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterGroup, FilterState } from "../shared/SearchFilter/types"
import { EditNetworkPartnerDialog, NetworkPartnerFormData } from "./EditNetworkPartnerDialog"
import { DeleteNetworkPartnerDialog } from "./DeleteNetworkPartnerDialog"
import { CreateSubPartnerDialog, SubPartnerFormData } from "./CreateSubPartnerDialog"

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

function StatusIndicator({ status }: { status: NetworkPartnerStatus }) {
  const config: Record<NetworkPartnerStatus, { label: string; dotClass: string }> = {
    active: { label: "Active", dotClass: "bg-success" },
    inactive: { label: "Inactive", dotClass: "bg-muted" },
    pending: { label: "Pending", dotClass: "bg-warning" },
  }

  const { label, dotClass } = config[status]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-block w-2.5 h-2.5 rounded-full cursor-help",
            dotClass
          )}
          aria-label={label}
        />
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function MetricItem({
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
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className={cn("text-sm font-semibold", colorClasses[variant])}>
        {value}
      </span>
    </div>
  )
}

/**
 * PartnerMetricsCard - Displays partner metrics in an indented card format
 * This card appears as part of the expanded content, positioned before sub-partners
 * following the Gestalt proximity principle for clear parent-child relationships
 *
 * Hybrid UX: Shows expanded by default, but can be collapsed independently
 */
function PartnerMetricsCard({
  metrics,
  depth = 0
}: {
  metrics: NetworkPartnerMetrics
  depth?: number
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const indentPadding = depth * 32

  return (
    <div
      className="px-4 py-2 border-b border-default"
      style={{ paddingLeft: `${16 + indentPadding + 32}px` }} // Extra 32px for card indent
    >
      <div className={cn(
        "rounded-md border border-default bg-muted-bg/30 transition-all",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {/* Header with toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              Performance Metrics
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCollapsed && (
              <span className="text-xs text-muted">
                {metrics.totalLeads} leads · {metrics.conversion !== null ? `${metrics.conversion}%` : 'N/A'} · ${metrics.totalRevenue.toLocaleString()}
              </span>
            )}
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            )}
          </div>
        </button>

        {/* Collapsible content with slide animation */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              key="metrics-content"
              variants={slideDownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-6 pt-3 border-t border-default">
                <MetricItem
                  label="Total Leads"
                  value={metrics.totalLeads}
                  variant="blue"
                />
                <MetricItem
                  label="Conversion"
                  value={metrics.conversion !== null ? `${metrics.conversion}%` : "N/A"}
                  variant="green"
                />
                <MetricItem
                  label="Commission"
                  value={metrics.commission !== null ? `$${metrics.commission.toLocaleString()}` : "N/A"}
                  variant="purple"
                />
                <MetricItem
                  label="Total Revenue"
                  value={`$${metrics.totalRevenue.toLocaleString()}`}
                  variant="default"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
}

function PartnerRow({
  partner,
  depth = 0,
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onAddSubPartner,
  onDelete,
}: PartnerRowProps) {
  const hasSubPartners = partner.subPartners && partner.subPartners.length > 0
  const indentPadding = depth * 32
  // Master partners can be expanded to show metrics, even without sub-partners
  const canExpand = partner.isMasterPartner

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
          {canExpand ? (
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
              <span className="text-xs text-primary bg-accent-bg px-1.5 py-0.5 rounded font-medium">
                Master
              </span>
            )}
            {hasSubPartners && (
              <span className="text-xs text-muted">
                ({partner.subPartners?.length} sub-partner{partner.subPartners && partner.subPartners.length > 1 ? 's' : ''})
              </span>
            )}
          </div>
          <div className="text-sm text-muted truncate">
            {partner.contactName} &bull; {partner.contactEmail}
          </div>
        </div>

        {/* Status */}
        <div className="w-12 flex-shrink-0 flex justify-center">
          <StatusIndicator status={partner.status} />
        </div>

        {/* Monthly Revenue */}
        <div className="w-36 flex-shrink-0 text-right">
          <span className="text-sm text-primary font-medium">
            ${partner.monthlyRevenue.toLocaleString()}
          </span>
        </div>

        {/* Actions - Fixed width for alignment */}
        <div className="flex items-center justify-end gap-1 w-20 flex-shrink-0">
          {/* More Actions Dropdown */}
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
    </div>
  )
}

// Wrapper to manage individual expand state (controlled)
function PartnerRowWrapper({
  partner,
  depth = 0,
  onEdit,
  onAddSubPartner,
  onDelete,
  expandedIds,
  onToggleExpand,
}: {
  partner: NetworkPartner
  depth?: number
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}) {
  const isExpanded = expandedIds.has(partner.id)

  return (
    <>
      <PartnerRow
        partner={partner}
        depth={depth}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(partner.id)}
        onEdit={onEdit}
        onAddSubPartner={onAddSubPartner}
        onDelete={onDelete}
      />

      {/* Expanded content: Metrics card + Sub-partners with slide animation */}
      <AnimatePresence initial={false}>
        {isExpanded && partner.isMasterPartner && (
          <motion.div
            key={`expanded-${partner.id}`}
            variants={expandedContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            {/* Metrics card - appears first in expanded content */}
            <PartnerMetricsCard metrics={partner.metrics} depth={depth} />

            {/* Sub-partners render below metrics */}
            {partner.subPartners?.map((subPartner) => (
              <PartnerRowWrapper
                key={subPartner.id}
                partner={subPartner}
                depth={depth + 1}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onAddSubPartner={onAddSubPartner}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// =============================================================================
// FILTER CONFIGURATION
// =============================================================================

const PARTNER_FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active' },
      { id: 'inactive', label: 'Inactive' },
      { id: 'pending', label: 'Pending' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { id: 'master', label: 'Master Partner' },
      { id: 'sub', label: 'Sub-Partner' },
    ],
  },
]

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
  const [allExpanded, setAllExpanded] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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

  // Filter partners based on search and filters
  const filteredPartners = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const hasStatusFilter = statusFilters.status && statusFilters.status.length > 0
    const hasTypeFilter = statusFilters.type && statusFilters.type.length > 0

    const filterPartner = (partner: NetworkPartner): NetworkPartner | null => {
      // Search filter
      const matchesSearch = !query ||
        partner.companyName.toLowerCase().includes(query) ||
        partner.contactName.toLowerCase().includes(query) ||
        partner.contactEmail.toLowerCase().includes(query)

      // Status filter
      const matchesStatus = !hasStatusFilter || statusFilters.status.includes(partner.status)

      // Type filter
      const partnerType = partner.isMasterPartner ? 'master' : 'sub'
      const matchesType = !hasTypeFilter || statusFilters.type.includes(partnerType)

      // Check sub-partners
      const filteredSubPartners = partner.subPartners
        ?.map(filterPartner)
        .filter((p): p is NetworkPartner => p !== null)

      // Include if partner matches all criteria or has matching sub-partners
      if ((matchesSearch && matchesStatus && matchesType) || (filteredSubPartners && filteredSubPartners.length > 0)) {
        return {
          ...partner,
          subPartners: filteredSubPartners,
        }
      }

      return null
    }

    return partners.map(filterPartner).filter((p): p is NetworkPartner => p !== null)
  }, [partners, searchQuery, statusFilters])

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

  // Toggle individual row expand/collapse
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setAllExpanded(false)
      } else {
        next.add(id)
      }
      return next
    })
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
          filterGroups={PARTNER_FILTER_GROUPS}
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
              onClick={handleExpandAll}
              disabled={allExpanded}
              className="h-7 px-2 text-xs"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapseAll}
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
                onToggleExpand={handleToggleExpand}
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
