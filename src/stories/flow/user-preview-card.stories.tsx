/**
 * UserPreviewCard Stories
 *
 * Shows the hover card / tooltip preview for users in tables.
 * Displays user details without full navigation.
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { UserPreviewCard } from '../../flow/components/users/cards/UserPreviewCard'
import { mockUsers } from '../../flow/data/mockUsers'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof UserPreviewCard> = {
  title: 'Flow/User Management/UserPreviewCard',
  component: UserPreviewCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# UserPreviewCard

A quick preview card displayed when hovering over a user name in tables.

## Features

- **Avatar & Status**: Shows user photo with status badge
- **Contact Info**: Email, phone, department at a glance
- **Role Badges**: Shows first 3 assigned roles
- **Last Login**: Timestamp of last activity
- **Quick Actions**: Optional "View Profile" and "Email" buttons

## Usage

Typically used inside a popover or tooltip for hover-triggered display:

\`\`\`tsx
import { UserPreviewCard } from '@dds/design-system/flow'

<UserPreviewCard
  user={user}
  onViewProfile={() => navigate('/users/' + user.id)}
  onSendEmail={() => window.open('mailto:' + user.email)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    user: { control: false },
    onViewProfile: { action: 'onViewProfile' },
    onSendEmail: { action: 'onSendEmail' },
  },
}

export default meta
type Story = StoryObj<typeof UserPreviewCard>

// =============================================================================
// SAMPLE USERS
// =============================================================================

const activeUser = mockUsers[0] // John Smith - Active EHS Director
const pendingUser = mockUsers.find((u) => u.status === 'pending') || {
  ...mockUsers[0],
  id: 'pending-user',
  status: 'pending' as const,
  firstName: 'New',
  lastName: 'Employee',
  lastLoginAt: undefined,
}
const inactiveUser = mockUsers.find((u) => u.status === 'inactive') || {
  ...mockUsers[0],
  id: 'inactive-user',
  status: 'inactive' as const,
}
const lockedUser = mockUsers.find((u) => u.status === 'locked') || {
  ...mockUsers[0],
  id: 'locked-user',
  status: 'locked' as const,
  firstName: 'Locked',
  lastName: 'User',
}

// User with multiple roles
const multiRoleUser = mockUsers.find((u) => u.roleAssignments.length >= 2) || mockUsers[0]

// User without phone
const noPhoneUser = {
  ...mockUsers[0],
  id: 'no-phone-user',
  phone: undefined,
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - Active user with full info
 */
export const Default: Story = {
  args: {
    user: activeUser,
    onViewProfile: () => alert('View Profile clicked'),
    onSendEmail: () => alert('Send Email clicked'),
  },
}

/**
 * Active user status (green badge)
 */
export const ActiveStatus: Story = {
  args: {
    user: activeUser,
  },
}

/**
 * Pending user status (yellow badge) - typically for new users awaiting activation
 */
export const PendingStatus: Story = {
  args: {
    user: pendingUser,
  },
}

/**
 * Inactive user status (gray badge)
 */
export const InactiveStatus: Story = {
  args: {
    user: inactiveUser,
  },
}

/**
 * Locked user status (red badge) - account locked due to security
 */
export const LockedStatus: Story = {
  args: {
    user: lockedUser,
  },
}

/**
 * User with multiple role assignments
 */
export const MultipleRoles: Story = {
  args: {
    user: multiRoleUser,
    onViewProfile: () => alert('View Profile clicked'),
  },
}

/**
 * User without phone number
 */
export const NoPhone: Story = {
  args: {
    user: noPhoneUser,
  },
}

/**
 * Without action buttons - read-only view
 */
export const NoActions: Story = {
  args: {
    user: activeUser,
    onViewProfile: undefined,
    onSendEmail: undefined,
  },
}

/**
 * Dark theme background - simulates how it looks in dark mode
 */
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-abyss-900 p-6 rounded-lg">
      <UserPreviewCard
        user={activeUser}
        onViewProfile={() => alert('View Profile')}
        onSendEmail={() => alert('Send Email')}
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * All status variants side by side
 */
export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4">
      <div className="border border-default rounded-lg p-4">
        <p className="text-xs text-tertiary mb-2 font-medium">Active</p>
        <UserPreviewCard user={activeUser} />
      </div>
      <div className="border border-default rounded-lg p-4">
        <p className="text-xs text-tertiary mb-2 font-medium">Pending</p>
        <UserPreviewCard user={pendingUser} />
      </div>
      <div className="border border-default rounded-lg p-4">
        <p className="text-xs text-tertiary mb-2 font-medium">Inactive</p>
        <UserPreviewCard user={inactiveUser} />
      </div>
      <div className="border border-default rounded-lg p-4">
        <p className="text-xs text-tertiary mb-2 font-medium">Locked</p>
        <UserPreviewCard user={lockedUser} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all four user status variants: Active (green), Pending (yellow), Inactive (gray), and Locked (red).',
      },
    },
  },
}
