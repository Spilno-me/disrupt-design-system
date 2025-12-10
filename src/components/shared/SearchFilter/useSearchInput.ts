import { useState, useCallback, useRef, ChangeEvent, KeyboardEvent } from 'react'
import { useDebounce } from './useDebounce'
import { DEFAULT_DEBOUNCE_MS, MAX_SEARCH_LENGTH } from './constants'

export interface UseSearchInputOptions {
  /** Initial value for uncontrolled mode */
  defaultValue?: string
  /** Controlled value */
  value?: string
  /** Callback when value changes (called immediately) */
  onChange?: (value: string) => void
  /** Callback when value changes (debounced) */
  onDebouncedChange?: (value: string) => void
  /** Callback when Enter key is pressed */
  onSearch?: (value: string) => void
  /** Debounce delay in ms (0 = no debounce). Default: 300ms */
  debounceMs?: number
  /** Maximum input length. Default: 200 */
  maxLength?: number
}

export interface UseSearchInputReturn {
  /** Current input value */
  inputValue: string
  /** Whether the input is focused */
  isFocused: boolean
  /** Handle input change */
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  /** Handle key down (for Enter submission) */
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  /** Handle focus */
  handleFocus: () => void
  /** Handle blur */
  handleBlur: () => void
  /** Clear the input */
  clear: () => void
  /** Maximum allowed length */
  maxLength: number
  /** Current character count */
  charCount: number
  /** Whether at max length */
  isAtMaxLength: boolean
}

/**
 * Hook for managing search input state.
 *
 * Supports:
 * - Controlled mode (pass `value` prop)
 * - Uncontrolled mode (pass `defaultValue` prop)
 * - Debounced onChange for API calls
 * - Input validation (max length)
 * - Enter key submission
 */
export function useSearchInput({
  defaultValue = '',
  value,
  onChange,
  onDebouncedChange,
  onSearch,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  maxLength = MAX_SEARCH_LENGTH,
}: UseSearchInputOptions): UseSearchInputReturn {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)

  // Track if component is mounted for async operations
  const isMountedRef = useRef(true)

  const inputValue = isControlled ? value : internalValue
  const charCount = inputValue.length
  const isAtMaxLength = charCount >= maxLength

  // Debounced callback for API calls
  const debouncedOnChange = useDebounce(
    (newValue: string) => {
      if (isMountedRef.current) {
        onDebouncedChange?.(newValue)
      }
    },
    debounceMs
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Enforce max length
      if (newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength)
      }

      if (!isControlled) {
        setInternalValue(newValue)
      }

      // Immediate callback
      onChange?.(newValue)

      // Debounced callback for API
      debouncedOnChange(newValue)
    },
    [isControlled, onChange, debouncedOnChange, maxLength]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSearch?.(inputValue)
      }
    },
    [inputValue, onSearch]
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  const clear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('')
    }
    onChange?.('')
    onDebouncedChange?.('')
  }, [isControlled, onChange, onDebouncedChange])

  return {
    inputValue,
    isFocused,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    clear,
    maxLength,
    charCount,
    isAtMaxLength,
  }
}
