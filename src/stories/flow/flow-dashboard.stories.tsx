/**
 * Flow EHS Dashboard Stories
 *
 * Demonstrates the Flow EHS application using existing DDS components.
 * Reuses AppLayoutShell and DashboardPage with EHS-specific data.
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  LayoutDashboard,
  Waypoints,
  TriangleAlert,
  Settings,
  Users,
  ShieldCheck,
  BookOpen,
  MapPin,
  Files,
  Boxes,
  HelpCircle,
  Camera,
  Shield,
  ClipboardCheck,
  Download,
} from 'lucide-react'
import { AppLayoutShell } from '../../templates/layout/AppLayoutShell'
import { DashboardPage } from '../../templates/pages'
import { PAGE_META, pageDescription } from '../_infrastructure'
import {
  IncidentManagementTable,
  type Incident,
} from '../../components/ui/table'
import { SearchFilter } from '../../components/shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../components/shared/SearchFilter/types'
import {
  QuickFilter,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
} from '../../components/ui/QuickFilter'
import { PageActionPanel } from '../../components/ui/PageActionPanel'
import { Button } from '../../components/ui/button'
import { useState, useMemo } from 'react'

// =============================================================================
// MOCK DATA - Incidents
// =============================================================================

// Generate 100 incidents with various severities and statuses
const incidentTitles = [
  'Chemical Spill in Storage Area', 'Equipment Malfunction', 'Slip and Fall Incident', 'Fire Alarm Activation',
  'Gas Leak Detected', 'Electrical Hazard Reported', 'Vehicle Collision', 'Structural Damage Found',
  'PPE Violation Observed', 'Ergonomic Issue Reported', 'Noise Exposure Concern', 'Heat Stress Incident',
  'Confined Space Entry Issue', 'Lockout/Tagout Violation', 'Fall Protection Failure', 'Machine Guarding Missing',
  'Hazardous Waste Spillage', 'Air Quality Concern', 'Water Contamination', 'Radiation Exposure Risk',
  'Biological Hazard Found', 'Sharp Object Injury', 'Crushing Hazard Near Miss', 'Forklift Incident',
  'Ladder Safety Issue', 'Scaffolding Problem', 'Crane Operation Concern', 'Welding Safety Violation',
  'Chemical Burn Reported', 'Eye Injury Incident', 'Back Injury Complaint', 'Respiratory Issue',
]
const locations = [
  'Warehouse A - Section 1', 'Warehouse B - Section 4', 'Production Floor - Building A', 'Assembly Line 3',
  'Loading Dock - East Wing', 'Storage Room C', 'Utility Room 3B', 'Building Entrance', 'Parking Lot B',
  'Office Building - Floor 2', 'Maintenance Shop', 'Quality Control Lab', 'Shipping Department',
  'Receiving Area', 'Break Room - North', 'Conference Room 101', 'Server Room', 'Chemical Storage',
  'Outdoor Tank Farm', 'Compressor Building', 'Boiler Room', 'HVAC Equipment Area', 'Roof Access',
]
const reporters = [
  'Patricia Davis', 'Sarah Connor', 'Mike Chen', 'Michael Johnson', 'John Martinez', 'Linda Smith',
  'Patricia Taylor', 'Robert Wilson', 'James Brown', 'Jennifer Garcia', 'David Miller', 'Maria Rodriguez',
  'William Anderson', 'Elizabeth Thomas', 'Richard Jackson', 'Susan White', 'Joseph Harris', 'Margaret Martin',
  'Charles Thompson', 'Dorothy Moore', 'Christopher Lee', 'Nancy Walker', 'Daniel Hall', 'Karen Allen',
]

const generateIncidents = (): Incident[] => {
  const incidents: Incident[] = []
  const _severities: Array<'critical' | 'high' | 'medium' | 'low' | 'none'> = ['critical', 'high', 'medium', 'low', 'none']
  const _statuses: Array<'draft' | 'reported' | 'investigation' | 'review'> = ['draft', 'reported', 'investigation', 'review']

  // Distribution: 5 critical, 10 high, 30 medium, 35 low, 20 none
  // Status distribution: 8 draft, 15 reported, 40 investigation, 37 review
  const severityDistribution = [
    ...Array(5).fill('critical'),
    ...Array(10).fill('high'),
    ...Array(30).fill('medium'),
    ...Array(35).fill('low'),
    ...Array(20).fill('none'),
  ] as Array<'critical' | 'high' | 'medium' | 'low' | 'none'>

  const statusDistribution = [
    ...Array(8).fill('draft'),
    ...Array(15).fill('reported'),
    ...Array(40).fill('investigation'),
    ...Array(37).fill('review'),
  ] as Array<'draft' | 'reported' | 'investigation' | 'review'>

  for (let i = 0; i < 100; i++) {
    const severity = severityDistribution[i]
    const status = statusDistribution[i]
    const ageDays = status === 'draft' ? 0 : Math.floor(Math.random() * 120)
    const isOverdue = ageDays > 30 && status !== 'draft' && status !== 'reported'

    incidents.push({
      id: String(i + 1),
      incidentId: `INC-${516344565333 + i}`,
      title: incidentTitles[i % incidentTitles.length] + (i > 31 ? ` - Case ${i + 1}` : ''),
      location: locations[i % locations.length],
      reporter: reporters[i % reporters.length],
      priority: status === 'draft' ? 'draft' : severity,
      severity: severity,
      status: status,
      ageDays: ageDays,
      overdue: isOverdue,
    })
  }

  // Sort by severity (critical first) then by age (oldest first)
  return incidents.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }
    const aSev = severityOrder[a.severity as keyof typeof severityOrder] ?? 5
    const bSev = severityOrder[b.severity as keyof typeof severityOrder] ?? 5
    if (aSev !== bSev) return aSev - bSev
    return (b.ageDays || 0) - (a.ageDays || 0)
  })
}

const incidentData: Incident[] = generateIncidents()

// =============================================================================
// MOCK DATA - EHS Specific
// =============================================================================

const ehsKpis = [
  {
    id: 'days-safe',
    label: 'Days Without Incident',
    value: 47,
    trend: '+47',
    trendDirection: 'up' as const,
    icon: <Shield className="w-5 h-5 text-teal" />,
  },
  {
    id: 'open-incidents',
    label: 'Open Incidents',
    value: 3,
    trend: '-2',
    trendDirection: 'down' as const,
    icon: <TriangleAlert className="w-5 h-5 text-warning" />,
  },
  {
    id: 'workflow-steps',
    label: 'Active Workflows',
    value: 12,
    trend: '+3',
    trendDirection: 'up' as const,
    icon: <Waypoints className="w-5 h-5 text-info" />,
  },
  {
    id: 'training-complete',
    label: 'Training Compliance',
    value: '94%',
    trend: '+5%',
    trendDirection: 'up' as const,
    icon: <Users className="w-5 h-5 text-success" />,
  },
]

const ehsActivity = [
  {
    id: '1',
    type: 'warning',
    title: 'Slip hazard reported',
    description: 'Wet floor in Building A lobby - under review',
    timestamp: '10 min ago',
  },
  {
    id: '2',
    type: 'success',
    title: 'Fire drill completed',
    description: 'Evacuation time: 3:42 - within target',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'PPE inspection scheduled',
    description: 'Warehouse team - due tomorrow',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    type: 'success',
    title: 'Safety training completed',
    description: 'Forklift certification - 12 employees',
    timestamp: '3 hours ago',
  },
]

const ehsQuickActions = [
  {
    id: 'report-incident',
    label: 'Report Incident',
    description: 'Log a new safety incident',
    icon: <TriangleAlert className="w-4 h-4" />,
    onClick: () => alert('Opening incident report form...'),
    variant: 'primary' as const,
  },
  {
    id: 'start-workflow',
    label: 'Start Workflow',
    description: 'Begin a new workflow',
    icon: <Waypoints className="w-4 h-4" />,
    onClick: () => alert('Starting new workflow...'),
  },
  {
    id: 'capture-observation',
    label: 'Capture Observation',
    description: 'Document a safety observation',
    icon: <Camera className="w-4 h-4" />,
    onClick: () => alert('Opening camera...'),
  },
]

// Navigation items for Flow - matching app-sidebar structure
const flowNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    component: (
      <DashboardPage
        title="Safety Dashboard"
        subtitle="Welcome back! Here's your safety overview."
        kpis={ehsKpis}
        activity={ehsActivity}
        quickActions={ehsQuickActions}
        activityTitle="Recent Safety Events"
        actionsTitle="Quick Actions"
      />
    ),
  },
  {
    id: 'workflow',
    label: 'Workflow Steps',
    icon: <Waypoints className="w-5 h-5" />,
    component: (
      <DashboardPage
        title="Workflow Steps"
        subtitle="Manage and track workflow progress"
        kpis={[
          { id: '1', label: 'Active', value: 12, icon: <Waypoints className="w-5 h-5 text-info" /> },
          { id: '2', label: 'Pending', value: 5, icon: <ClipboardCheck className="w-5 h-5 text-warning" /> },
          { id: '3', label: 'Completed', value: 89, icon: <Shield className="w-5 h-5 text-success" /> },
        ]}
        kpiColumns={3}
        hideQuickActions
      />
    ),
  },
  {
    id: 'incidents',
    label: 'Report Incident',
    icon: <TriangleAlert className="w-5 h-5" />,
    badge: 3,
    component: (
      <DashboardPage
        hideQuickActions
        hideActivity
        hideTitle
      >
        <IncidentsTableWithSearch data={incidentData} />
      </DashboardPage>
    ),
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        id: 'users',
        label: 'Users',
        icon: <Users className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Users"
            subtitle="Manage system users"
            hideActivity
            hideQuickActions
          />
        ),
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        icon: <ShieldCheck className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Roles & Permissions"
            subtitle="Configure access control"
            hideActivity
            hideQuickActions
          />
        ),
      },
      {
        id: 'dictionaries',
        label: 'Dictionaries',
        icon: <BookOpen className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Dictionaries"
            subtitle="Manage lookup values"
            hideActivity
            hideQuickActions
          />
        ),
      },
      {
        id: 'locations',
        label: 'Locations',
        icon: <MapPin className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Locations"
            subtitle="Configure site locations"
            hideActivity
            hideQuickActions
          />
        ),
      },
      {
        id: 'templates',
        label: 'Entity Templates',
        icon: <Files className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Entity Templates"
            subtitle="Manage entity configurations"
            hideActivity
            hideQuickActions
          />
        ),
      },
      {
        id: 'modules',
        label: 'Modules',
        icon: <Boxes className="w-5 h-5" />,
        component: (
          <DashboardPage
            title="Modules"
            subtitle="Configure system modules"
            hideActivity
            hideQuickActions
          />
        ),
      },
    ],
  },
]

const userMenuItems = [
  { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', destructive: true, separator: true },
]

// =============================================================================
// FILTER CONFIGURATION
// =============================================================================

const incidentFilterGroups: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'draft', label: 'Draft' },
      { id: 'reported', label: 'Reported' },
      { id: 'investigation', label: 'Investigation' },
      { id: 'review', label: 'Review' },
    ],
  },
  {
    key: 'severity',
    label: 'Severity',
    options: [
      { id: 'critical', label: 'Critical' },
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
      { id: 'none', label: 'None' },
    ],
  },
  {
    key: 'overdue',
    label: 'Overdue',
    options: [
      { id: 'overdue', label: 'Overdue Only' },
    ],
  },
]

// =============================================================================
// INCIDENTS TABLE WITH SEARCH FILTER
// =============================================================================

type QuickFilterType = 'all' | 'drafts' | 'reported' | 'aging' | 'investigation' | 'reviews'

function IncidentsTableWithSearch({ data }: { data: Incident[] }) {
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // Calculate counts for quick filters
  const filterCounts = useMemo(() => {
    return {
      drafts: data.filter(i => i.status === 'draft').length,
      reported: data.filter(i => i.status === 'reported').length,
      aging: data.filter(i => i.overdue === true).length,
      investigation: data.filter(i => i.status === 'investigation').length,
      reviews: data.filter(i => i.status === 'review').length,
    }
  }, [data])

  // Handle quick filter click
  const handleQuickFilterClick = (filter: QuickFilterType) => {
    setActiveQuickFilter(prev => prev === filter ? 'all' : filter)
    // Clear advanced filters when using quick filter
    setFilters({})
  }

  // Filter incidents based on search, quick filter, and advanced filters
  const filteredIncidents = useMemo(() => {
    return data.filter((incident) => {
      // Quick filter - takes precedence
      if (activeQuickFilter !== 'all') {
        switch (activeQuickFilter) {
          case 'drafts':
            if (incident.status !== 'draft') return false
            break
          case 'reported':
            if (incident.status !== 'reported') return false
            break
          case 'aging':
            if (!incident.overdue) return false
            break
          case 'investigation':
            if (incident.status !== 'investigation') return false
            break
          case 'reviews':
            if (incident.status !== 'review') return false
            break
        }
      }

      // Search filter - check title, location, reporter, incidentId
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          incident.title.toLowerCase().includes(searchLower) ||
          incident.location.toLowerCase().includes(searchLower) ||
          incident.reporter.toLowerCase().includes(searchLower) ||
          incident.incidentId.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter (advanced)
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(incident.status)) return false
      }

      // Severity filter
      if (filters.severity && filters.severity.length > 0) {
        if (!filters.severity.includes(incident.severity)) return false
      }

      // Overdue filter
      if (filters.overdue && filters.overdue.length > 0) {
        if (!incident.overdue) return false
      }

      return true
    })
  }, [data, searchValue, filters, activeQuickFilter])

  // Paginate filtered incidents
  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredIncidents.slice(startIndex, startIndex + pageSize)
  }, [filteredIncidents, currentPage, pageSize])

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
    if (Object.keys(newFilters).length > 0) {
      setActiveQuickFilter('all')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handleQuickFilterWithReset = (filter: QuickFilterType) => {
    handleQuickFilterClick(filter)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Page Action Panel */}
      <PageActionPanel
        icon={<TriangleAlert className="w-8 h-8" />}
        title="Incidents"
        subtitle="Environmental and safety incident tracking and management"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="destructive" size="sm">
              <TriangleAlert className="w-4 h-4" />
              Report Incident
            </Button>
          </>
        }
      />

      {/* Quick Filters */}
      <QuickFilter gap="sm">
        <DraftsFilter
          size="sm"
          count={filterCounts.drafts}
          selected={activeQuickFilter === 'drafts'}
          onClick={() => handleQuickFilterWithReset('drafts')}
        />
        <ReportedFilter
          size="sm"
          count={filterCounts.reported}
          selected={activeQuickFilter === 'reported'}
          onClick={() => handleQuickFilterWithReset('reported')}
        />
        <AgingFilter
          size="sm"
          count={filterCounts.aging}
          selected={activeQuickFilter === 'aging'}
          onClick={() => handleQuickFilterWithReset('aging')}
        />
        <InProgressFilter
          size="sm"
          count={filterCounts.investigation}
          selected={activeQuickFilter === 'investigation'}
          onClick={() => handleQuickFilterWithReset('investigation')}
        />
        <ReviewsFilter
          size="sm"
          count={filterCounts.reviews}
          selected={activeQuickFilter === 'reviews'}
          onClick={() => handleQuickFilterWithReset('reviews')}
        />
      </QuickFilter>

      {/* Search Filter */}
      <SearchFilter
        placeholder="Search incidents by title, location, reporter..."
        value={searchValue}
        onChange={handleSearchChange}
        filterGroups={incidentFilterGroups}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Incidents Table with integrated pagination */}
      <IncidentManagementTable
        data={paginatedIncidents}
        onNextStep={(id) => alert(`Next step for incident ${id}`)}
        onEdit={(id) => alert(`Edit incident ${id}`)}
        onDelete={(id) => alert(`Delete incident ${id}`)}
        onSubmit={(id) => alert(`Submit incident ${id}`)}
        hideLegend
        hideBulkActions
        pagination
        currentPage={currentPage}
        totalItems={filteredIncidents.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />

      {/* Empty state when filters return no results */}
      {filteredIncidents.length === 0 && data.length > 0 && (
        <div className="text-center py-8 text-secondary">
          No incidents match your search criteria
        </div>
      )}
    </div>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof AppLayoutShell> = {
  title: 'Flow/Dashboard',
  component: AppLayoutShell,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`
# Flow EHS Dashboard

A complete EHS (Environment, Health & Safety) application built using the **AppLayoutShell** and **DashboardPage** components.

## Features
- **Dashboard**: Overview with key safety metrics
- **Workflow Steps**: Manage and track workflow progress
- **Report Incident**: Track and resolve safety incidents with full DataTable
- **Configuration**: Users, Roles, Dictionaries, Locations, Templates, Modules

## Architecture
Reuses the same 3-tier architecture as Partner Portal:
1. **Primitives**: Button, Card, DataTable, etc.
2. **AppLayoutShell**: Handles layout, navigation, responsive behavior
3. **DashboardPage**: Customized with EHS-specific KPIs and actions
        `),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AppLayoutShell>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete Flow EHS application with all pages and working navigation.
 */
export const Default: Story = {
  args: {
    product: 'flow',
    navItems: flowNavItems,
    initialPage: 'dashboard',
    user: {
      name: 'Sarah Chen',
      email: 'sarah.chen@safetycompany.com',
    },
    userMenuItems,
    notificationCount: 4,
    showHelpItem: true,
    footerVariant: 'wave-only',
    onNotificationClick: () => alert('Opening notifications...'),
    onMenuItemClick: (item) => {
      if (item.id === 'logout') {
        alert('Logging out...')
      } else {
        alert(`Navigating to ${item.label}`)
      }
    },
  },
}

/**
 * Mobile viewport - shows bottom navigation and responsive layouts
 */
export const Mobile: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Start on workflow page
 */
export const WorkflowPage: Story = {
  args: {
    ...Default.args,
    initialPage: 'workflow',
  },
}

/**
 * Start on incidents page with Incident Management Table
 */
export const IncidentsPage: Story = {
  args: {
    ...Default.args,
    initialPage: 'incidents',
  },
}
