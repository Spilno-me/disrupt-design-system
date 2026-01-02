// Import styles
import './styles.css'
import './components/ui/HeroParticles.css'

// Import JetBrains Mono font (monospace for code/technical content)
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'

// Export all components
export { Button, buttonVariants } from './components/ui/button'
export { SplitButton, splitButtonVariants } from './components/shared/SplitButton'
export type { SplitButtonProps } from './components/shared/SplitButton'
export { Badge, badgeVariants } from './components/ui/badge'
// Card - Website pricing cards only (FROZEN)
export {
  Card,
  cardVariants,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/card'
export type { CardProps } from './components/ui/card'
// AppCard - Application cards (for in-app use)
export {
  AppCard,
  appCardVariants,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
  AppCardAction,
} from './components/ui/app-card'
export type { AppCardProps } from './components/ui/app-card'
export { PageActionPanel } from './components/ui/PageActionPanel'
export type { PageActionPanelProps } from './components/ui/PageActionPanel'
export { PricingConnector } from './components/ui/pricing-connector'
export { Input } from './components/ui/input'
export { Textarea } from './components/ui/textarea'
export { Checkbox } from './components/ui/checkbox'

// Switch - Toggle switch component
export { Switch } from './components/ui/switch'
export type { SwitchProps } from './components/ui/switch'

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'

// What3Words location selector
export {
  What3WordsInput,
  What3WordsMap,
  UseMyLocationButton,
  mockAutosuggest,
  mockConvertToWords,
} from './components/ui/what3words'
export type {
  What3WordsValue,
  What3WordsCoordinates,
  What3WordsSuggestion,
  What3WordsInputProps,
  What3WordsMapProps,
  UseMyLocationButtonProps,
} from './components/ui/what3words'

// Location Picker (hierarchical tree with GPS)
export { LocationPicker, LocationTree } from './components/ui/location-picker'
export type {
  LocationNode,
  LocationValue,
  LocationPickerProps,
  LocationTreeProps,
} from './components/ui/location-picker'

// Avatar - User profile image with fallback
export { Avatar, AvatarImage, AvatarFallback, avatarVariants } from './components/ui/avatar'

export { Separator } from './components/ui/separator'
export { Skeleton, SkeletonImage, SkeletonText } from './components/ui/Skeleton'
export { Slider } from './components/ui/Slider'
export type { SliderProps } from './components/ui/Slider'
export { FeatureCard } from './components/ui/FeatureCard'
export type { FeatureCardProps } from './components/ui/FeatureCard'
export { FeatureItem } from './components/ui/FeatureItem'
export type { FeatureItemProps } from './components/ui/FeatureItem'
export { ElectricButtonWrapper, GlassInputWrapper, ElectricInputWrapper, GlassButtonWrapper } from './components/ui/GlassEffect'
export { ElectricLucideIcon } from './components/ui/ElectricLucideIcon'
export { AnimatedCheck } from './components/ui/AnimatedCheck'
export { HeroParticles } from './components/ui/HeroParticles'
export { MouseParticleRenderer } from './components/ui/MouseParticleRenderer'
export { BlurImage } from './components/ui/BlurImage'
export { CheckListItem } from './components/ui/CheckListItem'
export { IconText, IconHeading1, IconHeading2, IconHeading3, IconLabel } from './components/ui/IconText'
export type { IconTextProps } from './components/ui/IconText'
export { OptimizedImage } from './components/ui/OptimizedImage'
export { ResponsiveImage } from './components/ui/ResponsiveImage'
export { ResponsivePicture } from './components/ui/ResponsivePicture'
export { ParallaxImage } from './components/ui/ParallaxImage'
export { ScrollToTopButton } from './components/ui/ScrollToTopButton'
export type { ScrollToTopButtonProps } from './components/ui/ScrollToTopButton'
export {
  Accordion,
  AccordionRoot,
  AccordionItemPrimitive,
  AccordionTrigger,
  AccordionContent,
  AccordionHeader,
} from './components/ui/Accordion'
export type { AccordionProps, AccordionItem } from './components/ui/Accordion'

// Collapsible - Expandable content container
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/ui/collapsible'

export { LinkedInButton } from './components/ui/LinkedInButton'
export type { LinkedInButtonProps } from './components/ui/LinkedInButton'
export { ScrollableTableWrapper } from './components/ui/ScrollableTableWrapper'
export { DataTable } from './components/ui/DataTable'
export type { DataTableProps, ColumnDef, SortDirection, RowPriority } from './components/ui/DataTable'
export { Pagination } from './components/ui/Pagination'
export type { PaginationProps } from './components/ui/Pagination'

// RowActions - Smart action column component
export { RowActions } from './components/ui/RowActions'
export type { RowActionsProps, RowAction } from './components/ui/RowActions'

// StepIndicator - Multi-step progress indicator
export { StepIndicator } from './components/ui/StepIndicator'
export type { StepIndicatorProps, Step as StepIndicatorStep } from './components/ui/StepIndicator'

// TruncatedId - Truncated ID display with copy
export { TruncatedId } from './components/ui/TruncatedId'
export type { TruncatedIdProps } from './components/ui/TruncatedId'

// CopyButton - Copy to clipboard button
export { CopyButton } from './components/ui/CopyButton'
export type { CopyButtonProps } from './components/ui/CopyButton'

// FloorPlanUploader - Floor plan image uploader
export { FloorPlanUploader } from './components/ui/floor-plan-uploader'
export type { FloorPlanUploaderProps, FloorPlanUploadItem } from './components/ui/floor-plan-uploader'

// Data Table unified system - composable components
export {
  DataTableBadge,
  DataTableActions,
  DataTableMobileCard,
  IncidentManagementTable,
  ACTIVE_STATUS_MAP,
  WORKFLOW_STATUS_MAP,
  REQUEST_STATUS_MAP,
  PARTNER_STATUS_MAP,
  // Status dot indicators
  DataTableStatusDot,
  ACTIVE_DOT_STATUS_MAP,
  PARTNER_DOT_STATUS_MAP,
  WORKFLOW_DOT_STATUS_MAP,
  REQUEST_DOT_STATUS_MAP,
  LEAD_DOT_STATUS_MAP,
  INVOICE_DOT_STATUS_MAP,
  LOGIN_ACCOUNT_DOT_STATUS_MAP,
  TENANT_REQUEST_DOT_STATUS_MAP,
  // Severity indicators
  DataTableSeverity,
  PRIORITY_SEVERITY_MAP,
  LEAD_PRIORITY_SEVERITY_MAP,
  LEAD_TEMPERATURE_SEVERITY_MAP,
  INCIDENT_SEVERITY_MAP,
  URGENCY_SEVERITY_MAP,
  // Legacy table cell components
  StatusBadge,
  COMMON_STATUS_CONFIG,
  LEAD_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
  REQUEST_STATUS_CONFIG,
  EmailLink,
  ScoreBadge,
  IncidentStatusBadge,
  CopyableId,
  TruncatedText,
} from './components/ui/table'
export type {
  DataTableBadgeProps,
  StatusMapping,
  DataTableActionsProps,
  ActionItem,
  ActionVariant,
  DataTableMobileCardProps,
  MobileCardField,
  IncidentManagementTableProps,
  Incident as IncidentManagementTableIncident,
  // Status dot types
  DataTableStatusDotProps,
  DotStatusMapping,
  DotStatusConfig,
  DotVariant,
  // Severity types
  DataTableSeverityProps,
  SeverityMapping,
  SeverityConfig,
  // Legacy table cell types
  StatusBadgeProps,
  StatusConfig,
  EmailLinkProps,
  ScoreBadgeProps,
  IncidentStatusBadgeProps,
  IncidentStatus as TableIncidentStatus,
  IncidentSeverity as TableIncidentSeverity,
  CopyableIdProps,
  TruncatedTextProps,
} from './components/ui/table'
export { SectionWrapper, SectionHeading, SectionContainer, ContentSection, TwoColumnLayout, Column } from './components/ui/SectionLayout'
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from './components/ui/dialog'
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/ui/sheet'
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './components/ui/tooltip'

// Tipseen - Guided onboarding tooltip for feature discovery
export { Tipseen, useTipseenContext } from './components/ui/Tipseen'
export type { TipseenProps, TipseenPosition, TipseenColor, TipseenContextValue } from './components/ui/Tipseen'

// Toast notifications - Sonner-based with DDS styling
export { Toaster, toast } from './components/ui/sonner'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/ui/dropdown-menu'

// ActionSheet - iOS-style contextual action menu (mobile)
export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetLabel,
} from './components/ui/ActionSheet'
export type {
  ActionSheetProps,
  ActionSheetTriggerProps,
  ActionSheetContentProps,
  ActionSheetItemProps,
  ActionSheetSeparatorProps,
  ActionSheetLabelProps,
} from './components/ui/ActionSheet'

