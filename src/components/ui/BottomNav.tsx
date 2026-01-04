/**
 * BottomNav - Mobile bottom navigation bar with "More" menu.
 *
 * Displays primary navigation items in a fixed bottom bar on mobile devices.
 * Additional items overflow into a slide-up sheet accessed via "More" button.
 *
 * @component MOLECULE
 *
 * @example
 * ```tsx
 * // Basic usage with 3 visible items
 * <BottomNav
 *   items={navItems}
 *   activeItemId="dashboard"
 *   onNavigate={(item) => router.push(item.href)}
 *   maxVisibleItems={3}
 * />
 *
 * // With help menu and custom More label
 * <BottomNav
 *   items={navItems}
 *   activeItemId="settings"
 *   onNavigate={handleNavigate}
 *   maxVisibleItems={4}
 *   showHelpItem={true}
 *   onHelpClick={openHelp}
 *   moreLabel="Menu"
 * />
 * ```
 *
 * **Testing:**
 * - Component accepts `data-testid` via props spread
 * - data-slot="bottom-nav" for the nav element
 * - data-slot="bottom-nav-tab" for each tab button
 * - data-slot="bottom-nav-more" for the More button
 * - data-slot="bottom-nav-sheet" for the sheet content
 * - data-slot="bottom-nav-sheet-item" for sheet navigation items
 * - data-slot="bottom-nav-sheet-group" for expandable groups
 * - data-slot="bottom-nav-help" for help button
 *
 * **Accessibility:**
 * - nav has aria-label="Bottom navigation"
 * - Active items have aria-current="page"
 * - More button has aria-label="Open more navigation options"
 */

'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import { MoreHorizontal, X, ChevronRight, CircleHelp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet'
import { Button } from './button'
import { NavItem, NavIcon, NavBadge, isGroupActive } from './navigation'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Height of the bottom navigation bar in pixels */
const NAV_HEIGHT_PX = 64

/** Height of sheet navigation items in pixels */
const SHEET_ITEM_HEIGHT_PX = 56

/** Height of nested sheet items in pixels */
const SHEET_NESTED_ITEM_HEIGHT_PX = 52

/** Default number of visible items in bottom bar */
const DEFAULT_MAX_VISIBLE_ITEMS = 3

/** Default label for the More button */
const DEFAULT_MORE_LABEL = 'More'

/** Font size for tab labels */
const TAB_LABEL_FONT_SIZE = 'text-[11px]'

// =============================================================================
// TYPES
// =============================================================================

/** BottomNav props - DDS owns all styling, no className allowed */
export interface BottomNavProps {
  /** Navigation items - first N shown in bar, rest in More menu */
  items: NavItem[]
  /** Currently active item ID */
  activeItemId?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (item: NavItem) => void
  /** Maximum items to show in bottom bar (rest go to More menu) */
  maxVisibleItems?: number
  /** Show help item in More menu */
  showHelpItem?: boolean
  /** Callback when help item is clicked */
  onHelpClick?: () => void
  /** Label for the More button */
  moreLabel?: string
  /** Force visible on all screen sizes (for documentation/stories) */
  forceVisible?: boolean
  /** Use absolute positioning instead of fixed (for embedding in containers/stories) */
  embedded?: boolean
}

/** Props for the BottomNavTab sub-component */
interface BottomNavTabProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

/** Props for the MoreTab sub-component */
interface MoreTabProps {
  isActive: boolean
  onClick: () => void
  label?: string
  hasActiveChild?: boolean
}

/** Props for the SheetNavItem sub-component */
interface SheetNavItemProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
  isNested?: boolean
}

/** Props for the SheetNavGroup sub-component */
interface SheetNavGroupProps {
  item: NavItem
  activeItemId?: string
  onNavigate: (item: NavItem) => void
  onClose: () => void
}

