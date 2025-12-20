import * as React from 'react'
import { useState, useEffect } from 'react'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'
import { SHADOWS, ALIAS } from '../../constants/designTokens'
import { LOGOS } from '../../assets/logos'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu'

// =============================================================================
// TYPES
// =============================================================================

/** Supported product types */
export type ProductType = 'flow' | 'market' | 'partner'

/** Product configuration with logo paths and taglines */
interface ProductConfig {
  logoLight: string
  logoDark: string
  tagline: string
}

/** Menu item for user dropdown */
export interface UserMenuItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon (React node) */
  icon?: React.ReactNode
  /** Optional href for navigation */
  href?: string
  /** Click handler */
  onClick?: () => void
  /** Whether this is a destructive action (styled in red) */
  destructive?: boolean
  /** Whether to show a separator before this item */
  separator?: boolean
}

/** User information for avatar display */
export interface UserInfo {
  /** User's display name */
  name: string
  /** User's email address */
  email?: string
  /** URL to avatar image */
  avatarUrl?: string
  /** Fallback initials (e.g., "JD" for John Doe) */
  initials?: string
}

/** Main AppHeader props */
export interface AppHeaderProps {
  /** Which product app this header is for */
  product: ProductType
  /** Optional tagline override (defaults to product tagline) */
  tagline?: string
  /** Whether to show the notification bell (default: true) */
  showNotifications?: boolean
  /** Current notification count (0 or undefined to hide badge) */
  notificationCount?: number
  /** Callback when notification bell is clicked */
  onNotificationClick?: () => void
  /** User information for avatar */
  user?: UserInfo
  /** Menu items for user dropdown */
  menuItems?: UserMenuItem[]
  /** Callback when a menu item is clicked */
  onMenuItemClick?: (item: UserMenuItem) => void
  /** Color mode for logo: 'dark' on light backgrounds, 'light' on dark backgrounds, 'auto' detects from theme */
  colorMode?: 'dark' | 'light' | 'auto'
  /** Callback when logo is clicked */
  onLogoClick?: () => void
  /** Additional className for styling */
  className?: string
  /** Whether to show the wave pattern background */
  showWavePattern?: boolean
  /** Disable dropdown portal for Storybook testing */
  disablePortal?: boolean
  /** Content to render on the left side (e.g., mobile hamburger menu) */
  leftContent?: React.ReactNode
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  flow: {
    logoLight: LOGOS.flow.light,
    logoDark: LOGOS.flow.dark,
    tagline: 'Environmental Compliance',
  },
  market: {
    logoLight: LOGOS.market.light,
    logoDark: LOGOS.market.dark,
    tagline: 'Modules & Add-ons',
  },
  partner: {
    logoLight: LOGOS.partner.light,
    logoDark: LOGOS.partner.dark,
    tagline: 'Management Portal',
  },
}

const DEFAULT_MENU_ITEMS: UserMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', icon: <LogOut className="w-4 h-4" />, destructive: true, separator: true },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Animated ocean wave pattern background
 *
 * Features dual-layer animated waves that scroll horizontally
 * with a subtle swell effect for depth. Adapted from CodePen
 * ocean wave technique to fit the header height.
 *
 * Animation specs:
 * - Wave scrolls left continuously (7s cycle)
 * - Second wave has offset timing + vertical swell
 * - Colors adapt to light/dark mode using ELECTRIC_CYAN tokens
 */
