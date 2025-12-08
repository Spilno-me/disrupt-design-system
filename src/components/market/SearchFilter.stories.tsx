import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SearchFilter, MARKET_FILTER_OPTIONS } from './SearchFilter'
import type { FilterState } from './SearchFilter'

const meta: Meta<typeof SearchFilter> = {
  title: 'Market/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A search input component with filter dropdown for the Disrupt Market product. Features a gradient background, search icon, text input, and filter button with category/badge/pricing filters.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'Current search value (controlled)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when search value changes',
    },
    onFiltersChange: {
      action: 'filters changed',
      description: 'Callback when filters change',
    },
    onSearch: {
      action: 'search submitted',
      description: 'Callback when search is submitted (Enter key)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the component should be full width',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchFilter>

/**
 * Default search filter with placeholder text
 */
export const Default: Story = {
  args: {
    placeholder: 'Search modules...',
  },
}

/**
 * Search filter with a pre-filled value
 */
export const WithValue: Story = {
  args: {
    placeholder: 'Search modules...',
    value: 'Safety Observations',
  },
}

/**
 * Interactive example with filter state management
 */
export const Interactive: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('')
    const [filters, setFilters] = useState<FilterState>({
      categories: [],
      badges: [],
      pricing: [],
    })

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search modules..."
          value={searchValue}
          onChange={setSearchValue}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={(value) => console.log('Search:', value)}
        />

        <div className="p-4 bg-slate-50 rounded-lg text-sm">
          <p className="font-medium mb-2">Current State:</p>
          <p><strong>Search:</strong> {searchValue || '(empty)'}</p>
          <p><strong>Categories:</strong> {filters.categories.join(', ') || 'None'}</p>
          <p><strong>Badges:</strong> {filters.badges.join(', ') || 'None'}</p>
          <p><strong>Pricing:</strong> {filters.pricing.join(', ') || 'None'}</p>
        </div>
      </div>
    )
  },
}

/**
 * Search filter with pre-selected filters
 */
export const WithActiveFilters: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterState>({
      categories: ['safety', 'compliance'],
      badges: ['featured'],
      pricing: ['free'],
    })

    return (
      <SearchFilter
        placeholder="Search modules..."
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  },
}

/**
 * Search filter with fixed width
 */
export const FixedWidth: Story = {
  args: {
    placeholder: 'Search...',
    fullWidth: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * Filter options reference
 */
export const FilterOptionsReference: Story = {
  render: () => (
    <div className="space-y-6">
      <SearchFilter placeholder="Search modules..." />

      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="font-semibold mb-4">Available Filter Options</h3>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <ul className="space-y-1">
              {MARKET_FILTER_OPTIONS.categories.map((cat) => (
                <li key={cat.id} className="text-slate-600">
                  {cat.label} <span className="text-slate-400">({cat.id})</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Badges</h4>
            <ul className="space-y-1">
              {MARKET_FILTER_OPTIONS.badges.map((badge) => (
                <li key={badge.id} className="text-slate-600">
                  {badge.label} <span className="text-slate-400">({badge.id})</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Pricing</h4>
            <ul className="space-y-1">
              {MARKET_FILTER_OPTIONS.pricing.map((price) => (
                <li key={price.id} className="text-slate-600">
                  {price.label} <span className="text-slate-400">({price.id})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
}
