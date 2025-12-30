import * as React from 'react'
import { useState, useCallback } from 'react'
import { Menu, X, ChevronRight, CircleHelp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet'
import { NavItem, ProductType, NavIcon, NavBadge, isGroupActive } from './navigation'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Height in pixels for top-level navigation items */
const ITEM_HEIGHT_PX = 56

/** Height in pixels for nested/child navigation items */
const NESTED_ITEM_HEIGHT_PX = 52

/** Width of mobile navigation drawer */
const DRAWER_WIDTH_CLASS = 'w-[300px]'

/** Max height for expanded group children container */
const EXPANDED_MAX_HEIGHT_CLASS = 'max-h-[500px]'

/** Transition duration class for expand/collapse animations */
const TRANSITION_DURATION_CLASS = 'duration-200'

/** Label text for help navigation item */
const HELP_ITEM_LABEL = 'Get Help'

// =============================================================================
// TYPES
// =============================================================================

interface MobileNavProps {
  /** Which product app this nav is for */
  product: ProductType
  /** Navigation items to display */
  items: NavItem[]
  /** Currently active item ID (matches route) */
  activeItemId?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (item: NavItem) => void
  /** Additional className for trigger button */
  triggerClassName?: string
  /** Show help item at bottom */
  showHelpItem?: boolean
  /** Callback when help item is clicked */
  onHelpClick?: () => void
  /** Product logo/title to show in header */
  productTitle?: string
}

interface MobileNavItemButtonProps {
  /** Navigation item data */
  item: NavItem
  /** Whether this item is currently active */
  isActive: boolean
  /** Click handler */
  onClick: () => void
  /** Whether this is a nested/child item */
  isNested?: boolean
}

interface MobileNavGroupProps {
  /** Navigation group item with children */
  item: NavItem
  /** Currently active item ID */
  activeItemId?: string
  /** Handler when child item is selected */
  onNavigate: (item: NavItem) => void
  /** Handler to close the drawer */
  onClose: () => void
}

interface MobileHelpItemProps {
  /** Click handler */
  onClick?: () => void
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats product type to display title
 *
 * @param product - Product type identifier
 * @returns Capitalized product name
 */
function formatProductTitle(product: ProductType): string {
  return product.charAt(0).toUpperCase() + product.slice(1)
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * MobileNavItemButton - Single navigation item button
 *
 * @component ATOM
 *
 * @description
 * Renders a tappable navigation item with icon, label, and optional badge.
 * Handles active state styling and disabled state.
 *
 * @accessibility
 * - Uses aria-current="page" for active item
 * - Disabled items have aria-disabled and visual indicator
 * - Focus ring visible on keyboard navigation
 */
function MobileNavItemButton({
  item,
  isActive,
  onClick,
  isNested = false,
}: MobileNavItemButtonProps) {
  const height = isNested ? NESTED_ITEM_HEIGHT_PX : ITEM_HEIGHT_PX

  return (
    <button
      data-slot="mobile-nav-item"
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'relative w-full flex items-center gap-4',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'active:bg-surface-active transition-colors',
        isActive && 'bg-surface-active',
        !isActive && !item.disabled && 'hover:bg-muted-bg',
        item.disabled && 'opacity-50 cursor-not-allowed',
        isNested ? 'pl-14' : 'px-4'
      )}
      style={{ height, minHeight: height }}
      aria-current={isActive ? 'page' : undefined}
    >
      <NavIcon icon={item.icon} isActive={isActive} size="md" />

      <span
        className={cn(
          'flex-1 text-left text-base',
          isActive ? 'font-semibold text-primary' : 'font-medium text-primary'
        )}
      >
        {item.label}
      </span>

      {item.badge !== undefined && <NavBadge badge={item.badge} position="inline" />}
    </button>
  )
}

MobileNavItemButton.displayName = 'MobileNavItemButton'

/**
 * MobileNavGroup - Expandable navigation group with children
 *
 * @component MOLECULE
 *
 * @description
 * Renders a collapsible navigation group that expands to show child items.
 * Auto-expands if a child item is currently active.
 *
 * @accessibility
 * - Chevron rotates to indicate expanded state
 * - Smooth expand/collapse animation
 * - Focus ring visible on keyboard navigation
 */
function MobileNavGroup({
  item,
  activeItemId,
  onNavigate,
  onClose,
}: MobileNavGroupProps) {
  const [isExpanded, setIsExpanded] = useState(() => isGroupActive(item, activeItemId))
  const groupActive = isGroupActive(item, activeItemId)

  const handleChildClick = useCallback(
    (child: NavItem) => {
      onNavigate(child)
      onClose()
    },
    [onNavigate, onClose]
  )

  return (
    <div data-slot="mobile-nav-group">
      <button
        data-slot="mobile-nav-group-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'relative w-full flex items-center gap-4 px-4',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          'active:bg-surface-active transition-colors',
          groupActive && 'bg-surface-active',
          !groupActive && 'hover:bg-muted-bg'
        )}
        style={{ height: ITEM_HEIGHT_PX, minHeight: ITEM_HEIGHT_PX }}
        aria-expanded={isExpanded}
      >
        <NavIcon icon={item.icon} isActive={groupActive} size="md" />

        <span
          className={cn(
            'flex-1 text-left text-base',
            groupActive ? 'font-semibold text-primary' : 'font-medium text-primary'
          )}
        >
          {item.label}
        </span>

        <ChevronRight
          className={cn(
            'w-5 h-5 text-muted transition-transform',
            TRANSITION_DURATION_CLASS,
            isExpanded && 'rotate-90'
          )}
          aria-hidden="true"
        />
      </button>

      <div
        data-slot="mobile-nav-group-content"
        className={cn(
          'overflow-hidden transition-all',
          TRANSITION_DURATION_CLASS,
          isExpanded ? `${EXPANDED_MAX_HEIGHT_CLASS} opacity-100` : 'max-h-0 opacity-0'
        )}
      >
        {item.children?.map((child) => (
          <MobileNavItemButton
            key={child.id}
            item={child}
            isActive={child.id === activeItemId}
            onClick={() => handleChildClick(child)}
            isNested
          />
        ))}
      </div>
    </div>
  )
}

