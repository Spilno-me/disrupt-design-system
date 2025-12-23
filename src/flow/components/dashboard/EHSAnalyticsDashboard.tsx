/**
 * EHS Analytics Dashboard - Main dashboard composition component
 *
 * UX Laws Applied:
 * - Miller's Law (7±2): Sections limited to digestible chunks
 * - Von Restorff: Hero KPI card with visual prominence
 * - Fitts' Law: Touch-friendly card sizes with adequate spacing
 * - Gestalt: Related metrics grouped by intent (Act → Monitor → Analyze → Plan)
 * - Serial Position Effect: Most important items first and last
 *
 * Widget Priority Tiers:
 * 1. Act Now - Urgent items requiring immediate attention
 * 2. Health Check - Status overview and KPIs
 * 3. Insights - Analytics and pattern recognition
 * 4. Context - Background organizational info
 */
import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  Sparkles,
  TriangleAlert,
  ClipboardList,
  Building2,
  Activity,
  Zap,
  Target,
  Calendar,
  Eye,
  EyeOff,
  Settings2,
  PencilLine,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Users,
  Briefcase,
  Sun,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../../../components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { StatsCard } from '../../../components/leads/StatsCard'
import { cn } from '../../../lib/utils'

import { SectionHeader } from './SectionHeader'
import { KPICard } from './KPICard'
import { BreakdownCard, type BreakdownItem } from './BreakdownCard'
import { AgingCard, type AgingItem } from './AgingCard'
import { TrendingCard, type TrendingItem } from './TrendingCard'
import { RiskHeatmapCard, type LocationRisk } from './RiskHeatmapCard'
import { WorkloadCard, type WorkloadItem } from './WorkloadCard'
import { UpcomingTasksCard, type UpcomingTask } from './UpcomingTasksCard'

// =============================================================================
// TYPES
// =============================================================================

/** Dashboard view modes */
export type DashboardViewMode = 'full' | 'briefing' | 'compact'

/** Role-based presets determine which sections are visible by default */
export type DashboardPreset = 'safety-manager' | 'field-worker' | 'executive' | 'custom'

/** Section visibility configuration */
interface WidgetVisibility {
  actNow: boolean
  healthCheck: boolean
  insights: boolean
  context: boolean
  planning: boolean
}

/** Priority task for "My Priority" section */
export interface PriorityTask {
  id: string
  title: string
  type: 'overdue' | 'due-today' | 'critical' | 'assigned'
  dueDate?: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
}

interface KPIData {
  id: string
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  isHero?: boolean
  zeroIsCelebratory?: boolean
  isNegativeMetric?: boolean
  isPositive?: boolean
}

interface IncidentData {
  id: string
  title: string
  value: string | number
  description?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  isNegativeMetric?: boolean
  isPositive?: boolean
  zeroIsCelebratory?: boolean
}

interface ActionData {
  id: string
  title: string
  value: string | number
  description?: string
}

