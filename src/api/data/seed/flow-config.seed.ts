/**
 * Flow App Configuration Seed Data
 *
 * Centralized configuration for the Flow EHS application.
 * Contains widget configs, thresholds, sparkline samples, filters, and AI contexts.
 *
 * @example
 * ```typescript
 * import {
 *   seedDashboardWidgets,
 *   seedKpiThresholds,
 *   seedIncidentFilterGroups,
 *   seedAiPageContexts,
 * } from '@/api'
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Widget configuration for editable dashboard
 */
export interface DashboardWidgetConfig {
  id: string
  type: 'kpi' | 'priority' | 'breakdown' | 'stats' | 'aging' | 'trending' | 'heatmap' | 'workload' | 'tasks'
  title: string
  visible: boolean
  size: '1x1' | '2x1' | '1x2' | '2x2'
  order: number
  section: 'priority' | 'kpis' | 'incidents' | 'actions' | 'general' | 'analytics'
}

/**
 * KPI threshold configuration for status zones
 */
export interface KpiThreshold {
  warning: number
  critical: number
}

/**
 * Filter group for SearchFilter component
 */
export interface FilterGroupConfig {
  key: string
  label: string
  options: Array<{ id: string; label: string }>
}

/**
 * AI Assistant page context
 */
export interface AiPageContext {
  pageId: string
  pageName: string
  pageDescription: string
  entityType?: string
}

/**
 * AI Assistant contextual action (without icon - add in component)
 */
export interface AiContextualActionConfig {
  id: string
  label: string
  description: string
  iconId: 'shield-check' | 'alert-circle' | 'download' | 'clock' | 'sparkles' | 'globe' |
          'zap' | 'hourglass' | 'clipboard-list' | 'contact' | 'waypoints' | 'shield' |
          'eye' | 'eye-off' | 'refresh' | 'activity' | 'trending-up' | 'target'
  colorClass: string
}

/**
 * Complete AI page configuration
 */
export interface AiPageConfig {
  context: AiPageContext
  actions: AiContextualActionConfig[]
}

// =============================================================================
// DASHBOARD WIDGET CONFIGURATION
// =============================================================================

/**
 * Initial widget configuration for editable dashboard
 */
export const seedDashboardWidgets: DashboardWidgetConfig[] = [
  // Priority section - "Act Now" items that need immediate attention
  { id: 'my-priority', type: 'priority', title: 'My Priority', visible: true, size: '2x1', order: 0, section: 'priority' },
  // KPIs section
  { id: 'kpi-ltir', type: 'kpi', title: 'Lost Time Injury Rate', visible: true, size: '1x1', order: 0, section: 'kpis' },
  { id: 'kpi-trir', type: 'kpi', title: 'Total Recordable Incidents', visible: true, size: '1x1', order: 1, section: 'kpis' },
  { id: 'kpi-nmr', type: 'kpi', title: 'Near Miss Rate', visible: true, size: '1x1', order: 2, section: 'kpis' },
  { id: 'kpi-oca', type: 'kpi', title: 'Overdue CA', visible: true, size: '1x1', order: 3, section: 'kpis' },
  // Incidents section
  { id: 'incident-total', type: 'kpi', title: 'Total Incidents', visible: true, size: '1x1', order: 0, section: 'incidents' },
  { id: 'incident-active', type: 'kpi', title: 'Active Incidents', visible: true, size: '1x1', order: 1, section: 'incidents' },
  { id: 'incident-high', type: 'kpi', title: 'High Severity', visible: true, size: '1x1', order: 2, section: 'incidents' },
  { id: 'incident-lti', type: 'kpi', title: 'Days Since Last LTI', visible: true, size: '1x1', order: 3, section: 'incidents' },
  { id: 'breakdown-severity', type: 'breakdown', title: 'Severity Breakdown', visible: true, size: '1x1', order: 4, section: 'incidents' },
  { id: 'breakdown-focus', type: 'breakdown', title: 'Focus Four Incidents', visible: true, size: '1x1', order: 5, section: 'incidents' },
  // Corrective Actions section
  { id: 'action-total', type: 'stats', title: 'Total CA', visible: true, size: '1x1', order: 0, section: 'actions' },
  { id: 'action-completed', type: 'stats', title: 'Completed CA', visible: true, size: '1x1', order: 1, section: 'actions' },
  { id: 'action-rate', type: 'stats', title: 'CA Close-Out Rate', visible: true, size: '1x1', order: 2, section: 'actions' },
  { id: 'action-progress', type: 'stats', title: 'CA In Progress', visible: true, size: '1x1', order: 3, section: 'actions' },
  { id: 'action-notstarted', type: 'stats', title: 'CA Not Started', visible: true, size: '1x1', order: 4, section: 'actions' },
  { id: 'aging-ca', type: 'aging', title: 'CA Aging', visible: true, size: '1x1', order: 5, section: 'actions' },
  // General section
  { id: 'general-locations', type: 'kpi', title: 'Total Locations', visible: true, size: '1x1', order: 0, section: 'general' },
  { id: 'general-users', type: 'kpi', title: 'Active Users', visible: true, size: '1x1', order: 1, section: 'general' },
  // Analytics section
  { id: 'trending-types', type: 'trending', title: 'Incident Types', visible: true, size: '1x1', order: 0, section: 'analytics' },
  { id: 'heatmap-risk', type: 'heatmap', title: 'Location Risks', visible: true, size: '1x1', order: 1, section: 'analytics' },
  { id: 'workload-team', type: 'workload', title: 'Team Workload', visible: true, size: '1x1', order: 2, section: 'analytics' },
  { id: 'tasks-upcoming', type: 'tasks', title: 'Upcoming Tasks', visible: true, size: '1x1', order: 3, section: 'analytics' },
]

