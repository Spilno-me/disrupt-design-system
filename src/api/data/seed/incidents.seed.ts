/**
 * Incident Seed Data
 *
 * Centralized incident mock data for API simulation.
 * Previously scattered across story files, now consolidated here.
 */

import type { Incident, IncidentType } from '../../types/incident.types'

/**
 * Seed incidents covering all severities, statuses, and types
 */
export const seedIncidents: Incident[] = [
  // ==========================================================================
  // CRITICAL INCIDENTS
  // ==========================================================================
  {
    id: 'inc-001',
    incidentId: 'INC-2025-0847',
    title: 'Chemical spill in storage area',
    description: 'A 50-gallon drum of sulfuric acid was punctured during forklift operations, resulting in a significant spill in the raw materials section. Immediate evacuation of the area was initiated. Emergency response team deployed spill containment barriers and neutralizing agents.',
    status: 'investigation',
    severity: 'critical',
    type: 'chemical',
    locationId: 'loc-wh-raw',
    locationName: 'Raw Materials Section',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-4',
    reporterName: 'David Kim',
    assigneeId: 'user-3',
    assigneeName: 'Mike Chen',
    occurredAt: '2025-12-23T08:15:00Z',
    createdAt: '2025-12-23T08:30:00Z',
    updatedAt: '2025-12-24T14:00:00Z',
    stepsTotal: 5,
    stepsCompleted: 2,
    documentsCount: 4,
    daysOpen: 2,
    isOverdue: false,
  },
  {
    id: 'inc-002',
    incidentId: 'INC-2025-0851',
    title: 'Fire alarm triggered in production area',
    description: 'Smoke detector activated in Production Floor A near welding station. Fire suppression system activated automatically. All personnel evacuated per emergency protocol. Fire marshal notified and en route.',
    status: 'review',
    severity: 'critical',
    type: 'fire',
    locationId: 'loc-assembly-zone-a',
    locationName: 'Assembly Zone A',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-11',
    reporterName: 'Emma Rodriguez',
    assigneeId: 'user-2',
    assigneeName: 'Sarah Johnson',
    occurredAt: '2025-12-22T14:45:00Z',
    createdAt: '2025-12-22T14:50:00Z',
    updatedAt: '2025-12-24T10:00:00Z',
    stepsTotal: 4,
    stepsCompleted: 3,
    documentsCount: 6,
    daysOpen: 3,
    isOverdue: false,
  },

  // ==========================================================================
  // HIGH SEVERITY INCIDENTS
  // ==========================================================================
  {
    id: 'inc-003',
    incidentId: 'INC-2025-0839',
    title: 'Forklift collision with storage rack',
    description: 'Forklift FL-001 collided with storage rack B-12 in Warehouse 1, causing partial collapse of the rack structure. Driver reported brake malfunction. No injuries but significant property damage.',
    status: 'investigation',
    severity: 'high',
    type: 'equipment',
    locationId: 'loc-wh-raw',
    locationName: 'Raw Materials Section',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-8',
    reporterName: 'James Thompson',
    assigneeId: 'user-3',
    assigneeName: 'Mike Chen',
    occurredAt: '2025-12-20T11:30:00Z',
    createdAt: '2025-12-20T11:45:00Z',
    updatedAt: '2025-12-23T16:00:00Z',
    stepsTotal: 6,
    stepsCompleted: 2,
    documentsCount: 8,
    daysOpen: 5,
    isOverdue: true,
  },
  {
    id: 'inc-004',
    incidentId: 'INC-2025-0855',
    title: 'Electrical arc flash near panel B',
    description: 'Arc flash incident occurred during routine electrical maintenance. Maintenance worker was wearing appropriate PPE and suffered minor burns. Panel B requires inspection and possible replacement.',
    status: 'reported',
    severity: 'high',
    type: 'equipment',
    locationId: 'loc-production-floor-a',
    locationName: 'Production Floor A',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-9',
    reporterName: 'Lisa Wang',
    assigneeId: 'user-2',
    assigneeName: 'Sarah Johnson',
    occurredAt: '2025-12-21T09:15:00Z',
    createdAt: '2025-12-21T09:30:00Z',
    updatedAt: '2025-12-21T10:00:00Z',
    stepsTotal: 5,
    stepsCompleted: 0,
    documentsCount: 2,
    daysOpen: 4,
    isOverdue: false,
  },

  // ==========================================================================
  // MEDIUM SEVERITY INCIDENTS
  // ==========================================================================
  {
    id: 'inc-005',
    incidentId: 'INC-2025-0862',
    title: 'Slip and fall in break room',
    description: 'Employee slipped on wet floor near ice machine in the break room. Sustained minor ankle sprain. Floor was wet due to leaking ice machine that had not been reported.',
    status: 'investigation',
    severity: 'medium',
    type: 'injury',
    locationId: 'loc-admin-floor-1',
    locationName: 'Floor 1 - Reception',
    facilityName: 'Corporate HQ',
    reporterId: 'user-7',
    reporterName: 'Robert Martinez',
    assigneeId: 'user-10',
    assigneeName: 'Jennifer Wilson',
    occurredAt: '2025-12-22T12:30:00Z',
    createdAt: '2025-12-22T13:00:00Z',
    updatedAt: '2025-12-23T09:00:00Z',
    stepsTotal: 4,
    stepsCompleted: 1,
    documentsCount: 3,
    daysOpen: 3,
    isOverdue: false,
  },
  {
    id: 'inc-006',
    incidentId: 'INC-2025-0868',
    title: 'Near miss - overhead crane swing',
    description: 'Overhead crane load swung unexpectedly during transport, coming within 2 feet of operator in adjacent lane. No injuries but highlighted need for improved load securing procedures.',
    status: 'closed',
    severity: 'medium',
    type: 'near_miss',
    locationId: 'loc-production-1-line-a',
    locationName: 'Assembly Line A',
    facilityName: 'Plant B - Detroit',
    reporterId: 'user-4',
    reporterName: 'David Kim',
    assigneeId: 'user-3',
    assigneeName: 'Mike Chen',
    occurredAt: '2025-12-18T15:45:00Z',
    createdAt: '2025-12-18T16:00:00Z',
    updatedAt: '2025-12-22T14:00:00Z',
    closedAt: '2025-12-22T14:00:00Z',
    stepsTotal: 3,
    stepsCompleted: 3,
    documentsCount: 2,
    daysOpen: 7,
    isOverdue: false,
  },

  // ==========================================================================
  // LOW SEVERITY INCIDENTS
  // ==========================================================================
  {
    id: 'inc-007',
    incidentId: 'INC-2025-0875',
    title: 'Minor laceration from packaging material',
    description: 'Worker received small cut on finger while opening packaging crate. First aid administered on-site. Worker returned to duties after bandaging.',
    status: 'closed',
    severity: 'low',
    type: 'injury',
    locationId: 'loc-dock-bay-1',
    locationName: 'Dock Bay 1',
    facilityName: 'Plant B - Detroit',
    reporterId: 'user-8',
    reporterName: 'James Thompson',
    occurredAt: '2025-12-19T10:20:00Z',
    createdAt: '2025-12-19T10:30:00Z',
    updatedAt: '2025-12-19T11:00:00Z',
    closedAt: '2025-12-19T11:00:00Z',
    stepsTotal: 2,
    stepsCompleted: 2,
    documentsCount: 1,
    daysOpen: 6,
    isOverdue: false,
  },
  {
    id: 'inc-008',
    incidentId: 'INC-2025-0878',
    title: 'Damaged safety sign in parking lot',
    description: 'Stop sign at parking lot entrance was found damaged, possibly from vehicle contact. Sign still visible but bent. Replacement ordered.',
    status: 'closed',
    severity: 'low',
    type: 'other',
    locationId: 'loc-plant-a',
    locationName: 'Plant A - Chicago',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-11',
    reporterName: 'Emma Rodriguez',
    occurredAt: '2025-12-20T07:00:00Z',
    createdAt: '2025-12-20T07:15:00Z',
    updatedAt: '2025-12-21T09:00:00Z',
    closedAt: '2025-12-21T09:00:00Z',
    stepsTotal: 1,
    stepsCompleted: 1,
    documentsCount: 2,
    daysOpen: 5,
    isOverdue: false,
  },

  // ==========================================================================
  // DRAFT INCIDENTS
  // ==========================================================================
  {
    id: 'inc-009',
    incidentId: 'INC-2025-0880',
    title: 'Suspected gas leak in lab area',
    description: 'Unusual odor reported in QA laboratory. Investigation pending. Area cordoned off as precaution.',
    status: 'draft',
    severity: 'none',
    type: 'environmental',
    locationId: 'loc-qa-zone',
    locationName: 'Quality Assurance Zone',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-9',
    reporterName: 'Lisa Wang',
    occurredAt: '2025-12-24T08:00:00Z',
    createdAt: '2025-12-24T08:10:00Z',
    updatedAt: '2025-12-24T08:10:00Z',
    stepsTotal: 0,
    stepsCompleted: 0,
    documentsCount: 0,
    daysOpen: 1,
    isOverdue: false,
  },
  {
    id: 'inc-010',
    incidentId: 'INC-2025-0881',
    title: 'Ergonomic concern at workstation 12',
    description: 'Worker reported persistent back discomfort potentially related to workstation setup. Ergonomic assessment requested.',
    status: 'draft',
    severity: 'none',
    type: 'other',
    locationId: 'loc-production-1-line-a',
    locationName: 'Assembly Line A',
    facilityName: 'Plant B - Detroit',
    reporterId: 'user-4',
    reporterName: 'David Kim',
    occurredAt: '2025-12-24T09:30:00Z',
    createdAt: '2025-12-24T09:45:00Z',
    updatedAt: '2025-12-24T09:45:00Z',
    stepsTotal: 0,
    stepsCompleted: 0,
    documentsCount: 0,
    daysOpen: 1,
    isOverdue: false,
  },

  // ==========================================================================
  // ADDITIONAL VARIETY
  // ==========================================================================
  {
    id: 'inc-011',
    incidentId: 'INC-2025-0825',
    title: 'Hydraulic fluid leak on press machine',
    description: 'Hydraulic Press #1 developed a slow leak in the main cylinder. Machine taken offline for repair. No injuries or environmental impact.',
    status: 'closed',
    severity: 'medium',
    type: 'equipment',
    locationId: 'loc-press-1',
    locationName: 'Hydraulic Press #1',
    facilityName: 'Plant A - Chicago',
    reporterId: 'user-11',
    reporterName: 'Emma Rodriguez',
    assigneeId: 'user-3',
    assigneeName: 'Mike Chen',
    occurredAt: '2025-12-15T14:00:00Z',
    createdAt: '2025-12-15T14:15:00Z',
    updatedAt: '2025-12-18T16:00:00Z',
    closedAt: '2025-12-18T16:00:00Z',
    stepsTotal: 4,
    stepsCompleted: 4,
    documentsCount: 5,
    daysOpen: 10,
    isOverdue: false,
  },
  {
    id: 'inc-012',
    incidentId: 'INC-2025-0830',
    title: 'Noise level exceeds threshold in CNC area',
    description: 'Routine monitoring found noise levels at 92dB, exceeding 85dB threshold. Additional hearing protection required until engineering controls implemented.',
    status: 'investigation',
    severity: 'medium',
    type: 'environmental',
    locationId: 'loc-cnc-1',
    locationName: 'CNC Machine #1',
    facilityName: 'Plant B - Detroit',
    reporterId: 'user-9',
    reporterName: 'Lisa Wang',
    assigneeId: 'user-2',
    assigneeName: 'Sarah Johnson',
    occurredAt: '2025-12-16T10:00:00Z',
    createdAt: '2025-12-16T10:30:00Z',
    updatedAt: '2025-12-20T11:00:00Z',
    stepsTotal: 5,
    stepsCompleted: 2,
    documentsCount: 3,
    daysOpen: 9,
    isOverdue: true,
  },
]

