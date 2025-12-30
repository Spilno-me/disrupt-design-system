/**
 * User Onboarding Stories
 *
 * Demonstrates the enterprise user onboarding flow:
 * 1. Admin invites user (InviteUserDialog)
 * 2. User activates account (UserActivationFlow)
 *
 * UX Pattern: Admin provisioning + user self-service activation
 *
 * NOTE: Uses seedRoles from API layer for role data.
 * Location options are simplified for this onboarding-specific UI.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useCallback } from 'react'
import {
  InviteUserDialog,
  UserActivationFlow,
  EmailInvitePreview,
  type InviteUserFormData,
  type ActivationFormData,
  type PrefilledUserData,
} from '../../flow/components/users'
import { seedRoles } from '@/api'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { Mail, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ORGANISM_META, organismDescription } from '../_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Flow/User Onboarding',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'centered',
    docs: {
      description: {
        component: organismDescription(`
Enterprise-grade user onboarding with admin provisioning and user self-service activation.

## Flow Overview

1. **Admin Invites User** - Email, name, role, location (InviteUserDialog)
2. **User Receives Email** - "You've been invited to Flow EHS"
3. **User Activates Account** - Password, profile, emergency contact, terms (UserActivationFlow)
4. **Account Active** - First login

## UX Laws Applied

- **Hick's Law**: Multi-step reduces cognitive load
- **Progressive Disclosure**: Admin sets core info, user completes the rest
- **Fitts' Law**: Large, easy-to-tap buttons for mobile users
        `),
      },
    },
  },
}

export default meta

// =============================================================================
// MOCK DATA
// =============================================================================

// Roles imported from API seed: seedRoles

// Simplified location options for onboarding UI
const mockLocations = [
  { id: 'loc-1', name: 'Houston Main Campus', type: 'site' },
  { id: 'loc-2', name: 'Dallas Regional Office', type: 'building' },
  { id: 'loc-3', name: 'Austin Tech Center', type: 'facility' },
  { id: 'loc-4', name: 'San Antonio Warehouse', type: 'warehouse' },
  { id: 'loc-5', name: 'El Paso Distribution', type: 'facility' },
]

const mockPrefilledData: PrefilledUserData = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@company.com',
  jobTitle: 'Safety Coordinator',
  department: 'Operations',
  locationName: 'Houston Main Campus',
  roleName: 'Safety Coordinator',
  invitedBy: 'John Smith',
}

// =============================================================================
// INVITE USER DIALOG STORY
// =============================================================================

function InviteUserDialogDemo() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState<string[]>([])

  const handleInvite = useCallback(async (data: InviteUserFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Invitation sent:', data)
    setInvitedUsers((prev) => [...prev, data.email])
    setIsSubmitting(false)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5 text-accent" />
            Admin: Invite Users
          </CardTitle>
          <CardDescription>
            As an admin, you can invite new users to join your organization.
            They'll receive an email with instructions to set up their account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setOpen(true)} className="w-full">
            <UserPlus className="size-4 mr-2" />
            Invite New User
          </Button>

          {invitedUsers.length > 0 && (
            <div className="rounded-lg border border-success/20 bg-success/5 p-4">
              {/* text-primary for AA contrast (4.5:1) - icon provides semantic color */}
              <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Invitations Sent ({invitedUsers.length})
              </p>
              <ul className="space-y-1">
                {invitedUsers.map((email, i) => (
                  <li key={i} className="text-sm text-secondary flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" />
                    {email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <InviteUserDialog
        open={open}
        onOpenChange={setOpen}
        roles={seedRoles}
        locations={mockLocations}
        onInvite={handleInvite}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export const InviteUser: StoryObj = {
  render: () => <InviteUserDialogDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## Admin: Invite User Dialog

The admin uses this dialog to invite new users. Key features:

- **Required fields**: Email, name, role, and location
- **Optional fields**: Job title, department, personal message
- **Success state**: Shows confirmation and allows inviting another user
- **Location is required**: Critical for EHS compliance (tracking who was where)

The dialog focuses on essential information that the admin controls.
The user will complete their profile during activation.
        `,
      },
    },
  },
}

// =============================================================================
// USER ACTIVATION FLOW STORY
// =============================================================================

function UserActivationFlowDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [key, setKey] = useState(0)

  const handleComplete = useCallback(async (data: ActivationFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Activation complete:', data)
    setIsSubmitting(false)
  }, [])

  const handleReset = useCallback(() => {
    setKey((prev) => prev + 1)
  }, [])

  return (
    <AuthLayout showBlob blobScale={1.2} maxWidth="md">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-sm text-secondary">
            This is what the user sees when they click the invitation link
          </p>
          <Button variant="ghost" size="sm" onClick={handleReset} className="mt-2">
            Reset Flow
          </Button>
        </div>

        <UserActivationFlow
          key={key}
          prefilledData={mockPrefilledData}
          onComplete={handleComplete}
          termsUrl="https://example.com/terms"
          safetyPolicyUrl="https://example.com/safety-policy"
          companyName="Acme Corp"
          isSubmitting={isSubmitting}
        />
      </div>
    </AuthLayout>
  )
}

export const UserActivation: StoryObj = {
  render: () => <UserActivationFlowDemo />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
## User: Account Activation Flow

When the user clicks the invitation link, they see this multi-step activation flow:

### Step 1: Set Password
- Password strength requirements clearly shown
- Real-time validation feedback
- Show/hide password toggle

### Step 2: Confirm Profile
- Pre-filled data from admin displayed
- User can update their name
- Add phone number and job title

### Step 3: Emergency Contact
- **Required for EHS compliance**
- Explains why this information is needed
- Name, phone, and relationship fields

### Step 4: Accept Terms
- Terms of Service checkbox
- Safety Policy checkbox (required for EHS)
- Both must be accepted to continue

### Success State
- Welcoming message with user's name
- "Get Started" button to enter the app
        `,
      },
    },
  },
}

// =============================================================================
// FULL FLOW DEMO
// =============================================================================

function FullOnboardingFlowDemo() {
  const [step, setStep] = useState<'admin' | 'email' | 'activation'>('admin')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [invitedUser, setInvitedUser] = useState<InviteUserFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInvite = useCallback(async (data: InviteUserFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setInvitedUser(data)
    setIsSubmitting(false)
    setInviteDialogOpen(false)
    // Show email step
    setTimeout(() => setStep('email'), 300)
  }, [])

  const handleActivationComplete = useCallback(async (data: ActivationFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Account activated:', { ...invitedUser, ...data })
    setIsSubmitting(false)
  }, [invitedUser])

  const handleReset = useCallback(() => {
    setStep('admin')
    setInvitedUser(null)
  }, [])

  // Create prefilled data from invite
  const prefilledData: PrefilledUserData = invitedUser
    ? {
        firstName: invitedUser.firstName,
        lastName: invitedUser.lastName,
        email: invitedUser.email,
        jobTitle: invitedUser.jobTitle,
        department: invitedUser.department,
        locationName: mockLocations.find((l) => l.id === invitedUser.locationId)?.name,
        roleName: seedRoles.find((r) => r.id === invitedUser.roleId)?.name,
        invitedBy: 'Admin User',
      }
    : mockPrefilledData

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Progress indicator - uses StepIndicator for contrast compliance */}
      <StepIndicator
        steps={[
          { id: 'admin', label: 'Admin Invites' },
          { id: 'email', label: 'Email Sent' },
          { id: 'activation', label: 'User Activates' },
        ]}
        currentStep={step}
        completedSteps={
          step === 'email' ? ['admin'] :
          step === 'activation' ? ['admin', 'email'] : []
        }
        className="mb-8"
      />

      {/* Step content */}
      {step === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Admin Invites User</CardTitle>
            <CardDescription>
              The admin initiates the onboarding by sending an invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setInviteDialogOpen(true)} className="w-full">
              <UserPlus className="size-4 mr-2" />
              Open Invite Dialog
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'email' && invitedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Invitation Email Sent</CardTitle>
            <CardDescription>
              The user receives an email with activation instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted-bg rounded-lg p-4 space-y-3">
              {/* text-primary for body text (4.5:1); icon carries semantic color */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <span className="font-medium text-primary">Email sent to {invitedUser.email}</span>
              </div>
              <div className="border-l-2 border-accent pl-4 space-y-2 text-sm">
                <p className="font-medium text-primary">
                  Welcome to Acme Corp EHS Platform
                </p>
                <p className="text-secondary">
                  Hi {invitedUser.firstName}, you've been invited to join as a{' '}
                  {seedRoles.find((r) => r.id === invitedUser.roleId)?.name}.
                </p>
                <p className="text-secondary">
                  Click the button below to activate your account.
                </p>
              </div>
            </div>
            <Button onClick={() => setStep('activation')} className="w-full">
              Simulate: User Clicks Activation Link
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'activation' && (
        <div className="space-y-4">
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              ← Start Over
            </Button>
          </div>
          <UserActivationFlow
            prefilledData={prefilledData}
            onComplete={handleActivationComplete}
            termsUrl="https://example.com/terms"
            safetyPolicyUrl="https://example.com/safety"
            companyName="Acme Corp"
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        roles={seedRoles}
        locations={mockLocations}
        onInvite={handleInvite}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export const FullFlow: StoryObj = {
  render: () => <FullOnboardingFlowDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## Complete Onboarding Flow Demo

This story demonstrates the complete end-to-end onboarding flow:

1. **Admin opens invite dialog** and fills in user details
2. **System sends invitation email** (simulated)
3. **User clicks activation link** and completes their profile

This separation of concerns ensures:
- **Data quality**: Admin controls critical fields (role, location)
- **Low friction**: User just confirms and adds personal details
- **Compliance**: Emergency contact is collected during activation
- **Security**: User sets their own password
        `,
      },
    },
  },
}

// =============================================================================
// EDGE CASES
// =============================================================================

export const InviteDialogEmpty: StoryObj = {
  render: () => (
    <InviteUserDialog
      open={true}
      onOpenChange={() => {}}
      roles={seedRoles}
      locations={mockLocations}
      onInvite={async (data) => console.log(data)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty invite dialog ready for input.',
      },
    },
  },
}

export const ActivationStep1Password: StoryObj = {
  render: () => (
    <AuthLayout showBlob blobScale={1.2} maxWidth="md">
      <UserActivationFlow
        prefilledData={mockPrefilledData}
        onComplete={async (data) => console.log(data)}
        companyName="Acme Corp"
      />
    </AuthLayout>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Activation flow starting at Step 1 (Set Password) with blob background.',
      },
    },
  },
}

// =============================================================================
// EMAIL INVITE PREVIEW STORY
// =============================================================================

function EmailInvitePreviewDemo() {
  const [showActivation, setShowActivation] = useState(false)

  if (showActivation) {
    return (
      <AuthLayout showBlob blobScale={1.2} maxWidth="md">
        <div className="space-y-4">
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => setShowActivation(false)}>
              ← Back to Email
            </Button>
          </div>
          <UserActivationFlow
            prefilledData={mockPrefilledData}
            onComplete={async (data) => console.log(data)}
            companyName="Acme Corp"
          />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout showBlob blobScale={1.0} maxWidth="lg">
      <EmailInvitePreview
        recipientName={mockPrefilledData.firstName}
        recipientEmail={mockPrefilledData.email}
        invitedBy={mockPrefilledData.invitedBy || 'Admin'}
        companyName="Acme Corp"
        roleName={mockPrefilledData.roleName || 'Team Member'}
        locationName={mockPrefilledData.locationName}
        customMessage="Looking forward to having you on the team!"
        onActivateClick={() => setShowActivation(true)}
        onBackClick={() => console.log('Back clicked')}
      />
    </AuthLayout>
  )
}

export const EmailInvite: StoryObj = {
  render: () => <EmailInvitePreviewDemo />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
## Email Invite Preview

Shows the invitation email that users receive. Features:

- **Realistic email client chrome** - Header with back/archive/delete buttons
- **Company branding** - Logo and personalized messaging
- **Role & location info** - Shows what the user was assigned
- **Custom message** - Personal note from the inviter
- **CTA button** - Click "Activate Your Account" to see the activation flow
        `,
      },
    },
  },
}
