import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ForgotPasswordDialog } from "./ForgotPasswordDialog"
import { Button } from "../ui/button"

const meta: Meta<typeof ForgotPasswordDialog> = {
  title: "Shared/Auth/ForgotPasswordDialog",
  component: ForgotPasswordDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the dialog is open",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state for submit button",
    },
  },
}

export default meta
type Story = StoryObj<typeof ForgotPasswordDialog>

// Interactive story with controlled state
function ForgotPasswordDialogDemo({
  isLoading = false,
}: {
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Forgot password?</Button>
      <ForgotPasswordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => {
          console.log("Form submitted:", values)
        }}
        isLoading={isLoading}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <ForgotPasswordDialogDemo />,
}

export const Loading: Story = {
  render: () => <ForgotPasswordDialogDemo isLoading />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onSubmit: (values) => {
      console.log("Form submitted:", values)
    },
    onOpenChange: () => {},
  },
}
