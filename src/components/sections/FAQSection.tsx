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
  /** FAQ items to display (optional - uses defaults if not provided) */
  items?: FAQItem[]
  /** Index of initially open item (null for all closed) */
  defaultOpen?: number | null
  /** Show background blob animation */
  showBlob?: boolean
  /** Additional class name for the section */
  className?: string
}

// =============================================================================
// DEFAULT DATA
// =============================================================================

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does Disrupt X handle data security and compliance?',
    answer: 'Disrupt X is designed with robust security features, employing industry-standard encryption protocols and data handling practices. We comply with major regulations such as GDPR and HIPAA, ensuring your data remains secure and compliant.',
  },
  {
    question: 'Can Disrupt X integrate with my existing tools and software?',
    answer: 'Yes! Disrupt X offers seamless integration capabilities with most popular business tools, ERP systems, and databases. Our open API makes it easy to connect with your existing infrastructure.',
  },
  {
    question: 'How long does the onboarding process typically take?',
    answer: 'Most organizations complete their onboarding within 2-4 weeks. Our dedicated support team guides you through each step, from initial setup to full deployment, ensuring a smooth transition.',
  },
  {
    question: 'What kind of support is available?',
    answer: 'We offer multiple tiers of support including 24/7 technical assistance, dedicated account managers for enterprise clients, extensive documentation, and a vibrant community forum.',
  },
  {
    question: 'Is there a trial period available?',
    answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required. This allows you to explore the platform and see how it fits your needs before making a commitment.',
  },
]

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
    <div className={isLast ? '' : 'border-b border-dashed border-muted'}>
      <button
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-sans font-medium text-sm pr-4 text-primary">
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
            <div className="bg-accent/5 rounded-md p-4 mb-4">
              <p className="font-sans text-sm leading-relaxed text-primary">
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
  showBlob: _showBlob = false,
  className,
}: FAQSectionProps) {
  // Use DEFAULT_FAQ_ITEMS if items is undefined or empty
  const faqItems = items && items.length > 0 ? items : DEFAULT_FAQ_ITEMS
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
          <div className="border-t-2 border-dashed border-muted" />
        </div>

        <div className="max-w-[620px] mx-auto">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-primary mb-10">
            {title}
          </h2>

          {/* Accordion */}
          <div className="bg-surface rounded-lg border border-dashed border-muted p-6">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isLast={index === faqItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
