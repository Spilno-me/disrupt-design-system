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

// Incident Reporting Flow & Wizard
export {
  IncidentReportingFlow,
  IncidentWizard,
  EditIncidentFlow,
  IncidentActionMenu,
  DeleteIncidentDialog,
  SubmitIncidentDialog,
  IncidentManagementTableWithDialogs,
  // Wizard constants
  INCIDENT_CATEGORIES,
  SEVERITY_LEVELS,
  INCIDENT_WIZARD_STEPS,
  DEFAULT_FORM_DATA,
  // Additional detail components
  WorkflowsSection,
  FormSubmissionViewer,
  FormSubmissionsSection,
  FORM_TYPE_LABELS,
  INCIDENT_ROLE_LABELS,
} from '../components/incidents'

export type {
  IncidentReportingFlowProps,
  IncidentActionMenuProps,
  DeleteIncidentDialogProps,
  IncidentToDelete,
  SubmitIncidentDialogProps,
  IncidentToSubmit,
  EditIncidentFlowProps,
  IncidentToEdit,
  IncidentManagementTableWithDialogsProps,
  // Wizard types
  IncidentFormData,
  IncidentCategory,
  SeverityLevel as WizardSeverityLevel,
  LocationOption,
  // Additional detail types
  EvidenceDocument,
  DocumentUserContext,
  DocumentType,
  DocumentVisibility,
  IncidentRole,
  DocumentsEvidenceSectionProps,
  DetailedWorkflow,
  WorkflowStep,
  WorkflowStepAttachment,
  WorkflowStage,
  WorkflowStatus,
  WorkflowStepStatus,
  WorkflowsSectionProps,
  FormFieldType,
  FormField,
  FormSection,
  FormSubmissionData,
  FormSubmissionViewerProps,
  FormType,
  ExtendedFormSubmission,
  FormSubmissionsSectionProps,
} from '../components/incidents'

// Incidents Page - Full incidents management
export { IncidentsPage } from '../components/incidents'
export type { IncidentsPageProps } from '../components/incidents'

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

// Dictionary Management - Configuration page for system dictionaries
export {
  DictionaryPage,
  CategoriesSidebar,
  CategoryCard,
  DictionaryEntriesTable,
  CreateCategoryDialog,
  DeleteCategoryDialog,
  CreateEntryDialog,
  EditEntryDialog,
  DeleteEntryDialog,
  ENTRY_STATUS_CONFIG,
  CATEGORY_TYPE_CONFIG,
  generateCode,
} from './components/dictionary'

export type {
  DictionaryCategory,
  DictionaryEntry,
  CategoryType,
  EntryStatus,
  CreateCategoryFormData,
  EditCategoryFormData,
  CreateEntryFormData,
  EditEntryFormData,
  EntryStatusFilter,
  EntryTypeFilter,
  EntriesFilterState,
  DictionaryPageProps,
  CategoriesSidebarProps,
  CategoryCardProps,
  DictionaryEntriesTableProps,
} from './components/dictionary'

// Entity Templates - Configuration page for entity structure definitions
export {
  EntityTemplatesPage,
  EditTemplatePage,
  CreateTemplatePage,
  EntityTemplatesTable,
  ViewTemplateDialog,
  EditTemplateDialog,
  CreateTemplateDialog,
  DeleteTemplateDialog,
  TEMPLATE_TYPE_CONFIG,
  DEFAULT_JSON_SCHEMA,
  generateTemplateCode,
  validateTemplateName,
  validateJsonSchema,
  formatJson,
} from './components/entity-templates'

export type {
  EntityTemplate,
  TemplateType,
  TemplateTypeFilter,
  CreateTemplateFormData,
  EditTemplateFormData,
  EntityTemplatesPageProps,
  EditTemplatePageProps,
  CreateTemplatePageProps,
  EntityTemplatesTableProps,
  ViewTemplateDialogProps,
  EditTemplateDialogProps,
  CreateTemplateDialogProps,
  DeleteTemplateDialogProps,
} from './components/entity-templates'

// Locations - Hierarchical location management
export {
  LocationsPage,
  LocationTree,
  LocationTreeItem,
  LocationDetailSheet,
  DeleteLocationDialog,
  LOCATION_TYPE_CONFIG,
} from './components/locations'

export type {
  Location,
  LocationType,
  CreateLocationFormData,
  EditLocationFormData,
  LocationsPageProps,
  LocationTreeProps,
  LocationTreeItemProps,
} from './components/locations'

// Schema Studio - Visual JSON Schema editor
export {
  SchemaStudio,
  SchemaStudioProvider,
  useSchemaStudio,
  VisualMode as SchemaVisualMode,
  CodeMode as SchemaCodeMode,
  FIELD_TYPE_CONFIGS,
  WIDGET_CONFIGS,
} from './components/schema-studio'

