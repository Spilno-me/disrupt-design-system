/**
 * Filter configuration constants for tenant components
 * @module tenants/constants/filter.constants
 */

import type { FilterGroup } from "../../shared/SearchFilter/types"

/** Filter groups for Tenants page */
export const TENANT_FILTER_GROUPS: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { id: "active", label: "Active" },
      { id: "suspended", label: "Suspended" },
      { id: "overdue", label: "Overdue" },
    ],
  },
  {
    key: "subscriptionPackage",
    label: "Package",
    options: [
      { id: "starter", label: "Starter" },
      { id: "professional", label: "Professional" },
      { id: "enterprise", label: "Enterprise" },
    ],
  },
]
