/// <reference types="@testing-library/jest-dom" />
import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'vitest'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ViewTemplateDialog, type EntityTemplate } from '../../flow'
import { Button } from '../../components/ui/button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
  IPhoneMobileFrame,
} from '../_infrastructure'

/**
 * ViewTemplateDialog - Read-only view of entity template details.
 *
 * Displays comprehensive template information including:
 * - Template metadata (code, version, system/custom)
 * - Category with icon and color
 * - Template ID (for API reference)
 * - Created/Updated timestamps
 * - Business Key pattern
 * - Schema fields with descriptions, types, constraints, and UI hints
 * - Collapsible raw JSON Schema viewer
 *
 * ## Responsive Behavior
 * - **Mobile (<1024px)**: Bottom sheet with compact fields list
 * - **Desktop (>=1024px)**: Centered dialog with enhanced field cards
 *
 * ## Usage
 * ```tsx
 * const [selectedTemplate, setSelectedTemplate] = useState<EntityTemplate | null>(null)
 *
 * <ViewTemplateDialog
 *   template={selectedTemplate}
 *   open={!!selectedTemplate}
 *   onOpenChange={(open) => !open && setSelectedTemplate(null)}
 * />
 * ```
 */
const meta: Meta<typeof ViewTemplateDialog> = {
  title: 'Flow/Configuration/ViewTemplateDialog',
  component: ViewTemplateDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Read-only template preview dialog with responsive mobile/desktop layouts and comprehensive schema field display.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ViewTemplateDialog>

// =============================================================================
// MOCK DATA - Rich template with all field types
// =============================================================================

const RICH_SCHEMA = `{
  "type": "object",
  "title": "Comprehensive Incident Report",
  "description": "Full-featured incident reporting form with all field types and validations",
  "required": ["title", "incident_date", "severity", "location"],
  "ui:order": [
    "title",
    "description",
    "incident_date",
    "severity",
    "location",
    "department",
    "witnesses",
    "attachments",
    "follow_up_date",
    "is_resolved"
  ],
  "properties": {
    "title": {
      "type": "string",
      "title": "Incident Title",
      "description": "Brief descriptive title for the incident",
      "minLength": 5,
      "maxLength": 200,
      "ui:placeholder": "Enter a descriptive title..."
    },
    "description": {
      "type": "string",
      "title": "Description",
      "description": "Detailed account of what happened",
      "ui:widget": "textarea",
      "ui:placeholder": "Describe the incident in detail..."
    },
    "incident_date": {
      "type": "string",
      "format": "date-time",
      "title": "Incident Date/Time",
      "description": "When the incident occurred",
      "ui:widget": "datetime"
    },
    "severity": {
      "type": "string",
      "title": "Severity Level",
      "description": "Impact severity classification",
      "enum": ["minor", "moderate", "major", "critical"],
      "default": "minor",
      "ui:widget": "select"
    },
    "location": {
      "type": "string",
      "title": "Location",
      "description": "Where the incident occurred",
      "ui:lookup": "locations"
    },
    "department": {
      "type": "string",
      "title": "Department",
      "ui:lookup": "departments",
      "ui:visibleWhen": {
        "field": "severity",
        "value": "critical"
      }
    },
    "witnesses": {
      "type": "array",
      "title": "Witnesses",
      "description": "People who witnessed the incident",
      "items": { "type": "string" }
    },
    "attachments": {
      "type": "array",
      "title": "Attachments",
      "description": "Photos or documents related to the incident",
      "ui:widget": "file"
    },
    "follow_up_date": {
      "type": "string",
      "format": "date",
      "title": "Follow-up Date",
      "ui:widget": "date"
    },
    "is_resolved": {
      "type": "boolean",
      "title": "Resolved",
      "default": false,
      "ui:widget": "checkbox"
    }
  }
}`

const SIMPLE_SCHEMA = `{
  "type": "object",
  "title": "Simple Form",
  "properties": {
    "name": { "type": "string", "title": "Name" },
    "email": { "type": "string", "format": "email", "title": "Email" }
  },
  "required": ["name"]
}`

const RICH_TEMPLATE: EntityTemplate = {
  id: 'tpl-rich-001',
  name: 'Comprehensive Incident Report',
  code: 'comprehensive-incident',
  category: 'incident',
  version: 3,
  isSystem: true,
  businessKeyTemplate: 'INC-{{date}}-{{sequence}}',
  jsonSchema: RICH_SCHEMA,
  createdAt: '2025-11-15T10:30:00Z',
  updatedAt: '2025-12-20T14:45:00Z',
  description: 'Full-featured incident reporting template with comprehensive field types, validations, and conditional logic.',
  fieldCount: 10,
}

const SIMPLE_TEMPLATE: EntityTemplate = {
  id: 'tpl-simple-002',
  name: 'Quick Contact Form',
  code: 'contact-form',
  category: 'custom',
  version: 1,
  isSystem: false,
  jsonSchema: SIMPLE_SCHEMA,
  createdAt: '2025-12-28T09:00:00Z',
  description: 'Simple contact form with minimal fields.',
  fieldCount: 2,
}

const INSPECTION_TEMPLATE: EntityTemplate = {
  id: 'tpl-insp-003',
  name: 'Safety Inspection Checklist',
  code: 'safety-inspection',
  category: 'inspection',
  version: 2,
  isSystem: false,
  businessKeyTemplate: 'SI-{{inspector}}-{{date}}',
  jsonSchema: `{
    "type": "object",
    "title": "Safety Inspection",
    "required": ["inspector", "inspection_date", "area"],
    "properties": {
      "inspector": {
        "type": "string",
        "title": "Inspector Name",
        "ui:lookup": "users"
      },
      "inspection_date": {
        "type": "string",
        "format": "date",
        "title": "Inspection Date",
        "ui:widget": "date"
      },
      "area": {
        "type": "string",
        "title": "Inspection Area",
        "enum": ["warehouse", "office", "production", "loading_dock"],
        "ui:widget": "select"
      },
      "score": {
        "type": "number",
        "title": "Safety Score",
        "minimum": 0,
        "maximum": 100,
        "default": 0
      },
      "notes": {
        "type": "string",
        "title": "Notes",
        "ui:widget": "textarea",
        "ui:placeholder": "Add inspection notes..."
      }
    }
  }`,
  createdAt: '2025-12-01T08:00:00Z',
  updatedAt: '2025-12-15T16:30:00Z',
  description: 'Workplace safety inspection checklist with scoring.',
  fieldCount: 5,
}

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  template: EntityTemplate
  buttonLabel?: string
}

