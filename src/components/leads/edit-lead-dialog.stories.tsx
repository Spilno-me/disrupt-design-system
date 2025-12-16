import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EditLeadDialog } from './EditLeadDialog'
import { Lead } from './LeadCard'
import { CreateLeadFormData, Partner } from './CreateLeadDialog'
import { Button } from '../ui/button'

const meta: Meta<typeof EditLeadDialog> = {
  title: 'Partner/Dialogs/EditLeadDialog',
  component: EditLeadDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is currently submitting',
    },
  },
}

export default meta
type Story = StoryObj<typeof EditLeadDialog>

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
  description: 'Interested in comprehensive safety compliance platform. Looking for Q1 2024 implementation.',
  value: 45000,
  createdAt: '2 weeks ago',
}

const anotherLead: Lead = {
  id: '2',
  name: 'Sarah Johnson',
  company: 'Global Compliance Solutions',
  email: 'sarah.j@globalcompliance.com',
  phone: '+1 (555) 987-6543',
  priority: 'medium',
  score: 72,
  status: 'contacted',
  source: 'referral',
  description: 'Referred by existing client. Needs help with environmental compliance tracking.',
  value: 32000,
  createdAt: '5 days ago',
}

// Sample partners list
const samplePartners: Partner[] = [
  { id: '1', name: 'Acme Safety Partners' },
  { id: '2', name: 'Global Compliance Solutions' },
  { id: '3', name: 'SafetyFirst Consulting' },
  { id: '4', name: 'EHS Pro Services' },
]

// Interactive wrapper component
function EditLeadDialogDemo({
  lead,
  partners,
  isSubmitting: isSubmittingProp = false,
}: {
  lead: Lead
  partners?: Partner[]
  isSubmitting?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(isSubmittingProp)
  const [lastUpdate, setLastUpdate] = useState<CreateLeadFormData | null>(null)

  const handleSubmit = async (leadId: string, data: CreateLeadFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLastUpdate(data)
    setIsSubmitting(false)
    setOpen(false)
    console.log('Lead updated:', leadId, data)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-4 bg-surface border border-default rounded-lg min-w-[400px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-primary">{lead.company}</h3>
            <p className="text-sm text-secondary">{lead.name} - {lead.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${
            lead.priority === 'high' ? 'bg-error-light text-error' :
            lead.priority === 'medium' ? 'bg-warning-light text-warning' :
            'bg-muted-bg text-primary'
          }`}>
            {lead.priority}
          </span>
          <span className="px-2 py-1 bg-muted-bg text-primary rounded">
            {lead.source}
          </span>
        </div>
      </div>

      <EditLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={lead}
        onSubmit={handleSubmit}
        partners={partners}
        isSubmitting={isSubmitting}
      />

      {lastUpdate && (
        <div className="p-4 bg-success-light border border-success rounded-lg max-w-md">
          <h4 className="font-semibold text-success mb-2">Lead Updated Successfully!</h4>
          <pre className="text-xs text-primary overflow-auto">
            {JSON.stringify(lastUpdate, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <EditLeadDialogDemo lead={sampleLead} partners={samplePartners} />,
}

export const MediumPriorityLead: Story = {
  render: () => <EditLeadDialogDemo lead={anotherLead} partners={samplePartners} />,
}

export const WithoutPartners: Story = {
  render: () => <EditLeadDialogDemo lead={sampleLead} />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    onSubmit: (leadId: string, data: CreateLeadFormData) => console.log('Submitted:', leadId, data),
    partners: samplePartners,
  },
}

export const Submitting: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    lead: sampleLead,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    },
    partners: samplePartners,
    isSubmitting: true,
  },
}

// Story showing validation
function ValidationDemo() {
  const [open, setOpen] = useState(true)

  // Lead with empty required fields to trigger validation
  const leadWithMissingData: Lead = {
    ...sampleLead,
    company: '',
    name: '',
    email: 'invalid-email',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-secondary max-w-md text-center">
        This lead has invalid data. Try submitting to see validation errors.
      </p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <EditLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={leadWithMissingData}
        onSubmit={(leadId: string, data: CreateLeadFormData) => {
          console.log('Form submitted:', leadId, data)
          setOpen(false)
        }}
        partners={samplePartners}
      />
    </div>
  )
}

export const WithValidation: Story = {
  render: () => <ValidationDemo />,
}

// Full workflow story - edit and see changes
function FullWorkflowDemo() {
  const [open, setOpen] = useState(false)
  const [currentLead, setCurrentLead] = useState<Lead>(sampleLead)

  const handleSubmit = async (leadId: string, data: CreateLeadFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the lead with new data
    setCurrentLead({
      ...currentLead,
      company: data.companyName,
      name: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      priority: data.priority,
      source: data.source,
      description: data.notes,
    })

    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 min-w-[500px]">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-primary mb-4">Lead Details</h2>

        <div className="p-6 bg-surface border border-default rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary mb-1">{currentLead.company}</h3>
              <p className="text-secondary">{currentLead.name}</p>
            </div>
            <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
              Edit Lead
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Email</p>
              <p className="text-sm text-primary">{currentLead.email}</p>
            </div>
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Phone</p>
              <p className="text-sm text-primary">{currentLead.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Priority</p>
              <span className={`inline-block px-2 py-1 text-xs font-semibold uppercase rounded ${
                currentLead.priority === 'high' ? 'bg-error-light text-error' :
                currentLead.priority === 'medium' ? 'bg-warning-light text-warning' :
                'bg-muted-bg text-primary'
              }`}>
                {currentLead.priority}
              </span>
            </div>
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Source</p>
              <span className="inline-block px-2 py-1 text-xs bg-muted-bg text-primary rounded">
                {currentLead.source}
              </span>
            </div>
          </div>

          {currentLead.description && (
            <div>
              <p className="text-xs text-secondary font-medium uppercase mb-1">Notes</p>
              <p className="text-sm text-primary">{currentLead.description}</p>
            </div>
          )}
        </div>
      </div>

      <EditLeadDialog
        open={open}
        onOpenChange={setOpen}
        lead={currentLead}
        onSubmit={handleSubmit}
        partners={samplePartners}
      />
    </div>
  )
}

export const FullWorkflow: Story = {
  render: () => <FullWorkflowDemo />,
}
