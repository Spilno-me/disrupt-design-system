/**
 * Dictionary Management Types
 *
 * TypeScript interfaces for the Dictionary Management configuration page.
 * Supports system and custom dictionaries with category-based organization.
 */

// =============================================================================
// DICTIONARY CATEGORY TYPES
// =============================================================================

export type CategoryType = 'system' | 'custom'

export interface DictionaryCategory {
  id: string
  name: string
  code: string
  description?: string
  type: CategoryType
  itemCount: number
  createdAt: string
  updatedAt: string
}

// =============================================================================
// DICTIONARY ENTRY TYPES
// =============================================================================

export type EntryStatus = 'active' | 'inactive'

export interface DictionaryEntry {
  id: string
  categoryId: string
  code: string
  value: string
  description?: string
  order: number
  status: EntryStatus
  isSystem: boolean
  createdAt: string
  updatedAt: string
  /** Parent entry ID for hierarchy (null = root entry) */
  parentId: string | null
  /** Child entries for tree rendering */
  children?: DictionaryEntry[]
}

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface CreateCategoryFormData {
  name: string
  description?: string
}

export interface EditCategoryFormData extends CreateCategoryFormData {
  id: string
}

export interface CreateEntryFormData {
  categoryId: string
  value: string
  description?: string
  /** Parent entry ID (null or undefined = root entry) */
  parentId?: string | null
}

