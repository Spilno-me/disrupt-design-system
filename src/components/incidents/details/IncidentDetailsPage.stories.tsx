import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { IncidentDetailsPage } from './IncidentDetailsPage'
import type { IncidentDetail, EvidenceDocument, DocumentUserContext } from './types'

// =============================================================================
// MOCK DATA
// =============================================================================

// Mock evidence documents
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
    description: 'Photo of the chemical spill near loading dock',
    tags: ['scene', 'photo', 'evidence'],
  },
  {
    id: 'doc-2',
    name: 'Incident_Scene_Photo_2.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 1843200,
    url: '/documents/doc-2.jpg',
    thumbnailUrl: '/thumbnails/doc-2.jpg',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-10-28T10:30:00Z',
    uploadedByRole: 'investigator',
    visibility: 'all',
    description: 'Secondary angle of the incident area',
    tags: ['scene', 'photo'],
  },
  {
    id: 'doc-3',
    name: 'Safety_Data_Sheet.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 524288,
    url: '/documents/doc-3.pdf',
    uploadedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    uploadedAt: '2025-10-29T14:15:00Z',
    uploadedByRole: 'reviewer',
    visibility: 'investigator',
    description: 'Material safety data sheet for the spilled chemical',
    tags: ['sds', 'chemical', 'reference'],
  },
  {
    id: 'doc-4',
    name: 'Witness_Statement_1.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 102400,
    url: '/documents/doc-4.pdf',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-10-30T09:00:00Z',
    uploadedByRole: 'investigator',
    visibility: 'reviewer',
    description: 'Statement from warehouse employee who first reported the spill',
    tags: ['witness', 'statement'],
  },
  {
    id: 'doc-5',
    name: 'CCTV_Footage_Clip.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    size: 15728640,
    url: '/documents/doc-5.mp4',
    thumbnailUrl: '/thumbnails/doc-5.jpg',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-10-31T11:20:00Z',
    uploadedByRole: 'investigator',
    visibility: 'investigator',
    description: 'Security camera footage showing the incident',
    tags: ['video', 'cctv', 'evidence'],
  },
  {
    id: 'doc-6',
    name: 'Initial_Report_Form.pdf',
    type: 'form',
    mimeType: 'application/pdf',
    size: 256000,
    url: '/documents/doc-6.pdf',
    uploadedBy: { id: 'user-1', name: 'Patricia Davis', email: 'patricia.davis@company.com' },
    uploadedAt: '2025-10-27T08:45:00Z',
    uploadedByRole: 'reporter',
    visibility: 'all',
    description: 'Initial incident report form submitted by reporter',
    tags: ['form', 'initial', 'report'],
  },
  {
    id: 'doc-7',
    name: 'Area_Map_Annotated.png',
    type: 'image',
    mimeType: 'image/png',
    size: 819200,
    url: '/documents/doc-7.png',
    thumbnailUrl: '/thumbnails/doc-7.png',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-11-01T16:00:00Z',
    uploadedByRole: 'investigator',
    visibility: 'all',
    description: 'Facility map with incident location marked',
    tags: ['map', 'location'],
  },
  {
    id: 'doc-8',
    name: 'Environmental_Assessment.docx',
    type: 'document',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 307200,
    url: '/documents/doc-8.docx',
    uploadedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    uploadedAt: '2025-11-05T10:30:00Z',
    uploadedByRole: 'reviewer',
    visibility: 'reviewer',
    description: 'Environmental impact assessment report',
    tags: ['assessment', 'environmental'],
  },
  {
    id: 'doc-9',
    name: 'Cleanup_Photos.zip',
    type: 'other',
    mimeType: 'application/zip',
    size: 52428800,
    url: '/documents/doc-9.zip',
    uploadedBy: { id: 'user-2', name: 'John Smith', email: 'john.smith@company.com' },
    uploadedAt: '2025-11-08T14:00:00Z',
    uploadedByRole: 'investigator',
    visibility: 'all',
    description: 'Collection of photos documenting cleanup process',
    tags: ['cleanup', 'photos', 'archive'],
  },
  {
    id: 'doc-10',
    name: 'Corrective_Actions_Plan.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 409600,
    url: '/documents/doc-10.pdf',
    uploadedBy: { id: 'user-3', name: 'Oleksii Orlov', email: 'oleksii.orlov@company.com' },
    uploadedAt: '2025-11-11T12:35:00Z',
    uploadedByRole: 'reviewer',
    visibility: 'all',
    description: 'Proposed corrective actions to prevent future incidents',
    tags: ['plan', 'corrective', 'actions'],
  },
]

