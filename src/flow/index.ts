/**
 * Flow EHS Mobile Components
 *
 * Product-specific components for the Flow EHS mobile application.
 * These components are NOT included in the main DDS export to prevent
 * polluting other products (Portal, Market, etc.) with Flow-specific code.
 *
 * @usage
 * ```tsx
 * import { MobileNavButton, QuickActionButton } from '@adrozdenko/design-system/flow'
 * import { IncidentDetailsPage } from '@adrozdenko/design-system/flow'
 * ```
 */

// Mobile Navigation
export { MobileNavButton, mobileNavButtonVariants } from './components/mobile-nav-button'
export type { MobileNavButtonProps, MobileNavButtonVariant } from './components/mobile-nav-button'

export { MobileNavBar, mobileNavBarVariants, FlowMobileNav } from './components/mobile-nav-bar'
export type { MobileNavBarProps, FlowMobileNavProps, MoreMenuItem } from './components/mobile-nav-bar'

export { QuickActionButton, quickActionButtonVariants } from './components/quick-action-button'
export type { QuickActionButtonProps, QuickActionVariant } from './components/quick-action-button'

export { NextStepButton, nextStepButtonVariants } from './components/next-step-button'
export type { NextStepButtonProps, NextStepSeverity } from './components/next-step-button'

// Incident Details Page
export {
  IncidentDetailsPage,
  Breadcrumb,
  IncidentStatsBar,
  IncidentDetailsHeader,
  OverviewTab,
  LocationCard,
  IncidentInfoCard,
  DescriptionCard,
  IncidentMap,
  IncidentAccordionSection,
  StepsTab,
  AdvisorTab,
  INCIDENT_TYPE_LABELS,
  INCIDENT_STATUS_LABELS,
  INCIDENT_SEVERITY_LABELS,
} from '../components/incidents'

export type {
  IncidentDetail,
  IncidentLocation,
  IncidentPerson,
  IncidentWorkflow,
  FormSubmission,
  Activity,
  IncidentStatus,
  IncidentSeverity,
  IncidentTab,
  IncidentDetailsPageProps,
  BreadcrumbItem,
  BreadcrumbProps,
  IncidentStatsBarProps,
  IncidentDetailsHeaderProps,
  LocationCardProps,
  IncidentMapProps,
  IncidentInfoCardProps,
  DescriptionCardProps,
  IncidentAccordionSectionProps,
  PlaceholderTabProps,
} from '../components/incidents'

// Steps Page - View and manage incident steps/tasks
export {
  StepsPage,
  StepItem,
  STEP_STATUS_LABELS,
} from '../components/incidents'

export type {
  Step,
  StepStatus,
  StepsTabId,
  StepsPageTab,
  StepsFilterState,
  StepItemProps,
  StepsPageProps,
} from '../components/incidents'

// EHS Analytics Dashboard - Comprehensive dashboard widgets
export {
  EHSAnalyticsDashboard,
  KPICard,
  BreakdownCard,
  AgingCard,
  TrendingCard,
  RiskHeatmapCard,
  WorkloadCard,
  UpcomingTasksCard,
  SectionHeader,
} from './components/dashboard'

export type {
  EHSAnalyticsDashboardProps,
  KPICardProps,
  BreakdownCardProps,
  BreakdownItem,
  AgingCardProps,
  AgingItem,
  TrendingCardProps,
  TrendingItem,
  RiskHeatmapCardProps,
  LocationRisk,
  WorkloadCardProps,
  WorkloadItem,
  UpcomingTasksCardProps,
  UpcomingTask,
  SectionHeaderProps,
} from './components/dashboard'

// User Management - Configuration page for users, roles, permissions
export {
  UsersPage,
  UsersTab,
  RolesTab,
  UserStatsCards,
  UserPreviewCard,
  RoleCard,
  UsersDataTable,
  BulkActionsBar,
  CreateUserDialog,
  EditUserDialog,
  DeleteUserDialog,
  ManageRolesDialog,
  // Role dialogs
  CreateRoleDialog,
  EditRoleDialog,
  ViewRolePermissionsDialog,
  DeleteRoleDialog,
  LocationScopeSelector,
  UserActivitySheet,
  USER_STATUS_CONFIG,
  ACTIVITY_TYPE_CONFIG,
} from './components/users'

export type {
  User,
  UserStatus,
  Role,
  Permission,
  PermissionResource,
  PermissionAction,
  LocationNode,
  LocationScope,
  RoleAssignment,
  UserActivity,
  UserActivityType,
  CreateUserFormData,
  EditUserFormData,
  AddRoleAssignmentFormData,
  EditRoleAssignmentFormData,
  BulkActionType,
  BulkActionPayload,
  QuickFilterStatus,
  UsersFilterState,
  UserStats,
  UsersPageProps,
  UsersTabProps,
  RolesTabProps,
  // Enhanced role/permission types
  EnhancedPermission,
  PermissionCategory,
  CreateRoleFormData,
  EditRoleFormData,
  RoleFilterType,
} from './components/users'
