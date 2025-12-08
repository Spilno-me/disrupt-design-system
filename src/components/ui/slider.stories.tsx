import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Slider } from './Slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable range slider built on Radix UI primitives. Uses design system color tokens (circleRed). Used in ROI calculators and other interactive components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Current value',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'Step increment',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the slider',
    },
    unit: {
      control: 'text',
      description: 'Unit text displayed after value',
    },
    showValue: {
      control: 'boolean',
      description: 'Show value display',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof Slider>

// Interactive wrapper for controlled stories
function InteractiveSlider(props: Omit<React.ComponentProps<typeof Slider>, 'onChange'> & { onChange?: (value: number) => void }) {
  const [value, setValue] = useState(props.value)
  return <Slider {...props} value={value} onChange={setValue} />
}

// Default
export const Default: Story = {
  render: () => (
    <InteractiveSlider
      value={50}
      min={0}
      max={100}
      step={1}
      label="Number of Workers"
      unit="Workers"
    />
  ),
}

// Without Label
export const NoLabel: Story = {
  render: () => (
    <InteractiveSlider
      value={50}
      min={0}
      max={100}
      step={1}
    />
  ),
}

// Without Value Display
export const NoValueDisplay: Story = {
  render: () => (
    <InteractiveSlider
      value={50}
      min={0}
      max={100}
      step={1}
      label="Volume"
      showValue={false}
    />
  ),
}

// Disabled State
export const Disabled: Story = {
  render: () => (
    <InteractiveSlider
      value={50}
      min={0}
      max={100}
      step={1}
      label="Disabled Slider"
      unit="%"
      disabled
    />
  ),
}

// Large Range (Workers)
export const LargeRange: Story = {
  render: () => (
    <InteractiveSlider
      value={100}
      min={10}
      max={1000}
      step={10}
      label="Number of Field Workers"
      unit="Workers"
    />
  ),
}

// Small Range (Tasks)
export const SmallRange: Story = {
  render: () => (
    <InteractiveSlider
      value={5}
      min={1}
      max={20}
      step={1}
      label="Daily AI Tasks Per Worker"
      unit="Tasks/Day"
    />
  ),
}

// ROI Calculator Example
export const ROICalculatorExample: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <InteractiveSlider
        value={100}
        min={10}
        max={1000}
        step={10}
        label="Number of Field Workers"
        unit="Workers"
      />
      <InteractiveSlider
        value={5}
        min={1}
        max={20}
        step={1}
        label="Daily AI Tasks Per Worker (Photos/Video)"
        unit="Tasks/Day"
      />
    </div>
  ),
}
