import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'Core/Textarea',
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
      <label className="text-sm font-medium text-primary">Message</label>
      <Textarea placeholder="Tell us what you need..." rows={4} />
    </div>
  ),
};

// Contact Form Textarea
export const ContactForm: Story = {
  render: () => (
    <div className="w-[500px] space-y-4 p-6 border border-dashed border-default rounded-lg bg-white">
      <h3 className="text-lg font-bold text-primary">Get in Touch</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Your Message *</label>
        <Textarea
          placeholder="Tell us about your project, goals, and how we can help..."
          rows={6}
        />
        <p className="text-xs text-muted">Please provide as much detail as possible.</p>
      </div>
    </div>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-6 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Default (Empty)</h4>
        <Textarea placeholder="Enter your message..." rows={3} />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">With Value</h4>
        <Textarea
          defaultValue="This is sample text content in a textarea component."
          rows={3}
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Focus State (Simulated)</h4>
        <Textarea
          placeholder="Focused textarea"
          rows={3}
          className="border-accent ring-[3px] ring-accent/20"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Error State (aria-invalid)</h4>
        <Textarea
          placeholder="Invalid input"
          aria-invalid="true"
          rows={3}
          defaultValue="Error state example"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Disabled State</h4>
        <Textarea
          placeholder="Disabled textarea"
          disabled
          rows={3}
          defaultValue="Cannot edit this text"
        />
      </div>
    </div>
  ),
};
