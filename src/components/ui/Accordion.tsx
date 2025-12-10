"use client"

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
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

// =============================================================================
// ACCORDION ITEM COMPONENT
// =============================================================================

interface AccordionItemComponentProps {
  item: AccordionItem
  value: string
  isLast?: boolean
  borderColor?: string
  questionColor?: string
  answerColor?: string
  answerBgColor?: string
}

function AccordionItemComponent({
  item,
  value,
  isLast = false,
  borderColor = COLORS.teal,
  questionColor = COLORS.dark,
  answerColor = COLORS.darkPurple,
  answerBgColor = ALIAS.overlay.tealGlass,
}: AccordionItemComponentProps) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn(
        isLast ? '' : 'border-b border-dashed'
      )}
      style={{ borderColor }}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between py-4 text-left',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md',
            'group'
          )}
        >
          <span
            className="font-sans font-medium text-sm pr-4"
            style={{ color: questionColor }}
          >
            {item.question}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 flex-shrink-0 transition-transform duration-200',
              'group-data-[state=open]:rotate-180'
            )}
            style={{ color: COLORS.muted }}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-accordion-down',
          'data-[state=closed]:animate-accordion-up'
        )}
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
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

// =============================================================================
// MAIN ACCORDION COMPONENT
// =============================================================================

/**
 * Accordion - An expandable/collapsible content component built on Radix UI.
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - ARIA attributes handled automatically
 * - Single or multiple expansion modes
 * - Animated open/close transitions
 */
export function Accordion({
  items,
  defaultOpenIndex = null,
  allowMultiple = false,
  className,
  borderColor = COLORS.teal,
  questionColor = COLORS.dark,
  answerColor = COLORS.darkPurple,
  answerBgColor = ALIAS.overlay.tealGlass,
}: AccordionProps) {
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
      >
        {items.map((item, index) => (
          <AccordionItemComponent
            key={getItemValue(index, item)}
            item={item}
            value={getItemValue(index, item)}
            isLast={index === items.length - 1}
            borderColor={borderColor}
            questionColor={questionColor}
            answerColor={answerColor}
            answerBgColor={answerBgColor}
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
    >
      {items.map((item, index) => (
        <AccordionItemComponent
          key={getItemValue(index, item)}
          item={item}
          value={getItemValue(index, item)}
          isLast={index === items.length - 1}
          borderColor={borderColor}
          questionColor={questionColor}
          answerColor={answerColor}
          answerBgColor={answerBgColor}
        />
      ))}
    </AccordionPrimitive.Root>
  )
}

// =============================================================================
// PRIMITIVE EXPORTS (for custom compositions)
// =============================================================================

export const AccordionRoot = AccordionPrimitive.Root
export const AccordionItemPrimitive = AccordionPrimitive.Item
export const AccordionTrigger = AccordionPrimitive.Trigger
export const AccordionContent = AccordionPrimitive.Content
export const AccordionHeader = AccordionPrimitive.Header