// ResponsiveActionMenu - Adaptive menu (ActionSheet on mobile, DropdownMenu on desktop)
export {
  ResponsiveActionMenu,
  ResponsiveActionMenuTrigger,
  ResponsiveActionMenuContent,
  ResponsiveActionMenuItem,
  ResponsiveActionMenuSeparator,
  ResponsiveActionMenuLabel,
} from './components/ui/ResponsiveActionMenu'
export type {
  ResponsiveActionMenuProps,
  ResponsiveActionMenuTriggerProps,
  ResponsiveActionMenuContentProps,
  ResponsiveActionMenuItemProps,
  ResponsiveActionMenuSeparatorProps,
  ResponsiveActionMenuLabelProps,
} from './components/ui/ResponsiveActionMenu'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './components/ui/tabs'

// ToggleGroup - Set of toggle buttons
export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants } from './components/ui/toggle-group'
export type { ToggleGroupProps, ToggleGroupItemProps } from './components/ui/toggle-group'

export { Label } from './components/ui/label'
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './components/ui/form'
export { AnimatedLogo } from './components/ui/AnimatedLogo'
export type { AnimatedLogoProps } from './components/ui/AnimatedLogo'
export { MadeWithLove } from './components/ui/MadeWithLove'
export type { MadeWithLoveProps } from './components/ui/MadeWithLove'
export { MobileMenu } from './components/ui/MobileMenu'
export type { MobileMenuProps } from './components/ui/MobileMenu'
export { Header } from './components/ui/Header'
export type { HeaderProps, NavItem as HeaderNavItem } from './components/ui/Header'
export { AppHeader, WavePattern, LogoContainer, NotificationBell, NotificationBadge, UserAvatar, UserMenu, IconButton } from './components/ui/AppHeader'
export type { AppHeaderProps, UserMenuItem, UserInfo, ProductConfig, IconButtonProps } from './components/ui/AppHeader'
export { AppSidebar } from './components/ui/AppSidebar'
export type { AppSidebarProps } from './components/ui/AppSidebar'
export { AppFooter } from './components/ui/AppFooter'
export type { AppFooterProps } from './components/ui/AppFooter'
export { MobileNav } from './components/ui/MobileNav'
export type { MobileNavProps } from './components/ui/MobileNav'
export { BottomNav } from './components/ui/BottomNav'
export type { BottomNavProps } from './components/ui/BottomNav'

