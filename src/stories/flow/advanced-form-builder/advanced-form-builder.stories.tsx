import type { Meta, StoryObj } from '@storybook/react';
import { AdvancedFormBuilder } from '@/flow/components/advanced-form-builder';
import type { ISchema } from '@/flow/components/advanced-form-builder';

/**
 * Advanced Form Builder - Enhanced EHS form builder with advanced features.
 *
 * ## Enhancements over Basic Form Builder
 * - **Repeating Sections**: Add array fields for multi-item inspections
 * - **Advanced Conditional Logic**: AND/OR condition groups
 * - **Scoring Fields**: Pass/fail, ratings, risk matrices
 * - **Section Grouping**: Organize fields into collapsible sections
 * - **Multi-Page Forms**: Step-based form navigation
 *
 * ## Pre-built Form Examples
 * Each story below demonstrates a complete, pre-configured EHS form
 * that you can use as a starting template.
 */
const meta: Meta<typeof AdvancedFormBuilder> = {
  title: 'Flow/Advanced Form Builder/AdvancedFormBuilder',
  component: AdvancedFormBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Enhanced form builder for EHS applications with repeating sections, advanced conditional logic, and scoring fields.',
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
    entityTemplate: {
      control: 'select',
      options: [
        'incident',
        'inspection',
        'audit',
        'observation',
        'permit',
        'jsa',
        'risk-assessment',
        'training',
      ],
      description: 'Pre-selected entity template',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdvancedFormBuilder>;

// =============================================================================
// SAMPLE SCHEMAS
// =============================================================================

const SAFETY_INSPECTION_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    inspection_date: {
      type: 'string',
      title: 'Inspection Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    inspector: {
      type: 'string',
      title: 'Inspector',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 1,
    },
    location: {
      type: 'string',
      title: 'Location',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },
    inspection_type: {
      type: 'string',
      title: 'Inspection Type',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 3,
      enum: [
        { label: 'Daily Safety Walkthrough', value: 'daily' },
        { label: 'Weekly Comprehensive', value: 'weekly' },
        { label: 'Monthly Deep Dive', value: 'monthly' },
        { label: 'Quarterly Audit', value: 'quarterly' },
      ],
    },
    ppe_compliance: {
      type: 'string',
      title: 'PPE Compliance',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      'x-index': 4,
      enum: [
        { label: 'Pass', value: 'pass' },
        { label: 'Fail', value: 'fail' },
        { label: 'N/A', value: 'na' },
      ],
    },
    housekeeping: {
      type: 'string',
      title: 'Housekeeping',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      'x-index': 5,
      enum: [
        { label: 'Pass', value: 'pass' },
        { label: 'Fail', value: 'fail' },
        { label: 'N/A', value: 'na' },
      ],
    },
    fire_safety: {
      type: 'string',
      title: 'Fire Safety Equipment',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      'x-index': 6,
      enum: [
        { label: 'Pass', value: 'pass' },
        { label: 'Fail', value: 'fail' },
        { label: 'N/A', value: 'na' },
      ],
    },
    emergency_exits: {
      type: 'string',
      title: 'Emergency Exits Clear',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      'x-index': 7,
      enum: [
        { label: 'Pass', value: 'pass' },
        { label: 'Fail', value: 'fail' },
        { label: 'N/A', value: 'na' },
      ],
    },
    hazards_identified: {
      type: 'string',
      title: 'Hazards Identified',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 4,
        placeholder: 'Describe any hazards found during inspection...',
      },
      'x-index': 8,
    },
    corrective_actions: {
      type: 'string',
      title: 'Corrective Actions Required',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
        placeholder: 'List required corrective actions...',
      },
      'x-index': 9,
    },
    photos: {
      type: 'array',
      title: 'Photo Evidence',
      'x-component': 'Upload',
      'x-decorator': 'FormItem',
      'x-component-props': {
        maxCount: 10,
        accept: 'image/*',
      },
      'x-index': 10,
    },
    overall_rating: {
      type: 'number',
      title: 'Overall Safety Rating (1-5)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': {
        min: 1,
        max: 5,
      },
      'x-index': 11,
    },
  },
};

const INCIDENT_REPORT_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    incident_date: {
      type: 'string',
      title: 'Date of Incident',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    incident_time: {
      type: 'string',
      title: 'Time of Incident',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-component-props': {
        type: 'time',
      },
      'x-index': 1,
    },
    location: {
      type: 'string',
      title: 'Location',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },
    incident_type: {
      type: 'string',
      title: 'Incident Type',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 3,
      enum: [
        { label: 'Near Miss', value: 'near_miss' },
        { label: 'First Aid', value: 'first_aid' },
        { label: 'Recordable Injury', value: 'recordable' },
        { label: 'Lost Time', value: 'lost_time' },
        { label: 'Property Damage', value: 'property' },
        { label: 'Environmental', value: 'environmental' },
      ],
    },
    severity: {
      type: 'string',
      title: 'Severity',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 4,
      enum: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    injured_person: {
      type: 'string',
      title: 'Injured Person (if applicable)',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 5,
    },
    body_part: {
      type: 'string',
      title: 'Body Part Affected',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: 'BODY_PARTS',
      },
      'x-index': 6,
    },
    description: {
      type: 'string',
      title: 'Incident Description',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 5,
        placeholder: 'Describe what happened in detail...',
      },
      'x-index': 7,
    },
    immediate_actions: {
      type: 'string',
      title: 'Immediate Actions Taken',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
        placeholder: 'What actions were taken immediately after the incident?',
      },
      'x-index': 8,
    },
    witnesses: {
      type: 'array',
      title: 'Witnesses',
      'x-component': 'UserMultiSelect',
      'x-decorator': 'FormItem',
      'x-index': 9,
    },
    root_cause: {
      type: 'string',
      title: 'Preliminary Root Cause',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 10,
      enum: [
        { label: 'Human Error', value: 'human_error' },
        { label: 'Equipment Failure', value: 'equipment' },
        { label: 'Procedure Not Followed', value: 'procedure' },
        { label: 'Training Gap', value: 'training' },
        { label: 'Environmental Conditions', value: 'environmental' },
        { label: 'Other', value: 'other' },
      ],
    },
    photos: {
      type: 'array',
      title: 'Photos/Evidence',
      'x-component': 'Upload',
      'x-decorator': 'FormItem',
      'x-component-props': {
        maxCount: 10,
      },
      'x-index': 11,
    },
    reported_by: {
      type: 'string',
      title: 'Reported By',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 12,
    },
  },
};

const JSA_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    job_title: {
      type: 'string',
      title: 'Job/Task Title',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    department: {
      type: 'string',
      title: 'Department',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: 'DEPARTMENTS',
      },
      'x-index': 1,
    },
    location: {
      type: 'string',
      title: 'Work Location',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },
    analysis_date: {
      type: 'string',
      title: 'Analysis Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 3,
    },
    analyst: {
      type: 'string',
      title: 'Analyst',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 4,
    },
    supervisor: {
      type: 'string',
      title: 'Supervisor Approval',
      'x-component': 'RoleFilteredUserSelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        roleFilter: 'supervisor',
      },
      'x-index': 5,
    },
    ppe_required: {
      type: 'string',
      title: 'PPE Required',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 2,
        placeholder: 'List all required PPE for this task...',
      },
      'x-index': 6,
    },
    step_1_task: {
      type: 'string',
      title: 'Step 1: Task Description',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 7,
    },
    step_1_hazards: {
      type: 'string',
      title: 'Step 1: Potential Hazards',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 8,
    },
    step_1_controls: {
      type: 'string',
      title: 'Step 1: Hazard Controls',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 9,
    },
    step_2_task: {
      type: 'string',
      title: 'Step 2: Task Description',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 10,
    },
    step_2_hazards: {
      type: 'string',
      title: 'Step 2: Potential Hazards',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 11,
    },
    step_2_controls: {
      type: 'string',
      title: 'Step 2: Hazard Controls',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 12,
    },
    step_3_task: {
      type: 'string',
      title: 'Step 3: Task Description',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 13,
    },
    step_3_hazards: {
      type: 'string',
      title: 'Step 3: Potential Hazards',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 14,
    },
    step_3_controls: {
      type: 'string',
      title: 'Step 3: Hazard Controls',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 15,
    },
    training_required: {
      type: 'boolean',
      title: 'Additional Training Required',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 16,
    },
    review_date: {
      type: 'string',
      title: 'Next Review Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 17,
    },
  },
};

