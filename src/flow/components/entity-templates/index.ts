/**
 * Entity Templates Module
 *
 * Configuration pages for managing entity templates that define
 * the structure and validation rules for entities.
 */

// Page components
export { EntityTemplatesPage } from './EntityTemplatesPage'
export { EditTemplatePage, CreateTemplatePage } from './pages'

// Table component
export { EntityTemplatesTable } from './table/EntityTemplatesTable'

// Sidebar components
export { TemplateCategorySidebar, TemplateCategoryCard } from './sidebar'

// Mobile components
export { EntityTemplateCard, MobileTemplateCategorySheet } from './mobile'

// Dialog components
export { ViewTemplateDialog } from './dialogs/ViewTemplateDialog'
export { EditTemplateDialog } from './dialogs/EditTemplateDialog'
export { CreateTemplateDialog } from './dialogs/CreateTemplateDialog'
export { DeleteTemplateDialog } from './dialogs/DeleteTemplateDialog'

// Panel components (non-modal) - kept for backwards compatibility
export { EditTemplatePanel, EditTemplatePane } from './panels'

// Types
export type {
  EntityTemplate,
  TemplateType,
  TemplateTypeFilter,
  TemplateCategory,
  TemplateCategoryInfo,
  CategoryColor,
  CreateTemplateFormData,
  EditTemplateFormData,
  EntityTemplatesPageProps,
  EditTemplatePageProps,
  CreateTemplatePageProps,
  EntityTemplatesTableProps,
  ViewTemplateDialogProps,
  EditTemplateDialogProps,
  EditTemplatePanelProps,
  CreateTemplateDialogProps,
  DeleteTemplateDialogProps,
} from './types'

// Constants and utilities
export {
  TEMPLATE_TYPE_CONFIG,
  TEMPLATE_CATEGORIES,
  DEFAULT_JSON_SCHEMA,
  generateTemplateCode,
  validateTemplateName,
  validateJsonSchema,
  formatJson,
  getCategoryInfo,
} from './types'