interface GeneralData {
  id: string
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

export interface EHSAnalyticsDashboardProps {
  title?: string
  subtitle?: string
  /** Current user name for personalization */
  userName?: string
  /** Initial view mode */
  viewMode?: DashboardViewMode
  /** Initial preset */
  preset?: DashboardPreset
  // Data props
  kpiData?: KPIData[]
  incidentData?: IncidentData[]
  severityBreakdown?: BreakdownItem[]
  focusFourIncidents?: BreakdownItem[]
  actionData?: ActionData[]
  agingData?: AgingItem[]
  generalData?: GeneralData[]
  trendingIncidents?: TrendingItem[]
  locationRisks?: LocationRisk[]
  employeeWorkload?: WorkloadItem[]
  upcomingTasks?: UpcomingTask[]
  /** User's priority items (assigned, overdue, etc.) */
  myPriorityTasks?: PriorityTask[]
  // Callbacks
  onAddTask?: () => void
  onEdit?: () => void
  onTaskClick?: (taskId: string) => void
  onViewModeChange?: (mode: DashboardViewMode) => void
  onPresetChange?: (preset: DashboardPreset) => void
}

// =============================================================================
// PRESET CONFIGURATIONS
// =============================================================================

const PRESET_CONFIGS: Record<DashboardPreset, WidgetVisibility> = {
  'safety-manager': {
    actNow: true,
    healthCheck: true,
    insights: true,
    context: true,
    planning: true,
  },
  'field-worker': {
    actNow: true,
    healthCheck: true,
    insights: false,
    context: false,
    planning: true,
  },
  'executive': {
    actNow: true,
    healthCheck: true,
    insights: true,
    context: false,
    planning: false,
  },
  'custom': {
    actNow: true,
    healthCheck: true,
    insights: true,
    context: true,
    planning: true,
  },
}

const PRESET_LABELS: Record<DashboardPreset, string> = {
  'safety-manager': 'Safety Manager',
  'field-worker': 'Field Worker',
  'executive': 'Executive',
  'custom': 'Custom',
}

const SECTION_LABELS: Record<keyof WidgetVisibility, string> = {
  actNow: 'Act Now',
  healthCheck: 'Health Check',
  insights: 'Insights',
  context: 'Organization',
  planning: 'Planning',
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get time-appropriate greeting and defaults
 */
function getTimeBasedDefaults(): { greeting: string; expandActNow: boolean } {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good morning', expandActNow: true }
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good afternoon', expandActNow: true }
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good evening', expandActNow: false }
  } else {
    return { greeting: 'Welcome back', expandActNow: false }
  }
}

// =============================================================================
// MY PRIORITY CARD
// =============================================================================

function MyPriorityCard({
  tasks,
  onTaskClick,
}: {
  tasks: PriorityTask[]
  onTaskClick?: (taskId: string) => void
}) {
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
    <div className="col-span-full sm:col-span-2 bg-surface rounded-xl p-4 border border-default shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
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
            onClick={() => onTaskClick?.(task.id)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted-bg transition-colors text-left"
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                task.type === 'overdue' && 'bg-error',
                task.type === 'due-today' && 'bg-warning',
                task.type === 'critical' && 'bg-error',
                task.type === 'assigned' && 'bg-accent'
              )}
            />
            <span className="text-sm text-primary truncate flex-1">{task.title}</span>
            {task.dueDate && (
              <span className="text-xs text-tertiary flex-shrink-0">{task.dueDate}</span>
            )}
          </button>
        ))}
        {tasks.length > 5 && (
          <p className="text-xs text-secondary text-center pt-2">
            +{tasks.length - 5} more items
          </p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MORNING BRIEFING VIEW
// =============================================================================

function MorningBriefingView({
  userName,
  myPriorityTasks = [],
  incidentData = [],
  agingData = [],
  upcomingTasks = [],
  onTaskClick,
  onAddTask,
}: {
  userName?: string
  myPriorityTasks?: PriorityTask[]
  incidentData?: IncidentData[]
  agingData?: AgingItem[]
  upcomingTasks?: UpcomingTask[]
  onTaskClick?: (taskId: string) => void
  onAddTask?: () => void
}) {
  const { greeting } = getTimeBasedDefaults()
  const overdueActions = agingData.filter((a) => a.label.toLowerCase().includes('overdue'))
  const totalOverdue = overdueActions.reduce((sum, a) => sum + a.value, 0)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold text-primary">
          {greeting}{userName ? `, ${userName}` : ''}
        </h2>
        <p className="text-secondary mt-1">Here's your daily briefing</p>
      </div>

      {/* Key Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 text-center border border-default">
          <p className="text-3xl font-bold text-primary">
            {myPriorityTasks.filter((t) => t.type === 'due-today').length}
          </p>
          <p className="text-sm text-secondary">Due Today</p>
        </div>
        <div className={cn(
          'rounded-xl p-4 text-center border',
          totalOverdue > 0
            ? 'bg-error/5 border-error/20'
            : 'bg-success/5 border-success/20'
        )}>
          <p className={cn(
            'text-3xl font-bold',
            totalOverdue > 0 ? 'text-error' : 'text-success'
          )}>
            {totalOverdue}
          </p>
          <p className="text-sm text-secondary">Overdue</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-default">
          <p className="text-3xl font-bold text-primary">
            {incidentData.find((i) => i.title.toLowerCase().includes('open'))?.value || 0}
          </p>
          <p className="text-sm text-secondary">Open Incidents</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-default">
          <p className="text-3xl font-bold text-primary">{upcomingTasks.length}</p>
          <p className="text-sm text-secondary">Upcoming Tasks</p>
        </div>
      </div>

      {/* Priority Tasks */}
      {myPriorityTasks.length > 0 && (
        <div className="bg-surface rounded-xl p-4 border border-default">
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Needs Your Attention
          </h3>
          <div className="space-y-2">
            {myPriorityTasks.slice(0, 5).map((task) => (
              <button
                key={task.id}
                onClick={() => onTaskClick?.(task.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted-bg/50 hover:bg-muted-bg transition-colors text-left"
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    task.type === 'overdue' && 'bg-error',
                    task.type === 'due-today' && 'bg-warning',
                    task.type === 'critical' && 'bg-error',
                    task.type === 'assigned' && 'bg-accent'
                  )}
                />
                <span className="text-sm text-primary flex-1">{task.title}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  task.type === 'overdue' && 'bg-error/10 text-error',
                  task.type === 'due-today' && 'bg-warning/10 text-warning-dark dark:text-warning',
                  task.type === 'critical' && 'bg-error/10 text-error',
                  task.type === 'assigned' && 'bg-accent/10 text-accent'
                )}>
                  {task.type === 'due-today' ? 'Today' : task.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <UpcomingTasksCard tasks={upcomingTasks.slice(0, 3)} onAddTask={onAddTask} />
    </div>
  )
}

// =============================================================================
// DASHBOARD HEADER
// =============================================================================

function DashboardHeader({
  title,
  subtitle,
  dateRange,
  onDateRangeChange,
  visibility,
  onVisibilityChange,
  viewMode,
  onViewModeChange,
  preset,
  onPresetChange,
  onEdit,
}: {
  title: string
  subtitle: string
  dateRange: string
  onDateRangeChange: (value: string) => void
  visibility: WidgetVisibility
  onVisibilityChange: (key: keyof WidgetVisibility) => void
  viewMode: DashboardViewMode
  onViewModeChange: (mode: DashboardViewMode) => void
  preset: DashboardPreset
  onPresetChange: (preset: DashboardPreset) => void
  onEdit?: () => void
}) {
  return (
    <div className="bg-page/95 backdrop-blur-sm border-b border-default sticky top-0 z-10">
      <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <p className="text-sm text-secondary">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted-bg rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('briefing')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                viewMode === 'briefing'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              Briefing
            </button>
            <button
              onClick={() => onViewModeChange('full')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                viewMode === 'full'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Full
            </button>
          </div>

          {/* Role Preset */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                {PRESET_LABELS[preset]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Dashboard Preset</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={preset} onValueChange={(v) => onPresetChange(v as DashboardPreset)}>
                <DropdownMenuRadioItem value="safety-manager">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Safety Manager
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="field-worker">
                  <User className="w-4 h-4 mr-2" />
                  Field Worker
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="executive">
                  <Building2 className="w-4 h-4 mr-2" />
                  Executive
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Custom
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Widget Controls */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="w-4 h-4" />
                Widgets
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle Sections</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(visibility) as Array<keyof WidgetVisibility>).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visibility[key]}
                  onCheckedChange={() => onVisibilityChange(key)}
                >
                  {SECTION_LABELS[key]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick toggles (desktop) */}
          <div className="hidden xl:flex items-center gap-2">
            {(Object.keys(visibility) as Array<keyof WidgetVisibility>).slice(0, 3).map((key) => (
              <button
                key={key}
                onClick={() => onVisibilityChange(key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
                  visibility[key]
                    ? 'bg-accent-bg text-accent-strong dark:bg-accent-bg dark:text-accent-strong'
                    : 'bg-muted-bg text-muted dark:bg-surface dark:text-secondary'
                )}
              >
                {visibility[key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {SECTION_LABELS[key]}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="gap-2" onClick={onEdit}>
            <PencilLine className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function EHSAnalyticsDashboard({
  title = 'Welcome to your Flow',
  subtitle = 'Manage your Environmental, Health & Safety operations efficiently.',
  userName,
  viewMode: initialViewMode = 'full',
  preset: initialPreset = 'safety-manager',
  kpiData = [],
  incidentData = [],
  severityBreakdown = [],
  focusFourIncidents = [],
  actionData = [],
  agingData = [],
  generalData = [],
  trendingIncidents = [],
  locationRisks = [],
  employeeWorkload = [],
  upcomingTasks = [],
  myPriorityTasks = [],
  onAddTask,
  onEdit,
  onTaskClick,
  onViewModeChange,
  onPresetChange,
}: EHSAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30')
  const [viewMode, setViewMode] = useState<DashboardViewMode>(initialViewMode)
  const [preset, setPreset] = useState<DashboardPreset>(initialPreset)
  const [visibility, setVisibility] = useState<WidgetVisibility>(PRESET_CONFIGS[initialPreset])

  // Handle view mode changes
  const handleViewModeChange = (mode: DashboardViewMode) => {
    setViewMode(mode)
    onViewModeChange?.(mode)
  }

  // Handle preset changes
  const handlePresetChange = (newPreset: DashboardPreset) => {
    setPreset(newPreset)
    setVisibility(PRESET_CONFIGS[newPreset])
    onPresetChange?.(newPreset)
  }

  const toggleVisibility = (key: keyof WidgetVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
    // Switch to custom preset when manually toggling
    if (preset !== 'custom') {
      setPreset('custom')
    }
  }

  // Compute urgent items for "Act Now" section
  const urgentItems = useMemo(() => {
    const overdue = myPriorityTasks.filter((t) => t.type === 'overdue')
    const critical = myPriorityTasks.filter((t) => t.type === 'critical')
    const dueToday = myPriorityTasks.filter((t) => t.type === 'due-today')
    return { overdue, critical, dueToday, total: overdue.length + critical.length + dueToday.length }
  }, [myPriorityTasks])

  return (
    <div className="relative min-h-screen bg-page dark:bg-page overflow-hidden">
      {/* Animated grid blob background */}
      <GridBlobBackground scale={1.2} />

      <DashboardHeader
        title={title}
        subtitle={subtitle}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        visibility={visibility}
        onVisibilityChange={toggleVisibility}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        preset={preset}
        onPresetChange={handlePresetChange}
        onEdit={onEdit}
      />

      <div className="relative z-[1] p-6 space-y-8">
        {/* Morning Briefing Mode */}
        {viewMode === 'briefing' ? (
          <MorningBriefingView
            userName={userName}
            myPriorityTasks={myPriorityTasks}
            incidentData={incidentData}
            agingData={agingData}
            upcomingTasks={upcomingTasks}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ) : (
          <>
            {/* ============================================================= */}
            {/* TIER 1: ACT NOW - Urgent items requiring immediate attention */}
            {/* ============================================================= */}
            {visibility.actNow && (myPriorityTasks.length > 0 || agingData.length > 0) && (
              <section>
                <SectionHeader
                  icon={<AlertCircle />}
                  title="Act Now"
                  description="Items requiring your immediate attention"
                  badge={urgentItems.total > 0 ? `${urgentItems.total} urgent` : undefined}
                  badgeVariant="error"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* My Priority Card */}
                  <MyPriorityCard tasks={myPriorityTasks} onTaskClick={onTaskClick} />

                  {/* Aging metrics */}
                  {agingData.length > 0 && <AgingCard items={agingData} />}

                  {/* Upcoming Tasks - moved here for actionability */}
                  <UpcomingTasksCard tasks={upcomingTasks} onAddTask={onAddTask} />
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* TIER 2: HEALTH CHECK - Status overview and KPIs */}
            {/* ============================================================= */}
            {visibility.healthCheck && (kpiData.length > 0 || incidentData.length > 0) && (
              <section>
                <SectionHeader
                  icon={<Sparkles />}
                  title="Health Check"
                  description="Overall safety performance and status"
                />

                {/* Hero KPIs */}
                {kpiData.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {kpiData.map((kpi) => (
                      <KPICard
                        key={kpi.id}
                        title={kpi.title}
                        value={kpi.value}
                        description={kpi.description}
                        icon={kpi.icon}
                        isHero={kpi.isHero}
                        zeroIsCelebratory={kpi.zeroIsCelebratory}
                      />
                    ))}
                  </div>
                )}

                {/* Incident Overview */}
                {incidentData.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {incidentData.map((item) => (
                      <KPICard
                        key={item.id}
                        title={item.title}
                        value={item.value}
                        description={item.description}
                        trend={item.trend}
                        trendDirection={item.trendDirection}
                        isNegativeMetric={item.isNegativeMetric}
                        isPositive={item.isPositive}
                        zeroIsCelebratory={item.zeroIsCelebratory}
                      />
                    ))}
                    {severityBreakdown.length > 0 && (
                      <BreakdownCard
                        icon={<Zap />}
                        title="Severity Breakdown"
                        total={severityBreakdown.reduce((sum, i) => sum + i.value, 0)}
                        items={severityBreakdown}
                        zeroIsCelebratory={false}
                      />
                    )}
                    {focusFourIncidents.length > 0 && (
                      <BreakdownCard
                        icon={<Target />}
                        title="Focus Four Incidents"
                        total={focusFourIncidents.reduce((sum, i) => sum + i.value, 0)}
                        items={focusFourIncidents}
                        zeroIsCelebratory={false}
                      />
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ============================================================= */}
            {/* TIER 3: INSIGHTS - Analytics and pattern recognition */}
            {/* ============================================================= */}
            {visibility.insights && (trendingIncidents.length > 0 || locationRisks.length > 0 || employeeWorkload.length > 0 || actionData.length > 0) && (
              <section>
                <SectionHeader
                  icon={<Activity />}
                  title="Insights"
                  description="Trends, patterns, and analytics"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Action Metrics */}
                  {actionData.map((item) => (
                    <StatsCard
                      key={item.id}
                      title={item.title}
                      value={item.value}
                      description={item.description}
                    />
                  ))}

                  {/* Trending */}
                  {trendingIncidents.length > 0 && (
                    <TrendingCard
                      title="Incident Types"
                      total={trendingIncidents.reduce((sum, i) => sum + i.count, 0)}
                      items={trendingIncidents}
                    />
                  )}

                  {/* Risk Heatmap */}
                  {locationRisks.length > 0 && <RiskHeatmapCard items={locationRisks} />}

                  {/* Workload */}
                  {employeeWorkload.length > 0 && <WorkloadCard items={employeeWorkload} />}
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* TIER 4: CONTEXT - Background organizational info */}
            {/* ============================================================= */}
            {visibility.context && generalData.length > 0 && (
              <section>
                <SectionHeader
                  icon={<Building2 />}
                  title="Organization Context"
                  description="Background information and reference data"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {generalData.map((item) => (
                    <KPICard
                      key={item.id}
                      title={item.title}
                      value={item.value}
                      description={item.description}
                      icon={item.icon}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ============================================================= */}
            {/* TIER 5: PLANNING - Future-focused */}
            {/* ============================================================= */}
            {visibility.planning && upcomingTasks.length > 0 && !visibility.actNow && (
              <section>
                <SectionHeader
                  icon={<Calendar />}
                  title="Planning"
                  description="Upcoming tasks and schedule"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <UpcomingTasksCard tasks={upcomingTasks} onAddTask={onAddTask} />
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