const RISK_ASSESSMENT_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    assessment_title: {
      type: 'string',
      title: 'Assessment Title',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    assessment_date: {
      type: 'string',
      title: 'Assessment Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 1,
    },
    assessor: {
      type: 'string',
      title: 'Assessor',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },
    location: {
      type: 'string',
      title: 'Location/Area',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 3,
    },
    activity_description: {
      type: 'string',
      title: 'Activity/Process Description',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
        placeholder: 'Describe the activity or process being assessed...',
      },
      'x-index': 4,
    },
    hazard_1: {
      type: 'string',
      title: 'Hazard 1',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 5,
    },
    hazard_1_likelihood: {
      type: 'number',
      title: 'Hazard 1 - Likelihood (1-5)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': { min: 1, max: 5 },
      'x-index': 6,
    },
    hazard_1_severity: {
      type: 'number',
      title: 'Hazard 1 - Severity (1-5)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': { min: 1, max: 5 },
      'x-index': 7,
    },
    hazard_1_controls: {
      type: 'string',
      title: 'Hazard 1 - Control Measures',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 8,
    },
    hazard_2: {
      type: 'string',
      title: 'Hazard 2',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 9,
    },
    hazard_2_likelihood: {
      type: 'number',
      title: 'Hazard 2 - Likelihood (1-5)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': { min: 1, max: 5 },
      'x-index': 10,
    },
    hazard_2_severity: {
      type: 'number',
      title: 'Hazard 2 - Severity (1-5)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': { min: 1, max: 5 },
      'x-index': 11,
    },
    hazard_2_controls: {
      type: 'string',
      title: 'Hazard 2 - Control Measures',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 2 },
      'x-index': 12,
    },
    residual_risk: {
      type: 'string',
      title: 'Residual Risk Level',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 13,
      enum: [
        { label: 'Low (1-4)', value: 'low' },
        { label: 'Medium (5-9)', value: 'medium' },
        { label: 'High (10-16)', value: 'high' },
        { label: 'Critical (17-25)', value: 'critical' },
      ],
    },
    review_frequency: {
      type: 'string',
      title: 'Review Frequency',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 14,
      enum: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annually', value: 'annually' },
        { label: 'As Needed', value: 'as_needed' },
      ],
    },
    approved_by: {
      type: 'string',
      title: 'Approved By',
      'x-component': 'RoleFilteredUserSelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        roleFilter: 'manager',
      },
      'x-index': 15,
    },
  },
};

const TRAINING_RECORD_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    employee: {
      type: 'string',
      title: 'Employee',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    training_course: {
      type: 'string',
      title: 'Training Course',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: 'TRAINING_COURSES',
      },
      'x-index': 1,
    },
    training_type: {
      type: 'string',
      title: 'Training Type',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 2,
      enum: [
        { label: 'Initial Training', value: 'initial' },
        { label: 'Refresher', value: 'refresher' },
        { label: 'Recertification', value: 'recert' },
        { label: 'On-the-Job', value: 'ojt' },
      ],
    },
    completion_date: {
      type: 'string',
      title: 'Completion Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 3,
    },
    expiration_date: {
      type: 'string',
      title: 'Expiration Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 4,
    },
    trainer: {
      type: 'string',
      title: 'Trainer',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 5,
    },
    training_hours: {
      type: 'number',
      title: 'Training Hours',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-index': 6,
    },
    assessment_score: {
      type: 'number',
      title: 'Assessment Score (%)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': {
        min: 0,
        max: 100,
      },
      'x-index': 7,
    },
    passed: {
      type: 'boolean',
      title: 'Passed Assessment',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 8,
    },
    certificate_number: {
      type: 'string',
      title: 'Certificate Number',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 9,
    },
    certificate_upload: {
      type: 'array',
      title: 'Certificate Upload',
      'x-component': 'Upload',
      'x-decorator': 'FormItem',
      'x-component-props': {
        maxCount: 1,
        accept: '.pdf,.jpg,.png',
      },
      'x-index': 10,
    },
    notes: {
      type: 'string',
      title: 'Notes',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
      },
      'x-index': 11,
    },
  },
};

// =============================================================================
// ADVANCED SCHEMAS - With Sections and Repeating Fields
// =============================================================================

/**
 * Site Audit with Sections - Demonstrates FormSection for grouped fields.
 * Uses collapsible sections to organize a large form into logical categories.
 */
const SITE_AUDIT_WITH_SECTIONS_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // Header Section - Always expanded
    header_section: {
      type: 'object',
      title: 'Audit Information',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 0,
      properties: {
        audit_date: {
          type: 'string',
          title: 'Audit Date',
          'x-component': 'DatePicker',
          'x-decorator': 'FormItem',
        },
        auditor: {
          type: 'string',
          title: 'Lead Auditor',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
        },
        location: {
          type: 'string',
          title: 'Site Location',
          'x-component': 'LocationSelect',
          'x-decorator': 'FormItem',
        },
        audit_type: {
          type: 'string',
          title: 'Audit Type',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Internal Audit', value: 'internal' },
            { label: 'External Audit', value: 'external' },
            { label: 'Regulatory Audit', value: 'regulatory' },
            { label: 'Certification Audit', value: 'certification' },
          ],
        },
      },
    },

    // Safety Compliance Section
    safety_section: {
      type: 'object',
      title: 'Safety Compliance',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 1,
      properties: {
        ppe_compliance: {
          type: 'string',
          title: 'PPE Compliance',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Compliant', value: 'compliant' },
            { label: 'Non-Compliant', value: 'non_compliant' },
            { label: 'Partial', value: 'partial' },
          ],
        },
        emergency_equipment: {
          type: 'string',
          title: 'Emergency Equipment Status',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Satisfactory', value: 'satisfactory' },
            { label: 'Needs Attention', value: 'needs_attention' },
            { label: 'Critical', value: 'critical' },
          ],
        },
        safety_signage: {
          type: 'boolean',
          title: 'Safety Signage Adequate',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        safety_notes: {
          type: 'string',
          title: 'Safety Observations',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 3 },
        },
      },
    },

    // Environmental Section
    environmental_section: {
      type: 'object',
      title: 'Environmental Compliance',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: true,
      },
      'x-index': 2,
      properties: {
        waste_management: {
          type: 'string',
          title: 'Waste Management',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Compliant', value: 'compliant' },
            { label: 'Non-Compliant', value: 'non_compliant' },
          ],
        },
        spill_containment: {
          type: 'string',
          title: 'Spill Containment',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Adequate', value: 'adequate' },
            { label: 'Inadequate', value: 'inadequate' },
          ],
        },
        environmental_notes: {
          type: 'string',
          title: 'Environmental Observations',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 3 },
        },
      },
    },

    // Documentation Section - Collapsed by default
    documentation_section: {
      type: 'object',
      title: 'Documentation Review',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: true,
      },
      'x-index': 3,
      properties: {
        permits_current: {
          type: 'boolean',
          title: 'All Permits Current',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        training_records: {
          type: 'boolean',
          title: 'Training Records Up to Date',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        inspection_logs: {
          type: 'boolean',
          title: 'Inspection Logs Available',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        documentation_notes: {
          type: 'string',
          title: 'Documentation Notes',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 2 },
        },
      },
    },

    // Summary Section
    summary_section: {
      type: 'object',
      title: 'Audit Summary',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: false, // Always visible
      },
      'x-index': 4,
      properties: {
        overall_rating: {
          type: 'number',
          title: 'Overall Rating (1-5)',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
        },
        findings_summary: {
          type: 'string',
          title: 'Key Findings',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 4 },
        },
        photos: {
          type: 'array',
          title: 'Photo Evidence',
          'x-component': 'Upload',
          'x-decorator': 'FormItem',
          'x-component-props': { maxCount: 10 },
        },
      },
    },
  },
};

/**
 * Incident Report with Witnesses - Demonstrates ArrayField for repeating entries.
 * Uses repeating sections for witnesses, involved parties, and corrective actions.
 */
