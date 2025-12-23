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
import { Breadcrumb } from './header/Breadcrumb'
import { IncidentDetailsHeader } from './header/IncidentDetailsHeader'
import { OverviewTab } from './overview/OverviewTab'
import { CompactOverviewTab } from './overview/CompactOverviewTab'
import { IncidentAccordionSection } from './accordions/IncidentAccordionSection'
import { StepsTab } from './tabs/StepsTab'
import { AdvisorTab } from './tabs/AdvisorTab'
import type { IncidentDetailsPageProps, IncidentTab } from './types'

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-5 w-64 bg-muted-bg rounded" />

      {/* Header skeleton - DAPS: bg-elevated + shadow-md */}
      <div className="bg-elevated border border-default rounded-xl p-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="size-6 bg-muted-bg rounded" />
          <div className="flex-1">
            <div className="h-6 w-48 bg-muted-bg rounded mb-2" />
            <div className="h-4 w-96 bg-muted-bg rounded" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="h-10 w-64 bg-muted-bg rounded-lg" />

      {/* Cards grid skeleton - DAPS: bg-elevated + shadow-md */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-elevated border border-default rounded-xl p-6 h-64 shadow-md" />
        ))}
      </div>

      {/* Accordion skeleton - Surface level (one step deeper than cards) */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-surface border-l-4 border-accent rounded-r-lg" />
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
          <TabsTrigger variant="accent" value="advisor">
            Advisor
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

        {/* Advisor Tab Content */}
        <TabsContent value="advisor" className="mt-6">
          <AdvisorTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IncidentDetailsPage
