/**
 * Filter configuration constants for partner components
 * @module partners/constants/filter.constants
 */

import type { FilterGroup } from "../../shared/SearchFilter/types"

/** Filter groups for Partner Network page */
export const PARTNER_NETWORK_FILTER_GROUPS: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { id: "active", label: "Active" },
      { id: "inactive", label: "Inactive" },
      { id: "pending", label: "Pending" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { id: "master", label: "Master Partner" },
      { id: "sub", label: "Sub-Partner" },
    ],
  },
]

/** Filter groups for Partners page */
export const PARTNER_FILTER_GROUPS: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { id: "active", label: "Active" },
      { id: "inactive", label: "Inactive" },
      { id: "pending", label: "Pending" },
    ],
  },
  {
    key: "tier",
    label: "Tier",
    options: [
      { id: "Standard", label: "Standard" },
      { id: "Premium", label: "Premium" },
      { id: "Enterprise", label: "Enterprise" },
    ],
  },
]