const INCIDENT_WITH_REPEATING_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // Basic incident info
    incident_date: {
      type: 'string',
      title: 'Date of Incident',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    incident_time: {
      type: 'string',
      title: 'Time of Incident',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-component-props': { type: 'time' },
      'x-index': 1,
    },
    location: {
      type: 'string',
      title: 'Location',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },
    description: {
      type: 'string',
      title: 'Incident Description',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 4,
        placeholder: 'Describe what happened...',
      },
      'x-index': 3,
    },

    // Repeating Section: Involved Persons
    involved_persons: {
      type: 'array',
      title: 'Involved Persons',
      'x-component': 'ArrayField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        minItems: 1,
        maxItems: 10,
        addButtonText: 'Add Person',
      },
      'x-index': 4,
      items: {
        type: 'object',
        properties: {
          person: {
            type: 'string',
            title: 'Person',
            'x-component': 'UserSelect',
            'x-decorator': 'FormItem',
          },
          role: {
            type: 'string',
            title: 'Role in Incident',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Injured Party', value: 'injured' },
              { label: 'First Responder', value: 'responder' },
              { label: 'Supervisor', value: 'supervisor' },
              { label: 'Other', value: 'other' },
            ],
          },
          injury_type: {
            type: 'string',
            title: 'Injury Type (if applicable)',
            'x-component': 'DictionarySelect',
            'x-decorator': 'FormItem',
            'x-component-props': { dictionaryCode: 'INJURY_TYPES' },
          },
        },
      },
    },

    // Repeating Section: Witnesses
    witnesses: {
      type: 'array',
      title: 'Witnesses',
      'x-component': 'ArrayField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        minItems: 0,
        maxItems: 8,
        addButtonText: 'Add Witness',
      },
      'x-index': 5,
      items: {
        type: 'object',
        properties: {
          witness_name: {
            type: 'string',
            title: 'Witness',
            'x-component': 'UserSelect',
            'x-decorator': 'FormItem',
          },
          witness_statement: {
            type: 'string',
            title: 'Statement',
            'x-component': 'TextArea',
            'x-decorator': 'FormItem',
            'x-component-props': {
              rows: 3,
              placeholder: 'Record witness statement...',
            },
          },
          contact_number: {
            type: 'string',
            title: 'Contact Number',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
        },
      },
    },

    // Repeating Section: Corrective Actions
    corrective_actions: {
      type: 'array',
      title: 'Corrective Actions',
      'x-component': 'ArrayField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        minItems: 0,
        maxItems: 5,
        addButtonText: 'Add Corrective Action',
      },
      'x-index': 6,
      items: {
        type: 'object',
        properties: {
          action_description: {
            type: 'string',
            title: 'Action Required',
            'x-component': 'TextArea',
            'x-decorator': 'FormItem',
            'x-component-props': { rows: 2 },
          },
          assigned_to: {
            type: 'string',
            title: 'Assigned To',
            'x-component': 'UserSelect',
            'x-decorator': 'FormItem',
          },
          due_date: {
            type: 'string',
            title: 'Due Date',
            'x-component': 'DatePicker',
            'x-decorator': 'FormItem',
          },
          priority: {
            type: 'string',
            title: 'Priority',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Critical', value: 'critical' },
            ],
          },
        },
      },
    },

    // Final fields
    photos: {
      type: 'array',
      title: 'Photo Evidence',
      'x-component': 'Upload',
      'x-decorator': 'FormItem',
      'x-component-props': { maxCount: 10 },
      'x-index': 7,
    },
    reported_by: {
      type: 'string',
      title: 'Reported By',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 8,
    },
  },
};

/**
 * PPE Inspection with Equipment List - Demonstrates ArrayField for PPE items.
 * Each worker's PPE is documented as a repeating section.
 */
const PPE_INSPECTION_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    inspection_date: {
      type: 'string',
      title: 'Inspection Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 0,
    },
    inspector: {
      type: 'string',
      title: 'Inspector',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 1,
    },
    location: {
      type: 'string',
      title: 'Work Area',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },

    // Repeating Section: Worker PPE Checks
    worker_ppe_checks: {
      type: 'array',
      title: 'Worker PPE Inspections',
      'x-component': 'ArrayField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        minItems: 1,
        maxItems: 20,
        addButtonText: 'Add Worker',
      },
      'x-index': 3,
      items: {
        type: 'object',
        properties: {
          worker: {
            type: 'string',
            title: 'Worker',
            'x-component': 'UserSelect',
            'x-decorator': 'FormItem',
          },
          hard_hat: {
            type: 'string',
            title: 'Hard Hat',
            'x-component': 'RadioGroup',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
              { label: 'N/A', value: 'na' },
            ],
          },
          safety_glasses: {
            type: 'string',
            title: 'Safety Glasses',
            'x-component': 'RadioGroup',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
              { label: 'N/A', value: 'na' },
            ],
          },
          safety_vest: {
            type: 'string',
            title: 'Safety Vest',
            'x-component': 'RadioGroup',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
              { label: 'N/A', value: 'na' },
            ],
          },
          steel_toe_boots: {
            type: 'string',
            title: 'Steel Toe Boots',
            'x-component': 'RadioGroup',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
              { label: 'N/A', value: 'na' },
            ],
          },
          gloves: {
            type: 'string',
            title: 'Work Gloves',
            'x-component': 'RadioGroup',
            'x-decorator': 'FormItem',
            enum: [
              { label: 'Pass', value: 'pass' },
              { label: 'Fail', value: 'fail' },
              { label: 'N/A', value: 'na' },
            ],
          },
          notes: {
            type: 'string',
            title: 'Notes',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
        },
      },
    },

    // Summary
    overall_compliance: {
      type: 'string',
      title: 'Overall PPE Compliance',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 4,
      enum: [
        { label: '100% Compliant', value: 'full' },
        { label: 'Partial Compliance', value: 'partial' },
        { label: 'Non-Compliant', value: 'non_compliant' },
      ],
    },
    action_taken: {
      type: 'string',
      title: 'Action Taken for Non-Compliance',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': { rows: 3 },
      'x-index': 5,
    },
  },
};

// =============================================================================
// STORIES
// =============================================================================

/**
 * Empty form builder - start from scratch.
 */
export const Default: Story = {
  args: {
    formName: '',
    description: '',
  },
};

/**
 * **Safety Inspection Form** - Complete daily inspection checklist.
 *
 * Includes:
 * - Inspector and location selection
 * - Pass/fail scoring for PPE, housekeeping, fire safety
 * - Hazard identification textarea
 * - Photo evidence upload
 * - Overall safety rating
 */
export const SafetyInspection: Story = {
  args: {
    formName: 'Daily Safety Inspection',
    description: 'Comprehensive safety inspection checklist with pass/fail scoring',
    entityTemplate: 'inspection',
    initialSchema: SAFETY_INSPECTION_SCHEMA,
  },
};

/**
 * **Incident Report Form** - Full incident documentation.
 *
 * Includes:
 * - Date/time/location capture
 * - Incident type and severity classification
 * - Injured person and body part fields
 * - Witness multi-select
 * - Root cause analysis
 * - Photo evidence
 */
export const IncidentReport: Story = {
  args: {
    formName: 'Incident Report Form',
    description: 'Standard incident reporting template with witness statements',
    entityTemplate: 'incident',
    initialSchema: INCIDENT_REPORT_SCHEMA,
  },
};

/**
 * **Job Safety Analysis (JSA)** - Task hazard analysis form.
 *
 * Demonstrates repeating pattern (steps 1-3) that would benefit from
 * array field support. Includes:
 * - Job/task identification
 * - PPE requirements
 * - Step-by-step hazard analysis
 * - Supervisor approval
 */
export const JobSafetyAnalysis: Story = {
  args: {
    formName: 'Job Safety Analysis',
    description: 'Step-by-step task hazard analysis with controls',
    entityTemplate: 'jsa',
    initialSchema: JSA_SCHEMA,
  },
};

/**
 * **Risk Assessment Form** - Likelihood × Severity matrix.
 *
 * Includes:
 * - Activity description
 * - Multiple hazard entries with L×S scoring
 * - Control measures per hazard
 * - Residual risk calculation
 * - Management approval
 */
export const RiskAssessment: Story = {
  args: {
    formName: 'Risk Assessment Form',
    description: 'Comprehensive risk assessment with scoring matrix',
    entityTemplate: 'risk-assessment',
    initialSchema: RISK_ASSESSMENT_SCHEMA,
  },
};

/**
 * **Training Record Form** - Employee training documentation.
 *
 * Includes:
 * - Employee and course selection
 * - Training type and dates
 * - Assessment scoring
 * - Certificate upload
 */
export const TrainingRecord: Story = {
  args: {
    formName: 'Training Completion Record',
    description: 'Document employee training completion and certifications',
    entityTemplate: 'training',
    initialSchema: TRAINING_RECORD_SCHEMA,
  },
};

// =============================================================================
// ADVANCED FEATURE STORIES - Sections & Repeating Fields
// =============================================================================

