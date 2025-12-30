/**
 * Organization Directory Types
 *
 * TypeScript interfaces for the Location-First Organization Directory.
 * Supports browsing users by location hierarchy with role-level grouping.
 */

import type { User, UserStatus, Role, RoleLevel, LocationScope, RoleLevelBadgeVariant } from '../users/types'
import type { Location, LocationType } from '../locations/types'

// =============================================================================
// DIRECTORY VIEW TYPES
// =============================================================================

export type DirectoryViewMode = 'tree' | 'list' | 'grid'

export type AssignmentType = 'direct' | 'inherited'

// =============================================================================
// DIRECTORY PERSON (Lightweight user for listings)
// =============================================================================

/**
 * Lightweight person representation for directory listings.
 * Contains only the fields needed for display, not full User data.
 */
export interface DirectoryPerson {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
  email: string
  phone?: string
  jobTitle: string
  department: string
  status: UserStatus
  /** Primary role name for display */
  roleName: string
  /** Role hierarchy level for grouping */
  roleLevel: RoleLevel
  /** Type of assignment to this location */
  assignmentType: AssignmentType
  /** Source location for inherited assignments */
  inheritedFrom?: string
  /** Whether this is the user's primary work location */
  isPrimaryLocation: boolean
  /** Whether this assignment cascades to child locations (includeChildren=true) */
  cascadesToChildren?: boolean
  /** Training compliance status (from Training module) */
  trainingStatus?: {
    /** Overall compliance status */
    complianceStatus: 'compliant' | 'expiring_soon' | 'non_compliant' | 'not_applicable'
    /** Number of required trainings */
    totalRequired: number
    /** Number of completed trainings */
    completed: number
    /** Number of overdue trainings */
    overdue: number
    /** Number of trainings expiring soon */
    expiringSoon: number
    /** Next expiring course info */
    nextExpiration?: {
      courseName: string
      daysUntil: number
    }
  }
}

// =============================================================================
// LOCATION WITH PEOPLE (Extended location for directory tree)
// =============================================================================

/**
 * Location node extended with people counts and optional user list.
 * Used for the location-first directory tree view.
 */
export interface LocationWithPeople {
  id: string
  name: string
  type: LocationType
  code?: string
  /** Users directly assigned to this location */
  directUserCount: number
  /** Users inherited from parent with includeChildren=true */
  inheritedUserCount: number
  /** Total users (direct + inherited) */
  totalUserCount: number
  /** Users at this location (loaded on expand or for small counts) */
  people?: DirectoryPerson[]
  /** Child locations with their people counts */
  children?: LocationWithPeople[]
  /** Parent location ID for breadcrumb navigation */
  parentId?: string | null
}

// =============================================================================
// PEOPLE GROUPING (By role level)
// =============================================================================

/**
 * People grouped by role level for display in location panels.
 */
export interface PeopleByRoleLevel {
  level: RoleLevel
  label: string
  description: string
  badgeVariant: RoleLevelBadgeVariant
  iconColor: string
  people: DirectoryPerson[]
}

// =============================================================================
// SEARCH RESULT TYPES
// =============================================================================

/**
 * Unified search results for directory search dropdown
 */
export interface DirectorySearchResult {
  /** Matching people */
  people: DirectoryPerson[]
  /** Matching locations */
  locations: LocationWithPeople[]
  /** Total people matches (before limit) */
  totalPeopleCount: number
  /** Total location matches (before limit) */
  totalLocationCount: number
}

// =============================================================================
// FILTER STATE
// =============================================================================

export interface DirectoryFilterState {
  /** Search query (matches name, email, job title) */
  search: string
  /** Filter by location IDs */
  locations: string[]
  /** Filter by role IDs */
  roles: string[]
  /** Filter by department names */
  departments: string[]
  /** Filter by role level */
  roleLevel: RoleLevel | null
  /** Filter by assignment type */
  assignmentType: AssignmentType | null
  /** Show only active users */
  activeOnly: boolean
}

export const DEFAULT_DIRECTORY_FILTERS: DirectoryFilterState = {
  search: '',
  locations: [],
  roles: [],
  departments: [],
  roleLevel: null,
  assignmentType: null,
  activeOnly: true,
}

// =============================================================================
// USER PROFILE TYPES
// =============================================================================

/**
 * Extended user data for profile page display.
 * Includes computed fields for convenient rendering.
 */
