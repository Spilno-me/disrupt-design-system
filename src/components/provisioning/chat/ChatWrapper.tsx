"use client"

/**
 * ChatWrapper Component
 *
 * Three-section layout wrapper matching the wizard pattern:
 * - Header (shrink-0) with gradient border below
 * - Content (flex-1 min-h-0 overflow-auto) for scrollable chat
 * - Footer (shrink-0, conditional) with gradient border above
 *
 * Uses ALIAS.border.default for gradient separators.
 */

import { cn } from "@/lib/utils"
import { ALIAS } from "@/constants/designTokens"
import type { ChatWrapperProps } from "./types"

/**
 * Gradient border separator component
 * Renders a subtle gradient line from transparent → border color → transparent
 */
function GradientBorder({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-px",
        position === "top" ? "top-0" : "bottom-0"
      )}
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${ALIAS.border.default} 50%, transparent 100%)`,
      }}
    />
  )
}

export function ChatWrapper({ header, footer, children, className }: ChatWrapperProps) {
  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      {/* HEADER - shrink-0, gradient border below */}
      <div className="shrink-0 relative">
        {header}
        <GradientBorder position="bottom" />
      </div>

      {/* CONTENT - flex-1 min-h-0 overflow-auto */}
      <div className="flex-1 min-h-0 overflow-auto px-4 md:px-6 py-4 md:py-6">
        {children}
      </div>

      {/* FOOTER - shrink-0, conditional render */}
      {footer && (
        <div className="shrink-0 relative">
          <GradientBorder position="top" />
          {footer}
        </div>
      )}
    </div>
  )
}

export default ChatWrapper
