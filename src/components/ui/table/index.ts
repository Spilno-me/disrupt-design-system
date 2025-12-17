/**
 * Table Cell Components
 *
 * Reusable cell renderer components for DataTable columns.
 * All components guarantee WCAG AAA contrast (7:1+).
 */

// =============================================================================
// UNIFIED DATA TABLE SYSTEM
// =============================================================================

export {
  DataTableBadge,
  ACTIVE_STATUS_MAP,
  WORKFLOW_STATUS_MAP,
  REQUEST_STATUS_MAP,
  PARTNER_STATUS_MAP,
  type DataTableBadgeProps,
  type StatusMapping,
  type StatusConfig as DataTableStatusConfig,
} from './DataTableBadge'

export {
  DataTableStatusDot,
  ACTIVE_DOT_STATUS_MAP,
  PARTNER_DOT_STATUS_MAP,
  WORKFLOW_DOT_STATUS_MAP,
  REQUEST_DOT_STATUS_MAP,
  LEAD_DOT_STATUS_MAP,
  INVOICE_DOT_STATUS_MAP,
  LOGIN_ACCOUNT_DOT_STATUS_MAP,
  TENANT_REQUEST_DOT_STATUS_MAP,
  type DataTableStatusDotProps,
  type DotStatusMapping,
  type DotStatusConfig,
  type DotVariant,
} from './DataTableStatusDot'

export {
  DataTableSeverity,
  PRIORITY_SEVERITY_MAP,
  LEAD_PRIORITY_SEVERITY_MAP,
  LEAD_TEMPERATURE_SEVERITY_MAP,
  INCIDENT_SEVERITY_MAP,
  URGENCY_SEVERITY_MAP,
  type DataTableSeverityProps,
  type SeverityMapping,
  type SeverityConfig,
} from './DataTableSeverity'

export {
  DataTableActions,
  type DataTableActionsProps,
  type ActionItem,
  type ActionVariant,
} from './DataTableActions'

export {
  DataTableMobileCard,
  type DataTableMobileCardProps,
  type MobileCardField,
} from './DataTableMobileCard'

// =============================================================================
// LEGACY TABLE CELL COMPONENTS (Deprecated - use DataTableBadge instead)
// =============================================================================

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
