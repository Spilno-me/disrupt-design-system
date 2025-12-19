import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ContactFormSuccessModal } from './ContactFormSuccessModal'
import { ContactFormErrorModal } from './ContactFormErrorModal'
import { Button } from '../ui/button'
import { MOLECULE_META, moleculeDescription } from '@/stories/_infrastructure'

const meta: Meta = {
  title: 'Website/Forms/ContactFormModals',
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(`Modal dialogs for contact form submission feedback.

**Success Modal:** Shows animated Disrupt logo that responds to button hover.
**Error Modal:** Shows "broken" logo with scattered pixels that reassemble on hover.`),
      },
    },
  },
}

export default meta
type Story = StoryObj

// Success Modal Story
function SuccessModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="contact" onClick={() => setOpen(true)}>
        Show Success Modal
      </Button>
      <ContactFormSuccessModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export const SuccessModal: Story = {
  render: () => <SuccessModalDemo />,
}

// Error Modal Story
function ErrorModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show Error Modal
      </Button>
      <ContactFormErrorModal
        open={open}
        onClose={() => setOpen(false)}
        onRetry={() => console.log('Retry clicked')}
      />
    </div>
  )
}

export const ErrorModal: Story = {
  render: () => <ErrorModalDemo />,
}

// Custom Text Example
function CustomTextDemo() {
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <Button variant="contact" onClick={() => setSuccessOpen(true)}>
          Custom Success
        </Button>
        <Button variant="outline" onClick={() => setErrorOpen(true)}>
          Custom Error
        </Button>
      </div>

      <ContactFormSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Thank You!"
        description="Your demo request has been submitted. Our team will contact you shortly."
        buttonText="Awesome!"
      />

      <ContactFormErrorModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        onRetry={() => setErrorOpen(false)}
        title="Oops!"
        description="Network error occurred. Please check your connection and try again."
        closeButtonText="Cancel"
        retryButtonText="Retry Now"
      />
    </div>
  )
}

export const CustomText: Story = {
  name: 'Custom Text',
  render: () => <CustomTextDemo />,
}

// Both Modals Side by Side (for documentation)
function BothModalsDemo() {
  const [successOpen, setSuccessOpen] = useState(true)
  const [errorOpen, setErrorOpen] = useState(true)

  return (
    <div className="flex gap-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Success State</h3>
        <Button variant="contact" onClick={() => setSuccessOpen(true)}>
          Reopen Success
        </Button>
        <ContactFormSuccessModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Error State</h3>
        <Button variant="outline" onClick={() => setErrorOpen(true)}>
          Reopen Error
        </Button>
        <ContactFormErrorModal
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          onRetry={() => console.log('Retry')}
        />
      </div>
    </div>
  )
}

export const Overview: Story = {
  name: 'Overview',
  render: () => <BothModalsDemo />,
}
