/**
 * Module Sheets Stories
 *
 * Mobile bottom sheets for module configuration and entity creation.
 */

import * as React from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../components/ui/button'
import { ModuleConfigSheet } from '../../../flow/components/modules/ModuleConfigSheet'
import { CreateEntitySheet } from '../../../flow/components/modules/CreateEntitySheet'
import { mockModules } from '../../../flow/data/mockModules'
import type { FormTemplateOption } from '../../../flow/components/modules/ModuleConfigSheet'

// =============================================================================
// MOCK FORM TEMPLATES
// =============================================================================

const mockFormTemplates: FormTemplateOption[] = [
  { id: 'form-001', name: 'Incident Reporting Form', code: 'incident-reporting' },
  { id: 'form-002', name: 'Quick Incident Form', code: 'quick-incident' },
  { id: 'form-003', name: 'Manager Incident Form', code: 'manager-incident' },
]

// =============================================================================
// CONFIG SHEET META
// =============================================================================

const configSheetMeta: Meta<typeof ModuleConfigSheet> = {
  title: 'Flow/Modules/ModuleConfigSheet',
  component: ModuleConfigSheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ModuleConfigSheet

A mobile bottom sheet for editing module configuration settings.

## Features

- **Status Toggle**: Switch between Active and Inactive (disabled for Draft)
- **Primary Form Selection**: Dropdown to choose default entity creation form
- **Entity Templates List**: Overview of all templates in the module

## Mobile-First Design

Uses bottom sheet pattern per DDS UX guidelines:
- \`side="bottom"\` positioning
- 85vh height for maximum content visibility
- Drag handle for swipe-to-close
- Full-width buttons in footer

## Usage

\`\`\`tsx
import { ModuleConfigSheet } from '@dds/design-system/flow'

<ModuleConfigSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  module={selectedModule}
  formTemplates={formTemplates}
  currentPrimaryFormId={module.primaryFormId}
  isSaving={isSaving}
  onSave={handleSave}
/>
\`\`\`
        `,
      },
    },
  },
}

export default configSheetMeta

// =============================================================================
// CONFIG SHEET WRAPPER
// =============================================================================

function ConfigSheetDemo({ moduleIndex = 0 }: { moduleIndex?: number }) {
  const [open, setOpen] = useState(false)
  const module = mockModules[moduleIndex]

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Configure {module.name}
      </Button>
      <ModuleConfigSheet
        open={open}
        onOpenChange={setOpen}
        module={module}
        formTemplates={mockFormTemplates}
        currentPrimaryFormId="form-001"
        onSave={(moduleId, config) => {
          alert(`Saved config for ${moduleId}:\n${JSON.stringify(config, null, 2)}`)
          setOpen(false)
        }}
      />
    </div>
  )
}

// =============================================================================
// CONFIG SHEET STORIES
// =============================================================================

type ConfigStory = StoryObj<typeof ModuleConfigSheet>

export const ConfigSheetDefault: ConfigStory = {
  name: 'Default',
  render: () => <ConfigSheetDemo />,
}

export const ConfigSheetActiveModule: ConfigStory = {
  name: 'Active Module',
  render: () => <ConfigSheetDemo moduleIndex={0} />,
}

export const ConfigSheetInactiveModule: ConfigStory = {
  name: 'Inactive Module',
  render: () => {
    const inactiveIndex = mockModules.findIndex((m) => m.status === 'inactive')
    return <ConfigSheetDemo moduleIndex={inactiveIndex >= 0 ? inactiveIndex : 5} />
  },
}

export const ConfigSheetDraftModule: ConfigStory = {
  name: 'Draft Module (Status Disabled)',
  render: () => {
    const draftIndex = mockModules.findIndex((m) => m.status === 'draft')
    return <ConfigSheetDemo moduleIndex={draftIndex >= 0 ? draftIndex : 3} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Draft modules have the status toggle disabled - they must be published before activation.',
      },
    },
  },
}

