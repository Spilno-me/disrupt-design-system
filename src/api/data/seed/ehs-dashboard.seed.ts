/**
 * EHS Dashboard Seed Data
 *
 * Centralized mock data for EHS (Environmental Health & Safety) dashboards.
 * Provides data for KPIs, analytics, activity feeds, and tasks.
 *
 * Note: Icons and onClick handlers are added in the consuming component/story.
 * This file contains only the pure data.
 *
 * @example
 * ```typescript
 * import { seedEhsKpis, seedEhsAnalytics } from '@/api'
 *
 * // Add icons in your component
 * const kpisWithIcons = seedEhsKpis.map(kpi => ({
 *   ...kpi,
 *   icon: getKpiIcon(kpi.id),
 * }))
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * KPI item for dashboard display
 */
export interface EhsKpiItem {
  id: string
  label: string
  value: number | string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  description?: string
  /** Icon ID - map to actual icon in component */
  iconId?: 'shield' | 'alert' | 'waypoints' | 'users' | 'alert-circle' | 'shield-check' | 'refresh' | 'map-pin'
  isHero?: boolean
  zeroIsCelebratory?: boolean
  isNegativeMetric?: boolean
  isPositive?: boolean
}

/**
 * Activity feed item
 */
export interface EhsActivityItem {
  id: string
  type: 'warning' | 'success' | 'info' | 'error'
  title: string
  description: string
  timestamp: string
}

/**
 * Quick action button configuration
 */
export interface EhsQuickAction {
  id: string
  label: string
  description: string
  /** Icon ID - map to actual icon in component */
  iconId: 'alert' | 'waypoints' | 'camera' | 'plus' | 'clipboard'
  variant?: 'primary' | 'secondary' | 'outline'
}

/**
 * Breakdown item for charts/lists
 */
export interface EhsBreakdownItem {
  label: string
  value: number
  variant: 'error' | 'warning' | 'info' | 'success' | 'default'
}

/**
 * Aging data item
 */
export interface EhsAgingItem {
  label: string
  value: number
  variant: 'warning' | 'error'
}

/**
 * Trending incident type
 */
export interface EhsTrendingItem {
  label: string
  count: number
}

/**
 * Location risk item
 */
export interface EhsLocationRisk {
  location: string
  count: number
  risk: 'critical' | 'high' | 'medium' | 'low'
}

/**
 * Employee workload item
 */
export interface EhsWorkloadItem {
  name: string
  initials: string
  count: number
  color: 'error' | 'warning' | 'info' | 'success'
}

/**
 * Upcoming task item
 */
export interface EhsUpcomingTask {
  id: string
  title: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  assignee: string
}

/**
 * Priority task item
 */
export interface EhsPriorityTask {
  id: string
  title: string
  type: 'overdue' | 'due-today' | 'critical' | 'assigned'
  dueDate?: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

/**
 * Corrective action stats
 */
export interface EhsActionStats {
  id: string
  title: string
  value: number | string
  description: string
}

// =============================================================================
// DASHBOARD KPIs
// =============================================================================

/**
 * Main dashboard KPI cards
 */
export const seedEhsKpis: EhsKpiItem[] = [
  {
    id: 'days-safe',
    label: 'Days Without Incident',
    value: 47,
    trend: '+47',
    trendDirection: 'up',
    iconId: 'shield',
  },
  {
    id: 'open-incidents',
    label: 'Open Incidents',
    value: 3,
    trend: '-2',
    trendDirection: 'down',
    iconId: 'alert',
  },
  {
    id: 'workflow-steps',
    label: 'Active Workflows',
    value: 12,
    trend: '+3',
    trendDirection: 'up',
    iconId: 'waypoints',
  },
  {
    id: 'training-complete',
    label: 'Training Compliance',
    value: '94%',
    trend: '+5%',
    trendDirection: 'up',
    iconId: 'users',
  },
]

// =============================================================================
// ACTIVITY FEED
// =============================================================================

/**
 * Recent activity feed items
 */
export const seedEhsActivity: EhsActivityItem[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Slip hazard reported',
    description: 'Wet floor in Building A lobby - under review',
    timestamp: '10 min ago',
  },
  {
    id: '2',
    type: 'success',
    title: 'Fire drill completed',
    description: 'Evacuation time: 3:42 - within target',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'PPE inspection scheduled',
    description: 'Warehouse team - due tomorrow',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    type: 'success',
    title: 'Safety training completed',
    description: 'Forklift certification - 12 employees',
    timestamp: '3 hours ago',
  },
]

// =============================================================================
// QUICK ACTIONS
// =============================================================================

