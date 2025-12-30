/**
 * UserActivationFlow - Multi-step user activation/onboarding
 *
 * Displayed when a user clicks the invitation link:
 * 1. Welcome + Set Password
 * 2. Confirm/Complete Profile Details
 * 3. Emergency Contact (safety requirement)
 * 4. Accept Terms & Safety Policies
 * 5. Success + First Login
 *
 * Design decisions:
 * - Multi-step reduces cognitive load (Hick's Law)
 * - Critical fields pre-filled by admin, user confirms
 * - Progress indicator shows remaining steps
 * - Can't skip steps (compliance requirement)
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Lock,
  Loader2,
  User,
  Phone,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Checkbox } from '../../../../components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'

// =============================================================================
// TYPES
// =============================================================================

export interface PrefilledUserData {
  firstName: string
  lastName: string
  email: string
  jobTitle?: string
  department?: string
  locationName?: string
  roleName?: string
  invitedBy?: string
}

export interface ActivationFormData {
  // Step 1: Password
  password: string
  confirmPassword: string
  // Step 2: Profile confirmation/completion
  firstName: string
  lastName: string
  phone: string
  jobTitle: string
  // Step 3: Emergency contact
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  // Step 4: Terms
  acceptTerms: boolean
  acceptSafetyPolicy: boolean
}

export interface UserActivationFlowProps {
  /** Pre-filled data from admin invitation */
  prefilledData: PrefilledUserData
  /** Callback when activation is complete */
  onComplete: (data: ActivationFormData) => Promise<void>
  /** Terms of service URL */
  termsUrl?: string
  /** Safety policy URL */
  safetyPolicyUrl?: string
  /** Company name for personalization */
  companyName?: string
  /** Loading state */
  isSubmitting?: boolean
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

const STEPS = [
  { id: 1, title: 'Set Password', icon: Lock },
  { id: 2, title: 'Your Profile', icon: User },
  { id: 3, title: 'Emergency Contact', icon: Phone },
  { id: 4, title: 'Accept Terms', icon: Shield },
] as const

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const Icon = step.icon

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-center justify-center size-10 rounded-full border-2 transition-all',
                isCompleted && 'bg-success border-success shadow-sm',
                isCurrent && 'bg-accent/20 border-accent/40 shadow-sm',
                !isCompleted && !isCurrent && 'bg-white/40 dark:bg-black/40 border-muted'
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="size-5 text-white" />
              ) : (
                <Icon
                  className={cn(
                    'size-5',
                    isCurrent ? 'text-accent' : 'text-tertiary'
                  )}
                />
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 transition-colors',
                  currentStep > step.id ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// =============================================================================
// PASSWORD STEP
// =============================================================================

interface PasswordStepProps {
  form: ReturnType<typeof useForm<ActivationFormData>>
  onNext: () => void
}

function PasswordStep({ form, onNext }: PasswordStepProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const password = form.watch('password')
  const confirmPassword = form.watch('confirmPassword')

  // Password strength indicators
  const hasMinLength = password?.length >= 8
  const hasUppercase = /[A-Z]/.test(password || '')
  const hasLowercase = /[a-z]/.test(password || '')
  const hasNumber = /[0-9]/.test(password || '')
  const passwordsMatch = password === confirmPassword && password?.length > 0

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-primary">Create Your Password</h2>
        <p className="text-sm text-secondary">
          Choose a secure password for your account
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            validate: (value) => {
              if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter'
              if (!/[a-z]/.test(value)) return 'Must contain lowercase letter'
              if (!/[0-9]/.test(value)) return 'Must contain a number'
              return true
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-tertiary" />
                    ) : (
                      <Eye className="size-4 text-tertiary" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password requirements */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={cn('flex items-center gap-1.5', hasMinLength ? 'text-success' : 'text-tertiary')}>
            <CheckCircle2 className="size-3.5" />
            8+ characters
          </div>
          <div className={cn('flex items-center gap-1.5', hasUppercase ? 'text-success' : 'text-tertiary')}>
            <CheckCircle2 className="size-3.5" />
            Uppercase letter
          </div>
          <div className={cn('flex items-center gap-1.5', hasLowercase ? 'text-success' : 'text-tertiary')}>
            <CheckCircle2 className="size-3.5" />
            Lowercase letter
          </div>
          <div className={cn('flex items-center gap-1.5', hasNumber ? 'text-success' : 'text-tertiary')}>
            <CheckCircle2 className="size-3.5" />
            Number
          </div>
        </div>

        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm your password',
            validate: (value) =>
              value === form.getValues('password') || 'Passwords do not match',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4 text-tertiary" />
                    ) : (
                      <Eye className="size-4 text-tertiary" />
                    )}
                  </Button>
                </div>
              </FormControl>
              {passwordsMatch && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  Passwords match
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button onClick={onNext} disabled={!isValid} className="w-full">
        Continue
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  )
}

