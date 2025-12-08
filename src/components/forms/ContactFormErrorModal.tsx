import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { ElectricButtonWrapper } from '../ui/GlassEffect'
import { ALIAS } from '../../constants/designTokens'

export interface ContactFormErrorModalProps {
  open: boolean
  onClose: () => void
  onRetry?: () => void
  /** Modal title text */
  title?: string
  /** Modal description text */
  description?: string
  /** Close button text */
  closeButtonText?: string
  /** Retry button text */
  retryButtonText?: string
}

interface PixelConfig {
  id: string
  d: string
  color: 'red' | 'dark'
  // Scattered position (broken state)
  scattered: { x: number; y: number; rotate: number }
}

// Exact pixel paths from the official logo - scattered positions for error state
const PIXEL_CONFIGS: PixelConfig[] = [
  // Red pixels
  { id: 'red-1', d: 'M11.1907 23.6729C11.1907 23.3802 11.434 23.1428 11.7342 23.1428H14.5968C14.897 23.1428 15.1403 23.3802 15.1403 23.6729V26.4699C15.1403 26.7626 14.897 27 14.5968 27H11.7342C11.434 27 11.1907 26.7626 11.1907 26.4699V23.6729Z', color: 'red', scattered: { x: -8, y: 12, rotate: 45 } },
  { id: 'red-2', d: 'M5.9245 15.9588C5.9245 15.666 6.16786 15.4287 6.46807 15.4287H9.33059C9.63079 15.4287 9.87416 15.666 9.87416 15.9588V18.7558C9.87416 19.0485 9.63079 19.2859 9.33059 19.2859H6.46807C6.16786 19.2859 5.9245 19.0485 5.9245 18.7558V15.9588Z', color: 'red', scattered: { x: -12, y: 8, rotate: -30 } },
  { id: 'red-3', d: 'M7.89929 30.2783C7.89929 29.888 8.22378 29.5715 8.62405 29.5715H12.4407C12.841 29.5715 13.1655 29.888 13.1655 30.2783V34.0076C13.1655 34.398 12.841 34.7144 12.4407 34.7144H8.62405C8.22377 34.7144 7.89929 34.398 7.89929 34.0076V30.2783Z', color: 'red', scattered: { x: -6, y: 6, rotate: 60 } },
  // Dark pixels
  { id: 'dark-1', d: 'M13.1655 18.3534C13.1655 18.1582 13.3278 18 13.5279 18H15.4363C15.6364 18 15.7986 18.1582 15.7986 18.3534V20.218C15.7986 20.4132 15.6364 20.5714 15.4363 20.5714H13.5279C13.3278 20.5714 13.1655 20.4132 13.1655 20.218V18.3534Z', color: 'dark', scattered: { x: -10, y: 14, rotate: -45 } },
  { id: 'dark-2', d: 'M3.94965 12.4794C3.94965 12.333 4.07133 12.2144 4.22143 12.2144H5.65269C5.80279 12.2144 5.92447 12.333 5.92447 12.4794V13.8779C5.92447 14.0243 5.80279 14.1429 5.65269 14.1429H4.22143C4.07133 14.1429 3.94965 14.0243 3.94965 13.8779V12.4794Z', color: 'dark', scattered: { x: -14, y: 10, rotate: 35 } },
  { id: 'dark-3', d: 'M3.94965 27.265C3.94965 27.1187 4.07133 27 4.22143 27H5.65269C5.80279 27 5.92447 27.1187 5.92447 27.265V28.6635C5.92447 28.8099 5.80279 28.9286 5.65269 28.9286H4.22143C4.07133 28.9286 3.94965 28.8099 3.94965 28.6635V27.265Z', color: 'dark', scattered: { x: -8, y: 16, rotate: -60 } },
  { id: 'dark-4', d: 'M6.58276 24.6937C6.58276 24.5474 6.70445 24.4287 6.85455 24.4287H8.28581C8.43591 24.4287 8.55759 24.5474 8.55759 24.6937V26.0922C8.55759 26.2386 8.43591 26.3573 8.28581 26.3573H6.85455C6.70444 26.3573 6.58276 26.2386 6.58276 26.0922V24.6937Z', color: 'dark', scattered: { x: -5, y: 18, rotate: 50 } },
  { id: 'dark-5', d: 'M7.89929 9.06395C7.89929 8.67361 8.22378 8.35718 8.62405 8.35718H12.4407C12.841 8.35718 13.1655 8.67361 13.1655 9.06394V12.7933C13.1655 13.1836 12.841 13.5 12.4407 13.5H8.62405C8.22377 13.5 7.89929 13.1836 7.89929 12.7933V9.06395Z', color: 'dark', scattered: { x: -16, y: 4, rotate: -40 } },
  { id: 'dark-6', d: 'M0.658264 18.3534C0.658264 18.1582 0.820506 18 1.02064 18H2.92899C3.12913 18 3.29137 18.1582 3.29137 18.3534V20.218C3.29137 20.4132 3.12913 20.5714 2.92899 20.5714H1.02064C0.820505 20.5714 0.658264 20.4132 0.658264 20.218V18.3534Z', color: 'dark', scattered: { x: -18, y: 12, rotate: 70 } },
  { id: 'dark-7', d: 'M4.60791 20.9249C4.60791 20.7297 4.77015 20.5715 4.97029 20.5715H6.87864C7.07877 20.5715 7.24101 20.7297 7.24101 20.9249V22.7896C7.24101 22.9847 7.07877 23.143 6.87864 23.143H4.97029C4.77015 23.143 4.60791 22.9847 4.60791 22.7896V20.9249Z', color: 'dark', scattered: { x: -11, y: 20, rotate: -25 } },
]

