/**
 * Flow EHS Dashboard Stories
 *
 * Demonstrates the Flow EHS application using existing DDS components.
 * Uses EHSAnalyticsDashboard as the primary dashboard component.
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  LayoutDashboard,
  Waypoints,
  TriangleAlert,
  Settings,
  Users,
  ShieldCheck,
  BookOpen,
  MapPin,
  Files,
  Boxes,
  HelpCircle,
  Camera,
  Shield,
  ClipboardCheck,
  Download,
  // EHS Analytics Dashboard icons
  Sparkles,
  ClipboardList,
  Globe,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Calendar,
  Eye,
  EyeOff,
  Settings2,
  PencilLine,
  Zap,
  Activity,
  Target,
  CheckCircle2,
  Plus,
  Hourglass,
} from 'lucide-react'
import { AppLayoutShell } from '../../templates/layout/AppLayoutShell'
import { PAGE_META, pageDescription, IPhoneMobileFrame } from '../_infrastructure'
import {
  IncidentManagementTable,
  type Incident,
} from '../../components/ui/table'
import { SearchFilter } from '../../components/shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../components/shared/SearchFilter/types'
import {
  QuickFilter,
  DraftsFilter,
  ReportedFilter,
  AgingFilter,
  InProgressFilter,
  ReviewsFilter,
} from '../../components/ui/QuickFilter'
import { PageActionPanel } from '../../components/ui/PageActionPanel'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog'
import { FlowMobileNav, type MoreMenuItem } from '../../flow/components/mobile-nav-bar'
import { useState, useMemo } from 'react'
import {
  IncidentReportingFlow,
  IncidentDetailsPage,
  DeleteIncidentDialog,
  SubmitIncidentDialog,
  EditIncidentFlow,
  IncidentsPage,
  StepsPage,
  type Step,
  type IncidentDetail,
  type EvidenceDocument,
  type DocumentUserContext,
  type DetailedWorkflow,
  type WorkflowStepAttachment,
  type FormSubmissionData,
  type ExtendedFormSubmission,
  type IncidentToDelete,
  type IncidentToSubmit,
  type IncidentToEdit,
} from '../../components/incidents'
import {
  EHSAnalyticsDashboard,
  type BreakdownItem,
  type AgingItem,
  type TrendingItem,
  type LocationRisk,
  type WorkloadItem,
  type UpcomingTask,
  type PriorityTask,
  type DashboardViewMode,
  type DashboardPreset,
  // Edit Mode
  DashboardEditProvider,
  useDashboardEdit,
  EditableWidget,
  ReorderableWidget,
  EditModeToolbar,
  WidgetSettingsPanel,
  type WidgetConfig,
} from '../../flow/components/dashboard'
import { Reorder, AnimatePresence, motion } from 'motion/react'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { StatsCard } from '../../components/leads/StatsCard'
import {
  KPICard,
  BreakdownCard,
  AgingCard,
  TrendingCard,
  RiskHeatmapCard,
  WorkloadCard,
  UpcomingTasksCard,
  SectionHeader,
} from '../../flow/components/dashboard'
import {
  UsersPage,
  type User,
  type Role,
  type Permission,
  type LocationNode,
  type UserStats,
  type UserActivity,
  type EnhancedPermission,
} from '../../flow/components/users'

// =============================================================================
// FLOW PAGE CONTENT WRAPPER
// =============================================================================

/**
 * Simple page content wrapper for Flow app pages.
 * Replaces DashboardPage when only layout padding is needed.
 */
interface FlowPageContentProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

