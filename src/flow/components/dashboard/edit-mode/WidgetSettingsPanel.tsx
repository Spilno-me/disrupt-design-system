/**
 * Widget Settings Panel
 *
 * Side panel for configuring individual widget settings.
 * Opens when a widget's "Settings" action is clicked in edit mode.
 */
import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Settings2,
  Palette,
  LayoutGrid,
  Eye,
  Target,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Slider } from '../../../../components/ui/Slider'
import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'
import { useDashboardEdit, type WidgetConfig, type WidgetSize } from './DashboardEditContext'

// =============================================================================
// TYPES
// =============================================================================

export interface WidgetSettingsPanelProps {
  widgetId: string | null
  open: boolean
  onClose: () => void
  onSave?: (widgetId: string, settings: Record<string, unknown>) => void
}

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WidgetSettingsPanel({
  widgetId,
  open,
  onClose,
  onSave,
}: WidgetSettingsPanelProps) {
  const { widgets, updateWidget, resizeWidget } = useDashboardEdit()
  const [activeSection, setActiveSection] = useState('general')

  // Find the widget
  const widget = widgets.find((w) => w.id === widgetId)

  // Local state for form
  const [title, setTitle] = useState('')
  const [threshold, setThreshold] = useState(0)
  const [colorScheme, setColorScheme] = useState('default')

  // Sync form state with widget
  useEffect(() => {
    if (widget) {
      setTitle(widget.title)
      setThreshold((widget.settings?.threshold as number) || 0)
      setColorScheme((widget.settings?.colorScheme as string) || 'default')
    }
  }, [widget])

  const sections: SettingsSection[] = [
    { id: 'general', title: 'General', icon: <Settings2 className="w-4 h-4" /> },
    { id: 'appearance', title: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'layout', title: 'Layout', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'data', title: 'Data Source', icon: <Target className="w-4 h-4" /> },
  ]

  const handleSave = () => {
    if (!widgetId || !widget) return

    updateWidget(widgetId, {
      title,
      settings: {
        ...widget.settings,
        threshold,
        colorScheme,
      },
    })

    onSave?.(widgetId, { threshold, colorScheme })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && widget && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-abyss-950/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed right-0 top-0 bottom-0 w-full max-w-md z-50',
              'bg-surface border-l border-default shadow-2xl',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-bg">
                  <Settings2 className="w-5 h-5 text-accent-strong" />
                </div>
                <div>
                  <h2 className="font-semibold text-primary">Widget Settings</h2>
                  <p className="text-sm text-muted">{widget.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="w-48 border-r border-default p-2 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      activeSection === section.id
                        ? 'bg-accent-bg text-accent-strong'
                        : 'text-secondary hover:text-primary hover:bg-surface-hover'
                    )}
                  >
                    {section.icon}
                    {section.title}
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Settings Form */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {activeSection === 'general' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="widget-title">Widget Title</Label>
                      <Input
                        id="widget-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter widget title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Widget Type</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{widget.type}</Badge>
                        <span className="text-sm text-muted">Read-only</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Visibility</Label>
                        <Badge variant={widget.visible ? 'success' : 'secondary'}>
                          {widget.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted">
                        Toggle visibility from the widget menu in edit mode.
                      </p>
                    </div>
                  </>
                )}

                {activeSection === 'appearance' && (
                  <>
                    <div className="space-y-3">
                      <Label>Color Scheme</Label>
                      <Select value={colorScheme} onValueChange={setColorScheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                          <SelectItem value="success">Success (Green)</SelectItem>
                          <SelectItem value="warning">Warning (Amber)</SelectItem>
                          <SelectItem value="error">Error (Red)</SelectItem>
                          <SelectItem value="info">Info (Teal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Alert Threshold</Label>
                        <span className="text-sm font-mono text-muted">{threshold}</span>
                      </div>
                      <Slider
                        value={threshold}
                        onChange={setThreshold}
                        min={0}
                        max={100}
                        step={5}
                        showValue={false}
                      />
                      <p className="text-sm text-muted">
                        Values above this threshold will be highlighted.
                      </p>
                    </div>
                  </>
                )}

                {activeSection === 'layout' && (
                  <>
                    <div className="space-y-3">
                      <Label>Widget Size</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['1x1', '2x1', '1x2', '2x2'] as WidgetSize[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => resizeWidget(widgetId!, size)}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-colors',
                              widget.size === size
                                ? 'border-accent bg-accent-bg'
                                : 'border-default hover:border-accent/50'
                            )}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className={cn(
                                  'bg-accent/30 rounded',
                                  size === '1x1' && 'w-6 h-6',
                                  size === '2x1' && 'w-12 h-6',
                                  size === '1x2' && 'w-6 h-12',
                                  size === '2x2' && 'w-12 h-12'
                                )}
                              />
                            </div>
                            <p className="text-sm font-medium mt-2">{size}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Section</Label>
                      <Badge variant="secondary" className="capitalize">
                        {widget.section}
                      </Badge>
                      <p className="text-sm text-muted">
                        Drag the widget to move it to a different section.
                      </p>
                    </div>
                  </>
                )}

                {activeSection === 'data' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted-bg border border-default">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-accent-strong" />
                        <span className="font-medium text-sm">Data Configuration</span>
                      </div>
                      <p className="text-sm text-muted">
                        Data source configuration is handled at the dashboard level.
                        Widget data is passed as props from the parent component.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Refresh</Label>
                      <Select defaultValue="realtime">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="1min">Every 1 minute</SelectItem>
                          <SelectItem value="5min">Every 5 minutes</SelectItem>
                          <SelectItem value="15min">Every 15 minutes</SelectItem>
                          <SelectItem value="manual">Manual only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-default bg-surface">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
