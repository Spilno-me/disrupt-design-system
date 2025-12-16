"use client"

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

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

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of accordion items */
  items: AccordionItem[]
  /** Index of initially open item (null for all closed) */
  defaultOpenIndex?: number | null
  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean
}

// =============================================================================
// ACCORDION ITEM COMPONENT
// =============================================================================

interface AccordionItemComponentProps {
  item: AccordionItem
  value: string
  isLast?: boolean
}

const AccordionItemComponent = React.forwardRef<
  HTMLDivElement,
  AccordionItemComponentProps
>(({ item, value, isLast = false }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      value={value}
      data-slot="accordion-item"
      className={cn(
        isLast ? '' : 'border-b border-dashed',
        'border-accent'
      )}
    >
      <AccordionPrimitive.Header className="flex" data-slot="accordion-header">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            'flex flex-1 items-center justify-between py-4 text-left',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md',
            'group'
          )}
        >
          <span className="font-sans font-medium text-sm pr-4 text-primary">
            {item.question}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 flex-shrink-0 transition-transform duration-200 text-secondary',
              'group-data-[state=open]:rotate-180'
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        data-slot="accordion-content"
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-accordion-down',
          'data-[state=closed]:animate-accordion-up'
        )}
      >
        <div className="rounded-sm p-4 mb-4 bg-accent/5">
          <p className="font-sans text-sm leading-relaxed text-primary">
            {item.answer}
          </p>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
})
AccordionItemComponent.displayName = "AccordionItemComponent"

// =============================================================================
// MAIN ACCORDION COMPONENT
// =============================================================================

/**
 * Accordion - MOLECULE
 *
 * An expandable/collapsible content component built on Radix UI Accordion primitive.
 * Ideal for FAQs, progressive disclosure, and organizing related content sections.
 *
 * @component
 * @example
 * ```tsx
 * // Basic FAQ with one item open
 * <Accordion
 *   items={[
 *     { question: "What is this?", answer: "An accordion component" },
 *     { question: "How does it work?", answer: "Click to expand/collapse" }
 *   ]}
 *   defaultOpenIndex={0}
 * />
 *
 * // Multiple expansion mode
 * <Accordion
 *   items={items}
 *   allowMultiple
 *   defaultOpenIndex={0}
 * />
 *
 * // All closed by default
 * <Accordion
 *   items={items}
 *   defaultOpenIndex={null}
 * />
 * ```
 *
 * **Features:**
 * - Keyboard navigation (Arrow Up/Down, Home, End, Space/Enter)
 * - ARIA attributes (aria-expanded, aria-controls) handled automatically
 * - Single or multiple expansion modes
 * - Smooth animated open/close transitions
 * - Focus management with visible focus rings
 * - Accessible by default (WCAG AA compliant)
 *
 * **Design System Compliance:**
 * - Spacing: 4px grid (py-4 for trigger, p-4 for content, mb-4 between sections)
 * - Rounded corners: 8px (rounded-sm) for content area
 * - Typography: text-sm for both question and answer
 * - Colors: text-primary for question, text-primary for answer, text-secondary for icon
 *
 * **Testing:**
 * Component auto-generates test IDs:
 * - `data-slot="accordion"` - Root container
 * - `data-slot="accordion-item"` - Each accordion item wrapper
 * - `data-slot="accordion-header"` - Header wrapper element
 * - `data-slot="accordion-trigger"` - Clickable trigger button (test with click/keyboard)
 * - `data-slot="accordion-content"` - Expandable content area
 *
 * Use `data-state` attribute to test expansion state:
 * - `[data-state="open"]` - Item is expanded
 * - `[data-state="closed"]` - Item is collapsed
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/accordion} Radix UI Accordion
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, defaultOpenIndex = null, allowMultiple = false, className, ..._props }, _ref) => {
    // Generate unique values for each item
    const getItemValue = (index: number, item: AccordionItem) =>
      item.id || `accordion-item-${index}`

    // Determine default value based on defaultOpenIndex
    const defaultValue = defaultOpenIndex !== null && defaultOpenIndex >= 0
      ? getItemValue(defaultOpenIndex, items[defaultOpenIndex])
      : undefined

    if (allowMultiple) {
      return (
        <AccordionPrimitive.Root
          type="multiple"
          defaultValue={defaultValue ? [defaultValue] : undefined}
          className={cn('', className)}
          data-slot="accordion"
        >
          {items.map((item, index) => (
            <AccordionItemComponent
              key={getItemValue(index, item)}
              item={item}
              value={getItemValue(index, item)}
              isLast={index === items.length - 1}
            />
          ))}
        </AccordionPrimitive.Root>
      )
    }

    return (
      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue={defaultValue}
        className={cn('', className)}
        data-slot="accordion"
      >
        {items.map((item, index) => (
          <AccordionItemComponent
            key={getItemValue(index, item)}
            item={item}
            value={getItemValue(index, item)}
            isLast={index === items.length - 1}
          />
        ))}
      </AccordionPrimitive.Root>
    )
  }
)
Accordion.displayName = "Accordion"

// =============================================================================
// PRIMITIVE EXPORTS (for custom compositions)
// =============================================================================

export const AccordionRoot = AccordionPrimitive.Root
AccordionRoot.displayName = "AccordionRoot"

export const AccordionItemPrimitive = AccordionPrimitive.Item
AccordionItemPrimitive.displayName = "AccordionItemPrimitive"

export const AccordionTrigger = AccordionPrimitive.Trigger
AccordionTrigger.displayName = "AccordionTrigger"

export const AccordionContent = AccordionPrimitive.Content
AccordionContent.displayName = "AccordionContent"

export const AccordionHeader = AccordionPrimitive.Header
AccordionHeader.displayName = "AccordionHeader"
