/**
 * Collapsible - Expandable content container
 *
 * Based on Radix UI Collapsible with DDS styling
 */

import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '../../lib/utils'

// =============================================================================
// COLLAPSIBLE ROOT
// =============================================================================

const Collapsible = CollapsiblePrimitive.Root

// =============================================================================
// COLLAPSIBLE TRIGGER
// =============================================================================

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

// =============================================================================
// COLLAPSIBLE CONTENT
// =============================================================================

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      'overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
))
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
