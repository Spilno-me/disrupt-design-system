/**
 * Dictionary API Service
 *
 * REST-like API for dictionary category and entry management.
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
  ForbiddenError,
} from '../core/errors'
import {
  getEntities,
  getEntity,
  getStoreActions,
} from '../core/store'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../core/types'
import type {
  DictionaryCategory,
  DictionaryEntry,
  DictionaryCategoryWithEntries,
  CreateDictionaryCategoryInput,
  UpdateDictionaryCategoryInput,
  CreateDictionaryEntryInput,
  UpdateDictionaryEntryInput,
  DictionaryCategoryFilters,
  DictionaryEntryFilters,
} from '../types/dictionary.types'

// Import seed entries (stored separately from categories in the store for this implementation)
import { seedDictionaryEntries } from '../data/seed/dictionary.seed'

// For simplicity, we'll store entries in memory (not in Zustand store)
// In a real implementation, this would be a separate collection in the store
let entriesStore = new Map<string, DictionaryEntry>(
  seedDictionaryEntries.map((e) => [e.id, e])
)

// =============================================================================
// VALIDATION
// =============================================================================

function validateCreateCategory(input: CreateDictionaryCategoryInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.name?.trim()) {
    errors.name = ['Category name is required']
  } else if (input.name.length > 100) {
    errors.name = ['Category name must be 100 characters or less']
  }

  if (!input.code?.trim()) {
    errors.code = ['Category code is required']
  } else if (!/^[a-z0-9_]+$/.test(input.code)) {
    errors.code = ['Code must contain only lowercase letters, numbers, and underscores']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

function validateCreateEntry(input: CreateDictionaryEntryInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.categoryId?.trim()) {
    errors.categoryId = ['Category ID is required']
  }

  if (!input.code?.trim()) {
    errors.code = ['Entry code is required']
  } else if (!/^[A-Z0-9_]+$/.test(input.code)) {
    errors.code = ['Code must contain only uppercase letters, numbers, and underscores']
  }

  if (!input.value?.trim()) {
    errors.value = ['Entry value is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function getEntriesForCategory(categoryId: string): DictionaryEntry[] {
  return Array.from(entriesStore.values())
    .filter((e) => e.categoryId === categoryId)
    .sort((a, b) => a.order - b.order)
}

function updateCategoryItemCount(categoryId: string): void {
  const entries = getEntriesForCategory(categoryId)
  getStoreActions().updateEntity('dictionaries', categoryId, {
    itemCount: entries.length,
    updatedAt: timestamp(),
  })
}

// =============================================================================
// API SERVICE - CATEGORIES
// =============================================================================

export const dictionaryApi = {
  // ===========================================================================
  // CATEGORIES
  // ===========================================================================

  /**
   * Get all dictionary categories
   */
  getCategories: async (
    params: QueryParams<DictionaryCategoryFilters> = {}
  ): Promise<PaginatedResponse<DictionaryCategory>> => {
    logApiCall('dictionaryApi.getCategories', params)

    return simulateNetwork(() => {
      let categories = getEntities<'dictionaries'>('dictionaries')

      // Apply search
      if (params.search) {
        categories = searchFilter(categories, params.search, ['name', 'code', 'description'])
      }

      // Apply filters
      if (params.filters?.type) {
        categories = categories.filter((c) => c.type === params.filters!.type)
      }

      // Apply sorting
      const sortField = (params.sortBy as keyof DictionaryCategory) || 'name'
      categories = sortBy(categories, sortField, params.sortOrder || 'asc')

      // Get total before pagination
      const total = categories.length

      // Apply pagination
      categories = paginate(categories, params)

      return buildPaginatedResponse(categories, total, params)
    })
  },

  /**
   * Get a category by ID with its entries
   */
  getCategoryById: async (id: string): Promise<ApiResponse<DictionaryCategoryWithEntries>> => {
    logApiCall('dictionaryApi.getCategoryById', { id })

    return simulateNetwork(() => {
      const category = getEntity<'dictionaries'>('dictionaries', id)

      if (!category) {
        throw new NotFoundError('Dictionary category', id)
      }

      const entries = getEntriesForCategory(id)

      return buildResponse({
        ...deepClone(category),
        entries: deepClone(entries),
      })
    })
  },

  /**
   * Get a category by code
   */
  getCategoryByCode: async (code: string): Promise<ApiResponse<DictionaryCategoryWithEntries>> => {
    logApiCall('dictionaryApi.getCategoryByCode', { code })

    return simulateNetwork(() => {
      const categories = getEntities<'dictionaries'>('dictionaries')
      const category = categories.find((c) => c.code === code)

      if (!category) {
        throw new NotFoundError('Dictionary category', code)
      }

      const entries = getEntriesForCategory(category.id)

      return buildResponse({
        ...deepClone(category),
        entries: deepClone(entries),
      })
    })
  },

  /**
   * Create a new category
   */
  createCategory: async (input: CreateDictionaryCategoryInput): Promise<ApiResponse<DictionaryCategory>> => {
    logApiCall('dictionaryApi.createCategory', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateCategory(input)

      // Check for duplicate code
      const categories = getEntities<'dictionaries'>('dictionaries')
      const existing = categories.find((c) => c.code === input.code)
      if (existing) {
        throw ConflictError.duplicate('code', input.code)
      }

      // Create category
      const now = timestamp()
      const category: DictionaryCategory = {
        id: generateId(),
        name: input.name.trim(),
        code: input.code.toLowerCase().trim(),
        description: input.description?.trim(),
        type: 'custom',
        itemCount: 0,
        createdAt: now,
        updatedAt: now,
      }

      // Add to store
      getStoreActions().setEntity('dictionaries', category.id, category)

      return buildResponse(deepClone(category))
    })
  },

  /**
   * Update a category
   */
  updateCategory: async (
    id: string,
    input: UpdateDictionaryCategoryInput
  ): Promise<ApiResponse<DictionaryCategory>> => {
    logApiCall('dictionaryApi.updateCategory', { id, input })

    return simulateNetwork(() => {
      const category = getEntity<'dictionaries'>('dictionaries', id)
      if (!category) {
        throw new NotFoundError('Dictionary category', id)
      }

      // Cannot modify system categories
      if (category.type === 'system') {
        throw new ForbiddenError('System categories cannot be modified')
      }

      // Check for duplicate code if changing
      if (input.code && input.code !== category.code) {
        const categories = getEntities<'dictionaries'>('dictionaries')
        const existing = categories.find((c) => c.id !== id && c.code === input.code)
        if (existing) {
          throw ConflictError.duplicate('code', input.code)
        }
      }

      // Update category
      const updated: DictionaryCategory = {
        ...category,
        ...(input.name && { name: input.name.trim() }),
        ...(input.code && { code: input.code.toLowerCase().trim() }),
        ...(input.description !== undefined && { description: input.description?.trim() }),
        updatedAt: timestamp(),
      }

      getStoreActions().setEntity('dictionaries', id, updated)

      return buildResponse(deepClone(updated))
    })
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('dictionaryApi.deleteCategory', { id })

    return simulateNetwork(() => {
      const category = getEntity<'dictionaries'>('dictionaries', id)
      if (!category) {
        throw new NotFoundError('Dictionary category', id)
      }

      // Cannot delete system categories
      if (category.type === 'system') {
        throw new ForbiddenError('System categories cannot be deleted')
      }

      // Delete all entries in category
      const entries = getEntriesForCategory(id)
      for (const entry of entries) {
        entriesStore.delete(entry.id)
      }

      // Delete category
      getStoreActions().deleteEntity('dictionaries', id)

      return buildResponse({ deleted: true, id })
    })
  },

  // ===========================================================================
  // ENTRIES
  // ===========================================================================

  /**
   * Get entries for a category
   */
  getEntries: async (
    categoryId: string,
    params: QueryParams<DictionaryEntryFilters> = {}
  ): Promise<PaginatedResponse<DictionaryEntry>> => {
    logApiCall('dictionaryApi.getEntries', { categoryId, params })

    return simulateNetwork(() => {
      // Verify category exists
      const category = getEntity<'dictionaries'>('dictionaries', categoryId)
      if (!category) {
        throw new NotFoundError('Dictionary category', categoryId)
      }

      let entries = getEntriesForCategory(categoryId)

      // Apply search
      if (params.search) {
        entries = searchFilter(entries, params.search, ['code', 'value', 'description'])
      }

      // Apply filters
      if (params.filters) {
        if (params.filters.status) {
          entries = entries.filter((e) => e.status === params.filters!.status)
        }
        if (params.filters.isSystem !== undefined) {
          entries = entries.filter((e) => e.isSystem === params.filters!.isSystem)
        }
      }

      // Get total before pagination
      const total = entries.length

      // Apply pagination
      entries = paginate(entries, params)

      return buildPaginatedResponse(entries, total, params)
    })
  },

  /**
   * Get a single entry by ID
   */
  getEntryById: async (id: string): Promise<ApiResponse<DictionaryEntry>> => {
    logApiCall('dictionaryApi.getEntryById', { id })

    return simulateNetwork(() => {
      const entry = entriesStore.get(id)

      if (!entry) {
        throw new NotFoundError('Dictionary entry', id)
      }

      return buildResponse(deepClone(entry))
    })
  },

  /**
   * Create a new entry
   */
  createEntry: async (input: CreateDictionaryEntryInput): Promise<ApiResponse<DictionaryEntry>> => {
    logApiCall('dictionaryApi.createEntry', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateEntry(input)

      // Verify category exists
      const category = getEntity<'dictionaries'>('dictionaries', input.categoryId)
      if (!category) {
        throw new NotFoundError('Dictionary category', input.categoryId)
      }

      // Check for duplicate code in category
      const entries = getEntriesForCategory(input.categoryId)
      const existing = entries.find((e) => e.code === input.code)
      if (existing) {
        throw ConflictError.duplicate('code', input.code)
      }

      // Determine order
      const maxOrder = entries.reduce((max, e) => Math.max(max, e.order), 0)

      // Create entry
      const now = timestamp()
      const entry: DictionaryEntry = {
        id: generateId(),
        categoryId: input.categoryId,
        code: input.code.toUpperCase().trim(),
        value: input.value.trim(),
        description: input.description?.trim(),
        order: input.order ?? maxOrder + 1,
        status: input.status || 'active',
        isSystem: false,
        parentId: input.parentId ?? null,
        createdAt: now,
        updatedAt: now,
      }

      // Add to store
      entriesStore.set(entry.id, entry)

      // Update category entry count
      updateCategoryItemCount(input.categoryId)

      return buildResponse(deepClone(entry))
    })
  },

  /**
   * Update an entry
   */
  updateEntry: async (id: string, input: UpdateDictionaryEntryInput): Promise<ApiResponse<DictionaryEntry>> => {
    logApiCall('dictionaryApi.updateEntry', { id, input })

    return simulateNetwork(() => {
      const entry = entriesStore.get(id)
      if (!entry) {
        throw new NotFoundError('Dictionary entry', id)
      }

      // Cannot modify system entries
      if (entry.isSystem) {
        throw new ForbiddenError('System entries cannot be modified')
      }

      // Check for duplicate code if changing
      if (input.code && input.code !== entry.code) {
        const entries = getEntriesForCategory(entry.categoryId)
        const existing = entries.find((e) => e.id !== id && e.code === input.code)
        if (existing) {
          throw ConflictError.duplicate('code', input.code)
        }
      }

      // Update entry
      const updated: DictionaryEntry = {
        ...entry,
        ...(input.code && { code: input.code.toUpperCase().trim() }),
        ...(input.value && { value: input.value.trim() }),
        ...(input.description !== undefined && { description: input.description?.trim() }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.status && { status: input.status }),
        updatedAt: timestamp(),
      }

      entriesStore.set(id, updated)

      return buildResponse(deepClone(updated))
    })
  },

  /**
   * Delete an entry
   */
  deleteEntry: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('dictionaryApi.deleteEntry', { id })

    return simulateNetwork(() => {
      const entry = entriesStore.get(id)
      if (!entry) {
        throw new NotFoundError('Dictionary entry', id)
      }

      // Cannot delete system entries
      if (entry.isSystem) {
        throw new ForbiddenError('System entries cannot be deleted')
      }

      const categoryId = entry.categoryId

      // Delete entry
      entriesStore.delete(id)

      // Update category entry count
      updateCategoryItemCount(categoryId)

      return buildResponse({ deleted: true, id })
    })
  },

  /**
   * Reorder entries within a category
   */
  reorderEntries: async (
    categoryId: string,
    entryIds: string[]
  ): Promise<ApiResponse<DictionaryEntry[]>> => {
    logApiCall('dictionaryApi.reorderEntries', { categoryId, entryIds })

    return simulateNetwork(() => {
      // Verify category exists
      const category = getEntity<'dictionaries'>('dictionaries', categoryId)
      if (!category) {
        throw new NotFoundError('Dictionary category', categoryId)
      }

      // Update order for each entry
      entryIds.forEach((id, index) => {
        const entry = entriesStore.get(id)
        if (entry && entry.categoryId === categoryId) {
          entriesStore.set(id, { ...entry, order: index + 1, updatedAt: timestamp() })
        }
      })

      const entries = getEntriesForCategory(categoryId)
      return buildResponse(deepClone(entries))
    })
  },

  /**
   * Reset entries store (for testing)
   */
  resetEntries: (): void => {
    entriesStore = new Map(seedDictionaryEntries.map((e) => [e.id, e]))
  },
}