// Navigation module - shared types, utilities, and components
export {
  NavIcon,
  NavBadge,
  isGroupActive,
  findParentGroupId,
  findItemById,
  addBadges,
} from './components/ui/navigation'
export type {
  NavItem,
  ProductType,
  OnNavigate,
  BaseNavProps,
  NavIconProps,
  NavBadgeProps,
} from './components/ui/navigation'
export { CursorPixels } from './components/ui/cursor-pixels'
export type { CursorPixelsProps } from './components/ui/cursor-pixels'
export { ElectricInputWrapper as ElectricInput } from './components/ui/ElectricInput'
export { GridBlobBackground, GridBlobCanvas, BlobSection } from './components/ui/GridBlobCanvas'
export { MapWithMarkers } from './components/ui/MapWithMarkers'
export { ErrorBoundary, CanvasErrorBoundary, SectionErrorBoundary } from './components/ui/ErrorBoundary'
export { ErrorState, errorStateVariants } from './components/ui/ErrorState'
export type { ErrorStateProps } from './components/ui/ErrorState'
export { EmptyState } from './components/ui/EmptyState'
export type { EmptyStateProps, EmptyStateVariant } from './components/ui/EmptyState'
export { GenericErrorPage } from './components/ui/GenericErrorPage'
export type { GenericErrorPageProps } from './components/ui/GenericErrorPage'
export { SeverityIndicator } from './components/ui/SeverityIndicator'
export type { SeverityIndicatorProps, SeverityLevel } from './components/ui/SeverityIndicator'
export {
  QuickFilter,
  QuickFilterItem,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
  DLBFilter,
} from './components/ui/QuickFilter'
export type { QuickFilterVariant, QuickFilterItemProps, QuickFilterProps } from './components/ui/QuickFilter'
export {
  ScrollFadeList,
  ScrollFadeItem,
  useVerticalScrollFadeOpacity,
} from './components/ui/ScrollFadeList'
export type { ScrollFadeListProps, ScrollFadeItemProps } from './components/ui/ScrollFadeList'
export { NotificationsPanel } from './components/ui/NotificationsPanel'
export type { NotificationType, Notification, NotificationsPanelProps } from './components/ui/NotificationsPanel'
export { ActionTile, actionTileVariants } from './components/ui/ActionTile'
export type { ActionTileProps } from './components/ui/ActionTile'

