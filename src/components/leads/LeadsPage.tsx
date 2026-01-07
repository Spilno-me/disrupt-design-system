import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { Plus, X, Filter } from 'lucide-react'
import { cn } from '../../lib/utils'
import { StatsCard } from './StatsCard'
import { LeadCard, Lead, LeadAction } from './LeadCard'
import { LeadsDataTable } from './LeadsDataTable'
import { CreateLeadDialog, CreateLeadFormData, Partner } from './CreateLeadDialog'
import { BulkActionsToolbar, BulkAction } from './BulkActionsToolbar'
import { ExportButton, ExportOptions } from './ExportButton'
import { SearchFilter } from '../shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../shared/SearchFilter/types'
import { Pagination } from '../ui/Pagination'
import { Button } from '../ui/button'
import { SortDirection } from '../ui/DataTable'
import { GridBlobBackground } from '../ui/GridBlobCanvas'

// =============================================================================
// LEADS FILTER CONFIGURATION
// =============================================================================

const LEADS_FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'new', label: 'New' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'converted', label: 'Converted' },
      { id: 'lost', label: 'Lost' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    options: [
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
    ],
  },
  {
    key: 'source',
    label: 'Source',
    options: [
      { id: 'website', label: 'Website' },
      { id: 'referral', label: 'Referral' },
      { id: 'cold_outreach', label: 'Cold Outreach' },
      { id: 'partner', label: 'Partner' },
      { id: 'other', label: 'Other' },
    ],
  },
]

// =============================================================================
// TYPES
// =============================================================================

