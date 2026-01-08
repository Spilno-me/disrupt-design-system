import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TenantsPage, MOCK_TENANTS } from '../../../components/tenants'
import type { Tenant } from '../../../components/tenants'
import {
  PAGE_META,
  pageDescription,
} from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof TenantsPage> = {
  title: 'Partner/Tenants/TenantsPage',
  component: TenantsPage,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: pageDescription(`Complete tenants management page.

## Features
- PageActionPanel header with Building icon and title
- Search input and multi-select filters (status, package)
- Data table with sortable columns
- Action buttons per row: View (eye), Edit (pencil), Suspend (pause)
- Pagination with page size selector
- Empty state when no tenants match filters

## Columns
- Tenant (company name, contact email)
- Status (active/suspended/overdue with color dot)
- Package (enterprise/professional/starter badge)
- Monthly Revenue (formatted currency)
- Users (count)
- Created (formatted date)
- Actions (icon buttons)

## Dialogs (internal)
- ViewTenantDialog - Read-only tenant details
- EditTenantDialog - Form to edit tenant
- SuspendTenantDialog - Confirmation for suspension`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TenantsPage>

// =============================================================================
// MOCK DATA VARIATIONS
// =============================================================================

const activeTenants = MOCK_TENANTS.filter((t) => t.status === 'active')
const mixedTenants = MOCK_TENANTS.slice(0, 5)
const emptyTenants: Tenant[] = []

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default page with all mock tenants.
 */
export const Default: Story = {
  args: {
    tenants: MOCK_TENANTS,
  },
}

/**
 * Page with all tenants and interactive callbacks.
 */
export const Interactive: Story = {
  render: () => (
    <TenantsPage
      tenants={MOCK_TENANTS}
      onViewTenant={(tenant) => console.log('View:', tenant.companyName)}
      onEditTenant={(tenant, data) => {
        console.log('Edit:', tenant.companyName, data)
        alert(`Updated: ${data.companyName}`)
      }}
      onSuspendTenant={(tenant) => {
        console.log('Suspend:', tenant.companyName)
        alert(`Suspended: ${tenant.companyName}`)
      }}
      onActivateTenant={(tenant) => {
        console.log('Activate:', tenant.companyName)
        alert(`Activated: ${tenant.companyName}`)
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive page with all callbacks connected. Try the View, Edit, and Suspend actions.',
      },
    },
  },
}

/**
 * Page showing only active tenants.
 */
export const ActiveOnly: Story = {
  args: {
    tenants: activeTenants,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filtered view showing only active tenants.',
      },
    },
  },
}

/**
 * Page with a small set of tenants.
 */
export const FewTenants: Story = {
  args: {
    tenants: mixedTenants,
  },
  parameters: {
    docs: {
      description: {
        story: 'Page with fewer tenants - pagination not needed.',
      },
    },
  },
}

/**
 * Empty state when no tenants exist.
 */
export const Empty: Story = {
  args: {
    tenants: emptyTenants,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no tenants match the current filters.',
      },
    },
  },
}

/**
 * Loading state during data fetch.
 */
export const Loading: Story = {
  args: {
    tenants: MOCK_TENANTS,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table shows loading skeleton while data is being fetched.',
      },
    },
  },
}

/**
 * Page without optional callbacks (view-only mode).
 */
export const ViewOnly: Story = {
  args: {
    tenants: MOCK_TENANTS,
    // No callbacks - actions will be disabled or hidden
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode without action callbacks.',
      },
    },
  },
}
