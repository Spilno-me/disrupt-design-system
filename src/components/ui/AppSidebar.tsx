/**
 * AppSidebar - Collapsible navigation sidebar for DDS product apps.
 */

import * as React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { motion } from 'motion/react'
import { ChevronDown, CircleHelp } from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  NavItem,
  ProductType,
  NavIcon,
  isGroupActive,
  findParentGroupId,
} from './navigation'

// =============================================================================
// TYPES
// =============================================================================

export interface AppSidebarProps {
  /** Which product app this sidebar is for */
  product: ProductType
  /** Navigation items to display */
  items: NavItem[]
  /** Currently active item ID (matches route) */
  activeItemId?: string
  /** Whether sidebar is collapsed */
  collapsed?: boolean
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Callback when a nav item is clicked */
  onNavigate?: (item: NavItem) => void
  /** Additional className */
  className?: string
  /** Show help item at bottom */
  showHelpItem?: boolean
  /** Callback when help item is clicked */
  onHelpClick?: () => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COLLAPSED_WIDTH = 63
const EXPANDED_WIDTH = 255
const TRANSITION_DURATION = 0.25
const HOVER_EXPAND_DELAY = 150

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface NavItemButtonProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  onClick: () => void
  isNested?: boolean
}

function NavItemButton({ item, isActive, collapsed, onClick, isNested = false }: NavItemButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'relative w-full h-[41px] min-h-[41px] flex items-center gap-[9px] px-[17px] rounded-xs',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        isActive && 'bg-accent-bg',
        !isActive && !item.disabled && 'hover:bg-accent-bg',
        item.disabled && 'opacity-50 cursor-not-allowed',
        isNested && !collapsed && 'pl-[37px]'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <NavIcon
        icon={item.icon}
        isActive={isActive}
        badge={item.badge}
        size="sm"
        showActiveBackground={collapsed}
      />

      <span
        className={cn(
          'text-[13px] whitespace-nowrap overflow-hidden',
          'transition-opacity duration-200',
          isActive ? 'font-bold text-primary' : 'font-medium text-primary',
          collapsed ? 'opacity-0 w-0' : 'opacity-100'
        )}
      >
        {item.label}
      </span>
    </button>
  )
}

interface NavGroupProps {
  item: NavItem
  activeItemId?: string
  collapsed: boolean
  onNavigate: (item: NavItem) => void
  expandedGroups: Set<string>
  toggleGroup: (id: string) => void
}

function NavGroup({
  item,
  activeItemId,
  collapsed,
  onNavigate,
  expandedGroups,
  toggleGroup,
}: NavGroupProps) {
  const isOpen = expandedGroups.has(item.id)
  const groupActive = isGroupActive(item, activeItemId)

  const activeChild = item.children?.find((child) => child.id === activeItemId)
  const displayIcon = collapsed && activeChild ? activeChild.icon : item.icon

  return (
    <CollapsiblePrimitive.Root
      open={!collapsed && isOpen}
      onOpenChange={() => !collapsed && toggleGroup(item.id)}
    >
      <CollapsiblePrimitive.Trigger asChild>
        <button
          className={cn(
            'relative w-full h-[41px] min-h-[41px] flex items-center gap-[9px] px-[17px] rounded-xs',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            groupActive && 'bg-accent-bg',
            !groupActive && 'hover:bg-accent-bg'
          )}
          onClick={() => {
            if (collapsed) onNavigate(item)
          }}
        >
          <NavIcon icon={displayIcon} isActive={groupActive} size="sm" showActiveBackground={collapsed} />

          <span
            className={cn(
              'text-[13px] whitespace-nowrap overflow-hidden flex-1 text-left',
              'transition-opacity duration-200',
              groupActive ? 'font-bold text-primary' : 'font-medium text-primary',
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            )}
          >
            {item.label}
          </span>

          <div
            className={cn(
              'transition-all duration-200',
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            )}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
          >
            <ChevronDown className="w-3 h-3 text-secondary" />
          </div>
        </button>
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content asChild>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-0.5 pt-1">
            {item.children?.map((child) => (
              <NavItemButton
                key={child.id}
                item={child}
                isActive={child.id === activeItemId}
                collapsed={collapsed}
                onClick={() => onNavigate(child)}
                isNested
              />
            ))}
          </div>
        </motion.div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

function HelpItem({ collapsed, onClick }: { collapsed: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full h-[41px] min-h-[41px] flex items-center gap-[9px] px-[17px] rounded-xs',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'hover:bg-accent-bg'
      )}
    >
      <NavIcon icon={<CircleHelp />} size="sm" showActiveBackground={collapsed} />

      <span
        className={cn(
          'text-[13px] font-medium text-primary whitespace-nowrap overflow-hidden',
          'transition-opacity duration-200',
          collapsed ? 'opacity-0 w-0' : 'opacity-100'
        )}
      >
        Get Help
      </span>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AppSidebar({
  product,
  items,
  activeItemId,
  collapsed = false,
  onCollapsedChange,
  onNavigate,
  className,
  showHelpItem = true,
  onHelpClick,
}: AppSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const parentId = activeItemId ? findParentGroupId(items, activeItemId) : undefined
    return parentId ? new Set([parentId]) : new Set()
  })

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  const handleNavigate = useCallback(
    (item: NavItem) => {
      if (item.disabled) return

      if (item.children && collapsed) {
        onCollapsedChange?.(false)
        setExpandedGroups((prev) => new Set([...prev, item.id]))
        return
      }

      onNavigate?.(item)
    },
    [collapsed, onCollapsedChange, onNavigate]
  )

  useEffect(() => {
    if (activeItemId) {
      const parentId = findParentGroupId(items, activeItemId)
      if (parentId && !expandedGroups.has(parentId)) {
        setExpandedGroups((prev) => new Set([...prev, parentId]))
      }
    }
  }, [activeItemId, items])

  const handleMouseEnter = useCallback(() => {
    if (collapsed) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = setTimeout(() => {
        onCollapsedChange?.(false)
      }, HOVER_EXPAND_DELAY)
    }
  }, [collapsed, onCollapsedChange])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!collapsed && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCollapsedChange?.(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [collapsed, onCollapsedChange])

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  return (
    <motion.nav
      ref={sidebarRef}
      className={cn('relative flex flex-col h-full bg-surface/60 backdrop-blur-sm', className)}
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
      aria-label={`${product} navigation`}
      data-collapsed={collapsed}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient border on right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none bg-gradient-to-b from-surface via-default to-surface" />

      {/* Navigation items */}
      <div className="flex-1 flex flex-col gap-1 py-[11px] overflow-y-auto overflow-x-hidden">
        {items.map((item) => {
          if (item.children && item.children.length > 0) {
            return (
              <NavGroup
                key={item.id}
                item={item}
                activeItemId={activeItemId}
                collapsed={collapsed}
                onNavigate={handleNavigate}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
              />
            )
          }

          return (
            <NavItemButton
              key={item.id}
              item={item}
              isActive={item.id === activeItemId}
              collapsed={collapsed}
              onClick={() => handleNavigate(item)}
            />
          )
        })}
      </div>

      {/* Help item at bottom */}
      {showHelpItem && (
        <div className="py-[11px]">
          <div className="h-px mb-3 bg-gradient-to-r from-surface via-default to-surface" />
          <HelpItem collapsed={collapsed} onClick={onHelpClick} />
        </div>
      )}
    </motion.nav>
  )
}

export default AppSidebar
export type { NavItem, ProductType }
