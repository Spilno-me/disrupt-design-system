"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "../../lib/utils"
import { Label } from "./label"

/**
 * Form - React Hook Form provider wrapper (MOLECULE)
 *
 * Wraps react-hook-form's FormProvider with DDS styling and accessibility.
 * Use with FormField, FormItem, FormLabel, FormControl, and FormMessage.
 *
 * Component Type: MOLECULE
 * - Manages form state and validation context
 * - Composes multiple sub-components
 * - testId: Auto-generated from form fields
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { email: '' } })
 *
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={form.control}
 *       name="email"
 *       render={({ field }) => (
 *         <FormItem>
 *           <FormLabel>Email</FormLabel>
 *           <FormControl>
 *             <Input {...field} data-testid="email-input" />
 *           </FormControl>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *   </form>
 * </Form>
 * ```
 */
const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * FormField - Field wrapper with validation context (MOLECULE)
 *
 * Wraps react-hook-form's Controller and provides field context.
 * Use with FormItem, FormLabel, FormControl, and FormMessage.
 *
 * Component Type: MOLECULE
 * - Manages single field state
 * - Provides validation context
 * - testId: Pass to child input via FormControl
 *
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input {...field} data-testid="email-input" />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * FormItem - Form field container (MOLECULE)
 *
 * Provides layout and spacing for form fields.
 * Automatically generates IDs for accessibility.
 *
 * Component Type: MOLECULE
 * - Container for label, control, description, and message
 * - Generates unique IDs for ARIA relationships
 * - testId: Not applicable (layout component)
 *
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Email</FormLabel>
 *   <FormControl>
 *     <Input data-testid="email-input" />
 *   </FormControl>
 *   <FormDescription>We'll never share your email.</FormDescription>
 *   <FormMessage />
 * </FormItem>
 * ```
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

FormItem.displayName = "FormItem"

/**
 * FormLabel - Form field label (MOLECULE)
 *
 * Styled label that automatically links to form control.
 * Shows error state when validation fails.
 *
 * Component Type: MOLECULE
 * - Wraps DDS Label component
 * - Auto-connects to FormControl via htmlFor
 * - Changes color on error state
 * - testId: Not applicable (uses Label's testId)
 *
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Email Address</FormLabel>
 *   <FormControl>
 *     <Input data-testid="email-input" />
 *   </FormControl>
 * </FormItem>
 * ```
 */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("text-primary font-medium data-[error=true]:text-error", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

FormLabel.displayName = "FormLabel"

/**
 * FormControl - Form input wrapper with accessibility (MOLECULE)
 *
 * Wraps form inputs and connects them to labels and error messages.
 * Automatically sets ARIA attributes for accessibility.
 *
 * Component Type: MOLECULE
 * - Wraps any form input (Input, Textarea, Select, etc.)
 * - Sets up ARIA relationships
 * - Passes testId to child component
 *
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Email</FormLabel>
 *   <FormControl>
 *     <Input data-testid="email-input" />
 *   </FormControl>
 * </FormItem>
 * ```
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

FormControl.displayName = "FormControl"

/**
 * FormDescription - Form field help text (ATOM)
 *
 * Optional helper text shown below form controls.
 * Automatically linked via ARIA for screen readers.
 *
 * Component Type: ATOM
 * - Simple styled paragraph
 * - Connected to FormControl via aria-describedby
 * - testId: Accepts via props spread
 *
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Password</FormLabel>
 *   <FormControl>
 *     <Input type="password" />
 *   </FormControl>
 *   <FormDescription data-testid="password-hint">
 *     Must be at least 8 characters
 *   </FormDescription>
 * </FormItem>
 * ```
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
}

FormDescription.displayName = "FormDescription"

/**
 * FormMessage - Form validation error message (ATOM)
 *
 * Displays validation error messages when field validation fails.
 * Automatically hidden when no error present.
 *
 * Component Type: ATOM
 * - Simple error text display
 * - Auto-shows react-hook-form errors
 * - Can show custom messages via children
 * - testId: Accepts via props spread
 *
 * @example
 * ```tsx
 * // Automatic error from validation
 * <FormItem>
 *   <FormLabel>Email</FormLabel>
 *   <FormControl>
 *     <Input data-testid="email-input" />
 *   </FormControl>
 *   <FormMessage data-testid="email-error" />
 * </FormItem>
 *
 * // Custom message
 * <FormMessage data-testid="custom-error">
 *   This field is required
 * </FormMessage>
 * ```
 */
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-error text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
