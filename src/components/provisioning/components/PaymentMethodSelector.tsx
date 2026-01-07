// =============================================================================
// PAYMENT METHOD SELECTOR
// Radio button group for selecting invoice or credit card payment
// =============================================================================

import * as React from 'react'
import { CreditCard } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { AppCard, AppCardContent } from '../../ui/app-card'

// =============================================================================
// TYPES
// =============================================================================

export type PaymentMethod = 'invoice' | 'credit_card'

export interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

// =============================================================================
// SUBCOMPONENT: PaymentOption (internal, not exported)
// =============================================================================

interface PaymentOptionProps {
  selected: boolean
  onSelect: () => void
  title: string
  description: string
}

function PaymentOption({
  selected,
  onSelect,
  title,
  description,
}: PaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 w-full p-4 rounded-lg border-2 text-left transition-all font-sans',
        selected ? 'border-accent bg-accent-bg' : 'border-default hover:border-accent'
      )}
    >
      {/* Radio indicator */}
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
          selected ? 'border-accent' : 'border-default'
        )}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-accent-strong" />}
      </div>
      {/* Label */}
      <div>
        <span className="font-medium text-primary">{title}</span>
        <p className="text-xs text-emphasis">{description}</p>
      </div>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <AppCard className="border-subtle shadow-sm">
      <AppCardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-accent" />
          <h3 className="font-semibold font-sans text-primary">Payment Method</h3>
        </div>

        <div className="space-y-3">
          <PaymentOption
            selected={value === 'invoice'}
            onSelect={() => onChange('invoice')}
            title="Invoice"
            description="Pay via bank transfer within 30 days"
          />
          <PaymentOption
            selected={value === 'credit_card'}
            onSelect={() => onChange('credit_card')}
            title="Credit Card"
            description="Pay securely with credit or debit card"
          />
        </div>
      </AppCardContent>
    </AppCard>
  )
}
