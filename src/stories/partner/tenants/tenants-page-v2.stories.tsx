import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  TenantsPageV2,
  MOCK_TENANTS,
  MOCK_TENANTS_STATS_V2,
  MOCK_PASSIVE_INCOME,
} from '../../../components/tenants'
import type { TenantsStatsV2 } from '../../../components/tenants'
import { PAGE_META, pageDescription } from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof TenantsPageV2> = {
  title: 'Partner/Tenants/TenantsPageV2',
  component: TenantsPageV2,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: pageDescription(`Tabbed tenants page with Direct Tenants and Passive Income views (spec v2.0).

## V2 Features
- **Tabbed Interface** - Direct Tenants + Passive Income tabs (accent variant with animation)
- **Role-based Visibility** - Passive Income tab only for partner-admin/system-admin
- **Per-tab State** - Each tab preserves its own search/filters/pagination
- **V2 KPI Widgets** - Active (clickable), MRR (info), ARR (info), Overdue (clickable)

## Direct Tenants Tab
- Same columns as v1: Company, Contact, Status, Tier, Licenses, Monthly Payment, Active Since
- Actions: View, Change Status

## Passive Income Tab (NEW)
Shows earnings from sub-partner tenant relationships:
1. Sub-Partner Name
2. Tenant Company
3. Sub-Partner Monthly Payment
4. Commission Rate
5. Your Monthly Earnings
6. Status

Includes summary banner showing total monthly earnings from active sub-partners.`),
      },
    },
  },
  argTypes: {
    userRole: {
      control: 'select',
      options: ['system-admin', 'partner-admin', 'sub-partner'],
      description: 'User role determines tab visibility (sub-partner cannot see Passive Income)',
    },
  },
}

export default meta
type Story = StoryObj<typeof TenantsPageV2>

// =============================================================================
// MOCK DATA
// =============================================================================

const statsWithHighMRR: TenantsStatsV2 = {
  active: { value: 45, trend: '90%', trendDirection: 'up' },
  mrr: { value: 125000, currency: 'USD', trendDirection: 'up' },
  arr: { value: 1500000, currency: 'USD', trendDirection: 'up' },
  overdue: { value: 3, trend: '3', trendDirection: 'down' },
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default V2 page with both tabs visible (partner-admin role).
 */
export const Default: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'partner-admin',
  },
}

/**
 * System Admin view - full access to all tabs.
 */
export const SystemAdmin: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'system-admin',
  },
  parameters: {
    docs: {
      description: {
        story: 'System admin has access to both tabs with full functionality.',
      },
    },
  },
}

/**
 * Sub-Partner view - Passive Income tab hidden.
 */
export const SubPartnerView: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'sub-partner',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sub-partners only see the Direct Tenants tab. Passive Income is hidden per role-based visibility rules.',
      },
    },
  },
}

/**
 * High MRR scenario showing formatted currency widgets.
 */
export const HighRevenue: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: statsWithHighMRR,
    userRole: 'partner-admin',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with high MRR/ARR values. Note the compact currency format ($125k, $1.5M).',
      },
    },
  },
}

/**
 * Interactive with callbacks.
 */
export const Interactive: Story = {
  render: () => (
    <TenantsPageV2
      tenants={MOCK_TENANTS}
      passiveIncomeData={MOCK_PASSIVE_INCOME}
      stats={MOCK_TENANTS_STATS_V2}
      userRole="partner-admin"
      onViewTenant={(tenant) => console.log('View:', tenant.companyName)}
      onChangeStatus={(tenant, data) => {
        console.log('Change Status:', tenant.companyName, data)
        alert(`Status changed to: ${data.status}`)
      }}
      tabConfig={{
        defaultTab: 'direct',
        onTabChange: (tab) => console.log('Tab changed:', tab),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `Fully interactive V2 page.

**Try these interactions:**
- Switch between tabs (state is preserved per tab)
- Click Active/Overdue widgets to filter
- Search within each tab independently
- View tenant details via row click or Actions menu`,
      },
    },
  },
}

/**
 * Passive Income tab as default.
 */
export const PassiveIncomeDefault: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'partner-admin',
    tabConfig: {
      defaultTab: 'passive',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Page opens with Passive Income tab selected. Useful for revenue-focused dashboards.',
      },
    },
  },
}

/**
 * Empty passive income data.
 */
export const NoPassiveIncome: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: [],
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'partner-admin',
    tabConfig: {
      defaultTab: 'passive',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Passive Income tab with no data. Shows empty state encouraging sub-partner onboarding.',
      },
    },
  },
}

/**
 * Loading state.
 */
export const Loading: Story = {
  args: {
    tenants: MOCK_TENANTS,
    passiveIncomeData: MOCK_PASSIVE_INCOME,
    stats: MOCK_TENANTS_STATS_V2,
    userRole: 'partner-admin',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton in data table. Both tabs show loading when active.',
      },
    },
  },
}
