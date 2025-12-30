/**
 * MappingStudio Stories
 *
 * Visual mapping editor that replaces JSON editing with a user-friendly
 * interface for creating field-to-field mappings.
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  MappingStudio,
  type MappingStudioProps,
  type SourceSchema,
  type TargetSchema,
  type MappingConfig,
} from '../../flow/components/mapping-studio'

// =============================================================================
// MOCK DATA
// =============================================================================

const mockSourceSchema: SourceSchema = {
  id: 'source-1',
  name: 'Incident Report Form',
  description: 'Form submission data from incident reports',
  fields: [
    { path: 'reportId', type: 'uuid', label: 'Report ID', required: true },
    { path: 'title', type: 'string', label: 'Title', required: true },
    { path: 'description', type: 'string', label: 'Description' },
    { path: 'severity', type: 'string', label: 'Severity' },
    { path: 'location.name', type: 'string', label: 'Location Name' },
    { path: 'location.latitude', type: 'number', label: 'Latitude' },
    { path: 'location.longitude', type: 'number', label: 'Longitude' },
    { path: 'reportedBy', type: 'string', label: 'Reported By' },
    { path: 'reportedAt', type: 'datetime', label: 'Reported At' },
    { path: 'witnesses', type: 'array', label: 'Witnesses' },
    { path: 'attachments', type: 'array', label: 'Attachments' },
    { path: 'isConfidential', type: 'boolean', label: 'Is Confidential' },
  ],
}

const mockTargetSchema: TargetSchema = {
  id: 'target-1',
  name: 'Incident Entity',
  description: 'Target entity for incident data',
  fields: [
    { path: 'id', type: 'uuid', label: 'ID', required: true },
    { path: 'name', type: 'string', label: 'Name', required: true },
    { path: 'summary', type: 'string', label: 'Summary' },
    { path: 'priority', type: 'string', label: 'Priority' },
    { path: 'locationName', type: 'string', label: 'Location Name' },
    { path: 'coordinates.lat', type: 'number', label: 'Coordinates Lat' },
    { path: 'coordinates.lng', type: 'number', label: 'Coordinates Lng' },
    { path: 'reporter', type: 'string', label: 'Reporter' },
    { path: 'createdAt', type: 'datetime', label: 'Created At' },
    { path: 'status', type: 'string', label: 'Status' },
    { path: 'isPrivate', type: 'boolean', label: 'Is Private' },
  ],
}

const emptyConfig: MappingConfig = {
  id: 'mapping-1',
  name: 'Incident Mapping',
  description: 'Maps incident form submissions to incident entities',
  version: '1.0.0',
  mappings: [],
}

const configWithMappings: MappingConfig = {
  id: 'mapping-2',
  name: 'Incident Mapping',
  description: 'Maps incident form submissions to incident entities',
  version: '1.0.0',
  mappings: [
    { id: '1', sourcePath: 'reportId', targetPath: 'id', enabled: true },
    { id: '2', sourcePath: 'title', targetPath: 'name', enabled: true },
    { id: '3', sourcePath: 'description', targetPath: 'summary', enabled: true },
    {
      id: '4',
      sourcePath: 'severity',
      targetPath: 'priority',
      transform: { type: 'toUpperCase' },
      enabled: true,
    },
    { id: '5', sourcePath: 'location.name', targetPath: 'locationName', enabled: true },
    { id: '6', sourcePath: 'location.latitude', targetPath: 'coordinates.lat', enabled: true },
    { id: '7', sourcePath: 'location.longitude', targetPath: 'coordinates.lng', enabled: true },
    {
      id: '8',
      sourcePath: 'reportedBy',
      targetPath: 'reporter',
      transform: { type: 'trim' },
      enabled: true,
    },
    { id: '9', sourcePath: 'reportedAt', targetPath: 'createdAt', enabled: true },
    { id: '10', sourcePath: 'isConfidential', targetPath: 'isPrivate', enabled: true },
  ],
}

const configWithErrors: MappingConfig = {
  id: 'mapping-3',
  name: 'Incomplete Mapping',
  description: 'Mapping with validation errors',
  version: '1.0.0',
  mappings: [
    { id: '1', sourcePath: 'reportId', targetPath: 'id', enabled: true },
    { id: '2', sourcePath: '', targetPath: 'name', enabled: true }, // Missing source
    { id: '3', sourcePath: 'title', targetPath: '', enabled: true }, // Missing target
    {
      id: '4',
      sourcePath: 'severity',
      targetPath: 'priority',
      enabled: false, // Disabled mapping
      notes: 'Temporarily disabled while reviewing severity values',
    },
  ],
}

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

function MappingStudioWrapper(props: MappingStudioProps) {
  return (
    <div className="h-[700px] w-full">
      <MappingStudio {...props} />
    </div>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MappingStudioWrapper> = {
  title: 'Flow/MappingStudio',
  component: MappingStudioWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
MappingStudio is a visual mapping editor that replaces JSON editing with a user-friendly
interface for creating field-to-field mappings between source and target schemas.

## Features

- **Form Mode**: Row-based editor for quick 1:1 mappings with dropdowns
- **Code Mode**: JSON editor for advanced users with validation
- **Visual Mode**: Drag-drop builder (coming soon)
- **Undo/Redo**: Full history support with keyboard shortcuts
- **Auto-mapping**: Automatically map fields with matching names
- **Transforms**: Built-in transform functions (toString, toUpperCase, etc.)
- **Validation**: Real-time validation with error/warning indicators

## Usage

\`\`\`tsx
import { MappingStudio } from '@dds/design-system/flow'

<MappingStudio
  initialConfig={mappingConfig}
  sourceSchema={sourceSchema}
  targetSchema={targetSchema}
  onChange={(config) => console.log('Changed:', config)}
  onSave={async (config) => await saveMapping(config)}
  defaultMode="form"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultMode: {
      control: 'select',
      options: ['form', 'code', 'visual'],
      description: 'Initial editor mode',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the editor is read-only',
    },
    autoSave: {
      control: 'boolean',
      description: 'Enable auto-save on changes',
    },
    autoSaveDebounce: {
      control: 'number',
      description: 'Debounce delay for auto-save (ms)',
    },
  },
}

export default meta
type Story = StoryObj<typeof MappingStudioWrapper>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default empty state - ready to add mappings
 */
