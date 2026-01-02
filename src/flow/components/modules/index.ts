/**
 * Modules - Admin configuration components for Flow modules
 *
 * Provides a complete interface for managing modules:
 * - ModuleCard: Individual module display with actions
 * - ModulesGrid: Responsive grid with loading/empty states
 * - ModulesPage: Full page with search, filters, pagination
 * - ModuleDetailsPage: Detailed view with configuration tabs
 * - ModuleConfigSheet: Mobile bottom sheet for editing
 * - CreateEntitySheet: Quick entity creation
 *
 * Module Detail Tabs:
 * - EntityTemplatesTab: Entity configuration
 * - ProcessDefinitionsTab: Workflow definitions
 * - FormTemplatesTab: Form templates
 * - FormMappingsTab: Form-entity-workflow mappings
 * - UserGroupsTab: Access control
 */

// Components
export { ModuleCard } from './ModuleCard'
export { ModuleStatusBadge } from './ModuleStatusBadge'
export { ModulesGrid } from './ModulesGrid'
export { ModulesPage } from './ModulesPage'
export { ModuleDetailsPage } from './ModuleDetailsPage'
export { ModuleConfigSheet } from './ModuleConfigSheet'
export { CreateEntitySheet } from './CreateEntitySheet'

// Tab Components
export {
  EntityTemplatesTab,
  ProcessDefinitionsTab,
  FormTemplatesTab,
  FormMappingsTab,
  UserGroupsTab,
  ProcessTriggersTab,
} from './tabs'

// Types
export type {
  ModuleItem,
  EntityTemplateInfo,
  ModulePermissions,
  ModuleCardProps,
} from './ModuleCard'

export type { ModuleStatusBadgeProps } from './ModuleStatusBadge'

export type { ModulesGridProps } from './ModulesGrid'

export type {
  ModulesFilterState,
  ModulesPageProps,
} from './ModulesPage'

export type {
  FormTemplateOption,
  ModuleConfigData,
  ModuleConfigSheetProps,
} from './ModuleConfigSheet'

export type { CreateEntitySheetProps } from './CreateEntitySheet'

// ModuleDetailsPage Types
export type {
  ModuleDetailTab,
  ModuleDetailsPageProps,
} from './ModuleDetailsPage'

// Tab Component Types
export type {
  EntityTemplatesTabProps,
  ProcessDefinitionsTabProps,
  ProcessDefinitionItem,
  ProcessDefinitionStatus,
  FormTemplatesTabProps,
  FormTemplateItem,
  FormTemplateStatus,
  FormFieldDefinition,
  FormMappingsTabProps,
  FormMappingItem,
  MappingType,
  UserGroupsTabProps,
  UserGroupItem,
  UserGroupMember,
  AccessLevel,
  ProcessTriggersTabProps,
  ProcessTriggerItem,
  TriggerAction,
  VariableMapping,
} from './tabs'

// Helpers
export {
  MODULE_STATUS_CONFIG,
  getModuleIcon,
  getModuleColors,
  formatRelativeDate,
  formatShortDate,
  isValidModuleStatus,
  isValidString,
  isValidNumber,
  VALID_MODULE_STATUSES,
} from './helpers'

export type { ModuleStatus, BadgeVariant, ModuleStatusConfig } from './helpers'
