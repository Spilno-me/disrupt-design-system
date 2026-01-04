import * as React from 'react'
import { useState, useEffect } from 'react'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'
// eslint-disable-next-line no-restricted-syntax -- DEEP_CURRENT needed for wave SVG color
import { SHADOWS, DEEP_CURRENT } from '../../constants/designTokens'
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
// CONSTANTS
// =============================================================================

/** Header height in pixels - matches Figma spec */
const HEADER_HEIGHT_PX = 55

/** Icon size for menu item icons */
const MENU_ICON_SIZE = 'w-4 h-4'

/** Icon button dimensions */
const ICON_BUTTON_SIZE = 'w-[38px] h-[38px]'

/** Notification bell icon dimensions */
const BELL_ICON_SIZE = 'w-5 h-5'

/** Maximum notification count before showing "99+" */
const MAX_NOTIFICATION_DISPLAY = 99

/** Wave animation tile width for seamless scrolling */
const WAVE_TILE_WIDTH_PX = 1600

/** Wave animation total width (4× tile for seamless loop) */
const WAVE_ANIMATION_WIDTH_PX = 6400

/** Wave SVG height in pixels */
const WAVE_SVG_HEIGHT_PX = 55

/** Primary wave animation duration in seconds */
const WAVE_PRIMARY_DURATION_S = 35

/** Secondary wave animation duration in seconds */
const WAVE_SECONDARY_DURATION_S = 40

/** Secondary wave delay offset in seconds */
const WAVE_SECONDARY_DELAY_S = -5

/** Wave swell animation duration in seconds */
const WAVE_SWELL_DURATION_S = 8

/** Logo container minimum width - wider than sidebar expanded (255px) for visual balance */
const LOGO_CONTAINER_MIN_WIDTH = 'min-w-[280px]'

/** Logo image height */
const LOGO_HEIGHT = 'h-[32px]'

// =============================================================================
// TYPES
// =============================================================================

/** Supported product types */
export type ProductType = 'flow' | 'market' | 'partner'

/** Product configuration with logo paths */
interface ProductConfig {
  logoLight: string
  logoDark: string
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

/** Main AppHeader props - DDS owns all styling, no className allowed */
export interface AppHeaderProps {
  /** Which product app this header is for */
  product: ProductType
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
  /** Disable dropdown portal for Storybook testing */
  disablePortal?: boolean
  /** Content to render on the left side (e.g., mobile hamburger menu) */
  leftContent?: React.ReactNode
}

/** Product configurations with logo paths */
const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  flow: {
    logoLight: LOGOS.flow.light,
    logoDark: LOGOS.flow.dark,
  },
  market: {
    logoLight: LOGOS.market.light,
    logoDark: LOGOS.market.dark,
  },
  partner: {
    logoLight: LOGOS.partner.light,
    logoDark: LOGOS.partner.dark,
  },
}

/** Default menu items for user dropdown */
const DEFAULT_MENU_ITEMS: UserMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className={MENU_ICON_SIZE} /> },
  { id: 'settings', label: 'Settings', icon: <Settings className={MENU_ICON_SIZE} /> },
  { id: 'logout', label: 'Log out', icon: <LogOut className={MENU_ICON_SIZE} />, destructive: true, separator: true },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if dark mode is enabled by inspecting document classes.
 * Supports both html and body class detection for Storybook compatibility.
 * Returns false during SSR when document is not available.
 */
function checkDarkModeEnabled(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark') ||
         document.body.classList.contains('dark')
}

/**
 * Creates a MutationObserver to watch for dark mode class changes.
 * @param callback - Function to call when dark mode changes
 * @returns Cleanup function to disconnect observer
 */
function createDarkModeObserver(callback: () => void): () => void {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

/**
 * Generates SVG data URI for wave pattern with given color.
 * @param color - Hex color for wave stroke
 */
function generateWaveSvgDataUri(color: string): string {
  // Using literal values for consistency: 1600x55 px
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="55" viewBox="0 0 1600 55" preserveAspectRatio="none"><path fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" d="M0 10 c200 0 300 35 400 35 c100 0 200-35 400-35 c200 0 300 35 400 35 c100 0 200-35 400-35"/></svg>`
  )}`
}

/**
 * Formats notification count for display, capping at MAX_NOTIFICATION_DISPLAY.
 * @param count - Raw notification count
 */
function formatNotificationCount(count: number): string {
  return count > MAX_NOTIFICATION_DISPLAY ? `${MAX_NOTIFICATION_DISPLAY}+` : count.toString()
}

/**
 * Generates user initials from name or existing initials.
 * @param user - User info object
 */
function getUserInitials(user?: UserInfo): string {
  if (user?.initials) return user.initials
  if (user?.name) {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }
  return '?'
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Glass background layer for wave pattern.
 * @component ATOM
 */
function WaveGlassBackground({ isDarkMode }: { isDarkMode: boolean }) {
  /* eslint-disable no-restricted-syntax -- Glassmorphism requires specific rgba opacity for glass effect */
  const glassBackground = isDarkMode
    ? 'linear-gradient(180deg, rgba(29, 31, 42, 0.7) 0%, rgba(20, 22, 30, 0.85) 100%)'
    : 'rgba(255, 255, 255, 0.15)'
  /* eslint-enable no-restricted-syntax */

  return (
    <div
      className="absolute inset-0 z-0"
      data-slot="wave-glass"
      style={{
        background: glassBackground,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    />
  )
}
WaveGlassBackground.displayName = 'WaveGlassBackground'

/**
 * Single animated wave layer.
 * @component ATOM
 */
function WaveLayer({
  waveSvg,
  opacity,
  animation,
}: {
  waveSvg: string
  opacity: string
  animation: string
}) {
  return (
    <div
      className={cn('absolute top-0 left-0 h-[55px]', opacity)}
      data-slot="wave-layer"
      style={{
        width: '6400px',
        backgroundImage: `url("${waveSvg}")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '1600px 55px',
        animation,
      }}
    />
  )
}
WaveLayer.displayName = 'WaveLayer'

