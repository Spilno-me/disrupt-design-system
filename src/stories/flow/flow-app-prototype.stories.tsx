/**
 * Flow EHS App Prototype Stories
 *
 * Complete, realistic prototype demonstrating:
 * 1. Login flow with real credentials
 * 2. Admin invitation flow with email preview
 * 3. New user activation flow
 *
 * These stories can be used for demos, stakeholder presentations, and UX testing.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useCallback } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  UserPlus,
  Shield,
  LayoutDashboard,
  Users,
  TriangleAlert,
  MapPin,
} from 'lucide-react'
import { LoginPage } from '../../components/auth/LoginPage'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { StepIndicator } from '../../components/ui/StepIndicator'
import {
  InviteUserDialog,
  UserActivationFlow,
  EmailInvitePreview,
  type InviteUserFormData,
  type ActivationFormData,
  type PrefilledUserData,
  type Role,
} from '../../flow/components/users'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Flow/App Prototype',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Flow EHS App Prototype

A complete, realistic prototype of the Flow EHS application demonstrating the full user journey.

## Prototype Flows

### 1. Login → Dashboard
- Login with credentials: \`andrii@disruptinc.io\` / \`password\`
- Success animation and redirect

### 2. Admin Invitation Flow
- Admin opens "Invite User" dialog
- Fills invitation form
- **Email Preview**: Shows realistic email mockup
- Invitation sent confirmation

### 3. New User Activation
- User receives email (simulated)
- Clicks activation link
- 4-step activation wizard
- Account activated

## UX Patterns Demonstrated

- **Progressive Disclosure**: Complex forms broken into steps
- **Skeleton States**: Loading placeholders
- **Micro-interactions**: Success animations, transitions
- **Accessibility**: Keyboard navigation, ARIA labels
        `,
      },
    },
  },
}

export default meta

// =============================================================================
// MOCK DATA
// =============================================================================

// Valid credentials for the prototype
const VALID_CREDENTIALS = {
  email: 'andrii@disruptinc.io',
  password: 'password',
}

// Current logged-in user
const LOGGED_IN_USER = {
  name: 'Andrii Drozdenko',
  email: 'andrii@disruptinc.io',
  role: 'System Administrator',
}

// Invitation form locations
const inviteLocations = [
  { id: 'loc-1', name: 'Houston Main Campus', type: 'site' },
  { id: 'loc-2', name: 'Dallas Regional Office', type: 'building' },
  { id: 'loc-3', name: 'Austin Tech Center', type: 'facility' },
  { id: 'loc-4', name: 'San Antonio Warehouse', type: 'warehouse' },
]

// Simple roles for invitation
const inviteRoles: Role[] = [
  { id: 'role-1', name: 'Safety Manager', description: 'Full safety management access', level: 2, permissions: [], isSystem: false, userCount: 5 },
  { id: 'role-2', name: 'Safety Coordinator', description: 'Create and manage incidents', level: 3, permissions: [], isSystem: false, userCount: 12 },
  { id: 'role-3', name: 'Field Worker', description: 'Report incidents and complete tasks', level: 4, permissions: [], isSystem: false, userCount: 45 },
  { id: 'role-4', name: 'Viewer', description: 'Read-only access', level: 5, permissions: [], isSystem: false, userCount: 20 },
]

// =============================================================================
// COMPLETE FLOW: LOGIN → DASHBOARD
// =============================================================================

type AppView = 'login' | 'dashboard'

function LoginToDashboardDemo() {
  const [currentView, setCurrentView] = useState<AppView>('login')

  // Login handler with credential validation
  const handleLogin = useCallback(async (values: { email: string; password: string }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Validate credentials
    if (values.email === VALID_CREDENTIALS.email && values.password === VALID_CREDENTIALS.password) {
      // Success - will transition to success state, then redirect
      return
    } else {
      throw new Error('Invalid credentials')
    }
  }, [])

  const handleLoginSuccess = useCallback(() => {
    setCurrentView('dashboard')
  }, [])

  // Render login page
  if (currentView === 'login') {
    return (
      <LoginPage
        product="flow"
        onLogin={handleLogin}
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={async () => {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }}
        successMessage="Welcome back, Andrii! Redirecting to dashboard..."
        successDuration={2000}
      />
    )
  }

  // Simple dashboard placeholder
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="bg-surface border-b border-default px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded bg-error/20 flex items-center justify-center">
                <span className="text-error font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-primary">Disrupt Flow</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">{LOGGED_IN_USER.name}</p>
              <p className="text-xs text-secondary">{LOGGED_IN_USER.role}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('login')}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Welcome back, Andrii!</h1>
          <p className="text-secondary">Here's your EHS dashboard overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TriangleAlert, label: 'Open Incidents', value: '23', color: 'text-warning' },
            { icon: Users, label: 'Active Users', value: '156', color: 'text-success' },
            { icon: MapPin, label: 'Locations', value: '12', color: 'text-info' },
            { icon: LayoutDashboard, label: 'Tasks Due', value: '8', color: 'text-error' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-secondary">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login Successful!</CardTitle>
            <CardDescription>
              You've successfully logged in to the Flow EHS platform. This is a simplified dashboard view.
              For the full dashboard experience, see the "Flow Dashboard" story.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setCurrentView('login')}>
              <ArrowRight className="size-4 mr-2" />
              Try Login Again
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export const LoginToDashboard: StoryObj = {
  render: () => <LoginToDashboardDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## Login → Dashboard Flow

Login with these credentials to access the app:
- **Email:** \`andrii@disruptinc.io\`
- **Password:** \`password\`

After successful login, you'll be redirected to a simplified dashboard view.
        `,
      },
    },
  },
}

// =============================================================================
// ADMIN INVITATION FLOW WITH EMAIL PREVIEW
// =============================================================================

type InvitationStep = 'form' | 'sending' | 'email-preview'

function AdminInvitationFlowDemo() {
  const [step, setStep] = useState<InvitationStep>('form')
  const [dialogOpen, setDialogOpen] = useState(true)
  const [invitedUser, setInvitedUser] = useState<InviteUserFormData | null>(null)

  const handleInvite = useCallback(async (data: InviteUserFormData) => {
    setInvitedUser(data)
    setStep('sending')

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))

    setStep('email-preview')
  }, [])

  const handleInviteAnother = useCallback(() => {
    setStep('form')
    setInvitedUser(null)
    setDialogOpen(true)
  }, [])

  // Get display values from IDs
  const getRoleName = (roleId: string) => inviteRoles.find(r => r.id === roleId)?.name || 'Unknown Role'
  const getLocationName = (locationId: string) => inviteLocations.find(l => l.id === locationId)?.name || 'Unknown Location'

  return (
    <div className="min-h-screen bg-page p-6">
      {/* Progress indicator - uses StepIndicator for contrast compliance */}
      <div className="max-w-2xl mx-auto mb-8">
        <StepIndicator
          steps={[
            { id: 'form', label: 'Fill Form' },
            { id: 'sending', label: 'Sending' },
            { id: 'email-preview', label: 'Email Sent' },
          ]}
          currentStep={step}
          completedSteps={
            step === 'sending' ? ['form'] :
            step === 'email-preview' ? ['form', 'sending'] : []
          }
        />
      </div>

      {/* Step: Form */}
      {step === 'form' && (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-5 text-accent" />
                Invite New User
              </CardTitle>
              <CardDescription>
                As an admin, invite new users to join your organization.
                They'll receive an email with instructions to activate their account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDialogOpen(true)} className="w-full">
                <Mail className="size-4 mr-2" />
                Open Invitation Form
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Sending indicator */}
      {step === 'sending' && (
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <div className="animate-spin size-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary">Sending Invitation...</h3>
              <p className="text-sm text-secondary mt-2">
                Preparing email for {invitedUser?.firstName} {invitedUser?.lastName}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Email Preview */}
      {step === 'email-preview' && invitedUser && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm">
              <CheckCircle2 className="size-4" />
              Invitation sent successfully!
            </div>
          </div>

          <EmailInvitePreview
            recipientName={`${invitedUser.firstName} ${invitedUser.lastName}`}
            recipientEmail={invitedUser.email}
            invitedBy={LOGGED_IN_USER.name}
            companyName="Disrupt Inc"
            roleName={getRoleName(invitedUser.roleId)}
            locationName={getLocationName(invitedUser.locationId)}
            customMessage={invitedUser.customMessage}
            sentTime="Just now"
            onActivateClick={() => alert('This would take the user to the activation flow')}
            onBackClick={handleInviteAnother}
            showChrome={true}
          />

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleInviteAnother}>
              <UserPlus className="size-4 mr-2" />
              Invite Another User
            </Button>
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      <InviteUserDialog
        open={dialogOpen && step === 'form'}
        onOpenChange={(open) => {
          if (!open && step === 'form') {
            setDialogOpen(false)
          }
        }}
        roles={inviteRoles}
        locations={inviteLocations}
        onInvite={handleInvite}
        isSubmitting={step === 'sending'}
      />
    </div>
  )
}