export type {
  SchemaStudioProps,
  JSONSchema,
  SchemaField,
  SchemaFieldType,
  EditorMode as SchemaEditorMode,
  ValidationError as SchemaValidationError,
  HistoryEntry as SchemaHistoryEntry,
  SchemaStudioState,
  FieldCardProps,
  CodeEditorProps as SchemaCodeEditorProps,
} from './components/schema-studio'

// Mapping Studio - Visual mapping editor
export {
  MappingStudio,
  MappingStudioDefault,
  MappingStudioProvider,
  useMappingStudio,
  FormMode as MappingFormMode,
  CodeMode as MappingCodeMode,
  TRANSFORM_DEFINITIONS,
  FIELD_TYPE_ICONS,
  FIELD_TYPE_LABELS,
} from './components/mapping-studio'

export type {
  // Core types
  FieldDataType,
  TransformType,
  MappingField,
  TransformConfig,
  FieldMapping,
  MappingConfig,
  SourceSchema,
  TargetSchema,
  // State types
  MappingEditorMode,
  MappingValidationError,
  MappingHistoryEntry,
  MappingStudioState,
  // Props types
  MappingStudioProps,
  MappingStudioProviderProps,
  MappingRowProps,
  FieldSelectorProps,
  TransformSelectorProps,
  MappingPreviewProps,
  FormModeProps as MappingFormModeProps,
  CodeModeProps as MappingCodeModeProps,
  // Transform types
  TransformDefinition,
  TransformParamDef,
} from './components/mapping-studio'

// Organization Directory - Location-first employee directory
export {
  DirectoryPage,
  DirectoryTree,
  DirectoryTreeItem,
  PersonCard,
  PeopleList,
  PeopleGroupSection,
  LocationPeoplePanel,
  UserProfilePage,
  ProfileHeader,
  ContactCard,
  LocationAssignmentsCard,
  RolesCard,
  PersonDetailSheet,
  MobileLocationDirectory,
  DEFAULT_DIRECTORY_FILTERS,
  createUserProfileData,
} from './components/directory'

export type {
  DirectoryViewMode,
  AssignmentType,
  DirectoryPerson,
  LocationWithPeople,
  PeopleByRoleLevel,
  DirectoryFilterState,
  UserProfileData,
  DirectoryPageProps,
  DirectoryTreeProps,
  DirectoryTreeItemProps,
  LocationPeoplePanelProps,
  PersonCardProps,
  PersonDetailSheetProps,
  UserProfilePageProps,
} from './components/directory'

// Re-export RoleLevel from users module (used by directory)
export { ROLE_LEVEL_CONFIG } from './components/users'
export type { RoleLevel } from './components/users'

// Training Management - Employee training and certification tracking
export {
  TrainingPage,
  CoursesTab,
  RequirementsTab,
  ComplianceTab,
  CourseCard,
  ComplianceBadge,
  ExpirationIndicator,
  TRAINING_RECORD_STATUS_CONFIG,
  COMPLIANCE_STATUS_CONFIG,
  COURSE_STATUS_CONFIG,
  COURSE_CATEGORY_CONFIG,
  DELIVERY_METHOD_CONFIG,
  REQUIREMENT_SCOPE_CONFIG,
  REQUIREMENT_PRIORITY_CONFIG,
} from './components/training'

export type {
  // Status enums
  TrainingRecordStatus,
  ComplianceStatus,
  CourseStatus,
  DeliveryMethod,
  CourseCategory,
  RequirementScopeType,
  // Core types
  TrainingCourse,
  TrainingPackage,
  TrainingRequirement,
  TrainingRecord,
  // Compliance types
  UserRequirementStatus,
  UserComplianceStatus,
  LocationComplianceStatus,
  RoleComplianceStatus,
  DirectoryTrainingStatus,
  // Stats
  TrainingStats,
  // Form data
  CreateCourseFormData,
  EditCourseFormData,
  CreatePackageFormData,
  EditPackageFormData,
  CreateRequirementFormData,
  EditRequirementFormData,
  RecordCompletionFormData,
  WaiveRequirementFormData,
  // Filter types
  CourseQuickFilter,
  ComplianceQuickFilter,
  RequirementQuickFilter,
  CoursesFilterState,
  ComplianceFilterState,
  RequirementsFilterState,
  // Props types
  TrainingPageProps,
  MyTrainingTabProps,
  CoursesTabProps,
  RequirementsTabProps,
  ComplianceTabProps,
  CourseCardProps,
  ComplianceBadgeProps,
  ExpirationIndicatorProps,
} from './components/training'

// Modules Management - Admin configuration for Flow modules
export {
  ModuleCard,
  ModuleStatusBadge,
  ModulesGrid,
  ModulesPage,
  ModuleConfigSheet,
  CreateEntitySheet,
  MODULE_STATUS_CONFIG,
  getModuleIcon,
  getModuleColors,
  formatRelativeDate,
  formatShortDate,
  isValidModuleStatus,
  VALID_MODULE_STATUSES,
} from './components/modules'

