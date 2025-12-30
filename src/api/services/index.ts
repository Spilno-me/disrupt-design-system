/**
 * API Services Index
 *
 * Re-exports all API services for convenient access.
 */

export { usersApi } from './users.api'
export { rolesApi } from './roles.api'
export { locationsApi } from './locations.api'
export { incidentsApi } from './incidents.api'
export { stepsApi } from './steps.api'
export { dictionaryApi } from './dictionary.api'

/**
 * Unified API object for convenient access to all services.
 *
 * @example
 * ```typescript
 * import { api } from '@/api'
 *
 * // Users
 * const users = await api.users.getAll({ page: 1, pageSize: 10 })
 * const user = await api.users.getById('user-123')
 *
 * // Incidents
 * const incidents = await api.incidents.getAll({ filters: { severity: ['critical'] } })
 * const incident = await api.incidents.create({ title: 'New incident', ... })
 *
 * // Steps
 * const steps = await api.steps.getByIncident('inc-123')
 *
 * // Dictionary
 * const categories = await api.dictionary.getCategories()
 * ```
 */
export const api = {
  users: {} as typeof import('./users.api').usersApi,
  roles: {} as typeof import('./roles.api').rolesApi,
  locations: {} as typeof import('./locations.api').locationsApi,
  incidents: {} as typeof import('./incidents.api').incidentsApi,
  steps: {} as typeof import('./steps.api').stepsApi,
  dictionary: {} as typeof import('./dictionary.api').dictionaryApi,
}

// Lazy initialization to avoid circular dependencies
import { usersApi } from './users.api'
import { rolesApi } from './roles.api'
import { locationsApi } from './locations.api'
import { incidentsApi } from './incidents.api'
import { stepsApi } from './steps.api'
import { dictionaryApi } from './dictionary.api'

api.users = usersApi
api.roles = rolesApi
api.locations = locationsApi
api.incidents = incidentsApi
api.steps = stepsApi
api.dictionary = dictionaryApi
