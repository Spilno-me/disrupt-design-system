/**
 * NavBadge - Shared badge component for navigation items.
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

export type BadgeSize = 'sm' | 'md'

export interface NavBadgeProps {
  /** Badge value - number for count, true for dot indicator */
  badge: number | boolean
  /** Size variant */
  size?: BadgeSize
  /** Position style - absolute (default) or inline */
  position?: 'absolute' | 'inline'
}

const SIZE_CONFIG = {
  sm: {
    dot: 'w-2 h-2',
    count: 'min-w-[16px] h-[16px] text-[9px] px-1',
    dotPosition: 'top-0 right-0',
    countPosition: '-top-1 -right-1',
  },
  md: {
    dot: 'w-2.5 h-2.5',
    count: 'min-w-[18px] h-[18px] text-[10px] px-1',
    dotPosition: '-top-0.5 -right-0.5',
    countPosition: '-top-1 -right-2',
  },
} as const

export function NavBadge({ badge, size = 'md', position = 'absolute' }: NavBadgeProps) {
  const config = SIZE_CONFIG[size]
  const isAbsolute = position === 'absolute'

  if (badge === true) {
    return (
      <span
        className={cn(
          'rounded-full bg-error',
          config.dot,
          isAbsolute && 'absolute',
          isAbsolute && config.dotPosition
        )}
      />
    )
  }

  if (typeof badge === 'number' && badge > 0) {
    const displayCount = badge > 99 ? '99+' : badge.toString()
    return (
      <span
        className={cn(
          'flex items-center justify-center font-bold rounded-sm bg-error text-inverse',
          config.count,
          isAbsolute && 'absolute',
          isAbsolute && config.countPosition
        )}
      >
        {displayCount}
      </span>
    )
  }

  return null
}
