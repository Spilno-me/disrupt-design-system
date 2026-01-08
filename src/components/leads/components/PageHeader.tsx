/**
 * PageHeader - Header section for LeadsPage with title and actions
 */

import { Plus } from 'lucide-react'
import { Button } from '../../ui/button'
import { ExportButton, ExportOptions } from '../ExportButton'

export interface PageHeaderProps {
  title: string
  selectedCount: number
  totalCount: number
  onExport?: (options: ExportOptions) => Promise<void>
  onCreateLead?: () => void
}

export function PageHeader({ title, selectedCount, totalCount, onExport, onCreateLead }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      <div className="flex items-center gap-3">
        {selectedCount > 0 && (
          <span className="text-sm text-muted">
            {selectedCount} lead{selectedCount > 1 ? 's' : ''} selected
          </span>
        )}
        {onExport && (
          <ExportButton
            onExport={onExport}
            selectedCount={selectedCount}
            totalCount={totalCount}
          />
        )}
        {onCreateLead && (
          <Button variant="accent" onClick={onCreateLead}>
            <Plus className="w-4 h-4 mr-2" />
            Create Lead
          </Button>
        )}
      </div>
    </div>
  )
}
