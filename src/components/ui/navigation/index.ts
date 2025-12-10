/**
 * Navigation Module - Shared types, utilities, and components.
 */

// Types
export type { NavItem, ProductType, OnNavigate, BaseNavProps } from './types'

// Utilities
export { isGroupActive, findParentGroupId, findItemById, addBadges } from './utils'

// Components
export { NavBadge } from './NavBadge'
export type { NavBadgeProps, BadgeSize } from './NavBadge'

export { NavIcon } from './NavIcon'
export type { NavIconProps, IconSize } from './NavIcon'
