/**
 * Workflow Seed Data
 *
 * Mock data for detailed workflows used in incident management.
 * Demonstrates various workflow states: in_progress, completed, cancelled, pending
 */

import type { DetailedWorkflow, FormSubmissionData } from '../../../components/incidents'
import { seedIncidentReportFormData } from './forms.seed'

/**
 * Seed detailed workflows for incident details
 * Demonstrates all workflow statuses and step configurations
 */
export const seedDetailedWorkflows: DetailedWorkflow[] = [
  // Workflow 1: IN PROGRESS - Shows active step with overdue, completed, pending
  {
    id: 'wf-1',
    name: 'Workplace Safety Incident Investigation - Fall Hazard Report',
    status: 'in_progress',
    currentStage: { id: 'stage-rca', name: 'Root Cause Analysis', code: 'RCA' },
    completedSteps: 5,
    totalSteps: 8,
    lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    lastUpdatedAt: '2025-11-11T12:35:00Z',
    canCancel: true,
    steps: [
      {
        id: 'step-1',
        name: 'Initial Incident Report Submission',
        stepNumber: 1,
        totalSteps: 8,
        status: 'completed',
        completedAt: '2025-11-05T10:30:00Z',
        completedBy: { id: 'user-1', name: 'Michael Chen', email: 'michael.chen@company.com' },
        attachments: [
          {
            id: 'attach-1',
            type: 'form',
            name: 'Incident Report Form',
            url: '/forms/incident-report.pdf',
            submittedBy: { id: 'user-1', name: 'Michael Chen', email: 'michael.chen@company.com' },
            submittedAt: '2025-11-05T10:30:00Z',
            formData: seedIncidentReportFormData,
          },
        ],
      },
      {
        id: 'step-2',
        name: 'Safety Officer Notification',
        stepNumber: 2,
        totalSteps: 8,
        status: 'completed',
        completedAt: '2025-11-05T11:00:00Z',
        completedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
      },
      {
        id: 'step-3',
        name: 'Immediate Scene Assessment',
        stepNumber: 3,
        totalSteps: 8,
        status: 'completed',
        completedAt: '2025-11-05T14:00:00Z',
        completedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
      },
      {
        id: 'step-4',
        name: 'Witness Statement Collection',
        stepNumber: 4,
        totalSteps: 8,
        status: 'completed',
        completedAt: '2025-11-06T09:00:00Z',
        completedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
      },
      {
        id: 'step-5',
        name: 'Root Cause Analysis',
        stepNumber: 5,
        totalSteps: 8,
        status: 'completed',
        completedAt: '2025-11-08T16:00:00Z',
        completedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
      },
      {
        id: 'step-6',
        name: 'Corrective Action Plan Development',
        stepNumber: 6,
        totalSteps: 8,
        status: 'active',
        assignedTo: { id: 'user-4', name: 'Erica Johnson', email: 'erica.johnson@company.com' },
        assignedAt: '2025-11-06T14:30:00Z',
        dueDate: '2025-11-03T23:59:59Z',
        isOverdue: true,
      },
      {
        id: 'step-7',
        name: 'Management Review & Approval',
        stepNumber: 7,
        totalSteps: 8,
        status: 'pending',
      },
      {
        id: 'step-8',
        name: 'Final Report Distribution',
        stepNumber: 8,
        totalSteps: 8,
        status: 'pending',
      },
    ],
  },
  // Workflow 2: COMPLETED - All steps completed, with some skipped
  {
    id: 'wf-2',
    name: 'Emergency Response Protocol - Chemical Exposure Containment & Decontamination',
    status: 'completed',
    currentStage: { id: 'stage-final', name: 'Closure', code: 'FIN' },
    completedSteps: 5,
    totalSteps: 6,
    lastUpdatedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    lastUpdatedAt: '2025-10-25T16:00:00Z',
    canCancel: false,
    steps: [
      {
        id: 'step-2-1',
        name: 'Emergency Alert & Evacuation Notification',
        stepNumber: 1,
        totalSteps: 6,
        status: 'completed',
        completedAt: '2025-10-20T08:15:00Z',
        completedBy: { id: 'user-5', name: 'Sarah Martinez', email: 'sarah.martinez@company.com' },
        attachments: [
          {
            id: 'attach-2-1',
            type: 'document',
            name: 'Emergency Notification Log',
            url: '/docs/emergency-log.pdf',
            submittedBy: { id: 'user-5', name: 'Sarah Martinez', email: 'sarah.martinez@company.com' },
            submittedAt: '2025-10-20T08:15:00Z',
          },
        ],
      },
      {
        id: 'step-2-2',
        name: 'Hazmat Team Deployment',
        stepNumber: 2,
        totalSteps: 6,
        status: 'completed',
        completedAt: '2025-10-20T08:45:00Z',
        completedBy: { id: 'user-6', name: 'Robert Davis', email: 'robert.davis@company.com' },
      },
      {
        id: 'step-2-3',
        name: 'Medical Evaluation of Exposed Personnel',
        stepNumber: 3,
        totalSteps: 6,
        status: 'skipped', // No personnel were exposed
      },
      {
        id: 'step-2-4',
        name: 'Contamination Zone Decontamination',
        stepNumber: 4,
        totalSteps: 6,
        status: 'completed',
        completedAt: '2025-10-20T14:30:00Z',
        completedBy: { id: 'user-6', name: 'Robert Davis', email: 'robert.davis@company.com' },
        attachments: [
          {
            id: 'attach-2-4',
            type: 'form',
            name: 'Decontamination Checklist',
            url: '/forms/decon-checklist.pdf',
            submittedBy: { id: 'user-6', name: 'Robert Davis', email: 'robert.davis@company.com' },
            submittedAt: '2025-10-20T14:30:00Z',
          },
        ],
      },
      {
        id: 'step-2-5',
        name: 'Environmental Testing & Clearance',
        stepNumber: 5,
        totalSteps: 6,
        status: 'completed',
        completedAt: '2025-10-22T10:00:00Z',
        completedBy: { id: 'user-7', name: 'Jennifer Lee', email: 'jennifer.lee@company.com' },
        attachments: [
          {
            id: 'attach-2-5',
            type: 'document',
            name: 'Air Quality Test Results',
            url: '/docs/air-quality-report.pdf',
            submittedBy: { id: 'user-7', name: 'Jennifer Lee', email: 'jennifer.lee@company.com' },
            submittedAt: '2025-10-22T10:00:00Z',
          },
        ],
      },
      {
        id: 'step-2-6',
        name: 'Post-Incident Report & Lessons Learned',
        stepNumber: 6,
        totalSteps: 6,
        status: 'completed',
        completedAt: '2025-10-25T16:00:00Z',
        completedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
        attachments: [
          {
            id: 'attach-2-6',
            type: 'form',
            name: 'Post-Incident Analysis Report',
            url: '/forms/post-incident-report.pdf',
            submittedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
            submittedAt: '2025-10-25T16:00:00Z',
          },
        ],
      },
    ],
  },
  // Workflow 3: CANCELLED - Shows partial progress before cancellation
  {
    id: 'wf-3',
    name: 'Annual OSHA Compliance Audit - Facility Wide Safety Inspection',
    status: 'cancelled',
    completedSteps: 2,
    totalSteps: 5,
    lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    lastUpdatedAt: '2025-10-20T10:00:00Z',
    canCancel: false,
    steps: [
      {
        id: 'step-3-1',
        name: 'Pre-Audit Documentation Review',
        stepNumber: 1,
        totalSteps: 5,
        status: 'completed',
        completedAt: '2025-10-15T09:00:00Z',
        completedBy: { id: 'user-8', name: 'David Wilson', email: 'david.wilson@company.com' },
      },
      {
        id: 'step-3-2',
        name: 'On-Site Facility Walkthrough',
        stepNumber: 2,
        totalSteps: 5,
        status: 'completed',
        completedAt: '2025-10-18T15:00:00Z',
        completedBy: { id: 'user-8', name: 'David Wilson', email: 'david.wilson@company.com' },
        attachments: [
          {
            id: 'attach-3-2',
            type: 'document',
            name: 'Walkthrough Findings Summary',
            url: '/docs/walkthrough-findings.pdf',
            submittedBy: { id: 'user-8', name: 'David Wilson', email: 'david.wilson@company.com' },
            submittedAt: '2025-10-18T15:00:00Z',
          },
        ],
      },
      {
        id: 'step-3-3',
        name: 'Employee Safety Interviews',
        stepNumber: 3,
        totalSteps: 5,
        status: 'skipped', // Cancelled before this step
      },
      {
        id: 'step-3-4',
        name: 'Equipment & Machinery Inspection',
        stepNumber: 4,
        totalSteps: 5,
        status: 'skipped', // Cancelled before this step
      },
      {
        id: 'step-3-5',
        name: 'Final Compliance Report Submission',
        stepNumber: 5,
        totalSteps: 5,
        status: 'skipped', // Cancelled before this step
      },
    ],
  },
  // Workflow 4: PENDING - Not started yet
  {
    id: 'wf-4',
    name: 'Quarterly Safety Training Verification & Certification Update Program',
    status: 'pending',
    completedSteps: 0,
    totalSteps: 4,
    lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    lastUpdatedAt: '2025-11-10T08:00:00Z',
    canCancel: true,
    steps: [
      {
        id: 'step-4-1',
        name: 'Training Records Compilation',
        stepNumber: 1,
        totalSteps: 4,
        status: 'pending',
      },
      {
        id: 'step-4-2',
        name: 'Certification Expiration Review',
        stepNumber: 2,
        totalSteps: 4,
        status: 'pending',
      },
      {
        id: 'step-4-3',
        name: 'Refresher Training Schedule Creation',
        stepNumber: 3,
        totalSteps: 4,
        status: 'pending',
      },
      {
        id: 'step-4-4',
        name: 'Compliance Status Report Generation',
        stepNumber: 4,
        totalSteps: 4,
        status: 'pending',
      },
    ],
  },
]

/**
 * Get workflows by status
 */
export function getWorkflowsByStatus(
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
): DetailedWorkflow[] {
  return seedDetailedWorkflows.filter((wf) => wf.status === status)
}

/**
 * Get workflow by ID
 */
export function getWorkflowById(id: string): DetailedWorkflow | undefined {
  return seedDetailedWorkflows.find((wf) => wf.id === id)
}

/**
 * Get active (in progress) workflows count
 */
export function getActiveWorkflowsCount(): number {
  return seedDetailedWorkflows.filter((wf) => wf.status === 'in_progress').length
}
