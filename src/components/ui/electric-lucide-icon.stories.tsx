import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { ElectricLucideIcon, ElectricLucideIconDemo, IconName } from './ElectricLucideIcon'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof ElectricLucideIcon> = {
  title: 'Website/Components/ElectricLucideIcon',
  component: ElectricLucideIcon,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Animated Lucide icon with electric particle effect on hover. Used in feature cards with colored circle backgrounds.'
        ),
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: ['automate', 'advice', 'adapt', 'scale'],
      description: 'Which icon to display',
    },
    size: {
      control: { type: 'number', min: 16, max: 96 },
      description: 'Size of the icon in pixels',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the electric effect is active',
    },
  },
}

export default meta
type Story = StoryObj<typeof ElectricLucideIcon>

// Default icon (inactive)
export const Default: Story = {
  args: {
    name: 'automate',
    size: 52,
    isActive: false,
  },
}

// Active with electric effect
export const Active: Story = {
  args: {
    name: 'automate',
    size: 52,
    isActive: true,
  },
}

// All icons
export const AllIcons: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="text-center">
        <ElectricLucideIcon name="automate" size={48} />
        <p className="text-sm text-muted-foreground mt-2">Automate</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="advice" size={48} />
        <p className="text-sm text-muted-foreground mt-2">Advice</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="adapt" size={48} />
        <p className="text-sm text-muted-foreground mt-2">Adapt</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="scale" size={48} />
        <p className="text-sm text-muted-foreground mt-2">Scale</p>
      </div>
    </div>
  ),
}

// Interactive hover demo
function HoverDemo() {
  const [hoveredIcon, setHoveredIcon] = useState<IconName | null>(null)

  const icons: IconName[] = ['automate', 'advice', 'adapt', 'scale']

  return (
    <div className="flex gap-8">
      {icons.map((name) => (
        <div
          key={name}
          className="cursor-pointer p-4 rounded-lg transition-colors hover:bg-muted/20"
          onMouseEnter={() => setHoveredIcon(name)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <ElectricLucideIcon
            name={name}
            size={48}
            isActive={hoveredIcon === name}
          />
        </div>
      ))}
    </div>
  )
}

export const HoverInteraction: Story = {
  render: () => <HoverDemo />,
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="text-center">
        <ElectricLucideIcon name="automate" size={24} isActive />
        <p className="text-sm text-muted-foreground mt-2">24px</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="automate" size={36} isActive />
        <p className="text-sm text-muted-foreground mt-2">36px</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="automate" size={48} isActive />
        <p className="text-sm text-muted-foreground mt-2">48px</p>
      </div>
      <div className="text-center">
        <ElectricLucideIcon name="automate" size={64} isActive />
        <p className="text-sm text-muted-foreground mt-2">64px</p>
      </div>
    </div>
  ),
}

// In colored circle context
function ColoredCircleDemo() {
  const [hoveredIcon, setHoveredIcon] = useState<IconName | null>(null)

  const icons: { name: IconName; color: string; label: string }[] = [
    { name: 'automate', color: '#2D6FE9', label: 'Automate' },
    { name: 'advice', color: '#E94242', label: 'Advice' },
    { name: 'adapt', color: '#F5B731', label: 'Adapt' },
    { name: 'scale', color: '#29B356', label: 'Scale' },
  ]

  return (
    <div className="flex gap-8 flex-wrap justify-center">
      {icons.map(({ name, color, label }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onMouseEnter={() => setHoveredIcon(name)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <div
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center transition-transform duration-300"
            style={{
              backgroundColor: color,
              transform: hoveredIcon === name ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <ElectricLucideIcon
              name={name}
              size={48}
              isActive={hoveredIcon === name}
            />
          </div>
          <span className="text-primary font-semibold">{label}</span>
        </div>
      ))}
    </div>
  )
}

export const InColoredCircles: Story = {
  render: () => <ColoredCircleDemo />,
}

// Full demo component
export const FullDemo: Story = {
  render: () => <ElectricLucideIconDemo />,
}

// On dark background
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-inverse-bg p-8 rounded-lg">
      <div className="flex gap-8">
        <ElectricLucideIcon name="automate" size={48} />
        <ElectricLucideIcon name="advice" size={48} />
        <ElectricLucideIcon name="adapt" size={48} isActive />
        <ElectricLucideIcon name="scale" size={48} isActive />
      </div>
    </div>
  ),
}

// Feature card context
export const InFeatureCard: Story = {
  render: () => (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm border">
      <div className="w-16 h-16 rounded-full bg-[#2D6FE9] flex items-center justify-center mb-4">
        <ElectricLucideIcon name="automate" size={36} isActive />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Automate Compliance</h3>
      <p className="text-muted-foreground">
        Streamline your environmental compliance workflows with intelligent automation.
      </p>
    </div>
  ),
}
