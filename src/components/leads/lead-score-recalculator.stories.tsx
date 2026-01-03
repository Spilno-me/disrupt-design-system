import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LeadScoreRecalculator, ScoreChange } from './LeadScoreRecalculator'
import { MOLECULE_META, moleculeDescription } from '@/stories/_infrastructure'
import { Button } from '../ui/button'

const meta: Meta<typeof LeadScoreRecalculator> = {
  title: 'Partner/Components/LeadScoreRecalculator',
  component: LeadScoreRecalculator,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Dialog for recalculating lead scores with preview of changes before applying.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof LeadScoreRecalculator>

const sampleScoreChanges: ScoreChange[] = [
  { leadId: '1', leadName: 'Acme Corporation', oldScore: 65, newScore: 78 },
  { leadId: '2', leadName: 'TechStart Inc', oldScore: 45, newScore: 42 },
  { leadId: '3', leadName: 'Global Industries', oldScore: 80, newScore: 85 },
  { leadId: '4', leadName: 'Local Business LLC', oldScore: 55, newScore: 55 },
  { leadId: '5', leadName: 'Enterprise Solutions', oldScore: 72, newScore: 68 },
]

// Interactive wrapper
function DialogWrapper({ mode = 'bulk' }: { mode?: 'bulk' | 'single' }) {
  const [open, setOpen] = useState(true)
  
  const handlePreview = async (leadIds: string[]): Promise<ScoreChange[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return sampleScoreChanges.filter((_, i) => i < leadIds.length)
  }

  const handleConfirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setOpen(false)
  }

  if (mode === 'single') {
    return (
      <>
        <Button onClick={() => setOpen(true)}>Recalculate Score</Button>
        <LeadScoreRecalculator
          open={open}
          onOpenChange={setOpen}
          leadIds={['1']}
          singleLead={{ id: '1', name: 'Acme Corporation', currentScore: 65 }}
          onConfirm={handleConfirm}
        />
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Recalculate Scores</Button>
      <LeadScoreRecalculator
        open={open}
        onOpenChange={setOpen}
        leadIds={['1', '2', '3', '4', '5']}
        onPreview={handlePreview}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export const BulkMode: Story = {
  render: () => <DialogWrapper mode="bulk" />,
}

export const SingleLeadMode: Story = {
  render: () => <DialogWrapper mode="single" />,
}

export const WithPreviewData: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    leadIds: ['1', '2', '3', '4', '5'],
    previewData: sampleScoreChanges,
    onConfirm: async () => console.log('Confirmed'),
  },
}

export const ManyLeads: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    leadIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    previewData: [
      { leadId: '1', leadName: 'Lead Company 1', oldScore: 55, newScore: 68 },
      { leadId: '2', leadName: 'Lead Company 2', oldScore: 62, newScore: 58 },
      { leadId: '3', leadName: 'Lead Company 3', oldScore: 70, newScore: 75 },
      { leadId: '4', leadName: 'Lead Company 4', oldScore: 48, newScore: 52 },
      { leadId: '5', leadName: 'Lead Company 5', oldScore: 80, newScore: 80 },
      { leadId: '6', leadName: 'Lead Company 6', oldScore: 65, newScore: 72 },
      { leadId: '7', leadName: 'Lead Company 7', oldScore: 72, newScore: 65 },
      { leadId: '8', leadName: 'Lead Company 8', oldScore: 58, newScore: 63 },
      { leadId: '9', leadName: 'Lead Company 9', oldScore: 45, newScore: 50 },
      { leadId: '10', leadName: 'Lead Company 10', oldScore: 88, newScore: 92 },
      { leadId: '11', leadName: 'Lead Company 11', oldScore: 52, newScore: 48 },
      { leadId: '12', leadName: 'Lead Company 12', oldScore: 67, newScore: 70 },
      { leadId: '13', leadName: 'Lead Company 13', oldScore: 75, newScore: 78 },
      { leadId: '14', leadName: 'Lead Company 14', oldScore: 60, newScore: 55 },
      { leadId: '15', leadName: 'Lead Company 15', oldScore: 82, newScore: 85 },
    ],
    onConfirm: async () => console.log('Confirmed'),
  },
}

export const AllIncreased: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    leadIds: ['1', '2', '3'],
    previewData: [
      { leadId: '1', leadName: 'Lead A', oldScore: 50, newScore: 65 },
      { leadId: '2', leadName: 'Lead B', oldScore: 60, newScore: 75 },
      { leadId: '3', leadName: 'Lead C', oldScore: 70, newScore: 85 },
    ],
    onConfirm: async () => console.log('Confirmed'),
  },
}

export const AllDecreased: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    leadIds: ['1', '2', '3'],
    previewData: [
      { leadId: '1', leadName: 'Lead A', oldScore: 80, newScore: 65 },
      { leadId: '2', leadName: 'Lead B', oldScore: 75, newScore: 60 },
      { leadId: '3', leadName: 'Lead C', oldScore: 70, newScore: 55 },
    ],
    onConfirm: async () => console.log('Confirmed'),
  },
}
