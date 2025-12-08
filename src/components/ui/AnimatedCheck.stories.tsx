import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedCheck } from './AnimatedCheck'

const meta: Meta<typeof AnimatedCheck> = {
  title: 'Website/Components/AnimatedCheck',
  component: AnimatedCheck,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'color',
      description: 'Color of the checkmark stroke',
    },
    autoAnimate: {
      control: 'boolean',
      description: 'Whether to animate immediately on mount',
    },
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Stagger index for sequential animations',
    },
    staggerDelay: {
      control: { type: 'number', min: 0, max: 1, step: 0.05 },
      description: 'Base stagger delay between items',
    },
  },
}

export default meta
type Story = StoryObj<typeof AnimatedCheck>

// Default animated check (animates on scroll into view)
export const Default: Story = {
  args: {
    color: '#08A4BD',
    autoAnimate: true,
  },
}

// Auto-animated check (for hero sections)
export const AutoAnimated: Story = {
  args: {
    autoAnimate: true,
    color: '#08A4BD',
  },
}

// Different colors
export const Colors: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <AnimatedCheck color="#08A4BD" autoAnimate />
      <AnimatedCheck color="#22C55E" autoAnimate />
      <AnimatedCheck color="#EAB308" autoAnimate />
      <AnimatedCheck color="#EF4444" autoAnimate />
      <AnimatedCheck color="#8B5CF6" autoAnimate />
    </div>
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <AnimatedCheck className="w-4 h-4" autoAnimate />
      <AnimatedCheck className="w-5 h-5" autoAnimate />
      <AnimatedCheck className="w-6 h-6" autoAnimate />
      <AnimatedCheck className="w-8 h-8" autoAnimate />
      <AnimatedCheck className="w-10 h-10" autoAnimate />
    </div>
  ),
}

// Staggered animation
export const StaggeredAnimation: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      {[0, 1, 2, 3, 4].map((index) => (
        <AnimatedCheck
          key={index}
          index={index}
          staggerDelay={0.15}
          autoAnimate
          className="w-8 h-8"
        />
      ))}
    </div>
  ),
}

// In list context
export const InListContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {[
        'Real-time compliance monitoring',
        'Automated report generation',
        'Risk assessment tools',
        'Regulatory updates tracking',
      ].map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <AnimatedCheck
            index={index}
            staggerDelay={0.15}
            autoAnimate
          />
          <span className="text-dark">{item}</span>
        </div>
      ))}
    </div>
  ),
}

// Custom styling with wrapper
export const WithBackground: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
        <AnimatedCheck className="w-5 h-5" autoAnimate />
      </div>
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <AnimatedCheck className="w-5 h-5" color="#22C55E" autoAnimate />
      </div>
      <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
        <AnimatedCheck className="w-5 h-5" color="white" autoAnimate />
      </div>
    </div>
  ),
}

// Static vs animated comparison
export const StaticVsAnimated: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="text-center">
        <AnimatedCheck autoAnimate={false} className="w-8 h-8 mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Static</p>
      </div>
      <div className="text-center">
        <AnimatedCheck autoAnimate className="w-8 h-8 mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Animated</p>
      </div>
    </div>
  ),
}