// =============================================================================
// FLOW-SPECIFIC COMPONENTS - Moved to @adrozdenko/design-system/flow
// =============================================================================
// The following components are Flow EHS mobile-specific and have been moved
// to the /flow subpath to prevent polluting Portal/Market imports:
//   - QuickActionButton, quickActionButtonVariants
//   - MobileNavButton, mobileNavButtonVariants
//   - MobileNavBar, mobileNavBarVariants, FlowMobileNav
//   - NextStepButton, nextStepButtonVariants
//
// Import them from: import { ... } from '@adrozdenko/design-system/flow'
// =============================================================================

// Export section components
export { FAQSection } from './components/sections/FAQSection'
export type { FAQSectionProps, FAQItem } from './components/sections/FAQSection'
export { CTASection } from './components/sections/CTASection'
export type { CTASectionProps } from './components/sections/CTASection'
export { FeaturesSection } from './components/sections/FeaturesSection'
export type { FeaturesSectionProps, Feature } from './components/sections/FeaturesSection'
export { HeroSection } from './components/sections/HeroSection'
export type { HeroSectionProps } from './components/sections/HeroSection'
export { IndustryCarouselSection } from './components/sections/IndustryCarouselSection'
export type { IndustryCarouselSectionProps } from './components/sections/IndustryCarouselSection'

// Website section components
export { AIPlatformSection } from './components/sections/AIPlatformSection'
export { AboutHeroSection } from './components/sections/AboutHeroSection'
export { AboutProofSection } from './components/sections/AboutProofSection'
export { ContactInfo } from './components/sections/ContactInfo'
export { ContactSection } from './components/sections/ContactSection'
export { FeatureCard as FeatureCardSection } from './components/sections/FeatureCard'
export { FeaturesGridSection } from './components/sections/FeaturesGridSection'
export { FutureCapabilitiesSection } from './components/sections/FutureCapabilitiesSection'
export { OurMissionSection } from './components/sections/OurMissionSection'
export { OurStorySection } from './components/sections/OurStorySection'
export { OurValuesSection } from './components/sections/OurValuesSection'
export { OurVisionSection } from './components/sections/OurVisionSection'
export { PartnersSection } from './components/sections/PartnersSection'
// PlatformTiersSection moved to _archive - not exported
export { PricingCardsSection } from './components/sections/PricingCardsSection'
export { ROICalculatorSection } from './components/sections/ROICalculatorSection'
export { ProductHeroSection } from './components/sections/ProductHeroSection'
export { ProofSection } from './components/sections/ProofSection'
export { ReadyToAchieveSection } from './components/sections/ReadyToAchieveSection'
export { StrategicAdvisorySection } from './components/sections/StrategicAdvisorySection'
export { WhatDisruptDoesSection } from './components/sections/WhatDisruptDoesSection'
export { WhoWeHelpSection } from './components/sections/WhoWeHelpSection'
export { WhyDifferentSection } from './components/sections/WhyDifferentSection'

