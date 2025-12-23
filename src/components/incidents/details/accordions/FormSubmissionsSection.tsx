/**
 * FormSubmissionsSection - Collapsible section displaying form submissions
 *
 * Features:
 * - Collapsible accordion with severity-colored border
 * - Search and filter functionality (by type and role)
 * - Paginated list of form submissions
 * - View/download actions for each submission
 * - Mobile-responsive design
 *
 * @example
 * ```tsx
 * <FormSubmissionsSection
 *   submissions={formSubmissions}
 *   incidentSeverity="high"
 *   onView={(submission) => handleView(submission)}
 *   onDownload={(submission) => handleDownload(submission)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {
  ChevronDown,
  Info,
  FileText,
  Eye,
  Download,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import { SearchFilter } from '../../../shared/SearchFilter'
import type { FilterGroup, FilterState } from '../../../shared/SearchFilter/types'
import type {
  FormSubmissionsSectionProps,
  ExtendedFormSubmission,
  IncidentPerson,
  IncidentSeverity,
} from '../types'
import {
  FORM_TYPE_LABELS,
  INCIDENT_ROLE_LABELS,
} from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Severity to CSS color variable mapping for borders
 */
const SEVERITY_BORDER_COLORS: Record<IncidentSeverity, string> = {
  critical: 'var(--color-error)',
  high: 'var(--color-aging)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
  none: 'var(--color-success)',
}

/**
 * Form submission status styles
 */
const SUBMISSION_STATUS_STYLES = {
  pending: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
  approved: 'bg-success/10 text-success border-success/30',
  rejected: 'bg-error/10 text-error border-error/30',
}

const SUBMISSION_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Submitted',
  rejected: 'Rejected',
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Info tooltip icon
 */
function InfoTooltip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center size-4 rounded-full bg-accent/10 text-accent cursor-help"
      title={label}
    >
      <Info className="size-3" />
    </span>
  )
}

/**
 * Last updated info display
 */
function LastUpdatedInfo({
  person,
  date,
}: {
  person: IncidentPerson
  date: string
}) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' - ' + new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <span className="text-xs text-tertiary">
      Last updated by: <span className="text-link">{person.name}</span>
      <span className="mx-2">·</span>
      Updated date: {formattedDate}
    </span>
  )
}

/**
 * Status badge for form submissions
 */
function StatusBadge({ status }: { status: ExtendedFormSubmission['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
        SUBMISSION_STATUS_STYLES[status]
      )}
    >
      {SUBMISSION_STATUS_LABELS[status]}
    </span>
  )
}

/**
 * Person link component
 */
function PersonLink({
  person,
  onClick,
}: {
  person: IncidentPerson
  onClick?: (person: IncidentPerson) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(person)}
      className="text-link hover:text-link-hover hover:underline focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-2 rounded-sm"
    >
      {person.name}
    </button>
  )
}

/**
 * Format date for display
 */
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  )
}


/**
 * Single form submission card
 */