export type {
  ModuleItem,
  EntityTemplateInfo,
  ModulePermissions,
  ModuleCardProps,
  ModuleStatusBadgeProps,
  ModulesGridProps,
  ModulesFilterState,
  ModulesPageProps,
  FormTemplateOption,
  ModuleConfigData,
  ModuleConfigSheetProps,
  CreateEntitySheetProps,
  ModuleStatus,
  ModuleStatusConfig,
} from './components/modules'

// Corrective Actions - CAPA management for incidents and audits
export {
  // Display atoms
  CorrectiveActionStatusBadge,
  PriorityIndicator,
  DueDateDisplay,
  // List components
  CorrectiveActionCard,
  CorrectiveActionsGrid,
  CorrectiveActionsPage,
  // Detail components
  CorrectiveActionHeader,
  CorrectiveActionTimeline,
  CorrectiveActionSidebar,
  CorrectiveActionDetailsPage,
  // Form dialogs
  ExtensionRequestDialog,
  ClosureApprovalDialog,
  CompletionFormDialog,
  CreateCorrectiveActionSheet,
  // Helpers
  STATUS_CONFIG as CA_STATUS_CONFIG,
  PRIORITY_CONFIG as CA_PRIORITY_CONFIG,
  EFFECTIVENESS_CONFIG,
  TIMELINE_EVENT_CONFIG,
  VALID_STATUSES as CA_VALID_STATUSES,
  VALID_PRIORITIES as CA_VALID_PRIORITIES,
  parseDate as caParseDate,
  formatDate as caFormatDate,
  formatDateTime as caFormatDateTime,
  formatRelativeDate as caFormatRelativeDate,
  getDueDateState,
  getDaysUntilDue,
  isValidStatus as caIsValidStatus,
  isValidPriority as caIsValidPriority,
  canTransitionTo,
  sortByPriority,
  sortByDueDate,
  isOverdue,
  getUserDisplayName,
  getUserInitials,
} from './components/corrective-actions'

export type {
  // Core types
  CorrectiveActionStatus,
  CorrectiveActionPriority,
  EffectivenessAssessment,
  ActionType,
  // Reference types
  UserReference,
  LocationReference as CALocationReference,
  DepartmentReference,
  DictionaryReference,
  EvidenceFile,
  // Main entity
  CorrectiveAction,
  // Component props
  CorrectiveActionPermissions,
  CorrectiveActionFilterState,
  // Timeline
  TimelineEventType,
  TimelineEvent,
  // Props types
  CorrectiveActionStatusBadgeProps,
  PriorityIndicatorProps,
  DueDateDisplayProps,
  CorrectiveActionCardProps,
  CorrectiveActionsGridProps,
  CorrectiveActionsPageProps,
  CorrectiveActionHeaderProps,
  CorrectiveActionTimelineProps,
  CorrectiveActionSidebarProps,
  CorrectiveActionDetailsPageProps,
  // Form data types
  ExtensionRequestDialogProps,
  ExtensionRequestData,
  ClosureApprovalDialogProps,
  ClosureApprovalData,
  ClosureRejectionData,
  CompletionFormDialogProps,
  CompletionFormData,
  CreateCorrectiveActionSheetProps,
  CreateCorrectiveActionData,
  // Helper types
  StatusConfig as CAStatusConfig,
  PriorityConfig as CAPriorityConfig,
  EffectivenessConfig,
  DueDateState,
} from './components/corrective-actions'

// Form Builder - Drag-and-drop form building
export {
  FormBuilder,
  FormBuilderProvider,
  useFormBuilder,
  useFormBuilderStore,
  // Palette components
  ComponentPalette,
  PaletteItem,
  // Canvas components
  FormCanvas,
  CanvasField,
  // Properties components
  PropertiesPanel,
  FieldPropertiesPanel,
  ValidationRulesEditor,
  ConditionalVisibility,
  // Constants
  FIELD_BLUEPRINTS,
  FIELD_CATEGORIES,
  FORM_BUILDER_LIMITS,
  VALIDATION_RULES,
} from './components/form-builder'

export type {
  // Schema types
  ISchema,
  SchemaProperty,
  ValidationRule,
  ConditionalReaction,
  SchemaHistoryEntry as FormBuilderSchemaHistoryEntry,
  FormMetadata,
  // Blueprint types
  FieldBlueprint,
  FieldCategory,
  DragState,
  DropTarget,
  // Validation types
  ValidationRuleType,
  ValidationRuleConfig,
  ValidationRuleDefinition,
  // Conditional types
  VisibilityCondition,
  VisibilityAction,
  ConditionalVisibilityRule,
  ParentFieldOption,
  // Store types
  FormBuilderState,
  FormBuilderActions,
  ActiveTab as FormBuilderActiveTab,
  // Context type
  FormBuilderContextValue,
} from './components/form-builder'

// Advanced Form Builder - Enhanced EHS form building with repeating sections,
// advanced conditional logic, scoring fields, and multi-page support
export {
  AdvancedFormBuilder,
} from './components/advanced-form-builder'

export type {
  AdvancedFormBuilderProps,
} from './components/advanced-form-builder'
