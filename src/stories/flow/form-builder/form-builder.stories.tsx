import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from '@/flow/components/form-builder';

/**
 * Form Builder - A full-featured form builder with drag-and-drop field creation,
 * real-time preview, and JSON schema editing.
 *
 * ## Features
 * - **Drag & Drop**: Drag fields from the component palette to the canvas
 * - **Field Types**: 18 field types including basic inputs, entity selectors, and dictionaries
 * - **Properties Panel**: Configure field labels, validation, and conditional visibility
 * - **JSON Editor**: Edit the schema directly in JSON format
 * - **Live Preview**: Test the form with live data entry
 * - **Undo/Redo**: 50-step history for schema changes
 *
 * ## Field Categories
 * - **Basic Form Fields**: Label, Text Input, Textarea, Number, Select, Radio, Checkbox, Date, File Upload
 * - **Business Entities**: Location, User, Users (Multi), Role User, Asset, Vehicle, Entity
 * - **Dictionary Fields**: Dictionary Select, Cascading Dictionary
 */
const meta: Meta<typeof FormBuilder> = {
  title: 'Flow/Form Builder/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A drag-and-drop form builder for creating dynamic forms with Formily JSON Schema.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    formName: {
      control: 'text',
      description: 'Initial form name',
    },
    description: {
      control: 'text',
      description: 'Initial form description',
    },
    onBack: {
      action: 'back',
      description: 'Callback when back button is clicked',
    },
    onSave: {
      action: 'save',
      description: 'Callback when save button is clicked',
    },
    onSchemaViewer: {
      action: 'schema-viewer',
      description: 'Callback when schema viewer is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

/**
 * Default form builder with all features enabled.
 * Try dragging fields from the left panel to the canvas!
 */
export const Default: Story = {
  args: {
    formName: '',
    description: '',
  },
};

/**
 * Form builder in create mode for a new form.
 */
export const CreateNewForm: Story = {
  args: {
    formName: 'New Safety Form',
    description: 'A comprehensive safety inspection checklist',
    entityTemplate: 'inspection',
  },
};

/**
 * Form builder for editing an incident report form.
 */
export const IncidentReportForm: Story = {
  args: {
    formName: 'Incident Report Form',
    description: 'Standard incident reporting template',
    entityTemplate: 'incident',
  },
};

/**
 * Form builder with back and save callbacks.
 */
export const WithCallbacks: Story = {
  args: {
    formName: 'Safety Inspection Checklist',
    description: 'Daily safety inspection form',
    onBack: () => alert('Navigating back...'),
    onSave: () => alert('Saving form...'),
    onSchemaViewer: () => alert('Opening schema viewer...'),
  },
};
