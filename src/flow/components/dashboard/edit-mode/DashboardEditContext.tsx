/**
 * Dashboard Edit Context
 *
 * Provides edit mode state and methods for dashboard customization.
 * Manages widget positions, visibility, and configuration.
 */
import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2'

export interface WidgetConfig {
  id: string
  type: string
  title: string
  visible: boolean
  size: WidgetSize
  order: number
  section: string
  settings?: Record<string, unknown>
}

export interface DashboardLayout {
  id: string
  name: string
  widgets: WidgetConfig[]
  createdAt: Date
  updatedAt: Date
}

export interface DashboardEditContextValue {
  // State
  isEditMode: boolean
  hasUnsavedChanges: boolean
  widgets: WidgetConfig[]
  selectedWidgetId: string | null
  draggedWidgetId: string | null

  // Edit Mode Controls
  enterEditMode: () => void
  exitEditMode: () => void
  saveChanges: () => void
  discardChanges: () => void

  // Widget Operations
  selectWidget: (id: string | null) => void
  setDraggedWidget: (id: string | null) => void
  reorderWidgets: (sectionId: string, newOrder: string[]) => void
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void
  removeWidget: (id: string) => void
  duplicateWidget: (id: string) => void
  addWidget: (widget: Omit<WidgetConfig, 'id' | 'order'>) => void
  toggleWidgetVisibility: (id: string) => void
  resizeWidget: (id: string, size: WidgetSize) => void

  // Layout Management
  layouts: DashboardLayout[]
  activeLayoutId: string | null
  saveLayout: (name: string) => void
  loadLayout: (id: string) => void
  deleteLayout: (id: string) => void
}

// =============================================================================
// CONTEXT
// =============================================================================

const DashboardEditContext = createContext<DashboardEditContextValue | null>(null)

// =============================================================================
// HOOK
// =============================================================================

export function useDashboardEdit() {
  const context = useContext(DashboardEditContext)
  if (!context) {
    throw new Error('useDashboardEdit must be used within a DashboardEditProvider')
  }
  return context
}

// Optional hook that doesn't throw if context is missing
export function useDashboardEditOptional() {
  return useContext(DashboardEditContext)
}

// =============================================================================
// PROVIDER
// =============================================================================

interface DashboardEditProviderProps {
  children: React.ReactNode
  initialWidgets?: WidgetConfig[]
  onSave?: (widgets: WidgetConfig[]) => void
  onLayoutSave?: (layout: DashboardLayout) => void
}

