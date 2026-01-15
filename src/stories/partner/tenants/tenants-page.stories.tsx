import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TenantsPage, MOCK_TENANTS, MOCK_TENANTS_STATS } from '../../../components/tenants'
import type { Tenant, TenantsStats } from '../../../components/tenants'
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
        component: pageDescription(`Complete tenants management page per spec (05_tenants_page.md).

## Features
- **KPI Widgets** - Total, Active, Overdue, Suspended (interactive filters)
- **PageActionPanel** header with Building icon
- **Search** by company name or contact person
- **Status Filter** - Multi-select (Active/Overdue/Suspended)
- **Data Table** with sortable columns
- **Actions dropdown** (... menu) per row: View, Change Status
- **Pagination** with 10/25/50 page sizes
- **Active Filter Banner** when widget filter is applied

## Table Columns (per spec Section 8.1)
1. Company / Tenant (company name + contact person)
2. Contact (email + phone)
3. Status (badge: Active/Overdue/Suspended)
4. Tier (organization size: Micro/Small/Mid-Market/Large/Enterprise)
5. Licenses (total count)
6. Monthly Payment (formatted currency)
7. Active Since (date or "—")
8. Actions (... dropdown menu)

## Dialogs
- **ViewTenantDialog** - Read-only tenant details
- **EditTenantDialog** - Form to edit tenant
- **ChangeStatusDialog** - Status dropdown + notes field`),
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

// Custom stats for specific stories
const statsWithHighOverdue: TenantsStats = {
  total: { value: 100 },
  active: { value: 75, trend: '75%', trendDirection: 'up' },
  overdue: { value: 20, trend: '20', trendDirection: 'down' },
  suspended: { value: 5, trendDirection: 'neutral' },
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default page with all mock tenants and computed stats.
 * Shows KPI widgets, search, filters, and full data table.
 */
export const Default: Story = {
  args: {
    tenants: MOCK_TENANTS,
    stats: MOCK_TENANTS_STATS,
  },
}

/**
 * Fully interactive page with all callbacks connected.
 * Try clicking KPI widgets to filter, use search, change status.
 */
export const Interactive: Story = {
  render: () => (
    <TenantsPage
      tenants={MOCK_TENANTS}
      stats={MOCK_TENANTS_STATS}
      onViewTenant={(tenant) => console.log('View:', tenant.companyName)}
      onEditTenant={(tenant, data) => {
        console.log('Edit:', tenant.companyName, data)
        alert(`Updated: ${data.companyName}`)
      }}
      onChangeStatus={(tenant, data) => {
        console.log('Change Status:', tenant.companyName, data)
        alert(`Status changed to: ${data.status}${data.note ? ` (Note: ${data.note})` : ''}`)
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `Fully interactive page with all callbacks connected.

**Try these interactions:**
- Click KPI widgets to filter by status
- Click a widget again to clear that filter
- Use search to find by company or contact name
- Click Actions (⋯) menu → Change Status
- Click a row to view tenant details`,
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
        story: 'Filtered view showing only active tenants. Stats are auto-computed from data.',
      },
    },
  },
}

/**
 * Dashboard with many overdue tenants - shows warning state.
 */
export const HighOverdue: Story = {
  args: {
    tenants: MOCK_TENANTS,
    stats: statsWithHighOverdue,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard scenario with elevated overdue count. The Overdue widget shows a "down" trend to indicate concern.',
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
        story: 'Page with fewer tenants - pagination not needed. KPI widgets still functional.',
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
        story: 'Empty state when no tenants exist. Shows helpful message about onboarding.',
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
    stats: MOCK_TENANTS_STATS,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table shows loading skeleton while data is being fetched. KPI widgets still visible.',
      },
    },
  },
}

/**
 * Page in view-only mode (no action callbacks).
 */
export const ViewOnly: Story = {
  args: {
    tenants: MOCK_TENANTS,
    stats: MOCK_TENANTS_STATS,
    // No callbacks - actions dropdown still visible but will use built-in dialog
  },
  parameters: {
    docs: {
      description: {
        story: 'Page without external callbacks. Uses built-in dialogs for View/Edit/ChangeStatus.',
      },
    },
  },
}
