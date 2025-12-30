/**
 * AppSidebar - Collapsible navigation sidebar for DDS product apps.
 *
 * @component ORGANISM
 * @category Navigation
 *
 * @description
 * A sophisticated sidebar navigation component that features:
 * - Click-to-expand behavior (default, configurable)
 * - Optional hover-to-expand with 150ms delay (disabled by default)
 * - Auto-collapse on click outside (configurable)
 * - Nested navigation groups with collapsible sections
 * - Active state tracking with visual indicators
 * - Badge support for notification counts
 * - Optional help item at bottom
 * - Smooth animations for expand/collapse
 *
 * @example
 * // Basic usage
 * import { AppSidebar } from '@adrozdenko/design-system';
 * import { LayoutDashboard, Settings } from 'lucide-react';
 *
 * const navItems = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, href: '/dashboard' },
 *   { id: 'settings', label: 'Settings', icon: <Settings />, href: '/settings' },
 * ];
 *
 * function App() {
 *   const [collapsed, setCollapsed] = useState(true);
 *   const [activeId, setActiveId] = useState('dashboard');
 *
 *   return (
 *     <AppSidebar
 *       product="flow"
 *       items={navItems}
 *       activeItemId={activeId}
 *       collapsed={collapsed}
 *       onCollapsedChange={setCollapsed}
 *       onNavigate={(item) => setActiveId(item.id)}
 *     />
 *   );
 * }
 *
 * @example
 * // With nested groups
 * const navItems = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, href: '/' },
 *   {
 *     id: 'configuration',
 *     label: 'Configuration',
 *     icon: <Settings />,
 *     children: [
 *       { id: 'users', label: 'Users', icon: <Users />, href: '/config/users' },
 *       { id: 'roles', label: 'Roles', icon: <ShieldCheck />, href: '/config/roles' },
 *     ],
 *   },
 * ];
 *
 * @testing
 * Use `data-slot` attributes for testing:
 * - `[data-slot="app-sidebar"]` - Main sidebar container
 * - `[data-slot="nav-items"]` - Navigation items container
 * - `[data-slot="nav-item-button"]` - Individual nav item buttons
 * - `[data-slot="nav-group"]` - Collapsible nav group container
 * - `[data-slot="nav-group-trigger"]` - Nav group trigger button
 * - `[data-slot="nav-group-content"]` - Nav group content (children)
 * - `[data-slot="help-item"]` - Help button at bottom
 * - `[data-slot="help-section"]` - Help section container
 * - `[data-slot="separator"]` - Separator line above help
 * - `[data-slot="border"]` - Right edge gradient border
 *
 * @accessibility
 * - Uses semantic `<nav>` element with aria-label
 * - Active nav items have `aria-current="page"`
 * - Keyboard navigation support via focus-visible styles
 * - Disabled items have proper disabled state and cursor
 * - Focus ring with 2px accent color for visibility
 *
 * @design
 * - Collapsed width: 63px
 * - Expanded width: 255px
 * - Transition duration: 250ms
 * - Hover expand delay: 150ms
 * - Background: semi-transparent with backdrop blur
 * - Nav item height: 41px (consistent touch target)
 * - Border radius: lg (8px) for nav items
 * - Spacing: gap-1 (4px) between nav items, gap-2 (8px) for icon-to-text
 * - Animated indicator: Optional sliding active state indicator (default: true)
 *   When enabled, active state slides between items with spring animation.
 *   When disabled, uses standard CSS active background on each item.
 */

