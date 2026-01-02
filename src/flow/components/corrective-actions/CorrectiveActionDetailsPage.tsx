/**
 * CorrectiveActionDetailsPage
 *
 * Full detail view for a corrective action.
 * Follows DDS depth layering rules with glass panels.
 *
 * Features:
 * - Animated grid blob background
 * - Glass panel content areas (Depth 2)
 * - Header, content tabs, timeline, and sidebar
 */

import { useState } from 'react'
import { FileText, GitBranch, ClipboardList, FolderOpen, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { CorrectiveActionHeader } from './CorrectiveActionHeader'
import { CorrectiveActionTimeline } from './CorrectiveActionTimeline'
import { CorrectiveActionSidebar } from './CorrectiveActionSidebar'
import type {
  CorrectiveAction,
  CorrectiveActionPermissions,
  TimelineEvent,
} from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionDetailsPageProps {
  /** Corrective action data */
  action: CorrectiveAction
  /** Timeline events */
  timelineEvents?: TimelineEvent[]
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Back navigation handler */
  onBack?: () => void
  /** Edit handler */
  onEdit?: () => void
  /** Submit completion handler */
  onSubmitCompletion?: () => void
  /** Request extension handler */
  onRequestExtension?: () => void
  /** Request closure handler */
  onRequestClosure?: () => void
  /** Loading state */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Tab values matching EMEX EntityDetailTabs pattern:
 * - overview: Main action information (root cause, implementation, verification)
 * - workflow: Timeline/workflow progress
 * - tasks: Related tasks (placeholder for future)
 * - documents: Evidence files
 * - audit: Audit log (placeholder for future)
 */
type TabValue = 'overview' | 'workflow' | 'tasks' | 'documents' | 'audit'

export function CorrectiveActionDetailsPage({
  action,
  timelineEvents = [],
  permissions,
  onBack,
  onEdit,
  onSubmitCompletion,
  onRequestExtension,
  onRequestClosure,
  isLoading = false,
  className,
}: CorrectiveActionDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('overview')

  if (isLoading) {
    return (
      <main className={cn('relative min-h-screen bg-page overflow-hidden', className)}>
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 p-4 md:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-surface border border-default rounded" />
            <div className="h-32 bg-surface border border-default rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-surface border border-default rounded-xl" />
              <div className="h-96 bg-surface border border-default rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      data-slot="corrective-action-details-page"
      data-testid="corrective-action-details-page"
      className={cn('relative min-h-screen bg-page overflow-hidden', className)}
    >
      {/* Animated grid blob background */}
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <CorrectiveActionHeader
          action={action}
          permissions={permissions}
          onBack={onBack}
          onEdit={onEdit}
        />

        {/* Main content area with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - tabs - Depth 2 Glass Card */}
          <section
            className={cn(
              'lg:col-span-2 rounded-xl border-2 border-accent',
              'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md'
            )}
          >
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as TabValue)}
              className="flex flex-col"
            >
              {/* Tab Header */}
              <div className="flex items-center gap-3 border-b border-default p-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
                  <ClipboardList className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-primary truncate">
                    {action.title}
                  </h2>
                  <p className="text-sm text-secondary">
                    {action.referenceNumber}
                  </p>
                </div>
              </div>

              {/* Tabs Navigation - Matches EMEX EntityDetailTabs pattern */}
              <div className="px-4 pt-4">
                <TabsList variant="accent" animated>
                  <TabsTrigger variant="accent" value="overview">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger variant="accent" value="workflow">
                    Workflow
                    {timelineEvents.length > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({timelineEvents.length})
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger variant="accent" value="tasks">
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger variant="accent" value="documents">
                    Documents
                    {action.completionEvidence &&
                      action.completionEvidence.length > 0 && (
                        <span className="ml-1.5 text-xs opacity-70">
                          ({action.completionEvidence.length})
                        </span>
                      )}
                  </TabsTrigger>
                  <TabsTrigger variant="accent" value="audit">
                    Audit Log
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab Content (was Details) */}
              <TabsContent value="overview" className="p-4 md:p-6 space-y-6">
                {/* Root Cause Analysis */}
                {(action.rootCauseCategory || action.rootCauseAnalysis) && (
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Root Cause Analysis
                    </h3>
                    {action.rootCauseCategory && (
                      <div className="text-sm mb-2">
                        <span className="text-secondary">Category: </span>
                        <span className="text-primary">
                          {action.rootCauseCategory.name}
                        </span>
                      </div>
                    )}
                    {action.rootCauseAnalysis && (
                      <div className="bg-surface border border-default rounded-lg p-4 text-sm text-primary">
                        {action.rootCauseAnalysis}
                      </div>
                    )}
                  </section>
                )}

                {/* Implementation Plan */}
                {action.implementationPlan && (
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Implementation Plan
                    </h3>
                    <div className="bg-surface border border-default rounded-lg p-4 text-sm text-primary whitespace-pre-wrap">
                      {action.implementationPlan}
                    </div>
                  </section>
                )}

                {/* Verification & Success Criteria */}
                {(action.verificationMethod || action.successCriteria) && (
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Verification
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {action.verificationMethod && (
                        <div className="bg-surface border border-default rounded-lg p-4">
                          <div className="text-xs text-secondary mb-1">
                            Verification Method
                          </div>
                          <div className="text-sm text-primary">
                            {action.verificationMethod}
                          </div>
                        </div>
                      )}
                      {action.successCriteria && (
                        <div className="bg-surface border border-default rounded-lg p-4">
                          <div className="text-xs text-secondary mb-1">
                            Success Criteria
                          </div>
                          <div className="text-sm text-primary">
                            {action.successCriteria}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Completion Notes */}
                {action.completionNotes && (
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Completion Notes
                    </h3>
                    <div className="bg-success/10 border border-success/40 rounded-lg p-4 text-sm text-primary">
                      {action.completionNotes}
                    </div>
                  </section>
                )}

                {/* Deferred Reason */}
                {action.status === 'deferred' && action.deferredReason && (
                  <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Deferral Reason
                    </h3>
                    <div className="bg-warning/10 border border-warning/40 rounded-lg p-4 text-sm text-primary">
                      {action.deferredReason}
                    </div>
                  </section>
                )}

                {/* Empty state */}
                {!action.rootCauseAnalysis &&
                  !action.implementationPlan &&
                  !action.verificationMethod &&
                  !action.completionNotes && (
                    <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-default bg-surface/50">
                      <div className="p-4 rounded-full bg-muted-bg mb-4">
                        <FileText className="h-8 w-8 text-tertiary" />
                      </div>
                      <p className="text-secondary">No additional details available</p>
                    </div>
                  )}
              </TabsContent>

              {/* Workflow Tab (was Timeline) */}
              <TabsContent value="workflow" className="p-4 md:p-6">
                <CorrectiveActionTimeline events={timelineEvents} />
              </TabsContent>

              {/* Tasks Tab (placeholder matching EMEX pattern) */}
              <TabsContent value="tasks" className="p-4 md:p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-default bg-surface/50">
                  <div className="p-4 rounded-full bg-muted-bg mb-4">
                    <ClipboardList className="h-8 w-8 text-tertiary" />
                  </div>
                  <p className="text-lg font-medium text-primary mb-1">No tasks</p>
                  <p className="text-sm text-secondary">
                    Tasks related to this corrective action will appear here
                  </p>
                </div>
              </TabsContent>

              {/* Documents Tab (was Evidence) */}
              <TabsContent value="documents" className="p-4 md:p-6">
                {action.completionEvidence &&
                action.completionEvidence.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {action.completionEvidence.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-default hover:border-accent hover:bg-accent/5 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted-bg flex items-center justify-center text-xs font-medium text-secondary uppercase">
                          {file.fileType.split('/')[1]?.slice(0, 4) || 'FILE'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-primary truncate">
                            {file.fileName}
                          </div>
                          <div className="text-xs text-tertiary">
                            {file.uploadedBy
                              ? `Uploaded by ${file.uploadedBy.firstName || 'Unknown'}`
                              : 'Uploaded'}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-default bg-surface/50">
                    <div className="p-4 rounded-full bg-muted-bg mb-4">
                      <FileText className="h-8 w-8 text-tertiary" />
                    </div>
                    <p className="text-secondary">No evidence files uploaded</p>
                  </div>
                )}
              </TabsContent>

              {/* Audit Log Tab (matches EMEX EntityDetailTabs pattern) */}
              <TabsContent value="audit" className="p-4 md:p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-default bg-surface/50">
                  <div className="p-4 rounded-full bg-muted-bg mb-4">
                    <History className="h-8 w-8 text-tertiary" />
                  </div>
                  <p className="text-lg font-medium text-primary mb-1">Audit Log</p>
                  <p className="text-sm text-secondary">
                    Detailed audit trail will be available in the full application
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Sidebar - Depth 2 Glass Card */}
          <aside className="lg:col-span-1">
            <div
              className={cn(
                'sticky top-6 rounded-xl border-2 border-accent',
                'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md p-6'
              )}
            >
              <CorrectiveActionSidebar
                action={action}
                permissions={permissions}
                onSubmitCompletion={onSubmitCompletion}
                onRequestExtension={onRequestExtension}
                onRequestClosure={onRequestClosure}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CorrectiveActionDetailsPage
