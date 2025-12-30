/**
 * Training Management Types
 *
 * TypeScript interfaces for the Training Management module.
 * Supports training course definitions, requirements (by role/location/package),
 * completion tracking, and compliance status derivation.
 *
 * @module Training
 */

import type { User, Role, RoleLevel, LocationNode } from '../users/types'

// =============================================================================
// TRAINING STATUS ENUMS
// =============================================================================

/**
 * Individual training record status - tracks a user's progress on a course
 */
export type TrainingRecordStatus =
  | 'not_started' // Training not yet begun
  | 'in_progress' // Training started but not completed
  | 'completed' // Training successfully completed
  | 'expired' // Certification has expired
  | 'failed' // Failed assessment/test
  | 'waived' // Requirement waived by admin

/**
 * Overall compliance status - derived from requirements vs completions
 * Used at user, location, and role levels
 */
export type ComplianceStatus =
  | 'compliant' // All required trainings are current
  | 'expiring_soon' // One or more trainings expiring within threshold (default 30 days)
  | 'non_compliant' // One or more required trainings missing or expired
  | 'not_applicable' // No training requirements apply

/**
 * Course lifecycle status
 */
export type CourseStatus = 'draft' | 'active' | 'archived'

/**
 * How the training is delivered
 */
export type DeliveryMethod =
  | 'online' // E-learning, self-paced
  | 'instructor_led' // In-person classroom
  | 'virtual' // Live virtual/webinar
  | 'on_the_job' // Supervised practical training
  | 'blended' // Combination of methods
  | 'external' // Third-party provider

/**
 * Training course category
 */
export type CourseCategory =
  | 'safety' // General safety training
  | 'compliance' // Regulatory compliance
  | 'certification' // Professional certifications
  | 'emergency' // Emergency response
  | 'equipment' // Equipment-specific
  | 'environmental' // Environmental/hazmat
  | 'onboarding' // New hire orientation
  | 'skills' // Skills development

/**
 * How requirements are scoped/assigned
 */
export type RequirementScopeType =
  | 'role' // Required for specific role(s)
  | 'location' // Required at specific location(s)
  | 'package' // Part of a training package
  | 'all' // Required for all users

// =============================================================================
// TRAINING COURSE (Definition)
// =============================================================================

/**
 * Training course definition - the "what" of training
 */
export interface TrainingCourse {
  id: string
  /** Course code (e.g., "OSHA-30", "FIRE-01") */
  code: string
  /** Display name */
  name: string
  /** Full description */
  description?: string
  /** Course category */
  category: CourseCategory
  /** Course lifecycle status */
  status: CourseStatus
  /** How the training is delivered */
  deliveryMethod: DeliveryMethod
  /** Duration in minutes */
  durationMinutes: number
  /** Validity period in months (null = never expires) */
  validityMonths: number | null
  /** Days before expiration to trigger "expiring_soon" status */
  expirationWarningDays: number
  /** Whether this is a system-defined course (cannot be deleted) */
  isSystem: boolean
  /** External provider name (if external) */
  provider?: string
  /** External course URL or ID */
  externalUrl?: string
  /** Passing score percentage (if applicable) */
  passingScore?: number
  /** Prerequisites - course IDs that must be completed first */
  prerequisites?: string[]
  /** Tags for filtering/search */
  tags?: string[]
  /** Content placeholder URL (for future LMS integration) */
  contentUrl?: string
  /** Number of users currently assigned this course */
  assignedCount?: number
  /** Created timestamp */
  createdAt: string
  /** Last updated timestamp */
  updatedAt?: string
}

// =============================================================================
// TRAINING PACKAGE (Course Groups)
// =============================================================================

/**
 * Training package - groups courses together for bulk assignment
 * Example: "Basic Safety Package" contains Fire Safety, First Aid, PPE Training
 */
export interface TrainingPackage {
  id: string
  /** Package code (e.g., "PKG-BASIC-SAFETY") */
  code: string
  /** Display name */
  name: string
  /** Description */
  description?: string
  /** Package status */
  status: 'active' | 'archived'
  /** Whether this is a system-defined package */
  isSystem: boolean
  /** Course IDs in this package */
  courseIds: string[]
  /** Courses data for display (denormalized) */
  courses?: Pick<TrainingCourse, 'id' | 'code' | 'name' | 'category' | 'durationMinutes'>[]
  /** Total estimated duration (sum of courses) */
  totalDurationMinutes?: number
  /** Number of users assigned this package */
  assignedCount?: number
  /** Tags for filtering */
  tags?: string[]
  /** Created timestamp */
  createdAt: string
  /** Last updated timestamp */
  updatedAt?: string
}

