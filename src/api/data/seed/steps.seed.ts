/**
 * Step Seed Data
 *
 * Centralized step/task mock data for API simulation.
 * Steps are ACTIONS required to RESOLVE incidents.
 *
 * SINGLE SOURCE OF TRUTH - import this data in stories and components.
 */

import type { Step } from '../../types/step.types'

// =============================================================================
// INCIDENT REFERENCES (for step grouping)
// =============================================================================

/** Chemical Spill - Sulfuric Acid in Loading Dock */
const chemicalSpillIncident = {
  incidentId: 'INC-2025-0847',
  incidentDbId: 'inc-001',
  location: 'Loading Dock B - Bay 3',
  severity: 'critical' as const,
}

/** Fire Alarm Activation - Production Area */
const fireIncident = {
  incidentId: 'INC-2025-0851',
  incidentDbId: 'inc-002',
  location: 'Production Floor - Assembly Line 2',
  severity: 'high' as const,
}

/** Forklift Collision - Near Miss */
const forkliftIncident = {
  incidentId: 'INC-2025-0839',
  incidentDbId: 'inc-003',
  location: 'Warehouse A - Aisle 7',
  severity: 'medium' as const,
}

/** Electrical Arc Flash - Critical */
const electricalIncident = {
  incidentId: 'INC-2025-0855',
  incidentDbId: 'inc-004', // FIXED: matches incident id in incidents.seed.ts
  location: 'Electrical Room - Substation 3',
  severity: 'high' as const, // FIXED: matches incident severity
}

/** Slip and Fall - Wet Floor */
const slipFallIncident = {
  incidentId: 'INC-2025-0862',
  incidentDbId: 'inc-005', // FIXED: matches incident id in incidents.seed.ts
  location: 'Break Room - North Wing',
  severity: 'medium' as const, // FIXED: matches incident severity
}

/** Near Miss - Overhead Crane Swing */
const craneMissIncident = {
  incidentId: 'INC-2025-0868',
  incidentDbId: 'inc-006',
  location: 'Assembly Line A',
  severity: 'medium' as const,
}

/** Minor Laceration - Packaging Material */
const lacerationIncident = {
  incidentId: 'INC-2025-0875',
  incidentDbId: 'inc-007',
  location: 'Dock Bay 1',
  severity: 'low' as const,
}

/** Damaged Safety Sign - Parking Lot */
const signIncident = {
  incidentId: 'INC-2025-0878',
  incidentDbId: 'inc-008',
  location: 'Parking Lot - Main Entrance',
  severity: 'low' as const,
}

/** Hydraulic Fluid Leak - Press Machine */
const hydraulicIncident = {
  incidentId: 'INC-2025-0825',
  incidentDbId: 'inc-011',
  location: 'Hydraulic Press #1',
  severity: 'medium' as const,
}

/** Noise Level Exceeds Threshold - CNC Area */
const noiseIncident = {
  incidentId: 'INC-2025-0830',
  incidentDbId: 'inc-012',
  location: 'CNC Machine #1',
  severity: 'medium' as const,
}

// =============================================================================
// MY STEPS - Steps assigned to current user (user-1)
// =============================================================================

