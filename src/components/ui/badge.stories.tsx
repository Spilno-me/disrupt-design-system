import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'Core/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ATOM

Small status indicator or label. Supports multiple variants (success, warning, destructive) and shapes (default, pill).`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
    },
    shape: {
      control: 'select',
      options: ['default', 'pill'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

// Default Badge (for Controls panel)
export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">All Variants (Default Shape)</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">All Variants (Pill Shape)</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" shape="pill">Default</Badge>
          <Badge variant="secondary" shape="pill">Secondary</Badge>
          <Badge variant="destructive" shape="pill">Destructive</Badge>
          <Badge variant="outline" shape="pill">Outline</Badge>
          <Badge variant="success" shape="pill">Success</Badge>
          <Badge variant="warning" shape="pill">Warning</Badge>
          <Badge variant="info" shape="pill">Info</Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">All Sizes</h4>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior - Click to See)</h4>
        <div className="flex flex-wrap gap-3">
          <Badge asChild>
            <button type="button">Focusable Badge (Click Me)</button>
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">With Icons</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Active
          </Badge>
          <Badge variant="destructive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            Error
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// Strategic Advisory Badge (as used in website)
export const StrategicAdvisory: Story = {
  render: () => (
    <Badge
      shape="pill"
      className="text-[10px] sm:text-xs font-semibold bg-feature-advice text-white border-transparent"
    >
      STRATEGIC ADVISORY ADD-ON
    </Badge>
  ),
}
