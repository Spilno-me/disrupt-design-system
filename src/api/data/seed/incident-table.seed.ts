/**
 * Incident Table Seed Data
 *
 * Generator functions for the IncidentManagementTable component.
 * Uses the table-specific Incident type (not the API Incident type).
 *
 * @see src/components/ui/table/IncidentManagementTable.tsx for type definition
 */

import type { Incident } from '../../../components/ui/table/IncidentManagementTable'
import type { Step } from '../../../components/incidents/steps-page/types'

// =============================================================================
// DATA ARRAYS - Used by generateIncidentsForTable
// =============================================================================

/**
 * Incident title templates covering various EHS scenarios
 */
export const incidentTitles = [
  'Chemical Spill in Storage Area',
  'Equipment Malfunction',
  'Slip and Fall Incident',
  'Fire Alarm Activation',
  'Gas Leak Detected',
  'Electrical Hazard Reported',
  'Vehicle Collision',
  'Structural Damage Found',
  'PPE Violation Observed',
  'Ergonomic Issue Reported',
  'Noise Exposure Concern',
  'Heat Stress Incident',
  'Confined Space Entry Issue',
  'Lockout/Tagout Violation',
  'Fall Protection Failure',
  'Machine Guarding Missing',
  'Hazardous Waste Spillage',
  'Air Quality Concern',
  'Water Contamination',
  'Radiation Exposure Risk',
  'Biological Hazard Found',
  'Sharp Object Injury',
  'Crushing Hazard Near Miss',
  'Forklift Incident',
  'Ladder Safety Issue',
  'Scaffolding Problem',
  'Crane Operation Concern',
  'Welding Safety Violation',
  'Chemical Burn Reported',
  'Eye Injury Incident',
  'Back Injury Complaint',
  'Respiratory Issue',
]

/**
 * Location names for incidents
 */
export const incidentLocations = [
  'Warehouse A - Section 1',
  'Warehouse B - Section 4',
  'Production Floor - Building A',
  'Assembly Line 3',
  'Loading Dock - East Wing',
  'Storage Room C',
  'Utility Room 3B',
  'Building Entrance',
  'Parking Lot B',
  'Office Building - Floor 2',
  'Maintenance Shop',
  'Quality Control Lab',
  'Shipping Department',
  'Receiving Area',
  'Break Room - North',
  'Conference Room 101',
  'Server Room',
  'Chemical Storage',
  'Outdoor Tank Farm',
  'Compressor Building',
  'Boiler Room',
  'HVAC Equipment Area',
  'Roof Access',
]

/**
 * Reporter names for incidents
 */
export const incidentReporters = [
  'Patricia Davis',
  'Sarah Connor',
  'Mike Chen',
  'Michael Johnson',
  'John Martinez',
  'Linda Smith',
  'Patricia Taylor',
  'Robert Wilson',
  'James Brown',
  'Jennifer Garcia',
  'David Miller',
  'Maria Rodriguez',
  'William Anderson',
  'Elizabeth Thomas',
  'Richard Jackson',
  'Susan White',
  'Joseph Harris',
  'Margaret Martin',
  'Charles Thompson',
  'Dorothy Moore',
  'Christopher Lee',
  'Nancy Walker',
  'Daniel Hall',
  'Karen Allen',
]

// =============================================================================
// GENERATOR FUNCTION
// =============================================================================

/**
 * Generate incidents for IncidentManagementTable display.
 *
 * Creates a realistic distribution of incidents:
 * - Severity: 5 critical, 10 high, 30 medium, 35 low, 20 none (for 100 incidents)
 * - Status: 8 draft, 15 reported, 40 investigation, 37 review
 * - Sorted by severity (critical first), then by age (oldest first)
 *
 * @param count Number of incidents to generate (default: 100)
 * @returns Array of Incident objects for the table
 *
 * @example
 * ```typescript
 * import { generateIncidentsForTable } from '@/api'
 *
 * // Generate 100 incidents with realistic distribution
 * const incidents = generateIncidentsForTable()
 *
 * // Or generate a specific count
 * const smallSet = generateIncidentsForTable(20)
 * ```
 */
