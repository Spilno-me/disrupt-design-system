import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { SearchFilter } from './SearchFilter/SearchFilter'
import type { FilterState, FilterGroup } from './SearchFilter/types'

const meta: Meta<typeof SearchFilter> = {
  title: 'Shared/Data/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A universal search input with optional filter functionality.

## Features
- **Debounced search** - Use \`onDebouncedChange\` for API calls (configurable delay)
- **Input validation** - \`maxLength\` prop with enforcement
- **Loading states** - \`isSearching\` and \`isLoadingFilters\` props
- **Disabled state** - Full component disabling
- **Error boundary** - Built-in error handling with retry
- **Mobile responsive** - Bottom sheet on mobile, dropdown on desktop
- **Accessibility** - Full keyboard support, ARIA attributes
- **Pure Tailwind** - Zero inline styles

## Usage
\`\`\`tsx
// Search only
<SearchFilter
  placeholder="Search..."
  value={search}
  onChange={setSearch}
  onDebouncedChange={handleApiSearch}
  hideFilters
/>

// With filters
<SearchFilter
  placeholder="Search leads..."
  filterGroups={FILTER_GROUPS}
  filters={filters}
  onFiltersChange={setFilters}
/>
\`\`\`
        `,
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
    hideFilters: {
      control: 'boolean',
      description: 'Hide the filter button (search only)',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the component should be full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire component',
    },
    isSearching: {
      control: 'boolean',
      description: 'Show loading spinner in search input',
    },
    isLoadingFilters: {
      control: 'boolean',
      description: 'Show loading state for filters',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum input length',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchFilter>

// =============================================================================
// FILTER CONFIGURATIONS
// =============================================================================

const LEADS_FILTERS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'new', label: 'New' },
      { id: 'contacted', label: 'Contacted' },
      { id: 'qualified', label: 'Qualified' },
      { id: 'converted', label: 'Converted' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    options: [
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
    ],
  },
  {
    key: 'source',
    label: 'Source',
    options: [
      { id: 'website', label: 'Website' },
      { id: 'referral', label: 'Referral' },
      { id: 'event', label: 'Event' },
    ],
  },
]

const INVOICES_FILTERS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'draft', label: 'Draft' },
      { id: 'sent', label: 'Sent' },
      { id: 'paid', label: 'Paid' },
      { id: 'overdue', label: 'Overdue' },
    ],
  },
  {
    key: 'amount',
    label: 'Amount',
    options: [
      { id: 'under1k', label: 'Under $1,000' },
      { id: '1k-5k', label: '$1,000 - $5,000' },
      { id: 'over5k', label: 'Over $5,000' },
    ],
  },
]

// =============================================================================
// BASIC STORIES
// =============================================================================

/**
 * Default search filter - search only mode
 */
export const Default: Story = {
  args: {
    placeholder: 'Search...',
    hideFilters: true,
  },
}

/**
 * Search with filter groups
 */
export const WithFilters: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterState>({
      status: [],
      priority: [],
      source: [],
    })

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search leads..."
          value={search}
          onChange={setSearch}
          filterGroups={LEADS_FILTERS}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="p-4 bg-muted-bg rounded-lg text-sm">
          <p className="font-medium mb-2 text-primary">Current State:</p>
          <p className="text-muted"><strong>Search:</strong> {search || '(empty)'}</p>
          <p className="text-muted"><strong>Status:</strong> {filters.status?.join(', ') || 'None'}</p>
          <p className="text-muted"><strong>Priority:</strong> {filters.priority?.join(', ') || 'None'}</p>
          <p className="text-muted"><strong>Source:</strong> {filters.source?.join(', ') || 'None'}</p>
        </div>
      </div>
    )
  },
}

/**
 * With pre-selected filters
 */
export const WithActiveFilters: Story = {
  render: () => {
    const [filters, setFilters] = useState<FilterState>({
      status: ['new', 'contacted'],
      priority: ['high'],
      source: [],
    })

    return (
      <SearchFilter
        placeholder="Search leads..."
        filterGroups={LEADS_FILTERS}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  },
}

// =============================================================================
// LOADING STATES
// =============================================================================

/**
 * Search in progress - shows loading spinner
 */
export const SearchInProgress: Story = {
  render: () => {
    const [search, setSearch] = useState('searching...')
    const [isSearching, setIsSearching] = useState(true)

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search..."
          value={search}
          onChange={setSearch}
          isSearching={isSearching}
          hideFilters
        />
        <button
          onClick={() => setIsSearching(!isSearching)}
          className="px-4 py-2 bg-accent-strong text-inverse rounded-md text-sm"
        >
          Toggle Loading: {isSearching ? 'ON' : 'OFF'}
        </button>
      </div>
    )
  },
}

/**
 * Filters loading - shows loading state in dropdown
 */
export const FiltersLoading: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(true)
    const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([])
    const [filters, setFilters] = useState<FilterState>({})

    // Simulate async filter loading
    useEffect(() => {
      if (!isLoading) {
        const timer = setTimeout(() => {
          setFilterGroups(LEADS_FILTERS)
          setFilters({ status: [], priority: [], source: [] })
        }, 1500)
        return () => clearTimeout(timer)
      }
    }, [isLoading])

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search leads..."
          filterGroups={filterGroups}
          filters={filters}
          onFiltersChange={setFilters}
          isLoadingFilters={isLoading}
        />
        <button
          onClick={() => {
            setIsLoading(true)
            setFilterGroups([])
            setTimeout(() => setIsLoading(false), 100)
          }}
          className="px-4 py-2 bg-accent-strong text-inverse rounded-md text-sm"
        >
          Reload Filters
        </button>
        <p className="text-sm text-muted">
          {isLoading ? 'Loading filters...' : `Loaded ${filterGroups.length} filter groups`}
        </p>
      </div>
    )
  },
}

