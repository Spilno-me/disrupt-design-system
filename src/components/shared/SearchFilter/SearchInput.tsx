import { ChangeEvent, KeyboardEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { SearchIcon } from './icons'

export interface SearchInputProps {
  /** Current input value */
  value: string
  /** Whether input is focused */
  isFocused: boolean
  /** Placeholder text */
  placeholder?: string
  /** Maximum input length */
  maxLength?: number
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether search is in progress (shows loading spinner) */
  isSearching?: boolean
  /** Handle input change */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  /** Handle key down events */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  /** Handle focus */
  onFocus: () => void
  /** Handle blur */
  onBlur: () => void
  /** Additional class names */
  className?: string
  /** Size variant */
  size?: 'default' | 'compact'
}

/**
 * Search input with icon and styled container.
 * Matches Radix Input styling with search icon.
 */
export function SearchInput({
  value,
  isFocused,
  placeholder = 'Search...',
  maxLength,
  disabled = false,
  isSearching = false,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
  size = 'default',
}: SearchInputProps) {
  const isCompact = size === 'compact'

  return (
    <div
      className={cn(
        // Base styles - matching Radix Input with inset shadow for depth
        'relative flex flex-1 items-center',
        isCompact ? 'h-9' : 'h-10',
        'rounded-sm border border-default bg-surface',
        'transition-[color,box-shadow]',
        // Focus state - matching Radix Input
        isFocused && !disabled && 'border-accent ring-accent/20 ring-[3px]',
        // Disabled state
        disabled && 'pointer-events-none cursor-not-allowed opacity-50 bg-muted-bg',
        className
      )}
      style={{ boxShadow: 'var(--shadow-inner-sm)' }}
    >
      {/* Search icon or loading spinner */}
      <div className={cn('absolute flex items-center pointer-events-none', isCompact ? 'left-2.5' : 'left-3')}>
        {isSearching ? (
          <Loader2
            className={cn('text-accent animate-spin', isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4')}
            aria-hidden="true"
          />
        ) : (
          <SearchIcon
            className={cn(
              'transition-colors duration-150',
              'text-secondary',
              isCompact && 'w-3.5 h-3.5'
            )}
          />
        )}
      </div>

      {/* Input element */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-label={placeholder}
        aria-busy={isSearching}
        className={cn(
          // Base input styles - matching Radix Input
          'w-full h-full bg-transparent border-none outline-none',
          isCompact ? 'text-sm' : 'text-base md:text-sm',
          'font-sans text-primary placeholder:text-tertiary/50',
          'selection:bg-accent-strong selection:text-inverse',
          isCompact ? 'pl-8 pr-2.5' : 'pl-9 pr-3',
          disabled && 'cursor-not-allowed'
        )}
      />
    </div>
  )
}
