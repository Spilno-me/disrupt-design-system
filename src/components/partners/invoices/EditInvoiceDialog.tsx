import * as React from 'react'
import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Plus, Trash2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import type { Invoice, LineItem } from './types'
import { formatCurrency } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface EditInvoiceDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Invoice to edit (null for create new) */
  invoice: Invoice | null
  /** Callback when form is submitted */
  onSubmit?: (data: EditInvoiceFormData) => void | Promise<void>
  /** Loading state during submission */
  isSubmitting?: boolean
  /** Additional className */
  className?: string
}

export interface EditInvoiceFormData {
  companyName: string
  contactEmail: string
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
  }>
}

// =============================================================================
// EDIT INVOICE DIALOG COMPONENT
// =============================================================================

/**
 * EditInvoiceDialog - Form dialog for editing draft invoices
 *
 * Allows editing company info and line items.
 * Only available for draft invoices.
 */
export function EditInvoiceDialog({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isSubmitting = false,
  className,
}: EditInvoiceDialogProps) {
  // Form state
  const [companyName, setCompanyName] = useState(invoice?.company.name || '')
  const [contactEmail, setContactEmail] = useState(invoice?.company.email || '')
  const [lineItems, setLineItems] = useState<EditInvoiceFormData['lineItems']>(
    invoice?.lineItems.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [
      { id: '1', description: '', quantity: 1, unitPrice: 0 }
    ]
  )

  // Reset form when invoice changes
  React.useEffect(() => {
    if (invoice) {
      setCompanyName(invoice.company.name)
      setContactEmail(invoice.company.email || '')
      setLineItems(
        invoice.lineItems.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      )
    }
  }, [invoice])

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const total = subtotal // Add tax calculation if needed

  // Handle line item changes
  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const addLineItem = () => {
    const newId = String(Date.now())
    setLineItems(items => [...items, { id: newId, description: '', quantity: 1, unitPrice: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return // Keep at least one item
    setLineItems(items => items.filter(item => item.id !== id))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    const data: EditInvoiceFormData = {
      companyName,
      contactEmail,
      lineItems,
    }

    await onSubmit(data)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-3xl max-h-[90vh] overflow-hidden',
            'bg-surface rounded-lg shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-default">
            <DialogPrimitive.Title className="text-xl font-semibold text-primary">
              Edit Draft Invoice
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-80px)]">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-primary">
                    Company Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-primary">
                    Contact Email <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-primary">Line Items</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLineItem}
                    className="text-accent hover:text-accent"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 p-3 rounded-lg border border-default bg-mutedBg"
                    >
                      {/* Description */}
                      <div className="col-span-12 md:col-span-5">
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
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
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
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
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
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
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          className="h-8 w-8 text-error hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex flex-col items-end gap-2 p-4 rounded-lg bg-accentBg border border-accent">
                <div className="flex items-center justify-between w-64">
                  <span className="text-sm text-muted">Subtotal:</span>
                  <span className="text-sm font-medium text-primary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between w-64 pt-2 border-t border-accent">
                  <span className="text-base font-semibold text-primary">Total:</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-default">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isSubmitting || !companyName || !contactEmail}
              >
                {isSubmitting ? 'Updating...' : 'Update Invoice'}
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default EditInvoiceDialog
