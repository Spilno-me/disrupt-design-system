import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CreateActivityDialog, CreateActivityFormData } from './CreateActivityDialog'
import { MOLECULE_META, moleculeDescription } from '@/stories/_infrastructure'
import { Button } from '../ui/button'

const meta: Meta<typeof CreateActivityDialog> = {
  title: 'Partner/Components/CreateActivityDialog',
  component: CreateActivityDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Dialog for logging new lead activities including calls, emails, meetings, and notes.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CreateActivityDialog>

// Interactive wrapper for controlled dialog
function DialogWrapper({ leadName }: { leadName?: string }) {
  const [open, setOpen] = useState(true)
  
  const handleSubmit = async (data: CreateActivityFormData) => {
    console.log('Activity submitted:', data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Log Activity</Button>
      <CreateActivityDialog
        open={open}
        onOpenChange={setOpen}
        leadId="lead-123"
        leadName={leadName}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <DialogWrapper leadName="Acme Corporation" />,
}

export const WithoutLeadName: Story = {
  render: () => <DialogWrapper />,
}

export const AllActivityTypes: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Log Activity</Button>
        <CreateActivityDialog
          open={open}
          onOpenChange={setOpen}
          leadId="lead-123"
          leadName="Test Lead"
          onSubmit={(data) => {
            console.log('Selected type:', data.type)
            setOpen(false)
          }}
        />
      </>
    )
  },
}
