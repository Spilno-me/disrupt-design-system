/**
 * Toaster - DDS-styled toast notifications using Sonner
 *
 * @component ATOM (wrapper)
 *
 * @description
 * A toast notification system built on Sonner with DDS design tokens.
 * Provides success, error, warning, and info variants with consistent
 * styling across light and dark modes.
 *
 * Features:
 * - Elevated floating appearance (bg-elevated shadow-lg)
 * - Semantic color variants for different toast types
 * - Smooth enter/exit animations
 * - Dark mode support
 * - Accessible with ARIA live regions
 *
 * @example
 * ```tsx
 * // In your app root
 * import { Toaster } from '@/components/ui/sonner'
 * <Toaster />
 *
 * // To trigger toasts
 * import { toast } from 'sonner'
 * toast.success('Template saved successfully')
 * toast.error('Failed to save template')
 * toast.warning('You have unsaved changes')
 * toast('Default notification')
 * ```
 *
 * @depth Elevated (floating) - bg-elevated shadow-lg rounded-xl
 */

import { Toaster as Sonner, toast } from 'sonner'
import type { ComponentProps } from 'react'

type ToasterProps = ComponentProps<typeof Sonner>

/**
 * Toaster provider - Place once at app root
 *
 * Theme follows system preference by default.
 * If using next-themes, the consumer's app should wrap with ThemeProvider
 * and Sonner will detect it automatically via the 'system' setting.
 */
function Toaster({ theme = 'system', ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        // Base toast styling - elevated floating element
        classNames: {
          toast: [
            'group toast',
            // Elevated layer per depth rules
            'bg-elevated',
            'border border-default',
            'shadow-lg',
            // Card/Dialog = rounded-xl
            'rounded-xl',
            // Typography
            'text-primary text-sm',
            // Sizing
            'min-w-[300px]',
          ].join(' '),
          title: 'text-primary font-medium',
          description: 'text-secondary text-sm',
          actionButton: [
            'bg-accent text-onAccent',
            'hover:bg-accent/90',
            'rounded-lg',
            'font-medium',
          ].join(' '),
          cancelButton: [
            'bg-muted-bg text-secondary',
            'hover:bg-surfaceHover',
            'rounded-lg',
          ].join(' '),
          closeButton: [
            'bg-surface hover:bg-surfaceHover',
            'border border-default',
            'text-secondary hover:text-primary',
          ].join(' '),
          // Semantic variants using colored glass (depth 3)
          success: [
            'bg-success/20 dark:bg-success/20',
            'border-2 border-success/40',
            'text-success',
            '[&_[data-title]]:text-success',
          ].join(' '),
          error: [
            'bg-error/20 dark:bg-error/20',
            'border-2 border-error/40',
            'text-error',
            '[&_[data-title]]:text-error',
          ].join(' '),
          warning: [
            'bg-warning/20 dark:bg-warning/20',
            'border-2 border-warning/40',
            'text-warning',
            '[&_[data-title]]:text-warning',
          ].join(' '),
          info: [
            'bg-info/20 dark:bg-info/20',
            'border-2 border-info/40',
            'text-info',
            '[&_[data-title]]:text-info',
          ].join(' '),
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
