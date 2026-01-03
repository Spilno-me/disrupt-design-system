import * as React from 'react'
import { useCallback, useState } from 'react'
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

// =============================================================================
// TYPES
// =============================================================================

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf'

export interface ExportOptions {
  /** Export format */
  format: ExportFormat
  /** Include selected items only (vs all) */
  selectedOnly?: boolean
  /** Include specific fields only */
  fields?: string[]
  /** Date range filter */
  dateRange?: { from: string; to: string }
}

export interface ExportButtonProps {
  /** Callback when export is triggered */
  onExport: (options: ExportOptions) => void | Promise<void>
  /** Number of selected items (0 = export all) */
  selectedCount?: number
  /** Total count of items */
  totalCount?: number
  /** Available export formats */
  formats?: ExportFormat[]
  /** Show loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'default' | 'lg'
  /** Additional className */
  className?: string
}

// =============================================================================
// EXPORT BUTTON COMPONENT
// =============================================================================

/**
 * ExportButton - Dropdown button for exporting lead data
 *
 * Supports multiple export formats (CSV, Excel, JSON, PDF).
 * Shows option to export selected items or all items.
 *
 * @example
 * <ExportButton
 *   onExport={async (options) => {
 *     const data = await exportLeads(options)
 *     downloadFile(data, options.format)
 *   }}
 *   selectedCount={5}
 *   totalCount={100}
 * />
 */
export function ExportButton({
  onExport,
  selectedCount = 0,
  totalCount = 0,
  formats = ['csv', 'xlsx', 'json'],
  loading = false,
  disabled = false,
  variant = 'outline',
  size = 'default',
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const formatConfig: Record<ExportFormat, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    csv: { label: 'CSV', icon: FileText },
    xlsx: { label: 'Excel', icon: FileSpreadsheet },
    json: { label: 'JSON', icon: FileText },
    pdf: { label: 'PDF', icon: FileText },
  }

  const handleExport = useCallback(async (format: ExportFormat, selectedOnly: boolean) => {
    setIsExporting(true)
    try {
      await onExport({ format, selectedOnly })
    } finally {
      setIsExporting(false)
    }
  }, [onExport])

  const isDisabled = disabled || loading || isExporting

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isDisabled}
          className={cn(className)}
        >
          <Download className={cn('w-4 h-4 mr-2', isExporting && 'animate-pulse')} />
          Export
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Export selected (if items selected) */}
        {selectedCount > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-muted">
              Export {selectedCount} selected
            </div>
            {formats.map((format) => {
              const config = formatConfig[format]
              const Icon = config.icon
              return (
                <DropdownMenuItem
                  key={`selected-${format}`}
                  onClick={() => handleExport(format, true)}
                >
                  <Icon className="w-4 h-4 mr-2 text-muted" />
                  {config.label}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Export all */}
        <div className="px-2 py-1.5 text-xs font-medium text-muted">
          Export all {totalCount > 0 ? `(${totalCount})` : ''}
        </div>
        {formats.map((format) => {
          const config = formatConfig[format]
          const Icon = config.icon
          return (
            <DropdownMenuItem
              key={`all-${format}`}
              onClick={() => handleExport(format, false)}
            >
              <Icon className="w-4 h-4 mr-2 text-muted" />
              {config.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportButton
