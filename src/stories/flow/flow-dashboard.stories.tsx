/**
 * Flow EHS Dashboard Stories
 *
 * Demonstrates the Flow EHS application using existing DDS components.
 * Uses EHSAnalyticsDashboard as the primary dashboard component.
 *
 * NOTE: This integration story uses dynamically generated incident/step data
 * for a full app prototype experience. Shared mock data (roles, permissions,
 * users) is imported from `../../flow/data` which re-exports from the API layer.
 * The step generation is intentionally derived from generated incidents to test
 * realistic UI scenarios with consistent relationships.
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  LayoutDashboard,
  Waypoints,
  TriangleAlert,
  Settings,
  Users,
  ShieldCheck,
  BookOpen,
  MapPin,
  Files,
  HelpCircle,
  Camera,
  Shield,
  ClipboardCheck,
  Download,
  // EHS Analytics Dashboard icons
  Sparkles,
  ClipboardList,
  Globe,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Calendar,
  Eye,
  EyeOff,
  Settings2,
  PencilLine,
  Zap,
  Activity,
  Target,
  CheckCircle2,
  Plus,
  Hourglass,
  Contact2,
} from 'lucide-react'
import { AppLayoutShell } from '../../templates/layout/AppLayoutShell'
import { PAGE_META, pageDescription, IPhoneMobileFrame } from '../_infrastructure'
import {
  IncidentManagementTable,
  type Incident,
} from '../../components/ui/table'
import { SearchFilter } from '../../components/shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../components/shared/SearchFilter/types'
import {
  QuickFilter,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
} from '../../components/ui/QuickFilter'
import { PageActionPanel } from '../../components/ui/PageActionPanel'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog'
import { FlowMobileNav, type MoreMenuItem } from '../../flow/components/mobile-nav-bar'
import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  IncidentReportingFlow,
  IncidentDetailsPage,
  DeleteIncidentDialog,
  SubmitIncidentDialog,
  EditIncidentFlow,
  IncidentsPage as IncidentsPageComponent,
  StepsPage,
  type Step,
  type IncidentDetail,
  type EvidenceDocument,
  type DocumentUserContext,
  type DetailedWorkflow,
  type WorkflowStepAttachment,
  type FormSubmissionData,
  type ExtendedFormSubmission,
  type IncidentToDelete,
  type IncidentToSubmit,
  type IncidentToEdit,
} from '../../components/incidents'
import {
  EHSAnalyticsDashboard,
  type BreakdownItem,
  type AgingItem,
  type TrendingItem,
  type LocationRisk,
  type WorkloadItem,
  type UpcomingTask,
  type PriorityTask,
  type DashboardViewMode,
  type DashboardPreset,
  // Edit Mode
  DashboardEditProvider,
  useDashboardEdit,
  EditableWidget,
  ReorderableWidget,
  EditModeToolbar,
  WidgetSettingsPanel,
  type WidgetConfig,
} from '../../flow/components/dashboard'
import { Reorder, AnimatePresence, motion } from 'motion/react'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { StatsCard } from '../../components/leads/StatsCard'
import {
  KPICard,
  BreakdownCard,
  AgingCard,
  TrendingCard,
  RiskHeatmapCard,
  WorkloadCard,
  UpcomingTasksCard,
  SectionHeader,
} from '../../flow/components/dashboard'
import {
  UsersPage,
  type User,
  type Role,
  type Permission,
  type LocationNode,
  type UserStats,
  type UserActivity,
  type EnhancedPermission,
} from '../../flow/components/users'
import {
  DictionaryPage,
  type DictionaryCategory,
  type DictionaryEntry,
} from '../../flow/components/dictionary'
import {
  seedDictionaryCategories as mockCategories,
  seedDictionaryEntries as mockAllEntries,
  getEntriesByCategory as getEntriesByCategoryId,
} from '@/api'
import {
  LocationsPage,
  type Location,
  type LocationFormData,
} from '../../flow/components/locations'
import { seedLocationsTree as sharedMockLocations } from '@/api'
import {
  EntityTemplatesPage,
  type EntityTemplate,
} from '../../flow/components/entity-templates'
import {
  DirectoryPage,
  UserProfilePage,
  type DirectoryPerson,
  type LocationWithPeople,
} from '../../flow/components/directory'
import {
  AIAssistantProvider,
  AIAssistantFab,
  AIAssistantPanel,
  AIAssistantQuickActions,
  useAIAssistant,
  type PageContext,
  type ContextualAction,
} from '../../components/shared/AIAssistant'
import {
  seedRoles as mockRoles,
  seedPermissions as mockPermissions,
  seedEnhancedPermissions as mockEnhancedPermissions,
  seedUsers as mockUsers,
  // Documents & Evidence
  seedDocuments as mockDocuments,
  seedUserContext as mockUserContext,
  // Forms
  seedIncidentReportFormData as mockIncidentReportFormData,
  seedExtendedFormSubmissions as mockExtendedFormSubmissions,
  // Workflows
  seedDetailedWorkflows as mockDetailedWorkflows,
  // Entity Templates
  seedEntityTemplates as mockEntityTemplates,
  // User Metadata
  seedUserStats as mockUserStats,
  seedDepartments as mockDepartments,
  seedJobTitles as mockJobTitles,
  seedUserActivities as mockUserActivities,
  seedLocationTree as mockLocationTree,
  // Incident/Step Generators (for table and steps page)
  generateIncidentsForTable,
  generateStepsForTableIncidents,
  splitStepsByAssignee,
  getIncidentLocationSelectOptions,
  // EHS Dashboard Seed Data
  seedEhsKpis,
  seedEhsActivity,
  seedEhsQuickActions,
  seedEhsAnalyticsKpis,
  seedEhsIncidentStats,
  seedEhsGeneralStats,
  seedEhsSeverityBreakdown,
  seedEhsFocusFour,
  seedEhsAgingData,
  seedEhsActionStats,
  seedEhsTrendingIncidents,
  seedEhsLocationRisks,
  seedEhsEmployeeWorkload,
  seedEhsUpcomingTasks,
  seedEhsPriorityTasks,
  // Flow App Configuration
  seedDashboardWidgets,
  seedKpiThresholds,
  seedSparklineData,
  seedIncidentFilterGroups,
  seedAiPageContexts,
  type DashboardWidgetConfig,
} from '@/api'
import {
  convertToLocationWithPeople,
  createUserProfileData,
  getUserById,
  convertToIncidentDetail,
} from '../../flow/data'

// =============================================================================
// FLOW PAGE CONTENT WRAPPER
// =============================================================================

/**
 * Simple page content wrapper for Flow app pages.
 * Replaces DashboardPage when only layout padding is needed.
 */
interface FlowPageContentProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

