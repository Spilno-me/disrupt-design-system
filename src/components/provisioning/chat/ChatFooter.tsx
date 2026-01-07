"use client"

/**
 * ChatFooter Component
 *
 * Contextual footer that appears only when needed (MAYA principle):
 * - Hidden during normal chat flow (familiar from messaging apps)
 * - Shows for: exit confirmation, success actions
 *
 * Uses DDS Glass Depth 2 and animates entry with slide-up.
 */

import { motion, AnimatePresence } from "motion/react"
import { X, Save, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChatFooterProps } from "./types"

export function ChatFooter({
  variant,
  onPrimaryAction,
  onSecondaryAction,
  isSubmitting,
}: ChatFooterProps) {
  if (variant === "hidden") return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="px-4 py-4 bg-white/40 dark:bg-black/40 backdrop-blur-[4px]"
      >
        {variant === "confirm-exit" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-secondary text-center">Save your progress before leaving?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button
                variant="accent"
                onClick={onPrimaryAction}
                className="flex-1"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
            </div>
          </div>
        )}

        {variant === "success" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onSecondaryAction} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Create Another
            </Button>
            <Button variant="accent" onClick={onPrimaryAction} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default ChatFooter
