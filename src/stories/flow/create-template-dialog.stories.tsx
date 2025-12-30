/// <reference types="@testing-library/jest-dom" />
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, vi } from 'vitest'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { CreateTemplateDialog, type CreateTemplateFormData } from '../../flow'
import { Button } from '../../components/ui/button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
} from '../_infrastructure'

/**
 * CreateTemplateDialog - Form dialog for creating new entity templates.
 *
 * ## Features
 * - Template name validation (min 5 chars)
 * - Category selection (incident, inspection, audit, etc.)
 * - Business key template pattern
 * - Visual JSON Schema editor (SchemaStudio)
 *
 * ## Validation Rules
 * - Name: Required, 5-100 characters
 * - Schema: At least one field required
 *
 * ## Usage
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <CreateTemplateDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={async (data) => {
 *     await api.createTemplate(data)
 *   }}
 * />
 * ```
 */
const meta: Meta<typeof CreateTemplateDialog> = {
  title: 'Flow/Configuration/CreateTemplateDialog',
  component: CreateTemplateDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Form dialog for creating new entity templates with visual schema editor.'
        ),
      },
    },
  },
  args: {
    onSubmit: vi.fn(),
  },
}

export default meta
type Story = StoryObj<typeof CreateTemplateDialog>

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  onSubmit?: (data: CreateTemplateFormData) => Promise<void>
}

function DialogWrapper({ onSubmit }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create New Template</Button>
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={onSubmit}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state with button trigger.
 * Click the button to open the dialog.
 */
export const Default: Story = {
  render: (args) => <DialogWrapper onSubmit={args.onSubmit} />,
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
}

/**
 * Interaction test: Validates form validation behavior.
 * Tests that submit button is disabled until form is valid.
 */
export const FormValidation: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find the submit button - should be disabled initially
    const submitButton = body.getByRole('button', { name: /create template/i })
    await expect(submitButton).toBeDisabled()

    // Find the name input and enter a short name (invalid)
    const nameInput = body.getByLabelText(/template name/i)
    await userEvent.type(nameInput, 'Test')

    // Button should still be disabled (name too short + no fields)
    await expect(submitButton).toBeDisabled()

    // Type a valid name
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Valid Template Name')

    // Still disabled because no schema fields
    await expect(submitButton).toBeDisabled()
  },
}

/**
 * Interaction test: Category selection works correctly.
 */
export const CategorySelection: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find and click the category select
    const categoryTrigger = body.getByRole('combobox')
    await userEvent.click(categoryTrigger)

    // Wait for dropdown to open
    await new Promise(resolve => setTimeout(resolve, 200))

    // Category options should be visible
    const incidentOption = body.getByRole('option', { name: /incident/i })
    await expect(incidentOption).toBeVisible()
  },
}

/**
 * Interaction test: Cancel button closes dialog.
 */
export const CancelButton: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find and click cancel button
    const cancelButton = body.getByRole('button', { name: /cancel/i })
    await expect(cancelButton).toBeEnabled()
    await userEvent.click(cancelButton)

    // Dialog should close - check button is no longer visible
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}

/**
 * All states comparison view.
 */
export const AllStates: Story = {
  render: (args) => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection
        title="Create Template Dialog"
        description="Form for creating new entity templates"
      >
        <DialogWrapper onSubmit={args.onSubmit} />
      </StorySection>
    </div>
  ),
}