export function generateIncidentsForTable(count: number = 100): Incident[] {
  const incidents: Incident[] = []

  // Distribution: 5% critical, 10% high, 30% medium, 35% low, 20% none
  const severityDistribution: Array<'critical' | 'high' | 'medium' | 'low' | 'none'> = []
  const criticalCount = Math.round(count * 0.05)
  const highCount = Math.round(count * 0.1)
  const mediumCount = Math.round(count * 0.3)
  const lowCount = Math.round(count * 0.35)
  const noneCount = count - criticalCount - highCount - mediumCount - lowCount

  severityDistribution.push(
    ...Array(criticalCount).fill('critical'),
    ...Array(highCount).fill('high'),
    ...Array(mediumCount).fill('medium'),
    ...Array(lowCount).fill('low'),
    ...Array(noneCount).fill('none')
  )

  // Distribution: 8% draft, 15% reported, 40% investigation, 37% review
  const statusDistribution: Array<'draft' | 'reported' | 'investigation' | 'review'> = []
  const draftCount = Math.round(count * 0.08)
  const reportedCount = Math.round(count * 0.15)
  const investigationCount = Math.round(count * 0.4)
  const reviewCount = count - draftCount - reportedCount - investigationCount

  statusDistribution.push(
    ...Array(draftCount).fill('draft'),
    ...Array(reportedCount).fill('reported'),
    ...Array(investigationCount).fill('investigation'),
    ...Array(reviewCount).fill('review')
  )

  for (let i = 0; i < count; i++) {
    const severity = severityDistribution[i] || 'none'
    const status = statusDistribution[i] || 'review'
    const ageDays = status === 'draft' ? 0 : Math.floor(Math.random() * 120)
    const isOverdue = ageDays > 30 && status !== 'draft' && status !== 'reported'

    incidents.push({
      id: String(i + 1),
      incidentId: `INC-${516344565333 + i}`,
      title: incidentTitles[i % incidentTitles.length] + (i >= incidentTitles.length ? ` - Case ${i + 1}` : ''),
      location: incidentLocations[i % incidentLocations.length],
      reporter: incidentReporters[i % incidentReporters.length],
      priority: status === 'draft' ? 'draft' : severity,
      severity: severity,
      status: status,
      ageDays: ageDays,
      overdue: isOverdue,
    })
  }

  // Sort by severity (critical first) then by age (oldest first)
  return incidents.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }
    const aSev = severityOrder[a.severity as keyof typeof severityOrder] ?? 5
    const bSev = severityOrder[b.severity as keyof typeof severityOrder] ?? 5
    if (aSev !== bSev) return aSev - bSev
    return (b.ageDays || 0) - (a.ageDays || 0)
  })
}

/**
 * Get incidents filtered by status
 */
export function getTableIncidentsByStatus(
  incidents: Incident[],
  status: 'draft' | 'reported' | 'investigation' | 'review'
): Incident[] {
  return incidents.filter((i) => i.status === status)
}

/**
 * Get incidents filtered by severity
 */
export function getTableIncidentsBySeverity(
  incidents: Incident[],
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
): Incident[] {
  return incidents.filter((i) => i.severity === severity)
}

/**
 * Get overdue incidents
 */
export function getTableOverdueIncidents(incidents: Incident[]): Incident[] {
  return incidents.filter((i) => i.overdue)
}

// =============================================================================
// STEP GENERATION
// =============================================================================

/**
 * Step templates for generating steps per incident
 */
