import type { Meta, StoryObj } from "@storybook/react"
import { PartnersPage, MOCK_PARTNERS, type Partner } from "./PartnersPage"

const meta: Meta<typeof PartnersPage> = {
  title: "Partner/Partners/PartnersPage",
  component: PartnersPage,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A complete partners management page with search, filtering, data table, and pagination.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    partners: {
      control: false,
      description: "Array of partner data to display",
    },
    onAddPartner: {
      action: "add-partner",
      description: "Callback when Add Partner button is clicked",
    },
    onViewPartner: {
      action: "view-partner",
      description: "Callback when view action is clicked",
    },
    onManageUsers: {
      action: "manage-users",
      description: "Callback when users action is clicked",
    },
    onDeletePartner: {
      action: "delete-partner",
      description: "Callback when delete action is clicked",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton state",
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnersPage>

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    partners: MOCK_PARTNERS,
  },
}

export const Loading: Story = {
  args: {
    partners: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    partners: [],
  },
}

// Extended mock data for pagination testing
const EXTENDED_PARTNERS: Partner[] = [
  ...MOCK_PARTNERS,
  {
    id: "10",
    name: "Apex Manufacturing",
    partnerId: "APX-2024-010",
    contactName: "David Chen",
    contactEmail: "d.chen@apexmfg.com",
    tier: "Premium",
    status: "active",
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "11",
    name: "Northern Solutions",
    partnerId: "NRS-2024-011",
    contactName: "Amanda White",
    contactEmail: "a.white@northernsolutions.io",
    tier: "Standard",
    status: "pending",
    createdAt: new Date("2024-10-15"),
  },
  {
    id: "12",
    name: "Pacific Trading Co.",
    partnerId: "PTC-2024-012",
    contactName: "Kevin Park",
    contactEmail: "k.park@pacifictrading.com",
    tier: "Enterprise",
    status: "active",
    createdAt: new Date("2024-11-01"),
  },
  {
    id: "13",
    name: "Summit Analytics",
    partnerId: "SAN-2024-013",
    contactName: "Lisa Monroe",
    contactEmail: "l.monroe@summitanalytics.co",
    tier: "Premium",
    status: "inactive",
    createdAt: new Date("2024-11-10"),
  },
  {
    id: "14",
    name: "Horizon Dynamics",
    partnerId: "HRD-2024-014",
    contactName: "James Wilson",
    contactEmail: "j.wilson@horizondynamics.net",
    tier: "Standard",
    status: "active",
    createdAt: new Date("2024-11-20"),
  },
  {
    id: "15",
    name: "Quantum Systems",
    partnerId: "QSY-2024-015",
    contactName: "Rachel Green",
    contactEmail: "r.green@quantumsys.io",
    tier: "Enterprise",
    status: "active",
    createdAt: new Date("2024-12-01"),
  },
]

export const WithPagination: Story = {
  args: {
    partners: EXTENDED_PARTNERS,
  },
}

// Mixed status data
const MIXED_STATUS_PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Active Corp",
    partnerId: "ACT-2024-001",
    contactName: "Active User",
    contactEmail: "active@corp.com",
    tier: "Standard",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Pending Inc",
    partnerId: "PND-2024-002",
    contactName: "Pending User",
    contactEmail: "pending@inc.com",
    tier: "Premium",
    status: "pending",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Inactive LLC",
    partnerId: "INA-2024-003",
    contactName: "Inactive User",
    contactEmail: "inactive@llc.com",
    tier: "Enterprise",
    status: "inactive",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Another Active",
    partnerId: "AAC-2024-004",
    contactName: "Another Active User",
    contactEmail: "another@active.com",
    tier: "Standard",
    status: "active",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "5",
    name: "Second Pending",
    partnerId: "SPD-2024-005",
    contactName: "Second Pending User",
    contactEmail: "second@pending.com",
    tier: "Premium",
    status: "pending",
    createdAt: new Date("2024-05-12"),
  },
]

export const MixedStatuses: Story = {
  args: {
    partners: MIXED_STATUS_PARTNERS,
  },
}

// Different tiers showcase
const ALL_TIERS_PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Standard Partner",
    partnerId: "STD-2024-001",
    contactName: "Standard User",
    contactEmail: "standard@partner.com",
    tier: "Standard",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Premium Partner",
    partnerId: "PRM-2024-002",
    contactName: "Premium User",
    contactEmail: "premium@partner.com",
    tier: "Premium",
    status: "active",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Enterprise Partner",
    partnerId: "ENT-2024-003",
    contactName: "Enterprise User",
    contactEmail: "enterprise@partner.com",
    tier: "Enterprise",
    status: "active",
    createdAt: new Date("2024-03-10"),
  },
]

export const AllTiers: Story = {
  args: {
    partners: ALL_TIERS_PARTNERS,
  },
}

// Interactive playground
export const Playground: Story = {
  args: {
    partners: MOCK_PARTNERS,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground - try searching, filtering, and clicking action buttons. Check the Actions panel to see callback events.",
      },
    },
  },
}
