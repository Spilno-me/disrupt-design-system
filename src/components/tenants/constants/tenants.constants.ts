/**
 * Tenants Module Constants
 * @module tenants/constants
 *
 * Centralized constants for the Tenants feature module.
 * Extracted from TenantsPage.tsx to reduce file size and improve reusability.
 */

import type { DotStatusMapping } from "../../ui/table"
import type { FilterState } from "../../shared/SearchFilter/types"
import type { OrganizationTier } from "../types"

// =============================================================================
// STATUS MAPPING
// =============================================================================

/**
 * Maps tenant status to visual indicator configuration.
 * Used by DataTableStatusDot component.
 */
export const TENANT_DOT_STATUS_MAP: DotStatusMapping = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  overdue: { label: "Overdue", variant: "warning" },
}

// =============================================================================
// TIER CONFIGURATION
// =============================================================================

/**
 * Human-readable labels for organization tiers.
 */
export const TIER_LABELS: Record<OrganizationTier, string> = {
  micro: "Micro",
  small: "Small",
  "mid-market": "Mid-Market",
  large: "Large",
  enterprise: "Enterprise",
}

/**
 * Tier ordering for sorting (smallest to largest).
 */
export const TIER_ORDER: OrganizationTier[] = [
  "micro",
  "small",
  "mid-market",
  "large",
  "enterprise",
]

// =============================================================================
// FILTER STATE
// =============================================================================

/**
 * Empty filter state for resetting filters.
 */
export const EMPTY_FILTER_STATE: FilterState = {
  status: [],
  subscriptionPackage: [],
}

// =============================================================================
// TOOLTIP CONFIGURATION
// =============================================================================

/**
 * Side offset for action button tooltips in pixels.
 */
export const TOOLTIP_SIDE_OFFSET = 4