/**
 * CSS keyframes for wave animations.
 * @component ATOM
 */
function WaveKeyframes() {
  return (
    <style>{`
      @keyframes header-wave-scroll {
        0% { transform: translateX(0) translateZ(0); }
        100% { transform: translateX(-1600px) translateZ(0); }
      }
      @keyframes header-wave-swell {
        0%, 100% { transform: translateY(3px) translateZ(0); }
        50% { transform: translateY(-3px) translateZ(0); }
      }
    `}</style>
  )
}
WaveKeyframes.displayName = 'WaveKeyframes'

/**
 * Animated ocean wave pattern background.
 *
 * Features dual-layer animated waves with glassmorphism backdrop.
 * Colors adapt to light/dark mode using DEEP_CURRENT tokens.
 *
 * @component ATOM
 */
function WavePattern() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateDarkMode = () => setIsDarkMode(checkDarkModeEnabled())
    updateDarkMode()
    return createDarkModeObserver(updateDarkMode)
  }, [])

  const waveSvg = generateWaveSvgDataUri(DEEP_CURRENT[400])
  const primaryAnimation = `header-wave-scroll ${WAVE_PRIMARY_DURATION_S}s linear infinite`
  const secondaryAnimation = `header-wave-scroll ${WAVE_SECONDARY_DURATION_S}s linear ${WAVE_SECONDARY_DELAY_S}s infinite, header-wave-swell ${WAVE_SWELL_DURATION_S}s ease-in-out infinite`

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" data-slot="wave-pattern">
      <WaveKeyframes />
      <WaveGlassBackground isDarkMode={isDarkMode} />
      <div className="absolute inset-0 z-10">
        <WaveLayer waveSvg={waveSvg} opacity="opacity-50" animation={primaryAnimation} />
        <WaveLayer waveSvg={waveSvg} opacity="opacity-40" animation={secondaryAnimation} />
      </div>
    </div>
  )
}
WavePattern.displayName = 'WavePattern'


/**
 * Logo container with product branding.
 *
 * Displays product logo with solid surface background.
 * Auto-detects dark mode for appropriate logo variant.
 * Uses bg-surface to match sidebar - DDS owns styling.
 * Width (280px) extends beyond sidebar expanded width (255px) for visual balance.
 *
 * @component ATOM
 * @figma 685:8840
 */
function LogoContainer({
  product,
  colorMode,
  onClick,
}: {
  product: ProductType
  colorMode?: 'dark' | 'light' | 'auto'
  onClick?: () => void
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateDarkMode = () => setIsDarkMode(checkDarkModeEnabled())
    updateDarkMode()
    return createDarkModeObserver(updateDarkMode)
  }, [])

  const config = PRODUCT_CONFIGS[product]
  const effectiveColorMode = colorMode === 'auto' || !colorMode
    ? (isDarkMode ? 'light' : 'dark')
    : colorMode
  const logoSrc = effectiveColorMode === 'dark' ? config.logoDark : config.logoLight

  return (
    <div
      className={cn(
        'flex items-center h-14 pl-4 pr-3 cursor-pointer rounded-r-full',
        LOGO_CONTAINER_MIN_WIDTH,
        // bg-elevated per depth-layering-rules: header floats above sidebar, so lighter (Closer = Lighter)
        'bg-elevated shadow-sm',
        onClick && 'hover:opacity-90 transition-opacity'
      )}
      onClick={onClick}
      data-slot="logo-container"
    >
      <img
        src={logoSrc}
        alt={`${product} logo`}
        className={cn(LOGO_HEIGHT, 'w-auto object-contain')}
      />
    </div>
  )
}
LogoContainer.displayName = 'LogoContainer'

/**
 * Notification badge showing count.
 *
 * Displays notification count with 99+ cap. Uses error color for visibility.
 *
 * @component ATOM
 * @figma 20x20px with 8px radius
 */
function NotificationBadge({ count }: { count: number }) {
  return (
    <div
      className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1.5 flex items-center justify-center font-medium text-[11px] leading-none z-10 bg-error text-inverse rounded-sm border-2 border-surface"
      data-slot="notification-badge"
    >
      {formatNotificationCount(count)}
    </div>
  )
}
NotificationBadge.displayName = 'NotificationBadge'

