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
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import {
  SettingsPage,
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../components/partners/SettingsPage'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof SettingsPage> = {
  title: 'Pages/Partner/Settings',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Settings Page

A comprehensive settings page for partner portal users to manage their profile,
company information, notification preferences, and security settings.

## Tabs
- **Profile**: Personal information, avatar, timezone
- **Company**: Business details and address
- **Notifications**: Email, push, and SMS preferences
- **Security**: Password change, 2FA setup
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsPage>

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
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// MOCK DATA
// =============================================================================

const mockUser: UserProfile = {
  firstName: 'John',
  lastName: 'Partner',
  email: 'john@partnercompany.com',
  phone: '+1 (555) 123-4567',
  role: 'Partner Administrator',
  timezone: 'America/New_York',
}

const mockCompany: CompanyProfile = {
  name: 'Acme Partner Solutions',
  address: '123 Business Park Drive',
  city: 'San Francisco',
  state: 'CA',
  zip: '94102',
  country: 'United States',
  website: 'https://acmepartners.com',
  phone: '+1 (555) 987-6543',
}

const mockNotifications: NotificationSettings = {
  emailNewLeads: true,
  emailInvoices: true,
  emailTenantRequests: true,
  emailWeeklyDigest: false,
  pushNotifications: true,
  smsAlerts: false,
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function SettingsFullPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState('settings')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />

      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={2}
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
            if (item.id === 'settings') setActiveNavItem('settings')
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
              onHelpClick={() => console.log('Help clicked')}
            />
          </div>

          <main className="flex-1 overflow-auto">
            <SettingsPage
              user={mockUser}
              company={mockCompany}
              notifications={mockNotifications}
              onSaveProfile={(profile) => {
                console.log('Saving profile:', profile)
                alert('Profile saved successfully!')
              }}
              onSaveCompany={(company) => {
                console.log('Saving company:', company)
                alert('Company information saved!')
              }}
              onSaveNotifications={(notifications) => {
                console.log('Saving notifications:', notifications)
                alert('Notification preferences saved!')
              }}
              onChangePassword={(current, newPass) => {
                console.log('Changing password')
                alert('Password changed successfully!')
              }}
              onChangeAvatar={(file) => {
                console.log('Avatar file:', file.name)
                alert(`Avatar "${file.name}" uploaded!`)
              }}
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
          onHelpClick={() => console.log('Help clicked')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default settings page with all tabs
 */
export const Default: Story = {
  render: () => <SettingsFullPage />,
}

/**
 * Settings page with sidebar expanded
 */
function SettingsPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('settings')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={true}
          notificationCount={2}
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
            <SettingsPage
              user={mockUser}
              company={mockCompany}
              notifications={mockNotifications}
              onSaveProfile={(profile) => alert('Profile saved!')}
              onSaveCompany={(company) => alert('Company saved!')}
              onSaveNotifications={(n) => alert('Notifications saved!')}
              onChangePassword={() => alert('Password changed!')}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <SettingsPageExpanded />,
}

/**
 * Content only (no layout) for embedding
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <SettingsPage
          user={mockUser}
          company={mockCompany}
          notifications={mockNotifications}
          onSaveProfile={(profile) => console.log('Save profile:', profile)}
          onSaveCompany={(company) => console.log('Save company:', company)}
          onSaveNotifications={(n) => console.log('Save notifications:', n)}
          onChangePassword={(c, n) => console.log('Change password')}
        />
      </div>
    </div>
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
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <SettingsPage
          user={mockUser}
          company={mockCompany}
          notifications={mockNotifications}
          onSaveProfile={(profile) => alert('Profile saved!')}
          onSaveCompany={(company) => alert('Company saved!')}
          onSaveNotifications={(n) => alert('Notifications saved!')}
          onChangePassword={() => alert('Password changed!')}
        />
      </div>
    </div>
  ),
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
  render: () => <SettingsFullPage />,
}

/**
 * User with avatar image
 */
export const WithAvatar: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <SettingsPage
          user={{
            ...mockUser,
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          }}
          company={mockCompany}
          notifications={mockNotifications}
          onSaveProfile={() => alert('Profile saved!')}
          onSaveCompany={() => alert('Company saved!')}
          onSaveNotifications={() => alert('Notifications saved!')}
          onChangePassword={() => alert('Password changed!')}
        />
      </div>
    </div>
  ),
}

/**
 * All notifications enabled
 */
export const AllNotificationsEnabled: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <SettingsPage
          user={mockUser}
          company={mockCompany}
          notifications={{
            emailNewLeads: true,
            emailInvoices: true,
            emailTenantRequests: true,
            emailWeeklyDigest: true,
            pushNotifications: true,
            smsAlerts: true,
          }}
          onSaveProfile={() => {}}
          onSaveCompany={() => {}}
          onSaveNotifications={() => {}}
          onChangePassword={() => {}}
        />
      </div>
    </div>
  ),
}

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <SettingsPage
          user={mockUser}
          company={mockCompany}
          notifications={mockNotifications}
          loading={true}
          onSaveProfile={() => {}}
          onSaveCompany={() => {}}
          onSaveNotifications={() => {}}
          onChangePassword={() => {}}
        />
      </div>
    </div>
  ),
}