export interface UserProfileData extends User {
  /** Computed: firstName + lastName */
  fullName: string
  /** Computed: First letters of first and last name */
  initials: string
  /** Computed: Primary work location (first scope of first role assignment) */
  primaryLocation?: LocationScope
  /** Computed: List of role names for quick display */
  roleNames: string[]
  /** Computed: Highest role level (lowest number = highest authority) */
  highestRoleLevel: RoleLevel
}

/**
 * Helper to create UserProfileData from User.
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

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export type DirectoryQuickFilterType = 'all' | 'active' | 'pending' | 'inactive' | 'locked'

export interface DirectoryPageProps {
  /** Location tree with people counts */
  locations: LocationWithPeople[]
  /** All users for search functionality */
  users: User[]
  /** All roles for filtering */
  roles: Role[]
  /** All departments for filtering */
  departments: string[]
  /** Loading state */
  isLoading?: boolean
  /** Callback when user profile is requested */
  onViewProfile?: (userId: string) => void
  /** Callback to fetch people for a specific location */
  onFetchLocationPeople?: (locationId: string) => Promise<DirectoryPerson[]>
  /** Callback to refresh directory data */
  onRefresh?: () => void
  /** Callback to export directory data */
  onExport?: () => void
}

export interface DirectoryTreeProps {
  /** Location tree with people counts */
  locations: LocationWithPeople[]
  /** Currently selected location ID */
  selectedLocationId?: string | null
  /** Expanded location IDs */
  expandedIds: Set<string>
  /** Search query */
  searchValue: string
  /** Whether to show inherited users */
  showInherited: boolean
  /** Callbacks */
  onLocationSelect: (locationId: string) => void
  onToggleExpand: (locationId: string) => void
  onPersonClick: (person: DirectoryPerson) => void
  onSearchChange: (value: string) => void
}

export interface DirectoryTreeItemProps {
  /** Location data with people counts */
  location: LocationWithPeople
  /** Current depth in tree (for indentation) */
  depth: number
  /** Whether this node is expanded */
  isExpanded: boolean
  /** Whether this node is selected */
  isSelected: boolean
  /** Currently selected location ID (for children) */
  selectedLocationId?: string | null
  /** All expanded IDs (for children) */
  expandedIds: Set<string>
  /** Whether to show inherited users */
  showInherited: boolean
  /** Toggle expand/collapse */
  onExpandToggle: (locationId: string) => void
  /** Select a location */
  onSelect: (locationId: string) => void
  /** Handle person click */
  onPersonClick: (person: DirectoryPerson) => void
}

export interface LocationPeoplePanelProps {
  /** Selected location */
  location: LocationWithPeople | null
  /** People grouped by role level */
  peopleByLevel: PeopleByRoleLevel[]
  /** Whether to show inherited users */
  showInherited: boolean
  /** Loading state */
  isLoading?: boolean
  /** Callbacks */
  onToggleInherited: (show: boolean) => void
  onPersonClick: (person: DirectoryPerson) => void
  onViewProfile: (userId: string) => void
}

export interface UserProfilePageProps {
  /** User profile data */
  profile: UserProfileData
  /** Loading state */
  isLoading?: boolean
  /** Callback to navigate back */
  onBack: () => void
  /** Callback to send email */
  onEmail?: (email: string) => void
  /** Callback to make phone call */
  onCall?: (phone: string) => void
  /** Callback to open Teams chat */
  onTeamsChat?: (teamsEmail: string) => void
  /** Callback to open Slack chat */
  onSlackChat?: (slackHandle: string) => void
}

export interface PersonCardProps {
  /** Person data */
  person: DirectoryPerson
  /** Current location context */
  currentLocation?: string
  /** Card variant */
  variant?: 'compact' | 'full'
  /** Callbacks */
  onClick?: () => void
  onEmail?: (email: string) => void
  onCall?: (phone: string) => void
  onViewProfile?: (userId: string) => void
}

export interface PersonDetailSheetProps {
  /** Person to display */
  person: DirectoryPerson | null
  /** Location context */
  location?: LocationWithPeople | null
  /** Open state */
  open: boolean
  /** Callbacks */
  onOpenChange: (open: boolean) => void
  onViewProfile: (userId: string) => void
  onEmail: (email: string) => void
  onCall?: (phone: string) => void
}
