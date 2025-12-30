/**
 * TrainingPage - Main Training Management Page
 *
 * Central hub for training management with tabbed navigation.
 * Includes course catalog, requirements configuration, and compliance dashboard.
 *
 * @example
 * ```tsx
 * <TrainingPage
 *   courses={courses}
 *   packages={packages}
 *   requirements={requirements}
 *   stats={stats}
 *   userCompliance={compliance}
 *   roles={roles}
 *   locations={locations}
 * />
 * ```
 */

import * as React from 'react'
import { GraduationCap, BookOpen, ClipboardCheck, BarChart3, Plus, RefreshCw } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { CoursesTab } from './tabs/CoursesTab'
import { RequirementsTab } from './tabs/RequirementsTab'
import { ComplianceTab } from './tabs/ComplianceTab'
import type { TrainingPageProps } from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function TrainingPage({
  courses,
  packages,
  requirements,
  stats,
  userCompliance,
  locationCompliance,
  roleCompliance,
  roles,
  locations,
  isLoading = false,
  onCourseCreate,
  onCourseUpdate,
  onCourseDelete,
  onCourseArchive,
  onPackageCreate,
  onPackageUpdate,
  onPackageDelete,
  onRequirementCreate,
  onRequirementUpdate,
  onRequirementDelete,
  onRequirementToggle,
  onViewRequirement,
  onRecordCompletion,
  onWaiveRequirement,
  onViewUser,
  onViewCourse,
}: TrainingPageProps) {
  const [activeTab, setActiveTab] = React.useState('courses')
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Handler for refresh button
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    // Simulate refresh delay - in real app, would refetch data
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }, [])

  // Calculate compliance summary
  const complianceSummary = stats?.compliance ?? {
    totalUsers: userCompliance.length,
    compliantUsers: userCompliance.filter((u) => u.overallStatus === 'compliant').length,
    expiringSoonUsers: userCompliance.filter((u) => u.overallStatus === 'expiring_soon').length,
    nonCompliantUsers: userCompliance.filter((u) => u.overallStatus === 'non_compliant').length,
    overallPercentage: 0,
  }

  return (
    <div
      data-slot="training-page"
      className="flex flex-col gap-6 p-4 md:p-6"
    >
      {/* Page Header */}
      <PageActionPanel
        icon={<GraduationCap className="w-6 h-6 md:w-8 md:h-8" />}
        iconClassName="text-accent"
        title="Training Management"
        subtitle="Manage training courses, requirements, and track compliance"
        primaryAction={
          <Button
            size="sm"
            onClick={() => console.log('Add Course')}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            <span className="sr-only sm:not-sr-only">Add Course</span>
            <span className="sm:sr-only">Add</span>
          </Button>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={cn(
                'size-4',
                isRefreshing && 'animate-spin'
              )}
            />
            Refresh
          </Button>
        }
      />

      {/* Compliance Summary Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted-bg/50 border border-accent/20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary">Compliance:</span>
          <Badge
            variant={
              complianceSummary.overallPercentage >= 90
                ? 'success'
                : complianceSummary.overallPercentage >= 70
                ? 'warning'
                : 'destructive'
            }
          >
            {complianceSummary.overallPercentage || Math.round((complianceSummary.compliantUsers / Math.max(complianceSummary.totalUsers, 1)) * 100)}%
          </Badge>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-success">
            {complianceSummary.compliantUsers} compliant
          </span>
          <span className="text-warning">
            {complianceSummary.expiringSoonUsers} expiring
          </span>
          <span className="text-destructive">
            {complianceSummary.nonCompliantUsers} non-compliant
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList variant="accent" animated className="w-full max-w-2xl">
          <TabsTrigger
            variant="accent"
            value="courses"
            className="gap-2"
          >
            <BookOpen className="size-4" />
            <span>Courses</span>
            {courses.length > 0 && (
              <Badge
                variant="secondary"
                size="sm"
                className="ml-1 rounded-xs bg-muted-bg text-primary"
              >
                {courses.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            variant="accent"
            value="requirements"
            className="gap-2"
          >
            <ClipboardCheck className="size-4" />
            <span>Requirements</span>
            {requirements.length > 0 && (
              <Badge
                variant="secondary"
                size="sm"
                className="ml-1 rounded-xs bg-muted-bg text-primary"
              >
                {requirements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            variant="accent"
            value="compliance"
            className="gap-2"
          >
            <BarChart3 className="size-4" />
            <span>Compliance</span>
            {complianceSummary.nonCompliantUsers > 0 && (
              <Badge
                variant="destructive"
                size="sm"
                className="ml-1 rounded-xs"
              >
                {complianceSummary.nonCompliantUsers}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab Content */}
        <TabsContent value="courses" className="mt-6">
          <CoursesTab
            courses={courses}
            isLoading={isLoading}
            onCourseCreate={onCourseCreate}
            onCourseUpdate={onCourseUpdate}
            onCourseDelete={onCourseDelete}
            onCourseArchive={onCourseArchive}
          />
        </TabsContent>

        {/* Requirements Tab Content */}
        <TabsContent value="requirements" className="mt-6">
          <RequirementsTab
            requirements={requirements}
            courses={courses}
            packages={packages}
            roles={roles}
            locations={locations}
            isLoading={isLoading}
            onRequirementCreate={onRequirementCreate}
            onRequirementUpdate={onRequirementUpdate}
            onRequirementDelete={onRequirementDelete}
            onRequirementToggle={onRequirementToggle}
            onViewRequirement={onViewRequirement}
          />
        </TabsContent>

        {/* Compliance Tab Content */}
        <TabsContent value="compliance" className="mt-6">
          <ComplianceTab
            stats={stats}
            userCompliance={userCompliance}
            locationCompliance={locationCompliance}
            roleCompliance={roleCompliance}
            isLoading={isLoading}
            onViewUser={onViewUser}
            onRecordCompletion={onRecordCompletion}
            onWaiveRequirement={onWaiveRequirement}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

TrainingPage.displayName = 'TrainingPage'

export default TrainingPage
