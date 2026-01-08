/**
 * PartnerRow - Displays a single partner row in the network hierarchy
 * @module partners/components/PartnerRow
 */

"use client"

import { motion, AnimatePresence } from "motion/react"
import {
  ChevronDown,
  ChevronRight,
  UserPlus,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react"
import { cn } from "../../../lib/utils"
import { formatCurrency } from "../../../lib/format"
import { ActionTile } from "../../ui/ActionTile"
import { DataTableStatusDot, PARTNER_DOT_STATUS_MAP } from "../../ui/table"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip"
import { PartnerMetricsCard } from "./PartnerMetricsCard"
import { expandedContentVariants } from "../constants"
import { BASE_PADDING_PX, INDENT_PADDING_PX } from "../constants"
import type {
  PartnerRowProps as BasePartnerRowProps,
  PartnerRowWrapperProps as BasePartnerRowWrapperProps,
  NetworkPartner
} from "../types"

interface PartnerRowProps extends BasePartnerRowProps {
  /** Optional test ID for automated testing */
  "data-testid"?: string
}

interface PartnerRowWrapperProps extends BasePartnerRowWrapperProps {
  /** Optional test ID for automated testing */
  "data-testid"?: string
}

/**
 * PartnerRow - Renders a single partner row with expand/collapse capability
 */
export function PartnerRow({
  partner,
  depth = 0,
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onAddSubPartner,
  onDelete,
  "data-testid": testId,
}: PartnerRowProps) {
  const hasSubPartners = partner.subPartners && partner.subPartners.length > 0
  const indentPadding = depth * INDENT_PADDING_PX
  const canExpand = partner.isMasterPartner

  return (
    <div className="group" data-testid={testId}>
      {/* Main row */}
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-3 border-b border-default",
          "transition-colors hover:bg-accent-bg/30",
          depth > 0 && "bg-muted-bg/20"
        )}
        style={{ paddingLeft: `${BASE_PADDING_PX + indentPadding}px` }}
      >
        {/* Expand/collapse button or spacer */}
        <div className="w-6 flex-shrink-0">
          {canExpand ? (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded hover:bg-accent-bg transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Company icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-info-light flex-shrink-0">
          <FileText className="h-4 w-4 text-info" />
        </div>

        {/* Company info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary truncate">
              {partner.companyName}
            </span>
            {partner.isMasterPartner && (
              <span className="text-xs text-primary bg-accent-bg px-1.5 py-0.5 rounded font-medium">
                Master
              </span>
            )}
            {hasSubPartners && (
              <span className="text-xs text-muted">
                ({partner.subPartners?.length} sub-partner{partner.subPartners && partner.subPartners.length > 1 ? "s" : ""})
              </span>
            )}
          </div>
          <div className="text-sm text-muted truncate">
            {partner.contactName} &bull; {partner.contactEmail}
          </div>
        </div>

        {/* Status */}
        <div className="w-12 flex-shrink-0 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DataTableStatusDot
                  status={partner.status}
                  mapping={PARTNER_DOT_STATUS_MAP}
                  showLabel={false}
                  size="md"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              {PARTNER_DOT_STATUS_MAP[partner.status]?.label || partner.status}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Monthly Revenue */}
        <div className="w-36 flex-shrink-0 text-right">
          <span className="text-sm text-primary font-medium">
            {formatCurrency(partner.monthlyRevenue)}
          </span>
        </div>

        {/* Actions - Using core ActionTile for consistent styling */}
        <div className="flex items-center justify-end gap-1 w-28 flex-shrink-0">
          <ActionTile
            variant="info"
            size="xs"
            aria-label="Edit Partner"
            onClick={() => onEdit?.(partner)}
          >
            <Pencil className="h-4 w-4" />
          </ActionTile>
          {partner.isMasterPartner && (
            <ActionTile
              variant="success"
              size="xs"
              aria-label="Add Sub-Partner"
              onClick={() => onAddSubPartner?.(partner)}
            >
              <UserPlus className="h-4 w-4" />
            </ActionTile>
          )}
          <ActionTile
            variant="destructive"
            size="xs"
            aria-label="Delete Partner"
            onClick={() => onDelete?.(partner)}
          >
            <Trash2 className="h-4 w-4" />
          </ActionTile>
        </div>
      </div>
    </div>
  )
}

/**
 * PartnerRowWrapper - Manages expand state and renders partner with children
 */
export function PartnerRowWrapper({
  partner,
  depth = 0,
  onEdit,
  onAddSubPartner,
  onDelete,
  expandedIds,
  onToggleExpand,
}: PartnerRowWrapperProps) {
  const isExpanded = expandedIds.has(partner.id)

  return (
    <>
      <PartnerRow
        partner={partner}
        depth={depth}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(partner.id)}
        onEdit={onEdit}
        onAddSubPartner={onAddSubPartner}
        onDelete={onDelete}
      />

      {/* Expanded content: Metrics card + Sub-partners */}
      <AnimatePresence initial={false}>
        {isExpanded && partner.isMasterPartner && (
          <motion.div
            key={`expanded-${partner.id}`}
            variants={expandedContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <PartnerMetricsCard metrics={partner.metrics} depth={depth} />

            {partner.subPartners?.map((subPartner: NetworkPartner) => (
              <PartnerRowWrapper
                key={subPartner.id}
                partner={subPartner}
                depth={depth + 1}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onAddSubPartner={onAddSubPartner}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
