/**
 * Mock data for Tenants page
 * @module tenants/data/mock-tenants
 */

import type {
  Tenant,
  TenantsStats,
  TenantsStatsV2,
  PassiveIncomeTenant,
} from "../types"

// =============================================================================
// MOCK TENANTS DATA
// =============================================================================

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "1",
    companyName: "Apex Manufacturing",
    status: "active",
    tier: "mid-market",
    subscriptionPackage: "enterprise",
    createdAt: new Date("2024-06-15"),
    activeSince: new Date("2024-06-20"),
    contactName: "John Smith",
    contactEmail: "john.smith@apex-mfg.com",
    contactPhone: "+1 (555) 123-4567",
    licenses: 50,
    monthlyPayment: 15600,
    monthlyRevenue: 15600, // deprecated, kept for backwards compat
    userCount: 45,
  },
  {
    id: "2",
    companyName: "GreenTech Solutions",
    status: "active",
    tier: "small",
    subscriptionPackage: "professional",
    createdAt: new Date("2024-08-20"),
    activeSince: new Date("2024-08-25"),
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@greentech.io",
    contactPhone: "+1 (555) 234-5678",
    licenses: 15,
    monthlyPayment: 4800,
    monthlyRevenue: 4800,
    userCount: 12,
  },
  {
    id: "3",
    companyName: "Coastal Energy Corp",
    status: "overdue",
    tier: "mid-market",
    subscriptionPackage: "enterprise",
    createdAt: new Date("2024-03-10"),
    activeSince: new Date("2024-03-15"),
    contactName: "Mike Wilson",
    contactEmail: "m.wilson@coastalenergy.com",
    contactPhone: "+1 (555) 345-6789",
    licenses: 30,
    monthlyPayment: 9800,
    monthlyRevenue: 9800,
    userCount: 28,
  },
  {
    id: "4",
    companyName: "Summit Logistics",
    status: "suspended",
    tier: "micro",
    subscriptionPackage: "starter",
    createdAt: new Date("2024-09-01"),
    activeSince: null, // Suspended before becoming active
    contactName: "Lisa Chen",
    contactEmail: "lisa.chen@summitlogistics.com",
    contactPhone: "+1 (555) 456-7890",
    licenses: 10,
    monthlyPayment: 0,
    monthlyRevenue: 0,
    userCount: 5,
  },
  {
    id: "5",
    companyName: "Nordic Safety Systems",
    status: "active",
    tier: "small",
    subscriptionPackage: "professional",
    createdAt: new Date("2024-04-22"),
    activeSince: new Date("2024-04-28"),
    contactName: "Erik Larsson",
    contactEmail: "e.larsson@nordicsafety.se",
    contactPhone: "+46 8 123 456",
    licenses: 20,
    monthlyPayment: 6200,
    monthlyRevenue: 6200,
    userCount: 18,
  },
  {
    id: "6",
    companyName: "Pacific Mining Corp",
    status: "active",
    tier: "large",
    subscriptionPackage: "enterprise",
    createdAt: new Date("2024-01-08"),
    activeSince: new Date("2024-01-15"),
    contactName: "Jennifer Wong",
    contactEmail: "j.wong@pacificmining.com",
    contactPhone: "+1 (555) 567-8901",
    licenses: 75,
    monthlyPayment: 22400,
    monthlyRevenue: 22400,
    userCount: 67,
  },
  {
    id: "7",
    companyName: "Atlantic Oil Services",
    status: "overdue",
    tier: "micro",
    subscriptionPackage: "professional",
    createdAt: new Date("2024-05-15"),
    activeSince: new Date("2024-05-20"),
    contactName: "Robert Martinez",
    contactEmail: "r.martinez@atlanticoil.com",
    contactPhone: "+1 (555) 678-9012",
    licenses: 10,
    monthlyPayment: 3200,
    monthlyRevenue: 3200,
    userCount: 9,
  },
  {
    id: "8",
    companyName: "Mountain View Construction",
    status: "active",
    tier: "micro",
    subscriptionPackage: "starter",
    createdAt: new Date("2024-10-02"),
    activeSince: new Date("2024-10-05"),
    contactName: "David Brown",
    contactEmail: "d.brown@mvconst.com",
    licenses: 5,
    monthlyPayment: 1200,
    monthlyRevenue: 1200,
    userCount: 4,
  },
  {
    id: "9",
    companyName: "EuroChemical Industries",
    status: "active",
    tier: "mid-market",
    subscriptionPackage: "enterprise",
    createdAt: new Date("2024-02-28"),
    activeSince: new Date("2024-03-05"),
    contactName: "Hans Mueller",
    contactEmail: "h.mueller@eurochem.de",
    contactPhone: "+49 30 123 456",
    licenses: 60,
    monthlyPayment: 18900,
    monthlyRevenue: 18900,
    userCount: 52,
  },
  {
    id: "10",
    companyName: "Desert Solar Energy",
    status: "suspended",
    tier: "small",
    subscriptionPackage: "professional",
    createdAt: new Date("2024-07-11"),
    activeSince: new Date("2024-07-15"),
    contactName: "Amanda Taylor",
    contactEmail: "a.taylor@desertsolar.com",
    contactPhone: "+1 (555) 789-0123",
    licenses: 20,
    monthlyPayment: 0,
    monthlyRevenue: 0,
    userCount: 15,
  },
  {
    id: "11",
    companyName: "Northern Pipeline Co",
    status: "active",
    tier: "mid-market",
    subscriptionPackage: "enterprise",
    createdAt: new Date("2024-03-25"),
    activeSince: new Date("2024-03-30"),
    contactName: "James Anderson",
    contactEmail: "j.anderson@northernpipe.ca",
    contactPhone: "+1 (555) 890-1234",
    licenses: 45,
    monthlyPayment: 12500,
    monthlyRevenue: 12500,
    userCount: 38,
  },
  {
    id: "12",
    companyName: "Tropical Agri Holdings",
    status: "active",
    tier: "small",
    subscriptionPackage: "professional",
    createdAt: new Date("2024-06-08"),
    activeSince: new Date("2024-06-12"),
    contactName: "Maria Santos",
    contactEmail: "m.santos@tropicalagri.br",
    contactPhone: "+55 11 9876-5432",
    licenses: 20,
    monthlyPayment: 5600,
    monthlyRevenue: 5600,
    userCount: 14,
  },
]