export const Default: Story = {
  args: {
    initialConfig: emptyConfig,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'form',
    onChange: (config) => console.log('Config changed:', config),
    onSave: async (config) => {
      console.log('Saving config:', config)
      await new Promise((r) => setTimeout(r, 1000))
    },
  },
}

/**
 * With existing mappings pre-populated
 */
export const WithMappings: Story = {
  args: {
    initialConfig: configWithMappings,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'form',
    onChange: (config) => console.log('Config changed:', config),
    onSave: async (config) => {
      console.log('Saving config:', config)
      await new Promise((r) => setTimeout(r, 1000))
    },
  },
}

/**
 * Code mode for advanced JSON editing
 */
export const CodeMode: Story = {
  args: {
    initialConfig: configWithMappings,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'code',
    onChange: (config) => console.log('Config changed:', config),
    onSave: async (config) => {
      console.log('Saving config:', config)
      await new Promise((r) => setTimeout(r, 1000))
    },
  },
}

/**
 * Configuration with validation errors
 */
export const WithErrors: Story = {
  args: {
    initialConfig: configWithErrors,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'form',
    onChange: (config) => console.log('Config changed:', config),
    onSave: async (config) => {
      console.log('Saving config:', config)
      await new Promise((r) => setTimeout(r, 1000))
    },
  },
}

/**
 * Read-only mode for viewing configurations
 */
export const ReadOnly: Story = {
  args: {
    initialConfig: configWithMappings,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'form',
    readOnly: true,
  },
}

/**
 * With auto-save enabled
 */
export const AutoSave: Story = {
  args: {
    initialConfig: emptyConfig,
    sourceSchema: mockSourceSchema,
    targetSchema: mockTargetSchema,
    defaultMode: 'form',
    autoSave: true,
    autoSaveDebounce: 2000,
    onChange: (config) => console.log('Config changed:', config),
    onSave: async (config) => {
      console.log('Auto-saving config:', config)
      await new Promise((r) => setTimeout(r, 500))
    },
  },
}