// =============================================================================
// KPI THRESHOLDS & SAMPLE DATA
// =============================================================================

/**
 * KPI threshold configurations for status zone indicators
 */
export const seedKpiThresholds: Record<string, KpiThreshold> = {
  ltir: { warning: 0.5, critical: 1.5 },          // LTIR per 200k hours
  trir: { warning: 1.5, critical: 3.0 },          // TRIR thresholds
  nmr: { warning: 3, critical: 1 },               // Near miss (higher is better)
  oca: { warning: 3, critical: 8 },               // Overdue CA thresholds
  activeIncidents: { warning: 10, critical: 20 }, // Active incident count
}

/**
 * Sample sparkline data for KPI trends (last 14 data points)
 */
export const seedSparklineData: Record<string, number[]> = {
  ltir: [0.2, 0.1, 0.15, 0.1, 0.05, 0.08, 0.03, 0.02, 0.01, 0, 0, 0, 0, 0],
  trir: [1.8, 1.6, 1.5, 1.7, 1.4, 1.3, 1.5, 1.4, 1.3, 1.2, 1.25, 1.2, 1.15, 1.2],
  nmr: [3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.3, 4.6, 4.4, 4.7, 4.5, 4.8, 4.6, 4.8],
  oca: [8, 7, 6, 5, 6, 5, 4, 5, 4, 3, 4, 3, 3, 3],
  activeIncidents: [18, 17, 16, 15, 14, 15, 14, 13, 14, 13, 12, 13, 12, 12],
  daysSinceLti: [100, 105, 110, 112, 115, 117, 119, 120, 121, 123, 124, 125, 126, 127],
}

// =============================================================================
// FILTER CONFIGURATION
// =============================================================================

/**
 * Filter groups for incident SearchFilter dropdown
 * NOTE: Status filtering is handled by QuickFilters (Hick's Law - avoid competing systems)
 */
