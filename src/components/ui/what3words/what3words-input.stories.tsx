/**
 * What3Words Input Stories
 *
 * Demonstrates the What3WordsInput component for location selection
 * using the what3words addressing system.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { What3WordsInput } from './What3WordsInput'
import { What3WordsMap } from './What3WordsMap'
import type { What3WordsValue } from './types'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof What3WordsInput> = {
  title: 'Components/What3WordsInput',
  component: What3WordsInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# What3Words Location Selector

An autocomplete input for selecting locations using **what3words** addresses - a global addressing system that divides the world into 3m × 3m squares, each identified by a unique combination of three words.

## Features
- **Autosuggest** - Type to search, get suggestions as you type
- **GPS support** - "Use my location" button for current position
- **Map preview** - Visual preview of selected location
- **Simulation mode** - Works without API key using mock data

## Example
\`\`\`tsx
import { What3WordsInput, type What3WordsValue } from '@dds/design-system/core'

const [location, setLocation] = useState<What3WordsValue | null>(null)

<What3WordsInput
  value={location}
  onChange={setLocation}
  showMap
/>
\`\`\`

## Mock Data
This demo uses simulated what3words data. Try typing:
- \`filled\` - London locations
- \`stock\` - City of London
- \`table\` - Manchester/Leeds
- \`daring\` - Scotland
- \`crane\` - Industrial locations
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: false,
      description: 'Currently selected what3words value',
    },
    onChange: {
      action: 'changed',
      description: 'Called when user selects a location',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    showMap: {
      control: 'boolean',
      description: 'Show mini map preview below input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
}

export default meta
type Story = StoryObj<typeof What3WordsInput>

// =============================================================================
// INTERACTIVE STORY
// =============================================================================

/**
 * Interactive example with full functionality.
 * Try typing "filled" to see location suggestions.
 */
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<What3WordsValue | null>(null)
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px]">
        <What3WordsInput
          {...args}
          value={value}
          onChange={(v) => {
            setValue(v)
            args.onChange?.(v)
          }}
          apiKey={w3wKey}
          googleMapsApiKey={googleKey}
        />
        {value && (
          <div className="mt-4 p-3 bg-muted-bg rounded-md text-xs">
            <pre className="text-primary">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  },
  args: {
    placeholder: 'Type 3 words (e.g., filled.count.soap)',
    showMap: true,
    disabled: false,
    error: false,
  },
}

// =============================================================================
// FEATURE VARIANTS
// =============================================================================

/**
 * With map preview showing selected location visually.
 */
export const WithMapPreview: Story = {
  render: function Render() {
    const [value, setValue] = useState<What3WordsValue | null>({
      words: 'filled.count.soap',
      coordinates: { lat: 51.5152, lng: -0.1830 },
      nearestPlace: 'Bayswater, London',
      country: 'United Kingdom',
    })
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px]">
        <What3WordsInput
          value={value}
          onChange={setValue}
          showMap
          placeholder="Search location..."
          apiKey={w3wKey}
          googleMapsApiKey={googleKey}
        />
      </div>
    )
  },
}

/**
 * Without map preview - compact mode.
 */
export const WithoutMap: Story = {
  render: function Render() {
    const [value, setValue] = useState<What3WordsValue | null>(null)

    return (
      <div className="w-[400px]">
        <What3WordsInput
          value={value}
          onChange={setValue}
          showMap={false}
          placeholder="Search location..."
        />
      </div>
    )
  },
}

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => {
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px]">
        <What3WordsInput
          value={{
            words: 'filled.count.soap',
            coordinates: { lat: 51.5152, lng: -0.1830 },
            nearestPlace: 'Bayswater, London',
            country: 'United Kingdom',
          }}
          onChange={() => {}}
          disabled
          showMap
          apiKey={w3wKey}
          googleMapsApiKey={googleKey}
        />
      </div>
    )
  },
}

/**
 * Error state for validation feedback.
 */
export const ErrorState: Story = {
  render: function Render() {
    const [value, setValue] = useState<What3WordsValue | null>(null)

    return (
      <div className="w-[400px] space-y-2">
        <What3WordsInput
          value={value}
          onChange={setValue}
          error
          showMap={false}
          placeholder="Invalid location..."
        />
        <p className="text-sm text-error">Please select a valid location</p>
      </div>
    )
  },
}

// =============================================================================
// MAP COMPONENT STANDALONE
// =============================================================================

/**
 * Map preview component shown standalone with real map.
 */
export const MapPreviewStandalone: Story = {
  render: () => {
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="text-sm font-medium text-primary">Selected Location</h3>
        <What3WordsMap
          value={{
            words: 'index.home.raft',
            coordinates: { lat: 51.5014, lng: -0.1419 },
            nearestPlace: 'Buckingham Palace, London',
            country: 'United Kingdom',
          }}
          apiKey={w3wKey}
          googleMapsApiKey={googleKey}
          height={250}
        />

        <h3 className="text-sm font-medium text-primary mt-6">Empty State</h3>
        <What3WordsMap value={null} />
      </div>
    )
  },
}

/**
 * Real what3words map with interactive Google Maps.
 *
 * **Requirements:**
 * - `apiKey`: Your what3words API key
 * - `googleMapsApiKey`: Your Google Maps API key
 *
 * **Setup:**
 * 1. Copy `.env.example` to `.env.local`
 * 2. Add your API keys to `.env.local`
 * 3. Restart Storybook
 *
 * Get API keys at:
 * - what3words: https://developer.what3words.com/
 * - Google Maps: https://console.cloud.google.com/
 */
