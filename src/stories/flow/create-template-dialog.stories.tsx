import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
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
  render: () => <DialogWrapper />,
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <CreateTemplateDialog
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
}

/**
 * All states comparison view.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection
        title="Create Template Dialog"
        description="Form for creating new entity templates"
      >
        <DialogWrapper />
      </StorySection>
    </div>
  ),
}