// =============================================================================
// TRAINING REQUIREMENT (Assignment Rules)
// =============================================================================

/**
 * Training requirement - defines who needs what training
 * Flexible scoping: by role, location, or package
 */
export interface TrainingRequirement {
  id: string
  /** Human-readable name for the requirement */
  name: string
  /** Description */
  description?: string
  /** How this requirement is scoped */
  scopeType: RequirementScopeType
  /** Course ID required (when not using package) */
  courseId?: string
  /** Course data for display */
  course?: Pick<TrainingCourse, 'id' | 'code' | 'name' | 'category'>
  /** Package ID (when scope includes package) */
  packageId?: string
  /** Package data for display */
  package?: Pick<TrainingPackage, 'id' | 'code' | 'name' | 'courseIds'>
  /** Role IDs this applies to (when scopeType = 'role') */
  roleIds?: string[]
  /** Roles data for display */
  roles?: Pick<Role, 'id' | 'name' | 'level'>[]
  /** Location IDs this applies to (when scopeType = 'location') */
  locationIds?: string[]
  /** Whether requirement cascades to child locations */
  includeChildLocations?: boolean
  /** Location names for display */
  locationNames?: string[]
  /** Whether this requirement is active */
  isActive: boolean
  /** Grace period in days for new hires/role changes */
  gracePeriodDays: number
  /** Priority level for display ordering */
  priority: 'critical' | 'high' | 'medium' | 'low'
  /** Effective date - when requirement takes effect */
  effectiveDate: string
  /** End date - when requirement expires (null = no end) */
  endDate?: string | null
  /** Number of users this requirement applies to */
  affectedUsers?: number
  /** Created timestamp */
  createdAt: string
  /** Updated timestamp */
  updatedAt?: string
}

// =============================================================================
// TRAINING RECORD (Completion History)
// =============================================================================

/**
 * Training record - individual user's completion/attempt for a course
 */
export interface TrainingRecord {
  id: string
  /** User who completed/attempted the training */
  userId: string
  /** User data for display */
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'avatarUrl'>
  /** Course that was completed */
  courseId: string
  /** Course data for display */
  course?: Pick<TrainingCourse, 'id' | 'code' | 'name' | 'validityMonths'>
  /** Requirement that triggered this (optional) */
  requirementId?: string
  /** Record status */
  status: TrainingRecordStatus
  /** Date training was assigned */
  assignedAt: string
  /** Due date for completion */
  dueDate?: string
  /** Date training was started */
  startedAt?: string
  /** Completion date (when status = completed) */
  completedAt?: string
  /** Expiration date (calculated from completion + validity period) */
  expiresAt?: string | null
  /** Score achieved (percentage, 0-100) */
  score?: number
  /** Certificate number/ID (if issued) */
  certificateNumber?: string
  /** Certificate document URL */
  certificateUrl?: string
  /** Notes/comments */
  notes?: string
  /** Who recorded completion (for manual entries) */
  recordedBy?: string
  /** Waiver reason (when status = waived) */
  waiverReason?: string
  /** Who approved waiver */
  waivedBy?: string
  /** Created timestamp */
  createdAt: string
  /** Updated timestamp */
  updatedAt?: string
}

// =============================================================================
// COMPLIANCE STATUS TYPES
// =============================================================================

/**
 * Individual requirement status for a user
 */
export interface UserRequirementStatus {
  requirementId: string
  requirementName: string
  courseId: string
  courseName: string
  courseCode: string
  /** Status of this specific requirement */
  status: ComplianceStatus
  /** Most recent training record for this requirement */
  latestRecord?: Pick<TrainingRecord, 'id' | 'status' | 'completedAt' | 'expiresAt' | 'score'>
  /** Days until expiration (negative if expired) */
  daysUntilExpiration?: number
  /** Due date for completion (for new requirements) */
  dueDate?: string
}

/**
 * Compliance summary for a user
 */
