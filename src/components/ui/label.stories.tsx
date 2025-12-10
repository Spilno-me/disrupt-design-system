import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Label> = {
  title: 'Core/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

// Basic label
export const Default: Story = {
  args: {
    children: 'Email address',
  },
}

// Label with input
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
}

// Label with required indicator
export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="name">
        Full Name <span className="text-destructive">*</span>
      </Label>
      <Input id="name" placeholder="John Doe" />
    </div>
  ),
}

// Label with checkbox
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

// Disabled label
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5 group" data-disabled="true">
      <Label htmlFor="disabled-input">Disabled Field</Label>
      <Input id="disabled-input" disabled placeholder="Cannot edit" />
    </div>
  ),
}

// Label with helper text
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="password">Password</Label>
      <Input type="password" id="password" placeholder="Enter password" />
      <p className="text-xs text-muted-foreground">
        Password must be at least 8 characters long.
      </p>
    </div>
  ),
}

// Multiple labels in a form
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="John" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Doe" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="company">
          Company <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id="company" placeholder="Acme Inc." />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
    </div>
  ),
}

// Label with icon
export const WithIcon: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email-icon" className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Email Address
      </Label>
      <Input type="email" id="email-icon" placeholder="you@example.com" />
    </div>
  ),
}

// Label sizes comparison
export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label className="text-xs">Extra Small Label</Label>
        <Input placeholder="xs" />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-sm">Small Label (default)</Label>
        <Input placeholder="sm" />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-base">Base Label</Label>
        <Input placeholder="base" />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-lg">Large Label</Label>
        <Input placeholder="lg" />
      </div>
    </div>
  ),
}