function FlowPageContent({ title, subtitle, children }: FlowPageContentProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {title && <h1 className="text-2xl font-semibold text-primary">{title}</h1>}
          {subtitle && <span className="text-sm text-secondary">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

// =============================================================================
// MOCK DATA - All imported from @/api
// =============================================================================
// - mockDocuments, mockUserContext, mockIncidentReportFormData
// - mockExtendedFormSubmissions, mockDetailedWorkflows
// - generateIncidentsForTable, generateStepsForTableIncidents, splitStepsByAssignee

// Generate 100 incidents using the API generator
const incidentData: Incident[] = generateIncidentsForTable(100)

// =============================================================================
// EHS DATA - Derived from API seed data with icons added in component
// =============================================================================

// Icon mapping for EHS KPIs
const kpiIconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-5 h-5 text-teal" />,
  alert: <TriangleAlert className="w-5 h-5 text-warning" />,
  waypoints: <Waypoints className="w-5 h-5 text-info" />,
  users: <Users className="w-5 h-5 text-success" />,
  'alert-circle': <AlertCircle className="w-5 h-5" />,
  'shield-check': <ShieldCheck className="w-5 h-5" />,
  refresh: <RefreshCw className="w-5 h-5" />,
  'map-pin': <MapPin className="w-5 h-5 text-info" />,
}

// Icon mapping for quick actions
const quickActionIconMap: Record<string, React.ReactNode> = {
  alert: <TriangleAlert className="w-4 h-4" />,
  waypoints: <Waypoints className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  plus: <Plus className="w-4 h-4" />,
  clipboard: <ClipboardCheck className="w-4 h-4" />,
}

// Dashboard KPIs with icons
const ehsKpis = seedEhsKpis.map((kpi) => ({
  ...kpi,
  icon: kpi.iconId ? kpiIconMap[kpi.iconId] : null,
}))

// Activity feed - no icons needed, uses type for styling
const ehsActivity = seedEhsActivity

// Quick actions with icons and click handlers
const ehsQuickActions = seedEhsQuickActions.map((action) => ({
  ...action,
  icon: quickActionIconMap[action.iconId] || null,
  onClick: () => alert(`${action.label}...`),
}))

// Analytics KPIs with icons (title mapped from label)
const ehsAnalyticsKpiData = seedEhsAnalyticsKpis.map((kpi) => ({
  ...kpi,
  title: kpi.label,
  icon: kpi.iconId ? kpiIconMap[kpi.iconId] : null,
}))

// Incident stats (title mapped from label)
const ehsAnalyticsIncidentData = seedEhsIncidentStats.map((stat) => ({
  ...stat,
  title: stat.label,
}))

// Breakdown data - direct mapping
const ehsAnalyticsSeverityBreakdown: BreakdownItem[] = seedEhsSeverityBreakdown
const ehsAnalyticsFocusFour: BreakdownItem[] = seedEhsFocusFour

// Corrective action stats
const ehsAnalyticsActionData = seedEhsActionStats

// Aging data - direct mapping
const ehsAnalyticsAgingData: AgingItem[] = seedEhsAgingData

// General stats with icons (title mapped from label)
const ehsAnalyticsGeneralData = seedEhsGeneralStats.map((stat) => ({
  ...stat,
  title: stat.label,
  icon: stat.iconId ? kpiIconMap[stat.iconId] : null,
}))

// Trending, Risk, Workload, Tasks - direct mappings
const ehsAnalyticsTrendingIncidents: TrendingItem[] = seedEhsTrendingIncidents
const ehsAnalyticsLocationRisks: LocationRisk[] = seedEhsLocationRisks
const ehsAnalyticsEmployeeWorkload: WorkloadItem[] = seedEhsEmployeeWorkload
const ehsAnalyticsUpcomingTasks: UpcomingTask[] = seedEhsUpcomingTasks

// My Priority Tasks - direct mapping
const ehsAnalyticsMyPriorityTasks: PriorityTask[] = seedEhsPriorityTasks

// =============================================================================
// EDITABLE DASHBOARD - Wrapper with Edit Mode functionality
// =============================================================================

// Widget configuration from API (cast to WidgetConfig for component compatibility)
const initialDashboardWidgets: WidgetConfig[] = seedDashboardWidgets as WidgetConfig[]

/**
 * EditableDashboardContent - The actual dashboard content with edit mode support
 */
function EditableDashboardContent({ onAddTask }: { onAddTask?: () => void }) {
  const {
    isEditMode,
    widgets,
    enterEditMode,
    reorderWidgets,
  } = useDashboardEdit()

  const [settingsPanelWidget, setSettingsPanelWidget] = useState<string | null>(null)

  // Get widgets by section, sorted by order
  const getWidgetsBySection = (section: string) =>
    widgets
      .filter((w) => w.section === section)
      .sort((a, b) => a.order - b.order)

  // Sparkline and threshold data from API
  const sparklineData = seedSparklineData
  const thresholds = seedKpiThresholds

  // Current period progress (simulating day 20 of 31 in December)
  const periodProgress = 65

  // Render widget content based on type and ID
  const renderWidgetContent = (widget: WidgetConfig) => {
    // Priority widget - "My Priority" card showing urgent items
    if (widget.id === 'my-priority') {
      const tasks = ehsAnalyticsMyPriorityTasks
      const overdueCount = tasks.filter((t) => t.type === 'overdue').length
      const dueTodayCount = tasks.filter((t) => t.type === 'due-today').length
      const criticalCount = tasks.filter((t) => t.type === 'critical').length

      if (tasks.length === 0) {
        return (
          <div className="col-span-full sm:col-span-2 bg-success-tint dark:bg-success/10 rounded-xl p-6 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-success-dark dark:text-success">All caught up!</h3>
                <p className="text-sm text-success-dark/70 dark:text-success/70">
                  No urgent items requiring your attention
                </p>
              </div>
            </div>
          </div>
        )
      }

      return (
        <div className="bg-surface rounded-xl p-4 border border-default shadow-sm h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-primary">My Priority</h3>
            </div>
            <span className="text-xs text-secondary">{tasks.length} items</span>
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
                <AlertCircle className="w-3 h-3" />
                {overdueCount} overdue
              </span>
            )}
            {dueTodayCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-warning/10 text-warning-dark dark:text-warning rounded-full">
                <Clock className="w-3 h-3" />
                {dueTodayCount} due today
              </span>
            )}
            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
                <Zap className="w-3 h-3" />
                {criticalCount} critical
              </span>
            )}
          </div>

          {/* Task list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tasks.slice(0, 5).map((task) => (
              <button
                key={task.id}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted-bg transition-colors text-left"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.type === 'overdue' ? 'bg-error' :
                    task.type === 'due-today' ? 'bg-warning' :
                    task.type === 'critical' ? 'bg-error' :
                    'bg-accent'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary truncate">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-secondary">{task.dueDate}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // KPI widgets - Enhanced with status zones, temporal progress, and thresholds
    if (widget.id === 'kpi-ltir') {
      return (
        <KPICard
          title="Lost Time Injury Rate"
          value={0}
          icon={<AlertCircle className="w-5 h-5" />}
          isHero
          zeroIsCelebratory
          sparklineData={sparklineData.ltir}
          isNegativeMetric
          trendDirection="down"
          showStatusZones
          thresholds={thresholds.ltir}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'kpi-trir') {
      return (
        <KPICard
          title="Total Recordable Incidents"
          value={1.2}
          icon={<TriangleAlert className="w-5 h-5" />}
          zeroIsCelebratory
          sparklineData={sparklineData.trir}
          isNegativeMetric
          trendDirection="down"
          trend="-0.6"
          showStatusZones
          thresholds={thresholds.trir}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'kpi-nmr') {
      return (
        <KPICard
          title="Near Miss Rate"
          value={4.8}
          icon={<ShieldCheck className="w-5 h-5" />}
          sparklineData={sparklineData.nmr}
          trendDirection="up"
          trend="+1.6"
          showStatusZones
          thresholds={thresholds.nmr}
          periodProgress={periodProgress}
          statusMessages={{ success: 'Great reporting culture!' }}
        />
      )
    }
    if (widget.id === 'kpi-oca') {
      return (
        <KPICard
          title="Overdue CA"
          value={3}
          icon={<RefreshCw className="w-5 h-5" />}
          zeroIsCelebratory
          sparklineData={sparklineData.oca}
          isNegativeMetric
          trendDirection="down"
          trend="-5"
          showStatusZones
          thresholds={thresholds.oca}
          periodProgress={periodProgress}
          statusMessages={{ warning: '3 actions need attention' }}
        />
      )
    }

    // Incident widgets - Enhanced with status zones
    if (widget.id === 'incident-total') {
      return <KPICard title="Total Incidents" value={47} description="YTD recorded incidents" />
    }
    if (widget.id === 'incident-active') {
      return (
        <KPICard
          title="Active Incidents"
          value={12}
          trend="-2"
          trendDirection="down"
          isNegativeMetric
          sparklineData={sparklineData.activeIncidents}
          showStatusZones
          thresholds={thresholds.activeIncidents}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'incident-high') {
      return (
        <KPICard
          title="High Severity"
          value={0}
          zeroIsCelebratory
          thresholds={{ warning: 1, critical: 3 }}
          isNegativeMetric
        />
      )
    }
    if (widget.id === 'incident-lti') {
      return (
        <KPICard
          title="Days Since Last LTI"
          value={127}
          isPositive
          sparklineData={sparklineData.daysSinceLti}
          trendDirection="up"
          statusMessages={{ success: 'Keep the streak going!' }}
        />
      )
    }
    if (widget.id === 'breakdown-severity') {
      return <BreakdownCard icon={<Zap />} title="Severity Breakdown" total={ehsAnalyticsSeverityBreakdown.reduce((sum, i) => sum + i.value, 0)} items={ehsAnalyticsSeverityBreakdown} zeroIsCelebratory={false} />
    }
    if (widget.id === 'breakdown-focus') {
      return <BreakdownCard icon={<Target />} title="Focus Four Incidents" total={ehsAnalyticsFocusFour.reduce((sum, i) => sum + i.value, 0)} items={ehsAnalyticsFocusFour} zeroIsCelebratory={false} />
    }

    // Action widgets
    if (widget.id === 'action-total') {
      return <StatsCard title="Total CA" value={89} description="Total corrective actions" />
    }
    if (widget.id === 'action-completed') {
      return <StatsCard title="Completed CA" value={67} description="Completed and verified" />
    }
    if (widget.id === 'action-rate') {
      return <StatsCard title="CA Close-Out Rate" value="75.3%" description="Target: 85%" />
    }
    if (widget.id === 'action-progress') {
      return <StatsCard title="CA In Progress" value={15} description="Currently in progress" />
    }
    if (widget.id === 'action-notstarted') {
      return <StatsCard title="CA Not Started" value={7} description="Awaiting assignment" />
    }
    if (widget.id === 'aging-ca') {
      return <AgingCard items={ehsAnalyticsAgingData} />
    }

    // General widgets
    if (widget.id === 'general-locations') {
      return <KPICard title="Total Locations" value={24} description="Active facilities" icon={<MapPin className="w-5 h-5 text-info" />} />
    }
    if (widget.id === 'general-users') {
      return <KPICard title="Active Users" value={156} description="This month" icon={<Users className="w-5 h-5 text-info" />} />
    }

    // Analytics widgets
    if (widget.id === 'trending-types') {
      return <TrendingCard title="Incident Types" total={ehsAnalyticsTrendingIncidents.reduce((sum, i) => sum + i.count, 0)} items={ehsAnalyticsTrendingIncidents} />
    }
    if (widget.id === 'heatmap-risk') {
      return <RiskHeatmapCard items={ehsAnalyticsLocationRisks} />
    }
    if (widget.id === 'workload-team') {
      return <WorkloadCard items={ehsAnalyticsEmployeeWorkload} />
    }
    if (widget.id === 'tasks-upcoming') {
      return <UpcomingTasksCard tasks={ehsAnalyticsUpcomingTasks} onAddTask={onAddTask} />
    }

    return (
      <div className="h-full flex items-center justify-center p-4 bg-muted-bg rounded-lg border border-dashed border-default">
        <span className="text-muted text-sm">Unknown widget: {widget.id}</span>
      </div>
    )
  }

  // Section rendering
  const renderSection = (
    sectionId: string,
    icon: React.ReactNode,
    title: string,
    description: string,
    gridClassName: string
  ) => {
    const sectionWidgets = getWidgetsBySection(sectionId)
    if (sectionWidgets.length === 0) return null

    const visibleWidgets = isEditMode ? sectionWidgets : sectionWidgets.filter((w) => w.visible)
    if (visibleWidgets.length === 0) return null

    const widgetIds = visibleWidgets.map((w) => w.id)

    return (
      <section>
        <SectionHeader icon={icon} title={title} description={description} />
        {isEditMode ? (
          <Reorder.Group
            axis="x"
            values={widgetIds}
            onReorder={(newOrder) => reorderWidgets(sectionId, newOrder)}
            className={gridClassName}
            as="div"
          >
            <AnimatePresence mode="popLayout">
              {visibleWidgets.map((widget) => (
                <ReorderableWidget
                  key={widget.id}
                  value={widget.id}
                  id={widget.id}
                  size={widget.size}
                  visible={widget.visible}
                  onSettingsOpen={() => setSettingsPanelWidget(widget.id)}
                >
                  {renderWidgetContent(widget)}
                </ReorderableWidget>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className={gridClassName}>
            {visibleWidgets.map((widget) => (
              <div key={widget.id}>{renderWidgetContent(widget)}</div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="relative min-h-screen bg-page dark:bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <EditModeToolbar />

      {/* Header - PageActionPanel for consistent styling with incidents page */}
      <div className="px-6 pt-6">
        <PageActionPanel
          icon={<LayoutDashboard className="w-5 h-5" />}
          iconClassName="text-accent"
          title="Welcome to your Flow"
          subtitle={
            isEditMode
              ? 'Drag widgets to reorder. Click the menu (⋮) on widgets for more options.'
              : 'Manage your Environmental, Health & Safety operations efficiently.'
          }
          primaryAction={
            !isEditMode ? (
              <Button variant="ghost" size="sm" className="gap-2" onClick={enterEditMode}>
                <PencilLine className="w-4 h-4" />
                Customize Dashboard
              </Button>
            ) : undefined
          }
        />
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/10 border-b border-accent/20 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <p className="text-sm text-accent-strong font-medium">Edit Mode Active</p>
              <p className="text-sm text-muted hidden sm:block">
                Drag the handle on widgets to reorder. Use the ⋮ menu for more options.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Sections */}
      <div className="relative z-[1] p-6 space-y-8">
        {renderSection('priority', <Zap />, 'Act Now', 'Items requiring your immediate attention', 'grid grid-cols-1 sm:grid-cols-2 gap-4')}
        {renderSection('kpis', <Sparkles />, 'Key Performance Indicators', 'Critical safety and performance metrics', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
        {renderSection('incidents', <TriangleAlert />, 'Incident Overview', 'Track and monitor safety incidents', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4')}
        {renderSection('actions', <ClipboardList />, 'Action Metrics', 'Corrective action tracking and completion rates', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4')}
        {renderSection('general', <Globe />, 'General', 'Organization overview', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
        {renderSection('analytics', <Activity />, 'Trending & Analytics', 'Trends, heatmaps, and upcoming items', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
      </div>

      <WidgetSettingsPanel
        widgetId={settingsPanelWidget}
        open={!!settingsPanelWidget}
        onClose={() => setSettingsPanelWidget(null)}
      />
    </div>
  )
}

/**
 * EditableDashboard - The full editable dashboard with provider
 */
function EditableDashboard({ onAddTask }: { onAddTask?: () => void }) {
  return (
    <DashboardEditProvider
      initialWidgets={initialDashboardWidgets}
      onSave={(widgets) => console.log('Dashboard saved:', widgets)}
    >
      <EditableDashboardContent onAddTask={onAddTask} />
    </DashboardEditProvider>
  )
}

// =============================================================================
// STEP GENERATION - Using API generators
// =============================================================================

// Generate all steps for the generated incidents (skips draft incidents automatically)
const allSteps: Step[] = generateStepsForTableIncidents(incidentData)

// Split steps for StepsPage view - "my steps" (assigned to user-1) and "team steps"
const { mySteps, teamSteps } = splitStepsByAssignee(allSteps, 'user-1', 10, 15)

// =============================================================================
// USER MANAGEMENT MOCK DATA (imported from @/api)
// =============================================================================
// mockRoles, mockPermissions, mockEnhancedPermissions, mockUsers,
// mockLocationTree, mockUserStats, mockDepartments, mockJobTitles,
// mockEntityTemplates, mockUserActivities are all imported from @/api

// Filter groups from API (cast for component compatibility)
const incidentFilterGroups: FilterGroup[] = seedIncidentFilterGroups as FilterGroup[]

// Location options for incident reporting (derived from API)
const locationOptions = getIncidentLocationSelectOptions()

// =============================================================================
// DICTIONARY PAGE DEMO (Stateful wrapper for story)
// =============================================================================

/**
 * DictionaryPageDemo - Stateful wrapper for DictionaryPage
 * Manages selectedCategoryId and provides mock data for stories.
 */
function DictionaryPageDemo() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    mockCategories[0]?.id
  )
  const [localEntries, setLocalEntries] = useState<DictionaryEntry[]>([])

  // Get entries for selected category - use local state for reactivity
  const entries = selectedCategoryId
    ? (localEntries.length > 0 && localEntries[0]?.categoryId === selectedCategoryId
        ? localEntries
        : getEntriesByCategoryId(selectedCategoryId))
    : []

  // Sync local entries when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      setLocalEntries(getEntriesByCategoryId(selectedCategoryId))
    }
  }, [selectedCategoryId])

  return (
    <DictionaryPage
      categories={mockCategories}
      entries={entries}
      selectedCategoryId={selectedCategoryId}
      onCategorySelect={setSelectedCategoryId}
      onCategoryCreate={async (data) => {
        console.log('Creating category:', data)
        alert(`Category "${data.name}" created!`)
      }}
      onCategoryDelete={async (categoryId) => {
        console.log('Deleting category:', categoryId)
        alert(`Category deleted!`)
      }}
      onEntryCreate={async (data) => {
        console.log('Creating entry:', data)
        alert(`Entry "${data.value}" created!`)
      }}
      onEntryUpdate={async (data) => {
        console.log('Updating entry:', data)
        alert(`Entry "${data.value}" updated!`)
      }}
      onEntryDelete={async (entryId) => {
        console.log('Deleting entry:', entryId)
        // Remove from local state for demo reactivity
        setLocalEntries(prev => prev.filter(e => e.id !== entryId))
      }}
      onEntryStatusChange={async (entryId, status) => {
        console.log('Toggling entry status:', entryId, status)
        // Update local state for demo reactivity
        setLocalEntries(prev => prev.map(e =>
          e.id === entryId ? { ...e, status } : e
        ))
      }}
      onEntriesReorder={async (reorderedEntries) => {
        console.log('Reordering entries:', reorderedEntries)
      }}
      onImport={async (categoryId, file) => {
        console.log('Importing to category:', categoryId, file)
        alert(`Importing dictionary values...`)
      }}
      onExport={async (categoryId) => {
        console.log('Exporting category:', categoryId)
        alert(`Exporting dictionary values...`)
      }}
      onBulkStatusChange={async (entryIds, status) => {
        console.log('Bulk status change:', entryIds, status)
        // Update local state for demo reactivity
        setLocalEntries(prev => prev.map(e =>
          entryIds.includes(e.id) ? { ...e, status } : e
        ))
      }}
      onBulkDelete={async (entryIds) => {
        console.log('Bulk delete:', entryIds)
        // Remove from local state for demo reactivity
        setLocalEntries(prev => prev.filter(e => !entryIds.includes(e.id)))
      }}
    />
  )
}

/**
 * LocationsPage Demo wrapper with mock data and handlers
 */
function LocationsPageDemo() {
  return (
    <LocationsPage
      locations={sharedMockLocations}
      onLocationCreate={async (data) => {
        console.log('Creating location:', data)
        alert(`Location "${data.name}" created!`)
      }}
      onLocationUpdate={async (data) => {
        console.log('Updating location:', data)
        alert(`Location "${data.name}" updated!`)
      }}
      onLocationDelete={async (locationId) => {
        console.log('Deleting location:', locationId)
        alert(`Location deleted!`)
      }}
      onRefresh={async () => {
        console.log('Refreshing locations...')
        await new Promise((resolve) => setTimeout(resolve, 500))
      }}
    />
  )
}

/**
 * EntityTemplatesPage Demo wrapper with mock data and handlers
 */
function EntityTemplatesPageDemo() {
  return (
    <EntityTemplatesPage
      templates={mockEntityTemplates}
      onCreateNavigate={() => {
        console.log('Navigate to create page')
        alert('Would navigate to create template page')
      }}
      onEditNavigate={(template) => {
        console.log('Navigate to edit page:', template.id)
        alert(`Would navigate to edit page for "${template.name}"`)
      }}
      onTemplateDelete={async (templateId) => {
        console.log('Deleting template:', templateId)
        alert(`Template deleted!`)
      }}
      onRefresh={async () => {
        console.log('Refreshing templates...')
        await new Promise((resolve) => setTimeout(resolve, 500))
      }}
    />
  )
}

// =============================================================================
// MOCK DATA - DIRECTORY
// Derivation functions imported from '../../flow/data':
// - convertToLocationWithPeople: Joins location hierarchy with user assignments
// - getUserById: Find user by ID
// - createUserProfileData: Extend user to profile format
// =============================================================================

// Directory locations derived from shared location data + user assignments
const mockDirectoryLocations: LocationWithPeople[] = convertToLocationWithPeople(sharedMockLocations)

/**
 * DirectoryPage Demo wrapper with mock data and handlers.
 * Features:
 * - Interactive profile navigation - clicking "View Profile" shows the UserProfilePage
 * - Add User dialog integration
 * - Export functionality
 * - QuickFilters for user status
 * - SearchFilter with Department, Status, Role dropdowns
 */
function DirectoryPageDemo() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Get full user data when a profile is selected
  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null
  const selectedProfile = selectedUser ? createUserProfileData(selectedUser) : null

  // Handle back navigation from profile
  const handleBack = useCallback(() => {
    setSelectedUserId(null)
  }, [])

  // Handle export
  const handleExport = useCallback(() => {
    console.log('Exporting directory data...')
    alert('Directory data exported successfully!')
  }, [])

  // If a profile is selected, show the profile page
  if (selectedProfile) {
    return (
      <UserProfilePage
        profile={selectedProfile}
        onBack={handleBack}
        onEmail={(email) => window.open(`mailto:${email}`, '_blank')}
        onCall={(phone) => window.open(`tel:${phone}`, '_blank')}
        onTeamsChat={(email) => window.open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank')}
        onSlackChat={(handle) => console.log('Slack:', handle)}
      />
    )
  }

  // Available departments and job titles for the create user dialog
  const departments = [
    'Environmental Health & Safety',
    'Operations',
    'Engineering',
    'Logistics',
    'Quality Assurance',
    'Human Resources',
    'Facilities',
  ]

  const jobTitles = [
    'EHS Director',
    'Safety Manager',
    'Incident Investigator',
    'Production Supervisor',
    'Warehouse Lead',
    'HR Manager',
    'Maintenance Technician',
    'Quality Analyst',
    'Safety Inspector',
    'Environmental Compliance Officer',
    'Field Safety Coordinator',
    'Industrial Hygienist',
  ]

  // Show directory page with Add User dialog
  return (
    <>
      <DirectoryPage
        locations={mockDirectoryLocations}
        users={mockUsers}
        roles={mockRoles}
        departments={departments}
        onViewProfile={(userId) => {
          console.log('View profile:', userId)
          setSelectedUserId(userId)
        }}
        onRefresh={() => console.log('Refreshing directory...')}
        onExport={handleExport}
      />
    </>
  )
}

// Navigation items for Flow - matching app-sidebar structure
const flowNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    component: (
      <EditableDashboard onAddTask={() => alert('Opening task creation...')} />
    ),
  },
  {
    id: 'workflow',
    label: 'Workflow Steps',
    icon: <Waypoints className="w-5 h-5" />,
    component: (
      <FlowPageContent>
        <StepsPage
          mySteps={mySteps}
          teamSteps={teamSteps}
          pageTitle="Workflow Steps"
          pageSubtitle="Manage and track workflow progress"
          onNextStep={(step) => {
            console.log('Next step clicked:', step)
            alert(`Navigating to incident: ${step.incidentId}`)
          }}
          onIncidentClick={(dbId, incidentId) => {
            console.log('Incident clicked:', { dbId, incidentId })
            alert(`Opening incident: ${incidentId}`)
          }}
          onAssigneeClick={(person) => {
            console.log('Assignee clicked:', person)
            alert(`Opening profile for: ${person.name}`)
          }}
          onLocationClick={(location) => {
            console.log('Location clicked:', location)
            alert(`Opening location: ${location}`)
          }}
          onExport={() => alert('Exporting steps...')}
        />
      </FlowPageContent>
    ),
  },
  {
    id: 'incidents',
    label: 'Report Incident',
    icon: <TriangleAlert className="w-5 h-5" />,
    badge: 3,
    component: (
      <FlowPageContent>
        <IncidentsPageComponent
          incidents={incidentData}
          locations={locationOptions}
          filterGroups={incidentFilterGroups}
          documents={mockDocuments}
          userContext={mockUserContext}
          detailedWorkflows={mockDetailedWorkflows}
          extendedFormSubmissions={mockExtendedFormSubmissions}
          allSteps={allSteps}
          convertToIncidentDetail={convertToIncidentDetail}
          onIncidentSubmit={async (formData) => {
            console.log('Incident submitted:', formData)
            alert(`Incident submitted successfully!`)
          }}
        />
      </FlowPageContent>
    ),
  },
  {
    id: 'directory',
    label: 'Directory',
    icon: <Contact2 className="w-5 h-5" />,
    component: <DirectoryPageDemo />,
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        id: 'users',
        label: 'User Management',
        icon: <Users className="w-5 h-5" />,
        component: (
          <UsersPage
            users={mockUsers}
            roles={mockRoles}
            locations={mockLocationTree}
            departments={mockDepartments}
            jobTitles={mockJobTitles}
            stats={mockUserStats}
            onUserCreate={async (data) => {
              console.log('Creating user:', data)
              alert(`User "${data.firstName} ${data.lastName}" created!`)
            }}
            onUserUpdate={async (data) => {
              console.log('Updating user:', data)
              alert(`User "${data.firstName} ${data.lastName}" updated!`)
            }}
            onUserDelete={async (userId) => {
              console.log('Deleting user:', userId)
              alert(`User deleted!`)
            }}
            onRoleAssign={async (userId, data) => {
              console.log('Assigning role:', { userId, data })
              alert(`Role assigned!`)
            }}
            onRoleAssignmentUpdate={async (assignmentId, scopes) => {
              console.log('Updating role assignment:', { assignmentId, scopes })
              alert(`Role assignment updated!`)
            }}
            onRoleAssignmentRemove={async (assignmentId) => {
              console.log('Removing role assignment:', assignmentId)
              alert(`Role assignment removed!`)
            }}
            onBulkAction={async (payload) => {
              console.log('Bulk action:', payload)
              alert(`Bulk action "${payload.action}" performed on ${payload.userIds.length} users!`)
            }}
            onFetchUserActivity={async (userId) => {
              console.log('Fetching activity for user:', userId)
              return mockUserActivities.filter(a => a.userId === userId)
            }}
            // Role CRUD props
            availablePermissions={mockEnhancedPermissions}
            onRoleCreate={async (data) => {
              console.log('Creating role:', data)
              alert(`Role "${data.name}" created with ${data.permissions.length} permissions!`)
            }}
            onRoleUpdate={async (data) => {
              console.log('Updating role:', data)
              alert(`Role "${data.name}" updated with ${data.permissions.length} permissions!`)
            }}
            onRoleDelete={async (roleId) => {
              console.log('Deleting role:', roleId)
              alert(`Role deleted!`)
            }}
          />
        ),
      },
      {
        id: 'dictionaries',
        label: 'Dictionaries',
        icon: <BookOpen className="w-5 h-5" />,
        component: <DictionaryPageDemo />,
      },
      {
        id: 'locations',
        label: 'Locations',
        icon: <MapPin className="w-5 h-5" />,
        component: <LocationsPageDemo />,
      },
      {
        id: 'templates',
        label: 'Entity Templates',
        icon: <Files className="w-5 h-5" />,
        component: <EntityTemplatesPageDemo />,
      },
    ],
  },
]

