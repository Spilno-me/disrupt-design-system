/**
 * ResponsiveActionMenu - Adaptive action menu that switches between mobile/desktop patterns
 *
 * @component MOLECULE (compound component)
 *
 * @description
 * Automatically renders the appropriate action menu pattern based on viewport:
 * - Mobile (< 640px): iOS-style ActionSheet with glassmorphism
 * - Desktop (≥ 640px): Standard DropdownMenu with hover states
 *
 * This follows Jakob's Law - users expect familiar patterns from their platform.
 *
 * @example
 * ```tsx
 * <ResponsiveActionMenu>
 *   <ResponsiveActionMenuTrigger asChild>
 *     <Button>Actions</Button>
 *   </ResponsiveActionMenuTrigger>
 *   <ResponsiveActionMenuContent>
 *     <ResponsiveActionMenuItem onSelect={() => handleEdit()}>
 *       Edit
 *     </ResponsiveActionMenuItem>
 *     <ResponsiveActionMenuSeparator />
 *     <ResponsiveActionMenuItem variant="destructive" onSelect={() => handleDelete()}>
 *       Delete
 *     </ResponsiveActionMenuItem>
 *   </ResponsiveActionMenuContent>
 * </ResponsiveActionMenu>
 * ```
 */

import * as React from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetLabel,
} from './ActionSheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu'
import { cn } from '../../lib/utils'

// =============================================================================
// CONTEXT
// =============================================================================

interface ResponsiveActionMenuContextValue {
  isMobile: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ResponsiveActionMenuContext = React.createContext<ResponsiveActionMenuContextValue | null>(null)

function useResponsiveActionMenu() {
  const context = React.useContext(ResponsiveActionMenuContext)
  if (!context) {
    throw new Error('ResponsiveActionMenu components must be used within a ResponsiveActionMenu')
  }
  return context
}

// =============================================================================
// ROOT
// =============================================================================

interface ResponsiveActionMenuProps {
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean
  children: React.ReactNode
}

function ResponsiveActionMenu({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
}: ResponsiveActionMenuProps) {
  const isMobile = useIsMobile()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const onOpenChange = isControlled
    ? controlledOnOpenChange ?? (() => {})
    : setUncontrolledOpen

  return (
    <ResponsiveActionMenuContext.Provider value={{ isMobile, open, onOpenChange }}>
      {isMobile ? (
        <ActionSheet open={open} onOpenChange={onOpenChange}>
          {children}
        </ActionSheet>
      ) : (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          {children}
        </DropdownMenu>
      )}
    </ResponsiveActionMenuContext.Provider>
  )
}
ResponsiveActionMenu.displayName = 'ResponsiveActionMenu'

// =============================================================================
// TRIGGER
// =============================================================================

interface ResponsiveActionMenuTriggerProps {
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

function ResponsiveActionMenuTrigger({
  asChild,
  className,
  children,
}: ResponsiveActionMenuTriggerProps) {
  const { isMobile } = useResponsiveActionMenu()

  if (isMobile) {
    return (
      <ActionSheetTrigger asChild={asChild} className={className}>
        {children}
      </ActionSheetTrigger>
    )
  }

  return (
    <DropdownMenuTrigger asChild={asChild} className={className}>
      {children}
    </DropdownMenuTrigger>
  )
}
ResponsiveActionMenuTrigger.displayName = 'ResponsiveActionMenuTrigger'

// =============================================================================
// CONTENT
// =============================================================================

interface ResponsiveActionMenuContentProps {
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end'
  /** Additional class names */
  className?: string
  children: React.ReactNode
}

function ResponsiveActionMenuContent({
  align = 'end',
  className,
  children,
}: ResponsiveActionMenuContentProps) {
  const { isMobile } = useResponsiveActionMenu()

  if (isMobile) {
    return (
      <ActionSheetContent align={align} className={className}>
        {children}
      </ActionSheetContent>
    )
  }

  return (
    <DropdownMenuContent align={align} className={cn('min-w-[180px]', className)}>
      {children}
    </DropdownMenuContent>
  )
}
ResponsiveActionMenuContent.displayName = 'ResponsiveActionMenuContent'

// =============================================================================
// ITEM
// =============================================================================

interface ResponsiveActionMenuItemProps {
  /** Visual variant */
  variant?: 'default' | 'destructive'
  /** Called when item is selected */
  onSelect?: () => void
  /** Icon to display before label */
  icon?: React.ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Additional class names */
  className?: string
  children: React.ReactNode
}

function ResponsiveActionMenuItem({
  variant = 'default',
  onSelect,
  icon,
  disabled,
  className,
  children,
}: ResponsiveActionMenuItemProps) {
  const { isMobile, onOpenChange } = useResponsiveActionMenu()

  if (isMobile) {
    return (
      <ActionSheetItem
        variant={variant}
        onSelect={onSelect}
        icon={icon}
        disabled={disabled}
        className={className}
      >
        {children}
      </ActionSheetItem>
    )
  }

  return (
    <DropdownMenuItem
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 cursor-pointer',
        variant === 'destructive' && 'text-error focus:text-error focus:bg-error/10',
        className
      )}
      onSelect={() => {
        onSelect?.()
        onOpenChange(false)
      }}
    >
      {icon && <span className="flex-shrink-0 size-4">{icon}</span>}
      {children}
    </DropdownMenuItem>
  )
}
ResponsiveActionMenuItem.displayName = 'ResponsiveActionMenuItem'

// =============================================================================
// SEPARATOR
// =============================================================================

interface ResponsiveActionMenuSeparatorProps {
  className?: string
}

function ResponsiveActionMenuSeparator({ className }: ResponsiveActionMenuSeparatorProps) {
  const { isMobile } = useResponsiveActionMenu()

  if (isMobile) {
    return <ActionSheetSeparator className={className} />
  }

  return <DropdownMenuSeparator className={className} />
}
ResponsiveActionMenuSeparator.displayName = 'ResponsiveActionMenuSeparator'

// =============================================================================
// LABEL
// =============================================================================

interface ResponsiveActionMenuLabelProps {
  className?: string
  children: React.ReactNode
}

function ResponsiveActionMenuLabel({ className, children }: ResponsiveActionMenuLabelProps) {
  const { isMobile } = useResponsiveActionMenu()

  if (isMobile) {
    return <ActionSheetLabel className={className}>{children}</ActionSheetLabel>
  }

  return <DropdownMenuLabel className={className}>{children}</DropdownMenuLabel>
}
ResponsiveActionMenuLabel.displayName = 'ResponsiveActionMenuLabel'

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ResponsiveActionMenu,
  ResponsiveActionMenuTrigger,
  ResponsiveActionMenuContent,
  ResponsiveActionMenuItem,
  ResponsiveActionMenuSeparator,
  ResponsiveActionMenuLabel,
}

export type {
  ResponsiveActionMenuProps,
  ResponsiveActionMenuTriggerProps,
  ResponsiveActionMenuContentProps,
  ResponsiveActionMenuItemProps,
  ResponsiveActionMenuSeparatorProps,
  ResponsiveActionMenuLabelProps,
}
