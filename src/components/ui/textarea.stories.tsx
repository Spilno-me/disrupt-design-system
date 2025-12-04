import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

// Default Textarea
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

// With Value
export const WithValue: Story = {
  args: {
    defaultValue: 'This is some sample text content that has been entered into the textarea.',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <label className="text-sm font-medium text-dark">Message</label>
      <Textarea placeholder="Tell us what you need..." rows={4} />
    </div>
  ),
};

// Contact Form Textarea
export const ContactForm: Story = {
  render: () => (
    <div className="w-[500px] space-y-4 p-6 border border-dashed border-slate-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold text-dark">Get in Touch</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Your Message *</label>
        <Textarea
          placeholder="Tell us about your project, goals, and how we can help..."
          rows={6}
        />
        <p className="text-xs text-muted">Please provide as much detail as possible.</p>
      </div>
    </div>
  ),
};

// Different Sizes
export const DifferentSizes: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Small (3 rows)</label>
        <Textarea placeholder="Small textarea..." rows={3} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Medium (5 rows)</label>
        <Textarea placeholder="Medium textarea..." rows={5} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark">Large (8 rows)</label>
        <Textarea placeholder="Large textarea..." rows={8} />
      </div>
    </div>
  ),
};
