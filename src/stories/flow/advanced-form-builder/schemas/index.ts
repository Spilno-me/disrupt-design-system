/**
 * Advanced Form Builder - Sample Schemas
 *
 * Pre-built EHS form schemas for use in stories and as templates.
 *
 * @module stories/flow/advanced-form-builder/schemas
 */

import type { ISchema } from '@/flow/components/advanced-form-builder';

// =============================================================================
// SAFETY INSPECTION SCHEMA
// =============================================================================

export const SAFETY_INSPECTION_SCHEMA: ISchema = {
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

// =============================================================================
// INCIDENT REPORT SCHEMA
// =============================================================================

export const INCIDENT_REPORT_SCHEMA: ISchema = {
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

// =============================================================================
// JOB SAFETY ANALYSIS SCHEMA
// =============================================================================

export const JSA_SCHEMA: ISchema = {
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

// =============================================================================
// PPE INSPECTION SCHEMA
// =============================================================================

export const PPE_INSPECTION_SCHEMA: ISchema = {
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
    ppe_type: {
      type: 'string',
      title: 'PPE Type',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 2,
      enum: [
        { label: 'Hard Hat', value: 'hard_hat' },
        { label: 'Safety Glasses', value: 'safety_glasses' },
        { label: 'Gloves', value: 'gloves' },
        { label: 'Safety Boots', value: 'safety_boots' },
        { label: 'High-Vis Vest', value: 'high_vis' },
        { label: 'Hearing Protection', value: 'hearing' },
        { label: 'Respirator', value: 'respirator' },
        { label: 'Fall Protection', value: 'fall_protection' },
      ],
    },
    serial_number: {
      type: 'string',
      title: 'Serial/ID Number',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-index': 3,
    },
    condition: {
      type: 'string',
      title: 'Overall Condition',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      'x-index': 4,
      enum: [
        { label: 'Good', value: 'good' },
        { label: 'Fair', value: 'fair' },
        { label: 'Poor', value: 'poor' },
        { label: 'Replace', value: 'replace' },
      ],
    },
    damage_found: {
      type: 'boolean',
      title: 'Damage Found',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
      'x-index': 5,
    },
    damage_description: {
      type: 'string',
      title: 'Damage Description',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 3,
        placeholder: 'Describe any damage found...',
      },
      'x-index': 6,
    },
    action_required: {
      type: 'string',
      title: 'Action Required',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-index': 7,
      enum: [
        { label: 'None', value: 'none' },
        { label: 'Clean', value: 'clean' },
        { label: 'Repair', value: 'repair' },
        { label: 'Replace', value: 'replace' },
        { label: 'Remove from Service', value: 'remove' },
      ],
    },
    next_inspection: {
      type: 'string',
      title: 'Next Inspection Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
      'x-index': 8,
    },
  },
};
