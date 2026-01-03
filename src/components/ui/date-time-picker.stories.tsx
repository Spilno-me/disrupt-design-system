import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  ATOM_META,
  atomDescription,
  StorySection,
  STORY_SPACING,
} from '@/stories/_infrastructure'
import { DateTimePicker } from './date-time-picker'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof DateTimePicker> = {
  title: 'Core/DateTimePicker',
  component: DateTimePicker,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Date and time picker with calendar popup and segmented time input. Supports date-only or date+time modes.'
        ),
      },
    },
  },
  argTypes: {
    showTime: {
      control: 'boolean',
      description: 'Show time picker below calendar',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the picker',
    },
    error: {
      control: 'boolean',
      description: 'Error state styling',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

// =============================================================================
// INTERACTIVE DEFAULT
// =============================================================================

function DefaultDemo() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="w-80">
      <DateTimePicker
        value={date}
        onChange={setDate}
        placeholder="Select date and time"
      />
      {date && (
        <p className="mt-2 text-sm text-secondary">
          Selected: {date.toLocaleString()}
        </p>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <DefaultDemo />,
}

// =============================================================================
// ALL STATES
// =============================================================================

function WithValueDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 0, 15, 14, 30)
  )
  return (
    <div className="w-80">
      <DateTimePicker value={date} onChange={setDate} />
    </div>
  )
}

function DateOnlyDemo() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  return (
    <div className="w-80">
      <DateTimePicker
        value={date}
        onChange={setDate}
        showTime={false}
        placeholder="Select date"
      />
    </div>
  )
}

export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      <StorySection
        title="Default (Date + Time)"
        description="Full date and time picker with segmented hour:minute input"
      >
        <DefaultDemo />
      </StorySection>

      <StorySection
        title="With Pre-selected Value"
        description="Shows formatted date and time in trigger button"
      >
        <WithValueDemo />
      </StorySection>

      <StorySection
        title="Date Only"
        description="Calendar picker without time input (showTime={false})"
      >
        <DateOnlyDemo />
      </StorySection>

      <StorySection
        title="Disabled State"
        description="Picker is non-interactive"
      >
        <div className="w-80">
          <DateTimePicker
            value={new Date(2025, 0, 15, 9, 0)}
            disabled
          />
        </div>
      </StorySection>

      <StorySection
        title="Error State"
        description="Shows error border styling"
      >
        <div className="w-80">
          <DateTimePicker
            placeholder="Required field"
            error
          />
        </div>
      </StorySection>

      <StorySection
        title="Custom Placeholder"
        description="Custom placeholder text"
      >
        <div className="w-80">
          <DateTimePicker
            placeholder="When should we schedule this?"
          />
        </div>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// INDIVIDUAL STORIES
// =============================================================================

export const WithTime: Story = {
  args: {
    showTime: true,
    placeholder: 'Pick a date and time',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const DateOnly: Story = {
  args: {
    showTime: false,
    placeholder: 'Pick a date',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const WithError: Story = {
  args: {
    error: true,
    placeholder: 'Required field',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
