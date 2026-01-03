import * as React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

// =============================================================================
// TYPES
// =============================================================================

export interface ScoreChange {
  /** Lead ID */
  leadId: string
  /** Lead name for display */
  leadName: string
  /** Previous score */
  oldScore: number
  /** New calculated score */
  newScore: number
  /** Score change factors */
  factors?: Array<{
    name: string
    impact: number
    description?: string
  }>
}

export interface LeadScoreRecalculatorProps {
  /** Whether dialog is open */
  open: boolean
  /** Callback when dialog should close */
  onOpenChange: (open: boolean) => void
  /** Lead IDs to recalculate (empty = single lead mode) */
  leadIds: string[]
  /** Callback to fetch score preview */
  onPreview?: (leadIds: string[]) => Promise<ScoreChange[]>
  /** Callback when recalculation is confirmed */
  onConfirm: (leadIds: string[]) => void | Promise<void>
  /** Pre-computed score changes (if available) */
  previewData?: ScoreChange[]
  /** Single lead mode data */
  singleLead?: {
    id: string
    name: string
    currentScore: number
  }
  /** Additional className */
  className?: string
}

// =============================================================================
// LEAD SCORE RECALCULATOR COMPONENT
// =============================================================================

/**
 * LeadScoreRecalculator - Dialog for recalculating lead scores
 *
 * Shows preview of score changes before applying. Supports both single lead
 * and bulk recalculation modes.
 *
 * @example
 * <LeadScoreRecalculator
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   leadIds={['lead-1', 'lead-2']}
 *   onPreview={async (ids) => api.previewScores(ids)}
 *   onConfirm={async (ids) => api.recalculateScores(ids)}
 * />
 */
export function LeadScoreRecalculator({
  open,
  onOpenChange,
  leadIds,
  onPreview,
  onConfirm,
  previewData,
  singleLead,
  className,
}: LeadScoreRecalculatorProps) {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [scoreChanges, setScoreChanges] = useState<ScoreChange[]>(previewData || [])
  const [error, setError] = useState<string | null>(null)

  const isBulkMode = leadIds.length > 1
  const title = isBulkMode
    ? `Recalculate ${leadIds.length} Lead Scores`
    : singleLead
    ? `Recalculate Score: ${singleLead.name}`
    : 'Recalculate Lead Score'

  // Fetch preview when dialog opens
  useEffect(() => {
    if (open && onPreview && leadIds.length > 0 && !previewData) {
      setLoading(true)
      setError(null)
      onPreview(leadIds)
        .then((changes) => setScoreChanges(changes))
        .catch((err) => setError(err.message || 'Failed to preview score changes'))
        .finally(() => setLoading(false))
    }
  }, [open, leadIds, onPreview, previewData])

  // Use previewData if provided
  useEffect(() => {
    if (previewData) {
      setScoreChanges(previewData)
    }
  }, [previewData])

  const handleConfirm = useCallback(async () => {
    setConfirming(true)
    setError(null)
    try {
      await onConfirm(leadIds)
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to recalculate scores')
    } finally {
      setConfirming(false)
    }
  }, [leadIds, onConfirm, onOpenChange])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setScoreChanges([])
    setError(null)
  }, [onOpenChange])

  // Calculate summary stats
  const summary = React.useMemo(() => {
    if (scoreChanges.length === 0) return null
    
    const increased = scoreChanges.filter((c) => c.newScore > c.oldScore).length
    const decreased = scoreChanges.filter((c) => c.newScore < c.oldScore).length
    const unchanged = scoreChanges.filter((c) => c.newScore === c.oldScore).length
    const avgChange = scoreChanges.reduce((sum, c) => sum + (c.newScore - c.oldScore), 0) / scoreChanges.length

    return { increased, decreased, unchanged, avgChange }
  }, [scoreChanges])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-[550px]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-accent" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {isBulkMode
              ? 'Review the projected score changes before applying.'
              : 'Recalculate the lead score based on current activity and engagement data.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-accent" />
              <span className="ml-2 text-muted">Calculating score changes...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-light rounded-lg text-error">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Summary stats (bulk mode) */}
          {!loading && !error && summary && isBulkMode && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 p-3 bg-success-light rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <p className="text-lg font-semibold text-success">{summary.increased}</p>
                  <p className="text-xs text-success">Increased</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-error-light rounded-lg">
                <TrendingDown className="w-5 h-5 text-error" />
                <div>
                  <p className="text-lg font-semibold text-error">{summary.decreased}</p>
                  <p className="text-xs text-error">Decreased</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted-bg rounded-lg">
                <Minus className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-lg font-semibold text-primary">{summary.unchanged}</p>
                  <p className="text-xs text-muted">Unchanged</p>
                </div>
              </div>
            </div>
          )}

          {/* Score changes list */}
          {!loading && !error && scoreChanges.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scoreChanges.slice(0, 10).map((change) => (
                <ScoreChangeItem key={change.leadId} change={change} />
              ))}
              {scoreChanges.length > 10 && (
                <p className="text-sm text-muted text-center py-2">
                  And {scoreChanges.length - 10} more...
                </p>
              )}
            </div>
          )}

          {/* Single lead mode without preview */}
          {!loading && !error && scoreChanges.length === 0 && singleLead && (
            <div className="flex items-center justify-center gap-4 py-6">
              <div className="text-center">
                <p className="text-sm text-muted mb-1">Current Score</p>
                <p className="text-3xl font-bold text-primary">{singleLead.currentScore}</p>
              </div>
              <RefreshCw className="w-6 h-6 text-muted" />
              <div className="text-center">
                <p className="text-sm text-muted mb-1">New Score</p>
                <p className="text-3xl font-bold text-accent">?</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={confirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading || confirming}>
            {confirming ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Recalculating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

function ScoreChangeItem({ change }: { change: ScoreChange }) {
  const diff = change.newScore - change.oldScore
  const isIncrease = diff > 0
  const isDecrease = diff < 0

  return (
    <div className="flex items-center justify-between p-3 bg-surface border border-default rounded-lg">
      <span className="text-sm font-medium text-primary truncate flex-1 mr-4">
        {change.leadName}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">{change.oldScore}</span>
        <span className="text-muted">→</span>
        <span
          className={cn(
            'text-sm font-semibold',
            isIncrease && 'text-success',
            isDecrease && 'text-error',
            !isIncrease && !isDecrease && 'text-primary'
          )}
        >
          {change.newScore}
        </span>
        {diff !== 0 && (
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              isIncrease && 'bg-success-light text-success',
              isDecrease && 'bg-error-light text-error'
            )}
          >
            {isIncrease ? '+' : ''}{diff}
          </span>
        )}
      </div>
    </div>
  )
}

export default LeadScoreRecalculator
