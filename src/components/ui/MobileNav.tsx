/**
 * MobileNav - Mobile navigation drawer for DDS product apps.
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Menu, X, ChevronRight, CircleHelp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet'
import { NavItem, ProductType, NavIcon, NavBadge, isGroupActive } from './navigation'

// =============================================================================
// TYPES
// =============================================================================

export interface MobileNavProps {
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

// =============================================================================
// CONSTANTS
// =============================================================================

const ITEM_HEIGHT = 56
const NESTED_ITEM_HEIGHT = 52

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function MobileNavItemButton({
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
        'relative w-full flex items-center gap-4',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'active:bg-accentBg transition-colors',
        isActive && 'bg-accentBg',
        !isActive && !item.disabled && 'hover:bg-mutedBg',
        item.disabled && 'opacity-50 cursor-not-allowed',
        isNested ? 'pl-14' : 'px-4'
      )}
      style={{
        height: isNested ? NESTED_ITEM_HEIGHT : ITEM_HEIGHT,
        minHeight: isNested ? NESTED_ITEM_HEIGHT : ITEM_HEIGHT,
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <NavIcon icon={item.icon} isActive={isActive} size="md" />

      <span
        className={cn(
          'flex-1 text-left text-base',
          isActive ? 'font-semibold text-accent' : 'font-medium text-primary'
        )}
      >
        {item.label}
      </span>

      {item.badge !== undefined && <NavBadge badge={item.badge} position="inline" />}
    </button>
  )
}

function MobileNavGroup({
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
          'relative w-full flex items-center gap-4 px-4',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          'active:bg-accentBg transition-colors',
          groupActive && 'bg-accentBg',
          !groupActive && 'hover:bg-mutedBg'
        )}
        style={{
          height: ITEM_HEIGHT,
          minHeight: ITEM_HEIGHT,
        }}
      >
        <NavIcon icon={item.icon} isActive={groupActive} size="md" />

        <span
          className={cn(
            'flex-1 text-left text-base',
            groupActive ? 'font-semibold text-accent' : 'font-medium text-primary'
          )}
        >
          {item.label}
        </span>

        <ChevronRight
          className={cn('w-5 h-5 text-muted transition-transform duration-200', isExpanded && 'rotate-90')}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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

function MobileHelpItem({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center gap-4 px-4',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        'hover:bg-mutedBg active:bg-accentBg transition-colors'
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

export function MobileNav({
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

  const displayTitle = productTitle || product.charAt(0).toUpperCase() + product.slice(1)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-11 w-11 md:hidden', triggerClassName)}
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] p-0 bg-surface">
          <SheetHeader className="px-4 py-5 border-b border-default">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-primary">{displayTitle}</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11 -mr-2" aria-label="Close navigation menu">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto py-2" aria-label={`${product} navigation`}>
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

export default MobileNav
export type { NavItem as MobileNavItem }
