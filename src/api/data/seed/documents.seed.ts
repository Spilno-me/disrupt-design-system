/**
 * Document/Evidence Seed Data
 *
 * Mock data for incident documents, evidence files, and user context.
 * Used in incident details pages and document management.
 */

import type {
  EvidenceDocument,
  DocumentUserContext,
} from '../../../components/incidents'

/**
 * Seed evidence documents for incident details
 * Demonstrates various document types: images, PDFs, forms
 */
export const seedDocuments: EvidenceDocument[] = [
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

/**
 * Default user context for document viewing
 * Represents an investigator viewing documents
 */
export const seedUserContext: DocumentUserContext = {
  userId: 'user-2',
  userName: 'John Smith',
  role: 'investigator',
  isReporter: false,
  isAssigned: true,
}

/**
 * Get documents filtered by visibility for a user role
 */
export function getDocumentsForRole(
  role: 'reporter' | 'investigator' | 'reviewer' | 'admin'
): EvidenceDocument[] {
  const visibilityOrder = ['reporter', 'investigator', 'reviewer', 'admin']
  const roleIndex = visibilityOrder.indexOf(role)

  return seedDocuments.filter((doc) => {
    if (doc.visibility === 'all') return true
    const docVisIndex = visibilityOrder.indexOf(doc.visibility)
    return roleIndex >= docVisIndex
  })
}

/**
 * Get document by ID
 */
export function getDocumentById(id: string): EvidenceDocument | undefined {
  return seedDocuments.find((doc) => doc.id === id)
}
