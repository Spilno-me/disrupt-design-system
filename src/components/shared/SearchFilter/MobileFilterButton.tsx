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
        'w-10 h-10 flex-shrink-0',
        'rounded-sm shadow-sm',
        'transition-all',
        // Active state - light teal background when filters are selected
        activeCount > 0 ? 'bg-accent-bg border border-accent' : 'bg-surface border border-default hover:bg-surface-hover',
        'outline-none focus:outline-none',
        'focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:ring-[3px]',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50 bg-muted-bg',
        className
      )}
      aria-label={`Open filters${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 text-accent animate-spin" aria-hidden="true" />
      ) : (
        <FilterIcon className="w-5 h-5 text-primary" />
      )}
      <FilterBadge count={activeCount} size="md" />
    </button>
  )
}
