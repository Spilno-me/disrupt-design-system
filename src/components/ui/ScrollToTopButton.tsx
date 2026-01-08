import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'

export interface ScrollToTopButtonProps {
  /** CSS selector for the element that triggers button visibility */
  triggerSelector?: string
}

export function ScrollToTopButton({ triggerSelector = '[data-element="faq-section"]' }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // RAF throttle refs - matches pattern from useHeaderContrast.ts
  const resizeTickingRef = useRef(false)
  const scrollTickingRef = useRef(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // RAF-throttled resize handler
    const throttledCheckMobile = () => {
      if (!resizeTickingRef.current) {
        requestAnimationFrame(() => {
          try {
            checkMobile()
          } finally {
            resizeTickingRef.current = false
          }
        })
        resizeTickingRef.current = true
      }
    }

    checkMobile() // Initial check (no throttle needed)
    window.addEventListener('resize', throttledCheckMobile)

    return () => window.removeEventListener('resize', throttledCheckMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const triggerElement = document.querySelector(triggerSelector)

      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect()
        // Show button when FAQ section reaches top of viewport
        setIsVisible(rect.top <= 100)
      }
    }

    // RAF-throttled scroll handler
    const throttledHandleScroll = () => {
      if (!scrollTickingRef.current) {
        requestAnimationFrame(() => {
          try {
            handleScroll()
          } finally {
            scrollTickingRef.current = false
          }
        })
        scrollTickingRef.current = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    handleScroll() // Check initial position (no throttle needed)

    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [isMobile, triggerSelector])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-inverse-bg text-inverse shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
