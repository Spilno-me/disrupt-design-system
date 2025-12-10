import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Building2,
} from 'lucide-react'
import { AppLayoutShell, AppNavItem } from '../templates/layout/AppLayoutShell'
import {
  partnerNavItems,
  flowNavItems,
  marketNavItems,
} from '../templates/navigation/configs'
import {
  mockUsers,
  defaultUserMenuItems,
  mockPartnerKPIs,
  mockFlowKPIs,
  mockMarketKPIs,
  mockRecentActivity,
  prototypeAlert,
} from '../components/layout/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof AppLayoutShell> = {
  title: 'Layout/AppLayoutShell',
  component: AppLayoutShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AppLayoutShell - Shared Product Layout

The AppLayoutShell is the foundation for all DDS product apps. It provides:

- **Consistent header** with product branding, notifications, and user menu
- **Responsive sidebar** for desktop navigation (collapsible)
- **Mobile navigation** via BottomNav or MobileNav drawer
- **Footer** with branding
- **Animated grid background**

## Usage Modes

### 1. Automatic Mode
Pass \`navItems\` with \`component\` props for each page:

\`\`\`tsx
<AppLayoutShell
  product="partner"
  navItems={[
    { id: 'dashboard', label: 'Dashboard', icon: <Home />, component: <DashboardPage /> },
    { id: 'leads', label: 'Leads', icon: <Users />, component: <LeadsPage /> },
  ]}
  user={{ name: 'John Doe' }}
/>
\`\`\`

### 2. Controlled Mode
Manage page state externally:

\`\`\`tsx
const [page, setPage] = useState('dashboard')

<AppLayoutShell
  product="flow"
  navItems={navItems}
  currentPageId={page}
  onPageChange={setPage}
>
  {page === 'dashboard' && <DashboardPage />}
  {page === 'incidents' && <IncidentsPage />}
</AppLayoutShell>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    product: {
      control: 'select',
      options: ['partner', 'flow', 'market'],
      description: 'Product type determines branding and default styles',
    },
    showBackground: {
      control: 'boolean',
      description: 'Show the animated grid blob background',
    },
    showFooter: {
      control: 'boolean',
      description: 'Show the footer',
    },
    showHelpItem: {
      control: 'boolean',
      description: 'Show help item in navigation',
    },
  },
}

export default meta
type Story = StoryObj<typeof AppLayoutShell>

// =============================================================================
// SAMPLE PAGE COMPONENTS
// =============================================================================

interface DashboardPageProps {
  kpis: typeof mockPartnerKPIs
  onNavigate?: (page: string) => void
}

function DashboardPage({ kpis, onNavigate }: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <span className="text-sm text-secondary">Welcome back!</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-surface border-default">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">{kpi.label}</p>
                  <p className="text-2xl font-bold text-primary">{kpi.value}</p>
                </div>
                {kpi.trend && (
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      kpi.trendDirection === 'up'
                        ? 'text-success'
                        : kpi.trendDirection === 'down'
                        ? 'text-warning'
                        : 'text-muted'
                    }`}
                  >
                    {kpi.trendDirection === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : kpi.trendDirection === 'down' ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {kpi.trend}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface border-default">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentActivity.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-mutedBg"
              >
                {activity.icon === 'clock' && (
                  <Clock className="w-5 h-5 text-teal" />
                )}
                {activity.icon === 'check' && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                {activity.icon === 'zap' && (
                  <Zap className="w-5 h-5 text-warning" />
                )}
                {activity.icon === 'user' && (
                  <Users className="w-5 h-5 text-info" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    {activity.action}
                  </p>
                  <p className="text-xs text-secondary">{activity.subject}</p>
                </div>
                <span className="text-xs text-muted">{activity.timestamp}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate?.('leads')}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                View Leads
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate?.('invoices')}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manage Invoices
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate?.('settings')}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PlaceholderPage({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6">
      <div className="text-center">
        {icon && <div className="mb-4 text-teal">{icon}</div>}
        <h1 className="text-2xl font-semibold text-primary mb-2">{title}</h1>
        <p className="text-secondary">
          This page is part of the prototype. Content coming soon.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Partner Portal with full navigation and dashboard
 */
export const PartnerPortal: Story = {
  render: function PartnerPortalStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    const renderContent = () => {
      switch (currentPage) {
        case 'dashboard':
          return (
            <DashboardPage
              kpis={mockPartnerKPIs}
              onNavigate={setCurrentPage}
            />
          )
        case 'leads':
          return <PlaceholderPage title="Leads Management" icon={<Users className="w-12 h-12" />} />
        case 'invoices':
          return <PlaceholderPage title="Invoice Management" icon={<FileText className="w-12 h-12" />} />
        case 'partners':
          return <PlaceholderPage title="Partner Companies" icon={<Building2 className="w-12 h-12" />} />
        default:
          return <PlaceholderPage title={currentPage} />
      }
    }

    return (
      <AppLayoutShell
        product="partner"
        navItems={partnerNavItems}
        user={mockUsers.partner}
        userMenuItems={defaultUserMenuItems}
        notificationCount={4}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        onNotificationClick={() => prototypeAlert('Opening notifications panel')}
        onMenuItemClick={(item) => prototypeAlert(`Menu: ${item.label}`)}
        onHelpClick={() => prototypeAlert('Opening help documentation')}
        onLogoClick={() => setCurrentPage('dashboard')}
      >
        {renderContent()}
      </AppLayoutShell>
    )
  },
}

/**
 * Flow App with EHS-specific navigation
 */
export const FlowApp: Story = {
  render: function FlowAppStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    const renderContent = () => {
      if (currentPage === 'dashboard') {
        return (
          <DashboardPage
            kpis={mockFlowKPIs}
            onNavigate={setCurrentPage}
          />
        )
      }
      return <PlaceholderPage title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />
    }

    return (
      <AppLayoutShell
        product="flow"
        navItems={flowNavItems}
        user={mockUsers.flow}
        userMenuItems={defaultUserMenuItems}
        notificationCount={12}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        onNotificationClick={() => prototypeAlert('Opening notifications')}
        onMenuItemClick={(item) => prototypeAlert(`Menu: ${item.label}`)}
        onHelpClick={() => prototypeAlert('Opening Flow help')}
      >
        {renderContent()}
      </AppLayoutShell>
    )
  },
}

/**
 * Market App with marketplace navigation
 */
export const MarketApp: Story = {
  render: function MarketAppStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    const renderContent = () => {
      if (currentPage === 'dashboard') {
        return (
          <DashboardPage
            kpis={mockMarketKPIs}
            onNavigate={setCurrentPage}
          />
        )
      }
      return <PlaceholderPage title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />
    }

    return (
      <AppLayoutShell
        product="market"
        navItems={marketNavItems}
        user={mockUsers.market}
        userMenuItems={defaultUserMenuItems}
        notificationCount={6}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        onNotificationClick={() => prototypeAlert('Opening notifications')}
        onMenuItemClick={(item) => prototypeAlert(`Menu: ${item.label}`)}
        onHelpClick={() => prototypeAlert('Opening Market help')}
      >
        {renderContent()}
      </AppLayoutShell>
    )
  },
}

