/**
 * DocumentsEvidenceSection - Smart document management for incident evidence
 *
 * Features:
 * - Role-based visibility (reporter, investigator, reviewer, admin)
 * - Edit permissions based on incident status and user role
 * - Search and filter by type/role
 * - Bulk selection with download/delete actions
 * - Pagination
 * - Graphic content warnings
 * - **Mobile-first responsive design**
 *
 * Permission Logic:
 * - Draft: Reporter can view/edit/delete their documents
 * - Submitted: Documents locked for reporter, next assignee can add/edit
 * - Visibility levels control who can see each document
 * - Higher roles can see documents at their level and below
 */

import * as React from 'react'
import { useState, useMemo, useRef, useCallback } from 'react'
import {
  Download,
  Trash2,
  Eye,
  FileImage,
  FileVideo,
  FileText,
  File,
  AlertTriangle,
  Upload,
  Loader2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Checkbox } from '../../../ui/checkbox'
import { Button } from '../../../ui/button'
import { ActionTile } from '../../../ui/ActionTile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../../ui/dropdown-menu'
import { Pagination } from '../../../ui/Pagination'
import { SearchFilter } from '../../../shared/SearchFilter'
import type { FilterGroup, FilterState } from '../../../shared/SearchFilter/types'
import type {
  DocumentsEvidenceSectionProps,
  EvidenceDocument,
  DocumentType,
  IncidentRole,
  DocumentVisibility,
  IncidentStatus,
  DocumentUserContext,
} from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

const ROLE_HIERARCHY: Record<IncidentRole, number> = {
  viewer: 0,
  reporter: 1,
  investigator: 2,
  reviewer: 3,
  admin: 4,
}

const VISIBILITY_REQUIRED_ROLE: Record<DocumentVisibility, IncidentRole> = {
  all: 'viewer',
  reporter: 'reporter',
  investigator: 'investigator',
  reviewer: 'reviewer',
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  image: 'Image',
  video: 'Video',
  document: 'Document',
  form: 'Form',
  other: 'Other',
}

const ROLE_LABELS: Record<IncidentRole, string> = {
  reporter: 'Reporter',
  investigator: 'Investigator',
  reviewer: 'Reviewer',
  admin: 'Admin',
  viewer: 'Viewer',
}

// =============================================================================
// PERMISSION HELPERS
// =============================================================================

/**
 * Check if user can see a document based on visibility and role
 */
function canViewDocument(
  document: EvidenceDocument,
  userContext: DocumentUserContext
): boolean {
  const requiredRole = VISIBILITY_REQUIRED_ROLE[document.visibility]
  const userRoleLevel = ROLE_HIERARCHY[userContext.role]
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole]

  // Admin can see everything
  if (userContext.role === 'admin') return true

  // Check role hierarchy
  return userRoleLevel >= requiredRoleLevel
}

/**
 * Check if user can edit/delete documents
 * - Draft: Reporter can edit their own documents
 * - After submission: Only assigned person or higher can edit
 */
function canEditDocuments(
  incidentStatus: IncidentStatus,
  userContext: DocumentUserContext
): boolean {
  // Admin can always edit
  if (userContext.role === 'admin') return true

  // Draft mode: reporter can edit
  if (incidentStatus === 'draft' && userContext.isReporter) return true

  // After submission: only assigned person can edit
  if (incidentStatus !== 'draft' && userContext.isAssigned) return true

  // Reviewer can always edit
  if (userContext.role === 'reviewer') return true

  return false
}

/**
 * Check if user can delete a specific document
 */
