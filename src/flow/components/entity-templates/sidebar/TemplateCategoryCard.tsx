/**
 * TemplateCategoryCard - Category card for entity templates
 *
 * Displays a predefined template category with icon, count, and description.
 * Uses semantic colors matching the category type.
 */

import * as React from 'react'
import {
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  Wrench,
  FileKey,
  GraduationCap,
  Layers,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import type { TemplateCategoryCardProps, TemplateCategoryInfo } from '../types'

// =============================================================================
// ICON MAPPING
// =============================================================================

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  Wrench,
  FileKey,
  GraduationCap,
  Layers,
}

// =============================================================================
// COLOR MAPPING
// =============================================================================

/**
 * Color classes for each category type using DDS palette CSS variables
 * Each category gets a unique, visible color from the design system
 *
 * - iconBg: Background color for the icon container (always visible)
 * - text: Icon and accent text color
 * - selectedBorder: Left border color when selected
 * - selectedBg: Card background tint when selected
 *
 * Uses CSS variables for maintainability: var(--brand-{palette}-{shade})
 */
const COLOR_CLASSES: Record<TemplateCategoryInfo['color'], {
  iconBg: string
  text: string
  selectedBorder: string
  selectedBg: string
}> = {
  // CORAL palette - Red (incidents, errors)
  coral: {
    iconBg: 'bg-[var(--brand-coral-100)] dark:bg-[var(--brand-coral-900)]',
    text: 'text-[var(--brand-coral-500)] dark:text-[var(--brand-coral-300)]',
    selectedBorder: 'border-l-[var(--brand-coral-500)] dark:border-l-[var(--brand-coral-400)]',
    selectedBg: 'bg-[var(--brand-coral-50)] dark:bg-[var(--brand-coral-900)]/30',
  },
  // HARBOR palette - Green (success, inspections)
  harbor: {
    iconBg: 'bg-[var(--brand-harbor-100)] dark:bg-[var(--brand-harbor-900)]',
    text: 'text-[var(--brand-harbor-600)] dark:text-[var(--brand-harbor-300)]',
    selectedBorder: 'border-l-[var(--brand-harbor-600)] dark:border-l-[var(--brand-harbor-400)]',
    selectedBg: 'bg-[var(--brand-harbor-50)] dark:bg-[var(--brand-harbor-900)]/30',
  },
  // WAVE palette - Blue (info, audits)
  wave: {
    iconBg: 'bg-[var(--brand-wave-100)] dark:bg-[var(--brand-wave-900)]',
    text: 'text-[var(--brand-wave-600)] dark:text-[var(--brand-wave-300)]',
    selectedBorder: 'border-l-[var(--brand-wave-600)] dark:border-l-[var(--brand-wave-400)]',
    selectedBg: 'bg-[var(--brand-wave-50)] dark:bg-[var(--brand-wave-900)]/30',
  },
  // SUNRISE palette - Yellow (warnings, corrective actions)
  sunrise: {
    iconBg: 'bg-[var(--brand-sunrise-100)] dark:bg-[var(--brand-sunrise-900)]',
    text: 'text-[var(--brand-sunrise-600)] dark:text-[var(--brand-sunrise-300)]',
    selectedBorder: 'border-l-[var(--brand-sunrise-600)] dark:border-l-[var(--brand-sunrise-400)]',
    selectedBg: 'bg-[var(--brand-sunrise-50)] dark:bg-[var(--brand-sunrise-900)]/30',
  },
  // ORANGE palette - Orange (permits)
  orange: {
    iconBg: 'bg-[var(--brand-orange-100)] dark:bg-[var(--brand-orange-900)]',
    text: 'text-[var(--brand-orange-600)] dark:text-[var(--brand-orange-300)]',
    selectedBorder: 'border-l-[var(--brand-orange-600)] dark:border-l-[var(--brand-orange-400)]',
    selectedBg: 'bg-[var(--brand-orange-50)] dark:bg-[var(--brand-orange-900)]/30',
  },
  // DUSK_REEF palette - Purple (training)
  duskReef: {
    iconBg: 'bg-[var(--brand-dusk-reef-100)] dark:bg-[var(--brand-dusk-reef-700)]',
    text: 'text-[var(--brand-dusk-reef-500)] dark:text-[var(--brand-dusk-reef-200)]',
    selectedBorder: 'border-l-[var(--brand-dusk-reef-500)] dark:border-l-[var(--brand-dusk-reef-300)]',
    selectedBg: 'bg-[var(--brand-dusk-reef-50)] dark:bg-[var(--brand-dusk-reef-700)]/30',
  },
  // DEEP_CURRENT palette - Teal (accent)
  deepCurrent: {
    iconBg: 'bg-[var(--brand-deep-current-100)] dark:bg-[var(--brand-deep-current-900)]',
    text: 'text-[var(--brand-deep-current-500)] dark:text-[var(--brand-deep-current-300)]',
    selectedBorder: 'border-l-[var(--brand-deep-current-500)] dark:border-l-[var(--brand-deep-current-400)]',
    selectedBg: 'bg-[var(--brand-deep-current-50)] dark:bg-[var(--brand-deep-current-900)]/50',
  },
  // SLATE palette - Gray (custom/neutral)
  slate: {
    iconBg: 'bg-[var(--brand-slate-200)] dark:bg-[var(--brand-slate-700)]',
    text: 'text-[var(--brand-slate-600)] dark:text-[var(--brand-slate-400)]',
    selectedBorder: 'border-l-[var(--brand-slate-600)] dark:border-l-[var(--brand-slate-500)]',
    selectedBg: 'bg-[var(--brand-slate-100)] dark:bg-[var(--brand-slate-700)]/30',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TemplateCategoryCard({
  category,
  count,
  isSelected = false,
  onClick,
  isCompact = false,
  disabled = false,
  className,
}: TemplateCategoryCardProps) {
  const Icon = CATEGORY_ICONS[category.icon] || Layers
  const colors = COLOR_CLASSES[category.color]

  // Compact mode - icon only with tooltip
  if (isCompact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            aria-label={`${category.name} (${count})`}
            data-slot="template-category-card"
            className={cn(
              // Base styles - elevated card appearance
              'flex items-center justify-center rounded-lg border p-2 transition-all',
              'bg-surface shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              // Disabled state
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-md',
              // Selected state
              isSelected
                ? cn('border-2 shadow-md', colors.selectedBorder, colors.selectedBg)
                : cn('border-default', !disabled && 'hover:bg-surfaceHover'),
              className
            )}
          >
            <div
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md',
                colors.iconBg
              )}
            >
              <Icon className={cn('size-4', colors.text)} />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span className="font-medium">{category.name}</span>
          <span className="text-xs text-secondary">({count})</span>
        </TooltipContent>
      </Tooltip>
    )
  }

  // Full mode
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      data-slot="template-category-card"
      className={cn(
        // Base styles - elevated card appearance (Depth 3)
        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
        'bg-surface shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        // Disabled state
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md',
        // Selected state - enhanced elevation
        isSelected
          ? cn('border-l-4 border-t-default border-r-default border-b-default shadow-md', colors.selectedBorder, colors.selectedBg)
          : cn('border-default', !disabled && 'hover:bg-surfaceHover'),
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          colors.iconBg
        )}
      >
        <Icon className={cn('size-5', colors.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-primary truncate">{category.name}</h3>
          <span className="text-sm font-medium text-secondary shrink-0">{count}</span>
        </div>
        <p className="text-xs text-secondary truncate">{category.description}</p>
      </div>
    </button>
  )
}

TemplateCategoryCard.displayName = 'TemplateCategoryCard'

export default TemplateCategoryCard
