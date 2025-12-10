import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CreateLeadDialog, CreateLeadFormData, Partner } from './CreateLeadDialog'
import { Button } from '../ui/button'

const meta: Meta<typeof CreateLeadDialog> = {
  title: 'Partner/Leads/CreateLeadDialog',
  component: CreateLeadDialog,
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
type Story = StoryObj<typeof CreateLeadDialog>

// Sample partners list
const samplePartners: Partner[] = [
  { id: '1', name: 'Acme Safety Partners' },
  { id: '2', name: 'Global Compliance Solutions' },
  { id: '3', name: 'SafetyFirst Consulting' },
  { id: '4', name: 'EHS Pro Services' },
]

// Interactive wrapper component
function CreateLeadDialogDemo({
  partners,
  isSubmitting: isSubmittingProp = false,
}: {
  partners?: Partner[]
  isSubmitting?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(isSubmittingProp)
  const [lastSubmission, setLastSubmission] = useState<CreateLeadFormData | null>(null)

  const handleSubmit = async (data: CreateLeadFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLastSubmission(data)
    setIsSubmitting(false)
    setOpen(false)
    console.log('Lead created:', data)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Button variant="accent" onClick={() => setOpen(true)}>
        Create New Lead
      </Button>

      <CreateLeadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        partners={partners}
        isSubmitting={isSubmitting}
      />

      {lastSubmission && (
        <div className="p-4 bg-success-light border border-success rounded-lg max-w-md">
          <h4 className="font-semibold text-success mb-2">Lead Created Successfully!</h4>
          <pre className="text-xs text-primary overflow-auto">
            {JSON.stringify(lastSubmission, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <CreateLeadDialogDemo partners={samplePartners} />,
}

export const WithoutPartners: Story = {
  render: () => <CreateLeadDialogDemo />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: (data) => console.log('Submitted:', data),
    partners: samplePartners,
  },
}

export const Submitting: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
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

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-secondary">
        Try submitting the form without filling required fields to see validation
      </p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <CreateLeadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Form submitted:', data)
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

// Story showing pre-populated form (for edit scenario reference)
function PrefilledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-secondary max-w-md text-center">
        This shows the dialog with sample partners available for assignment.
        Click Create Lead to open the dialog.
      </p>
      <Button variant="accent" onClick={() => setOpen(true)}>
        Create New Lead
      </Button>
      <CreateLeadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Lead data:', data)
          alert(`Lead created for ${data.companyName}`)
          setOpen(false)
        }}
        partners={samplePartners}
      />
    </div>
  )
}

export const WithPartnerOptions: Story = {
  render: () => <PrefilledDemo />,
}

// Full workflow story
function FullWorkflowDemo() {
  const [open, setOpen] = useState(false)
  const [leads, setLeads] = useState<CreateLeadFormData[]>([])

  const handleSubmit = async (data: CreateLeadFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLeads((prev) => [...prev, data])
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 min-w-[400px]">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-primary">Leads Management</h2>
        <Button variant="accent" onClick={() => setOpen(true)}>
          + New Lead
        </Button>
      </div>

      {leads.length === 0 ? (
        <div className="py-12 text-center text-secondary">
          <p>No leads yet. Click "New Lead" to create one.</p>
        </div>
      ) : (
        <div className="w-full space-y-2">
          {leads.map((lead, index) => (
            <div
              key={index}
              className="p-3 bg-surface border border-default rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-primary">{lead.companyName}</p>
                <p className="text-sm text-secondary">
                  {lead.contactName} - {lead.contactEmail}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs font-semibold uppercase rounded ${
                  lead.priority === 'high'
                    ? 'bg-error-light text-error'
                    : lead.priority === 'medium'
                    ? 'bg-warning-light text-warning'
                    : 'bg-muted-bg text-primary'
                }`}
              >
                {lead.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      <CreateLeadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        partners={samplePartners}
      />
    </div>
  )
}

export const FullWorkflow: Story = {
  render: () => <FullWorkflowDemo />,
}
