/**
 * Entity Template Seed Data
 *
 * Mock data for entity templates (form schemas) used in the system.
 * Supports incidents, inspections, audits, corrective actions, permits, training.
 */

import type { EntityTemplate } from '../../../flow/components/entity-templates'

/**
 * Entity template categories
 */
export type EntityTemplateCategory =
  | 'incident'
  | 'inspection'
  | 'audit'
  | 'corrective_action'
  | 'permit'
  | 'training'
  | 'custom'

/**
 * Seed entity templates
 * Demonstrates various template types with JSON schemas
 */
export const seedEntityTemplates: EntityTemplate[] = [
  // Incidents
  {
    id: 'inc-1',
    name: 'Incident Report',
    code: 'incident',
    category: 'incident',
    version: 1,
    isSystem: true,
    businessKeyTemplate: 'INC-{{entity.rowNum}}',
    jsonSchema: '{"type": "object", "title": "Incident Report", "required": ["title", "incident_date", "location", "severity"], "properties": {"title": {"type": "string", "title": "Incident Title"}, "description": {"type": "string", "title": "Description"}, "incident_date": {"type": "string", "format": "date-time", "title": "Incident Date/Time"}, "location": {"type": "string", "title": "Location"}, "severity": {"type": "string", "enum": ["minor", "moderate", "major", "critical"], "title": "Severity"}}}',
    createdAt: '2025-12-01T10:00:00Z',
    description: 'General incident reporting form',
    fieldCount: 6,
  },
  {
    id: 'inc-2',
    name: 'Near Miss Report',
    code: 'near-miss',
    category: 'incident',
    version: 1,
    isSystem: false,
    jsonSchema: '{"type": "object", "title": "Near Miss", "properties": {"description": {"type": "string"}}}',
    createdAt: '2025-12-05T10:00:00Z',
    description: 'Report potential hazards that could have caused an incident',
    fieldCount: 4,
  },
  // Inspections
  {
    id: 'insp-1',
    name: 'Safety Inspection',
    code: 'safety-inspection',
    category: 'inspection',
    version: 2,
    isSystem: true,
    businessKeyTemplate: 'SI-{{date}}-{{sequence}}',
    jsonSchema: '{"type": "object", "title": "Inspection Checklist", "required": ["inspection_type", "inspector", "inspection_date"], "properties": {"inspection_type": {"type": "string", "enum": ["safety", "quality", "environmental", "compliance"], "title": "Inspection Type"}, "inspector": {"type": "string", "title": "Inspector Name"}, "inspection_date": {"type": "string", "format": "date", "title": "Inspection Date"}}}',
    createdAt: '2025-11-15T14:30:00Z',
    updatedAt: '2025-12-10T09:15:00Z',
    description: 'Workplace safety inspection checklist',
    fieldCount: 4,
  },
  // Audits
  {
    id: 'aud-1',
    name: 'Environmental Audit',
    code: 'environmental-audit',
    category: 'audit',
    version: 1,
    isSystem: false,
    jsonSchema: '{"type": "object", "title": "Environmental Audit", "properties": {"audit_type": {"type": "string"}, "findings": {"type": "string"}}}',
    createdAt: '2025-12-05T11:00:00Z',
    description: 'Environmental compliance audit form',
    fieldCount: 2,
  },
  // Corrective Actions
  {
    id: 'ca-1',
    name: 'Corrective Action',
    code: 'corrective-action',
    category: 'corrective_action',
    version: 1,
    isSystem: true,
    businessKeyTemplate: 'CA-{{entity.rowNum}}',
    jsonSchema: '{"type": "object", "title": "Corrective Action", "required": ["title", "description", "due_date", "status", "priority"], "properties": {"title": {"type": "string", "title": "Title"}, "description": {"type": "string", "title": "Description"}, "due_date": {"type": "string", "format": "date", "title": "Due Date"}, "status": {"type": "string", "enum": ["open", "in_progress", "completed", "overdue"], "title": "Status"}, "priority": {"type": "string", "enum": ["low", "medium", "high", "critical"], "title": "Priority"}}}',
    createdAt: '2025-12-01T10:00:00Z',
    description: 'Standard CAPA workflow template',
    fieldCount: 7,
  },
  // Permits
  {
    id: 'perm-1',
    name: 'Hot Work Permit',
    code: 'hot-work-permit',
    category: 'permit',
    version: 1,
    isSystem: true,
    businessKeyTemplate: 'HWP-{{date}}-{{sequence}}',
    jsonSchema: '{"type": "object", "title": "Hot Work Permit", "required": ["work_type", "location", "start_date", "fire_watch"], "properties": {"work_type": {"type": "string", "enum": ["welding", "cutting", "brazing", "grinding"], "title": "Work Type"}, "location": {"type": "string", "title": "Location"}, "start_date": {"type": "string", "format": "date-time", "title": "Start Date/Time"}, "fire_watch": {"type": "string", "title": "Fire Watch Personnel"}}}',
    createdAt: '2025-12-02T09:00:00Z',
    description: 'Permit for welding, cutting, and other hot work',
    fieldCount: 5,
  },
  // Training
  {
    id: 'train-1',
    name: 'Training Record',
    code: 'training-record',
    category: 'training',
    version: 1,
    isSystem: false,
    businessKeyTemplate: 'TR-{{code}}-{{id}}',
    jsonSchema: '{"type": "object", "title": "Training Record", "required": ["employee_name", "training_type", "completion_date"], "properties": {"employee_name": {"type": "string", "title": "Employee Name"}, "training_type": {"type": "string", "title": "Training Type"}, "completion_date": {"type": "string", "format": "date", "title": "Completion Date"}, "score": {"type": "number", "minimum": 0, "maximum": 100, "title": "Score"}}}',
    createdAt: '2025-12-08T16:45:00Z',
    description: 'Employee training completion record',
    fieldCount: 5,
  },
  // Custom
  {
    id: 'custom-1',
    name: 'Custom Form Template',
    code: 'custom-form',
    category: 'custom',
    version: 1,
    isSystem: false,
    jsonSchema: '{"type": "object", "title": "Custom Form", "properties": {"custom_field": {"type": "string", "title": "Custom Field"}}}',
    createdAt: '2025-12-10T14:00:00Z',
    description: 'User-defined custom form template',
    fieldCount: 1,
  },
]

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: EntityTemplateCategory): EntityTemplate[] {
  return seedEntityTemplates.filter((t) => t.category === category)
}

/**
 * Get system templates only
 */
export function getSystemTemplates(): EntityTemplate[] {
  return seedEntityTemplates.filter((t) => t.isSystem)
}

/**
 * Get custom templates only
 */
export function getCustomTemplates(): EntityTemplate[] {
  return seedEntityTemplates.filter((t) => !t.isSystem)
}

/**
 * Get template by code
 */
export function getTemplateByCode(code: string): EntityTemplate | undefined {
  return seedEntityTemplates.find((t) => t.code === code)
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EntityTemplate | undefined {
  return seedEntityTemplates.find((t) => t.id === id)
}

/**
 * Get template count by category
 */
export function getTemplateCounts(): Record<EntityTemplateCategory, number> {
  return seedEntityTemplates.reduce(
    (acc, t) => {
      acc[t.category as EntityTemplateCategory] = (acc[t.category as EntityTemplateCategory] || 0) + 1
      return acc
    },
    {} as Record<EntityTemplateCategory, number>
  )
}
