import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
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
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Default Badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// Secondary Badge
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

// Destructive Badge
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

// Outline Badge
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Badge with Icon
export const WithIcon: Story = {
  render: () => (
    <Badge>
      <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Verified
    </Badge>
  ),
};

// Most Popular Badge (From Pricing Cards)
export const MostPopular: Story = {
  render: () => (
    <Badge className="bg-[#F70D1A] text-white border-transparent">
      Most popular
    </Badge>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge className="bg-[#F70D1A] text-white border-transparent">Ferrari Red</Badge>
      <Badge className="bg-teal-800 text-white border-transparent">Teal</Badge>
      <Badge className="border-dashed border-[#08A4BD] bg-transparent text-[#08A4BD]">Dashed Teal</Badge>
    </div>
  ),
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge className="bg-[#22C55E] text-white border-transparent">Active</Badge>
      <Badge className="bg-[#EAB308] text-white border-transparent">Pending</Badge>
      <Badge className="bg-[#F70D1A] text-white border-transparent">Error</Badge>
      <Badge className="bg-[#CBD5E1] text-[#2D3142] border-transparent">Inactive</Badge>
    </div>
  ),
};
