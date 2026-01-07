/**
 * Mock data for My Earnings page
 * @module earnings/data/mock-earnings
 */

import type { Earning, EarningsSummary } from "../types"

export const MOCK_EARNINGS_SUMMARY: EarningsSummary = {
  totalEarnings: 127450,
  directCommission: 98200,
  passiveCommission: 29250,
  pendingPayouts: 8750,
}

export const MOCK_EARNINGS: Earning[] = [
  {
    id: "1",
    date: new Date("2024-12-15"),
    tenantName: "Apex Manufacturing",
    type: "direct",
    amount: 3120,
    status: "paid",
  },
  {
    id: "2",
    date: new Date("2024-12-12"),
    tenantName: "Pacific Mining Corp",
    type: "direct",
    amount: 4480,
    status: "paid",
  },
  {
    id: "3",
    date: new Date("2024-12-10"),
    tenantName: "GreenTech Solutions",
    type: "passive",
    amount: 960,
    status: "paid",
  },
  {
    id: "4",
    date: new Date("2024-12-08"),
    tenantName: "EuroChemical Industries",
    type: "direct",
    amount: 3780,
    status: "paid",
  },
  {
    id: "5",
    date: new Date("2024-12-05"),
    tenantName: "Northern Pipeline Co",
    type: "direct",
    amount: 2500,
    status: "paid",
  },
  {
    id: "6",
    date: new Date("2024-12-01"),
    tenantName: "Nordic Safety Systems",
    type: "passive",
    amount: 1240,
    status: "processing",
  },
  {
    id: "7",
    date: new Date("2024-11-28"),
    tenantName: "Tropical Agri Holdings",
    type: "direct",
    amount: 1120,
    status: "paid",
  },
  {
    id: "8",
    date: new Date("2024-11-25"),
    tenantName: "Mountain View Construction",
    type: "passive",
    amount: 240,
    status: "pending",
  },
  {
    id: "9",
    date: new Date("2024-11-22"),
    tenantName: "Coastal Energy Corp",
    type: "direct",
    amount: 1960,
    status: "paid",
  },
  {
    id: "10",
    date: new Date("2024-11-20"),
    tenantName: "Desert Solar Energy",
    type: "passive",
    amount: 480,
    status: "pending",
  },
  {
    id: "11",
    date: new Date("2024-11-18"),
    tenantName: "Atlantic Oil Services",
    type: "direct",
    amount: 640,
    status: "paid",
  },
  {
    id: "12",
    date: new Date("2024-11-15"),
    tenantName: "Summit Logistics",
    type: "passive",
    amount: 320,
    status: "paid",
  },
]
