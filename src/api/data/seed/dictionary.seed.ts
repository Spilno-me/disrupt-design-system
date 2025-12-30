/**
 * Dictionary Seed Data
 *
 * EHS domain lookup values organized by category.
 */

import type { DictionaryCategory, DictionaryEntry } from '../../types/dictionary.types'

/**
 * Seed dictionary categories
 */
export const seedDictionaryCategories: DictionaryCategory[] = [
  {
    id: 'cat-injury-types',
    name: 'Injury Types',
    code: 'injury_types',
    description: 'Types of workplace injuries for incident classification',
    type: 'system',
    itemCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-body-parts',
    name: 'Body Parts',
    code: 'body_parts',
    description: 'Body parts affected in injury incidents',
    type: 'system',
    itemCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-injury-severity',
    name: 'Injury Severity',
    code: 'injury_severity',
    description: 'Severity levels for injury classification',
    type: 'system',
    itemCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-incident-causes',
    name: 'Incident Causes',
    code: 'incident_causes',
    description: 'Root cause categories for incident analysis',
    type: 'system',
    itemCount: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-corrective-actions',
    name: 'Corrective Action Types',
    code: 'corrective_actions',
    description: 'Types of corrective actions for incident resolution',
    type: 'system',
    itemCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-ppe-types',
    name: 'PPE Types',
    code: 'ppe_types',
    description: 'Personal protective equipment categories',
    type: 'system',
    itemCount: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-hazard-types',
    name: 'Hazard Types',
    code: 'hazard_types',
    description: 'Workplace hazard classifications',
    type: 'system',
    itemCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-equipment-types',
    name: 'Equipment Types',
    code: 'equipment_types',
    description: 'Industrial equipment categories',
    type: 'custom',
    itemCount: 6,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
]

/**
 * Raw seed data (without parentId)
 */
const _seedEntryData = [
  // ==========================================================================
  // INJURY TYPES
  // ==========================================================================
  { id: 'entry-it-1', categoryId: 'cat-injury-types', code: 'LACERATION', value: 'Laceration', description: 'Cut or tear in the skin', order: 1, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-2', categoryId: 'cat-injury-types', code: 'CONTUSION', value: 'Contusion/Bruise', description: 'Bruising from impact', order: 2, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-3', categoryId: 'cat-injury-types', code: 'FRACTURE', value: 'Fracture', description: 'Broken bone', order: 3, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-4', categoryId: 'cat-injury-types', code: 'SPRAIN', value: 'Sprain/Strain', description: 'Ligament or muscle injury', order: 4, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-5', categoryId: 'cat-injury-types', code: 'BURN', value: 'Burn', description: 'Thermal, chemical, or electrical burn', order: 5, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-6', categoryId: 'cat-injury-types', code: 'AMPUTATION', value: 'Amputation', description: 'Loss of body part', order: 6, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-7', categoryId: 'cat-injury-types', code: 'CRUSH', value: 'Crush Injury', description: 'Injury from crushing force', order: 7, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-it-8', categoryId: 'cat-injury-types', code: 'OTHER', value: 'Other', description: 'Other injury type', order: 8, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ==========================================================================
  // BODY PARTS
  // ==========================================================================
  { id: 'entry-bp-1', categoryId: 'cat-body-parts', code: 'HEAD', value: 'Head', order: 1, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-2', categoryId: 'cat-body-parts', code: 'FACE', value: 'Face', order: 2, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-3', categoryId: 'cat-body-parts', code: 'EYE', value: 'Eye(s)', order: 3, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-4', categoryId: 'cat-body-parts', code: 'NECK', value: 'Neck', order: 4, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-5', categoryId: 'cat-body-parts', code: 'SHOULDER', value: 'Shoulder', order: 5, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-6', categoryId: 'cat-body-parts', code: 'ARM', value: 'Arm', order: 6, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-7', categoryId: 'cat-body-parts', code: 'HAND', value: 'Hand/Finger', order: 7, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-8', categoryId: 'cat-body-parts', code: 'BACK', value: 'Back', order: 8, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-9', categoryId: 'cat-body-parts', code: 'CHEST', value: 'Chest', order: 9, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-10', categoryId: 'cat-body-parts', code: 'LEG', value: 'Leg', order: 10, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-11', categoryId: 'cat-body-parts', code: 'FOOT', value: 'Foot/Toe', order: 11, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-bp-12', categoryId: 'cat-body-parts', code: 'MULTIPLE', value: 'Multiple Body Parts', order: 12, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ==========================================================================
  // INJURY SEVERITY
  // ==========================================================================
  { id: 'entry-is-1', categoryId: 'cat-injury-severity', code: 'FIRST_AID', value: 'First Aid Only', description: 'Minor injury requiring only first aid', order: 1, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-is-2', categoryId: 'cat-injury-severity', code: 'MEDICAL', value: 'Medical Treatment', description: 'Requires medical treatment beyond first aid', order: 2, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-is-3', categoryId: 'cat-injury-severity', code: 'RESTRICTED', value: 'Restricted Work', description: 'Unable to perform regular duties', order: 3, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-is-4', categoryId: 'cat-injury-severity', code: 'LOST_TIME', value: 'Lost Time', description: 'Unable to work one or more days', order: 4, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-is-5', categoryId: 'cat-injury-severity', code: 'FATALITY', value: 'Fatality', description: 'Death resulting from injury', order: 5, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ==========================================================================
  // INCIDENT CAUSES
  // ==========================================================================
  { id: 'entry-ic-1', categoryId: 'cat-incident-causes', code: 'UNSAFE_ACT', value: 'Unsafe Act', description: 'Human error or unsafe behavior', order: 1, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-2', categoryId: 'cat-incident-causes', code: 'UNSAFE_CONDITION', value: 'Unsafe Condition', description: 'Hazardous physical condition', order: 2, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-3', categoryId: 'cat-incident-causes', code: 'EQUIPMENT_FAILURE', value: 'Equipment Failure', description: 'Mechanical or equipment malfunction', order: 3, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-4', categoryId: 'cat-incident-causes', code: 'LACK_TRAINING', value: 'Lack of Training', description: 'Insufficient training or knowledge', order: 4, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-5', categoryId: 'cat-incident-causes', code: 'PROCEDURE_NOT_FOLLOWED', value: 'Procedure Not Followed', description: 'Deviation from established procedures', order: 5, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-6', categoryId: 'cat-incident-causes', code: 'INADEQUATE_PPE', value: 'Inadequate PPE', description: 'Missing or improper PPE', order: 6, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-7', categoryId: 'cat-incident-causes', code: 'HOUSEKEEPING', value: 'Poor Housekeeping', description: 'Inadequate cleanliness or organization', order: 7, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-8', categoryId: 'cat-incident-causes', code: 'FATIGUE', value: 'Fatigue', description: 'Worker fatigue or exhaustion', order: 8, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-9', categoryId: 'cat-incident-causes', code: 'ENVIRONMENTAL', value: 'Environmental Factor', description: 'Weather or environmental condition', order: 9, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ic-10', categoryId: 'cat-incident-causes', code: 'OTHER', value: 'Other', description: 'Other cause', order: 10, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

  // ==========================================================================
  // HAZARD TYPES
  // ==========================================================================
  { id: 'entry-ht-1', categoryId: 'cat-hazard-types', code: 'CHEMICAL', value: 'Chemical', description: 'Chemical exposure hazard', order: 1, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-2', categoryId: 'cat-hazard-types', code: 'ELECTRICAL', value: 'Electrical', description: 'Electrical shock or arc hazard', order: 2, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-3', categoryId: 'cat-hazard-types', code: 'MECHANICAL', value: 'Mechanical', description: 'Moving machinery hazard', order: 3, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-4', categoryId: 'cat-hazard-types', code: 'ERGONOMIC', value: 'Ergonomic', description: 'Repetitive motion or posture hazard', order: 4, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-5', categoryId: 'cat-hazard-types', code: 'FALL', value: 'Fall Hazard', description: 'Slip, trip, or fall hazard', order: 5, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-6', categoryId: 'cat-hazard-types', code: 'FIRE', value: 'Fire/Explosion', description: 'Fire or explosion hazard', order: 6, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-7', categoryId: 'cat-hazard-types', code: 'NOISE', value: 'Noise', description: 'Excessive noise hazard', order: 7, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'entry-ht-8', categoryId: 'cat-hazard-types', code: 'BIOLOGICAL', value: 'Biological', description: 'Biological or pathogen hazard', order: 8, status: 'active', isSystem: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
] as const

/**
 * Seed dictionary entries (with parentId for hierarchy support)
 */
export const seedDictionaryEntries: DictionaryEntry[] = _seedEntryData.map(entry => ({
  ...entry,
  parentId: null,
}))

/**
 * Get entries by category
 */
export function getEntriesByCategory(categoryId: string): DictionaryEntry[] {
  return seedDictionaryEntries
    .filter((e) => e.categoryId === categoryId)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get category by code
 */
export function getCategoryByCode(code: string): DictionaryCategory | undefined {
  return seedDictionaryCategories.find((c) => c.code === code)
}

/**
 * Get entry by code within a category
 */
export function getEntryByCode(categoryCode: string, entryCode: string): DictionaryEntry | undefined {
  const category = getCategoryByCode(categoryCode)
  if (!category) return undefined
  return seedDictionaryEntries.find(
    (e) => e.categoryId === category.id && e.code === entryCode
  )
}
