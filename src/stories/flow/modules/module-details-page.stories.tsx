/**
 * ModuleDetailsPage Stories
 *
 * Detailed view of a module with configuration tabs.
 */

import * as React from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ModuleDetailsPage } from '../../../flow/components/modules/ModuleDetailsPage'
import type { ModuleDetailTab } from '../../../flow/components/modules/ModuleDetailsPage'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import {
  mockModules,
  mockProcessDefinitions,
  mockFormTemplates,
  mockFormMappings,
  mockUserGroups,
  fullPermissions,
  viewOnlyPermissions,
} from '../../../flow/data/mockModules'

// =============================================================================
// DECORATORS
// =============================================================================

/**
 * Glass-morphism page wrapper with blob background.
 */
const GlassPageDecorator = (Story: React.ComponentType) => (
  <div className="relative min-h-screen bg-page overflow-hidden">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10 p-6">
      <Story />
    </div>
  </div>
)

const GlassPageDecoratorMobile = (Story: React.ComponentType) => (
  <div className="relative min-h-screen bg-page overflow-hidden">
    <GridBlobBackground scale={1.2} blobCount={2} />
    <div className="relative z-10 p-4">
      <Story />
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ModuleDetailsPage> = {
  title: 'Flow/Modules/ModuleDetailsPage',
  component: ModuleDetailsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ModuleDetailsPage

Detailed view of a module with tabbed configuration sections.

## Tabs

- **Entity Configuration**: Primary entity and related templates
- **Process Definitions**: BPMN workflow definitions
- **Form Templates**: Available form templates
- **Form Mappings**: Form-entity-workflow mappings
- **User Groups**: Access control groups

## Features

- Responsive tab layout (scrollable on mobile)
- Badge counts for each tab
- URL-sync ready for deep linking
- Back navigation
- Refresh action
- Glass-morphism styling

## Usage

\`\`\`tsx
import { ModuleDetailsPage } from '@dds/design-system/flow'

function ModuleConfigPage() {
  const { moduleId } = useParams()
  const { data: module } = useModule(moduleId)
  const { data: processes } = useProcessDefinitions(moduleId)
  const { data: forms } = useFormTemplates(moduleId)
  const { data: mappings } = useFormMappings(moduleId)
  const { data: groups } = useUserGroups(moduleId)

  return (
    <ModuleDetailsPage
      module={module}
      processDefinitions={processes}
      formTemplates={forms}
      formMappings={mappings}
      userGroups={groups}
      onBack={() => navigate('/modules')}
      onProcessDefinitionClick={(id) => navigate(\`/processes/\${id}\`)}
    />
  )
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['entity-config', 'process-definitions', 'form-templates', 'form-mappings', 'user-groups'],
    },
    onTabChange: { action: 'onTabChange' },
    onBack: { action: 'onBack' },
    onRefresh: { action: 'onRefresh' },
    onEntityTemplateClick: { action: 'onEntityTemplateClick' },
    onProcessDefinitionClick: { action: 'onProcessDefinitionClick' },
    onEditProcessDefinition: { action: 'onEditProcessDefinition' },
    onDeployProcessDefinition: { action: 'onDeployProcessDefinition' },
    onFormTemplateClick: { action: 'onFormTemplateClick' },
    onEditFormTemplate: { action: 'onEditFormTemplate' },
    onFormMappingClick: { action: 'onFormMappingClick' },
    onEditFormMapping: { action: 'onEditFormMapping' },
    onUserGroupClick: { action: 'onUserGroupClick' },
    onEditUserGroup: { action: 'onEditUserGroup' },
    onCreateProcessDefinition: { action: 'onCreateProcessDefinition' },
    onCreateFormTemplate: { action: 'onCreateFormTemplate' },
    onCreateFormMapping: { action: 'onCreateFormMapping' },
    onCreateUserGroup: { action: 'onCreateUserGroup' },
  },
}

export default meta
type Story = StoryObj<typeof ModuleDetailsPage>

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

function InteractiveModuleDetails() {
  const [activeTab, setActiveTab] = useState<ModuleDetailTab>('entity-config')

  return (
    <div className="relative min-h-screen bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10 p-6">
        <ModuleDetailsPage
          module={mockModules[0]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          processDefinitions={mockProcessDefinitions}
          formTemplates={mockFormTemplates}
          formMappings={mockFormMappings}
          userGroups={mockUserGroups}
          permissions={fullPermissions}
          onBack={() => alert('Back clicked')}
          onRefresh={() => alert('Refresh clicked')}
          onEntityTemplateClick={(id) => alert(`Entity clicked: ${id}`)}
          onProcessDefinitionClick={(id) => alert(`Process clicked: ${id}`)}
          onEditProcessDefinition={(id) => alert(`Edit process: ${id}`)}
          onDeployProcessDefinition={(id) => alert(`Deploy process: ${id}`)}
          onFormTemplateClick={(id) => alert(`Form clicked: ${id}`)}
          onEditFormTemplate={(id) => alert(`Edit form: ${id}`)}
          onFormMappingClick={(id) => alert(`Mapping clicked: ${id}`)}
          onEditFormMapping={(id) => alert(`Edit mapping: ${id}`)}
          onUserGroupClick={(id) => alert(`Group clicked: ${id}`)}
          onEditUserGroup={(id) => alert(`Edit group: ${id}`)}
          onCreateProcessDefinition={() => alert('Create process')}
          onCreateFormTemplate={() => alert('Create form')}
          onCreateFormMapping={() => alert('Create mapping')}
          onCreateUserGroup={() => alert('Create group')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - Entity Configuration tab
 */
export const Default: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'entity-config',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Interactive - Fully functional with local state
 */
export const Interactive: Story = {
  render: () => <InteractiveModuleDetails />,
}

/**
 * Process Definitions tab
 */
export const ProcessDefinitions: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'process-definitions',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Form Templates tab
 */
export const FormTemplates: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'form-templates',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Form Mappings tab
 */
export const FormMappings: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'form-mappings',
  },
  decorators: [GlassPageDecorator],
}

/**
 * User Groups tab
 */
export const UserGroups: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'user-groups',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: [],
    formTemplates: [],
    formMappings: [],
    userGroups: [],
    isLoading: true,
    permissions: fullPermissions,
    activeTab: 'entity-config',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Empty module - No entity templates
 */
export const EmptyModule: Story = {
  args: {
    module: mockModules[5], // Legacy Reporting - no entity templates
    processDefinitions: [],
    formTemplates: [],
    formMappings: [],
    userGroups: [],
    permissions: fullPermissions,
    activeTab: 'entity-config',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Draft module status
 */
export const DraftModule: Story = {
  args: {
    module: mockModules[3], // Permit to Work - draft
    processDefinitions: mockProcessDefinitions.slice(0, 1),
    formTemplates: mockFormTemplates.slice(0, 2),
    formMappings: mockFormMappings.slice(0, 1),
    userGroups: mockUserGroups.slice(0, 2),
    permissions: fullPermissions,
    activeTab: 'entity-config',
  },
  decorators: [GlassPageDecorator],
}

/**
 * View-only permissions
 */
export const ViewOnlyPermissions: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: viewOnlyPermissions,
    activeTab: 'entity-config',
  },
  decorators: [GlassPageDecorator],
}

/**
 * Mobile view - tabs are scrollable
 */
export const MobileView: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'entity-config',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [GlassPageDecoratorMobile],
}

/**
 * Tablet view
 */
export const TabletView: Story = {
  args: {
    module: mockModules[0],
    processDefinitions: mockProcessDefinitions,
    formTemplates: mockFormTemplates,
    formMappings: mockFormMappings,
    userGroups: mockUserGroups,
    permissions: fullPermissions,
    activeTab: 'process-definitions',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [GlassPageDecoratorMobile],
}