const userMenuItems = [
  { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', destructive: true, separator: true },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof AppLayoutShell> = {
  title: 'Flow/Dashboard',
  component: AppLayoutShell,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`
# Flow EHS Dashboard

A complete EHS (Environment, Health & Safety) application built using the **AppLayoutShell** and **EHSAnalyticsDashboard** components.

## Features
- **Dashboard**: Advanced analytics with KPIs, sparklines, status zones, and edit mode
- **Workflow Steps**: Manage and track workflow progress
- **Report Incident**: Track and resolve safety incidents with full DataTable
- **Configuration**: Users, Roles, Dictionaries, Locations, Templates, Modules

## Architecture
Flow-specific component hierarchy:
1. **Primitives**: Button, Card, DataTable, etc.
2. **AppLayoutShell**: Handles layout, navigation, responsive behavior
3. **EHSAnalyticsDashboard**: Advanced dashboard with KPI cards, breakdown charts, trending, heatmaps, and edit mode
        `),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AppLayoutShell>

// =============================================================================
// FLOW APP WRAPPER (Standard component for all Flow stories)
// =============================================================================

type FlowNavItem = 'myFlow' | 'steps' | 'incidents' | 'more'

// Map FlowMobileNav items to sidebar page IDs
const FLOW_NAV_MAP: Record<FlowNavItem, string> = {
  myFlow: 'dashboard',
  steps: 'workflow',
  incidents: 'incidents',
  more: 'configuration',
}

// Reverse map: page ID to FlowMobileNav item
const PAGE_TO_NAV: Record<string, FlowNavItem> = {
  dashboard: 'myFlow',
  workflow: 'steps',
  incidents: 'incidents',
  directory: 'more', // Directory accessible via More menu on mobile
  configuration: 'more',
  // Child pages map to parent nav items
  users: 'more',
  roles: 'more',
  dictionaries: 'more',
  templates: 'more',
  modules: 'more',
  locations: 'more',
  assets: 'more',
}

interface FlowAppProps {
  /** Initial page to display */
  initialPage?: FlowNavItem
  /** Initial Configuration sub-page (for starting on users, dictionaries, etc.) */
  initialConfigPage?: string | null
}

// More menu items from Configuration children (for FlowMobileNav)
const moreMenuItems: MoreMenuItem[] = [
  { id: 'directory', label: 'Directory', icon: <Contact2 className="w-5 h-5" /> },
  { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
  { id: 'dictionaries', label: 'Dictionaries', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'locations', label: 'Locations', icon: <MapPin className="w-5 h-5" /> },
  { id: 'templates', label: 'Entity Templates', icon: <Files className="w-5 h-5" /> },
]

// =============================================================================
// AI ASSISTANT PAGE CONTEXT CONFIGURATIONS (derived from API)
// =============================================================================

// Icon mapping for AI action icons
const aiActionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'shield-check': ShieldCheck,
  'alert-circle': AlertCircle,
  download: Download,
  clock: Clock,
  sparkles: Sparkles,
  globe: Globe,
  zap: Zap,
  hourglass: Hourglass,
  'clipboard-list': ClipboardList,
  contact: Contact2,
  waypoints: Waypoints,
  shield: Shield,
  eye: Eye,
  'eye-off': EyeOff,
  refresh: RefreshCw,
  activity: Activity,
  'trending-up': TrendingUp,
  target: Target,
}

// Derive PAGE_CONTEXTS from API seed data with icons added
const PAGE_CONTEXTS: Record<string, { context: PageContext; actions: ContextualAction[] }> = Object.fromEntries(
  Object.entries(seedAiPageContexts).map(([pageId, config]) => [
    pageId,
    {
      context: config.context as PageContext,
      actions: config.actions.map((action) => ({
        id: action.id,
        label: action.label,
        description: action.description,
        icon: aiActionIconMap[action.iconId] || Sparkles,
        color: action.colorClass,
      })),
    },
  ])
)

/**
 * Helper component that syncs page context with AI Assistant.
 * Must be used inside AIAssistantProvider.
 */
function AIAssistantContextSync({ pageId }: { pageId: string }) {
  const { setPageContext, setContextualActions } = useAIAssistant()

  useEffect(() => {
    const pageConfig = PAGE_CONTEXTS[pageId]
    if (pageConfig) {
      setPageContext(pageConfig.context)
      const actionsWithHandlers = pageConfig.actions.map((action) => ({
        ...action,
        onClick: () => {
          console.log(`AI Action: ${action.label} on ${pageConfig.context.pageName}`)
          console.log(`Description: ${action.description}`)
        },
      }))
      setContextualActions(actionsWithHandlers)
    } else {
      setPageContext({
        pageId,
        pageName: pageId.charAt(0).toUpperCase() + pageId.slice(1),
        pageDescription: 'Flow EHS',
      })
      setContextualActions([])
    }
  }, [pageId, setPageContext, setContextualActions])

  return null
}

/**
 * FlowApp - Standard Flow EHS application wrapper
 *
 * Features:
 * - AppLayoutShell with Flow product config
 * - FlowMobileNav on mobile (big red incident button in center)
 * - Incident reporting flow triggered from mobile nav
 * - "More" button opens sheet with Configuration submenu
 * - Desktop uses standard sidebar navigation
 *
 * This is THE standard way to render Flow EHS in stories and production.
 */
function FlowApp({ initialPage = 'myFlow', initialConfigPage = null }: FlowAppProps) {
  const [activeNavItem, setActiveNavItem] = useState<FlowNavItem>(initialPage)
  const [reportingOpen, setReportingOpen] = useState(false)
  // Track current page ID for Configuration children
  const [currentConfigPage, setCurrentConfigPage] = useState<string | null>(initialConfigPage)

  // Handle navigation from sidebar (desktop) or page changes
  const handlePageChange = (pageId: string) => {
    const navItem = PAGE_TO_NAV[pageId]
    if (navItem) {
      setActiveNavItem(navItem)
      // Handle Configuration children - set the config page
      if (navItem === 'more' && pageId !== 'configuration') {
        // Clicking a config child (users, dictionaries, locations, etc.)
        setCurrentConfigPage(pageId)
      } else if (navItem !== 'more') {
        // Navigating away from config section
        setCurrentConfigPage(null)
      }
    }
  }

  // Create menu items with click handlers
  const moreMenuItemsWithHandlers: MoreMenuItem[] = moreMenuItems.map((item) => ({
    ...item,
    onClick: () => {
      setCurrentConfigPage(item.id)
      setActiveNavItem('more')
      // Also update the sidebar to show the correct page
      handlePageChange(item.id)
    },
  }))

  // Determine which page to show
  const effectivePageId = currentConfigPage || FLOW_NAV_MAP[activeNavItem]

  return (
    <AIAssistantProvider>
      {/* Sync page context with AI Assistant when navigation changes */}
      <AIAssistantContextSync pageId={effectivePageId} />

      <AppLayoutShell
        product="flow"
        navItems={flowNavItems}
        currentPageId={effectivePageId}
        onPageChange={handlePageChange}
        user={{
          name: 'Sarah Chen',
          email: 'sarah.chen@safetycompany.com',
        }}
        userMenuItems={userMenuItems}
        notificationCount={4}
        showHelpItem={true}
        footerVariant="wave-only"
        onNotificationClick={() => alert('Opening notifications...')}
        onMenuItemClick={(item) => {
          if (item.id === 'logout') {
            alert('Logging out...')
          } else {
            alert(`Navigating to ${item.label}`)
          }
        }}
        // FlowMobileNav: Standard mobile navigation for Flow EHS
        // - My Flow | Steps | [BIG RED BUTTON] | Incidents | More
        // - Center button opens incident reporting (Fitts' Law)
        // - "More" button opens sheet with Configuration options
        customMobileNav={
          <FlowMobileNav
            activeItem={activeNavItem}
            onNavigate={(item) => {
              setActiveNavItem(item)
              setCurrentConfigPage(null)
            }}
            onQuickAction={() => setReportingOpen(true)}
            moreMenuItems={moreMenuItemsWithHandlers}
            moreMenuTitle="Configuration"
          />
        }
      />

      {/* Incident Reporting Flow (triggered from FlowMobileNav center button) */}
      <IncidentReportingFlow
        variant="overlay"
        open={reportingOpen}
        onOpenChange={setReportingOpen}
        locations={locationOptions}
        onSubmit={async (formData) => {
          console.log('Incident submitted:', formData)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setReportingOpen(false)
        }}
      />

      {/* AI Assistant - Context-aware floating helper available on every page */}
      <AIAssistantFab />
      <AIAssistantQuickActions />
      <AIAssistantPanel />
    </AIAssistantProvider>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * **FlowApp - Complete Interconnected Application**
 *
 * This is the primary story showcasing the full Flow EHS application
 * with all pages connected through navigation.
 *
 * Navigate between:
 * - Dashboard (My Flow) - Analytics and KPIs
 * - Incidents - Incident management table
 * - Steps - Workflow configuration
 * - Directory - Organization directory (location-first)
 * - More - Configuration pages (Users, Dictionaries, Locations, etc.)
 *
 * The center red button opens the Incident Reporting flow.
 */
export const FlowAppStory: Story = {
  name: 'Flow App (Complete)',
  parameters: {
    docs: {
      description: {
        story: `# Flow EHS - Complete Application

This story demonstrates the **complete Flow EHS application** with all pages interconnected through navigation.

## Available Pages

| Tab | Page | Description |
|-----|------|-------------|
| 🏠 | **My Flow** | Analytics dashboard with KPIs, charts, and insights |
| ⚠️ | **Incidents** | Incident management table with filtering and actions |
| 📋 | **Steps** | Workflow steps configuration |
| 👥 | **Directory** | Organization directory - browse people by location |
| ➕ | **Report** | Incident reporting flow (center button) |
| ⋯ | **More** | Configuration pages menu |

## Configuration Pages (More → ...)

- **Directory** - Organization directory (location-first)
- **User Management** - Users and roles administration
- **Dictionaries** - Lookup values and categories
- **Locations** - Facility and zone hierarchy
- **Entity Templates** - Configuration templates
- **Modules** - System modules

## Navigation

- **Mobile**: Bottom navigation bar with 5 tabs
- **Desktop**: Sidebar navigation with collapsible sections
- **Responsive**: Automatically adapts to screen size

Try clicking different tabs to navigate between all connected pages!`,
      },
    },
  },
  render: () => <FlowApp initialPage="myFlow" />,
}

/**
 * Complete Flow EHS application with FlowMobileNav on mobile.
 * The big red incident reporting button is always available in the mobile nav.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Flow EHS Application**

Features:
- **Desktop**: Standard sidebar navigation
- **Mobile**: FlowMobileNav with incident reporting button in center
- **Responsive**: Automatically switches between desktop/mobile layouts

The mobile navigation follows **Fitts' Law** - the most important action (Report Incident) is the largest, most colorful, centrally positioned button.`,
      },
    },
  },
  render: () => <FlowApp initialPage="myFlow" />,
}

/**
 * Mobile PWA in iPhone frame - uses iframe for real CSS media queries
 * Shows Safari browser chrome since this is a PWA, not a native app
 */
export const Mobile: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile Experience in iPhone Frame with Safari Browser**

Uses an actual iframe at device dimensions, so CSS media queries trigger correctly.
The app properly shows mobile layout with FlowMobileNav.

**Features:**
- Real 440×956 viewport (iPhone 16 Pro Max)
- Safari iOS browser chrome (address bar + bottom toolbar)
- CSS media queries work correctly
- FlowMobileNav at bottom (within browser content area)
- No footer (per UX best practices)`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--default"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app"
      />
    </div>
  ),
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <FlowApp initialPage="myFlow" />,
}

/**
 * Start on workflow page
 */
export const WorkflowPage: Story = {
  render: () => <FlowApp initialPage="steps" />,
}

/**
 * Start on incidents page with Incident Management Table
 */
export const IncidentsTab: Story = {
  render: () => <FlowApp initialPage="incidents" />,
}

/**
 * Incidents Page - alias for IncidentsTab (for URL 'flow-dashboard--incidents-page')
 */
export const IncidentsPage: Story = {
  render: () => <FlowApp initialPage="incidents" />,
}

/**
 * Mobile Incidents Page - Shows DataTableMobileCard in action
 *
 * Demonstrates the table-row-to-card transformation:
 * - Left priority borders (critical/high/medium/low/none/draft)
 * - Status badges and severity indicators
 * - Age with overdue styling
 * - Action buttons (NextStepButton or Submit/Edit/Delete for drafts)
 */
export const MobileIncidents: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile Incidents Table as Cards**

Demonstrates the \`DataTableMobileCard\` component styled to look like table rows transformed into cards.

**Features:**
- Left border indicates priority (Critical=red, High=orange, Medium=yellow, Low=green, None=blue, Draft=dashed)
- Status badge in header row
- Fields displayed in 2-column grid with uppercase labels (matching table headers)
- Actions section with severity-colored NextStepButton or draft actions
- Touch-optimized 44px targets
- Proper keyboard accessibility`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--incidents-page"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app/incidents"
      />
    </div>
  ),
}

// =============================================================================
// CONFIGURATION PAGES (Admin Section)
// =============================================================================

/**
 * Configuration - All admin pages with working navigation
 *
 * This is the main entry point for all Configuration/Admin pages.
 * Use the sidebar to navigate between:
 * - User Management
 * - Dictionaries
 * - Locations
 * - Entity Templates
 * - Modules
 */
export const Configuration: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Configuration / Admin Section**

All administrative pages for Flow EHS application. Use the **sidebar navigation** to switch between pages:

| Page | Description |
|------|-------------|
| **User Management** | Users, Roles, Permissions with RBAC |
| **Dictionaries** | System and custom lookup values |
| **Locations** | Site and facility management |
| **Entity Templates** | Configure entity types |
| **Modules** | System module configuration |

The sidebar shows Configuration as an expandable group with all sub-pages. Click any sub-page to navigate.`,
      },
    },
  },
  render: () => <FlowApp initialPage="more" initialConfigPage="users" />,
}

/**
 * User Management Configuration Page (direct link)
 */
export const UserManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: `**User Management Configuration**

Enterprise user management for Flow EHS with RBAC:
- **Users Tab**: Stats cards, data table, search/filters, bulk operations
- **Roles Tab**: Role definitions grid with permission display
- **Role Assignment**: Location-based permission scoping
- **Activity Timeline**: User activity history in slide-over sheet

> **Tip:** Use the sidebar to navigate to other Configuration pages.`,
      },
    },
  },
  render: () => <FlowApp initialPage="more" initialConfigPage="users" />,
}

/**
 * Dictionary Management (direct link)
 */
export const DictionaryManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Dictionary Management Configuration**

Centralized lookup value management for Flow EHS:
- **Categories Sidebar**: System and custom dictionary categories with search
- **Entries Table**: Dictionary values with code, description, status, ordering
- **CRUD Operations**: Create, edit, delete categories and entries
- **Import/Export**: Bulk data management with CSV support

> **Tip:** Use the sidebar to navigate to other Configuration pages.

Navigate to Configuration > Dictionaries in the sidebar.`,
      },
    },
  },
  render: () => <FlowApp initialPage="more" initialConfigPage="dictionaries" />,
}

