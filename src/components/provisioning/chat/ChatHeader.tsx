"use client"

/**
 * ChatHeader Component
 *
 * MAYA-familiar chat header inspired by WhatsApp/iMessage:
 * - Agent avatar with status dot (green=ready, yellow=thinking, blue=planning)
 * - Status text that updates with agent state
 * - Optional progress bar (desktop only)
 * - Exit button (X) - familiar from chat apps
 *
 * Uses DDS Glass Depth 2 for the header background.
 */

import { motion } from "motion/react"
import { X, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { AgentLogo } from "@/components/shared/AgentLogo"
import type { ChatHeaderProps, AgentState } from "./types"
import type { LogoState } from "@/components/shared/AgentLogo"

/** Map AgentState to LogoState for the AgentLogo component */
function mapToLogoState(state: AgentState): LogoState {
  if (state === "calculating") return "thinking" // Map calculating to thinking animation
  return state
}

/**
 * Status dot - familiar from messaging apps (WhatsApp, iMessage)
 * Pulses when agent is active (thinking/planning/executing)
 */
function StatusDot({ state }: { state: AgentState }) {
  const colorClass = {
    idle: "bg-success", // Green - ready
    thinking: "bg-warning animate-pulse", // Yellow - processing
    planning: "bg-info animate-pulse", // Blue - planning
    executing: "bg-accent animate-pulse", // Teal - working
    calculating: "bg-info animate-pulse", // Blue - calculating pricing
    complete: "bg-success", // Green - done
  }[state] ?? "bg-success"

  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-black",
        colorClass
      )}
      aria-label={`Agent status: ${state}`}
    />
  )
}

/**
 * Get human-readable status text for agent state
 */
function getStatusText(state: AgentState): string {
  return {
    idle: "Ready to help",
    thinking: "Thinking...",
    planning: "Planning...",
    executing: "Creating tenant...",
    calculating: "Calculating pricing...",
    complete: "Complete!",
  }[state] ?? "Ready to help"
}

export function ChatHeader({
  agentState,
  onExit,
  onSaveProgress,
  hasUnsavedProgress,
  progressPercentage,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[4px]">
      <div className="flex items-center gap-3">
        {/* Exit button (X) - familiar from chat apps */}
        {onExit && (
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg transition-colors hover:bg-surface-hover text-secondary hover:text-primary"
            aria-label="Exit conversation"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Agent Avatar with status ring and spinning dashed border */}
        <div className="relative w-10 h-10">
          {/* Avatar container - Depth 2 glass */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">
            <AgentLogo className="w-7 h-7" state={mapToLogoState(agentState)} variant="light" />
          </div>

          {/* Spinning dashed ring - subtle accent */}
          <motion.svg
            className="absolute -inset-0.5 w-11 h-11 text-accent/50 dark:text-accent/30"
            viewBox="0 0 44 44"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="22"
              cy="22"
              r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </motion.svg>

          {/* Status dot - MAYA familiar from messaging apps */}
          <StatusDot state={agentState} />
        </div>

        {/* Agent info */}
        <div>
          <h3 className="font-semibold text-sm text-primary">Tenant Setup Assistant</h3>
          <p className="text-xs text-accent dark:text-info">{getStatusText(agentState)}</p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Optional: Progress indicator in header (desktop only) */}
        {progressPercentage !== undefined && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
            <div className="w-16 h-1.5 rounded-full overflow-hidden bg-accent/20">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <span>{progressPercentage}%</span>
          </div>
        )}

        {/* Save & Exit - appears when has unsaved progress */}
        {onSaveProgress && hasUnsavedProgress && (
          <button
            onClick={onSaveProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-surface-hover text-secondary"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Exit
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatHeader
