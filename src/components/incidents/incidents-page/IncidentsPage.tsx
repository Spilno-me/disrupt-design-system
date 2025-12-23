/**
 * IncidentsPage - Incidents management page component
 *
 * Features:
 * - Incident table with search, filter, and pagination
 * - Quick filters for common status filters (Hick's Law)
 * - Incident reporting flow
 * - Incident details navigation
 * - Delete, Submit, Edit incident dialogs
 *
 * UX Laws Applied:
 * - Hick's Law: Quick filters reduce decision complexity
 * - Fitts' Law: Touch-friendly targets, prominent Report button
 * - Prägnanz: Clear empty states with actionable guidance
 */
import * as React from 'react'
import { useState, useMemo } from 'react'
import { TriangleAlert, Download } from 'lucide-react'
import {
  IncidentManagementTable,
  type Incident,
} from '../../ui/table'
import { SearchFilter } from '../../shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../shared/SearchFilter/types'
import {
  QuickFilter,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
} from '../../ui/QuickFilter'
import { PageActionPanel } from '../../ui/PageActionPanel'
import { EmptyState } from '../../ui/EmptyState'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../ui/dialog'
import {
  IncidentReportingFlow,
  IncidentDetailsPage,
  DeleteIncidentDialog,
  SubmitIncidentDialog,
  EditIncidentFlow,
  type IncidentFormData,
  type IncidentDetail,
  type EvidenceDocument,
  type DocumentUserContext,
  type DetailedWorkflow,
  type ExtendedFormSubmission,
  type IncidentToDelete,
  type IncidentToSubmit,
  type IncidentToEdit,
  type Step,
} from '../index'

// =============================================================================
// TYPES
// =============================================================================

type QuickFilterType = 'all' | 'drafts' | 'reported' | 'aging' | 'investigation' | 'reviews'

interface LocationOption {
  value: string
  label: string
  group?: string
}

export interface IncidentsPageProps {
  /** Initial incidents data */
  incidents: Incident[]
  /** Location options for incident reporting */
  locations: LocationOption[]
  /** Filter configuration */
  filterGroups?: FilterGroup[]
  /** Documents for incident details */
  documents?: EvidenceDocument[]
  /** User context for document permissions */
  userContext?: DocumentUserContext
  /** Detailed workflows for incident details */
  detailedWorkflows?: DetailedWorkflow[]
  /** Extended form submissions for incident details */
  extendedFormSubmissions?: ExtendedFormSubmission[]
  /** All steps across incidents (filtered by incidentDbId for details view) */
  allSteps?: Step[]
  /** Convert table incident to full detail */
  convertToIncidentDetail: (incident: Incident) => IncidentDetail
  /** Page size options */
  pageSizeOptions?: number[]
  /** Default page size */
  defaultPageSize?: number
  /** Callback when incident is submitted */
  onIncidentSubmit?: (formData: IncidentFormData) => Promise<void>
}

