import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import { COLORS } from '../../constants/designTokens'

const meta = {
  title: 'Core/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    shape: {
      control: 'select',
      options: ['default', 'pill'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

// Default Badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

// Pill Badge
export const Pill: Story = {
  args: {
    children: 'Pill Badge',
    shape: 'pill',
  },
}

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

// Pill Variants
export const PillVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge shape="pill" variant="default">Default Pill</Badge>
      <Badge shape="pill" variant="secondary">Secondary Pill</Badge>
      <Badge shape="pill" variant="destructive">Destructive Pill</Badge>
      <Badge shape="pill" variant="outline">Outline Pill</Badge>
    </div>
  ),
}

// Strategic Advisory Badge (as used in website)
export const StrategicAdvisory: Story = {
  render: () => (
    <Badge
      shape="pill"
      className="text-[10px] sm:text-xs font-semibold"
      style={{ backgroundColor: COLORS.circleRed, color: 'white', borderColor: 'transparent' }}
    >
      STRATEGIC ADVISORY ADD-ON
    </Badge>
  ),
}
