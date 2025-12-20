/**
 * Flow EHS Mobile Components
 *
 * Product-specific components for the Flow EHS mobile application.
 * These components are NOT included in the main DDS export to prevent
 * polluting other products (Portal, Market, etc.) with Flow-specific code.
 *
 * @usage
 * ```tsx
 * import { MobileNavButton, QuickActionButton } from '@adrozdenko/design-system/flow'
 * ```
 */

// Mobile Navigation
export { MobileNavButton, mobileNavButtonVariants } from './components/mobile-nav-button'
export type { MobileNavButtonProps, MobileNavButtonVariant } from './components/mobile-nav-button'

export { MobileNavBar, mobileNavBarVariants, FlowMobileNav } from './components/mobile-nav-bar'
export type { MobileNavBarProps, FlowMobileNavProps } from './components/mobile-nav-bar'

export { QuickActionButton, quickActionButtonVariants } from './components/quick-action-button'
export type { QuickActionButtonProps, QuickActionVariant } from './components/quick-action-button'

export { NextStepButton, nextStepButtonVariants } from './components/next-step-button'
export type { NextStepButtonProps, NextStepSeverity } from './components/next-step-button'