// Default filter groups
const defaultFilterGroups: FilterGroup[] = [
  {
    key: 'severity',
    label: 'Severity',
    options: [
      { id: 'critical', label: 'Critical' },
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
      { id: 'none', label: 'None' },
    ],
  },
  {
    key: 'overdue',
    label: 'Overdue',
    options: [
      { id: 'overdue', label: 'Overdue Only' },
    ],
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function IncidentsPage({
  incidents: initialIncidents,
  locations,
  filterGroups = defaultFilterGroups,
  documents: initialDocuments = [],
  userContext,
  detailedWorkflows = [],
  extendedFormSubmissions = [],
  allSteps = [],
  convertToIncidentDetail,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 50,
  onIncidentSubmit,
}: IncidentsPageProps) {
  // =============================================================================
  // STATE
  // =============================================================================
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [reportingOpen, setReportingOpen] = useState(false)

  // Incident details navigation
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const [detailsActiveTab, setDetailsActiveTab] = useState<'overview' | 'steps' | 'advisor'>('overview')

  // Document management
  const [documents, setDocuments] = useState<EvidenceDocument[]>(initialDocuments)
  const [viewingDocument, setViewingDocument] = useState<EvidenceDocument | null>(null)
  const [deletingDocIds, setDeletingDocIds] = useState<string[] | null>(null)

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [incidentToDelete, setIncidentToDelete] = useState<IncidentToDelete | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [incidentToSubmit, setIncidentToSubmit] = useState<IncidentToSubmit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [incidentToEdit, setIncidentToEdit] = useState<IncidentToEdit | null>(null)

  // Mutable incidents list (for demo: delete removes from list)
  const [incidents, setIncidents] = useState(initialIncidents)

  // =============================================================================
  // DIALOG HANDLERS
  // =============================================================================

  const handleDeleteClick = (id: string) => {
    const incident = incidents.find(i => i.id === id)
    if (incident) {
      const toDelete: IncidentToDelete = {
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        location: incident.location,
        reporter: incident.reporter,
        severity: incident.severity,
        ageDays: incident.ageDays,
      }
      setIncidentToDelete(toDelete)
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!incidentToDelete) return
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIncidents(prev => prev.filter(i => i.id !== incidentToDelete.id))
    setIsDeleting(false)
    setDeleteDialogOpen(false)
    setIncidentToDelete(null)
  }

  const handleSubmitClick = (id: string) => {
    const incident = incidents.find(i => i.id === id)
    if (incident) {
      const toSubmit: IncidentToSubmit = {
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        location: incident.location,
        reporter: incident.reporter,
        severity: incident.severity,
      }
      setIncidentToSubmit(toSubmit)
      setSubmitDialogOpen(true)
    }
  }

  const handleSubmitConfirm = async () => {
    if (!incidentToSubmit) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentToSubmit.id
          ? { ...i, status: 'reported' as const, priority: i.severity }
          : i
      )
    )
    setIsSubmitting(false)
    setSubmitDialogOpen(false)
    setIncidentToSubmit(null)
  }

  const handleEditClick = (id: string) => {
    const incident = incidents.find(i => i.id === id)
    if (incident) {
      const toEdit: IncidentToEdit = {
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        location: incident.location,
        reporter: incident.reporter,
        severity: incident.severity,
        description: `Incident at ${incident.location}. Reported by ${incident.reporter}.`,
        dateTime: new Date().toISOString().slice(0, 16),
      }
      setIncidentToEdit(toEdit)
      setEditDialogOpen(true)
    }
  }

  const handleEditSave = async (formData: { title?: string; location?: string; severity?: string }, incidentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? {
              ...i,
              title: formData.title || i.title,
              location: formData.location || i.location,
              severity: (formData.severity as Incident['severity']) || i.severity,
            }
          : i
      )
    )
    setEditDialogOpen(false)
    setIncidentToEdit(null)
  }

  // =============================================================================
  // FILTERING
  // =============================================================================

  const filterCounts = useMemo(() => ({
    drafts: incidents.filter(i => i.status === 'draft').length,
    reported: incidents.filter(i => i.status === 'reported').length,
    aging: incidents.filter(i => i.overdue === true).length,
    investigation: incidents.filter(i => i.status === 'investigation').length,
    reviews: incidents.filter(i => i.status === 'review').length,
  }), [incidents])

  const handleQuickFilterClick = (filter: QuickFilterType) => {
    setActiveQuickFilter(prev => prev === filter ? 'all' : filter)
    setFilters({})
  }

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Quick filter
      if (activeQuickFilter !== 'all') {
        switch (activeQuickFilter) {
          case 'drafts':
            if (incident.status !== 'draft') return false
            break
          case 'reported':
            if (incident.status !== 'reported') return false
            break
          case 'aging':
            if (!incident.overdue) return false
            break
          case 'investigation':
            if (incident.status !== 'investigation') return false
            break
          case 'reviews':
            if (incident.status !== 'review') return false
            break
        }
      }

      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          incident.title.toLowerCase().includes(searchLower) ||
          incident.location.toLowerCase().includes(searchLower) ||
          incident.reporter.toLowerCase().includes(searchLower) ||
          incident.incidentId.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Severity filter
      if (filters.severity && filters.severity.length > 0) {
        if (!filters.severity.includes(incident.severity)) return false
      }

      // Overdue filter
      if (filters.overdue && filters.overdue.length > 0) {
        if (!incident.overdue) return false
      }

      return true
    })
  }, [incidents, searchValue, filters, activeQuickFilter])

  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredIncidents.slice(startIndex, startIndex + pageSize)
  }, [filteredIncidents, currentPage, pageSize])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
    if (Object.keys(newFilters).length > 0) {
      setActiveQuickFilter('all')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handleQuickFilterWithReset = (filter: QuickFilterType) => {
    handleQuickFilterClick(filter)
    setCurrentPage(1)
  }

  // =============================================================================
  // INCIDENT DETAILS NAVIGATION
  // =============================================================================

  const selectedIncident = selectedIncidentId
    ? incidents.find(i => i.id === selectedIncidentId)
    : null
  const incidentDetail = selectedIncident
    ? convertToIncidentDetail(selectedIncident)
    : null
  // Filter steps for the selected incident
  const incidentSteps = selectedIncidentId
    ? allSteps.filter(step => step.incidentDbId === selectedIncidentId)
    : []

  const handleNextStep = (id: string) => {
    setSelectedIncidentId(id)
    setDetailsActiveTab('overview')
  }

  const handleBackToList = () => {
    setSelectedIncidentId(null)
  }

  // =============================================================================
  // RENDER - INCIDENT DETAILS
  // =============================================================================

  if (incidentDetail && userContext) {
    return (
      <>
        <IncidentDetailsPage
          incident={incidentDetail}
          activeTab={detailsActiveTab}
          onTabChange={setDetailsActiveTab}
          onNavigate={(path) => {
            if (path === '/incidents') {
              handleBackToList()
            } else {
              console.log('Navigate to:', path)
            }
          }}
          // onRefresh intentionally omitted - button hidden by default
          onLocationClick={(id) => console.log('Location clicked:', id)}
          onFacilityClick={(id) => console.log('Facility clicked:', id)}
          onReporterClick={(id) => console.log('Reporter clicked:', id)}
          onEdit={() => console.log('Edit incident')}
          documents={documents}
          userContext={userContext}
          onDocumentUpload={async (files) => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const newDocs: EvidenceDocument[] = files.map((file, index) => ({
              id: `doc-new-${Date.now()}-${index}`,
              name: file.name,
              type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
              mimeType: file.type,
              size: file.size,
              url: URL.createObjectURL(file),
              uploadedBy: { id: userContext.userId, name: userContext.userName, email: 'user@example.com' },
              uploadedAt: new Date().toISOString(),
              uploadedByRole: userContext.role,
              visibility: 'all',
            }))
            setDocuments(prev => [...newDocs, ...prev])
          }}
          onDocumentDelete={async (ids) => {
            setDeletingDocIds(ids)
          }}
          onDocumentDownload={(ids) => {
            const docsToDownload = documents.filter(d => ids.includes(d.id))
            docsToDownload.forEach(doc => {
              const link = document.createElement('a')
              link.href = doc.url
              link.download = doc.name
              link.click()
            })
          }}
          onDocumentView={(doc) => {
            setViewingDocument(doc)
          }}
          detailedWorkflows={detailedWorkflows}
          onWorkflowAttachmentView={(attachment) => console.log('View workflow attachment:', attachment)}
          onWorkflowAttachmentDownload={(attachment) => {
            if (attachment.url) {
              const link = document.createElement('a')
              link.href = attachment.url
              link.download = attachment.name
              link.click()
            }
          }}
          onWorkflowCancel={(workflowId) => console.log('Cancel workflow:', workflowId)}
          onWorkflowPersonClick={(person) => console.log('Person clicked:', person)}
          onWorkflowStageClick={(stage) => console.log('Stage clicked:', stage)}
          extendedFormSubmissions={extendedFormSubmissions}
          onFormSubmissionView={(submission) => console.log('View form submission:', submission)}
          onFormSubmissionDownload={(submission) => {
            if (submission.url) {
              const link = document.createElement('a')
              link.href = submission.url
              link.download = submission.formName + '.pdf'
              link.click()
            }
          }}
          onFormSubmissionPersonClick={(person) => console.log('Form submitter clicked:', person)}
          // Steps tab props
          incidentSteps={incidentSteps}
          onStepNextStep={(step) => {
            console.log('Next step clicked:', step)
            // Navigate to the step's incident (already on the right incident, but switch to steps tab)
            setDetailsActiveTab('steps')
          }}
          onStepAssigneeClick={(person) => console.log('Step assignee clicked:', person)}
          onStepReporterClick={(person) => console.log('Step reporter clicked:', person)}
          onStepLocationClick={(location) => console.log('Step location clicked:', location)}
        />

        {/* Document View Dialog */}
        <Dialog open={!!viewingDocument} onOpenChange={(open) => !open && setViewingDocument(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {viewingDocument?.name}
              </DialogTitle>
              <DialogDescription>
                Document details and preview
              </DialogDescription>
            </DialogHeader>
            {viewingDocument && (
              <div className="space-y-4">
                {viewingDocument.type === 'image' && (
                  <div className="relative aspect-video bg-muted-bg rounded-lg overflow-hidden">
                    {viewingDocument.isGraphic ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-error/10">
                        <p className="text-sm text-error font-medium">Graphic content - click to reveal</p>
                      </div>
                    ) : (
                      <img
                        src={viewingDocument.thumbnailUrl || viewingDocument.url}
                        alt={viewingDocument.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-secondary">Type:</span>
                    <span className="ml-2 text-primary capitalize">{viewingDocument.type}</span>
                  </div>
                  <div>
                    <span className="text-secondary">Size:</span>
                    <span className="ml-2 text-primary">
                      {(viewingDocument.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary">Uploaded by:</span>
                    <span className="ml-2 text-link">{viewingDocument.uploadedBy.name}</span>
                  </div>
                  <div>
                    <span className="text-secondary">Date:</span>
                    <span className="ml-2 text-primary">
                      {new Date(viewingDocument.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {viewingDocument.description && (
                    <div className="col-span-2">
                      <span className="text-secondary">Description:</span>
                      <p className="mt-1 text-primary">{viewingDocument.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                variant="default"
                onClick={() => {
                  if (viewingDocument) {
                    const link = document.createElement('a')
                    link.href = viewingDocument.url
                    link.download = viewingDocument.name
                    link.click()
                  }
                }}
              >
                <Download className="size-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingDocIds} onOpenChange={(open) => !open && setDeletingDocIds(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete {deletingDocIds?.length === 1 ? 'Document' : 'Documents'}?</DialogTitle>
              <DialogDescription>
                {deletingDocIds?.length === 1
                  ? `Are you sure you want to delete "${documents.find(d => d.id === deletingDocIds[0])?.name}"?`
                  : `Are you sure you want to delete ${deletingDocIds?.length} documents?`
                }
                {' '}This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deletingDocIds) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    setDocuments(prev => prev.filter(d => !deletingDocIds.includes(d.id)))
                    setDeletingDocIds(null)
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // =============================================================================
  // RENDER - INCIDENTS LIST
  // =============================================================================

  return (
    <div className="space-y-6">
      <PageActionPanel
        icon={<TriangleAlert className="w-8 h-8" />}
        title="Incidents"
        subtitle="Environmental and safety incident tracking and management"
        primaryAction={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setReportingOpen(true)}>
              <TriangleAlert className="w-4 h-4" />
              Report Incident
            </Button>
          </>
        }
      />

      <QuickFilter gap="sm" fullBleed>
        <DraftsFilter
          size="sm"
          count={filterCounts.drafts}
          selected={activeQuickFilter === 'drafts'}
          onClick={() => handleQuickFilterWithReset('drafts')}
        />
        <ReportedFilter
          size="sm"
          count={filterCounts.reported}
          selected={activeQuickFilter === 'reported'}
          onClick={() => handleQuickFilterWithReset('reported')}
        />
        <AgingFilter
          size="sm"
          count={filterCounts.aging}
          selected={activeQuickFilter === 'aging'}
          onClick={() => handleQuickFilterWithReset('aging')}
        />
        <InProgressFilter
          size="sm"
          count={filterCounts.investigation}
          selected={activeQuickFilter === 'investigation'}
          onClick={() => handleQuickFilterWithReset('investigation')}
        />
        <ReviewsFilter
          size="sm"
          count={filterCounts.reviews}
          selected={activeQuickFilter === 'reviews'}
          onClick={() => handleQuickFilterWithReset('reviews')}
        />
      </QuickFilter>

      <SearchFilter
        placeholder="Search incidents by title, location, reporter..."
        value={searchValue}
        onChange={handleSearchChange}
        filterGroups={filterGroups}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <IncidentManagementTable
        data={paginatedIncidents}
        onNextStep={handleNextStep}
        onIncidentClick={handleNextStep}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onSubmit={handleSubmitClick}
        hideLegend
        hideBulkActions
        pagination
        currentPage={currentPage}
        totalItems={filteredIncidents.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        pageSizeOptions={pageSizeOptions}
      />

      {filteredIncidents.length === 0 && initialIncidents.length > 0 && (
        <EmptyState
          variant="filter"
          title="No incidents match your criteria"
          description="Try adjusting your search terms or clearing some filters to see more results."
          actionLabel="Clear all filters"
          onAction={() => {
            setSearchValue('')
            setFilters({})
            setActiveQuickFilter('all')
          }}
        />
      )}

      <IncidentReportingFlow
        open={reportingOpen}
        onOpenChange={setReportingOpen}
        locations={locations}
        onSubmit={async (formData) => {
          if (onIncidentSubmit) {
            await onIncidentSubmit(formData)
          } else {
            console.log('Incident submitted:', formData)
            alert(`Incident "${formData.title}" submitted successfully!`)
          }
        }}
      />

      <DeleteIncidentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        incident={incidentToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <SubmitIncidentDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        incident={incidentToSubmit}
        onConfirm={handleSubmitConfirm}
        isSubmitting={isSubmitting}
      />

      <EditIncidentFlow
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        incident={incidentToEdit}
        onSave={handleEditSave}
        locations={locations}
      />
    </div>
  )
}