/**
 * **Site Audit with Sections** - Demonstrates collapsible FormSection grouping.
 *
 * This example shows how to organize a large form into logical sections:
 * - **Audit Information** - Header fields (always expanded)
 * - **Safety Compliance** - PPE, emergency equipment checks
 * - **Environmental Compliance** - Waste, spill containment (collapsed by default)
 * - **Documentation Review** - Permits, records (collapsed by default)
 * - **Audit Summary** - Overall rating, findings (non-collapsible)
 *
 * Each section uses `type: 'object'` with `x-component: 'FormSection'`
 * and can have `collapsible` and `defaultCollapsed` props.
 */
export const SiteAuditWithSections: Story = {
  args: {
    formName: 'Comprehensive Site Audit',
    description: 'Multi-section audit form with collapsible grouping',
    entityTemplate: 'audit',
    initialSchema: SITE_AUDIT_WITH_SECTIONS_SCHEMA,
  },
};

/**
 * **Incident with Witnesses** - Demonstrates ArrayField for repeating entries.
 *
 * This example shows how to capture multiple entries of the same type:
 * - **Involved Persons** - Add multiple people involved (min: 1, max: 10)
 * - **Witnesses** - Add witness statements (min: 0, max: 8)
 * - **Corrective Actions** - Track action items (min: 0, max: 5)
 *
 * Each repeating section uses `type: 'array'` with `x-component: 'ArrayField'`
 * and defines the `items` template for each entry.
 */
export const IncidentWithWitnesses: Story = {
  args: {
    formName: 'Incident Report with Witnesses',
    description: 'Incident form with repeating sections for witnesses and corrective actions',
    entityTemplate: 'incident',
    initialSchema: INCIDENT_WITH_REPEATING_SCHEMA,
  },
};

/**
 * **PPE Inspection Checklist** - Demonstrates ArrayField for worker-by-worker checks.
 *
 * Real-world use case: Inspect each worker's PPE individually with:
 * - Worker selection
 * - Pass/Fail/N/A for each PPE item (hard hat, glasses, vest, boots, gloves)
 * - Notes field per worker
 *
 * This pattern is common in EHS for:
 * - Multi-worker inspections
 * - Equipment checklists per asset
 * - Crew safety briefings
 */
export const PPEInspection: Story = {
  args: {
    formName: 'Worker PPE Inspection',
    description: 'Per-worker PPE compliance checklist with pass/fail scoring',
    entityTemplate: 'inspection',
    initialSchema: PPE_INSPECTION_SCHEMA,
  },
};

/**
 * **Risk Matrix with Calculated Score** - Demonstrates CalculatedField component.
 *
 * Shows how calculated fields auto-compute values from other form fields:
 * - Likelihood (1-5) × Severity (1-5) = Risk Score
 * - Formula: `likelihood * severity`
 * - Result type: number with 0 decimal places
 *
 * This pattern is common for:
 * - Risk matrices (L × S)
 * - Total calculations (sum of items)
 * - BMI, percentages, weighted scores
 */
export const RiskMatrixCalculated: Story = {
  args: {
    formName: 'Risk Matrix with Calculation',
    description: 'Demonstrates calculated field for automatic risk scoring',
    entityTemplate: 'risk-assessment',
    initialSchema: {
      type: 'object',
      properties: {
        hazard_name: {
          type: 'string',
          title: 'Hazard Description',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          'x-index': 0,
        },
        likelihood: {
          type: 'number',
          title: 'Likelihood (1-5)',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 1,
        },
        severity: {
          type: 'number',
          title: 'Severity (1-5)',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 2,
        },
        risk_score: {
          type: 'number',
          title: 'Risk Score',
          'x-component': 'CalculatedField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            formula: 'likelihood * severity',
            sourceFields: ['likelihood', 'severity'],
            resultType: 'number',
            decimalPlaces: 0,
          },
          'x-index': 3,
        },
        risk_level: {
          type: 'string',
          title: 'Risk Level',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          'x-index': 4,
          enum: [
            { label: 'Low (1-4)', value: 'low' },
            { label: 'Medium (5-9)', value: 'medium' },
            { label: 'High (10-16)', value: 'high' },
            { label: 'Critical (17-25)', value: 'critical' },
          ],
        },
        control_measures: {
          type: 'string',
          title: 'Control Measures',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 3 },
          'x-index': 5,
        },
      },
    },
  },
};

/**
 * Form builder with all callbacks enabled for testing interactions.
 */
export const WithCallbacks: Story = {
  args: {
    formName: 'Interactive Form',
    description: 'Form with all callbacks enabled',
    initialSchema: SAFETY_INSPECTION_SCHEMA,
    onBack: () => alert('Navigating back...'),
    onSave: () => alert('Saving form...'),
  },
};

/**
 * Form builder showing the saving state UI.
 */
export const SavingState: Story = {
  args: {
    formName: 'Form Being Saved',
    description: 'Demonstrates the saving state UI',
    initialSchema: SAFETY_INSPECTION_SCHEMA,
    isSaving: true,
  },
};

// =============================================================================
// CONDITIONAL VISIBILITY STORIES
// =============================================================================

/**
 * Schema demonstrating basic conditional visibility.
 * Fields show/hide/disable based on other field values.
 */
const CONDITIONAL_VISIBILITY_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // Trigger field: Controls visibility of other fields
    incident_type: {
      type: 'string',
      title: 'Incident Type',
      description: 'Select an incident type to see conditional fields appear',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 0,
      enum: [
        { label: 'Near Miss', value: 'near_miss' },
        { label: 'First Aid', value: 'first_aid' },
        { label: 'Recordable Injury', value: 'recordable' },
        { label: 'Property Damage', value: 'property' },
      ],
    },

    // CONDITIONAL: Shows only when incident_type === 'first_aid' OR 'recordable'
    injured_person: {
      type: 'string',
      title: 'Injured Person',
      description: 'This field appears for First Aid or Recordable Injury',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 1,
      'x-reactions': {
        dependencies: ['incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'first_aid' || $deps[0] === 'recordable'}}",
          },
        },
      },
    },

    // CONDITIONAL: Shows only when incident_type === 'first_aid' OR 'recordable'
    body_part: {
      type: 'string',
      title: 'Body Part Affected',
      description: 'Appears along with Injured Person field',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: 'BODY_PARTS',
      },
      'x-index': 2,
      'x-reactions': {
        dependencies: ['incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'first_aid' || $deps[0] === 'recordable'}}",
          },
        },
      },
    },

    // CONDITIONAL: Shows only when incident_type === 'recordable'
    days_lost: {
      type: 'number',
      title: 'Days Lost',
      description: 'Only appears for Recordable Injury (most severe case)',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': {
        min: 0,
        max: 365,
      },
      'x-index': 3,
      'x-reactions': {
        dependencies: ['incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'recordable'}}",
          },
        },
      },
    },

    // CONDITIONAL: Shows only when incident_type === 'property'
    damage_cost: {
      type: 'number',
      title: 'Estimated Damage Cost ($)',
      description: 'Only appears for Property Damage incidents',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      'x-component-props': {
        min: 0,
      },
      'x-index': 4,
      'x-reactions': {
        dependencies: ['incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'property'}}",
          },
        },
      },
    },

    // CONDITIONAL: Shows only when incident_type === 'property'
    asset_affected: {
      type: 'string',
      title: 'Asset Affected',
      description: 'Only appears for Property Damage incidents',
      'x-component': 'AssetSelect',
      'x-decorator': 'FormItem',
      'x-index': 5,
      'x-reactions': {
        dependencies: ['incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'property'}}",
          },
        },
      },
    },

    // Separator
    separator1: {
      type: 'void',
      title: '',
      'x-component': 'FormText',
      'x-decorator': 'FormItem',
      'x-component-props': {
        content: '---',
      },
      'x-index': 6,
    },

    // DISABLE EXAMPLE: Checkbox controls whether field is editable
    requires_investigation: {
      type: 'boolean',
      title: 'Requires Investigation',
      description: 'Check this to enable investigation fields below',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 7,
    },

    // CONDITIONAL DISABLE: Disabled unless requires_investigation is checked
    investigator: {
      type: 'string',
      title: 'Assigned Investigator',
      description: 'Disabled until "Requires Investigation" is checked',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 8,
      'x-reactions': {
        dependencies: ['requires_investigation'],
        fulfill: {
          state: {
            disabled: '{{!$deps[0]}}',
          },
        },
      },
    },

    // CONDITIONAL DISABLE: Disabled unless requires_investigation is checked
    investigation_due_date: {
      type: 'string',
      title: 'Investigation Due Date',
      description: 'Disabled until "Requires Investigation" is checked',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 9,
      'x-reactions': {
        dependencies: ['requires_investigation'],
        fulfill: {
          state: {
            disabled: '{{!$deps[0]}}',
          },
        },
      },
    },

    // Always visible fields
    description: {
      type: 'string',
      title: 'Incident Description',
      description: 'This field is always visible',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 4,
        placeholder: 'Describe what happened...',
      },
      'x-index': 10,
    },
  },
};