export interface UserComplianceStatus {
  userId: string
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'avatarUrl' | 'status'>
  /** Overall compliance status */
  overallStatus: ComplianceStatus
  /** Count of compliant trainings */
  compliantCount: number
  /** Count of trainings expiring soon */
  expiringSoonCount: number
  /** Count of non-compliant (missing/expired) trainings */
  nonCompliantCount: number
  /** Total required trainings */
  totalRequired: number
  /** Compliance percentage (compliant / totalRequired * 100) */
  compliancePercentage: number
  /** Next expiration date across all trainings */
  nextExpirationDate?: string
  /** Course name of next expiring training */
  nextExpiringCourseName?: string
  /** Detailed breakdown by requirement */
  requirements?: UserRequirementStatus[]
}

/**
 * Compliance summary for a location
 */
export interface LocationComplianceStatus {
  locationId: string
  locationName: string
  locationType?: string
  /** Overall compliance status for this location */
  overallStatus: ComplianceStatus
  /** Total users at this location */
  totalUsers: number
  /** Users fully compliant */
  compliantUsers: number
  /** Users with expiring training */
  expiringSoonUsers: number
  /** Users non-compliant */
  nonCompliantUsers: number
  /** Compliance percentage */
  compliancePercentage: number
}

/**
 * Compliance summary for a role
 */
export interface RoleComplianceStatus {
  roleId: string
  roleName: string
  roleLevel?: RoleLevel
  /** Overall compliance status */
  overallStatus: ComplianceStatus
  /** Total users with this role */
  totalUsers: number
  /** Compliant users */
  compliantUsers: number
  /** Users with expiring training */
  expiringSoonUsers: number
  /** Non-compliant users */
  nonCompliantUsers: number
  /** Compliance percentage */
  compliancePercentage: number
  /** Required courses for this role */
  requiredCourses: Pick<TrainingCourse, 'id' | 'code' | 'name'>[]
}

// =============================================================================
// AGGREGATE STATS
// =============================================================================

/**
 * Training module statistics for dashboard/overview
 */
export interface TrainingStats {
  /** Total courses in catalog */
  totalCourses: number
  /** Active courses */
  activeCourses: number
  /** Total packages */
  totalPackages: number
  /** Active packages */
  activePackages: number
  /** Total requirements defined */
  totalRequirements: number
  /** Active requirements */
  activeRequirements: number
  /** Organization-wide compliance metrics */
  compliance: {
    totalUsers: number
    compliantUsers: number
    expiringSoonUsers: number
    nonCompliantUsers: number
    overallPercentage: number
  }
  /** Trainings expiring in next 30 days */
  upcomingExpirations: number
  /** Trainings completed this month */
  completedThisMonth: number
  /** Training hours completed this month */
  hoursCompletedThisMonth: number
  /** Trend compared to last period */
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface CreateCourseFormData {
  code: string
  name: string
  description?: string
  category: CourseCategory
  deliveryMethod: DeliveryMethod
  durationMinutes: number
  validityMonths: number | null
  expirationWarningDays?: number
  provider?: string
  externalUrl?: string
  passingScore?: number
  prerequisites?: string[]
  tags?: string[]
}

export interface EditCourseFormData extends CreateCourseFormData {
  id: string
}

export interface CreatePackageFormData {
  code: string
  name: string
  description?: string
  courseIds: string[]
  tags?: string[]
}

export interface EditPackageFormData extends CreatePackageFormData {
  id: string
}

export interface CreateRequirementFormData {
  name: string
  description?: string
  scopeType: RequirementScopeType
  courseId?: string
  packageId?: string
  roleIds?: string[]
  locationIds?: string[]
  includeChildLocations?: boolean
  gracePeriodDays?: number
  priority?: 'critical' | 'high' | 'medium' | 'low'
  effectiveDate: string
  endDate?: string | null
}

export interface EditRequirementFormData extends CreateRequirementFormData {
  id: string
}

export interface RecordCompletionFormData {
  userId: string
  courseId: string
  completedAt: string
  score?: number
  certificateNumber?: string
  notes?: string
}

export interface WaiveRequirementFormData {
  userId: string
  courseId: string
  requirementId: string
  waiverReason: string
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export type CourseQuickFilter = 'all' | CourseStatus
export type ComplianceQuickFilter = 'all' | ComplianceStatus
export type RequirementQuickFilter = 'all' | 'active' | 'inactive'

export interface CoursesFilterState {
  search: string
  categories: CourseCategory[]
  deliveryMethods: DeliveryMethod[]
  statuses: CourseStatus[]
}

export interface ComplianceFilterState {
  search: string
  complianceStatus: ComplianceStatus | 'all'
  departments: string[]
  locations: string[]
  roles: string[]
}

export interface RequirementsFilterState {
  search: string
  scopeTypes: RequirementScopeType[]
  isActive: boolean | 'all'
  priorities: ('critical' | 'high' | 'medium' | 'low')[]
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface TrainingPageProps {
  /** All training courses */
  courses: TrainingCourse[]
  /** Training packages */
  packages: TrainingPackage[]
  /** Training requirements */
  requirements: TrainingRequirement[]
  /** Training statistics */
  stats?: TrainingStats
  /** User compliance data */
  userCompliance: UserComplianceStatus[]
  /** Location compliance data */
  locationCompliance?: LocationComplianceStatus[]
  /** Role compliance data */
  roleCompliance?: RoleComplianceStatus[]
  /** Available roles for requirement scoping */
  roles: Role[]
  /** Location tree for requirement scoping */
  locations: LocationNode[]
  /** Loading state */
  isLoading?: boolean

  // Course CRUD
  onCourseCreate?: (data: CreateCourseFormData) => Promise<void>
  onCourseUpdate?: (data: EditCourseFormData) => Promise<void>
  onCourseDelete?: (courseId: string) => Promise<void>
  onCourseArchive?: (courseId: string) => Promise<void>

  // Package CRUD
  onPackageCreate?: (data: CreatePackageFormData) => Promise<void>
  onPackageUpdate?: (data: EditPackageFormData) => Promise<void>
  onPackageDelete?: (packageId: string) => Promise<void>

  // Requirement CRUD
  onRequirementCreate?: (data: CreateRequirementFormData) => Promise<void>
  onRequirementUpdate?: (requirementId: string, data: EditRequirementFormData) => Promise<void>
  onRequirementDelete?: (requirementId: string) => Promise<void>
  onRequirementToggle?: (requirementId: string, isActive: boolean) => Promise<void>
  onViewRequirement?: (requirementId: string) => void

  // Record management
  onRecordCompletion?: (data: RecordCompletionFormData) => Promise<void>
  onWaiveRequirement?: (data: WaiveRequirementFormData) => Promise<void>

  // Navigation
  onViewUser?: (userId: string) => void
  onViewCourse?: (courseId: string) => void
}

export interface MyTrainingTabProps {
  /** Current user ID */
  userId: string
  /** User's compliance status */
  complianceStatus: UserComplianceStatus
  /** User's training records */
  records: TrainingRecord[]
  /** Available courses for viewing */
  courses: TrainingCourse[]
  /** Loading state */
  isLoading?: boolean

