import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AssignLeadDialog } from './AssignLeadDialog'
import { Lead } from './LeadCard'
import { Partner } from './CreateLeadDialog'
import { Button } from '../ui/button'

const meta: Meta<typeof AssignLeadDialog> = {
  title: 'Partner/Dialogs/AssignLeadDialog',
  component: AssignLeadDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ORGANISM

Dialog for assigning leads to partners with partner selection. Partner-specific component.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    isAssigning: {
      control: 'boolean',
      description: 'Whether the assignment is in progress',
    },
  },
}

export default meta
type Story = StoryObj<typeof AssignLeadDialog>

// Sample lead data
const sampleLead: Lead = {
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

const urgentLead: Lead = {
  id: '2',
  name: 'Sarah Johnson',
  company: 'Global Compliance Solutions',
  email: 'sarah.j@globalcompliance.com',
  phone: undefined,
  priority: 'high',
  score: 92,
  status: 'new',
  source: 'referral',
  description: 'Urgent need for environmental compliance tracking.',
  createdAt: '1 day ago',
}

// Sample partners list
const samplePartners: Partner[] = [
  { id: '1', name: 'Acme Safety Partners' },
  { id: '2', name: 'Global Compliance Solutions' },
  { id: '3', name: 'SafetyFirst Consulting' },
  { id: '4', name: 'EHS Pro Services' },
  { id: '5', name: 'Compliance Experts Inc.' },
]

// Interactive wrapper component
function AssignLeadDialogDemo({
  lead,
  partners,
  isAssigning: isAssigningProp = false,
}: {
  lead: Lead
  partners: Partner[]
  isAssigning?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isAssigning, setIsAssigning] = useState(isAssigningProp)
  const [assignment, setAssignment] = useState<{ partnerId: string; notes?: string } | null>(null)

  const handleAssign = async (leadId: string, partnerId: string, notes?: string) => {
    setIsAssigning(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const partner = partners.find(p => p.id === partnerId)
    setAssignment({ partnerId: partner?.name || partnerId, notes })
    setIsAssigning(false)
    setOpen(false)
    console.log('Lead assigned:', leadId, 'to partner:', partnerId, 'notes:', notes)
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
          <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
            Assign
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
            {lead.source}
          </span>
          <span className="px-2 py-1 bg-info-light text-info rounded">
            {lead.status}
          </span>
        </div>
      </div>

      <AssignLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={lead}
        partners={partners}
        onAssign={handleAssign}
        isAssigning={isAssigning}
      />

      {assignment && (
        <div className="p-4 bg-success-light border border-success rounded-lg max-w-md">
          <h4 className="font-semibold text-success mb-2">Lead Assigned Successfully!</h4>
          <p className="text-sm text-primary mb-2">
            Assigned to: <span className="font-semibold">{assignment.partnerId}</span>
          </p>
          {assignment.notes && (
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Notes:</p>
              <p className="text-sm text-primary">{assignment.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <AssignLeadDialogDemo lead={sampleLead} partners={samplePartners} />,
}

export const UrgentLead: Story = {
  render: () => <AssignLeadDialogDemo lead={urgentLead} partners={samplePartners} />,
}

export const FewPartners: Story = {
  render: () => <AssignLeadDialogDemo lead={sampleLead} partners={samplePartners.slice(0, 2)} />,
}

export const NoPartners: Story = {
  render: () => <AssignLeadDialogDemo lead={sampleLead} partners={[]} />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    partners: samplePartners,
    onAssign: (leadId, partnerId, notes) =>
      console.log('Assigned:', leadId, partnerId, notes),
  },
}

export const Assigning: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    partners: samplePartners,
    onAssign: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    },
    isAssigning: true,
  },
}

// Story showing validation
function ValidationDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-secondary max-w-md text-center">
        Try submitting without selecting a partner to see validation error.
      </p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <AssignLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={sampleLead}
        partners={samplePartners}
        onAssign={(leadId, partnerId, notes) => {
          console.log('Assigned:', leadId, partnerId, notes)
          setOpen(false)
        }}
      />
    </div>
  )
}

export const WithValidation: Story = {
  render: () => <ValidationDemo />,
}

// Full workflow story - assign and track assignments
function FullWorkflowDemo() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [leads, _setLeads] = useState([
    sampleLead,
    urgentLead,
    {
      id: '3',
      name: 'Mike Davis',
      company: 'Safety Corp',
      email: 'mike@safetycorp.com',
      priority: 'medium' as const,
      score: 68,
      status: 'new' as const,
      source: 'website' as const,
      createdAt: '3 days ago',
    },
  ])
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  const handleAssign = async (leadId: string, partnerId: string, _notes?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const partner = samplePartners.find(p => p.id === partnerId)
    setAssignments(prev => ({ ...prev, [leadId]: partner?.name || partnerId }))
    setOpenDialog(null)
  }

  return (
    <div className="flex flex-col gap-6 min-w-[600px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Unassigned Leads</h2>
        <p className="text-sm text-secondary">
          {leads.filter(l => !assignments[l.id]).length} leads need assignment
        </p>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
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
              <span className={`px-2 py-1 text-xs font-semibold uppercase rounded ${
                lead.priority === 'high' ? 'bg-error-light text-error' :
                lead.priority === 'medium' ? 'bg-warning-light text-warning' :
                'bg-muted-bg text-primary'
              }`}>
                {lead.priority}
              </span>
            </div>

            <div className="ml-4">
              {assignments[lead.id] ? (
                <div className="text-sm">
                  <p className="text-secondary">Assigned to:</p>
                  <p className="font-medium text-primary">{assignments[lead.id]}</p>
                </div>
              ) : (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setOpenDialog(lead.id)}
                >
                  Assign
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {leads.map((lead) => (
        <AssignLeadDialog
          key={lead.id}
          open={openDialog === lead.id}
          onOpenChange={(open) => setOpenDialog(open ? lead.id : null)}
          lead={lead}
          partners={samplePartners}
          onAssign={handleAssign}
        />
      ))}
    </div>
  )
}

export const FullWorkflow: Story = {
  render: () => <FullWorkflowDemo />,
}
