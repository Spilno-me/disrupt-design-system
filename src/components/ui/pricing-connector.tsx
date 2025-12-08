import * as React from "react"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { ALIAS } from "../../constants/designTokens"

// =============================================================================
// PRICING CONNECTOR COMPONENT
// =============================================================================

interface PricingConnectorProps extends React.ComponentProps<"div"> {
  /** Icon to display (defaults to Plus) */
  icon?: React.ReactNode
  /** Enable periodic spin animation (interval in ms, e.g. 3000 for every 3 seconds) */
  spinInterval?: number
  /** Spin duration in ms (default: 600) */
  spinDuration?: number
}

/**
 * A connector element used between pricing components to show combination.
 * Displays a red circle with a plus icon by default.
 * Supports periodic spin animation.
 */
function PricingConnector({
  className,
  icon,
  spinInterval,
  spinDuration = 600,
  ...props
}: PricingConnectorProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!spinInterval) return

    const interval = setInterval(() => {
      setRotation(prev => prev + 180)
    }, spinInterval)

    return () => clearInterval(interval)
  }, [spinInterval])

  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center", className)}
      {...props}
    >
      <motion.div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: ALIAS.status.error,
          boxShadow: '0 2px 12px rgba(247, 13, 26, 0.35)'
        }}
        animate={{ rotate: rotation }}
        transition={{
          duration: spinDuration / 1000,
          ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
        }}
      >
        {icon || <Plus className="w-5 h-5 text-white" strokeWidth={3} />}
      </motion.div>
    </div>
  )
}

export { PricingConnector }
