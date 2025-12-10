import type { Meta, StoryObj } from '@storybook/react'
import { AppHeader, type UserMenuItem } from './AppHeader'
import { User, Settings, HelpCircle, LogOut, CreditCard } from 'lucide-react'

const meta: Meta<typeof AppHeader> = {
  title: 'Shared/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AppHeader

Application header component for the Disrupt Family apps (Flow, Market, Partner).

## Features
- **Product-specific branding**: Automatically displays the correct logo and tagline based on the \`product\` prop
- **Notification bell**: Shows notification count with a badge
- **User menu**: Avatar with dropdown menu for user actions
- **Wave pattern background**: Decorative wave pattern with glass morphism effect
- **Glass morphism effects**: Hover effects on interactive elements

## Usage

\`\`\`tsx
<AppHeader
  product="flow"
  notificationCount={4}
  user={{ name: 'John Doe', email: 'john@example.com' }}
  onNotificationClick={() => console.log('Notifications')}
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
    colorMode: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Logo color mode',
    },
    showWavePattern: {
      control: 'boolean',
      description: 'Whether to show the wave pattern background',
    },
    tagline: {
      control: 'text',
      description: 'Custom tagline override',
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

// Sample menu items
const sampleMenuItems: UserMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" />, separator: true },
  { id: 'logout', label: 'Log out', icon: <LogOut className="w-4 h-4" />, destructive: true, separator: true },
]

// =============================================================================
// PRODUCT VARIANTS
// =============================================================================

export const FlowProduct: Story = {
  name: 'Flow (Default)',
  args: {
    product: 'flow',
    notificationCount: 4,
    user: sampleUser,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Flow EHS product header with default "Smart EHS Automation" tagline.',
      },
    },
  },
}

export const MarketProduct: Story = {
  name: 'Market',
  args: {
    product: 'market',
    notificationCount: 2,
    user: sampleUser,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Market product header with "EHS Marketplace" tagline.',
      },
    },
  },
}

export const PartnerProduct: Story = {
  name: 'Partner',
  args: {
    product: 'partner',
    notificationCount: 0,
    user: sampleUser,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Partner Portal header with "Partner Portal" tagline.',
      },
    },
  },
}

// =============================================================================
// NOTIFICATION STATES
// =============================================================================

export const WithNotifications: Story = {
  name: 'With Notifications',
  args: {
    product: 'flow',
    notificationCount: 4,
    user: sampleUser,
    onNotificationClick: () => console.log('Notifications clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with notification badge showing 4 unread notifications.',
      },
    },
  },
}

export const ManyNotifications: Story = {
  name: 'Many Notifications (99+)',
  args: {
    product: 'flow',
    notificationCount: 150,
    user: sampleUser,
  },
  parameters: {
    docs: {
      description: {
        story: 'When notification count exceeds 99, badge shows "99+".',
      },
    },
  },
}

export const NoNotifications: Story = {
  name: 'No Notifications',
  args: {
    product: 'flow',
    notificationCount: 0,
    user: sampleUser,
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge is hidden when notification count is 0.',
      },
    },
  },
}

// =============================================================================
// USER STATES
// =============================================================================

export const WithUserAvatar: Story = {
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
        story: 'User with avatar image instead of initials.',
      },
    },
  },
}

export const WithInitials: Story = {
  name: 'With Initials',
  args: {
    product: 'flow',
    notificationCount: 2,
    user: sampleUser,
    menuItems: sampleMenuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'User without avatar shows initials fallback.',
      },
    },
  },
}

export const NoUser: Story = {
  name: 'No User (Logged Out)',
  args: {
    product: 'flow',
    notificationCount: 0,
    user: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without user - only shows notifications. Useful for logged-out state or public pages.',
      },
    },
  },
}

// =============================================================================
// CUSTOMIZATION
// =============================================================================

export const CustomTagline: Story = {
  name: 'Custom Tagline',
  args: {
    product: 'flow',
    tagline: 'Enterprise Safety Suite',
    notificationCount: 1,
    user: sampleUser,
  },
  parameters: {
    docs: {
      description: {
        story: 'Override the default product tagline with a custom one.',
      },
    },
  },
}

export const WithoutWavePattern: Story = {
  name: 'Without Wave Pattern',
  args: {
    product: 'flow',
    showWavePattern: false,
    notificationCount: 2,
    user: sampleUser,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without the decorative wave pattern background.',
      },
    },
  },
}

// =============================================================================
// INTERACTIVE
// =============================================================================

export const Interactive: Story = {
  name: 'Interactive Demo',
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
          <p className="text-sm text-muted">
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
// ALL PRODUCTS COMPARISON
// =============================================================================

export const AllProducts: Story = {
  name: 'All Products Comparison',
  render: () => (
    <div className="space-y-4 pb-8">
      <div>
        <p className="text-xs font-medium text-muted px-4 py-2">Flow EHS</p>
        <AppHeader
          product="flow"
          notificationCount={4}
          user={sampleUser}
          disablePortal
        />
      </div>
      <div>
        <p className="text-xs font-medium text-muted px-4 py-2">Market</p>
        <AppHeader
          product="market"
          notificationCount={12}
          user={sampleUserWithAvatar}
          disablePortal
        />
      </div>
      <div>
        <p className="text-xs font-medium text-muted px-4 py-2">Partner Portal</p>
        <AppHeader
          product="partner"
          notificationCount={0}
          user={sampleUser}
          disablePortal
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all three product headers.',
      },
    },
  },
}
