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
} from 'lucide-react'
import { AppLayoutShell } from '../../templates/layout/AppLayoutShell'
import { DashboardPage } from '../../templates/pages'
import { PAGE_META, pageDescription } from '../_infrastructure'
import {
  IncidentManagementTable,
  type Incident,
} from '../../components/ui/table'

// =============================================================================
// MOCK DATA - Incidents
// =============================================================================

const incidentData: Incident[] = [
  { id: '1', incidentId: 'INC-516344565333', title: 'Critical Chemical Spill in Warehouse B Section 4 - Hazardous Materials Containment Protocol Required', location: 'Warehouse B - Section 4', reporter: 'Patricia Davis', priority: 'critical', severity: 'critical', status: 'investigation', ageDays: 95, overdue: true },
  { id: '7', incidentId: 'INC-516344565339', title: 'Major Ventilation System Failure Affecting Multiple Production Areas', location: 'Production Floor - Building A', reporter: 'Sarah Connor', priority: 'high', severity: 'high', status: 'investigation', ageDays: 42, overdue: true },
  { id: '9', incidentId: 'INC-516344565341', title: 'Electrical Panel Inspection Overdue - Potential Fire Hazard', location: 'Utility Room 3B', reporter: 'Mike Chen', priority: 'medium', severity: 'medium', status: 'review', ageDays: 14, overdue: true },
  { id: '2', incidentId: 'INC-516344565334', title: 'Equipment Malfunction Near Assembly Line', location: 'Assembly Line 3', reporter: 'Michael Johnson', priority: 'low', severity: 'low', status: 'review', ageDays: 21 },
  { id: '8', incidentId: 'INC-516344565340', title: 'Fire Extinguisher Expired', location: 'Storage Room C', reporter: 'John Martinez', priority: 'medium', severity: 'medium', status: 'review', ageDays: 5 },
  { id: '3', incidentId: 'INC-516344565335', title: 'Minor Injury Report - Slip Hazard', location: 'Loading Dock - East Wing', reporter: 'Linda Smith', priority: 'medium', severity: 'medium', status: 'investigation', ageDays: 3 },
  { id: '5', incidentId: 'INC-516344565337', title: 'Near Miss Reported at Entrance', location: 'Building Entrance', reporter: 'Patricia Taylor', priority: 'none', severity: 'none', status: 'reported', ageDays: 1 },
  { id: '6', incidentId: 'INC-516344565338', title: 'New Incident Draft', location: 'TBD', reporter: 'Robert Wilson', priority: 'draft', severity: 'none', status: 'draft', ageDays: 0 },
]

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
        title="Incident Management"
        subtitle="Track and manage safety incidents"
        kpis={[
          { id: '1', label: 'Open', value: 3, icon: <TriangleAlert className="w-5 h-5 text-warning" /> },
          { id: '2', label: 'In Progress', value: 5, icon: <ClipboardCheck className="w-5 h-5 text-info" /> },
          { id: '3', label: 'Resolved', value: 42, icon: <Shield className="w-5 h-5 text-success" /> },
        ]}
        kpiColumns={3}
        hideQuickActions
        hideActivity
      >
        <IncidentManagementTable data={incidentData} />
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