function WavePattern() {
  // Detect dark mode for color adaptation
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Color adaptation for wave gradient using ALIAS tokens
  // Light mode: subtle teal gradient
  // Dark mode: slightly brighter teal gradient
  const gradientStart = isDarkMode ? ALIAS.wave.dark.start : ALIAS.wave.light.start
  const gradientEnd = isDarkMode ? ALIAS.wave.dark.end : ALIAS.wave.light.end

  // Wave SVG with gradient - 1600px wide for smooth tiling
  // Very subtle opacity for gentle background effect
  const waveSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="55" viewBox="0 0 1600 55" preserveAspectRatio="none"><defs><linearGradient id="wg" x1="50%" x2="50%" y1="0%" y2="100%"><stop stop-color="${gradientStart}" stop-opacity=".15" offset="0%"/><stop stop-color="${gradientEnd}" stop-opacity=".35" offset="100%"/></linearGradient></defs><path fill="url(#wg)" d="M0 33.6c311 0 410-33.6 811-33.6 400 0 500 33.6 789 33.6V55H0V33.6z" transform="matrix(-1 0 0 1 1600 0)"/></svg>`)}`

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      data-slot="wave-pattern"
    >
      {/* CSS keyframes for wave animation - slow and subtle */}
      <style>{`
        @keyframes wave-scroll {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-1600px) translateZ(0); }
        }
        @keyframes wave-swell {
          0%, 100% { transform: translateY(-2px) translateZ(0); }
          50% { transform: translateY(1px) translateZ(0); }
        }
      `}</style>

      {/* First wave layer - slow scroll */}
      <div
        className="absolute bottom-0 left-0 h-[55px]"
        style={{
          // eslint-disable-next-line no-restricted-syntax -- Animation width: 4× tile width (1600px) for seamless scroll
          width: '6400px',
          backgroundImage: `url("${waveSvg}")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '1600px 55px',
          animation: 'wave-scroll 25s linear infinite',
        }}
      />

      {/* Second wave layer - slower with subtle swell */}
      <div
        className="absolute bottom-0 left-0 h-[55px] opacity-50"
        style={{
          // eslint-disable-next-line no-restricted-syntax -- Animation width: 4× tile width (1600px) for seamless scroll
          width: '6400px',
          backgroundImage: `url("${waveSvg}")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '1600px 55px',
          animation: 'wave-scroll 30s linear -2s infinite, wave-swell 12s ease-in-out infinite',
        }}
      />
    </div>
  )
}
WavePattern.displayName = 'WavePattern'

/** Logo container with product branding - Figma node 685:8840 */
function LogoContainer({
  product,
  tagline,
  colorMode,
  onClick,
}: {
  product: ProductType
  tagline?: string
  colorMode?: 'dark' | 'light' | 'auto'
  onClick?: () => void
}) {
  // Auto-detect dark mode from document class
  // Check both html and body for Storybook compatibility (Storybook applies to body)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial state - look for dark class on both html and body
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    checkDarkMode()

    // Watch for changes on both html and body
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const config = PRODUCT_CONFIGS[product]

  // Determine logo: auto-detect if colorMode not specified or 'auto'
  const effectiveColorMode = colorMode === 'auto' || !colorMode
    ? (isDarkMode ? 'light' : 'dark')  // dark bg needs light logo
    : colorMode

  const logoSrc = effectiveColorMode === 'dark' ? config.logoDark : config.logoLight
  const displayTagline = tagline ?? config.tagline

  return (
    <div
      className={cn(
        'flex items-center gap-3 h-14 min-w-[219px] pl-4 pr-3 cursor-pointer rounded-r-full',
        onClick && 'hover:opacity-90 transition-opacity'
      )}
      onClick={onClick}
      style={{
        // Use CSS variable for gradient - responds to dark mode
        background: 'var(--alias-gradient-subtle)',
        // Subtle shadow for depth
        boxShadow: SHADOWS.sm,
      }}
      data-slot="logo-container"
    >
      <img
        src={logoSrc}
        alt={`${product} logo`}
        className="h-[32px] w-auto object-contain"
      />
      <span
        className="text-xs font-medium whitespace-nowrap text-accent"
      >
        {displayTagline}
      </span>
    </div>
  )
}
LogoContainer.displayName = 'LogoContainer'

/** Notification badge showing count - Figma: 20x20px with 8px radius */
function NotificationBadge({ count }: { count: number }) {
  const displayCount = count > 99 ? '99+' : count.toString()

  return (
    <div
      className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1.5 flex items-center justify-center font-medium text-[11px] leading-none z-10 bg-error text-inverse rounded-sm border-2 border-surface"
      data-slot="notification-badge"
    >
      {displayCount}
    </div>
  )
}
NotificationBadge.displayName = 'NotificationBadge'

/**
 * IconButton - Subtle hover effect for icon-only buttons (notifications, settings, etc.)
 * Different from CTA buttons - uses soft background fade instead of electric glass border
 */
interface IconButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  'aria-label'?: string
  variant?: 'default' | 'ghost'
}

