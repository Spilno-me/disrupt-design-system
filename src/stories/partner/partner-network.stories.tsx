import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Zap,
  ClipboardList,
  FileText,
  Building2,
  Network,
  DollarSign,
  Settings,
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import {
  PartnerNetworkPage,
  NetworkPartner,
  MOCK_NETWORK_PARTNERS,
  NetworkPartnerFormData,
  EditNetworkPartnerDialog,
  CreateSubPartnerDialog,
  SubPartnerFormData,
  DeleteNetworkPartnerDialog,
} from '../../components/partners'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/PartnerNetwork',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// NAVIGATION DATA
// =============================================================================

const partnerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users />,
    href: '/leads',
    badge: 6,
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <Zap />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
    badge: 9,
  },
  {
    id: 'partner-network',
    label: 'Partner Network',
    icon: <Network />,
    href: '/partner-network',
  },
  {
    id: 'pricing-calculator',
    label: 'Pricing Calculator',
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// EXTENDED MOCK DATA WITH MORE HIERARCHY
// =============================================================================

const extendedNetworkPartners: NetworkPartner[] = [
  ...MOCK_NETWORK_PARTNERS,
  {
    id: '6',
    companyName: 'Global Consulting Group',
    contactName: 'Michael Brown',
    contactEmail: 'm.brown@gcg.com',
    status: 'active',
    monthlyRevenue: 12500,
    isMasterPartner: true,
    metrics: {
      totalLeads: 56,
      conversion: 25.0,
      commission: null,
      totalRevenue: 185000,
    },
    subPartners: [
      {
        id: '6-1',
        companyName: 'GCG West Coast',
        contactName: 'Anna Martinez',
        contactEmail: 'anna@gcgwest.com',
        status: 'active',
        monthlyRevenue: 5000,
        isMasterPartner: false,
        parentId: '6',
        metrics: {
          totalLeads: 22,
          conversion: 18.5,
          commission: 7500,
          totalRevenue: 62000,
        },
      },
      {
        id: '6-2',
        companyName: 'GCG East Coast',
        contactName: 'Robert Lee',
        contactEmail: 'robert@gcgeast.com',
        status: 'active',
        monthlyRevenue: 4500,
        isMasterPartner: false,
        parentId: '6',
        metrics: {
          totalLeads: 19,
          conversion: 21.0,
          commission: 6800,
          totalRevenue: 55000,
        },
      },
      {
        id: '6-3',
        companyName: 'GCG Central',
        contactName: 'Jessica Wang',
        contactEmail: 'jessica@gcgcentral.com',
        status: 'pending',
        monthlyRevenue: 0,
        isMasterPartner: false,
        parentId: '6',
        metrics: {
          totalLeads: 5,
          conversion: null,
          commission: null,
          totalRevenue: 0,
        },
      },
    ],
  },
  {
    id: '7',
    companyName: 'TechIntegrators Inc.',
    contactName: 'Emily Davis',
    contactEmail: 'e.davis@techintegrators.io',
    status: 'active',
    monthlyRevenue: 8750,
    isMasterPartner: true,
    metrics: {
      totalLeads: 38,
      conversion: 28.5,
      commission: null,
      totalRevenue: 142000,
    },
  },
  {
    id: '8',
    companyName: 'Industrial Solutions LLC',
    contactName: 'Robert Wilson',
    contactEmail: 'r.wilson@industrialsolutions.com',
    status: 'inactive',
    monthlyRevenue: 0,
    isMasterPartner: false,
    metrics: {
      totalLeads: 0,
      conversion: null,
      commission: null,
      totalRevenue: 28000,
    },
  },
]

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function PartnerNetworkFullPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('partner-network')

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState<'edit' | 'create'>('create')
  const [selectedPartner, setSelectedPartner] = useState<NetworkPartner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [subPartnerDialogOpen, setSubPartnerDialogOpen] = useState(false)
  const [parentPartner, setParentPartner] = useState<NetworkPartner | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<NetworkPartner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  const handleAddPartner = () => {
    setSelectedPartner(null)
    setEditMode('create')
    setEditDialogOpen(true)
  }

  const handleEditPartner = (partner: NetworkPartner) => {
    setSelectedPartner(partner)
    setEditMode('edit')
    setEditDialogOpen(true)
  }

  const handleViewPartner = (partner: NetworkPartner) => {
    console.log('Viewing partner:', partner)
  }

  const handleAddSubPartner = (parent: NetworkPartner) => {
    setParentPartner(parent)
    setSubPartnerDialogOpen(true)
  }

  const handleDeletePartner = (partner: NetworkPartner) => {
    setPartnerToDelete(partner)
    setDeleteDialogOpen(true)
  }

  const handleEditSubmit = async (data: NetworkPartnerFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Partner data:', data)
    alert(`Partner ${data.companyName} ${editMode === 'edit' ? 'updated' : 'created'} successfully!`)
    setIsSubmitting(false)
    setEditDialogOpen(false)
  }

  const handleSubPartnerSubmit = async (data: SubPartnerFormData, parent: NetworkPartner) => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sub-partner data:', data, 'Parent:', parent)
    alert(`Sub-partner ${data.companyName} created under ${parent.companyName}!`)
    setIsSubmitting(false)
    setSubPartnerDialogOpen(false)
  }

  const handleDeleteConfirm = async (partner: NetworkPartner) => {
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Deleted partner:', partner)
    alert(`Partner ${partner.companyName} deleted successfully!`)
    setIsDeleting(false)
    setDeleteDialogOpen(false)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* Grid blob background over white */}
      <GridBlobBackground scale={1} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Header */}
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={activeNavItem}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => console.log('Help clicked')}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <PartnerNetworkPage
              partners={extendedNetworkPartners}
              onAddPartner={handleAddPartner}
              onEditPartner={handleEditPartner}
              onViewPartner={handleViewPartner}
              onAddSubPartner={handleAddSubPartner}
              onDeletePartner={handleDeletePartner}
            />
          </main>
        </div>

        {/* Footer - compact on mobile, full on desktop */}
        <AppFooter compactOnMobile />

        {/* Mobile Bottom Navigation */}
        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={handleNavigate}
          maxVisibleItems={3}
          showHelpItem
          onHelpClick={() => console.log('Help clicked')}
        />
      </div>

      {/* Edit/Create Partner Dialog */}
      <EditNetworkPartnerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        partner={selectedPartner}
        mode={editMode}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Create Sub-Partner Dialog */}
      <CreateSubPartnerDialog
        open={subPartnerDialogOpen}
        onOpenChange={setSubPartnerDialogOpen}
        parentPartner={parentPartner}
        onSubmit={handleSubPartnerSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Partner Dialog */}
      <DeleteNetworkPartnerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        partner={partnerToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => <PartnerNetworkFullPage />,
}

