/**
 * API Data Layer
 *
 * Provides initialization and seed data for the API store.
 */

import { useApiStore, type InitializeData } from '../core/store'
import {
  seedUsers,
  seedRoles,
  seedPermissions,
  seedEnhancedPermissions,
  seedLocations,
  seedIncidents,
  seedSteps,
  seedDictionaryCategories,
  getNextIncidentSequence,
} from './seed'

// Re-export all seed data
export * from './seed'

/**
 * Get complete initialization data for the API store
 */
export function getInitializationData(): InitializeData {
  return {
    users: seedUsers,
    roles: seedRoles,
    permissions: seedPermissions,
    enhancedPermissions: seedEnhancedPermissions,
    locations: seedLocations,
    incidents: seedIncidents,
    steps: seedSteps,
    dictionaries: seedDictionaryCategories,
    sequences: {
      incident: getNextIncidentSequence(),
      step: seedSteps.length + 1,
    },
  }
}

/**
 * Initialize the API store with seed data
 * Call this once at app startup or in Storybook decorators
 */
export function initializeApiStore(): void {
  const store = useApiStore.getState()

  // Skip if already initialized
  if (store.initialized) {
    return
  }

  const data = getInitializationData()
  store.initialize(data)
}

/**
 * Reset and reinitialize the API store
 * Useful for tests or resetting demo state
 */
export function resetApiStore(): void {
  const store = useApiStore.getState()
  store.reset()

  // Re-initialize with seed data
  const data = getInitializationData()
  store.initialize(data)
}

/**
 * Check if store is initialized
 */
export function isApiStoreInitialized(): boolean {
  return useApiStore.getState().initialized
}
