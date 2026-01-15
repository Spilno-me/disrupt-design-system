/**
 * Mock data for Partner Invoices page
 * @module partner-invoices/data/mock-invoices
 */

import type { PartnerInvoice, PartnerInvoicesStats } from "../types"

// =============================================================================
// MOCK INVOICES DATA
// =============================================================================

export const MOCK_PARTNER_INVOICES: PartnerInvoice[] = [
  // Active tenants
  {
    id: "inv-001",
    reference: "INV-2025-001",
    companyName: "Apex Manufacturing",
    contactName: "John Smith",
    contactEmail: "john.smith@apex-mfg.com",
    contactPhone: "+1 (555) 123-4567",
    status: "active",
    monthlyAmount: 15600,
    annualAmount: 187200,
    createdDate: new Date("2024-06-15"),
    pdfUrl: "/invoices/inv-2025-001.pdf",
    source: "active_tenant",
    tenantId: "tenant-001",
  },
  {
    id: "inv-002",
    reference: "INV-2025-002",
    companyName: "GreenTech Solutions",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@greentech.io",
    contactPhone: "+1 (555) 234-5678",
    status: "active",
    monthlyAmount: 4800,
    annualAmount: 57600,
    createdDate: new Date("2024-08-20"),
    pdfUrl: "/invoices/inv-2025-002.pdf",
    source: "active_tenant",
    tenantId: "tenant-002",
  },
  // Overdue
  {
    id: "inv-003",
    reference: "INV-2025-003",
    companyName: "Coastal Energy Corp",
    contactName: "Mike Wilson",
    contactEmail: "m.wilson@coastalenergy.com",
    contactPhone: "+1 (555) 345-6789",
    status: "overdue",
    monthlyAmount: 9800,
    annualAmount: 117600,
    createdDate: new Date("2024-03-10"),
    pdfUrl: "/invoices/inv-2025-003.pdf",
    source: "active_tenant",
    tenantId: "tenant-003",
  },
  // Suspended
  {
    id: "inv-004",
    reference: "INV-2025-004",
    companyName: "Summit Logistics",
    contactName: "Lisa Chen",
    contactEmail: "lisa.chen@summitlogistics.com",
    contactPhone: "+1 (555) 456-7890",
    status: "suspended",
    monthlyAmount: 0,
    annualAmount: 0,
    createdDate: new Date("2024-09-01"),
    pdfUrl: "/invoices/inv-2025-004.pdf",
    source: "active_tenant",
    tenantId: "tenant-004",
  },
  // Pending Payment
  {
    id: "inv-005",
    reference: "INV-2025-005",
    companyName: "Nordic Safety Systems",
    contactName: "Erik Larsson",
    contactEmail: "e.larsson@nordicsafety.se",
    contactPhone: "+46 8 123 456",
    status: "pending_payment",
    monthlyAmount: 6200,
    annualAmount: 74400,
    createdDate: new Date("2024-12-22"),
    pdfUrl: "/invoices/inv-2025-005.pdf",
    source: "tenant_request",
    tenantRequestId: "req-005",
  },
  // Approved (awaiting payment setup)
  {
    id: "inv-006",
    reference: "INV-2025-006",
    companyName: "Pacific Mining Corp",
    contactName: "Jennifer Wong",
    contactEmail: "j.wong@pacificmining.com",
    contactPhone: "+1 (555) 567-8901",
    status: "approved",
    monthlyAmount: 22400,
    annualAmount: 268800,
    createdDate: new Date("2024-12-18"),
    pdfUrl: "/invoices/inv-2025-006.pdf",
    source: "tenant_request",
    tenantRequestId: "req-006",
  },
  // Submitted (under review)
  {
    id: "inv-007",
    reference: "INV-2025-007",
    companyName: "Atlantic Oil Services",
    contactName: "Robert Martinez",
    contactEmail: "r.martinez@atlanticoil.com",
    contactPhone: "+1 (555) 678-9012",
    status: "submitted",
    monthlyAmount: 3200,
    annualAmount: 38400,
    createdDate: new Date("2024-12-28"),
    pdfUrl: "/invoices/inv-2025-007.pdf",
    source: "tenant_request",
    tenantRequestId: "req-007",
  },
  // Draft
  {
    id: "inv-008",
    reference: "INV-2025-008",
    companyName: "Mountain View Construction",
    contactName: "David Brown",
    contactEmail: "d.brown@mvconst.com",
    status: "draft",
    monthlyAmount: 1200,
    annualAmount: 14400,
    createdDate: new Date("2025-01-05"),
    source: "tenant_request",
    tenantRequestId: "req-008",
  },
  // More active tenants
  {
    id: "inv-009",
    reference: "INV-2025-009",
    companyName: "EuroChemical Industries",
    contactName: "Hans Mueller",
    contactEmail: "h.mueller@eurochem.de",
    contactPhone: "+49 30 123 456",
    status: "active",
    monthlyAmount: 18900,
    annualAmount: 226800,
    createdDate: new Date("2024-02-28"),
    pdfUrl: "/invoices/inv-2025-009.pdf",
    source: "active_tenant",
    tenantId: "tenant-009",
  },
  {
    id: "inv-010",
    reference: "INV-2025-010",
    companyName: "Desert Solar Energy",
    contactName: "Amanda Taylor",
    contactEmail: "a.taylor@desertsolar.com",
    contactPhone: "+1 (555) 789-0123",
    status: "suspended",
    monthlyAmount: 0,
    annualAmount: 0,
    createdDate: new Date("2024-07-11"),
    pdfUrl: "/invoices/inv-2025-010.pdf",
    source: "active_tenant",
    tenantId: "tenant-010",
  },
  {
    id: "inv-011",
    reference: "INV-2025-011",
    companyName: "Northern Pipeline Co",
    contactName: "James Anderson",
    contactEmail: "j.anderson@northernpipe.ca",
    contactPhone: "+1 (555) 890-1234",
    status: "active",
    monthlyAmount: 12500,
    annualAmount: 150000,
    createdDate: new Date("2024-03-25"),
    pdfUrl: "/invoices/inv-2025-011.pdf",
    source: "active_tenant",
    tenantId: "tenant-011",
  },
  {
    id: "inv-012",
    reference: "INV-2025-012",
    companyName: "Tropical Agri Holdings",
    contactName: "Maria Santos",
    contactEmail: "m.santos@tropicalagri.br",
    contactPhone: "+55 11 9876-5432",
    status: "overdue",
    monthlyAmount: 5600,
    annualAmount: 67200,
    createdDate: new Date("2024-06-08"),
    pdfUrl: "/invoices/inv-2025-012.pdf",
    source: "active_tenant",
    tenantId: "tenant-012",
  },
]

// =============================================================================
// STATS GENERATOR
// =============================================================================

/**
 * Generates stats from invoices data
 */
export function generatePartnerInvoicesStats(invoices: PartnerInvoice[]): PartnerInvoicesStats {
  const total = invoices.length
  const pendingPayment = invoices.filter((i) => i.status === "pending_payment").length
  const active = invoices.filter((i) => i.status === "active").length
  const overdue = invoices.filter((i) => i.status === "overdue").length

  return {
    total: { value: total },
    pendingPayment: {
      value: pendingPayment,
      trend: pendingPayment > 0 ? `${pendingPayment}` : "0",
      trendDirection: pendingPayment > 0 ? "neutral" : "neutral",
    },
    active: {
      value: active,
      trend: `${Math.round((active / total) * 100)}%`,
      trendDirection: "up",
    },
    overdue: {
      value: overdue,
      trend: overdue > 0 ? `${overdue}` : "0",
      trendDirection: overdue > 0 ? "down" : "neutral",
    },
  }
}

/** Pre-computed stats for default mock data */
export const MOCK_PARTNER_INVOICES_STATS: PartnerInvoicesStats = generatePartnerInvoicesStats(MOCK_PARTNER_INVOICES)
