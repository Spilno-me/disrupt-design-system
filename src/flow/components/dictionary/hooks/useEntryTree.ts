import { useState, useMemo, useCallback } from 'react'
import {
  DictionaryEntry,
  buildEntryTree,
  flattenEntries,
  findEntryById,
  getEntryDepth,
  getValidParentOptions,
  MAX_ENTRY_DEPTH,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface UseEntryTreeOptions {
  /** Flat list of entries (from API) */
  entries: DictionaryEntry[]
  /** Current search query */
  searchValue: string
  /** Category ID filter (optional) */
  categoryId?: string | null
  /** Initial expanded IDs */
  initialExpandedIds?: string[]
}

export interface UseEntryTreeReturn {
  /** Hierarchical tree structure */
  treeEntries: DictionaryEntry[]
  /** Flat list for table view */
  flatEntries: DictionaryEntry[]
  /** Currently expanded entry IDs */
  expandedIds: Set<string>
  /** Toggle expand/collapse for an entry */
  toggleExpand: (id: string) => void
  /** Expand all entries */
  expandAll: () => void
  /** Collapse all entries */
  collapseAll: () => void
  /** Filtered tree (preserves parents when children match search) */
  filteredTreeEntries: DictionaryEntry[]
  /** Effective expanded IDs (includes auto-expand during search) */
  effectiveExpandedIds: Set<string>
  /** Get valid parent options for entry selector */
  getParentOptions: (excludeId?: string) => DictionaryEntry[]
  /** Check if entry can be a parent to the target */
  canBeParent: (parentId: string, targetId?: string) => boolean
  /** Get depth of an entry */
  getDepth: (entryId: string) => number
  /** Check if an entry has children */
  hasChildren: (entryId: string) => boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum depth to auto-expand during search */
const MAX_AUTO_EXPAND_DEPTH = 2

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Filter tree entries by search query, preserving parent hierarchy
 * When a child matches, its parent chain is preserved
 */
function filterTreeBySearch(
  entries: DictionaryEntry[],
  query: string
): DictionaryEntry[] {
  if (!query.trim()) return entries

  const lowerQuery = query.toLowerCase()

  const matchesQuery = (entry: DictionaryEntry): boolean => {
    return (
      entry.value.toLowerCase().includes(lowerQuery) ||
      entry.code.toLowerCase().includes(lowerQuery) ||
      (entry.description?.toLowerCase().includes(lowerQuery) ?? false)
    )
  }

  const filterRecursive = (entries: DictionaryEntry[]): DictionaryEntry[] => {
    return entries.reduce<DictionaryEntry[]>((acc, entry) => {
      const childResults = entry.children
        ? filterRecursive(entry.children)
        : []
      const entryMatches = matchesQuery(entry)
      const hasMatchingChildren = childResults.length > 0

      if (entryMatches || hasMatchingChildren) {
        acc.push({
          ...entry,
          children: hasMatchingChildren ? childResults : entry.children,
        })
      }

      return acc
    }, [])
  }

  return filterRecursive(entries)
}

/**
 * Collect IDs of entries to auto-expand during search
 * Only expands up to MAX_AUTO_EXPAND_DEPTH levels
 */
function collectAutoExpandIds(
  entries: DictionaryEntry[],
  depth = 0
): Set<string> {
  const ids = new Set<string>()

  if (depth >= MAX_AUTO_EXPAND_DEPTH) return ids

  for (const entry of entries) {
    if (entry.children?.length) {
      ids.add(entry.id)
      const childIds = collectAutoExpandIds(entry.children, depth + 1)
      childIds.forEach((id) => ids.add(id))
    }
  }

  return ids
}

/**
 * Get all entry IDs that have children (for expand all)
 */
function getAllExpandableIds(entries: DictionaryEntry[]): Set<string> {
  const ids = new Set<string>()

  const collect = (entries: DictionaryEntry[]) => {
    for (const entry of entries) {
      if (entry.children?.length) {
        ids.add(entry.id)
        collect(entry.children)
      }
    }
  }

  collect(entries)
  return ids
}

// =============================================================================
// HOOK
// =============================================================================

export function useEntryTree(options: UseEntryTreeOptions): UseEntryTreeReturn {
  const { entries, searchValue, initialExpandedIds = [] } = options

  // Expand/collapse state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialExpandedIds)
  )

  // Build tree from flat entries
  const treeEntries = useMemo(() => buildEntryTree(entries), [entries])

  // Flat list for table view
  const flatEntries = useMemo(
    () => flattenEntries(treeEntries),
    [treeEntries]
  )

  // Filter tree by search
  const filteredTreeEntries = useMemo(
    () => filterTreeBySearch(treeEntries, searchValue),
    [treeEntries, searchValue]
  )

  // Auto-expand during search
  const autoExpandIds = useMemo(() => {
    if (!searchValue.trim()) return new Set<string>()
    return collectAutoExpandIds(filteredTreeEntries)
  }, [filteredTreeEntries, searchValue])

  // Combine manual expanded IDs with auto-expanded
  const effectiveExpandedIds = useMemo(() => {
    const combined = new Set(expandedIds)
    autoExpandIds.forEach((id) => combined.add(id))
    return combined
  }, [expandedIds, autoExpandIds])

  // Toggle expand/collapse
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Expand all
  const expandAll = useCallback(() => {
    setExpandedIds(getAllExpandableIds(treeEntries))
  }, [treeEntries])

  // Collapse all
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  // Get valid parent options
  const getParentOptions = useCallback(
    (excludeId?: string) => {
      return getValidParentOptions(treeEntries, excludeId)
    },
    [treeEntries]
  )

  // Check if entry can be parent
  const canBeParent = useCallback(
    (parentId: string, targetId?: string): boolean => {
      const parentEntry = findEntryById(treeEntries, parentId)
      if (!parentEntry) return false

      // Check depth
      const depth = getEntryDepth(treeEntries, parentId)
      if (depth >= MAX_ENTRY_DEPTH - 1) return false

      // If target specified, check for cycles
      if (targetId) {
        const validOptions = getValidParentOptions(treeEntries, targetId)
        return validOptions.some((opt) => opt.id === parentId)
      }

      return true
    },
    [treeEntries]
  )

  // Get entry depth
  const getDepth = useCallback(
    (entryId: string): number => {
      return getEntryDepth(treeEntries, entryId)
    },
    [treeEntries]
  )

  // Check if entry has children
  const hasChildren = useCallback(
    (entryId: string): boolean => {
      const entry = findEntryById(treeEntries, entryId)
      return Boolean(entry?.children?.length)
    },
    [treeEntries]
  )

  return {
    treeEntries,
    flatEntries,
    expandedIds,
    toggleExpand,
    expandAll,
    collapseAll,
    filteredTreeEntries,
    effectiveExpandedIds,
    getParentOptions,
    canBeParent,
    getDepth,
    hasChildren,
  }
}
