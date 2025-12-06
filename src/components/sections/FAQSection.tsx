import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSectionProps {
  /** Section title */
  title?: string
  /** FAQ items to display */
  items: FAQItem[]
  /** Index of initially open item (null for all closed) */
  defaultOpen?: number | null
  /** Show background blob animation */
  showBlob?: boolean
  /** Additional class name for the section */
  className?: string
}

// =============================================================================
// ACCORDION ITEM COMPONENT
// =============================================================================

interface AccordionItemProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  isLast?: boolean
}

function AccordionItem({ item, isOpen, onToggle, isLast = false }: AccordionItemProps) {
  return (
    <div className={isLast ? '' : 'border-b border-dashed border-teal'}>
      <button
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-sans font-medium text-sm pr-4 text-dark">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted" />
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
            <div className="bg-teal/5 rounded-md p-4 mb-4">
              <p className="font-sans text-sm leading-relaxed text-dark">
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
// MAIN COMPONENT
// =============================================================================

/**
 * Reusable FAQ Section with animated accordion.
 * Displays a list of questions and expandable answers.
 */
export function FAQSection({
  title = 'FAQs',
  items,
  defaultOpen = 0,
  showBlob = false,
  className,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className={cn('py-8 sm:py-12 lg:py-16 relative', className)}
      data-element="faq-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        {/* Dashed separator */}
        <div className="max-w-[900px] mx-auto mb-10">
          <div className="border-t-2 border-dashed border-teal/40" />
        </div>

        <div className="max-w-[620px] mx-auto">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-dark mb-10">
            {title}
          </h2>

          {/* Accordion */}
          <div className="bg-white rounded-lg border border-dashed border-teal p-6">
            {items.map((item, index) => (
              <AccordionItem
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
