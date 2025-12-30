/**
 * Dictionary API Types
 *
 * Types for dictionary management - categories and entries for lookup values.
 * Used for EHS domain data like injury types, body parts, severity levels, etc.
 */

// =============================================================================
// CORE DICTIONARY TYPES
// =============================================================================

/**
 * Dictionary category type
 */
export type DictionaryCategoryType = 'system' | 'custom'

/**
 * Dictionary entry status
 */
export type DictionaryEntryStatus = 'active' | 'inactive'

/**
 * Dictionary category - groups related entries
 */
export interface DictionaryCategory {
  id: string
  /** Category name (e.g., "Injury Types") */
  name: string
  /** URL-safe code (e.g., "injury_types") */
  code: string
  /** Description of what this category contains */
  description?: string
  /** Whether this is a system category (cannot be deleted) */
  type: DictionaryCategoryType
  /** Number of entries in this category */
  itemCount: number
  /** When category was created */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
}

/**
 * Dictionary entry - individual lookup value
 */
export interface DictionaryEntry {
  id: string
  /** Parent category ID */
  categoryId: string
  /** Entry code for programmatic use (e.g., "LACERATION") */
  code: string
  /** Display value (e.g., "Laceration") */
  value: string
  /** Optional description */
  description?: string
  /** Sort order within category */
  order: number
  /** Whether entry is active */
  status: DictionaryEntryStatus
  /** Whether this is a system entry (cannot be deleted) */
  isSystem: boolean
  /** Parent entry ID for hierarchy (null = root entry) */
  parentId: string | null
  /** Child entries for tree rendering */
  children?: DictionaryEntry[]
  /** When entry was created */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
}

/**
 * Category with its entries (for detailed view)
 */
export interface DictionaryCategoryWithEntries extends DictionaryCategory {
  entries: DictionaryEntry[]
}

// =============================================================================
// API INPUT TYPES
// =============================================================================

/**
 * Input for creating a dictionary category
 */
export interface CreateDictionaryCategoryInput {
  name: string
  code: string
  description?: string
}

/**
 * Input for updating a dictionary category
 */
export interface UpdateDictionaryCategoryInput {
  name?: string
  code?: string
  description?: string
}

/**
 * Input for creating a dictionary entry
 */
export interface CreateDictionaryEntryInput {
  categoryId: string
  code: string
  value: string
  description?: string
  order?: number
  status?: DictionaryEntryStatus
  /** Parent entry ID for hierarchy (null = root entry) */
  parentId?: string | null
}

/**
 * Input for updating a dictionary entry
 */
export interface UpdateDictionaryEntryInput {
  code?: string
  value?: string
  description?: string
  order?: number
  status?: DictionaryEntryStatus
}

/**
 * Input for reordering entries
 */
export interface ReorderEntriesInput {
  categoryId: string
  /** Array of entry IDs in new order */
  entryIds: string[]
}

/**
 * Filter options for listing categories
 */
export interface DictionaryCategoryFilters {
  type?: DictionaryCategoryType
  search?: string
}

/**
 * Filter options for listing entries
 */
export interface DictionaryEntryFilters {
  categoryId?: string
  status?: DictionaryEntryStatus
  isSystem?: boolean
  search?: string
}

// =============================================================================
// CONSTANTS - EHS DOMAIN CATEGORIES
// =============================================================================

/**
 * Standard EHS dictionary category codes
 */
export const EHS_CATEGORY_CODES = {
  INJURY_TYPES: 'injury_types',
  INJURY_SEVERITY: 'injury_severity',
  BODY_PARTS: 'body_parts',
  INCIDENT_CAUSES: 'incident_causes',
  CORRECTIVE_ACTIONS: 'corrective_actions',
  ACTION_TYPES: 'action_types',
  EQUIPMENT_TYPES: 'equipment_types',
  HAZARD_TYPES: 'hazard_types',
  PPE_TYPES: 'ppe_types',
  TRAINING_TYPES: 'training_types',
  INSPECTION_TYPES: 'inspection_types',
  PERMIT_TYPES: 'permit_types',
} as const

/**
 * Generate a code from a value string
 */
export function generateDictionaryCode(value: string, prefix?: string): string {
  const code = value
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20)

  return prefix ? `${prefix}_${code}` : code
}