function DialogWrapper({ template, buttonLabel = 'View Template' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <ViewTemplateDialog
        template={template}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Rich template with all field types, validations, and UI hints.
 * Click the button to open the dialog.
 */
export const RichTemplate: Story = {
  render: () => <DialogWrapper template={RICH_TEMPLATE} buttonLabel="View Rich Template" />,
}

/**
 * Simple template with minimal fields.
 */
export const SimpleTemplate: Story = {
  render: () => <DialogWrapper template={SIMPLE_TEMPLATE} buttonLabel="View Simple Template" />,
}

/**
 * Custom inspection template with lookups and scoring.
 */
export const InspectionTemplate: Story = {
  render: () => <DialogWrapper template={INSPECTION_TEMPLATE} buttonLabel="View Inspection Template" />,
}

/**
 * System template (read-only indicator shown).
 */
export const SystemTemplate: Story = {
  render: () => <DialogWrapper template={RICH_TEMPLATE} buttonLabel="View System Template" />,
}

/**
 * Custom template (editable indicator).
 */
export const CustomTemplate: Story = {
  render: () => <DialogWrapper template={{ ...SIMPLE_TEMPLATE, isSystem: false }} buttonLabel="View Custom Template" />,
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={RICH_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
}

/**
 * Mobile view - bottom sheet presentation.
 * Uses iPhone frame to demonstrate responsive behavior.
 */
export const MobileFrame: Story = {
  render: () => (
    <div className="flex justify-center p-8 bg-page min-h-screen overflow-auto">
      <IPhoneMobileFrame
        storyId="flow-configuration-viewtemplatedialog--open-by-default"
        model="iphone16promax"
        scale={1}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile view at real iPhone 16 Pro Max size. Dialog renders as bottom sheet with compact fields list.',
      },
    },
  },
}

/**
 * AllStates - Visual comparison of different template types.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection title="Rich System Template" description="Full-featured template with all field types">
        <DialogWrapper template={RICH_TEMPLATE} buttonLabel="View Rich Template" />
      </StorySection>

      <StorySection title="Simple Custom Template" description="Minimal fields template">
        <DialogWrapper template={SIMPLE_TEMPLATE} buttonLabel="View Simple Template" />
      </StorySection>

      <StorySection title="Inspection Template with Lookups" description="Template using lookup references">
        <DialogWrapper template={INSPECTION_TEMPLATE} buttonLabel="View Inspection Template" />
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare different template configurations and their preview displays.',
      },
    },
  },
}

// =============================================================================
// INTERACTION TESTS
// =============================================================================

/**
 * Interaction test: Verifies template metadata is displayed correctly.
 */
export const TemplateMetadataDisplay: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={RICH_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Template title should be visible
    const title = body.getByTestId(`view-template-title-${RICH_TEMPLATE.id}`)
    await expect(title).toBeVisible()
    await expect(title).toHaveTextContent('Comprehensive Incident Report')

    // Template code should be visible
    const code = body.getByTestId(`view-template-code-${RICH_TEMPLATE.id}`)
    await expect(code).toBeVisible()
    await expect(code).toHaveTextContent('comprehensive-incident')

    // Version badge should be visible
    const version = body.getByTestId(`view-template-version-${RICH_TEMPLATE.id}`)
    await expect(version).toBeVisible()
    await expect(version).toHaveTextContent('v3')

    // System badge should be visible (this is a system template)
    const typeBadge = body.getByTestId(`view-template-type-${RICH_TEMPLATE.id}`)
    await expect(typeBadge).toBeVisible()
    await expect(typeBadge).toHaveTextContent('System')
  },
}

