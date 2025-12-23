/**
 * Incident Reporting Types
 *
 * Shared types for the incident reporting wizard flow.
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

export const INCIDENT_CATEGORIES = [
  { value: 'injury', label: 'Injury' },
  { value: 'near_miss', label: 'Near Miss' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'equipment', label: 'Equipment Damage' },
  { value: 'chemical', label: 'Chemical Spill' },
  { value: 'fire', label: 'Fire/Explosion' },
  { value: 'other', label: 'Other' },
] as const

export const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: 'error' },
  { value: 'high', label: 'High', color: 'aging' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'low', label: 'Low', color: 'success' },
] as const

export type IncidentCategory = typeof INCIDENT_CATEGORIES[number]['value']
export type SeverityLevel = typeof SEVERITY_LEVELS[number]['value']

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface IncidentFormData {
  // Step 1: Classification
  category: IncidentCategory | ''
  severity: SeverityLevel | ''
  title: string

  // Step 2: Description
  description: string
  immediateActions: string

  // Step 3: Location & Time
  location: string
  locationCode: string
  dateTime: string
  /** Precise marker position on floor plan (x, y as percentages) */
  precisionMarker?: {
    x: number
    y: number
    description?: string
  }

  // Step 4: Impact Assessment
  injuryInvolved: boolean
  medicalAttention: boolean
  witnesses: string[]

  // Step 5: Evidence
  photos: File[]
  additionalNotes: string
}

export const DEFAULT_FORM_DATA: IncidentFormData = {
  category: '',
  severity: '',
  title: '',
  description: '',
  immediateActions: '',
  location: '',
  locationCode: '',
  dateTime: new Date().toISOString().slice(0, 16), // Default to now
  injuryInvolved: false,
  medicalAttention: false,
  witnesses: [],
  photos: [],
  additionalNotes: '',
}

// =============================================================================
// WIZARD STEP DEFINITIONS
// =============================================================================

export const INCIDENT_WIZARD_STEPS = [
  { id: 'classification', label: 'Classification', description: 'What type of incident?' },
  { id: 'description', label: 'Description', description: 'What happened?' },
  { id: 'location', label: 'Location & Time', description: 'Where and when?' },
  { id: 'impact', label: 'Impact', description: 'Who was affected?' },
  { id: 'evidence', label: 'Review & Submit', description: 'Attach evidence' },
] as const

// =============================================================================
// COMPONENT PROPS (base types only - full props in component files)
// =============================================================================

export interface LocationOption {
  value: string
  label: string
  group?: string
  /** URL to floor plan image for precise indoor marking */
  floorPlanImage?: string
}

// =============================================================================
// STEP PROPS
// =============================================================================

export interface StepProps {
  /** Current form data */
  data: IncidentFormData
  /** Update form data */
  onUpdate: (updates: Partial<IncidentFormData>) => void
  /** Available locations (for LocationStep) */
  locations?: LocationOption[]
}
