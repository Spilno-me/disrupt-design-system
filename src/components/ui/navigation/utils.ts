/**
 * Navigation Utilities - Shared helper functions for navigation components.
 */

import type { NavItem } from './types'

/** Check if an item or any of its children is active */
export function isGroupActive(item: NavItem, activeId?: string): boolean {
  if (item.id === activeId) return true
  if (item.children) {
    return item.children.some((child) => isGroupActive(child, activeId))
  }
  return false
}

/** Find the parent group ID for a given item ID (for icon bubble-up feature) */
export function findParentGroupId(
  items: NavItem[],
  targetId: string,
  parentId?: string
): string | undefined {
  for (const item of items) {
    if (item.id === targetId) return parentId
    if (item.children) {
      const found = findParentGroupId(item.children, targetId, item.id)
      if (found !== undefined) return found
    }
  }
  return undefined
}

/** Find an item by ID in nested structure */
export function findItemById(items: NavItem[], id: string): NavItem | undefined {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItemById(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

/** Add badge counts to navigation items */
export function addBadges(
  items: NavItem[],
  badges: Record<string, number | boolean>
): NavItem[] {
  return items.map((item) => ({
    ...item,
    badge: badges[item.id] ?? item.badge,
    children: item.children ? addBadges(item.children, badges) : undefined,
  }))
}