/**
 * Roles Tab Direct - Direct view of the enhanced Roles & Permissions UI
 *
 * Use this story to test the new Roles functionality without navigation.
 */
export const RolesTabDirect: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Enhanced Roles & Permissions UI**

Direct view of the enhanced Roles tab with all new features:
- **Bitmasks hidden by default** - Toggle "Dev Mode" in dialogs to see them
- **Resource-level summaries** - Shows permission counts per resource
- **Filter dropdown** - All Types / System / Custom
- **Create Role button** - Opens CreateRoleDialog
- **View/Edit/Delete actions** - In each role card footer
- **System badge** - Yellow badge for protected roles`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-page p-6">
      <UsersPage
        users={mockUsers}
        roles={mockRoles}
        locations={mockLocationTree}
        departments={mockDepartments}
        jobTitles={mockJobTitles}
        stats={mockUserStats}
        onUserCreate={async (data) => {
          console.log('Creating user:', data)
          alert(`User "${data.firstName} ${data.lastName}" created!`)
        }}
        onUserUpdate={async (data) => {
          console.log('Updating user:', data)
          alert(`User "${data.firstName} ${data.lastName}" updated!`)
        }}
        onUserDelete={async (userId) => {
          console.log('Deleting user:', userId)
          alert(`User deleted!`)
        }}
        onRoleAssign={async (userId, data) => {
          console.log('Assigning role:', { userId, data })
          alert(`Role assigned!`)
        }}
        onRoleAssignmentUpdate={async (assignmentId, scopes) => {
          console.log('Updating role assignment:', { assignmentId, scopes })
          alert(`Role assignment updated!`)
        }}
        onRoleAssignmentRemove={async (assignmentId) => {
          console.log('Removing role assignment:', assignmentId)
          alert(`Role assignment removed!`)
        }}
        onBulkAction={async (payload) => {
          console.log('Bulk action:', payload)
          alert(`Bulk action "${payload.action}" performed on ${payload.userIds.length} users!`)
        }}
        onFetchUserActivity={async (userId) => {
          console.log('Fetching activity for user:', userId)
          return mockUserActivities.filter(a => a.userId === userId)
        }}
        availablePermissions={mockEnhancedPermissions}
        onRoleCreate={async (data) => {
          console.log('Creating role:', data)
          alert(`Role "${data.name}" created with ${data.permissions.length} permissions!`)
        }}
        onRoleUpdate={async (data) => {
          console.log('Updating role:', data)
          alert(`Role "${data.name}" updated with ${data.permissions.length} permissions!`)
        }}
        onRoleDelete={async (roleId) => {
          console.log('Deleting role:', roleId)
          alert(`Role deleted!`)
        }}
      />
    </div>
  ),
}

/**
 * Mobile User Management - Shows responsive user table as cards
 */
export const MobileUserManagement: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile User Management**

User management optimized for mobile devices:
- Stats cards in 2-column grid
- User list as touch-friendly cards
- Bottom sheet for bulk actions
- Swipe gestures for row actions`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--user-management"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app/settings/users"
      />
    </div>
  ),
}