// Mock user context (investigator role - can see most documents)
const mockUserContext: DocumentUserContext = {
  userId: 'user-2',
  userName: 'John Smith',
  role: 'investigator',
  isReporter: false,
  isAssigned: true,
}

// Reporter user context (limited view)
const reporterUserContext: DocumentUserContext = {
  userId: 'user-1',
  userName: 'Patricia Davis',
  role: 'reporter',
  isReporter: true,
  isAssigned: false,
}

// Reviewer user context (full access)
const reviewerUserContext: DocumentUserContext = {
  userId: 'user-3',
  userName: 'Oleksii Orlov',
  role: 'reviewer',
  isReporter: false,
  isAssigned: true,
}

const mockIncident: IncidentDetail = {
  id: '1',
  incidentId: 'INC-51634456533',
  title: 'Chemical Spill reported near Loading Dock and this is long description where lots of text can be placed',
  description: `Maintenance personnel observed that unusual odor was present near loading dock, assumption that this was caused by a "Lard Monster" emerging from the deep of the swamp. But of course RCA should be performed at this point to be sure that the workers who saw it were not hallucinating from fumes of DSL chemical, which is odorless and is coming out of the chemical pool near by. Further investigation is needed to determine the root cause and prevent future incidents. The area has been cordoned off and appropriate safety measures have been implemented.`,
  status: 'review',
  severity: 'high',
  type: 'chemical',
  location: {
    id: 'loc-1',
    name: 'Loading Dock - East',
    facility: 'Main Warehouse',
    facilityId: 'fac-1',
    coordinates: {
      lat: 49.8397,
      lng: 24.0297,
    },
    what3words: '///appealing.concluded.mugs',
  },
  reporter: {
    id: 'user-1',
    name: 'Patricia Davis',
    email: 'patricia.davis@company.com',
  },
  assignee: {
    id: 'user-2',
    name: 'John Smith',
    email: 'john.smith@company.com',
  },
  createdAt: '2025-02-11T12:26:00Z',
  updatedAt: '2025-11-11T12:35:00Z',
  stepsTotal: 2,
  stepsCompleted: 0,
  documentsCount: 2,
  daysOpen: 1,
  reference: 'INC-51634456533',
  workflows: [
    {
      id: 'wf-1',
      name: 'Initial Assessment',
      status: 'completed',
      lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov' },
      lastUpdatedAt: '2025-11-11T12:35:00Z',
    },
    {
      id: 'wf-2',
      name: 'Root Cause Analysis',
      status: 'in_progress',
      lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov' },
      lastUpdatedAt: '2025-11-11T12:35:00Z',
    },
    {
      id: 'wf-3',
      name: 'Corrective Actions',
      status: 'pending',
      lastUpdatedBy: { id: 'user-3', name: 'Oleksii Orlov' },
      lastUpdatedAt: '2025-11-11T12:35:00Z',
    },
  ],
  formSubmissions: [
    {
      id: 'fs-1',
      formName: 'Initial Incident Report',
      submittedBy: { id: 'user-1', name: 'Patricia Davis' },
      submittedAt: '2025-02-11T12:30:00Z',
      status: 'approved',
    },
    {
      id: 'fs-2',
      formName: 'Environmental Impact Assessment',
      submittedBy: { id: 'user-3', name: 'Oleksii Orlov' },
      submittedAt: '2025-11-11T12:35:00Z',
      status: 'pending',
    },
  ],
  activities: [
    {
      id: 'act-1',
      type: 'status_change',
      description: 'Status changed from Reported to Review',
      user: { id: 'user-2', name: 'John Smith' },
      timestamp: '2025-11-10T09:00:00Z',
    },
    {
      id: 'act-2',
      type: 'comment',
      description: 'Initial assessment completed. Proceeding with RCA.',
      user: { id: 'user-3', name: 'Oleksii Orlov' },
      timestamp: '2025-11-11T10:30:00Z',
    },
    {
      id: 'act-3',
      type: 'document_upload',
      description: 'Uploaded photos from the incident scene',
      user: { id: 'user-1', name: 'Patricia Davis' },
      timestamp: '2025-02-11T12:45:00Z',
    },
  ],
}