import * as React from 'react'
import { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react'
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

export interface AppSidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onNavigate' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
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
  /** Show help item at bottom */
  showHelpItem?: boolean
  /** Callback when help item is clicked */
  onHelpClick?: () => void
  /** Enable expand on hover (default: false) */
  expandOnHover?: boolean
  /** Enable expand on click (default: true) */
  expandOnClick?: boolean
  /** Collapse when clicking outside (default: true) */
  collapseOnClickOutside?: boolean
  /** Enable animated sliding indicator for active state (default: true) */
  animatedIndicator?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COLLAPSED_WIDTH = 63
const EXPANDED_WIDTH = 255
const TRANSITION_DURATION = 0.25
const HOVER_EXPAND_DELAY = 150
const NAV_ITEM_HEIGHT = 41

// Context for tracking nav item positions
interface NavItemPosition {
  top: number
  left: number
  width: number
  height: number
}

interface NavItemRegistryContextType {
  registerItem: (id: string, element: HTMLElement | null) => void
  getPosition: (id: string) => NavItemPosition | null
  activeItemId?: string
}

const NavItemRegistryContext = createContext<NavItemRegistryContextType | null>(null)

function useNavItemRegistry() {
  const context = useContext(NavItemRegistryContext)
  if (!context) throw new Error('useNavItemRegistry must be used within NavItemRegistryProvider')
  return context
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface NavItemButtonProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  onClick: () => void
  isNested?: boolean
  /** When true, active bg is handled by sliding indicator */
  animatedIndicator?: boolean
}

function NavItemButton({ item, isActive, collapsed, onClick, isNested = false, animatedIndicator = true }: NavItemButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const registry = useContext(NavItemRegistryContext)

  useEffect(() => {
    if (registry) {
      registry.registerItem(item.id, buttonRef.current)
    }
  }, [item.id, registry])

  // Show active background only when NOT using animated indicator (or when collapsed)
  const showActiveBackground = isActive && (!animatedIndicator || collapsed)

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={item.disabled}
      className={cn(
        'relative z-[1] w-[calc(100%-16px)] mx-2 h-[41px] min-h-[41px] flex items-center rounded-lg cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        !item.disabled && 'hover:bg-surface-hover',
        item.disabled && 'opacity-50 cursor-not-allowed',
        // When collapsed, center icon; when expanded, use gap and padding for label
        collapsed ? 'justify-center' : 'gap-2 px-3',
        isNested && !collapsed && 'pl-8',
        showActiveBackground && 'bg-surface-active'
      )}
      aria-current={isActive ? 'page' : undefined}
      data-slot="nav-item-button"
      data-item-id={item.id}
    >
      <NavIcon
        icon={item.icon}
        isActive={isActive}
        badge={item.badge}
        size="sm"
        showActiveBackground={collapsed}
      />

      {!collapsed && (
        <span
          className={cn(
            'text-[13px] whitespace-nowrap overflow-hidden',
            isActive ? 'font-bold text-primary' : 'font-medium text-primary'
          )}
        >
          {item.label}
        </span>
      )}
    </button>
  )
}
NavItemButton.displayName = 'AppSidebar.NavItemButton'

interface NavGroupProps {
  item: NavItem
  activeItemId?: string
  collapsed: boolean
  onNavigate: (item: NavItem) => void
  expandedGroups: Set<string>
  toggleGroup: (id: string) => void
  animatedIndicator?: boolean
}

