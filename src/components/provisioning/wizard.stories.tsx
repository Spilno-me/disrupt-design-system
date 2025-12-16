import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Wizard, useWizard, type WizardStep } from './Wizard'
import { WizardStepper, CompactStepper } from './WizardStepper'
import { WizardStep as WizardStepComponent, WizardStepHeader, WizardStepSection } from './WizardStep'
import { WizardNavigation } from './WizardNavigation'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Wizard> = {
  title: 'Partner/Components/Wizard',
  component: Wizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A reusable multi-step wizard component for complex form flows.

## Features
- Generic wizard context with step management
- Horizontal and compact stepper variants
- Step navigation with validation support
- Clickable step indicators for completed steps
- Flexible content and navigation composition

## Usage
\`\`\`tsx
import {
  Wizard,
  WizardStepper,
  WizardStep,
  WizardNavigation
} from '@/components/provisioning'

const steps = [
  { id: 'step1', label: 'First Step' },
  { id: 'step2', label: 'Second Step' },
]

<Wizard steps={steps}>
  <WizardStepper />
  <WizardStep step={0}>Content for step 1</WizardStep>
  <WizardStep step={1}>Content for step 2</WizardStep>
  <WizardNavigation />
</Wizard>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Wizard>

// =============================================================================
// BASIC WIZARD
// =============================================================================

const BASIC_STEPS: WizardStep[] = [
  { id: 'info', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'confirm', label: 'Confirm' },
]

function BasicWizardDemo() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Success!</h2>
            <p className="text-muted mb-4">Your wizard has been completed successfully.</p>
            <Button onClick={() => setSubmitted(false)}>Start Over</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page">
      <Wizard steps={BASIC_STEPS} className="max-w-2xl mx-auto">
        <div className="bg-surface border-b border-default">
          <WizardStepper />
        </div>

        <div className="p-6">
          <WizardStepComponent step={0}>
            <WizardStepHeader
              title="Basic Information"
              description="Let's start with some basic details"
            />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </CardContent>
            </Card>
          </WizardStepComponent>

          <WizardStepComponent step={1}>
            <WizardStepHeader
              title="Additional Details"
              description="Tell us more about yourself"
            />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Your role" />
                </div>
              </CardContent>
            </Card>
          </WizardStepComponent>

          <WizardStepComponent step={2}>
            <WizardStepHeader
              title="Confirm"
              description="Review and confirm your information"
            />
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted">
                  Please review all the information you've entered. Click "Submit" to complete
                  the wizard.
                </p>
              </CardContent>
            </Card>
          </WizardStepComponent>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-default px-6 py-4">
          <WizardNavigation
            submitLabel="Submit"
            onSubmit={() => setSubmitted(true)}
          />
        </div>
      </Wizard>
    </div>
  )
}

export const Default: Story = {
  render: () => <BasicWizardDemo />,
}

// =============================================================================
// STEPPER VARIANTS
// =============================================================================

const STEPPER_DEMO_STEPS: WizardStep[] = [
  { id: 'company', label: 'Company Info' },
  { id: 'contact', label: 'Contact & Billing' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'review', label: 'Review & Pay' },
]

function StepperVariantsDemo() {
  return (
    <div className="bg-page p-8 space-y-8">
      <h2 className="text-xl font-semibold text-primary mb-4">Horizontal Stepper</h2>
      <Wizard steps={STEPPER_DEMO_STEPS}>
        <div className="bg-surface rounded-lg border border-default">
          <WizardStepper />
        </div>

        <div className="mt-4 p-6 bg-surface rounded-lg border border-default">
          <WizardStepComponent step={0}>
            <p className="text-secondary">Step 1 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={1}>
            <p className="text-secondary">Step 2 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={2}>
            <p className="text-secondary">Step 3 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={3}>
            <p className="text-secondary">Step 4 content</p>
          </WizardStepComponent>
        </div>

        <div className="mt-4">
          <WizardNavigation />
        </div>
      </Wizard>

      <h2 className="text-xl font-semibold text-primary mb-4 mt-12">Compact Stepper (Mobile)</h2>
      <Wizard steps={STEPPER_DEMO_STEPS} initialStep={1}>
        <div className="bg-surface rounded-lg border border-default max-w-sm">
          <CompactStepper />
        </div>

        <div className="mt-4 p-4 bg-surface rounded-lg border border-default max-w-sm">
          <WizardStepComponent step={0}>
            <p className="text-secondary text-sm">Step 1 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={1}>
            <p className="text-secondary text-sm">Step 2 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={2}>
            <p className="text-secondary text-sm">Step 3 content</p>
          </WizardStepComponent>
          <WizardStepComponent step={3}>
            <p className="text-secondary text-sm">Step 4 content</p>
          </WizardStepComponent>
        </div>

        <div className="mt-4 max-w-sm">
          <WizardNavigation />
        </div>
      </Wizard>
    </div>
  )
}

export const StepperVariants: Story = {
  render: () => <StepperVariantsDemo />,
}

// =============================================================================
// WITH VALIDATION
// =============================================================================

function ValidationDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    if (step === 1) {
      if (!formData.company.trim()) {
        newErrors.company = 'Company is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="min-h-screen bg-page">
      <Wizard steps={BASIC_STEPS} className="max-w-2xl mx-auto">
        <div className="bg-surface border-b border-default">
          <WizardStepper />
        </div>

        <div className="p-6">
          <WizardStepComponent step={0}>
            <WizardStepHeader
              title="Basic Information"
              description="All fields are required"
            />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-error">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-error">{errors.email}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </WizardStepComponent>

          <WizardStepComponent step={1}>
            <WizardStepHeader
              title="Company Details"
              description="Tell us about your organization"
            />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company name"
                    aria-invalid={!!errors.company}
                  />
                  {errors.company && (
                    <p className="text-xs text-error">{errors.company}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </WizardStepComponent>

          <WizardStepComponent step={2}>
            <WizardStepHeader
              title="Confirm"
              description="Review your information"
            />
            <Card>
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm">
                  <span className="text-secondary">Name:</span>{' '}
                  <span className="text-primary font-medium">{formData.name}</span>
                </p>
                <p className="text-sm">
                  <span className="text-secondary">Email:</span>{' '}
                  <span className="text-primary font-medium">{formData.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-secondary">Company:</span>{' '}
                  <span className="text-primary font-medium">{formData.company}</span>
                </p>
              </CardContent>
            </Card>
          </WizardStepComponent>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-default px-6 py-4">
          <WizardNavigationWithValidation validateStep={validateStep} />
        </div>
      </Wizard>
    </div>
  )
}

function WizardNavigationWithValidation({
  validateStep,
}: {
  validateStep: (step: number) => boolean
}) {
  const { currentStep } = useWizard()

  const handleNext = (): boolean => {
    return validateStep(currentStep)
  }

  return (
    <WizardNavigation
      onNext={handleNext}
      submitLabel="Complete"
      onSubmit={() => alert('Form submitted!')}
    />
  )
}

export const WithValidation: Story = {
  render: () => <ValidationDemo />,
}

// =============================================================================
// VERTICAL STEPPER
// =============================================================================

function VerticalStepperDemo() {
  return (
    <div className="bg-page p-8">
      <div className="flex gap-8">
        <Wizard steps={STEPPER_DEMO_STEPS}>
          <div className="bg-surface rounded-lg border border-default w-64">
            <WizardStepper orientation="vertical" className="py-6" />
          </div>

          <div className="flex-1">
            <div className="bg-surface rounded-lg border border-default p-6">
              <WizardStepComponent step={0}>
                <WizardStepHeader title="Company Information" />
                <p className="text-muted">Enter your company details here.</p>
              </WizardStepComponent>
              <WizardStepComponent step={1}>
                <WizardStepHeader title="Contact & Billing" />
                <p className="text-muted">Add contact and billing information.</p>
              </WizardStepComponent>
              <WizardStepComponent step={2}>
                <WizardStepHeader title="Pricing" />
                <p className="text-muted">Configure your pricing plan.</p>
              </WizardStepComponent>
              <WizardStepComponent step={3}>
                <WizardStepHeader title="Review & Pay" />
                <p className="text-muted">Review and complete your order.</p>
              </WizardStepComponent>
            </div>

            <div className="mt-4">
              <WizardNavigation />
            </div>
          </div>
        </Wizard>
      </div>
    </div>
  )
}

export const VerticalStepper: Story = {
  render: () => <VerticalStepperDemo />,
}

// =============================================================================
// LOADING STATE
// =============================================================================

function LoadingStateDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert('Submitted!')
  }

  return (
    <div className="min-h-screen bg-page">
      <Wizard steps={BASIC_STEPS} initialStep={2} className="max-w-2xl mx-auto">
        <div className="bg-surface border-b border-default">
          <WizardStepper />
        </div>

        <div className="p-6">
          <WizardStepComponent step={2}>
            <WizardStepHeader
              title="Ready to Submit"
              description="Click submit to see the loading state"
            />
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted">
                  This demo shows the loading state when submitting the wizard.
                </p>
              </CardContent>
            </Card>
          </WizardStepComponent>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-default px-6 py-4">
          <WizardNavigation
            submitLabel="Submit"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Wizard>
    </div>
  )
}

export const LoadingState: Story = {
  render: () => <LoadingStateDemo />,
}

// =============================================================================
// STEP SECTIONS
// =============================================================================

function StepSectionsDemo() {
  return (
    <div className="min-h-screen bg-page">
      <Wizard steps={BASIC_STEPS} className="max-w-2xl mx-auto">
        <div className="bg-surface border-b border-default">
          <WizardStepper />
        </div>

        <div className="p-6">
          <WizardStepComponent step={0}>
            <WizardStepHeader
              title="Basic Information"
              description="Complete all sections below"
            />

            <Card className="mb-4">
              <CardContent className="pt-6">
                <WizardStepSection title="Personal Details" description="Your personal information">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                </WizardStepSection>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <WizardStepSection title="Contact Information" description="How can we reach you">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </WizardStepSection>
              </CardContent>
            </Card>
          </WizardStepComponent>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-default px-6 py-4">
          <WizardNavigation />
        </div>
      </Wizard>
    </div>
  )
}

export const StepSections: Story = {
  render: () => <StepSectionsDemo />,
}
