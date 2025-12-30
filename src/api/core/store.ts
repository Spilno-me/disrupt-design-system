/**
 * API In-Memory Store
 * Zustand store for mutable API data that persists during the session.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { User, Role, Permission, EnhancedPermission } from '../types/user.types'
import type { Location } from '../types/location.types'
import type { Incident } from '../types/incident.types'
import type { Step } from '../types/step.types'
import type { DictionaryCategory } from '../types/dictionary.types'

// =============================================================================
// STORE STATE INTERFACE
// =============================================================================

export interface ApiStoreState {
  // Entity collections (using Map for O(1) lookups)
  users: Map<string, User>
  roles: Map<string, Role>
  permissions: Map<string, Permission>
  enhancedPermissions: Map<string, EnhancedPermission>
  locations: Map<string, Location>
  incidents: Map<string, Incident>
  steps: Map<string, Step>
  dictionaries: Map<string, DictionaryCategory>

  // Sequence counters for human-readable IDs
  sequences: {
    incident: number
    step: number
  }

  // Metadata
  initialized: boolean
  lastResetAt: string | null
}

export interface ApiStoreActions {
  // Initialization
  initialize: (data: InitializeData) => void
  reset: () => void

  // Generic entity operations
  setEntity: <K extends EntityKey>(key: K, id: string, entity: EntityMap[K]) => void
  deleteEntity: <K extends EntityKey>(key: K, id: string) => void
  updateEntity: <K extends EntityKey>(key: K, id: string, updates: Partial<EntityMap[K]>) => void

  // Sequence operations
  getNextSequence: (type: 'incident' | 'step') => number
}

// Entity type mapping
export type EntityKey = 'users' | 'roles' | 'permissions' | 'enhancedPermissions' | 'locations' | 'incidents' | 'steps' | 'dictionaries'

export type EntityMap = {
  users: User
  roles: Role
  permissions: Permission
  enhancedPermissions: EnhancedPermission
  locations: Location
  incidents: Incident
  steps: Step
  dictionaries: DictionaryCategory
}

// Initialization data structure
export interface InitializeData {
  users?: User[]
  roles?: Role[]
  permissions?: Permission[]
  enhancedPermissions?: EnhancedPermission[]
  locations?: Location[]
  incidents?: Incident[]
  steps?: Step[]
  dictionaries?: DictionaryCategory[]
  sequences?: {
    incident?: number
    step?: number
  }
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const createInitialState = (): ApiStoreState => ({
  users: new Map(),
  roles: new Map(),
  permissions: new Map(),
  enhancedPermissions: new Map(),
  locations: new Map(),
  incidents: new Map(),
  steps: new Map(),
  dictionaries: new Map(),
  sequences: {
    incident: 1000,
    step: 1,
  },
  initialized: false,
  lastResetAt: null,
})

// =============================================================================
// STORE CREATION
// =============================================================================

export type ApiStore = ApiStoreState & ApiStoreActions

export const useApiStore = create<ApiStore>()(
  devtools(
    (set, get) => ({
      ...createInitialState(),

      // Initialize store with seed data
      initialize: (data: InitializeData) => {
        const state = get()

        // Skip if already initialized (prevents double-init in React strict mode)
        if (state.initialized) {
          console.log('[API Store] Already initialized, skipping')
          return
        }

        set((s) => {
          // Convert arrays to Maps
          const users = new Map(data.users?.map((u) => [u.id, u]) ?? [])
          const roles = new Map(data.roles?.map((r) => [r.id, r]) ?? [])
          const permissions = new Map(data.permissions?.map((p) => [p.id, p]) ?? [])
          const enhancedPermissions = new Map(data.enhancedPermissions?.map((p) => [p.id, p]) ?? [])
          const locations = new Map(data.locations?.map((l) => [l.id, l]) ?? [])
          const incidents = new Map(data.incidents?.map((i) => [i.id, i]) ?? [])
          const steps = new Map(data.steps?.map((st) => [st.id, st]) ?? [])
          const dictionaries = new Map(data.dictionaries?.map((d) => [d.id, d]) ?? [])

          return {
            ...s,
            users,
            roles,
            permissions,
            enhancedPermissions,
            locations,
            incidents,
            steps,
            dictionaries,
            sequences: {
              incident: data.sequences?.incident ?? 1000,
              step: data.sequences?.step ?? 1,
            },
            initialized: true,
            lastResetAt: null,
          }
        })

        console.log('[API Store] Initialized with:', {
          users: data.users?.length ?? 0,
          roles: data.roles?.length ?? 0,
          locations: data.locations?.length ?? 0,
          incidents: data.incidents?.length ?? 0,
          steps: data.steps?.length ?? 0,
        })
      },

      // Reset store to initial state (requires re-initialization)
      reset: () => {
        set({
          ...createInitialState(),
          lastResetAt: new Date().toISOString(),
        })
        console.log('[API Store] Reset to initial state')
      },

      // Set/update a single entity
      setEntity: <K extends EntityKey>(key: K, id: string, entity: EntityMap[K]) => {
        set((state) => {
          const map = new Map(state[key] as Map<string, EntityMap[K]>)
          map.set(id, entity)
          return { ...state, [key]: map }
        })
      },

      // Delete a single entity
      deleteEntity: <K extends EntityKey>(key: K, id: string) => {
        set((state) => {
          const map = new Map(state[key] as Map<string, EntityMap[K]>)
          map.delete(id)
          return { ...state, [key]: map }
        })
      },

      // Partially update an entity
      updateEntity: <K extends EntityKey>(key: K, id: string, updates: Partial<EntityMap[K]>) => {
        set((state) => {
          const map = new Map(state[key] as Map<string, EntityMap[K]>)
          const existing = map.get(id)
          if (existing) {
            map.set(id, { ...existing, ...updates } as EntityMap[K])
          }
          return { ...state, [key]: map }
        })
      },

      // Get and increment sequence counter
      getNextSequence: (type: 'incident' | 'step') => {
        const current = get().sequences[type]
        set((state) => ({
          ...state,
          sequences: {
            ...state.sequences,
            [type]: current + 1,
          },
        }))
        return current
      },
    }),
    { name: 'api-store' }
  )
)

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

/** Get all entities of a type as an array */
export function useEntityArray<K extends EntityKey>(key: K): EntityMap[K][] {
  const map = useApiStore((state) => state[key]) as Map<string, EntityMap[K]>
  return Array.from(map.values())
}

