import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, userEvent } from 'storybook/test'
import { Input } from './input'

const meta = {
  title: 'Components/Input',
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
    <div className="w-[400px] space-y-4 p-6 border border-dashed border-slate-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold text-dark">Contact Form</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Name</label>
        <Input placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Email</label>
        <Input type="email" placeholder="john@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Phone</label>
        <Input type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  ),
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
