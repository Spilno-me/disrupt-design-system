/**
 * Filter constants for Partner Invoices page
 * @module partner-invoices/constants/filter.constants
 */

import type { FilterGroup } from "../../shared/SearchFilter/types"

/**
 * Filter groups for Partner Invoices page (per spec Section: Filters)
 *
 * Available statuses (MVP):
 * - Draft
 * - Submitted
 * - Approved
 * - Pending Payment
 * - Active
 * - Overdue
 * - Suspended
 */
export const PARTNER_INVOICE_FILTER_GROUPS: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { id: "draft", label: "Draft" },
      { id: "submitted", label: "Submitted" },
      { id: "approved", label: "Approved" },
      { id: "pending_payment", label: "Pending Payment" },
      { id: "active", label: "Active" },
      { id: "overdue", label: "Overdue" },
      { id: "suspended", label: "Suspended" },
    ],
  },
]
