import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Zap,
  ClipboardList,
  FileText,
  Building2,
  Network,
  DollarSign,
  Settings,
  TrendingUp,
  TrendingDown,
  
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/Skeleton'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/Dashboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Partner Dashboard

The main dashboard for the Partner Portal, displaying key performance indicators,
recent activity, and quick actions. This is the landing page after login.

## Features
- KPI cards with trend indicators
- Recent activity feed
- Quick action buttons
- Responsive layout
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// NAVIGATION DATA
// =============================================================================

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
    icon: <Users />,
    href: '/leads',
    badge: 6,
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <Zap />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
    badge: 3,
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
    badge: 19,
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
    badge: 9,
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
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// TYPES
// =============================================================================

interface DashboardStats {
  totalRevenue: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
  activePartners: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
  openLeads: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
  pendingInvoices: { value: string; overdueCount: number }
}

interface ActivityItem {
  id: string
  type: 'lead' | 'invoice' | 'tenant' | 'partner'
  icon: React.ReactNode
  iconColor: string
  title: string
  subtitle: string
  time: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

const defaultStats: DashboardStats = {
  totalRevenue: { value: '$1.2M', trend: '+12%', trendDirection: 'up' },
  activePartners: { value: 24, trend: '+3', trendDirection: 'up' },
  openLeads: { value: 18, trend: '-2', trendDirection: 'down' },
  pendingInvoices: { value: '$45K', overdueCount: 1 },
}

const highPerformanceStats: DashboardStats = {
  totalRevenue: { value: '$3.8M', trend: '+45%', trendDirection: 'up' },
  activePartners: { value: 89, trend: '+15', trendDirection: 'up' },
  openLeads: { value: 156, trend: '+42', trendDirection: 'up' },
  pendingInvoices: { value: '$320K', overdueCount: 0 },
}

const emptyStats: DashboardStats = {
  totalRevenue: { value: '$0', trend: '0%', trendDirection: 'neutral' },
  activePartners: { value: 0, trend: '0', trendDirection: 'neutral' },
  openLeads: { value: 0, trend: '0', trendDirection: 'neutral' },
  pendingInvoices: { value: '$0', overdueCount: 0 },
}

const defaultActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'lead',
    icon: <Users className="w-5 h-5" />,
    iconColor: 'text-teal',
    title: 'New lead from website',
    subtitle: 'Lisa Chen - Novacorp Industries',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'invoice',
    icon: <CheckCircle2 className="w-5 h-5" />,
    iconColor: 'text-success',
    title: 'Invoice paid',
    subtitle: 'Global Manufacturing - $150,000',
    time: '1d ago',
  },
  {
    id: '3',
    type: 'tenant',
    icon: <Zap className="w-5 h-5" />,
    iconColor: 'text-warning',
    title: 'Tenant provisioned',
    subtitle: 'Fine Goods corp. - 670 users',
    time: '2d ago',
  },
  {
    id: '4',
    type: 'partner',
    icon: <Building2 className="w-5 h-5" />,
    iconColor: 'text-info',
    title: 'New partner onboarded',
    subtitle: 'Apex Manufacturing - Premium tier',
    time: '3d ago',
  },
  {
    id: '5',
    type: 'lead',
    icon: <AlertTriangle className="w-5 h-5" />,
    iconColor: 'text-error',
    title: 'Lead requires attention',
    subtitle: 'Pacific Logistics - No response in 7 days',
    time: '1w ago',
  },
]

// =============================================================================
// DASHBOARD CONTENT COMPONENT
// =============================================================================

interface DashboardContentProps {
  stats: DashboardStats
  activity: ActivityItem[]
  loading?: boolean
  error?: string | null
  onNavigate?: (page: string) => void
  onRetry?: () => void
}

