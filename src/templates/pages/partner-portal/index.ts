/**
 * Partner Portal Page Components
 *
 * Modular content components for the Partner Portal page template.
 * Each component handles a specific page/tab content area.
 */

// Types
export type {
  PartnerPortalStats,
  DashboardConfig,
  TenantRequestStatus,
  TenantRequest,
  PartnerPortalPageProps,
} from './types'

// Mock data
export { MOCK_TENANT_REQUESTS } from './mock-data'

// Content components
export { DashboardContent } from './DashboardContent'
export type { DashboardContentProps } from './DashboardContent'

export { LeadsContent } from './LeadsContent'
export type { LeadsContentProps } from './LeadsContent'

export { TenantRequestsContent } from './TenantRequestsContent'
export type { TenantRequestsContentProps } from './TenantRequestsContent'

export { TenantProvisioningContent } from './TenantProvisioningContent'
export type { TenantProvisioningContentProps } from './TenantProvisioningContent'

export { PartnersContent } from './PartnersContent'
export type { PartnersContentProps } from './PartnersContent'

export { PartnerEditContent } from './PartnerEditContent'
export type { PartnerEditContentProps } from './PartnerEditContent'

export { InvoicesContent } from './InvoicesContent'
export type { InvoicesContentProps } from './InvoicesContent'

export { EarningsContent } from './EarningsContent'
export type { EarningsContentProps } from './EarningsContent'

export { SettingsContent } from './SettingsContent'
export type { SettingsContentProps } from './SettingsContent'

export { HelpContent } from './HelpContent'
export type { HelpContentProps } from './HelpContent'

export { TenantsContent } from './TenantsContent'
export type { TenantsContentProps } from './TenantsContent'

export { PricingCalculatorContent } from './PricingCalculatorContent'
export type { PricingCalculatorContentProps } from './PricingCalculatorContent'

// Hooks
export { usePageRenderer } from './usePageRenderer'
export type { PageRendererConfig } from './usePageRenderer'

// Defaults
export { DEFAULT_USER, getDefaultSettings } from './defaults'
