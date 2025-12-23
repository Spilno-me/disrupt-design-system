/**
 * Breadcrumb - Navigation breadcrumb for incident details
 *
 * Displays a navigation path with clickable segments.
 * Last item is shown as current (non-clickable).
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Incidents', onClick: () => navigate('/incidents') },
 *     { label: 'INC-51634456533', onClick: () => navigate('/incidents/123') },
 *     { label: 'Overview' },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { BreadcrumbProps, BreadcrumbItem } from '../types'

/**
 * Individual breadcrumb item renderer
 */
function BreadcrumbItemComponent({
  item,
  isLast,
}: {
  item: BreadcrumbItem
  isLast: boolean
}) {
  const isClickable = !isLast && (item.onClick || item.href)

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={cn(
          'text-sm font-medium',
          // Responsive touch targets with negative margin to maintain visual spacing
          'py-2 lg:py-1 -my-2 lg:-my-1',
          'px-1 -mx-1',
          'text-secondary hover:text-primary',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
          'rounded-sm',
          // Truncate long labels on mobile
          'max-w-[140px] lg:max-w-none truncate'
        )}
        title={item.label}
      >
        {item.label}
      </button>
    )
  }

  return (
    <span
      className={cn(
        'text-sm font-medium',
        isLast ? 'text-primary' : 'text-secondary',
        // Truncate long labels on mobile
        'max-w-[160px] lg:max-w-none truncate inline-block'
      )}
      title={item.label}
    >
      {item.label}
    </span>
  )
}

/**
 * Breadcrumb - Navigation path display
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items.length) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItemComponent item={item} isLast={isLast} />
            {!isLast && (
              <ChevronRight
                className="size-4 text-tertiary flex-shrink-0"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
