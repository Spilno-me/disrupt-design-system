/**
 * Data Derivation Functions - Disrupt Flow App
 *
 * Functions to derive interconnected data from the single sources of truth.
 * Used by stories and components to compute derived data like:
 * - LocationWithPeople (locations + user assignments)
 * - DirectoryPerson (lightweight user view)
 * - UserProfileData (extended user for profile pages)
 */

import type { User, RoleLevel } from '../components/users/types'
import type { Location } from '../components/locations/types'
import type {
  DirectoryPerson,
  LocationWithPeople,
  UserProfileData,
} from '../components/directory/types'
import { mockUsers } from './mockUsers'
import { mockRoles } from './mockRoles'

// =============================================================================
// USER TO DIRECTORY PERSON CONVERSION
// =============================================================================

/**
 * Convert a full User to a lightweight DirectoryPerson for directory listings.
 * Returns null if user has no role assignments (can't determine role level).
 */
export function userToDirectoryPerson(
  user: User,
  locationId: string,
  isInherited: boolean,
  inheritedFromName?: string
): DirectoryPerson | null {
  // Find the role assignment that covers this location
  const relevantAssignment = user.roleAssignments.find((ra) =>
    ra.scopes.some((s) => {
      if (s.locationId === locationId) return true
      if (isInherited && s.includeChildren) return true
      return false
    })
  )

  if (!relevantAssignment) return null

  const role = relevantAssignment.role
  // Find the specific scope for this location
  const scope = relevantAssignment.scopes.find((s) => s.locationId === locationId)
    || relevantAssignment.scopes[0]

  // Check if any scope for this location has includeChildren=true
  const cascadesToChildren = relevantAssignment.scopes.some(
    (s) => s.locationId === locationId && s.includeChildren
  )

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    email: user.email,
    phone: user.phone,
    jobTitle: user.jobTitle,
    department: user.department,
    status: user.status,
    roleName: role.name,
    roleLevel: (role.level ?? 4) as RoleLevel,
    assignmentType: isInherited ? 'inherited' : 'direct',
    inheritedFrom: isInherited ? inheritedFromName : undefined,
    isPrimaryLocation: !isInherited && scope?.locationId === locationId,
    cascadesToChildren,
  }
}

// =============================================================================
// LOCATION WITH PEOPLE DERIVATION
// =============================================================================

/**
 * Get all users directly assigned to a specific location.
 */
export function getDirectUsersForLocation(locationId: string): DirectoryPerson[] {
  return mockUsers
    .filter((user) =>
      user.roleAssignments.some((ra) =>
        ra.scopes.some((s) => s.locationId === locationId)
      )
    )
    .map((user) => userToDirectoryPerson(user, locationId, false))
    .filter((p): p is DirectoryPerson => p !== null)
}

/**
 * Get users inherited from a parent location (parent has includeChildren=true).
 */
export function getInheritedUsersForLocation(
  locationId: string,
  parentLocationName: string,
  parentLocationId: string
): DirectoryPerson[] {
  return mockUsers
    .filter((user) =>
      user.roleAssignments.some((ra) =>
        ra.scopes.some((s) => s.locationId === parentLocationId && s.includeChildren)
      )
    )
    .map((user) => userToDirectoryPerson(user, locationId, true, parentLocationName))
    .filter((p): p is DirectoryPerson => p !== null)
}

/**
 * Convert Location[] to LocationWithPeople[] by deriving people from mockUsers.
 * This ensures both LocationsPage and DirectoryPage use the same location data.
 *
 * SINGLE SOURCE OF TRUTH:
 * - sharedMockLocations = Location hierarchy (from locations/data/mockLocations)
 * - mockUsers = User data with role scopes (from mockUsers.ts)
 * - This function joins them to create LocationWithPeople[]
 *
 * COUNT DEFINITIONS (for Organization Directory):
 * - directUserCount: People directly assigned to THIS specific location
 * - inheritedUserCount: Sum of all people in CHILD locations (their total counts)
 * - totalUserCount: directUserCount + inheritedUserCount
 *
 * This means a parent location shows both:
 * - Who is specifically assigned at that level (direct)
 * - How many people work in all sub-locations combined (inherited)
 */
export function convertToLocationWithPeople(
  locations: Location[]
): LocationWithPeople[] {
  return locations.map((loc) => {
    // Get direct users assigned to this specific location
    const directPeople = getDirectUsersForLocation(loc.id)

    // Recursively convert children FIRST (need their counts for inherited)
    const children = loc.children
      ? convertToLocationWithPeople(loc.children)
      : undefined

    // Calculate inherited count from ALL children (their direct + their inherited)
    // This gives us the total count of people working in sub-locations
    const inheritedUserCount = children
      ? children.reduce((sum, child) => sum + child.totalUserCount, 0)
      : 0

    return {
      id: loc.id,
      name: loc.name,
      type: loc.type,
      code: loc.code,
      directUserCount: directPeople.length,
      inheritedUserCount,
      totalUserCount: directPeople.length + inheritedUserCount,
      people: directPeople, // Only direct people at this location
      parentId: loc.parentId,
      children,
    }
  })
}

// =============================================================================
// USER PROFILE DATA DERIVATION
// =============================================================================

/**
 * Create UserProfileData from a User.
 * Adds computed fields for convenient rendering.
 */
