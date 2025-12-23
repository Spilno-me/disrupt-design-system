/**
 * Dashboard Edit Mode Components
 *
 * Provides drag-and-drop editing, widget configuration,
 * and layout management for dashboards.
 */

// Context & Provider
export {
  DashboardEditProvider,
  useDashboardEdit,
  useDashboardEditOptional,
} from './DashboardEditContext'
export type {
  WidgetSize,
  WidgetConfig,
  DashboardLayout,
  DashboardEditContextValue,
} from './DashboardEditContext'

// Editable Widget Wrapper
export { EditableWidget, ReorderableWidget } from './EditableWidget'
export type { EditableWidgetProps, ReorderableWidgetProps } from './EditableWidget'

// Reorderable Section
export { ReorderableSection, WidgetDropZone } from './ReorderableSection'
export type { ReorderableSectionProps, WidgetDropZoneProps } from './ReorderableSection'

// Toolbar
export { EditModeToolbar, EditModeToggle } from './EditModeToolbar'
export type { EditModeToolbarProps, WidgetCatalogItem } from './EditModeToolbar'

// Settings Panel
export { WidgetSettingsPanel } from './WidgetSettingsPanel'
export type { WidgetSettingsPanelProps } from './WidgetSettingsPanel'
