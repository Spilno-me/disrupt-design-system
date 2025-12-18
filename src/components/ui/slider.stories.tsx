import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect, useRef } from 'react'
import {
  ATOM_META,
  atomDescription,
  STORY_WIDTHS,
} from '@/stories/_infrastructure'
import { Slider } from './Slider'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Slider> = {
  title: 'Core/Slider',
  component: Slider,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'A customizable range slider built on Radix UI primitives. Uses teal brand colors for visual consistency. Supports labels, units, step increments, and disabled states.'
        ),
      },
    },
  },
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
      <div className={STORY_WIDTHS.molecule}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Slider>

// Interactive wrapper for controlled stories
function InteractiveSlider(props: Omit<React.ComponentProps<typeof Slider>, 'onChange'> & { onChange?: (value: number) => void, autoFocusThumb?: boolean }) {
  const [value, setValue] = useState(props.value)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.autoFocusThumb && containerRef.current) {
      const thumb = containerRef.current.querySelector('[role="slider"]') as HTMLElement
      if (thumb) {
        setTimeout(() => thumb.focus(), 100)
      }
    }
  }, [props.autoFocusThumb])

  return (
    <div ref={containerRef}>
      <Slider {...props} value={value} onChange={setValue} />
    </div>
  )
}

// Default (for Controls panel)
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

// All States (Visual Matrix - Interactive component)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default State</h4>
        <InteractiveSlider
          value={50}
          min={0}
          max={100}
          label="Volume"
          unit="%"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior)</h4>
        <InteractiveSlider
          value={50}
          min={0}
          max={100}
          label="Focused Slider"
          unit="units"
          autoFocusThumb
        />
        <p className="text-xs text-secondary mt-2">Thumb shows visible teal focus ring (4px, --ring variable)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled State</h4>
        <Slider
          value={60}
          min={0}
          max={100}
          label="Disabled Slider"
          unit="%"
          disabled
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};
