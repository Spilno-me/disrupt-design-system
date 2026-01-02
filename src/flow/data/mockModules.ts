/**
 * Mock Module Data - Sample modules for Storybook stories and testing
 *
 * Provides realistic sample data matching the EMEX module structure.
 */

import type { ModuleItem, EntityTemplateInfo, ModulePermissions } from '../components/modules/ModuleCard'
import type { ModuleStatus } from '../components/modules/helpers'
import type {
  ProcessDefinitionItem,
  FormTemplateItem,
  FormMappingItem,
  UserGroupItem,
} from '../components/modules/tabs'

// =============================================================================
// ENTITY TEMPLATES
// =============================================================================

export const mockEntityTemplates: Record<string, EntityTemplateInfo[]> = {
  incidents: [
    { id: 'et-001', name: 'Incident', code: 'incident' },
    { id: 'et-002', name: 'Investigation', code: 'investigation' },
    { id: 'et-003', name: 'RCA', code: 'rca' },
  ],
  correctiveActions: [
    { id: 'et-004', name: 'Corrective Action', code: 'corrective-action' },
    { id: 'et-005', name: 'CAPA', code: 'capa' },
  ],
  inspections: [
    { id: 'et-006', name: 'Inspection', code: 'inspection' },
    { id: 'et-007', name: 'Checklist', code: 'checklist' },
    { id: 'et-008', name: 'Audit', code: 'audit' },
  ],
  permits: [
    { id: 'et-009', name: 'Work Permit', code: 'work-permit' },
  ],
  users: [
    { id: 'et-010', name: 'User', code: 'user' },
    { id: 'et-011', name: 'Role', code: 'role' },
  ],
}

// =============================================================================
// MOCK MODULES
// =============================================================================

export const mockModules: ModuleItem[] = [
  {
    id: 'mod-001',
    name: 'Incident Management',
    code: 'carus-incident-management',
    version: '2.1.0',
    status: 'active',
    createdAt: new Date('2024-06-15T10:30:00Z'),
    updatedAt: new Date('2025-01-10T14:22:00Z'),
    entityTemplates: mockEntityTemplates.incidents,
    primaryEntityTemplate: mockEntityTemplates.incidents[0],
  },
  {
    id: 'mod-002',
    name: 'Corrective Actions',
    code: 'carus-corrective-actions',
    version: '1.5.2',
    status: 'active',
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2025-01-08T09:45:00Z'),
    entityTemplates: mockEntityTemplates.correctiveActions,
    primaryEntityTemplate: mockEntityTemplates.correctiveActions[0],
  },
  {
    id: 'mod-003',
    name: 'Inspections & Audits',
    code: 'flow-inspections',
    version: '3.0.0',
    status: 'active',
    createdAt: new Date('2024-03-10T16:00:00Z'),
    updatedAt: new Date('2025-01-05T11:30:00Z'),
    entityTemplates: mockEntityTemplates.inspections,
    primaryEntityTemplate: mockEntityTemplates.inspections[0],
  },
  {
    id: 'mod-004',
    name: 'Permit to Work',
    code: 'flow-permits',
    version: '1.0.0',
    status: 'draft',
    createdAt: new Date('2024-12-01T09:00:00Z'),
    updatedAt: new Date('2024-12-20T15:45:00Z'),
    entityTemplates: mockEntityTemplates.permits,
    primaryEntityTemplate: mockEntityTemplates.permits[0],
  },
  {
    id: 'mod-005',
    name: 'User Management',
    code: 'core-users',
    version: '4.2.1',
    status: 'active',
    createdAt: new Date('2023-01-15T12:00:00Z'),
    updatedAt: new Date('2025-01-12T08:00:00Z'),
    entityTemplates: mockEntityTemplates.users,
    primaryEntityTemplate: mockEntityTemplates.users[0],
  },
  {
    id: 'mod-006',
    name: 'Legacy Reporting',
    code: 'legacy-reports',
    version: '1.8.5',
    status: 'inactive',
    createdAt: new Date('2022-06-01T10:00:00Z'),
    updatedAt: new Date('2024-06-01T10:00:00Z'),
    entityTemplates: [],
    primaryEntityTemplate: undefined,
  },
  {
    id: 'mod-007',
    name: 'Risk Assessment',
    code: 'flow-risk-assessment',
    version: '0.9.0',
    status: 'draft',
    createdAt: new Date('2024-11-15T14:30:00Z'),
    updatedAt: new Date('2024-12-28T16:20:00Z'),
    entityTemplates: [
      { id: 'et-012', name: 'Risk Assessment', code: 'risk-assessment' },
      { id: 'et-013', name: 'Control Measure', code: 'control-measure' },
    ],
    primaryEntityTemplate: { id: 'et-012', name: 'Risk Assessment', code: 'risk-assessment' },
  },
  {
    id: 'mod-008',
    name: 'Training & Certification',
    code: 'flow-training',
    version: '2.0.0',
    status: 'active',
    createdAt: new Date('2024-08-01T09:00:00Z'),
    updatedAt: new Date('2025-01-11T10:15:00Z'),
    entityTemplates: [
      { id: 'et-014', name: 'Training Course', code: 'training-course' },
      { id: 'et-015', name: 'Certification', code: 'certification' },
      { id: 'et-016', name: 'Training Record', code: 'training-record' },
    ],
    primaryEntityTemplate: { id: 'et-014', name: 'Training Course', code: 'training-course' },
  },
]

