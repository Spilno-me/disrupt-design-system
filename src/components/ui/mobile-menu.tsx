"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LAYOUT } from "@/constants/designTokens"

function AnimatedBurger({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-5 h-5 flex flex-col justify-center items-center gap-[5px]">
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      />
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
    </div>
  )
}

interface MobileMenuProps {
  children: React.ReactNode
  className?: string
  onItemClick?: () => void
}

export function MobileMenu({ children, className, onItemClick }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleItemClick = () => {
    setOpen(false)
    onItemClick?.()
  }

  const menuContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/20 z-[39] md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel - z-index lower than header (z-50) so it appears under */}
          <motion.div
            initial={{ y: -300 }}
            animate={{ y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            exit={{ y: -300, transition: { duration: 0.15, ease: "easeIn" } }}
            className="fixed top-0 inset-x-0 bg-white shadow-lg z-[40] md:hidden"
            style={{ paddingTop: `${LAYOUT.HEADER_HEIGHT_PX}px` }}
          >
            <div className="w-full px-4 py-4 space-y-4 max-w-none" onClick={handleItemClick}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <Button
        variant="ghost"
        className={cn("md:hidden p-2 h-auto", className)}
        size="sm"
        onClick={() => setOpen(!open)}
      >
        <AnimatedBurger isOpen={open} />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Portal menu to body so it renders behind header */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  )
}
