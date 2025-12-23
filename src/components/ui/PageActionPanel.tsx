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
  /** Page subtitle/description - hidden on mobile for space */
  subtitle?: string
  /** Action buttons to display on the right */
  actions?: React.ReactNode
  /** Primary action button - always visible, shown on mobile when others are hidden */
  primaryAction?: React.ReactNode
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
 * - Title and subtitle (subtitle hidden on mobile for space)
 * - Action buttons area on the right
 * - Responsive: primaryAction shown on mobile, full actions on desktop
 * - Consistent styling with SearchFilter (gradient, shadow, rounded corners)
 *
 * Mobile UX (Fitts' Law):
 * - Subtitle hidden to maximize space for actions
 * - Only primaryAction shown (most important action)
 * - Full actions array shown on desktop
 *
 * @example
 * <PageActionPanel
 *   icon={<TriangleAlert className="w-5 h-5" />}
 *   title="Incidents"
 *   subtitle="Environmental and safety incident tracking and management"
 *   primaryAction={
 *     <Button variant="destructive" size="sm">
 *       <TriangleAlert className="w-4 h-4" />
 *       Report
 *     </Button>
 *   }
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
  primaryAction,
  iconClassName = 'text-error',
  className,
}: PageActionPanelProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 md:gap-4 p-3 md:p-4 rounded-xl shadow-md',
        'border border-default',
        className
      )}
      style={{
        // Highlight gradient: ~13px solid surface at top to match SearchFilter visual appearance
        background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 13px, var(--color-surface-hover) 100%)',
      }}
    >
      {/* Left: Icon + Title + Subtitle */}
      <div className="flex items-start gap-2 md:gap-3 min-w-0">
        {/* Icon container - smaller on mobile */}
        <div className={cn('flex-shrink-0 mt-0.5', iconClassName)}>
          {icon}
        </div>

        {/* Title and subtitle */}
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold text-primary truncate">
            {title}
          </h1>
          {/* Subtitle hidden on mobile for space (Fitts' Law) */}
          {subtitle && (
            <p className="hidden md:block text-sm text-secondary truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Action buttons - primaryAction on mobile, full actions on desktop */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile: show primaryAction only */}
        {primaryAction && (
          <div className="md:hidden">
            {primaryAction}
          </div>
        )}
        {/* Desktop: show all actions */}
        {actions && (
          <div className="hidden md:flex items-center gap-2">
            {actions}
          </div>
        )}
        {/* Fallback: if no primaryAction but has actions, show actions on mobile too */}
        {!primaryAction && actions && (
          <div className="md:hidden flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageActionPanel
