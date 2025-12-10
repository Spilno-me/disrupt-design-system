import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Bell } from 'lucide-react'
import { NotificationsPanel, Notification, NotificationBell } from './NotificationsPanel'
import { Button } from './button'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof NotificationsPanel> = {
  title: 'Partner/Components/NotificationsPanel',
  component: NotificationsPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Notifications Panel

A slide-out panel for displaying user notifications. Features:
- Different notification types with appropriate icons
- Read/unread status indicators
- Mark individual or all as read
- Delete individual or clear all
- Empty state handling
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NotificationsPanel>

// =============================================================================
// MOCK DATA
// =============================================================================

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New lead from website',
    message: 'Lisa Chen from Novacorp Industries submitted a contact form requesting a demo.',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '/leads/123',
    actionLabel: 'View lead',
  },
  {
    id: '2',
    type: 'invoice',
    title: 'Invoice paid',
    message: 'Global Manufacturing paid invoice #INV-2025-1208 for $150,000.',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/invoices/456',
    actionLabel: 'View invoice',
  },
  {
    id: '3',
    type: 'tenant',
    title: 'Tenant provisioned',
    message: 'Fine Goods corp. has been successfully provisioned with 670 users.',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/tenants/789',
    actionLabel: 'View tenant',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Lead requires attention',
    message: 'Pacific Logistics has not responded in 7 days. Consider following up.',
    timestamp: '1 day ago',
    read: false,
    actionUrl: '/leads/321',
    actionLabel: 'View lead',
  },
  {
    id: '5',
    type: 'partner',
    title: 'New partner onboarded',
    message: 'Apex Manufacturing has been added to your partner network with Premium tier.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'System maintenance scheduled',
    message: 'Planned maintenance on December 15th from 2:00 AM - 4:00 AM EST.',
    timestamp: '3 days ago',
    read: true,
  },
]

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

function InteractiveNotificationsPanel({
  initialNotifications = mockNotifications,
}: {
  initialNotifications?: Notification[]
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex items-center gap-4">
      <NotificationsPanel
        notifications={notifications}
        open={open}
        onOpenChange={setOpen}
        onNotificationClick={(notification) => {
          console.log('Clicked notification:', notification)
          if (!notification.read) {
            handleMarkAsRead(notification.id)
          }
        }}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
      <span className="text-sm text-secondary">
        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default notifications panel with mixed read/unread states
 */
export const Default: Story = {
  render: () => <InteractiveNotificationsPanel />,
}

/**
 * All notifications unread
 */
export const AllUnread: Story = {
  render: () => (
    <InteractiveNotificationsPanel
      initialNotifications={mockNotifications.map((n) => ({ ...n, read: false }))}
    />
  ),
}

/**
 * All notifications read
 */
export const AllRead: Story = {
  render: () => (
    <InteractiveNotificationsPanel
      initialNotifications={mockNotifications.map((n) => ({ ...n, read: true }))}
    />
  ),
}

/**
 * Empty state - no notifications
 */
export const Empty: Story = {
  render: () => <InteractiveNotificationsPanel initialNotifications={[]} />,
}

/**
 * Many notifications (scrollable)
 */
export const ManyNotifications: Story = {
  render: () => {
    const manyNotifications: Notification[] = [
      ...mockNotifications,
      {
        id: '7',
        type: 'lead',
        title: 'Follow-up reminder',
        message: 'Time to follow up with Tech Solutions Inc. about their demo request.',
        timestamp: '4 days ago',
        read: false,
      },
      {
        id: '8',
        type: 'invoice',
        title: 'Invoice overdue',
        message: 'Invoice #INV-2025-0928 for Startup Ventures is now 15 days overdue.',
        timestamp: '5 days ago',
        read: false,
      },
      {
        id: '9',
        type: 'tenant',
        title: 'Tenant usage alert',
        message: 'Fine Goods corp. is approaching their user license limit (95% used).',
        timestamp: '6 days ago',
        read: true,
      },
      {
        id: '10',
        type: 'partner',
        title: 'Partner status change',
        message: 'Horizon Dynamics has been upgraded to Premium tier.',
        timestamp: '1 week ago',
        read: true,
      },
    ]
    return <InteractiveNotificationsPanel initialNotifications={manyNotifications} />
  },
}

/**
 * Single notification
 */
export const SingleNotification: Story = {
  render: () => (
    <InteractiveNotificationsPanel
      initialNotifications={[mockNotifications[0]]}
    />
  ),
}

/**
 * Notification bell component standalone
 */
export const BellComponent: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <NotificationBell count={0} onClick={() => alert('Clicked!')} />
        <span className="text-xs text-secondary">No notifications</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NotificationBell count={3} onClick={() => alert('Clicked!')} />
        <span className="text-xs text-secondary">3 notifications</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NotificationBell count={99} onClick={() => alert('Clicked!')} />
        <span className="text-xs text-secondary">Many notifications</span>
      </div>
    </div>
  ),
}

/**
 * Custom trigger button
 */
export const CustomTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const unreadCount = mockNotifications.filter((n) => !n.read).length

    return (
      <NotificationsPanel
        notifications={mockNotifications}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="accent" className="gap-2">
            <Bell className="w-4 h-4" />
            View Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
        }
        onNotificationClick={(n) => console.log('Clicked:', n)}
      />
    )
  },
}

/**
 * Open by default (for testing)
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [notifications, setNotifications] = useState(mockNotifications)

    return (
      <NotificationsPanel
        notifications={notifications}
        open={open}
        onOpenChange={setOpen}
        onNotificationClick={(n) => console.log('Clicked:', n)}
        onMarkAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onDelete={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
        onClearAll={() => setNotifications([])}
      />
    )
  },
}

/**
 * Different notification types showcase
 */
export const NotificationTypes: Story = {
  render: () => {
    const typeShowcase: Notification[] = [
      {
        id: '1',
        type: 'lead',
        title: 'Lead Notification',
        message: 'New leads and lead-related updates',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: '2',
        type: 'invoice',
        title: 'Invoice Notification',
        message: 'Payment and invoice status updates',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: '3',
        type: 'tenant',
        title: 'Tenant Notification',
        message: 'Tenant provisioning and status updates',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: '4',
        type: 'partner',
        title: 'Partner Notification',
        message: 'Partner network updates and changes',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: '5',
        type: 'warning',
        title: 'Warning Notification',
        message: 'Important alerts requiring attention',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: '6',
        type: 'system',
        title: 'System Notification',
        message: 'System updates and maintenance notices',
        timestamp: 'Just now',
        read: false,
      },
    ]

    const [open, setOpen] = useState(true)

    return (
      <NotificationsPanel
        notifications={typeShowcase}
        open={open}
        onOpenChange={setOpen}
        onNotificationClick={(n) => console.log('Clicked:', n)}
      />
    )
  },
}
