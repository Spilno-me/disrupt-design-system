import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Sheet - Slide-out panel component for secondary content and actions.
 *
 * @component MOLECULE (compound component with multiple sub-components)
 *
 * @description
 * A sheet slides in from any edge of the screen, providing space for
 * navigation, forms, or supplementary content. Built on Radix UI Dialog
 * for full accessibility (focus trap, ESC to close, proper ARIA attributes).
 *
 * @example
 * ```tsx
 * // Basic sheet (slides from right by default)
 * <Sheet>
 *   <SheetTrigger asChild>
 *     <Button>Open Sheet</Button>
 *   </SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Sheet Title</SheetTitle>
 *       <SheetDescription>Description text here.</SheetDescription>
 *     </SheetHeader>
 *     <div className="py-4">Content goes here</div>
 *     <SheetFooter>
 *       <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
 *       <Button>Save</Button>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 *
 * // Sheet from different sides
 * <SheetContent side="left">...</SheetContent>
 * <SheetContent side="top">...</SheetContent>
 * <SheetContent side="bottom">...</SheetContent>
 *
 * // Controlled sheet
 * const [open, setOpen] = useState(false);
 * <Sheet open={open} onOpenChange={setOpen}>
 *   <SheetContent>...</SheetContent>
 * </Sheet>
 * ```
 *
 * @testid
 * Uses `data-slot` attributes for compound component testing:
 * - `data-slot="sheet"` - Root container
 * - `data-slot="sheet-trigger"` - Trigger element
 * - `data-slot="sheet-content"` - Sheet content panel
 * - `data-slot="sheet-header"` - Header section
 * - `data-slot="sheet-footer"` - Footer section
 * - `data-slot="sheet-title"` - Title text
 * - `data-slot="sheet-description"` - Description text
 * - `data-slot="sheet-close"` - Close button/element
 * - `data-slot="sheet-overlay"` - Background overlay
 *
 * @example Testing
 * ```tsx
 * // Find sheet content
 * screen.getByRole('dialog');
 *
 * // Find by data-slot
 * container.querySelector('[data-slot="sheet-title"]');
 *
 * // Close sheet
 * fireEvent.click(screen.getByRole('button', { name: /close/i }));
 * ```
 *
 * @accessibility
 * - Focus trapped within sheet when open
 * - ESC key closes sheet
 * - Focus returns to trigger on close
 * - Proper ARIA attributes (role="dialog", aria-modal, aria-labelledby)
 *
 * @see SheetContent - Main content container with side positioning
 * @see SheetTrigger - Element that opens the sheet
 * @see SheetClose - Element that closes the sheet
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}
Sheet.displayName = "Sheet"

/** SheetTrigger - Element that opens the sheet when clicked. */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}
SheetTrigger.displayName = "SheetTrigger"

/** SheetClose - Element that closes the sheet when clicked. */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}
SheetClose.displayName = "SheetClose"

/** SheetPortal - Renders sheet content in a portal outside the DOM hierarchy. */
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}
SheetPortal.displayName = "SheetPortal"

/** SheetOverlay - Semi-transparent backdrop behind the sheet. */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Overlay with semi-transparent backdrop (matches Dialog)
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}
SheetOverlay.displayName = "SheetOverlay"

/**
 * SheetContent - Main content container for the sheet.
 *
 * @description
 * Renders the sheet panel with overlay, animations, and optional close button.
 * Supports four positions: right (default), left, top, and bottom.
 *
 * @param side - Position from which the sheet slides in (default: "right")
 * @param hideCloseButton - Hide the default close button (default: false)
 */
function SheetContent({
  className,
  children,
  side = "right",
  hideCloseButton = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  hideCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // Base sheet styles with design system colors
          "bg-surface text-primary font-sans",
          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          // Side-specific positioning
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l border-default sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r border-default sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b border-default",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t border-default",
          className
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <SheetPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-page data-[state=open]:text-muted">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}
SheetContent.displayName = "SheetContent"

/** SheetHeader - Container for title and description at the top of the sheet. */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}
SheetHeader.displayName = "SheetHeader"

/** SheetFooter - Container for action buttons at the bottom of the sheet. */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}
SheetFooter.displayName = "SheetFooter"

/** SheetTitle - Accessible title for the sheet (required for screen readers). */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}
SheetTitle.displayName = "SheetTitle"

/** SheetDescription - Accessible description text below the title. */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
}
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
