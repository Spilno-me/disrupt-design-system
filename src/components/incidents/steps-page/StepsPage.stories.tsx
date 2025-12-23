/**
 * StepsPage Stories
 *
 * Stories for the Steps page where users view and manage
 * tasks/steps from different incidents.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StepsPage } from './StepsPage'
import type { Step } from './types'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof StepsPage> = {
  title: 'Flow/StepsPage',
  component: StepsPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Steps Page displays tasks/steps from different incidents that require user attention.

## Features
- **Tab Navigation**: Switch between "My Steps" and "Team Steps"
- **Search & Filters**: Search by text, filter by severity and status
- **Expandable Rows**: Click to expand and see step description
- **Next Step Button**: Navigates to the linked incident's overview page
- **Aging Indicator**: Visual indicator of how long the step has been open
- **Pagination**: Navigate through large lists of steps

## Usage
\`\`\`tsx
<StepsPage
  mySteps={mySteps}
  teamSteps={teamSteps}
  onNextStep={(step) => navigate(\`/incidents/\${step.incidentDbId}\`)}
  onIncidentClick={(dbId, id) => navigate(\`/incidents/\${dbId}\`)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'radio',
      options: ['my-steps', 'team-steps'],
    },
    defaultPageSize: {
      control: { type: 'select' },
      options: [5, 10, 25, 50],
    },
    isLoading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof StepsPage>

// =============================================================================
// MOCK DATA - Realistic Incident Resolution Steps
// =============================================================================

/**
 * Steps represent ACTIONS required to RESOLVE incidents, not just investigation tasks.
 * Each step is tied to a specific incident and represents a real-world action.
 */

// Incident: Chemical Spill - Sulfuric Acid in Loading Dock
const chemicalSpillIncident = {
  incidentId: 'INC-2025-0847',
  incidentDbId: 'db-chem-847',
  location: 'Loading Dock B - Bay 3',
  severity: 'critical' as const,
}

// Incident: Fire Alarm Activation - Production Area
const fireIncident = {
  incidentId: 'INC-2025-0851',
  incidentDbId: 'db-fire-851',
  location: 'Production Floor - Assembly Line 2',
  severity: 'high' as const,
}

// Incident: Forklift Collision - Near Miss
const forkliftIncident = {
  incidentId: 'INC-2025-0839',
  incidentDbId: 'db-fork-839',
  location: 'Warehouse A - Aisle 7',
  severity: 'medium' as const,
}

// Incident: Slip and Fall - Wet Floor
const slipFallIncident = {
  incidentId: 'INC-2025-0862',
  incidentDbId: 'db-slip-862',
  location: 'Break Room - North Wing',
  severity: 'low' as const,
}

// Incident: Electrical Arc Flash - Critical
const electricalIncident = {
  incidentId: 'INC-2025-0855',
  incidentDbId: 'db-elec-855',
  location: 'Electrical Room - Substation 3',
  severity: 'critical' as const,
}

