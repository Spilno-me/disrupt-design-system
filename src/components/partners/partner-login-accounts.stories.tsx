import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { PartnerLoginAccountsPage, MOCK_LOGIN_ACCOUNTS, LoginAccount } from "./PartnerLoginAccountsPage"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { CreateLoginAccountDialog } from "./CreateLoginAccountDialog"
import { DeleteLoginAccountDialog } from "./DeleteLoginAccountDialog"

// =============================================================================
// PARTNER LOGIN ACCOUNTS PAGE
// =============================================================================

const meta: Meta<typeof PartnerLoginAccountsPage> = {
  title: "Partner/Components/LoginAccountsPage",
  component: PartnerLoginAccountsPage,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "cream",
      values: [
        { name: "cream", value: "#FBFBF3" },
        { name: "white", value: "#FFFFFF" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    partnerName: {
      control: "text",
      description: "Name of the partner organization",
    },
    loading: {
      control: "boolean",
      description: "Loading state for the data table",
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnerLoginAccountsPage>

// Default story with mock data
export const Default: Story = {
  args: {
    partnerName: "Drax Industries",
    partnerId: "DRX-2024-001",
    loginAccounts: MOCK_LOGIN_ACCOUNTS,
  },
  render: (args) => (
    <div className="max-w-6xl mx-auto">
      <PartnerLoginAccountsPage
        {...args}
        onBackClick={() => console.log("Back to partners clicked")}
        onCreateLoginAccount={(data) => {
          console.log("Create login account:", data)
          return Promise.resolve()
        }}
        onResetPassword={(account, mode, password) => {
          console.log("Reset password:", { account, mode, password })
          return Promise.resolve()
        }}
        onDeleteLoginAccount={(account) => {
          console.log("Delete login account:", account)
          return Promise.resolve()
        }}
      />
    </div>
  ),
}

// With multiple accounts
export const MultipleAccounts: Story = {
  args: {
    partnerName: "Drax Industries",
    partnerId: "DRX-2024-001",
    loginAccounts: [
      ...MOCK_LOGIN_ACCOUNTS,
      {
        id: "2",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@draxindustries.com.au",
        status: "active" as const,
        createdAt: new Date("2024-09-20"),
      },
      {
        id: "3",
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@draxindustries.com.au",
        status: "inactive" as const,
        createdAt: new Date("2024-07-10"),
      },
      {
        id: "4",
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.d@draxindustries.com.au",
        status: "pending" as const,
        createdAt: new Date("2024-10-01"),
      },
    ],
  },
  render: (args) => (
    <div className="max-w-6xl mx-auto">
      <PartnerLoginAccountsPage
        {...args}
        onBackClick={() => console.log("Back to partners clicked")}
        onCreateLoginAccount={(data) => {
          console.log("Create login account:", data)
          return Promise.resolve()
        }}
        onResetPassword={(account, mode, password) => {
          console.log("Reset password:", { account, mode, password })
          return Promise.resolve()
        }}
        onDeleteLoginAccount={(account) => {
          console.log("Delete login account:", account)
          return Promise.resolve()
        }}
      />
    </div>
  ),
}

// Empty state
export const EmptyState: Story = {
  args: {
    partnerName: "New Partner Inc",
    partnerId: "NPI-2024-001",
    loginAccounts: [],
  },
  render: (args) => (
    <div className="max-w-6xl mx-auto">
      <PartnerLoginAccountsPage
        {...args}
        onBackClick={() => console.log("Back to partners clicked")}
      />
    </div>
  ),
}

// Loading state
export const Loading: Story = {
  args: {
    partnerName: "Drax Industries",
    partnerId: "DRX-2024-001",
    loginAccounts: MOCK_LOGIN_ACCOUNTS,
    loading: true,
  },
  render: (args) => (
    <div className="max-w-6xl mx-auto">
      <PartnerLoginAccountsPage
        {...args}
        onBackClick={() => console.log("Back to partners clicked")}
      />
    </div>
  ),
}

// =============================================================================
// RESET PASSWORD DIALOG
// =============================================================================

export const ResetPasswordDialogStory: StoryObj<typeof ResetPasswordDialog> = {
  name: "Reset Password Dialog",
  render: () => {
    const [open, setOpen] = useState(true)
    const account: LoginAccount = {
      id: "1",
      firstName: "James",
      lastName: "Smith",
      email: "james@draxindustries.com.au",
      status: "active",
      createdAt: new Date("2024-08-15"),
    }

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-accent-strong text-white rounded-md"
        >
          Open Reset Password Dialog
        </button>
        <ResetPasswordDialog
          open={open}
          onOpenChange={setOpen}
          account={account}
          onConfirm={(mode, password) => {
            console.log("Reset password:", { mode, password })
            return Promise.resolve()
          }}
        />
      </div>
    )
  },
}

// =============================================================================
// CREATE LOGIN ACCOUNT DIALOG
// =============================================================================

export const CreateLoginAccountDialogStory: StoryObj<typeof CreateLoginAccountDialog> = {
  name: "Create Login Account Dialog",
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-accent-strong text-white rounded-md"
        >
          Open Create Login Account Dialog
        </button>
        <CreateLoginAccountDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={(data) => {
            console.log("Create account:", data)
            return Promise.resolve()
          }}
        />
      </div>
    )
  },
}

// =============================================================================
// DELETE LOGIN ACCOUNT DIALOG
// =============================================================================

export const DeleteLoginAccountDialogStory: StoryObj<typeof DeleteLoginAccountDialog> = {
  name: "Delete Login Account Dialog",
  render: () => {
    const [open, setOpen] = useState(true)
    const account: LoginAccount = {
      id: "1",
      firstName: "James",
      lastName: "Smith",
      email: "james@draxindustries.com.au",
      status: "active",
      createdAt: new Date("2024-08-15"),
    }

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-error text-white rounded-md"
        >
          Open Delete Login Account Dialog
        </button>
        <DeleteLoginAccountDialog
          open={open}
          onOpenChange={setOpen}
          account={account}
          onConfirm={(account) => {
            console.log("Delete account:", account)
            return Promise.resolve()
          }}
        />
      </div>
    )
  },
}
