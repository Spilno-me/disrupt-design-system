import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
  StoryFlex,
} from '@/stories/_infrastructure'
import { ActivityTimeline, type TimelineActivity } from './ActivityTimeline'

// Simple action logger for storybook (no addon dependency)
const action = (name: string) => (...args: unknown[]) => console.log(`[Action] ${name}:`, ...args)

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof ActivityTimeline> = {
  title: 'Incidents/Details/ActivityTimeline',
  component: ActivityTimeline,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          `Activity log with timeline visualization for incident reporting.

**Features:**
- Date grouping (Today, Yesterday, X days ago)
- Timeline connector visualization
- Expandable notes/comments
- Search/filter functionality
- Export capability (CSV/JSON)
- Mobile responsive (44px touch targets)

**UX Laws Applied:**
- Miller's Law: Groups by date for cognitive chunking
- Gestalt Proximity: Timeline creates visual grouping
- Fitts' Law: Touch-friendly interactive elements

**Testing:** Use data-slot="activity-timeline", data-testid="activity-search-input", "activity-export-button"`
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ActivityTimeline>

// =============================================================================
// MOCK DATA - REALISTIC EHS INCIDENT WORKFLOW
// =============================================================================

const now = new Date()
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString()
const daysAgo = (days: number, hours = 0) => new Date(now.getTime() - (days * 24 + hours) * 60 * 60 * 1000).toISOString()

// =============================================================================
// TEAM MEMBERS (realistic EHS roles)
// =============================================================================

const TEAM = {
  reporter: { id: 'u1', name: 'Mike Rodriguez', email: 'mike.rodriguez@acme.com' },
  supervisor: { id: 'u2', name: 'Sarah Chen', email: 'sarah.chen@acme.com' },
  ehsManager: { id: 'u3', name: 'David Thompson', email: 'david.thompson@acme.com' },
  investigator: { id: 'u4', name: 'Jennifer Walsh', email: 'jennifer.walsh@acme.com' },
  safetyOfficer: { id: 'u5', name: 'Robert Kim', email: 'robert.kim@acme.com' },
  plantManager: { id: 'u6', name: 'Patricia Moore', email: 'patricia.moore@acme.com' },
  hrManager: { id: 'u7', name: 'James Wilson', email: 'james.wilson@acme.com' },
  system: { id: 'system', name: 'System', email: 'notifications@acme.com' },
}

// =============================================================================
// CHEMICAL SPILL INCIDENT - FULL LIFECYCLE (matches mockup design)
// =============================================================================

const mockActivities: TimelineActivity[] = [
  // TODAY - Current review phase
  {
    id: '1',
    type: 'status_change',
    title: 'Status changed to "Review" by EHS Manager',
    note: 'Awaiting final review and decision on corrective actions.',
    user: TEAM.ehsManager,
    timestamp: hoursAgo(2),
    metadata: { fromStatus: 'Investigation', toStatus: 'Review' },
  },
  {
    id: '2',
    type: 'document_upload',
    title: 'Status changed to "Review" by EHS Manager',
    note: 'Found DSL residue traces near chemical pool. No biological material confirmed. Uploaded photos & notes.',
    user: TEAM.investigator,
    timestamp: hoursAgo(4),
    metadata: { documentName: 'Site_Investigation_Report.pdf' },
  },

  // YESTERDAY - Investigation activities
  {
    id: '3',
    type: 'assignment',
    title: 'Status changed to "Review" by EHS Manager',
    user: TEAM.ehsManager,
    timestamp: daysAgo(1),
  },
  {
    id: '4',
    type: 'status_change',
    title: 'Status changed to "Review" by EHS Manager',
    note: 'Initiating full safety protocol. Area has been secured and initial assessment is underway.',
    user: TEAM.safetyOfficer,
    timestamp: daysAgo(1, 3),
    metadata: { fromStatus: 'Reported', toStatus: 'Investigation' },
  },

  // 2 DAYS AGO - Initial report
  {
    id: '5',
    type: 'status_change',
    title: 'Status changed to "Review" by EHS Manager',
    note: 'Initial report received from floor supervisor. Setting up investigation team.',
    user: TEAM.supervisor,
    timestamp: daysAgo(2),
    metadata: { fromStatus: 'Draft', toStatus: 'Reported' },
  },
]

// =============================================================================
// FULL INCIDENT LIFECYCLE - COMPREHENSIVE EHS WORKFLOW
// =============================================================================

const fullIncidentLifecycle: TimelineActivity[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TODAY - Final Review Phase
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'act-001',
    type: 'approval',
    title: 'Final CAPA plan approved by Plant Manager',
    note: 'All corrective actions approved. Implementation to begin immediately. Budget allocation confirmed for safety equipment upgrades.',
    user: TEAM.plantManager,
    timestamp: hoursAgo(1),
  },
  {
    id: 'act-002',
    type: 'comment',
    title: 'Added compliance verification note',
    note: 'OSHA 1910.120 requirements verified. Spill containment procedures align with EPA guidelines. Documentation ready for regulatory submission if required.',
    user: TEAM.ehsManager,
    timestamp: hoursAgo(3),
  },
  {
    id: 'act-003',
    type: 'workflow_update',
    title: 'CAPA implementation workflow started',
    note: 'Corrective Action Plan workflow initiated with 5 action items. Target completion: 14 days.',
    user: TEAM.ehsManager,
    timestamp: hoursAgo(4),
    metadata: { workflowName: 'CAPA-2024-0156' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // YESTERDAY - Review & Approval
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'act-004',
    type: 'status_change',
    title: 'Status changed to "Review"',
    note: 'Investigation complete. Root cause identified: Corroded valve seal on Tank C-7. Submitting for management review.',
    user: TEAM.investigator,
    timestamp: daysAgo(1, 2),
    metadata: { fromStatus: 'Investigation', toStatus: 'Review' },
  },
  {
    id: 'act-005',
    type: 'document_upload',
    title: 'Uploaded Root Cause Analysis report',
    note: 'RCA completed using 5-Why methodology. Contributing factors: inadequate preventive maintenance schedule, missing visual inspection protocol.',
    user: TEAM.investigator,
    timestamp: daysAgo(1, 4),
    metadata: { documentName: 'RCA_Report_INC-51634456533.pdf' },
  },
  {
    id: 'act-006',
    type: 'comment',
    title: 'HR notification confirmed',
    note: 'Affected employee (J. Martinez) medical evaluation completed. No exposure symptoms. Return to work cleared by occupational health.',
    user: TEAM.hrManager,
    timestamp: daysAgo(1, 6),
  },
  {
    id: 'act-007',
    type: 'document_upload',
    title: 'Uploaded witness statements',
    note: 'Collected statements from 3 witnesses present at time of incident. All statements consistent with initial report.',
    user: TEAM.investigator,
    timestamp: daysAgo(1, 8),
    metadata: { documentName: 'Witness_Statements_Compiled.pdf' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2 DAYS AGO - Investigation Phase
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'act-008',
    type: 'document_upload',
    title: 'Uploaded site inspection photos',
    note: 'Documented affected area, spill extent, containment measures, and equipment condition. 47 photos total.',
    user: TEAM.investigator,
    timestamp: daysAgo(2, 2),
    metadata: { documentName: 'Site_Photos_2024-01-15.zip' },
  },
  {
    id: 'act-009',
    type: 'comment',
    title: 'Environmental sampling completed',
    note: 'Air quality and soil samples collected from 6 locations around spill zone. Results expected within 48 hours from certified lab.',
    user: TEAM.safetyOfficer,
    timestamp: daysAgo(2, 4),
  },
  {
    id: 'act-010',
    type: 'workflow_update',
    title: 'Investigation checklist 60% complete',
    note: 'Timeline reconstruction done. Equipment inspection done. Pending: lab results, final RCA.',
    user: TEAM.investigator,
    timestamp: daysAgo(2, 6),
    metadata: { workflowName: 'INV-2024-0156' },
  },
  {
    id: 'act-011',
    type: 'comment',
    title: 'Spill containment verified',
    note: 'Confirmed ~15 gallons contained within secondary containment. No groundwater impact. Cleanup contractor (EnviroClean Inc.) scheduled for tomorrow.',
    user: TEAM.safetyOfficer,
    timestamp: daysAgo(2, 10),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3 DAYS AGO - Investigation Begins
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'act-012',
    type: 'assignment',
    title: 'Investigation assigned to Jennifer Walsh',
    note: 'Lead investigator assigned. Investigation team includes: R. Kim (Safety), M. Rodriguez (Operations witness).',
    user: TEAM.ehsManager,
    timestamp: daysAgo(3, 1),
  },
  {
    id: 'act-013',
    type: 'status_change',
    title: 'Status changed to "Investigation"',
    note: 'Formal investigation initiated per EHS-SOP-012. Target completion: 5 business days.',
    user: TEAM.ehsManager,
    timestamp: daysAgo(3, 2),
    metadata: { fromStatus: 'Reported', toStatus: 'Investigation' },
  },
  {
    id: 'act-014',
    type: 'approval',
    title: 'Initial response actions approved',
    note: 'Emergency response adequate. Area properly secured. PPE usage confirmed appropriate for chemical type.',
    user: TEAM.ehsManager,
    timestamp: daysAgo(3, 4),
  },
  {
    id: 'act-015',
    type: 'comment',
    title: 'Notification sent to regulatory contact',
    note: 'Per company policy, local fire department environmental unit notified of chemical release. No regulatory reporting threshold exceeded.',
    user: TEAM.ehsManager,
    timestamp: daysAgo(3, 6),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4 DAYS AGO - Initial Report & Triage
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'act-016',
    type: 'document_upload',
    title: 'Uploaded initial incident photos',
    note: 'First responder photos showing spill area and immediate containment measures taken.',
    user: TEAM.reporter,
    timestamp: daysAgo(4, 1),
    metadata: { documentName: 'Initial_Photos_Emergency.zip' },
  },
  {
    id: 'act-017',
    type: 'status_change',
    title: 'Status changed to "Reported"',
    note: 'Incident triaged as Medium severity. Chemical identified: Industrial degreaser (non-toxic, irritant). No injuries reported.',
    user: TEAM.supervisor,
    timestamp: daysAgo(4, 2),
    metadata: { fromStatus: 'Draft', toStatus: 'Reported' },
  },
  {
    id: 'act-018',
    type: 'comment',
    title: 'Email notification sent to EHS team',
    note: 'Automatic notification dispatched to: EHS Manager, Safety Officer, Plant Manager. Acknowledgment required within 4 hours.',
    user: TEAM.system,
    timestamp: daysAgo(4, 2),
  },
  {
    id: 'act-019',
    type: 'comment',
    title: 'Area secured and evacuated',
    note: 'Building C loading dock evacuated per emergency procedure. Perimeter established 50ft from spill. Ventilation increased.',
    user: TEAM.supervisor,
    timestamp: daysAgo(4, 3),
  },
  {
    id: 'act-020',
    type: 'status_change',
    title: 'Incident report created',
    note: 'Chemical spill observed at Loading Dock C during forklift operations. Estimated 15-20 gallons of industrial solvent released from damaged container.',
    user: TEAM.reporter,
    timestamp: daysAgo(4, 4),
    metadata: { fromStatus: '', toStatus: 'Draft' },
  },
]

// =============================================================================
// NEAR-MISS INCIDENT - QUICK RESOLUTION EXAMPLE
// =============================================================================

const nearMissActivities: TimelineActivity[] = [
  {
    id: 'nm-001',
    type: 'approval',
    title: 'Near-miss closed - no further action required',
    note: 'Toolbox talk conducted with team. Safety alert posted. Good catch recognition submitted for reporter.',
    user: TEAM.supervisor,
    timestamp: hoursAgo(2),
  },
  {
    id: 'nm-002',
    type: 'comment',
    title: 'Preventive measure implemented',
    note: 'Additional warning signage installed at pinch point location. Area lighting improved from 300 to 500 lux.',
    user: TEAM.safetyOfficer,
    timestamp: hoursAgo(6),
  },
  {
    id: 'nm-003',
    type: 'status_change',
    title: 'Status changed to "Review"',
    note: 'Quick assessment complete. No equipment damage. Recommending signage improvement as preventive measure.',
    user: TEAM.supervisor,
    timestamp: daysAgo(1, 2),
    metadata: { fromStatus: 'Reported', toStatus: 'Review' },
  },
  {
    id: 'nm-004',
    type: 'comment',
    title: 'Safety observation added',
    note: 'Employee nearly struck by swinging door in warehouse aisle B-7. No contact made. Employee was wearing required PPE.',
    user: TEAM.reporter,
    timestamp: daysAgo(1, 4),
  },
  {
    id: 'nm-005',
    type: 'status_change',
    title: 'Near-miss report submitted',
    user: TEAM.reporter,
    timestamp: daysAgo(1, 5),
    metadata: { fromStatus: 'Draft', toStatus: 'Reported' },
  },
]

// =============================================================================
// INJURY INCIDENT WITH ESCALATION
// =============================================================================

const injuryIncidentActivities: TimelineActivity[] = [
  {
    id: 'inj-001',
    type: 'approval',
    title: 'Return-to-work plan approved',
    note: 'Employee cleared for modified duty. Restrictions: no lifting >10 lbs for 2 weeks. Follow-up appointment scheduled.',
    user: TEAM.hrManager,
    timestamp: hoursAgo(3),
  },
  {
    id: 'inj-002',
    type: 'workflow_update',
    title: 'Workers\' Compensation claim filed',
    note: 'WC claim #WC-2024-0089 submitted to carrier. First Report of Injury (FROI) completed.',
    user: TEAM.hrManager,
    timestamp: daysAgo(1, 1),
    metadata: { workflowName: 'WC-2024-0089' },
  },
  {
    id: 'inj-003',
    type: 'document_upload',
    title: 'Uploaded medical documentation',
    note: 'Attending physician statement and treatment plan received. Diagnosis: minor laceration, no stitches required.',
    user: TEAM.hrManager,
    timestamp: daysAgo(1, 4),
    metadata: { documentName: 'Medical_Records_Redacted.pdf' },
  },
  {
    id: 'inj-004',
    type: 'comment',
    title: 'OSHA recordability determination',
    note: 'Incident is OSHA recordable - medical treatment beyond first aid (tetanus shot administered). Added to 300 log.',
    user: TEAM.ehsManager,
    timestamp: daysAgo(2, 2),
  },
  {
    id: 'inj-005',
    type: 'rejection',
    title: 'Initial severity assessment corrected',
    note: 'Upgrading from "Low" to "Medium" severity per EHS policy - any injury requiring medical treatment is minimum Medium.',
    user: TEAM.ehsManager,
    timestamp: daysAgo(2, 4),
  },
  {
    id: 'inj-006',
    type: 'assignment',
    title: 'Incident escalated to EHS Manager',
    note: 'Automatic escalation triggered: injury incident requires EHS Manager review within 24 hours.',
    user: TEAM.system,
    timestamp: daysAgo(2, 6),
  },
  {
    id: 'inj-007',
    type: 'status_change',
    title: 'Status changed to "Investigation"',
    note: 'Employee transported to occupational health clinic. Preliminary cause: sharp edge on equipment guard.',
    user: TEAM.supervisor,
    timestamp: daysAgo(2, 8),
    metadata: { fromStatus: 'Reported', toStatus: 'Investigation' },
  },
  {
    id: 'inj-008',
    type: 'comment',
    title: 'Immediate first aid provided',
    note: 'First aid administered on-site: wound cleaned, pressure applied, bandage applied. Employee alert and stable.',
    user: TEAM.supervisor,
    timestamp: daysAgo(2, 10),
  },
  {
    id: 'inj-009',
    type: 'status_change',
    title: 'Injury incident reported',
    note: 'Employee sustained cut to left forearm while operating packaging machine. Bleeding controlled.',
    user: TEAM.reporter,
    timestamp: daysAgo(2, 11),
    metadata: { fromStatus: 'Draft', toStatus: 'Reported' },
  },
]

// Keep simple version for basic stories
const extendedActivities: TimelineActivity[] = fullIncidentLifecycle.slice(0, 10)

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default activity timeline matching the Figma mockup
 */
export const Default: Story = {
  args: {
    activities: mockActivities,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
}

/**
 * Without search and export (minimal mode)
 */
export const Minimal: Story = {
  args: {
    activities: mockActivities,
    showSearch: false,
    showExport: false,
    onUserClick: action('onUserClick'),
  },
}

/**
 * With pagination (max items) - useful for overview panels
 */
export const WithPagination: Story = {
  args: {
    activities: extendedActivities,
    maxItems: 3,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
}

/**
 * Empty state with no activities
 */
export const Empty: Story = {
  args: {
    activities: [],
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
}

/**
 * Single activity
 */
export const SingleActivity: Story = {
  args: {
    activities: [mockActivities[0]],
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
}

/**
 * All activity types demonstrated
 */
export const AllActivityTypes: Story = {
  render: () => {
    const allTypes: TimelineActivity[] = [
      {
        id: '1',
        type: 'status_change',
        title: 'Status changed to "Investigation"',
        note: 'Starting investigation process.',
        user: { id: 'u1', name: 'John Smith' },
        timestamp: hoursAgo(1),
      },
      {
        id: '2',
        type: 'document_upload',
        title: 'Uploaded evidence photos',
        user: { id: 'u2', name: 'Jane Doe' },
        timestamp: hoursAgo(2),
      },
      {
        id: '3',
        type: 'comment',
        title: 'Added investigation notes',
        note: 'Detailed observations from site visit.',
        user: { id: 'u3', name: 'Bob Wilson' },
        timestamp: hoursAgo(3),
      },
      {
        id: '4',
        type: 'assignment',
        title: 'Assigned to Safety Team',
        user: { id: 'u4', name: 'Alice Brown' },
        timestamp: hoursAgo(4),
      },
      {
        id: '5',
        type: 'workflow_update',
        title: 'CAPA workflow initiated',
        user: { id: 'u5', name: 'Charlie Davis' },
        timestamp: hoursAgo(5),
      },
      {
        id: '6',
        type: 'approval',
        title: 'Investigation report approved',
        user: { id: 'u6', name: 'David Lee' },
        timestamp: hoursAgo(6),
      },
      {
        id: '7',
        type: 'rejection',
        title: 'Root cause analysis rejected',
        note: 'Needs additional supporting evidence.',
        user: { id: 'u7', name: 'Eva Martinez' },
        timestamp: hoursAgo(7),
      },
    ]

    return (
      <div className="w-full max-w-2xl">
        <ActivityTimeline
          activities={allTypes}
          onExport={action('onExport')}
          onUserClick={action('onUserClick')}
        />
      </div>
    )
  },
}

/**
 * All states and behaviors demonstrated
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-12 w-full max-w-2xl">
      <StorySection title="Default (with search & export)">
        <ActivityTimeline
          activities={mockActivities}
          onExport={action('onExport')}
          onUserClick={action('onUserClick')}
        />
      </StorySection>

      <StorySection title="Minimal (no search/export)">
        <ActivityTimeline
          activities={mockActivities.slice(0, 3)}
          showSearch={false}
          showExport={false}
          onUserClick={action('onUserClick')}
        />
      </StorySection>

      <StorySection title="With Pagination (max 3 items)">
        <ActivityTimeline
          activities={extendedActivities}
          maxItems={3}
          onExport={action('onExport')}
          onUserClick={action('onUserClick')}
        />
      </StorySection>

      <StorySection title="Empty State">
        <ActivityTimeline
          activities={[]}
          onExport={action('onExport')}
          onUserClick={action('onUserClick')}
        />
      </StorySection>

      <StorySection title="Activity Type Icons">
        <div className="flex flex-wrap gap-4">
          {[
            { type: 'status_change', label: 'Status Change' },
            { type: 'document_upload', label: 'Document Upload' },
            { type: 'comment', label: 'Comment' },
            { type: 'assignment', label: 'Assignment' },
            { type: 'workflow_update', label: 'Workflow Update' },
            { type: 'approval', label: 'Approval' },
            { type: 'rejection', label: 'Rejection' },
          ].map(({ type, label }) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <ActivityTimeline
                activities={[
                  {
                    id: type,
                    type: type as TimelineActivity['type'],
                    title: label,
                    user: { id: 'u1', name: 'User' },
                    timestamp: hoursAgo(1),
                  },
                ]}
                showSearch={false}
                showExport={false}
              />
            </div>
          ))}
        </div>
      </StorySection>
    </div>
  ),
}

/**
 * Mobile viewport demonstration
 */
export const Mobile: Story = {
  args: {
    activities: mockActivities,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// =============================================================================
// EHS INCIDENT SCENARIO STORIES
// =============================================================================

/**
 * Chemical Spill - Full Investigation Lifecycle
 *
 * Complete workflow from initial report through CAPA approval.
 * Shows all phases: Report → Investigation → Review → CAPA
 */
export const ChemicalSpillIncident: Story = {
  args: {
    activities: fullIncidentLifecycle,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
  parameters: {
    docs: {
      description: {
        story: `**Chemical Spill Incident - Full Lifecycle**

A realistic 4-day incident workflow showing:
- Initial report and emergency response
- Regulatory notifications
- Investigation with document uploads
- Root cause analysis
- Management review and CAPA approval

Key events tracked:
- Status changes (Draft → Reported → Investigation → Review)
- Document uploads (photos, RCA report, witness statements)
- Assignments and escalations
- Compliance verifications
- Workflow milestones`,
      },
    },
  },
}

/**
 * Near-Miss Incident - Quick Resolution
 *
 * Fast-track workflow for near-miss events.
 * Demonstrates streamlined process for non-injury events.
 */
export const NearMissIncident: Story = {
  args: {
    activities: nearMissActivities,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
  parameters: {
    docs: {
      description: {
        story: `**Near-Miss Incident - Quick Resolution**

Streamlined 2-day workflow for near-miss events:
- Safety observation reported
- Quick assessment and review
- Preventive measures implemented
- Good catch recognition

Near-misses are vital for proactive safety culture!`,
      },
    },
  },
}

/**
 * Injury Incident - With Escalation & HR Involvement
 *
 * Shows injury-specific workflow including:
 * - First aid response
 * - Automatic escalation
 * - OSHA recordability
 * - Workers' comp process
 */
export const InjuryIncident: Story = {
  args: {
    activities: injuryIncidentActivities,
    onExport: action('onExport'),
    onUserClick: action('onUserClick'),
  },
  parameters: {
    docs: {
      description: {
        story: `**Injury Incident - Escalation & HR Workflow**

Shows injury-specific events:
- First aid provided on-site
- Automatic escalation to EHS Manager
- Severity assessment correction
- OSHA recordability determination
- Workers' Compensation claim filing
- Medical documentation upload
- Return-to-work planning

Demonstrates system-triggered events and HR involvement.`,
      },
    },
  },
}

/**
 * Scenario Comparison - All Incident Types Side by Side
 *
 * Compare workflow patterns across different incident types.
 */
export const ScenarioComparison: Story = {
  render: () => (
    <div className="space-y-10">
      <StorySection title="Chemical Spill (Full Investigation)">
        <div className="border border-default rounded-lg p-4 bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium bg-warning/10 text-warning rounded">Medium Severity</span>
            <span className="text-xs text-tertiary">20 activities over 4 days</span>
          </div>
          <ActivityTimeline
            activities={fullIncidentLifecycle}
            maxItems={5}
            onExport={action('onExport')}
            onUserClick={action('onUserClick')}
          />
        </div>
      </StorySection>

      <StorySection title="Near-Miss (Quick Resolution)">
        <div className="border border-default rounded-lg p-4 bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded">Low Severity</span>
            <span className="text-xs text-tertiary">5 activities over 2 days</span>
          </div>
          <ActivityTimeline
            activities={nearMissActivities}
            onExport={action('onExport')}
            onUserClick={action('onUserClick')}
          />
        </div>
      </StorySection>

      <StorySection title="Injury (Escalation + HR)">
        <div className="border border-default rounded-lg p-4 bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium bg-error/10 text-error rounded">High Severity</span>
            <span className="text-xs text-tertiary">9 activities over 3 days</span>
          </div>
          <ActivityTimeline
            activities={injuryIncidentActivities}
            onExport={action('onExport')}
            onUserClick={action('onUserClick')}
          />
        </div>
      </StorySection>
    </div>
  ),
}

/**
 * Activity Types Legend
 *
 * Reference showing all activity types with realistic EHS examples.
 */
export const ActivityTypesLegend: Story = {
  render: () => {
    const typeExamples: TimelineActivity[] = [
      {
        id: '1',
        type: 'status_change',
        title: 'Status changed to "Investigation"',
        note: 'Formal investigation initiated per EHS-SOP-012.',
        user: TEAM.ehsManager,
        timestamp: hoursAgo(1),
      },
      {
        id: '2',
        type: 'document_upload',
        title: 'Uploaded Root Cause Analysis report',
        note: 'RCA completed using 5-Why methodology.',
        user: TEAM.investigator,
        timestamp: hoursAgo(2),
      },
      {
        id: '3',
        type: 'comment',
        title: 'Added compliance verification note',
        note: 'OSHA 1910.120 requirements verified.',
        user: TEAM.safetyOfficer,
        timestamp: hoursAgo(3),
      },
      {
        id: '4',
        type: 'assignment',
        title: 'Investigation assigned to Jennifer Walsh',
        note: 'Lead investigator assigned with team.',
        user: TEAM.ehsManager,
        timestamp: hoursAgo(4),
      },
      {
        id: '5',
        type: 'workflow_update',
        title: 'CAPA implementation workflow started',
        note: 'Target completion: 14 days.',
        user: TEAM.ehsManager,
        timestamp: hoursAgo(5),
      },
      {
        id: '6',
        type: 'approval',
        title: 'Final CAPA plan approved',
        note: 'Budget allocation confirmed.',
        user: TEAM.plantManager,
        timestamp: hoursAgo(6),
      },
      {
        id: '7',
        type: 'rejection',
        title: 'Initial severity assessment corrected',
        note: 'Upgrading from "Low" to "Medium" per policy.',
        user: TEAM.ehsManager,
        timestamp: hoursAgo(7),
      },
    ]

    return (
      <div className="space-y-6 max-w-2xl">
        <div className="bg-muted-bg/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary mb-2">Activity Type Reference</h3>
          <p className="text-xs text-secondary">
            Each activity type represents a specific event in the EHS incident workflow.
            Icons and colors help quickly identify the nature of each log entry.
          </p>
        </div>
        <ActivityTimeline
          activities={typeExamples}
          showSearch={false}
          showExport={false}
          onUserClick={action('onUserClick')}
        />
      </div>
    )
  },
}
