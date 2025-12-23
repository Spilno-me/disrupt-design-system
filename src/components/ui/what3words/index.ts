/**
 * What3Words Location Selector
 *
 * A what3words address autocomplete component with GPS support and map preview.
 *
 * @example
 * ```tsx
 * import { What3WordsInput, type What3WordsValue } from '@dds/design-system/core'
 *
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

// Components
export { What3WordsInput } from './What3WordsInput'
export { What3WordsMap } from './What3WordsMap'
export { UseMyLocationButton } from './UseMyLocationButton'

// Types
export type {
  What3WordsValue,
  What3WordsCoordinates,
  What3WordsSuggestion,
  What3WordsInputProps,
  What3WordsMapProps,
  UseMyLocationButtonProps,
} from './types'

// Mock API (for simulation/testing)
export { mockAutosuggest, mockConvertToWords } from './mock-data'
