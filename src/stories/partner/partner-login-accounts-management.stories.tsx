import type { Meta, StoryObj } from '@storybook/react'
import {
  PartnerLoginAccountsPage,
  MOCK_LOGIN_ACCOUNTS,
  LoginAccount,
  CreateLoginAccountData,
} from '../../components/partners'
import { AppLayoutShell } from '../../templates/layout/AppLayoutShell'
import { partnerNavItems } from '../../templates/navigation/configs'
import { PAGE_META, pageDescription } from '../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Partner/Pages/LoginAccounts',
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`Partner login accounts management page within the app shell context. Demonstrates login account CRUD operations with full navigation layout.`),
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// SHELL WRAPPER
// =============================================================================

/** Wrap PartnerLoginAccountsPage in AppLayoutShell for proper consumer app context */
interface ShellWrapperProps {
  children: React.ReactNode
}

const ShellWrapper = ({ children }: ShellWrapperProps) => (
  <AppLayoutShell
    product="partner"
    navItems={partnerNavItems}
    currentPageId="partners"
    user={{ name: 'Demo Partner', email: 'demo@partner.com' }}
  >
    {children}
  </AppLayoutShell>
)

// =============================================================================
// EXTENDED MOCK DATA
// =============================================================================

const extendedLoginAccounts: LoginAccount[] = [
  ...MOCK_LOGIN_ACCOUNTS,
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@draxindustries.com.au',
    status: 'active',
    createdAt: new Date('2024-09-20'),
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@draxindustries.com.au',
    status: 'inactive',
    createdAt: new Date('2024-07-10'),
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@draxindustries.com.au',
    status: 'pending',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'r.wilson@draxindustries.com.au',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
]

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view with full app shell context.
 * Shows login accounts management within the Partner Portal layout.
 */
export const Default: Story = {
  render: () => (
    <ShellWrapper>
      <PartnerLoginAccountsPage
        partnerName="Drax Industries"
        partnerId="DRX-2024-001"
        loginAccounts={extendedLoginAccounts}
        onBackClick={() => console.log('Back to partners clicked')}
        onCreateLoginAccount={(data) => {
          console.log('Create login account:', data)
          return Promise.resolve()
        }}
        onResetPassword={(account, mode) => {
          console.log('Reset password:', { account, mode })
          return Promise.resolve()
        }}
        onDeleteLoginAccount={(account) => {
          console.log('Delete login account:', account)
          return Promise.resolve()
        }}
      />
    </ShellWrapper>
  ),
}

/**
 * Empty state when no login accounts exist.
 */
export const EmptyLoginAccounts: Story = {
  render: () => (
    <ShellWrapper>
      <PartnerLoginAccountsPage
        partnerName="New Partner Inc"
        partnerId="NPI-2024-001"
        loginAccounts={[]}
        onBackClick={() => console.log('Back clicked')}
        onCreateLoginAccount={(data) => {
          console.log('Create:', data)
          return Promise.resolve()
        }}
      />
    </ShellWrapper>
  ),
}

/**
 * Login accounts with mixed statuses (active, pending, inactive).
 */
export const MixedStatuses: Story = {
  render: () => {
    const mixedAccounts: LoginAccount[] = [
      {
        id: '1',
        firstName: 'Active',
        lastName: 'User',
        email: 'active@example.com',
        status: 'active',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        firstName: 'Pending',
        lastName: 'User',
        email: 'pending@example.com',
        status: 'pending',
        createdAt: new Date('2024-02-20'),
      },
      {
        id: '3',
        firstName: 'Inactive',
        lastName: 'User',
        email: 'inactive@example.com',
        status: 'inactive',
        createdAt: new Date('2024-03-10'),
      },
    ]

    return (
      <ShellWrapper>
        <PartnerLoginAccountsPage
          partnerName="Test Partner"
          partnerId="TST-2024-001"
          loginAccounts={mixedAccounts}
          onBackClick={() => console.log('Back clicked')}
          onCreateLoginAccount={(data) => {
            console.log('Create:', data)
            return Promise.resolve()
          }}
          onResetPassword={(account, mode) => {
            console.log('Reset:', { account, mode })
            return Promise.resolve()
          }}
          onDeleteLoginAccount={(account) => {
            console.log('Delete:', account)
            return Promise.resolve()
          }}
        />
      </ShellWrapper>
    )
  },
}

/**
 * Loading state while fetching login accounts.
 */
export const Loading: Story = {
  render: () => (
    <ShellWrapper>
      <PartnerLoginAccountsPage
        partnerName="Drax Industries"
        partnerId="DRX-2024-001"
        loginAccounts={[]}
        loading={true}
        onBackClick={() => console.log('Back clicked')}
      />
    </ShellWrapper>
  ),
}

/**
 * Mobile viewport - demonstrates responsive behavior.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <ShellWrapper>
      <PartnerLoginAccountsPage
        partnerName="Drax Industries"
        partnerId="DRX-2024-001"
        loginAccounts={MOCK_LOGIN_ACCOUNTS}
        onBackClick={() => console.log('Back clicked')}
        onCreateLoginAccount={(data) => {
          console.log('Create:', data)
          return Promise.resolve()
        }}
      />
    </ShellWrapper>
  ),
}
