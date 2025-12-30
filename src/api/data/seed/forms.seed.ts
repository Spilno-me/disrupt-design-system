/**
 * Form Submission Seed Data
 *
 * Mock data for form submissions used in incident workflows.
 * Includes detailed form data with sections/fields and submission metadata.
 */

import type {
  FormSubmissionData,
  ExtendedFormSubmission,
} from '../../../components/incidents'

/**
 * Detailed incident report form data
 * Shows a complete form with multiple sections and field types
 */
export const seedIncidentReportFormData: FormSubmissionData = {
  formId: 'form-incident-report-v2',
  formName: 'Incident Report Form',
  version: '2.1',
  submittedBy: { id: 'user-1', name: 'Michael Chen', email: 'michael.chen@company.com' },
  submittedAt: '2025-11-05T10:30:00Z',
  approvalStatus: 'approved',
  reviewedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
  reviewedAt: '2025-11-05T14:00:00Z',
  sections: [
    {
      id: 'section-basic',
      title: 'Basic Information',
      description: 'General incident details',
      fields: [
        { id: 'field-1', label: 'Incident Date', type: 'date', value: '2025-11-05', required: true },
        { id: 'field-2', label: 'Incident Time', type: 'time', value: '09:15', required: true },
        { id: 'field-3', label: 'Report Date', type: 'datetime', value: '2025-11-05T10:30:00Z', required: true },
        { id: 'field-4', label: 'Incident Type', type: 'select', value: 'Near Miss', displayValue: 'Near Miss', required: true },
        { id: 'field-5', label: 'Severity Level', type: 'select', value: 'medium', displayValue: 'Medium', required: true },
      ],
    },
    {
      id: 'section-location',
      title: 'Location Details',
      description: 'Where did the incident occur?',
      fields: [
        { id: 'field-6', label: 'Facility', type: 'select', value: 'Main Warehouse', required: true },
        { id: 'field-7', label: 'Specific Location', type: 'text', value: 'Loading Dock - East Wing, Bay 3', required: true },
        {
          id: 'field-8',
          label: 'GPS Location',
          type: 'location',
          value: '///appealing.concluded.mugs',
          metadata: {
            address: '1234 Industrial Park Blvd, Houston, TX 77001',
            coordinates: { lat: 29.7604, lng: -95.3698 },
          },
        },
      ],
    },
    {
      id: 'section-description',
      title: 'Incident Description',
      fields: [
        {
          id: 'field-9',
          label: 'What happened?',
          type: 'textarea',
          value: 'While unloading materials from truck #4523, a pallet of sheet metal (approximately 2,000 lbs) became unstable due to improper stacking. The pallet shifted during forklift operation, causing several sheets to slide off. No one was in the immediate area at the time.\n\nThe forklift operator (James Martinez) immediately stopped operations and cordoned off the area. The safety team was notified within 5 minutes.',
          required: true,
        },
        {
          id: 'field-10',
          label: 'Immediate actions taken',
          type: 'textarea',
          value: '1. Area was immediately cordoned off with safety tape\n2. All nearby personnel were evacuated\n3. Supervisor and Safety Officer were notified\n4. Photos were taken of the scene\n5. Cleanup crew was dispatched after safety assessment',
          required: true,
        },
      ],
    },
    {
      id: 'section-people',
      title: 'People Involved',
      fields: [
        { id: 'field-11', label: 'Primary Reporter', type: 'person', value: 'Michael Chen', required: true },
        { id: 'field-12', label: 'Supervisor on Duty', type: 'person', value: 'Sarah Connor' },
        { id: 'field-13', label: 'Witnesses Present', type: 'checkbox', value: true },
        {
          id: 'field-14',
          label: 'Witness Names',
          type: 'multiselect',
          value: ['James Martinez', 'Linda Rodriguez', 'David Kim'],
        },
        { id: 'field-15', label: 'Any Injuries?', type: 'checkbox', value: false },
      ],
    },
    {
      id: 'section-assessment',
      title: 'Initial Assessment',
      fields: [
        { id: 'field-16', label: 'Potential Severity (if not prevented)', type: 'rating', value: 4, metadata: { maxRating: 5 } },
        { id: 'field-17', label: 'Likelihood of Recurrence', type: 'rating', value: 3, metadata: { maxRating: 5 } },
        {
          id: 'field-18',
          label: 'Contributing Factors',
          type: 'multiselect',
          value: ['Improper stacking', 'Inadequate securing', 'Training gap'],
        },
        { id: 'field-19', label: 'Equipment Involved', type: 'text', value: 'Forklift #FL-042, Pallet Jack #PJ-18' },
      ],
    },
    {
      id: 'section-attachments',
      title: 'Attachments & Signature',
      fields: [
        {
          id: 'field-20',
          label: 'Scene Photos',
          type: 'file',
          value: 'incident_scene_001.jpg',
          metadata: { fileName: 'incident_scene_001.jpg', url: '/uploads/incident_scene_001.jpg', fileSize: 2457600 },
        },
        {
          id: 'field-21',
          label: 'Reporter Signature',
          type: 'signature',
          value: 'signed',
          metadata: { signatureUrl: '/signatures/mchen_20251105.png' },
        },
      ],
    },
  ],
}