// =============================================================================
// MOCK STATS DATA
// =============================================================================

/**
 * @deprecated Use generateTenantsStatsV2 instead
 * Generates legacy stats from tenants data
 */
export function generateTenantsStats(tenants: Tenant[]): TenantsStats {
  const total = tenants.length
  const active = tenants.filter((t) => t.status === "active").length
  const overdue = tenants.filter((t) => t.status === "overdue").length
  const suspended = tenants.filter((t) => t.status === "suspended").length

  return {
    total: { value: total },
    active: { value: active, trend: `${Math.round((active / total) * 100)}%`, trendDirection: "up" },
    overdue: { value: overdue, trend: overdue > 0 ? `${overdue}` : "0", trendDirection: overdue > 0 ? "down" : "neutral" },
    suspended: { value: suspended, trendDirection: "neutral" },
  }
}

/**
 * Generates V2 stats with MRR/ARR per spec Section 5.1
 * @since v2.0
 */
export function generateTenantsStatsV2(tenants: Tenant[]): TenantsStatsV2 {
  const activeTenants = tenants.filter((t) => t.status === "active")
  const activeCount = activeTenants.length
  const overdueCount = tenants.filter((t) => t.status === "overdue").length

  // MRR = sum of monthly payments for active tenants only
  const mrr = activeTenants.reduce((sum, t) => sum + t.monthlyPayment, 0)
  // ARR = MRR × 12
  const arr = mrr * 12

  const total = tenants.length
  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0

  return {
    active: {
      value: activeCount,
      trend: `${activePercent}%`,
      trendDirection: "up",
    },
    mrr: {
      value: mrr,
      currency: "USD",
      trendDirection: "up",
    },
    arr: {
      value: arr,
      currency: "USD",
      trendDirection: "up",
    },
    overdue: {
      value: overdueCount,
      trend: overdueCount > 0 ? `${overdueCount}` : "0",
      trendDirection: overdueCount > 0 ? "down" : "neutral",
    },
  }
}

/** @deprecated Use MOCK_TENANTS_STATS_V2 */
export const MOCK_TENANTS_STATS: TenantsStats = generateTenantsStats(MOCK_TENANTS)

/** V2 Pre-computed stats with MRR/ARR */
export const MOCK_TENANTS_STATS_V2: TenantsStatsV2 = generateTenantsStatsV2(MOCK_TENANTS)

// =============================================================================
// MOCK PASSIVE INCOME DATA
// =============================================================================

/**
 * Mock data for Passive Income tab (sub-partner earnings)
 * Per spec Section 12.3
 * @since v2.0
 */
export const MOCK_PASSIVE_INCOME: PassiveIncomeTenant[] = [
  {
    id: "pi-1",
    subPartnerName: "Western Safety Partners",
    subPartnerId: "sp-1",
    tenantCompanyName: "Alpine Construction Ltd",
    tenantId: "t-101",
    subPartnerMonthlyPayment: 8500,
    commissionRate: 0.15,
    yourMonthlyEarnings: 1275,
    status: "active",
  },
  {
    id: "pi-2",
    subPartnerName: "Western Safety Partners",
    subPartnerId: "sp-1",
    tenantCompanyName: "Riverside Manufacturing",
    tenantId: "t-102",
    subPartnerMonthlyPayment: 4200,
    commissionRate: 0.15,
    yourMonthlyEarnings: 630,
    status: "active",
  },
  {
    id: "pi-3",
    subPartnerName: "EHS Consultants Group",
    subPartnerId: "sp-2",
    tenantCompanyName: "Petromax Industries",
    tenantId: "t-103",
    subPartnerMonthlyPayment: 12000,
    commissionRate: 0.12,
    yourMonthlyEarnings: 1440,
    status: "active",
  },
  {
    id: "pi-4",
    subPartnerName: "EHS Consultants Group",
    subPartnerId: "sp-2",
    tenantCompanyName: "Harbor Logistics Co",
    tenantId: "t-104",
    subPartnerMonthlyPayment: 6800,
    commissionRate: 0.12,
    yourMonthlyEarnings: 816,
    status: "overdue",
  },
  {
    id: "pi-5",
    subPartnerName: "SafetyFirst Solutions",
    subPartnerId: "sp-3",
    tenantCompanyName: "Metro Power Grid",
    tenantId: "t-105",
    subPartnerMonthlyPayment: 15000,
    commissionRate: 0.10,
    yourMonthlyEarnings: 1500,
    status: "active",
  },
  {
    id: "pi-6",
    subPartnerName: "SafetyFirst Solutions",
    subPartnerId: "sp-3",
    tenantCompanyName: "Clearwater Mining",
    tenantId: "t-106",
    subPartnerMonthlyPayment: 9200,
    commissionRate: 0.10,
    yourMonthlyEarnings: 920,
    status: "suspended",
  },
]