// =============================================================================
// DEBOUNCE DEMO
// =============================================================================

/**
 * Debounced search - demonstrates API-friendly search
 */
export const DebouncedSearch: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [debouncedValue, setDebouncedValue] = useState('')
    const [apiCalls, setApiCalls] = useState<string[]>([])

    const handleDebouncedChange = (value: string) => {
      setDebouncedValue(value)
      setApiCalls((prev) => [...prev.slice(-4), `API call: "${value}" at ${new Date().toLocaleTimeString()}`])
    }

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Type to search (300ms debounce)..."
          value={search}
          onChange={setSearch}
          onDebouncedChange={handleDebouncedChange}
          debounceMs={300}
          hideFilters
        />

        <div className="p-4 bg-muted-bg rounded-lg text-sm space-y-2">
          <p className="text-muted">
            <strong>Immediate value:</strong> {search || '(empty)'}
          </p>
          <p className="text-muted">
            <strong>Debounced value:</strong> {debouncedValue || '(empty)'}
          </p>
          <div className="mt-2 pt-2 border-t border-subtle">
            <p className="font-medium text-primary mb-1">API Calls (last 5):</p>
            {apiCalls.length === 0 ? (
              <p className="text-muted italic">No API calls yet. Type something!</p>
            ) : (
              apiCalls.map((call, i) => (
                <p key={i} className="text-xs text-muted font-mono">{call}</p>
              ))
            )}
          </div>
        </div>
      </div>
    )
  },
}

// =============================================================================
// DISABLED STATE
// =============================================================================

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    const [disabled, setDisabled] = useState(true)

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search..."
          filterGroups={LEADS_FILTERS}
          filters={{ status: ['new'], priority: [], source: [] }}
          onFiltersChange={() => {}}
          disabled={disabled}
        />
        <button
          onClick={() => setDisabled(!disabled)}
          className="px-4 py-2 bg-accent-strong text-inverse rounded-md text-sm"
        >
          Toggle Disabled: {disabled ? 'ON' : 'OFF'}
        </button>
      </div>
    )
  },
}

// =============================================================================
// VARIANTS
// =============================================================================

/**
 * Search only mode (no filters)
 */
export const SearchOnly: Story = {
  render: () => {
    const [search, setSearch] = useState('')

    return (
      <SearchFilter
        placeholder="Search anything..."
        value={search}
        onChange={setSearch}
        hideFilters
        onSearch={(value) => console.log('Search submitted:', value)}
      />
    )
  },
}

/**
 * Fixed width variant
 */
export const FixedWidth: Story = {
  args: {
    placeholder: 'Search...',
    fullWidth: false,
    hideFilters: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * Different filter configuration (invoices)
 */
export const InvoicesExample: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterState>({
      status: [],
      amount: [],
    })

    return (
      <SearchFilter
        placeholder="Search invoices..."
        value={search}
        onChange={setSearch}
        filterGroups={INVOICES_FILTERS}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  },
}

// =============================================================================
// EDGE CASES
// =============================================================================

/**
 * Empty filter groups
 */
export const EmptyFilterGroups: Story = {
  render: () => {
    return (
      <SearchFilter
        placeholder="Search..."
        filterGroups={[]}
        filters={{}}
        onFiltersChange={() => {}}
      />
    )
  },
}

/**
 * Max length validation
 */
export const MaxLengthValidation: Story = {
  render: () => {
    const [search, setSearch] = useState('')

    return (
      <div className="space-y-4">
        <SearchFilter
          placeholder="Max 20 characters..."
          value={search}
          onChange={setSearch}
          maxLength={20}
          hideFilters
        />
        <p className="text-sm text-muted">
          Characters: {search.length}/20
        </p>
      </div>
    )
  },
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

/**
 * Usage examples with code snippets
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-3">Search Only</h3>
        <SearchFilter placeholder="Search..." hideFilters />
        <pre className="mt-3 p-3 bg-inverse-bg text-inverse text-xs rounded overflow-x-auto">
{`<SearchFilter
  placeholder="Search..."
  value={search}
  onChange={setSearch}
  onDebouncedChange={handleApiSearch}
  hideFilters
/>`}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-3">With Filters</h3>
        <SearchFilter
          placeholder="Search leads..."
          filterGroups={LEADS_FILTERS}
          filters={{ status: [], priority: [], source: [] }}
          onFiltersChange={() => {}}
        />
        <pre className="mt-3 p-3 bg-inverse-bg text-inverse text-xs rounded overflow-x-auto">
{`const FILTER_GROUPS = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'new', label: 'New' },
      { id: 'contacted', label: 'Contacted' },
    ],
  },
]

<SearchFilter
  placeholder="Search leads..."
  filterGroups={FILTER_GROUPS}
  filters={filters}
  onFiltersChange={setFilters}
  onDebouncedChange={handleApiSearch}
/>`}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-3">Loading States</h3>
        <SearchFilter
          placeholder="Searching..."
          isSearching
          isLoadingFilters
          filterGroups={[]}
          filters={{}}
          onFiltersChange={() => {}}
        />
        <pre className="mt-3 p-3 bg-inverse-bg text-inverse text-xs rounded overflow-x-auto">
{`<SearchFilter
  placeholder="Search..."
  isSearching={isSearching}
  isLoadingFilters={isLoadingFilterOptions}
  filterGroups={filterGroups}
  filters={filters}
  onFiltersChange={setFilters}
/>`}
        </pre>
      </div>
    </div>
  ),
}
