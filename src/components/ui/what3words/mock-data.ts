/**
 * Mock Data for What3Words Simulation
 *
 * Provides realistic mock autosuggest responses without needing an API key.
 * Addresses are based on real what3words locations for authenticity.
 */

import type { What3WordsSuggestion, What3WordsCoordinates, What3WordsValue } from './types'

// =============================================================================
// MOCK SUGGESTIONS DATABASE
// =============================================================================

/**
 * Mock suggestions indexed by trigger words.
 * When user types a word that starts with the key, these suggestions appear.
 */
export const MOCK_SUGGESTIONS: Record<string, What3WordsSuggestion[]> = {
  // Common starting words - London area
  'filled': [
    {
      words: 'filled.count.soap',
      nearestPlace: 'Bayswater, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5152, lng: -0.1830 },
    },
    {
      words: 'filled.crown.spell',
      nearestPlace: 'Paddington, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5154, lng: -0.1752 },
    },
    {
      words: 'filled.mixer.grasp',
      nearestPlace: 'Notting Hill, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5117, lng: -0.2054 },
    },
  ],
  'stock': [
    {
      words: 'stock.milan.pipe',
      nearestPlace: 'City of London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5120, lng: -0.0910 },
    },
    {
      words: 'stocks.beans.glaze',
      nearestPlace: 'Tower Hill, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5096, lng: -0.0767 },
    },
  ],
  'index': [
    {
      words: 'index.home.raft',
      nearestPlace: 'Buckingham Palace, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5014, lng: -0.1419 },
    },
    {
      words: 'index.spent.bold',
      nearestPlace: 'Westminster, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.4995, lng: -0.1248 },
    },
  ],
  'table': [
    {
      words: 'table.slips.farms',
      nearestPlace: 'Manchester',
      country: 'United Kingdom',
      coordinates: { lat: 53.4839, lng: -2.2446 },
    },
    {
      words: 'tables.gift.atoms',
      nearestPlace: 'Leeds',
      country: 'United Kingdom',
      coordinates: { lat: 53.8008, lng: -1.5491 },
    },
  ],
  'daring': [
    {
      words: 'daring.lion.race',
      nearestPlace: 'Edinburgh',
      country: 'United Kingdom',
      coordinates: { lat: 55.9533, lng: -3.1883 },
    },
    {
      words: 'daring.flats.brain',
      nearestPlace: 'Glasgow',
      country: 'United Kingdom',
      coordinates: { lat: 55.8642, lng: -4.2518 },
    },
  ],
  'limit': [
    {
      words: 'limit.broom.faded',
      nearestPlace: 'Birmingham',
      country: 'United Kingdom',
      coordinates: { lat: 52.4862, lng: -1.8904 },
    },
    {
      words: 'limits.cape.glide',
      nearestPlace: 'Liverpool',
      country: 'United Kingdom',
      coordinates: { lat: 53.4084, lng: -2.9916 },
    },
  ],
  // Industrial/warehouse locations (for EHS context)
  'crane': [
    {
      words: 'crane.bold.hints',
      nearestPlace: 'Tilbury Docks, Essex',
      country: 'United Kingdom',
      coordinates: { lat: 51.4619, lng: 0.3525 },
    },
    {
      words: 'cranes.deal.frost',
      nearestPlace: 'Southampton Port',
      country: 'United Kingdom',
      coordinates: { lat: 50.8998, lng: -1.4044 },
    },
  ],
  'safety': [
    {
      words: 'safety.checks.done',
      nearestPlace: 'Canary Wharf, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5054, lng: -0.0235 },
    },
    {
      words: 'safety.belt.clips',
      nearestPlace: 'Stratford, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5430, lng: -0.0023 },
    },
  ],
  'spill': [
    {
      words: 'spill.zone.clear',
      nearestPlace: 'Dagenham, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5463, lng: 0.1548 },
    },
  ],
  'warehouse': [
    {
      words: 'warehouse.floor.three',
      nearestPlace: 'Heathrow, London',
      country: 'United Kingdom',
      coordinates: { lat: 51.4700, lng: -0.4543 },
    },
  ],
}

// =============================================================================
// FALLBACK SUGGESTIONS
// =============================================================================

/**
 * Generic suggestions when no specific match is found
 */