function AnimatedPixel({ config, isHovered }: { config: PixelConfig; isHovered: boolean }) {
  const fill = config.color === 'red' ? ALIAS.status.error : ALIAS.text.primary

  return (
    <motion.path
      d={config.d}
      fill={fill}
      initial={{
        x: config.scattered.x,
        y: config.scattered.y,
        rotate: config.scattered.rotate
      }}
      animate={
        isHovered
          ? { x: 0, y: 0, rotate: 0 }
          : { x: config.scattered.x, y: config.scattered.y, rotate: config.scattered.rotate }
      }
      transition={{ type: 'spring', stiffness: isHovered ? 200 : 100, damping: isHovered ? 12 : 10 }}
      style={{ transformOrigin: 'center' }}
    />
  )
}

function AnimatedBrokenLogo({ isHovered }: { isHovered: boolean }) {
  return (
    <div
      className="mx-auto mb-6"
      style={{ overflow: 'visible' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: 10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        style={{ overflow: 'visible' }}
      >
        <svg
          width="180"
          height="54"
          viewBox="0 0 45 36"
          fill="none"
          style={{ overflow: 'visible' }}
        >
          {/* Main D shape - exact path from official logo */}
          <motion.path
            d="M29.1689 8.35718C36.5257 8.35718 42.4895 14.2909 42.4895 21.6105C42.4895 28.93 36.5257 34.8637 29.1689 34.8637H15.3565C14.8492 34.8637 14.4379 34.4545 14.4379 33.9497V30.4764C14.4379 29.9716 14.8492 29.5624 15.3565 29.5624H29.1689C33.583 29.5624 37.1613 26.0022 37.1613 21.6105C37.1613 17.2187 33.583 13.6585 29.1689 13.6585H15.3565C14.8492 13.6585 14.4379 13.2493 14.4379 12.7445V9.2712C14.4379 8.7664 14.8492 8.35718 15.3565 8.35718H29.1689Z"
            fill={ALIAS.status.error}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          />
          {/* Animated pixels - scattered when not hovered, reassemble on hover */}
          {PIXEL_CONFIGS.map((config) => (
            <AnimatedPixel key={config.id} config={config} isHovered={isHovered} />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}

export function ContactFormErrorModal({
  open,
  onClose,
  onRetry,
  title = 'Something went wrong',
  description = 'We could not send your message. Please try again or contact us directly.',
  closeButtonText = 'Close',
  retryButtonText = 'Try Again',
}: ContactFormErrorModalProps) {
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const handleRetry = () => {
    onClose()
    onRetry?.()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-cream border-slate-200">
        <DialogHeader className="text-center sm:text-center">
          <AnimatedBrokenLogo isHovered={isButtonHovered} />
          <DialogTitle className="text-2xl font-bold text-dark">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted mt-3 text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6 gap-3 flex-col sm:flex-row">
          <ElectricButtonWrapper>
            <Button
              variant="outline"
              onClick={onClose}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="w-full sm:w-auto"
            >
              {closeButtonText}
            </Button>
          </ElectricButtonWrapper>
          <ElectricButtonWrapper>
            <Button
              variant="contact"
              onClick={handleRetry}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="w-full sm:w-auto px-8"
            >
              {retryButtonText}
            </Button>
          </ElectricButtonWrapper>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