export const AdminInvitation: StoryObj = {
  render: () => <AdminInvitationFlowDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## Admin Invitation Flow

Demonstrates the complete admin workflow for inviting new users:

1. **Open invitation form** - Admin fills in user details
2. **Send invitation** - System processes and sends email
3. **Email preview** - Shows exactly what the user will receive

The email preview is a realistic mockup that shows:
- Email client chrome (inbox, toolbar buttons)
- Sender info and timestamp
- Branded invitation content
- Role and location assignment
- Custom message from admin
- Activation CTA button
        `,
      },
    },
  },
}

// =============================================================================
// INVITED USER ACTIVATION FLOW
// =============================================================================

type ActivationViewStep = 'email' | 'activation'

function InvitedUserActivationDemo() {
  const [viewStep, setViewStep] = useState<ActivationViewStep>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isActivated, setIsActivated] = useState(false)

  // Pre-filled data as if the user clicked the link from the email
  const prefilledData: PrefilledUserData = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    jobTitle: 'Safety Coordinator',
    department: 'Operations',
    locationName: 'Houston Main Campus',
    roleName: 'Safety Coordinator',
    invitedBy: 'Andrii Drozdenko',
  }

  const handleActivateClick = useCallback(() => {
    setViewStep('activation')
  }, [])

  const handleActivationComplete = useCallback(async (data: ActivationFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Activation complete:', data)
    setIsSubmitting(false)
    setIsActivated(true)
  }, [])

  const handleReset = useCallback(() => {
    setViewStep('email')
    setIsActivated(false)
  }, [])

  return (
    <div className="min-h-screen bg-page p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">New User Activation</h1>
        <p className="text-secondary">
          This simulates what a newly invited user sees when activating their account
        </p>
        {viewStep === 'activation' && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="mt-2">
            ← Back to Email Preview
          </Button>
        )}
      </div>

      {/* Progress indicator - uses StepIndicator for contrast compliance */}
      <div className="max-w-2xl mx-auto mb-8">
        <StepIndicator
          steps={[
            { id: 'email', label: 'Receive Email' },
            { id: 'activation', label: 'Activate Account' },
          ]}
          currentStep={isActivated ? '' : viewStep}
          completedSteps={
            isActivated ? ['email', 'activation'] :
            viewStep === 'activation' ? ['email'] : []
          }
        />
      </div>

      {/* Email View */}
      {viewStep === 'email' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <p className="text-sm text-secondary mb-4">
              Sarah just received this email invitation:
            </p>
          </div>

          <EmailInvitePreview
            recipientName="Sarah Johnson"
            recipientEmail="sarah.johnson@company.com"
            invitedBy="Andrii Drozdenko"
            companyName="Disrupt Inc"
            roleName="Safety Coordinator"
            locationName="Houston Main Campus"
            customMessage="Welcome to the team! We're excited to have you on board. Please complete your account setup to get started with our safety platform."
            sentTime="2 minutes ago"
            onActivateClick={handleActivateClick}
            showChrome={true}
          />
        </div>
      )}

      {/* Activation Flow */}
      {viewStep === 'activation' && (
        <div className="max-w-lg mx-auto">
          <UserActivationFlow
            prefilledData={prefilledData}
            onComplete={handleActivationComplete}
            termsUrl="https://disruptinc.io/terms"
            safetyPolicyUrl="https://disruptinc.io/safety-policy"
            companyName="Disrupt Inc"
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  )
}

export const InvitedUserActivation: StoryObj = {
  render: () => <InvitedUserActivationDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## Invited User Activation Flow

Shows the complete new user experience:

### Step 1: Email Preview
The user receives a branded invitation email showing:
- Who invited them
- Their assigned role and location
- Custom welcome message from admin
- Clear CTA to activate account

### Step 2: Activation Wizard (4 steps)
1. **Set Password** - Create secure password with strength requirements
2. **Confirm Profile** - Review/update name, add phone, job title
3. **Emergency Contact** - Required for EHS compliance
4. **Accept Terms** - Terms of Service + Safety Policy

### Success State
After completing all steps:
- Welcoming message with user's name
- "Get Started" button to enter the app
        `,
      },
    },
  },
}

