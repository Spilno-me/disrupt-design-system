/**
 * Entity Templates Types
 *
 * TypeScript interfaces for the Entity Templates configuration page.
 * Entity templates define the structure and validation rules for entities.
 */

import type { ElementType } from 'react'
import {
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  Wrench,
  FileKey,
  GraduationCap,
  Layers,
} from 'lucide-react'

// =============================================================================
// TEMPLATE CATEGORIES
// =============================================================================

/** Template category for organization */
export type TemplateCategory =
  | 'incident'
  | 'inspection'
  | 'audit'
  | 'corrective_action'
  | 'permit'
  | 'training'
  | 'custom'

/**
 * Category color types - using DDS palette names
 * Each maps to a unique color from the design system
 */
export type CategoryColor =
  | 'coral'      // Red - CORAL palette (errors, incidents)
  | 'harbor'     // Green - HARBOR palette (success, inspections)
  | 'wave'       // Blue - WAVE palette (info, audits)
  | 'sunrise'    // Yellow - SUNRISE palette (warnings, actions)
  | 'orange'     // Orange - ORANGE palette (permits)
  | 'duskReef'   // Purple - DUSK_REEF palette (training)
  | 'deepCurrent' // Teal - DEEP_CURRENT palette (accent)
  | 'slate'      // Gray - SLATE palette (custom/neutral)

/** Category metadata for display */
export interface TemplateCategoryInfo {
  id: TemplateCategory
  name: string
  description: string
  icon: string
  color: CategoryColor
}

/** All available categories with metadata */
export const TEMPLATE_CATEGORIES: TemplateCategoryInfo[] = [
  {
    id: 'incident',
    name: 'Incidents',
    description: 'Incident reports and near-miss forms',
    icon: 'AlertTriangle',
    color: 'coral',
  },
  {
    id: 'inspection',
    name: 'Inspections',
    description: 'Safety inspections and checklists',
    icon: 'ClipboardCheck',
    color: 'harbor',
  },
  {
    id: 'audit',
    name: 'Audits',
    description: 'Compliance audits and assessments',
    icon: 'FileSearch',
    color: 'wave',
  },
  {
    id: 'corrective_action',
    name: 'Corrective Actions',
    description: 'CAPA and action tracking forms',
    icon: 'Wrench',
    color: 'sunrise',
  },
  {
    id: 'permit',
    name: 'Permits',
    description: 'Work permits and authorizations',
    icon: 'FileKey',
    color: 'orange',
  },
  {
    id: 'training',
    name: 'Training',
    description: 'Training records and certifications',
    icon: 'GraduationCap',
    color: 'duskReef',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'User-created custom templates',
    icon: 'Layers',
    color: 'slate',
  },
]

/** Get category info by ID */
export function getCategoryInfo(categoryId: TemplateCategory): TemplateCategoryInfo {
  return TEMPLATE_CATEGORIES.find((c) => c.id === categoryId) || TEMPLATE_CATEGORIES[TEMPLATE_CATEGORIES.length - 1]
}

// =============================================================================
// CATEGORY STYLING - Icons and Colors
// =============================================================================

/** Maps category IDs to their Lucide icon components */
export const CATEGORY_ICONS: Record<TemplateCategory, ElementType> = {
  incident: AlertTriangle,
  inspection: ClipboardCheck,
  audit: FileSearch,
  corrective_action: Wrench,
  permit: FileKey,
  training: GraduationCap,
  custom: Layers,
}

/**
 * Maps category IDs to their color classes
 * Uses DDS semantic tokens for lint compliance
 */
export const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  incident: 'bg-coral-100 text-coral-700 border-coral-200',
  inspection: 'bg-harbor-100 text-harbor-700 border-harbor-200',
  audit: 'bg-wave-100 text-wave-700 border-wave-200',
  corrective_action: 'bg-sunrise-100 text-sunrise-700 border-sunrise-200',
  permit: 'bg-aging-light text-aging-dark border-aging-light',
  training: 'bg-duskReef-100 text-duskReef-700 border-duskReef-200',
  custom: 'bg-muted-bg text-secondary border-default',
}

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

export type TemplateType = 'system' | 'custom'