// Export partners components
export { PartnersPage, MOCK_PARTNERS, EditPartnerDialog, DeletePartnerDialog } from './components/partners'
export type { PartnersPageProps, Partner, PartnerStatus, PartnerTier, EditPartnerDialogProps, PartnerFormData, DeletePartnerDialogProps } from './components/partners'

// Export partner login accounts components
export { PartnerLoginAccountsPage, MOCK_LOGIN_ACCOUNTS, ResetPasswordDialog, CreateLoginAccountDialog, DeleteLoginAccountDialog } from './components/partners'
export type { LoginAccount, LoginAccountStatus, PartnerLoginAccountsPageProps, CreateLoginAccountData, ResetPasswordDialogProps, CreateLoginAccountDialogProps, DeleteLoginAccountDialogProps } from './components/partners'
export { HelpPage } from './components/partners/HelpPage'
export type { HelpPageProps, HelpArticle, FAQItem as HelpFAQItem } from './components/partners/HelpPage'
export { PricingCalculator } from './components/partners/PricingCalculator'
export type { PricingCalculatorProps, PricingInput, PricingBreakdown, CompanySize, BillingCycle, PricingTier } from './components/partners/PricingCalculator'
export { InvoicesPage } from './components/partners/invoices/InvoicesPage'
export type { InvoicesPageProps } from './components/partners/invoices/InvoicesPage'
export { InvoiceCard } from './components/partners/invoices/InvoiceCard'
export { EditInvoiceDialog } from './components/partners/invoices/EditInvoiceDialog'
export type { EditInvoiceFormData } from './components/partners/invoices/EditInvoiceDialog'
export type { Invoice, InvoiceStatus, InvoiceAction, LineItem, LineItemType, PaymentTerms } from './components/partners/invoices/types'
export { formatCurrency, formatDate, getPaymentTermsLabel, getDaysUntilDue, isInvoiceOverdue } from './components/partners/invoices/types'

// Export auth components
export {
  LoginPage,
  LoginForm,
  AuthLayout,
  AuthCard,
  SocialLoginButtons,
  ForgotPasswordForm,
  ForgotPasswordDialog,
  ResetPasswordForm,
  SetInitialPasswordForm,
} from './components/auth'
export type {
  LoginPageProps,
  LoginFormProps,
  LoginFormValues,
  AuthLayoutProps,
  AuthCardProps,
  SocialLoginButtonsProps,
  SocialProvider,
  ForgotPasswordFormProps,
  ForgotPasswordFormValues,
  ForgotPasswordDialogProps,
  ResetPasswordFormProps,
  ResetPasswordFormValues,
  SetInitialPasswordFormProps,
  SetInitialPasswordFormValues,
  ProductType as AuthProductType,
} from './components/auth'
export { ExecutingAnimation } from './components/ui/ExecutingAnimation'
export type { ExecutingAnimationProps, ColorVariant } from './components/ui/ExecutingAnimation'

