import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tipseen } from '../../components/ui/Tipseen'
import { Button } from '../../components/ui/button'
import { MOLECULE_META, StorySection } from '../_infrastructure'

const meta: Meta<typeof Tipseen> = {
  ...MOLECULE_META,
  title: 'Shared/Feedback/Tipseen',
  component: Tipseen,
  parameters: {
    docs: {
      description: {
        component: `
**Tipseen** is a guided onboarding tooltip for feature discovery.

Unlike regular tooltips (which provide contextual help on hover), Tipseen is designed for:
- Onboarding flows
- Feature discovery
- Multi-step tours
- Prominent call-to-actions

Inspired by monday.com's Vibe Design System.
`,
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    color: {
      control: 'select',
      options: ['primary', 'inverted'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Tipseen>

export const Default: Story = {
  args: {
    title: 'Getting Started',
    content: 'Click here to create your first report and start tracking incidents.',
    defaultOpen: true,
    position: 'bottom',
  },
  render: (args) => (
    <div className="p-20 flex items-center justify-center">
      <Tipseen {...args}>
        <Button>Create Report</Button>
      </Tipseen>
    </div>
  ),
}

export const WithActions: Story = {
  args: {
    title: 'Pro Tip',
    content: 'You can filter results by date, status, or category.',
    defaultOpen: true,
    position: 'right',
    primaryAction: {
      label: 'Got it',
      onClick: () => console.log('Primary clicked'),
    },
    secondaryAction: {
      label: 'Skip tour',
      onClick: () => console.log('Secondary clicked'),
    },
  },
  render: (args) => (
    <div className="p-20 flex items-center justify-center">
      <Tipseen {...args}>
        <Button variant="outline">Filter</Button>
      </Tipseen>
    </div>
  ),
}

export const WithStepIndicator: Story = {
  args: {
    title: 'Step 2 of 5',
    content: 'Configure your notification preferences.',
    defaultOpen: true,
    position: 'bottom',
    step: { current: 2, total: 5 },
    primaryAction: { label: 'Next', onClick: () => {} },
    secondaryAction: { label: 'Skip', onClick: () => {} },
  },
  render: (args) => (
    <div className="p-20 flex items-center justify-center">
      <Tipseen {...args}>
        <Button>Settings</Button>
      </Tipseen>
    </div>
  ),
}

function ControlledExample() {
  const [open, setOpen] = useState(true)
  return (
    <div className="p-20 flex flex-col items-center gap-4">
      <Tipseen
        open={open}
        onOpenChange={setOpen}
        title="Welcome!"
        content="This is controlled. Toggle below."
        position="bottom"
        primaryAction={{ label: 'Dismiss', onClick: () => setOpen(false) }}
      >
        <Button>Target</Button>
      </Tipseen>
      <Button variant="outline" onClick={() => setOpen(!open)}>
        {open ? 'Hide' : 'Show'} Tipseen
      </Button>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-16 p-8">
      <StorySection title="Positions">
        <div className="grid grid-cols-2 gap-16 p-20">
          <div className="flex justify-center">
            <Tipseen title="Top" content="Above trigger" position="top" defaultOpen hideCloseButton>
              <Button variant="outline">Top</Button>
            </Tipseen>
          </div>
          <div className="flex justify-center">
            <Tipseen title="Bottom" content="Below trigger" position="bottom" defaultOpen hideCloseButton>
              <Button variant="outline">Bottom</Button>
            </Tipseen>
          </div>
        </div>
      </StorySection>

      <StorySection title="Color Themes">
        <div className="flex gap-20 p-10 justify-center">
          <Tipseen title="Inverted" content="Dark bg" color="inverted" defaultOpen hideCloseButton>
            <Button>Inverted</Button>
          </Tipseen>
          <Tipseen title="Primary" content="Accent bg" color="primary" defaultOpen hideCloseButton>
            <Button variant="accent">Primary</Button>
          </Tipseen>
        </div>
      </StorySection>
    </div>
  ),
}
