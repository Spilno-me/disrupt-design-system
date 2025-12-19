import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AppSidebar, type NavItem } from './AppSidebar'
import { ORGANISM_META, organismDescription } from '@/stories/_infrastructure'
import { GridBlobBackground } from './GridBlobCanvas'
import {
  LayoutDashboard,
  Waypoints,
  TriangleAlert,
  Settings,
  Users,
  ShieldCheck,
  BookOpenText,
  MapPin,
  Files,
  Boxes,
  UserSearch,
  ServerCog,
  ClipboardList,
  FileText,
  Building2,
  Network,
  Calculator,
} from 'lucide-react'

// =============================================================================
// SAMPLE DATA
// =============================================================================

const flowNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'workflow',
    label: 'Workflow Steps',
    icon: <Waypoints />,
    href: '/workflow',
  },
  {
    id: 'incidents',
    label: 'Report Incident',
    icon: <TriangleAlert />,
    href: '/incidents',
    badge: 3,
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: <Settings />,
    children: [
      { id: 'users', label: 'Users', icon: <Users />, href: '/config/users' },
      { id: 'roles', label: 'Roles & Permissions', icon: <ShieldCheck />, href: '/config/roles' },
      { id: 'dictionaries', label: 'Dictionaries', icon: <BookOpenText />, href: '/config/dictionaries' },
      { id: 'locations', label: 'Locations', icon: <MapPin />, href: '/config/locations' },
      { id: 'templates', label: 'Entity Templates', icon: <Files />, href: '/config/templates' },
      { id: 'modules', label: 'Modules', icon: <Boxes />, href: '/config/modules' },
    ],
  },
]

const partnerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <UserSearch />,
    href: '/leads',
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <ServerCog />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
  },
  {
    id: 'partner-network',
    label: 'Partner Network',
    icon: <Network />,
    href: '/partner-network',
  },
  {
    id: 'pricing-calculator',
    label: 'Pricing Calculator',
    icon: <Calculator />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof AppSidebar> = {
  title: 'Shared/App Shell/AppSidebar',
  component: AppSidebar,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription('Collapsible navigation sidebar with nested menu support, badges, and responsive behavior. Part of the shared App Shell system.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AppSidebar>

// =============================================================================
// INTERACTIVE DEMO (Primary Story)
// =============================================================================

export const Default: Story = {
  name: 'Flow App',
  render: () => {
    const [collapsed, setCollapsed] = useState(true)
    const [activeId, setActiveId] = useState('dashboard')

    return (
      <div className="relative min-h-screen bg-page overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 flex min-h-screen">
          <AppSidebar
            product="flow"
            items={flowNavItems}
            activeItemId={activeId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onNavigate={(item) => {
              setActiveId(item.id)
            }}
            onHelpClick={() => alert('Help clicked!')}
          />
          <div className="flex-1 p-6">
            <div className="bg-surface rounded-lg p-4 shadow-sm border border-default">
              <p className="text-primary font-medium">Active: {activeId}</p>
              <p className="text-secondary text-sm mt-2">
                Hover over sidebar to expand. Click outside to collapse.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export const Partner: Story = {
  name: 'Partner App',
  render: () => {
    const [collapsed, setCollapsed] = useState(true)
    const [activeId, setActiveId] = useState('leads')

    return (
      <div className="relative min-h-screen bg-page overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 flex min-h-screen">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onNavigate={(item) => {
              setActiveId(item.id)
            }}
            onHelpClick={() => alert('Help clicked!')}
          />
          <div className="flex-1 p-6">
            <div className="bg-surface rounded-lg p-4 shadow-sm border border-default">
              <p className="text-primary font-medium">Active: {activeId}</p>
              <p className="text-secondary text-sm mt-2">
                Hover over sidebar to expand. Click outside to collapse.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