// Export leads components
export { LeadsPage } from './components/leads/LeadsPage'
export type { LeadsPageProps } from './components/leads/LeadsPage'
export { LeadCard } from './components/leads/LeadCard'
export type { Lead, LeadCardProps, LeadStatus, LeadPriority, LeadSource, LeadAction } from './components/leads/LeadCard'
export { LeadsDataTable } from './components/leads/LeadsDataTable'
export type { LeadsDataTableProps } from './components/leads/LeadsDataTable'
export { StatsCard } from './components/leads/StatsCard'
export type { StatsCardProps, TrendDirection } from './components/leads/StatsCard'
export { CreateLeadDialog } from './components/leads/CreateLeadDialog'
export type { CreateLeadDialogProps, CreateLeadFormData, Partner as LeadPartner } from './components/leads/CreateLeadDialog'
export { EditLeadDialog } from './components/leads/EditLeadDialog'
export type { EditLeadDialogProps } from './components/leads/EditLeadDialog'
export { AssignLeadDialog } from './components/leads/AssignLeadDialog'
export type { AssignLeadDialogProps } from './components/leads/AssignLeadDialog'
export { StatusUpdateDialog } from './components/leads/StatusUpdateDialog'
export type { StatusUpdateDialogProps } from './components/leads/StatusUpdateDialog'
export { DeleteLeadDialog } from './components/leads/DeleteLeadDialog'
export type { DeleteLeadDialogProps } from './components/leads/DeleteLeadDialog'
// Export provisioning components
export { ProvisioningMethodSelector } from './components/provisioning/ProvisioningMethodSelector'
export type { ProvisioningMethodSelectorProps, ProvisioningMethod } from './components/provisioning/ProvisioningMethodSelector'

// Tenant Provisioning Chat
export { TenantProvisioningChat } from './components/provisioning/TenantProvisioningChat'
export type {
  TenantProvisioningChatProps,
  TenantFormData as TenantChatFormData,
} from './components/provisioning/TenantProvisioningChat'

// Tenant Provisioning Wizard
export { TenantProvisioningWizard } from './components/provisioning/TenantProvisioningWizard'
export type {
  TenantProvisioningWizardProps,
  TenantFormData,
} from './components/provisioning/TenantProvisioningWizard'

// Tenant Request Action Dialogs
export { ApproveRequestDialog } from './components/provisioning/ApproveRequestDialog'
export type { ApproveRequestDialogProps, TenantRequest } from './components/provisioning/ApproveRequestDialog'
export { RejectRequestDialog } from './components/provisioning/RejectRequestDialog'
export type { RejectRequestDialogProps } from './components/provisioning/RejectRequestDialog'
export { DeleteRequestDialog as DeleteTenantRequestDialog } from './components/provisioning/DeleteRequestDialog'
export type { DeleteRequestDialogProps as DeleteTenantRequestDialogProps } from './components/provisioning/DeleteRequestDialog'

// Wizard primitives (generic wizard components)
export { Wizard, useWizard, WizardContent } from './components/provisioning'
export type { WizardProps, WizardStepDefinition, WizardContentProps } from './components/provisioning'

export { WizardStepper, CompactStepper } from './components/provisioning'
export type { WizardStepperProps, CompactStepperProps } from './components/provisioning'

export { WizardStep, WizardStepHeader, WizardStepSection } from './components/provisioning'
export type { WizardStepProps, WizardStepHeaderProps, WizardStepSectionProps } from './components/provisioning'

export { WizardNavigation, WizardFooter } from './components/provisioning'
export type { WizardNavigationProps, WizardFooterProps } from './components/provisioning'

// Export SearchFilter (Shared component - universal search & filter)
export { SearchFilter } from './components/shared/SearchFilter/SearchFilter'
export type { SearchFilterProps } from './components/shared/SearchFilter/SearchFilter'
export type {
  FilterGroup,
  FilterOption,
  FilterState,
} from './components/shared/SearchFilter/types'

// Export SearchFilter hooks for advanced usage
export { useSearchInput, useFilters } from './components/shared/SearchFilter'
export type {
  UseSearchInputOptions,
  UseSearchInputReturn,
  UseFiltersOptions,
  UseFiltersReturn,
} from './components/shared/SearchFilter'

// AI Assistant - Global floating assistant component
export {
  AIAssistantProvider,
  AIAssistantFab,
  AIAssistantPanel,
  AIAssistantQuickActions,
  useAIAssistant,
} from './components/shared/AIAssistant'
export type {
  AIAssistantContextValue,
  AIAssistantProviderProps,
  AIAssistantFabProps,
  AIAssistantPanelProps,
  AIAssistantQuickActionsProps,
  LogoState,
} from './components/shared/AIAssistant'

// Export Market-specific filter options
export { MARKET_FILTER_OPTIONS } from './components/market'
export type {
  FilterCategory,
  FilterBadge,
  FilterPricing,
  MarketFilterState,
} from './components/market'