/**
 * Extended form submission records
 * Used for listing form submissions in incident details
 */
export const seedExtendedFormSubmissions: ExtendedFormSubmission[] = [
  {
    id: 'fs-ext-1',
    formName: 'Initial Incident Report Form',
    submittedBy: { id: 'user-1', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    submittedAt: '2025-10-28T09:15:00Z',
    status: 'approved',
    type: 'incident_report',
    submitterRole: 'reporter',
    fileSize: 245760,
    url: '/forms/incident-report-1.pdf',
  },
  {
    id: 'fs-ext-2',
    formName: 'Investigation Checklist',
    submittedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    submittedAt: '2025-10-28T14:30:00Z',
    status: 'approved',
    type: 'investigation',
    submitterRole: 'investigator',
    fileSize: 189440,
    url: '/forms/investigation-checklist-1.pdf',
  },
  {
    id: 'fs-ext-3',
    formName: 'Witness Statement Form',
    submittedBy: { id: 'user-3', name: 'Michael Brown', email: 'michael.brown@company.com' },
    submittedAt: '2025-10-29T10:00:00Z',
    status: 'approved',
    type: 'investigation',
    submitterRole: 'reporter',
    fileSize: 156200,
    url: '/forms/witness-statement-1.pdf',
  },
  {
    id: 'fs-ext-4',
    formName: 'Corrective Action Plan',
    submittedBy: { id: 'user-4', name: 'Emily Davis', email: 'emily.davis@company.com' },
    submittedAt: '2025-10-30T09:45:00Z',
    status: 'pending',
    type: 'corrective_action',
    submitterRole: 'reviewer',
    fileSize: 312400,
    url: '/forms/corrective-action-1.pdf',
  },
  {
    id: 'fs-ext-5',
    formName: 'Safety Audit Report',
    submittedBy: { id: 'user-5', name: 'David Wilson', email: 'david.wilson@company.com' },
    submittedAt: '2025-10-31T15:20:00Z',
    status: 'pending',
    type: 'audit',
    submitterRole: 'investigator',
    fileSize: 524288,
    url: '/forms/safety-audit-1.pdf',
  },
  {
    id: 'fs-ext-6',
    formName: 'Equipment Inspection Checklist',
    submittedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    submittedAt: '2025-11-01T08:30:00Z',
    status: 'approved',
    type: 'checklist',
    submitterRole: 'investigator',
    fileSize: 98304,
    url: '/forms/equipment-inspection-1.pdf',
  },
]

/**
 * Get form submissions by status
 */
export function getFormSubmissionsByStatus(
  status: 'pending' | 'approved' | 'rejected'
): ExtendedFormSubmission[] {
  return seedExtendedFormSubmissions.filter((fs) => fs.status === status)
}

/**
 * Get form submissions by type
 */
export function getFormSubmissionsByType(
  type: 'incident_report' | 'investigation' | 'corrective_action' | 'audit' | 'checklist'
): ExtendedFormSubmission[] {
  return seedExtendedFormSubmissions.filter((fs) => fs.type === type)
}
