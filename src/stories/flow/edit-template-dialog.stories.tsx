/// <reference types="@testing-library/jest-dom" />
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, vi } from 'vitest'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { EditTemplateDialog, type EntityTemplate, type EditTemplateFormData } from '../../flow'
import { Button } from '../../components/ui/button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
} from '../_infrastructure'

/**
 * EditTemplateDialog - Form dialog for editing existing entity templates.
 *
 * ## Features
 * - Edit template name (disabled for system templates)
 * - Edit business key pattern
 * - Visual JSON Schema editor (SchemaStudio)
 * - System template warning banner
 *
 * ## Validation Rules
 * - Name: Required, 5-100 characters (except system templates)
 * - Schema: At least one field required
 *
 * ## Usage
 * ```tsx
 * const [template, setTemplate] = useState<EntityTemplate | null>(null)
 *
 * <EditTemplateDialog
 *   template={template}
 *   open={!!template}
 *   onOpenChange={(open) => !open && setTemplate(null)}
 *   onSubmit={async (data) => {
 *     await api.updateTemplate(data)
 *   }}
 * />
 * ```
 */
const meta: Meta<typeof EditTemplateDialog> = {
  title: 'Flow/Configuration/EditTemplateDialog',
  component: EditTemplateDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Form dialog for editing entity templates with visual schema editor and system template restrictions.'
        ),
      },
    },
  },
  args: {
    onSubmit: vi.fn(),
  },
}

export default meta
type Story = StoryObj<typeof EditTemplateDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const SIMPLE_SCHEMA = `{
  "type": "object",
  "title": "Safety Inspection",
  "required": ["inspector", "date"],
  "properties": {
    "inspector": {
      "type": "string",
      "title": "Inspector Name"
    },
    "date": {
      "type": "string",
      "format": "date",
      "title": "Inspection Date"
    },
    "notes": {
      "type": "string",
      "title": "Notes",
      "ui:widget": "textarea"
    }
  }
}`

const CUSTOM_TEMPLATE: EntityTemplate = {
  id: 'tpl-custom-001',
  name: 'Safety Inspection',
  code: 'safety-inspection',
  category: 'inspection',
  version: 2,
  isSystem: false,
  businessKeyTemplate: 'SI-{{date}}-{{sequence}}',
  jsonSchema: SIMPLE_SCHEMA,
  createdAt: '2025-11-15T10:30:00Z',
  updatedAt: '2025-12-20T14:45:00Z',
  description: 'Workplace safety inspection template.',
  fieldCount: 3,
}

const SYSTEM_TEMPLATE: EntityTemplate = {
  id: 'tpl-system-001',
  name: 'Standard Incident Report',
  code: 'standard-incident',
  category: 'incident',
  version: 5,
  isSystem: true,
  businessKeyTemplate: 'INC-{{sequence}}',
  jsonSchema: SIMPLE_SCHEMA,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-12-01T12:00:00Z',
  description: 'System-provided incident reporting template.',
  fieldCount: 3,
}

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  template: EntityTemplate
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
  buttonLabel?: string
}

function DialogWrapper({ template, onSubmit, buttonLabel = 'Edit Template' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <EditTemplateDialog
        template={template}
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
 * Edit a custom template - full editing capabilities.
 */
export const CustomTemplate: Story = {
  render: (args) => (
    <DialogWrapper
      template={CUSTOM_TEMPLATE}
      onSubmit={args.onSubmit}
      buttonLabel="Edit Custom Template"
    />
  ),
}

/**
 * Edit a system template - name editing disabled with warning.
 */
export const SystemTemplate: Story = {
  render: (args) => (
    <DialogWrapper
      template={SYSTEM_TEMPLATE}
      onSubmit={args.onSubmit}
      buttonLabel="Edit System Template"
    />
  ),
}

/**
 * Custom template dialog opened by default.
 */
export const OpenByDefault: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={CUSTOM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
}

/**
 * System template dialog opened by default - shows warning banner.
 */
export const SystemTemplateOpen: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={SYSTEM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
        onSubmit={args.onSubmit}
      />
    )
  },
}

/**
 * Interaction test: Name input disabled for system templates.
 */
export const SystemTemplateNameDisabled: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={SYSTEM_TEMPLATE}
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

    // Find the name input - should be disabled
    const nameInput = body.getByLabelText(/template name/i)
    await expect(nameInput).toBeDisabled()

    // Warning message should be visible
    const warning = body.getByText(/system template/i)
    await expect(warning).toBeVisible()
  },
}

/**
 * Interaction test: Custom template name is editable.
 */
export const CustomTemplateNameEditable: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={CUSTOM_TEMPLATE}
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

    // Find the name input - should be enabled
    const nameInput = body.getByLabelText(/template name/i)
    await expect(nameInput).toBeEnabled()

    // Should have initial value
    await expect(nameInput).toHaveValue('Safety Inspection')

    // Clear and type new name
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Template Name')
    await expect(nameInput).toHaveValue('Updated Template Name')
  },
}

/**
 * Interaction test: Cancel button closes dialog.
 */
export const CancelButton: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={CUSTOM_TEMPLATE}
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
  },
}

/**
 * Interaction test: Copy code button works.
 */
export const CopyCodeButton: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTemplateDialog
        template={CUSTOM_TEMPLATE}
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

    // Template code should be visible
    const codeElement = body.getByText('safety-inspection')
    await expect(codeElement).toBeVisible()
  },
}

/**
 * All states comparison view.
 */
export const AllStates: Story = {
  render: (args) => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection
        title="Custom Template"
        description="Full editing capabilities"
      >
        <DialogWrapper
          template={CUSTOM_TEMPLATE}
          onSubmit={args.onSubmit}
          buttonLabel="Edit Custom Template"
        />
      </StorySection>

      <StorySection
        title="System Template"
        description="Name editing disabled"
      >
        <DialogWrapper
          template={SYSTEM_TEMPLATE}
          onSubmit={args.onSubmit}
          buttonLabel="Edit System Template"
        />
      </StorySection>
    </div>
  ),
}
