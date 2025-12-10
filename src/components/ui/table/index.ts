/**
 * Table Cell Components
 *
 * Reusable cell renderer components for DataTable columns.
 * All components guarantee WCAG AAA contrast (7:1+).
 */

export {
  StatusBadge,
  COMMON_STATUS_CONFIG,
  LEAD_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
  REQUEST_STATUS_CONFIG,
  type StatusBadgeProps,
  type StatusConfig,
} from './StatusBadge'

export {
  EmailLink,
  type EmailLinkProps,
} from './EmailLink'

export {
  ScoreBadge,
  type ScoreBadgeProps,
} from './ScoreBadge'
