/**
 * Mock Data for Dictionary Management
 *
 * Comprehensive EHS (Environment, Health & Safety) domain dictionary data.
 * This serves as the source of truth for dropdown options, form fields,
 * and lookup values across the application.
 */

import type { DictionaryCategory, DictionaryEntry, EntryStatus } from '../types'

// =============================================================================
// HELPER: Create timestamp
// =============================================================================

const CREATED_AT = '2024-01-15T10:00:00Z'
const UPDATED_AT = '2024-01-15T10:00:00Z'

// =============================================================================
// MOCK CATEGORIES
// =============================================================================

export const mockCategories: DictionaryCategory[] = [
  // ---------------------------------------------------------------------------
  // Actions & Corrective
  // ---------------------------------------------------------------------------
  {
    id: 'cat-action-types',
    name: 'Action types',
    code: 'ACTION_TYPE',
    description: 'Types of corrective and preventive actions for corrective action module',
    type: 'system',
    itemCount: 3,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-corrective-categories',
    name: 'Corrective action categories',
    code: 'corrective-action-category',
    description: 'Categories of corrective actions by domain',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-corrective-types',
    name: 'Corrective action types',
    code: 'corrective-action-type',
    description: 'Types of corrective and preventive actions',
    type: 'system',
    itemCount: 4,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-effectiveness',
    name: 'Effectiveness assessment',
    code: 'effectiveness-assessment',
    description: 'Effectiveness assessment levels for actions',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Body & Injury
  // ---------------------------------------------------------------------------
  {
    id: 'cat-body-parts',
    name: 'Body parts affected',
    code: 'body-part-affected',
    description: 'Body parts that can be affected by injuries',
    type: 'system',
    itemCount: 13,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-injury-illness-types',
    name: 'Injury/illness types',
    code: 'injury-illness-type',
    description: 'Types of injuries and illnesses for incident reporting',
    type: 'system',
    itemCount: 12,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-injury-severity',
    name: 'Injury severity levels',
    code: 'injury-severity',
    description: 'Severity classification for injuries',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-medical-providers',
    name: 'Medical treatment providers',
    code: 'medical-treatment-provider',
    description: 'Types of medical treatment providers',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Environmental
  // ---------------------------------------------------------------------------
  {
    id: 'cat-env-impact',
    name: 'Environmental impact severity',
    code: 'env-impact-severity',
    description: 'Severity levels for environmental impacts',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-env-release-sources',
    name: 'Environmental release sources',
    code: 'env-release-source',
    description: 'Sources of environmental releases',
    type: 'system',
    itemCount: 8,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-env-release-types',
    name: 'Environmental release types',
    code: 'env-release-type',
    description: 'Types of environmental releases',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Incidents
  // ---------------------------------------------------------------------------
  {
    id: 'cat-incident-assessment',
    name: 'Incident assessment',
    code: 'incident-assessment',
    description: 'Assessment categories for incidents',
    type: 'system',
    itemCount: 4,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-incident-closure',
    name: 'Incident closure reasons',
    code: 'incident-closure-reason',
    description: 'Reasons for closing incidents',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-incident-severity',
    name: 'Incident severity levels',
    code: 'incident-severity',
    description: 'Severity classification for incidents',
    type: 'system',
    itemCount: 25,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-incident-types',
    name: 'Incident types',
    code: 'incident-type',
    description: 'Types of incidents for categorization',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Location & Organization
  // ---------------------------------------------------------------------------
  {
    id: 'cat-departments',
    name: 'Departments',
    code: 'department',
    description: 'Organizational departments responsible for actions',
    type: 'system',
    itemCount: 8,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-location-access',
    name: 'Location access levels',
    code: 'location-access-level',
    description: 'Access level classifications for locations',
    type: 'system',
    itemCount: 5,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-location-types',
    name: 'Location types',
    code: 'location-type',
    description: 'Types of locations in the organization hierarchy',
    type: 'system',
    itemCount: 7,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Process Safety
  // ---------------------------------------------------------------------------
  {
    id: 'cat-process-safety',
    name: 'Process safety incident types',
    code: 'process-safety-incident-type',
    description: 'Types of process safety incidents',
    type: 'system',
    itemCount: 10,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Quality
  // ---------------------------------------------------------------------------
  {
    id: 'cat-quality-issues',
    name: 'Quality issue types',
    code: 'quality-issue-type',
    description: 'Types of quality issues for tracking',
    type: 'system',
    itemCount: 9,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Root Cause Analysis
  // ---------------------------------------------------------------------------
  {
    id: 'cat-rca-methodologies',
    name: 'RCA methodologies',
    code: 'rca-methodology',
    description: 'Root cause analysis methodologies',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-root-cause-categories',
    name: 'Root cause categories',
    code: 'root-cause-category',
    description: 'Categories for classifying root causes',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Security
  // ---------------------------------------------------------------------------
  {
    id: 'cat-security-incidents',
    name: 'Security incident types',
    code: 'security-incident-type',
    description: 'Types of security incidents',
    type: 'system',
    itemCount: 10,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-security-levels',
    name: 'Security levels',
    code: 'security-level',
    description: 'Security classification levels',
    type: 'system',
    itemCount: 4,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------
  {
    id: 'cat-priority-levels',
    name: 'Priority levels',
    code: 'priority-level',
    description: 'Priority levels for tasks and actions',
    type: 'system',
    itemCount: 4,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-source-types',
    name: 'Source types',
    code: 'source-type',
    description: 'Types of sources for incident reporting',
    type: 'system',
    itemCount: 6,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'cat-timezones',
    name: 'Timezones',
    code: 'timezone',
    description: 'World timezone definitions',
    type: 'system',
    itemCount: 50,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  // ---------------------------------------------------------------------------
  // Custom (Organization-specific)
  // ---------------------------------------------------------------------------
  {
    id: 'cat-custom-priorities',
    name: 'Custom Priorities',
    code: 'custom-priority',
    description: 'Custom priority levels for your organization',
    type: 'custom',
    itemCount: 4,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
]

// =============================================================================
// HELPER: Create entry
// =============================================================================

function createEntry(
  id: string,
  categoryId: string,
  code: string,
  value: string,
  description: string,
  order: number,
  status: EntryStatus = 'active',
  isSystem = true,
  parentId: string | null = null
): DictionaryEntry {
  return {
    id,
    categoryId,
    code,
    value,
    description,
    order,
    status,
    isSystem,
    parentId,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  }
}

// =============================================================================
// ACTION TYPES
// =============================================================================

export const mockActionTypeEntries: DictionaryEntry[] = [
  createEntry('action-1', 'cat-action-types', 'ACTION_TYPE-document-action', 'Document Action', 'Action to document processes or findings', 1),
  createEntry('action-2', 'cat-action-types', 'ACTION_TYPE-general-action', 'General Action', 'General action for standard tasks and procedures', 2),
  createEntry('action-3', 'cat-action-types', 'ACTION_TYPE-incident-corrective-action', 'Incident Corrective Action', 'Corrective action initiated in response to an incident', 3),
]

// =============================================================================
// CORRECTIVE ACTION CATEGORIES
// =============================================================================

export const mockCorrectiveActionCategoryEntries: DictionaryEntry[] = [
  createEntry('cac-1', 'cat-corrective-categories', 'corrective-action-category-safety', 'Safety', 'Safety-related corrective actions', 1),
  createEntry('cac-2', 'cat-corrective-categories', 'corrective-action-category-environmental', 'Environmental', 'Environmental compliance corrective actions', 2),
  createEntry('cac-3', 'cat-corrective-categories', 'corrective-action-category-quality', 'Quality', 'Quality assurance corrective actions', 3),
  createEntry('cac-4', 'cat-corrective-categories', 'corrective-action-category-operational', 'Operational', 'Operational improvement corrective actions', 4),
  createEntry('cac-5', 'cat-corrective-categories', 'corrective-action-category-regulatory', 'Regulatory', 'Regulatory compliance corrective actions', 5),
]

// =============================================================================
// CORRECTIVE ACTION TYPES
// =============================================================================

export const mockCorrectiveActionTypeEntries: DictionaryEntry[] = [
  createEntry('cat-1', 'cat-corrective-types', 'corrective-action-type-immediate', 'Immediate Action', 'Immediate corrective action to address urgent issues', 1),
  createEntry('cat-2', 'cat-corrective-types', 'corrective-action-type-corrective', 'Corrective Action', 'Action to eliminate the cause of a detected nonconformity', 2),
  createEntry('cat-3', 'cat-corrective-types', 'corrective-action-type-preventive', 'Preventive Action', 'Action to eliminate the cause of a potential nonconformity', 3),
  createEntry('cat-4', 'cat-corrective-types', 'corrective-action-type-improvement', 'Improvement Action', 'Action to improve processes or systems', 4),
]

// =============================================================================
// EFFECTIVENESS ASSESSMENT
// =============================================================================

export const mockEffectivenessEntries: DictionaryEntry[] = [
  createEntry('eff-1', 'cat-effectiveness', 'effectiveness-assessment-not-assessed', 'Not Assessed', 'Effectiveness has not been assessed yet', 1),
  createEntry('eff-2', 'cat-effectiveness', 'effectiveness-assessment-ineffective', 'Ineffective', 'Action was not effective in addressing the issue', 2),
  createEntry('eff-3', 'cat-effectiveness', 'effectiveness-assessment-partially-effective', 'Partially Effective', 'Action was partially effective', 3),
  createEntry('eff-4', 'cat-effectiveness', 'effectiveness-assessment-effective', 'Effective', 'Action was effective in addressing the issue', 4),
  createEntry('eff-5', 'cat-effectiveness', 'effectiveness-assessment-highly-effective', 'Highly Effective', 'Action exceeded expectations in effectiveness', 5),
]

// =============================================================================
// BODY PARTS AFFECTED
// =============================================================================

export const mockBodyPartEntries: DictionaryEntry[] = [
  createEntry('bp-1', 'cat-body-parts', 'body-part-affected-head', 'Head', 'Head injury or trauma', 1),
  createEntry('bp-2', 'cat-body-parts', 'body-part-affected-eyes', 'Eyes', 'Eye injury or exposure', 2),
  createEntry('bp-3', 'cat-body-parts', 'body-part-affected-ears', 'Ears', 'Ear injury or hearing damage', 3),
  createEntry('bp-4', 'cat-body-parts', 'body-part-affected-neck', 'Neck', 'Neck injury or strain', 4),
  createEntry('bp-5', 'cat-body-parts', 'body-part-affected-back', 'Back', 'Back injury or strain', 5),
  createEntry('bp-6', 'cat-body-parts', 'body-part-affected-chest', 'Chest', 'Chest injury or trauma', 6),
  createEntry('bp-7', 'cat-body-parts', 'body-part-affected-shoulder', 'Shoulder', 'Shoulder injury or strain', 7),
  createEntry('bp-8', 'cat-body-parts', 'body-part-affected-arm', 'Arm', 'Arm injury', 8),
  createEntry('bp-9', 'cat-body-parts', 'body-part-affected-hand', 'Hand', 'Hand injury', 9),
  createEntry('bp-10', 'cat-body-parts', 'body-part-affected-fingers', 'Fingers', 'Finger injury', 10),
  createEntry('bp-11', 'cat-body-parts', 'body-part-affected-leg', 'Leg', 'Leg injury', 11),
  createEntry('bp-12', 'cat-body-parts', 'body-part-affected-knee', 'Knee', 'Knee injury', 12),
  createEntry('bp-13', 'cat-body-parts', 'body-part-affected-foot', 'Foot', 'Foot injury', 13),
  createEntry('bp-14', 'cat-body-parts', 'body-part-affected-multiple', 'Multiple Body Parts', 'Multiple body parts affected', 14),
]

// =============================================================================
// INJURY/ILLNESS TYPES
// =============================================================================

export const mockInjuryIllnessTypeEntries: DictionaryEntry[] = [
  // Root level entries
  createEntry('iit-1', 'cat-injury-illness-types', 'injury-illness-type-cut-laceration', 'Cut/Laceration', 'Cut, laceration, or puncture wound', 1),
  // Children of Cut/Laceration (demonstrates hierarchy)
  createEntry('iit-1a', 'cat-injury-illness-types', 'injury-illness-type-cut-minor', 'Minor Cut', 'Superficial cut requiring basic first aid', 1, 'active', true, 'iit-1'),
  createEntry('iit-1b', 'cat-injury-illness-types', 'injury-illness-type-cut-deep', 'Deep Laceration', 'Deep cut requiring medical attention', 2, 'active', true, 'iit-1'),
  // Grandchildren of Cut/Laceration (3rd level - max depth)
  createEntry('iit-1b1', 'cat-injury-illness-types', 'injury-illness-type-cut-deep-sutures', 'Requires Sutures', 'Deep laceration requiring stitches', 1, 'active', true, 'iit-1b'),
  createEntry('iit-1b2', 'cat-injury-illness-types', 'injury-illness-type-cut-deep-surgery', 'Requires Surgery', 'Severe laceration requiring surgical intervention', 2, 'active', true, 'iit-1b'),

  createEntry('iit-2', 'cat-injury-illness-types', 'injury-illness-type-bruise-contusion', 'Bruise/Contusion', 'Bruise, contusion, or crushing injury', 2),
  createEntry('iit-3', 'cat-injury-illness-types', 'injury-illness-type-sprain-strain', 'Sprain/Strain', 'Sprain, strain, or muscle tear', 3),
  createEntry('iit-4', 'cat-injury-illness-types', 'injury-illness-type-fracture', 'Fracture', 'Bone fracture or break', 4),
  // Children of Fracture
  createEntry('iit-4a', 'cat-injury-illness-types', 'injury-illness-type-fracture-simple', 'Simple Fracture', 'Clean break without skin penetration', 1, 'active', true, 'iit-4'),
  createEntry('iit-4b', 'cat-injury-illness-types', 'injury-illness-type-fracture-compound', 'Compound Fracture', 'Fracture with bone penetrating skin', 2, 'active', true, 'iit-4'),
  createEntry('iit-4c', 'cat-injury-illness-types', 'injury-illness-type-fracture-hairline', 'Hairline Fracture', 'Small crack in the bone', 3, 'active', true, 'iit-4'),

  createEntry('iit-5', 'cat-injury-illness-types', 'injury-illness-type-burn', 'Burn', 'Thermal, chemical, or electrical burn', 5),
  // Children of Burn
  createEntry('iit-5a', 'cat-injury-illness-types', 'injury-illness-type-burn-thermal', 'Thermal Burn', 'Burns caused by heat or fire', 1, 'active', true, 'iit-5'),
  createEntry('iit-5b', 'cat-injury-illness-types', 'injury-illness-type-burn-chemical', 'Chemical Burn', 'Burns caused by chemical exposure', 2, 'active', true, 'iit-5'),
  createEntry('iit-5c', 'cat-injury-illness-types', 'injury-illness-type-burn-electrical', 'Electrical Burn', 'Burns caused by electrical current', 3, 'active', true, 'iit-5'),

  createEntry('iit-6', 'cat-injury-illness-types', 'injury-illness-type-chemical-exposure', 'Chemical Exposure', 'Exposure to hazardous chemicals', 6),
  createEntry('iit-7', 'cat-injury-illness-types', 'injury-illness-type-respiratory', 'Respiratory Condition', 'Respiratory illness or condition', 7),
  createEntry('iit-8', 'cat-injury-illness-types', 'injury-illness-type-skin-disorder', 'Skin Disorder', 'Dermatitis or skin condition', 8),
  createEntry('iit-9', 'cat-injury-illness-types', 'injury-illness-type-hearing-loss', 'Hearing Loss', 'Noise-induced hearing loss', 9),
  createEntry('iit-10', 'cat-injury-illness-types', 'injury-illness-type-repetitive-motion', 'Repetitive Motion', 'Repetitive strain or motion injury', 10),
  createEntry('iit-11', 'cat-injury-illness-types', 'injury-illness-type-heat-cold', 'Heat/Cold Stress', 'Heat stroke, hypothermia, or frostbite', 11),
  createEntry('iit-12', 'cat-injury-illness-types', 'injury-illness-type-other', 'Other', 'Other injury or illness type', 12),
]

// =============================================================================
// INJURY SEVERITY LEVELS
// =============================================================================

export const mockInjurySeverityEntries: DictionaryEntry[] = [
  createEntry('isev-1', 'cat-injury-severity', 'injury-severity-first-aid', 'First Aid', 'Requires first aid treatment only', 1),
  createEntry('isev-2', 'cat-injury-severity', 'injury-severity-medical-treatment', 'Medical Treatment', 'Requires professional medical treatment', 2),
  createEntry('isev-3', 'cat-injury-severity', 'injury-severity-restricted-work', 'Restricted Work', 'Results in restricted work or job transfer', 3),
  createEntry('isev-4', 'cat-injury-severity', 'injury-severity-lost-time', 'Lost Time', 'Results in days away from work', 4),
  createEntry('isev-5', 'cat-injury-severity', 'injury-severity-fatality', 'Fatality', 'Results in death', 5),
]

// =============================================================================
// MEDICAL TREATMENT PROVIDERS
// =============================================================================

export const mockMedicalProviderEntries: DictionaryEntry[] = [
  createEntry('mp-1', 'cat-medical-providers', 'medical-treatment-provider-onsite-clinic', 'On-Site Clinic', 'Company on-site medical clinic', 1),
  createEntry('mp-2', 'cat-medical-providers', 'medical-treatment-provider-occupational-health', 'Occupational Health Clinic', 'External occupational health provider', 2),
  createEntry('mp-3', 'cat-medical-providers', 'medical-treatment-provider-hospital-er', 'Hospital/ER', 'Hospital emergency room', 3),
  createEntry('mp-4', 'cat-medical-providers', 'medical-treatment-provider-urgent-care', 'Urgent Care', 'Urgent care facility', 4),
  createEntry('mp-5', 'cat-medical-providers', 'medical-treatment-provider-physician', 'Physician/Specialist', 'Private physician or specialist', 5),
  createEntry('mp-6', 'cat-medical-providers', 'medical-treatment-provider-ems', 'EMS/Ambulance', 'Emergency medical services', 6),
]

// =============================================================================
// ENVIRONMENTAL IMPACT SEVERITY
// =============================================================================

export const mockEnvImpactEntries: DictionaryEntry[] = [
  createEntry('eis-1', 'cat-env-impact', 'env-impact-severity-negligible', 'Negligible', 'No significant environmental impact', 1),
  createEntry('eis-2', 'cat-env-impact', 'env-impact-severity-minor', 'Minor', 'Minor environmental impact, easily remediated', 2),
  createEntry('eis-3', 'cat-env-impact', 'env-impact-severity-moderate', 'Moderate', 'Moderate impact requiring cleanup', 3),
  createEntry('eis-4', 'cat-env-impact', 'env-impact-severity-major', 'Major', 'Major environmental impact, significant remediation required', 4),
  createEntry('eis-5', 'cat-env-impact', 'env-impact-severity-catastrophic', 'Catastrophic', 'Severe, long-term environmental damage', 5),
]

// =============================================================================
// ENVIRONMENTAL RELEASE SOURCES
// =============================================================================

export const mockEnvReleaseSourceEntries: DictionaryEntry[] = [
  createEntry('ers-1', 'cat-env-release-sources', 'env-release-source-storage-tank', 'Storage Tank', 'Release from storage tank or vessel', 1),
  createEntry('ers-2', 'cat-env-release-sources', 'env-release-source-process-equipment', 'Process Equipment', 'Release from process equipment', 2),
  createEntry('ers-3', 'cat-env-release-sources', 'env-release-source-pipeline', 'Pipeline', 'Release from pipeline or transfer line', 3),
  createEntry('ers-4', 'cat-env-release-sources', 'env-release-source-loading-unloading', 'Loading/Unloading', 'Release during loading or unloading operations', 4),
  createEntry('ers-5', 'cat-env-release-sources', 'env-release-source-waste-treatment', 'Waste Treatment', 'Release from waste treatment systems', 5),
  createEntry('ers-6', 'cat-env-release-sources', 'env-release-source-stormwater', 'Stormwater', 'Release via stormwater discharge', 6),
  createEntry('ers-7', 'cat-env-release-sources', 'env-release-source-vehicle', 'Vehicle', 'Release from vehicle or mobile equipment', 7),
  createEntry('ers-8', 'cat-env-release-sources', 'env-release-source-other', 'Other', 'Other release source', 8),
]

// =============================================================================
// ENVIRONMENTAL RELEASE TYPES
// =============================================================================

export const mockEnvReleaseTypeEntries: DictionaryEntry[] = [
  createEntry('ert-1', 'cat-env-release-types', 'env-release-type-air', 'Air Emission', 'Release to atmosphere', 1),
  createEntry('ert-2', 'cat-env-release-types', 'env-release-type-water', 'Water Discharge', 'Release to water body', 2),
  createEntry('ert-3', 'cat-env-release-types', 'env-release-type-soil', 'Soil Contamination', 'Release to soil or ground', 3),
  createEntry('ert-4', 'cat-env-release-types', 'env-release-type-groundwater', 'Groundwater', 'Release affecting groundwater', 4),
  createEntry('ert-5', 'cat-env-release-types', 'env-release-type-spill', 'Spill/Leak', 'Contained spill or leak', 5),
  createEntry('ert-6', 'cat-env-release-types', 'env-release-type-noise', 'Noise', 'Excessive noise release', 6),
]

// =============================================================================
// INCIDENT ASSESSMENT
// =============================================================================

export const mockIncidentAssessmentEntries: DictionaryEntry[] = [
  createEntry('ia-1', 'cat-incident-assessment', 'incident-assessment-not-started', 'Not Started', 'Assessment has not been started', 1),
  createEntry('ia-2', 'cat-incident-assessment', 'incident-assessment-in-progress', 'In Progress', 'Assessment is currently in progress', 2),
  createEntry('ia-3', 'cat-incident-assessment', 'incident-assessment-pending-review', 'Pending Review', 'Assessment is pending review', 3),
  createEntry('ia-4', 'cat-incident-assessment', 'incident-assessment-complete', 'Complete', 'Assessment has been completed', 4),
]

// =============================================================================
// INCIDENT CLOSURE REASONS
// =============================================================================

export const mockIncidentClosureEntries: DictionaryEntry[] = [
  createEntry('icr-1', 'cat-incident-closure', 'incident-closure-reason-resolved', 'Resolved', 'Issue has been fully resolved', 1),
  createEntry('icr-2', 'cat-incident-closure', 'incident-closure-reason-no-action', 'No Action Required', 'Investigation determined no action needed', 2),
  createEntry('icr-3', 'cat-incident-closure', 'incident-closure-reason-duplicate', 'Duplicate', 'Incident is a duplicate of another record', 3),
  createEntry('icr-4', 'cat-incident-closure', 'incident-closure-reason-withdrawn', 'Withdrawn', 'Report was withdrawn', 4),
  createEntry('icr-5', 'cat-incident-closure', 'incident-closure-reason-transferred', 'Transferred', 'Transferred to another system or jurisdiction', 5),
]

// =============================================================================
// INCIDENT SEVERITY LEVELS
// =============================================================================

export const mockIncidentSeverityEntries: DictionaryEntry[] = [
  // Safety Severity
  createEntry('isv-1', 'cat-incident-severity', 'incident-severity-safety-1', 'Safety Level 1 - First Aid', 'Minor injury requiring first aid only', 1),
  createEntry('isv-2', 'cat-incident-severity', 'incident-severity-safety-2', 'Safety Level 2 - Medical Treatment', 'Injury requiring medical treatment', 2),
  createEntry('isv-3', 'cat-incident-severity', 'incident-severity-safety-3', 'Safety Level 3 - Lost Time', 'Injury resulting in lost work time', 3),
  createEntry('isv-4', 'cat-incident-severity', 'incident-severity-safety-4', 'Safety Level 4 - Permanent Disability', 'Injury resulting in permanent disability', 4),
  createEntry('isv-5', 'cat-incident-severity', 'incident-severity-safety-5', 'Safety Level 5 - Fatality', 'Incident resulting in fatality', 5),
  // Environmental Severity
  createEntry('isv-6', 'cat-incident-severity', 'incident-severity-env-1', 'Environmental Level 1 - Negligible', 'No environmental impact', 6),
  createEntry('isv-7', 'cat-incident-severity', 'incident-severity-env-2', 'Environmental Level 2 - Minor', 'Minor environmental impact', 7),
  createEntry('isv-8', 'cat-incident-severity', 'incident-severity-env-3', 'Environmental Level 3 - Moderate', 'Moderate environmental impact', 8),
  createEntry('isv-9', 'cat-incident-severity', 'incident-severity-env-4', 'Environmental Level 4 - Major', 'Major environmental impact', 9),
  createEntry('isv-10', 'cat-incident-severity', 'incident-severity-env-5', 'Environmental Level 5 - Catastrophic', 'Catastrophic environmental impact', 10),
  // Property/Asset Severity
  createEntry('isv-11', 'cat-incident-severity', 'incident-severity-prop-1', 'Property Level 1 - Under $1K', 'Property damage under $1,000', 11),
  createEntry('isv-12', 'cat-incident-severity', 'incident-severity-prop-2', 'Property Level 2 - $1K-$10K', 'Property damage $1,000 to $10,000', 12),
  createEntry('isv-13', 'cat-incident-severity', 'incident-severity-prop-3', 'Property Level 3 - $10K-$100K', 'Property damage $10,000 to $100,000', 13),
  createEntry('isv-14', 'cat-incident-severity', 'incident-severity-prop-4', 'Property Level 4 - $100K-$1M', 'Property damage $100,000 to $1M', 14),
  createEntry('isv-15', 'cat-incident-severity', 'incident-severity-prop-5', 'Property Level 5 - Over $1M', 'Property damage over $1M', 15),
  // Reputation/Business Severity
  createEntry('isv-16', 'cat-incident-severity', 'incident-severity-rep-1', 'Reputation Level 1 - Internal', 'Internal awareness only', 16),
  createEntry('isv-17', 'cat-incident-severity', 'incident-severity-rep-2', 'Reputation Level 2 - Local', 'Local community awareness', 17),
  createEntry('isv-18', 'cat-incident-severity', 'incident-severity-rep-3', 'Reputation Level 3 - Regional', 'Regional media coverage', 18),
  createEntry('isv-19', 'cat-incident-severity', 'incident-severity-rep-4', 'Reputation Level 4 - National', 'National media coverage', 19),
  createEntry('isv-20', 'cat-incident-severity', 'incident-severity-rep-5', 'Reputation Level 5 - International', 'International media coverage', 20),
  // Regulatory Severity
  createEntry('isv-21', 'cat-incident-severity', 'incident-severity-reg-1', 'Regulatory Level 1 - No Violation', 'No regulatory violation', 21),
  createEntry('isv-22', 'cat-incident-severity', 'incident-severity-reg-2', 'Regulatory Level 2 - Minor', 'Minor regulatory violation', 22),
  createEntry('isv-23', 'cat-incident-severity', 'incident-severity-reg-3', 'Regulatory Level 3 - Moderate', 'Moderate regulatory violation', 23),
  createEntry('isv-24', 'cat-incident-severity', 'incident-severity-reg-4', 'Regulatory Level 4 - Serious', 'Serious regulatory violation', 24),
  createEntry('isv-25', 'cat-incident-severity', 'incident-severity-reg-5', 'Regulatory Level 5 - Critical', 'Critical regulatory violation', 25),
]

// =============================================================================
// INCIDENT TYPES
// =============================================================================

export const mockIncidentTypeEntries: DictionaryEntry[] = [
  createEntry('it-1', 'cat-incident-types', 'incident-type-safety', 'Safety Incident', 'Workplace safety incident', 1),
  createEntry('it-2', 'cat-incident-types', 'incident-type-environmental', 'Environmental Incident', 'Environmental release or impact', 2),
  createEntry('it-3', 'cat-incident-types', 'incident-type-near-miss', 'Near Miss', 'Near miss or close call event', 3),
  createEntry('it-4', 'cat-incident-types', 'incident-type-property', 'Property Damage', 'Property or equipment damage', 4),
  createEntry('it-5', 'cat-incident-types', 'incident-type-security', 'Security Incident', 'Security breach or incident', 5),
  createEntry('it-6', 'cat-incident-types', 'incident-type-process-safety', 'Process Safety Event', 'Process safety incident', 6),
]

// =============================================================================
// DEPARTMENTS
// =============================================================================

export const mockDepartmentEntries: DictionaryEntry[] = [
  createEntry('dept-1', 'cat-departments', 'department-operations', 'Operations', 'Operations department', 1),
  createEntry('dept-2', 'cat-departments', 'department-maintenance', 'Maintenance', 'Maintenance department', 2),
  createEntry('dept-3', 'cat-departments', 'department-safety', 'Safety', 'Safety and compliance department', 3),
  createEntry('dept-4', 'cat-departments', 'department-hr', 'Human Resources', 'Human resources department', 4),
  createEntry('dept-5', 'cat-departments', 'department-engineering', 'Engineering', 'Engineering department', 5),
  createEntry('dept-6', 'cat-departments', 'department-quality', 'Quality Assurance', 'Quality assurance department', 6),
  createEntry('dept-7', 'cat-departments', 'department-environment', 'Environmental', 'Environmental compliance department', 7),
  createEntry('dept-8', 'cat-departments', 'department-admin', 'Administration', 'Administration department', 8),
]

// =============================================================================
// LOCATION ACCESS LEVELS
// =============================================================================

export const mockLocationAccessEntries: DictionaryEntry[] = [
  createEntry('lal-1', 'cat-location-access', 'location-access-level-public', 'Public', 'Publicly accessible area', 1),
  createEntry('lal-2', 'cat-location-access', 'location-access-level-employee', 'Employee Only', 'Restricted to employees', 2),
  createEntry('lal-3', 'cat-location-access', 'location-access-level-authorized', 'Authorized Personnel', 'Requires specific authorization', 3),
  createEntry('lal-4', 'cat-location-access', 'location-access-level-restricted', 'Restricted', 'Highly restricted access', 4),
  createEntry('lal-5', 'cat-location-access', 'location-access-level-secured', 'Secured', 'Maximum security area', 5),
]

// =============================================================================
// LOCATION TYPES
// =============================================================================

export const mockLocationTypeEntries: DictionaryEntry[] = [
  createEntry('lt-1', 'cat-location-types', 'location-type-corporate', 'Corporate Office', 'Corporate headquarters or office', 1),
  createEntry('lt-2', 'cat-location-types', 'location-type-manufacturing', 'Manufacturing Plant', 'Manufacturing or production facility', 2),
  createEntry('lt-3', 'cat-location-types', 'location-type-warehouse', 'Warehouse', 'Storage or distribution warehouse', 3),
  createEntry('lt-4', 'cat-location-types', 'location-type-field', 'Field Location', 'Field or remote work site', 4),
  createEntry('lt-5', 'cat-location-types', 'location-type-lab', 'Laboratory', 'Research or testing laboratory', 5),
  createEntry('lt-6', 'cat-location-types', 'location-type-retail', 'Retail Location', 'Customer-facing retail location', 6),
  createEntry('lt-7', 'cat-location-types', 'location-type-datacenter', 'Data Center', 'IT infrastructure facility', 7),
]

// =============================================================================
// PROCESS SAFETY INCIDENT TYPES
// =============================================================================

export const mockProcessSafetyEntries: DictionaryEntry[] = [
  createEntry('psi-1', 'cat-process-safety', 'process-safety-incident-type-fire', 'Fire', 'Process-related fire', 1),
  createEntry('psi-2', 'cat-process-safety', 'process-safety-incident-type-explosion', 'Explosion', 'Process-related explosion', 2),
  createEntry('psi-3', 'cat-process-safety', 'process-safety-incident-type-toxic-release', 'Toxic Release', 'Release of toxic materials', 3),
  createEntry('psi-4', 'cat-process-safety', 'process-safety-incident-type-loss-of-containment', 'Loss of Containment', 'Uncontrolled release from containment', 4),
  createEntry('psi-5', 'cat-process-safety', 'process-safety-incident-type-runaway-reaction', 'Runaway Reaction', 'Uncontrolled chemical reaction', 5),
  createEntry('psi-6', 'cat-process-safety', 'process-safety-incident-type-equipment-failure', 'Equipment Failure', 'Critical equipment failure', 6),
  createEntry('psi-7', 'cat-process-safety', 'process-safety-incident-type-overpressure', 'Overpressure Event', 'Pressure exceeding design limits', 7),
  createEntry('psi-8', 'cat-process-safety', 'process-safety-incident-type-near-miss', 'Process Safety Near Miss', 'Near miss with process safety implications', 8),
  createEntry('psi-9', 'cat-process-safety', 'process-safety-incident-type-safety-system', 'Safety System Activation', 'Emergency safety system activated', 9),
  createEntry('psi-10', 'cat-process-safety', 'process-safety-incident-type-other', 'Other', 'Other process safety incident', 10),
]

// =============================================================================
// QUALITY ISSUE TYPES
// =============================================================================

export const mockQualityIssueEntries: DictionaryEntry[] = [
  createEntry('qi-1', 'cat-quality-issues', 'quality-issue-type-defect', 'Product Defect', 'Defective product or component', 1),
  createEntry('qi-2', 'cat-quality-issues', 'quality-issue-type-nonconformance', 'Nonconformance', 'Deviation from specifications', 2),
  createEntry('qi-3', 'cat-quality-issues', 'quality-issue-type-customer-complaint', 'Customer Complaint', 'Customer-reported quality issue', 3),
  createEntry('qi-4', 'cat-quality-issues', 'quality-issue-type-audit-finding', 'Audit Finding', 'Finding from quality audit', 4),
  createEntry('qi-5', 'cat-quality-issues', 'quality-issue-type-supplier', 'Supplier Issue', 'Quality issue from supplier', 5),
  createEntry('qi-6', 'cat-quality-issues', 'quality-issue-type-process-deviation', 'Process Deviation', 'Deviation from standard process', 6),
  createEntry('qi-7', 'cat-quality-issues', 'quality-issue-type-documentation', 'Documentation Error', 'Missing or incorrect documentation', 7),
  createEntry('qi-8', 'cat-quality-issues', 'quality-issue-type-calibration', 'Calibration Issue', 'Equipment calibration problem', 8),
  createEntry('qi-9', 'cat-quality-issues', 'quality-issue-type-training', 'Training Gap', 'Training deficiency identified', 9),
]

// =============================================================================
// RCA METHODOLOGIES
// =============================================================================

export const mockRCAMethodologyEntries: DictionaryEntry[] = [
  createEntry('rca-1', 'cat-rca-methodologies', 'rca-methodology-5-why', '5 Why Analysis', 'Iterative questioning technique to identify root cause', 1),
  createEntry('rca-2', 'cat-rca-methodologies', 'rca-methodology-fishbone', 'Fishbone Diagram', 'Ishikawa cause-and-effect diagram', 2),
  createEntry('rca-3', 'cat-rca-methodologies', 'rca-methodology-fault-tree', 'Fault Tree Analysis', 'Top-down deductive failure analysis', 3),
  createEntry('rca-4', 'cat-rca-methodologies', 'rca-methodology-taproot', 'TapRooT', 'Systematic root cause analysis process', 4),
  createEntry('rca-5', 'cat-rca-methodologies', 'rca-methodology-apollo', 'Apollo Root Cause', 'Evidence-based problem solving', 5),
  createEntry('rca-6', 'cat-rca-methodologies', 'rca-methodology-kepner-tregoe', 'Kepner-Tregoe', 'Structured problem analysis method', 6),
]

// =============================================================================
// ROOT CAUSE CATEGORIES
// =============================================================================

export const mockRootCauseCategoryEntries: DictionaryEntry[] = [
  createEntry('rcc-1', 'cat-root-cause-categories', 'root-cause-category-human', 'Human Factors', 'Human error, training, or behavioral factors', 1),
  createEntry('rcc-2', 'cat-root-cause-categories', 'root-cause-category-equipment', 'Equipment', 'Equipment failure or maintenance issues', 2),
  createEntry('rcc-3', 'cat-root-cause-categories', 'root-cause-category-process', 'Process/Procedure', 'Process or procedure deficiency', 3),
  createEntry('rcc-4', 'cat-root-cause-categories', 'root-cause-category-management', 'Management System', 'Management system or oversight failure', 4),
  createEntry('rcc-5', 'cat-root-cause-categories', 'root-cause-category-design', 'Design', 'Design deficiency or inadequacy', 5),
  createEntry('rcc-6', 'cat-root-cause-categories', 'root-cause-category-external', 'External Factors', 'External or environmental factors', 6),
]

// =============================================================================
// SECURITY INCIDENT TYPES
// =============================================================================

export const mockSecurityIncidentEntries: DictionaryEntry[] = [
  createEntry('si-1', 'cat-security-incidents', 'security-incident-type-unauthorized-access', 'Unauthorized Access', 'Unauthorized entry to facility or area', 1),
  createEntry('si-2', 'cat-security-incidents', 'security-incident-type-theft', 'Theft', 'Theft of property or materials', 2),
  createEntry('si-3', 'cat-security-incidents', 'security-incident-type-vandalism', 'Vandalism', 'Intentional property damage', 3),
  createEntry('si-4', 'cat-security-incidents', 'security-incident-type-cyber', 'Cyber Incident', 'Cybersecurity breach or attack', 4),
  createEntry('si-5', 'cat-security-incidents', 'security-incident-type-threat', 'Threat', 'Verbal or written threat', 5),
  createEntry('si-6', 'cat-security-incidents', 'security-incident-type-workplace-violence', 'Workplace Violence', 'Violence or aggression at workplace', 6),
  createEntry('si-7', 'cat-security-incidents', 'security-incident-type-suspicious-activity', 'Suspicious Activity', 'Suspicious person or activity', 7),
  createEntry('si-8', 'cat-security-incidents', 'security-incident-type-lost-badge', 'Lost/Stolen Badge', 'Lost or stolen access credentials', 8),
  createEntry('si-9', 'cat-security-incidents', 'security-incident-type-tailgating', 'Tailgating', 'Unauthorized following through secured entry', 9),
  createEntry('si-10', 'cat-security-incidents', 'security-incident-type-other', 'Other', 'Other security incident', 10),
]

// =============================================================================
// SECURITY LEVELS
// =============================================================================

export const mockSecurityLevelEntries: DictionaryEntry[] = [
  createEntry('sl-1', 'cat-security-levels', 'security-level-public', 'Public', 'Public information', 1),
  createEntry('sl-2', 'cat-security-levels', 'security-level-internal', 'Internal', 'Internal use only', 2),
  createEntry('sl-3', 'cat-security-levels', 'security-level-confidential', 'Confidential', 'Confidential information', 3),
  createEntry('sl-4', 'cat-security-levels', 'security-level-restricted', 'Restricted', 'Highly restricted information', 4),
]

// =============================================================================
// PRIORITY LEVELS
// =============================================================================

export const mockPriorityLevelEntries: DictionaryEntry[] = [
  createEntry('pl-1', 'cat-priority-levels', 'priority-level-low', 'Low', 'Low priority - address when convenient', 1),
  createEntry('pl-2', 'cat-priority-levels', 'priority-level-medium', 'Medium', 'Medium priority - address within standard timeframe', 2),
  createEntry('pl-3', 'cat-priority-levels', 'priority-level-high', 'High', 'High priority - address promptly', 3),
  createEntry('pl-4', 'cat-priority-levels', 'priority-level-critical', 'Critical', 'Critical priority - immediate action required', 4),
]

// =============================================================================
// SOURCE TYPES
// =============================================================================

export const mockSourceTypeEntries: DictionaryEntry[] = [
  createEntry('st-1', 'cat-source-types', 'source-type-employee', 'Employee Report', 'Reported by employee', 1),
  createEntry('st-2', 'cat-source-types', 'source-type-supervisor', 'Supervisor Observation', 'Observed by supervisor', 2),
  createEntry('st-3', 'cat-source-types', 'source-type-audit', 'Audit Finding', 'Identified during audit', 3),
  createEntry('st-4', 'cat-source-types', 'source-type-inspection', 'Inspection', 'Found during inspection', 4),
  createEntry('st-5', 'cat-source-types', 'source-type-contractor', 'Contractor Report', 'Reported by contractor', 5),
  createEntry('st-6', 'cat-source-types', 'source-type-external', 'External Report', 'Reported by external party', 6),
]

// =============================================================================
// TIMEZONES (Common ones)
// =============================================================================

export const mockTimezoneEntries: DictionaryEntry[] = [
  // Americas
  createEntry('tz-1', 'cat-timezones', 'timezone-america-new_york', 'America/New_York', 'Eastern Time (US & Canada)', 1),
  createEntry('tz-2', 'cat-timezones', 'timezone-america-chicago', 'America/Chicago', 'Central Time (US & Canada)', 2),
  createEntry('tz-3', 'cat-timezones', 'timezone-america-denver', 'America/Denver', 'Mountain Time (US & Canada)', 3),
  createEntry('tz-4', 'cat-timezones', 'timezone-america-los_angeles', 'America/Los_Angeles', 'Pacific Time (US & Canada)', 4),
  createEntry('tz-5', 'cat-timezones', 'timezone-america-anchorage', 'America/Anchorage', 'Alaska Time', 5),
  createEntry('tz-6', 'cat-timezones', 'timezone-pacific-honolulu', 'Pacific/Honolulu', 'Hawaii Time', 6),
  createEntry('tz-7', 'cat-timezones', 'timezone-america-phoenix', 'America/Phoenix', 'Arizona Time', 7),
  createEntry('tz-8', 'cat-timezones', 'timezone-america-toronto', 'America/Toronto', 'Eastern Time (Canada)', 8),
  createEntry('tz-9', 'cat-timezones', 'timezone-america-vancouver', 'America/Vancouver', 'Pacific Time (Canada)', 9),
  createEntry('tz-10', 'cat-timezones', 'timezone-america-mexico_city', 'America/Mexico_City', 'Central Time (Mexico)', 10),
  createEntry('tz-11', 'cat-timezones', 'timezone-america-sao_paulo', 'America/Sao_Paulo', 'Brasilia Time', 11),
  createEntry('tz-12', 'cat-timezones', 'timezone-america-buenos_aires', 'America/Buenos_Aires', 'Argentina Time', 12),
  // Europe
  createEntry('tz-13', 'cat-timezones', 'timezone-europe-london', 'Europe/London', 'Greenwich Mean Time / British Summer Time', 13),
  createEntry('tz-14', 'cat-timezones', 'timezone-europe-paris', 'Europe/Paris', 'Central European Time', 14),
  createEntry('tz-15', 'cat-timezones', 'timezone-europe-berlin', 'Europe/Berlin', 'Central European Time', 15),
  createEntry('tz-16', 'cat-timezones', 'timezone-europe-amsterdam', 'Europe/Amsterdam', 'Central European Time', 16),
  createEntry('tz-17', 'cat-timezones', 'timezone-europe-madrid', 'Europe/Madrid', 'Central European Time', 17),
  createEntry('tz-18', 'cat-timezones', 'timezone-europe-rome', 'Europe/Rome', 'Central European Time', 18),
  createEntry('tz-19', 'cat-timezones', 'timezone-europe-moscow', 'Europe/Moscow', 'Moscow Time', 19),
  createEntry('tz-20', 'cat-timezones', 'timezone-europe-istanbul', 'Europe/Istanbul', 'Turkey Time', 20),
  // Asia
  createEntry('tz-21', 'cat-timezones', 'timezone-asia-dubai', 'Asia/Dubai', 'Gulf Standard Time', 21),
  createEntry('tz-22', 'cat-timezones', 'timezone-asia-kolkata', 'Asia/Kolkata', 'India Standard Time', 22),
  createEntry('tz-23', 'cat-timezones', 'timezone-asia-singapore', 'Asia/Singapore', 'Singapore Time', 23),
  createEntry('tz-24', 'cat-timezones', 'timezone-asia-shanghai', 'Asia/Shanghai', 'China Standard Time', 24),
  createEntry('tz-25', 'cat-timezones', 'timezone-asia-hong_kong', 'Asia/Hong_Kong', 'Hong Kong Time', 25),
  createEntry('tz-26', 'cat-timezones', 'timezone-asia-tokyo', 'Asia/Tokyo', 'Japan Standard Time', 26),
  createEntry('tz-27', 'cat-timezones', 'timezone-asia-seoul', 'Asia/Seoul', 'Korea Standard Time', 27),
  createEntry('tz-28', 'cat-timezones', 'timezone-asia-jakarta', 'Asia/Jakarta', 'Western Indonesia Time', 28),
  createEntry('tz-29', 'cat-timezones', 'timezone-asia-manila', 'Asia/Manila', 'Philippine Time', 29),
  createEntry('tz-30', 'cat-timezones', 'timezone-asia-bangkok', 'Asia/Bangkok', 'Indochina Time', 30),
  // Australia/Pacific
  createEntry('tz-31', 'cat-timezones', 'timezone-australia-sydney', 'Australia/Sydney', 'Australian Eastern Time', 31),
  createEntry('tz-32', 'cat-timezones', 'timezone-australia-melbourne', 'Australia/Melbourne', 'Australian Eastern Time', 32),
  createEntry('tz-33', 'cat-timezones', 'timezone-australia-brisbane', 'Australia/Brisbane', 'Australian Eastern Time (No DST)', 33),
  createEntry('tz-34', 'cat-timezones', 'timezone-australia-perth', 'Australia/Perth', 'Australian Western Time', 34),
  createEntry('tz-35', 'cat-timezones', 'timezone-pacific-auckland', 'Pacific/Auckland', 'New Zealand Time', 35),
  // Africa
  createEntry('tz-36', 'cat-timezones', 'timezone-africa-johannesburg', 'Africa/Johannesburg', 'South Africa Standard Time', 36),
  createEntry('tz-37', 'cat-timezones', 'timezone-africa-cairo', 'Africa/Cairo', 'Eastern European Time', 37),
  createEntry('tz-38', 'cat-timezones', 'timezone-africa-lagos', 'Africa/Lagos', 'West Africa Time', 38),
  createEntry('tz-39', 'cat-timezones', 'timezone-africa-nairobi', 'Africa/Nairobi', 'East Africa Time', 39),
  // UTC
  createEntry('tz-40', 'cat-timezones', 'timezone-utc', 'UTC', 'Coordinated Universal Time', 40),
  // Additional US zones
  createEntry('tz-41', 'cat-timezones', 'timezone-america-detroit', 'America/Detroit', 'Eastern Time (Michigan)', 41),
  createEntry('tz-42', 'cat-timezones', 'timezone-america-indiana-indianapolis', 'America/Indiana/Indianapolis', 'Eastern Time (Indiana)', 42),
  createEntry('tz-43', 'cat-timezones', 'timezone-america-boise', 'America/Boise', 'Mountain Time (Idaho)', 43),
  // Additional European zones
  createEntry('tz-44', 'cat-timezones', 'timezone-europe-zurich', 'Europe/Zurich', 'Central European Time', 44),
  createEntry('tz-45', 'cat-timezones', 'timezone-europe-vienna', 'Europe/Vienna', 'Central European Time', 45),
  createEntry('tz-46', 'cat-timezones', 'timezone-europe-warsaw', 'Europe/Warsaw', 'Central European Time', 46),
  createEntry('tz-47', 'cat-timezones', 'timezone-europe-stockholm', 'Europe/Stockholm', 'Central European Time', 47),
  createEntry('tz-48', 'cat-timezones', 'timezone-europe-dublin', 'Europe/Dublin', 'Greenwich Mean Time / Irish Standard Time', 48),
  createEntry('tz-49', 'cat-timezones', 'timezone-europe-lisbon', 'Europe/Lisbon', 'Western European Time', 49),
  createEntry('tz-50', 'cat-timezones', 'timezone-europe-athens', 'Europe/Athens', 'Eastern European Time', 50),
]

// =============================================================================
// CUSTOM PRIORITIES (Organization-specific example)
// =============================================================================

export const mockCustomPriorityEntries: DictionaryEntry[] = [
  createEntry('cp-1', 'cat-custom-priorities', 'custom-priority-routine', 'Routine', 'Routine priority - standard timeline', 1, 'active', false),
  createEntry('cp-2', 'cat-custom-priorities', 'custom-priority-elevated', 'Elevated', 'Elevated priority - expedited timeline', 2, 'active', false),
  createEntry('cp-3', 'cat-custom-priorities', 'custom-priority-urgent', 'Urgent', 'Urgent priority - immediate attention', 3, 'active', false),
  createEntry('cp-4', 'cat-custom-priorities', 'custom-priority-emergency', 'Emergency', 'Emergency priority - drop everything', 4, 'active', false),
]

// =============================================================================
// HELPER: Get entries by category
// =============================================================================

const entriesByCategoryId: Record<string, DictionaryEntry[]> = {
  'cat-action-types': mockActionTypeEntries,
  'cat-corrective-categories': mockCorrectiveActionCategoryEntries,
  'cat-corrective-types': mockCorrectiveActionTypeEntries,
  'cat-effectiveness': mockEffectivenessEntries,
  'cat-body-parts': mockBodyPartEntries,
  'cat-injury-illness-types': mockInjuryIllnessTypeEntries,
  'cat-injury-severity': mockInjurySeverityEntries,
  'cat-medical-providers': mockMedicalProviderEntries,
  'cat-env-impact': mockEnvImpactEntries,
  'cat-env-release-sources': mockEnvReleaseSourceEntries,
  'cat-env-release-types': mockEnvReleaseTypeEntries,
  'cat-incident-assessment': mockIncidentAssessmentEntries,
  'cat-incident-closure': mockIncidentClosureEntries,
  'cat-incident-severity': mockIncidentSeverityEntries,
  'cat-incident-types': mockIncidentTypeEntries,
  'cat-departments': mockDepartmentEntries,
  'cat-location-access': mockLocationAccessEntries,
  'cat-location-types': mockLocationTypeEntries,
  'cat-process-safety': mockProcessSafetyEntries,
  'cat-quality-issues': mockQualityIssueEntries,
  'cat-rca-methodologies': mockRCAMethodologyEntries,
  'cat-root-cause-categories': mockRootCauseCategoryEntries,
  'cat-security-incidents': mockSecurityIncidentEntries,
  'cat-security-levels': mockSecurityLevelEntries,
  'cat-priority-levels': mockPriorityLevelEntries,
  'cat-source-types': mockSourceTypeEntries,
  'cat-timezones': mockTimezoneEntries,
  'cat-custom-priorities': mockCustomPriorityEntries,
}

export function getEntriesByCategoryId(categoryId: string): DictionaryEntry[] {
  return entriesByCategoryId[categoryId] || []
}

// =============================================================================
// HELPER: Get all entries
// =============================================================================

export const mockAllEntries: DictionaryEntry[] = Object.values(entriesByCategoryId).flat()

// =============================================================================
// HELPER: Get entries by category code (for use in forms/dropdowns)
// =============================================================================

const categoryCodeToCategoryId: Record<string, string> = {
  'ACTION_TYPE': 'cat-action-types',
  'corrective-action-category': 'cat-corrective-categories',
  'corrective-action-type': 'cat-corrective-types',
  'effectiveness-assessment': 'cat-effectiveness',
  'body-part-affected': 'cat-body-parts',
  'injury-illness-type': 'cat-injury-illness-types',
  'injury-severity': 'cat-injury-severity',
  'medical-treatment-provider': 'cat-medical-providers',
  'env-impact-severity': 'cat-env-impact',
  'env-release-source': 'cat-env-release-sources',
  'env-release-type': 'cat-env-release-types',
  'incident-assessment': 'cat-incident-assessment',
  'incident-closure-reason': 'cat-incident-closure',
  'incident-severity': 'cat-incident-severity',
  'incident-type': 'cat-incident-types',
  'department': 'cat-departments',
  'location-access-level': 'cat-location-access',
  'location-type': 'cat-location-types',
  'process-safety-incident-type': 'cat-process-safety',
  'quality-issue-type': 'cat-quality-issues',
  'rca-methodology': 'cat-rca-methodologies',
  'root-cause-category': 'cat-root-cause-categories',
  'security-incident-type': 'cat-security-incidents',
  'security-level': 'cat-security-levels',
  'priority-level': 'cat-priority-levels',
  'source-type': 'cat-source-types',
  'timezone': 'cat-timezones',
  'custom-priority': 'cat-custom-priorities',
}

/**
 * Get dictionary entries by category code.
 * Useful for populating dropdown options in forms.
 *
 * @example
 * const departments = getEntriesByCategoryCode('department')
 * const priorities = getEntriesByCategoryCode('priority-level')
 */
export function getEntriesByCategoryCode(categoryCode: string): DictionaryEntry[] {
  const categoryId = categoryCodeToCategoryId[categoryCode]
  if (!categoryId) return []
  return getEntriesByCategoryId(categoryId)
}

/**
 * Get active entries only for a category code.
 * Filters out inactive entries for use in production forms.
 */
export function getActiveEntriesByCategoryCode(categoryCode: string): DictionaryEntry[] {
  return getEntriesByCategoryCode(categoryCode).filter((entry) => entry.status === 'active')
}

/**
 * Convert dictionary entries to select options format.
 * Useful for Select/Dropdown components.
 *
 * @example
 * const options = toSelectOptions(getEntriesByCategoryCode('department'))
 * // Returns: [{ value: 'dept-1', label: 'Operations' }, ...]
 */
export function toSelectOptions(
  entries: DictionaryEntry[]
): Array<{ value: string; label: string }> {
  return entries
    .filter((e) => e.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      value: entry.id,
      label: entry.value,
    }))
}

/**
 * Get a dictionary entry by its code.
 */
export function getEntryByCode(code: string): DictionaryEntry | undefined {
  return mockAllEntries.find((entry) => entry.code === code)
}

/**
 * Get a category by its code.
 */
export function getCategoryByCode(code: string): DictionaryCategory | undefined {
  return mockCategories.find((cat) => cat.code === code)
}
