import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { StatusUpdateDialog } from './StatusUpdateDialog'
import { Lead, LeadStatus } from './LeadCard'
import { Button } from '../ui/button'

const meta: Meta<typeof StatusUpdateDialog> = {
  title: 'Partner/Dialogs/StatusUpdateDialog',
  component: StatusUpdateDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ORGANISM

Dialog for updating lead status with status selection dropdown. Partner-specific component.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    isUpdating: {
      control: 'boolean',
      description: 'Whether the status update is in progress',
    },
  },
}

export default meta
type Story = StoryObj<typeof StatusUpdateDialog>

// Sample lead data with different statuses
const newLead: Lead = {
  id: '1',
  name: 'John Smith',
  company: 'Acme Safety Partners',
  email: 'john.smith@acmesafety.com',
  phone: '+1 (555) 123-4567',
  priority: 'high',
  score: 85,
  status: 'new',
  source: 'website',
  description: 'Interested in comprehensive safety compliance platform.',
  value: 45000,
  createdAt: '2 weeks ago',
}

const contactedLead: Lead = {
  ...newLead,
  id: '2',
  name: 'Sarah Johnson',
  company: 'Global Compliance Solutions',
  status: 'contacted',
}

const qualifiedLead: Lead = {
  ...newLead,
  id: '3',
  name: 'Mike Davis',
  company: 'Safety Corp',
  status: 'qualified',
}

const convertedLead: Lead = {
  ...newLead,
  id: '4',
  name: 'Emma Wilson',
  company: 'EHS Pro Services',
  status: 'converted',
}

// Interactive wrapper component
function StatusUpdateDialogDemo({
  lead,
  isUpdating: isUpdatingProp = false,
}: {
  lead: Lead
  isUpdating?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [currentLead, setCurrentLead] = useState(lead)
  const [isUpdating, setIsUpdating] = useState(isUpdatingProp)
  const [lastUpdate, setLastUpdate] = useState<{ status: LeadStatus; notes?: string } | null>(null)

  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus, notes?: string) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCurrentLead({ ...currentLead, status: newStatus })
    setLastUpdate({ status: newStatus, notes })
    setIsUpdating(false)
    setOpen(false)
    console.log('Status updated:', leadId, newStatus, notes)
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-info-light text-info border-info'
      case 'contacted': return 'bg-warning-light text-warning border-warning'
      case 'qualified': return 'bg-accent-bg text-accent border-accent'
      case 'converted': return 'bg-success-light text-success border-success'
      case 'lost': return 'bg-error-light text-error border-error'
      default: return 'bg-muted-bg text-primary border-default'
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-strong text-inverse flex items-center justify-center font-semibold text-sm">
              {currentLead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-primary">{currentLead.company}</h3>
              <p className="text-sm text-secondary">{currentLead.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Update Status
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 text-sm font-semibold rounded border ${getStatusColor(currentLead.status)}`}>
            {currentLead.status.charAt(0).toUpperCase() + currentLead.status.slice(1)}
          </span>
        </div>
      </div>

      <StatusUpdateDialog
        open={open}
        onOpenChange={setOpen}
        lead={currentLead}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
      />

      {lastUpdate && (
        <div className="p-4 bg-success-light border border-success rounded-lg max-w-md">
          <h4 className="font-semibold text-success mb-2">Status Updated Successfully!</h4>
          <p className="text-sm text-primary mb-2">
            New status: <span className="font-semibold capitalize">{lastUpdate.status}</span>
          </p>
          {lastUpdate.notes && (
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Notes:</p>
              <p className="text-sm text-primary">{lastUpdate.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const NewLead: Story = {
  render: () => <StatusUpdateDialogDemo lead={newLead} />,
}

export const ContactedLead: Story = {
  render: () => <StatusUpdateDialogDemo lead={contactedLead} />,
}

export const QualifiedLead: Story = {
  render: () => <StatusUpdateDialogDemo lead={qualifiedLead} />,
}

export const ConvertedLead: Story = {
  render: () => <StatusUpdateDialogDemo lead={convertedLead} />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: newLead,
    onStatusUpdate: (leadId, newStatus, notes) =>
      console.log('Updated:', leadId, newStatus, notes),
  },
}

export const Updating: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: newLead,
    onStatusUpdate: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    },
    isUpdating: true,
  },
}

// Story showing validation
function ValidationDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-secondary max-w-md text-center">
        Try submitting without changing the status to see validation error.
      </p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <StatusUpdateDialog
        open={open}
        onOpenChange={setOpen}
        lead={newLead}
        onStatusUpdate={(leadId, newStatus, notes) => {
          console.log('Status updated:', leadId, newStatus, notes)
          setOpen(false)
        }}
      />
    </div>
  )
}

export const WithValidation: Story = {
  render: () => <ValidationDemo />,
}

// Full workflow story - track status progression
function FullWorkflowDemo() {
  const [open, setOpen] = useState(false)
  const [leads, setLeads] = useState([
    newLead,
    contactedLead,
    qualifiedLead,
    {
      id: '5',
      name: 'Alex Brown',
      company: 'Compliance Experts',
      email: 'alex@complianceexperts.com',
      priority: 'medium' as const,
      score: 70,
      status: 'new' as const,
      source: 'referral' as const,
      createdAt: '1 week ago',
    },
  ])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusHistory, setStatusHistory] = useState<Array<{ leadId: string; from: LeadStatus; to: LeadStatus; timestamp: Date }>>([])

  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus, _notes?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setLeads(prev => prev.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ))

    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setStatusHistory(prev => [...prev, {
        leadId,
        from: lead.status,
        to: newStatus,
        timestamp: new Date(),
      }])
    }

    setOpen(false)
    setSelectedLead(null)
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-info-light text-info'
      case 'contacted': return 'bg-warning-light text-warning'
      case 'qualified': return 'bg-accent-bg text-accent'
      case 'converted': return 'bg-success-light text-success'
      case 'lost': return 'bg-error-light text-error'
      default: return 'bg-muted-bg text-primary'
    }
  }

  return (
    <div className="flex flex-col gap-6 min-w-[700px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Lead Pipeline</h2>
        <p className="text-sm text-secondary">
          {statusHistory.length} status updates made
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Leads List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-primary uppercase">Leads</h3>
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="p-3 bg-surface border border-default rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-medium text-primary">{lead.company}</p>
                <p className="text-xs text-secondary">{lead.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLead(lead)
                    setOpen(true)
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Status History */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-primary uppercase">Recent Updates</h3>
          {statusHistory.length === 0 ? (
            <div className="p-6 text-center text-secondary text-sm bg-muted-bg rounded-lg">
              No status updates yet
            </div>
          ) : (
            <div className="space-y-2">
              {statusHistory.slice(-5).reverse().map((update, idx) => {
                const lead = leads.find(l => l.id === update.leadId)
                return (
                  <div key={idx} className="p-3 bg-surface border border-default rounded-lg text-xs">
                    <p className="font-medium text-primary mb-1">{lead?.company}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 font-semibold uppercase rounded ${getStatusColor(update.from)}`}>
                        {update.from}
                      </span>
                      <span className="text-muted">→</span>
                      <span className={`px-2 py-0.5 font-semibold uppercase rounded ${getStatusColor(update.to)}`}>
                        {update.to}
                      </span>
                    </div>
                    <p className="text-muted mt-1">{update.timestamp.toLocaleTimeString()}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedLead && (
        <StatusUpdateDialog
          open={open}
          onOpenChange={setOpen}
          lead={selectedLead}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

export const FullWorkflow: Story = {
  render: () => <FullWorkflowDemo />,
}
