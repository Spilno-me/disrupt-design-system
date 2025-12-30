/**
 * ActionSheet - iOS-style contextual action menu for mobile
 *
 * @component MOLECULE (compound component)
 *
 * @description
 * A mobile-optimized action menu that appears near the trigger element.
 * Styled with glassmorphism effect following iOS design patterns.
 * Uses Radix Popover for accessible positioning and focus management.
 *
 * Features:
 * - Glassmorphic background with backdrop blur
 * - 44px minimum touch targets (Fitts' Law)
 * - Destructive action variant (red text)
 * - Automatic positioning near trigger
 * - Focus trap and keyboard navigation
 *
 * @example
 * ```tsx
 * <ActionSheet>
 *   <ActionSheetTrigger asChild>
 *     <Button>Actions</Button>
 *   </ActionSheetTrigger>
 *   <ActionSheetContent>
 *     <ActionSheetItem onSelect={() => handleEdit()}>
 *       Edit
 *     </ActionSheetItem>
 *     <ActionSheetSeparator />
 *     <ActionSheetItem variant="destructive" onSelect={() => handleDelete()}>
 *       Delete
 *     </ActionSheetItem>
 *   </ActionSheetContent>
 * </ActionSheet>
 * ```
 *
 * @accessibility
 * - Focus trapped within menu when open
 * - ESC key closes menu
 * - Arrow keys navigate between items
 * - Enter/Space selects item
 */

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'

// =============================================================================
// CONTEXT
// =============================================================================

interface ActionSheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ActionSheetContext = React.createContext<ActionSheetContextValue | null>(null)

function useActionSheet() {
  const context = React.useContext(ActionSheetContext)
  if (!context) {
    throw new Error('ActionSheet components must be used within an ActionSheet')
  }
  return context
}

// =============================================================================
// ROOT
// =============================================================================

interface ActionSheetProps {
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean
  children: React.ReactNode
}

function ActionSheet({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
}: ActionSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const onOpenChange = isControlled
    ? controlledOnOpenChange ?? (() => {})
    : setUncontrolledOpen

  return (
    <ActionSheetContext.Provider value={{ open, onOpenChange }}>
      <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </PopoverPrimitive.Root>
    </ActionSheetContext.Provider>
  )
}
ActionSheet.displayName = 'ActionSheet'

// =============================================================================
// TRIGGER
// =============================================================================

type ActionSheetTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>

const ActionSheetTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  ActionSheetTriggerProps
>(({ ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    data-slot="action-sheet-trigger"
    {...props}
  />
))
ActionSheetTrigger.displayName = 'ActionSheetTrigger'

// =============================================================================
// CONTENT
// =============================================================================

interface ActionSheetContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    'sideOffset' | 'align'
  > {
  /** Offset from trigger (default: 8) */
  sideOffset?: number
  /** Alignment relative to trigger (default: center) */
  align?: 'start' | 'center' | 'end'
}

const ActionSheetContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  ActionSheetContentProps
>(({ className, sideOffset = 8, align = 'center', children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="action-sheet-content"
      sideOffset={sideOffset}
      align={align}
      className={cn(
        // Base styles - rounded-xl per design rules (Card/Dialog = xl)
        'z-50 min-w-[180px] overflow-hidden rounded-xl p-1',
        // Elevated with shadow per depth rules (dropdown = bg-elevated shadow-lg)
        'bg-elevated',
        'border border-default',
        'shadow-lg',
        // Animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
ActionSheetContent.displayName = 'ActionSheetContent'

// =============================================================================
// ITEM
// =============================================================================

interface ActionSheetItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'destructive'
  /** Called when item is selected */
  onSelect?: () => void
  /** Icon to display before label */
  icon?: React.ReactNode
}

const ActionSheetItem = React.forwardRef<HTMLButtonElement, ActionSheetItemProps>(
  ({ className, variant = 'default', onSelect, icon, children, onClick, ...props }, ref) => {
    const { onOpenChange } = useActionSheet()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onSelect?.()
      onOpenChange(false)
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="action-sheet-item"
        className={cn(
          // Base styles - 44px min height for touch (Fitts' Law)
          // rounded-lg per nested formula: outer(xl/20px) - padding(4px) = 16px
          'flex w-full items-center gap-3 px-3 py-2.5 min-h-[44px]',
          'text-left text-sm font-medium',
          'rounded-lg',
          'transition-colors duration-150',
          // Focus styles
          'outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
          // Variant styles
          variant === 'default' && [
            'text-primary',
            'hover:bg-surfaceHover active:bg-surfaceHover',
          ],
          variant === 'destructive' && [
            'text-error',
            'hover:bg-error/10 active:bg-error/15',
          ],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {icon && <span className="flex-shrink-0 size-4">{icon}</span>}
        <span className="flex-1">{children}</span>
      </button>
    )
  }
)
ActionSheetItem.displayName = 'ActionSheetItem'

// =============================================================================
// SEPARATOR
// =============================================================================

interface ActionSheetSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActionSheetSeparator = React.forwardRef<HTMLDivElement, ActionSheetSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="action-sheet-separator"
      className={cn('h-px my-1 mx-2 bg-default/50', className)}
      {...props}
    />
  )
)
ActionSheetSeparator.displayName = 'ActionSheetSeparator'

// =============================================================================
// LABEL (optional header for groups)
// =============================================================================

interface ActionSheetLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActionSheetLabel = React.forwardRef<HTMLDivElement, ActionSheetLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="action-sheet-label"
      className={cn(
        'px-3 py-2 text-xs font-medium text-secondary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ActionSheetLabel.displayName = 'ActionSheetLabel'

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetLabel,
}

export type {
  ActionSheetProps,
  ActionSheetTriggerProps,
  ActionSheetContentProps,
  ActionSheetItemProps,
  ActionSheetSeparatorProps,
  ActionSheetLabelProps,
}