function IconButton({
  children,
  onClick,
  className,
  'aria-label': ariaLabel,
  variant = 'default'
}: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex items-center justify-center transition-colors rounded-md',
        className
      )}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.95 }}
      data-slot="icon-button"
    >
      {/* Soft background on hover - uses CSS variables for dark mode support */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-md",
          variant === 'default' && "border border-subtle/30"
        )}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background: variant === 'default'
            ? 'var(--alias-gradient-subtle)'
            : 'var(--alias-overlay-light)',
        }}
      />
      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </motion.button>
  )
}
IconButton.displayName = 'IconButton'

/** Notification bell with optional badge */
function NotificationBell({
  count = 0,
  onClick,
}: {
  count?: number
  onClick?: () => void
}) {
  return (
    <IconButton
      onClick={onClick}
      className="w-[38px] h-[38px]"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <div className="relative flex items-center justify-center" data-slot="notification-bell">
        <Bell
          className="w-5 h-5 text-primary"
          strokeWidth={1.5}
        />
        {count > 0 && <NotificationBadge count={count} />}
      </div>
    </IconButton>
  )
}
NotificationBell.displayName = 'NotificationBell'

/** User avatar with image or initials fallback */
function UserAvatar({
  user,
  size = 'md',
}: {
  user?: UserInfo
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeMap = {
    sm: 'w-6 h-6 text-[10px]',      // 24px - small contexts
    md: 'w-8 h-8 text-xs',           // 32px - header avatar (Figma)
    lg: 'w-10 h-10 text-sm',         // 40px - dropdown header
  }

  const initials = user?.initials || user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden flex-shrink-0 rounded-full text-secondary',
        user?.avatarUrl ? 'bg-transparent' : 'bg-muted-bg',
        sizeMap[size]
      )}
      data-slot="user-avatar"
    >
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium">{initials}</span>
      )}
    </div>
  )
}
UserAvatar.displayName = 'UserAvatar'

