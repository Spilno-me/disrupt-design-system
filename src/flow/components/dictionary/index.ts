/**
 * Dictionary Management Components
 *
 * Exports for the Dictionary Management configuration page.
 */

// Main page component
export { DictionaryPage, default } from './DictionaryPage'

// Sidebar components
export { CategoriesSidebar, CategoryCard, DraggableCategoryCard } from './sidebar'

// Table components
export { DictionaryEntriesTable } from './table/DictionaryEntriesTable'

// Mobile components
export { MobileCategorySheet } from './mobile/MobileCategorySheet'
export { DictionaryEntryCard } from './mobile/DictionaryEntryCard'

// Dialog components
export { CreateCategoryDialog } from './dialogs/CreateCategoryDialog'
export { DeleteCategoryDialog } from './dialogs/DeleteCategoryDialog'
export { CreateEntryDialog } from './dialogs/CreateEntryDialog'
export { EditEntryDialog } from './dialogs/EditEntryDialog'
export { DeleteEntryDialog } from './dialogs/DeleteEntryDialog'

// Types
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
} from './types'

// Helpers
export {
  ENTRY_STATUS_CONFIG,
  CATEGORY_TYPE_CONFIG,
  generateCode,
} from './types'

// Mock data and helpers
export {
  // Categories
  mockCategories,
  // Entry arrays
  mockActionTypeEntries,
  mockCorrectiveActionCategoryEntries,
  mockCorrectiveActionTypeEntries,
  mockEffectivenessEntries,
  mockBodyPartEntries,
  mockInjuryIllnessTypeEntries,
  mockInjurySeverityEntries,
  mockMedicalProviderEntries,
  mockEnvImpactEntries,
  mockEnvReleaseSourceEntries,
  mockEnvReleaseTypeEntries,
  mockIncidentAssessmentEntries,
  mockIncidentClosureEntries,
  mockIncidentSeverityEntries,
  mockIncidentTypeEntries,
  mockDepartmentEntries,
  mockLocationAccessEntries,
  mockLocationTypeEntries,
  mockProcessSafetyEntries,
  mockQualityIssueEntries,
  mockRCAMethodologyEntries,
  mockRootCauseCategoryEntries,
  mockSecurityIncidentEntries,
  mockSecurityLevelEntries,
  mockPriorityLevelEntries,
  mockSourceTypeEntries,
  mockTimezoneEntries,
  mockCustomPriorityEntries,
  mockAllEntries,
  // Helper functions
  getEntriesByCategoryId,
  getEntriesByCategoryCode,
  getActiveEntriesByCategoryCode,
  toSelectOptions,
  getEntryByCode,
  getCategoryByCode,
} from './data/mock-data'