export interface LeadsPageProps {
  /** Array of leads to display */
  leads: Lead[]
  /** Stats to display at top */
  stats?: {
    totalLeads?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    newLeads?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    converted?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    highPriority?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    avgResponse?: { value: string; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  }
  /** Callback when a lead is clicked */
  onLeadClick?: (lead: Lead) => void
  /** Callback when lead action is clicked (from table or card) */
  onLeadAction?: (lead: Lead, action: LeadAction) => void
  /** Callback when a new lead is created */
  onCreateLead?: (data: CreateLeadFormData) => void | Promise<void>
  /** List of partners for assignment dropdown */
  partners?: Partner[]
  /** Page title */
  title?: string
  /** Default page size */
  defaultPageSize?: number
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
  /** Callback for bulk actions on selected leads */
  onBulkAction?: (action: BulkAction, leadIds: string[], data?: Record<string, unknown>) => void | Promise<void>
  /** Callback for export */
  onExport?: (options: ExportOptions) => void | Promise<void>
  /** Initial filters to apply on mount (e.g., from dashboard KPI navigation) */
  initialFilters?: FilterState
}

// =============================================================================
// LEADS PAGE COMPONENT
// =============================================================================

/**
 * LeadsPage - Full page layout for managing leads
 *
 * Includes:
 * - Stats cards row showing KPIs
 * - Search and filter bar
 * - Data table for desktop (md+)
 * - Card grid for mobile (< md)
 * - Pagination
 *
 * @example
 * ```tsx
 * <LeadsPage
 *   leads={leadsData}
 *   stats={{
 *     totalLeads: { value: 6, trend: '+12%', trendDirection: 'up' },
 *     newLeads: { value: 0, trend: '+5' },
 *     converted: { value: 0, trend: '0.0%' },
 *   }}
 *   onLeadClick={(lead) => router.push(`/leads/${lead.id}`)}
 * />
 * ```
 */
export function LeadsPage({
  leads,
  stats,
  onLeadClick,
  onLeadAction,
  onCreateLead,
  partners = [],
  title = 'Leads',
  defaultPageSize = 10,
  loading = false,
  className,
  onBulkAction,
  onExport,
  initialFilters,
}: LeadsPageProps) {
  // Create lead dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Filter state
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>(
    initialFilters ?? {
      status: [],
      priority: [],
      source: [],
    }
  )

  // Selection state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Widget filter state - tracks which KPI widget is active
  type WidgetFilter = 'all' | 'new' | 'in_progress' | 'converted' | 'high_priority' | null
  const [activeWidget, setActiveWidget] = useState<WidgetFilter>(null)

  // Filter leads based on current filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter - MVP: only name and company
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter (if any selected)
      if (filters.status.length > 0 && !filters.status.includes(lead.status)) {
        return false
      }

      // Priority filter (if any selected)
      if (filters.priority.length > 0 && !filters.priority.includes(lead.priority)) {
        return false
      }

      // Source filter (if any selected)
      if (filters.source.length > 0 && !filters.source.includes(lead.source)) {
        return false
      }

      return true
    })
  }, [leads, searchValue, filters])

  // Sort filtered leads
  const sortedLeads = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredLeads

    return [...filteredLeads].sort((a, b) => {
      let valueA: string | number | null = null
      let valueB: string | number | null = null

      switch (sortColumn) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'company':
          valueA = a.company.toLowerCase()
          valueB = b.company.toLowerCase()
          break
        case 'email':
          valueA = a.email.toLowerCase()
          valueB = b.email.toLowerCase()
          break
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          valueA = priorityOrder[a.priority]
          valueB = priorityOrder[b.priority]
          break
        }
        case 'score':
          valueA = a.score ?? 0
          valueB = b.score ?? 0
          break
        case 'status':
          valueA = a.status
          valueB = b.status
          break
        case 'source':
          valueA = a.source
          valueB = b.source
          break
        case 'value':
          valueA = a.value ?? 0
          valueB = b.value ?? 0
          break
        default:
          return 0
      }

      if (valueA == null && valueB == null) return 0
      if (valueA == null) return 1
      if (valueB == null) return -1

      let comparison = 0
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB)
      } else {
        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [filteredLeads, sortColumn, sortDirection])

  // Paginate sorted leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedLeads.slice(startIndex, startIndex + pageSize)
  }, [sortedLeads, currentPage, pageSize])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
    // Clear widget selection when manual filter changes
    setActiveWidget(null)
  }, [])

  // Handle KPI widget click - filters table by status or priority
  const handleWidgetClick = useCallback((widget: WidgetFilter) => {
    // Toggle off if already active
    if (activeWidget === widget) {
      setActiveWidget(null)
      setFilters({ status: [], priority: [], source: [] })
      setCurrentPage(1)
      return
    }

    setActiveWidget(widget)
    setCurrentPage(1)

    switch (widget) {
      case 'all':
        // Show all - clear filters
        setFilters({ status: [], priority: [], source: [] })
        break
      case 'new':
        setFilters({ status: ['new'], priority: [], source: [] })
        break
      case 'in_progress':
        setFilters({ status: ['in_progress'], priority: [], source: [] })
        break
      case 'converted':
        setFilters({ status: ['converted'], priority: [], source: [] })
        break
      case 'high_priority':
        setFilters({ status: [], priority: ['high'], source: [] })
        break
    }
  }, [activeWidget])

  // Handle sort change
  const handleSortChange = useCallback((column: string, direction: SortDirection) => {
    setSortColumn(direction ? column : null)
    setSortDirection(direction)
  }, [])

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  // Handle action click from card (now receives action type directly from dropdown)
  const handleCardAction = useCallback((lead: Lead, action: LeadAction) => {
    onLeadAction?.(lead, action)
  }, [onLeadAction])

  // Handle create lead submission
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
  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: BulkAction, data?: Record<string, unknown>) => {
    if (!onBulkAction) return
    const leadIds = Array.from(selectedLeads)
    await onBulkAction(action, leadIds, data)
    if (action === 'delete') {
      setSelectedLeads(new Set())
    }
  }, [onBulkAction, selectedLeads])

  // Handle export
  const handleExport = useCallback(async (options: ExportOptions) => {
    if (!onExport) return
    await onExport({
      ...options,
    })
  }, [onExport])



  return (
    <div className={cn('relative min-h-full bg-surface', className)}>
      {/* Grid blob background - larger for main page */}
      <GridBlobBackground scale={2} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <div className="flex items-center gap-3">
            {selectedLeads.size > 0 && (
              <span className="text-sm text-muted">
                {selectedLeads.size} lead{selectedLeads.size > 1 ? 's' : ''} selected
              </span>
            )}
            {onExport && (
              <ExportButton
                onExport={handleExport}
                selectedCount={selectedLeads.size}
                totalCount={sortedLeads.length}
              />
            )}
            {onCreateLead && (
              <Button
                variant="accent"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Lead
              </Button>
            )}
          </div>
        </div>

      {/* Stats Cards Row - Clickable KPI widgets that filter the table */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.totalLeads && (
            <StatsCard
              title="Total Leads"
              value={stats.totalLeads.value}
              trend={stats.totalLeads.trend}
              trendDirection={stats.totalLeads.trendDirection}
              onClick={() => handleWidgetClick('all')}
              active={activeWidget === 'all'}
            />
          )}
          {stats.newLeads && (
            <StatsCard
              title="New Leads"
              value={stats.newLeads.value}
              trend={stats.newLeads.trend}
              trendDirection={stats.newLeads.trendDirection}
              onClick={() => handleWidgetClick('new')}
              active={activeWidget === 'new'}
            />
          )}
          {stats.converted && (
            <StatsCard
              title="Converted"
              value={stats.converted.value}
              trend={stats.converted.trend}
              trendDirection={stats.converted.trendDirection}
              onClick={() => handleWidgetClick('converted')}
              active={activeWidget === 'converted'}
            />
          )}
          {stats.highPriority && (
            <StatsCard
              title="High Priority"
              value={stats.highPriority.value}
              trend={stats.highPriority.trend}
              trendDirection={stats.highPriority.trendDirection}
              onClick={() => handleWidgetClick('high_priority')}
              active={activeWidget === 'high_priority'}
            />
          )}
          {stats.avgResponse && (
            <StatsCard
              title="Avg Response"
              value={stats.avgResponse.value}
              trend={stats.avgResponse.trend}
              trendDirection={stats.avgResponse.trendDirection}
            />
          )}
        </div>
      )}

      {/* Active Filter Banner - Shows when widget filter is applied (per MVP spec) */}
      {activeWidget && activeWidget !== 'all' && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-accent-bg border border-accent rounded-lg">
          <div className="flex items-center gap-2 text-sm text-accent">
            <Filter className="w-4 h-4" />
            <span className="font-medium">
              Filter active:{' '}
              {activeWidget === 'new' && 'New Leads'}
              {activeWidget === 'in_progress' && 'Leads in Progress'}
              {activeWidget === 'converted' && 'Converted'}
              {activeWidget === 'high_priority' && 'High Priority'}
            </span>
            <span className="text-accent/70">
              — Showing {filteredLeads.length} of {leads.length} leads
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleWidgetClick('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent bg-surface border border-accent rounded-md hover:bg-accent-bg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filter
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <SearchFilter
        placeholder="Search by name or company..."
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value)
          setCurrentPage(1)
        }}
        filterGroups={LEADS_FILTER_GROUPS}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Bulk Actions Toolbar */}
      {onBulkAction && (
        <BulkActionsToolbar
          selectedCount={selectedLeads.size}
          totalCount={sortedLeads.length}
          onAction={handleBulkAction}
          onClearSelection={() => setSelectedLeads(new Set())}
          onSelectAll={() => setSelectedLeads(new Set(sortedLeads.map(l => l.id)))}
          availablePartners={partners.map(p => ({ id: p.id, name: p.name }))}
        />
      )}

      {/* Desktop: Data Table (hidden on mobile) */}
      <div className="hidden md:block">
        <LeadsDataTable
          leads={paginatedLeads}
          selectedLeads={selectedLeads}
          onSelectionChange={setSelectedLeads}
          onLeadClick={onLeadClick}
          onActionClick={onLeadAction}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          loading={loading}
          // Pagination embedded in table footer
          pagination
          currentPage={currentPage}
          totalItems={sortedLeads.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      {/* Mobile: Card Grid (hidden on desktop) */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-muted-bg rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : paginatedLeads.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {paginatedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={onLeadClick}
                onActionClick={handleCardAction}
              />
            ))}
          </div>
        ) : (
          <EmptyState searchValue={searchValue} />
        )}
      </div>

        {/* Mobile Pagination - only shown on small screens (desktop has embedded pagination in table) */}
        <div className="md:hidden">
          {sortedLeads.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={sortedLeads.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector
              showResultsText
              showFirstLastButtons
            />
          )}
        </div>
      </div>

      {/* Create Lead Dialog */}
      {onCreateLead && (
        <CreateLeadDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateLead}
          partners={partners}
          isSubmitting={isCreating}
        />
      )}
    </div>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState({ searchValue }: { searchValue: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
        <svg
          className="w-8 h-8 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        {searchValue ? 'No leads found' : 'No leads yet'}
      </h3>
      <p className="text-sm text-muted max-w-sm">
        {searchValue
          ? `No leads match your search "${searchValue}". Try adjusting your filters.`
          : 'Get started by adding your first lead or importing from a CSV file.'}
      </p>
    </div>
  )
}

export default LeadsPage