// Sidebar expanded by default
function PartnerNetworkPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('partner-network')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeNavItem}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onNavigate={(item) => setActiveNavItem(item.id)}
          />

          <main className="flex-1 overflow-auto">
            <PartnerNetworkPage
              partners={extendedNetworkPartners}
              onAddPartner={() => alert('Add Partner clicked')}
              onEditPartner={(partner) => alert(`Edit: ${partner.companyName}`)}
              onAddSubPartner={(parent) => alert(`Add sub-partner to: ${parent.companyName}`)}
              onDeletePartner={(partner) => alert(`Delete: ${partner.companyName}`)}
            />
          </main>
        </div>

        <AppFooter compactOnMobile />

        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={(item) => setActiveNavItem(item.id)}
          maxVisibleItems={3}
        />
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <PartnerNetworkPageExpanded />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <PartnerNetworkPage
          partners={extendedNetworkPartners}
          onAddPartner={() => console.log('Add Partner')}
          onEditPartner={(partner) => console.log('Edit:', partner)}
          onAddSubPartner={(parent) => console.log('Add sub-partner to:', parent)}
          onDeletePartner={(partner) => console.log('Delete:', partner)}
        />
      </div>
    </div>
  ),
}

// Mobile viewport
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <PartnerNetworkPage
          partners={MOCK_NETWORK_PARTNERS.slice(0, 3)}
          onAddPartner={() => console.log('Add Partner')}
        />
      </div>
    </div>
  ),
}