/**
 * Quick action button configurations
 */
export const seedEhsQuickActions: EhsQuickAction[] = [
  {
    id: 'report-incident',
    label: 'Report Incident',
    description: 'Log a new safety incident',
    iconId: 'alert',
    variant: 'primary',
  },
  {
    id: 'start-workflow',
    label: 'Start Workflow',
    description: 'Begin a new workflow',
    iconId: 'waypoints',
  },
  {
    id: 'capture-observation',
    label: 'Capture Observation',
    description: 'Document a safety observation',
    iconId: 'camera',
  },
]

// =============================================================================
// ANALYTICS - KPIs
// =============================================================================

/**
 * Analytics dashboard hero KPIs
 */
export const seedEhsAnalyticsKpis: EhsKpiItem[] = [
  {
    id: 'ltir',
    label: 'Lost Time Injury Rate',
    value: 0,
    description: 'Per 200,000 hours worked',
    iconId: 'alert-circle',
    isHero: true,
    zeroIsCelebratory: true,
  },
  {
    id: 'trir',
    label: 'Total Recordable Incidents',
    value: 1.2,
    description: 'Per 200,000 hours worked',
    iconId: 'alert',
    zeroIsCelebratory: true,
  },
  {
    id: 'nmr',
    label: 'Near Miss Rate',
    value: 4.8,
    description: 'Proactive safety indicators',
    iconId: 'shield-check',
  },
  {
    id: 'oca',
    label: 'Overdue CA',
    value: 3,
    description: '3 actions need attention',
    iconId: 'refresh',
    zeroIsCelebratory: true,
  },
]

/**
 * Incident statistics KPIs
 */
export const seedEhsIncidentStats: EhsKpiItem[] = [
  {
    id: 'total',
    label: 'Total Incidents',
    value: 47,
    description: 'YTD recorded incidents',
    isNegativeMetric: true,
  },
  {
    id: 'active',
    label: 'Active Incidents',
    value: 12,
    description: 'Requiring attention',
    trend: '-2',
    trendDirection: 'down',
    isNegativeMetric: true,
  },
  {
    id: 'high',
    label: 'High Severity',
    value: 0,
    description: 'No critical issues',
    isNegativeMetric: true,
    zeroIsCelebratory: true,
  },
  {
    id: 'lti',
    label: 'Days Since Last LTI',
    value: 127,
    description: 'Keep the streak going!',
    isPositive: true,
  },
]

/**
 * General statistics
 */
export const seedEhsGeneralStats: EhsKpiItem[] = [
  {
    id: 'locations',
    label: 'Total Locations',
    value: 24,
    description: 'Active facilities',
    iconId: 'map-pin',
  },
  {
    id: 'users',
    label: 'Active Users',
    value: 156,
    description: 'This month',
    iconId: 'users',
  },
]

// =============================================================================
// ANALYTICS - BREAKDOWNS
// =============================================================================

/**
 * Severity breakdown data
 */
export const seedEhsSeverityBreakdown: EhsBreakdownItem[] = [
  { label: 'Critical/Fatality', value: 0, variant: 'error' },
  { label: 'Lost Time', value: 2, variant: 'warning' },
  { label: 'Recordable', value: 8, variant: 'info' },
  { label: 'Near Miss', value: 24, variant: 'success' },
  { label: 'First Aid', value: 13, variant: 'default' },
]

/**
 * OSHA Focus Four incidents breakdown
 */
export const seedEhsFocusFour: EhsBreakdownItem[] = [
  { label: 'Falls', value: 3, variant: 'warning' },
  { label: 'Struck By', value: 5, variant: 'error' },
  { label: 'Caught In Between', value: 1, variant: 'warning' },
  { label: 'Electrocution', value: 0, variant: 'success' },
]

/**
 * Corrective action aging data
 */
export const seedEhsAgingData: EhsAgingItem[] = [
  { label: '30+ days', value: 4, variant: 'warning' },
  { label: '60+ days', value: 2, variant: 'error' },
  { label: '90+ days', value: 1, variant: 'error' },
]

// =============================================================================
// ANALYTICS - CORRECTIVE ACTIONS
// =============================================================================

/**
 * Corrective action statistics
 */
export const seedEhsActionStats: EhsActionStats[] = [
  { id: 'total', title: 'Total CA', value: 89, description: 'Total corrective actions' },
  { id: 'completed', title: 'Completed CA', value: 67, description: 'Completed and verified' },
  { id: 'rate', title: 'CA Close-Out Rate', value: '75.3%', description: 'Target: 85%' },
  { id: 'progress', title: 'CA In Progress', value: 15, description: 'Currently in progress' },
  { id: 'notstarted', title: 'CA Not Started', value: 7, description: 'Awaiting assignment' },
]

