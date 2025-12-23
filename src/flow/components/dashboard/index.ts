/**
 * Flow EHS Dashboard Components
 *
 * Reusable dashboard widgets for the Flow EHS application analytics dashboard.
 * These components follow UX laws (Miller's 7±2, Fitts', Von Restorff) and
 * use semantic tokens throughout.
 */

export { KPICard } from './KPICard'
export type { KPICardProps } from './KPICard'

export { BreakdownCard } from './BreakdownCard'
export type { BreakdownCardProps, BreakdownItem } from './BreakdownCard'

export { AgingCard } from './AgingCard'
export type { AgingCardProps, AgingItem } from './AgingCard'

export { TrendingCard } from './TrendingCard'
export type { TrendingCardProps, TrendingItem } from './TrendingCard'

export { RiskHeatmapCard } from './RiskHeatmapCard'
export type { RiskHeatmapCardProps, LocationRisk } from './RiskHeatmapCard'

export { WorkloadCard } from './WorkloadCard'
export type { WorkloadCardProps, WorkloadItem } from './WorkloadCard'

export { UpcomingTasksCard } from './UpcomingTasksCard'
export type { UpcomingTasksCardProps, UpcomingTask } from './UpcomingTasksCard'

export { SectionHeader } from './SectionHeader'
export type { SectionHeaderProps, BadgeVariant } from './SectionHeader'

export { EHSAnalyticsDashboard } from './EHSAnalyticsDashboard'
export type {
  EHSAnalyticsDashboardProps,
  DashboardViewMode,
  DashboardPreset,
  PriorityTask,
} from './EHSAnalyticsDashboard'

// Edit Mode Components
export {
  DashboardEditProvider,
  useDashboardEdit,
  useDashboardEditOptional,
  EditableWidget,
  ReorderableWidget,
  ReorderableSection,
  WidgetDropZone,
  EditModeToolbar,
  EditModeToggle,
  WidgetSettingsPanel,
} from './edit-mode'
export type {
  WidgetSize,
  WidgetConfig,
  DashboardLayout,
  DashboardEditContextValue,
  EditableWidgetProps,
  ReorderableWidgetProps,
  ReorderableSectionProps,
  WidgetDropZoneProps,
  EditModeToolbarProps,
  WidgetCatalogItem,
  WidgetSettingsPanelProps,
} from './edit-mode'
