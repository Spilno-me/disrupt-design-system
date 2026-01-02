/**
 * Module Detail Tab Components
 *
 * Tab components for ModuleDetailsPage:
 * - EntityTemplatesTab: Entity configuration
 * - ProcessDefinitionsTab: Workflow definitions
 * - FormTemplatesTab: Form templates
 * - FormMappingsTab: Form-entity-workflow mappings
 * - UserGroupsTab: Access control
 *
 * Enhanced to match EMEX Module architecture (Dec 2025):
 * - UserGroupItem: Added code (BPMN candidate groups), moduleId, users[]
 * - ProcessDefinitionItem: Added bpmnXml, deployedAt, flowableDeploymentId, isSystem
 * - FormTemplateItem: Added schemaJson, entityTemplateCode, fields[], category, isSystem
 */

export { EntityTemplatesTab } from './EntityTemplatesTab'
export type { EntityTemplatesTabProps } from './EntityTemplatesTab'

export { ProcessDefinitionsTab } from './ProcessDefinitionsTab'
export type {
  ProcessDefinitionsTabProps,
  ProcessDefinitionItem,
  ProcessDefinitionStatus,
} from './ProcessDefinitionsTab'

export { FormTemplatesTab } from './FormTemplatesTab'
export type {
  FormTemplatesTabProps,
  FormTemplateItem,
  FormTemplateStatus,
  FormFieldDefinition,
} from './FormTemplatesTab'

export { FormMappingsTab } from './FormMappingsTab'
export type {
  FormMappingsTabProps,
  FormMappingItem,
  MappingType,
} from './FormMappingsTab'

export { UserGroupsTab } from './UserGroupsTab'
export type {
  UserGroupsTabProps,
  UserGroupItem,
  UserGroupMember,
  AccessLevel,
} from './UserGroupsTab'

export { ProcessTriggersTab } from './ProcessTriggersTab'
export type {
  ProcessTriggersTabProps,
  ProcessTriggerItem,
  TriggerAction,
  VariableMapping,
} from './ProcessTriggersTab'