const mockSteps: Step[] = [
  // CHEMICAL SPILL - Step 1: Deploy containment
  {
    id: 'step-chem-1',
    title: 'Deploy Spill Containment Barriers',
    description: 'Deploy absorbent booms and dikes around the 50-gallon sulfuric acid spill to prevent spread to storm drains. Use acid-resistant PPE (Level B). Containment kit located in Spill Response Cabinet #3.',
    tooltip: 'Immediate containment required - acid spreading toward drain',
    ...chemicalSpillIncident,
    status: 'in_progress',
    assignee: { id: 'user-1', name: 'Marcus Chen', email: 'marcus.chen@acme-manufacturing.com' },
    reporter: { id: 'user-2', name: 'Jake Morrison', email: 'jake.morrison@acme-manufacturing.com' },
    createdAt: '2025-12-23T08:15:00Z',
    dueDate: '2025-12-23T09:00:00Z',
    daysOpen: 0,
    isOverdue: false,
  },
  // CHEMICAL SPILL - Step 2: Neutralize
  {
    id: 'step-chem-2',
    title: 'Neutralize Acid with Sodium Bicarbonate',
    description: 'Once contained, apply sodium bicarbonate (baking soda) from neutralization kit to raise pH to safe levels (6-8). Test with pH strips before cleanup. Ventilate area with portable fans.',
    tooltip: 'Neutralization pending containment completion',
    ...chemicalSpillIncident,
    status: 'pending',
    assignee: { id: 'user-1', name: 'Marcus Chen', email: 'marcus.chen@acme-manufacturing.com' },
    reporter: { id: 'user-2', name: 'Jake Morrison', email: 'jake.morrison@acme-manufacturing.com' },
    createdAt: '2025-12-23T08:15:00Z',
    dueDate: '2025-12-23T10:00:00Z',
    daysOpen: 0,
    isOverdue: false,
  },
  // FIRE INCIDENT - Step 1: Account for personnel
  {
    id: 'step-fire-1',
    title: 'Complete Personnel Accountability Check',
    description: 'Verify all 47 production floor employees are accounted for at Muster Point C. Cross-reference with badge-in records from today. Report any discrepancies to Fire Marshal immediately.',
    tooltip: '3 employees still unaccounted for',
    ...fireIncident,
    status: 'in_progress',
    assignee: { id: 'user-3', name: 'Sandra Williams', email: 'sandra.williams@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'Dmitri Volkov', email: 'dmitri.volkov@acme-manufacturing.com' },
    createdAt: '2025-12-22T14:32:00Z',
    dueDate: '2025-12-22T15:00:00Z',
    daysOpen: 1,
    isOverdue: true,
  },
  // FORKLIFT - Step 1: Secure equipment
  {
    id: 'step-fork-1',
    title: 'Lock Out Damaged Forklift #FL-023',
    description: 'Apply LOTO (Lock Out Tag Out) to forklift #FL-023. Steering mechanism compromised after collision with racking. Tag with red "Do Not Operate" label. Remove keys to supervisor office.',
    tooltip: 'Equipment secured, awaiting repair assessment',
    ...forkliftIncident,
    status: 'completed',
    assignee: { id: 'user-5', name: 'Tony Reeves', email: 'tony.reeves@acme-manufacturing.com' },
    reporter: { id: 'user-6', name: 'Maria Santos', email: 'maria.santos@acme-manufacturing.com' },
    createdAt: '2025-12-20T10:45:00Z',
    dueDate: '2025-12-20T12:00:00Z',
    daysOpen: 3,
    isOverdue: false,
  },
  // FORKLIFT - Step 2: Repair racking
  {
    id: 'step-fork-2',
    title: 'Schedule Pallet Racking Structural Assessment',
    description: 'Contact Damotech or similar certified inspector to assess Bay 7 racking damage. Two uprights show visible bending. Area cordoned off - do not store pallets until cleared. Budget code: MAINT-2025-Q4.',
    tooltip: 'Inspector scheduled for Dec 26',
    ...forkliftIncident,
    status: 'pending',
    assignee: { id: 'user-7', name: 'Rebecca Foster', email: 'rebecca.foster@acme-manufacturing.com' },
    reporter: { id: 'user-6', name: 'Maria Santos', email: 'maria.santos@acme-manufacturing.com' },
    createdAt: '2025-12-20T10:45:00Z',
    dueDate: '2025-12-27T17:00:00Z',
    daysOpen: 3,
    isOverdue: false,
  },
  // SLIP AND FALL - Step 1: First aid
  {
    id: 'step-slip-1',
    title: 'Arrange Medical Evaluation for Employee',
    description: 'Employee Sarah Kim reported wrist pain after fall. First aid administered on-site. Schedule occupational health clinic visit for evaluation. Complete OSHA 301 if medical treatment beyond first aid required.',
    tooltip: 'Employee declined ambulance, self-transported',
    ...slipFallIncident,
    status: 'in_progress',
    assignee: { id: 'user-8', name: 'Linda Park', email: 'linda.park@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'James O\'Connor', email: 'james.oconnor@acme-manufacturing.com' },
    createdAt: '2025-12-22T11:20:00Z',
    dueDate: '2025-12-23T17:00:00Z',
    daysOpen: 1,
    isOverdue: false,
  },
  // ELECTRICAL - Step 1: De-energize
  {
    id: 'step-elec-1',
    title: 'Verify Complete De-Energization of Panel 3B',
    description: 'Arc flash occurred during routine maintenance. Panel 3B must remain de-energized until electrical engineer inspection. Verify with voltage tester (CAT IV rated). Post barricades and signage per NFPA 70E.',
    tooltip: 'High voltage - qualified personnel only',
    ...electricalIncident,
    status: 'overdue',
    assignee: { id: 'user-10', name: 'Robert Electrician', email: 'robert.chen@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Ahmed Hassan', email: 'ahmed.hassan@acme-manufacturing.com' },
    createdAt: '2025-12-18T09:00:00Z',
    dueDate: '2025-12-19T17:00:00Z',
    daysOpen: 5,
    isOverdue: true,
  },
]

// Team Steps - Resolution actions assigned to other team members
const teamSteps: Step[] = [
  // CHEMICAL SPILL - Environmental reporting
  {
    id: 'team-chem-1',
    title: 'Submit EPA Spill Notification (CERCLA)',
    description: 'Sulfuric acid spill exceeds 1,000 lb RQ. File NRC notification within 24 hours of release. Document quantity, time, location, and response actions. Retain confirmation number for records.',
    tooltip: 'Regulatory deadline: 24 hours from discovery',
    ...chemicalSpillIncident,
    status: 'pending',
    assignee: { id: 'user-12', name: 'Patricia Gonzalez', email: 'patricia.gonzalez@acme-manufacturing.com' },
    reporter: { id: 'user-2', name: 'Jake Morrison', email: 'jake.morrison@acme-manufacturing.com' },
    createdAt: '2025-12-23T08:30:00Z',
    dueDate: '2025-12-24T08:15:00Z',
    daysOpen: 0,
    isOverdue: false,
  },
  // CHEMICAL SPILL - Waste disposal
  {
    id: 'team-chem-2',
    title: 'Coordinate Hazmat Waste Disposal Pickup',
    description: 'Contact Clean Harbors (contract #CH-2025-4421) to schedule pickup of neutralized acid waste and contaminated absorbents. Manifest required - classify as D002 corrosive waste.',
    tooltip: 'Waste must be removed within 72 hours',
    ...chemicalSpillIncident,
    status: 'pending',
    assignee: { id: 'user-13', name: 'Kevin Walsh', email: 'kevin.walsh@acme-manufacturing.com' },
    reporter: { id: 'user-2', name: 'Jake Morrison', email: 'jake.morrison@acme-manufacturing.com' },
    createdAt: '2025-12-23T08:30:00Z',
    dueDate: '2025-12-26T17:00:00Z',
    daysOpen: 0,
    isOverdue: false,
  },
  // FIRE - Restore operations
  {
    id: 'team-fire-1',
    title: 'Obtain Fire Marshal Clearance for Re-Entry',
    description: 'Building re-entry requires written clearance from City Fire Marshal. Schedule inspection call with Station 7 (555-0147). Provide incident report and suppression system test results.',
    tooltip: 'Production halted until clearance received',
    ...fireIncident,
    status: 'in_progress',
    assignee: { id: 'user-14', name: 'Michael Torres', email: 'michael.torres@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'Dmitri Volkov', email: 'dmitri.volkov@acme-manufacturing.com' },
    createdAt: '2025-12-22T15:00:00Z',
    dueDate: '2025-12-23T12:00:00Z',
    daysOpen: 1,
    isOverdue: true,
  },
  // FIRE - Reset suppression
  {
    id: 'team-fire-2',
    title: 'Recharge Fire Suppression System - Zone 2A',
    description: 'FM-200 system discharged in Assembly Line 2 area. Contact Tyco (service contract #TY-8834) to recharge cylinders and reset control panel. Verify detector functionality post-service.',
    tooltip: 'Temporary fire watch required until recharged',
    ...fireIncident,
    status: 'pending',
    assignee: { id: 'user-15', name: 'Jennifer Adams', email: 'jennifer.adams@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'Dmitri Volkov', email: 'dmitri.volkov@acme-manufacturing.com' },
    createdAt: '2025-12-22T15:30:00Z',
    dueDate: '2025-12-24T17:00:00Z',
    daysOpen: 1,
    isOverdue: false,
  },
  // FORKLIFT - Operator retraining
  {
    id: 'team-fork-1',
    title: 'Schedule Forklift Operator Recertification',
    description: 'Operator Carlos Mendez involved in collision. Per company policy, complete refresher training with certified instructor before returning to forklift duties. Document in training database.',
    tooltip: 'Operator on light duty until recertified',
    ...forkliftIncident,
    status: 'in_progress',
    assignee: { id: 'user-16', name: 'Diana HR-Manager', email: 'diana.johnson@acme-manufacturing.com' },
    reporter: { id: 'user-6', name: 'Maria Santos', email: 'maria.santos@acme-manufacturing.com' },
    createdAt: '2025-12-20T14:00:00Z',
    dueDate: '2025-12-27T17:00:00Z',
    daysOpen: 3,
    isOverdue: false,
  },
  // SLIP/FALL - Fix hazard
  {
    id: 'team-slip-1',
    title: 'Repair Leaking Ice Machine in Break Room',
    description: 'Root cause of wet floor identified: ice machine condensate line disconnected. Submit work order to Facilities (priority: HIGH). Temporary drip tray installed as interim measure.',
    tooltip: 'Work order #WO-2025-4892 submitted',
    ...slipFallIncident,
    status: 'completed',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'James O\'Connor', email: 'james.oconnor@acme-manufacturing.com' },
    createdAt: '2025-12-22T12:00:00Z',
    dueDate: '2025-12-23T17:00:00Z',
    daysOpen: 1,
    isOverdue: false,
  },
  // ELECTRICAL - PPE replacement
  {
    id: 'team-elec-1',
    title: 'Replace Damaged Arc Flash PPE Kit',
    description: 'Technician\'s 40 cal/cm² arc flash suit damaged during incident. Order replacement through Grainger (item #5T789). Update PPE inspection log. Verify backup suits available in EE cabinet.',
    tooltip: 'Rush order placed, ETA 2 business days',
    ...electricalIncident,
    status: 'in_progress',
    assignee: { id: 'user-18', name: 'Nancy Safety-Coord', email: 'nancy.white@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Ahmed Hassan', email: 'ahmed.hassan@acme-manufacturing.com' },
    createdAt: '2025-12-18T10:00:00Z',
    dueDate: '2025-12-20T17:00:00Z',
    daysOpen: 5,
    isOverdue: true,
  },
  // ELECTRICAL - Investigation
  {
    id: 'team-elec-2',
    title: 'Complete Electrical Incident Root Cause Analysis',
    description: 'Use 5-Why method to determine arc flash cause. Initial findings suggest improper PPE selection for panel voltage. Review work permit and verify NFPA 70E hazard analysis was current.',
    tooltip: 'RCA due within 10 business days per policy',
    ...electricalIncident,
    status: 'pending',
    assignee: { id: 'user-19', name: 'William EHS-Manager', email: 'william.brown@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Ahmed Hassan', email: 'ahmed.hassan@acme-manufacturing.com' },
    createdAt: '2025-12-18T14:00:00Z',
    dueDate: '2025-12-30T17:00:00Z',
    daysOpen: 5,
    isOverdue: false,
  },
]

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view with My Steps tab active
 */
export const Default: Story = {
  args: {
    mySteps: mockSteps,
    teamSteps: teamSteps,
    activeTab: 'my-steps',
  },
}

/**
 * Team Steps tab active
 */
export const TeamSteps: Story = {
  args: {
    mySteps: mockSteps,
    teamSteps: teamSteps,
    activeTab: 'team-steps',
  },
}

/**
 * Empty state - no steps to display
 */
export const EmptyState: Story = {
  args: {
    mySteps: [],
    teamSteps: [],
    activeTab: 'my-steps',
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    mySteps: mockSteps,
    teamSteps: teamSteps,
    isLoading: true,
  },
}

/**
 * With interactive handlers
 */
export const Interactive: Story = {
  args: {
    mySteps: mockSteps,
    teamSteps: teamSteps,
    onNextStep: (step) => {
      console.log('Next step clicked:', step)
      alert(`Navigating to incident: ${step.incidentId}`)
    },
    onIncidentClick: (dbId, incidentId) => {
      console.log('Incident clicked:', { dbId, incidentId })
      alert(`Opening incident: ${incidentId}`)
    },
    onAssigneeClick: (person) => {
      console.log('Assignee clicked:', person)
      alert(`Opening profile for: ${person.name}`)
    },
    onReporterClick: (person) => {
      console.log('Reporter clicked:', person)
      alert(`Opening profile for: ${person.name}`)
    },
    onLocationClick: (location) => {
      console.log('Location clicked:', location)
      alert(`Opening location: ${location}`)
    },
    onTabChange: (tab) => {
      console.log('Tab changed to:', tab)
    },
  },
}

/**
 * Different page sizes
 */
export const CustomPageSize: Story = {
  args: {
    mySteps: [...mockSteps, ...mockSteps.map((s, i) => ({ ...s, id: `${s.id}-dup-${i}` }))],
    teamSteps: teamSteps,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 15],
  },
}

/**
 * Many steps (for testing pagination) - generates realistic incident resolution tasks
 */
export const ManySteps: Story = {
  args: {
    mySteps: Array.from({ length: 50 }, (_, i) => {
      const baseStep = mockSteps[i % mockSteps.length]
      const incidentNum = 2025000 + i
      const severities = ['critical', 'high', 'medium', 'low'] as const
      const statuses = ['pending', 'in_progress', 'overdue', 'completed'] as const
      const locations = [
        'Loading Dock A - Bay 1', 'Warehouse B - Section 3', 'Production Line 4',
        'Chemical Storage - West', 'Electrical Room - Main', 'Break Room - South',
        'Maintenance Shop', 'Quality Lab', 'Shipping Department', 'Parking Lot C'
      ]
      const resolutionTasks = [
        'Deploy containment barriers', 'Complete personnel accountability', 'Lock out equipment',
        'Arrange medical evaluation', 'Verify de-energization', 'Submit regulatory notification',
        'Coordinate waste disposal', 'Obtain clearance certificate', 'Schedule operator retraining',
        'Replace damaged PPE', 'Complete root cause analysis', 'Install warning signage',
        'Repair damaged infrastructure', 'Update safety procedures', 'Conduct follow-up inspection'
      ]
      return {
        ...baseStep,
        id: `step-gen-${i}`,
        title: resolutionTasks[i % resolutionTasks.length],
        incidentId: `INC-2025-${String(incidentNum).padStart(4, '0')}`,
        incidentDbId: `db-inc-${incidentNum}`,
        location: locations[i % locations.length],
        severity: severities[i % severities.length],
        status: statuses[Math.floor(i / 4) % statuses.length],
        daysOpen: Math.floor(Math.random() * 14) + 1,
        isOverdue: i % 7 === 0,
      }
    }),
    teamSteps: teamSteps,
    defaultPageSize: 10,
  },
}