export const ConfigSheetSaving: ConfigStory = {
  name: 'Saving State',
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <ModuleConfigSheet
        open={open}
        onOpenChange={setOpen}
        module={mockModules[0]}
        formTemplates={mockFormTemplates}
        currentPrimaryFormId="form-001"
        isSaving={true}
        onSave={() => {}}
      />
    )
  },
}

// =============================================================================
// CREATE ENTITY SHEET META
// =============================================================================

export const CreateEntitySheetMeta = {
  title: 'Flow/Modules/CreateEntitySheet',
  component: CreateEntitySheet,
}

// =============================================================================
// CREATE ENTITY SHEET WRAPPER
// =============================================================================

function CreateEntityDemo({ moduleIndex = 0 }: { moduleIndex?: number }) {
  const [open, setOpen] = useState(false)
  const module = mockModules[moduleIndex]

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Create Entity for {module.name}
      </Button>
      <CreateEntitySheet
        open={open}
        onOpenChange={setOpen}
        module={module}
        onCreateEntity={(moduleId, template) => {
          alert(`Creating ${template.name} for module ${moduleId}`)
          setOpen(false)
        }}
      />
    </div>
  )
}

// =============================================================================
// CREATE ENTITY SHEET STORIES
// =============================================================================

export const CreateEntityDefault: ConfigStory = {
  name: 'Create Entity - Default',
  render: () => <CreateEntityDemo />,
}

export const CreateEntitySingleTemplate: ConfigStory = {
  name: 'Create Entity - Single Template',
  render: () => {
    // Find module with single entity template
    const permitIndex = mockModules.findIndex((m) => m.entityTemplates?.length === 1)
    return <CreateEntityDemo moduleIndex={permitIndex >= 0 ? permitIndex : 3} />
  },
  parameters: {
    docs: {
      description: {
        story: 'When module has only one entity template, it shows a simple confirmation view.',
      },
    },
  },
}

export const CreateEntityMultipleTemplates: ConfigStory = {
  name: 'Create Entity - Multiple Templates',
  render: () => {
    // Find module with multiple entity templates
    const multiIndex = mockModules.findIndex((m) => (m.entityTemplates?.length ?? 0) > 2)
    return <CreateEntityDemo moduleIndex={multiIndex >= 0 ? multiIndex : 0} />
  },
  parameters: {
    docs: {
      description: {
        story: 'When module has multiple entity templates, user can select which type to create.',
      },
    },
  },
}

export const CreateEntityNoTemplates: ConfigStory = {
  name: 'Create Entity - No Templates',
  render: () => {
    // Find inactive module with no templates
    const emptyIndex = mockModules.findIndex((m) => !m.entityTemplates?.length)
    return <CreateEntityDemo moduleIndex={emptyIndex >= 0 ? emptyIndex : 5} />
  },
  parameters: {
    docs: {
      description: {
        story: 'When module has no entity templates, shows an empty state message.',
      },
    },
  },
}

/**
 * Both sheets in action - typical user flow
 */
export const BothSheetsDemo: ConfigStory = {
  name: 'Both Sheets - Full Demo',
  render: () => {
    const [configOpen, setConfigOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const module = mockModules[0]

    return (
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Module: {module.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfigOpen(true)}>
            Configure Module
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            Create Entity
          </Button>
        </div>

        <ModuleConfigSheet
          open={configOpen}
          onOpenChange={setConfigOpen}
          module={module}
          formTemplates={mockFormTemplates}
          currentPrimaryFormId="form-001"
          onSave={(_, config) => {
            alert(`Configuration saved: ${JSON.stringify(config)}`)
            setConfigOpen(false)
          }}
        />

        <CreateEntitySheet
          open={createOpen}
          onOpenChange={setCreateOpen}
          module={module}
          onCreateEntity={(_, template) => {
            alert(`Creating: ${template.name}`)
            setCreateOpen(false)
          }}
        />
      </div>
    )
  },
}
