import type { Meta, StoryObj } from '@storybook/react'
import { fn, expect, within, userEvent } from 'storybook/test'
import { ContactForm, ContactFormField } from './ContactForm'

const meta: Meta<typeof ContactForm> = {
  title: 'Website/Forms/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
  argTypes: {
    submitButtonText: {
      control: 'text',
      description: 'Submit button text',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is submitting',
    },
    showEffects: {
      control: 'boolean',
      description: 'Show glass/electric effect on inputs',
    },
  },
}

export default meta
type Story = StoryObj<typeof ContactForm>

// Default contact form
export const Default: Story = {
  args: {
    submitButtonText: 'Send Message',
    isSubmitting: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <ContactForm {...args} />
    </div>
  ),
}

// Book a demo form with play function for interaction testing
const demoFields: ContactFormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { name: 'email', label: 'Work Email', type: 'email', placeholder: 'john@company.com', required: true },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc.', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
]

export const BookDemo: Story = {
  args: {
    fields: demoFields,
    submitButtonText: 'Book a Demo',
    isSubmitting: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <ContactForm {...args} />
    </div>
  ),
}

// Filled form with play function demonstrating form interaction
export const FilledForm: Story = {
  args: {
    fields: demoFields,
    submitButtonText: 'Book a Demo',
    isSubmitting: false,
  },
  render: (args) => (
    <div className="w-[400px]">
      <ContactForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill out the form fields
    const firstNameInput = canvas.getByPlaceholderText('John')
    await userEvent.type(firstNameInput, 'Jane', { delay: 50 })

    const lastNameInput = canvas.getByPlaceholderText('Doe')
    await userEvent.type(lastNameInput, 'Smith', { delay: 50 })

    const emailInput = canvas.getByPlaceholderText('john@company.com')
    await userEvent.type(emailInput, 'jane.smith@example.com', { delay: 30 })

    const companyInput = canvas.getByPlaceholderText('Acme Inc.')
    await userEvent.type(companyInput, 'Tech Corp', { delay: 50 })

    const phoneInput = canvas.getByPlaceholderText('+1 (555) 000-0000')
    await userEvent.type(phoneInput, '+1 (555) 123-4567', { delay: 30 })

    // Verify inputs have values
    await expect(firstNameInput).toHaveValue('Jane')
    await expect(lastNameInput).toHaveValue('Smith')
    await expect(emailInput).toHaveValue('jane.smith@example.com')
    await expect(companyInput).toHaveValue('Tech Corp')
  },
}

// Simple contact form
const simpleFields: ContactFormField[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message...', required: true },
]

export const Simple: Story = {
  args: {
    fields: simpleFields,
    submitButtonText: 'Send',
    isSubmitting: false,
  },
  render: (args) => (
    <div className="w-[350px]">
      <ContactForm {...args} />
    </div>
  ),
}

// With privacy policy
export const WithPrivacyPolicy: Story = {
  args: {
    submitButtonText: 'Submit',
    isSubmitting: false,
    privacyPolicyLabel: (
      <>
        I agree to the{' '}
        <a href="#" className="text-accent hover:underline">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="#" className="text-accent hover:underline">
          Terms of Service
        </a>
      </>
    ),
  },
  render: (args) => (
    <div className="w-[400px]">
      <ContactForm {...args} />
    </div>
  ),
}

// Submitting state
export const Submitting: Story = {
  args: {
    submitButtonText: 'Send Message',
    isSubmitting: true,
  },
  render: (args) => (
    <div className="w-[400px]">
      <ContactForm {...args} />
    </div>
  ),
}

// In card context
export const InCard: Story = {
  render: (args) => (
    <div className="w-[450px] p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-xl font-bold text-primary mb-2">Get in Touch</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Fill out the form below and we'll get back to you within 24 hours.
      </p>
      <ContactForm
        {...args}
        submitButtonText="Send Message"
        privacyPolicyLabel="By submitting, you agree to our Privacy Policy."
      />
    </div>
  ),
}
