import * as React from 'react'
import { useState } from 'react'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'
import { ALIAS, SHADOWS } from '../../constants/designTokens'
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
  /** Custom tagline override (uses default per product if not provided) */
  tagline?: string
  /** Color mode for logo: 'dark' on light backgrounds, 'light' on dark backgrounds */
  colorMode?: 'dark' | 'light'
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
    logoLight: '/logos/flow-logo-full-light.svg',
    logoDark: '/logos/flow-logo-full-dark.svg',
    tagline: 'Smart EHS Automation',
  },
  market: {
    logoLight: '/logos/market-logo-full-ligh.svg', // Note: typo in actual filename
    logoDark: '/logos/market-logo-full-dark.svg',
    tagline: 'EHS Marketplace',
  },
  partner: {
    logoLight: '/logos/partner-logo-full-light.svg',
    logoDark: '/logos/partner-logo-full-dark.svg',
    tagline: '',
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

/** Wave pattern SVG background - matches Figma node 639:8397 */
function WavePattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Wave pattern layer - repeat horizontally, fit to header height */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/patterns/wave-pattern.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%', // Height fits header (55px), width scales proportionally
          backgroundPosition: 'left center',
        }}
      />
      {/* White overlay at 60% opacity - as per Figma rgba(255, 255, 255, 0.6) */}
      <div
        className="absolute inset-0 bg-white/60"
      />
    </div>
  )
}

/** Logo container with product branding - Figma node 685:8840 */
function LogoContainer({
  product,
  tagline,
  colorMode = 'dark',
  onClick,
}: {
  product: ProductType
  tagline?: string
  colorMode?: 'dark' | 'light'
  onClick?: () => void
}) {
  const config = PRODUCT_CONFIGS[product]
  const logoSrc = colorMode === 'dark' ? config.logoDark : config.logoLight
  const displayTagline = tagline ?? config.tagline

  return (
    <div
      className={cn(
        'flex items-center gap-3 h-14 min-w-[219px] pl-4 pr-3 cursor-pointer rounded-r-[32.5px]',
        onClick && 'hover:opacity-90 transition-opacity'
      )}
      onClick={onClick}
      style={{
        // Match search filter gradient for consistency
        background: ALIAS.gradient.subtle,
        border: `1px solid ${ALIAS.overlay.subtle}`,
        borderLeft: 'none',
        // Subtle shadow for depth
        boxShadow: SHADOWS.sm,
      }}
    >
      <img
        src={logoSrc}
        alt={`${product} logo`}
        className="h-[32px] w-auto object-contain"
        style={{
          // Add subtle drop shadow to logo
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        }}
      />
      <span
        className="text-xs font-medium whitespace-nowrap text-primary"
      >
        {displayTagline}
      </span>
    </div>
  )
}

/** Notification badge showing count - Figma: 20x20px with 8px radius */
function NotificationBadge({ count }: { count: number }) {
  const displayCount = count > 99 ? '99+' : count.toString()

  return (
    <div
      className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1.5 flex items-center justify-center font-medium text-[11px] leading-none z-10 bg-error text-inverse rounded-sm border-2 border-surface"
    >
      {displayCount}
    </div>
  )
}

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
    >
      {/* Soft background on hover */}
      <motion.div
        className="absolute inset-0 rounded-md"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background: variant === 'default'
            ? `linear-gradient(135deg, ${ALIAS.background.accent} 0%, ${ALIAS.overlay.white50} 100%)`
            : ALIAS.overlay.white50,
          border: variant === 'default' ? `1px solid ${ALIAS.border.subtle}` : 'none',
        }}
      />
      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </motion.button>
  )
}

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
      <div className="relative flex items-center justify-center">
        <Bell
          className="w-5 h-5 text-primary"
          strokeWidth={1.5}
        />
        {count > 0 && <NotificationBadge count={count} />}
      </div>
    </IconButton>
  )
}

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
        user?.avatarUrl ? 'bg-transparent' : 'bg-mutedBg',
        sizeMap[size]
      )}
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AppHeader - Application header for Disrupt Family apps (Flow, Market, Partner)
 *
 * Features:
 * - Product-specific logos with taglines
 * - Notification bell with count badge
 * - User avatar with dropdown menu
 * - Wave pattern background with glass morphism
 *
 * @example
 * ```tsx
 * <AppHeader
 *   product="flow"
 *   notificationCount={4}
 *   onNotificationClick={() => console.log('Notifications clicked')}
 *   user={{ name: 'John Doe', email: 'john@example.com', initials: 'JD' }}
 *   menuItems={[
 *     { id: 'profile', label: 'Profile', icon: <User /> },
 *     { id: 'logout', label: 'Log out', destructive: true },
 *   ]}
 * />
 * ```
 */
export function AppHeader({
  product,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  user,
  menuItems = DEFAULT_MENU_ITEMS,
  onMenuItemClick,
  tagline,
  colorMode = 'dark',
  onLogoClick,
  className,
  showWavePattern = true,
  disablePortal = false,
  leftContent,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-20 flex items-center justify-between w-full h-[55px]',
        className
      )}
      style={{
        boxShadow: SHADOWS.header,
      }}
      // Header height defined via className for consistency
      data-element="app-header"
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
          tagline={tagline}
          colorMode={colorMode}
          onClick={onLogoClick}
        />
      </div>

      {/* Actions (Right) */}
      <div
        className="relative z-[1] flex items-center gap-4 pr-4"
        data-element="header-actions"
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

// =============================================================================
// EXPORTS
// =============================================================================

export default AppHeader
export { WavePattern, LogoContainer, NotificationBell, NotificationBadge, UserAvatar, UserMenu, IconButton }
export type { ProductConfig, IconButtonProps }
