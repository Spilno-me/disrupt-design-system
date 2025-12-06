import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import { COLORS } from "../../constants/designTokens"

// =============================================================================
// PRICING CONNECTOR COMPONENT
// =============================================================================

interface PricingConnectorProps extends React.ComponentProps<"div"> {
  /** Icon to display (defaults to Plus) */
  icon?: React.ReactNode
}

/**
 * A connector element used between pricing components to show combination.
 * Displays a red circle with a plus icon by default.
 */
function PricingConnector({ className, icon, ...props }: PricingConnectorProps) {
  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center", className)}
      {...props}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: COLORS.ferrariRed,
          boxShadow: '0 2px 12px rgba(247, 13, 26, 0.35)'
        }}
      >
        {icon || <Plus className="w-5 h-5 text-white" strokeWidth={3} />}
      </div>
    </div>
  )
}

export { PricingConnector }
