/**
 * Form Components - Pre-built form components and utilities
 *
 * This subpath export provides granular access to form components,
 * enabling better tree-shaking for consuming applications.
 *
 * @usage
 * ```tsx
 * import { ContactForm, LoginForm } from '@adrozdenko/design-system/forms'
 * ```
 *
 * @module forms
 */

// =============================================================================
// CONTACT FORMS
// =============================================================================

export { ContactForm } from '../components/forms/ContactForm'
export { ContactFormSuccessModal } from '../components/forms/ContactFormSuccessModal'
export { ContactFormErrorModal } from '../components/forms/ContactFormErrorModal'

// =============================================================================
// AUTH FORMS
// =============================================================================

export { LoginForm } from '../components/auth/LoginForm'
export type { LoginFormProps, LoginFormValues } from '../components/auth/LoginForm'
export { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm'
export type { ForgotPasswordFormProps, ForgotPasswordFormValues } from '../components/auth/ForgotPasswordForm'
export { ResetPasswordForm } from '../components/auth/ResetPasswordForm'
export type { ResetPasswordFormProps, ResetPasswordFormValues } from '../components/auth/ResetPasswordForm'
export { AuthLayout } from '../components/auth/AuthLayout'
export type { AuthLayoutProps } from '../components/auth/AuthLayout'

// =============================================================================
// FORM PRIMITIVES (re-exported from ui for convenience)
// =============================================================================

export { Input } from '../components/ui/input'
export { Textarea } from '../components/ui/textarea'
export { Checkbox } from '../components/ui/checkbox'
export { Switch } from '../components/ui/switch'
export type { SwitchProps } from '../components/ui/switch'
export { Label } from '../components/ui/label'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

// =============================================================================
// FORM SYSTEM (react-hook-form integration)
// =============================================================================

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '../components/ui/form'