export const seedIncidentFilterGroups: FilterGroupConfig[] = [
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
// AI ASSISTANT PAGE CONTEXTS
// =============================================================================

/**
 * AI Assistant page context and contextual actions for each page in the Flow app.
 * Icons are referenced by ID and mapped in the consuming component.
 */
export const seedAiPageContexts: Record<string, AiPageConfig> = {
  myFlow: {
    context: {
      pageId: 'myFlow',
      pageName: 'Dashboard',
      pageDescription: 'EHS Analytics & KPIs',
      entityType: 'dashboard',
    },
    actions: [
      { id: 'compliance-check', label: 'Check Compliance', description: 'Review compliance status across locations', iconId: 'shield-check', colorClass: 'text-success' },
      { id: 'risk-analysis', label: 'Analyze Risks', description: 'AI risk assessment for high-priority areas', iconId: 'alert-circle', colorClass: 'text-warning' },
      { id: 'generate-report', label: 'Generate Report', description: 'Create executive summary report', iconId: 'download', colorClass: 'text-accent' },
    ],
  },
  incidents: {
    context: {
      pageId: 'incidents',
      pageName: 'Incidents',
      pageDescription: 'Incident Management',
      entityType: 'incident',
    },
    actions: [
      { id: 'find-overdue', label: 'Find Overdue', description: 'Show incidents past their due date', iconId: 'clock', colorClass: 'text-error' },
      { id: 'suggest-actions', label: 'Suggest Actions', description: 'AI-recommended next steps for open incidents', iconId: 'sparkles', colorClass: 'text-accent' },
      { id: 'similar-incidents', label: 'Find Similar', description: 'Search for related past incidents', iconId: 'globe', colorClass: 'text-info' },
    ],
  },
  steps: {
    context: {
      pageId: 'steps',
      pageName: 'Steps',
      pageDescription: 'Workflow Configuration',
      entityType: 'step',
    },
    actions: [
      { id: 'optimize-workflow', label: 'Optimize Workflow', description: 'Suggestions to streamline steps', iconId: 'zap', colorClass: 'text-warning' },
      { id: 'find-bottlenecks', label: 'Find Bottlenecks', description: 'Identify slow or stuck workflows', iconId: 'hourglass', colorClass: 'text-error' },
      { id: 'template-suggestions', label: 'Templates', description: 'Recommended workflow templates', iconId: 'clipboard-list', colorClass: 'text-accent' },
    ],
  },
  directory: {
    context: {
      pageId: 'directory',
      pageName: 'Directory',
      pageDescription: 'Organization Directory',
      entityType: 'person',
    },
    actions: [
      { id: 'find-person', label: 'Find Person', description: 'Search for employees by name or role', iconId: 'contact', colorClass: 'text-accent' },
      { id: 'org-chart', label: 'Show Org Chart', description: 'View organizational hierarchy', iconId: 'waypoints', colorClass: 'text-info' },
      { id: 'training-status', label: 'Training Status', description: 'Check certification compliance', iconId: 'shield-check', colorClass: 'text-success' },
    ],
  },
  users: {
    context: {
      pageId: 'users',
      pageName: 'User Management',
      pageDescription: 'Users, Roles & Permissions',
      entityType: 'user',
    },
    actions: [
      { id: 'audit-permissions', label: 'Audit Permissions', description: 'Review user access levels', iconId: 'shield', colorClass: 'text-warning' },
      { id: 'inactive-users', label: 'Inactive Users', description: "Find users who haven't logged in", iconId: 'eye', colorClass: 'text-error' },
      { id: 'role-suggestions', label: 'Role Suggestions', description: 'AI-recommended role assignments', iconId: 'sparkles', colorClass: 'text-accent' },
    ],
  },
  dictionaries: {
    context: {
      pageId: 'dictionaries',
      pageName: 'Dictionaries',
      pageDescription: 'Lookup Values & Categories',
      entityType: 'dictionary',
    },
    actions: [
      { id: 'find-duplicates', label: 'Find Duplicates', description: 'Identify duplicate entries', iconId: 'refresh', colorClass: 'text-warning' },
      { id: 'unused-values', label: 'Unused Values', description: 'Find values not being used', iconId: 'eye-off', colorClass: 'text-secondary' },
      { id: 'suggest-values', label: 'Suggest Values', description: 'AI-recommended new entries', iconId: 'sparkles', colorClass: 'text-accent' },
    ],
  },
  locations: {
    context: {
      pageId: 'locations',
      pageName: 'Locations',
      pageDescription: 'Facility & Zone Hierarchy',
      entityType: 'location',
    },
    actions: [
      { id: 'risk-heatmap', label: 'Risk Heatmap', description: 'View risk levels by location', iconId: 'activity', colorClass: 'text-error' },
      { id: 'compliance-by-location', label: 'Compliance Report', description: 'Location-based compliance status', iconId: 'shield-check', colorClass: 'text-success' },
      { id: 'missing-data', label: 'Missing Data', description: 'Find locations with incomplete info', iconId: 'alert-circle', colorClass: 'text-warning' },
    ],
  },
  templates: {
    context: {
      pageId: 'templates',
      pageName: 'Entity Templates',
      pageDescription: 'Configuration Templates',
      entityType: 'template',
    },
    actions: [
      { id: 'template-usage', label: 'Usage Analysis', description: 'See which templates are most used', iconId: 'trending-up', colorClass: 'text-accent' },
      { id: 'suggest-fields', label: 'Suggest Fields', description: 'AI-recommended template fields', iconId: 'sparkles', colorClass: 'text-warning' },
      { id: 'compare-templates', label: 'Compare', description: 'Compare similar templates', iconId: 'target', colorClass: 'text-info' },
    ],
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get widgets by section, sorted by order
 */
export function getWidgetsBySection(
  widgets: DashboardWidgetConfig[],
  section: DashboardWidgetConfig['section']
): DashboardWidgetConfig[] {
  return widgets
    .filter((w) => w.section === section)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get visible widgets only
 */
export function getVisibleWidgets(widgets: DashboardWidgetConfig[]): DashboardWidgetConfig[] {
  return widgets.filter((w) => w.visible)
}

/**
 * Get AI page config by page ID
 */
export function getAiPageConfig(pageId: string): AiPageConfig | undefined {
  return seedAiPageContexts[pageId]
}

/**
 * Get threshold for a specific KPI
 */
export function getKpiThreshold(kpiId: string): KpiThreshold | undefined {
  return seedKpiThresholds[kpiId]
}

/**
 * Get sparkline data for a specific KPI
 */
export function getSparklineData(kpiId: string): number[] | undefined {
  return seedSparklineData[kpiId]
}
