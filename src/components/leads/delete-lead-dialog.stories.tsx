import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DeleteLeadDialog } from './DeleteLeadDialog'
import { Lead } from './LeadCard'
import { Button } from '../ui/button'

const meta: Meta<typeof DeleteLeadDialog> = {
  title: 'Partner/Leads/DeleteLeadDialog',
  component: DeleteLeadDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    isDeleting: {
      control: 'boolean',
      description: 'Whether the deletion is in progress',
    },
  },
}

export default meta
type Story = StoryObj<typeof DeleteLeadDialog>

// Sample lead data
const sampleLead: Lead = {
  id: '1',
  name: 'John Smith',
  company: 'Acme Safety Partners',
  email: 'john.smith@acmesafety.com',
  phone: '+1 (555) 123-4567',
  priority: 'high',
  score: 85,
  status: 'qualified',
  source: 'website',
  description: 'Interested in comprehensive safety compliance platform.',
  value: 45000,
  createdAt: '2 weeks ago',
}

const highValueLead: Lead = {
  id: '2',
  name: 'Sarah Johnson',
  company: 'Global Compliance Solutions',
  email: 'sarah.j@globalcompliance.com',
  phone: undefined,
  priority: 'high',
  score: 92,
  status: 'converted',
  source: 'referral',
  description: 'Successfully converted customer.',
  value: 150000,
  createdAt: '3 months ago',
}

const newLead: Lead = {
  id: '3',
  name: 'Mike Davis',
  company: 'Safety Corp',
  email: 'mike@safetycorp.com',
  priority: 'medium',
  score: 68,
  status: 'new',
  source: 'website',
  createdAt: '1 day ago',
}

// Interactive wrapper component
function DeleteLeadDialogDemo({
  lead,
  isDeleting: isDeletingProp = false,
}: {
  lead: Lead
  isDeleting?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(isDeletingProp)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async (leadToDelete: Lead) => {
    setIsDeleting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setDeleted(true)
    setIsDeleting(false)
    setOpen(false)
    console.log('Lead deleted:', leadToDelete)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-strong text-inverse flex items-center justify-center font-semibold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-primary">{lead.company}</h3>
              <p className="text-sm text-secondary">{lead.name}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={deleted}
          >
            {deleted ? 'Deleted' : 'Delete'}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded font-semibold ${
            lead.priority === 'high' ? 'bg-error-light text-error' :
            lead.priority === 'medium' ? 'bg-warning-light text-warning' :
            'bg-muted-bg text-primary'
          }`}>
            {lead.priority.toUpperCase()}
          </span>
          <span className="px-2 py-1 bg-muted-bg text-primary rounded">
            Score: {lead.score}
          </span>
          {lead.value && (
            <span className="px-2 py-1 bg-accent-bg text-accent rounded font-semibold">
              ${lead.value.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <DeleteLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={lead}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {deleted && (
        <div className="p-4 bg-error-light border border-error rounded-lg max-w-md">
          <h4 className="font-semibold text-error mb-2">Lead Deleted</h4>
          <p className="text-sm text-primary">
            {lead.company} has been permanently removed from the system.
          </p>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <DeleteLeadDialogDemo lead={sampleLead} />,
}

export const HighValueLead: Story = {
  render: () => <DeleteLeadDialogDemo lead={highValueLead} />,
}

export const NewLead: Story = {
  render: () => <DeleteLeadDialogDemo lead={newLead} />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    onConfirm: (lead) => console.log('Deleted:', lead),
  },
}

export const Deleting: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    },
    isDeleting: true,
  },
}

// Full workflow story - delete from list
function FullWorkflowDemo() {
  const [leads, setLeads] = useState([sampleLead, highValueLead, newLead])
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async (lead: Lead) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLeads(prev => prev.filter(l => l.id !== lead.id))
    setDeleteDialogOpen(false)
    setLeadToDelete(null)
  }

  return (
    <div className="flex flex-col gap-6 min-w-[600px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Leads</h2>
        <p className="text-sm text-secondary">{leads.length} total leads</p>
      </div>

      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-secondary border border-dashed border-default rounded-lg">
            All leads have been deleted
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 bg-surface border border-default rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-accent-strong text-inverse flex items-center justify-center font-semibold text-sm">
                  {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary">{lead.company}</p>
                  <p className="text-sm text-secondary">{lead.name} • {lead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold uppercase rounded ${
                    lead.status === 'new' ? 'bg-info-light text-info' :
                    lead.status === 'contacted' ? 'bg-warning-light text-warning' :
                    lead.status === 'qualified' ? 'bg-accent-bg text-accent' :
                    lead.status === 'converted' ? 'bg-success-light text-success' :
                    'bg-error-light text-error'
                  }`}>
                    {lead.status}
                  </span>
                  {lead.value && (
                    <span className="px-2 py-1 bg-accent-bg text-accent rounded font-semibold text-sm">
                      ${lead.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(lead)}
                className="ml-4"
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>

      <DeleteLeadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lead={leadToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export const FullWorkflow: Story = {
  render: () => <FullWorkflowDemo />,
}
