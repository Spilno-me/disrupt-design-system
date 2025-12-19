import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Building2, Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  EditPartnerDialog,
  DeletePartnerDialog,
  Partner,
  PartnerFormData,
} from '../../components/partners'
import { ORGANISM_META, organismDescription } from '../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Partner/Dialogs/PartnerDialogs',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'centered',
    docs: {
      description: {
        component: organismDescription(`Dialog components used in the Partners Management system.

## Components
- **EditPartnerDialog**: Create or edit partner information
- **DeletePartnerDialog**: Confirm partner deletion with warning`),
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// MOCK DATA
// =============================================================================

const mockPartner: Partner = {
  id: '1',
  name: 'Drax Industries',
  partnerId: 'DRX-2024-001',
  contactName: 'John Smith',
  contactEmail: 'john.smith@draxindustries.com.au',
  tier: 'Enterprise',
  status: 'active',
  createdAt: new Date('2024-08-15'),
}

const premiumPartner: Partner = {
  id: '2',
  name: 'Apex Manufacturing',
  partnerId: 'APX-2024-010',
  contactName: 'David Chen',
  contactEmail: 'd.chen@apexmfg.com',
  tier: 'Premium',
  status: 'active',
  createdAt: new Date('2024-10-01'),
}

const pendingPartner: Partner = {
  id: '3',
  name: 'Northern Solutions',
  partnerId: 'NRS-2024-011',
  contactName: 'Amanda White',
  contactEmail: 'a.white@northernsolutions.io',
  tier: 'Standard',
  status: 'pending',
  createdAt: new Date('2024-10-15'),
}

const inactivePartner: Partner = {
  id: '4',
  name: 'Summit Analytics',
  partnerId: 'SAN-2024-013',
  contactName: 'Lisa Monroe',
  contactEmail: 'l.monroe@summitanalytics.co',
  tier: 'Premium',
  status: 'inactive',
  createdAt: new Date('2024-11-10'),
}

// =============================================================================
// EDIT PARTNER DIALOG STORIES
// =============================================================================

function CreatePartnerDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold text-primary">Create Partner Dialog</h3>
      <Button variant="accent" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add New Partner
      </Button>

      <EditPartnerDialog
        partner={null}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data: PartnerFormData) => {
          console.log('Creating partner:', data)
          alert(`Partner "${data.companyName}" created!`)
        }}
      />

      <div className="text-sm text-secondary text-center max-w-xs">
        Create a new partner with company info, contact details, and tier selection
      </div>
    </div>
  )
}

export const CreateDialog: Story = {
  render: () => <CreatePartnerDialogDemo />,
}

function EditPartnerDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold text-primary">Edit Partner Dialog</h3>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Pencil className="w-4 h-4 mr-2" />
        Edit Partner
      </Button>

      <EditPartnerDialog
        partner={mockPartner}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data: PartnerFormData) => {
          console.log('Updating partner:', data)
          alert(`Partner "${data.companyName}" updated!`)
        }}
      />

      <div className="text-sm text-secondary text-center max-w-xs">
        Edit existing partner information
      </div>
    </div>
  )
}

export const EditDialog: Story = {
  render: () => <EditPartnerDialogDemo />,
}

function CreateDialogOpen() {
  const [open, setOpen] = useState(true)

  return (
    <EditPartnerDialog
      partner={null}
      open={open}
      onOpenChange={setOpen}
      onSubmit={(data: PartnerFormData) => {
        console.log('Creating:', data)
        alert(`Created: ${data.companyName}`)
      }}
    />
  )
}

export const CreateDialogOpenState: Story = {
  render: () => <CreateDialogOpen />,
}

function EditDialogOpen() {
  const [open, setOpen] = useState(true)

  return (
    <EditPartnerDialog
      partner={mockPartner}
      open={open}
      onOpenChange={setOpen}
      onSubmit={(data: PartnerFormData) => {
        console.log('Saving:', data)
        alert(`Saved: ${data.companyName}`)
      }}
    />
  )
}

export const EditDialogOpenState: Story = {
  render: () => <EditDialogOpen />,
}

// =============================================================================
// DELETE PARTNER DIALOG STORIES
// =============================================================================

function DeletePartnerDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold text-primary">Delete Partner Dialog</h3>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Partner
      </Button>

      <DeletePartnerDialog
        partner={mockPartner}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          console.log('Deleting partner:', mockPartner)
          alert(`Partner "${mockPartner.name}" deleted!`)
        }}
      />

      <div className="text-sm text-secondary text-center max-w-xs">
        Confirm deletion with warning about the action being irreversible
      </div>
    </div>
  )
}

