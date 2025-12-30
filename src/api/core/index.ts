/**
 * Core API Infrastructure
 * Re-exports all core modules for clean imports.
 */

// Types
export * from './types'

// Configuration
export {
  type ApiConfig,
  defaultApiConfig,
  getApiConfig,
  setApiConfig,
  resetApiConfig,
  apiConfigPresets,
} from './config'

// Errors
export {
  ApiError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NetworkError,
  InternalError,
  isApiError,
  getErrorMessage,
} from './errors'

// Store
export {
  useApiStore,
  useEntityArray,
  useEntity,
  useIsStoreInitialized,
  getStoreSnapshot,
  getEntities,
  getEntity,
  getStoreActions,
  type ApiStore,
  type ApiStoreState,
  type ApiStoreActions,
  type EntityKey,
  type EntityMap,
  type InitializeData,
} from './store'

// Utilities
export {
  randomBetween,
  delay,
  generateId,
  generateHumanId,
  generateRequestId,
  timestamp,
  simulateNetwork,
  buildResponse,
  buildPaginatedResponse,
  paginate,
  sortBy,
  searchFilter,
  applyFilters,
  deepClone,
  daysBetween,
  isPast,
  isValidEmail,
  logApiCall,
} from './utils'