// =============================================================================
// END-TO-END DEMO: Full Journey
// =============================================================================

type E2EStep = 'admin-login' | 'admin-dashboard' | 'admin-invite' | 'email-sent' | 'user-email' | 'user-activation' | 'user-success'

function EndToEndDemo() {
  const [step, setStep] = useState<E2EStep>('admin-login')
  const [invitedUser, setInvitedUser] = useState<InviteUserFormData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle invitation
  const handleInvite = useCallback(async (data: InviteUserFormData) => {
    setInvitedUser(data)
    setDialogOpen(false)
    setStep('email-sent')
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Auto-advance to show email preview
  }, [])

  // Handle activation
  const handleActivationComplete = useCallback(async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setStep('user-success')
  }, [])

  // Get display values
  const getRoleName = (roleId: string) => inviteRoles.find(r => r.id === roleId)?.name || 'Unknown Role'
  const getLocationName = (locationId: string) => inviteLocations.find(l => l.id === locationId)?.name || 'Unknown Location'

  // Build prefilled data from invitation
  const prefilledData: PrefilledUserData = invitedUser ? {
    firstName: invitedUser.firstName,
    lastName: invitedUser.lastName,
    email: invitedUser.email,
    jobTitle: invitedUser.jobTitle,
    department: invitedUser.department,
    locationName: getLocationName(invitedUser.locationId),
    roleName: getRoleName(invitedUser.roleId),
    invitedBy: LOGGED_IN_USER.name,
  } : {
    firstName: 'New',
    lastName: 'User',
    email: 'user@company.com',
    invitedBy: LOGGED_IN_USER.name,
  }

  // Step progress
  const steps = [
    { id: 'admin-login', label: 'Admin Login' },
    { id: 'admin-invite', label: 'Send Invite' },
    { id: 'user-email', label: 'User Receives' },
    { id: 'user-activation', label: 'User Activates' },
  ]

  const getCurrentStepIndex = () => {
    if (step === 'admin-login') return 0
    if (step === 'admin-dashboard' || step === 'admin-invite') return 1
    if (step === 'email-sent' || step === 'user-email') return 2
    return 3
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-surface border-b border-default px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 ${getCurrentStepIndex() >= i ? 'text-primary' : 'text-tertiary'}`}>
                  {/* bg-primary (12:1) passes AA; success icon is graphic (3.0:1 OK) */}
                  <div className={`size-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    getCurrentStepIndex() > i
                      ? 'bg-success text-inverse'
                      : getCurrentStepIndex() === i
                      ? 'bg-primary text-inverse'
                      : 'bg-muted-bg text-secondary'
                  }`}>
                    {getCurrentStepIndex() > i ? <CheckCircle2 className="size-3" /> : i + 1}
                  </div>
                  <span className="text-sm hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${getCurrentStepIndex() > i ? 'bg-success' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Admin Login */}
        {step === 'admin-login' && (
          <div className="max-w-md mx-auto">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Step 1: Admin Login</CardTitle>
                <CardDescription>
                  Admin logs in to the Flow EHS platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary mb-4">
                  Credentials: <code className="bg-muted px-1 rounded">andrii@disruptinc.io</code> / <code className="bg-muted px-1 rounded">password</code>
                </p>
                <Button onClick={() => {
                  setTimeout(() => setStep('admin-dashboard'), 500)
                }} className="w-full">
                  Login as Admin
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Admin Dashboard */}
        {step === 'admin-dashboard' && (
          <div className="max-w-md mx-auto">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-success" />
                  Logged in as Admin
                </CardTitle>
                <CardDescription>
                  Now navigate to User Management to invite a new user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted-bg rounded-lg">
                  <Shield className="size-8 text-accent" />
                  <div>
                    <p className="font-medium text-primary">{LOGGED_IN_USER.name}</p>
                    <p className="text-sm text-secondary">{LOGGED_IN_USER.role}</p>
                  </div>
                </div>
                <Button onClick={() => {
                  setDialogOpen(true)
                  setStep('admin-invite')
                }} className="w-full">
                  <UserPlus className="size-4 mr-2" />
                  Invite New User
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Invite Dialog */}
        {step === 'admin-invite' && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Send Invitation</CardTitle>
                <CardDescription>
                  Fill in the new user's details and send an invitation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setDialogOpen(true)} variant="outline" className="w-full">
                  Open Invite Dialog
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Email Sent */}
        {step === 'email-sent' && invitedUser && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-5" />
                  Invitation Sent!
                </CardTitle>
                <CardDescription>
                  Email sent to {invitedUser.firstName} {invitedUser.lastName}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="text-center">
              <p className="text-sm text-secondary mb-4">
                Now let's switch to the user's perspective...
              </p>
              <Button onClick={() => setStep('user-email')}>
                View as {invitedUser.firstName}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: User Receives Email */}
        {step === 'user-email' && invitedUser && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 text-info text-sm">
                <Mail className="size-4" />
                Viewing as: {invitedUser.firstName} {invitedUser.lastName}
              </span>
            </div>

            <EmailInvitePreview
              recipientName={`${invitedUser.firstName} ${invitedUser.lastName}`}
              recipientEmail={invitedUser.email}
              invitedBy={LOGGED_IN_USER.name}
              companyName="Disrupt Inc"
              roleName={getRoleName(invitedUser.roleId)}
              locationName={getLocationName(invitedUser.locationId)}
              customMessage={invitedUser.customMessage}
              sentTime="Just now"
              onActivateClick={() => setStep('user-activation')}
              showChrome={true}
            />
          </div>
        )}

        {/* Step 6: User Activation */}
        {step === 'user-activation' && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 text-info text-sm">
                <Mail className="size-4" />
                Viewing as: {prefilledData.firstName} {prefilledData.lastName}
              </span>
            </div>
            <UserActivationFlow
              prefilledData={prefilledData}
              onComplete={handleActivationComplete}
              companyName="Disrupt Inc"
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Step 7: Success */}
        {step === 'user-success' && (
          <div className="max-w-md mx-auto text-center">
            <Card className="border-success">
              <CardContent className="py-12">
                <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="size-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Journey Complete!
                </h2>
                <p className="text-secondary mb-6">
                  {prefilledData.firstName} has successfully activated their account and can now access the Flow EHS platform.
                </p>
                <Button onClick={() => {
                  setStep('admin-login')
                  setInvitedUser(null)
                }} variant="outline">
                  Start Over
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Invite Dialog */}
      <InviteUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roles={inviteRoles}
        locations={inviteLocations}
        onInvite={handleInvite}
        isSubmitting={false}
      />
    </div>
  )
}

export const EndToEndJourney: StoryObj = {
  render: () => <EndToEndDemo />,
  parameters: {
    docs: {
      description: {
        story: `
