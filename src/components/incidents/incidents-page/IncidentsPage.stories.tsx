/**
 * IncidentsPage Stories
 *
 * Stories for the Incidents page where users view and manage
 * environmental and safety incidents.
 *
 * NOTE: This story uses a simplified `Incident` type from `../../ui/table` for DataTable display,
 * which differs from the full API `Incident` type. The incident generation logic produces the
 * display-oriented format. Document/workflow/form data is UI-specific mock data for detail views.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { IncidentsPage } from './IncidentsPage'
import { getLocationSelectOptions } from '@/api'
import type { Incident } from '../../ui/table'
import type {
  IncidentDetail,
  EvidenceDocument,
  DocumentUserContext,
  DetailedWorkflow,
  ExtendedFormSubmission,
} from '../index'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof IncidentsPage> = {
  title: 'Flow/IncidentsPage',
  component: IncidentsPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Incidents Page displays environmental and safety incidents with full management capabilities.

## Features
- **Search & Filters**: Search by text, filter by severity and status
- **Quick Filters**: Drafts, Reported, Aging, Investigation, Reviews (Hick's Law)
- **Incident Table**: Full DataTable with pagination and bulk actions
- **Incident Details**: Click to view full incident details page
- **Actions**: Report new incident, Edit, Delete, Submit draft incidents
- **Mobile Support**: DataTableMobileCard transformation on mobile

## Usage
\`\`\`tsx
<IncidentsPage
  incidents={incidentData}
  locations={locationOptions}
  documents={mockDocuments}
  userContext={mockUserContext}
  convertToIncidentDetail={convertToIncidentDetail}
/>
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof IncidentsPage>

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
]

// =============================================================================
// MOCK DATA - Detailed Workflows
// =============================================================================

const mockDetailedWorkflows: DetailedWorkflow[] = [
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
]

// =============================================================================
// MOCK DATA - Location Options (from API seed)
// =============================================================================

const locationOptions = getLocationSelectOptions()

// =============================================================================
// MOCK DATA - Incidents
// =============================================================================

const incidentTitles = [
  'Chemical spill in storage area',
  'Slip and fall - wet floor',
  'Equipment malfunction - conveyor belt',
  'Fire alarm - false alarm',
  'Near miss - forklift incident',
  'Ergonomic hazard report',
  'PPE compliance issue',
  'Electrical hazard identified',
  'Air quality concern',
  'Noise exposure report',
  'Machine guarding deficiency',
  'Lockout/tagout violation',
  'Housekeeping hazard',
  'Emergency exit blocked',
  'First aid incident',
  'Vehicle collision - parking lot',
  'Burn injury - hot surface',
  'Ladder safety violation',
  'Material handling injury',
  'Environmental release',
  'Security breach',
  'Contractor safety violation',
  'Training documentation gap',
  'Maintenance request - safety',
  'Weather-related hazard',
  'Biological hazard report',
  'Radiation safety concern',
  'Confined space entry issue',
  'Fall protection violation',
  'Heat stress incident',
  'Cold stress incident',
  'Pressure vessel concern',
]

const locations = [
  'Warehouse A - Section 1',
  'Warehouse B - Section 4',
  'Production Floor - Building A',
  'Office Building - Floor 2',
  'Loading Dock - East Wing',
  'Chemical Storage - Area C',
  'Maintenance Shop',
  'Quality Control Lab',
  'Break Room - North',
  'Parking Lot B',
  'Assembly Line 3',
  'Utility Room 3B',
  'Conference Room 101',
  'Shipping Department',
  'Receiving Area',
  'Storage Room C',
  'Compressor Building',
  'Building Entrance',
]

const reporters = [
  'Patricia Davis', 'Sarah Connor', 'Mike Chen', 'Michael Johnson', 'John Martinez', 'Linda Smith',
  'Patricia Taylor', 'Robert Wilson', 'James Brown', 'Jennifer Garcia', 'David Miller', 'Maria Rodriguez',
]

const generateIncidents = (): Incident[] => {
  const incidents: Incident[] = []

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
// INCIDENT DATA CONVERTER
// =============================================================================

function convertToIncidentDetail(incident: Incident): IncidentDetail {
  const severityMap = {
    critical: 'critical' as const,
    high: 'high' as const,
    medium: 'medium' as const,
    low: 'low' as const,
    none: 'none' as const,
  }

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

  const generateWorkflows = (status: string): IncidentDetail['workflows'] => {
    const baseWorkflows = [
      { id: 'wf-1', name: 'Initial Assessment', status: 'completed' as const },
      { id: 'wf-2', name: 'Root Cause Analysis', status: 'in_progress' as const },
      { id: 'wf-3', name: 'Corrective Actions', status: 'pending' as const },
    ]

    if (status === 'draft') return []

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
// STORIES
// =============================================================================

/**
 * Default view showing all incidents
 */
export const Default: Story = {
  args: {
    incidents: incidentData,
    locations: locationOptions,
    documents: mockDocuments,
    userContext: mockUserContext,
    detailedWorkflows: mockDetailedWorkflows,
    extendedFormSubmissions: mockExtendedFormSubmissions,
    convertToIncidentDetail,
  },
}

/**
 * Empty state - no incidents
 */
export const EmptyState: Story = {
  args: {
    incidents: [],
    locations: locationOptions,
    documents: [],
    userContext: mockUserContext,
    convertToIncidentDetail,
  },
}

/**
 * Only draft incidents
 */
export const DraftsOnly: Story = {
  args: {
    incidents: incidentData.filter(i => i.status === 'draft'),
    locations: locationOptions,
    documents: mockDocuments,
    userContext: mockUserContext,
    convertToIncidentDetail,
  },
}

/**
 * Only overdue incidents
 */
export const OverdueOnly: Story = {
  args: {
    incidents: incidentData.filter(i => i.overdue),
    locations: locationOptions,
    documents: mockDocuments,
    userContext: mockUserContext,
    convertToIncidentDetail,
  },
}

/**
 * Few incidents for testing pagination
 */
export const FewIncidents: Story = {
  args: {
    incidents: incidentData.slice(0, 5),
    locations: locationOptions,
    documents: mockDocuments,
    userContext: mockUserContext,
    convertToIncidentDetail,
    defaultPageSize: 10,
  },
}

/**
 * Interactive with callbacks
 */
export const Interactive: Story = {
  args: {
    incidents: incidentData,
    locations: locationOptions,
    documents: mockDocuments,
    userContext: mockUserContext,
    detailedWorkflows: mockDetailedWorkflows,
    extendedFormSubmissions: mockExtendedFormSubmissions,
    convertToIncidentDetail,
    onIncidentSubmit: async (formData) => {
      console.log('Incident submitted:', formData)
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Incident "${formData.title}" submitted successfully!`)
    },
  },
}