/**
 * **Conditional Visibility Demo** - Shows fields based on other field values.
 *
 * This example demonstrates how to conditionally show/hide/disable fields:
 *
 * **Show/Hide based on Select value:**
 * - Select "First Aid" → Shows "Injured Person" and "Body Part"
 * - Select "Recordable Injury" → Shows injury fields PLUS "Days Lost"
 * - Select "Property Damage" → Shows "Damage Cost" and "Asset Affected"
 * - Select "Near Miss" → Only basic fields shown
 *
 * **Disable based on Checkbox:**
 * - "Requires Investigation" checkbox controls investigator fields
 * - When unchecked, investigator and due date fields are disabled
 * - When checked, fields become editable
 *
 * Uses `x-reactions` with `dependencies` and `fulfill.state.visible/disabled`.
 */
export const ConditionalVisibility: Story = {
  args: {
    formName: 'Conditional Visibility Demo',
    description: 'Demonstrates show/hide/disable based on field values',
    entityTemplate: 'incident',
    initialSchema: CONDITIONAL_VISIBILITY_SCHEMA,
  },
};

// =============================================================================
// ADVANCED AND/OR CONDITIONAL LOGIC STORIES
// =============================================================================

/**
 * Schema demonstrating advanced AND/OR conditional groups.
 * Uses _advancedConditional metadata for complex logic.
 */
const ADVANCED_CONDITIONS_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // Trigger fields
    work_type: {
      type: 'string',
      title: 'Type of Work',
      description: 'Select work type to see conditional fields',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 0,
      enum: [
        { label: 'Hot Work (Welding, Cutting)', value: 'hot_work' },
        { label: 'Confined Space Entry', value: 'confined_space' },
        { label: 'Working at Heights', value: 'heights' },
        { label: 'Electrical Work', value: 'electrical' },
        { label: 'General Maintenance', value: 'general' },
      ],
    },

    risk_level: {
      type: 'string',
      title: 'Risk Level',
      description: 'Risk level affects which approvals are required',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 1,
      enum: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },

    involves_contractors: {
      type: 'boolean',
      title: 'Involves External Contractors',
      description: 'Check if external contractors are performing the work',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 2,
    },

    // Separator
    separator1: {
      type: 'void',
      title: 'Conditional Fields Below',
      'x-component': 'FormText',
      'x-decorator': 'FormItem',
      'x-component-props': {
        content: '▼ The fields below appear based on AND/OR conditions',
      },
      'x-index': 3,
    },

    // AND CONDITION: Shows when work_type is hot_work AND risk_level is high/critical
    fire_watch: {
      type: 'string',
      title: 'Fire Watch Personnel',
      description: 'Appears when: Hot Work AND High/Critical Risk',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
      'x-index': 4,
      'x-reactions': {
        dependencies: ['work_type', 'risk_level'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'hot_work' && ($deps[1] === 'high' || $deps[1] === 'critical')}}",
          },
        },
        _advancedConditional: {
          enabled: true,
          groups: [
            {
              id: 'group1',
              operator: 'AND',
              conditions: [
                { id: 'c1', field: 'work_type', operator: 'equals', value: 'hot_work' },
                { id: 'c2', field: 'risk_level', operator: 'in', value: ['high', 'critical'] },
              ],
            },
          ],
          action: 'show',
        },
      },
    },

    // AND CONDITION: Shows when confined_space AND (high OR critical risk)
    rescue_team: {
      type: 'array',
      title: 'Rescue Team Members',
      description: 'Appears when: Confined Space AND High/Critical Risk',
      'x-component': 'UserMultiSelect',
      'x-decorator': 'FormItem',
      'x-index': 5,
      'x-reactions': {
        dependencies: ['work_type', 'risk_level'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'confined_space' && ($deps[1] === 'high' || $deps[1] === 'critical')}}",
          },
        },
        _advancedConditional: {
          enabled: true,
          groups: [
            {
              id: 'group1',
              operator: 'AND',
              conditions: [
                { id: 'c1', field: 'work_type', operator: 'equals', value: 'confined_space' },
                { id: 'c2', field: 'risk_level', operator: 'in', value: ['high', 'critical'] },
              ],
            },
          ],
          action: 'show',
        },
      },
    },

    // OR CONDITION: Shows when high risk OR critical risk OR involves contractors
    manager_approval: {
      type: 'string',
      title: 'Manager Approval Required',
      description: 'Appears when: High Risk OR Critical Risk OR External Contractors',
      'x-component': 'RoleFilteredUserSelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        roleFilter: 'manager',
      },
      'x-index': 6,
      'x-reactions': {
        dependencies: ['risk_level', 'involves_contractors'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'high' || $deps[0] === 'critical' || $deps[1] === true}}",
          },
        },
        _advancedConditional: {
          enabled: true,
          groups: [
            {
              id: 'group1',
              operator: 'OR',
              conditions: [
                { id: 'c1', field: 'risk_level', operator: 'equals', value: 'high' },
                { id: 'c2', field: 'risk_level', operator: 'equals', value: 'critical' },
                { id: 'c3', field: 'involves_contractors', operator: 'equals', value: true },
              ],
            },
          ],
          action: 'show',
        },
      },
    },

    // AND + OR: Shows when (heights OR confined_space) AND (high OR critical)
    fall_protection_plan: {
      type: 'string',
      title: 'Fall Protection Plan',
      description: 'Appears when: (Heights OR Confined Space) AND (High OR Critical Risk)',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
        placeholder: 'Describe fall protection measures...',
      },
      'x-index': 7,
      'x-reactions': {
        dependencies: ['work_type', 'risk_level'],
        fulfill: {
          state: {
            visible: "{{($deps[0] === 'heights' || $deps[0] === 'confined_space') && ($deps[1] === 'high' || $deps[1] === 'critical')}}",
          },
        },
        _advancedConditional: {
          enabled: true,
          groups: [
            {
              id: 'group1',
              operator: 'AND',
              conditions: [
                { id: 'c1', field: 'work_type', operator: 'in', value: ['heights', 'confined_space'] },
                { id: 'c2', field: 'risk_level', operator: 'in', value: ['high', 'critical'] },
              ],
            },
          ],
          action: 'show',
        },
      },
    },

    // Complex: Shows when contractors AND (NOT general maintenance)
    contractor_briefing: {
      type: 'boolean',
      title: 'Contractor Safety Briefing Completed',
      description: 'Appears when: External Contractors AND NOT General Maintenance',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 8,
      'x-reactions': {
        dependencies: ['involves_contractors', 'work_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === true && $deps[1] !== 'general'}}",
          },
        },
        _advancedConditional: {
          enabled: true,
          groups: [
            {
              id: 'group1',
              operator: 'AND',
              conditions: [
                { id: 'c1', field: 'involves_contractors', operator: 'equals', value: true },
                { id: 'c2', field: 'work_type', operator: 'notEquals', value: 'general' },
              ],
            },
          ],
          action: 'show',
        },
      },
    },

    // Always visible
    notes: {
      type: 'string',
      title: 'Additional Notes',
      description: 'Always visible field',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
      },
      'x-index': 9,
    },
  },
};

/**
 * **Advanced AND/OR Conditions Demo** - Complex conditional logic groups.
 *
 * This example demonstrates advanced conditional visibility with AND/OR logic:
 *
 * **AND Conditions (all must be true):**
 * - "Fire Watch" appears when Hot Work **AND** High/Critical Risk
 * - "Rescue Team" appears when Confined Space **AND** High/Critical Risk
 *
 * **OR Conditions (any can be true):**
 * - "Manager Approval" appears when High Risk **OR** Critical Risk **OR** External Contractors
 *
 * **Combined AND/OR:**
 * - "Fall Protection Plan" appears when (Heights **OR** Confined Space) **AND** (High **OR** Critical)
 *
 * **NOT Conditions:**
 * - "Contractor Briefing" appears when External Contractors **AND NOT** General Maintenance
 *
 * Uses `_advancedConditional` metadata in `x-reactions` for UI display.
 */
export const AdvancedConditions: Story = {
  args: {
    formName: 'Advanced AND/OR Conditions Demo',
    description: 'Demonstrates complex conditional logic with AND/OR groups',
    entityTemplate: 'permit',
    initialSchema: ADVANCED_CONDITIONS_SCHEMA,
  },
};

