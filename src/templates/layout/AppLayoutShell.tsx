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
  /** Show help item in navigation */
  showHelpItem?: boolean
  /** Maximum visible items in mobile bottom nav */
  maxBottomNavItems?: number
  /** Use MobileNav drawer instead of BottomNav */
  useMobileDrawer?: boolean
}

/** Props for AppLayoutShell */
export interface AppLayoutShellProps extends ProductConfig {
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
  /**
   * Custom mobile navigation component (replaces default BottomNav)
   * Use this for Flow app with FlowMobileNav that has the incident reporting button
   * @example
   * customMobileNav={
   *   <FlowMobileNav
   *     activeItem="incidents"
   *     onNavigate={(item) => setCurrentPage(item)}
   *     onQuickAction={() => openIncidentForm()}
   *   />
   * }
   */
  customMobileNav?: ReactNode
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
  showHelpItem = true,
  maxBottomNavItems = 4,
  useMobileDrawer = false,
  onNavigate,
  onNotificationClick,
  onMenuItemClick,
  onHelpClick,
  onLogoClick,
  currentPageId: controlledPageId,
  onPageChange,
  children,
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  onSearch,
  searchFilterGroups = [],
  searchFilters = {},
  onSearchFiltersChange,
  isSearching = false,
  customMobileNav,
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
    />
  ) : null

  return (
    <div
      className="relative flex flex-col h-screen overflow-hidden"
      data-product={product}
      data-page={currentPage}
    >
      {/* Grid blob background - always shown, DDS owns styling */}
      <GridBlobBackground />

      {/* App Header - fixed at z-30, OUTSIDE content layer for glassmorphism to work
          iOS 26: pt-safe adds padding for status bar safe area */}
      <div className="fixed top-0 left-0 right-0 z-30 pt-safe">
        <AppHeader
          product={product}
          showNotifications={true}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
          user={user}
          menuItems={userMenuItems}
          onMenuItemClick={onMenuItemClick}
          onLogoClick={onLogoClick}
          leftContent={mobileNavTrigger}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Desktop Footer - fixed at z-30, always shown on desktop, DDS owns styling
          iOS 26: pb-safe adds padding for home indicator safe area (iPad) */}
      <div className="hidden md:fixed md:bottom-0 md:left-0 md:right-0 md:z-30 md:block md:pb-safe">
        <AppFooter compactOnMobile={false} />
      </div>

      {/* Content layer - z-10 so header's backdrop-filter can blur this */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile, pt-[55px] for header, pb-[48px] for footer clearance */}
          <div className="hidden md:block pt-[55px] pb-[48px]">
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

          {/* Page Content - pt-[55px] for header, pb for fixed elements (nav/footer) */}
          {/* Mobile: pb-[80px] for FlowMobileNav (~70px + safe area), Desktop: pb-[48px] for footer */}
          {/* Transparent to show grid blob background - individual sections add their own bg as needed */}
          <main className="flex-1 overflow-auto">
            <div className={cn(
              "flex flex-col h-full pt-[55px]",
              // Mobile bottom padding when using custom mobile nav (FlowMobileNav is ~70px + safe area)
              customMobileNav && "pb-[88px] md:pb-[48px]",
              // Default desktop footer padding
              !customMobileNav && "md:pb-[48px]"
            )}>
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
              {/*
                Mobile footer REMOVED per UX best practices:
                - Bottom nav should be THE bottom element (Fitts' Law - thumb zone)
                - Branding/copyright wastes valuable mobile real estate
                - Move "Made with ❤️" to Settings > About screen instead
                See: https://blog.appmysite.com/bottom-navigation-bar-in-mobile-apps-heres-all-you-need-to-know/
              */}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation (unless using MobileNav drawer) */}
        {!useMobileDrawer && (
          customMobileNav ? (
            // Custom mobile nav (e.g., FlowMobileNav with incident reporting button)
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
              {customMobileNav}
            </div>
          ) : (
            // Default BottomNav
            <BottomNav
              items={bottomNavItems}
              activeItemId={currentPage}
              onNavigate={handleBottomNavigate}
              maxVisibleItems={maxBottomNavItems}
              showHelpItem={showHelpItem}
              onHelpClick={onHelpClick}
            />
          )
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
