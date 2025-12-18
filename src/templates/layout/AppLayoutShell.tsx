import * as React from 'react'
import { useState, useCallback, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { AppHeader, UserInfo, UserMenuItem } from '../../components/ui/AppHeader'
import { AppSidebar } from '../../components/ui/AppSidebar'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { MobileNav } from '../../components/ui/MobileNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { NavItem, ProductType } from '../../components/ui/navigation'
import { SearchFilter, FilterGroup, FilterState } from '../../components/shared/SearchFilter'

// =============================================================================
// TYPES
// =============================================================================

/** Navigation item with optional page component */
export interface AppNavItem extends NavItem {
  /** The component to render for this page */
  component?: ReactNode
  /** Children nav items */
  children?: AppNavItem[]
}

/** Configuration for a product app */
export interface ProductConfig {
  /** Product identifier */
  product: ProductType
  /** Navigation items */
  navItems: AppNavItem[]
  /** Initial active page ID */
  initialPage?: string
  /** User information */
  user?: UserInfo
  /** Custom user menu items */
  userMenuItems?: UserMenuItem[]
  /** Notification count */
  notificationCount?: number
  /** Custom tagline for header */
  tagline?: string
  /** Show help item in navigation */
  showHelpItem?: boolean
  /** Maximum visible items in mobile bottom nav */
  maxBottomNavItems?: number
  /** Use MobileNav drawer instead of BottomNav */
  useMobileDrawer?: boolean
}

/** Props for AppLayoutShell */
export interface AppLayoutShellProps extends ProductConfig {
  /** Custom className for the container */
  className?: string
  /** Callback when a nav item is clicked */
  onNavigate?: (item: AppNavItem) => void
  /** Callback when notification bell is clicked */
  onNotificationClick?: () => void
  /** Callback when a user menu item is clicked */
  onMenuItemClick?: (item: UserMenuItem) => void
  /** Callback when help is clicked */
  onHelpClick?: () => void
  /** Callback when logo is clicked */
  onLogoClick?: () => void
  /** Override the current page ID (controlled mode) */
  currentPageId?: string
  /** Callback when page changes (controlled mode) */
  onPageChange?: (pageId: string) => void
  /** Custom content to render instead of page components */
  children?: ReactNode
  /** Show the grid blob background (default: true) */
  showBackground?: boolean
  /** Show the footer (default: true) */
  showFooter?: boolean
  /** Scale for the grid blob background */
  backgroundScale?: number
  /** Show the search bar (default: false) */
  showSearch?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Current search value */
  searchValue?: string
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void
  /** Callback when search is submitted (debounced) */
  onSearch?: (value: string) => void
  /** Filter groups for the search */
  searchFilterGroups?: FilterGroup[]
  /** Current filter state */
  searchFilters?: FilterState
  /** Callback when filters change */
  onSearchFiltersChange?: (filters: FilterState) => void
  /** Show loading state for search */
  isSearching?: boolean
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Find a nav item by ID in a nested structure */
function findNavItemById(items: AppNavItem[], id: string): AppNavItem | undefined {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findNavItemById(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

/** Get all page IDs from nav items */
function _getAllPageIds(items: AppNavItem[]): string[] {
  const ids: string[] = []
  for (const item of items) {
    ids.push(item.id)
    if (item.children) {
      ids.push(..._getAllPageIds(item.children))
    }
  }
  return ids
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AppLayoutShell - Shared layout shell for all DDS product apps
 *
 * Provides a consistent layout structure with:
 * - AppHeader with product branding
 * - AppSidebar for desktop navigation
 * - BottomNav or MobileNav for mobile navigation
 * - AppFooter
 * - GridBlobBackground
 *
 * Can be used in two modes:
 * 1. **Automatic mode**: Pass `navItems` with `component` props for each page
 * 2. **Controlled mode**: Pass `currentPageId`, `onPageChange`, and `children`
 *
 * @example Automatic mode
 * ```tsx
 * <AppLayoutShell
 *   product="partner"
 *   navItems={[
 *     { id: 'dashboard', label: 'Dashboard', icon: <Home />, component: <DashboardPage /> },
 *     { id: 'leads', label: 'Leads', icon: <Users />, component: <LeadsPage />, badge: 5 },
 *   ]}
 *   user={{ name: 'John Doe', email: 'john@example.com' }}
 * />
 * ```
 *
 * @example Controlled mode
 * ```tsx
 * <AppLayoutShell
 *   product="flow"
 *   navItems={navItems}
 *   currentPageId={currentPage}
 *   onPageChange={setCurrentPage}
 * >
 *   {renderContent()}
 * </AppLayoutShell>
 * ```
 */
export function AppLayoutShell({
  product,
  navItems,
  initialPage,
  user,
  userMenuItems,
  notificationCount = 0,
  tagline,
  showHelpItem = true,
  maxBottomNavItems = 4,
  useMobileDrawer = false,
  className,
  onNavigate,
  onNotificationClick,
  onMenuItemClick,
  onHelpClick,
  onLogoClick,
  currentPageId: controlledPageId,
  onPageChange,
  children,
  showBackground = true,
  showFooter = true,
  backgroundScale = 1,
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  onSearch,
  searchFilterGroups = [],
  searchFilters = {},
  onSearchFiltersChange,
  isSearching = false,
}: AppLayoutShellProps) {
  // Determine if we're in controlled mode
  const isControlled = controlledPageId !== undefined

  // Internal state for uncontrolled mode
  const [internalPageId, setInternalPageId] = useState(
    initialPage || navItems[0]?.id || 'dashboard'
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [_mobileNavOpen, _setMobileNavOpen] = useState(false)

  // Current page ID (controlled or internal)
  const currentPage = isControlled ? controlledPageId : internalPageId

  // Handle navigation
  const handleNavigate = useCallback(
    (item: NavItem) => {
      const appNavItem = findNavItemById(navItems, item.id)

      if (isControlled) {
        onPageChange?.(item.id)
      } else {
        setInternalPageId(item.id)
      }

      onNavigate?.(appNavItem || (item as AppNavItem))
      _setMobileNavOpen(false)
    },
    [isControlled, navItems, onNavigate, onPageChange]
  )

  // Handle bottom nav navigation (same interface)
  const handleBottomNavigate = useCallback(
    (item: NavItem) => {
      handleNavigate(item)
    },
    [handleNavigate]
  )

  // Get current page component (for automatic mode)
  const currentNavItem = findNavItemById(navItems, currentPage)
  const pageContent = children || currentNavItem?.component || null

  // Convert AppNavItems to NavItems for BottomNav (same structure)
  const bottomNavItems: NavItem[] = navItems.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    href: item.href,
    badge: item.badge,
    children: item.children?.map((child) => ({
      id: child.id,
      label: child.label,
      icon: child.icon,
      href: child.href,
      badge: child.badge,
    })),
  }))

  // Mobile hamburger trigger for MobileNav
  const mobileNavTrigger = useMobileDrawer ? (
    <MobileNav
      product={product}
      items={navItems}
      activeItemId={currentPage}
      onNavigate={handleNavigate}
      productTitle={tagline}
    />
  ) : null

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen bg-background overflow-hidden',
        className
      )}
      data-product={product}
      data-page={currentPage}
    >
      {/* Grid blob background */}
      {showBackground && <GridBlobBackground scale={backgroundScale} />}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Header */}
        <AppHeader
          product={product}
          showNotifications={true}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
          user={user}
          menuItems={userMenuItems}
          onMenuItemClick={onMenuItemClick}
          tagline={tagline}
          onLogoClick={onLogoClick}
          leftContent={mobileNavTrigger}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar
              product={product}
              items={navItems}
              activeItemId={currentPage}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={showHelpItem}
              onHelpClick={onHelpClick}
            />
          </div>

          {/* Page Content - includes mobile footer at bottom of scroll */}
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col min-h-full">
              {/* Search Bar inside page content */}
              {showSearch && (
                <div className="border-b border-default bg-surface px-4 py-3 sticky top-0 z-20">
                  <div className="max-w-7xl mx-auto">
                    <SearchFilter
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={onSearchChange}
                      onDebouncedChange={onSearch}
                      filterGroups={searchFilterGroups}
                      filters={searchFilters}
                      onFiltersChange={onSearchFiltersChange}
                      isSearching={isSearching}
                      hideFilters={searchFilterGroups.length === 0}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">{pageContent}</div>
              {/* Mobile footer - appears at bottom of scrollable content, above BottomNav */}
              {showFooter && !useMobileDrawer && (
                <div className="md:hidden pb-16">
                  <AppFooter compactOnMobile />
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Desktop Footer - fixed at bottom */}
        {showFooter && (
          <div className="hidden md:block">
            <AppFooter compactOnMobile={false} />
          </div>
        )}

        {/* Mobile Bottom Navigation (unless using MobileNav drawer) */}
        {!useMobileDrawer && (
          <BottomNav
            items={bottomNavItems}
            activeItemId={currentPage}
            onNavigate={handleBottomNavigate}
            maxVisibleItems={maxBottomNavItems}
            showHelpItem={showHelpItem}
            onHelpClick={onHelpClick}
          />
        )}
      </div>
    </div>
  )
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook to manage app layout state
 * Useful when using AppLayoutShell in controlled mode
 */
export function useAppLayoutState(initialPage: string = 'dashboard') {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigate = useCallback((pageId: string) => {
    setCurrentPage(pageId)
  }, [])

  return {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    navigate,
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default AppLayoutShell
export type { NavItem, UserInfo, UserMenuItem, ProductType, FilterGroup, FilterState }
