/**
 * EntityTemplateCard - Card-based template display for mobile
 *
 * Replaces table rows on mobile with touch-friendly cards.
 * Shows NAME as title, CODE as subtitle, VERSION, TYPE badge,
 * and action buttons for View/Edit/Delete.
 *
 * @component MOLECULE
 * @category Mobile
 */

import * as React from 'react'
import { Eye, Pencil, Trash2, Copy, Check, FileCode } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { ActionTile } from '../../../../components/ui/ActionTile'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { EntityTemplate } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface EntityTemplateCardProps {
  template: EntityTemplate
  onView?: (template: EntityTemplate) => void
  onEdit?: (template: EntityTemplate) => void
  onDelete?: (template: EntityTemplate) => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EntityTemplateCard({
  template,
  onView,
  onEdit: _onEdit, // Kept for API consistency, but edit is desktop-only
  onDelete,
  className,
}: EntityTemplateCardProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopyCode = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(template.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [template.code])

  // Always show all 3 actions for consistency with table (disabled states where needed)
  // Edit is disabled on mobile - schema editing requires desktop screen space
  const canDelete = Boolean(onDelete) && !template.isSystem

  // Format date
  const formattedDate = React.useMemo(() => {
    const date = new Date(template.createdAt)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [template.createdAt])

  return (
    <div
      data-slot="entity-template-card"
      data-testid={`template-card-${template.id}`}
      className={cn(
        // Depth 2: Card with shadow per depth-layering-rules
        'rounded-lg border border-default bg-surface shadow-sm p-4 transition-all duration-150',
        'hover:bg-muted-bg/30',
        className
      )}
    >
      {/* Header Row: Icon + Title + Badge */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-accent/10 text-accent">
          <FileCode className="size-5" />
        </div>

        {/* Title + Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-primary leading-snug line-clamp-1">
              {template.name}
            </span>
            <Badge
              variant={template.isSystem ? 'destructive' : 'outline'}
              size="sm"
              className={cn(
                'shrink-0',
                template.isSystem
                  ? 'bg-coral-100 text-coral-700 border-coral-200'
                  : 'bg-muted-bg text-secondary border-default'
              )}
            >
              {template.isSystem ? 'System' : 'Custom'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-3 space-y-2">
        {/* Description */}
        {template.description && (
          <p className="text-sm text-secondary line-clamp-2">
            {template.description}
          </p>
        )}

        {/* Code Row with Copy */}
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-secondary bg-muted-bg px-1.5 py-0.5 rounded truncate max-w-[200px]">
            {template.code}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={handleCopyCode}
          >
            {isCopied ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5 text-tertiary" />
            )}
          </Button>
        </div>

        {/* Meta Row - Version + Date + Business Key */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-tertiary">
          <span className="font-medium">v{template.version}</span>
          <span className="text-border">•</span>
          <span>{formattedDate}</span>
          {template.businessKeyTemplate && (
            <>
              <span className="text-border">•</span>
              <code className="font-mono bg-muted-bg px-1 py-0.5 rounded truncate max-w-[120px]">
                {template.businessKeyTemplate}
              </code>
            </>
          )}
        </div>
      </div>

      {/* Actions Row - Always show all 3 actions like table (with disabled states) */}
      <TooltipProvider>
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-default">
          {/* View - always enabled when callback provided */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ActionTile
                variant="neutral"
                appearance="filled"
                size="xs"
                onClick={() => onView?.(template)}
                disabled={!onView}
                aria-label={`View ${template.name}`}
                data-testid={`template-view-${template.id}`}
              >
                <Eye className="size-4" />
              </ActionTile>
            </TooltipTrigger>
            <TooltipContent>View details</TooltipContent>
          </Tooltip>

          {/* Edit - disabled on mobile, requires desktop */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ActionTile
                variant="info"
                appearance="filled"
                size="xs"
                disabled
                aria-label="Edit on desktop"
                data-testid={`template-edit-${template.id}`}
              >
                <Pencil className="size-4" />
              </ActionTile>
            </TooltipTrigger>
            <TooltipContent>Edit on desktop</TooltipContent>
          </Tooltip>

          {/* Delete - disabled for system templates or no callback */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ActionTile
                variant="destructive"
                appearance="filled"
                size="xs"
                onClick={() => onDelete?.(template)}
                disabled={!canDelete}
                aria-label={
                  template.isSystem
                    ? 'System templates cannot be deleted'
                    : canDelete
                      ? `Delete ${template.name}`
                      : 'Delete unavailable'
                }
                data-testid={`template-delete-${template.id}`}
              >
                <Trash2 className="size-4" />
              </ActionTile>
            </TooltipTrigger>
            <TooltipContent>
              {template.isSystem
                ? 'System templates cannot be deleted'
                : canDelete
                  ? 'Delete template'
                  : 'Delete unavailable'}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

EntityTemplateCard.displayName = 'EntityTemplateCard'

export default EntityTemplateCard
