/**
 * Mock Data for Partner Portal
 *
 * Contains mock tenant requests for prototyping.
 */

import type { TenantRequest } from './types'

/** Mock tenant requests for prototype */
export const MOCK_TENANT_REQUESTS: TenantRequest[] = [
  {
    id: '1',
    requestNumber: 'TR-2025-0042',
    companyName: 'Apex Manufacturing Co.',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah@apexmfg.com',
    pricingTier: 'enterprise',
    estimatedValue: 156000,
    status: 'pending_review',
    submittedAt: '2025-12-14',
  },
  {
    id: '2',
    requestNumber: 'TR-2025-0041',
    companyName: 'GreenTech Solutions',
    contactName: 'Michael Chen',
    contactEmail: 'm.chen@greentech.io',
    pricingTier: 'professional',
    estimatedValue: 48000,
    status: 'approved',
    submittedAt: '2025-12-12',
  },
  {
    id: '3',
    requestNumber: 'TR-2025-0040',
    companyName: 'Coastal Energy Partners',
    contactName: 'Jennifer Walsh',
    contactEmail: 'jwalsh@coastalenergy.com',
    pricingTier: 'enterprise',
    estimatedValue: 98000,
    status: 'pending_payment',
    submittedAt: '2025-12-10',
  },
  {
    id: '4',
    requestNumber: 'TR-2025-0039',
    companyName: 'Summit Logistics',
    contactName: 'David Park',
    contactEmail: 'd.park@summitlogistics.com',
    pricingTier: 'enterprise',
    estimatedValue: 245000,
    status: 'provisioning',
    submittedAt: '2025-12-08',
  },
  {
    id: '5',
    requestNumber: 'TR-2025-0038',
    companyName: 'Urban Development Corp',
    contactName: 'Amanda Foster',
    contactEmail: 'a.foster@urbandev.com',
    pricingTier: 'professional',
    estimatedValue: 3600,
    status: 'rejected',
    submittedAt: '2025-12-05',
  },
  {
    id: '6',
    requestNumber: 'TR-2025-0037',
    companyName: 'Pacific Waste Management',
    contactName: 'Robert Kim',
    contactEmail: 'r.kim@pacificwaste.com',
    pricingTier: 'professional',
    estimatedValue: 62000,
    status: 'completed',
    submittedAt: '2025-12-01',
  },
]
