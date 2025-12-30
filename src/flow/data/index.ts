/**
 * Flow Mock Data Module
 *
 * SINGLE SOURCE OF TRUTH for all mock data in the Disrupt Flow App.
 * Import from here to ensure data consistency across all components and stories.
 *
 * Usage:
 *   import { mockUsers, mockRoles, convertToLocationWithPeople } from '../../data'
 *
 * NEW: API Simulation Layer
 *   import { api, initializeStore } from '../../data'
 *
 *   // Initialize once on app start
 *   initializeStore()
 *
 *   // Use the API
 *   const users = await api.users.getAll({ page: 1, pageSize: 10 })
 */

// =============================================================================
// API SIMULATION LAYER (NEW)
// =============================================================================

export {
  // Unified API object
  api,
  // Individual service APIs
  usersApi,
  rolesApi,
  locationsApi,
  incidentsApi,
  stepsApi,
  dictionaryApi,
  // Store utilities (from core/store)
  initializeStore,
  resetStore,
  getStoreState,
  useApiStore,
  getEntities,
  getEntity,
  // Store utilities (from data layer)
  initializeApiStore,
  resetApiStore,
  isApiStoreInitialized,
  // Config
  getApiConfig,
  setApiConfig,
  resetApiConfig,
  apiConfigPresets,
  // Error classes
  ApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  NetworkError,
  // Seed data (for direct access)
  seedUsers,
  seedRoles,
  seedPermissions,
  seedEnhancedPermissions,
  seedLocations,
  seedIncidents,
  seedSteps,
  seedDictionaryCategories,
  seedDictionaryEntries,
} from '../../api'

// Re-export types
export type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  ApiConfig,
  ApiStoreState,
  // Entity types (from types modules)
  Incident,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  Step,
  StepStatus,
  DictionaryCategory,
  DictionaryEntry,
} from '../../api'

// Note: User, Role, Permission, Location types are already exported from './mockUsers' and './mockRoles'
// to maintain backward compatibility

// =============================================================================
// LEGACY MOCK DATA (for backward compatibility)
// =============================================================================

// ROLES & PERMISSIONS
export {
  mockRoles,
  mockPermissions,
  mockEnhancedPermissions,
  getRoleById,
  getRolesByLevel,
} from './mockRoles'

// USERS
export {
  mockUsers,
  getUserById,
  getUsersByDepartment,
  getUsersByLocation,
  getAllDepartments,
  createMockUser,
} from './mockUsers'

// LOCATIONS (re-exported from locations module for convenience)
export {
  mockLocations,
  mockUserLocationAssignments,
  getAllLocationIds,
} from '../components/locations/data/mockLocations'

// =============================================================================
// TRAINING DATA
// =============================================================================

export {
  mockTrainingCourses,
  mockTrainingPackages,
  mockTrainingRequirements,
  mockTrainingRecords,
  mockUserCompliance,
  mockTrainingStats,
  getCourseById,
  getPackageById,
  getRequirementById,
  getRecordsForUser,
  getComplianceForUser,
  getDirectoryTrainingStatus,
  getCoursesByCategory,
  getRequirementsByScopeType,
} from './mockTraining'

// =============================================================================
// DERIVATION FUNCTIONS
// =============================================================================

export {
  userToDirectoryPerson,
  getDirectUsersForLocation,
  getInheritedUsersForLocation,
  convertToLocationWithPeople,
  createUserProfileData,
  getUserProfileById,
  // Incident data conversion
  convertToIncidentDetail,
} from './derivations'