MobileNavGroup.displayName = 'MobileNavGroup'

/**
 * MobileHelpItem - Help navigation item
 *
 * @component ATOM
 *
 * @description
 * Static help item that appears at the bottom of the navigation drawer.
 * Provides access to help/support functionality.
 *
 * @accessibility
 * - Uses semantic button element
 * - Focus ring visible on keyboard navigation
 */
function MobileHelpItem({ onClick }: MobileHelpItemProps) {
  return (
    <button
      data-slot="mobile-nav-help"
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center gap-4 px-4',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'hover:bg-muted-bg active:bg-surface-active transition-colors'
      )}
      style={{ height: ITEM_HEIGHT_PX, minHeight: ITEM_HEIGHT_PX }}
    >
      <NavIcon icon={<CircleHelp />} size="md" />
      <span className="flex-1 text-left text-base font-medium text-primary">
        {HELP_ITEM_LABEL}
      </span>
    </button>
  )
}

MobileHelpItem.displayName = 'MobileHelpItem'

/**
 * MobileNav - Mobile navigation drawer for DDS product apps
 *
 * @component MOLECULE
 *
 * @description
 * Full-screen slide-out navigation drawer for mobile devices.
 * Features:
 * - Hamburger menu trigger (hidden on md+ screens)
 * - Product-branded header with close button
 * - Expandable navigation groups
 * - Optional help item at bottom
 *
 * @example
 * ```tsx
 * <MobileNav
 *   product="goprint"
 *   items={navigationItems}
 *   activeItemId={currentRoute}
 *   onNavigate={(item) => router.push(item.href)}
 *   showHelpItem
 *   onHelpClick={() => openHelpModal()}
 * />
 * ```
 *
 * @testid
 * - `data-slot="mobile-nav"` - Root fragment (trigger + sheet)
 * - `data-slot="mobile-nav-trigger"` - Hamburger menu button
 * - `data-slot="mobile-nav-drawer"` - Sheet content container
 * - `data-slot="mobile-nav-item"` - Individual nav items
 * - `data-slot="mobile-nav-group"` - Expandable nav groups
 * - `data-slot="mobile-nav-help"` - Help item
 *
 * @accessibility
 * - Trigger has aria-label for screen readers
 * - Sheet uses proper dialog semantics
 * - Navigation has aria-label for landmark
 * - Active items marked with aria-current
 */
function MobileNav({
  product,
  items,
  activeItemId,
  onNavigate,
  triggerClassName,
  showHelpItem = true,
  onHelpClick,
  productTitle,
}: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleNavigate = useCallback(
    (item: NavItem) => {
      if (item.disabled) return
      onNavigate?.(item)
      setOpen(false)
    },
    [onNavigate]
  )

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const displayTitle = productTitle || formatProductTitle(product)

  return (
    <>
      <Button
        data-slot="mobile-nav-trigger"
        variant="ghost"
        size="icon"
        className={cn('h-11 w-11 md:hidden', triggerClassName)}
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          data-slot="mobile-nav-drawer"
          side="left"
          className={cn(DRAWER_WIDTH_CLASS, 'p-0 bg-surface')}
        >
          <SheetHeader className="px-4 py-5 border-b border-default">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-primary">
                {displayTitle}
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 -mr-2"
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <nav
            data-slot="mobile-nav-list"
            className="flex-1 overflow-y-auto py-2"
            aria-label={`${product} navigation`}
          >
            {items.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <MobileNavGroup
                    key={item.id}
                    item={item}
                    activeItemId={activeItemId}
                    onNavigate={handleNavigate}
                    onClose={handleClose}
                  />
                )
              }

              return (
                <MobileNavItemButton
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItemId}
                  onClick={() => handleNavigate(item)}
                />
              )
            })}
          </nav>

          {showHelpItem && (
            <div className="border-t border-default py-2">
              <MobileHelpItem onClick={onHelpClick} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

MobileNav.displayName = 'MobileNav'

// =============================================================================
// EXPORTS
// =============================================================================

export { MobileNav }
export type { MobileNavProps, NavItem as MobileNavItem }