export const seedMySteps: Step[] = [
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

// =============================================================================
// TEAM STEPS - Steps assigned to team members
// =============================================================================

export const seedTeamSteps: Step[] = [
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

  // =========================================================================
  // NEAR MISS - Overhead Crane Swing (CLOSED - 3 completed steps)
  // =========================================================================
  {
    id: 'step-crane-1',
    title: 'Interview Crane Operator and Witnesses',
    description: 'Document witness statements from crane operator and 3 nearby workers. Focus on load securing procedures used and any deviations from standard practice.',
    tooltip: 'Investigation completed',
    ...craneMissIncident,
    status: 'completed',
    assignee: { id: 'user-3', name: 'Mike Chen', email: 'mike.chen@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'David Kim', email: 'david.kim@acme-manufacturing.com' },
    createdAt: '2025-12-18T16:00:00Z',
    dueDate: '2025-12-19T17:00:00Z',
    daysOpen: 7,
    isOverdue: false,
  },
  {
    id: 'step-crane-2',
    title: 'Review Load Securing Procedures',
    description: 'Audit current rigging and load securing SOPs. Compare against OSHA and manufacturer guidelines. Identify gaps that contributed to load swing.',
    tooltip: 'SOP gaps identified',
    ...craneMissIncident,
    status: 'completed',
    assignee: { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.johnson@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'David Kim', email: 'david.kim@acme-manufacturing.com' },
    createdAt: '2025-12-18T16:00:00Z',
    dueDate: '2025-12-20T17:00:00Z',
    daysOpen: 7,
    isOverdue: false,
  },
  {
    id: 'step-crane-3',
    title: 'Update and Communicate Improved Procedures',
    description: 'Revise SOP-CRANE-001 with enhanced load securing requirements. Conduct toolbox talk with all crane operators. Update training materials.',
    tooltip: 'Training completed for all operators',
    ...craneMissIncident,
    status: 'completed',
    assignee: { id: 'user-3', name: 'Mike Chen', email: 'mike.chen@acme-manufacturing.com' },
    reporter: { id: 'user-4', name: 'David Kim', email: 'david.kim@acme-manufacturing.com' },
    createdAt: '2025-12-19T09:00:00Z',
    dueDate: '2025-12-22T17:00:00Z',
    daysOpen: 7,
    isOverdue: false,
  },

  // =========================================================================
  // MINOR LACERATION - Packaging Material (CLOSED - 2 completed steps)
  // =========================================================================
  {
    id: 'step-lac-1',
    title: 'Administer First Aid and Document Injury',
    description: 'Clean wound, apply bandage, and complete first aid log entry. Verify tetanus vaccination status. Offer occupational health follow-up if needed.',
    tooltip: 'First aid completed, worker returned to duty',
    ...lacerationIncident,
    status: 'completed',
    assignee: { id: 'user-8', name: 'James Thompson', email: 'james.thompson@acme-manufacturing.com' },
    reporter: { id: 'user-8', name: 'James Thompson', email: 'james.thompson@acme-manufacturing.com' },
    createdAt: '2025-12-19T10:30:00Z',
    dueDate: '2025-12-19T11:00:00Z',
    daysOpen: 6,
    isOverdue: false,
  },
  {
    id: 'step-lac-2',
    title: 'Review PPE Requirements for Receiving',
    description: 'Evaluate current cut-resistant glove requirements for receiving area. Consider upgrade to Level A4 cut-resistant gloves for crate opening tasks.',
    tooltip: 'PPE upgrade recommended',
    ...lacerationIncident,
    status: 'completed',
    assignee: { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.johnson@acme-manufacturing.com' },
    reporter: { id: 'user-8', name: 'James Thompson', email: 'james.thompson@acme-manufacturing.com' },
    createdAt: '2025-12-19T10:30:00Z',
    dueDate: '2025-12-19T17:00:00Z',
    daysOpen: 6,
    isOverdue: false,
  },

  // =========================================================================
  // DAMAGED SIGN - Parking Lot (CLOSED - 1 completed step)
  // =========================================================================
  {
    id: 'step-sign-1',
    title: 'Replace Damaged Stop Sign',
    description: 'Order replacement sign from approved vendor. Install using proper concrete anchoring. Verify visibility from all approach angles.',
    tooltip: 'Sign replaced and inspected',
    ...signIncident,
    status: 'completed',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Emma Rodriguez', email: 'emma.rodriguez@acme-manufacturing.com' },
    createdAt: '2025-12-20T07:15:00Z',
    dueDate: '2025-12-21T17:00:00Z',
    daysOpen: 5,
    isOverdue: false,
  },

  // =========================================================================
  // HYDRAULIC LEAK - Press Machine (CLOSED - 4 completed steps)
  // =========================================================================
  {
    id: 'step-hyd-1',
    title: 'Isolate and Lock Out Press Machine',
    description: 'Apply LOTO per procedure. De-pressurize hydraulic system. Place drip pans to contain residual fluid.',
    tooltip: 'Machine safely isolated',
    ...hydraulicIncident,
    status: 'completed',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Emma Rodriguez', email: 'emma.rodriguez@acme-manufacturing.com' },
    createdAt: '2025-12-15T14:15:00Z',
    dueDate: '2025-12-15T15:00:00Z',
    daysOpen: 10,
    isOverdue: false,
  },
  {
    id: 'step-hyd-2',
    title: 'Identify Leak Source and Order Parts',
    description: 'Inspect main cylinder seals and hydraulic lines. Leak traced to worn cylinder O-ring. Order replacement seal kit from Parker (P/N HYD-5521).',
    tooltip: 'Parts ordered, ETA 2 days',
    ...hydraulicIncident,
    status: 'completed',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Emma Rodriguez', email: 'emma.rodriguez@acme-manufacturing.com' },
    createdAt: '2025-12-15T15:00:00Z',
    dueDate: '2025-12-16T17:00:00Z',
    daysOpen: 10,
    isOverdue: false,
  },
  {
    id: 'step-hyd-3',
    title: 'Replace Cylinder Seals and Test',
    description: 'Install new seal kit per manufacturer specs. Refill hydraulic reservoir with AW-46 oil. Pressure test at 3000 PSI for 30 minutes.',
    tooltip: 'Repair completed successfully',
    ...hydraulicIncident,
    status: 'completed',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Emma Rodriguez', email: 'emma.rodriguez@acme-manufacturing.com' },
    createdAt: '2025-12-17T08:00:00Z',
    dueDate: '2025-12-17T17:00:00Z',
    daysOpen: 10,
    isOverdue: false,
  },
  {
    id: 'step-hyd-4',
    title: 'Return Machine to Service',
    description: 'Remove LOTO. Run production test cycle. Update maintenance log and PM schedule. Add seal inspection to monthly checklist.',
    tooltip: 'Machine back in production',
    ...hydraulicIncident,
    status: 'completed',
    assignee: { id: 'user-3', name: 'Mike Chen', email: 'mike.chen@acme-manufacturing.com' },
    reporter: { id: 'user-11', name: 'Emma Rodriguez', email: 'emma.rodriguez@acme-manufacturing.com' },
    createdAt: '2025-12-18T08:00:00Z',
    dueDate: '2025-12-18T17:00:00Z',
    daysOpen: 10,
    isOverdue: false,
  },

  // =========================================================================
  // NOISE LEVEL - CNC Area (INVESTIGATION - 2/5 completed)
  // =========================================================================
  {
    id: 'step-noise-1',
    title: 'Conduct Detailed Noise Survey',
    description: 'Use calibrated sound level meter to map noise levels across CNC area. Document measurements at operator positions during various operations.',
    tooltip: 'Survey completed - peak: 94dB at CNC #3',
    ...noiseIncident,
    status: 'completed',
    assignee: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    createdAt: '2025-12-16T10:30:00Z',
    dueDate: '2025-12-17T17:00:00Z',
    daysOpen: 9,
    isOverdue: false,
  },
  {
    id: 'step-noise-2',
    title: 'Issue Enhanced Hearing Protection',
    description: 'Distribute NRR 31 earmuffs to all CNC area personnel as interim measure. Post signage requiring double hearing protection in affected zones.',
    tooltip: 'PPE distributed to all affected workers',
    ...noiseIncident,
    status: 'completed',
    assignee: { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.johnson@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    createdAt: '2025-12-17T08:00:00Z',
    dueDate: '2025-12-18T17:00:00Z',
    daysOpen: 9,
    isOverdue: false,
  },
  {
    id: 'step-noise-3',
    title: 'Evaluate Engineering Controls',
    description: 'Research acoustic enclosures and sound barriers for CNC machines. Get quotes from 3 vendors for partial enclosure solution.',
    tooltip: 'Quotes requested from vendors',
    ...noiseIncident,
    status: 'in_progress',
    assignee: { id: 'user-17', name: 'Frank Maintenance', email: 'frank.miller@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    createdAt: '2025-12-18T08:00:00Z',
    dueDate: '2025-12-27T17:00:00Z',
    daysOpen: 9,
    isOverdue: false,
  },
  {
    id: 'step-noise-4',
    title: 'Implement Administrative Controls',
    description: 'Adjust work schedules to limit continuous exposure time. Implement mandatory quiet zone rotation every 2 hours.',
    tooltip: 'Schedule changes pending approval',
    ...noiseIncident,
    status: 'pending',
    assignee: { id: 'user-16', name: 'Diana HR-Manager', email: 'diana.johnson@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    createdAt: '2025-12-18T08:00:00Z',
    dueDate: '2025-12-23T17:00:00Z',
    daysOpen: 9,
    isOverdue: true,
  },
  {
    id: 'step-noise-5',
    title: 'Establish Baseline Audiometric Testing',
    description: 'Schedule hearing tests for all CNC area personnel. Establish baseline for ongoing monitoring per OSHA 1910.95 requirements.',
    tooltip: 'Testing scheduled for next week',
    ...noiseIncident,
    status: 'pending',
    assignee: { id: 'user-8', name: 'Linda Park', email: 'linda.park@acme-manufacturing.com' },
    reporter: { id: 'user-9', name: 'Lisa Wang', email: 'lisa.wang@acme-manufacturing.com' },
    createdAt: '2025-12-18T08:00:00Z',
    dueDate: '2025-12-30T17:00:00Z',
    daysOpen: 9,
    isOverdue: false,
  },
]

// =============================================================================
// COMBINED SEED DATA (for API store initialization)
// =============================================================================

/**
 * All steps combined for API store initialization.
 * Use seedMySteps and seedTeamSteps directly for story separation.
 */
export const seedSteps: Step[] = [...seedMySteps, ...seedTeamSteps]

// =============================================================================
// HELPER: Generate many steps for pagination testing
// =============================================================================

/**
 * Generate many steps for testing pagination.
 * @param count Number of steps to generate
 */
export function generateManySteps(count: number): Step[] {
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
  const severities = ['critical', 'high', 'medium', 'low'] as const
  const statuses = ['pending', 'in_progress', 'overdue', 'completed'] as const

  return Array.from({ length: count }, (_, i) => {
    const baseStep = seedMySteps[i % seedMySteps.length]
    const incidentNum = 2025000 + i
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
  })
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get steps for a specific incident
 */
export function getStepsByIncident(incidentDbId: string): Step[] {
  return seedSteps.filter((s) => s.incidentDbId === incidentDbId)
}

/**
 * Get steps assigned to a specific user
 */
export function getStepsByAssignee(assigneeId: string): Step[] {
  return seedSteps.filter((s) => s.assignee.id === assigneeId)
}

/**
 * Get steps by status
 */
export function getStepsByStatus(status: Step['status']): Step[] {
  return seedSteps.filter((s) => s.status === status)
}

/**
 * Get all overdue steps
 */
export function getOverdueSteps(): Step[] {
  return seedSteps.filter((s) => s.isOverdue)
}

/**
 * Get step statistics
 */
export function getStepStats(): {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
} {
  return {
    total: seedSteps.length,
    pending: seedSteps.filter((s) => s.status === 'pending').length,
    inProgress: seedSteps.filter((s) => s.status === 'in_progress').length,
    completed: seedSteps.filter((s) => s.status === 'completed').length,
    overdue: seedSteps.filter((s) => s.isOverdue).length,
  }
}
