/**
 * Mock data for Corrective Actions UI
 *
 * Provides realistic test data for all component states
 */

import type {
  CorrectiveAction,
  UserReference,
  LocationReference,
  DepartmentReference,
  DictionaryReference,
  EvidenceFile,
  TimelineEvent,
} from '../components/corrective-actions/types'

// =============================================================================
// REFERENCE DATA
// =============================================================================

export const mockUsers: UserReference[] = [
  { id: 'user-1', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@company.com', avatarUrl: undefined },
  { id: 'user-2', firstName: 'Marcus', lastName: 'Johnson', email: 'marcus.johnson@company.com', avatarUrl: undefined },
  { id: 'user-3', firstName: 'Elena', lastName: 'Rodriguez', email: 'elena.rodriguez@company.com', avatarUrl: undefined },
  { id: 'user-4', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@company.com', avatarUrl: undefined },
  { id: 'user-5', firstName: 'Aisha', lastName: 'Patel', email: 'aisha.patel@company.com', avatarUrl: undefined },
]

export const mockLocations: LocationReference[] = [
  { id: 'loc-1', name: 'Main Office', code: 'MAIN-01' },
  { id: 'loc-2', name: 'Warehouse A', code: 'WH-A' },
  { id: 'loc-3', name: 'Manufacturing Plant', code: 'MFG-01' },
  { id: 'loc-4', name: 'Distribution Center', code: 'DC-01' },
  { id: 'loc-5', name: 'Research Lab', code: 'LAB-01' },
]

export const mockDepartments: DepartmentReference[] = [
  { id: 'dept-1', name: 'Safety & Compliance', code: 'SAFETY' },
  { id: 'dept-2', name: 'Operations', code: 'OPS' },
  { id: 'dept-3', name: 'Quality Assurance', code: 'QA' },
  { id: 'dept-4', name: 'Maintenance', code: 'MAINT' },
  { id: 'dept-5', name: 'Human Resources', code: 'HR' },
]

export const mockActionTypes: DictionaryReference[] = [
  { id: 'at-1', name: 'Corrective', code: 'CORRECTIVE', value: 'corrective' },
  { id: 'at-2', name: 'Preventive', code: 'PREVENTIVE', value: 'preventive' },
]

export const mockCategories: DictionaryReference[] = [
  { id: 'cat-1', name: 'Equipment Failure', code: 'EQUIPMENT' },
  { id: 'cat-2', name: 'Process Deviation', code: 'PROCESS' },
  { id: 'cat-3', name: 'Safety Hazard', code: 'SAFETY' },
  { id: 'cat-4', name: 'Quality Issue', code: 'QUALITY' },
  { id: 'cat-5', name: 'Environmental', code: 'ENVIRONMENTAL' },
  { id: 'cat-6', name: 'Training Gap', code: 'TRAINING' },
]

export const mockSourceTypes: DictionaryReference[] = [
  { id: 'src-1', name: 'Incident Report', code: 'INCIDENT' },
  { id: 'src-2', name: 'Internal Audit', code: 'AUDIT' },
  { id: 'src-3', name: 'Customer Complaint', code: 'CUSTOMER' },
  { id: 'src-4', name: 'Observation', code: 'OBSERVATION' },
  { id: 'src-5', name: 'Management Review', code: 'MGMT_REVIEW' },
]

export const mockRootCauseCategories: DictionaryReference[] = [
  { id: 'rc-1', name: 'Human Error', code: 'HUMAN_ERROR' },
  { id: 'rc-2', name: 'Equipment Malfunction', code: 'EQUIPMENT' },
  { id: 'rc-3', name: 'Process Design', code: 'PROCESS' },
  { id: 'rc-4', name: 'Inadequate Training', code: 'TRAINING' },
  { id: 'rc-5', name: 'Environmental Conditions', code: 'ENVIRONMENT' },
]

// =============================================================================
// CORRECTIVE ACTIONS
// =============================================================================

const now = new Date()
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

export const mockCorrectiveActions: CorrectiveAction[] = [
  // URGENT - Overdue
  {
    id: 'ca-001',
    referenceNumber: 'CA-2025-001',
    title: 'Replace faulty emergency exit lighting in Warehouse A',
    description: 'Emergency exit signs in Section B of Warehouse A are not illuminating properly. This poses a significant safety risk during power outages. Immediate replacement required.',
    status: 'in-progress',
    priority: 'urgent',
    actionType: mockActionTypes[0],
    category: mockCategories[2],
    sourceType: mockSourceTypes[0],
    sourceReferenceNumber: 'INC-2025-0042',
    actionOwner: mockUsers[1],
    responsibleDepartment: mockDepartments[3],
    location: mockLocations[1],
    specificLocationDetails: 'Section B, Emergency exits 3-7',
    assignedDate: daysAgo(10),
    dueDate: daysAgo(2),
    rootCauseCategory: mockRootCauseCategories[1],
    rootCauseAnalysis: 'LED drivers in exit signs have exceeded their operational lifespan. Procurement records show these units were installed 8 years ago.',
    implementationPlan: '1. Order replacement LED exit sign units (qty: 5)\n2. Schedule installation during low-traffic hours\n3. Test all units after installation\n4. Update maintenance schedule for future inspections',
    verificationMethod: 'Visual inspection and power-off test to verify illumination',
    successCriteria: 'All emergency exit signs illuminate properly during simulated power outage',
    estimatedCost: 2500,
    createdAt: daysAgo(12),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(1),
    updatedBy: mockUsers[1],
  },
  // HIGH - Due today
  {
    id: 'ca-002',
    referenceNumber: 'CA-2025-002',
    title: 'Update chemical handling procedures for new solvent',
    description: 'New cleaning solvent introduced to manufacturing process requires updated handling procedures and PPE requirements.',
    status: 'pending-approval',
    priority: 'high',
    actionType: mockActionTypes[1],
    category: mockCategories[1],
    sourceType: mockSourceTypes[1],
    sourceReferenceNumber: 'AUD-2025-Q1-003',
    actionOwner: mockUsers[2],
    responsibleDepartment: mockDepartments[0],
    location: mockLocations[2],
    assignedDate: daysAgo(14),
    dueDate: now,
    rootCauseCategory: mockRootCauseCategories[2],
    implementationPlan: '1. Review SDS for new solvent\n2. Draft updated procedures\n3. Procure required PPE\n4. Conduct training sessions',
    verificationMethod: 'Employee competency assessment and procedure review',
    successCriteria: 'All affected employees trained and signed off on new procedures',
    estimatedCost: 1200,
    completionNotes: 'Procedures drafted and reviewed by safety committee. Awaiting final approval.',
    completionEvidence: [
      { id: 'ev-1', fileName: 'updated_procedures_v2.pdf', fileUrl: '/files/ev-1.pdf', fileType: 'application/pdf', uploadedAt: daysAgo(2) },
      { id: 'ev-2', fileName: 'training_roster.xlsx', fileUrl: '/files/ev-2.xlsx', fileType: 'application/xlsx', uploadedAt: daysAgo(1) },
    ],
    createdAt: daysAgo(14),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(1),
    updatedBy: mockUsers[2],
  },
  // MEDIUM - Future
  {
    id: 'ca-003',
    referenceNumber: 'CA-2025-003',
    title: 'Install additional safety barriers around loading dock',
    description: 'Recent near-miss incident highlighted need for additional physical barriers to separate pedestrian walkways from forklift traffic zones.',
    status: 'assigned',
    priority: 'medium',
    actionType: mockActionTypes[0],
    category: mockCategories[2],
    sourceType: mockSourceTypes[3],
    sourceReferenceNumber: 'OBS-2025-0089',
    actionOwner: mockUsers[3],
    responsibleDepartment: mockDepartments[1],
    location: mockLocations[3],
    specificLocationDetails: 'Loading Dock B, Bays 4-8',
    assignedDate: daysAgo(3),
    dueDate: daysFromNow(14),
    implementationPlan: '1. Survey area and determine barrier placement\n2. Procure safety barriers and signage\n3. Install barriers during weekend shutdown\n4. Update floor markings',
    verificationMethod: 'Site inspection and traffic flow observation',
    successCriteria: 'Clear separation between pedestrian and forklift zones with visible barriers and signage',
    estimatedCost: 4500,
    createdAt: daysAgo(5),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(3),
    updatedBy: mockUsers[0],
  },
  // LOW - Completed
  {
    id: 'ca-004',
    referenceNumber: 'CA-2025-004',
    title: 'Update first aid kit contents in all buildings',
    description: 'Annual review identified expired items in multiple first aid kits across facilities.',
    status: 'completed',
    priority: 'low',
    actionType: mockActionTypes[1],
    category: mockCategories[2],
    sourceType: mockSourceTypes[4],
    actionOwner: mockUsers[4],
    responsibleDepartment: mockDepartments[0],
    location: mockLocations[0],
    assignedDate: daysAgo(21),
    dueDate: daysAgo(7),
    completedDate: daysAgo(9),
    implementationPlan: '1. Audit all first aid kits\n2. Order replacement supplies\n3. Replace expired items\n4. Update inspection logs',
    verificationMethod: 'Physical inventory check of all kits',
    successCriteria: 'All first aid kits contain current, unexpired supplies',
    estimatedCost: 800,
    completionNotes: 'All 24 first aid kits across 5 buildings have been audited and restocked. Created recurring calendar reminder for annual review.',
    completionEvidence: [
      { id: 'ev-3', fileName: 'firstaid_inventory_2025.xlsx', fileUrl: '/files/ev-3.xlsx', fileType: 'application/xlsx', uploadedAt: daysAgo(9) },
    ],
    effectivenessAssessment: 'effective',
    createdAt: daysAgo(25),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(9),
    updatedBy: mockUsers[4],
  },
  // Closed
  {
    id: 'ca-005',
    referenceNumber: 'CA-2025-005',
    title: 'Implement ergonomic workstation assessment program',
    description: 'Establish routine ergonomic assessments for office workstations to prevent repetitive strain injuries.',
    status: 'closed',
    priority: 'medium',
    actionType: mockActionTypes[1],
    category: mockCategories[5],
    sourceType: mockSourceTypes[2],
    actionOwner: mockUsers[0],
    responsibleDepartment: mockDepartments[4],
    location: mockLocations[0],
    assignedDate: daysAgo(45),
    dueDate: daysAgo(21),
    completedDate: daysAgo(23),
    closureDate: daysAgo(14),
    implementationPlan: '1. Research ergonomic assessment tools\n2. Train HR team on assessments\n3. Pilot program with one department\n4. Roll out company-wide',
    verificationMethod: 'Track RSI complaints before and after implementation',
    successCriteria: '50% reduction in ergonomic-related complaints within 6 months',
    estimatedCost: 3000,
    completionNotes: 'Program implemented successfully. 75 assessments completed in first month.',
    effectivenessAssessment: 'highly-effective',
    closureApproved: true,
    closureApprovedBy: mockUsers[0],
    closureComments: 'Excellent implementation. RSI complaints down 40% in first quarter.',
    createdAt: daysAgo(50),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(14),
    updatedBy: mockUsers[0],
  },
  // Deferred
  {
    id: 'ca-006',
    referenceNumber: 'CA-2025-006',
    title: 'Upgrade ventilation system in paint booth',
    description: 'Current ventilation does not meet updated air quality standards. Requires full system upgrade.',
    status: 'deferred',
    priority: 'high',
    actionType: mockActionTypes[0],
    category: mockCategories[4],
    sourceType: mockSourceTypes[1],
    sourceReferenceNumber: 'AUD-2025-Q1-007',
    actionOwner: mockUsers[1],
    responsibleDepartment: mockDepartments[3],
    location: mockLocations[2],
    specificLocationDetails: 'Paint Booth Area C',
    assignedDate: daysAgo(30),
    dueDate: daysAgo(5),
    implementationPlan: '1. Engineering assessment\n2. Vendor selection\n3. Installation\n4. Testing and certification',
    estimatedCost: 45000,
    deferredReason: 'Capital budget for this fiscal year has been allocated. Deferred to Q3 when additional funds will be available. Temporary mitigation measures in place.',
    createdAt: daysAgo(35),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(5),
    updatedBy: mockUsers[1],
  },
  // Extension requested
  {
    id: 'ca-007',
    referenceNumber: 'CA-2025-007',
    title: 'Conduct comprehensive electrical safety audit',
    description: 'Full electrical safety audit required following minor electrical incident. All panels and connections to be inspected.',
    status: 'in-progress',
    priority: 'high',
    actionType: mockActionTypes[0],
    category: mockCategories[0],
    sourceType: mockSourceTypes[0],
    sourceReferenceNumber: 'INC-2025-0051',
    actionOwner: mockUsers[3],
    responsibleDepartment: mockDepartments[3],
    location: mockLocations[2],
    assignedDate: daysAgo(20),
    dueDate: daysFromNow(3),
    rootCauseCategory: mockRootCauseCategories[1],
    implementationPlan: '1. Engage certified electrical contractor\n2. Systematic panel inspection\n3. Thermal imaging survey\n4. Documentation and reporting',
    verificationMethod: 'Certification report from licensed electrician',
    successCriteria: 'All electrical systems certified safe with no deficiencies',
    estimatedCost: 8500,
    extensionRequested: true,
    requestedDueDate: daysFromNow(17),
    extensionJustification: 'Original scope underestimated. Need additional 2 weeks to complete thermal imaging of all panels in manufacturing area.',
    createdAt: daysAgo(22),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(2),
    updatedBy: mockUsers[3],
  },
  // Recently created
  {
    id: 'ca-008',
    referenceNumber: 'CA-2025-008',
    title: 'Review and update lockout/tagout procedures',
    description: 'Annual review of LOTO procedures required. Last review was 14 months ago.',
    status: 'assigned',
    priority: 'medium',
    actionType: mockActionTypes[1],
    category: mockCategories[1],
    sourceType: mockSourceTypes[4],
    actionOwner: mockUsers[2],
    responsibleDepartment: mockDepartments[0],
    location: mockLocations[2],
    assignedDate: daysAgo(1),
    dueDate: daysFromNow(30),
    implementationPlan: '1. Review current procedures against OSHA standards\n2. Identify gaps\n3. Update documentation\n4. Retrain affected employees',
    verificationMethod: 'Procedure audit and employee competency verification',
    successCriteria: 'All LOTO procedures current and all employees retrained',
    estimatedCost: 500,
    createdAt: daysAgo(2),
    createdBy: mockUsers[0],
    updatedAt: daysAgo(1),
    updatedBy: mockUsers[0],
  },
]

// =============================================================================
// TIMELINE DATA
// =============================================================================

export const mockTimeline: Record<string, TimelineEvent[]> = {
  'ca-001': [
    { id: 'te-1', type: 'created', timestamp: daysAgo(12), user: mockUsers[0] },
    { id: 'te-2', type: 'assigned', timestamp: daysAgo(10), user: mockUsers[0], details: 'Assigned to Marcus Johnson' },
    { id: 'te-3', type: 'status_changed', timestamp: daysAgo(8), user: mockUsers[1], previousValue: 'assigned', newValue: 'in-progress' },
    { id: 'te-4', type: 'comment_added', timestamp: daysAgo(5), user: mockUsers[1], details: 'Parts ordered, awaiting delivery' },
    { id: 'te-5', type: 'comment_added', timestamp: daysAgo(1), user: mockUsers[1], details: 'Parts received, scheduling installation' },
  ],
  'ca-002': [
    { id: 'te-6', type: 'created', timestamp: daysAgo(14), user: mockUsers[0] },
    { id: 'te-7', type: 'assigned', timestamp: daysAgo(14), user: mockUsers[0], details: 'Assigned to Elena Rodriguez' },
    { id: 'te-8', type: 'status_changed', timestamp: daysAgo(10), user: mockUsers[2], previousValue: 'assigned', newValue: 'in-progress' },
    { id: 'te-9', type: 'evidence_uploaded', timestamp: daysAgo(2), user: mockUsers[2], details: 'Uploaded updated_procedures_v2.pdf' },
    { id: 'te-10', type: 'status_changed', timestamp: daysAgo(1), user: mockUsers[2], previousValue: 'in-progress', newValue: 'pending-approval' },
  ],
}

// =============================================================================
// FILTER OPTIONS
// =============================================================================

export const mockFilterOptions = {
  statuses: [
    { value: 'all', label: 'All Statuses' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'pending-approval', label: 'Pending Approval' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
    { value: 'deferred', label: 'Deferred' },
  ],
  priorities: [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ],
  assignees: [
    { value: 'all', label: 'All Assignees' },
    ...mockUsers.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
  ],
}
