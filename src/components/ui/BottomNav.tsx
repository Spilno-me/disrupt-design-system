/**
 * BottomNav - Mobile bottom navigation bar with "More" menu.
 *
 * **Component Type:** MOLECULE (composed of multiple atoms + Sheet/Button)
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
 * - Auto-generates data-slot="bottom-nav" for the nav element
 * - Sub-components have data-slot="bottom-nav-tab", "bottom-nav-more", "bottom-nav-sheet"
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
// TYPES
// =============================================================================

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
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

// =============================================================================
// CONSTANTS
// =============================================================================

const NAV_HEIGHT = 64
const ITEM_HEIGHT = 56
const NESTED_ITEM_HEIGHT = 52

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function BottomNavTab({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      data-slot="bottom-nav-tab"
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'flex flex-col items-center justify-center flex-1 h-full gap-1 px-2',
        'focus:outline-none focus-visible:bg-accent-bg',
        'active:bg-accent-bg transition-colors',
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative">
        <NavIcon icon={item.icon} isActive={isActive} size="md" />
        {item.badge !== undefined && <NavBadge badge={item.badge} size="sm" />}
      </div>
      <span
        className={cn(
          'text-[11px] leading-tight',
          isActive ? 'font-semibold text-primary' : 'font-medium text-primary'
        )}
      >
        {item.label}
      </span>
    </button>
  )
}

function MoreTab({
  isActive,
  onClick,
  label = 'More',
  hasActiveChild,
}: {
  isActive: boolean
  onClick: () => void
  label?: string
  hasActiveChild?: boolean
}) {
  const showActive = isActive || hasActiveChild

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
        className={cn('w-6 h-6', showActive ? 'text-primary' : 'text-primary')}
        strokeWidth={showActive ? 2 : 1.5}
      />
      <span
        className={cn(
          'text-[11px] leading-tight',
          showActive ? 'font-semibold text-primary' : 'font-medium text-primary'
        )}
      >
        {label}
      </span>
    </button>
  )
}

function SheetNavItem({
  item,
  isActive,
  onClick,
  isNested = false,
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
  isNested?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'relative w-full flex items-center gap-3 px-5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'active:bg-accent-bg transition-colors',
        isActive && 'bg-accent-bg',
        !isActive && !item.disabled && 'hover:bg-muted-bg',
        item.disabled && 'opacity-50 cursor-not-allowed',
        isNested ? 'pl-14' : 'pl-5'
      )}
      style={{
        height: isNested ? NESTED_ITEM_HEIGHT : ITEM_HEIGHT,
        minHeight: isNested ? NESTED_ITEM_HEIGHT : ITEM_HEIGHT,
      }}
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
}

function SheetNavGroup({
  item,
  activeItemId,
  onNavigate,
  onClose,
}: {
  item: NavItem
  activeItemId?: string
  onNavigate: (item: NavItem) => void
  onClose: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(() => isGroupActive(item, activeItemId))
  const groupActive = isGroupActive(item, activeItemId)

  const handleChildClick = (child: NavItem) => {
    onNavigate(child)
    onClose()
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'relative w-full flex items-center gap-3 px-5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          'active:bg-accent-bg transition-colors',
          groupActive && 'bg-accent-bg',
          !groupActive && 'hover:bg-muted-bg'
        )}
        style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT }}
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
          className={cn('w-5 h-5 text-secondary transition-transform duration-200', isExpanded && 'rotate-90')}
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

function SheetHelpItem({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center gap-3 px-5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'hover:bg-muted-bg active:bg-accent-bg transition-colors'
      )}
      style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT }}
    >
      <NavIcon icon={<CircleHelp />} size="md" />
      <span className="flex-1 text-left text-base font-medium text-primary">Get Help</span>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function BottomNav({
  items,
  activeItemId,
  onNavigate,
  maxVisibleItems = 3,
  className,
  showHelpItem = true,
  onHelpClick,
  moreLabel = 'More',
  forceVisible = false,
  embedded = false,
  ...props
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
          'bottom-0 left-0 right-0 z-50 flex items-center bg-surface border-t border-default shadow-lg',
          embedded ? 'absolute' : 'fixed',
          !forceVisible && !embedded && 'md:hidden',
          className
        )}
        style={{ height: NAV_HEIGHT }}
        aria-label="Bottom navigation"
        {...props}
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
        <SheetContent side="bottom" hideCloseButton className="rounded-t-2xl px-0 pb-8 max-h-[85vh]">
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

export default BottomNav
export type { NavItem as BottomNavItem }