/** Props for the SheetHelpItem sub-component */
interface SheetHelpItemProps {
  onClick?: () => void
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get tab label styles based on active state.
 */
function getTabLabelStyles(isActive: boolean): string {
  return cn(
    TAB_LABEL_FONT_SIZE,
    'leading-tight',
    isActive ? 'font-semibold text-primary' : 'font-medium text-primary'
  )
}

/**
 * Get sheet item height style object.
 */
function getSheetItemHeight(isNested: boolean): React.CSSProperties {
  const height = isNested ? SHEET_NESTED_ITEM_HEIGHT_PX : SHEET_ITEM_HEIGHT_PX
  return { height, minHeight: height }
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * Individual tab button in the bottom navigation bar.
 */
const BottomNavTab = React.memo(function BottomNavTab({
  item,
  isActive,
  onClick,
}: BottomNavTabProps) {
  return (
    <button
      data-slot="bottom-nav-tab"
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'flex flex-col items-center justify-center flex-1 h-full gap-1 px-2',
        'focus:outline-none focus-visible:bg-surface-hover',
        'active:bg-surface-active transition-colors',
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative">
        <NavIcon icon={item.icon} isActive={isActive} size="md" />
        {item.badge !== undefined && <NavBadge badge={item.badge} size="sm" />}
      </div>
      <span className={getTabLabelStyles(isActive)}>{item.label}</span>
    </button>
  )
})
BottomNavTab.displayName = 'BottomNavTab'

/**
 * "More" button that opens the overflow sheet.
 */
const MoreTab = React.memo(function MoreTab({
  isActive,
  onClick,
  label = DEFAULT_MORE_LABEL,
  hasActiveChild,
}: MoreTabProps) {
  const showActive = isActive || Boolean(hasActiveChild)

  return (
    <button
      data-slot="bottom-nav-more"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center flex-1 h-full gap-1 px-2',
        'focus:outline-none focus-visible:bg-accent-bg',
        'active:bg-accent-bg transition-colors'
      )}
      aria-label="Open more navigation options"
    >
      <MoreHorizontal
        className="w-6 h-6 text-primary"
        strokeWidth={showActive ? 2 : 1.5}
      />
      <span className={getTabLabelStyles(showActive)}>{label}</span>
    </button>
  )
})
MoreTab.displayName = 'MoreTab'

/**
 * Navigation item displayed inside the overflow sheet.
 */
const SheetNavItem = React.memo(function SheetNavItem({
  item,
  isActive,
  onClick,
  isNested = false,
}: SheetNavItemProps) {
  return (
    <button
      data-slot="bottom-nav-sheet-item"
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'relative w-full flex items-center gap-3 px-5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'active:bg-surface-active transition-colors',
        isActive && 'bg-surface-active',
        !isActive && !item.disabled && 'hover:bg-muted-bg',
        item.disabled && 'opacity-50 cursor-not-allowed',
        isNested ? 'pl-14' : 'pl-5'
      )}
      style={getSheetItemHeight(isNested)}
      aria-current={isActive ? 'page' : undefined}
    >
      <NavIcon icon={item.icon} isActive={isActive} badge={item.badge} size="md" />
      <span
        className={cn(
          'flex-1 text-left text-base',
          isActive ? 'font-semibold text-primary' : 'font-medium text-primary'
        )}
      >
        {item.label}
      </span>
    </button>
  )
})
SheetNavItem.displayName = 'SheetNavItem'

/**
 * Expandable navigation group in the overflow sheet.
 */
function SheetNavGroup({
  item,
  activeItemId,
  onNavigate,
  onClose,
}: SheetNavGroupProps) {
  const groupActive = isGroupActive(item, activeItemId)
  const [isExpanded, setIsExpanded] = useState(() => groupActive)

  const handleChildClick = useCallback(
    (child: NavItem) => {
      onNavigate(child)
      onClose()
    },
    [onNavigate, onClose]
  )

  return (
    <div data-slot="bottom-nav-sheet-group">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'relative w-full flex items-center gap-3 px-5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          'active:bg-surface-active transition-colors',
          groupActive && 'bg-surface-active',
          !groupActive && 'hover:bg-muted-bg'
        )}
        style={getSheetItemHeight(false)}
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
            'w-5 h-5 text-secondary transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {item.children?.map((child) => (
          <SheetNavItem
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
SheetNavGroup.displayName = 'SheetNavGroup'