export interface EntityTemplate {
  id: string
  /** Display name (e.g., "Corrective Action", "Incident Report") */
  name: string
  /** URL-safe code generated from name (e.g., "corrective-action", "incident") */
  code: string
  /** Category for organization */
  category: TemplateCategory
  /** Version number (incremented on updates) */
  version: number
  /** Whether this is a system-managed template */
  isSystem: boolean
  /** Optional template for generating business keys (e.g., "CA-{{entity.rowNum}}") */
  businessKeyTemplate?: string
  /** JSON Schema definition as a string */
  jsonSchema: string
  /** ISO timestamp of creation */
  createdAt: string
  /** ISO timestamp of last update */
  updatedAt?: string
  /** Optional description */
  description?: string
  /** Number of fields in the schema (computed) */
  fieldCount?: number
}

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface CreateTemplateFormData {
  /** Template name (letters and spaces only, 5-100 chars) */
  name: string
  /** Category for organization */
  category: TemplateCategory
  /** Optional business key template */
  businessKeyTemplate?: string
  /** JSON Schema string */
  jsonSchema: string
}

export interface EditTemplateFormData extends CreateTemplateFormData {
  id: string
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export type TemplateTypeFilter = 'all' | TemplateType

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface EntityTemplatesPageProps {
  /** Template data */
  templates: EntityTemplate[]
  /** Loading state */
  isLoading?: boolean

  // Category state (for URL sync)
  /** Initial category to select on mount (e.g., from URL param) */
  initialCategory?: TemplateCategory | 'all'
  /** Called when category selection changes (for URL sync) */
  onCategoryChange?: (category: TemplateCategory | 'all') => void

  // Navigation callbacks (for dedicated pages)
  /** Called when user clicks create - navigate to create page */
  onCreateNavigate?: () => void
  /** Called when user clicks edit - navigate to edit page */
  onEditNavigate?: (template: EntityTemplate) => void

  // CRUD callbacks
  onTemplateDelete?: (templateId: string) => Promise<void>
  /** Called when user clicks refresh */
  onRefresh?: () => Promise<void>
}

export interface EditTemplatePageProps {
  /** The template to edit */
  template: EntityTemplate
  /** Callback when template is saved */
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
  /** Callback to navigate back to list */
  onBack: () => void
  /** Optional loading state */
  isLoading?: boolean
}

export interface CreateTemplatePageProps {
  /** Callback when template is created */
  onSubmit?: (data: CreateTemplateFormData) => Promise<void>
  /** Callback to navigate back to list */
  onBack: () => void
  /** Optional loading state */
  isLoading?: boolean
  /** Pre-selected category (e.g., from list page filter) */
  initialCategory?: TemplateCategory
}

export interface EntityTemplatesTableProps {
  templates: EntityTemplate[]
  isLoading?: boolean
  currentPage: number
  pageSize: number
  sortColumn?: string
  sortDirection?: 'asc' | 'desc' | null
  onView: (template: EntityTemplate) => void
  onEdit?: (template: EntityTemplate) => void
  onDelete?: (template: EntityTemplate) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSortChange: (column: string, direction: 'asc' | 'desc' | null) => void
}

export interface ViewTemplateDialogProps {
  template: EntityTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface EditTemplateDialogProps {
  template: EntityTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
}

/** Props for the non-modal edit panel (slide-in sheet) */
export interface EditTemplatePanelProps {
  template: EntityTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
}

export interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: CreateTemplateFormData) => Promise<void>
}

export interface TemplateCategoryCardProps {
  /** Category metadata */
  category: TemplateCategoryInfo
  /** Number of templates in this category */
  count: number
  /** Whether this category is currently selected */
  isSelected?: boolean
  /** Click handler for category selection */
  onClick?: () => void
  /** Compact mode - icon only with tooltip (for collapsed sidebar) */
  isCompact?: boolean
  /** Disable the card (e.g., for empty categories) */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

export interface DeleteTemplateDialogProps {
  template: EntityTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (templateId: string) => Promise<void>
}

// =============================================================================
// STATUS DISPLAY HELPERS
// =============================================================================

export const TEMPLATE_TYPE_CONFIG: Record<
  TemplateType,
  { label: string; variant: 'destructive' | 'outline' }
> = {
  system: { label: 'System', variant: 'destructive' },
  custom: { label: 'Custom', variant: 'outline' },
}

// =============================================================================
// DEFAULT JSON SCHEMA
// =============================================================================

export const DEFAULT_JSON_SCHEMA = `{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title or name of the entity"
    },
    "description": {
      "type": "string",
      "description": "Detailed description"
    }
  },
  "required": [
    "title"
  ]
}`

// =============================================================================
// UTILITY FUNCTIONS (re-exported from utils.ts)
// =============================================================================

export {
  generateTemplateCode,
  validateTemplateName,
  validateJsonSchema,
  formatJson,
} from './utils'