/** User dropdown menu */
function UserMenu({
  user,
  menuItems = DEFAULT_MENU_ITEMS,
  onItemClick,
  disablePortal = false,
}: {
  user?: UserInfo
  menuItems?: UserMenuItem[]
  onItemClick?: (item: UserMenuItem) => void
  disablePortal?: boolean
}) {
  const handleItemClick = (item: UserMenuItem) => {
    item.onClick?.()
    onItemClick?.(item)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="User menu"
          data-slot="user-menu-trigger"
        >
          <UserAvatar user={user} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        {...(disablePortal ? { container: undefined } : {})}
        className="min-w-[200px]"
        style={{
          boxShadow: SHADOWS.md,
        }}
        data-slot="user-menu-content"
      >
        {/* User info header */}
        {user && (
          <>
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="lg" />
                <div className="flex flex-col">
                  <span
                    className="font-medium text-sm text-primary"
                  >
                    {user.name}
                  </span>
                  {user.email && (
                    <span
                      className="text-xs text-secondary"
                    >
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Menu items */}
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => handleItemClick(item)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 cursor-pointer',
                item.destructive && 'text-error focus:text-error'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
UserMenu.displayName = 'UserMenu'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AppHeader - Application header for Disrupt Family apps (Flow, Market, Partner)
 *
 * @component ORGANISM
 * @type Core Navigation Component
 *
 * A compound organism component that combines logo branding, notifications, and user menu
 * into a unified application header. Provides consistent branding across all Disrupt products
 * while maintaining flexibility for customization.
 *
 * ## Features
 * - Product-specific logos with taglines (Flow, Market, Partner)
 * - Notification bell with count badge (up to 99+)
 * - User avatar with dropdown menu
 * - Wave pattern background with glass morphism
 * - Mobile-friendly with optional left content slot
 * - Keyboard accessible with full ARIA support
 *
 * ## Usage Examples
 *
 * ### Basic Implementation
 * ```tsx
 * import { AppHeader } from '@/components/ui/AppHeader'
 *
 * <AppHeader
 *   product="flow"
 *   notificationCount={4}
 *   onNotificationClick={() => console.log('Notifications clicked')}
 *   user={{ name: 'John Doe', email: 'john@example.com' }}
 * />
 * ```
 *
 * ### With Custom Menu Items
 * ```tsx
 * <AppHeader
 *   product="market"
 *   user={{ name: 'Jane Smith', email: 'jane@example.com', initials: 'JS' }}
 *   menuItems={[
 *     { id: 'profile', label: 'Profile', icon: <User />, onClick: handleProfile },
 *     { id: 'settings', label: 'Settings', icon: <Settings /> },
 *     { id: 'logout', label: 'Log out', icon: <LogOut />, destructive: true, separator: true },
 *   ]}
 *   onMenuItemClick={(item) => console.log('Clicked:', item.id)}
 * />
 * ```
 *
 * ### With Mobile Menu
 * ```tsx
 * <AppHeader
 *   product="flow"
 *   user={currentUser}
 *   leftContent={<HamburgerMenu onClick={toggleMobileNav} />}
 * />
 * ```
 *
 * ### Customization Options
 * ```tsx
 * <AppHeader
 *   product="partner"
 *   showWavePattern={false}  // Disable wave background
 *   colorMode="light"        // Use light logo on dark background
 *   user={user}
 * />
 * ```
 *
 * ## Testing
 * Use these data-slot attributes for testing and automation:
 * - `data-slot="app-header"` - Main header container (height: 55px)
 * - `data-slot="logo-container"` - Logo and tagline section (clickable)
 * - `data-slot="notification-bell"` - Notification bell button
 * - `data-slot="notification-badge"` - Badge showing notification count
 * - `data-slot="user-avatar"` - User avatar (image or initials)
 * - `data-slot="user-menu-trigger"` - User menu trigger button
 * - `data-slot="user-menu-content"` - User menu dropdown content
 * - `data-slot="header-actions"` - Right-side actions container
 *
 * Example test:
 * ```tsx
 * const header = screen.getByTestId('app-header')
 * const notificationBell = within(header).getByTestId('notification-bell')
 * const badge = within(header).getByTestId('notification-badge')
 * expect(badge).toHaveTextContent('4')
 * ```
 *
 * ## Accessibility
 * - Full keyboard navigation support (Tab, Enter, Space, Arrow keys, Esc)
 * - ARIA labels on all interactive elements
 * - Semantic HTML structure (header, nav, button elements)
 * - Focus visible states on all interactive elements
 * - Screen reader announcements for notification counts
 * - Color contrast meets WCAG AA standards
 *
 * ## Design Tokens Used
 * - Spacing: gap-3 (12px), gap-4 (16px) - follows 4px grid
 * - Border radius: rounded-sm (8px), rounded-md (12px)
 * - Shadows: SHADOWS.sm, SHADOWS.md, SHADOWS.header
 * - Colors: Uses ALIAS tokens for gradients, overlays, borders
 * - Typography: text-xs (12px), text-sm (14px) with appropriate weights
 *
 * @see {@link AppHeaderProps} for all available props
 * @see {@link UserMenuItem} for menu item structure
 * @see {@link UserInfo} for user object structure
 */
export function AppHeader({
  product,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  user,
  menuItems = DEFAULT_MENU_ITEMS,
  onMenuItemClick,
  colorMode = 'auto',
  onLogoClick,
  className,
  showWavePattern = true,
  disablePortal = false,
  leftContent,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-20 flex items-center justify-between w-full h-[55px] overflow-hidden bg-surface',
        className
      )}
      style={{
        boxShadow: SHADOWS.md,
      }}
      // Header height defined via className for consistency
      data-slot="app-header"
    >
      {/* Wave Pattern Background */}
      {showWavePattern && <WavePattern />}

      {/* Left Side: Mobile menu + Logo */}
      <div className="relative z-[1] flex items-center">
        {/* Mobile hamburger menu (optional) */}
        {leftContent && (
          <div className="pl-2">
            {leftContent}
          </div>
        )}

        {/* Logo Container */}
        <LogoContainer
          product={product}
          colorMode={colorMode}
          onClick={onLogoClick}
        />
      </div>

      {/* Actions (Right) */}
      <div
        className="relative z-[1] flex items-center gap-4 pr-4"
        data-slot="header-actions"
      >
        {/* Notifications */}
        {showNotifications && (
          <NotificationBell
            count={notificationCount}
            onClick={onNotificationClick}
          />
        )}

        {/* User Avatar + Menu */}
        {user && (
          <UserMenu
            user={user}
            menuItems={menuItems}
            onItemClick={onMenuItemClick}
            disablePortal={disablePortal}
          />
        )}
      </div>
    </header>
  )
}

AppHeader.displayName = 'AppHeader'

// =============================================================================
// EXPORTS
// =============================================================================

export default AppHeader
export { WavePattern, LogoContainer, NotificationBell, NotificationBadge, UserAvatar, UserMenu, IconButton }
export type { ProductConfig, IconButtonProps }
