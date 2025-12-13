import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, userEvent } from 'storybook/test'
import { Input } from './input'

const meta = {
  title: 'Core/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof Input>

// Default Input
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

// Disabled
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

// Form Example (matches website contact form)
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-4 p-6 border border-dashed border-default rounded-lg bg-white">
      <h3 className="text-lg font-bold text-primary">Contact Form</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Name</label>
        <Input placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Email</label>
        <Input type="email" placeholder="john@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Phone</label>
        <Input type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  ),
}

// Input Types
export const AllTypes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Text</label>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Email</label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Number</label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Date</label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">File</label>
        <Input type="file" />
      </div>
    </div>
  ),
}

// Error State
export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid email',
    'aria-invalid': true,
  },
}

// Interactive typing test
export const WithTyping: Story = {
  args: {
    placeholder: 'Type here...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type here...')

    // Clear and type new text
    await userEvent.clear(input)
    await userEvent.type(input, 'Hello, World!', { delay: 50 })

    // Verify the value
    await expect(input).toHaveValue('Hello, World!')
  },
}
