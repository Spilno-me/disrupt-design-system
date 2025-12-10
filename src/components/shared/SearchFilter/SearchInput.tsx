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
}: SearchInputProps) {
  return (
    <div
      className={cn(
        // Base styles - matching Radix Input
        'relative flex flex-1 items-center h-10',
        'rounded-sm border border-default bg-surface shadow-sm',
        'transition-[color,box-shadow]',
        // Focus state - matching Radix Input
        isFocused && !disabled && 'border-accent ring-accent/20 ring-[3px]',
        // Disabled state
        disabled && 'pointer-events-none cursor-not-allowed opacity-50 bg-muted-bg',
        className
      )}
    >
      {/* Search icon or loading spinner */}
      <div className="absolute left-3 flex items-center pointer-events-none">
        {isSearching ? (
          <Loader2
            className="w-4 h-4 text-accent animate-spin"
            aria-hidden="true"
          />
        ) : (
          <SearchIcon
            className={cn(
              'transition-colors duration-150',
              'text-secondary'
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
          'text-base md:text-sm font-sans',
          'text-primary placeholder:text-muted',
          'selection:bg-accent-strong selection:text-inverse',
          'pl-9 pr-3',
          disabled && 'cursor-not-allowed'
        )}
      />
    </div>
  )
}