export const stepTemplates = [
  {
    title: 'Initial Assessment',
    description: 'Complete initial assessment of the incident scene and document observations.',
    tooltip: 'First response documentation',
  },
  {
    title: 'Witness Statements',
    description: 'Collect statements from all witnesses present at the time of the incident.',
    tooltip: 'Gather witness accounts',
  },
  {
    title: 'Evidence Collection',
    description: 'Gather and preserve all physical evidence related to the incident.',
    tooltip: 'Evidence preservation step',
  },
  {
    title: 'Root Cause Analysis',
    description: 'Perform thorough analysis to identify underlying factors that contributed to the incident.',
    tooltip: 'Deep dive into causes',
  },
  {
    title: 'Corrective Action Plan',
    description: 'Develop and document corrective actions to prevent similar incidents.',
    tooltip: 'Prevention planning',
  },
  {
    title: 'Safety Review',
    description: 'Review safety protocols and update as needed based on findings.',
    tooltip: 'Protocol review',
  },
  {
    title: 'Final Report',
    description: 'Compile final incident report for management review and closure.',
    tooltip: 'Documentation finalization',
  },
]

/**
 * Assignees for steps
 */
export const stepAssignees = [
  { id: 'user-1', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
  { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: 'user-3', name: 'David Kim', email: 'david.kim@company.com' },
  { id: 'user-4', name: 'Amanda Torres', email: 'amanda.torres@company.com' },
  { id: 'user-5', name: 'Robert Brown', email: 'robert.brown@company.com' },
  { id: 'user-6', name: 'Jennifer Lee', email: 'jennifer.lee@company.com' },
  { id: 'user-7', name: 'Mark Wilson', email: 'mark.wilson@company.com' },
  { id: 'user-8', name: 'Nancy Taylor', email: 'nancy.taylor@company.com' },
]

/**
 * Generate steps for incidents based on their status.
 *
 * Step count varies by incident status:
 * - draft: 0 steps (no workflow started)
 * - reported: 2-3 steps (early stage)
 * - investigation: 4-5 steps (active work)
 * - review: 5-7 steps (near completion)
 *
 * Step status distribution based on incident progress:
 * - review: most completed, 1-2 pending
 * - investigation: mix of completed/in_progress/pending
 * - reported: mostly pending with 1 in_progress
 *
 * @param incidents Array of incidents to generate steps for
 * @returns Array of Step objects
 *
 * @example
 * ```typescript
 * import { generateIncidentsForTable, generateStepsForTableIncidents } from '@/api'
 *
 * const incidents = generateIncidentsForTable(100)
 * const steps = generateStepsForTableIncidents(incidents)
 *
 * // Filter for specific user's steps
 * const mySteps = steps.filter(s => s.assignee.id === 'user-1')
 * ```
 */
export function generateStepsForTableIncidents(incidents: Incident[]): Step[] {
  const steps: Step[] = []

  incidents.forEach((incident) => {
    // Skip draft incidents - they don't have steps
    if (incident.status === 'draft') return

    // Determine number of steps based on status
    let stepCount: number
    switch (incident.status) {
      case 'reported':
        stepCount = 2 + Math.floor(Math.random() * 2) // 2-3 steps
        break
      case 'investigation':
        stepCount = 4 + Math.floor(Math.random() * 2) // 4-5 steps
        break
      case 'review':
        stepCount = 5 + Math.floor(Math.random() * 3) // 5-7 steps
        break
      default:
        stepCount = 3
    }

    // Generate steps for this incident
    for (let i = 0; i < stepCount; i++) {
      const template = stepTemplates[i % stepTemplates.length]
      const assignee = stepAssignees[Math.floor(Math.random() * stepAssignees.length)]
      const reporter = stepAssignees[Math.floor(Math.random() * stepAssignees.length)]
      const daysOpen = Math.floor(Math.random() * 14) + 1

      // Determine step status based on position and incident status
      let status: 'pending' | 'in_progress' | 'overdue' | 'completed'
      if (incident.status === 'review') {
        // Review incidents: most steps completed
        if (i < stepCount - 2) {
          status = 'completed'
        } else if (i === stepCount - 2) {
          status = 'in_progress'
        } else {
          status = 'pending'
        }
      } else if (incident.status === 'investigation') {
        // Investigation: mix of statuses
        if (i < 2) {
          status = 'completed'
        } else if (i === 2) {
          status = 'in_progress'
        } else {
          status = daysOpen > 7 ? 'overdue' : 'pending'
        }
      } else {
        // Reported: mostly pending
        status = i === 0 ? 'in_progress' : 'pending'
      }

      const isOverdue = status === 'overdue' || (status === 'pending' && daysOpen > 10)

      steps.push({
        id: `step-${incident.id}-${i}`,
        title: template.title,
        description: template.description,
        tooltip: template.tooltip,
        incidentId: incident.incidentId,
        incidentDbId: incident.id,
        severity: incident.severity as 'critical' | 'high' | 'medium' | 'low' | 'none',
        status,
        location: incident.location,
        assignee,
        reporter,
        createdAt: new Date(Date.now() - daysOpen * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + (7 - daysOpen) * 24 * 60 * 60 * 1000).toISOString(),
        daysOpen,
        isOverdue,
      })
    }
  })

  return steps
}

/**
 * Split steps into "my steps" and "team steps" based on assignee
 *
 * @param steps All generated steps
 * @param userId ID of the current user (defaults to 'user-1')
 * @param myLimit Max steps for "my steps" tab
 * @param teamLimit Max steps for "team steps" tab
 */
export function splitStepsByAssignee(
  steps: Step[],
  userId: string = 'user-1',
  myLimit: number = 10,
  teamLimit: number = 15
): { mySteps: Step[]; teamSteps: Step[] } {
  return {
    mySteps: steps.filter((step) => step.assignee.id === userId).slice(0, myLimit),
    teamSteps: steps.filter((step) => step.assignee.id !== userId).slice(0, teamLimit),
  }
}

// =============================================================================
// LOCATION SELECT OPTIONS
// =============================================================================

/**
 * Location group mapping based on location name patterns.
 * Used to categorize locations for grouped select dropdowns.
 */
const locationGroupPatterns: Array<{ pattern: RegExp; group: string }> = [
  { pattern: /^(Warehouse|Storage|Chemical Storage)/i, group: 'Warehouses' },
  { pattern: /^(Production|Assembly|Quality)/i, group: 'Production' },
  { pattern: /^(Loading|Shipping|Receiving|Parking)/i, group: 'Logistics' },
  { pattern: /^(Utility|Maintenance|Compressor|Boiler|HVAC|Server)/i, group: 'Facilities' },
  { pattern: /^(Office|Break|Conference|Building Entrance)/i, group: 'Office' },
  { pattern: /^(Outdoor|Roof|Tank)/i, group: 'Outdoor' },
]

/**
 * Get group name for a location based on its name
 */
function getLocationGroup(locationName: string): string {
  for (const { pattern, group } of locationGroupPatterns) {
    if (pattern.test(locationName)) return group
  }
  return 'Other'
}

/**
 * Generate value ID from location name (kebab-case slug)
 */
function toLocationValue(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Generate grouped location select options from incidentLocations array.
 *
 * @returns Array of options with value, label, and group for use in select dropdowns
 *
 * @example
 * ```typescript
 * import { getIncidentLocationSelectOptions } from '@/api'
 *
 * // Use in a select component
 * const locationOptions = getIncidentLocationSelectOptions()
 * // Returns: [{ value: 'warehouse-a-section-1', label: 'Warehouse A - Section 1', group: 'Warehouses' }, ...]
 * ```
 */
export function getIncidentLocationSelectOptions(): Array<{
  value: string
  label: string
  group: string
}> {
  return incidentLocations
    .map((name) => ({
      value: toLocationValue(name),
      label: name,
      group: getLocationGroup(name),
    }))
    .sort((a, b) => {
      // Sort by group, then by label
      if (a.group !== b.group) return a.group.localeCompare(b.group)
      return a.label.localeCompare(b.label)
    })
}