// =============================================================================
// COMPLETE FEATURE SHOWCASE
// =============================================================================

/**
 * Schema combining ALL advanced features in one comprehensive form.
 * Demonstrates: FormSection, ArrayField, CalculatedField, Conditional Visibility, AND/OR Logic.
 */
const COMPLETE_SHOWCASE_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // =============================
    // SECTION 1: Header Information (FormSection)
    // =============================
    header_section: {
      type: 'object',
      title: '1. Permit Information',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 0,
      properties: {
        permit_date: {
          type: 'string',
          title: 'Permit Date',
          'x-component': 'DatePicker',
          'x-decorator': 'FormItem',
        },
        location: {
          type: 'string',
          title: 'Work Location',
          'x-component': 'LocationSelect',
          'x-decorator': 'FormItem',
        },
        requestor: {
          type: 'string',
          title: 'Permit Requestor',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
        },
        work_type: {
          type: 'string',
          title: 'Type of Work',
          description: 'This selection controls which sections appear below',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Hot Work (Welding, Cutting)', value: 'hot_work' },
            { label: 'Confined Space Entry', value: 'confined_space' },
            { label: 'Working at Heights', value: 'heights' },
            { label: 'Electrical Work', value: 'electrical' },
          ],
        },
      },
    },

    // =============================
    // SECTION 2: Risk Assessment (FormSection + CalculatedField)
    // =============================
    risk_section: {
      type: 'object',
      title: '2. Risk Assessment',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 1,
      properties: {
        likelihood: {
          type: 'number',
          title: 'Likelihood (1-5)',
          description: 'Probability of incident occurring',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
        },
        severity: {
          type: 'number',
          title: 'Severity (1-5)',
          description: 'Potential impact if incident occurs',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
        },
        // CALCULATED FIELD: Auto-computes risk score
        risk_score: {
          type: 'number',
          title: 'Risk Score (Auto-Calculated)',
          description: 'Automatically calculated as Likelihood × Severity',
          'x-component': 'CalculatedField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            formula: 'likelihood * severity',
            sourceFields: ['risk_section.likelihood', 'risk_section.severity'],
            resultType: 'number',
            decimalPlaces: 0,
          },
        },
        risk_level: {
          type: 'string',
          title: 'Risk Level',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Low (1-4)', value: 'low' },
            { label: 'Medium (5-9)', value: 'medium' },
            { label: 'High (10-16)', value: 'high' },
            { label: 'Critical (17-25)', value: 'critical' },
          ],
        },
      },
    },

    // =============================
    // SECTION 3: Hot Work Specific (Conditional FormSection)
    // Shows only when work_type === 'hot_work'
    // =============================
    hot_work_section: {
      type: 'object',
      title: '3. Hot Work Requirements',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 2,
      'x-reactions': {
        dependencies: ['header_section.work_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'hot_work'}}",
          },
        },
      },
      properties: {
        fire_watch: {
          type: 'string',
          title: 'Fire Watch Personnel',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
        },
        fire_extinguisher_location: {
          type: 'string',
          title: 'Fire Extinguisher Location',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
        },
        combustibles_removed: {
          type: 'boolean',
          title: 'Combustibles Removed from Area',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        fire_blankets_available: {
          type: 'boolean',
          title: 'Fire Blankets Available',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
      },
    },

    // =============================
    // SECTION 4: Confined Space Specific (Conditional FormSection)
    // Shows only when work_type === 'confined_space'
    // =============================
    confined_space_section: {
      type: 'object',
      title: '3. Confined Space Requirements',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 3,
      'x-reactions': {
        dependencies: ['header_section.work_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'confined_space'}}",
          },
        },
      },
      properties: {
        atmosphere_tested: {
          type: 'boolean',
          title: 'Atmosphere Tested',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
        oxygen_level: {
          type: 'number',
          title: 'Oxygen Level (%)',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 0, max: 100 },
        },
        rescue_plan: {
          type: 'string',
          title: 'Rescue Plan',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 3 },
        },
        standby_person: {
          type: 'string',
          title: 'Standby Person',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
        },
      },
    },

    // =============================
    // SECTION 5: Heights Specific (Conditional FormSection)
    // Shows only when work_type === 'heights'
    // =============================
    heights_section: {
      type: 'object',
      title: '3. Working at Heights Requirements',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 4,
      'x-reactions': {
        dependencies: ['header_section.work_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'heights'}}",
          },
        },
      },
      properties: {
        height_meters: {
          type: 'number',
          title: 'Working Height (meters)',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 0 },
        },
        fall_protection_type: {
          type: 'string',
          title: 'Fall Protection Type',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Full Body Harness', value: 'harness' },
            { label: 'Safety Net', value: 'net' },
            { label: 'Guardrails', value: 'guardrails' },
            { label: 'Scaffold', value: 'scaffold' },
          ],
        },
        anchor_points_inspected: {
          type: 'boolean',
          title: 'Anchor Points Inspected',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
        },
      },
    },

    // =============================
    // SECTION 6: Hazard Controls (ArrayField - Repeating)
    // =============================
    hazard_controls_section: {
      type: 'object',
      title: '4. Hazard Controls',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 5,
      properties: {
        // ARRAY FIELD: Add multiple hazards
        hazards: {
          type: 'array',
          title: 'Identified Hazards',
          'x-component': 'ArrayField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            minItems: 1,
            maxItems: 10,
            addButtonText: 'Add Hazard',
          },
          items: {
            type: 'object',
            properties: {
              hazard_description: {
                type: 'string',
                title: 'Hazard',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              control_measure: {
                type: 'string',
                title: 'Control Measure',
                'x-component': 'TextArea',
                'x-decorator': 'FormItem',
                'x-component-props': { rows: 2 },
              },
              responsible_person: {
                type: 'string',
                title: 'Responsible Person',
                'x-component': 'UserSelect',
                'x-decorator': 'FormItem',
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 7: Workers (ArrayField - Repeating)
    // =============================
    workers_section: {
      type: 'object',
      title: '5. Authorized Workers',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: true,
      },
      'x-index': 6,
      properties: {
        // ARRAY FIELD: Add multiple workers
        workers: {
          type: 'array',
          title: 'Workers on Permit',
          'x-component': 'ArrayField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            minItems: 1,
            maxItems: 20,
            addButtonText: 'Add Worker',
          },
          items: {
            type: 'object',
            properties: {
              worker: {
                type: 'string',
                title: 'Worker',
                'x-component': 'UserSelect',
                'x-decorator': 'FormItem',
              },
              role: {
                type: 'string',
                title: 'Role',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                enum: [
                  { label: 'Lead Worker', value: 'lead' },
                  { label: 'Assistant', value: 'assistant' },
                  { label: 'Observer', value: 'observer' },
                ],
              },
              training_verified: {
                type: 'boolean',
                title: 'Training Verified',
                'x-component': 'Checkbox',
                'x-decorator': 'FormItem',
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 8: Approvals (Conditional based on risk level)
    // =============================
    approvals_section: {
      type: 'object',
      title: '6. Approvals',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: false,
      },
      'x-index': 7,
      properties: {
        supervisor_approval: {
          type: 'string',
          title: 'Supervisor Approval',
          description: 'Always required',
          'x-component': 'RoleFilteredUserSelect',
          'x-decorator': 'FormItem',
          'x-component-props': {
            roleFilter: 'supervisor',
          },
        },
        // CONDITIONAL: Shows when risk_level is high or critical
        manager_approval: {
          type: 'string',
          title: 'Manager Approval',
          description: 'Required for High/Critical risk only',
          'x-component': 'RoleFilteredUserSelect',
          'x-decorator': 'FormItem',
          'x-component-props': {
            roleFilter: 'manager',
          },
          'x-reactions': {
            dependencies: ['risk_section.risk_level'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'high' || $deps[0] === 'critical'}}",
              },
            },
            _advancedConditional: {
              enabled: true,
              groups: [
                {
                  id: 'group1',
                  operator: 'OR',
                  conditions: [
                    { id: 'c1', field: 'risk_section.risk_level', operator: 'equals', value: 'high' },
                    { id: 'c2', field: 'risk_section.risk_level', operator: 'equals', value: 'critical' },
                  ],
                },
              ],
              action: 'show',
            },
          },
        },
        // CONDITIONAL: Shows when risk_level is critical
        safety_director_approval: {
          type: 'string',
          title: 'Safety Director Approval',
          description: 'Required for Critical risk only',
          'x-component': 'RoleFilteredUserSelect',
          'x-decorator': 'FormItem',
          'x-component-props': {
            roleFilter: 'director',
          },
          'x-reactions': {
            dependencies: ['risk_section.risk_level'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'critical'}}",
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 9: Documentation
    // =============================
    documentation_section: {
      type: 'object',
      title: '7. Documentation',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: true,
      },
      'x-index': 8,
      properties: {
        photos: {
          type: 'array',
          title: 'Photos',
          'x-component': 'Upload',
          'x-decorator': 'FormItem',
          'x-component-props': {
            maxCount: 10,
            accept: 'image/*',
          },
        },
        additional_notes: {
          type: 'string',
          title: 'Additional Notes',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': { rows: 4 },
        },
      },
    },
  },
};

/**
 * **Complete Feature Showcase** - All advanced features in one form.
 *
 * This comprehensive permit-to-work form demonstrates ALL advanced features:
 *
 * **1. FormSection Grouping:**
 * - 9 collapsible sections organizing the form
 * - Some collapsed by default, some always open
 *
 * **2. Conditional Sections (show/hide entire sections):**
 * - "Hot Work Requirements" - shows only when work type is Hot Work
 * - "Confined Space Requirements" - shows only for Confined Space
 * - "Working at Heights" - shows only for Heights work
 *
 * **3. CalculatedField:**
 * - Risk Score auto-calculates as Likelihood × Severity
 *
 * **4. ArrayField Repeating Sections:**
 * - "Identified Hazards" - add multiple hazards with controls
 * - "Authorized Workers" - add multiple workers to permit
 *
 * **5. Advanced Conditional Logic:**
 * - "Manager Approval" appears for High OR Critical risk
 * - "Safety Director Approval" appears only for Critical risk
 *
 * This form represents a real-world EHS permit-to-work with all features.
 */
export const CompleteFeatureShowcase: Story = {
  args: {
    formName: 'Permit to Work - Complete Demo',
    description: 'Comprehensive form showcasing ALL advanced features: Sections, Repeating Fields, Calculated Fields, and Conditional Logic',
    entityTemplate: 'permit',
    initialSchema: COMPLETE_SHOWCASE_SCHEMA,
  },
};

// =============================================================================
// REAL-WORLD EXAMPLE: Workplace Incident Investigation Report
// A comprehensive, realistic EHS form with all advanced features
// =============================================================================

const INCIDENT_INVESTIGATION_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    // =============================
    // SECTION 1: Incident Overview
    // =============================
    incident_overview: {
      type: 'object',
      title: '1. Incident Overview',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 0,
      properties: {
        report_number: {
          type: 'string',
          title: 'Report Number',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          'x-component-props': {
            placeholder: 'Auto-generated',
            disabled: true,
          },
          'x-index': 0,
        },
        incident_date: {
          type: 'string',
          title: 'Date of Incident',
          'x-component': 'DatePicker',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 1,
        },
        incident_time: {
          type: 'string',
          title: 'Time of Incident',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          'x-component-props': {
            placeholder: 'HH:MM',
          },
          required: true,
          'x-index': 2,
        },
        location: {
          type: 'string',
          title: 'Location',
          'x-component': 'LocationSelect',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 3,
        },
        department: {
          type: 'string',
          title: 'Department',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Operations', value: 'operations' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Warehouse', value: 'warehouse' },
            { label: 'Administration', value: 'admin' },
            { label: 'Production', value: 'production' },
          ],
          required: true,
          'x-index': 4,
        },
        incident_type: {
          type: 'string',
          title: 'Type of Incident',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Near Miss', value: 'near_miss' },
            { label: 'First Aid Only', value: 'first_aid' },
            { label: 'Medical Treatment', value: 'medical' },
            { label: 'Lost Time Injury', value: 'lost_time' },
            { label: 'Property Damage', value: 'property' },
            { label: 'Environmental Release', value: 'environmental' },
          ],
          required: true,
          'x-index': 5,
        },
        brief_description: {
          type: 'string',
          title: 'Brief Description',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 3,
            placeholder: 'Provide a brief summary of what happened...',
          },
          required: true,
          'x-index': 6,
        },
      },
    },

    // =============================
    // SECTION 2: Injured Person(s)
    // Shows only for injury-related incidents
    // =============================
    injured_persons_section: {
      type: 'object',
      title: '2. Injured Person Details',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 1,
      'x-reactions': {
        dependencies: ['incident_overview.incident_type'],
        fulfill: {
          state: {
            visible: "{{$deps[0] === 'first_aid' || $deps[0] === 'medical' || $deps[0] === 'lost_time'}}",
          },
        },
      },
      properties: {
        injured_employee: {
          type: 'string',
          title: 'Injured Employee',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 0,
        },
        job_title: {
          type: 'string',
          title: 'Job Title',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          'x-index': 1,
        },
        years_experience: {
          type: 'number',
          title: 'Years of Experience',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 0, max: 50 },
          'x-index': 2,
        },
        body_part_injured: {
          type: 'string',
          title: 'Body Part Injured',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Head / Face', value: 'head' },
            { label: 'Eyes', value: 'eyes' },
            { label: 'Neck', value: 'neck' },
            { label: 'Back', value: 'back' },
            { label: 'Shoulder', value: 'shoulder' },
            { label: 'Arm / Elbow', value: 'arm' },
            { label: 'Hand / Wrist', value: 'hand' },
            { label: 'Fingers', value: 'fingers' },
            { label: 'Leg / Knee', value: 'leg' },
            { label: 'Foot / Ankle', value: 'foot' },
            { label: 'Multiple Body Parts', value: 'multiple' },
          ],
          'x-index': 3,
        },
        injury_type: {
          type: 'string',
          title: 'Type of Injury',
          'x-component': 'Select',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Cut / Laceration', value: 'cut' },
            { label: 'Bruise / Contusion', value: 'bruise' },
            { label: 'Sprain / Strain', value: 'sprain' },
            { label: 'Fracture', value: 'fracture' },
            { label: 'Burn', value: 'burn' },
            { label: 'Chemical Exposure', value: 'chemical' },
            { label: 'Respiratory', value: 'respiratory' },
            { label: 'Other', value: 'other' },
          ],
          'x-index': 4,
        },
        treatment_provided: {
          type: 'string',
          title: 'Treatment Provided',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 2,
            placeholder: 'Describe first aid or medical treatment provided...',
          },
          'x-index': 5,
        },
        days_away: {
          type: 'number',
          title: 'Days Away from Work',
          description: 'For Lost Time injuries only',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 0 },
          'x-index': 6,
          'x-reactions': {
            dependencies: ['incident_overview.incident_type'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'lost_time'}}",
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 3: Witnesses (ArrayField)
    // =============================
    witnesses_section: {
      type: 'object',
      title: '3. Witnesses',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 2,
      properties: {
        has_witnesses: {
          type: 'string',
          title: 'Were there any witnesses?',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
          'x-index': 0,
        },
        witnesses: {
          type: 'array',
          title: 'Witness Information',
          'x-component': 'ArrayField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            minItems: 0,
            maxItems: 5,
            addButtonText: 'Add Witness',
          },
          'x-index': 1,
          'x-reactions': {
            dependencies: ['witnesses_section.has_witnesses'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'yes'}}",
              },
            },
          },
          items: {
            type: 'object',
            properties: {
              witness_name: {
                type: 'string',
                title: 'Witness Name',
                'x-component': 'UserSelect',
                'x-decorator': 'FormItem',
              },
              witness_statement: {
                type: 'string',
                title: 'Statement Summary',
                'x-component': 'TextArea',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  rows: 2,
                  placeholder: 'Brief summary of witness account...',
                },
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 4: Root Cause Analysis
    // =============================
    root_cause_section: {
      type: 'object',
      title: '4. Root Cause Analysis',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 3,
      properties: {
        immediate_cause: {
          type: 'string',
          title: 'Immediate Cause',
          description: 'The unsafe act or condition that directly caused the incident',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 2,
            placeholder: 'What was the direct cause?',
          },
          'x-index': 0,
        },
        contributing_factors: {
          type: 'array',
          title: 'Contributing Factors',
          'x-component': 'CheckboxGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Inadequate Training', value: 'training' },
            { label: 'Inadequate Supervision', value: 'supervision' },
            { label: 'Equipment Failure', value: 'equipment' },
            { label: 'Procedure Not Followed', value: 'procedure' },
            { label: 'Inadequate PPE', value: 'ppe' },
            { label: 'Environmental Conditions', value: 'environmental' },
            { label: 'Fatigue / Stress', value: 'fatigue' },
            { label: 'Housekeeping Issues', value: 'housekeeping' },
            { label: 'Communication Breakdown', value: 'communication' },
          ],
          'x-index': 1,
        },
        root_cause: {
          type: 'string',
          title: 'Root Cause',
          description: 'The fundamental reason why this incident occurred',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 3,
            placeholder: 'Why did the immediate cause occur? (Use 5-Why analysis)',
          },
          'x-index': 2,
        },
        could_recur: {
          type: 'string',
          title: 'Could this incident recur?',
          'x-component': 'RadioGroup',
          'x-decorator': 'FormItem',
          enum: [
            { label: 'Yes - High likelihood', value: 'high' },
            { label: 'Yes - Moderate likelihood', value: 'moderate' },
            { label: 'Yes - Low likelihood', value: 'low' },
            { label: 'No - Isolated incident', value: 'no' },
          ],
          'x-index': 3,
        },
      },
    },

    // =============================
    // SECTION 5: Risk Assessment (with Calculated Field)
    // =============================
    risk_assessment: {
      type: 'object',
      title: '5. Risk Assessment',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 4,
      properties: {
        pre_likelihood: {
          type: 'number',
          title: 'Pre-Controls Likelihood (1-5)',
          description: '1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost Certain',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 0,
        },
        pre_severity: {
          type: 'number',
          title: 'Pre-Controls Severity (1-5)',
          description: '1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 1,
        },
        pre_risk_score: {
          type: 'number',
          title: 'Pre-Controls Risk Score',
          'x-component': 'CalculatedField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            formula: 'pre_likelihood * pre_severity',
            sourceFields: ['risk_assessment.pre_likelihood', 'risk_assessment.pre_severity'],
            resultType: 'number',
            decimalPlaces: 0,
          },
          'x-index': 2,
        },
        post_likelihood: {
          type: 'number',
          title: 'Post-Controls Likelihood (1-5)',
          description: 'After corrective actions are implemented',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 3,
        },
        post_severity: {
          type: 'number',
          title: 'Post-Controls Severity (1-5)',
          description: 'After corrective actions are implemented',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          'x-component-props': { min: 1, max: 5 },
          'x-index': 4,
        },
        post_risk_score: {
          type: 'number',
          title: 'Post-Controls Risk Score',
          'x-component': 'CalculatedField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            formula: 'post_likelihood * post_severity',
            sourceFields: ['risk_assessment.post_likelihood', 'risk_assessment.post_severity'],
            resultType: 'number',
            decimalPlaces: 0,
          },
          'x-index': 5,
        },
        risk_reduction: {
          type: 'number',
          title: 'Risk Reduction (%)',
          description: 'Percentage improvement from controls',
          'x-component': 'CalculatedField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            formula: '((pre_risk_score - post_risk_score) / pre_risk_score) * 100',
            sourceFields: [
              'risk_assessment.pre_likelihood',
              'risk_assessment.pre_severity',
              'risk_assessment.post_likelihood',
              'risk_assessment.post_severity',
            ],
            resultType: 'percentage',
            decimalPlaces: 0,
          },
          'x-index': 6,
        },
      },
    },

    // =============================
    // SECTION 6: Corrective Actions (ArrayField)
    // =============================
    corrective_actions_section: {
      type: 'object',
      title: '6. Corrective Actions',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 5,
      properties: {
        actions: {
          type: 'array',
          title: 'Corrective Actions',
          'x-component': 'ArrayField',
          'x-decorator': 'FormItem',
          'x-component-props': {
            minItems: 1,
            maxItems: 10,
            addButtonText: 'Add Corrective Action',
          },
          'x-index': 0,
          items: {
            type: 'object',
            properties: {
              action_description: {
                type: 'string',
                title: 'Action Description',
                'x-component': 'TextArea',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  rows: 2,
                  placeholder: 'Describe the corrective action...',
                },
              },
              action_type: {
                type: 'string',
                title: 'Action Type',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                enum: [
                  { label: 'Immediate (within 24 hrs)', value: 'immediate' },
                  { label: 'Short-term (within 1 week)', value: 'short_term' },
                  { label: 'Long-term (within 30 days)', value: 'long_term' },
                ],
              },
              responsible_person: {
                type: 'string',
                title: 'Responsible Person',
                'x-component': 'UserSelect',
                'x-decorator': 'FormItem',
              },
              due_date: {
                type: 'string',
                title: 'Due Date',
                'x-component': 'DatePicker',
                'x-decorator': 'FormItem',
              },
              status: {
                type: 'string',
                title: 'Status',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                enum: [
                  { label: 'Not Started', value: 'not_started' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Overdue', value: 'overdue' },
                ],
              },
            },
          },
        },
      },
    },

    // =============================
    // SECTION 7: Investigation Sign-off
    // =============================
    signoff_section: {
      type: 'object',
      title: '7. Investigation Sign-off',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      'x-index': 6,
      properties: {
        investigator: {
          type: 'string',
          title: 'Lead Investigator',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 0,
        },
        investigation_date: {
          type: 'string',
          title: 'Investigation Date',
          'x-component': 'DatePicker',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 1,
        },
        supervisor_review: {
          type: 'string',
          title: 'Supervisor Review',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
          required: true,
          'x-index': 2,
        },
        supervisor_comments: {
          type: 'string',
          title: 'Supervisor Comments',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 2,
            placeholder: 'Supervisor review comments...',
          },
          'x-index': 3,
        },
        // Safety Manager approval - only for serious incidents
        safety_manager_approval: {
          type: 'string',
          title: 'Safety Manager Approval',
          'x-component': 'UserSelect',
          'x-decorator': 'FormItem',
          'x-index': 4,
          'x-reactions': {
            dependencies: ['incident_overview.incident_type'],
            fulfill: {
              state: {
                visible: "{{$deps[0] === 'medical' || $deps[0] === 'lost_time'}}",
              },
            },
          },
        },
        lessons_learned: {
          type: 'string',
          title: 'Lessons Learned',
          description: 'Key takeaways to share with the organization',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 3,
            placeholder: 'What lessons should be shared to prevent recurrence?',
          },
          'x-index': 5,
        },
        share_as_safety_alert: {
          type: 'boolean',
          title: 'Share as Safety Alert?',
          description: 'Distribute to all employees as a safety bulletin',
          'x-component': 'Checkbox',
          'x-decorator': 'FormItem',
          'x-index': 6,
        },
      },
    },

    // =============================
    // SECTION 8: Attachments
    // =============================
    attachments_section: {
      type: 'object',
      title: '8. Supporting Documents',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: true,
      },
      'x-index': 7,
      properties: {
        photos: {
          type: 'array',
          title: 'Photos',
          'x-component': 'Upload',
          'x-decorator': 'FormItem',
          'x-component-props': {
            maxCount: 10,
            accept: 'image/*',
          },
          'x-index': 0,
        },
        documents: {
          type: 'array',
          title: 'Documents',
          'x-component': 'Upload',
          'x-decorator': 'FormItem',
          'x-component-props': {
            maxCount: 5,
            accept: '.pdf,.doc,.docx',
          },
          'x-index': 1,
        },
        additional_notes: {
          type: 'string',
          title: 'Additional Notes',
          'x-component': 'TextArea',
          'x-decorator': 'FormItem',
          'x-component-props': {
            rows: 3,
            placeholder: 'Any additional information...',
          },
          'x-index': 2,
        },
      },
    },
  },
};