/**
 * Get incidents by status
 */
export function getIncidentsByStatus(status: string): Incident[] {
  return seedIncidents.filter((i) => i.status === status)
}

/**
 * Get incidents by severity
 */
export function getIncidentsBySeverity(severity: string): Incident[] {
  return seedIncidents.filter((i) => i.severity === severity)
}

/**
 * Get overdue incidents
 */
export function getOverdueIncidents(): Incident[] {
  return seedIncidents.filter((i) => i.isOverdue)
}

/**
 * Get incident stats
 */
export function getIncidentStats(): Record<string, number> {
  return seedIncidents.reduce(
    (acc, inc) => {
      acc[inc.status] = (acc[inc.status] || 0) + 1
      acc[`severity_${inc.severity}`] = (acc[`severity_${inc.severity}`] || 0) + 1
      acc.total = (acc.total || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

/**
 * Get next incident sequence number
 */
export function getNextIncidentSequence(): number {
  const maxId = seedIncidents.reduce((max, inc) => {
    const match = inc.incidentId.match(/INC-\d+-(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      return Math.max(max, num)
    }
    return max
  }, 0)
  return maxId + 1
}

/**
 * Get incident by database ID (for navigation from steps)
 * @param id Database ID (e.g., 'inc-001')
 */
export function getIncidentById(id: string): Incident | undefined {
  return seedIncidents.find((i) => i.id === id)
}

/**
 * Get incident by human-readable ID
 * @param incidentId Human-readable ID (e.g., 'INC-2025-0847')
 */
export function getIncidentByIncidentId(incidentId: string): Incident | undefined {
  return seedIncidents.find((i) => i.incidentId === incidentId)
}

/**
 * Generate many incidents for pagination testing.
 * @param count Number of incidents to generate
 */
export function generateManyIncidents(count: number): Incident[] {
  const incidentTitles = [
    'Chemical spill in storage area', 'Slip and fall - wet floor', 'Equipment malfunction - conveyor belt',
    'Fire alarm - false alarm', 'Near miss - forklift incident', 'Ergonomic hazard report',
    'PPE compliance issue', 'Electrical hazard identified', 'Air quality concern', 'Noise exposure report',
    'Machine guarding deficiency', 'Lockout/tagout violation', 'Housekeeping hazard', 'Emergency exit blocked',
    'First aid incident', 'Vehicle collision - parking lot', 'Burn injury - hot surface', 'Ladder safety violation',
  ]

  const types: IncidentType[] = ['injury', 'near_miss', 'environmental', 'equipment', 'chemical', 'fire', 'other']
  const severities = ['critical', 'high', 'medium', 'low', 'none'] as const
  const statuses = ['draft', 'reported', 'investigation', 'review', 'closed'] as const

  return Array.from({ length: count }, (_, i) => {
    const baseIncident = seedIncidents[i % seedIncidents.length]
    const incidentNum = 2025000 + i
    const severity = severities[i % severities.length]
    const status = statuses[i % statuses.length]

    return {
      ...baseIncident,
      id: `inc-gen-${i}`,
      incidentId: `INC-2025-${String(incidentNum).padStart(4, '0')}`,
      title: incidentTitles[i % incidentTitles.length] + (i > 17 ? ` - Case ${i + 1}` : ''),
      type: types[i % types.length],
      severity,
      status,
      daysOpen: Math.floor(Math.random() * 30) + 1,
      isOverdue: i % 7 === 0 && status !== 'closed' && status !== 'draft',
    }
  })
}