function NavGroup({
  item,
  activeItemId,
  collapsed,
  onNavigate,
  expandedGroups,
  toggleGroup,
  animatedIndicator = true,
}: NavGroupProps) {
  const isOpen = expandedGroups.has(item.id)
  const groupActive = isGroupActive(item, activeItemId)

  const activeChild = item.children?.find((child) => child.id === activeItemId)
  const displayIcon = collapsed && activeChild ? activeChild.icon : item.icon

  return (
    <CollapsiblePrimitive.Root
      open={!collapsed && isOpen}
      onOpenChange={() => !collapsed && toggleGroup(item.id)}
      data-slot="nav-group"
    >
      <CollapsiblePrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            'relative z-[1] w-[calc(100%-16px)] mx-2 h-[41px] min-h-[41px] flex items-center rounded-lg cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            'hover:bg-surface-hover',
            // When collapsed, center icon; when expanded, use gap and padding for label
            collapsed ? 'justify-center' : 'gap-2 px-3'
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (collapsed) onNavigate(item)
          }}
          data-slot="nav-group-trigger"
        >
          <NavIcon icon={displayIcon} isActive={groupActive} size="sm" showActiveBackground={collapsed} />

          {!collapsed && (
            <>
              <span
                className={cn(
                  'text-[13px] whitespace-nowrap overflow-hidden flex-1 text-left',
                  groupActive ? 'font-bold text-primary' : 'font-medium text-primary'
                )}
              >
                {item.label}
              </span>

              <div
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <ChevronDown className="w-3 h-3 text-secondary" />
              </div>
            </>
          )}
        </button>
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content asChild>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
          className="overflow-hidden"
          data-slot="nav-group-content"
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
                animatedIndicator={animatedIndicator}
              />
            ))}
          </div>
        </motion.div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}
NavGroup.displayName = 'AppSidebar.NavGroup'