## End-to-End User Onboarding Journey

This story demonstrates the **complete user onboarding journey** from both admin and user perspectives:

### Admin Journey
1. **Login** to Flow EHS platform
2. **Navigate** to User Management
3. **Invite** new user with role and location

### User Journey
4. **Receive** invitation email (simulated)
5. **Click** activation link
6. **Complete** 4-step activation wizard
7. **Success** - Account is ready!

This end-to-end flow demonstrates enterprise-grade onboarding with:
- Admin provisioning for data quality
- User self-service for convenience
- EHS compliance (emergency contact, safety policy)
- Professional email communication
        `,
      },
    },
  },
}

// =============================================================================
// STANDALONE STORIES
// =============================================================================

export const LoginPageStandalone: StoryObj = {
  render: () => (
    <LoginPage
      product="flow"
      onLogin={async (values) => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        if (values.email !== VALID_CREDENTIALS.email || values.password !== VALID_CREDENTIALS.password) {
          throw new Error('Invalid credentials')
        }
      }}
      onLoginSuccess={() => alert('Login successful! Would redirect to dashboard.')}
      onForgotPassword={async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Standalone login page. Use `andrii@disruptinc.io` / `password` to test successful login.',
      },
    },
  },
}

export const EmailPreviewStandalone: StoryObj = {
  render: () => (
    <div className="p-6 bg-page min-h-screen flex items-center justify-center">
      <EmailInvitePreview
        recipientName="John Smith"
        recipientEmail="john.smith@company.com"
        invitedBy="Andrii Drozdenko"
        companyName="Disrupt Inc"
        roleName="Safety Coordinator"
        locationName="Houston Main Campus"
        customMessage="Welcome to the team! Looking forward to working with you."
        sentTime="5 minutes ago"
        onActivateClick={() => alert('Activate clicked')}
        showChrome={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Standalone email invitation preview component with realistic email client chrome.',
      },
    },
  },
}

export const ActivationFlowStandalone: StoryObj = {
  render: () => {
    const prefilledData: PrefilledUserData = {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      jobTitle: 'Safety Coordinator',
      department: 'Operations',
      locationName: 'Houston Main Campus',
      roleName: 'Safety Coordinator',
      invitedBy: 'Andrii Drozdenko',
    }

    return (
      <div className="p-6 bg-page min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg">
          <UserActivationFlow
            prefilledData={prefilledData}
            onComplete={async (data) => {
              await new Promise(resolve => setTimeout(resolve, 1500))
              console.log('Activation complete:', data)
            }}
            companyName="Disrupt Inc"
            termsUrl="https://example.com/terms"
            safetyPolicyUrl="https://example.com/safety"
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Standalone 4-step user activation flow with password setup, profile confirmation, emergency contact, and terms acceptance.',
      },
    },
  },
}
