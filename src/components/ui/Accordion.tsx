import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { COLORS, ALIAS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export interface AccordionItem {
  /** Unique identifier */
  id?: string
  /** Question or title text */
  question: string
  /** Answer or content text */
  answer: string
}

export interface AccordionProps {
  /** Array of accordion items */
  items: AccordionItem[]
  /** Index of initially open item (null for all closed) */
  defaultOpenIndex?: number | null
  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean
  /** Custom class name */
  className?: string
  /** Border color for separators */
  borderColor?: string
  /** Question text color */
  questionColor?: string
  /** Answer text color */
  answerColor?: string
  /** Answer background color */
  answerBgColor?: string
}

export interface AccordionItemProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  isLast?: boolean
  borderColor?: string
  questionColor?: string
  answerColor?: string
  answerBgColor?: string
}

// =============================================================================
// ACCORDION ITEM COMPONENT
// =============================================================================

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  isLast = false,
  borderColor = COLORS.teal,
  questionColor = COLORS.darkPurple,
  answerColor = COLORS.darkPurple,
  answerBgColor = ALIAS.overlay.tealGlass,
}: AccordionItemProps) {
  return (
    <div className={isLast ? '' : 'border-b border-dashed'} style={{ borderColor }}>
      <button
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className="font-sans font-medium text-sm pr-4"
          style={{ color: questionColor }}
        >
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className="w-5 h-5"
            style={{ color: COLORS.muted }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="rounded-md p-4 mb-4"
              style={{ backgroundColor: answerBgColor }}
            >
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: answerColor }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================================================
// MAIN ACCORDION COMPONENT
// =============================================================================

/**
 * Accordion - An expandable/collapsible content component.
 * Supports single or multiple open items.
 */
export function Accordion({
  items,
  defaultOpenIndex = null,
  allowMultiple = false,
  className,
  borderColor = COLORS.teal,
  questionColor = COLORS.darkPurple,
  answerColor = COLORS.darkPurple,
  answerBgColor = ALIAS.overlay.tealGlass,
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    if (defaultOpenIndex !== null && defaultOpenIndex >= 0) {
      return new Set([defaultOpenIndex])
    }
    return new Set()
  })

  const handleToggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className={cn('', className)}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id || item.question}
          item={item}
          isOpen={openIndices.has(index)}
          onToggle={() => handleToggle(index)}
          isLast={index === items.length - 1}
          borderColor={borderColor}
          questionColor={questionColor}
          answerColor={answerColor}
          answerBgColor={answerBgColor}
        />
      ))}
    </div>
  )
}