// =============================================================================
// ANALYTICS - INSIGHTS
// =============================================================================

/**
 * Trending incident types
 */
export const seedEhsTrendingIncidents: EhsTrendingItem[] = [
  { label: 'Slip/Trip/Fall Report', count: 18 },
  { label: 'Near Miss Report', count: 24 },
  { label: 'Equipment Damage', count: 9 },
  { label: 'Environmental Spill', count: 3 },
]

/**
 * Location risk hotspots
 */
export const seedEhsLocationRisks: EhsLocationRisk[] = [
  { location: 'Warehouse B - Loading Dock', count: 8, risk: 'critical' },
  { location: 'Manufacturing Floor A', count: 5, risk: 'high' },
  { location: 'Chemical Storage Unit', count: 3, risk: 'medium' },
  { location: 'Admin Building', count: 1, risk: 'low' },
]

/**
 * Employee workload distribution
 */
export const seedEhsEmployeeWorkload: EhsWorkloadItem[] = [
  { name: 'Sarah Chen', initials: 'SC', count: 18, color: 'error' },
  { name: 'Marcus Johnson', initials: 'MJ', count: 12, color: 'warning' },
  { name: 'Emily Rodriguez', initials: 'ER', count: 8, color: 'info' },
  { name: 'James Wilson', initials: 'JW', count: 4, color: 'success' },
]

// =============================================================================
// ANALYTICS - TASKS
// =============================================================================

/**
 * Upcoming tasks
 */
export const seedEhsUpcomingTasks: EhsUpcomingTask[] = [
  { id: '1', title: 'Safety audit - Warehouse B', dueDate: 'Today', priority: 'high', assignee: 'SC' },
  { id: '2', title: 'Fire drill coordination', dueDate: 'Tomorrow', priority: 'medium', assignee: 'MJ' },
  { id: '3', title: 'PPE inventory check', dueDate: 'Dec 26', priority: 'low', assignee: 'ER' },
]

/**
 * My priority tasks (for "Act Now" section)
 */
export const seedEhsPriorityTasks: EhsPriorityTask[] = [
  { id: 'p1', title: 'Complete incident investigation - INC-2024-0847', type: 'overdue', dueDate: 'Dec 20', severity: 'high' },
  { id: 'p2', title: 'Review corrective action plan', type: 'due-today', dueDate: 'Today', severity: 'medium' },
  { id: 'p3', title: 'Chemical spill response assessment', type: 'critical', severity: 'critical' },
  { id: 'p4', title: 'Safety training follow-up', type: 'due-today', dueDate: 'Today', severity: 'low' },
  { id: 'p5', title: 'Equipment inspection - Forklift #3', type: 'assigned', dueDate: 'Dec 26', severity: 'medium' },
  { id: 'p6', title: 'PPE compliance audit sign-off', type: 'overdue', dueDate: 'Dec 18', severity: 'high' },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get KPI by ID
 */
export function getEhsKpiById(id: string): EhsKpiItem | undefined {
  return [...seedEhsKpis, ...seedEhsAnalyticsKpis, ...seedEhsIncidentStats, ...seedEhsGeneralStats].find(
    (kpi) => kpi.id === id
  )
}

/**
 * Get tasks by type
 */
export function getEhsTasksByType(type: EhsPriorityTask['type']): EhsPriorityTask[] {
  return seedEhsPriorityTasks.filter((task) => task.type === type)
}

/**
 * Get overdue tasks count
 */
export function getEhsOverdueCount(): number {
  return seedEhsPriorityTasks.filter((task) => task.type === 'overdue').length
}

/**
 * Get critical location risks
 */
export function getEhsCriticalLocations(): EhsLocationRisk[] {
  return seedEhsLocationRisks.filter((loc) => loc.risk === 'critical' || loc.risk === 'high')
}

/**
 * Calculate total incidents from severity breakdown
 */
export function getEhsTotalIncidents(): number {
  return seedEhsSeverityBreakdown.reduce((sum, item) => sum + item.value, 0)
}

/**
 * Get CA completion percentage
 */
export function getEhsCACompletionRate(): number {
  const total = seedEhsActionStats.find((s) => s.id === 'total')?.value
  const completed = seedEhsActionStats.find((s) => s.id === 'completed')?.value
  if (typeof total === 'number' && typeof completed === 'number' && total > 0) {
    return Math.round((completed / total) * 100)
  }
  return 0
}