export function DashboardEditProvider({
  children,
  initialWidgets = [],
  onSave,
  onLayoutSave,
}: DashboardEditProviderProps) {
  // Core state
  const [isEditMode, setIsEditMode] = useState(false)
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets)
  const [originalWidgets, setOriginalWidgets] = useState<WidgetConfig[]>(initialWidgets)
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null)

  // Layout state
  const [layouts, setLayouts] = useState<DashboardLayout[]>([])
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null)

  // Derived state
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(widgets) !== JSON.stringify(originalWidgets)
  }, [widgets, originalWidgets])

  // Edit mode controls
  const enterEditMode = useCallback(() => {
    setOriginalWidgets([...widgets])
    setIsEditMode(true)
  }, [widgets])

  const exitEditMode = useCallback(() => {
    setIsEditMode(false)
    setSelectedWidgetId(null)
    setDraggedWidgetId(null)
  }, [])

  const saveChanges = useCallback(() => {
    setOriginalWidgets([...widgets])
    onSave?.(widgets)
    exitEditMode()
  }, [widgets, onSave, exitEditMode])

  const discardChanges = useCallback(() => {
    setWidgets([...originalWidgets])
    exitEditMode()
  }, [originalWidgets, exitEditMode])

  // Widget operations
  const selectWidget = useCallback((id: string | null) => {
    setSelectedWidgetId(id)
  }, [])

  const setDraggedWidget = useCallback((id: string | null) => {
    setDraggedWidgetId(id)
  }, [])

  const reorderWidgets = useCallback((sectionId: string, newOrder: string[]) => {
    setWidgets(prev => {
      const sectionWidgets = prev.filter(w => w.section === sectionId)
      const otherWidgets = prev.filter(w => w.section !== sectionId)

      const reorderedSection = newOrder.map((id, index) => {
        const widget = sectionWidgets.find(w => w.id === id)
        return widget ? { ...widget, order: index } : null
      }).filter(Boolean) as WidgetConfig[]

      return [...otherWidgets, ...reorderedSection]
    })
  }, [])

  const updateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates } : w))
    )
  }, [])

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id))
    if (selectedWidgetId === id) {
      setSelectedWidgetId(null)
    }
  }, [selectedWidgetId])

  const duplicateWidget = useCallback((id: string) => {
    setWidgets(prev => {
      const widget = prev.find(w => w.id === id)
      if (!widget) return prev

      const newWidget: WidgetConfig = {
        ...widget,
        id: `${widget.type}-${Date.now()}`,
        title: `${widget.title} (Copy)`,
        order: prev.filter(w => w.section === widget.section).length,
      }

      return [...prev, newWidget]
    })
  }, [])

  const addWidget = useCallback((widget: Omit<WidgetConfig, 'id' | 'order'>) => {
    setWidgets(prev => {
      const sectionCount = prev.filter(w => w.section === widget.section).length
      const newWidget: WidgetConfig = {
        ...widget,
        id: `${widget.type}-${Date.now()}`,
        order: sectionCount,
      }
      return [...prev, newWidget]
    })
  }, [])

  const toggleWidgetVisibility = useCallback((id: string) => {
    setWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, visible: !w.visible } : w))
    )
  }, [])

  const resizeWidget = useCallback((id: string, size: WidgetSize) => {
    setWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    )
  }, [])

  // Layout management
  const saveLayout = useCallback((name: string) => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name,
      widgets: [...widgets],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLayouts(prev => [...prev, newLayout])
    setActiveLayoutId(newLayout.id)
    onLayoutSave?.(newLayout)
  }, [widgets, onLayoutSave])

  const loadLayout = useCallback((id: string) => {
    const layout = layouts.find(l => l.id === id)
    if (layout) {
      setWidgets([...layout.widgets])
      setOriginalWidgets([...layout.widgets])
      setActiveLayoutId(id)
    }
  }, [layouts])

  const deleteLayout = useCallback((id: string) => {
    setLayouts(prev => prev.filter(l => l.id !== id))
    if (activeLayoutId === id) {
      setActiveLayoutId(null)
    }
  }, [activeLayoutId])

  // Context value
  const value = useMemo<DashboardEditContextValue>(() => ({
    // State
    isEditMode,
    hasUnsavedChanges,
    widgets,
    selectedWidgetId,
    draggedWidgetId,

    // Edit Mode Controls
    enterEditMode,
    exitEditMode,
    saveChanges,
    discardChanges,

    // Widget Operations
    selectWidget,
    setDraggedWidget,
    reorderWidgets,
    updateWidget,
    removeWidget,
    duplicateWidget,
    addWidget,
    toggleWidgetVisibility,
    resizeWidget,

    // Layout Management
    layouts,
    activeLayoutId,
    saveLayout,
    loadLayout,
    deleteLayout,
  }), [
    isEditMode,
    hasUnsavedChanges,
    widgets,
    selectedWidgetId,
    draggedWidgetId,
    enterEditMode,
    exitEditMode,
    saveChanges,
    discardChanges,
    selectWidget,
    setDraggedWidget,
    reorderWidgets,
    updateWidget,
    removeWidget,
    duplicateWidget,
    addWidget,
    toggleWidgetVisibility,
    resizeWidget,
    layouts,
    activeLayoutId,
    saveLayout,
    loadLayout,
    deleteLayout,
  ])

  return (
    <DashboardEditContext.Provider value={value}>
      {children}
    </DashboardEditContext.Provider>
  )
}