const FALLBACK_SUGGESTIONS: What3WordsSuggestion[] = [
  {
    words: 'pretty.needed.chill',
    nearestPlace: 'Tower of London',
    country: 'United Kingdom',
    coordinates: { lat: 51.5081, lng: -0.0759 },
  },
  {
    words: 'spring.tops.issued',
    nearestPlace: 'Hyde Park, London',
    country: 'United Kingdom',
    coordinates: { lat: 51.5073, lng: -0.1657 },
  },
  {
    words: 'decent.ramps.gross',
    nearestPlace: 'Kings Cross, London',
    country: 'United Kingdom',
    coordinates: { lat: 51.5308, lng: -0.1238 },
  },
]

// =============================================================================
// MOCK API FUNCTIONS
// =============================================================================

/**
 * Simulates the what3words autosuggest API call
 *
 * @param input - User's input text (e.g., "filled.co" or "filled")
 * @param focus - Optional coordinates to prioritize nearby suggestions
 * @returns Promise resolving to array of suggestions
 */
export async function mockAutosuggest(
  input: string,
  focus?: What3WordsCoordinates
): Promise<What3WordsSuggestion[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 200))

  // Normalize input (remove /// prefix if present, lowercase)
  const normalizedInput = input.toLowerCase().replace(/^\/\/\//, '').trim()

  // Need at least some input
  if (normalizedInput.length < 2) {
    return []
  }

  // Extract first word for matching
  const firstWord = normalizedInput.split('.')[0]

  // Find matching suggestions
  let results: What3WordsSuggestion[] = []

  for (const [key, suggestions] of Object.entries(MOCK_SUGGESTIONS)) {
    if (firstWord.startsWith(key) || key.startsWith(firstWord)) {
      // Filter suggestions that match the full input pattern
      const filtered = suggestions.filter((s) => {
        const suggestionNormalized = s.words.toLowerCase()
        return suggestionNormalized.startsWith(normalizedInput) ||
               suggestionNormalized.includes(normalizedInput) ||
               normalizedInput.split('.').every((part, i) => {
                 const suggestionParts = suggestionNormalized.split('.')
                 return suggestionParts[i]?.startsWith(part)
               })
      })
      results = [...results, ...filtered]
    }
  }

  // If no matches, return fallback
  if (results.length === 0) {
    results = FALLBACK_SUGGESTIONS.filter((s) =>
      s.words.toLowerCase().includes(normalizedInput)
    )
  }

  // Still no matches? Return first few fallbacks
  if (results.length === 0 && normalizedInput.length >= 3) {
    results = FALLBACK_SUGGESTIONS.slice(0, 3)
  }

  // If focus coordinates provided, sort by distance
  if (focus && results.length > 0) {
    results = results
      .map((suggestion) => ({
        ...suggestion,
        distanceToFocusKm: calculateDistance(focus, suggestion.coordinates),
      }))
      .sort((a, b) => (a.distanceToFocusKm || 0) - (b.distanceToFocusKm || 0))
  }

  // Limit results
  return results.slice(0, 5)
}

/**
 * Simulates converting GPS coordinates to a what3words address
 *
 * @param coords - GPS coordinates
 * @returns Promise resolving to a mock what3words value
 */
export async function mockConvertToWords(
  coords: What3WordsCoordinates
): Promise<What3WordsValue> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Generate a deterministic but realistic-looking address based on coords
  const words = generateMockAddress(coords)

  return {
    words,
    coordinates: coords,
    nearestPlace: 'Current Location',
    country: 'United Kingdom',
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  coord1: What3WordsCoordinates,
  coord2: What3WordsCoordinates
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLng = toRad(coord2.lng - coord1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Generate a deterministic mock address from coordinates
 */
function generateMockAddress(coords: What3WordsCoordinates): string {
  const words = [
    'apple', 'brave', 'clear', 'dance', 'eagle', 'flame', 'grace', 'heart',
    'ivory', 'jolly', 'kneel', 'lemon', 'maple', 'noble', 'ocean', 'pearl',
    'quiet', 'river', 'stone', 'tiger', 'unity', 'vivid', 'water', 'xerox',
    'youth', 'zebra', 'amber', 'bloom', 'crisp', 'dream',
  ]

  // Use coords to deterministically pick 3 words
  const latSeed = Math.abs(Math.floor(coords.lat * 1000)) % words.length
  const lngSeed = Math.abs(Math.floor(coords.lng * 1000)) % words.length
  const combinedSeed = (latSeed + lngSeed) % words.length

  return `${words[latSeed]}.${words[lngSeed]}.${words[combinedSeed]}`
}
