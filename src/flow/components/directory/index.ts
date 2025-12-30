/**
 * Organization Directory Module
 *
 * Location-first directory for browsing employees by location hierarchy.
 * "Location is King" - All people are organized by where they work.
 */

// Main page
export { default as DirectoryPage } from './DirectoryPage'

// Tree components
export { DirectoryTree, DirectoryTreeItem } from './tree'

// People components
export { PersonCard, PeopleList, PeopleGroupSection } from './people'

// Panel components
export { LocationPeoplePanel } from './panels'

// Profile components
export {
  UserProfilePage,
  ProfileHeader,
  ContactCard,
  LocationAssignmentsCard,
  RolesCard,
} from './profile'

// Mobile components
export { PersonDetailSheet, MobileLocationDirectory } from './mobile'

// Search components
export {
  DirectorySearchResults,
  PersonSearchResult,
  LocationSearchResult,
} from './search'

// Search utilities
export {
  searchDirectory,
  flattenAllPeople,
  findLocationPath,
  findPersonLocation,
  highlightMatch,
} from './utils/searchUtils'

// Types
export type {
  DirectoryViewMode,
  AssignmentType,
  DirectoryPerson,
  LocationWithPeople,
  PeopleByRoleLevel,
  DirectorySearchResult,
  DirectoryFilterState,
  UserProfileData,
  DirectoryPageProps,
  DirectoryTreeProps,
  DirectoryTreeItemProps,
  LocationPeoplePanelProps,
  PersonCardProps,
  PersonDetailSheetProps,
  UserProfilePageProps,
} from './types'

export { DEFAULT_DIRECTORY_FILTERS, createUserProfileData } from './types'
