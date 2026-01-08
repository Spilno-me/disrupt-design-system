/**
 * FolderIcon - Color-coded folder icon for workspace navigation
 *
 * Uses DDS tokens for consistent theming across light/dark modes.
 */

import * as React from 'react'
import { Folder, FolderOpen } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { FolderColor } from './types'
import { FOLDER_COLOR_MAP } from './constants'

// =============================================================================
// TYPES
// =============================================================================

export interface FolderIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Folder color variant */
  color?: FolderColor
  /** Whether folder is expanded/open */
  isOpen?: boolean
  /** Icon size in pixels */
  size?: number
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FolderIcon({
  color = 'default',
  isOpen = false,
  size = 16,
  className,
  ...props
}: FolderIconProps) {
  const Icon = isOpen ? FolderOpen : Folder
  const colorConfig = FOLDER_COLOR_MAP[color]

  return (
    <Icon
      className={cn(colorConfig.icon, className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
      {...props}
    />
  )
}

FolderIcon.displayName = 'FolderIcon'

export default FolderIcon
