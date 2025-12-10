import { cn } from '../../../lib/utils'

export interface FilterBadgeProps {
  /** Number of active filters */
  count: number
  /** Size variant */
  size?: 'sm' | 'md'
  /** Additional class names */
  className?: string
}

/**
 * Badge showing active filter count.
 * Positioned absolutely - parent should have relative positioning.
 * Uses pure Tailwind classes - no inline styles.
 */
export function FilterBadge({ count, size = 'sm', className }: FilterBadgeProps) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center',
        'rounded-full font-medium bg-primary text-inverse',
        size === 'sm' && 'w-4 h-4 text-[10px]',
        size === 'md' && 'min-w-[20px] h-5 px-1 text-xs font-bold',
        className
      )}
      aria-label={`${count} active filter${count !== 1 ? 's' : ''}`}
    >
      {count}
    </span>
  )
}
