/**
 * Workspace Seed Data
 *
 * Mock workspace data for all products (Flow, Market, Partner).
 * Demonstrates 3-level nesting: Root -> Subfolder -> Item
 *
 * ID Format: ws-{type}-{product}-{descriptor}
 */

import type {
  WorkspaceNode,
  WorkspaceFolder,
  WorkspaceItem,
  Product,
} from '../../../components/ui/workspace/types'

// =============================================================================
// SEED DATA
// =============================================================================

/**
 * All workspace nodes across all products
 */
export const seedWorkspaceNodes: WorkspaceNode[] = [
  // ===========================================================================
  // FLOW EHS - Safety Management
  // ===========================================================================

  // Level 1: Root folders
  {
    id: 'ws-folder-flow-safety',
    type: 'folder',
    name: 'Safety Inspections',
    product: 'flow',
    parentId: null,
    sortOrder: 0,
    color: 'green',
    updatedAt: Date.now() - 86400000 * 7, // 7 days ago
  } as WorkspaceFolder,
  {
    id: 'ws-folder-flow-incidents',
    type: 'folder',
    name: 'Incident Reports',
    product: 'flow',
    parentId: null,
    sortOrder: 1,
    color: 'red',
    updatedAt: Date.now() - 86400000 * 5,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-flow-training',
    type: 'folder',
    name: 'Training Materials',
    product: 'flow',
    parentId: null,
    sortOrder: 2,
    color: 'blue',
    updatedAt: Date.now() - 86400000 * 3,
  } as WorkspaceFolder,

  // Level 2: Subfolders under Safety Inspections
  {
    id: 'ws-folder-flow-checklists',
    type: 'folder',
    name: 'Daily Checklists',
    product: 'flow',
    parentId: 'ws-folder-flow-safety',
    sortOrder: 0,
    color: 'default',
    updatedAt: Date.now() - 86400000 * 6,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-flow-audits',
    type: 'folder',
    name: 'Monthly Audits',
    product: 'flow',
    parentId: 'ws-folder-flow-safety',
    sortOrder: 1,
    color: 'amber',
    updatedAt: Date.now() - 86400000 * 4,
  } as WorkspaceFolder,

  // Level 3: Items under Daily Checklists
  {
    id: 'ws-item-flow-forklift',
    type: 'item',
    name: 'Forklift Pre-Op Check',
    product: 'flow',
    parentId: 'ws-folder-flow-checklists',
    sortOrder: 0,
    href: '/flow/forms/forklift-check',
    iconName: 'Truck',
    updatedAt: Date.now() - 86400000 * 2,
  } as WorkspaceItem,
  {
    id: 'ws-item-flow-ppe',
    type: 'item',
    name: 'PPE Compliance',
    product: 'flow',
    parentId: 'ws-folder-flow-checklists',
    sortOrder: 1,
    href: '/flow/forms/ppe-check',
    iconName: 'HardHat',
    updatedAt: Date.now() - 86400000,
  } as WorkspaceItem,
  {
    id: 'ws-item-flow-fire',
    type: 'item',
    name: 'Fire Extinguisher Check',
    product: 'flow',
    parentId: 'ws-folder-flow-checklists',
    sortOrder: 2,
    href: '/flow/forms/fire-ext',
    iconName: 'Flame',
    updatedAt: Date.now() - 3600000,
  } as WorkspaceItem,

  // ===========================================================================
  // MARKET - Analytics Platform
  // ===========================================================================

  // Level 1: Root folders
  {
    id: 'ws-folder-market-dashboards',
    type: 'folder',
    name: 'Dashboards',
    product: 'market',
    parentId: null,
    sortOrder: 0,
    color: 'blue',
    updatedAt: Date.now() - 86400000 * 10,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-market-reports',
    type: 'folder',
    name: 'Reports',
    product: 'market',
    parentId: null,
    sortOrder: 1,
    color: 'purple',
    updatedAt: Date.now() - 86400000 * 8,
  } as WorkspaceFolder,

  // Level 2: Subfolders
  {
    id: 'ws-folder-market-weekly',
    type: 'folder',
    name: 'Weekly Reports',
    product: 'market',
    parentId: 'ws-folder-market-reports',
    sortOrder: 0,
    color: 'default',
    updatedAt: Date.now() - 86400000 * 6,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-market-monthly',
    type: 'folder',
    name: 'Monthly Reports',
    product: 'market',
    parentId: 'ws-folder-market-reports',
    sortOrder: 1,
    color: 'cyan',
    updatedAt: Date.now() - 86400000 * 5,
  } as WorkspaceFolder,

  // Level 3: Items
  {
    id: 'ws-item-market-revenue',
    type: 'item',
    name: 'Revenue Dashboard',
    product: 'market',
    parentId: 'ws-folder-market-dashboards',
    sortOrder: 0,
    href: '/market/dashboard/revenue',
    iconName: 'DollarSign',
    updatedAt: Date.now() - 86400000 * 2,
  } as WorkspaceItem,
  {
    id: 'ws-item-market-traffic',
    type: 'item',
    name: 'Traffic Analytics',
    product: 'market',
    parentId: 'ws-folder-market-dashboards',
    sortOrder: 1,
    href: '/market/dashboard/traffic',
    iconName: 'TrendingUp',
    updatedAt: Date.now() - 86400000,
  } as WorkspaceItem,

  // ===========================================================================
  // PARTNER - Partner Portal
  // ===========================================================================

  // Level 1: Root folders
  {
    id: 'ws-folder-partner-commissions',
    type: 'folder',
    name: 'Commission Reports',
    product: 'partner',
    parentId: null,
    sortOrder: 0,
    color: 'green',
    updatedAt: Date.now() - 86400000 * 14,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-partner-team',
    type: 'folder',
    name: 'My Team',
    product: 'partner',
    parentId: null,
    sortOrder: 1,
    color: 'blue',
    updatedAt: Date.now() - 86400000 * 12,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-partner-resources',
    type: 'folder',
    name: 'Resources',
    product: 'partner',
    parentId: null,
    sortOrder: 2,
    color: 'purple',
    updatedAt: Date.now() - 86400000 * 10,
  } as WorkspaceFolder,

  // Level 2: Subfolders
  {
    id: 'ws-folder-partner-2024',
    type: 'folder',
    name: '2024 Reports',
    product: 'partner',
    parentId: 'ws-folder-partner-commissions',
    sortOrder: 0,
    color: 'default',
    updatedAt: Date.now() - 86400000 * 8,
  } as WorkspaceFolder,
  {
    id: 'ws-folder-partner-2025',
    type: 'folder',
    name: '2025 Reports',
    product: 'partner',
    parentId: 'ws-folder-partner-commissions',
    sortOrder: 1,
    color: 'default',
    updatedAt: Date.now() - 86400000 * 5,
  } as WorkspaceFolder,

  // Level 3: Items
  {
    id: 'ws-item-partner-jan25',
    type: 'item',
    name: 'January 2025 Statement',
    product: 'partner',
    parentId: 'ws-folder-partner-2025',
    sortOrder: 0,
    href: '/partner/commissions/2025/01',
    iconName: 'FileText',
    updatedAt: Date.now() - 86400000 * 3,
  } as WorkspaceItem,
  {
    id: 'ws-item-partner-feb25',
    type: 'item',
    name: 'February 2025 Statement',
    product: 'partner',
    parentId: 'ws-folder-partner-2025',
    sortOrder: 1,
    href: '/partner/commissions/2025/02',
    iconName: 'FileText',
    updatedAt: Date.now() - 86400000,
  } as WorkspaceItem,
  {
    id: 'ws-item-partner-dec24',
    type: 'item',
    name: 'December 2024 Statement',
    product: 'partner',
    parentId: 'ws-folder-partner-2024',
    sortOrder: 0,
    href: '/partner/commissions/2024/12',
    iconName: 'FileText',
    updatedAt: Date.now() - 86400000 * 30,
  } as WorkspaceItem,
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get workspace nodes by product
 * O(n) filter - acceptable for expected dataset sizes (<1000 nodes)
 */
export function getWorkspacesByProduct(product: Product): WorkspaceNode[] {
  return seedWorkspaceNodes.filter((n) => n.product === product)
}

/**
 * Get root folders for a product
 */
export function getRootFolders(product: Product): WorkspaceNode[] {
  return seedWorkspaceNodes.filter(
    (n) => n.product === product && n.parentId === null && n.type === 'folder'
  )
}

/**
 * Get workspace node by ID
 */
export function getWorkspaceById(id: string): WorkspaceNode | undefined {
  return seedWorkspaceNodes.find((n) => n.id === id)
}

/**
 * Get children of a node
 */
export function getNodeChildren(parentId: string): WorkspaceNode[] {
  return seedWorkspaceNodes
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Get all descendant IDs of a node (for cascading deletes)
 */
export function getDescendantIds(nodeId: string): string[] {
  const ids: string[] = []

  const collectDescendants = (parentId: string) => {
    const children = seedWorkspaceNodes.filter((n) => n.parentId === parentId)
    for (const child of children) {
      ids.push(child.id)
      collectDescendants(child.id)
    }
  }

  collectDescendants(nodeId)
  return ids
}

/**
 * Count nodes by product (for stats/debugging)
 */
export function getWorkspaceStats(): Record<Product, number> {
  return {
    flow: seedWorkspaceNodes.filter((n) => n.product === 'flow').length,
    market: seedWorkspaceNodes.filter((n) => n.product === 'market').length,
    partner: seedWorkspaceNodes.filter((n) => n.product === 'partner').length,
  }
}
