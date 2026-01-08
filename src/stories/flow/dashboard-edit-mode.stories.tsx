/**
 * Dashboard Edit Mode Stories
 *
 * Demonstrates the drag-and-drop dashboard editing functionality.
 * Users can reorder widgets, resize, duplicate, remove, and configure widgets.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  AlertCircle,
  TriangleAlert,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Users,
  Sparkles,
  ClipboardList,
  Globe,
  Activity,
  Zap,
  Target,
} from 'lucide-react'
import { AnimatePresence, Reorder, motion } from 'motion/react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'

// Edit mode components
import {
  DashboardEditProvider,
  useDashboardEdit,
  EditableWidget,
  EditModeToolbar,
  WidgetSettingsPanel,
  type WidgetConfig,
} from '../../flow/components/dashboard/edit-mode'

// Widget components
import {
  KPICard,
  BreakdownCard,
  AgingCard,
  TrendingCard,
  RiskHeatmapCard,
  WorkloadCard,
  UpcomingTasksCard,
  SectionHeader,
  type BreakdownItem,
  type AgingItem,
  type TrendingItem,
  type LocationRisk,
  type WorkloadItem,
  type UpcomingTask,
} from '../../flow/components/dashboard'
import { StatsCard } from '../../components/shared/StatsCard'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Flow/Dashboard/EditMode',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dashboard Edit Mode

A drag-and-drop editing system for dashboard widgets.

## Features

- **Drag & Drop Reorder**: Move widgets within sections
- **Widget Context Menu**: Edit, duplicate, hide, remove widgets
- **Resize Options**: 1x1, 2x1, 1x2, 2x2 grid sizes
- **Settings Panel**: Per-widget configuration
- **Layout Presets**: Save and load custom layouts
- **Add Widget Catalog**: Add new widgets from a catalog

## Usage

\`\`\`tsx
import {
  DashboardEditProvider,
  EditableWidget,
  EditModeToolbar,
} from '@dds/design-system/flow'

function Dashboard() {
  return (
    <DashboardEditProvider initialWidgets={widgets}>
      <EditModeToolbar />
      <EditableWidget id="kpi-1">
        <KPICard title="Metric" value={42} />
      </EditableWidget>
    </DashboardEditProvider>
  )
}
\`\`\`
        `,
      },
    },
  },
}

export default meta

// =============================================================================
// MOCK DATA
// =============================================================================

const mockKpiData = [
  {
    id: 'ltir',
    title: 'Lost Time Injury Rate',
    value: 0,
    description: 'Per 200,000 hours worked',
    icon: <AlertCircle className="w-5 h-5" />,
    isHero: true,
    zeroIsCelebratory: true,
  },
  {
    id: 'trir',
    title: 'Total Recordable Incidents',
    value: 1.2,
    description: 'Per 200,000 hours worked',
    icon: <TriangleAlert className="w-5 h-5" />,
    zeroIsCelebratory: true,
  },
  {
    id: 'nmr',
    title: 'Near Miss Rate',
    value: 4.8,
    description: 'Proactive safety indicators',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: 'oca',
    title: 'Overdue CA',
    value: 3,
    description: '3 actions need attention',
    icon: <RefreshCw className="w-5 h-5" />,
    zeroIsCelebratory: true,
  },
]

const mockSeverityBreakdown: BreakdownItem[] = [
  { label: 'Critical/Fatality', value: 0, variant: 'error' },
  { label: 'Lost Time', value: 2, variant: 'warning' },
  { label: 'Recordable', value: 8, variant: 'info' },
  { label: 'Near Miss', value: 24, variant: 'success' },
]

const mockAgingData: AgingItem[] = [
  { label: '30+ days', value: 4, variant: 'warning' },
  { label: '60+ days', value: 2, variant: 'error' },
  { label: '90+ days', value: 1, variant: 'error' },
]

const mockTrendingIncidents: TrendingItem[] = [
  { label: 'Slip/Trip/Fall', count: 18 },
  { label: 'Near Miss Report', count: 24 },
  { label: 'Equipment Damage', count: 9 },
]

const mockLocationRisks: LocationRisk[] = [
  { location: 'Warehouse B - Loading Dock', count: 8, risk: 'critical' },
  { location: 'Manufacturing Floor A', count: 5, risk: 'high' },
  { location: 'Chemical Storage Unit', count: 3, risk: 'medium' },
]

const mockEmployeeWorkload: WorkloadItem[] = [
  { name: 'Sarah Chen', initials: 'SC', count: 18, color: 'error' },
  { name: 'Marcus Johnson', initials: 'MJ', count: 12, color: 'warning' },
  { name: 'Emily Rodriguez', initials: 'ER', count: 8, color: 'info' },
]

const mockUpcomingTasks: UpcomingTask[] = [
  { id: '1', title: 'Safety audit - Warehouse B', dueDate: 'Today', priority: 'high', assignee: 'SC' },
  { id: '2', title: 'Fire drill coordination', dueDate: 'Tomorrow', priority: 'medium', assignee: 'MJ' },
]

// Initial widget configuration
const initialWidgets: WidgetConfig[] = [
  { id: 'kpi-ltir', type: 'kpi', title: 'Lost Time Injury Rate', visible: true, size: '1x1', order: 0, section: 'kpis' },
  { id: 'kpi-trir', type: 'kpi', title: 'Total Recordable Incidents', visible: true, size: '1x1', order: 1, section: 'kpis' },
  { id: 'kpi-nmr', type: 'kpi', title: 'Near Miss Rate', visible: true, size: '1x1', order: 2, section: 'kpis' },
  { id: 'kpi-oca', type: 'kpi', title: 'Overdue CA', visible: true, size: '1x1', order: 3, section: 'kpis' },
  { id: 'breakdown-severity', type: 'breakdown', title: 'Severity Breakdown', visible: true, size: '1x1', order: 0, section: 'incidents' },
  { id: 'aging-ca', type: 'aging', title: 'CA Aging', visible: true, size: '1x1', order: 1, section: 'incidents' },
  { id: 'trending-types', type: 'trending', title: 'Incident Types', visible: true, size: '1x1', order: 0, section: 'analytics' },
  { id: 'heatmap-risk', type: 'heatmap', title: 'Location Risks', visible: true, size: '1x1', order: 1, section: 'analytics' },
  { id: 'workload-team', type: 'workload', title: 'Team Workload', visible: true, size: '1x1', order: 2, section: 'analytics' },
  { id: 'tasks-upcoming', type: 'tasks', title: 'Upcoming Tasks', visible: true, size: '1x1', order: 3, section: 'analytics' },
]

// =============================================================================
// EDITABLE DASHBOARD CONTENT
// =============================================================================

function EditableDashboardContent() {
  const {
    isEditMode,
    widgets,
    enterEditMode,
    reorderWidgets,
  } = useDashboardEdit()

  const [settingsPanelWidget, setSettingsPanelWidget] = useState<string | null>(null)

  // Get widgets by section
  const getWidgetsBySection = (section: string) =>
    widgets
      .filter((w) => w.section === section)
      .sort((a, b) => a.order - b.order)

  const kpiWidgets = getWidgetsBySection('kpis')
  const incidentWidgets = getWidgetsBySection('incidents')
  const analyticsWidgets = getWidgetsBySection('analytics')

  // Render widget content by type
  const renderWidgetContent = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'kpi': {
        const data = mockKpiData.find((k) => widget.id.includes(k.id))
        if (!data) return null
        return (
          <KPICard
            title={widget.title}
            value={data.value}
            description={data.description}
            icon={data.icon}
            isHero={data.isHero}
            zeroIsCelebratory={data.zeroIsCelebratory}
          />
        )
      }
      case 'breakdown':
        return (
          <BreakdownCard
            icon={<Zap />}
            title={widget.title}
            total={mockSeverityBreakdown.reduce((sum, i) => sum + i.value, 0)}
            items={mockSeverityBreakdown}
            zeroIsCelebratory={false}
          />
        )
      case 'aging':
        return <AgingCard items={mockAgingData} />
      case 'trending':
        return (
          <TrendingCard
            title={widget.title}
            total={mockTrendingIncidents.reduce((sum, i) => sum + i.count, 0)}
            items={mockTrendingIncidents}
          />
        )
      case 'heatmap':
        return <RiskHeatmapCard items={mockLocationRisks} />
      case 'workload':
        return <WorkloadCard items={mockEmployeeWorkload} />
      case 'tasks':
        return (
          <UpcomingTasksCard
            tasks={mockUpcomingTasks}
            onAddTask={() => alert('Add task clicked')}
          />
        )
      default:
        return (
          <div className="h-full flex items-center justify-center p-4 bg-muted-bg rounded-lg border border-dashed border-default">
            <span className="text-muted text-sm">Unknown widget: {widget.type}</span>
          </div>
        )
    }
  }

  // Render section with reorderable widgets
  const renderSection = (
    sectionId: string,
    icon: React.ReactNode,
    title: string,
    description: string,
    sectionWidgets: WidgetConfig[],
    gridClassName: string
  ) => {
    if (sectionWidgets.length === 0) return null

    const widgetIds = sectionWidgets.map((w) => w.id)

    return (
      <section>
        <SectionHeader icon={icon} title={title} description={description} />

        {isEditMode ? (
          <Reorder.Group
            axis="x"
            values={widgetIds}
            onReorder={(newOrder) => reorderWidgets(sectionId, newOrder)}
            className={gridClassName}
            as="div"
          >
            <AnimatePresence mode="popLayout">
              {sectionWidgets.map((widget) => (
                <Reorder.Item
                  key={widget.id}
                  value={widget.id}
                  as="div"
                  className="col-span-1"
                  dragListener={false}
                >
                  <EditableWidget
                    id={widget.id}
                    size={widget.size}
                    visible={widget.visible}
                    onSettingsOpen={() => setSettingsPanelWidget(widget.id)}
                  >
                    {renderWidgetContent(widget)}
                  </EditableWidget>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className={gridClassName}>
            {sectionWidgets.filter((w) => w.visible).map((widget) => (
              <div key={widget.id}>
                {renderWidgetContent(widget)}
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="relative min-h-screen bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Toolbar */}
      <EditModeToolbar />

      {/* Header */}
      <div className="bg-surface border-b border-default sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-primary">EHS Analytics Dashboard</h1>
            <p className="text-sm text-secondary">
              {isEditMode
                ? 'Drag widgets to reorder. Click menu for more options.'
                : 'Manage your Environmental, Health & Safety operations efficiently.'}
            </p>
          </div>
          {!isEditMode && (
            <Button onClick={enterEditMode} variant="outline" size="sm">
              Customize Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/10 border-b border-accent/20 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <p className="text-sm text-accent-strong font-medium">
                Edit Mode Active
              </p>
              <p className="text-sm text-muted">
                Drag widgets to reorder. Click the <strong>⋮</strong> menu on any widget for more options.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content */}
      <div className="relative z-[1] p-6 space-y-8">
        {renderSection(
          'kpis',
          <Sparkles />,
          'Key Performance Indicators',
          'Critical safety and performance metrics',
          kpiWidgets,
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
        )}

        {renderSection(
          'incidents',
          <TriangleAlert />,
          'Incident Overview',
          'Track and monitor safety incidents',
          incidentWidgets,
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
        )}

        {renderSection(
          'analytics',
          <Activity />,
          'Trending & Analytics',
          'Trends, heatmaps, and upcoming items',
          analyticsWidgets,
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
        )}
      </div>

      {/* Widget Settings Panel */}
      <WidgetSettingsPanel
        widgetId={settingsPanelWidget}
        open={!!settingsPanelWidget}
        onClose={() => setSettingsPanelWidget(null)}
      />
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

type Story = StoryObj<typeof meta>

/**
 * Default view with edit mode disabled.
 * Click "Customize Dashboard" to enter edit mode.
 */
export const Default: Story = {
  render: () => (
    <DashboardEditProvider
      initialWidgets={initialWidgets}
      onSave={(widgets) => console.log('Saved widgets:', widgets)}
    >
      <EditableDashboardContent />
    </DashboardEditProvider>
  ),
}

/**
 * Edit mode active from the start.
 * Demonstrates drag-and-drop, widget menus, and toolbar.
 */
export const EditModeActive: Story = {
  render: () => {
    // Wrapper to start in edit mode
    function EditModeWrapper() {
      const { enterEditMode } = useDashboardEdit()

      // Enter edit mode on mount
      useState(() => {
        setTimeout(enterEditMode, 100)
      })

      return <EditableDashboardContent />
    }

    return (
      <DashboardEditProvider
        initialWidgets={initialWidgets}
        onSave={(widgets) => console.log('Saved widgets:', widgets)}
      >
        <EditModeWrapper />
      </DashboardEditProvider>
    )
  },
}

/**
 * Interactive demo with all features.
 */
export const Interactive: Story = {
  render: () => (
    <DashboardEditProvider
      initialWidgets={initialWidgets}
      onSave={(widgets) => {
        console.log('Saved widgets:', widgets)
        alert('Dashboard layout saved!')
      }}
    >
      <EditableDashboardContent />
    </DashboardEditProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## How to Use

1. **Enter Edit Mode**: Click "Customize Dashboard" button
2. **Reorder Widgets**: Drag the handle on the left side of any widget
3. **Widget Options**: Click the ⋮ menu on any widget to:
   - Edit widget settings
   - Duplicate the widget
   - Hide/show the widget
   - Resize (1x1, 2x1, 1x2, 2x2)
   - Remove the widget
4. **Add Widgets**: Use "Add Widget" in the toolbar
5. **Save Layouts**: Save your layout for later use
6. **Save Changes**: Click "Save Changes" to persist
        `,
      },
    },
  },
}