/**
 * Mobile viewport showing bottom navigation
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: function MobileViewStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
      <AppLayoutShell
        product="partner"
        navItems={partnerNavItems}
        user={mockUsers.partner}
        notificationCount={4}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        maxBottomNavItems={3}
      >
        <DashboardPage kpis={mockPartnerKPIs} onNavigate={setCurrentPage} />
      </AppLayoutShell>
    )
  },
}

/**
 * Tablet viewport
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: function TabletViewStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
      <AppLayoutShell
        product="flow"
        navItems={flowNavItems}
        user={mockUsers.flow}
        notificationCount={8}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
      >
        <DashboardPage kpis={mockFlowKPIs} onNavigate={setCurrentPage} />
      </AppLayoutShell>
    )
  },
}

/**
 * Without background - for content-heavy pages
 */
export const NoBackground: Story = {
  render: function NoBackgroundStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
      <AppLayoutShell
        product="partner"
        navItems={partnerNavItems}
        user={mockUsers.partner}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        showBackground={false}
      >
        <DashboardPage kpis={mockPartnerKPIs} onNavigate={setCurrentPage} />
      </AppLayoutShell>
    )
  },
}

/**
 * Without footer - for full-height content
 */
export const NoFooter: Story = {
  render: function NoFooterStory() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
      <AppLayoutShell
        product="market"
        navItems={marketNavItems}
        user={mockUsers.market}
        currentPageId={currentPage}
        onPageChange={setCurrentPage}
        showFooter={false}
      >
        <DashboardPage kpis={mockMarketKPIs} onNavigate={setCurrentPage} />
      </AppLayoutShell>
    )
  },
}

/**
 * Using automatic mode with component props
 */
export const AutomaticMode: Story = {
  render: function AutomaticModeStory() {
    // Define nav items with components
    const navItemsWithComponents: AppNavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard />,
        component: <DashboardPage kpis={mockPartnerKPIs} />,
      },
      {
        id: 'leads',
        label: 'Leads',
        icon: <Users />,
        badge: 6,
        component: <PlaceholderPage title="Leads" icon={<Users className="w-12 h-12" />} />,
      },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: <FileText />,
        badge: 3,
        component: <PlaceholderPage title="Invoices" icon={<FileText className="w-12 h-12" />} />,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings />,
        component: <PlaceholderPage title="Settings" icon={<Settings className="w-12 h-12" />} />,
      },
    ]

    return (
      <AppLayoutShell
        product="partner"
        navItems={navItemsWithComponents}
        initialPage="dashboard"
        user={mockUsers.partner}
        notificationCount={4}
        onNavigate={(item) => console.log('Navigated to:', item.id)}
      />
    )
  },
}
