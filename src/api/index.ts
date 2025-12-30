/**
 * DDS API Simulation Layer
 *
 * A production-quality API simulation for prototyping with:
 * - REST-like services with full CRUD operations
 * - Mutable in-memory state (persists during session)
 * - Network delay and error simulation
 * - Deep entity relationships with referential integrity
 * - Type-safe interfaces for all entities
 *
 * @example
 * ```typescript
 * import { api, initializeStore } from '@/api'
 *
 * // Initialize the store with seed data (call once on app start)
 * initializeStore()
 *
 * // Use the API
 * const { data: users } = await api.users.getAll({ page: 1, pageSize: 10 })
 * const { data: incident } = await api.incidents.create({
 *   title: 'Equipment malfunction',
 *   type: 'equipment',
 *   severity: 'high',
 *   ...
 * })
 *
 * // Reset to initial seed data
 * resetStore()
 * ```
 *
 * @module api
 */

// =============================================================================
// SERVICES
// =============================================================================

export {
  api,
  usersApi,
  rolesApi,
  locationsApi,
  incidentsApi,
  stepsApi,
  dictionaryApi,
} from './services'

// =============================================================================
// TYPES
// =============================================================================

export type {
  // Core API types
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  FilterParams,
  ListParams,
} from './core/types'

export type {
  // User types
  User,
  UserStatus,
  RoleAssignment,
  CreateUserInput,
  UpdateUserInput,
  UserListFilters,
  // Role types
  Role,
  RoleLevel,
  Permission,
  PermissionResource,
  PermissionAction,
  EnhancedPermission,
  CreateRoleInput,
  UpdateRoleInput,
  RoleListFilters,
} from './types/user.types'

export type {
  // Location types
  Location,
  LocationType,
  CreateLocationInput,
  UpdateLocationInput,
  LocationListFilters,
  GetLocationsOptions,
} from './types/location.types'

export type {
  // Incident types
  Incident,
  IncidentListItem,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  CreateIncidentInput,
  UpdateIncidentInput,
  IncidentListFilters,
} from './types/incident.types'

export type {
  // Step types
  Step,
  StepStatus,
  CreateStepInput,
  UpdateStepInput,
  StepListFilters,
} from './types/step.types'

export type {
  // Dictionary types
  DictionaryCategory,
  DictionaryCategoryWithEntries,
  DictionaryEntry,
  DictionaryCategoryType,
  DictionaryEntryStatus,
  CreateDictionaryCategoryInput,
  UpdateDictionaryCategoryInput,
  CreateDictionaryEntryInput,
  UpdateDictionaryEntryInput,
  DictionaryCategoryFilters,
  DictionaryEntryFilters,
} from './types/dictionary.types'

// =============================================================================
// CORE UTILITIES
// =============================================================================

export {
  // Error classes
  ApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
  NetworkError,
} from './core/errors'

export {
  // Config
  getApiConfig,
  setApiConfig,
  resetApiConfig,
  apiConfigPresets,
  defaultApiConfig,
} from './core/config'

export type { ApiConfig } from './core/config'

export {
  // Store utilities
  initializeStore,
  resetStore,
  getStoreState,
  useApiStore,
  getEntities,
  getEntity,
  getStoreActions,
} from './core/store'

export type { ApiStoreState, EntityKey, EntityMap, InitializeData } from './core/store'

// =============================================================================
// DATA
// =============================================================================

export {
  initializeApiStore,
  resetApiStore,
  isApiStoreInitialized,
  getInitializationData,
} from './data'

// Re-export seed data for direct access if needed
export { seedUsers } from './data/seed/users.seed'
export { seedRoles, seedPermissions, seedEnhancedPermissions } from './data/seed/roles.seed'
export {
  seedLocations,
  seedLocationsTree,
  seedLocationsTreeExtended,
  emptyLocations,
  getLocationSelectOptions,
} from './data/seed/locations.seed'
export {
  seedIncidents,
  generateManyIncidents,
  getIncidentById,
  getIncidentByIncidentId,
  getIncidentsByStatus,
  getIncidentsBySeverity,
} from './data/seed/incidents.seed'
export {
  seedSteps,
  seedMySteps,
  seedTeamSteps,
  generateManySteps,
  getStepsByIncident,
  getStepsByAssignee,
  getStepsByStatus,
  getOverdueSteps,
} from './data/seed/steps.seed'
export {
  seedDictionaryCategories,
  seedDictionaryEntries,
  getEntriesByCategory,
  getCategoryByCode,
  getEntryByCode,
} from './data/seed/dictionary.seed'

// Document/Evidence seed data
export {
  seedDocuments,
  seedUserContext,
  getDocumentsForRole,
  getDocumentById,
} from './data/seed/documents.seed'

// Form submission seed data
export {
  seedIncidentReportFormData,
  seedExtendedFormSubmissions,
  getFormSubmissionsByStatus,
  getFormSubmissionsByType,
} from './data/seed/forms.seed'

// Workflow seed data
export {
  seedDetailedWorkflows,
  getWorkflowsByStatus,
  getWorkflowById,
  getActiveWorkflowsCount,
} from './data/seed/workflows.seed'

// Entity template seed data
export {
  seedEntityTemplates,
  getTemplatesByCategory,
  getSystemTemplates,
  getCustomTemplates,
  getTemplateByCode,
  getTemplateById,
  getTemplateCounts,
} from './data/seed/entity-templates.seed'
export type { EntityTemplateCategory } from './data/seed/entity-templates.seed'

// User metadata seed data
export {
  seedUserStats,
  seedDepartments,
  seedJobTitles,
  seedUserActivities,
  seedLocationTree,
  getUserActivities,
  getActivitiesByType,
} from './data/seed/user-meta.seed'

// Incident table generators (for IncidentManagementTable and StepsPage)
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
} from './data/seed/incident-table.seed'

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
} from './data/seed/flow-config.seed'

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
} from './data/seed/ehs-dashboard.seed'