/** Get a single entity by ID */
export function useEntity<K extends EntityKey>(key: K, id: string): EntityMap[K] | undefined {
  return useApiStore((state) => (state[key] as Map<string, EntityMap[K]>).get(id))
}

/** Check if store is initialized */
export function useIsStoreInitialized(): boolean {
  return useApiStore((state) => state.initialized)
}

// =============================================================================
// NON-REACTIVE ACCESSORS (for use in API services)
// =============================================================================

/** Get store state snapshot (non-reactive) */
export function getStoreSnapshot(): ApiStoreState {
  return useApiStore.getState()
}

/** Get all entities as array (non-reactive) */
export function getEntities<K extends EntityKey>(key: K): EntityMap[K][] {
  const map = useApiStore.getState()[key] as Map<string, EntityMap[K]>
  return Array.from(map.values())
}

/** Get single entity by ID (non-reactive) */
export function getEntity<K extends EntityKey>(key: K, id: string): EntityMap[K] | undefined {
  return (useApiStore.getState()[key] as Map<string, EntityMap[K]>).get(id)
}

/** Get store actions */
export function getStoreActions(): ApiStoreActions {
  const state = useApiStore.getState()
  return {
    initialize: state.initialize,
    reset: state.reset,
    setEntity: state.setEntity,
    deleteEntity: state.deleteEntity,
    updateEntity: state.updateEntity,
    getNextSequence: state.getNextSequence,
  }
}

// =============================================================================
// CONVENIENCE WRAPPERS (for external API)
// =============================================================================

/**
 * Initialize the store with seed data.
 * Call this once on app start.
 */
export function initializeStore(data: InitializeData): void {
  getStoreActions().initialize(data)
}

/**
 * Reset the store to initial seed data.
 * Useful for testing or resetting demo state.
 */
export function resetStore(): void {
  getStoreActions().reset()
}

/**
 * Get the current store state snapshot (non-reactive).
 */
export function getStoreState(): ApiStoreState {
  return getStoreSnapshot()
}