function FlowPageContent({ title, subtitle, children }: FlowPageContentProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {title && <h1 className="text-2xl font-semibold text-primary">{title}</h1>}
          {subtitle && <span className="text-sm text-secondary">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

// =============================================================================
// MOCK DATA - Documents & Evidence
// =============================================================================

const mockDocuments: EvidenceDocument[] = [
  {
    id: 'doc-1',
    name: 'Incident_Scene_Photo_1.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 2457600,
    url: '/documents/doc-1.jpg',
    thumbnailUrl: '/thumbnails/doc-1.jpg',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-10-28T10:30:00Z',
    uploadedByRole: 'investigator',
    visibility: 'all',
    isGraphic: true,
    description: 'Photo of the incident scene',
    tags: ['scene', 'photo', 'evidence'],
  },
  {
    id: 'doc-2',
    name: 'Safety_Data_Sheet.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 524288,
    url: '/documents/doc-2.pdf',
    uploadedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    uploadedAt: '2025-10-29T14:15:00Z',
    uploadedByRole: 'reviewer',
    visibility: 'investigator',
    description: 'Material safety data sheet',
    tags: ['sds', 'reference'],
  },
  {
    id: 'doc-3',
    name: 'Witness_Statement.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 102400,
    url: '/documents/doc-3.pdf',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-10-30T09:00:00Z',
    uploadedByRole: 'investigator',
    visibility: 'reviewer',
    description: 'Statement from witness',
    tags: ['witness', 'statement'],
  },
  {
    id: 'doc-4',
    name: 'Initial_Report_Form.pdf',
    type: 'form',
    mimeType: 'application/pdf',
    size: 256000,
    url: '/documents/doc-4.pdf',
    uploadedBy: { id: 'user-1', name: 'Patricia Davis', email: 'patricia.davis@company.com' },
    uploadedAt: '2025-10-27T08:45:00Z',
    uploadedByRole: 'reporter',
    visibility: 'all',
    description: 'Initial incident report form',
    tags: ['form', 'initial', 'report'],
  },
]

const mockUserContext: DocumentUserContext = {
  userId: 'user-2',
  userName: 'John Smith',
  role: 'investigator',
  isReporter: false,
  isAssigned: true,
}

// =============================================================================
// MOCK DATA - Form Submission Data
// =============================================================================

const mockIncidentReportFormData: FormSubmissionData = {
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

// =============================================================================
// MOCK DATA - Extended Form Submissions
// =============================================================================

const mockExtendedFormSubmissions: ExtendedFormSubmission[] = [
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

// =============================================================================
// MOCK DATA - Detailed Workflows
// =============================================================================

const mockDetailedWorkflows: DetailedWorkflow[] = [
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
            formData: mockIncidentReportFormData,
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

// =============================================================================
// MOCK DATA - Incidents
// =============================================================================

// Generate 100 incidents with various severities and statuses
const incidentTitles = [
  'Chemical Spill in Storage Area', 'Equipment Malfunction', 'Slip and Fall Incident', 'Fire Alarm Activation',
  'Gas Leak Detected', 'Electrical Hazard Reported', 'Vehicle Collision', 'Structural Damage Found',
  'PPE Violation Observed', 'Ergonomic Issue Reported', 'Noise Exposure Concern', 'Heat Stress Incident',
  'Confined Space Entry Issue', 'Lockout/Tagout Violation', 'Fall Protection Failure', 'Machine Guarding Missing',
  'Hazardous Waste Spillage', 'Air Quality Concern', 'Water Contamination', 'Radiation Exposure Risk',
  'Biological Hazard Found', 'Sharp Object Injury', 'Crushing Hazard Near Miss', 'Forklift Incident',
  'Ladder Safety Issue', 'Scaffolding Problem', 'Crane Operation Concern', 'Welding Safety Violation',
  'Chemical Burn Reported', 'Eye Injury Incident', 'Back Injury Complaint', 'Respiratory Issue',
]
const locations = [
  'Warehouse A - Section 1', 'Warehouse B - Section 4', 'Production Floor - Building A', 'Assembly Line 3',
  'Loading Dock - East Wing', 'Storage Room C', 'Utility Room 3B', 'Building Entrance', 'Parking Lot B',
  'Office Building - Floor 2', 'Maintenance Shop', 'Quality Control Lab', 'Shipping Department',
  'Receiving Area', 'Break Room - North', 'Conference Room 101', 'Server Room', 'Chemical Storage',
  'Outdoor Tank Farm', 'Compressor Building', 'Boiler Room', 'HVAC Equipment Area', 'Roof Access',
]
const reporters = [
  'Patricia Davis', 'Sarah Connor', 'Mike Chen', 'Michael Johnson', 'John Martinez', 'Linda Smith',
  'Patricia Taylor', 'Robert Wilson', 'James Brown', 'Jennifer Garcia', 'David Miller', 'Maria Rodriguez',
  'William Anderson', 'Elizabeth Thomas', 'Richard Jackson', 'Susan White', 'Joseph Harris', 'Margaret Martin',
  'Charles Thompson', 'Dorothy Moore', 'Christopher Lee', 'Nancy Walker', 'Daniel Hall', 'Karen Allen',
]

const generateIncidents = (): Incident[] => {
  const incidents: Incident[] = []
  const _severities: Array<'critical' | 'high' | 'medium' | 'low' | 'none'> = ['critical', 'high', 'medium', 'low', 'none']
  const _statuses: Array<'draft' | 'reported' | 'investigation' | 'review'> = ['draft', 'reported', 'investigation', 'review']

  // Distribution: 5 critical, 10 high, 30 medium, 35 low, 20 none
  // Status distribution: 8 draft, 15 reported, 40 investigation, 37 review
  const severityDistribution = [
    ...Array(5).fill('critical'),
    ...Array(10).fill('high'),
    ...Array(30).fill('medium'),
    ...Array(35).fill('low'),
    ...Array(20).fill('none'),
  ] as Array<'critical' | 'high' | 'medium' | 'low' | 'none'>

  const statusDistribution = [
    ...Array(8).fill('draft'),
    ...Array(15).fill('reported'),
    ...Array(40).fill('investigation'),
    ...Array(37).fill('review'),
  ] as Array<'draft' | 'reported' | 'investigation' | 'review'>

  for (let i = 0; i < 100; i++) {
    const severity = severityDistribution[i]
    const status = statusDistribution[i]
    const ageDays = status === 'draft' ? 0 : Math.floor(Math.random() * 120)
    const isOverdue = ageDays > 30 && status !== 'draft' && status !== 'reported'

    incidents.push({
      id: String(i + 1),
      incidentId: `INC-${516344565333 + i}`,
      title: incidentTitles[i % incidentTitles.length] + (i > 31 ? ` - Case ${i + 1}` : ''),
      location: locations[i % locations.length],
      reporter: reporters[i % reporters.length],
      priority: status === 'draft' ? 'draft' : severity,
      severity: severity,
      status: status,
      ageDays: ageDays,
      overdue: isOverdue,
    })
  }

  // Sort by severity (critical first) then by age (oldest first)
  return incidents.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }
    const aSev = severityOrder[a.severity as keyof typeof severityOrder] ?? 5
    const bSev = severityOrder[b.severity as keyof typeof severityOrder] ?? 5
    if (aSev !== bSev) return aSev - bSev
    return (b.ageDays || 0) - (a.ageDays || 0)
  })
}

const incidentData: Incident[] = generateIncidents()

// =============================================================================
// INCIDENT DATA CONVERTER - Table row to Details page
// =============================================================================

/**
 * Convert a table Incident to full IncidentDetail for the details page
 * In a real app, this would fetch full data from an API
 */
function convertToIncidentDetail(incident: Incident): IncidentDetail {
  // Map severity to the details page format
  const severityMap = {
    critical: 'critical' as const,
    high: 'high' as const,
    medium: 'medium' as const,
    low: 'low' as const,
    none: 'none' as const,
  }

  // Map incident type based on title keywords (mock logic)
  const getIncidentType = (title: string): IncidentDetail['type'] => {
    const lower = title.toLowerCase()
    if (lower.includes('chemical') || lower.includes('spill')) return 'chemical'
    if (lower.includes('fire') || lower.includes('alarm')) return 'fire'
    if (lower.includes('equipment') || lower.includes('malfunction')) return 'equipment'
    if (lower.includes('slip') || lower.includes('fall') || lower.includes('injury')) return 'injury'
    if (lower.includes('near miss')) return 'near_miss'
    if (lower.includes('environmental') || lower.includes('contamination')) return 'environmental'
    return 'other'
  }

  // Generate mock workflows based on status
  const generateWorkflows = (status: string): IncidentDetail['workflows'] => {
    const baseWorkflows = [
      { id: 'wf-1', name: 'Initial Assessment', status: 'completed' as const },
      { id: 'wf-2', name: 'Root Cause Analysis', status: 'in_progress' as const },
      { id: 'wf-3', name: 'Corrective Actions', status: 'pending' as const },
    ]

    if (status === 'draft') return []

    // All workflows need lastUpdatedBy and lastUpdatedAt
    const addMetadata = (wf: typeof baseWorkflows[0], i: number, overrideStatus?: 'pending' | 'completed') => ({
      ...wf,
      status: overrideStatus ?? wf.status,
      lastUpdatedBy: { id: 'user-1', name: incident.reporter },
      lastUpdatedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })

    if (status === 'reported') return baseWorkflows.map((w, i) => addMetadata(w, i, 'pending'))
    if (status === 'review') return baseWorkflows.map((w, i) => addMetadata(w, i, 'completed'))

    return baseWorkflows.map((w, i) => addMetadata(w, i))
  }

  // Generate creation date based on age
  const createdAt = new Date(Date.now() - (incident.ageDays * 24 * 60 * 60 * 1000))

  return {
    id: incident.id,
    incidentId: incident.incidentId,
    title: incident.title,
    description: `This incident was reported at ${incident.location} by ${incident.reporter}. ${incident.title}. The incident is currently under ${incident.status} with ${incident.severity} severity. Further investigation and documentation is required to ensure proper resolution and prevent future occurrences.`,
    status: incident.status,
    severity: severityMap[incident.severity],
    type: getIncidentType(incident.title),
    location: {
      id: 'loc-1',
      name: incident.location,
      facility: incident.location.includes('Warehouse') ? 'Main Warehouse' :
               incident.location.includes('Production') ? 'Production Building' :
               incident.location.includes('Office') ? 'Office Complex' : 'Main Facility',
      facilityId: 'fac-1',
      coordinates: {
        lat: 49.8397 + (Math.random() * 0.01),
        lng: 24.0297 + (Math.random() * 0.01),
      },
      what3words: '///appealing.concluded.mugs',
    },
    reporter: {
      id: 'user-1',
      name: incident.reporter,
      email: `${incident.reporter.toLowerCase().replace(' ', '.')}@company.com`,
    },
    createdAt: createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    stepsTotal: incident.status === 'draft' ? 0 : 3,
    stepsCompleted: incident.status === 'review' ? 3 : incident.status === 'investigation' ? 1 : 0,
    documentsCount: Math.floor(Math.random() * 5) + 1,
    daysOpen: incident.ageDays,
    reference: incident.incidentId,
    workflows: generateWorkflows(incident.status),
    formSubmissions: incident.status !== 'draft' ? [
      {
        id: 'fs-1',
        formName: 'Initial Incident Report',
        submittedBy: { id: 'user-1', name: incident.reporter },
        submittedAt: createdAt.toISOString(),
        status: 'approved' as const,
      },
    ] : [],
    activities: incident.status !== 'draft' ? [
      {
        id: 'act-1',
        type: 'status_change' as const,
        description: `Status changed to ${incident.status}`,
        user: { id: 'user-1', name: incident.reporter },
        timestamp: new Date(Date.now() - (Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      },
      {
        id: 'act-2',
        type: 'comment' as const,
        description: 'Investigation in progress. Gathering evidence and witness statements.',
        user: { id: 'user-2', name: 'Safety Officer' },
        timestamp: new Date(Date.now() - (Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
      },
    ] : [],
  }
}

// =============================================================================
// MOCK DATA - EHS Specific
// =============================================================================

const ehsKpis = [
  {
    id: 'days-safe',
    label: 'Days Without Incident',
    value: 47,
    trend: '+47',
    trendDirection: 'up' as const,
    icon: <Shield className="w-5 h-5 text-teal" />,
  },
  {
    id: 'open-incidents',
    label: 'Open Incidents',
    value: 3,
    trend: '-2',
    trendDirection: 'down' as const,
    icon: <TriangleAlert className="w-5 h-5 text-warning" />,
  },
  {
    id: 'workflow-steps',
    label: 'Active Workflows',
    value: 12,
    trend: '+3',
    trendDirection: 'up' as const,
    icon: <Waypoints className="w-5 h-5 text-info" />,
  },
  {
    id: 'training-complete',
    label: 'Training Compliance',
    value: '94%',
    trend: '+5%',
    trendDirection: 'up' as const,
    icon: <Users className="w-5 h-5 text-success" />,
  },
]

const ehsActivity = [
  {
    id: '1',
    type: 'warning',
    title: 'Slip hazard reported',
    description: 'Wet floor in Building A lobby - under review',
    timestamp: '10 min ago',
  },
  {
    id: '2',
    type: 'success',
    title: 'Fire drill completed',
    description: 'Evacuation time: 3:42 - within target',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'info',
    title: 'PPE inspection scheduled',
    description: 'Warehouse team - due tomorrow',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    type: 'success',
    title: 'Safety training completed',
    description: 'Forklift certification - 12 employees',
    timestamp: '3 hours ago',
  },
]

const ehsQuickActions = [
  {
    id: 'report-incident',
    label: 'Report Incident',
    description: 'Log a new safety incident',
    icon: <TriangleAlert className="w-4 h-4" />,
    onClick: () => alert('Opening incident report form...'),
    variant: 'primary' as const,
  },
  {
    id: 'start-workflow',
    label: 'Start Workflow',
    description: 'Begin a new workflow',
    icon: <Waypoints className="w-4 h-4" />,
    onClick: () => alert('Starting new workflow...'),
  },
  {
    id: 'capture-observation',
    label: 'Capture Observation',
    description: 'Document a safety observation',
    icon: <Camera className="w-4 h-4" />,
    onClick: () => alert('Opening camera...'),
  },
]

// =============================================================================
// MOCK DATA - EHS Analytics Dashboard
// =============================================================================

const ehsAnalyticsKpiData = [
  {
    id: 'ltir',
    title: 'Lost Time Injury Rate',
    value: 0,
    description: 'Per 200,000 hours worked',
    icon: <AlertCircle className="w-5 h-5" />,
    isHero: true,
    zeroIsCelebratory: true,
  },
  {
    id: 'trir',
    title: 'Total Recordable Incidents',
    value: 1.2,
    description: 'Per 200,000 hours worked',
    icon: <TriangleAlert className="w-5 h-5" />,
    zeroIsCelebratory: true,
  },
  {
    id: 'nmr',
    title: 'Near Miss Rate',
    value: 4.8,
    description: 'Proactive safety indicators',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: 'oca',
    title: 'Overdue CA',
    value: 3,
    description: '3 actions need attention',
    icon: <RefreshCw className="w-5 h-5" />,
    zeroIsCelebratory: true,
  },
]

const ehsAnalyticsIncidentData = [
  {
    id: 'total',
    title: 'Total Incidents',
    value: 47,
    description: 'YTD recorded incidents',
    isNegativeMetric: true,
  },
  {
    id: 'active',
    title: 'Active Incidents',
    value: 12,
    description: 'Requiring attention',
    trend: '-2',
    trendDirection: 'down' as const,
    isNegativeMetric: true,
  },
  {
    id: 'high',
    title: 'High Severity',
    value: 0,
    description: 'No critical issues',
    isNegativeMetric: true,
    zeroIsCelebratory: true,
  },
  {
    id: 'lti',
    title: 'Days Since Last LTI',
    value: 127,
    description: 'Keep the streak going!',
    isPositive: true,
  },
]

const ehsAnalyticsSeverityBreakdown: BreakdownItem[] = [
  { label: 'Critical/Fatality', value: 0, variant: 'error' },
  { label: 'Lost Time', value: 2, variant: 'warning' },
  { label: 'Recordable', value: 8, variant: 'info' },
  { label: 'Near Miss', value: 24, variant: 'success' },
  { label: 'First Aid', value: 13, variant: 'default' },
]

const ehsAnalyticsFocusFour: BreakdownItem[] = [
  { label: 'Falls', value: 3, variant: 'warning' },
  { label: 'Struck By', value: 5, variant: 'error' },
  { label: 'Caught In Between', value: 1, variant: 'warning' },
  { label: 'Electrocution', value: 0, variant: 'success' },
]

const ehsAnalyticsActionData = [
  { id: 'total', title: 'Total CA', value: 89, description: 'Total corrective actions' },
  { id: 'completed', title: 'Completed CA', value: 67, description: 'Completed and verified' },
  { id: 'rate', title: 'CA Close-Out Rate', value: '75.3%', description: 'Target: 85%' },
  { id: 'progress', title: 'CA In Progress', value: 15, description: 'Currently in progress' },
  { id: 'notstarted', title: 'CA Not Started', value: 7, description: 'Awaiting assignment' },
]

const ehsAnalyticsAgingData: AgingItem[] = [
  { label: '30+ days', value: 4, variant: 'warning' },
  { label: '60+ days', value: 2, variant: 'error' },
  { label: '90+ days', value: 1, variant: 'error' },
]

const ehsAnalyticsGeneralData = [
  {
    id: 'locations',
    title: 'Total Locations',
    value: 24,
    description: 'Active facilities',
    icon: <MapPin className="w-5 h-5 text-info" />,
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 156,
    description: 'This month',
    icon: <Users className="w-5 h-5 text-info" />,
  },
]

const ehsAnalyticsTrendingIncidents: TrendingItem[] = [
  { label: 'Slip/Trip/Fall Report', count: 18 },
  { label: 'Near Miss Report', count: 24 },
  { label: 'Equipment Damage', count: 9 },
  { label: 'Environmental Spill', count: 3 },
]

const ehsAnalyticsLocationRisks: LocationRisk[] = [
  { location: 'Warehouse B - Loading Dock', count: 8, risk: 'critical' },
  { location: 'Manufacturing Floor A', count: 5, risk: 'high' },
  { location: 'Chemical Storage Unit', count: 3, risk: 'medium' },
  { location: 'Admin Building', count: 1, risk: 'low' },
]

const ehsAnalyticsEmployeeWorkload: WorkloadItem[] = [
  { name: 'Sarah Chen', initials: 'SC', count: 18, color: 'error' },
  { name: 'Marcus Johnson', initials: 'MJ', count: 12, color: 'warning' },
  { name: 'Emily Rodriguez', initials: 'ER', count: 8, color: 'info' },
  { name: 'James Wilson', initials: 'JW', count: 4, color: 'success' },
]

const ehsAnalyticsUpcomingTasks: UpcomingTask[] = [
  { id: '1', title: 'Safety audit - Warehouse B', dueDate: 'Today', priority: 'high', assignee: 'SC' },
  { id: '2', title: 'Fire drill coordination', dueDate: 'Tomorrow', priority: 'medium', assignee: 'MJ' },
  { id: '3', title: 'PPE inventory check', dueDate: 'Dec 26', priority: 'low', assignee: 'ER' },
]

// My Priority Tasks - for the new "Act Now" section
const ehsAnalyticsMyPriorityTasks = [
  { id: 'p1', title: 'Complete incident investigation - INC-2024-0847', type: 'overdue' as const, dueDate: 'Dec 20', severity: 'high' as const },
  { id: 'p2', title: 'Review corrective action plan', type: 'due-today' as const, dueDate: 'Today', severity: 'medium' as const },
  { id: 'p3', title: 'Chemical spill response assessment', type: 'critical' as const, severity: 'critical' as const },
  { id: 'p4', title: 'Safety training follow-up', type: 'due-today' as const, dueDate: 'Today', severity: 'low' as const },
  { id: 'p5', title: 'Equipment inspection - Forklift #3', type: 'assigned' as const, dueDate: 'Dec 26', severity: 'medium' as const },
  { id: 'p6', title: 'PPE compliance audit sign-off', type: 'overdue' as const, dueDate: 'Dec 18', severity: 'high' as const },
]

// =============================================================================
// EDITABLE DASHBOARD - Wrapper with Edit Mode functionality
// =============================================================================

// Initial widget configuration for edit mode
const initialDashboardWidgets: WidgetConfig[] = [
  // Priority section - "Act Now" items that need immediate attention
  { id: 'my-priority', type: 'priority', title: 'My Priority', visible: true, size: '2x1', order: 0, section: 'priority' },
  // KPIs section
  { id: 'kpi-ltir', type: 'kpi', title: 'Lost Time Injury Rate', visible: true, size: '1x1', order: 0, section: 'kpis' },
  { id: 'kpi-trir', type: 'kpi', title: 'Total Recordable Incidents', visible: true, size: '1x1', order: 1, section: 'kpis' },
  { id: 'kpi-nmr', type: 'kpi', title: 'Near Miss Rate', visible: true, size: '1x1', order: 2, section: 'kpis' },
  { id: 'kpi-oca', type: 'kpi', title: 'Overdue CA', visible: true, size: '1x1', order: 3, section: 'kpis' },
  { id: 'incident-total', type: 'kpi', title: 'Total Incidents', visible: true, size: '1x1', order: 0, section: 'incidents' },
  { id: 'incident-active', type: 'kpi', title: 'Active Incidents', visible: true, size: '1x1', order: 1, section: 'incidents' },
  { id: 'incident-high', type: 'kpi', title: 'High Severity', visible: true, size: '1x1', order: 2, section: 'incidents' },
  { id: 'incident-lti', type: 'kpi', title: 'Days Since Last LTI', visible: true, size: '1x1', order: 3, section: 'incidents' },
  { id: 'breakdown-severity', type: 'breakdown', title: 'Severity Breakdown', visible: true, size: '1x1', order: 4, section: 'incidents' },
  { id: 'breakdown-focus', type: 'breakdown', title: 'Focus Four Incidents', visible: true, size: '1x1', order: 5, section: 'incidents' },
  { id: 'action-total', type: 'stats', title: 'Total CA', visible: true, size: '1x1', order: 0, section: 'actions' },
  { id: 'action-completed', type: 'stats', title: 'Completed CA', visible: true, size: '1x1', order: 1, section: 'actions' },
  { id: 'action-rate', type: 'stats', title: 'CA Close-Out Rate', visible: true, size: '1x1', order: 2, section: 'actions' },
  { id: 'action-progress', type: 'stats', title: 'CA In Progress', visible: true, size: '1x1', order: 3, section: 'actions' },
  { id: 'action-notstarted', type: 'stats', title: 'CA Not Started', visible: true, size: '1x1', order: 4, section: 'actions' },
  { id: 'aging-ca', type: 'aging', title: 'CA Aging', visible: true, size: '1x1', order: 5, section: 'actions' },
  { id: 'general-locations', type: 'kpi', title: 'Total Locations', visible: true, size: '1x1', order: 0, section: 'general' },
  { id: 'general-users', type: 'kpi', title: 'Active Users', visible: true, size: '1x1', order: 1, section: 'general' },
  { id: 'trending-types', type: 'trending', title: 'Incident Types', visible: true, size: '1x1', order: 0, section: 'analytics' },
  { id: 'heatmap-risk', type: 'heatmap', title: 'Location Risks', visible: true, size: '1x1', order: 1, section: 'analytics' },
  { id: 'workload-team', type: 'workload', title: 'Team Workload', visible: true, size: '1x1', order: 2, section: 'analytics' },
  { id: 'tasks-upcoming', type: 'tasks', title: 'Upcoming Tasks', visible: true, size: '1x1', order: 3, section: 'analytics' },
]

/**
 * EditableDashboardContent - The actual dashboard content with edit mode support
 */
function EditableDashboardContent({ onAddTask }: { onAddTask?: () => void }) {
  const {
    isEditMode,
    widgets,
    enterEditMode,
    reorderWidgets,
  } = useDashboardEdit()

  const [settingsPanelWidget, setSettingsPanelWidget] = useState<string | null>(null)

  // Get widgets by section, sorted by order
  const getWidgetsBySection = (section: string) =>
    widgets
      .filter((w) => w.section === section)
      .sort((a, b) => a.order - b.order)

  // Sample sparkline data for KPI trends (last 14 data points)
  const sparklineData = {
    ltir: [0.2, 0.1, 0.15, 0.1, 0.05, 0.08, 0.03, 0.02, 0.01, 0, 0, 0, 0, 0], // Trending down to zero
    trir: [1.8, 1.6, 1.5, 1.7, 1.4, 1.3, 1.5, 1.4, 1.3, 1.2, 1.25, 1.2, 1.15, 1.2], // Trending down
    nmr: [3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.3, 4.6, 4.4, 4.7, 4.5, 4.8, 4.6, 4.8], // Trending up (good for near misses)
    oca: [8, 7, 6, 5, 6, 5, 4, 5, 4, 3, 4, 3, 3, 3], // Trending down
    activeIncidents: [18, 17, 16, 15, 14, 15, 14, 13, 14, 13, 12, 13, 12, 12], // Trending down
    daysSinceLti: [100, 105, 110, 112, 115, 117, 119, 120, 121, 123, 124, 125, 126, 127], // Trending up
  }

  // Current period progress (simulating day 20 of 31 in December)
  const periodProgress = 65

  // Thresholds for status zones
  const thresholds = {
    ltir: { warning: 0.5, critical: 1.5 },      // LTIR thresholds (per 200k hours)
    trir: { warning: 1.5, critical: 3.0 },      // TRIR thresholds
    nmr: { warning: 3, critical: 1 },           // Near miss (higher is better, so inverted)
    oca: { warning: 3, critical: 8 },           // Overdue CA thresholds
    activeIncidents: { warning: 10, critical: 20 },
  }

  // Render widget content based on type and ID
  const renderWidgetContent = (widget: WidgetConfig) => {
    // Priority widget - "My Priority" card showing urgent items
    if (widget.id === 'my-priority') {
      const tasks = ehsAnalyticsMyPriorityTasks
      const overdueCount = tasks.filter((t) => t.type === 'overdue').length
      const dueTodayCount = tasks.filter((t) => t.type === 'due-today').length
      const criticalCount = tasks.filter((t) => t.type === 'critical').length

      if (tasks.length === 0) {
        return (
          <div className="col-span-full sm:col-span-2 bg-success-tint dark:bg-success/10 rounded-xl p-6 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-success-dark dark:text-success">All caught up!</h3>
                <p className="text-sm text-success-dark/70 dark:text-success/70">
                  No urgent items requiring your attention
                </p>
              </div>
            </div>
          </div>
        )
      }

      return (
        <div className="bg-surface rounded-xl p-4 border border-default shadow-sm h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-primary">My Priority</h3>
            </div>
            <span className="text-xs text-secondary">{tasks.length} items</span>
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
                <AlertCircle className="w-3 h-3" />
                {overdueCount} overdue
              </span>
            )}
            {dueTodayCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-warning/10 text-warning-dark dark:text-warning rounded-full">
                <Clock className="w-3 h-3" />
                {dueTodayCount} due today
              </span>
            )}
            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
                <Zap className="w-3 h-3" />
                {criticalCount} critical
              </span>
            )}
          </div>

          {/* Task list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tasks.slice(0, 5).map((task) => (
              <button
                key={task.id}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted-bg transition-colors text-left"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.type === 'overdue' ? 'bg-error' :
                    task.type === 'due-today' ? 'bg-warning' :
                    task.type === 'critical' ? 'bg-error' :
                    'bg-accent'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary truncate">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-secondary">{task.dueDate}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    // KPI widgets - Enhanced with status zones, temporal progress, and thresholds
    if (widget.id === 'kpi-ltir') {
      return (
        <KPICard
          title="Lost Time Injury Rate"
          value={0}
          icon={<AlertCircle className="w-5 h-5" />}
          isHero
          zeroIsCelebratory
          sparklineData={sparklineData.ltir}
          isNegativeMetric
          trendDirection="down"
          showStatusZones
          thresholds={thresholds.ltir}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'kpi-trir') {
      return (
        <KPICard
          title="Total Recordable Incidents"
          value={1.2}
          icon={<TriangleAlert className="w-5 h-5" />}
          zeroIsCelebratory
          sparklineData={sparklineData.trir}
          isNegativeMetric
          trendDirection="down"
          trend="-0.6"
          showStatusZones
          thresholds={thresholds.trir}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'kpi-nmr') {
      return (
        <KPICard
          title="Near Miss Rate"
          value={4.8}
          icon={<ShieldCheck className="w-5 h-5" />}
          sparklineData={sparklineData.nmr}
          trendDirection="up"
          trend="+1.6"
          showStatusZones
          thresholds={thresholds.nmr}
          periodProgress={periodProgress}
          statusMessages={{ success: 'Great reporting culture!' }}
        />
      )
    }
    if (widget.id === 'kpi-oca') {
      return (
        <KPICard
          title="Overdue CA"
          value={3}
          icon={<RefreshCw className="w-5 h-5" />}
          zeroIsCelebratory
          sparklineData={sparklineData.oca}
          isNegativeMetric
          trendDirection="down"
          trend="-5"
          showStatusZones
          thresholds={thresholds.oca}
          periodProgress={periodProgress}
          statusMessages={{ warning: '3 actions need attention' }}
        />
      )
    }

    // Incident widgets - Enhanced with status zones
    if (widget.id === 'incident-total') {
      return <KPICard title="Total Incidents" value={47} description="YTD recorded incidents" />
    }
    if (widget.id === 'incident-active') {
      return (
        <KPICard
          title="Active Incidents"
          value={12}
          trend="-2"
          trendDirection="down"
          isNegativeMetric
          sparklineData={sparklineData.activeIncidents}
          showStatusZones
          thresholds={thresholds.activeIncidents}
          periodProgress={periodProgress}
        />
      )
    }
    if (widget.id === 'incident-high') {
      return (
        <KPICard
          title="High Severity"
          value={0}
          zeroIsCelebratory
          thresholds={{ warning: 1, critical: 3 }}
          isNegativeMetric
        />
      )
    }
    if (widget.id === 'incident-lti') {
      return (
        <KPICard
          title="Days Since Last LTI"
          value={127}
          isPositive
          sparklineData={sparklineData.daysSinceLti}
          trendDirection="up"
          statusMessages={{ success: 'Keep the streak going!' }}
        />
      )
    }
    if (widget.id === 'breakdown-severity') {
      return <BreakdownCard icon={<Zap />} title="Severity Breakdown" total={ehsAnalyticsSeverityBreakdown.reduce((sum, i) => sum + i.value, 0)} items={ehsAnalyticsSeverityBreakdown} zeroIsCelebratory={false} />
    }
    if (widget.id === 'breakdown-focus') {
      return <BreakdownCard icon={<Target />} title="Focus Four Incidents" total={ehsAnalyticsFocusFour.reduce((sum, i) => sum + i.value, 0)} items={ehsAnalyticsFocusFour} zeroIsCelebratory={false} />
    }

    // Action widgets
    if (widget.id === 'action-total') {
      return <StatsCard title="Total CA" value={89} description="Total corrective actions" />
    }
    if (widget.id === 'action-completed') {
      return <StatsCard title="Completed CA" value={67} description="Completed and verified" />
    }
    if (widget.id === 'action-rate') {
      return <StatsCard title="CA Close-Out Rate" value="75.3%" description="Target: 85%" />
    }
    if (widget.id === 'action-progress') {
      return <StatsCard title="CA In Progress" value={15} description="Currently in progress" />
    }
    if (widget.id === 'action-notstarted') {
      return <StatsCard title="CA Not Started" value={7} description="Awaiting assignment" />
    }
    if (widget.id === 'aging-ca') {
      return <AgingCard items={ehsAnalyticsAgingData} />
    }

    // General widgets
    if (widget.id === 'general-locations') {
      return <KPICard title="Total Locations" value={24} description="Active facilities" icon={<MapPin className="w-5 h-5 text-info" />} />
    }
    if (widget.id === 'general-users') {
      return <KPICard title="Active Users" value={156} description="This month" icon={<Users className="w-5 h-5 text-info" />} />
    }

    // Analytics widgets
    if (widget.id === 'trending-types') {
      return <TrendingCard title="Incident Types" total={ehsAnalyticsTrendingIncidents.reduce((sum, i) => sum + i.count, 0)} items={ehsAnalyticsTrendingIncidents} />
    }
    if (widget.id === 'heatmap-risk') {
      return <RiskHeatmapCard items={ehsAnalyticsLocationRisks} />
    }
    if (widget.id === 'workload-team') {
      return <WorkloadCard items={ehsAnalyticsEmployeeWorkload} />
    }
    if (widget.id === 'tasks-upcoming') {
      return <UpcomingTasksCard tasks={ehsAnalyticsUpcomingTasks} onAddTask={onAddTask} />
    }

    return (
      <div className="h-full flex items-center justify-center p-4 bg-muted-bg rounded-lg border border-dashed border-default">
        <span className="text-muted text-sm">Unknown widget: {widget.id}</span>
      </div>
    )
  }

  // Section rendering
  const renderSection = (
    sectionId: string,
    icon: React.ReactNode,
    title: string,
    description: string,
    gridClassName: string
  ) => {
    const sectionWidgets = getWidgetsBySection(sectionId)
    if (sectionWidgets.length === 0) return null

    const visibleWidgets = isEditMode ? sectionWidgets : sectionWidgets.filter((w) => w.visible)
    if (visibleWidgets.length === 0) return null

    const widgetIds = visibleWidgets.map((w) => w.id)

    return (
      <section>
        <SectionHeader icon={icon} title={title} description={description} />
        {isEditMode ? (
          <Reorder.Group
            axis="x"
            values={widgetIds}
            onReorder={(newOrder) => reorderWidgets(sectionId, newOrder)}
            className={gridClassName}
            as="div"
          >
            <AnimatePresence mode="popLayout">
              {visibleWidgets.map((widget) => (
                <ReorderableWidget
                  key={widget.id}
                  value={widget.id}
                  id={widget.id}
                  size={widget.size}
                  visible={widget.visible}
                  onSettingsOpen={() => setSettingsPanelWidget(widget.id)}
                >
                  {renderWidgetContent(widget)}
                </ReorderableWidget>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className={gridClassName}>
            {visibleWidgets.map((widget) => (
              <div key={widget.id}>{renderWidgetContent(widget)}</div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="relative min-h-screen bg-page dark:bg-page overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <EditModeToolbar />

      {/* Header - PageActionPanel for consistent styling with incidents page */}
      <div className="px-6 pt-6">
        <PageActionPanel
          icon={<LayoutDashboard className="w-5 h-5" />}
          iconClassName="text-accent"
          title="Welcome to your Flow"
          subtitle={
            isEditMode
              ? 'Drag widgets to reorder. Click the menu (⋮) on widgets for more options.'
              : 'Manage your Environmental, Health & Safety operations efficiently.'
          }
          primaryAction={
            !isEditMode ? (
              <Button variant="ghost" size="sm" className="gap-2" onClick={enterEditMode}>
                <PencilLine className="w-4 h-4" />
                Edit
              </Button>
            ) : undefined
          }
          actions={
            !isEditMode ? (
              <Button variant="ghost" size="sm" className="gap-2" onClick={enterEditMode}>
                <PencilLine className="w-4 h-4" />
                Customize Dashboard
              </Button>
            ) : undefined
          }
        />
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/10 border-b border-accent/20 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <p className="text-sm text-accent-strong font-medium">Edit Mode Active</p>
              <p className="text-sm text-muted hidden sm:block">
                Drag the handle on widgets to reorder. Use the ⋮ menu for more options.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Sections */}
      <div className="relative z-[1] p-6 space-y-8">
        {renderSection('priority', <Zap />, 'Act Now', 'Items requiring your immediate attention', 'grid grid-cols-1 sm:grid-cols-2 gap-4')}
        {renderSection('kpis', <Sparkles />, 'Key Performance Indicators', 'Critical safety and performance metrics', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
        {renderSection('incidents', <TriangleAlert />, 'Incident Overview', 'Track and monitor safety incidents', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4')}
        {renderSection('actions', <ClipboardList />, 'Action Metrics', 'Corrective action tracking and completion rates', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4')}
        {renderSection('general', <Globe />, 'General', 'Organization overview', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
        {renderSection('analytics', <Activity />, 'Trending & Analytics', 'Trends, heatmaps, and upcoming items', 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4')}
      </div>

      <WidgetSettingsPanel
        widgetId={settingsPanelWidget}
        open={!!settingsPanelWidget}
        onClose={() => setSettingsPanelWidget(null)}
      />
    </div>
  )
}

/**
 * EditableDashboard - The full editable dashboard with provider
 */
function EditableDashboard({ onAddTask }: { onAddTask?: () => void }) {
  return (
    <DashboardEditProvider
      initialWidgets={initialDashboardWidgets}
      onSave={(widgets) => console.log('Dashboard saved:', widgets)}
    >
      <EditableDashboardContent onAddTask={onAddTask} />
    </DashboardEditProvider>
  )
}

// =============================================================================
// STEP GENERATION - Steps for all non-draft incidents (reported, investigation, review)
// Draft incidents do NOT have steps
// =============================================================================

// Step templates for generating steps per incident
const stepTemplates = [
  {
    title: 'Initial Assessment',
    description: 'Complete initial assessment of the incident scene and document observations.',
    tooltip: 'First response documentation',
  },
  {
    title: 'Witness Statements',
    description: 'Collect statements from all witnesses present at the time of the incident.',
    tooltip: 'Gather witness accounts',
  },
  {
    title: 'Evidence Collection',
    description: 'Gather and preserve all physical evidence related to the incident.',
    tooltip: 'Evidence preservation step',
  },
  {
    title: 'Root Cause Analysis',
    description: 'Perform thorough analysis to identify underlying factors that contributed to the incident.',
    tooltip: 'Deep dive into causes',
  },
  {
    title: 'Corrective Action Plan',
    description: 'Develop and document corrective actions to prevent similar incidents.',
    tooltip: 'Prevention planning',
  },
  {
    title: 'Safety Review',
    description: 'Review safety protocols and update as needed based on findings.',
    tooltip: 'Protocol review',
  },
  {
    title: 'Final Report',
    description: 'Compile final incident report for management review and closure.',
    tooltip: 'Documentation finalization',
  },
]

// Assignees for steps
const stepAssignees = [
  { id: 'user-1', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
  { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: 'user-3', name: 'David Kim', email: 'david.kim@company.com' },
  { id: 'user-4', name: 'Amanda Torres', email: 'amanda.torres@company.com' },
  { id: 'user-5', name: 'Robert Brown', email: 'robert.brown@company.com' },
  { id: 'user-6', name: 'Jennifer Lee', email: 'jennifer.lee@company.com' },
  { id: 'user-7', name: 'Mark Wilson', email: 'mark.wilson@company.com' },
  { id: 'user-8', name: 'Nancy Taylor', email: 'nancy.taylor@company.com' },
]

// Generate steps for all non-draft incidents
const generateStepsForIncidents = (): Step[] => {
  const steps: Step[] = []
  const stepStatuses: Array<'pending' | 'in_progress' | 'overdue' | 'completed'> = ['pending', 'in_progress', 'overdue', 'completed']

  // incidentData is already generated - we'll filter for non-draft incidents
  incidentData.forEach((incident) => {
    // Skip draft incidents - they don't have steps
    if (incident.status === 'draft') return

    // Determine number of steps based on status
    // - reported: 2-3 steps (early stage)
    // - investigation: 4-5 steps (active work)
    // - review: 5-7 steps (near completion)
    let stepCount: number
    switch (incident.status) {
      case 'reported':
        stepCount = 2 + Math.floor(Math.random() * 2) // 2-3 steps
        break
      case 'investigation':
        stepCount = 4 + Math.floor(Math.random() * 2) // 4-5 steps
        break
      case 'review':
        stepCount = 5 + Math.floor(Math.random() * 3) // 5-7 steps
        break
      default:
        stepCount = 3
    }

    // Generate steps for this incident
    for (let i = 0; i < stepCount; i++) {
      const template = stepTemplates[i % stepTemplates.length]
      const assignee = stepAssignees[Math.floor(Math.random() * stepAssignees.length)]
      const reporter = stepAssignees[Math.floor(Math.random() * stepAssignees.length)]
      const daysOpen = Math.floor(Math.random() * 14) + 1

      // Determine step status based on position and incident status
      let status: 'pending' | 'in_progress' | 'overdue' | 'completed'
      if (incident.status === 'review') {
        // Review incidents: most steps completed
        if (i < stepCount - 2) {
          status = 'completed'
        } else if (i === stepCount - 2) {
          status = 'in_progress'
        } else {
          status = 'pending'
        }
      } else if (incident.status === 'investigation') {
        // Investigation: mix of statuses
        if (i < 2) {
          status = 'completed'
        } else if (i === 2) {
          status = 'in_progress'
        } else {
          status = daysOpen > 7 ? 'overdue' : 'pending'
        }
      } else {
        // Reported: mostly pending
        status = i === 0 ? 'in_progress' : 'pending'
      }

      const isOverdue = status === 'overdue' || (status === 'pending' && daysOpen > 10)

      steps.push({
        id: `step-${incident.id}-${i}`,
        title: template.title,
        description: template.description,
        tooltip: template.tooltip,
        incidentId: incident.incidentId,
        incidentDbId: incident.id,
        severity: incident.severity as 'critical' | 'high' | 'medium' | 'low' | 'none',
        status,
        location: incident.location,
        assignee,
        reporter,
        createdAt: new Date(Date.now() - daysOpen * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + (7 - daysOpen) * 24 * 60 * 60 * 1000).toISOString(),
        daysOpen,
        isOverdue,
      })
    }
  })

  return steps
}

// Generate all steps (called after incidentData is created)
const allSteps: Step[] = generateStepsForIncidents()

// For the StepsPage view, split into "my steps" (assigned to first user) and "team steps"
const mySteps = allSteps.filter(step => step.assignee.id === 'user-1').slice(0, 10)
const teamSteps = allSteps.filter(step => step.assignee.id !== 'user-1').slice(0, 15)

// =============================================================================
// USER MANAGEMENT MOCK DATA
// =============================================================================

const mockPermissions: Permission[] = [
  { id: 'perm-1', resource: 'incidents', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'perm-2', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'perm-3', resource: 'reports', actions: ['read'] },
  { id: 'perm-4', resource: 'settings', actions: ['read', 'update'] },
  { id: 'perm-5', resource: 'inspections', actions: ['create', 'read', 'update'] },
  { id: 'perm-6', resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] },
]

// Enhanced permissions for role creation/editing dialogs
const mockEnhancedPermissions: EnhancedPermission[] = [
  // Incidents
  { id: 'incidents-create', resource: 'incidents', action: 'create', category: 'access', bitmask: 1, label: 'Create incidents', description: 'Permission to create new incident reports' },
  { id: 'incidents-read', resource: 'incidents', action: 'read', category: 'access', bitmask: 2, label: 'View incidents', description: 'Permission to view all incident data' },
  { id: 'incidents-update', resource: 'incidents', action: 'update', category: 'access', bitmask: 4, label: 'Update incidents', description: 'Permission to modify incident records' },
  { id: 'incidents-delete', resource: 'incidents', action: 'delete', category: 'management', bitmask: 8, label: 'Delete incidents', description: 'Permission to permanently remove incident records' },
  { id: 'incidents-approve', resource: 'incidents', action: 'approve', category: 'management', bitmask: 1024, label: 'Approve incidents', description: 'Permission to approve incident submissions' },
  // Users
  { id: 'users-create', resource: 'users', action: 'create', category: 'access', bitmask: 1, label: 'Create users', description: 'Permission to create new user accounts' },
  { id: 'users-read', resource: 'users', action: 'read', category: 'access', bitmask: 2, label: 'View users', description: 'Permission to view all user data' },
  { id: 'users-update', resource: 'users', action: 'update', category: 'access', bitmask: 4, label: 'Update users', description: 'Permission to modify user accounts' },
  { id: 'users-delete', resource: 'users', action: 'delete', category: 'management', bitmask: 8, label: 'Delete users', description: 'Permission to permanently remove user accounts' },
  // Reports
  { id: 'reports-create', resource: 'reports', action: 'create', category: 'access', bitmask: 1, label: 'Create reports', description: 'Permission to generate new reports' },
  { id: 'reports-read', resource: 'reports', action: 'read', category: 'access', bitmask: 2, label: 'View reports', description: 'Permission to view report data' },
  { id: 'reports-update', resource: 'reports', action: 'update', category: 'access', bitmask: 4, label: 'Update reports', description: 'Permission to modify report configurations' },
  { id: 'reports-delete', resource: 'reports', action: 'delete', category: 'management', bitmask: 8, label: 'Delete reports', description: 'Permission to remove reports' },
  // Settings
  { id: 'settings-read', resource: 'settings', action: 'read', category: 'access', bitmask: 2, label: 'View settings', description: 'Permission to view system settings' },
  { id: 'settings-update', resource: 'settings', action: 'update', category: 'management', bitmask: 4, label: 'Update settings', description: 'Permission to modify system settings' },
  // Inspections
  { id: 'inspections-create', resource: 'inspections', action: 'create', category: 'access', bitmask: 1, label: 'Create inspections', description: 'Permission to create inspection records' },
  { id: 'inspections-read', resource: 'inspections', action: 'read', category: 'access', bitmask: 2, label: 'View inspections', description: 'Permission to view inspection data' },
  { id: 'inspections-update', resource: 'inspections', action: 'update', category: 'access', bitmask: 4, label: 'Update inspections', description: 'Permission to modify inspection records' },
  { id: 'inspections-delete', resource: 'inspections', action: 'delete', category: 'management', bitmask: 8, label: 'Delete inspections', description: 'Permission to remove inspection records' },
  // Tasks
  { id: 'tasks-create', resource: 'tasks', action: 'create', category: 'access', bitmask: 1, label: 'Create tasks', description: 'Permission to create new tasks' },
  { id: 'tasks-read', resource: 'tasks', action: 'read', category: 'access', bitmask: 2, label: 'View tasks', description: 'Permission to view task data' },
  { id: 'tasks-update', resource: 'tasks', action: 'update', category: 'access', bitmask: 4, label: 'Update tasks', description: 'Permission to modify task records' },
  { id: 'tasks-delete', resource: 'tasks', action: 'delete', category: 'management', bitmask: 8, label: 'Delete tasks', description: 'Permission to remove tasks' },
  { id: 'tasks-manage-own', resource: 'tasks', action: 'manage-own-tasks', category: 'access', bitmask: 16384, label: 'Manage own tasks', description: 'Permission to manage tasks assigned to you' },
]

const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: mockPermissions,
    isSystem: true,
    userCount: 3,
  },
  {
    id: 'role-manager',
    name: 'EHS Manager',
    description: 'Manage incidents, users, and reports for assigned locations',
    permissions: mockPermissions.filter(p => p.resource !== 'settings'),
    isSystem: false,
    userCount: 8,
  },
  {
    id: 'role-investigator',
    name: 'Investigator',
    description: 'Investigate and update assigned incidents',
    permissions: mockPermissions.filter(p => p.resource === 'incidents'),
    isSystem: false,
    userCount: 15,
  },
  {
    id: 'role-reporter',
    name: 'Reporter',
    description: 'Create and view incident reports',
    permissions: [{ id: 'perm-inc-cr', resource: 'incidents', actions: ['create', 'read'] }],
    isSystem: false,
    userCount: 142,
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to incidents and reports',
    permissions: [
      { id: 'perm-inc-r', resource: 'incidents', actions: ['read'] },
      { id: 'perm-rep-r', resource: 'reports', actions: ['read'] },
    ],
    isSystem: true,
    userCount: 56,
  },
]

const mockLocationTree: LocationNode[] = [
  {
    id: 'loc-corp',
    label: 'Corporate HQ',
    level: 0,
    children: [
      {
        id: 'loc-plant-a',
        label: 'Plant A - Chicago',
        level: 1,
        children: [
          { id: 'loc-warehouse-1', label: 'Warehouse 1', level: 2 },
          { id: 'loc-warehouse-2', label: 'Warehouse 2', level: 2 },
          { id: 'loc-office-a', label: 'Office Building A', level: 2 },
        ],
      },
      {
        id: 'loc-plant-b',
        label: 'Plant B - Detroit',
        level: 1,
        children: [
          { id: 'loc-production-1', label: 'Production Floor 1', level: 2 },
          { id: 'loc-production-2', label: 'Production Floor 2', level: 2 },
        ],
      },
    ],
  },
  {
    id: 'loc-west',
    label: 'West Region',
    level: 0,
    children: [
      {
        id: 'loc-plant-c',
        label: 'Plant C - Phoenix',
        level: 1,
        children: [
          { id: 'loc-assembly', label: 'Assembly Building', level: 2 },
        ],
      },
    ],
  },
]

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.smith@acme.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 555-0101',
    avatarUrl: 'https://i.pravatar.cc/150?u=john.smith',
    jobTitle: 'EHS Director',
    department: 'Environmental Health & Safety',
    status: 'active',
    roleAssignments: [
      {
        id: 'ra-1',
        role: mockRoles[0],
        scopes: [{ id: 'scope-1', locationId: 'loc-corp', locationName: 'Corporate HQ', locationPath: ['Corporate HQ'], includeChildren: true }],
        assignedAt: '2024-01-15T10:00:00Z',
        assignedBy: 'System',
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2025-01-10T08:30:00Z',
  },
  {
    id: 'user-2',
    email: 'sarah.johnson@acme.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1 555-0102',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah.johnson',
    jobTitle: 'Safety Manager',
    department: 'Environmental Health & Safety',
    status: 'active',
    roleAssignments: [
      {
        id: 'ra-2',
        role: mockRoles[1],
        scopes: [{ id: 'scope-2', locationId: 'loc-plant-a', locationName: 'Plant A - Chicago', locationPath: ['Corporate HQ', 'Plant A - Chicago'], includeChildren: true }],
        assignedAt: '2024-02-20T14:00:00Z',
        assignedBy: 'John Smith',
      },
    ],
    createdAt: '2024-02-20T14:00:00Z',
    lastLoginAt: '2025-01-09T16:45:00Z',
  },
  {
    id: 'user-3',
    email: 'mike.chen@acme.com',
    firstName: 'Mike',
    lastName: 'Chen',
    phone: '+1 555-0103',
    jobTitle: 'Incident Investigator',
    department: 'Environmental Health & Safety',
    status: 'active',
    roleAssignments: [
      {
        id: 'ra-3',
        role: mockRoles[2],
        scopes: [
          { id: 'scope-3a', locationId: 'loc-plant-a', locationName: 'Plant A - Chicago', locationPath: ['Corporate HQ', 'Plant A - Chicago'], includeChildren: false },
          { id: 'scope-3b', locationId: 'loc-plant-b', locationName: 'Plant B - Detroit', locationPath: ['Corporate HQ', 'Plant B - Detroit'], includeChildren: false },
        ],
        assignedAt: '2024-03-10T09:00:00Z',
        assignedBy: 'John Smith',
      },
    ],
    createdAt: '2024-03-10T09:00:00Z',
    lastLoginAt: '2025-01-10T11:20:00Z',
  },
  {
    id: 'user-4',
    email: 'emily.davis@acme.com',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '+1 555-0104',
    avatarUrl: 'https://i.pravatar.cc/150?u=emily.davis',
    jobTitle: 'Production Supervisor',
    department: 'Operations',
    status: 'active',
    roleAssignments: [
      {
        id: 'ra-4',
        role: mockRoles[3],
        scopes: [{ id: 'scope-4', locationId: 'loc-production-1', locationName: 'Production Floor 1', locationPath: ['Corporate HQ', 'Plant B - Detroit', 'Production Floor 1'], includeChildren: false }],
        assignedAt: '2024-04-05T11:00:00Z',
        assignedBy: 'Sarah Johnson',
      },
    ],
    createdAt: '2024-04-05T11:00:00Z',
    lastLoginAt: '2025-01-08T14:00:00Z',
  },
  {
    id: 'user-5',
    email: 'robert.wilson@acme.com',
    firstName: 'Robert',
    lastName: 'Wilson',
    jobTitle: 'Warehouse Lead',
    department: 'Logistics',
    status: 'pending',
    roleAssignments: [],
    createdAt: '2025-01-05T10:00:00Z',
  },
  {
    id: 'user-6',
    email: 'jennifer.martinez@acme.com',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    phone: '+1 555-0106',
    avatarUrl: 'https://i.pravatar.cc/150?u=jennifer.martinez',
    jobTitle: 'HR Manager',
    department: 'Human Resources',
    status: 'active',
    roleAssignments: [
      {
        id: 'ra-6',
        role: mockRoles[4],
        scopes: [{ id: 'scope-6', locationId: 'loc-corp', locationName: 'Corporate HQ', locationPath: ['Corporate HQ'], includeChildren: true }],
        assignedAt: '2024-05-15T09:00:00Z',
        assignedBy: 'John Smith',
      },
    ],
    createdAt: '2024-05-15T09:00:00Z',
    lastLoginAt: '2025-01-07T10:30:00Z',
  },
  {
    id: 'user-7',
    email: 'david.brown@acme.com',
    firstName: 'David',
    lastName: 'Brown',
    jobTitle: 'Maintenance Technician',
    department: 'Facilities',
    status: 'inactive',
    roleAssignments: [
      {
        id: 'ra-7',
        role: mockRoles[3],
        scopes: [{ id: 'scope-7', locationId: 'loc-plant-a', locationName: 'Plant A - Chicago', locationPath: ['Corporate HQ', 'Plant A - Chicago'], includeChildren: true }],
        assignedAt: '2024-06-01T08:00:00Z',
        assignedBy: 'Sarah Johnson',
      },
    ],
    createdAt: '2024-06-01T08:00:00Z',
    lastLoginAt: '2024-12-15T16:00:00Z',
  },
  {
    id: 'user-8',
    email: 'lisa.anderson@acme.com',
    firstName: 'Lisa',
    lastName: 'Anderson',
    phone: '+1 555-0108',
    avatarUrl: 'https://i.pravatar.cc/150?u=lisa.anderson',
    jobTitle: 'Quality Analyst',
    department: 'Quality Assurance',
    status: 'locked',
    roleAssignments: [
      {
        id: 'ra-8',
        role: mockRoles[2],
        scopes: [{ id: 'scope-8', locationId: 'loc-plant-b', locationName: 'Plant B - Detroit', locationPath: ['Corporate HQ', 'Plant B - Detroit'], includeChildren: false }],
        assignedAt: '2024-07-10T13:00:00Z',
        assignedBy: 'John Smith',
      },
    ],
    createdAt: '2024-07-10T13:00:00Z',
    lastLoginAt: '2024-11-20T09:15:00Z',
  },
]

const mockUserStats: UserStats = {
  totalUsers: 168,
  activeUsers: 142,
  pendingInvites: 12,
  roleDistribution: [
    { roleName: 'Administrator', count: 3, percentage: 1.8 },
    { roleName: 'EHS Manager', count: 8, percentage: 4.8 },
    { roleName: 'Investigator', count: 15, percentage: 8.9 },
    { roleName: 'Reporter', count: 142, percentage: 84.5 },
  ],
}

const mockDepartments = [
  'Environmental Health & Safety',
  'Operations',
  'Logistics',
  'Human Resources',
  'Facilities',
  'Quality Assurance',
  'Engineering',
  'Administration',
]

const mockJobTitles = [
  'EHS Director',
  'Safety Manager',
  'Incident Investigator',
  'Production Supervisor',
  'Warehouse Lead',
  'HR Manager',
  'Maintenance Technician',
  'Quality Analyst',
  'Plant Manager',
  'Safety Coordinator',
]

const mockUserActivities: UserActivity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    type: 'login',
    title: 'Logged in',
    timestamp: '2025-01-10T08:30:00Z',
    performedBy: { id: 'user-1', name: 'John Smith' },
  },
  {
    id: 'act-2',
    userId: 'user-1',
    type: 'role_assigned',
    title: 'Administrator role assigned',
    details: 'Granted full system access',
    timestamp: '2024-01-15T10:00:00Z',
    performedBy: { id: 'system', name: 'System' },
  },
  {
    id: 'act-3',
    userId: 'user-1',
    type: 'created',
    title: 'Account created',
    timestamp: '2024-01-15T10:00:00Z',
    performedBy: { id: 'system', name: 'System' },
  },
]

// =============================================================================
// FILTER CONFIGURATION (moved before flowNavItems for reference order)
// =============================================================================

// Filter groups for SearchFilter dropdown
// NOTE: Status filtering is handled by QuickFilters (Hick's Law - avoid competing systems)
// Advanced filters focus on Severity and Overdue which complement QuickFilters
const incidentFilterGroups: FilterGroup[] = [
  {
    key: 'severity',
    label: 'Severity',
    options: [
      { id: 'critical', label: 'Critical' },
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
      { id: 'none', label: 'None' },
    ],
  },
  {
    key: 'overdue',
    label: 'Overdue',
    options: [
      { id: 'overdue', label: 'Overdue Only' },
    ],
  },
]

// Location options for incident reporting (grouped by building/area)
const locationOptions = [
  // Warehouses
  { value: 'warehouse-a-1', label: 'Warehouse A - Section 1', group: 'Warehouses' },
  { value: 'warehouse-b-4', label: 'Warehouse B - Section 4', group: 'Warehouses' },
  { value: 'storage-c', label: 'Storage Room C', group: 'Warehouses' },
  { value: 'chemical-storage', label: 'Chemical Storage', group: 'Warehouses' },
  // Production
  { value: 'production-a', label: 'Production Floor - Building A', group: 'Production' },
  { value: 'assembly-3', label: 'Assembly Line 3', group: 'Production' },
  { value: 'quality-lab', label: 'Quality Control Lab', group: 'Production' },
  // Logistics
  { value: 'loading-east', label: 'Loading Dock - East Wing', group: 'Logistics' },
  { value: 'shipping', label: 'Shipping Department', group: 'Logistics' },
  { value: 'receiving', label: 'Receiving Area', group: 'Logistics' },
  { value: 'parking-b', label: 'Parking Lot B', group: 'Logistics' },
  // Facilities
  { value: 'utility-3b', label: 'Utility Room 3B', group: 'Facilities' },
  { value: 'maintenance', label: 'Maintenance Shop', group: 'Facilities' },
  { value: 'compressor', label: 'Compressor Building', group: 'Facilities' },
  { value: 'boiler', label: 'Boiler Room', group: 'Facilities' },
  { value: 'hvac', label: 'HVAC Equipment Area', group: 'Facilities' },
  { value: 'server-room', label: 'Server Room', group: 'Facilities' },
  // Office
  { value: 'office-f2', label: 'Office Building - Floor 2', group: 'Office' },
  { value: 'break-north', label: 'Break Room - North', group: 'Office' },
  { value: 'conf-101', label: 'Conference Room 101', group: 'Office' },
  { value: 'entrance', label: 'Building Entrance', group: 'Office' },
  // Outdoor
  { value: 'tank-farm', label: 'Outdoor Tank Farm', group: 'Outdoor' },
  { value: 'roof', label: 'Roof Access', group: 'Outdoor' },
]

// Navigation items for Flow - matching app-sidebar structure
const flowNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    component: (
      <EditableDashboard onAddTask={() => alert('Opening task creation...')} />
    ),
  },
  {
    id: 'workflow',
    label: 'Workflow Steps',
    icon: <Waypoints className="w-5 h-5" />,
    component: (
      <FlowPageContent>
        <StepsPage
          mySteps={mySteps}
          teamSteps={teamSteps}
          pageTitle="Workflow Steps"
          pageSubtitle="Manage and track workflow progress"
          onNextStep={(step) => {
            console.log('Next step clicked:', step)
            alert(`Navigating to incident: ${step.incidentId}`)
          }}
          onIncidentClick={(dbId, incidentId) => {
            console.log('Incident clicked:', { dbId, incidentId })
            alert(`Opening incident: ${incidentId}`)
          }}
          onAssigneeClick={(person) => {
            console.log('Assignee clicked:', person)
            alert(`Opening profile for: ${person.name}`)
          }}
          onLocationClick={(location) => {
            console.log('Location clicked:', location)
            alert(`Opening location: ${location}`)
          }}
          onExport={() => alert('Exporting steps...')}
        />
      </FlowPageContent>
    ),
  },
  {
    id: 'incidents',
    label: 'Report Incident',
    icon: <TriangleAlert className="w-5 h-5" />,
    badge: 3,
    component: (
      <FlowPageContent>
        <IncidentsPage
          incidents={incidentData}
          locations={locationOptions}
          filterGroups={incidentFilterGroups}
          documents={mockDocuments}
          userContext={mockUserContext}
          detailedWorkflows={mockDetailedWorkflows}
          extendedFormSubmissions={mockExtendedFormSubmissions}
          allSteps={allSteps}
          convertToIncidentDetail={convertToIncidentDetail}
          onIncidentSubmit={async (formData) => {
            console.log('Incident submitted:', formData)
            alert(`Incident submitted successfully!`)
          }}
        />
      </FlowPageContent>
    ),
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        id: 'users',
        label: 'User Management',
        icon: <Users className="w-5 h-5" />,
        component: (
          <UsersPage
            users={mockUsers}
            roles={mockRoles}
            locations={mockLocationTree}
            departments={mockDepartments}
            jobTitles={mockJobTitles}
            stats={mockUserStats}
            onUserCreate={async (data) => {
              console.log('Creating user:', data)
              alert(`User "${data.firstName} ${data.lastName}" created!`)
            }}
            onUserUpdate={async (data) => {
              console.log('Updating user:', data)
              alert(`User "${data.firstName} ${data.lastName}" updated!`)
            }}
            onUserDelete={async (userId) => {
              console.log('Deleting user:', userId)
              alert(`User deleted!`)
            }}
            onRoleAssign={async (userId, data) => {
              console.log('Assigning role:', { userId, data })
              alert(`Role assigned!`)
            }}
            onRoleAssignmentUpdate={async (assignmentId, scopes) => {
              console.log('Updating role assignment:', { assignmentId, scopes })
              alert(`Role assignment updated!`)
            }}
            onRoleAssignmentRemove={async (assignmentId) => {
              console.log('Removing role assignment:', assignmentId)
              alert(`Role assignment removed!`)
            }}
            onBulkAction={async (payload) => {
              console.log('Bulk action:', payload)
              alert(`Bulk action "${payload.action}" performed on ${payload.userIds.length} users!`)
            }}
            onFetchUserActivity={async (userId) => {
              console.log('Fetching activity for user:', userId)
              return mockUserActivities.filter(a => a.userId === userId)
            }}
            // Role CRUD props
            availablePermissions={mockEnhancedPermissions}
            onRoleCreate={async (data) => {
              console.log('Creating role:', data)
              alert(`Role "${data.name}" created with ${data.permissions.length} permissions!`)
            }}
            onRoleUpdate={async (data) => {
              console.log('Updating role:', data)
              alert(`Role "${data.name}" updated with ${data.permissions.length} permissions!`)
            }}
            onRoleDelete={async (roleId) => {
              console.log('Deleting role:', roleId)
              alert(`Role deleted!`)
            }}
          />
        ),
      },
      {
        id: 'dictionaries',
        label: 'Dictionaries',
        icon: <BookOpen className="w-5 h-5" />,
        component: (
          <FlowPageContent title="Dictionaries" subtitle="Manage lookup values" />
        ),
      },
      {
        id: 'locations',
        label: 'Locations',
        icon: <MapPin className="w-5 h-5" />,
        component: (
          <FlowPageContent title="Locations" subtitle="Configure site locations" />
        ),
      },
      {
        id: 'templates',
        label: 'Entity Templates',
        icon: <Files className="w-5 h-5" />,
        component: (
          <FlowPageContent title="Entity Templates" subtitle="Manage entity configurations" />
        ),
      },
      {
        id: 'modules',
        label: 'Modules',
        icon: <Boxes className="w-5 h-5" />,
        component: (
          <FlowPageContent title="Modules" subtitle="Configure system modules" />
        ),
      },
    ],
  },
]

const userMenuItems = [
  { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', destructive: true, separator: true },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof AppLayoutShell> = {
  title: 'Flow/Dashboard',
  component: AppLayoutShell,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`
# Flow EHS Dashboard

A complete EHS (Environment, Health & Safety) application built using the **AppLayoutShell** and **EHSAnalyticsDashboard** components.

## Features
- **Dashboard**: Advanced analytics with KPIs, sparklines, status zones, and edit mode
- **Workflow Steps**: Manage and track workflow progress
- **Report Incident**: Track and resolve safety incidents with full DataTable
- **Configuration**: Users, Roles, Dictionaries, Locations, Templates, Modules

## Architecture
Flow-specific component hierarchy:
1. **Primitives**: Button, Card, DataTable, etc.
2. **AppLayoutShell**: Handles layout, navigation, responsive behavior
3. **EHSAnalyticsDashboard**: Advanced dashboard with KPI cards, breakdown charts, trending, heatmaps, and edit mode
        `),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AppLayoutShell>

// =============================================================================
// FLOW APP WRAPPER (Standard component for all Flow stories)
// =============================================================================

type FlowNavItem = 'myFlow' | 'steps' | 'incidents' | 'more'

// Map FlowMobileNav items to sidebar page IDs
const FLOW_NAV_MAP: Record<FlowNavItem, string> = {
  myFlow: 'dashboard',
  steps: 'workflow',
  incidents: 'incidents',
  more: 'configuration',
}

// Reverse map: page ID to FlowMobileNav item
const PAGE_TO_NAV: Record<string, FlowNavItem> = {
  dashboard: 'myFlow',
  workflow: 'steps',
  incidents: 'incidents',
  configuration: 'more',
  // Child pages map to parent nav items
  users: 'more',
  roles: 'more',
  dictionaries: 'more',
  templates: 'more',
  locations: 'more',
  assets: 'more',
}

interface FlowAppProps {
  /** Initial page to display */
  initialPage?: FlowNavItem
  /** Initial Configuration sub-page (for starting on users, dictionaries, etc.) */
  initialConfigPage?: string | null
}

// More menu items from Configuration children (for FlowMobileNav)
const moreMenuItems: MoreMenuItem[] = [
  { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
  { id: 'dictionaries', label: 'Dictionaries', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'locations', label: 'Locations', icon: <MapPin className="w-5 h-5" /> },
  { id: 'templates', label: 'Entity Templates', icon: <Files className="w-5 h-5" /> },
  { id: 'modules', label: 'Modules', icon: <Boxes className="w-5 h-5" /> },
]

/**
 * FlowApp - Standard Flow EHS application wrapper
 *
 * Features:
 * - AppLayoutShell with Flow product config
 * - FlowMobileNav on mobile (big red incident button in center)
 * - Incident reporting flow triggered from mobile nav
 * - "More" button opens sheet with Configuration submenu
 * - Desktop uses standard sidebar navigation
 *
 * This is THE standard way to render Flow EHS in stories and production.
 */
function FlowApp({ initialPage = 'myFlow', initialConfigPage = null }: FlowAppProps) {
  const [activeNavItem, setActiveNavItem] = useState<FlowNavItem>(initialPage)
  const [reportingOpen, setReportingOpen] = useState(false)
  // Track current page ID for Configuration children
  const [currentConfigPage, setCurrentConfigPage] = useState<string | null>(initialConfigPage)

  // Handle navigation from sidebar (desktop) or page changes
  const handlePageChange = (pageId: string) => {
    const navItem = PAGE_TO_NAV[pageId]
    if (navItem) {
      setActiveNavItem(navItem)
      // Reset config page when navigating away from "more"
      if (navItem !== 'more') setCurrentConfigPage(null)
    }
  }

  // Create menu items with click handlers
  const moreMenuItemsWithHandlers: MoreMenuItem[] = moreMenuItems.map((item) => ({
    ...item,
    onClick: () => {
      setCurrentConfigPage(item.id)
      setActiveNavItem('more')
      // Also update the sidebar to show the correct page
      handlePageChange(item.id)
    },
  }))

  // Determine which page to show
  const effectivePageId = currentConfigPage || FLOW_NAV_MAP[activeNavItem]

  return (
    <>
      <AppLayoutShell
        product="flow"
        navItems={flowNavItems}
        currentPageId={effectivePageId}
        onPageChange={handlePageChange}
        user={{
          name: 'Sarah Chen',
          email: 'sarah.chen@safetycompany.com',
        }}
        userMenuItems={userMenuItems}
        notificationCount={4}
        showHelpItem={true}
        footerVariant="wave-only"
        onNotificationClick={() => alert('Opening notifications...')}
        onMenuItemClick={(item) => {
          if (item.id === 'logout') {
            alert('Logging out...')
          } else {
            alert(`Navigating to ${item.label}`)
          }
        }}
        // FlowMobileNav: Standard mobile navigation for Flow EHS
        // - My Flow | Steps | [BIG RED BUTTON] | Incidents | More
        // - Center button opens incident reporting (Fitts' Law)
        // - "More" button opens sheet with Configuration options
        customMobileNav={
          <FlowMobileNav
            activeItem={activeNavItem}
            onNavigate={(item) => {
              setActiveNavItem(item)
              setCurrentConfigPage(null)
            }}
            onQuickAction={() => setReportingOpen(true)}
            moreMenuItems={moreMenuItemsWithHandlers}
            moreMenuTitle="Configuration"
          />
        }
      />

      {/* Incident Reporting Flow (triggered from FlowMobileNav center button) */}
      <IncidentReportingFlow
        open={reportingOpen}
        onOpenChange={setReportingOpen}
        locations={locationOptions}
        onSubmit={async (formData) => {
          console.log('Incident submitted:', formData)
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setReportingOpen(false)
        }}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete Flow EHS application with FlowMobileNav on mobile.
 * The big red incident reporting button is always available in the mobile nav.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Flow EHS Application**

Features:
- **Desktop**: Standard sidebar navigation
- **Mobile**: FlowMobileNav with incident reporting button in center
- **Responsive**: Automatically switches between desktop/mobile layouts

The mobile navigation follows **Fitts' Law** - the most important action (Report Incident) is the largest, most colorful, centrally positioned button.`,
      },
    },
  },
  render: () => <FlowApp initialPage="myFlow" />,
}

/**
 * Mobile PWA in iPhone frame - uses iframe for real CSS media queries
 * Shows Safari browser chrome since this is a PWA, not a native app
 */
export const Mobile: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile Experience in iPhone Frame with Safari Browser**

Uses an actual iframe at device dimensions, so CSS media queries trigger correctly.
The app properly shows mobile layout with FlowMobileNav.

**Features:**
- Real 440×956 viewport (iPhone 16 Pro Max)
- Safari iOS browser chrome (address bar + bottom toolbar)
- CSS media queries work correctly
- FlowMobileNav at bottom (within browser content area)
- No footer (per UX best practices)`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--default"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app"
      />
    </div>
  ),
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <FlowApp initialPage="myFlow" />,
}

/**
 * Start on workflow page
 */
export const WorkflowPage: Story = {
  render: () => <FlowApp initialPage="steps" />,
}

/**
 * Start on incidents page with Incident Management Table
 */
export const IncidentsTab: Story = {
  render: () => <FlowApp initialPage="incidents" />,
}

/**
 * Mobile Incidents Page - Shows DataTableMobileCard in action
 *
 * Demonstrates the table-row-to-card transformation:
 * - Left priority borders (critical/high/medium/low/none/draft)
 * - Status badges and severity indicators
 * - Age with overdue styling
 * - Action buttons (NextStepButton or Submit/Edit/Delete for drafts)
 */
export const MobileIncidents: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile Incidents Table as Cards**

Demonstrates the \`DataTableMobileCard\` component styled to look like table rows transformed into cards.

**Features:**
- Left border indicates priority (Critical=red, High=orange, Medium=yellow, Low=green, None=blue, Draft=dashed)
- Status badge in header row
- Fields displayed in 2-column grid with uppercase labels (matching table headers)
- Actions section with severity-colored NextStepButton or draft actions
- Touch-optimized 44px targets
- Proper keyboard accessibility`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--incidents-page"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app/incidents"
      />
    </div>
  ),
}

/**
 * User Management Configuration Page
 *
 * Full-featured user management with:
 * - Users and Roles tabs
 * - Search, filters, and quick status filters
 * - Bulk operations bar
 * - User CRUD dialogs
 * - Role assignment with location scoping
 * - Activity timeline sheet
 */
export const UserManagement: Story = {
  parameters: {
    docs: {
      description: {
        story: `**User Management Configuration**

Enterprise user management for Flow EHS with RBAC:
- **Users Tab**: Stats cards, data table, search/filters, bulk operations
- **Roles Tab**: Role definitions grid with permission display
- **Role Assignment**: Location-based permission scoping
- **Activity Timeline**: User activity history in slide-over sheet

Navigate to Configuration > User Management in the sidebar.`,
      },
    },
  },
  render: () => <FlowApp initialPage="more" initialConfigPage="users" />,
}

/**
 * Roles Tab Direct - Direct view of the enhanced Roles & Permissions UI
 *
 * Use this story to test the new Roles functionality without navigation.
 */
export const RolesTabDirect: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Enhanced Roles & Permissions UI**

Direct view of the enhanced Roles tab with all new features:
- **Bitmasks hidden by default** - Toggle "Dev Mode" in dialogs to see them
- **Resource-level summaries** - Shows permission counts per resource
- **Filter dropdown** - All Types / System / Custom
- **Create Role button** - Opens CreateRoleDialog
- **View/Edit/Delete actions** - In each role card footer
- **System badge** - Yellow badge for protected roles`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-page p-6">
      <UsersPage
        users={mockUsers}
        roles={mockRoles}
        locations={mockLocationTree}
        departments={mockDepartments}
        jobTitles={mockJobTitles}
        stats={mockUserStats}
        onUserCreate={async (data) => {
          console.log('Creating user:', data)
          alert(`User "${data.firstName} ${data.lastName}" created!`)
        }}
        onUserUpdate={async (data) => {
          console.log('Updating user:', data)
          alert(`User "${data.firstName} ${data.lastName}" updated!`)
        }}
        onUserDelete={async (userId) => {
          console.log('Deleting user:', userId)
          alert(`User deleted!`)
        }}
        onRoleAssign={async (userId, data) => {
          console.log('Assigning role:', { userId, data })
          alert(`Role assigned!`)
        }}
        onRoleAssignmentUpdate={async (assignmentId, scopes) => {
          console.log('Updating role assignment:', { assignmentId, scopes })
          alert(`Role assignment updated!`)
        }}
        onRoleAssignmentRemove={async (assignmentId) => {
          console.log('Removing role assignment:', assignmentId)
          alert(`Role assignment removed!`)
        }}
        onBulkAction={async (payload) => {
          console.log('Bulk action:', payload)
          alert(`Bulk action "${payload.action}" performed on ${payload.userIds.length} users!`)
        }}
        onFetchUserActivity={async (userId) => {
          console.log('Fetching activity for user:', userId)
          return mockUserActivities.filter(a => a.userId === userId)
        }}
        availablePermissions={mockEnhancedPermissions}
        onRoleCreate={async (data) => {
          console.log('Creating role:', data)
          alert(`Role "${data.name}" created with ${data.permissions.length} permissions!`)
        }}
        onRoleUpdate={async (data) => {
          console.log('Updating role:', data)
          alert(`Role "${data.name}" updated with ${data.permissions.length} permissions!`)
        }}
        onRoleDelete={async (roleId) => {
          console.log('Deleting role:', roleId)
          alert(`Role deleted!`)
        }}
      />
    </div>
  ),
}

/**
 * Mobile User Management - Shows responsive user table as cards
 */
export const MobileUserManagement: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile User Management**

User management optimized for mobile devices:
- Stats cards in 2-column grid
- User list as touch-friendly cards
- Bottom sheet for bulk actions
- Swipe gestures for row actions`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="flow-dashboard--user-management"
        scale={0.7}
        showBrowser
        browserUrl="flow.disrupt.app/settings/users"
      />
    </div>
  ),
}