// =============================================================================
// PROFILE STEP
// =============================================================================

interface ProfileStepProps {
  form: ReturnType<typeof useForm<ActivationFormData>>
  prefilledData: PrefilledUserData
  onNext: () => void
  onBack: () => void
}

function ProfileStep({ form, prefilledData, onNext, onBack }: ProfileStepProps) {
  const firstName = form.watch('firstName')
  const lastName = form.watch('lastName')

  const isValid = firstName?.trim() && lastName?.trim()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-primary">Confirm Your Profile</h2>
        <p className="text-sm text-secondary">
          Verify your information and add any missing details
        </p>
      </div>

      {/* Pre-filled info display - Glass layered */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-[2px] border border-default rounded-lg p-4 space-y-2">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide">
          Your Assignment
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {prefilledData.roleName && (
            <div>
              <span className="text-secondary">Role:</span>{' '}
              <span className="text-primary font-medium">{prefilledData.roleName}</span>
            </div>
          )}
          {prefilledData.locationName && (
            <div>
              <span className="text-secondary">Location:</span>{' '}
              <span className="text-primary font-medium">{prefilledData.locationName}</span>
            </div>
          )}
          {prefilledData.department && (
            <div>
              <span className="text-secondary">Department:</span>{' '}
              <span className="text-primary font-medium">{prefilledData.department}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormDescription>
                For work-related communications
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Safety Coordinator" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// EMERGENCY CONTACT STEP
// =============================================================================

interface EmergencyContactStepProps {
  form: ReturnType<typeof useForm<ActivationFormData>>
  onNext: () => void
  onBack: () => void
}

function EmergencyContactStep({ form, onNext, onBack }: EmergencyContactStepProps) {
  const contactName = form.watch('emergencyContactName')
  const contactPhone = form.watch('emergencyContactPhone')

  const isValid = contactName?.trim() && contactPhone?.trim()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-primary">Emergency Contact</h2>
        <p className="text-sm text-secondary">
          Required for safety and compliance purposes
        </p>
      </div>

      {/* Safety notice - Colored glass formula */}
      <div className="bg-warning/20 dark:bg-warning/20 backdrop-blur-[2px] border-2 border-warning/40 shadow-sm rounded-lg p-4 flex gap-3">
        <AlertTriangle className="size-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary">Why is this required?</p>
          <p className="text-secondary mt-1">
            As an EHS platform, we need emergency contact information in case of workplace incidents.
            This information is kept confidential.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="emergencyContactName"
          rules={{ required: 'Emergency contact name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name *</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContactPhone"
          rules={{ required: 'Emergency contact phone is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContactRelation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spouse, Parent, Sibling" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// TERMS STEP
// =============================================================================

interface TermsStepProps {
  form: ReturnType<typeof useForm<ActivationFormData>>
  termsUrl?: string
  safetyPolicyUrl?: string
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

function TermsStep({ form, termsUrl, safetyPolicyUrl, onSubmit, onBack, isSubmitting }: TermsStepProps) {
  const acceptTerms = form.watch('acceptTerms')
  const acceptSafety = form.watch('acceptSafetyPolicy')

  const isValid = acceptTerms && acceptSafety

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-primary">Accept Policies</h2>
        <p className="text-sm text-secondary">
          Please review and accept the following policies
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="acceptTerms"
          rules={{ required: 'You must accept the terms of service' }}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-default p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I accept the{' '}
                  <a
                    href={termsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline"
                  >
                    Terms of Service
                  </a>
                </FormLabel>
                <FormDescription>
                  By accepting, you agree to the terms and conditions
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptSafetyPolicy"
          rules={{ required: 'You must accept the safety policy' }}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-default p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I accept the{' '}
                  <a
                    href={safetyPolicyUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline"
                  >
                    Workplace Safety Policy
                  </a>
                </FormLabel>
                <FormDescription>
                  Required for all employees using the EHS platform
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!isValid || isSubmitting} className="flex-1">
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 size-4" />
          )}
          Complete Setup
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// SUCCESS STEP
// =============================================================================

interface SuccessStepProps {
  firstName: string
  companyName?: string
  onGetStarted: () => void
}

function SuccessStep({ firstName, companyName, onGetStarted }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 space-y-6">
      {/* Success icon with glass formula */}
      <div className="flex size-20 items-center justify-center rounded-full bg-success/20 dark:bg-success/20 border-2 border-success/40 shadow-md">
        <Sparkles className="size-10 text-success" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">
          Welcome, {firstName}!
        </h2>
        <p className="text-secondary max-w-sm">
          Your account is now active. You're all set to start using{' '}
          {companyName ? `${companyName}'s` : 'the'} EHS platform.
        </p>
      </div>
      <Button size="lg" onClick={onGetStarted} className="mt-4">
        <Sparkles className="mr-2 size-4" />
        Get Started
      </Button>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UserActivationFlow({
  prefilledData,
  onComplete,
  termsUrl,
  safetyPolicyUrl,
  companyName = 'Flow EHS',
  isSubmitting = false,
}: UserActivationFlowProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isComplete, setIsComplete] = React.useState(false)

  const form = useForm<ActivationFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
      firstName: prefilledData.firstName || '',
      lastName: prefilledData.lastName || '',
      phone: '',
      jobTitle: prefilledData.jobTitle || '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      acceptTerms: false,
      acceptSafetyPolicy: false,
    },
  })

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = React.useCallback(async () => {
    const data = form.getValues()
    await onComplete(data)
    setIsComplete(true)
  }, [form, onComplete])

  const handleGetStarted = React.useCallback(() => {
    // In real app, redirect to dashboard
    window.location.href = '/'
  }, [])

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto shadow-md">
        <CardContent className="pt-6">
          <SuccessStep
            firstName={form.getValues('firstName')}
            companyName={companyName}
            onGetStarted={handleGetStarted}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          {/* Icon badge with glass formula */}
          <div className="size-12 rounded-lg bg-accent/20 dark:bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
            <Shield className="size-6 text-accent" />
          </div>
        </div>
        <CardTitle>Activate Your Account</CardTitle>
        <CardDescription>
          Welcome to {companyName}! Complete these steps to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={currentStep} totalSteps={4} />

        <Form {...form}>
          {currentStep === 1 && (
            <PasswordStep form={form} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <ProfileStep
              form={form}
              prefilledData={prefilledData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <EmergencyContactStep
              form={form}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <TermsStep
              form={form}
              termsUrl={termsUrl}
              safetyPolicyUrl={safetyPolicyUrl}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </Form>
      </CardContent>
    </Card>
  )
}

UserActivationFlow.displayName = 'UserActivationFlow'

export default UserActivationFlow
