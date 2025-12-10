/**
 * Navigation Types - Single source of truth for all navigation components.
 */

import * as React from 'react'

/** Supported product types for DDS apps */
export type ProductType = 'flow' | 'market' | 'partner'

/** Navigation item - flexible for custom labels, icons, routing, and nested groups */
export interface NavItem {
  /** Unique identifier - used for active state matching and keys */
  id: string
  /** Display label shown to user */
  label: string
  /** Icon component - accepts any React node (Lucide, custom SVG, etc.) */
  icon: React.ReactNode
  /** Navigation href - used by router integration */
  href?: string
  /** Badge indicator - number for count, true for dot */
  badge?: number | boolean
  /** Nested children for expandable groups */
  children?: NavItem[]
  /** Whether the item is disabled */
  disabled?: boolean
}

/** Callback when navigation item is clicked */
export type OnNavigate = (item: NavItem) => void

/** Common props shared by all navigation components */
export interface BaseNavProps {
  /** Navigation items to display */
  items: NavItem[]
  /** Currently active item ID (matches route) */
  activeItemId?: string
  /** Callback when a nav item is clicked */
  onNavigate?: OnNavigate
  /** Show help item */
  showHelpItem?: boolean
  /** Callback when help item is clicked */
  onHelpClick?: () => void
  /** Additional className */
  className?: string
}
