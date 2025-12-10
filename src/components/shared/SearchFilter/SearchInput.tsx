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
 * Pure Tailwind classes - zero inline styles.
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
        // Base styles
        'relative flex flex-1 items-center h-9',
        'bg-overlay-white-50 border border-overlay-subtle rounded-sm',
        'transition-all duration-150',
        // Focus state
        isFocused && !disabled && 'ring-[0.5px] ring-accent',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
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
              isFocused && !disabled ? 'text-icon-accent' : 'text-icon-secondary'
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
          'w-full h-full bg-transparent border-none outline-none',
          'text-sm font-normal font-sans tracking-tight',
          'text-primary placeholder:text-tertiary',
          'pl-9 pr-3',
          disabled && 'cursor-not-allowed'
        )}
      />
    </div>
  )
}