/**
 * Props for IconButton component.
 */
interface IconButtonProps {
  /** Button content (typically an icon) */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Additional CSS classes */
  className?: string
  /** Accessible label for screen readers */
  'aria-label'?: string
}

/**
 * IconButton - Subtle hover effect for icon-only buttons.
 *
 * Different from CTA buttons - uses soft background fade
 * instead of electric glass border effect.
 *
 * @component ATOM
 */
function IconButton({
  children,
  onClick,
  className,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center rounded-md',
        // Hover changes icon color via text-primary -> text-accent, no border/background
        'text-primary hover:text-accent transition-colors',
        className
      )}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.95 }}
      data-slot="icon-button"
    >
      {children}
    </motion.button>
  )
}
IconButton.displayName = 'IconButton'

/**
 * Notification bell with optional badge.
 *
 * Displays a bell icon with optional count badge. Uses IconButton
 * for hover effects and accessibility.
 *
 * @component MOLECULE
 */
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
      className={ICON_BUTTON_SIZE}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <div className="relative flex items-center justify-center" data-slot="notification-bell">
        {/* Icon inherits color from parent IconButton (text-primary -> hover:text-accent) */}
        <Bell className={BELL_ICON_SIZE} strokeWidth={1.5} />
        {count > 0 && <NotificationBadge count={count} />}
      </div>
    </IconButton>
  )
}
NotificationBell.displayName = 'NotificationBell'

/** Avatar size variants with corresponding dimensions */
const AVATAR_SIZE_MAP = {
  sm: 'w-6 h-6 text-[10px]',   // 24px - small contexts
  md: 'w-8 h-8 text-xs',       // 32px - header avatar (Figma)
  lg: 'w-10 h-10 text-sm',     // 40px - dropdown header
} as const

/**
 * User avatar with image or initials fallback.
 *
 * Displays user's avatar image or generates initials from name.
 * Supports three size variants for different contexts.
 *
 * @component ATOM
 */
function UserAvatar({
  user,
  size = 'md',
}: {
  user?: UserInfo
  size?: 'sm' | 'md' | 'lg'
}) {
  const initials = getUserInitials(user)

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden flex-shrink-0 rounded-full text-secondary',
        user?.avatarUrl ? 'bg-transparent' : 'bg-muted-bg',
        AVATAR_SIZE_MAP[size]
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

/** Minimum width for dropdown menu */
const USER_MENU_MIN_WIDTH = 'min-w-[200px]'

/** Dropdown menu side offset */
const DROPDOWN_SIDE_OFFSET = 8

/**
 * User dropdown menu.
 *
 * Displays user avatar as trigger with dropdown containing
 * user info header and customizable menu items.
 *
 * @component MOLECULE
 */
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
        sideOffset={DROPDOWN_SIDE_OFFSET}
        {...(disablePortal ? { container: undefined } : {})}
        className={cn(
          USER_MENU_MIN_WIDTH,
          // Glassmorphism matching header wave glass (12px blur, 60% opacity per depth-1 glass rules)
          'bg-white/60 dark:bg-abyss-800/70 backdrop-blur-[12px] border border-white/30 dark:border-white/10'
        )}
        style={{ boxShadow: SHADOWS.md }}
        data-slot="user-menu-content"
      >
        {user && (
          <>
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="lg" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-primary">{user.name}</span>
                  {user.email && (
                    <span className="text-xs text-secondary">{user.email}</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

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
 * - Product-specific logos (Flow, Market, Partner)
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
 *   colorMode="light"  // Use light logo on dark background
 *   user={user}
 * />
 * ```
 *
 * ## Testing
 * Use these data-slot attributes for testing and automation:
 * - `data-slot="app-header"` - Main header container (height: 55px)
 * - `data-slot="logo-container"` - Logo section (clickable)
 * - `data-slot="notification-bell"` - Notification bell button
 * - `data-slot="notification-badge"` - Badge showing notification count
 * - `data-slot="user-avatar"` - User avatar (image or initials)
 * - `data-slot="user-menu-trigger"` - User menu trigger button
 * - `data-slot="user-menu-content"` - User menu dropdown content
 * - `data-slot="header-actions"` - Right-side actions container
 * - `data-slot="header-border"` - Bottom gradient border
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
  disablePortal = false,
  leftContent,
}: AppHeaderProps) {
  return (
    <header
      className="relative z-20 flex items-center justify-between w-full h-[55px]"
      data-slot="app-header"
    >
      {/* Wave pattern always shown - DDS owns styling */}
      <WavePattern />

      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-default to-transparent z-20"
        data-slot="header-border"
      />

      <div className="relative z-20 flex items-center">
        {leftContent && <div className="pl-2">{leftContent}</div>}
        <LogoContainer
          product={product}
          colorMode={colorMode}
          onClick={onLogoClick}
        />
      </div>

      <div
        className="relative z-20 flex items-center gap-4 pr-4"
        data-slot="header-actions"
      >
        {showNotifications && (
          <NotificationBell
            count={notificationCount}
            onClick={onNotificationClick}
          />
        )}
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