function canDeleteDocument(
  document: EvidenceDocument,
  incidentStatus: IncidentStatus,
  userContext: DocumentUserContext
): boolean {
  // Admin can delete anything
  if (userContext.role === 'admin') return true

  // Can only delete your own documents
  if (document.uploadedBy.id !== userContext.userId) return false

  // Draft: reporter can delete their documents
  if (incidentStatus === 'draft' && userContext.isReporter) return true

  // After submission: only if you're the assigned person
  if (userContext.isAssigned) return true

  return false
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * File type icon
 */
function FileTypeIcon({ type, className }: { type: DocumentType; className?: string }) {
  const icons: Record<DocumentType, React.ReactNode> = {
    image: <FileImage className={className} />,
    video: <FileVideo className={className} />,
    document: <FileText className={className} />,
    form: <FileText className={className} />,
    other: <File className={className} />,
  }
  return <>{icons[type]}</>
}

/**
 * Graphic content warning badge
 */
function GraphicBadge({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center justify-center size-5 rounded bg-error/10 text-error" title="Graphic content">
        <AlertTriangle className="size-3" />
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-error/10 text-error border border-error/20">
      <AlertTriangle className="size-3" />
      Graphic
    </span>
  )
}

/**
 * Mobile document card - displays document info in a card format
 */
function DocumentCard({
  doc,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete,
  canDelete,
  formatDate,
}: {
  doc: EvidenceDocument
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onView?: () => void
  onDownload?: () => void
  onDelete?: () => void
  canDelete: boolean
  formatDate: (date: string) => string
}) {
  return (
    <div
      className={cn(
        'bg-surface border border-default rounded-lg p-3',
        'active:bg-surface-active transition-colors',
        isSelected && 'ring-2 ring-accent ring-offset-1'
      )}
    >
      {/* Top row: Checkbox + File icon + Name + Actions */}
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select ${doc.name}`}
          className="mt-1"
        />

        <div className="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info flex-shrink-0">
          <FileTypeIcon type={doc.type} className="size-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary truncate">{doc.name}</span>
            {doc.isGraphic && <GraphicBadge compact />}
          </div>
          <div className="text-xs text-secondary mt-0.5">
            {DOCUMENT_TYPE_LABELS[doc.type]}
          </div>
        </div>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 -mr-2 text-tertiary hover:text-primary hover:bg-muted-bg rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Document actions"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              <Eye className="size-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload}>
              <Download className="size-4 mr-2" />
              Download
            </DropdownMenuItem>
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-error focus:text-error">
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom row: Uploaded by + Date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-default">
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <span>By</span>
          <span className="text-link">{doc.uploadedBy.name}</span>
        </div>
        <span className="text-xs text-tertiary">
          {formatDate(doc.uploadedAt)}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DocumentsEvidenceSection({
  documents,
  incidentStatus,
  userContext,
  onUpload,
  onDelete,
  onDownload,
  onView,
  isUploading,
  className,
}: DocumentsEvidenceSectionProps) {
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Permission checks
  const canEdit = canEditDocuments(incidentStatus, userContext)

  // Filter groups for SearchFilter
  const filterGroups: FilterGroup[] = useMemo(() => [
    {
      key: 'type',
      label: 'Document Type',
      options: Object.entries(DOCUMENT_TYPE_LABELS).map(([id, label]) => ({ id, label })),
    },
    {
      key: 'role',
      label: 'Uploaded By',
      options: Object.entries(ROLE_LABELS)
        .filter(([key]) => key !== 'viewer')
        .map(([id, label]) => ({ id, label })),
    },
  ], [])

  // Handlers with page reset
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && onUpload) {
      await onUpload(Array.from(files))
      // Reset input to allow re-uploading same file
      e.target.value = ''
    }
  }

  // Filter documents based on visibility permissions
  const visibleDocuments = useMemo(() => {
    return documents.filter(doc => canViewDocument(doc, userContext))
  }, [documents, userContext])

  // Apply search and filters
  const filteredDocuments = useMemo(() => {
    return visibleDocuments.filter(doc => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!doc.name.toLowerCase().includes(query)) return false
      }

      // Type filter (from FilterState)
      const selectedTypes = filters.type || []
      if (selectedTypes.length > 0 && !selectedTypes.includes(doc.type)) return false

      // Role filter (by uploader role, from FilterState)
      const selectedRoles = filters.role || []
      if (selectedRoles.length > 0 && doc.uploadedByRole && !selectedRoles.includes(doc.uploadedByRole)) return false

      return true
    })
  }, [visibleDocuments, searchQuery, filters])

  // Pagination
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredDocuments.slice(start, start + pageSize)
  }, [filteredDocuments, currentPage, pageSize])

  const totalPages = Math.ceil(filteredDocuments.length / pageSize)

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedDocuments.map(d => d.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  const clearSelection = () => setSelectedIds(new Set())

  // Bulk actions
  const handleBulkDownload = () => {
    if (onDownload && selectedIds.size > 0) {
      onDownload(Array.from(selectedIds))
    }
  }

  const handleBulkDelete = async () => {
    if (onDelete && selectedIds.size > 0) {
      await onDelete(Array.from(selectedIds))
      clearSelection()
    }
  }

  // Check if all visible on page are selected
  const allPageSelected = paginatedDocuments.length > 0 &&
    paginatedDocuments.every(d => selectedIds.has(d.id))
  const somePageSelected = paginatedDocuments.some(d => selectedIds.has(d.id))

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0)

  // Format date - shorter on mobile
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search, Filters & Upload */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchFilter
            placeholder="Search files"
            value={searchQuery}
            onChange={handleSearchChange}
            filterGroups={filterGroups}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            size="compact"
          />
        </div>

        {/* Upload Button (only if user can edit) */}
        {canEdit && onUpload && (
          <Button
            variant="default"
            size="sm"
            className="h-9 flex-shrink-0"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="size-4 mr-1.5 animate-spin" />
            ) : (
              <Upload className="size-4 mr-1.5" />
            )}
            <span className="hidden sm:inline">Upload</span>
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />

      {/* Selection Bar (shown when items selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-info/5 border border-info/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{selectedIds.size} selected</span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-link hover:text-link-hover"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownload}
              className="h-9"
            >
              <Download className="size-4 md:mr-1" />
              <span className="hidden md:inline">Download</span>
            </Button>
            {canEdit && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="h-9"
              >
                <Trash2 className="size-4 md:mr-1" />
                <span className="hidden md:inline">Delete</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ===== MOBILE: Card List ===== */}
      <div className="md:hidden space-y-2">
        {paginatedDocuments.length === 0 ? (
          <div className="text-center py-8 text-secondary">
            {filteredDocuments.length === 0
              ? 'No documents uploaded yet'
              : 'No documents match your filters'
            }
          </div>
        ) : (
          paginatedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isSelected={selectedIds.has(doc.id)}
              onSelect={(checked) => handleSelectOne(doc.id, checked)}
              onView={() => onView?.(doc)}
              onDownload={() => onDownload?.([doc.id])}
              onDelete={() => onDelete?.([doc.id])}
              canDelete={canDeleteDocument(doc, incidentStatus, userContext)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* ===== DESKTOP: Table ===== */}
      <div className="hidden md:block border border-default rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted-bg/50">
            <tr className="border-b border-default">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-4 py-3">
                Name
              </th>
              <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-4 py-3">
                Uploaded By
              </th>
              <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-right text-xs font-medium text-secondary uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocuments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-secondary">
                  {filteredDocuments.length === 0
                    ? 'No documents uploaded yet'
                    : 'No documents match your filters'
                  }
                </td>
              </tr>
            ) : (
              paginatedDocuments.map((doc) => {
                const canDeleteThis = canDeleteDocument(doc, incidentStatus, userContext)

                return (
                  <tr
                    key={doc.id}
                    className="border-b border-default last:border-b-0 hover:bg-muted-bg/30 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.has(doc.id)}
                        onCheckedChange={(checked) => handleSelectOne(doc.id, !!checked)}
                        aria-label={`Select ${doc.name}`}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-info/10 flex items-center justify-center text-info">
                          <FileTypeIcon type={doc.type} className="size-4" />
                        </div>
                        <span className="text-sm font-medium text-primary">{doc.name}</span>
                        {doc.isGraphic && <GraphicBadge />}
                      </div>
                    </td>

                    {/* Uploaded By */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-link hover:text-link-hover cursor-pointer">
                        {doc.uploadedBy.name}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-secondary">
                        {formatDateFull(doc.uploadedAt)}
                      </span>
                    </td>

                    {/* Actions - Color grading by intent */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <ActionTile
                          variant="neutral"
                          appearance="filled"
                          size="xs"
                          onClick={() => onView?.(doc)}
                          aria-label="View"
                        >
                          <Eye className="size-4" />
                        </ActionTile>
                        <ActionTile
                          variant="success"
                          appearance="filled"
                          size="xs"
                          onClick={() => onDownload?.([doc.id])}
                          aria-label="Download"
                        >
                          <Download className="size-4" />
                        </ActionTile>
                        {canEdit && canDeleteThis && (
                          <ActionTile
                            variant="destructive"
                            appearance="filled"
                            size="xs"
                            onClick={() => onDelete?.([doc.id])}
                            aria-label="Delete"
                          >
                            <Trash2 className="size-4" />
                          </ActionTile>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE: Simple Pagination ===== */}
      {filteredDocuments.length > 0 && (
        <div className="md:hidden flex items-center justify-between pt-2">
          <span className="text-xs text-secondary">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'file' : 'files'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-secondary px-2 min-w-[60px] text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== DESKTOP: Full Pagination ===== */}
      {filteredDocuments.length > 0 && (
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span>Documents per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-default rounded px-2 py-1 bg-surface text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredDocuments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            showPageSizeSelector={false}
            showResultsText
            showFirstLastButtons
            maxPageButtons={5}
          />
        </div>
      )}
    </div>
  )
}

export default DocumentsEvidenceSection