// Export form components
export { ContactForm } from './components/forms/ContactForm'
export type { ContactFormProps, ContactFormField } from './components/forms/ContactForm'
export { ContactFormSuccessModal } from './components/forms/ContactFormSuccessModal'
export type { ContactFormSuccessModalProps } from './components/forms/ContactFormSuccessModal'
export { ContactFormErrorModal } from './components/forms/ContactFormErrorModal'
export type { ContactFormErrorModalProps } from './components/forms/ContactFormErrorModal'

// Export layout components
export { Footer } from './components/layout/Footer'
export type { FooterProps, FooterLink } from './components/layout/Footer'
export { PageLayout, Container } from './components/layout/PageLayout'
export type { PageLayoutProps, ContainerProps } from './components/layout/PageLayout'

// Mock data utilities for prototypes
export {
  mockUsers,
  mockPartnerUser,
  mockFlowUser,
  mockMarketUser,
  defaultUserMenuItems,
  mockNotifications,
  mockRecentActivity,
  mockPartnerKPIs,
  mockFlowKPIs,
  mockMarketKPIs,
  simulateAction,
  simulateRequest,
  prototypeAlert,
  prototypeLog,
  randomName,
  randomCompany,
  randomId,
  randomAmount,
} from './components/layout/mock-data'
export type {
  Notification as MockNotification,
  ActivityItem,
  KPIData,
} from './components/layout/mock-data'

// Export design tokens
export * from './constants/designTokens'

// Export assets (logos and patterns)
export { LOGOS, PATTERNS } from './assets/logos'
export type { ProductLogoType, PatternType } from './assets/logos'

// Export utilities
export { cn } from './lib/utils'

// Export hooks
export { useIsMobile } from './hooks/useIsMobile'
export { useMouseParticles } from './hooks/useMouseParticles'
export type { MouseParticle } from './hooks/useMouseParticles'
export { useHeroTitleRotation } from './hooks/useHeroTitleRotation'
export { useHeaderContrast, useContrastColor } from './hooks/useHeaderContrast'
// iOS 26 Safari visual viewport bug fix
export { useVisualViewportFix, isIOS26ViewportBugAffected } from './hooks/useVisualViewportFix'

// iOS Safari scroll lock for modals/overlays
export { useIOSScrollLock, isIOS } from './hooks/useIOSScrollLock'
export type { UseIOSScrollLockOptions, UseIOSScrollLockReturn } from './hooks/useIOSScrollLock'
export { ScrollLockContainer } from './components/ui/ScrollLockContainer'
export type { ScrollLockContainerProps } from './components/ui/ScrollLockContainer'

// Export visualization components
export { DependencyGraph } from './components/visualization/DependencyGraph'
export type { GraphNode, GraphLink, DependencyData, GraphFilters, DependencyGraphProps } from './components/visualization/DependencyGraph'


// Export assets
export { optimizedImages } from './assets/optimized'
export { aboutImages } from './assets/optimized/about'
export { productImages } from './assets/optimized/product'

// =============================================================================
// APP TEMPLATES (Pure UI - Consumer owns state/routing)
// =============================================================================

// Layout shell for product apps
export { AppLayoutShell, useAppLayoutState } from './templates/layout/AppLayoutShell'
export type {
  AppLayoutShellProps,
  AppNavItem,
  ProductConfig as AppProductConfig,
} from './templates/layout/AppLayoutShell'

// Page templates (pure UI components)
export { DashboardPage, PlaceholderPage, PartnerPortalPage } from './templates/pages'
export type {
  DashboardPageProps,
  KPICardData,
  ActivityItemData,
  QuickActionData,
  PlaceholderPageProps,
  PartnerPortalPageProps,
  PartnerPortalStats,
  DashboardConfig,
} from './templates/pages'

// Pre-built navigation configs
export {
  partnerNavItems,
  flowNavItems,
  marketNavItems,
} from './templates/navigation/configs'

// Tailwind plugins
export { dashedBordersPlugin } from './plugins/dashed-borders'
