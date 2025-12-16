import type { Meta, StoryObj } from '@storybook/react'
import { AppHeader } from './AppHeader'
import { User, Settings, LogOut } from 'lucide-react'

const meta: Meta<typeof AppHeader> = {
  title: 'Core/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AppHeader

**Type:** MOLECULE (compound component with multiple sub-components)

Application header component for the Disrupt Family apps (Flow, Market, Partner).

## Features
- **Product-specific branding**: Automatically displays the correct logo and tagline based on the \`product\` prop
- **Notification bell**: Shows notification count with a badge
- **User menu**: Avatar with dropdown menu for user actions
- **Wave pattern background**: Decorative wave pattern with glass morphism effect
- **Mobile support**: Optional left content slot for mobile hamburger menus

## Testing
- \`data-slot="app-header"\` - Main header container
- \`data-slot="logo-container"\` - Logo and tagline section
- \`data-slot="notification-bell"\` - Notification bell button
- \`data-slot="user-avatar"\` - User avatar
- \`data-slot="user-menu-trigger"\` - User menu trigger button
- \`data-slot="user-menu-content"\` - User menu dropdown content

## Usage

\`\`\`tsx
import { AppHeader } from '@/components/ui/AppHeader'

// Basic usage
<AppHeader
  product="flow"
  notificationCount={4}
  user={{ name: 'John Doe', email: 'john@example.com' }}
  onNotificationClick={() => console.log('Notifications')}
/>

// With custom menu items
<AppHeader
  product="market"
  user={{ name: 'Jane Smith', email: 'jane@example.com' }}
  menuItems={[
    { id: 'profile', label: 'Profile', icon: <User /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    { id: 'logout', label: 'Log out', destructive: true },
  ]}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    product: {
      control: 'select',
      options: ['flow', 'market', 'partner'],
      description: 'Which product app this header is for',
    },
    notificationCount: {
      control: { type: 'number', min: 0, max: 999 },
      description: 'Notification badge count (0 to hide)',
    },
    showWavePattern: {
      control: 'boolean',
      description: 'Whether to show the wave pattern background',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-white">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AppHeader>

// Sample user data
const sampleUser = {
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  initials: 'SC',
}

const sampleUserWithAvatar = {
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
}

const sampleMenuItems = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', icon: <LogOut className="w-4 h-4" />, destructive: true, separator: true },
]

// =============================================================================
// ESSENTIAL STORIES
// =============================================================================

export const Default: Story = {
  name: 'Default (Flow)',
  args: {
    product: 'flow',
    notificationCount: 4,
    user: sampleUser,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Flow product header with notifications and user menu.',
      },
    },
  },
}

export const WithAvatar: Story = {
  name: 'With User Avatar',
  args: {
    product: 'flow',
    notificationCount: 3,
    user: sampleUserWithAvatar,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with user avatar image instead of initials.',
      },
    },
  },
}

export const Interactive: Story = {
  name: 'Interactive',
  args: {
    product: 'flow',
    notificationCount: 7,
    user: sampleUserWithAvatar,
    menuItems: sampleMenuItems,
  },
  render: (args) => {
    return (
      <div className="space-y-4">
        <AppHeader
          {...args}
          onLogoClick={() => alert('Logo clicked! Navigate to home.')}
          onNotificationClick={() => alert('Notifications clicked! Open notification panel.')}
          onMenuItemClick={(item) => alert(`Menu item clicked: ${item.label}`)}
          disablePortal
        />
        <div className="px-4 pt-8">
          <p className="text-sm text-secondary">
            Click on the logo, notification bell, or user menu items to see the callbacks in action.
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing all click handlers. Click elements to see alerts.',
      },
    },
  },
}

// =============================================================================
// ALL STATES
// =============================================================================

export const AllStates: Story = {
  name: '🎨 All States',
  render: () => (
    <div className="space-y-12 pb-8">
      {/* Anatomy Diagram */}
      <div className="px-6 py-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-primary">Component Anatomy</h3>
        <div className="space-y-2 text-sm">
          <p><code className="px-2 py-1 bg-white rounded">data-slot="app-header"</code> - Main header container</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="logo-container"</code> - Logo and tagline section</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="notification-bell"</code> - Notification bell button</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="notification-badge"</code> - Badge showing count</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="user-avatar"</code> - User avatar</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="user-menu-trigger"</code> - User menu trigger button</p>
          <p><code className="px-2 py-1 bg-white rounded">data-slot="user-menu-content"</code> - User menu dropdown</p>
        </div>
      </div>

      {/* All Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4 text-primary">Product Variants</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Flow EHS</p>
            <AppHeader
              product="flow"
              notificationCount={4}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Market</p>
            <AppHeader
              product="market"
              notificationCount={12}
              user={sampleUserWithAvatar}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Partner Portal</p>
            <AppHeader
              product="partner"
              notificationCount={0}
              user={sampleUser}
              disablePortal
            />
          </div>
        </div>
      </div>

      {/* Notification States */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4 text-primary">Notification States</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">With Notifications (4)</p>
            <AppHeader
              product="flow"
              notificationCount={4}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Many Notifications (99+)</p>
            <AppHeader
              product="flow"
              notificationCount={150}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">No Notifications</p>
            <AppHeader
              product="flow"
              notificationCount={0}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Notifications Hidden</p>
            <AppHeader
              product="flow"
              showNotifications={false}
              user={sampleUser}
              disablePortal
            />
          </div>
        </div>
      </div>

      {/* User States */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4 text-primary">User States</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">With Avatar Image</p>
            <AppHeader
              product="flow"
              notificationCount={3}
              user={sampleUserWithAvatar}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">With Initials</p>
            <AppHeader
              product="flow"
              notificationCount={2}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">No User (Logged Out)</p>
            <AppHeader
              product="flow"
              notificationCount={0}
              disablePortal
            />
          </div>
        </div>
      </div>

      {/* Customization */}
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4 text-primary">Customization</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Custom Tagline</p>
            <AppHeader
              product="flow"
              tagline="Enterprise Safety Suite"
              notificationCount={1}
              user={sampleUser}
              disablePortal
            />
          </div>
          <div>
            <p className="text-xs font-medium text-secondary px-4 py-2">Without Wave Pattern</p>
            <AppHeader
              product="flow"
              showWavePattern={false}
              notificationCount={2}
              user={sampleUser}
              disablePortal
            />
          </div>
        </div>
      </div>

      {/* Focus States Note */}
      <div className="px-6 py-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2 text-primary">Keyboard Navigation</h3>
        <ul className="text-sm space-y-1 text-secondary">
          <li><kbd className="px-2 py-1 bg-white rounded border">Tab</kbd> - Navigate between logo, notification bell, and user menu</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> or <kbd className="px-2 py-1 bg-white rounded border">Space</kbd> - Activate focused element</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">↓</kbd> - Open user menu when trigger is focused</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> - Close user menu</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive visual matrix showing all variants, notification states, user states, and customization options.',
      },
    },
  },
}
