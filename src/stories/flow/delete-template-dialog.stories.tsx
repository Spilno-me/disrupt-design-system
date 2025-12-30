/// <reference types="@testing-library/jest-dom" />
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, vi } from 'vitest'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { DeleteTemplateDialog, type EntityTemplate, type DeleteTemplateDialogProps } from '../../flow'
import { Button } from '../../components/ui/button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
  IPhoneMobileFrame,
} from '../_infrastructure'

/**
 * DeleteTemplateDialog - Confirmation dialog for deleting entity templates.
 *
 * ## Features
 * - Warning message with impact description
 * - Template info display (code, version)
 * - System templates show "cannot delete" message
 * - Responsive: Bottom sheet on mobile, dialog on desktop
 *
 * ## Behavior
 * - Custom templates: Shows delete confirmation with warning
 * - System templates: Shows "cannot delete" message with close button
 *
 * ## Usage
 * ```tsx
 * const [templateToDelete, setTemplateToDelete] = useState<EntityTemplate | null>(null)
 *
 * <DeleteTemplateDialog
 *   template={templateToDelete}
 *   open={!!templateToDelete}
 *   onOpenChange={(open) => !open && setTemplateToDelete(null)}
 *   onConfirm={async (id) => {
 *     await api.deleteTemplate(id)
 *   }}
 * />
 * ```
 */
const meta: Meta<typeof DeleteTemplateDialog> = {
  title: 'Flow/Configuration/DeleteTemplateDialog',
  component: DeleteTemplateDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Confirmation dialog for deleting templates with system template protection.'
        ),
      },
    },
  },
  args: {
    onConfirm: vi.fn(),
  },
}

export default meta
type Story = StoryObj<typeof DeleteTemplateDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const CUSTOM_TEMPLATE: EntityTemplate = {
  id: 'tpl-custom-001',
  name: 'Safety Inspection Checklist',
  code: 'safety-inspection',
  category: 'inspection',
  version: 2,
  isSystem: false,
  businessKeyTemplate: 'SI-{{date}}-{{sequence}}',
  jsonSchema: '{}',
  createdAt: '2025-11-15T10:30:00Z',
  updatedAt: '2025-12-20T14:45:00Z',
  description: 'Custom safety inspection template.',
  fieldCount: 5,
}

const SYSTEM_TEMPLATE: EntityTemplate = {
  id: 'tpl-system-001',
  name: 'Standard Incident Report',
  code: 'standard-incident',
  category: 'incident',
  version: 5,
  isSystem: true,
  businessKeyTemplate: 'INC-{{sequence}}',
  jsonSchema: '{}',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-12-01T12:00:00Z',
  description: 'System-provided incident template.',
  fieldCount: 10,
}

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  template: EntityTemplate
  onConfirm?: (id: string) => Promise<void>
  buttonLabel?: string
}

function DialogWrapper({ template, onConfirm, buttonLabel = 'Delete Template' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <DeleteTemplateDialog
        template={template}
        open={open}
        onOpenChange={setOpen}
        onConfirm={onConfirm}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Delete a custom template - shows confirmation dialog.
 */
export const CustomTemplate: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => (
    <DialogWrapper
      template={CUSTOM_TEMPLATE}
      onConfirm={args.onConfirm}
      buttonLabel="Delete Custom Template"
    />
  ),
}

/**
 * Attempt to delete a system template - shows "cannot delete" message.
 */
export const SystemTemplate: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => (
    <DialogWrapper
      template={SYSTEM_TEMPLATE}
      onConfirm={args.onConfirm}
      buttonLabel="Delete System Template"
    />
  ),
}

/**
 * Custom template dialog opened by default - delete confirmation.
 */
export const OpenByDefault: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={CUSTOM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onConfirm={args.onConfirm}
      />
    )
  },
}

/**
 * System template dialog opened - cannot delete message.
 */
export const SystemTemplateOpen: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={SYSTEM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onConfirm={args.onConfirm}
      />
    )
  },
}

/**
 * Interaction test: Delete button triggers onConfirm.
 */
export const ConfirmDelete: Story = {
  args: {
    onConfirm: vi.fn(),
  },
  render: (args: Partial<DeleteTemplateDialogProps>) => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={CUSTOM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onConfirm={args.onConfirm}
      />
    )
  },
  play: async ({ args }: { args: Partial<DeleteTemplateDialogProps> }) => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Warning message should be visible
    const warningText = body.getByText(/delete.*permanently/i)
    await expect(warningText).toBeVisible()

    // Template code should be visible
    const codeElement = body.getByText('safety-inspection')
    await expect(codeElement).toBeVisible()

    // Find delete button by test ID
    const deleteButton = body.getByTestId(`delete-template-confirm-${CUSTOM_TEMPLATE.id}`)
    await expect(deleteButton).toBeEnabled()

    // Click delete
    await userEvent.click(deleteButton)

    // onConfirm should have been called
    await expect(args.onConfirm).toHaveBeenCalledWith(CUSTOM_TEMPLATE.id)
  },
}

/**
 * Interaction test: Cancel button closes dialog.
 */
export const CancelDelete: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={CUSTOM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onConfirm={args.onConfirm}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find cancel button by test ID
    const cancelButton = body.getByTestId(`delete-template-cancel-${CUSTOM_TEMPLATE.id}`)
    await expect(cancelButton).toBeEnabled()

    // Click cancel
    await userEvent.click(cancelButton)
  },
}

/**
 * Interaction test: System template shows close button only.
 */
export const SystemTemplateCloseOnly: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={SYSTEM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onConfirm={args.onConfirm}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // "Cannot delete" message should be visible
    const message = body.getByText(/cannot delete system template/i)
    await expect(message).toBeVisible()

    // Close button should exist (not delete button)
    const closeButton = body.getByTestId(`delete-template-close-${SYSTEM_TEMPLATE.id}`)
    await expect(closeButton).toBeVisible()
  },
}

/**
 * Mobile view - bottom sheet presentation.
 */
export const MobileFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPhoneMobileFrame
        storyId="flow-configuration-deletetemplatedialog--open-by-default"
        model="iphone16promax"
        scale={1}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile view renders as bottom sheet with touch-friendly buttons.',
      },
    },
  },
}

/**
 * All states comparison view.
 */
export const AllStates: Story = {
  render: (args: Partial<DeleteTemplateDialogProps>) => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection
        title="Custom Template"
        description="Shows delete confirmation with warning"
      >
        <DialogWrapper
          template={CUSTOM_TEMPLATE}
          onConfirm={args.onConfirm}
          buttonLabel="Delete Custom Template"
        />
      </StorySection>

      <StorySection
        title="System Template"
        description="Shows 'cannot delete' message"
      >
        <DialogWrapper
          template={SYSTEM_TEMPLATE}
          onConfirm={args.onConfirm}
          buttonLabel="Delete System Template"
        />
      </StorySection>
    </div>
  ),
}
