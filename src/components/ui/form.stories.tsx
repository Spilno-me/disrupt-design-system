import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './form'
import { Input } from './input'
import { Checkbox } from './checkbox'
import { Button } from './button'

const meta: Meta = {
  title: 'Utilities/Form',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Form - Utility System

**Classification:** Utility System / Infrastructure (NOT a Core Component)

## What is Form?

Form is a composition helper system built on top of [react-hook-form](https://react-hook-form.com/). It provides context and utilities to connect core UI components (Input, Label, Checkbox, etc.) with form validation and state management.

## Architecture

### Core Components (Atoms):
Form utilities wrap these core atoms:
- [\`<Input />\`](?path=/docs/core-input--docs) - Standalone text input primitive
- [\`<Label />\`](?path=/docs/core-label--docs) - Standalone label primitive
- [\`<Checkbox />\`](?path=/docs/core-checkbox--docs) - Standalone checkbox primitive
- [\`<Textarea />\`](?path=/docs/core-textarea--docs) - Standalone textarea primitive
- [\`<Select />\`](?path=/docs/core-select--docs) - Standalone select primitive

### Form Utilities (Infrastructure):
- \`<Form>\` - Context provider that wraps react-hook-form
- \`<FormItem>\` - Layout wrapper (\`<div>\`) for form fields
- \`<FormLabel>\` - Wraps \`<Label>\` + connects to form context
- \`<FormControl>\` - Passes field props to Input/Checkbox/etc.
- \`<FormMessage>\` - Displays validation errors
- \`<FormDescription>\` - Helper text for fields
- \`<FormField>\` - Connects individual fields to react-hook-form

## Why is Form a Utility System?

1. **Not a UI Primitive**: Form doesn't render any unique UI. It wraps existing atoms.
2. **Infrastructure Role**: Provides context, validation, and state management.
3. **Composition Helper**: Helps you BUILD form molecules (LoginForm, ContactForm) from atoms.
4. **No testId Generation**: Form utilities don't auto-generate testIds like molecules do.

## Form Layout Pattern

**CRITICAL: Buttons in forms must ALWAYS be right-aligned:**

\`\`\`tsx
<form>
  {/* Form fields... */}
  <div className="flex justify-end">
    <Button type="submit">Submit</Button>
  </div>
</form>
\`\`\`

This creates consistent UX across all forms in the application.

## Component Hierarchy

\`\`\`
ATOMS (Core Components):
  ├─ Input
  ├─ Label
  └─ Checkbox
      ↓
UTILITIES (Infrastructure):
  └─ Form (wraps atoms with validation)
      ↓
MOLECULES (Business Components):
  ├─ LoginForm
  ├─ ContactForm
  └─ LeadFilterForm
\`\`\`

## See Also
For the actual UI primitives and their AllStates stories, see:
- [\`Input\`](?path=/docs/core-input--docs) - Text input atom
- [\`Label\`](?path=/docs/core-label--docs) - Label atom
- [\`Checkbox\`](?path=/docs/core-checkbox--docs) - Checkbox atom
- [\`Button\`](?path=/docs/core-button--docs) - Button atom (for form submission)
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Form item components showcase (without react-hook-form)
export const FormItemShowcase: Story = {
  render: () => (
    <div className="w-[350px] space-y-6">
      {/* Normal state */}
      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm leading-none font-medium">
          Email
        </label>
        <Input placeholder="Enter your email" />
        <p className="text-muted-foreground text-sm">
          We'll never share your email.
        </p>
      </div>

      {/* Error state */}
      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm leading-none font-medium text-destructive">
          Password
        </label>
        <Input placeholder="Enter password" aria-invalid="true" />
        <p className="text-destructive text-sm">
          Password must be at least 8 characters.
        </p>
      </div>
    </div>
  ),
}

// Basic form example with react-hook-form
function BasicFormExample() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
  })

  const onSubmit = (data: { username: string; email: string }) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="username"
          rules={{ required: 'Username is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export const BasicForm: Story = {
  render: () => <BasicFormExample />,
}

// Form with validation errors
function ValidationErrorsExample() {
  const form = useForm({
    defaultValues: {
      email: 'invalid-email',
      password: '123',
    },
    mode: 'all',
  })

  // Trigger validation on mount
  form.trigger()

  return (
    <Form {...form}>
      <form className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export const WithValidationErrors: Story = {
  render: () => <ValidationErrorsExample />,
}

// Form with checkbox
function CheckboxFormExample() {
  const form = useForm({
    defaultValues: {
      terms: false,
      marketing: false,
    },
  })

  return (
    <Form {...form}>
      <form className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="terms"
          rules={{ required: 'You must accept the terms' }}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marketing emails</FormLabel>
                <FormDescription>
                  Receive emails about new products and features.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export const WithCheckboxes: Story = {
  render: () => <CheckboxFormExample />,
}

// Contact form example
function ContactFormExample() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  return (
    <Form {...form}>
      <form className="w-[400px] space-y-6">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          rules={{ required: 'Message is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <textarea
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Your message..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant="contact">Send Message</Button>
        </div>
      </form>
    </Form>
  )
}

export const ContactForm: Story = {
  render: () => <ContactFormExample />,
}

// Login Form Example (showcasing Form + Input + Button atoms)
function LoginFormExample() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: { email: string; password: string }) => {
    console.log('Login submitted:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Sign In</Button>
        </div>
      </form>
    </Form>
  )
}

export const LoginForm: Story = {
  render: () => <LoginFormExample />,
}
