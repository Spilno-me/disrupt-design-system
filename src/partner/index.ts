/**
 * Partner Portal Components
 *
 * Product-specific components for the Partner Portal application.
 * These components are NOT included in the main DDS export to prevent
 * polluting other products (Flow, Market, etc.) with Partner-specific code.
 *
 * @usage
 * ```tsx
 * import { PartnersPage, SettingsPage } from '@adrozdenko/design-system/partner'
 * import { InvoicesPage } from '@adrozdenko/design-system/partner'
 * ```
 */

// =============================================================================
// PARTNERS PAGE - Main partners management
// =============================================================================

export { PartnersPage, MOCK_PARTNERS } from '../components/partners/PartnersPage'
export type {
  Partner,
  PartnerStatus,
  PartnerTier,
  PartnersPageProps,
} from '../components/partners/PartnersPage'

export { EditPartnerDialog } from '../components/partners/EditPartnerDialog'
export type {
  EditPartnerDialogProps,
  PartnerFormData,
} from '../components/partners/EditPartnerDialog'

export { DeletePartnerDialog } from '../components/partners/DeletePartnerDialog'
export type { DeletePartnerDialogProps } from '../components/partners/DeletePartnerDialog'

// =============================================================================
// PARTNER LOGIN ACCOUNTS - User account management
// =============================================================================

export { PartnerLoginAccountsPage, MOCK_LOGIN_ACCOUNTS } from '../components/partners/PartnerLoginAccountsPage'
export type {
  LoginAccount,
  LoginAccountStatus,
  PartnerLoginAccountsPageProps,
  CreateLoginAccountData,
} from '../components/partners/PartnerLoginAccountsPage'

export { ResetPasswordDialog } from '../components/partners/ResetPasswordDialog'
export type { ResetPasswordDialogProps } from '../components/partners/ResetPasswordDialog'

export { CreateLoginAccountDialog } from '../components/partners/CreateLoginAccountDialog'
export type { CreateLoginAccountDialogProps } from '../components/partners/CreateLoginAccountDialog'

export { DeleteLoginAccountDialog } from '../components/partners/DeleteLoginAccountDialog'
export type { DeleteLoginAccountDialogProps } from '../components/partners/DeleteLoginAccountDialog'

// =============================================================================
// PARTNER NETWORK - Sub-partner/reseller management
// =============================================================================

export { PartnerNetworkPage, MOCK_NETWORK_PARTNERS } from '../components/partners/PartnerNetworkPage'
export type {
  NetworkPartner,
  NetworkPartnerStatus,
  NetworkPartnerMetrics,
  NetworkPartnerFormData,
  SubPartnerFormData,
  PartnerNetworkPageProps,
} from '../components/partners/PartnerNetworkPage'

export { EditNetworkPartnerDialog } from '../components/partners/EditNetworkPartnerDialog'
export type { EditNetworkPartnerDialogProps } from '../components/partners/EditNetworkPartnerDialog'

export { CreateSubPartnerDialog } from '../components/partners/CreateSubPartnerDialog'
export type { CreateSubPartnerDialogProps } from '../components/partners/CreateSubPartnerDialog'

export { DeleteNetworkPartnerDialog } from '../components/partners/DeleteNetworkPartnerDialog'
export type { DeleteNetworkPartnerDialogProps } from '../components/partners/DeleteNetworkPartnerDialog'

// =============================================================================
// SETTINGS PAGE - Partner portal settings
// =============================================================================

export { SettingsPage } from '../components/partners/SettingsPage'
export type {
  SettingsPageProps,
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../components/partners/SettingsPage'

// =============================================================================
// HELP PAGE - Partner documentation and support
// =============================================================================

export { HelpPage, DEFAULT_HELP_ARTICLES, DEFAULT_HELP_FAQS } from '../components/partners/HelpPage'
export type {
  HelpPageProps,
  HelpArticle,
  FAQItem as HelpFAQItem,
} from '../components/partners/HelpPage'

// =============================================================================
// PRICING CALCULATOR - Partner pricing tools
// =============================================================================

export { PricingCalculator } from '../components/partners/PricingCalculator'
export type {
  PricingCalculatorProps,
  PricingInput,
  PricingBreakdown,
  CompanySize,
  BillingCycle,
  PricingTier,
} from '../components/partners/PricingCalculator'

// =============================================================================
// INVOICES - Invoice management
// =============================================================================

export {
  InvoicesPage,
  InvoiceCard,
  InvoicesDataTable,
  InvoicePreviewSheet,
  InvoicePDFDialog,
  EditInvoiceDialog,
  formatCurrency,
  formatDate,
  getPaymentTermsLabel,
  getDaysUntilDue,
  isInvoiceOverdue,
} from '../components/partners/invoices'

export type {
  InvoicesPageProps,
  InvoiceCardProps,
  InvoicesDataTableProps,
  InvoicePreviewSheetProps,
  InvoicePDFDialogProps,
  EditInvoiceDialogProps,
  EditInvoiceFormData,
  Invoice,
  InvoiceStatus,
  LineItem,
  LineItemType,
  PaymentTerms,
  InvoiceAction,
} from '../components/partners/invoices'

// =============================================================================
// SHARED COMPONENTS - Internal partner UI components
// =============================================================================

export {
  StatusIndicator,
  MetricItem,
  TierBadge,
  PartnerId,
  PartnerMetricsCard,
  PartnerRow,
  PartnerRowWrapper,
} from '../components/partners/components'

// Re-export Avatar from core (replaces partner-specific UserAvatar)
export { Avatar, AvatarImage, AvatarFallback, avatarVariants } from '../components/ui/avatar'