/**
 * Interaction test: JSON Schema toggle expands and collapses.
 */
export const JsonSchemaToggle: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={RICH_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find JSON viewer toggle
    const jsonToggle = body.getByTestId('view-template-json-toggle')
    await expect(jsonToggle).toBeVisible()

    // Initially collapsed - JSON copy button should not be visible
    const jsonCopyBefore = body.queryByTestId('view-template-json-copy')
    await expect(jsonCopyBefore).toBeNull()

    // Click to expand
    await userEvent.click(jsonToggle)

    // Wait for expansion animation
    await new Promise(resolve => setTimeout(resolve, 300))

    // JSON copy button should now be visible
    const jsonCopyAfter = body.getByTestId('view-template-json-copy')
    await expect(jsonCopyAfter).toBeVisible()

    // Click to collapse
    await userEvent.click(jsonToggle)

    // Wait for collapse animation
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}

/**
 * Interaction test: Schema fields are displayed correctly.
 */
export const SchemaFieldsDisplay: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={RICH_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Fields section should be visible
    const fieldsSection = body.getByTestId(`view-template-fields-${RICH_TEMPLATE.id}`)
    await expect(fieldsSection).toBeVisible()

    // Check some specific fields are rendered
    const titleField = body.getByTestId('view-template-field-title')
    await expect(titleField).toBeVisible()

    const severityField = body.getByTestId('view-template-field-severity')
    await expect(severityField).toBeVisible()

    const locationField = body.getByTestId('view-template-field-location')
    await expect(locationField).toBeVisible()
  },
}

/**
 * Interaction test: Close button closes the dialog.
 */
export const CloseButtonWorks: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={RICH_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Dialog should be visible
    const dialog = body.getByTestId(`view-template-dialog-${RICH_TEMPLATE.id}`)
    await expect(dialog).toBeVisible()

    // Find and click close button
    const closeButton = body.getByTestId(`view-template-close-${RICH_TEMPLATE.id}`)
    await expect(closeButton).toBeEnabled()
    await userEvent.click(closeButton)

    // Wait for dialog to close
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}

/**
 * Interaction test: Custom template shows "Custom" badge instead of "System".
 */
export const CustomTemplateBadge: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={SIMPLE_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Custom badge should be visible (not System)
    const typeBadge = body.getByTestId(`view-template-type-${SIMPLE_TEMPLATE.id}`)
    await expect(typeBadge).toBeVisible()
    await expect(typeBadge).toHaveTextContent('Custom')
  },
}

/**
 * Interaction test: Business key pattern is displayed when present.
 */
export const BusinessKeyDisplay: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTemplateDialog
        template={INSPECTION_TEMPLATE}
        open={open}
        onOpenChange={setOpen}
      />
    )
  },
  play: async () => {
    // Query from document.body since dialogs render in portals
    const body = within(document.body)

    // Wait for dialog to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Business key section should be visible
    const businessKey = body.getByTestId(`view-template-business-key-${INSPECTION_TEMPLATE.id}`)
    await expect(businessKey).toBeVisible()

    // Should contain the pattern
    await expect(businessKey).toHaveTextContent('SI-{{inspector}}-{{date}}')
  },
}