export const RealMapIntegration: Story = {
  render: () => {
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const hasKeys = w3wKey && googleKey

    return (
      <div className="w-[500px] space-y-6">
        {!hasKeys ? (
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <h4 className="text-sm font-medium text-warning-strong mb-2">API Keys Required</h4>
            <p className="text-xs text-tertiary mb-2">
              To see the real interactive map, create a <code>.env.local</code> file:
            </p>
            <pre className="p-2 bg-surface rounded text-xs overflow-x-auto">
{`VITE_W3W_API_KEY=your_key_here
VITE_GOOGLE_MAPS_API_KEY=your_key_here`}
            </pre>
            <p className="text-xs text-tertiary mt-2">Then restart Storybook.</p>
          </div>
        ) : (
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
            <h4 className="text-sm font-medium text-success mb-1">API Keys Detected</h4>
            <p className="text-xs text-tertiary">Real map will render below.</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">
            {hasKeys ? 'Real Interactive Map' : 'Static Fallback (No API Keys)'}
          </h3>
          <What3WordsMap
            value={{
              words: 'filled.count.soap',
              coordinates: { lat: 51.5152, lng: -0.1830 },
              nearestPlace: 'Bayswater, London',
              country: 'United Kingdom',
            }}
            apiKey={w3wKey}
            googleMapsApiKey={googleKey}
            height={300}
            showZoomControl
            showFullscreenControl={false}
            zoom={18}
          />
        </div>
      </div>
    )
  },
}

/**
 * Map height and zoom configuration options.
 */
export const MapConfigOptions: Story = {
  render: () => {
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px] space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">Default Height (200px)</h3>
          <What3WordsMap
            value={{
              words: 'stock.milan.pipe',
              coordinates: { lat: 51.5123, lng: -0.0909 },
              nearestPlace: 'Bank, London',
              country: 'United Kingdom',
            }}
            apiKey={w3wKey}
            googleMapsApiKey={googleKey}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">Taller Height (300px)</h3>
          <What3WordsMap
            value={{
              words: 'table.book.chair',
              coordinates: { lat: 53.4808, lng: -2.2426 },
              nearestPlace: 'Manchester',
              country: 'United Kingdom',
            }}
            apiKey={w3wKey}
            googleMapsApiKey={googleKey}
            height={300}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">Custom Height (150px)</h3>
          <What3WordsMap
            value={{
              words: 'daring.lion.race',
              coordinates: { lat: 55.9533, lng: -3.1883 },
              nearestPlace: 'Edinburgh',
              country: 'United Kingdom',
            }}
            apiKey={w3wKey}
            googleMapsApiKey={googleKey}
            height={150}
          />
        </div>
      </div>
    )
  },
}

// =============================================================================
// FORM INTEGRATION
// =============================================================================

/**
 * Example form integration for incident reporting.
 */
export const FormIntegration: Story = {
  render: function Render() {
    const [location, setLocation] = useState<What3WordsValue | null>(null)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setFormSubmitted(true)
      setTimeout(() => setFormSubmitted(false), 2000)
    }

    return (
      <form onSubmit={handleSubmit} className="w-[450px] space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Incident Location <span className="text-error">*</span>
          </label>
          <What3WordsInput
            value={location}
            onChange={setLocation}
            showMap
            placeholder="Enter 3 words or use GPS"
            apiKey={w3wKey}
            googleMapsApiKey={googleKey}
          />
          <p className="text-xs text-tertiary">
            Enter a what3words address to precisely locate the incident
          </p>
        </div>

        <button
          type="submit"
          disabled={!location}
          className="w-full px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-dark transition-colors"
        >
          {formSubmitted ? 'Submitted!' : 'Report Incident'}
        </button>
      </form>
    )
  },
}

// =============================================================================
// TYPING SUGGESTIONS DEMO
// =============================================================================

/**
 * Demonstrates the autosuggest functionality.
 * Pre-populated with a partial query to show suggestions.
 */
export const TypeaheadDemo: Story = {
  render: function Render() {
    const [value, setValue] = useState<What3WordsValue | null>(null)
    const w3wKey = import.meta.env.VITE_W3W_API_KEY
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-muted-bg rounded-md">
          <h4 className="text-sm font-medium mb-2">Try these keywords:</h4>
          <ul className="text-xs text-tertiary space-y-1">
            <li><code className="bg-surface px-1 rounded">filled</code> → London locations</li>
            <li><code className="bg-surface px-1 rounded">stock</code> → City of London</li>
            <li><code className="bg-surface px-1 rounded">table</code> → Manchester/Leeds</li>
            <li><code className="bg-surface px-1 rounded">daring</code> → Scotland</li>
            <li><code className="bg-surface px-1 rounded">crane</code> → Industrial areas</li>
            <li><code className="bg-surface px-1 rounded">safety</code> → EHS locations</li>
          </ul>
        </div>

        <What3WordsInput
          value={value}
          onChange={setValue}
          showMap
          placeholder="Start typing..."
          apiKey={w3wKey}
          googleMapsApiKey={googleKey}
        />
      </div>
    )
  },
}
