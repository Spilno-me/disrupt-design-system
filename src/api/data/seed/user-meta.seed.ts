/**
 * User Metadata Seed Data
 *
 * Mock data for user statistics, departments, job titles, and activity logs.
 * Used in user management and admin dashboards.
 */

import type { UserStats, UserActivity, LocationNode } from '../../../flow/components/users'

/**
 * User statistics for admin dashboard
 */
export const seedUserStats: UserStats = {
  totalUsers: 218,
  activeUsers: 182,
  pendingInvites: 18,
  roleDistribution: [
    { roleName: 'Administrator', count: 3, percentage: 1.8 },
    { roleName: 'EHS Manager', count: 8, percentage: 4.8 },
    { roleName: 'Investigator', count: 15, percentage: 8.9 },
    { roleName: 'Reporter', count: 142, percentage: 84.5 },
  ],
  // Admin-actionable metrics (EHS context)
  lockedAccounts: 2,
  inactiveUsers: 14,
  twoFactorPercentage: 67,
  failedLogins24h: 5,
  expiringCertifications: 8,
}

/**
 * Available departments for user assignment
 */
export const seedDepartments: string[] = [
  'Environmental Health & Safety',
  'Operations',
  'Logistics',
  'Human Resources',
  'Facilities',
  'Quality Assurance',
  'Engineering',
  'Administration',
]

/**
 * Available job titles for user assignment
 * Organized by department/function
 */
export const seedJobTitles: string[] = [
  // EHS Leadership
  'EHS Director',
  'Safety Manager',
  'Plant Manager',
  'Warehouse Manager',
  // EHS Specialists
  'Safety Inspector',
  'Incident Investigator',
  'Safety Coordinator',
  'Environmental Compliance Officer',
  'Industrial Hygienist',
  'Safety Training Specialist',
  'Environmental Engineer',
  'Risk Assessment Analyst',
  'Hazmat Technician',
  'Fire Safety Officer',
  'Ergonomics Specialist',
  'Compliance Auditor',
  'Emergency Response Coordinator',
  'Radiation Safety Officer',
  'Noise & Vibration Specialist',
  'Fall Protection Specialist',
  'Respiratory Protection Administrator',
  'Accident Investigation Specialist',
  'Electrical Safety Specialist',
  'Biosafety Officer',
  'Confined Space Entry Supervisor',
  'Lockout/Tagout Coordinator',
  'Machine Guarding Specialist',
  'Hazard Communication Coordinator',
  'Bloodborne Pathogen Coordinator',
  'PPE Coordinator',
  // Operations & Field
  'Field Safety Coordinator',
  'Production Supervisor',
  'Maintenance Supervisor',
  'Shipping Coordinator',
  'Forklift Operator',
  'Crane Operator',
  'Machine Operator',
  'Welder',
  'Assembly Line Worker',
  'Rigger',
  'Tool Crib Attendant',
  'Inventory Specialist',
  'Material Handler',
  'Dock Worker',
  'Chemical Handler',
  // Facilities
  'Maintenance Technician',
  'HVAC Technician',
  'Electrician',
  'Plumber',
  'Painter',
  'Boiler Operator',
  'Groundskeeper',
  // Support
  'HR Manager',
  'Occupational Health Nurse',
  'Quality Analyst',
  'Quality Control Inspector',
  'Security Guard',
  'Workplace Violence Prevention Coordinator',
]

/**
 * User activity log entries
 */
export const seedUserActivities: UserActivity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    type: 'login',
    title: 'Logged in',
    timestamp: '2025-01-10T08:30:00Z',
    performedBy: { id: 'user-1', name: 'John Smith' },
  },
  {
    id: 'act-2',
    userId: 'user-1',
    type: 'role_assigned',
    title: 'Administrator role assigned',
    details: 'Granted full system access',
    timestamp: '2024-01-15T10:00:00Z',
    performedBy: { id: 'system', name: 'System' },
  },
  {
    id: 'act-3',
    userId: 'user-1',
    type: 'created',
    title: 'Account created',
    timestamp: '2024-01-15T10:00:00Z',
    performedBy: { id: 'system', name: 'System' },
  },
]

/**
 * Location tree for user assignment
 * Hierarchical structure of organizational locations
 */
export const seedLocationTree: LocationNode[] = [
  {
    id: 'loc-corp',
    label: 'Corporate HQ',
    level: 0,
    children: [
      {
        id: 'loc-plant-a',
        label: 'Plant A - Chicago',
        level: 1,
        children: [
          { id: 'loc-warehouse-1', label: 'Warehouse 1', level: 2 },
          { id: 'loc-warehouse-2', label: 'Warehouse 2', level: 2 },
          { id: 'loc-office-a', label: 'Office Building A', level: 2 },
        ],
      },
      {
        id: 'loc-plant-b',
        label: 'Plant B - Detroit',
        level: 1,
        children: [
          { id: 'loc-production-1', label: 'Production Floor 1', level: 2 },
          { id: 'loc-production-2', label: 'Production Floor 2', level: 2 },
        ],
      },
    ],
  },
  {
    id: 'loc-west',
    label: 'West Region',
    level: 0,
    children: [
      {
        id: 'loc-plant-c',
        label: 'Plant C - Phoenix',
        level: 1,
        children: [
          { id: 'loc-assembly', label: 'Assembly Building', level: 2 },
        ],
      },
    ],
  },
]

/**
 * Get activities for a specific user
 */
export function getUserActivities(userId: string): UserActivity[] {
  return seedUserActivities.filter((a) => a.userId === userId)
}

/**
 * Get activities by type
 */
export function getActivitiesByType(
  type: 'login' | 'role_assigned' | 'created' | 'updated' | 'deleted'
): UserActivity[] {
  return seedUserActivities.filter((a) => a.type === type)
}

/**
 * Flatten location tree to array
 */
export function flattenLocationTree(nodes: LocationNode[]): LocationNode[] {
  const result: LocationNode[] = []
  const traverse = (node: LocationNode) => {
    result.push(node)
    node.children?.forEach(traverse)
  }
  nodes.forEach(traverse)
  return result
}

/**
 * Get location by ID from tree
 */
export function getLocationById(id: string): LocationNode | undefined {
  const flat = flattenLocationTree(seedLocationTree)
  return flat.find((loc) => loc.id === id)
}
