"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { FileText, ArrowLeft, Save, Pencil, Download, X } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { Button } from "../../../ui/button"
import { PageActionPanel } from "../../../ui/PageActionPanel"
import { GLASS_CARD_CLASSES } from "../../constants"
import type { Invoice, LineItem, PaymentTerms } from "../types"
import { formatCurrency } from "../types"

// Card components
import {
  InvoiceBillToCard,
  InvoiceDetailsCard,
  InvoiceMetadataCard,
  InvoiceTotalsCard,
  InvoiceLineItemsCard,
  InvoiceNotesCard,
  type EditableLineItem,
} from "../components"

// =============================================================================
// TYPES
// =============================================================================

export type InvoicePageMode = "view" | "edit"

export interface InvoiceFormData {
  company: {
    name: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  invoiceDate: string
  dueDate: string
  paymentTerms: PaymentTerms
  description?: string
  notes?: string
  lineItems: EditableLineItem[]
}

export interface InvoiceDetailPageProps {
  /** Invoice to display/edit */
  invoice: Invoice | null
  /** Initial mode */
  mode?: InvoicePageMode
  /** Callback when form is submitted */
  onSubmit: (data: InvoiceFormData) => void | Promise<void>
  /** Callback to navigate back */
  onBack: () => void
  /** Callback when mode changes */
  onModeChange?: (mode: InvoicePageMode) => void
  /** Callback when download PDF is clicked */
  onDownloadPDF?: (invoice: Invoice) => void
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceDetailPage - Full-page view/edit for invoices
 *
 * Replaces InvoicePreviewSheet (view) and EditInvoiceDialog (edit).
 * Uses mode toggle for seamless view/edit switching.
 *
 * Only draft invoices can be edited.
 *
 * @example
 * ```tsx
 * <InvoiceDetailPage
 *   invoice={selectedInvoice}
 *   mode="view"
 *   onSubmit={handleSubmit}
 *   onBack={() => setPageMode('list')}
 * />
 * ```
 */
export function InvoiceDetailPage({
  invoice,
  mode: initialMode = "view",
  onSubmit,
  onBack,
  onModeChange,
  onDownloadPDF,
  isSubmitting = false,
}: InvoiceDetailPageProps) {
  const [mode, setMode] = useState<InvoicePageMode>(initialMode)
  const [lineItems, setLineItems] = useState<EditableLineItem[]>([])

  const isEditing = mode === "edit"
  const canEdit = invoice?.status === "draft"

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      company: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      invoiceDate: "",
      dueDate: "",
      paymentTerms: "net_30",
      description: "",
      notes: "",
      lineItems: [],
    },
  })

  // Initialize form and line items when invoice changes
  useEffect(() => {
    if (invoice) {
      reset({
        company: {
          name: invoice.company.name,
          email: invoice.company.email || "",
          phone: invoice.company.phone || "",
          address: invoice.company.address || "",
          city: invoice.company.city || "",
          state: invoice.company.state || "",
          zip: invoice.company.zip || "",
          country: invoice.company.country || "",
        },
        invoiceDate: invoice.invoiceDate.split("T")[0],
        dueDate: invoice.dueDate.split("T")[0],
        paymentTerms: invoice.paymentTerms,
        description: invoice.description || "",
        notes: invoice.notes || "",
        lineItems: [],
      })

      // Initialize editable line items
      setLineItems(
        invoice.lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      )
    }
  }, [invoice, reset])

  // Sync mode with parent if controlled
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: InvoicePageMode) => {
      setMode(newMode)
      onModeChange?.(newMode)
    },
    [onModeChange]
  )

  // Line item handlers
  const handleUpdateLineItem = useCallback(
    (id: string, field: keyof EditableLineItem, value: string | number) => {
      setLineItems((items) =>
        items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      )
    },
    []
  )

  const handleAddLineItem = useCallback(() => {
    const newId = String(Date.now())
    setLineItems((items) => [
      ...items,
      { id: newId, description: "", quantity: 1, unitPrice: 0 },
    ])
  }, [])

  const handleRemoveLineItem = useCallback((id: string) => {
    setLineItems((items) => {
      if (items.length === 1) return items // Keep at least one
      return items.filter((item) => item.id !== id)
    })
  }, [])

  // Calculate totals from editable line items
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const total = subtotal // Add tax calculation if needed

  // Form submission
  const handleFormSubmit = async (data: InvoiceFormData) => {
    await onSubmit({ ...data, lineItems })
  }

  // Cancel edit - reset to view mode
  const handleCancelEdit = useCallback(() => {
    // Reset line items to original
    if (invoice) {
      setLineItems(
        invoice.lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      )
      reset({
        company: {
          name: invoice.company.name,
          email: invoice.company.email || "",
          phone: invoice.company.phone || "",
          address: invoice.company.address || "",
          city: invoice.company.city || "",
          state: invoice.company.state || "",
          zip: invoice.company.zip || "",
          country: invoice.company.country || "",
        },
        invoiceDate: invoice.invoiceDate.split("T")[0],
        dueDate: invoice.dueDate.split("T")[0],
        paymentTerms: invoice.paymentTerms,
        description: invoice.description || "",
        notes: invoice.notes || "",
        lineItems: [],
      })
    }
    handleModeChange("view")
  }, [invoice, reset, handleModeChange])

  if (!invoice) {
    return (
      <div className="p-6 text-center text-muted">
        <p>No invoice selected</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Invoices
        </Button>
      </div>
    )
  }

  const pageTitle = isEditing ? "Edit Invoice" : `Invoice ${invoice.invoiceNumber}`
  const pageDescription = isEditing
    ? `Editing draft invoice for ${invoice.company.name}`
    : invoice.company.name

  return (
    <div className="p-6 space-y-6" data-testid="invoice-detail-page">
      {/* Page Header with Actions */}
      <PageActionPanel
        icon={<FileText className="w-5 h-5" />}
        title={pageTitle}
        subtitle={pageDescription}
        iconClassName="text-accent"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              data-testid="invoice-detail-back-btn"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                data-testid="invoice-detail-cancel-btn"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            ) : (
              <>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModeChange("edit")}
                    data-testid="invoice-detail-edit-btn"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onDownloadPDF && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadPDF(invoice)}
                    data-testid="invoice-detail-download-btn"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                )}
              </>
            )}
          </div>
        }
        primaryAction={
          isEditing ? (
            <Button
              type="submit"
              form="invoice-form"
              variant="accent"
              size="sm"
              disabled={isSubmitting}
              data-testid="invoice-detail-submit-btn"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          ) : undefined
        }
      />

      <form
        id="invoice-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
        data-testid="invoice-detail-form"
      >
        {/* Glass wrapper for all form sections */}
        <section className={cn("rounded-xl", GLASS_CARD_CLASSES)}>
          <div className="p-4 md:p-6 space-y-6">
            {/* Row 1: Bill To + Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvoiceBillToCard
                company={invoice.company}
                isEditing={isEditing}
                register={register}
                errors={errors}
              />
              <InvoiceDetailsCard
                invoiceNumber={invoice.invoiceNumber}
                status={invoice.status}
                invoiceDate={invoice.invoiceDate}
                dueDate={invoice.dueDate}
                paymentTerms={invoice.paymentTerms}
                isEditing={isEditing}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </div>

            {/* Row 2: Metadata + Totals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvoiceMetadataCard metadata={invoice.metadata} />
              <InvoiceTotalsCard
                subtotal={isEditing ? subtotal : invoice.subtotal}
                tax={invoice.tax}
                total={isEditing ? total : invoice.total}
                paymentTerms={invoice.paymentTerms}
              />
            </div>

            {/* Row 3: Line Items (full width) */}
            <InvoiceLineItemsCard
              lineItems={invoice.lineItems}
              isEditing={isEditing}
              editableLineItems={lineItems}
              onUpdateLineItem={handleUpdateLineItem}
              onAddLineItem={handleAddLineItem}
              onRemoveLineItem={handleRemoveLineItem}
            />

            {/* Row 4: Notes (full width, optional) */}
            <InvoiceNotesCard
              notes={invoice.notes}
              description={invoice.description}
              isEditing={isEditing}
              register={register}
            />
          </div>
        </section>
      </form>
    </div>
  )
}

export default InvoiceDetailPage
