import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DeleteTemplateDialog, type EntityTemplate } from '../../flow'
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
  render: () => (
    <DialogWrapper
      template={CUSTOM_TEMPLATE}
      buttonLabel="Delete Custom Template"
    />
  ),
}

/**
 * Attempt to delete a system template - shows "cannot delete" message.
 */
export const SystemTemplate: Story = {
  render: () => (
    <DialogWrapper
      template={SYSTEM_TEMPLATE}
      buttonLabel="Delete System Template"
    />
  ),
}

/**
 * Custom template dialog opened by default - delete confirmation.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={CUSTOM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
}

/**
 * System template dialog opened - cannot delete message.
 */
export const SystemTemplateOpen: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <DeleteTemplateDialog
        template={SYSTEM_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
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
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection
        title="Custom Template"
        description="Shows delete confirmation with warning"
      >
        <DialogWrapper
          template={CUSTOM_TEMPLATE}
          buttonLabel="Delete Custom Template"
        />
      </StorySection>

      <StorySection
        title="System Template"
        description="Shows 'cannot delete' message"
      >
        <DialogWrapper
          template={SYSTEM_TEMPLATE}
          buttonLabel="Delete System Template"
        />
      </StorySection>
    </div>
  ),
}
