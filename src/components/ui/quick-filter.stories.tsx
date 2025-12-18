import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  ORGANISM_META,
  organismDescription,
} from '@/stories/_infrastructure'
import {
  QuickFilter,
  QuickFilterItem,
  QuickFilterItemProps,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
  DLBFilter,
} from './QuickFilter'
import {
  FileText,
  Flag,
  Barrel,
  Search,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof QuickFilterItem> = {
  title: 'Flow/Components/QuickFilter',
  component: QuickFilterItem,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#4A4A4A' },
        { name: 'light', value: '#FFFFFF' },
        { name: 'cream', value: '#FBFBF3' },
      ],
    },
    docs: {
      description: {
        component: organismDescription(
          `Horizontal row of filter buttons for quick status filtering in dashboards.

**Variants:** default (Gray), info (Cyan/Teal), warning (Orange), primary (Dark)

**Guidelines:** Max 12 characters for labels. Always provide a Lucide icon.`
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'warning', 'primary'],
      description: 'Color variant of the filter item',
      table: {
        type: { summary: "'default' | 'info' | 'warning' | 'primary'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the filter item',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the filter item is selected',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    count: {
      control: 'number',
      description: 'Count to display in the badge',
    },
    label: {
      control: 'text',
      description: 'Label text for the filter',
    },
    icon: {
      control: false,
      description: 'Lucide icon element to display',
    },
  },
}

export default meta
type Story = StoryObj<typeof QuickFilterItem>

// =============================================================================
// INDIVIDUAL ITEM STORIES
// =============================================================================

/**
 * Default variant - Gray color scheme
 * Used for drafts and default states
 */
export const Default: Story = {
  args: {
    variant: 'default',
    label: 'Drafts',
    count: 4,
    icon: <FileText size={24} />,
  },
}

/**
 * Info variant - Cyan/Teal color scheme
 * Used for reported items
 */
export const Info: Story = {
  args: {
    variant: 'info',
    label: 'Reported',
    count: 10,
    icon: <Flag size={24} />,
  },
}

/**
 * Warning variant - Orange color scheme
 * Used for aging items, reviews, DLB
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Aging',
    count: 4,
    icon: <Barrel size={24} />,
  },
}

/**
 * Primary variant - Dark color scheme
 * Used for in progress items
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'In Progress',
    count: 4,
    icon: <Search size={24} />,
  },
}

// =============================================================================
// SIZE VARIANTS
// =============================================================================

/**
 * All size variants comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <QuickFilterItem
        variant="info"
        size="sm"
        label="Small"
        count={5}
        icon={<Flag size={20} />}
      />
      <QuickFilterItem
        variant="info"
        size="md"
        label="Medium"
        count={5}
        icon={<Flag size={24} />}
      />
      <QuickFilterItem
        variant="info"
        size="lg"
        label="Large"
        count={5}
        icon={<Flag size={28} />}
      />
    </div>
  ),
}

// =============================================================================
// STATE VARIANTS
// =============================================================================

/**
 * DLB variant - Deadline/Days Late for Business
 */
export const DLB: Story = {
  args: {
    variant: 'warning',
    label: 'DLB',
    count: 3,
    icon: <Clock size={24} />,
  },
}

/**
 * Without count badge
 */
export const WithoutCount: Story = {
  args: {
    variant: 'primary',
    label: 'All Items',
    icon: <Search size={24} />,
  },
}

/**
 * With high count number
 */
export const HighCount: Story = {
  args: {
    variant: 'warning',
    label: 'Pending',
    count: 99,
    icon: <AlertTriangle size={24} />,
  },
}

// =============================================================================
// ALL VARIANTS SHOWCASE
// =============================================================================

/**
 * All color variants in a row
 */
export const AllVariants: Story = {
  render: () => (
    <QuickFilter gap="md">
      <QuickFilterItem
        variant="default"
        label="Drafts"
        count={4}
        icon={<FileText size={24} />}
      />
      <QuickFilterItem
        variant="info"
        label="Reported"
        count={10}
        icon={<Flag size={24} />}
      />
      <QuickFilterItem
        variant="warning"
        label="Aging"
        count={4}
        icon={<Barrel size={24} />}
      />
      <QuickFilterItem
        variant="primary"
        label="In Progress"
        count={4}
        icon={<Search size={24} />}
      />
    </QuickFilter>
  ),
}

// =============================================================================
// COMPLETE FIGMA DESIGN
// =============================================================================

/**
 * Complete Quick Filter as shown in Figma
 *
 * This story replicates the design from the Flow EHS Figma file
 * with all filter items: Drafts, Reported, Aging, In Progress, Reviews, DLB
 */
export const FigmaDesign: Story = {
  render: () => (
    <QuickFilter gap="md">
      <QuickFilterItem
        variant="default"
        label="Drafts"
        count={4}
        icon={<FileText size={24} />}
      />
      <QuickFilterItem
        variant="info"
        label="Reported"
        count={10}
        icon={<Flag size={24} />}
      />
      <QuickFilterItem
        variant="warning"
        label="Aging"
        count={4}
        icon={<Barrel size={24} />}
      />
      <QuickFilterItem
        variant="primary"
        label="In Progress"
        count={4}
        icon={<Search size={24} />}
      />
      <QuickFilterItem
        variant="warning"
        label="Reviews"
        count={3}
        icon={<ClipboardCheck size={24} />}
      />
      <QuickFilterItem
        variant="warning"
        label="DLB"
        count={3}
        icon={<Clock size={24} />}
      />
    </QuickFilter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete Quick Filter component matching the Figma design from Flow EHS.',
      },
    },
  },
}

