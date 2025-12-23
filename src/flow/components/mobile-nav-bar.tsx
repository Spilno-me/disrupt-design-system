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
import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'
import { MobileNavButton, type MobileNavButtonVariant } from './mobile-nav-button'
import { QuickActionButton, type QuickActionVariant } from './quick-action-button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet'

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Shadow for elevation effect
 * Subtle upward shadow to separate from content
 */
const NAV_BAR_SHADOW = '0px -2px 8px rgba(0, 0, 0, 0.08)'

/**
 * Standard Flow EHS navigation items
 * Order: My Flow | Steps | [QuickAction] | Incidents | More
 */
const FLOW_NAV_ITEMS: Exclude<MobileNavButtonVariant, 'custom'>[] = [
  'myFlow',
  'steps',
  'incidents',
  'more',
]

// =============================================================================
// CVA VARIANTS
// =============================================================================

const mobileNavBarVariants = cva(
  // Base styles
  [
    'flex items-center justify-around',  // Even distribution across full width
    'w-full',
    'py-1.5 px-1',  // Compact padding (6px vertical, 4px horizontal)
    'backdrop-blur-md',
    // Safe area padding for notched devices (iPhone X+)
    'pb-safe',
  ],
  {
    variants: {
      position: {
        // z-[9999] ensures nav is above map libraries (Leaflet, Google Maps, what3words)
        // which often use z-index 400-1000 for their controls
        fixed: 'fixed bottom-0 left-0 right-0 z-[9999]',
        sticky: 'sticky bottom-0 z-[9998]',
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

/** Menu item for the "More" sheet */
export interface MoreMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

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
  /** Menu items to show in the "More" sheet */
  moreMenuItems?: MoreMenuItem[]
  /** Title for the "More" sheet (default: "More") */
  moreMenuTitle?: string
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
      moreMenuItems = [],
      moreMenuTitle = 'More',
      ...props
    },
    ref
  ) => {
    const [moreMenuOpen, setMoreMenuOpen] = useState(false)

    // Split nav items around the center quick action
    const leftItems = FLOW_NAV_ITEMS.slice(0, 2)  // myFlow, steps
    const rightItems = FLOW_NAV_ITEMS.slice(2)    // incidents, more

    // Handle nav button click
    const handleNavClick = (item: Exclude<MobileNavButtonVariant, 'custom'>) => {
      if (item === 'more') {
        // Open the "More" sheet instead of navigating
        setMoreMenuOpen(true)
      } else {
        onNavigate?.(item)
      }
    }

    // Handle menu item click
    const handleMenuItemClick = (menuItem: MoreMenuItem) => {
      setMoreMenuOpen(false)
      menuItem.onClick?.()
    }

    return (
      <>
        <MobileNavBar ref={ref} {...props}>
          {/* Left nav items */}
          {leftItems.map((item) => (
            <MobileNavButton
              key={item}
              variant={item}
              isActive={activeItem === item}
              onClick={() => handleNavClick(item)}
            />
          ))}

          {/* Center quick action button - md (56px) for balanced hierarchy */}
          <QuickActionButton
            variant={quickActionVariant}
            size="md"
            onClick={onQuickAction}
          />

          {/* Right nav items */}
          {rightItems.map((item) => (
            <MobileNavButton
              key={item}
              variant={item}
              isActive={item === 'more' ? moreMenuOpen : activeItem === item}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </MobileNavBar>

        {/* "More" menu sheet */}
        <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
            <SheetHeader className="pb-4 border-b border-default">
              <SheetTitle>{moreMenuTitle}</SheetTitle>
            </SheetHeader>
            <nav className="py-2" aria-label="More navigation options">
              {moreMenuItems.length > 0 ? (
                <ul className="space-y-1">
                  {moreMenuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleMenuItemClick(item)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                          'text-left text-sm font-medium text-primary',
                          'hover:bg-muted-bg active:bg-muted-bg/80',
                          'transition-colors duration-150',
                          'min-h-[44px]' // Fitts' Law: 44px touch target
                        )}
                      >
                        {item.icon && (
                          <span className="text-secondary flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-tertiary flex-shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-secondary">
                  No additional options available
                </p>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </>
    )
  }
)

FlowMobileNav.displayName = 'FlowMobileNav'

// =============================================================================
// EXPORTS
// =============================================================================

export { MobileNavBar, mobileNavBarVariants, FlowMobileNav }
