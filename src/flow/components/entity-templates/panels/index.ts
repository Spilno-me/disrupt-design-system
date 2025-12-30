/**
 * Entity Templates Panels
 *
 * Non-modal panel components for entity template management.
 */

// Sheet-based overlay panel (slides from right with backdrop)
export { EditTemplatePanel } from './EditTemplatePanel'
export type { EditTemplatePanelProps } from '../types'

// Inline pane for split-view layout (no overlay)
export { EditTemplatePane, type EditTemplatePaneProps } from './EditTemplatePane'
