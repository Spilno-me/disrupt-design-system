import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import { cn } from '../../../../lib/utils'
import type { LineItem } from '../types'
import { formatCurrency } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface EditableLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceLineItemsCardProps {
  /** Line items to display */
  lineItems: LineItem[]
  /** Whether in edit mode */
  isEditing?: boolean
  /** Editable line items (for edit mode) */
  editableLineItems?: EditableLineItem[]
  /** Handler to update a line item field */
  onUpdateLineItem?: (id: string, field: keyof EditableLineItem, value: string | number) => void
  /** Handler to add a line item */
  onAddLineItem?: () => void
  /** Handler to remove a line item */
  onRemoveLineItem?: (id: string) => void
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Line item type badge */
function LineItemTypeBadge({ type }: { type: LineItem['type'] }) {
  const typeConfig = {
    platform: {
      label: 'Platform',
      className: 'bg-info-light text-info',
    },
    process: {
      label: 'Process',
      className: 'bg-accent-bg text-accent',
    },
    license: {
      label: 'License',
      className: 'bg-success-light text-success',
    },
  }

  const config = typeConfig[type]

  return (
    <span className={cn('inline-flex px-2 py-0.5 text-xs font-medium rounded', config.className)}>
      {config.label}
    </span>
  )
}

/** View mode line item row */
function LineItemRow({ item, isLast }: { item: LineItem; isLast: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-2 px-4 py-3',
        !isLast && 'border-b border-subtle'
      )}
    >
      <div className="col-span-5">
        <div className="font-medium text-primary text-sm mb-1">{item.description}</div>
        <div className="flex items-center gap-2">
          <LineItemTypeBadge type={item.type} />
          {item.metadata?.billingCycle && (
            <span className="text-xs text-muted capitalize">({item.metadata.billingCycle})</span>
          )}
        </div>
      </div>
      <div className="col-span-2 text-center text-sm text-primary self-center">{item.quantity}</div>
      <div className="col-span-2 text-right text-sm text-primary self-center">{formatCurrency(item.unitPrice)}</div>
      <div className="col-span-3 text-right font-semibold text-sm text-primary self-center">
        {formatCurrency(item.total)}
      </div>
    </div>
  )
}

/** Edit mode line item row */
function EditableLineItemRow({
  item,
  onUpdate,
  onRemove,
  canRemove,
}: {
  item: EditableLineItem
  onUpdate: (field: keyof EditableLineItem, value: string | number) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="grid grid-cols-12 gap-2 p-3 rounded-lg border border-default bg-muted-bg">
      {/* Description */}
      <div className="col-span-12 md:col-span-5">
        <Input
          value={item.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Item description"
          className="bg-surface"
        />
      </div>

      {/* Quantity */}
      <div className="col-span-4 md:col-span-2">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdate('quantity', parseInt(e.target.value) || 1)}
          placeholder="Qty"
          className="bg-surface"
        />
      </div>

      {/* Unit Price */}
      <div className="col-span-4 md:col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) => onUpdate('unitPrice', parseFloat(e.target.value) || 0)}
          placeholder="Price"
          className="bg-surface"
        />
      </div>

      {/* Total */}
      <div className="col-span-3 md:col-span-2 flex items-center">
        <span className="text-sm font-semibold text-primary">
          {formatCurrency(item.quantity * item.unitPrice)}
        </span>
      </div>

      {/* Delete Button */}
      <div className="col-span-1 flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="h-8 w-8 text-error hover:text-error"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceLineItemsCard - Displays/edits invoice line items
 */
export function InvoiceLineItemsCard({
  lineItems,
  isEditing = false,
  editableLineItems = [],
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
}: InvoiceLineItemsCardProps) {
  if (isEditing) {
    return (
      <AppCard shadow="sm" role="group" aria-labelledby="line-items-heading">
        <AppCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <AppCardTitle id="line-items-heading" className="text-lg">Line Items</AppCardTitle>
              <AppCardDescription>Products and services on this invoice</AppCardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddLineItem}
              className="text-accent hover:text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
        </AppCardHeader>
        <AppCardContent className="space-y-2">
          {editableLineItems.map((item) => (
            <EditableLineItemRow
              key={item.id}
              item={item}
              onUpdate={(field, value) => onUpdateLineItem?.(item.id, field, value)}
              onRemove={() => onRemoveLineItem?.(item.id)}
              canRemove={editableLineItems.length > 1}
            />
          ))}
        </AppCardContent>
      </AppCard>
    )
  }

  // View mode
  return (
    <AppCard shadow="sm" role="group" aria-labelledby="line-items-heading">
      <AppCardHeader>
        <AppCardTitle id="line-items-heading" className="text-lg">Line Items</AppCardTitle>
        <AppCardDescription>{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</AppCardDescription>
      </AppCardHeader>
      <AppCardContent className="p-0">
        <div className="border border-default rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted-bg border-b border-default text-xs font-semibold text-primary uppercase tracking-wider">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          {/* Table Body */}
          <div className="bg-surface">
            {lineItems.map((item, index) => (
              <LineItemRow
                key={item.id}
                item={item}
                isLast={index === lineItems.length - 1}
              />
            ))}
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default InvoiceLineItemsCard
