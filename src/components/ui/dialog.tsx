import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Dialog - Modal dialog component for focused user interactions.
 *
 * @component MOLECULE (compound component with multiple sub-components)
 *
 * @description
 * A modal dialog overlays the page content, requiring user attention.
 * Built on Radix UI Dialog for full accessibility (focus trap, ESC to close,
 * proper ARIA attributes). Use for confirmations, forms, and important actions.
 *
 * @example
 * ```tsx
 * // Basic dialog
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Description text here.</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
 *       <Button>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 *
 * // Controlled dialog
 * const [open, setOpen] = useState(false);
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 *
 * @testid
 * Uses `data-slot` attributes for compound component testing:
 * - `data-slot="dialog"` - Root container
 * - `data-slot="dialog-trigger"` - Trigger element
 * - `data-slot="dialog-content"` - Dialog content panel
 * - `data-slot="dialog-header"` - Header section
 * - `data-slot="dialog-footer"` - Footer section
 * - `data-slot="dialog-title"` - Title text
 * - `data-slot="dialog-description"` - Description text
 * - `data-slot="dialog-close"` - Close button/element
 * - `data-slot="dialog-overlay"` - Background overlay
 *
 * @example Testing
 * ```tsx
 * // Find dialog content
 * screen.getByRole('dialog');
 *
 * // Find by data-slot
 * container.querySelector('[data-slot="dialog-title"]');
 *
 * // Close dialog
 * fireEvent.click(screen.getByRole('button', { name: /close/i }));
 * ```
 *
 * @accessibility
 * - Focus trapped within dialog when open
 * - ESC key closes dialog
 * - Focus returns to trigger on close
 * - Proper ARIA attributes (role="dialog", aria-modal, aria-labelledby)
 *
 * @see DialogContent - Main content container
 * @see DialogTrigger - Element that opens the dialog
 * @see DialogClose - Element that closes the dialog
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}
Dialog.displayName = "Dialog"

/** DialogTrigger - Element that opens the dialog when clicked. */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
DialogTrigger.displayName = "DialogTrigger"

/** DialogClose - Element that closes the dialog when clicked. */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}
DialogClose.displayName = "DialogClose"

/** DialogPortal - Renders dialog content in a portal outside the DOM hierarchy. */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}
DialogPortal.displayName = "DialogPortal"

/** DialogOverlay - Semi-transparent backdrop behind the dialog. */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // Overlay with semi-transparent backdrop
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}
DialogOverlay.displayName = "DialogOverlay"

/**
 * DialogContent - Main content container for the dialog.
 *
 * @description
 * Renders the dialog panel with overlay, animations, and close button.
 * Centers in viewport with max-width constraint.
 * Features an animated "tube" border effect where colors flow inside the border
 * like liquid in a channel (purple → pink → teal → green).
 */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Animated gradient border effect
          "gradient-border-animated",
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          // Positioning
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          // Spacing & appearance (no padding here - applied to inner wrapper)
          "duration-200 sm:rounded-xl",
          className
        )}
        {...props}
      >
        {/* Animated glow layer (follows the rotating gradient) - OUTSIDE content */}
        <span className="gradient-border-animated-glow rounded-xl" aria-hidden="true" />
        {/* Solid background wrapper - covers the glow completely */}
        <div className="relative bg-white dark:bg-abyss-700 text-primary font-sans rounded-xl p-6 grid gap-4">
          {children}
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-page data-[state=open]:text-muted">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
DialogContent.displayName = "DialogContent"

/** DialogHeader - Container for title and description at the top of the dialog. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}
DialogHeader.displayName = "DialogHeader"

/** DialogFooter - Container for action buttons at the bottom of the dialog. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}
DialogFooter.displayName = "DialogFooter"

/** DialogTitle - Accessible title for the dialog (required for screen readers). */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}
DialogTitle.displayName = "DialogTitle"

/** DialogDescription - Accessible description text below the title. */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
}
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
}
