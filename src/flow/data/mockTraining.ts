/**
 * Mock Training Data - Disrupt Flow App
 *
 * SINGLE SOURCE OF TRUTH for training data used across:
 * - Training Management page
 * - Organization Directory (compliance badges)
 * - User profiles (training tab)
 * - Flow stories
 *
 * Contains:
 * - 12 EHS-specific training courses
 * - 4 training packages
 * - 8 training requirements
 * - Training records distributed across 58 users with realistic compliance distribution
 */

import type {
  TrainingCourse,
  TrainingPackage,
  TrainingRequirement,
  TrainingRecord,
  TrainingStats,
  UserComplianceStatus,
  ComplianceStatus,
  TrainingRecordStatus,
  DirectoryTrainingStatus,
} from '../components/training/types'
import { mockRoles } from './mockRoles'

// =============================================================================
// TRAINING COURSES
// =============================================================================

export const mockTrainingCourses: TrainingCourse[] = [
  {
    id: 'course-osha30',
    code: 'OSHA-30',
    name: 'OSHA 30-Hour General Industry',
    description: 'Comprehensive safety training covering all major OSHA standards for general industry workers. Includes hazard recognition, avoidance, and prevention.',
    category: 'certification',
    status: 'active',
    deliveryMethod: 'blended',
    durationMinutes: 1800, // 30 hours
    validityMonths: null, // Never expires
    expirationWarningDays: 0,
    isSystem: true,
    provider: 'OSHA',
    passingScore: 70,
    tags: ['osha', 'safety', 'general-industry'],
    assignedCount: 24,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-osha10',
    code: 'OSHA-10',
    name: 'OSHA 10-Hour Construction',
    description: 'Entry-level construction safety training covering key OSHA standards and safe work practices.',
    category: 'certification',
    status: 'active',
    deliveryMethod: 'online',
    durationMinutes: 600, // 10 hours
    validityMonths: null, // Never expires
    expirationWarningDays: 0,
    isSystem: true,
    provider: 'OSHA',
    passingScore: 70,
    tags: ['osha', 'safety', 'construction'],
    assignedCount: 18,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-fire',
    code: 'FIRE-01',
    name: 'Fire Safety & Prevention',
    description: 'Training on fire hazards, prevention measures, emergency procedures, and proper use of fire extinguishers.',
    category: 'safety',
    status: 'active',
    deliveryMethod: 'instructor_led',
    durationMinutes: 120, // 2 hours
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['fire', 'emergency', 'safety'],
    assignedCount: 58, // All users
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-cpr',
    code: 'FA-CPR',
    name: 'First Aid & CPR',
    description: 'American Red Cross certified training in first aid response, CPR, and AED use for workplace emergencies.',
    category: 'certification',
    status: 'active',
    deliveryMethod: 'instructor_led',
    durationMinutes: 480, // 8 hours
    validityMonths: 24, // Every 2 years
    expirationWarningDays: 60,
    isSystem: true,
    provider: 'American Red Cross',
    passingScore: 80,
    tags: ['first-aid', 'cpr', 'emergency', 'certification'],
    assignedCount: 35,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-forklift',
    code: 'FORKLIFT',
    name: 'Forklift Operator Certification',
    description: 'OSHA-compliant training for powered industrial truck operators including classroom and practical evaluation.',
    category: 'certification',
    status: 'active',
    deliveryMethod: 'on_the_job',
    durationMinutes: 480, // 8 hours
    validityMonths: 36, // Every 3 years
    expirationWarningDays: 90,
    isSystem: true,
    passingScore: 100, // Must pass practical
    tags: ['forklift', 'equipment', 'certification'],
    assignedCount: 22,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-hazcom',
    code: 'HAZCOM',
    name: 'Hazard Communication (GHS)',
    description: 'Training on the Globally Harmonized System for chemical hazard classification, labeling, and safety data sheets.',
    category: 'compliance',
    status: 'active',
    deliveryMethod: 'online',
    durationMinutes: 60, // 1 hour
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['hazcom', 'chemicals', 'ghs', 'compliance'],
    assignedCount: 58,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-ppe',
    code: 'PPE-01',
    name: 'Personal Protective Equipment',
    description: 'Proper selection, use, and maintenance of personal protective equipment including respirators, gloves, and eye protection.',
    category: 'safety',
    status: 'active',
    deliveryMethod: 'online',
    durationMinutes: 45, // 45 min
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['ppe', 'safety', 'equipment'],
    assignedCount: 58,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-confined',
    code: 'CONFINE',
    name: 'Confined Space Entry',
    description: 'Training for permit-required confined space entry including hazard recognition, atmospheric testing, and rescue procedures.',
    category: 'certification',
    status: 'active',
    deliveryMethod: 'blended',
    durationMinutes: 240, // 4 hours
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['confined-space', 'permit', 'certification'],
    assignedCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-loto',
    code: 'LOTO',
    name: 'Lockout/Tagout (LOTO)',
    description: 'Training on the control of hazardous energy during service and maintenance of machines and equipment.',
    category: 'compliance',
    status: 'active',
    deliveryMethod: 'instructor_led',
    durationMinutes: 120, // 2 hours
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['loto', 'energy', 'maintenance', 'compliance'],
    assignedCount: 28,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-fall',
    code: 'FALL',
    name: 'Fall Protection',
    description: 'Training on fall hazards, protection systems, equipment inspection, and safe work practices at height.',
    category: 'safety',
    status: 'active',
    deliveryMethod: 'instructor_led',
    durationMinutes: 180, // 3 hours
    validityMonths: 12, // Annual
    expirationWarningDays: 30,
    isSystem: true,
    passingScore: 80,
    tags: ['fall', 'height', 'safety'],
    assignedCount: 35,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-hazmat',
    code: 'HAZMAT',
    name: 'Hazardous Materials Handling',
    description: 'DOT hazmat training for employees who handle, store, or transport hazardous materials.',
    category: 'environmental',
    status: 'active',
    deliveryMethod: 'blended',
    durationMinutes: 480, // 8 hours
    validityMonths: 36, // Every 3 years
    expirationWarningDays: 90,
    isSystem: true,
    passingScore: 80,
    tags: ['hazmat', 'chemicals', 'transport', 'environmental'],
    assignedCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-onboard',
    code: 'ORIENT',
    name: 'New Employee Safety Orientation',
    description: 'General safety orientation for all new employees covering company policies, emergency procedures, and basic safety rules.',
    category: 'onboarding',
    status: 'active',
    deliveryMethod: 'instructor_led',
    durationMinutes: 120, // 2 hours
    validityMonths: null, // One-time
    expirationWarningDays: 0,
    isSystem: true,
    tags: ['orientation', 'onboarding', 'new-hire'],
    assignedCount: 58,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// =============================================================================
// TRAINING PACKAGES
// =============================================================================

export const mockTrainingPackages: TrainingPackage[] = [
  {
    id: 'pkg-basic',
    code: 'PKG-BASIC',
    name: 'Basic Safety Package',
    description: 'Essential safety training required for all employees. Covers fire safety, hazard communication, and PPE basics.',
    status: 'active',
    isSystem: true,
    courseIds: ['course-fire', 'course-hazcom', 'course-ppe', 'course-onboard'],
    courses: [
      { id: 'course-fire', code: 'FIRE-01', name: 'Fire Safety & Prevention', category: 'safety', durationMinutes: 120 },
      { id: 'course-hazcom', code: 'HAZCOM', name: 'Hazard Communication (GHS)', category: 'compliance', durationMinutes: 60 },
      { id: 'course-ppe', code: 'PPE-01', name: 'Personal Protective Equipment', category: 'safety', durationMinutes: 45 },
      { id: 'course-onboard', code: 'ORIENT', name: 'New Employee Safety Orientation', category: 'onboarding', durationMinutes: 120 },
    ],
    totalDurationMinutes: 345,
    assignedCount: 58,
    tags: ['essential', 'all-employees'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pkg-field',
    code: 'PKG-FIELD',
    name: 'Field Worker Package',
    description: 'Training package for field workers and frontline employees including first aid and fall protection.',
    status: 'active',
    isSystem: true,
    courseIds: ['course-fire', 'course-hazcom', 'course-ppe', 'course-cpr', 'course-fall'],
    courses: [
      { id: 'course-fire', code: 'FIRE-01', name: 'Fire Safety & Prevention', category: 'safety', durationMinutes: 120 },
      { id: 'course-hazcom', code: 'HAZCOM', name: 'Hazard Communication (GHS)', category: 'compliance', durationMinutes: 60 },
      { id: 'course-ppe', code: 'PPE-01', name: 'Personal Protective Equipment', category: 'safety', durationMinutes: 45 },
      { id: 'course-cpr', code: 'FA-CPR', name: 'First Aid & CPR', category: 'certification', durationMinutes: 480 },
      { id: 'course-fall', code: 'FALL', name: 'Fall Protection', category: 'safety', durationMinutes: 180 },
    ],
    totalDurationMinutes: 885,
    assignedCount: 35,
    tags: ['field-worker', 'frontline'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pkg-equipment',
    code: 'PKG-EQUIP',
    name: 'Equipment Operator Package',
    description: 'Training for employees who operate machinery and work in maintenance areas.',
    status: 'active',
    isSystem: true,
    courseIds: ['course-forklift', 'course-loto', 'course-confined'],
    courses: [
      { id: 'course-forklift', code: 'FORKLIFT', name: 'Forklift Operator Certification', category: 'certification', durationMinutes: 480 },
      { id: 'course-loto', code: 'LOTO', name: 'Lockout/Tagout (LOTO)', category: 'compliance', durationMinutes: 120 },
      { id: 'course-confined', code: 'CONFINE', name: 'Confined Space Entry', category: 'certification', durationMinutes: 240 },
    ],
    totalDurationMinutes: 840,
    assignedCount: 22,
    tags: ['equipment', 'maintenance', 'operators'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pkg-management',
    code: 'PKG-MGMT',
    name: 'Management Safety Package',
    description: 'Comprehensive safety training for managers and supervisors including OSHA 30-hour certification.',
    status: 'active',
    isSystem: true,
    courseIds: ['course-osha30', 'course-cpr', 'course-fire', 'course-hazcom'],
    courses: [
      { id: 'course-osha30', code: 'OSHA-30', name: 'OSHA 30-Hour General Industry', category: 'certification', durationMinutes: 1800 },
      { id: 'course-cpr', code: 'FA-CPR', name: 'First Aid & CPR', category: 'certification', durationMinutes: 480 },
      { id: 'course-fire', code: 'FIRE-01', name: 'Fire Safety & Prevention', category: 'safety', durationMinutes: 120 },
      { id: 'course-hazcom', code: 'HAZCOM', name: 'Hazard Communication (GHS)', category: 'compliance', durationMinutes: 60 },
    ],
    totalDurationMinutes: 2460,
    assignedCount: 11,
    tags: ['management', 'supervisor', 'leadership'],
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// =============================================================================
// TRAINING REQUIREMENTS
// =============================================================================

export const mockTrainingRequirements: TrainingRequirement[] = [
  {
    id: 'req-all-basic',
    name: 'Basic Safety - All Employees',
    description: 'All employees must complete the Basic Safety Package within 30 days of hire.',
    scopeType: 'all',
    packageId: 'pkg-basic',
    package: { id: 'pkg-basic', code: 'PKG-BASIC', name: 'Basic Safety Package', courseIds: ['course-fire', 'course-hazcom', 'course-ppe', 'course-onboard'] },
    isActive: true,
    gracePeriodDays: 30,
    priority: 'critical',
    effectiveDate: '2024-01-01',
    affectedUsers: 58,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-field-workers',
    name: 'Field Worker Training',
    description: 'All Field Workers (Level 4 roles) must complete the Field Worker Package.',
    scopeType: 'role',
    packageId: 'pkg-field',
    package: { id: 'pkg-field', code: 'PKG-FIELD', name: 'Field Worker Package', courseIds: ['course-fire', 'course-hazcom', 'course-ppe', 'course-cpr', 'course-fall'] },
    roleIds: ['role-reporter'],
    roles: [{ id: 'role-reporter', name: 'Reporter', level: 4 }],
    isActive: true,
    gracePeriodDays: 60,
    priority: 'high',
    effectiveDate: '2024-01-01',
    affectedUsers: 35,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-management',
    name: 'Management Safety Training',
    description: 'Managers and above must complete the Management Safety Package.',
    scopeType: 'role',
    packageId: 'pkg-management',
    package: { id: 'pkg-management', code: 'PKG-MGMT', name: 'Management Safety Package', courseIds: ['course-osha30', 'course-cpr', 'course-fire', 'course-hazcom'] },
    roleIds: ['role-admin', 'role-manager'],
    roles: [
      { id: 'role-admin', name: 'Administrator', level: 1 },
      { id: 'role-manager', name: 'EHS Manager', level: 2 },
    ],
    isActive: true,
    gracePeriodDays: 90,
    priority: 'high',
    effectiveDate: '2024-01-01',
    affectedUsers: 11,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-investigators',
    name: 'Investigator Certification',
    description: 'Investigators must have OSHA 10-Hour certification and First Aid/CPR.',
    scopeType: 'role',
    courseId: 'course-osha10',
    course: { id: 'course-osha10', code: 'OSHA-10', name: 'OSHA 10-Hour Construction', category: 'certification' },
    roleIds: ['role-investigator'],
    roles: [{ id: 'role-investigator', name: 'Investigator', level: 3 }],
    isActive: true,
    gracePeriodDays: 60,
    priority: 'high',
    effectiveDate: '2024-01-01',
    affectedUsers: 15,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-forklift-ops',
    name: 'Forklift Operator Certification',
    description: 'Employees operating forklifts must be certified.',
    scopeType: 'role',
    courseId: 'course-forklift',
    course: { id: 'course-forklift', code: 'FORKLIFT', name: 'Forklift Operator Certification', category: 'certification' },
    roleIds: ['role-reporter'],
    roles: [{ id: 'role-reporter', name: 'Reporter', level: 4 }],
    isActive: true,
    gracePeriodDays: 14,
    priority: 'critical',
    effectiveDate: '2024-01-01',
    affectedUsers: 22,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-confined-space',
    name: 'Confined Space Entry',
    description: 'Workers entering confined spaces must complete certification.',
    scopeType: 'location',
    courseId: 'course-confined',
    course: { id: 'course-confined', code: 'CONFINE', name: 'Confined Space Entry', category: 'certification' },
    locationIds: ['loc-plant-a', 'loc-plant-b'],
    includeChildLocations: true,
    locationNames: ['Plant A - Chicago', 'Plant B - Detroit'],
    isActive: true,
    gracePeriodDays: 30,
    priority: 'high',
    effectiveDate: '2024-01-01',
    affectedUsers: 15,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-hazmat',
    name: 'Hazmat Handling Certification',
    description: 'Employees handling hazardous materials must be certified.',
    scopeType: 'location',
    courseId: 'course-hazmat',
    course: { id: 'course-hazmat', code: 'HAZMAT', name: 'Hazardous Materials Handling', category: 'environmental' },
    locationIds: ['loc-warehouse'],
    includeChildLocations: true,
    locationNames: ['Warehouse'],
    isActive: true,
    gracePeriodDays: 30,
    priority: 'critical',
    effectiveDate: '2024-01-01',
    affectedUsers: 12,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'req-equipment-ops',
    name: 'Equipment Operator Package',
    description: 'Equipment operators must complete full operator training package.',
    scopeType: 'package',
    packageId: 'pkg-equipment',
    package: { id: 'pkg-equipment', code: 'PKG-EQUIP', name: 'Equipment Operator Package', courseIds: ['course-forklift', 'course-loto', 'course-confined'] },
    isActive: true,
    gracePeriodDays: 90,
    priority: 'high',
    effectiveDate: '2024-01-01',
    affectedUsers: 22,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// =============================================================================
// TRAINING RECORDS GENERATOR
// =============================================================================

/**
 * Generate training records for users with realistic distribution:
 * - 70% fully compliant
 * - 15% expiring soon (within 30 days)
 * - 10% non-compliant (overdue/missing)
 * - 5% in progress
 */
function generateTrainingRecords(): TrainingRecord[] {
  const records: TrainingRecord[] = []
  const now = new Date()

  // User IDs (we'll generate records for first 30 users to keep it manageable)
  const userIds = Array.from({ length: 30 }, (_, i) => `user-${i + 1}`)

  // Distribution: compliant, expiring, non-compliant, in-progress
  const distribution = {
    compliant: 21, // 70% of 30
    expiringSoon: 5, // ~15%
    nonCompliant: 3, // 10%
    inProgress: 1, // 5%
  }

  userIds.forEach((userId, idx) => {
    let statusType: 'compliant' | 'expiringSoon' | 'nonCompliant' | 'inProgress'

    if (idx < distribution.compliant) {
      statusType = 'compliant'
    } else if (idx < distribution.compliant + distribution.expiringSoon) {
      statusType = 'expiringSoon'
    } else if (idx < distribution.compliant + distribution.expiringSoon + distribution.nonCompliant) {
      statusType = 'nonCompliant'
    } else {
      statusType = 'inProgress'
    }

    // All users need Basic Safety Package
    const basicCourses = ['course-fire', 'course-hazcom', 'course-ppe', 'course-onboard']

    basicCourses.forEach((courseId, courseIdx) => {
      const course = mockTrainingCourses.find((c) => c.id === courseId)!
      const record: TrainingRecord = {
        id: `record-${userId}-${courseId}`,
        userId,
        courseId,
        course: { id: course.id, code: course.code, name: course.name, validityMonths: course.validityMonths },
        requirementId: 'req-all-basic',
        status: 'completed',
        assignedAt: '2024-01-15T00:00:00Z',
        completedAt: getCompletionDate(statusType, courseIdx, now),
        expiresAt: getExpirationDate(statusType, course.validityMonths, now),
        score: 85 + Math.floor(Math.random() * 15),
        certificateNumber: `CERT-${course.code}-${userId.split('-')[1].padStart(3, '0')}`,
        createdAt: '2024-01-15T00:00:00Z',
      }

      // Adjust status based on distribution type
      if (statusType === 'nonCompliant' && courseIdx === 0) {
        record.status = 'expired'
        record.expiresAt = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
      } else if (statusType === 'inProgress' && courseIdx === 0) {
        record.status = 'in_progress'
        record.completedAt = undefined
        record.expiresAt = undefined
        record.score = undefined
        record.certificateNumber = undefined
      }

      records.push(record)
    })
  })

  return records
}

function getCompletionDate(statusType: string, offset: number, now: Date): string {
  const date = new Date(now)
  if (statusType === 'compliant') {
    date.setMonth(date.getMonth() - 3 - offset) // 3-6 months ago
  } else if (statusType === 'expiringSoon') {
    date.setMonth(date.getMonth() - 11) // 11 months ago (expiring in 1 month)
  } else {
    date.setMonth(date.getMonth() - 15) // 15 months ago (expired)
  }
  return date.toISOString()
}

function getExpirationDate(statusType: string, validityMonths: number | null, now: Date): string | undefined {
  if (!validityMonths) return undefined

  const date = new Date(now)
  if (statusType === 'compliant') {
    date.setMonth(date.getMonth() + 9) // 9 months from now
  } else if (statusType === 'expiringSoon') {
    date.setDate(date.getDate() + 20) // 20 days from now
  } else {
    date.setMonth(date.getMonth() - 3) // 3 months ago (expired)
  }
  return date.toISOString()
}

export const mockTrainingRecords: TrainingRecord[] = generateTrainingRecords()

// =============================================================================
// COMPLIANCE STATUS GENERATOR
// =============================================================================

/**
 * Generate compliance status for all users
 */
export function generateUserCompliance(): UserComplianceStatus[] {
  const compliance: UserComplianceStatus[] = []

  // Generate for first 30 users
  for (let i = 1; i <= 30; i++) {
    const userId = `user-${i}`
    const userRecords = mockTrainingRecords.filter((r) => r.userId === userId)

    const completed = userRecords.filter((r) => r.status === 'completed').length
    const expired = userRecords.filter((r) => r.status === 'expired').length
    const expiring = userRecords.filter((r) => {
      if (r.status !== 'completed' || !r.expiresAt) return false
      const daysUntil = Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntil > 0 && daysUntil <= 30
    }).length
    const inProgress = userRecords.filter((r) => r.status === 'in_progress').length

    const total = 4 // Basic package has 4 courses
    const nonCompliant = expired + (total - completed - inProgress)

    let overallStatus: ComplianceStatus = 'compliant'
    if (nonCompliant > 0) {
      overallStatus = 'non_compliant'
    } else if (expiring > 0) {
      overallStatus = 'expiring_soon'
    }

    // Find next expiration
    const nextExpiring = userRecords
      .filter((r) => r.status === 'completed' && r.expiresAt)
      .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime())[0]

    compliance.push({
      userId,
      overallStatus,
      compliantCount: completed,
      expiringSoonCount: expiring,
      nonCompliantCount: nonCompliant,
      totalRequired: total,
      compliancePercentage: Math.round((completed / total) * 100),
      nextExpirationDate: nextExpiring?.expiresAt ?? undefined,
      nextExpiringCourseName: nextExpiring?.course?.name,
    })
  }

  return compliance
}

export const mockUserCompliance: UserComplianceStatus[] = generateUserCompliance()

// =============================================================================
// TRAINING STATS
// =============================================================================

export const mockTrainingStats: TrainingStats = {
  totalCourses: mockTrainingCourses.length,
  activeCourses: mockTrainingCourses.filter((c) => c.status === 'active').length,
  totalPackages: mockTrainingPackages.length,
  activePackages: mockTrainingPackages.filter((p) => p.status === 'active').length,
  totalRequirements: mockTrainingRequirements.length,
  activeRequirements: mockTrainingRequirements.filter((r) => r.isActive).length,
  compliance: {
    totalUsers: 58,
    compliantUsers: 42,
    expiringSoonUsers: 8,
    nonCompliantUsers: 8,
    overallPercentage: 72,
  },
  upcomingExpirations: 8,
  completedThisMonth: 24,
  hoursCompletedThisMonth: 156,
  trend: {
    direction: 'up',
    percentage: 5,
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get course by ID
 */
export function getCourseById(courseId: string): TrainingCourse | undefined {
  return mockTrainingCourses.find((c) => c.id === courseId)
}

/**
 * Get package by ID
 */
export function getPackageById(packageId: string): TrainingPackage | undefined {
  return mockTrainingPackages.find((p) => p.id === packageId)
}

/**
 * Get requirement by ID
 */
export function getRequirementById(requirementId: string): TrainingRequirement | undefined {
  return mockTrainingRequirements.find((r) => r.id === requirementId)
}

/**
 * Get training records for a user
 */
export function getRecordsForUser(userId: string): TrainingRecord[] {
  return mockTrainingRecords.filter((r) => r.userId === userId)
}

/**
 * Get compliance status for a user
 */
export function getComplianceForUser(userId: string): UserComplianceStatus | undefined {
  return mockUserCompliance.find((c) => c.userId === userId)
}

/**
 * Get training status for DirectoryPerson integration
 */
export function getDirectoryTrainingStatus(userId: string): DirectoryTrainingStatus | undefined {
  const compliance = getComplianceForUser(userId)
  if (!compliance) return undefined

  const expiringSoon = mockTrainingRecords.filter((r) => {
    if (r.userId !== userId || r.status !== 'completed' || !r.expiresAt) return false
    const daysUntil = Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntil > 0 && daysUntil <= 30
  })

  const nextExpiring = expiringSoon.sort(
    (a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime()
  )[0]

  return {
    complianceStatus: compliance.overallStatus,
    totalRequired: compliance.totalRequired,
    completed: compliance.compliantCount,
    overdue: compliance.nonCompliantCount,
    expiringSoon: compliance.expiringSoonCount,
    nextExpiration: nextExpiring
      ? {
          courseName: nextExpiring.course?.name || 'Unknown',
          daysUntil: Math.ceil((new Date(nextExpiring.expiresAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        }
      : undefined,
  }
}

/**
 * Get courses by category
 */
export function getCoursesByCategory(category: TrainingCourse['category']): TrainingCourse[] {
  return mockTrainingCourses.filter((c) => c.category === category)
}

/**
 * Get requirements by scope type
 */
export function getRequirementsByScopeType(scopeType: TrainingRequirement['scopeType']): TrainingRequirement[] {
  return mockTrainingRequirements.filter((r) => r.scopeType === scopeType)
}
