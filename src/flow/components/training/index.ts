/**
 * Training Management Module
 *
 * Comprehensive training management for EHS compliance.
 * Includes course catalog, requirements configuration, and compliance tracking.
 */

// =============================================================================
// MAIN PAGE
// =============================================================================

export { TrainingPage } from './TrainingPage'

// =============================================================================
// TABS
// =============================================================================

export { CoursesTab, RequirementsTab, ComplianceTab } from './tabs'

// =============================================================================
// CARDS
// =============================================================================

export { CourseCard } from './cards'
export type { CourseCardProps } from './cards'

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

export { ComplianceBadge, ExpirationIndicator } from './components'
export type { ComplianceBadgeProps, ExpirationIndicatorProps } from './components'

// =============================================================================
// TYPES
// =============================================================================

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
} from './types'

// =============================================================================
// STATUS CONFIGS
// =============================================================================

export {
  TRAINING_RECORD_STATUS_CONFIG,
  COMPLIANCE_STATUS_CONFIG,
  COURSE_STATUS_CONFIG,
  COURSE_CATEGORY_CONFIG,
  DELIVERY_METHOD_CONFIG,
  REQUIREMENT_SCOPE_CONFIG,
  REQUIREMENT_PRIORITY_CONFIG,
} from './types'
