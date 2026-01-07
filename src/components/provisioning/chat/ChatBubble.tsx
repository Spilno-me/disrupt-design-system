"use client"

/**
 * ChatBubble Component
 *
 * Renders chat messages with appropriate styling for different variants:
 * - assistant: Default white glass bubble with AgentLogo
 * - tip: Blue info glass bubble with Lightbulb icon
 * - summary: User summary bubble with User icon
 *
 * Follows DDS Glass Depth 2 (40% opacity, 4px blur) for direct text readability.
 */

import { motion } from "motion/react"
import { Lightbulb, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { AgentLogo } from "@/components/shared/AgentLogo"
import type { ChatBubbleProps } from "./types"

export function ChatBubble({ children, variant = "assistant" }: ChatBubbleProps) {
  // DDS Glass Depth 2 (40% opacity) - allows direct text with semantic tokens
  // Colored glass: NO dark: variant needed (semantic tokens auto-adjust)
  // White glass: NEEDS dark: variant (bg-white/40 dark:bg-black/40)
  const bubbleClasses =
    variant === "tip"
      ? "bg-info/40 backdrop-blur-[4px] border-2 border-info/60 shadow-md"
      : variant === "summary"
        ? "bg-accent/40 backdrop-blur-[4px] border-2 border-accent/60 shadow-md"
        : "bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md"

  // Icon containers: Depth 3 for colored (20%), Depth 2 for white glass
  const icon =
    variant === "tip" ? (
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-info/20 backdrop-blur-[2px] border-2 border-info/40 shadow-sm">
        <Lightbulb className="w-4 h-4 text-accent" />
      </div>
    ) : variant === "summary" ? (
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent/20 backdrop-blur-[2px] border-2 border-accent/40 shadow-sm">
        <User className="w-4 h-4 text-accent" />
      </div>
    ) : (
      <div className="relative w-8 h-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">
          <AgentLogo className="w-5 h-5" variant="light" />
        </div>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 max-w-[90%]"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div
        className={cn(
          "px-4 py-3 text-sm leading-relaxed text-primary rounded-xl rounded-bl-sm",
          bubbleClasses
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default ChatBubble
