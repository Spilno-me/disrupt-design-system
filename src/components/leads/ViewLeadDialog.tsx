"use client"

import * as React from "react"
import { Building2, Mail, Phone, Calendar, DollarSign, Globe, User } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import { Badge } from "../ui/badge"
import { SeverityIndicator } from "../ui/SeverityIndicator"
import { formatCompactCurrency } from "../../lib/format"
import type { Lead } from "./LeadCard"

// =============================================================================
// TYPES
// =============================================================================

export interface ViewLeadDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Lead to view */
  lead: Lead | null
  /** Callback when edit action is clicked */
  onEdit?: (lead: Lead) => void
  /** Callback when delete action is clicked */
  onDelete?: (lead: Lead) => void
}

// =============================================================================
// HELPERS
// =============================================================================

const getStatusVariant = (status: Lead["status"]) => {
  switch (status) {
    case "new":
      return "info"
    case "in_progress":
      return "warning"
    case "converted":
      return "success"
    case "lost":
      return "destructive"
    default:
      return "secondary"
  }
}

const getStatusLabel = (status: Lead["status"]) => {
  switch (status) {
    case "new":
      return "New"
    case "in_progress":
      return "In Progress"
    case "converted":
      return "Converted"
    case "lost":
      return "Lost"
    default:
      return status
  }
}

const getPriorityLevel = (priority: Lead["priority"]): "high" | "medium" | "low" => {
  return priority
}

const getSourceLabel = (source: Lead["source"]) => {
  switch (source) {
    case "website":
      return "Website"
    case "referral":
      return "Referral"
    case "cold_outreach":
      return "Cold Outreach"
    case "partner":
      return "Partner"
    case "other":
      return "Other"
    default:
      return source
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  testId?: string
}

function DetailRow({ icon, label, value, testId }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3" data-testid={testId}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted-bg shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-sm text-primary">{value}</span>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ViewLeadDialog - Dialog for viewing lead details
 *
 * Displays comprehensive lead information in a centered modal dialog.
 * Includes actions to edit or delete the lead.
 *
 * @example
 * ```tsx
 * <ViewLeadDialog
 *   open={viewDialogOpen}
 *   onOpenChange={setViewDialogOpen}
 *   lead={selectedLead}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function ViewLeadDialog({
  open,
  onOpenChange,
  lead,
  onEdit,
  onDelete,
}: ViewLeadDialogProps) {
  if (!lead) return null

  const handleEdit = () => {
    onOpenChange(false)
    onEdit?.(lead)
  }

  const handleDelete = () => {
    onOpenChange(false)
    onDelete?.(lead)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="leads-view-lead-dialog">
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-xl font-semibold text-primary"
            data-testid="leads-view-lead-dialog-title"
          >
            <User className="h-5 w-5 text-accent" />
            {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Priority Badges */}
          <div className="flex items-center gap-2" data-testid="leads-view-lead-dialog-badges">
            <Badge variant={getStatusVariant(lead.status)}>
              {getStatusLabel(lead.status)}
            </Badge>
            <SeverityIndicator level={getPriorityLevel(lead.priority)} size="sm" />
          </div>

          {/* Lead Details Grid */}
          <div className="grid gap-4">
            <DetailRow
              icon={<Building2 className="h-4 w-4 text-muted" />}
              label="Company"
              value={lead.company}
              testId="leads-view-lead-dialog-company"
            />

            <DetailRow
              icon={<Mail className="h-4 w-4 text-muted" />}
              label="Email"
              value={
                <a
                  href={`mailto:${lead.email}`}
                  className="text-accent hover:underline"
                >
                  {lead.email}
                </a>
              }
              testId="leads-view-lead-dialog-email"
            />

            {lead.phone && (
              <DetailRow
                icon={<Phone className="h-4 w-4 text-muted" />}
                label="Phone"
                value={lead.phone}
                testId="leads-view-lead-dialog-phone"
              />
            )}

            <DetailRow
              icon={<Globe className="h-4 w-4 text-muted" />}
              label="Source"
              value={getSourceLabel(lead.source)}
              testId="leads-view-lead-dialog-source"
            />

            {lead.value !== undefined && lead.value > 0 && (
              <DetailRow
                icon={<DollarSign className="h-4 w-4 text-muted" />}
                label="Deal Value"
                value={formatCompactCurrency(lead.value)}
                testId="leads-view-lead-dialog-value"
              />
            )}

            <DetailRow
              icon={<Calendar className="h-4 w-4 text-muted" />}
              label="Created"
              value={lead.createdAt}
              testId="leads-view-lead-dialog-created"
            />

            {lead.updatedAt && (
              <DetailRow
                icon={<Calendar className="h-4 w-4 text-muted" />}
                label="Last Updated"
                value={lead.updatedAt}
                testId="leads-view-lead-dialog-updated"
              />
            )}
          </div>

          {/* Description/Notes */}
          {lead.description && (
            <div className="pt-2 border-t border-default">
              <span className="text-xs text-muted block mb-1">Notes</span>
              <p className="text-sm text-primary whitespace-pre-wrap">
                {lead.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <DialogFooter className="flex gap-2 sm:justify-between">
          {onDelete && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-error hover:text-error hover:bg-error/10"
              data-testid="leads-view-lead-dialog-delete"
            >
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="leads-view-lead-dialog-close"
            >
              Close
            </Button>
            {onEdit && (
              <Button
                onClick={handleEdit}
                data-testid="leads-view-lead-dialog-edit"
              >
                Edit Lead
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewLeadDialog
