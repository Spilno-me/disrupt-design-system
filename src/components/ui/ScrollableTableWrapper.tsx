import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight } from 'lucide-react'

interface ScrollableTableWrapperProps {
  children: ReactNode
  className?: string
}

export function ScrollableTableWrapper({ children, className = '' }: ScrollableTableWrapperProps) {
  const [showHint, setShowHint] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const hasHorizontalScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        // Only show hint on mobile-ish screens and if there's overflow
        setShowHint(hasHorizontalScroll && window.innerWidth < 1024 && !hasScrolled)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => window.removeEventListener('resize', checkOverflow)
  }, [hasScrolled])

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollLeft > 20) {
      setHasScrolled(true)
      setShowHint(false)
    }
  }

  const handleHintClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: 100,
        behavior: 'smooth'
      })
      setHasScrolled(true)
      setShowHint(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="overflow-x-auto"
        onScroll={handleScroll}
      >
        {children}
      </div>

      {/* Scroll hint overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 right-0 w-16 pointer-events-none lg:hidden"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))'
            }}
          />
        )}
      </AnimatePresence>

      {/* Scroll hint button */}
      <AnimatePresence>
        {showHint && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            onClick={handleHintClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-dark text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg lg:hidden"
            aria-label="Scroll to see more"
          >
            <span>Swipe</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
