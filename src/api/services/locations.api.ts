/**
 * Locations API Service
 *
 * REST-like API for hierarchical location management.
 */

import {
  simulateNetwork,
  buildResponse,
  buildPaginatedResponse,
  paginate,
  sortBy,
  searchFilter,
  generateId,
  timestamp,
  logApiCall,
  deepClone,
} from '../core/utils'
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../core/errors'
import {
  getEntities,
  getEntity,
  getStoreActions,
} from '../core/store'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../core/types'
import type {
  Location,
  LocationType,
  CreateLocationInput,
  UpdateLocationInput,
  LocationListFilters,
  GetLocationsOptions,
} from '../types/location.types'

// =============================================================================
// VALIDATION
// =============================================================================

const VALID_LOCATION_TYPES: LocationType[] = [
  'facility', 'department', 'zone', 'building', 'floor', 'area', 'equipment'
]

function validateCreateLocation(input: CreateLocationInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.name?.trim()) {
    errors.name = ['Location name is required']
  } else if (input.name.length > 100) {
    errors.name = ['Location name must be 100 characters or less']
  }

  if (!input.type || !VALID_LOCATION_TYPES.includes(input.type)) {
    errors.type = ['Invalid location type']
  }

  if (!input.code?.trim()) {
    errors.code = ['Location code is required']
  } else if (!/^[A-Z0-9-]+$/i.test(input.code)) {
    errors.code = ['Location code must contain only letters, numbers, and hyphens']
  }

  if (!input.timezone?.trim()) {
    errors.timezone = ['Timezone is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Build tree structure from flat locations
 */
function buildTree(flatLocations: Location[]): Location[] {
  const locationMap = new Map<string, Location & { children: Location[] }>()
  const roots: Location[] = []

  // First pass: create nodes with empty children
  for (const loc of flatLocations) {
    locationMap.set(loc.id, { ...loc, children: [] })
  }

  // Second pass: build relationships
  for (const loc of flatLocations) {
    const node = locationMap.get(loc.id)!
    if (loc.parentId === null) {
      roots.push(node)
    } else {
      const parent = locationMap.get(loc.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    }
  }

  return roots
}

/**
 * Get all descendant IDs for a location
 */
function getDescendantIds(locations: Location[], parentId: string): string[] {
  const ids: string[] = []

  function traverse(pid: string) {
    const children = locations.filter((l) => l.parentId === pid)
    for (const child of children) {
      ids.push(child.id)
      traverse(child.id)
    }
  }

  traverse(parentId)
  return ids
}

// =============================================================================
// API SERVICE
// =============================================================================

export const locationsApi = {
  /**
   * Get all locations with optional filtering
   */
  getAll: async (
    params: QueryParams<LocationListFilters> = {},
    options: GetLocationsOptions = {}
  ): Promise<PaginatedResponse<Location>> => {
    logApiCall('locationsApi.getAll', { params, options })

    return simulateNetwork(() => {
      let locations = getEntities<'locations'>('locations')

      // Apply search
      if (params.search) {
        locations = searchFilter(locations, params.search, ['name', 'code', 'description'])
      }

      // Apply filters
      if (params.filters) {
        const filters = params.filters

        if (filters.type && filters.type.length > 0) {
          const typeFilter = filters.type as string[]
          locations = locations.filter((l) => typeFilter.includes(l.type))
        }

        if (filters.parentId !== undefined) {
          locations = locations.filter((l) => l.parentId === filters.parentId)
        }
      }

      // Filter by types if specified in options
      if (options.types && options.types.length > 0) {
        const typeOpts = options.types as string[]
        locations = locations.filter((l) => typeOpts.includes(l.type))
      }

      // Apply sorting
      const sortField = (params.sortBy as keyof Location) || 'name'
      locations = sortBy(locations, sortField, params.sortOrder || 'asc')

      // Get total before pagination
      const total = locations.length

      // Apply pagination
      locations = paginate(locations, params)

      // Build tree if not flat
      if (!options.flat) {
        locations = buildTree(locations)
      }

      return buildPaginatedResponse(locations, total, params)
    })
  },

  /**
   * Get locations as a tree structure
   */
  getTree: async (): Promise<ApiResponse<Location[]>> => {
    logApiCall('locationsApi.getTree')

    return simulateNetwork(() => {
      const locations = getEntities<'locations'>('locations')
      const tree = buildTree(deepClone(locations))
      return buildResponse(tree)
    })
  },

  /**
   * Get a single location by ID
   */
  getById: async (id: string): Promise<ApiResponse<Location>> => {
    logApiCall('locationsApi.getById', { id })

    return simulateNetwork(() => {
      const location = getEntity<'locations'>('locations', id)

      if (!location) {
        throw new NotFoundError('Location', id)
      }

      return buildResponse(deepClone(location))
    })
  },

  /**
   * Get children of a location
   */
  getChildren: async (parentId: string): Promise<ApiResponse<Location[]>> => {
    logApiCall('locationsApi.getChildren', { parentId })

    return simulateNetwork(() => {
      const locations = getEntities<'locations'>('locations')
      const children = locations.filter((l) => l.parentId === parentId)
      return buildResponse(deepClone(children))
    })
  },

  /**
   * Get root locations (facilities)
   */
  getRoots: async (): Promise<ApiResponse<Location[]>> => {
    logApiCall('locationsApi.getRoots')

    return simulateNetwork(() => {
      const locations = getEntities<'locations'>('locations')
      const roots = locations.filter((l) => l.parentId === null)
      return buildResponse(deepClone(roots))
    })
  },

  /**
   * Create a new location
   */
  create: async (input: CreateLocationInput): Promise<ApiResponse<Location>> => {
    logApiCall('locationsApi.create', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateLocation(input)

      // Check for duplicate code
      const locations = getEntities<'locations'>('locations')
      const existing = locations.find(
        (l) => l.code.toLowerCase() === input.code.toLowerCase()
      )
      if (existing) {
        throw ConflictError.duplicate('code', input.code)
      }

      // Validate parent exists if provided
      if (input.parentId) {
        const parent = getEntity<'locations'>('locations', input.parentId)
        if (!parent) {
          throw new NotFoundError('Parent location', input.parentId)
        }
      }

      // Create location
      const now = timestamp()
      const location: Location = {
        id: generateId(),
        name: input.name.trim(),
        type: input.type,
        code: input.code.trim().toUpperCase(),
        description: input.description?.trim(),
        address: input.address?.trim(),
        latitude: input.latitude,
        longitude: input.longitude,
        timezone: input.timezone,
        parentId: input.parentId ?? null,
        createdAt: now,
        updatedAt: now,
      }

      // Add to store
      getStoreActions().setEntity('locations', location.id, location)

      return buildResponse(deepClone(location))
    })
  },

  /**
   * Update an existing location
   */
  update: async (id: string, input: UpdateLocationInput): Promise<ApiResponse<Location>> => {
    logApiCall('locationsApi.update', { id, input })

    return simulateNetwork(() => {
      // Get existing location
      const location = getEntity<'locations'>('locations', id)
      if (!location) {
        throw new NotFoundError('Location', id)
      }

      // Check for duplicate code if changing
      if (input.code && input.code.toLowerCase() !== location.code.toLowerCase()) {
        const locations = getEntities<'locations'>('locations')
        const existing = locations.find(
          (l) => l.id !== id && l.code.toLowerCase() === input.code!.toLowerCase()
        )
        if (existing) {
          throw ConflictError.duplicate('code', input.code)
        }
      }

      // Validate parent if changing
      if (input.parentId !== undefined && input.parentId !== location.parentId) {
        // Cannot set self as parent
        if (input.parentId === id) {
          throw new ValidationError('Location cannot be its own parent', {
            parentId: ['Cannot set location as its own parent'],
          })
        }

        // Cannot set descendant as parent (would create cycle)
        if (input.parentId) {
          const locations = getEntities<'locations'>('locations')
          const descendantIds = getDescendantIds(locations, id)
          if (descendantIds.includes(input.parentId)) {
            throw new ValidationError('Cannot create circular reference', {
              parentId: ['Cannot set a child location as parent'],
            })
          }

          // Validate parent exists
          const parent = getEntity<'locations'>('locations', input.parentId)
          if (!parent) {
            throw new NotFoundError('Parent location', input.parentId)
          }
        }
      }

      // Update location
      const updatedLocation: Location = {
        ...location,
        ...(input.name && { name: input.name.trim() }),
        ...(input.type && { type: input.type }),
        ...(input.code && { code: input.code.trim().toUpperCase() }),
        ...(input.description !== undefined && { description: input.description?.trim() }),
        ...(input.address !== undefined && { address: input.address?.trim() }),
        ...(input.latitude !== undefined && { latitude: input.latitude }),
        ...(input.longitude !== undefined && { longitude: input.longitude }),
        ...(input.timezone && { timezone: input.timezone }),
        ...(input.parentId !== undefined && { parentId: input.parentId }),
        updatedAt: timestamp(),
      }

      // Save to store
      getStoreActions().setEntity('locations', id, updatedLocation)

      return buildResponse(deepClone(updatedLocation))
    })
  },

  /**
   * Delete a location and optionally its children
   */
  delete: async (
    id: string,
    deleteChildren = false
  ): Promise<ApiResponse<{ deleted: boolean; id: string; childrenDeleted: number }>> => {
    logApiCall('locationsApi.delete', { id, deleteChildren })

    return simulateNetwork(() => {
      const location = getEntity<'locations'>('locations', id)
      if (!location) {
        throw new NotFoundError('Location', id)
      }

      const locations = getEntities<'locations'>('locations')
      const descendantIds = getDescendantIds(locations, id)

      // Check if has children
      if (descendantIds.length > 0 && !deleteChildren) {
        throw new ValidationError(
          `Location has ${descendantIds.length} child location(s). Use deleteChildren=true to delete all.`,
          { location: ['Has child locations'] }
        )
      }

      // Delete children first (if any)
      let childrenDeleted = 0
      if (deleteChildren) {
        for (const childId of descendantIds) {
          getStoreActions().deleteEntity('locations', childId)
          childrenDeleted++
        }
      }

      // Delete the location
      getStoreActions().deleteEntity('locations', id)

      return buildResponse({ deleted: true, id, childrenDeleted })
    })
  },

  /**
   * Move a location to a new parent
   */
  move: async (id: string, newParentId: string | null): Promise<ApiResponse<Location>> => {
    logApiCall('locationsApi.move', { id, newParentId })

    return locationsApi.update(id, { parentId: newParentId })
  },

  /**
   * Get location path (breadcrumbs)
   */
  getPath: async (id: string): Promise<ApiResponse<Location[]>> => {
    logApiCall('locationsApi.getPath', { id })

    return simulateNetwork(() => {
      const locations = getEntities<'locations'>('locations')
      const path: Location[] = []

      let current = locations.find((l) => l.id === id)
      while (current) {
        path.unshift(deepClone(current))
        current = current.parentId
          ? locations.find((l) => l.id === current!.parentId)
          : undefined
      }

      if (path.length === 0) {
        throw new NotFoundError('Location', id)
      }

      return buildResponse(path)
    })
  },
}
