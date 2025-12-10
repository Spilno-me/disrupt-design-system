import type { Meta, StoryObj } from "@storybook/react"
import { ForgotPasswordForm } from "./ForgotPasswordForm"

const meta: Meta<typeof ForgotPasswordForm> = {
  title: "Shared/Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Loading state for submit button",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-[10px] border border-default bg-surface p-6 shadow-xs">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {
  args: {
    onSubmit: (values) => {
      console.log("Form submitted:", values)
    },
    onBackToLogin: () => {
      console.log("Back to login clicked")
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}

export const WithoutBackButton: Story = {
  args: {
    onSubmit: (values) => {
      console.log("Form submitted:", values)
    },
  },
}
