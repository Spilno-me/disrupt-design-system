import * as React from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface PageActionPanelProps {
  /** Page icon - typically from lucide-react */
  icon: React.ReactNode
  /** Page title */
  title: string
  /** Page subtitle/description */
  subtitle?: string
  /** Action buttons to display on the right */
  actions?: React.ReactNode
  /** Icon color class (default: text-warning) */
  iconClassName?: string
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * PageActionPanel - A header panel that displays page info and actions.
 *
 * Features:
 * - Page icon (from navigation)
 * - Title and subtitle
 * - Action buttons area on the right
 * - Consistent styling with SearchFilter (gradient, shadow, rounded corners)
 *
 * @example
 * <PageActionPanel
 *   icon={<TriangleAlert className="w-5 h-5" />}
 *   title="Incidents"
 *   subtitle="Environmental and safety incident tracking and management"
 *   actions={
 *     <>
 *       <Button variant="outline" size="sm">
 *         <Download className="w-4 h-4" />
 *         Export
 *       </Button>
 *       <Button variant="destructive" size="sm">
 *         <TriangleAlert className="w-4 h-4" />
 *         Report Incident
 *       </Button>
 *     </>
 *   }
 * />
 */
export function PageActionPanel({
  icon,
  title,
  subtitle,
  actions,
  iconClassName = 'text-error',
  className,
}: PageActionPanelProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-xl shadow-md',
        'border border-default',
        className
      )}
      style={{
        // Highlight gradient: ~13px solid surface at top to match SearchFilter visual appearance
        background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 13px, var(--color-surface-hover) 100%)',
      }}
    >
      {/* Left: Icon + Title + Subtitle */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Icon container - aligned with title */}
        <div className={cn('flex-shrink-0 mt-0.5', iconClassName)}>
          {icon}
        </div>

        {/* Title and subtitle */}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-primary truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-secondary truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Action buttons */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageActionPanel
