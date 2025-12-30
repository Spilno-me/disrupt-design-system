/**
 * SchemaStudio Stories
 *
 * Demonstrates the hybrid JSON Schema editor with Visual, Code, and Split modes.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SchemaStudio } from '../../flow/components/schema-studio'
import type { JSONSchema } from '../../flow/components/schema-studio/types'
import {
  ORGANISM_META,
  organismDescription,
  StorySection,
  IPhoneMobileFrame,
  IPadMobileFrame,
} from '../_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof SchemaStudio> = {
  title: 'Flow/SchemaStudio',
  component: SchemaStudio,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription(`
# SchemaStudio - Hybrid JSON Schema Editor

A comprehensive schema editor with three modes:

- **Visual Mode**: Drag-and-drop field editor with intuitive UI
- **Code Mode**: Raw JSON editing with syntax validation
- **Split Mode**: Both editors side-by-side with live sync

## Features

- Undo/Redo history (⌘Z / ⌘⇧Z)
- Command palette (⌘K)
- Live form preview
- JSON import/export
- Field validation
- Mobile responsive

## Usage

\`\`\`tsx
import { SchemaStudio } from '@dds/design-system/flow'

<SchemaStudio
  initialSchema={mySchema}
  onChange={(schema) => console.log('Changed:', schema)}
  onSave={async (schema) => await saveSchema(schema)}
  defaultMode="visual"
  showPreview
/>
\`\`\`
        `),
      },
    },
  },
  argTypes: {
    defaultMode: {
      control: 'radio',
      options: ['visual', 'code', 'split'],
      description: 'Initial editor mode',
    },
    showPreview: {
      control: 'boolean',
      description: 'Show live preview panel',
    },
    autoSave: {
      control: 'boolean',
      description: 'Enable auto-save after changes',
    },
  },
}

export default meta
type Story = StoryObj<typeof SchemaStudio>

// =============================================================================
// SAMPLE SCHEMAS
// =============================================================================

const EMPTY_SCHEMA: JSONSchema = {
  type: 'object',
  title: 'New Schema',
  description: 'Create your schema by adding fields',
  required: [],
  properties: {},
}

const SIMPLE_SCHEMA: JSONSchema = {
  type: 'object',
  title: 'Contact Form',
  description: 'A simple contact form schema',
  required: ['name', 'email'],
  'ui:order': ['name', 'email', 'phone', 'message'],
  properties: {
    name: {
      type: 'string',
      title: 'Full Name',
      description: 'Your full name',
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email',
      'ui:widget': 'email',
    },
    phone: {
      type: 'string',
      title: 'Phone Number',
      'ui:widget': 'tel',
      'ui:placeholder': '+1 (555) 000-0000',
    },
    message: {
      type: 'string',
      title: 'Message',
      description: 'Your message (max 500 characters)',
      'ui:widget': 'textarea',
      'ui:rows': 4,
      maxLength: 500,
    },
  },
}

const INCIDENT_REPORT_SCHEMA: JSONSchema = {
  type: 'object',
  title: 'Incident Report',
  description: 'Environmental Health & Safety Incident Report Form',
  required: ['incident_date', 'incident_type', 'location', 'description', 'severity'],
  'ui:order': [
    'incident_date',
    'incident_time',
    'incident_type',
    'severity',
    'location',
    'department',
    'description',
    'immediate_actions',
    'witnesses',
    'injuries_reported',
    'injury_details',
    'property_damage',
    'damage_estimate',
    'photos',
    'reported_by',
    'report_date',
  ],
  properties: {
    incident_date: {
      type: 'string',
      title: 'Incident Date',
      format: 'date',
      'ui:widget': 'date',
    },
    incident_time: {
      type: 'string',
      title: 'Incident Time',
      'ui:widget': 'time',
    },
    incident_type: {
      type: 'string',
      title: 'Incident Type',
      'ui:widget': 'select',
      enum: [
        'Near Miss',
        'First Aid',
        'Medical Treatment',
        'Lost Time Injury',
        'Environmental Release',
        'Property Damage',
        'Security Incident',
        'Other',
      ],
    },
    severity: {
      type: 'string',
      title: 'Severity Level',
      'ui:widget': 'radio',
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    location: {
      type: 'string',
      title: 'Location',
      description: 'Where did the incident occur?',
      'ui:lookup': 'locations',
    },
    department: {
      type: 'string',
      title: 'Department',
      'ui:widget': 'select',
      enum: ['Operations', 'Maintenance', 'Warehouse', 'Office', 'External'],
    },
    description: {
      type: 'string',
      title: 'Incident Description',
      description: 'Provide a detailed description of what happened',
      'ui:widget': 'textarea',
      'ui:rows': 5,
      minLength: 50,
    },
    immediate_actions: {
      type: 'string',
      title: 'Immediate Actions Taken',
      'ui:widget': 'textarea',
      'ui:rows': 3,
    },
    witnesses: {
      type: 'string',
      title: 'Witnesses',
      description: 'Names of any witnesses (comma separated)',
    },
    injuries_reported: {
      type: 'boolean',
      title: 'Were injuries reported?',
      default: false,
    },
    injury_details: {
      type: 'string',
      title: 'Injury Details',
      'ui:widget': 'textarea',
      'ui:rows': 3,
      'ui:visibleWhen': {
        field: 'injuries_reported',
        value: true,
      },
    },
    property_damage: {
      type: 'boolean',
      title: 'Was there property damage?',
      default: false,
    },
    damage_estimate: {
      type: 'number',
      title: 'Estimated Damage Cost ($)',
      minimum: 0,
      'ui:visibleWhen': {
        field: 'property_damage',
        value: true,
      },
    },
    photos: {
      type: 'array',
      title: 'Photos/Evidence',
      'ui:widget': 'file',
      items: {
        type: 'string',
      },
    },
    reported_by: {
      type: 'string',
      title: 'Reported By',
      'ui:lookup': 'users',
    },
    report_date: {
      type: 'string',
      title: 'Report Date',
      format: 'date',
      'ui:widget': 'date',
      'ui:readonly': true,
    },
  },
}

const CORRECTIVE_ACTION_SCHEMA: JSONSchema = {
  type: 'object',
  title: 'Corrective Action Plan',
  description: 'CAPA (Corrective and Preventive Action) Form',
  required: ['title', 'root_cause', 'corrective_action', 'responsible_party', 'due_date'],
  'ui:order': [
    'title',
    'related_incident',
    'root_cause_type',
    'root_cause',
    'five_whys',
    'corrective_action',
    'preventive_action',
    'responsible_party',
    'due_date',
    'priority',
    'status',
    'verification_method',
    'effectiveness_criteria',
    'completion_date',
    'notes',
  ],
  properties: {
    title: {
      type: 'string',
      title: 'Action Title',
      description: 'Brief title for this corrective action',
      maxLength: 200,
    },
    related_incident: {
      type: 'string',
      title: 'Related Incident ID',
      description: 'Link to the originating incident',
      'ui:lookup': 'incidents',
    },
    root_cause_type: {
      type: 'string',
      title: 'Root Cause Category',
      'ui:widget': 'select',
      enum: [
        'Human Error',
        'Equipment Failure',
        'Process Deficiency',
        'Training Gap',
        'Communication Issue',
        'Environmental Factor',
        'Management System',
        'Other',
      ],
    },
    root_cause: {
      type: 'string',
      title: 'Root Cause Analysis',
      description: 'Detailed root cause description',
      'ui:widget': 'textarea',
      'ui:rows': 4,
    },
    five_whys: {
      type: 'string',
      title: '5 Whys Analysis',
      description: 'Document the 5 Whys questioning process',
      'ui:widget': 'textarea',
      'ui:rows': 6,
    },
    corrective_action: {
      type: 'string',
      title: 'Corrective Action',
      description: 'Actions to correct the immediate issue',
      'ui:widget': 'textarea',
      'ui:rows': 4,
    },
    preventive_action: {
      type: 'string',
      title: 'Preventive Action',
      description: 'Actions to prevent recurrence',
      'ui:widget': 'textarea',
      'ui:rows': 4,
    },
    responsible_party: {
      type: 'string',
      title: 'Responsible Party',
      'ui:lookup': 'users',
    },
    due_date: {
      type: 'string',
      title: 'Due Date',
      format: 'date',
      'ui:widget': 'date',
    },
    priority: {
      type: 'string',
      title: 'Priority',
      'ui:widget': 'radio',
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    status: {
      type: 'string',
      title: 'Status',
      'ui:widget': 'select',
      enum: ['Open', 'In Progress', 'Pending Review', 'Closed', 'Cancelled'],
      default: 'Open',
    },
    verification_method: {
      type: 'string',
      title: 'Verification Method',
      description: 'How will completion be verified?',
      'ui:widget': 'textarea',
      'ui:rows': 2,
    },
    effectiveness_criteria: {
      type: 'string',
      title: 'Effectiveness Criteria',
      description: 'How will effectiveness be measured?',
      'ui:widget': 'textarea',
      'ui:rows': 2,
    },
    completion_date: {
      type: 'string',
      title: 'Actual Completion Date',
      format: 'date',
      'ui:widget': 'date',
    },
    notes: {
      type: 'string',
      title: 'Additional Notes',
      'ui:widget': 'textarea',
      'ui:rows': 3,
    },
  },
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default empty schema - start building from scratch
 */
export const Default: Story = {
  args: {
    initialSchema: EMPTY_SCHEMA,
    defaultMode: 'visual',
    showPreview: true,
  },
}

/**
 * Simple contact form schema
 */
export const ContactForm: Story = {
  args: {
    initialSchema: SIMPLE_SCHEMA,
    defaultMode: 'visual',
    showPreview: true,
  },
}

/**
 * Complex incident report schema
 */
export const IncidentReport: Story = {
  args: {
    initialSchema: INCIDENT_REPORT_SCHEMA,
    defaultMode: 'visual',
    showPreview: true,
  },
}

/**
 * Corrective Action (CAPA) schema
 */
export const CorrectiveAction: Story = {
  args: {
    initialSchema: CORRECTIVE_ACTION_SCHEMA,
    defaultMode: 'visual',
    showPreview: true,
  },
}

/**
 * Code mode for power users
 */
export const CodeMode: Story = {
  args: {
    initialSchema: SIMPLE_SCHEMA,
    defaultMode: 'code',
    showPreview: false,
  },
}

/**
 * Split mode - visual and code side by side
 */
export const SplitMode: Story = {
  args: {
    initialSchema: SIMPLE_SCHEMA,
    defaultMode: 'split',
    showPreview: false,
  },
}

/**
 * Without preview panel
 */
