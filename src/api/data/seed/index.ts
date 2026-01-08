/**
 * Seed Data Index
 *
 * Central export for all seed data and initialization utilities.
 */

// User seed data
export {
  seedUsers,
  getSeedDepartments,
  getSeedJobTitles,
  getSeedUserStats,
} from './users.seed'

// Role seed data
export {
  seedRoles,
  seedPermissions,
  seedEnhancedPermissions,
  getRoleByLevel,
  getPermissionsForResource,
} from './roles.seed'

// Location seed data
export {
  seedLocations,
  seedLocationsTree,
  seedLocationsTreeExtended,
  emptyLocations,
  flattenLocationTree,
  buildLocationTree,
  getAllLocationIds,
  getSeedLocationById,
  getChildLocations,
  getRootLocations,
  getLocationSelectOptions,
} from './locations.seed'

// Incident seed data
export {
  seedIncidents,
  getIncidentsByStatus,
  getIncidentsBySeverity,
  getOverdueIncidents,
  getIncidentStats,
  getNextIncidentSequence,
  generateManyIncidents,
  getIncidentById,
  getIncidentByIncidentId,
} from './incidents.seed'

// Step seed data
export {
  seedSteps,
  seedMySteps,
  seedTeamSteps,
  generateManySteps,
  getStepsByIncident,
  getStepsByAssignee,
  getStepsByStatus,
  getOverdueSteps,
  getStepStats,
} from './steps.seed'

// Dictionary seed data
export {
  seedDictionaryCategories,
  seedDictionaryEntries,
  getEntriesByCategory,
  getCategoryByCode,
  getEntryByCode,
} from './dictionary.seed'

// Document/Evidence seed data
export {
  seedDocuments,
  seedUserContext,
  getDocumentsForRole,
  getDocumentById,
} from './documents.seed'

// Form submission seed data
export {
  seedIncidentReportFormData,
  seedExtendedFormSubmissions,
  getFormSubmissionsByStatus,
  getFormSubmissionsByType,
} from './forms.seed'

// Workflow seed data
export {
  seedDetailedWorkflows,
  getWorkflowsByStatus,
  getWorkflowById,
  getActiveWorkflowsCount,
} from './workflows.seed'

// Entity template seed data
export {
  seedEntityTemplates,
  getTemplatesByCategory,
  getSystemTemplates,
  getCustomTemplates,
  getTemplateByCode,
  getTemplateById,
  getTemplateCounts,
} from './entity-templates.seed'
export type { EntityTemplateCategory } from './entity-templates.seed'

// User metadata seed data
export {
  seedUserStats,
  seedDepartments,
  seedJobTitles,
  seedUserActivities,
  seedLocationTree,
  getUserActivities,
  getActivitiesByType,
  flattenLocationTree as flattenUserLocationTree,
  getLocationById as getUserLocationById,
} from './user-meta.seed'

// Incident table seed data (for IncidentManagementTable component)
export {
  // Data arrays
  incidentTitles,
  incidentLocations,
  incidentReporters,
  stepTemplates,
  stepAssignees,
  // Generator functions
  generateIncidentsForTable,
  generateStepsForTableIncidents,
  splitStepsByAssignee,
  // Helper functions
  getTableIncidentsByStatus,
  getTableIncidentsBySeverity,
  getTableOverdueIncidents,
  getIncidentLocationSelectOptions,
} from './incident-table.seed'

// Flow app configuration seed data
export {
  // Types
  type DashboardWidgetConfig,
  type KpiThreshold,
  type FilterGroupConfig,
  type AiPageContext,
  type AiContextualActionConfig,
  type AiPageConfig,
  // Dashboard configuration
  seedDashboardWidgets,
  seedKpiThresholds,
  seedSparklineData,
  // Filter configuration
  seedIncidentFilterGroups,
  // AI Assistant configuration
  seedAiPageContexts,
  // Helper functions
  getWidgetsBySection,
  getVisibleWidgets,
  getAiPageConfig,
  getKpiThreshold,
  getSparklineData,
} from './flow-config.seed'

// Workspace seed data
export {
  seedWorkspaceNodes,
  getWorkspacesByProduct,
  getRootFolders,
  getWorkspaceById,
  getNodeChildren,
  getDescendantIds,
  getWorkspaceStats,
} from './workspaces.seed'

// EHS Dashboard seed data
export {
  // Types
  type EhsKpiItem,
  type EhsActivityItem,
  type EhsQuickAction,
  type EhsBreakdownItem,
  type EhsAgingItem,
  type EhsTrendingItem,
  type EhsLocationRisk,
  type EhsWorkloadItem,
  type EhsUpcomingTask,
  type EhsPriorityTask,
  type EhsActionStats,
  // Dashboard KPIs
  seedEhsKpis,
  seedEhsActivity,
  seedEhsQuickActions,
  // Analytics KPIs
  seedEhsAnalyticsKpis,
  seedEhsIncidentStats,
  seedEhsGeneralStats,
  // Breakdowns
  seedEhsSeverityBreakdown,
  seedEhsFocusFour,
  seedEhsAgingData,
  // Corrective Actions
  seedEhsActionStats,
  // Insights
  seedEhsTrendingIncidents,
  seedEhsLocationRisks,
  seedEhsEmployeeWorkload,
  // Tasks
  seedEhsUpcomingTasks,
  seedEhsPriorityTasks,
  // Helper functions
  getEhsKpiById,
  getEhsTasksByType,
  getEhsOverdueCount,
  getEhsCriticalLocations,
  getEhsTotalIncidents,
  getEhsCACompletionRate,
} from './ehs-dashboard.seed'