// Empty state
export const EmptyPartners: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <PartnerNetworkPage
          partners={[]}
          onAddPartner={() => alert('Add Partner clicked')}
        />
      </div>
    </div>
  ),
}

// Loading state
export const Loading: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <PartnerNetworkPage
          partners={[]}
          loading={true}
          onAddPartner={() => {}}
        />
      </div>
    </div>
  ),
}

// With deep hierarchy
export const DeepHierarchy: Story = {
  render: () => {
    const deepPartners: NetworkPartner[] = [
      {
        id: '1',
        companyName: 'Enterprise Corp',
        contactName: 'CEO Johnson',
        contactEmail: 'ceo@enterprise.com',
        status: 'active',
        monthlyRevenue: 50000,
        isMasterPartner: true,
        metrics: {
          totalLeads: 150,
          conversion: 35.0,
          commission: null,
          totalRevenue: 500000,
        },
        subPartners: [
          {
            id: '1-1',
            companyName: 'Enterprise Division A',
            contactName: 'Director Smith',
            contactEmail: 'smith@enterprisea.com',
            status: 'active',
            monthlyRevenue: 20000,
            isMasterPartner: false,
            parentId: '1',
            metrics: {
              totalLeads: 60,
              conversion: 30.0,
              commission: 15000,
              totalRevenue: 180000,
            },
          },
          {
            id: '1-2',
            companyName: 'Enterprise Division B',
            contactName: 'Director Brown',
            contactEmail: 'brown@enterpriseb.com',
            status: 'active',
            monthlyRevenue: 18000,
            isMasterPartner: false,
            parentId: '1',
            metrics: {
              totalLeads: 55,
              conversion: 28.0,
              commission: 13500,
              totalRevenue: 165000,
            },
          },
          {
            id: '1-3',
            companyName: 'Enterprise Division C',
            contactName: 'Director Davis',
            contactEmail: 'davis@enterprisec.com',
            status: 'pending',
            monthlyRevenue: 0,
            isMasterPartner: false,
            parentId: '1',
            metrics: {
              totalLeads: 10,
              conversion: null,
              commission: null,
              totalRevenue: 0,
            },
          },
          {
            id: '1-4',
            companyName: 'Enterprise Division D',
            contactName: 'Director Wilson',
            contactEmail: 'wilson@enterprised.com',
            status: 'inactive',
            monthlyRevenue: 0,
            isMasterPartner: false,
            parentId: '1',
            metrics: {
              totalLeads: 0,
              conversion: null,
              commission: null,
              totalRevenue: 45000,
            },
          },
        ],
      },
    ]

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10">
          <PartnerNetworkPage
            partners={deepPartners}
            onAddPartner={() => alert('Add Partner')}
            onEditPartner={(p) => alert(`Edit: ${p.companyName}`)}
            onAddSubPartner={(p) => alert(`Add sub to: ${p.companyName}`)}
            onDeletePartner={(p) => alert(`Delete: ${p.companyName}`)}
          />
        </div>
      </div>
    )
  },
}

