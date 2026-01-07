/**
 * ChatProcessSelector - Package selection for conversational pricing flow
 *
 * Visual: Glass Depth 2 with semantic tier colors
 * - Unselected: neutral glass (white/40 dark:black/40)
 * - Selected: bg-deep-current-700 text-white (AAA contrast 7.02:1)
 *
 * @module provisioning/chat/pricing/ChatProcessSelector
 */

import { Package, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../../../lib/utils'
import type { ChatProcessSelectorProps } from '../types'
import type { ProcessTier } from '../../../partners/types/pricing.types'
import {
  PROCESS_TIER_ORDER,
  PACKAGE_STYLES,
  DEFAULT_PRICING_CONFIG,
} from '../../../partners/PricingCalculator/constants'

/**
 * Process package selector for chat-based pricing flow.
 * Displays 4 tiers with glass styling and AAA-compliant selected state.
 */
export function ChatProcessSelector({
  selectedTier,
  onSelect,
  disabled,
}: ChatProcessSelectorProps) {
  const handleSelect = (tier: ProcessTier) => {
    if (disabled) return
    onSelect(tier)
  }

  return (
    <div className="space-y-3" data-testid="chat-process-selector">
      {PROCESS_TIER_ORDER.map((tier, index) => {
        const pricing = DEFAULT_PRICING_CONFIG.processTiers[tier]
        const style = PACKAGE_STYLES[tier]
        const isSelected = selectedTier === tier

        return (
          <motion.label
            key={tier}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={cn(
              // Base layout
              'flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-all',
              'border-l-4',
              style.accentClass,
              // Glass Depth 2 vs Selected state
              isSelected
                ? 'bg-deep-current-700 text-white border-2 border-deep-current-600 shadow-lg'
                : cn(
                    // Glass Depth 2: bg-white/40 dark:bg-black/40 backdrop-blur-[4px]
                    'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
                    'border-2 border-default',
                    'hover:bg-white/60 dark:hover:bg-black/60 hover:shadow-md'
                  ),
              // Disabled state
              disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            {/* Custom Radio Indicator */}
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                isSelected
                  ? 'border-white bg-white'
                  : 'border-subtle bg-transparent'
              )}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-3 w-3 text-deep-current-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hidden accessible radio input */}
            <input
              type="radio"
              name="chat-process-package"
              value={tier}
              checked={isSelected}
              onChange={() => handleSelect(tier)}
              disabled={disabled}
              className="sr-only"
              aria-label={`${pricing.name} - $${pricing.annualPrice.toLocaleString()} per year`}
            />

            {/* Package Icon */}
            <Package
              className={cn(
                'h-5 w-5 shrink-0',
                isSelected ? 'text-white' : 'text-primary'
              )}
              aria-hidden="true"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'font-medium truncate',
                    isSelected ? 'text-white' : 'text-primary'
                  )}
                >
                  {pricing.name}
                </span>
                <span
                  className={cn(
                    'text-sm font-bold whitespace-nowrap',
                    isSelected ? 'text-white' : 'text-primary'
                  )}
                >
                  ${pricing.annualPrice.toLocaleString()}
                  <span
                    className={cn(
                      'font-normal',
                      isSelected ? 'text-white/80' : 'text-secondary'
                    )}
                  >
                    /yr
                  </span>
                </span>
              </div>
              <p
                className={cn(
                  'mt-0.5 text-xs truncate',
                  isSelected ? 'text-white/80' : 'text-secondary'
                )}
              >
                {style.description}
              </p>
            </div>
          </motion.label>
        )
      })}
    </div>
  )
}
