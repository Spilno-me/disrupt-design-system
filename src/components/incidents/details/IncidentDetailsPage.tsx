/**
 * IncidentDetailsPage - Full incident details page for Flow EHS
 *
 * Comprehensive page displaying all incident information including:
 * - Breadcrumb navigation
 * - Header with incident ID, description, and stats
 * - Tab navigation (Overview, Steps, Advisor)
 * - Overview cards (Location, Info, Description)
 * - Accordion sections (Workflows, Form Submissions, Activities)
 *
 * @example
 * ```tsx
 * <IncidentDetailsPage
 *   incident={incidentData}
 *   activeTab="overview"
 *   onTabChange={(tab) => setActiveTab(tab)}
 *   onNavigate={(path) => router.push(path)}
 *   onRefresh={() => refetch()}
 *   onLocationClick={(id) => navigate(`/locations/${id}`)}
 *   onFacilityClick={(id) => navigate(`/facilities/${id}`)}
 *   onReporterClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import { Badge } from '../../ui/badge'
import { Skeleton } from '../../ui/Skeleton'
import { Breadcrumb } from './header/Breadcrumb'
import { IncidentDetailsHeader } from './header/IncidentDetailsHeader'
import { OverviewTab } from './overview/OverviewTab'
import { CompactOverviewTab } from './overview/CompactOverviewTab'
import { IncidentAccordionSection } from './accordions/IncidentAccordionSection'
import { StepsTab } from './tabs/StepsTab'
// AdvisorTab removed - AI Assistant is now a global floating component
// import { AdvisorTab } from './tabs/AdvisorTab'
import type { IncidentDetailsPageProps, IncidentTab } from './types'

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-5 w-64" rounded="md" />

      {/* Header skeleton - mimics IncidentDetailsHeader structure */}
      <div className="bg-elevated border border-default rounded-xl p-4 shadow-md">
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 flex-shrink-0" rounded="lg" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" rounded="md" />
              <Skeleton className="h-5 w-16" rounded="full" />
            </div>
            <Skeleton className="h-4 w-[70%] max-w-md" rounded="md" />
          </div>
          {/* Stats skeleton on right - matches actual layout: value + icon on top, label below */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Steps: "0/2" + icon */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-8" rounded="md" />
              </div>
              <Skeleton className="h-3 w-10" rounded="sm" />
            </div>
            {/* Documents: "2" + icon */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-4" rounded="md" />
                <Skeleton className="size-4" rounded="md" />
              </div>
              <Skeleton className="h-3 w-16" rounded="sm" />
            </div>
            {/* Days Open: "1" + icon */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-4" rounded="md" />
                <Skeleton className="size-4" rounded="md" />
              </div>
              <Skeleton className="h-3 w-16" rounded="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1">
        <Skeleton className="h-9 w-24" rounded="lg" />
        <Skeleton className="h-9 w-20" rounded="lg" />
        <Skeleton className="h-9 w-20" rounded="lg" />
      </div>

      {/* Cards grid skeleton - matches compact 2-column layout (default) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">
        {/* Left: IncidentSummaryCard skeleton (info + description) */}
        <div className="bg-elevated border border-default rounded-xl p-5 shadow-md space-y-5">
          {/* Card title */}
          <Skeleton className="h-5 w-40" rounded="md" />

          {/* Metadata grid - Row 1: Status, Severity, Type, Reporter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-12" rounded="sm" />
              <Skeleton className="h-6 w-16" rounded="full" />
            </div>
            {/* Severity */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-14" rounded="sm" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-4" rounded="full" />
                <Skeleton className="h-4 w-10" rounded="md" />
              </div>
            </div>
            {/* Type */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-10" rounded="sm" />
              <Skeleton className="h-4 w-24" rounded="md" />
            </div>
            {/* Reporter */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" rounded="sm" />
              <Skeleton className="h-4 w-24" rounded="md" />
            </div>
          </div>

          {/* Metadata Row 2: Date created */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" rounded="sm" />
            <Skeleton className="h-4 w-40" rounded="md" />
          </div>

          {/* Divider */}
          <div className="h-px bg-subtle" />

          {/* Description section */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" rounded="md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" rounded="md" />
              <Skeleton className="h-4 w-full" rounded="md" />
              <Skeleton className="h-4 w-[95%]" rounded="md" />
              <Skeleton className="h-4 w-[90%]" rounded="md" />
              <Skeleton className="h-4 w-3/4" rounded="md" />
            </div>
          </div>
        </div>

        {/* Right: CompactLocationCard skeleton (map + location details) */}
        <div className="bg-elevated border border-default rounded-xl shadow-md overflow-hidden">
          {/* Map skeleton - 160px height like the real map */}
          <Skeleton className="w-full h-40" rounded="none" />

          {/* Location details */}
          <div className="p-4 space-y-3">
            {/* Location name */}
            <div className="flex items-start gap-2">
              <Skeleton className="size-4 mt-0.5 flex-shrink-0" rounded="md" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-14" rounded="sm" />
                <Skeleton className="h-4 w-full" rounded="md" />
              </div>
            </div>
            {/* Facility */}
            <div className="flex items-start gap-2">
              <Skeleton className="size-4 mt-0.5 flex-shrink-0" rounded="md" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-12" rounded="sm" />
                <Skeleton className="h-4 w-3/4" rounded="md" />
              </div>
            </div>
            {/* What3words */}
            <div className="flex items-start gap-2">
              <Skeleton className="size-4 mt-0.5 flex-shrink-0" rounded="md" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-20" rounded="sm" />
                <Skeleton className="h-4 w-2/3" rounded="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion skeleton - 4 sections with metadata */}
      <div className="space-y-2">
        {[
          { width: 'w-40', hasMetadata: true },  // Documents & Evidence
          { width: 'w-24', hasMetadata: true },  // Workflows
          { width: 'w-36', hasMetadata: true },  // Form Submissions
          { width: 'w-20', hasMetadata: false }, // Activities
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 h-14 px-4 bg-surface border-l-4 border-accent rounded-r-lg">
            <Skeleton className={`h-5 ${item.width}`} rounded="md" />
            {item.hasMetadata && (
              <>
                <Skeleton className="h-3 w-32 hidden sm:block" rounded="sm" />
                <Skeleton className="h-3 w-48 hidden md:block" rounded="sm" />
              </>
            )}
            <div className="flex-1" />
            <Skeleton className="size-5" rounded="md" />
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * IncidentDetailsPage - Full incident details view
 */
export function IncidentDetailsPage({
  incident,
  activeTab: controlledTab,
  compactLayout = true,
  onTabChange,
  onNavigate,
  onEdit,
  onRefresh,
  onLocationClick,
  onFacilityClick,
  onReporterClick,
  isLoading = false,
  className,
  // Document props
  documents = [],
  userContext,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentView,
  // Workflow props
  detailedWorkflows,
  onWorkflowAttachmentView,
  onWorkflowAttachmentDownload,
  onWorkflowCancel,
  onWorkflowPersonClick,
  onWorkflowStageClick,
  // Form Submission props
  extendedFormSubmissions,
  onFormSubmissionView,
  onFormSubmissionDownload,
  onFormSubmissionPersonClick,
  // Activity props
  extendedActivities,
  onActivitiesExport,
  onActivityPersonClick,
  // Steps tab props
  incidentSteps,
  onStepNextStep,
  onStepAssigneeClick,
  onStepReporterClick,
  onStepLocationClick,
}: IncidentDetailsPageProps) {
  // Internal tab state (used if not controlled)
  const [internalTab, setInternalTab] = useState<IncidentTab>('overview')
  const activeTab = controlledTab ?? internalTab

  // Handle tab change
  const handleTabChange = (value: string) => {
    const tab = value as IncidentTab
    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalTab(tab)
    }
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      label: 'Incidents',
      onClick: () => onNavigate?.('/incidents'),
    },
    {
      label: incident?.incidentId || 'Loading...',
      onClick: () => onNavigate?.(`/incidents/${incident?.id}`),
    },
    {
      label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
    },
  ]

  // Show loading skeleton
  if (isLoading || !incident) {
    return (
      <div className={cn('space-y-6', className)}>
        <LoadingSkeleton />
      </div>
    )
  }

  // Calculate steps count for badge
  const pendingSteps = incident.stepsTotal - incident.stepsCompleted

  return (
    <div className={cn('space-y-6', className)}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Incident Header */}
      <IncidentDetailsHeader
        incidentId={incident.incidentId}
        title={incident.title}
        severity={incident.severity}
        stepsCompleted={incident.stepsCompleted}
        stepsTotal={incident.stepsTotal}
        documentsCount={incident.documentsCount}
        daysOpen={incident.daysOpen}
        onRefresh={onRefresh}
      />

      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList variant="accent" animated>
          <TabsTrigger variant="accent" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger variant="accent" value="steps">
            Steps
            {pendingSteps > 0 && (
              <Badge variant="secondary" size="sm" className="ml-1.5">
                {pendingSteps}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Cards Grid - Compact or Original layout */}
          {compactLayout ? (
            <CompactOverviewTab
              incident={incident}
              onLocationClick={onLocationClick}
              onFacilityClick={onFacilityClick}
              onReporterClick={onReporterClick}
              onEdit={onEdit}
            />
          ) : (
            <OverviewTab
              incident={incident}
              onLocationClick={onLocationClick}
              onFacilityClick={onFacilityClick}
              onReporterClick={onReporterClick}
              onEdit={onEdit}
            />
          )}

          {/* Accordion Sections */}
          <IncidentAccordionSection
            workflows={incident.workflows}
            detailedWorkflows={detailedWorkflows}
            formSubmissions={incident.formSubmissions}
            extendedFormSubmissions={extendedFormSubmissions}
            activities={incident.activities}
            extendedActivities={extendedActivities}
            documents={documents}
            incidentStatus={incident.status}
            incidentSeverity={incident.severity}
            userContext={userContext}
            onDocumentUpload={onDocumentUpload}
            onDocumentDelete={onDocumentDelete}
            onDocumentDownload={onDocumentDownload}
            onDocumentView={onDocumentView}
            onWorkflowAttachmentView={onWorkflowAttachmentView}
            onWorkflowAttachmentDownload={onWorkflowAttachmentDownload}
            onWorkflowCancel={onWorkflowCancel}
            onWorkflowPersonClick={onWorkflowPersonClick}
            onWorkflowStageClick={onWorkflowStageClick}
            onFormSubmissionView={onFormSubmissionView}
            onFormSubmissionDownload={onFormSubmissionDownload}
            onFormSubmissionPersonClick={onFormSubmissionPersonClick}
            onActivitiesExport={onActivitiesExport}
            onActivityPersonClick={onActivityPersonClick}
            defaultExpanded={[]}
          />
        </TabsContent>

        {/* Steps Tab Content */}
        <TabsContent value="steps" className="mt-6">
          <StepsTab
            steps={incidentSteps}
            onNextStep={onStepNextStep}
            onAssigneeClick={onStepAssigneeClick}
            onReporterClick={onStepReporterClick}
            onLocationClick={onStepLocationClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IncidentDetailsPage
