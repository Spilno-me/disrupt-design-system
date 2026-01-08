/**
 * FolderColorPicker - Color swatch selector for folders
 *
 * Displays color options in a grid layout.
 * Uses DDS tokens for consistent theming.
 */

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { FolderColor } from './types'
import { FOLDER_COLORS } from './types'
import { FOLDER_COLOR_MAP } from './constants'

// =============================================================================
// TYPES
// =============================================================================

export interface FolderColorPickerProps {
  /** Currently selected color */
  currentColor: FolderColor
  /** Called when color is selected */
  onColorChange: (color: FolderColor) => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// COLOR DISPLAY MAPPING
// =============================================================================

const COLOR_DISPLAY: Record<FolderColor, { label: string; swatch: string }> = {
  default: { label: 'Default', swatch: 'bg-muted-bg' },
  blue: { label: 'Blue', swatch: 'bg-info' },
  green: { label: 'Green', swatch: 'bg-success' },
  amber: { label: 'Amber', swatch: 'bg-warning' },
  red: { label: 'Red', swatch: 'bg-error' },
  purple: { label: 'Purple', swatch: 'bg-dark-purple' },
  cyan: { label: 'Cyan', swatch: 'bg-accent' },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FolderColorPicker({
  currentColor,
  onColorChange,
  className,
}: FolderColorPickerProps) {
  return (
    <div
      className={cn('grid grid-cols-4 gap-2', className)}
      role="radiogroup"
      aria-label="Folder color"
      data-testid="workspace-color-picker"
    >
      {FOLDER_COLORS.map((color) => {
        const isSelected = color === currentColor
        const display = COLOR_DISPLAY[color]

        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={display.label}
            className={cn(
              'relative size-7 rounded-full',
              'transition-transform hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              display.swatch
            )}
            onClick={() => onColorChange(color)}
            data-testid={`workspace-color-${color}`}
          >
            {isSelected && (
              <Check
                className={cn(
                  'absolute inset-0 m-auto size-4',
                  color === 'default' ? 'text-primary' : 'text-inverse'
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

FolderColorPicker.displayName = 'FolderColorPicker'

export default FolderColorPicker