export function createUserProfileData(user: User): UserProfileData {
  const roleNames = user.roleAssignments.map((ra) => ra.role.name)
  const roleLevels = user.roleAssignments
    .map((ra) => ra.role.level)
    .filter((level): level is RoleLevel => level !== undefined)
  const highestRoleLevel = roleLevels.length > 0 ? Math.min(...roleLevels) as RoleLevel : 4

  // Find primary location (first scope of first assignment)
  const primaryLocation = user.roleAssignments[0]?.scopes[0]

  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    initials: `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase(),
    primaryLocation,
    roleNames,
    highestRoleLevel,
  }
}

/**
 * Get UserProfileData by user ID.
 */
export function getUserProfileById(userId: string): UserProfileData | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null
  return createUserProfileData(user)
}

// =============================================================================
// INCIDENT DATA DERIVATION
// =============================================================================

import type { Incident } from '../../components/ui/table/IncidentManagementTable'
import type { IncidentDetail } from '../../components/incidents'

/**
 * Map incident type based on title keywords (mock logic)
 */
function getIncidentTypeFromTitle(title: string): IncidentDetail['type'] {
  const lower = title.toLowerCase()
  if (lower.includes('chemical') || lower.includes('spill')) return 'chemical'
  if (lower.includes('fire') || lower.includes('alarm')) return 'fire'
  if (lower.includes('equipment') || lower.includes('malfunction')) return 'equipment'
  if (lower.includes('slip') || lower.includes('fall') || lower.includes('injury')) return 'injury'
  if (lower.includes('near miss')) return 'near_miss'
  if (lower.includes('environmental') || lower.includes('contamination')) return 'environmental'
  return 'other'
}

/**
 * Convert a table Incident to full IncidentDetail for the details page.
 * In a real app, this would fetch full data from an API.
 *
 * @param incident Table row incident (lightweight)
 * @returns Full IncidentDetail for details page
 *
 * @example
 * ```typescript
 * import { convertToIncidentDetail } from '../../flow/data'
 *
 * const detail = convertToIncidentDetail(tableIncident)
 * <IncidentDetailsPage incident={detail} />
 * ```
 */
export function convertToIncidentDetail(incident: Incident): IncidentDetail {
  // Map severity to the details page format
  const severityMap = {
    critical: 'critical' as const,
    high: 'high' as const,
    medium: 'medium' as const,
    low: 'low' as const,
    none: 'none' as const,
  }

  // Generate mock workflows based on status
  const generateWorkflows = (status: string): IncidentDetail['workflows'] => {
    const baseWorkflows = [
      { id: 'wf-1', name: 'Initial Assessment', status: 'completed' as const },
      { id: 'wf-2', name: 'Root Cause Analysis', status: 'in_progress' as const },
      { id: 'wf-3', name: 'Corrective Actions', status: 'pending' as const },
    ]

    if (status === 'draft') return []

    // All workflows need lastUpdatedBy and lastUpdatedAt
    const addMetadata = (wf: typeof baseWorkflows[0], i: number, overrideStatus?: 'pending' | 'completed') => ({
      ...wf,
      status: overrideStatus ?? wf.status,
      lastUpdatedBy: { id: 'user-1', name: incident.reporter },
      lastUpdatedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })

    if (status === 'reported') return baseWorkflows.map((w, i) => addMetadata(w, i, 'pending'))
    if (status === 'review') return baseWorkflows.map((w, i) => addMetadata(w, i, 'completed'))

    return baseWorkflows.map((w, i) => addMetadata(w, i))
  }

  // Generate creation date based on age
  const createdAt = new Date(Date.now() - (incident.ageDays * 24 * 60 * 60 * 1000))

  return {
    id: incident.id,
    incidentId: incident.incidentId,
    title: incident.title,
    description: `This incident was reported at ${incident.location} by ${incident.reporter}. ${incident.title}. The incident is currently under ${incident.status} with ${incident.severity} severity. Further investigation and documentation is required to ensure proper resolution and prevent future occurrences.`,
    status: incident.status,
    severity: severityMap[incident.severity],
    type: getIncidentTypeFromTitle(incident.title),
    location: {
      id: 'loc-1',
      name: incident.location,
      facility: incident.location.includes('Warehouse') ? 'Main Warehouse' :
               incident.location.includes('Production') ? 'Production Building' :
               incident.location.includes('Office') ? 'Office Complex' : 'Main Facility',
      facilityId: 'fac-1',
      coordinates: {
        lat: 49.8397 + (Math.random() * 0.01),
        lng: 24.0297 + (Math.random() * 0.01),
      },
      what3words: '///appealing.concluded.mugs',
    },
    reporter: {
      id: 'user-1',
      name: incident.reporter,
      email: `${incident.reporter.toLowerCase().replace(' ', '.')}@company.com`,
    },
    createdAt: createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    stepsTotal: incident.status === 'draft' ? 0 : 3,
    stepsCompleted: incident.status === 'review' ? 3 : incident.status === 'investigation' ? 1 : 0,
    documentsCount: Math.floor(Math.random() * 5) + 1,
    daysOpen: incident.ageDays,
    reference: incident.incidentId,
    workflows: generateWorkflows(incident.status),
    formSubmissions: incident.status !== 'draft' ? [
      {
        id: 'fs-1',
        formName: 'Initial Incident Report',
        submittedBy: { id: 'user-1', name: incident.reporter },
        submittedAt: createdAt.toISOString(),
        status: 'approved' as const,
      },
    ] : [],
    activities: incident.status !== 'draft' ? [
      {
        id: 'act-1',
        type: 'status_change' as const,
        description: `Status changed to ${incident.status}`,
        user: { id: 'user-1', name: incident.reporter },
        timestamp: new Date(Date.now() - (Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      },
      {
        id: 'act-2',
        type: 'comment' as const,
        description: 'Investigation in progress. Gathering evidence and witness statements.',
        user: { id: 'user-2', name: 'Safety Officer' },
        timestamp: new Date(Date.now() - (Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
      },
    ] : [],
  }
}