function DashboardContent({
  stats,
  activity,
  loading = false,
  error = null,
  onNavigate,
  onRetry,
}: DashboardContentProps) {
  // Error State
  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        </div>

        <Card className="bg-error-light border-error">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-primary mb-2">Unable to load dashboard</h2>
            <p className="text-secondary mb-4">{error}</p>
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
          <Skeleton className="h-5 w-32" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-surface border-default">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-surface border-default">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Empty State
  if (stats.totalRevenue.value === '$0' && stats.activePartners.value === 0) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
          <span className="text-sm text-secondary">Welcome to Partner Portal</span>
        </div>

        {/* Empty KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface border-default">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">$0</p>
                </div>
                <DollarSign className="w-8 h-8 text-muted" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Active Partners</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
                <Building2 className="w-8 h-8 text-muted" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Open Leads</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
                <Users className="w-8 h-8 text-muted" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Pending Invoices</p>
                  <p className="text-2xl font-bold text-primary">$0</p>
                </div>
                <FileText className="w-8 h-8 text-muted" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Card */}
        <Card className="bg-accent-bg border-teal">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 text-teal mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-primary mb-2">Get Started</h2>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              Welcome to your Partner Portal! Start by creating your first lead or provisioning a
              new tenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="accent" onClick={() => onNavigate?.('leads')}>
                <Users className="w-4 h-4 mr-2" />
                Create Lead
              </Button>
              <Button variant="secondary" onClick={() => onNavigate?.('tenant-provisioning')}>
                <Zap className="w-4 h-4 mr-2" />
                Provision Tenant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Normal State with Data
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <span className="text-sm text-secondary">Welcome back, John</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">{stats.totalRevenue.value}</p>
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stats.totalRevenue.trendDirection === 'up'
                    ? 'text-success'
                    : stats.totalRevenue.trendDirection === 'down'
                    ? 'text-error'
                    : 'text-muted'
                }`}
              >
                {stats.totalRevenue.trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : stats.totalRevenue.trendDirection === 'down' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                {stats.totalRevenue.trend}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Active Partners</p>
                <p className="text-2xl font-bold text-primary">{stats.activePartners.value}</p>
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stats.activePartners.trendDirection === 'up' ? 'text-success' : 'text-muted'
                }`}
              >
                {stats.activePartners.trendDirection === 'up' && (
                  <TrendingUp className="w-4 h-4" />
                )}
                {stats.activePartners.trend}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Open Leads</p>
                <p className="text-2xl font-bold text-primary">{stats.openLeads.value}</p>
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stats.openLeads.trendDirection === 'up'
                    ? 'text-success'
                    : stats.openLeads.trendDirection === 'down'
                    ? 'text-warning'
                    : 'text-muted'
                }`}
              >
                {stats.openLeads.trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : stats.openLeads.trendDirection === 'down' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                {stats.openLeads.trend}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-default">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Pending Invoices</p>
                <p className="text-2xl font-bold text-primary">{stats.pendingInvoices.value}</p>
              </div>
              {stats.pendingInvoices.overdueCount > 0 && (
                <div className="flex items-center gap-1 text-error text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {stats.pendingInvoices.overdueCount} overdue
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface border-default">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
                <div className={item.iconColor}>{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{item.title}</p>
                  <p className="text-xs text-secondary">{item.subtitle}</p>
                </div>
                <span className="text-xs text-muted">{item.time}</span>
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
              onClick={() => onNavigate?.('tenant-provisioning')}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                New Tenant Provisioning
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between"
              onClick={() => onNavigate?.('leads')}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                View All Leads
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
              onClick={() => onNavigate?.('partners')}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Partner Management
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

interface DashboardPageProps {
  stats?: DashboardStats
  activity?: ActivityItem[]
  loading?: boolean
  error?: string | null
}

function DashboardPage({
  stats = defaultStats,
  activity = defaultActivity,
  loading = false,
  error = null,
}: DashboardPageProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('dashboard')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handlePageNavigate = (pageId: string) => {
    setActiveNavItem(pageId)
    console.log('Navigate to page:', pageId)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />

      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={4}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => {
            if (item.id === 'logout') {
              alert('Logging out...')
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={activeNavItem}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => alert('Opening help...')}
            />
          </div>

          <main className="flex-1 overflow-auto">
            <DashboardContent
              stats={stats}
              activity={activity}
              loading={loading}
              error={error}
              onNavigate={handlePageNavigate}
              onRetry={() => window.location.reload()}
            />
          </main>
        </div>

        <AppFooter compactOnMobile />

        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={handleNavigate}
          maxVisibleItems={4}
          showHelpItem
          onHelpClick={() => alert('Opening help...')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default dashboard with typical data
 */
export const Default: Story = {
  render: () => <DashboardPage />,
}

/**
 * Dashboard with high performance metrics
 */
export const HighPerformance: Story = {
  render: () => <DashboardPage stats={highPerformanceStats} />,
}

/**
 * Empty state for new users
 */
export const EmptyState: Story = {
  render: () => <DashboardPage stats={emptyStats} activity={[]} />,
}

/**
 * Loading state while fetching data
 */
export const Loading: Story = {
  render: () => <DashboardPage loading={true} />,
}

/**
 * Error state when data fails to load
 */
export const Error: Story = {
  render: () => (
    <DashboardPage error="Failed to load dashboard data. Please check your connection and try again." />
  ),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <DashboardPage />,
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <DashboardPage />,
}

/**
 * Content only (no layout) for embedding
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <DashboardContent
          stats={defaultStats}
          activity={defaultActivity}
          onNavigate={(page) => console.log('Navigate:', page)}
        />
      </div>
    </div>
  ),
}

/**
 * Sidebar expanded by default
 */
function DashboardPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('dashboard')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={4}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile' },
            { id: 'settings', label: 'Settings' },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={() => {}}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeNavItem}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onNavigate={(item) => setActiveNavItem(item.id)}
          />

          <main className="flex-1 overflow-auto">
            <DashboardContent
              stats={defaultStats}
              activity={defaultActivity}
              onNavigate={(page) => setActiveNavItem(page)}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <DashboardPageExpanded />,
}
