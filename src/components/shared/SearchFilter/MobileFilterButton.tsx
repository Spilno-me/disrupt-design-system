import { Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { FilterIcon } from './icons'
import { FilterBadge } from './FilterBadge'

export interface MobileFilterButtonProps {
  /** Click handler to open sheet */
  onClick: () => void
  /** Number of active filters */
  activeCount: number
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether filters are loading */
  isLoading?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Mobile filter button that opens the bottom sheet.
 * Pure Tailwind classes - zero inline styles.
 */
export function MobileFilterButton({
  onClick,
  activeCount,
  disabled = false,
  isLoading = false,
  className,
}: MobileFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center md:hidden',
        'w-11 h-11 flex-shrink-0',
        'bg-overlay-white-50 border border-overlay-subtle rounded-sm',
        'transition-all hover:opacity-80',
        'outline-none focus:outline-none',
        'focus-visible:ring-[0.5px] focus-visible:ring-accent',
        disabled && 'opacity-50 cursor-not-allowed hover:opacity-50',
        className
      )}
      aria-label={`Open filters${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-accent animate-spin" aria-hidden="true" />
      ) : (
        <FilterIcon className="w-5 h-5 text-accent" />
      )}
      <FilterBadge count={activeCount} size="md" />
    </button>
  )
}