// With mixed statuses
export const MixedStatuses: Story = {
  render: () => {
    const mixedPartners: NetworkPartner[] = [
      {
        id: '1',
        companyName: 'Active Master Partner',
        contactName: 'John Active',
        contactEmail: 'john@active.com',
        status: 'active',
        monthlyRevenue: 15000,
        isMasterPartner: true,
        metrics: {
          totalLeads: 45,
          conversion: 22.0,
          commission: null,
          totalRevenue: 120000,
        },
        subPartners: [
          {
            id: '1-1',
            companyName: 'Active Sub-Partner',
            contactName: 'Jane Sub',
            contactEmail: 'jane@sub.com',
            status: 'active',
            monthlyRevenue: 5000,
            isMasterPartner: false,
            parentId: '1',
            metrics: {
              totalLeads: 18,
              conversion: 16.0,
              commission: 4500,
              totalRevenue: 42000,
            },
          },
        ],
      },
      {
        id: '2',
        companyName: 'Pending Master Partner',
        contactName: 'Mike Pending',
        contactEmail: 'mike@pending.com',
        status: 'pending',
        monthlyRevenue: 0,
        isMasterPartner: true,
        metrics: {
          totalLeads: 5,
          conversion: null,
          commission: null,
          totalRevenue: 0,
        },
      },
      {
        id: '3',
        companyName: 'Inactive Partner',
        contactName: 'Bob Inactive',
        contactEmail: 'bob@inactive.com',
        status: 'inactive',
        monthlyRevenue: 0,
        isMasterPartner: false,
        metrics: {
          totalLeads: 0,
          conversion: null,
          commission: null,
          totalRevenue: 25000,
        },
      },
      {
        id: '4',
        companyName: 'Regular Active Partner',
        contactName: 'Alice Active',
        contactEmail: 'alice@regular.com',
        status: 'active',
        monthlyRevenue: 3500,
        isMasterPartner: false,
        metrics: {
          totalLeads: 12,
          conversion: 8.5,
          commission: 2100,
          totalRevenue: 28000,
        },
      },
    ]

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10">
          <PartnerNetworkPage
            partners={mixedPartners}
            onAddPartner={() => alert('Add Partner')}
            onEditPartner={(p) => alert(`Edit: ${p.companyName}`)}
            onDeletePartner={(p) => alert(`Delete: ${p.companyName}`)}
          />
        </div>
      </div>
    )
  },
}

// Dialog Showcase Story
function DialogShowcase() {
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [subPartnerOpen, setSubPartnerOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const samplePartner: NetworkPartner = {
    id: '1',
    companyName: 'Sample Master Partner',
    contactName: 'John Sample',
    contactEmail: 'john@sample.com',
    status: 'active',
    monthlyRevenue: 10000,
    isMasterPartner: true,
    metrics: {
      totalLeads: 25,
      conversion: 18.0,
      commission: null,
      totalRevenue: 85000,
    },
    subPartners: [
      {
        id: '1-1',
        companyName: 'Sub Partner A',
        contactName: 'Sub Contact',
        contactEmail: 'sub@partner.com',
        status: 'active',
        monthlyRevenue: 3000,
        isMasterPartner: false,
        parentId: '1',
        metrics: {
          totalLeads: 10,
          conversion: 12.0,
          commission: 2500,
          totalRevenue: 25000,
        },
      },
    ],
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Dialog Showcase</h1>
        <p className="text-muted mb-8">
          Click the buttons below to preview each dialog variant.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
          >
            Edit Partner Dialog
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
          >
            Add Partner Dialog
          </button>

          <button
            onClick={() => setSubPartnerOpen(true)}
            className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
          >
            Create Sub-Partner Dialog
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors"
          >
            Delete Partner Dialog
          </button>
        </div>

        {/* Edit Dialog */}
        <EditNetworkPartnerDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          partner={samplePartner}
          mode="edit"
          onSubmit={async (data) => {
            console.log('Edit submitted:', data)
            alert(`Updated: ${data.companyName}`)
            setEditOpen(false)
          }}
        />

        {/* Create Dialog */}
        <EditNetworkPartnerDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          partner={null}
          mode="create"
          onSubmit={async (data) => {
            console.log('Create submitted:', data)
            alert(`Created: ${data.companyName}`)
            setCreateOpen(false)
          }}
        />

        {/* Sub-Partner Dialog */}
        <CreateSubPartnerDialog
          open={subPartnerOpen}
          onOpenChange={setSubPartnerOpen}
          parentPartner={samplePartner}
          onSubmit={async (data, parent) => {
            console.log('Sub-partner submitted:', data, parent)
            alert(`Created sub-partner ${data.companyName} under ${parent.companyName}`)
            setSubPartnerOpen(false)
          }}
        />

        {/* Delete Dialog */}
        <DeleteNetworkPartnerDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          partner={samplePartner}
          onConfirm={async (partner) => {
            console.log('Delete confirmed:', partner)
            alert(`Deleted: ${partner.companyName}`)
            setDeleteOpen(false)
          }}
        />
      </div>
    </div>
  )
}

export const Dialogs: Story = {
  render: () => <DialogShowcase />,
}