/**
 * Help item displayed at the bottom of the overflow sheet.
 */
const SheetHelpItem = React.memo(function SheetHelpItem({ onClick }: SheetHelpItemProps) {
  return (
    <button
      data-slot="bottom-nav-help"
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center gap-3 px-5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'hover:bg-muted-bg active:bg-surface-active transition-colors'
      )}
      style={getSheetItemHeight(false)}
    >
      <NavIcon icon={<CircleHelp />} size="md" />
      <span className="flex-1 text-left text-base font-medium text-primary">Get Help</span>
    </button>
  )
})
SheetHelpItem.displayName = 'SheetHelpItem'

/**
 * BottomNav - Mobile bottom navigation bar with overflow menu.
 *
 * @component MOLECULE
 */
export function BottomNav({
  items,
  activeItemId,
  onNavigate,
  maxVisibleItems = DEFAULT_MAX_VISIBLE_ITEMS,
  showHelpItem = true,
  onHelpClick,
  moreLabel = DEFAULT_MORE_LABEL,
  forceVisible = false,
  embedded = false,
}: BottomNavProps) {
  const [moreSheetOpen, setMoreSheetOpen] = useState(false)

  const visibleItems = items.slice(0, maxVisibleItems)
  const hasMoreItems = items.length > maxVisibleItems
  const overflowItems = items.slice(maxVisibleItems)
  const hasActiveOverflowItem = overflowItems.some((item) => isGroupActive(item, activeItemId))

  const handleNavigate = useCallback(
    (item: NavItem) => {
      if (item.disabled) return
      onNavigate?.(item)
      setMoreSheetOpen(false)
    },
    [onNavigate]
  )

  const handleVisibleItemClick = useCallback(
    (item: NavItem) => {
      if (item.disabled) return
      if (item.children && item.children.length > 0) {
        setMoreSheetOpen(true)
      } else {
        onNavigate?.(item)
      }
    },
    [onNavigate]
  )

  return (
    <>
      <nav
        data-slot="bottom-nav"
        className={cn(
          'bottom-0 left-0 right-0 z-50 flex items-center bg-surface border-t border-default shadow-lg pb-safe',
          embedded ? 'absolute' : 'fixed',
          !forceVisible && !embedded && 'md:hidden'
        )}
        style={{ height: NAV_HEIGHT_PX }}
        aria-label="Bottom navigation"
      >
        {visibleItems.map((item) => (
          <BottomNavTab
            key={item.id}
            item={item}
            isActive={item.id === activeItemId || isGroupActive(item, activeItemId)}
            onClick={() => handleVisibleItemClick(item)}
          />
        ))}

        {hasMoreItems && (
          <MoreTab
            isActive={moreSheetOpen}
            hasActiveChild={hasActiveOverflowItem}
            onClick={() => setMoreSheetOpen(true)}
            label={moreLabel}
          />
        )}
      </nav>

      <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
        <SheetContent
          data-slot="bottom-nav-sheet"
          side="bottom"
          hideCloseButton
          className="rounded-t-2xl px-0 pb-8 max-h-[85vh]"
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted" />
          </div>

          <SheetHeader className="px-5 py-3 border-b border-default">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-primary">Navigation</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 -mr-2"
                aria-label="Close navigation"
                onClick={() => setMoreSheetOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-2">
            {items.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <SheetNavGroup
                    key={item.id}
                    item={item}
                    activeItemId={activeItemId}
                    onNavigate={handleNavigate}
                    onClose={() => setMoreSheetOpen(false)}
                  />
                )
              }

              return (
                <SheetNavItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItemId}
                  onClick={() => handleNavigate(item)}
                />
              )
            })}
          </div>

          {showHelpItem && (
            <div className="border-t border-default py-2">
              <SheetHelpItem onClick={onHelpClick} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {!embedded && <div className={cn('h-16', !forceVisible && 'md:hidden')} aria-hidden="true" />}
    </>
  )
}
BottomNav.displayName = 'BottomNav'

// =============================================================================
// EXPORTS
// =============================================================================

export default BottomNav
export type { NavItem as BottomNavItem }