// =============================================================================
// PRESET COMPONENTS
// =============================================================================

/**
 * Using preset filter components for convenience
 *
 * These pre-configured components come with default Lucide icons and proper variant settings.
 */
export const PresetComponents: Story = {
  render: () => (
    <QuickFilter gap="md">
      <DraftsFilter count={4} />
      <ReportedFilter count={10} />
      <AgingFilter count={4} />
      <InProgressFilter count={4} />
      <ReviewsFilter count={3} />
      <DLBFilter count={3} />
    </QuickFilter>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pre-configured filter components with default Lucide icons: DraftsFilter (FileText), ReportedFilter (Flag), AgingFilter (Barrel), InProgressFilter (Search), ReviewsFilter (ClipboardCheck), DLBFilter (Clock).',
      },
    },
  },
}

// =============================================================================
// INTERACTIVE STORIES
// =============================================================================

/**
 * Interactive example with selectable filters (single select)
 */
export const Interactive: Story = {
  render: function InteractiveFilters() {
    const [selected, setSelected] = useState<string | null>('reported')

    const filters: Array<{
      id: string
      variant: QuickFilterItemProps['variant']
      label: string
      count: number
      icon: React.ReactNode
    }> = [
      { id: 'drafts', variant: 'default', label: 'Drafts', count: 4, icon: <FileText size={24} /> },
      { id: 'reported', variant: 'info', label: 'Reported', count: 10, icon: <Flag size={24} /> },
      { id: 'aging', variant: 'warning', label: 'Aging', count: 4, icon: <Barrel size={24} /> },
      { id: 'progress', variant: 'primary', label: 'In Progress', count: 4, icon: <Search size={24} /> },
      { id: 'reviews', variant: 'warning', label: 'Reviews', count: 3, icon: <ClipboardCheck size={24} /> },
    ]

    return (
      <div className="flex flex-col gap-4">
        <QuickFilter gap="md">
          {filters.map((filter) => (
            <QuickFilterItem
              key={filter.id}
              variant={filter.variant}
              label={filter.label}
              count={filter.count}
              icon={filter.icon}
              selected={selected === filter.id}
              onClick={() => setSelected(filter.id === selected ? null : filter.id)}
            />
          ))}
        </QuickFilter>
        <p className="text-sm text-white text-center">
          Selected: {selected ? filters.find((f) => f.id === selected)?.label : 'None'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on filters to select/deselect them. Demonstrates interactive selection behavior.',
      },
    },
  },
}

/**
 * Multiple selection example
 */
