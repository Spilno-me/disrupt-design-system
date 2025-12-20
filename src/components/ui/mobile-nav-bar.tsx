/**
 * MobileNavBar Component
 *
 * A bottom navigation bar for mobile applications.
 * Contains MobileNavButton items and optionally a QuickActionButton in the center.
 *
 * Features:
 * - Glass effect background
 * - Fixed positioning at bottom
 * - Flexible composition with children
 * - Safe area padding for notched devices
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=687-8476
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'
import { MobileNavButton, type MobileNavButtonVariant } from './mobile-nav-button'
import { QuickActionButton, type QuickActionVariant } from './quick-action-button'

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Glass effect background - using ALIAS.overlay.glass token
 * Creates visual separation while showing content beneath
 */

/**
 * Shadow for elevation effect
 * Subtle upward shadow to separate from content
 */
const NAV_BAR_SHADOW = '0px -2px 8px rgba(0, 0, 0, 0.08)'

// =============================================================================
// CVA VARIANTS
// =============================================================================

const mobileNavBarVariants = cva(
  // Base styles
  [
    'flex items-center justify-center',
    'w-full',
    'py-2 px-4',
    'backdrop-blur-md',
    // Safe area padding for notched devices (iPhone X+)
    'pb-safe',
  ],
  {
    variants: {
      position: {
        fixed: 'fixed bottom-0 left-0 right-0 z-50',
        sticky: 'sticky bottom-0 z-40',
        relative: 'relative',
      },
      variant: {
        glass: '',
        solid: '',
      },
      /** Spacing between nav items (per spacing-rules.md) */
      spacing: {
        tight: 'gap-2',      // 8px - compact mobile nav
        default: 'gap-3',    // 12px - standard button group
        comfortable: 'gap-4', // 16px - more breathing room
      },
    },
    defaultVariants: {
      position: 'fixed',
      variant: 'glass',
      spacing: 'default',
    },
  }
)

// =============================================================================
// COMPONENT
// =============================================================================

export interface MobileNavBarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof mobileNavBarVariants> {
  /** Whether to show the top border */
  showBorder?: boolean
  /** Spacing between nav items: tight (8px), default (12px), comfortable (16px) */
  spacing?: 'tight' | 'default' | 'comfortable'
}

/**
 * MobileNavBar - Bottom navigation container for mobile apps
 *
 * A container component that provides the structure for mobile bottom navigation.
 * Supports glass effect background and safe area insets.
 *
 * Children are laid out horizontally with space-around distribution.
 * Typically contains MobileNavButton components and optionally a QuickActionButton.
 *
 * @example
 * ```tsx
 * // Basic usage with nav buttons
 * <MobileNavBar>
 *   <MobileNavButton variant="myFlow" isActive />
 *   <MobileNavButton variant="steps" />
 *   <QuickActionButton variant="incident" />
 *   <MobileNavButton variant="incidents" />
 *   <MobileNavButton variant="more" />
 * </MobileNavBar>
 *
 * // Relative positioning for storybook
 * <MobileNavBar position="relative">
 *   <MobileNavButton variant="myFlow" />
 *   <QuickActionButton variant="create" />
 *   <MobileNavButton variant="more" />
 * </MobileNavBar>
 *
 * // In app layout
 * <div className="min-h-screen pb-20">
 *   <main>App content...</main>
 *   <MobileNavBar>
 *     {navItems}
 *   </MobileNavBar>
 * </div>
 * ```
 */
const MobileNavBar = React.forwardRef<HTMLElement, MobileNavBarProps>(
  (
    {
      className,
      position,
      variant,
      spacing,
      showBorder = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        data-slot="mobile-nav-bar"
        data-position={position}
        data-variant={variant}
        data-spacing={spacing}
        aria-label="Main navigation"
        className={cn(
          mobileNavBarVariants({ position, variant, spacing }),
          showBorder && 'border-t border-default',
          className
        )}
        style={{
          backgroundColor: variant === 'solid'
            ? ALIAS.text.inverse // White for solid variant
            : ALIAS.overlay.glass, // Glass effect for transparent variant
          boxShadow: NAV_BAR_SHADOW,
        }}
        {...props}
      >
        {children}
      </nav>
    )
  }
)

MobileNavBar.displayName = 'MobileNavBar'

// =============================================================================
// FLOW MOBILE NAV (Pre-configured variant)
// =============================================================================

export interface FlowMobileNavProps
  extends Omit<MobileNavBarProps, 'children'> {
  /** Currently active navigation item */
  activeItem?: Exclude<MobileNavButtonVariant, 'custom'>
  /** QuickActionButton variant (default: incident) */
  quickActionVariant?: QuickActionVariant
  /** Callback when a nav item is clicked */
  onNavigate?: (item: Exclude<MobileNavButtonVariant, 'custom'>) => void
  /** Callback when the quick action button is clicked */
  onQuickAction?: () => void
}

/**
 * FlowMobileNav - Pre-configured mobile navigation for Flow EHS
 *
 * A ready-to-use mobile navigation with the standard Flow EHS layout:
 * My Flow | Steps | [QuickAction] | Incidents | More
 *
 * The QuickActionButton (default: incident/report) is centered in the middle.
 *
 * @example
 * ```tsx
 * // Default: incident reporting in center
 * <FlowMobileNav
 *   activeItem="myFlow"
 *   onNavigate={(item) => router.push(`/${item}`)}
 *   onQuickAction={() => openIncidentForm()}
 * />
 *
 * // With different quick action
 * <FlowMobileNav
 *   activeItem="steps"
 *   quickActionVariant="create"
 *   onQuickAction={() => openCreateDialog()}
 * />
 * ```
 */
const FlowMobileNav = React.forwardRef<HTMLElement, FlowMobileNavProps>(
  (
    {
      activeItem = 'myFlow',
      quickActionVariant = 'incident',
      onNavigate,
      onQuickAction,
      ...props
    },
    ref
  ) => {
    const navItems: Exclude<MobileNavButtonVariant, 'custom'>[] = [
      'myFlow',
      'steps',
      'incidents',
      'more',
    ]

    // Split nav items around the center quick action
    const leftItems = navItems.slice(0, 2)  // myFlow, steps
    const rightItems = navItems.slice(2)     // incidents, more

    return (
      <MobileNavBar ref={ref} {...props}>
        {/* Left nav items */}
        {leftItems.map((item) => (
          <MobileNavButton
            key={item}
            variant={item}
            isActive={activeItem === item}
            onClick={() => onNavigate?.(item)}
          />
        ))}

        {/* Center quick action button */}
        <QuickActionButton
          variant={quickActionVariant}
          size="lg"
          onClick={onQuickAction}
        />

        {/* Right nav items */}
        {rightItems.map((item) => (
          <MobileNavButton
            key={item}
            variant={item}
            isActive={activeItem === item}
            onClick={() => onNavigate?.(item)}
          />
        ))}
      </MobileNavBar>
    )
  }
)

FlowMobileNav.displayName = 'FlowMobileNav'

// =============================================================================
// EXPORTS
// =============================================================================

export { MobileNavBar, mobileNavBarVariants, FlowMobileNav }
