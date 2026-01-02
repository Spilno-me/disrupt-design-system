/**
 * Corrective Actions - Dialog Stories
 *
 * Stories for the form dialogs (extension, closure, completion, create).
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { ExtensionRequestDialog } from '../../../flow/components/corrective-actions/ExtensionRequestDialog'
import { ClosureApprovalDialog } from '../../../flow/components/corrective-actions/ClosureApprovalDialog'
import { CompletionFormDialog } from '../../../flow/components/corrective-actions/CompletionFormDialog'
import { CreateCorrectiveActionSheet } from '../../../flow/components/corrective-actions/CreateCorrectiveActionSheet'
import {
  mockCorrectiveActions,
  mockUsers,
  mockDepartments,
  mockLocations,
  mockActionTypes,
  mockCategories,
  mockSourceTypes,
} from '../../../flow/data/mockCorrectiveActions'

// =============================================================================
// EXTENSION REQUEST DIALOG
// =============================================================================

const extensionMeta: Meta<typeof ExtensionRequestDialog> = {
  title: 'Flow/Corrective Actions/Dialogs/ExtensionRequest',
  component: ExtensionRequestDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default extensionMeta

export const ExtensionRequestDefault: StoryObj<typeof ExtensionRequestDialog> = {
  render: () => {
    const [open, setOpen] = useState(false)
    const action = mockCorrectiveActions[0]

    return (
      <>
        <Button onClick={() => setOpen(true)}>Request Extension</Button>
        <ExtensionRequestDialog
          open={open}
          onOpenChange={setOpen}
          action={action}
          onSubmit={async (data) => {
            console.log('Extension request:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
        />
      </>
    )
  },
}

// =============================================================================
// CLOSURE APPROVAL DIALOG
// =============================================================================

export const ClosureApprovalDefault: StoryObj<typeof ClosureApprovalDialog> = {
  render: () => {
    const [open, setOpen] = useState(false)
    const completedAction = mockCorrectiveActions.find((a) => a.status === 'completed')!

    return (
      <>
        <Button onClick={() => setOpen(true)}>Review Closure</Button>
        <ClosureApprovalDialog
          open={open}
          onOpenChange={setOpen}
          action={completedAction}
          onApprove={async (data) => {
            console.log('Approved:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
          onReject={async (data) => {
            console.log('Rejected:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
        />
      </>
    )
  },
}

// =============================================================================
// COMPLETION FORM DIALOG
// =============================================================================

export const CompletionFormDefault: StoryObj<typeof CompletionFormDialog> = {
  render: () => {
    const [open, setOpen] = useState(false)
    const inProgressAction = mockCorrectiveActions.find(
      (a) => a.status === 'in-progress'
    )!

    return (
      <>
        <Button onClick={() => setOpen(true)}>Submit Completion</Button>
        <CompletionFormDialog
          open={open}
          onOpenChange={setOpen}
          action={inProgressAction}
          onSubmit={async (data) => {
            console.log('Completion submitted:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
        />
      </>
    )
  },
}

// =============================================================================
// CREATE CORRECTIVE ACTION SHEET
// =============================================================================

export const CreateSheetDefault: StoryObj<typeof CreateCorrectiveActionSheet> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Create Corrective Action</Button>
        <CreateCorrectiveActionSheet
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Create action:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
          actionTypes={mockActionTypes}
          categories={mockCategories}
          sourceTypes={mockSourceTypes}
          users={mockUsers}
          departments={mockDepartments}
          locations={mockLocations}
        />
      </>
    )
  },
}

export const CreateSheetMinimal: StoryObj<typeof CreateCorrectiveActionSheet> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Create (Minimal Options)</Button>
        <CreateCorrectiveActionSheet
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Create action:', data)
            await new Promise((r) => setTimeout(r, 1000))
          }}
          // No lookup data - shows minimal form
        />
      </>
    )
  },
}

// =============================================================================
// ALL DIALOGS OVERVIEW
// =============================================================================

export const AllDialogsOverview: StoryObj = {
  render: () => {
    const [extensionOpen, setExtensionOpen] = useState(false)
    const [closureOpen, setClosureOpen] = useState(false)
    const [completionOpen, setCompletionOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)

    const inProgressAction = mockCorrectiveActions.find(
      (a) => a.status === 'in-progress'
    )!
    const completedAction = mockCorrectiveActions.find(
      (a) => a.status === 'completed'
    )!

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setExtensionOpen(true)}>
            Extension Request
          </Button>
          <Button variant="outline" onClick={() => setClosureOpen(true)}>
            Closure Approval
          </Button>
          <Button variant="outline" onClick={() => setCompletionOpen(true)}>
            Submit Completion
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            Create New Action
          </Button>
        </div>

        <ExtensionRequestDialog
          open={extensionOpen}
          onOpenChange={setExtensionOpen}
          action={inProgressAction}
          onSubmit={async (data) => console.log('Extension:', data)}
        />

        <ClosureApprovalDialog
          open={closureOpen}
          onOpenChange={setClosureOpen}
          action={completedAction}
          onApprove={async (data) => console.log('Approved:', data)}
          onReject={async (data) => console.log('Rejected:', data)}
        />

        <CompletionFormDialog
          open={completionOpen}
          onOpenChange={setCompletionOpen}
          action={inProgressAction}
          onSubmit={async (data) => console.log('Completion:', data)}
        />

        <CreateCorrectiveActionSheet
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={async (data) => console.log('Create:', data)}
          actionTypes={mockActionTypes}
          categories={mockCategories}
          sourceTypes={mockSourceTypes}
          users={mockUsers}
          departments={mockDepartments}
          locations={mockLocations}
        />
      </div>
    )
  },
}