export const MultiSelect: Story = {
  render: function MultiSelectFilters() {
    const [selected, setSelected] = useState<Set<string>>(new Set(['reported', 'aging']))

    const toggleFilter = (id: string) => {
      const newSelected = new Set(selected)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      setSelected(newSelected)
    }

    const filters: Array<{
      id: string
      variant: QuickFilterItemProps['variant']
      label: string
      count: number
      icon: React.ReactNode
    }> = [
      { id: 'drafts', variant: 'default', label: 'Drafts', count: 4, icon: <FileText size={24} /> },
      { id: 'reported', variant: 'info', label: 'Reported', count: 10, icon: <Flag size={24} /> },
      { id: 'aging', variant: 'warning', label: 'Aging', count: 4, icon: <Barrel size={24} /> },
      { id: 'progress', variant: 'primary', label: 'In Progress', count: 4, icon: <Search size={24} /> },
    ]

    return (
      <div className="flex flex-col gap-4">
        <QuickFilter gap="md">
          {filters.map((filter) => (
            <QuickFilterItem
              key={filter.id}
              variant={filter.variant}
              label={filter.label}
              count={filter.count}
              icon={filter.icon}
              selected={selected.has(filter.id)}
              onClick={() => toggleFilter(filter.id)}
            />
          ))}
        </QuickFilter>
        <p className="text-sm text-white text-center">
          Selected: {selected.size > 0 ? Array.from(selected).join(', ') : 'None'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple filters can be selected simultaneously. Click to toggle each filter.',
      },
    },
  },
}

// =============================================================================
// GAP VARIANTS
// =============================================================================

/**
 * Different gap sizes between filter items
 */
export const GapVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-white mb-2">Small gap</p>
        <QuickFilter gap="sm">
          <DraftsFilter count={4} />
          <ReportedFilter count={10} />
          <AgingFilter count={4} />
        </QuickFilter>
      </div>
      <div>
        <p className="text-sm text-white mb-2">Medium gap (default)</p>
        <QuickFilter gap="md">
          <DraftsFilter count={4} />
          <ReportedFilter count={10} />
          <AgingFilter count={4} />
        </QuickFilter>
      </div>
      <div>
        <p className="text-sm text-white mb-2">Large gap</p>
        <QuickFilter gap="lg">
          <DraftsFilter count={4} />
          <ReportedFilter count={10} />
          <AgingFilter count={4} />
        </QuickFilter>
      </div>
    </div>
  ),
}

// =============================================================================
// BACKGROUND VARIANTS
// =============================================================================

/**
 * Quick Filter on light background
 */
export const OnLightBackground: Story = {
  render: () => (
    <div className="bg-page p-8 rounded-lg">
      <QuickFilter gap="md">
        <DraftsFilter count={4} />
        <ReportedFilter count={10} />
        <AgingFilter count={4} />
        <InProgressFilter count={4} />
      </QuickFilter>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * Quick Filter on white background
 */
export const OnWhiteBackground: Story = {
  render: () => (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <QuickFilter gap="md">
        <DraftsFilter count={4} />
        <ReportedFilter count={10} />
        <AgingFilter count={4} />
        <InProgressFilter count={4} />
      </QuickFilter>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'cream' },
  },
}

// =============================================================================
// RESPONSIVE BEHAVIOR
// =============================================================================

/**
 * Responsive wrapping on smaller screens
 */
export const ResponsiveWrap: Story = {
  render: () => (
    <div className="max-w-[400px] border border-gray-400 p-4 rounded-lg bg-gray-700">
      <p className="text-sm text-white mb-4">Container width: 400px</p>
      <QuickFilter gap="md">
        <DraftsFilter count={4} />
        <ReportedFilter count={10} />
        <AgingFilter count={4} />
        <InProgressFilter count={4} />
        <ReviewsFilter count={3} />
      </QuickFilter>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The QuickFilter container supports flex-wrap, allowing items to wrap to the next line on smaller screens.',
      },
    },
  },
}

// =============================================================================
// CUSTOM ICONS
// =============================================================================

/**
 * Custom filters with different Lucide icons
 *
 * Guidelines for custom filter labels:
 * - Maximum 12 characters recommended
 * - Always include an icon
 * - Use appropriate variant for the filter type
 */
export const CustomIcons: Story = {
  render: () => (
    <QuickFilter gap="md">
      <QuickFilterItem
        variant="default"
        label="Pending"      // 7 chars - OK
        count={5}
        icon={<Clock size={24} />}
      />
      <QuickFilterItem
        variant="info"
        label="Completed"    // 9 chars - OK
        count={12}
        icon={<CheckCircle size={24} />}
      />
      <QuickFilterItem
        variant="warning"
        label="Alerts"       // 6 chars - OK
        count={3}
        icon={<AlertTriangle size={24} />}
      />
    </QuickFilter>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Custom filters with Lucide icons. **Label limit: 12 characters max.** Always provide an icon for consistency.',
      },
    },
  },
}
