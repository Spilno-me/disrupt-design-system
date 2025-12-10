/**
 * NavIcon - Shared icon wrapper for navigation items.
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'
import { NavBadge } from './NavBadge'

export type IconSize = 'sm' | 'md'

export interface NavIconProps {
  /** Icon component (Lucide or any React node) */
  icon: React.ReactNode
  /** Whether the item is active */
  isActive?: boolean
  /** Badge value */
  badge?: number | boolean
  /** Size variant */
  size?: IconSize
  /** Show active background (for collapsed sidebar) */
  showActiveBackground?: boolean
}

const SIZE_CONFIG = {
  sm: {
    container: 'w-7 h-7',
    icon: 'w-5 h-5',
    strokeWidth: 1.5,
  },
  md: {
    container: 'w-8 h-8',
    icon: 'w-6 h-6',
    strokeWidth: 1.5,
  },
} as const

export function NavIcon({
  icon,
  isActive = false,
  badge,
  size = 'md',
  showActiveBackground = false,
}: NavIconProps) {
  const config = SIZE_CONFIG[size]

  return (
    <div
      className={cn(
        'relative flex items-center justify-center flex-shrink-0 transition-all duration-150',
        config.container,
        showActiveBackground && isActive && 'bg-surface rounded-md shadow-sm',
        'text-primary'
      )}
    >
      {React.isValidElement(icon) &&
        React.cloneElement(
          icon as React.ReactElement<{
            className?: string
            strokeWidth?: number
          }>,
          {
            className: cn(
              config.icon,
              'text-primary',
              (icon.props as { className?: string }).className
            ),
            strokeWidth: config.strokeWidth,
          }
        )}
      {badge !== undefined && <NavBadge badge={badge} size={size === 'sm' ? 'sm' : 'md'} />}
    </div>
  )
}