function SubmissionRow({
  submission,
  onView,
  onDownload,
  onPersonClick,
}: {
  submission: ExtendedFormSubmission
  onView?: (submission: ExtendedFormSubmission) => void
  onDownload?: (submission: ExtendedFormSubmission) => void
  onPersonClick?: (person: IncidentPerson) => void
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-surface rounded-xl border border-default hover:bg-surface-hover transition-colors">
      {/* Icon and form info */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FileText className="size-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary line-clamp-2 sm:line-clamp-1">
            {submission.formName}
          </p>
          <p className="text-xs text-secondary mt-0.5">
            <span>Submitted by</span>{' '}
            <PersonLink person={submission.submittedBy} onClick={onPersonClick} />{' '}
            <span className="text-tertiary">· {formatDateTime(submission.submittedAt)}</span>
          </p>
        </div>
      </div>

      {/* Status badge and actions */}
      <div className="flex items-center gap-2 sm:gap-3 pl-13 sm:pl-0">
        <StatusBadge status={submission.status} />

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(submission)}
            className="size-9 text-secondary hover:text-primary"
            title="View form"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload?.(submission)}
            className="size-9 text-secondary hover:text-primary"
            title="Download form"
          >
            <Download className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Simple pagination for form submissions
 */
function SimplePagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  totalItems,
}: {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  totalItems: number
}) {
  if (totalItems === 0) return null

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-surface rounded-xl border border-default">
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-secondary">Submissions per page</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[70px] h-8 bg-surface border-default text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page info and navigation */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          {/* First */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="size-8"
            title="First page"
          >
            <span className="text-xs">«</span>
          </Button>
          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="size-8"
            title="Previous page"
          >
            <span className="text-xs">‹</span>
          </Button>
          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="size-8"
            title="Next page"
          >
            <span className="text-xs">›</span>
          </Button>
          {/* Last */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="size-8"
            title="Last page"
          >
            <span className="text-xs">»</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * FormSubmissionsSection - Collapsible form submissions section
 */
export function FormSubmissionsSection({
  submissions,
  incidentSeverity = 'low',
  lastUpdatedBy,
  lastUpdatedAt,
  collapsible = true,
  defaultExpanded = true,
  onView,
  onDownload,
  onPersonClick,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  className,
}: FormSubmissionsSectionProps) {
  // State
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Get severity color
  const severityColor = SEVERITY_BORDER_COLORS[incidentSeverity]

  // Filter groups for SearchFilter
  const filterGroups: FilterGroup[] = useMemo(() => [
    {
      key: 'type',
      label: 'Form Type',
      options: Object.entries(FORM_TYPE_LABELS).map(([id, label]) => ({ id, label })),
    },
    {
      key: 'role',
      label: 'Submitter Role',
      options: Object.entries(INCIDENT_ROLE_LABELS).map(([id, label]) => ({ id, label })),
    },
  ], [])

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions]

    // Search filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase()
      result = result.filter(
        (s) =>
          s.formName.toLowerCase().includes(search) ||
          s.submittedBy.name.toLowerCase().includes(search)
      )
    }

    // Type filter (from FilterState)
    const selectedTypes = filters.type || []
    if (selectedTypes.length > 0) {
      result = result.filter((s) => s.type && selectedTypes.includes(s.type))
    }

    // Role filter (from FilterState)
    const selectedRoles = filters.role || []
    if (selectedRoles.length > 0) {
      result = result.filter((s) => s.submitterRole && selectedRoles.includes(s.submitterRole))
    }

    return result
  }, [submissions, searchValue, filters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize))
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredSubmissions.slice(start, start + pageSize)
  }, [filteredSubmissions, currentPage, pageSize])

  // Reset to page 1 when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }, [])

  // Reset to page 1 when filters change
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0)

  // Content to render
  const content = (
    <div className="space-y-4">
      {/* Search and filters bar */}
      <SearchFilter
        placeholder="Search form submissions"
        value={searchValue}
        onChange={handleSearchChange}
        filterGroups={filterGroups}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        size="compact"
      />

      {/* Submissions list - each row in its own card */}
      <div className="space-y-2">
        {paginatedSubmissions.length === 0 ? (
          <div className="p-8 text-center text-secondary bg-surface rounded-xl border border-default">
            {searchValue || hasActiveFilters
              ? 'No submissions match your filters'
              : 'No form submissions yet'}
          </div>
        ) : (
          paginatedSubmissions.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              onView={onView}
              onDownload={onDownload}
              onPersonClick={onPersonClick}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredSubmissions.length > 0 && (
        <SimplePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          totalItems={filteredSubmissions.length}
        />
      )}
    </div>
  )

  // Non-collapsible version - just render content (for embedding in parent accordions)
  if (!collapsible) {
    // When embedded in a parent accordion, just return the content
    // The parent provides the header, border, and padding
    return <>{content}</>
  }

  // Collapsible accordion version
  return (
    <AccordionPrimitive.Root
      type="single"
      defaultValue={defaultExpanded ? 'form-submissions' : undefined}
      collapsible
      className={cn('rounded-lg overflow-hidden', className)}
    >
      <AccordionPrimitive.Item
        value="form-submissions"
        className="bg-surface"
        style={{ borderLeft: `4px solid ${severityColor}` }}
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              'flex flex-1 items-center justify-between py-3 px-4 text-left',
              'hover:bg-muted-bg/50 transition-colors',
              'data-[state=open]:bg-muted-bg/50',
              'focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4',
              'group'
            )}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-primary">Form Submissions</span>
                <InfoTooltip label="Forms submitted as part of this incident" />
              </div>
              {lastUpdatedBy && lastUpdatedAt && (
                <div className="hidden sm:block">
                  <LastUpdatedInfo person={lastUpdatedBy} date={lastUpdatedAt} />
                </div>
              )}
            </div>
            <ChevronDown
              className={cn(
                'size-5 text-tertiary transition-transform duration-200',
                'group-data-[state=open]:rotate-180'
              )}
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        <AccordionPrimitive.Content
          className={cn(
            'overflow-hidden',
            'data-[state=open]:animate-accordion-down',
            'data-[state=closed]:animate-accordion-up'
          )}
        >
          <div className="px-4 pb-4">
            {content}
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

export default FormSubmissionsSection
