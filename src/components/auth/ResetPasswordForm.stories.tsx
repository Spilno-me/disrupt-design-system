import type { Meta, StoryObj } from "@storybook/react"
import { ResetPasswordForm } from "./ResetPasswordForm"

const meta: Meta<typeof ResetPasswordForm> = {
  title: "Shared/Auth/ResetPasswordForm",
  component: ResetPasswordForm,
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
type Story = StoryObj<typeof ResetPasswordForm>

export const Default: Story = {
  args: {
    onSubmit: (values) => {
      console.log("Form submitted:", values)
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}