// =============================================================================
// PERMISSION PRESETS
// =============================================================================

export const fullPermissions: ModulePermissions = {
  canView: true,
  canEdit: true,
  canToggleStatus: true,
  canCreateEntity: true,
}

export const viewOnlyPermissions: ModulePermissions = {
  canView: true,
  canEdit: false,
  canToggleStatus: false,
  canCreateEntity: false,
}

export const editorPermissions: ModulePermissions = {
  canView: true,
  canEdit: true,
  canToggleStatus: false,
  canCreateEntity: true,
}

export const noPermissions: ModulePermissions = {
  canView: false,
  canEdit: false,
  canToggleStatus: false,
  canCreateEntity: false,
}

// =============================================================================
// FILTER HELPERS
// =============================================================================

/**
 * Filter modules by status.
 */
export function filterModulesByStatus(modules: ModuleItem[], status: ModuleStatus | 'all'): ModuleItem[] {
  if (status === 'all') return modules
  return modules.filter((m) => m.status === status)
}

/**
 * Filter modules by search query (name or code).
 */
export function filterModulesBySearch(modules: ModuleItem[], query: string): ModuleItem[] {
  if (!query.trim()) return modules
  const lowerQuery = query.toLowerCase()
  return modules.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.code.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get modules by status for quick stats.
 */
export function getModuleStats(modules: ModuleItem[]) {
  return {
    total: modules.length,
    active: modules.filter((m) => m.status === 'active').length,
    inactive: modules.filter((m) => m.status === 'inactive').length,
    draft: modules.filter((m) => m.status === 'draft').length,
  }
}

// =============================================================================
// PROCESS DEFINITIONS
// Enhanced with EMEX fields: moduleId, deployedAt, flowableDeploymentId, isSystem, category
// =============================================================================

export const mockProcessDefinitions: ProcessDefinitionItem[] = [
  {
    id: 'pd-001',
    name: 'Incident Review Process',
    processDefinitionKey: 'incident-review-v1',
    description: 'Standard workflow for incident review and approval',
    version: 1,
    status: 'deployed',
    moduleId: 'mod-001',
    deployedAt: new Date('2024-08-20T10:00:00Z'),
    flowableDeploymentId: 'flowable-dep-001',
    isSystem: false,
    category: 'review',
    createdAt: new Date('2024-08-15T10:00:00Z'),
    updatedAt: new Date('2025-01-05T14:30:00Z'),
  },
  {
    id: 'pd-002',
    name: 'Investigation Workflow',
    processDefinitionKey: 'investigation-workflow-v2',
    description: 'Multi-stage investigation process with escalation',
    version: 2,
    status: 'deployed',
    moduleId: 'mod-001',
    deployedAt: new Date('2024-06-25T09:00:00Z'),
    flowableDeploymentId: 'flowable-dep-002',
    isSystem: false,
    category: 'investigation',
    createdAt: new Date('2024-06-20T09:00:00Z'),
    updatedAt: new Date('2024-12-15T11:45:00Z'),
  },
  {
    id: 'pd-003',
    name: 'Root Cause Analysis',
    processDefinitionKey: 'rca-process',
    description: 'RCA workflow with 5-why methodology',
    version: 1,
    status: 'draft',
    moduleId: 'mod-001',
    isSystem: false,
    category: 'analysis',
    createdAt: new Date('2024-12-01T08:00:00Z'),
    updatedAt: new Date('2024-12-20T16:00:00Z'),
  },
  {
    id: 'pd-004',
    name: 'Approval Process',
    processDefinitionKey: 'approval-chain',
    version: 3,
    status: 'suspended',
    moduleId: 'mod-001',
    deployedAt: new Date('2024-03-15T12:00:00Z'),
    flowableDeploymentId: 'flowable-dep-003',
    isSystem: true,
    category: 'approval',
    createdAt: new Date('2024-03-10T12:00:00Z'),
    updatedAt: new Date('2024-11-30T09:15:00Z'),
  },
  {
    id: 'pd-005',
    name: 'Corrective Action Workflow',
    processDefinitionKey: 'corrective-action-workflow',
    description: 'Full CAPA lifecycle: assignment, completion, extension, closure approval',
    version: 1,
    status: 'deployed',
    moduleId: 'mod-002',
    deployedAt: new Date('2024-07-25T10:00:00Z'),
    flowableDeploymentId: 'flowable-dep-005',
    isSystem: false,
    category: 'approval',
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2025-01-08T09:45:00Z'),
  },
]

// =============================================================================
// FORM TEMPLATES
// Enhanced with EMEX fields: moduleId, entityTemplateCode, category, isSystem
// =============================================================================

export const mockFormTemplates: FormTemplateItem[] = [
  {
    id: 'ft-001',
    name: 'Incident Report Form',
    code: 'incident-report',
    description: 'Primary form for capturing incident details',
    version: 3,
    status: 'published',
    moduleId: 'mod-001',
    entityTemplateCode: 'incident',
    category: 'main',
    fieldCount: 24,
    isSystem: false,
    createdAt: new Date('2024-04-01T10:00:00Z'),
    updatedAt: new Date('2025-01-08T09:00:00Z'),
  },
  {
    id: 'ft-002',
    name: 'Investigation Form',
    code: 'investigation-form',
    description: 'Detailed investigation data capture',
    version: 2,
    status: 'published',
    moduleId: 'mod-001',
    entityTemplateCode: 'investigation',
    category: 'main',
    fieldCount: 32,
    isSystem: false,
    createdAt: new Date('2024-05-15T11:00:00Z'),
    updatedAt: new Date('2024-12-20T14:30:00Z'),
  },
  {
    id: 'ft-003',
    name: 'Quick Report Form',
    code: 'quick-report',
    description: 'Simplified form for mobile reporting',
    version: 1,
    status: 'draft',
    moduleId: 'mod-001',
    entityTemplateCode: 'incident',
    category: 'mobile',
    fieldCount: 8,
    isSystem: false,
    createdAt: new Date('2024-11-01T09:00:00Z'),
    updatedAt: new Date('2024-12-15T10:00:00Z'),
  },
  {
    id: 'ft-004',
    name: 'Legacy Form v1',
    code: 'legacy-form-v1',
    version: 1,
    status: 'archived',
    moduleId: 'mod-001',
    fieldCount: 45,
    isSystem: false,
    createdAt: new Date('2022-01-15T08:00:00Z'),
    updatedAt: new Date('2023-06-01T12:00:00Z'),
  },
  {
    id: 'ft-005',
    name: 'Corrective Action Main Form',
    code: 'corrective-action-main',
    description: 'Create new corrective action with full details',
    version: 2,
    status: 'published',
    moduleId: 'mod-002',
    entityTemplateCode: 'corrective-action',
    category: 'main',
    fieldCount: 18,
    isSystem: false,
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2025-01-08T09:45:00Z'),
  },
  {
    id: 'ft-006',
    name: 'Complete Action Item',
    code: 'complete-action-item',
    description: 'Workflow form for completing corrective actions',
    version: 1,
    status: 'published',
    moduleId: 'mod-002',
    entityTemplateCode: 'corrective-action',
    category: 'workflow',
    fieldCount: 6,
    isSystem: true,
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
  {
    id: 'ft-007',
    name: 'Approve Action Closure',
    code: 'approve-action-closure',
    description: 'Workflow form for safety manager approval',
    version: 1,
    status: 'published',
    moduleId: 'mod-002',
    entityTemplateCode: 'corrective-action',
    category: 'workflow',
    fieldCount: 3,
    isSystem: true,
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
]

// =============================================================================
// FORM MAPPINGS
// =============================================================================

export const mockFormMappings: FormMappingItem[] = [
  {
    id: 'fm-001',
    name: 'Incident to Report Form',
    formName: 'Incident Report Form',
    formId: 'ft-001',
    targetName: 'Incident',
    targetId: 'et-001',
    mappingType: 'entity',
    description: 'Maps incident report form to incident entity',
    isActive: true,
    createdAt: new Date('2024-04-01T11:00:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
  {
    id: 'fm-002',
    name: 'Investigation to Workflow',
    formName: 'Investigation Form',
    formId: 'ft-002',
    targetName: 'Investigation Workflow',
    targetId: 'pd-002',
    mappingType: 'workflow',
    description: 'Triggers investigation workflow on form submission',
    isActive: true,
    createdAt: new Date('2024-06-20T09:30:00Z'),
    updatedAt: new Date('2024-11-15T14:00:00Z'),
  },
  {
    id: 'fm-003',
    name: 'Quick Report to Incident',
    formName: 'Quick Report Form',
    formId: 'ft-003',
    targetName: 'Incident',
    targetId: 'et-001',
    mappingType: 'entity',
    isActive: false,
    createdAt: new Date('2024-11-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T09:00:00Z'),
  },
]

// =============================================================================
// USER GROUPS
// Enhanced with EMEX fields: code (for BPMN candidate groups), moduleId
// =============================================================================

export const mockUserGroups: UserGroupItem[] = [
  {
    id: 'ug-001',
    name: 'Module Administrators',
    code: 'incident-management-admin',
    description: 'Full administrative access to the module',
    moduleId: 'mod-001',
    userCount: 5,
    accessLevel: 'admin',
    isSystemGroup: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-12-01T09:00:00Z'),
  },
  {
    id: 'ug-002',
    name: 'Incident Reporters',
    code: 'incident-management-reporter',
    description: 'Users who can create and edit incidents',
    moduleId: 'mod-001',
    userCount: 42,
    accessLevel: 'edit',
    isSystemGroup: false,
    createdAt: new Date('2024-02-01T11:00:00Z'),
    updatedAt: new Date('2025-01-05T08:30:00Z'),
  },
  {
    id: 'ug-003',
    name: 'Viewers',
    code: 'incident-management-viewer',
    description: 'Read-only access to module data',
    moduleId: 'mod-001',
    userCount: 128,
    accessLevel: 'view',
    isSystemGroup: false,
    createdAt: new Date('2024-02-15T14:00:00Z'),
    updatedAt: new Date('2024-11-20T10:00:00Z'),
  },
  {
    id: 'ug-004',
    name: 'System Admins',
    code: 'system-admin',
    description: 'Global system administrators',
    userCount: 3,
    accessLevel: 'admin',
    isSystemGroup: true,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-06-15T12:00:00Z'),
  },
  {
    id: 'ug-005',
    name: 'Safety Managers',
    code: 'corrective-actions-safety-manager',
    description: 'Approve corrective action closures and extensions',
    moduleId: 'mod-002',
    userCount: 8,
    accessLevel: 'admin',
    isSystemGroup: false,
    createdAt: new Date('2024-03-01T09:00:00Z'),
    updatedAt: new Date('2025-01-10T14:00:00Z'),
  },
  {
    id: 'ug-006',
    name: 'Action Owners',
    code: 'corrective-actions-owner',
    description: 'Complete and submit corrective actions',
    moduleId: 'mod-002',
    userCount: 35,
    accessLevel: 'edit',
    isSystemGroup: false,
    createdAt: new Date('2024-03-01T09:00:00Z'),
    updatedAt: new Date('2025-01-08T11:00:00Z'),
  },
]

// =============================================================================
// PROCESS TRIGGERS (EntityActionProcessTrigger)
// Auto-start workflows when entities are created/updated
// Uses Handlebars templates for variable mapping ({{entity.field}})
// =============================================================================

export interface ProcessTriggerItem {
  id: string
  name: string
  description?: string
  moduleId?: string
  entityTemplateCode: string
  entityTemplateName?: string
  triggerAction: 'create' | 'update'
  conditionExpression?: string
  processDefinitionKey: string
  processDefinitionName?: string
  variableMappings: Array<{
    processVariable: string
    sourceTemplate: string
    description?: string
  }>
  isActive: boolean
  isSystem?: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export const mockProcessTriggers: ProcessTriggerItem[] = [
  {
    id: 'pt-001',
    name: 'Start Incident Review',
    description: 'Automatically start review workflow when incident is created',
    moduleId: 'mod-001',
    entityTemplateCode: 'incident',
    entityTemplateName: 'Incident',
    triggerAction: 'create',
    processDefinitionKey: 'incident-review-v1',
    processDefinitionName: 'Incident Review Process',
    variableMappings: [
      { processVariable: 'incidentId', sourceTemplate: '{{entity.id}}' },
      { processVariable: 'title', sourceTemplate: '{{entity.title}}' },
      { processVariable: 'severity', sourceTemplate: '{{entity.severity}}' },
      { processVariable: 'assignee', sourceTemplate: '{{form.assignedTo}}' },
    ],
    isActive: true,
    isSystem: false,
    createdAt: new Date('2024-08-15T10:00:00Z'),
    updatedAt: new Date('2025-01-05T14:30:00Z'),
  },
  {
    id: 'pt-002',
    name: 'Start Corrective Action Workflow',
    description: 'Auto-start CAPA workflow when corrective action is created',
    moduleId: 'mod-002',
    entityTemplateCode: 'corrective-action',
    entityTemplateName: 'Corrective Action',
    triggerAction: 'create',
    processDefinitionKey: 'corrective-action-workflow',
    processDefinitionName: 'Corrective Action Workflow',
    variableMappings: [
      { processVariable: 'actionId', sourceTemplate: '{{entity.id}}', description: 'Entity UUID' },
      { processVariable: 'businessKey', sourceTemplate: '{{entity.businessKey}}', description: 'CA-{num} format' },
      { processVariable: 'title', sourceTemplate: '{{entity.title}}' },
      { processVariable: 'dueDate', sourceTemplate: '{{entity.due_date}}' },
      { processVariable: 'actionOwnerId', sourceTemplate: '{{entity.action_owner_id}}', description: 'Assigned user' },
      { processVariable: 'priority', sourceTemplate: '{{entity.priority}}' },
    ],
    isActive: true,
    isSystem: true,
    createdAt: new Date('2024-07-20T08:15:00Z'),
    updatedAt: new Date('2025-01-08T09:45:00Z'),
  },
  {
    id: 'pt-003',
    name: 'Escalation Trigger',
    description: 'Trigger escalation workflow when high-severity incident is updated',
    moduleId: 'mod-001',
    entityTemplateCode: 'incident',
    entityTemplateName: 'Incident',
    triggerAction: 'update',
    conditionExpression: '{{entity.severity}} == "critical"',
    processDefinitionKey: 'investigation-workflow-v2',
    processDefinitionName: 'Investigation Workflow',
    variableMappings: [
      { processVariable: 'incidentId', sourceTemplate: '{{entity.id}}' },
      { processVariable: 'escalationReason', sourceTemplate: 'Critical severity update' },
    ],
    isActive: false,
    isSystem: false,
    createdAt: new Date('2024-10-01T09:00:00Z'),
    updatedAt: new Date('2024-12-15T11:00:00Z'),
  },
]