export const NoPreview: Story = {
  args: {
    initialSchema: SIMPLE_SCHEMA,
    defaultMode: 'visual',
    showPreview: false,
  },
}

/**
 * With save handler
 */
export const WithSaveHandler: Story = {
  args: {
    initialSchema: SIMPLE_SCHEMA,
    defaultMode: 'visual',
    showPreview: true,
    onSave: async (schema) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Saved schema:', schema)
      alert('Schema saved successfully!')
    },
  },
}

/**
 * Interactive demo with controlled state
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoStory() {
    const [schema, setSchema] = useState<JSONSchema>(SIMPLE_SCHEMA)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    const handleSave = async (s: JSONSchema) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSchema(s)
      setLastSaved(new Date())
    }

    return (
      <div className="h-screen flex flex-col">
        {/* Info Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted-bg border-b border-default">
          <div className="text-sm">
            <span className="font-medium">Schema: </span>
            <span className="text-secondary">{schema.title}</span>
            <span className="text-tertiary ml-2">
              ({Object.keys(schema.properties).length} fields)
            </span>
          </div>
          {lastSaved && (
            <div className="text-xs text-secondary">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 bg-page">
          <SchemaStudio
            initialSchema={schema}
            onChange={(s) => console.log('Changed:', s)}
            onSave={handleSave}
            defaultMode="visual"
            showPreview
            className="h-full"
          />
        </div>
      </div>
    )
  },
}

// =============================================================================
// DEVICE FRAME STORIES
// =============================================================================

/**
 * Mobile view in iPhone 16 Pro Max frame at real device size.
 * Uses scale={1} for 1:1 pixel mapping - experience actual device dimensions.
 */
export const MobileFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPhoneMobileFrame
        storyId="flow-schemastudio--default"
        model="iphone16promax"
        scale={1}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SchemaStudio at real iPhone 16 Pro Max size (430×932pt). Scroll to see full device.',
      },
    },
  },
}

/**
 * Tablet view in iPad Pro 11" frame at real device size.
 * Uses scale={1} for 1:1 pixel mapping - experience actual device dimensions.
 */
export const TabletFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPadMobileFrame
        storyId="flow-schemastudio--contact-form"
        model="ipadPro11"
        scale={1}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SchemaStudio at real iPad Pro 11" size (834×1194pt). Scroll to see full device.',
      },
    },
  },
}

// =============================================================================
// ALL STATES STORY
// =============================================================================

/**
 * **AllStates** - Visual overview of all editor modes and schemas.
 * Consolidates Visual, Code, Split modes with different schema complexities.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection title="Visual Mode - Empty Schema" description="Starting point for new schemas">
        <div className="h-[500px] border border-default rounded-lg overflow-hidden">
          <SchemaStudio
            initialSchema={EMPTY_SCHEMA}
            defaultMode="visual"
            showPreview
          />
        </div>
      </StorySection>

      <StorySection title="Visual Mode - Simple Schema" description="Contact form with basic fields">
        <div className="h-[500px] border border-default rounded-lg overflow-hidden">
          <SchemaStudio
            initialSchema={SIMPLE_SCHEMA}
            defaultMode="visual"
            showPreview
          />
        </div>
      </StorySection>

      <StorySection title="Code Mode" description="Raw JSON editing for power users">
        <div className="h-[500px] border border-default rounded-lg overflow-hidden">
          <SchemaStudio
            initialSchema={SIMPLE_SCHEMA}
            defaultMode="code"
            showPreview={false}
          />
        </div>
      </StorySection>

      <StorySection title="Split Mode" description="Visual and code editors side-by-side">
        <div className="h-[500px] border border-default rounded-lg overflow-hidden">
          <SchemaStudio
            initialSchema={SIMPLE_SCHEMA}
            defaultMode="split"
            showPreview={false}
          />
        </div>
      </StorySection>

      <StorySection title="Complex Schema - Incident Report" description="EHS incident form with many field types">
        <div className="h-[600px] border border-default rounded-lg overflow-hidden">
          <SchemaStudio
            initialSchema={INCIDENT_REPORT_SCHEMA}
            defaultMode="visual"
            showPreview
          />
        </div>
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual overview consolidating all editor modes and schema complexities for comparison and testing.',
      },
    },
  },
}