  // Actions
  onStartTraining?: (courseId: string) => void
  onViewCertificate?: (recordId: string) => void
}

export interface CoursesTabProps {
  courses: TrainingCourse[]
  isLoading?: boolean
  onCourseCreate?: (data: CreateCourseFormData) => Promise<void>
  onCourseUpdate?: (data: EditCourseFormData) => Promise<void>
  onCourseDelete?: (courseId: string) => Promise<void>
  onCourseArchive?: (courseId: string) => Promise<void>
}

export interface RequirementsTabProps {
  requirements: TrainingRequirement[]
  courses: TrainingCourse[]
  packages: TrainingPackage[]
  roles: Role[]
  locations: LocationNode[]
  isLoading?: boolean
  onRequirementCreate?: (data: CreateRequirementFormData) => Promise<void>
  onRequirementUpdate?: (requirementId: string, data: EditRequirementFormData) => Promise<void>
  onRequirementDelete?: (requirementId: string) => Promise<void>
  onRequirementToggle?: (requirementId: string, isActive: boolean) => Promise<void>
  onViewRequirement?: (requirementId: string) => void
}

export interface ComplianceTabProps {
  stats?: TrainingStats
  userCompliance: UserComplianceStatus[]
  locationCompliance?: LocationComplianceStatus[]
  roleCompliance?: RoleComplianceStatus[]
  isLoading?: boolean
  onViewUser?: (userId: string) => void
  onRecordCompletion?: (data: RecordCompletionFormData) => Promise<void>
  onWaiveRequirement?: (data: WaiveRequirementFormData) => Promise<void>
}

// =============================================================================
// STATUS DISPLAY CONFIGS
// =============================================================================

export type BadgeVariant = 'success' | 'warning' | 'destructive' | 'secondary' | 'info' | 'outline'

export const TRAINING_RECORD_STATUS_CONFIG: Record<
  TrainingRecordStatus,
  { label: string; variant: BadgeVariant; icon: string }
> = {
  not_started: { label: 'Not Started', variant: 'secondary', icon: 'Circle' },
  in_progress: { label: 'In Progress', variant: 'info', icon: 'Clock' },
  completed: { label: 'Completed', variant: 'success', icon: 'CheckCircle' },
  expired: { label: 'Expired', variant: 'destructive', icon: 'AlertCircle' },
  failed: { label: 'Failed', variant: 'destructive', icon: 'XCircle' },
  waived: { label: 'Waived', variant: 'outline', icon: 'MinusCircle' },
}

export const COMPLIANCE_STATUS_CONFIG: Record<
  ComplianceStatus,
  { label: string; variant: BadgeVariant; icon: string; description: string }
> = {
  compliant: {
    label: 'Compliant',
    variant: 'success',
    icon: 'ShieldCheck',
    description: 'All required trainings are current',
  },
  expiring_soon: {
    label: 'Expiring Soon',
    variant: 'warning',
    icon: 'AlertTriangle',
    description: 'One or more trainings expiring within 30 days',
  },
  non_compliant: {
    label: 'Non-Compliant',
    variant: 'destructive',
    icon: 'ShieldX',
    description: 'Required trainings missing or expired',
  },
  not_applicable: {
    label: 'N/A',
    variant: 'outline',
    icon: 'Minus',
    description: 'No training requirements apply',
  },
}

export const COURSE_STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  active: { label: 'Active', variant: 'success' },
  archived: { label: 'Archived', variant: 'outline' },
}

export const COURSE_CATEGORY_CONFIG: Record<
  CourseCategory,
  { label: string; icon: string; color: string }
> = {
  safety: { label: 'Safety', icon: 'Shield', color: 'text-success' },
  compliance: { label: 'Compliance', icon: 'FileCheck', color: 'text-info' },
  certification: { label: 'Certification', icon: 'Award', color: 'text-warning' },
  emergency: { label: 'Emergency', icon: 'Siren', color: 'text-destructive' },
  equipment: { label: 'Equipment', icon: 'Wrench', color: 'text-secondary' },
  environmental: { label: 'Environmental', icon: 'Leaf', color: 'text-success' },
  onboarding: { label: 'Onboarding', icon: 'UserPlus', color: 'text-info' },
  skills: { label: 'Skills', icon: 'Lightbulb', color: 'text-warning' },
}

export const DELIVERY_METHOD_CONFIG: Record<
  DeliveryMethod,
  { label: string; icon: string; description: string }
> = {
  online: { label: 'Online', icon: 'Monitor', description: 'Self-paced e-learning' },
  instructor_led: { label: 'Instructor-Led', icon: 'Users', description: 'In-person classroom' },
  virtual: { label: 'Virtual', icon: 'Video', description: 'Live virtual/webinar' },
  on_the_job: { label: 'On-the-Job', icon: 'Briefcase', description: 'Supervised practical' },
  blended: { label: 'Blended', icon: 'Layers', description: 'Combined methods' },
  external: { label: 'External', icon: 'ExternalLink', description: 'Third-party provider' },
}

export const REQUIREMENT_SCOPE_CONFIG: Record<
  RequirementScopeType,
  { label: string; icon: string; description: string }
> = {
  role: { label: 'By Role', icon: 'Shield', description: 'Required for specific roles' },
  location: { label: 'By Location', icon: 'MapPin', description: 'Required at specific locations' },
  package: { label: 'Package', icon: 'Package', description: 'Part of training package' },
  all: { label: 'All Users', icon: 'Users', description: 'Required for everyone' },
}

export const REQUIREMENT_PRIORITY_CONFIG: Record<
  'critical' | 'high' | 'medium' | 'low',
  { label: string; variant: BadgeVariant }
> = {
  critical: { label: 'Critical', variant: 'destructive' },
  high: { label: 'High', variant: 'warning' },
  medium: { label: 'Medium', variant: 'info' },
  low: { label: 'Low', variant: 'secondary' },
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Training status for DirectoryPerson integration
 */
export interface DirectoryTrainingStatus {
  complianceStatus: ComplianceStatus
  totalRequired: number
  completed: number
  overdue: number
  expiringSoon: number
  nextExpiration?: {
    courseName: string
    daysUntil: number
  }
}