/**
 * ## Real-World Example: Incident Investigation Report
 *
 * A comprehensive, production-ready EHS incident investigation form demonstrating:
 *
 * **Collapsible Sections:**
 * - 8 organized sections that can be expanded/collapsed
 * - Each section contains multiple related fields
 *
 * **Conditional Visibility:**
 * - "Injured Person Details" section only shows for injury incidents
 * - "Days Away from Work" only shows for Lost Time injuries
 * - "Witnesses" array only shows when "Yes" is selected
 * - "Safety Manager Approval" only shows for Medical/Lost Time incidents
 *
 * **Repeating Fields (ArrayField):**
 * - Witnesses with name and statement
 * - Corrective Actions with full details per action
 *
 * **Calculated Fields:**
 * - Pre-Controls Risk Score (likelihood × severity)
 * - Post-Controls Risk Score
 * - Risk Reduction Percentage
 *
 * Use the Preview tab to see the interactive form with collapsible sections!
 */
export const RealWorldIncidentReport: Story = {
  args: {
    formName: 'Incident Investigation Report',
    description: 'Full incident investigation with root cause analysis, risk assessment, and corrective action tracking',
    entityTemplate: 'incident',
    initialSchema: INCIDENT_INVESTIGATION_SCHEMA,
  },
};
