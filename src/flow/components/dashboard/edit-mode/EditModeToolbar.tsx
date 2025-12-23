/**
 * Edit Mode Toolbar
 *
 * Floating toolbar that appears when dashboard edit mode is active.
 * Provides save/cancel controls, layout presets, and add widget functionality.
 */
import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Save,
  X,
  RotateCcw,
  Plus,
  Layout,
  Check,
  AlertTriangle,
  Sparkles,
  BarChart3,
  ListTodo,
  Users,
  MapPin,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../../../../components/ui/dropdown-menu'
import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'
import { useDashboardEdit } from './DashboardEditContext'

// =============================================================================
// WIDGET CATALOG
// =============================================================================

export interface WidgetCatalogItem {
  type: string
  title: string
  description: string
  icon: React.ReactNode
  defaultSize: '1x1' | '2x1' | '1x2' | '2x2'
  category: 'kpi' | 'chart' | 'list' | 'analytics'
}

const defaultWidgetCatalog: WidgetCatalogItem[] = [
  {
    type: 'kpi',
    title: 'KPI Card',
    description: 'Single metric with trend indicator',
    icon: <Sparkles className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'kpi',
  },
  {
    type: 'breakdown',
    title: 'Breakdown Card',
    description: 'List with values and totals',
    icon: <BarChart3 className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'chart',
  },
  {
    type: 'trending',
    title: 'Trending Chart',
    description: 'Bar chart with trending items',
    icon: <TrendingUp className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'chart',
  },
  {
    type: 'tasks',
    title: 'Upcoming Tasks',
    description: 'Task list with due dates',
    icon: <ListTodo className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'list',
  },
  {
    type: 'workload',
    title: 'Workload Distribution',
    description: 'Team workload visualization',
    icon: <Users className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'analytics',
  },
  {
    type: 'heatmap',
    title: 'Risk Heatmap',
    description: 'Location-based risk levels',
    icon: <MapPin className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'analytics',
  },
  {
    type: 'aging',
    title: 'Aging Metrics',
    description: '30/60/90 day aging bars',
    icon: <Clock className="w-5 h-5" />,
    defaultSize: '1x1',
    category: 'chart',
  },
]

// =============================================================================
// TYPES
// =============================================================================

export interface EditModeToolbarProps {
  className?: string
  widgetCatalog?: WidgetCatalogItem[]
  onAddWidget?: (item: WidgetCatalogItem, section: string) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditModeToolbar({
  className,
  widgetCatalog = defaultWidgetCatalog,
  onAddWidget,
}: EditModeToolbarProps) {
  const {
    isEditMode,
    hasUnsavedChanges,
    saveChanges,
    discardChanges,
    layouts,
    saveLayout,
    loadLayout,
    addWidget,
  } = useDashboardEdit()

  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [showSaveLayoutDialog, setShowSaveLayoutDialog] = useState(false)
  const [layoutName, setLayoutName] = useState('')

  // Don't render if not in edit mode
  if (!isEditMode) return null

  const handleDiscard = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true)
    } else {
      discardChanges()
    }
  }

  const handleSaveLayout = () => {
    if (layoutName.trim()) {
      saveLayout(layoutName.trim())
      setLayoutName('')
      setShowSaveLayoutDialog(false)
    }
  }

  const handleAddWidget = (item: WidgetCatalogItem) => {
    if (onAddWidget) {
      onAddWidget(item, 'kpis') // Default section
    } else {
      addWidget({
        type: item.type,
        title: item.title,
        visible: true,
        size: item.defaultSize,
        section: 'kpis',
      })
    }
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={cn(
            // Position below header (sticky, stays visible when scrolling)
            'fixed top-20 left-1/2 -translate-x-1/2 z-[9999]',
            className
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full',
              'bg-surface/95 backdrop-blur-xl border border-default shadow-xl',
              'dark:bg-abyss-900/95 dark:border-abyss-700'
            )}
          >
            {/* Edit Mode Indicator */}
            <div className="flex items-center gap-2 pr-3 border-r border-default">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary">Edit Mode</span>
              {hasUnsavedChanges && (
                <Badge variant="warning" className="text-xs">
                  Unsaved
                </Badge>
              )}
            </div>

            {/* Add Widget */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Widget
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>Widget Catalog</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {widgetCatalog.map((item) => (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => handleAddWidget(item)}
                    className="flex items-start gap-3 py-3"
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg text-secondary">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted truncate">{item.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.defaultSize}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Layouts */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Layout className="w-4 h-4" />
                  Layouts
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuLabel>Saved Layouts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {layouts.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted">
                    No saved layouts yet
                  </div>
                ) : (
                  layouts.map((layout) => (
                    <DropdownMenuItem
                      key={layout.id}
                      onClick={() => loadLayout(layout.id)}
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      {layout.name}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSaveLayoutDialog(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Current Layout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-default mx-1" />

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              className="gap-2 text-muted hover:text-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            {/* Cancel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              className="gap-2 text-muted hover:text-error"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>

            {/* Save */}
            <Button
              variant="default"
              size="sm"
              onClick={saveChanges}
              disabled={!hasUnsavedChanges}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Discard Confirmation Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Discard Changes?
            </DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Keep Editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDiscardDialog(false)
                discardChanges()
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Layout Dialog */}
      <Dialog open={showSaveLayoutDialog} onOpenChange={setShowSaveLayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Layout</DialogTitle>
            <DialogDescription>
              Give your layout a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Layout name (e.g., Executive View)"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveLayout()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveLayoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLayout} disabled={!layoutName.trim()}>
              Save Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// =============================================================================
// EDIT MODE TOGGLE BUTTON
// =============================================================================

export interface EditModeToggleProps {
  className?: string
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const { isEditMode, enterEditMode, hasUnsavedChanges } = useDashboardEdit()

  if (isEditMode) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={enterEditMode}
      className={cn('gap-2', className)}
    >
      <Layout className="w-4 h-4" />
      Customize Dashboard
    </Button>
  )
}
