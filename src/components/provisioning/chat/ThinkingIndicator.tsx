"use client"

/**
 * ThinkingIndicator Component
 *
 * MAYA innovation for agent credibility - makes the AI assistant feel real:
 * - Typing dots animation (familiar from iMessage/WhatsApp)
 * - Uses AgentLogo with state animations
 * - Shows contextual message based on agent state
 *
 * Uses DDS Glass Depth 3 (20% opacity, 2px blur) for subtle appearance.
 */

import { motion } from "motion/react"
import { AgentLogo, type LogoState } from "@/components/shared/AgentLogo"
import type { ThinkingIndicatorProps } from "./types"

/** Map indicator state to LogoState */
function mapToLogoState(state: "thinking" | "planning" | "executing" | "calculating"): LogoState {
  if (state === "calculating") return "thinking"
  return state
}

/**
 * Typing dots animation - familiar from iMessage/WhatsApp
 * Three bouncing dots that create a "typing" visual
 */
function TypingDots() {
  return (
    <div className="flex items-center gap-1" aria-label="Agent is typing">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-accent"
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/**
 * Default messages for each agent state
 */
const DEFAULT_MESSAGES = {
  thinking: "Processing...",
  planning: "Preparing next step...",
  executing: "Creating tenant...",
  calculating: "Calculating pricing...",
} as const

export function ThinkingIndicator({ state, message }: ThinkingIndicatorProps) {
  const displayMessage = message || DEFAULT_MESSAGES[state]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3 max-w-[90%]"
    >
      {/* Agent avatar - matches ChatBubble pattern */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">
          <AgentLogo className="w-5 h-5" state={mapToLogoState(state)} variant="light" />
        </div>
      </div>

      {/* Thinking bubble - Depth 3 (lighter than chat bubbles) */}
      <div className="px-4 py-3 rounded-xl rounded-bl-sm bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent shadow-sm">
        <div className="flex items-center gap-2">
          {/* Typing dots animation */}
          <TypingDots />
          <span className="text-sm text-secondary">{displayMessage}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ThinkingIndicator
