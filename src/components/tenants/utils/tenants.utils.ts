/**
 * Tenants Module Utilities
 * @module tenants/utils
 *
 * Helper functions for the Tenants feature module.
 * Extracted from TenantsPage.tsx to reduce file size and improve testability.
 */

import type { OrganizationTier } from "../types"

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Formats a date for display in tenant tables.
 * Returns em-dash for null dates (e.g., not yet active).
 *
 * @param date - Date to format, or null
 * @returns Formatted date string or "—"
 *
 * @example
 * formatTenantDate(new Date("2024-06-15")) // "Jun 15, 2024"
 * formatTenantDate(null) // "—"
 */
export function formatTenantDate(date: Date | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// =============================================================================
// TIER BADGE VARIANTS
// =============================================================================

/**
 * Badge variant type for tier badges.
 */
export type TierBadgeVariant = "default" | "info" | "secondary"

/**
 * Returns the appropriate badge variant for an organization tier.
 *
 * @param tier - Organization tier
 * @returns Badge variant: "default" for enterprise/large, "info" for mid-market, "secondary" for small/micro
 *
 * @example
 * getTierBadgeVariant("enterprise") // "default"
 * getTierBadgeVariant("mid-market") // "info"
 * getTierBadgeVariant("micro") // "secondary"
 */
export function getTierBadgeVariant(tier: OrganizationTier): TierBadgeVariant {
  switch (tier) {
    case "enterprise":
    case "large":
      return "default"
    case "mid-market":
      return "info"
    case "small":
    case "micro":
      return "secondary"
    default:
      return "secondary"
  }
}
