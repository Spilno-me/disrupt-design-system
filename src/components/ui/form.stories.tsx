import type { Meta, StoryObj } from '@storybook/react'
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
  title: 'Components/Form',
  parameters: {
    layout: 'centered',
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
        <Button type="submit">Submit</Button>
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
        <Button type="submit">Submit</Button>
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
        <Button type="submit">Submit</Button>
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
        <Button variant="contact" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  )
}

export const ContactForm: Story = {
  render: () => <ContactFormExample />,
}
