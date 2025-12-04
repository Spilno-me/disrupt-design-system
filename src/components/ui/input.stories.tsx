import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Default Input
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// Email Input
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
};

// Password Input
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
  },
};

// With Value
export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <label className="text-sm font-medium text-dark">Email Address</label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
};

// Form Example
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
};

// All Input Types
export const AllTypes: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Text</label>
        <Input type="text" placeholder="Text input" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Email</label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Number</label>
        <Input type="number" placeholder="123" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Date</label>
        <Input type="date" />
      </div>
    </div>
  ),
};
