/**
 * What3WordsInput - Autocomplete input for what3words addresses
 *
 * An accessible autocomplete component for selecting what3words locations.
 * Features simulated autosuggest, optional GPS location, and map preview.
 *
 * @example
 * ```tsx
 * const [location, setLocation] = useState<What3WordsValue | null>(null)
 *
 * <What3WordsInput
 *   value={location}
 *   onChange={setLocation}
 *   showMap
 *   placeholder="Enter 3 words..."
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { mockAutosuggest, mockConvertToWords } from './mock-data'
import { What3WordsMap } from './What3WordsMap'
import { UseMyLocationButton } from './UseMyLocationButton'
import type {
  What3WordsInputProps,
  What3WordsSuggestion,
  What3WordsCoordinates,
  What3WordsValue,
} from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function What3WordsInput({
  value,
  onChange,
  placeholder = 'Type 3 words (e.g., filled.count.soap)',
  disabled = false,
  showMap = false,
  focusCoordinates,
  error = false,
  className,
  apiKey,
  googleMapsApiKey,
}: What3WordsInputProps) {
  // State
  const [query, setQuery] = useState(value?.words || '')
  const [suggestions, setSuggestions] = useState<What3WordsSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [gpsCoords, setGpsCoords] = useState<What3WordsCoordinates | undefined>(
    focusCoordinates
  )

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sync external value changes
  useEffect(() => {
    if (value?.words && value.words !== query) {
      setQuery(value.words)
    }
  }, [value?.words])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (input.length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await mockAutosuggest(input, gpsCoords)
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setHighlightedIndex(-1)
      } catch (err) {
        console.error('Autosuggest error:', err)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    },
    [gpsCoords]
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce the API call
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)

    // If user clears input, clear value
    if (!newValue && value) {
      onChange(null)
    }
  }

  // Handle suggestion selection
  const handleSelect = (suggestion: What3WordsSuggestion) => {
    const selectedValue: What3WordsValue = {
      words: suggestion.words,
      coordinates: suggestion.coordinates,
      nearestPlace: suggestion.nearestPlace,
      country: suggestion.country,
    }

    setQuery(suggestion.words)
    setSuggestions([])
    setIsOpen(false)
    setHighlightedIndex(-1)
    onChange(selectedValue)
    inputRef.current?.focus()
  }

  // Handle GPS location found
  const handleGpsLocation = async (coords: What3WordsCoordinates) => {
    setGpsCoords(coords)
    setIsLoading(true)

    try {
      const w3wValue = await mockConvertToWords(coords)
      setQuery(w3wValue.words)
      onChange(w3wValue)
    } catch (err) {
      console.error('GPS conversion error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear selection
  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    onChange(null)
    inputRef.current?.focus()
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && query.length >= 2) {
        fetchSuggestions(query)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Input row */}
      <div className="flex gap-2">
        {/* Main input with suggestions */}
        <div className="relative flex-1">
          <div className="relative">
            {/* What3Words prefix indicator */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-tertiary font-medium select-none">
              ///
            </span>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setIsOpen(true)
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls="w3w-suggestions"
              aria-invalid={error}
              role="combobox"
              className={cn(
                // Base styles matching DDS Input
                'flex h-12 md:h-10 w-full min-w-0 rounded-sm border border-default bg-surface pl-9 pr-10 py-3 md:py-2 text-base md:text-sm text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none',
                // Placeholder
                'placeholder:text-tertiary placeholder:text-base md:placeholder:text-sm',
                // Focus state
                'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-4',
                // Error state
                error && 'ring-error/20 border-error',
                // Disabled
                'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-bg'
              )}
            />

            {/* Loading or clear button */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-tertiary" />
              ) : query && value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted-bg rounded-sm transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4 text-tertiary" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Suggestions dropdown */}
          {isOpen && suggestions.length > 0 && (
            <ul
              ref={listRef}
              id="w3w-suggestions"
              role="listbox"
              className="absolute z-50 mt-1 w-full bg-surface border border-default rounded-sm shadow-lg max-h-[240px] overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.words}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors',
                    highlightedIndex === index
                      ? 'bg-muted-bg'
                      : 'hover:bg-muted-bg/50'
                  )}
                >
                  <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary truncate">
                      ///{suggestion.words}
                    </div>
                    <div className="text-xs text-tertiary truncate">
                      {suggestion.nearestPlace}, {suggestion.country}
                      {suggestion.distanceToFocusKm !== undefined && (
                        <span className="ml-1">
                          ({suggestion.distanceToFocusKm.toFixed(1)} km)
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* GPS button */}
        <UseMyLocationButton
          onLocationFound={handleGpsLocation}
          disabled={disabled || isLoading}
        />
      </div>

      {/* Mini map preview */}
      {showMap && (
        <What3WordsMap
          value={value || null}
          apiKey={apiKey}
          googleMapsApiKey={googleMapsApiKey}
        />
      )}
    </div>
  )
}

What3WordsInput.displayName = 'What3WordsInput'

export default What3WordsInput