// Critical severity variant
const mockCriticalIncident: IncidentDetail = {
  ...mockIncident,
  id: '2',
  incidentId: 'INC-51634456534',
  title: 'Fire detected in Storage Area B - Immediate evacuation required',
  status: 'investigation',
  severity: 'critical',
  type: 'fire',
  stepsTotal: 5,
  stepsCompleted: 1,
  daysOpen: 0,
}

// Low severity variant
const mockLowIncident: IncidentDetail = {
  ...mockIncident,
  id: '3',
  incidentId: 'INC-51634456535',
  title: 'Minor equipment malfunction in break room',
  status: 'closed',
  severity: 'low',
  type: 'equipment',
  stepsTotal: 2,
  stepsCompleted: 2,
  daysOpen: 5,
}

// Draft incident
const mockDraftIncident: IncidentDetail = {
  ...mockIncident,
  id: '4',
  incidentId: 'INC-DRAFT-001',
  title: 'Near miss incident being documented',
  status: 'draft',
  severity: 'none',
  type: 'near_miss',
  stepsTotal: 0,
  stepsCompleted: 0,
  daysOpen: 0,
  workflows: [],
  formSubmissions: [],
  activities: [],
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof IncidentDetailsPage> = {
  title: 'Flow/IncidentDetailsPage',
  component: IncidentDetailsPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Full-featured incident details page for Flow EHS.

## Features
- **Breadcrumb navigation** - Navigate back to incidents list
- **Header** - Incident ID, description, stats (steps, documents, days open)
- **Tab navigation** - Overview, Steps (placeholder), Advisor (placeholder)
- **Overview cards** - Location with map, incident information, description
- **Accordion sections** - Workflows, Form Submissions, Activities

## Usage
\`\`\`tsx
import { IncidentDetailsPage } from '@dds/design-system/flow'

<IncidentDetailsPage
  incident={incidentData}
  onTabChange={(tab) => setActiveTab(tab)}
  onLocationClick={(id) => navigate(\`/locations/\${id}\`)}
  onFacilityClick={(id) => navigate(\`/facilities/\${id}\`)}
  onReporterClick={(id) => navigate(\`/users/\${id}\`)}
  onRefresh={() => refetch()}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['overview', 'steps', 'advisor'],
      description: 'Currently active tab',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading skeleton',
    },
  },
}

export default meta
type Story = StoryObj<typeof IncidentDetailsPage>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default incident details page showing a high-severity chemical spill incident.
 * Includes documents & evidence section with investigator role (can see most documents).
 */
export const Default: Story = {
  args: {
    incident: mockIncident,
    activeTab: 'overview',
    documents: mockDocuments,
    userContext: mockUserContext,
    onNavigate: (path) => console.log('Navigate:', path),
    // onRefresh intentionally omitted - button hidden when not provided
    onLocationClick: (id) => console.log('Location clicked:', id),
    onFacilityClick: (id) => console.log('Facility clicked:', id),
    onReporterClick: (id) => console.log('Reporter clicked:', id),
    onEdit: () => console.log('Edit clicked'),
    onDocumentUpload: async (files) => {
      console.log('Upload files:', files)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onDocumentDelete: async (ids) => {
      console.log('Delete documents:', ids)
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
    onDocumentDownload: (ids) => console.log('Download documents:', ids),
    onDocumentView: (doc) => console.log('View document:', doc),
  },
}

/**
 * Critical severity incident with fire type.
 */
export const CriticalSeverity: Story = {
  args: {
    ...Default.args,
    incident: mockCriticalIncident,
  },
}

/**
 * Low severity incident that has been closed.
 */
export const ClosedIncident: Story = {
  args: {
    ...Default.args,
    incident: mockLowIncident,
  },
}

/**
 * Draft incident with no workflows or activities.
 * Reporter can edit documents in draft mode.
 */
export const DraftIncident: Story = {
  args: {
    ...Default.args,
    incident: mockDraftIncident,
    userContext: reporterUserContext,
  },
}

/**
 * Reporter role viewing a submitted incident.
 * Limited document visibility - can only see 'all' and 'reporter' visibility documents.
 * Cannot edit documents after submission.
 */
export const ReporterView: Story = {
  args: {
    ...Default.args,
    userContext: reporterUserContext,
  },
}

/**
 * Reviewer role viewing an incident.
 * Full document visibility - can see all documents including 'reviewer' visibility.
 * Can edit documents as assigned reviewer.
 */
export const ReviewerView: Story = {
  args: {
    ...Default.args,
    userContext: reviewerUserContext,
  },
}

/**
 * Loading state with skeleton.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}

/**
 * Steps tab view (placeholder).
 */
export const StepsTab: Story = {
  args: {
    ...Default.args,
    activeTab: 'steps',
  },
}

/**
 * Advisor tab view (placeholder).
 */
export const AdvisorTab: Story = {
  args: {
    ...Default.args,
    activeTab: 'advisor',
  },
}

/**
 * Incident without coordinates (static map preview).
 */
export const NoCoordinates: Story = {
  args: {
    ...Default.args,
    incident: {
      ...mockIncident,
      location: {
        ...mockIncident.location,
        coordinates: undefined,
      },
    },
  },
}

/**
 * Incident with all sections expanded.
 */
export const ExpandedAccordions: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-page p-6">
        <Story />
      </div>
    ),
  ],
}

/**
 * Dark mode preview.
 */
export const DarkMode: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark min-h-screen bg-page p-6">
        <Story />
      </div>
    ),
  ],
}

// =============================================================================
// COMPACT LAYOUT STORIES
// =============================================================================

/**
 * Compact 2-column layout - saves ~30% vertical space.
 *
 * Key differences from default 3-column layout:
 * - Removes duplicate Reference ID (shown in header already)
 * - Combines Incident Info + Description into single card
 * - Location becomes a narrower right sidebar
 * - Denser metadata grid (4 columns on desktop)
 */
export const CompactLayout: Story = {
  args: {
    ...Default.args,
    compactLayout: true,
  },
}

/**
 * Compact layout with critical severity incident.
 */
export const CompactLayoutCritical: Story = {
  args: {
    ...Default.args,
    incident: mockCriticalIncident,
    compactLayout: true,
  },
}

/**
 * Compact layout in dark mode.
 */
export const CompactLayoutDarkMode: Story = {
  args: {
    ...Default.args,
    compactLayout: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark min-h-screen bg-page p-6">
        <Story />
      </div>
    ),
  ],
}

/**
 * Side-by-side comparison of original vs compact layout.
 * Demonstrates the ~30% vertical space savings.
 */
export const LayoutComparison: Story = {
  render: function LayoutComparisonRender() {
    const [compactLayout, setCompactLayout] = React.useState(false)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-default">
          <span className="text-sm font-medium text-primary">Layout:</span>
          <button
            onClick={() => setCompactLayout(false)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              !compactLayout
                ? 'bg-accent text-white'
                : 'bg-muted-bg text-secondary hover:bg-subtle'
            }`}
          >
            Original (3-column)
          </button>
          <button
            onClick={() => setCompactLayout(true)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              compactLayout
                ? 'bg-accent text-white'
                : 'bg-muted-bg text-secondary hover:bg-subtle'
            }`}
          >
            Compact (2-column)
          </button>
        </div>
        <IncidentDetailsPage
          incident={mockIncident}
          compactLayout={compactLayout}
          documents={mockDocuments}
          userContext={mockUserContext}
          onNavigate={(path) => console.log('Navigate:', path)}
          onLocationClick={(id) => console.log('Location clicked:', id)}
          onFacilityClick={(id) => console.log('Facility clicked:', id)}
          onReporterClick={(id) => console.log('Reporter clicked:', id)}
        />
      </div>
    )
  },
}