function HelpItem({ collapsed, onClick }: { collapsed: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={cn(
        'relative w-[calc(100%-16px)] mx-2 h-[41px] min-h-[41px] flex items-center rounded-lg cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'hover:bg-surface-hover',
        // When collapsed, center icon; when expanded, use gap and padding for label
        collapsed ? 'justify-center' : 'gap-2 px-3'
      )}
      data-slot="help-item"
    >
      <NavIcon icon={<CircleHelp />} size="sm" showActiveBackground={collapsed} />

      {!collapsed && (
        <span className="text-[13px] font-medium text-primary whitespace-nowrap overflow-hidden">
          Get Help
        </span>
      )}
    </button>
  )
}
HelpItem.displayName = 'AppSidebar.HelpItem'

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
  expandOnHover = false,
  expandOnClick = true,
  collapseOnClickOutside = true,
  animatedIndicator = true,
  ...props
}: AppSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const itemRefsMap = useRef<Map<string, HTMLElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState<NavItemPosition | null>(null)
  const [shouldAnimateIndicator, setShouldAnimateIndicator] = useState(false)
  const prevCollapsedRef = useRef(collapsed)
  const prevActiveItemRef = useRef(activeItemId)

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const parentId = activeItemId ? findParentGroupId(items, activeItemId) : undefined
    return parentId ? new Set([parentId]) : new Set()
  })

  // Register nav items for sliding indicator
  const registerItem = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefsMap.current.set(id, element)
    } else {
      itemRefsMap.current.delete(id)
    }
  }, [])

  const getPosition = useCallback((id: string) => {
    const element = itemRefsMap.current.get(id)
    if (!element || !navContainerRef.current) return null
    const containerRect = navContainerRef.current.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    return {
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      height: elementRect.height,
    }
  }, [])

  // Update indicator position
  const updateIndicatorPosition = useCallback(() => {
    if (activeItemId && !collapsed) {
      const position = getPosition(activeItemId)
      setIndicatorStyle(position)
    } else {
      setIndicatorStyle(null)
    }
  }, [activeItemId, collapsed, getPosition])

  // Handle collapsed state changes - clear indicator during transition
  useEffect(() => {
    const wasCollapsed = prevCollapsedRef.current
    prevCollapsedRef.current = collapsed

    // If expanding from collapsed, disable animation for initial placement
    if (wasCollapsed && !collapsed) {
      setShouldAnimateIndicator(false)
      setIndicatorStyle(null)
    }
    // If collapsing, just clear the indicator
    if (!wasCollapsed && collapsed) {
      setIndicatorStyle(null)
    }
  }, [collapsed])

  // Update when active item changes
  useEffect(() => {
    const prevActiveItem = prevActiveItemRef.current
    prevActiveItemRef.current = activeItemId

    if (!collapsed) {
      // Enable animation only when active item changes (user clicked different item)
      if (prevActiveItem && prevActiveItem !== activeItemId) {
        setShouldAnimateIndicator(true)
      }
      updateIndicatorPosition()
    }
  }, [activeItemId, collapsed, updateIndicatorPosition])

  // Recalculate when expanded groups change (nested items appear/disappear)
  useEffect(() => {
    if (activeItemId && !collapsed) {
      const timer = setTimeout(updateIndicatorPosition, 50)
      return () => clearTimeout(timer)
    }
  }, [expandedGroups, activeItemId, collapsed, updateIndicatorPosition])

  const registryValue = { registerItem, getPosition, activeItemId }

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

      // When collapsed, expand the sidebar
      if (collapsed) {
        onCollapsedChange?.(false)
        // If it's a group, also expand that group
        if (item.children) {
          setExpandedGroups((prev) => new Set([...prev, item.id]))
          return // Don't navigate for groups, just expand
        }
      }

      // Navigate for non-group items (even from collapsed state)
      if (!item.children) {
        onNavigate?.(item)
      }
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
    if (expandOnHover && collapsed) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = setTimeout(() => {
        onCollapsedChange?.(false)
      }, HOVER_EXPAND_DELAY)
    }
  }, [expandOnHover, collapsed, onCollapsedChange])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  const handleSidebarClick = useCallback(() => {
    if (expandOnClick && collapsed) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      onCollapsedChange?.(false)
    }
  }, [expandOnClick, collapsed, onCollapsedChange])

  useEffect(() => {
    if (!collapseOnClickOutside) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!collapsed && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCollapsedChange?.(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [collapseOnClickOutside, collapsed, onCollapsedChange])

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  return (
    <motion.nav
      ref={sidebarRef}
      className={cn('relative flex flex-col h-full', className)}
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
      onAnimationComplete={updateIndicatorPosition}
      aria-label={`${product} navigation`}
      data-collapsed={collapsed}
      data-slot="app-sidebar"
      onClick={handleSidebarClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Background with gradient fade to transparent at bottom */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-surface/60 from-70% to-transparent backdrop-blur-sm"
        style={{ maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}
        data-slot="sidebar-bg"
      />

      {/* Gradient border on right edge */}
      <div className="absolute right-0 top-0 bottom-[100px] w-px pointer-events-none bg-gradient-to-b from-surface via-default to-transparent" data-slot="border" />

      {/* Navigation items */}
      <NavItemRegistryContext.Provider value={registryValue}>
        <div
          ref={navContainerRef}
          className="relative z-10 flex-1 flex flex-col gap-1 py-3 overflow-y-auto overflow-x-hidden"
          data-slot="nav-items"
        >
          {/* Sliding active indicator - only shown when expanded and animatedIndicator is enabled */}
          {animatedIndicator && indicatorStyle && !collapsed && (
            <motion.div
              className="absolute bg-surface-active rounded-lg pointer-events-none"
              initial={false}
              animate={{
                top: indicatorStyle.top,
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: indicatorStyle.height
              }}
              transition={shouldAnimateIndicator ? {
                type: 'spring',
                stiffness: 500,
                damping: 35,
                mass: 1
              } : {
                duration: 0
              }}
              data-slot="active-indicator"
            />
          )}

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
                  animatedIndicator={animatedIndicator}
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
                animatedIndicator={animatedIndicator}
              />
          )
        })}
        </div>
      </NavItemRegistryContext.Provider>

      {/* Help item at bottom - floats over transparent area */}
      {showHelpItem && (
        <div className="relative py-3" data-slot="help-section">
          <div className="h-px mb-3 bg-gradient-to-r from-transparent via-default/50 to-transparent" data-slot="separator" />
          <HelpItem collapsed={collapsed} onClick={onHelpClick} />
        </div>
      )}
    </motion.nav>
  )
}

AppSidebar.displayName = 'AppSidebar'

export default AppSidebar
export type { NavItem, ProductType }