export interface EditEntryFormData {
  id: string
  code: string
  value: string
  description?: string
  /** Parent entry ID for re-parenting (null = root entry) */
  parentId?: string | null
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export type EntryStatusFilter = 'all' | EntryStatus
export type EntryTypeFilter = 'all' | 'system' | 'custom'

export interface EntriesFilterState {
  status: EntryStatusFilter
  type: EntryTypeFilter
  search: string
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface DictionaryPageProps {
  /** Dictionary categories */
  categories: DictionaryCategory[]
  /** Dictionary entries (for selected category) */
  entries: DictionaryEntry[]
  /** Currently selected category */
  selectedCategoryId?: string
  /** Loading state */
  isLoading?: boolean

  // Category callbacks
  onCategorySelect?: (categoryId: string) => void
  onCategoryCreate?: (data: CreateCategoryFormData) => Promise<void>
  onCategoryUpdate?: (data: EditCategoryFormData) => Promise<void>
  onCategoryDelete?: (categoryId: string) => Promise<void>

  // Entry callbacks
  onEntryCreate?: (data: CreateEntryFormData) => Promise<void>
  onEntryUpdate?: (data: EditEntryFormData) => Promise<void>
  onEntryDelete?: (entryId: string) => Promise<void>
  /** Called when entries are reordered via drag-drop. Receives array of {id, order} with new orders. */
  onEntriesReorder?: (reorderedEntries: Array<{ id: string; order: number }>) => Promise<void>
  onEntryStatusChange?: (entryId: string, status: EntryStatus) => Promise<void>

  // Import/Export callbacks
  onImport?: (categoryId: string, file: File) => Promise<void>
  onExport?: (categoryId: string) => Promise<void>

  // Bulk operation callbacks
  onBulkStatusChange?: (entryIds: string[], status: EntryStatus) => Promise<void>
  onBulkDelete?: (entryIds: string[]) => Promise<void>
}

export interface CategoriesSidebarProps {
  categories: DictionaryCategory[]
  selectedCategoryId?: string
  isLoading?: boolean
  onCategorySelect: (categoryId: string) => void
  onCategoryCreate?: () => void
  className?: string
}

export interface CategoryCardProps {
  category: DictionaryCategory
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export type EntryViewMode = 'table' | 'tree'

export interface DictionaryEntriesTableProps {
  category: DictionaryCategory | null
  entries: DictionaryEntry[]
  isLoading?: boolean
  onEntryCreate?: () => void
  onEntryEdit?: (entry: DictionaryEntry) => void
  onEntryDelete?: (entry: DictionaryEntry) => void
  /** Called when entries are reordered via drag-drop. Receives array of {id, order} with new orders. */
  onEntriesReorder?: (reorderedEntries: Array<{ id: string; order: number }>) => void
  onImport?: () => void
  onExport?: () => void
  className?: string
  /** View mode: table (flat) or tree (hierarchical) */
  viewMode?: EntryViewMode
  /** Called when view mode changes */
  onViewModeChange?: (mode: EntryViewMode) => void
}

// =============================================================================
// STATUS DISPLAY HELPERS
// =============================================================================

export const ENTRY_STATUS_CONFIG: Record<
  EntryStatus,
  { label: string; variant: 'success' | 'secondary' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
}

export const CATEGORY_TYPE_CONFIG: Record<
  CategoryType,
  { label: string; variant: 'secondary' | 'outline' }
> = {
  system: { label: 'System', variant: 'secondary' },
  custom: { label: 'Custom', variant: 'outline' },
}

// =============================================================================
// CODE GENERATION HELPER
// =============================================================================

/**
 * Generate a code from a value string.
 * Converts to lowercase, replaces spaces with hyphens, removes special chars.
 */
export function generateCode(value: string, prefix?: string): string {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return prefix ? `${prefix}-${base}` : base
}

// =============================================================================
// ENTRY HIERARCHY CONSTANTS
// =============================================================================

/** Maximum depth for entry hierarchy (Parent → Child → Grandchild) */
export const MAX_ENTRY_DEPTH = 3

/** Indentation in pixels per tree level */
export const INDENT_PER_LEVEL = 12

/** Base indentation in pixels */
export const BASE_INDENT = 8

// =============================================================================
// ENTRY HIERARCHY HELPER FUNCTIONS
// =============================================================================

/**
 * Count all descendants of an entry
 */
export function countEntryDescendants(entry: DictionaryEntry): number {
  if (!entry.children?.length) return 0
  return entry.children.reduce(
    (count, child) => count + 1 + countEntryDescendants(child),
    0
  )
}

/**
 * Flatten hierarchical entry tree into a flat array
 */
export function flattenEntries(entries: DictionaryEntry[]): DictionaryEntry[] {
  return entries.flatMap((entry) => [
    entry,
    ...(entry.children ? flattenEntries(entry.children) : []),
  ])
}

/**
 * Find an entry by ID in a hierarchical tree
 */
export function findEntryById(
  entries: DictionaryEntry[],
  id: string
): DictionaryEntry | null {
  for (const entry of entries) {
    if (entry.id === id) return entry
    if (entry.children) {
      const found = findEntryById(entry.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Get the depth of an entry in the tree (0 = root)
 */
export function getEntryDepth(
  entries: DictionaryEntry[],
  entryId: string,
  currentDepth = 0
): number {
  for (const entry of entries) {
    if (entry.id === entryId) return currentDepth
    if (entry.children) {
      const depth = getEntryDepth(entry.children, entryId, currentDepth + 1)
      if (depth !== -1) return depth
    }
  }
  return -1 // Not found
}

/**
 * Check if an entry can have children (depth < MAX_ENTRY_DEPTH - 1)
 */
export function canHaveChildren(
  entry: DictionaryEntry,
  allEntries: DictionaryEntry[]
): boolean {
  const depth = getEntryDepth(allEntries, entry.id)
  return depth >= 0 && depth < MAX_ENTRY_DEPTH - 1
}

/**
 * Get all descendant IDs of an entry (for cascade delete)
 */
export function getDescendantIds(entry: DictionaryEntry): string[] {
  if (!entry.children?.length) return []
  return entry.children.flatMap((child) => [
    child.id,
    ...getDescendantIds(child),
  ])
}

/**
 * Get all ancestor IDs of an entry (for cycle prevention)
 */
export function getAncestorIds(
  entries: DictionaryEntry[],
  entryId: string
): string[] {
  const ancestors: string[] = []
  const entry = findEntryById(entries, entryId)
  if (!entry) return ancestors

  let currentId: string | null = entry.parentId
  while (currentId) {
    ancestors.push(currentId)
    const parent = findEntryById(entries, currentId)
    currentId = parent?.parentId ?? null
  }
  return ancestors
}

/**
 * Build hierarchical tree from flat entries array
 */
export function buildEntryTree(flatEntries: DictionaryEntry[]): DictionaryEntry[] {
  const entryMap = new Map<string, DictionaryEntry>()
  const rootEntries: DictionaryEntry[] = []

  // First pass: clone all entries and build map
  flatEntries.forEach((entry) => {
    entryMap.set(entry.id, { ...entry, children: [] })
  })

  // Second pass: build tree structure
  flatEntries.forEach((entry) => {
    const node = entryMap.get(entry.id)!
    if (entry.parentId === null) {
      rootEntries.push(node)
    } else {
      const parent = entryMap.get(entry.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      } else {
        // Parent not found, treat as root
        rootEntries.push(node)
      }
    }
  })

  // Sort children by order at each level
  const sortChildren = (entries: DictionaryEntry[]) => {
    entries.sort((a, b) => a.order - b.order)
    entries.forEach((entry) => {
      if (entry.children?.length) {
        sortChildren(entry.children)
      }
    })
  }
  sortChildren(rootEntries)

  return rootEntries
}

/**
 * Get valid parent options for an entry (for parent selector dropdown)
 * Excludes: self, descendants, entries at max depth
 */
export function getValidParentOptions(
  entries: DictionaryEntry[],
  excludeId?: string
): DictionaryEntry[] {
  const flatList = flattenEntries(entries)
  const excludeIds = new Set<string>()

  // Exclude self
  if (excludeId) {
    excludeIds.add(excludeId)
    // Exclude descendants
    const entry = findEntryById(entries, excludeId)
    if (entry) {
      getDescendantIds(entry).forEach((id) => excludeIds.add(id))
    }
  }

  // Filter valid parents
  return flatList.filter((entry) => {
    // Exclude self and descendants
    if (excludeIds.has(entry.id)) return false
    // Exclude entries at max depth
    const depth = getEntryDepth(entries, entry.id)
    if (depth >= MAX_ENTRY_DEPTH - 1) return false
    return true
  })
}