export const DeleteDialog: Story = {
  render: () => <DeletePartnerDialogDemo />,
}

function DeleteDialogOpen() {
  const [open, setOpen] = useState(true)

  return (
    <DeletePartnerDialog
      partner={mockPartner}
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => {
        console.log('Confirm delete')
        alert('Partner deleted!')
      }}
    />
  )
}

export const DeleteDialogOpenState: Story = {
  render: () => <DeleteDialogOpen />,
}

function DeletePremiumPartnerDialog() {
  const [open, setOpen] = useState(true)

  return (
    <DeletePartnerDialog
      partner={premiumPartner}
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => alert('Deleted!')}
    />
  )
}

export const DeletePremiumPartner: Story = {
  render: () => <DeletePremiumPartnerDialog />,
}

function DeleteInactivePartnerDialog() {
  const [open, setOpen] = useState(true)

  return (
    <DeletePartnerDialog
      partner={inactivePartner}
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => alert('Deleted!')}
    />
  )
}

export const DeleteInactivePartner: Story = {
  render: () => <DeleteInactivePartnerDialog />,
}

// =============================================================================
// ALL DIALOGS SHOWCASE
// =============================================================================

function AllDialogsShowcase() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-xl font-semibold text-primary">Partner Dialogs Showcase</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Create Dialog */}
        <div className="flex flex-col items-center gap-3 p-6 border border-default rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-teal" />
          </div>
          <h3 className="font-medium text-primary">Create Partner</h3>
          <p className="text-sm text-secondary text-center">Add a new partner</p>
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            Open Dialog
          </Button>
        </div>

        {/* Edit Dialog */}
        <div className="flex flex-col items-center gap-3 p-6 border border-default rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-muted-bg flex items-center justify-center">
            <Pencil className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="font-medium text-primary">Edit Partner</h3>
          <p className="text-sm text-secondary text-center">Modify existing partner</p>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Open Dialog
          </Button>
        </div>

        {/* Delete Dialog */}
        <div className="flex flex-col items-center gap-3 p-6 border border-default rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-error" />
          </div>
          <h3 className="font-medium text-primary">Delete Partner</h3>
          <p className="text-sm text-secondary text-center">Remove a partner</p>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Open Dialog
          </Button>
        </div>
      </div>

      <EditPartnerDialog
        partner={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data: PartnerFormData) => {
          console.log('Create:', data)
          alert(`Partner "${data.companyName}" created!`)
        }}
      />

      <EditPartnerDialog
        partner={mockPartner}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data: PartnerFormData) => {
          console.log('Save:', data)
          alert(`Partner "${data.companyName}" updated!`)
        }}
      />

      <DeletePartnerDialog
        partner={mockPartner}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          console.log('Delete confirmed')
          alert('Partner deleted!')
        }}
      />
    </div>
  )
}

export const AllDialogs: Story = {
  render: () => <AllDialogsShowcase />,
}

// =============================================================================
// DIFFERENT PARTNER TIERS
// =============================================================================

function TierVariationsShowcase() {
  const [enterpriseOpen, setEnterpriseOpen] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [standardOpen, setStandardOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-xl font-semibold text-primary">Edit Partners by Tier</h2>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="secondary" onClick={() => setEnterpriseOpen(true)}>
          <Building2 className="w-4 h-4 mr-2" />
          Enterprise Partner
        </Button>
        <Button variant="secondary" onClick={() => setPremiumOpen(true)}>
          <Building2 className="w-4 h-4 mr-2" />
          Premium Partner
        </Button>
        <Button variant="secondary" onClick={() => setStandardOpen(true)}>
          <Building2 className="w-4 h-4 mr-2" />
          Standard Partner
        </Button>
      </div>

      <EditPartnerDialog
        partner={mockPartner}
        open={enterpriseOpen}
        onOpenChange={setEnterpriseOpen}
        onSubmit={(data: PartnerFormData) => alert(`Saved: ${data.companyName}`)}
      />

      <EditPartnerDialog
        partner={premiumPartner}
        open={premiumOpen}
        onOpenChange={setPremiumOpen}
        onSubmit={(data: PartnerFormData) => alert(`Saved: ${data.companyName}`)}
      />

      <EditPartnerDialog
        partner={pendingPartner}
        open={standardOpen}
        onOpenChange={setStandardOpen}
        onSubmit={(data: PartnerFormData) => alert(`Saved: ${data.companyName}`)}
      />
    </div>
  )
}

export const TierVariations: Story = {
  render: () => <TierVariationsShowcase />,
}
