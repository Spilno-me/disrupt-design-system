/**
 * FloorPlanMarker - Interactive floor plan with clickable marker
 *
 * Allows workers to mark the precise location of an incident on a floor plan.
 * Supports click to place, drag to reposition, and optional description.
 *
 * @example
 * ```tsx
 * <FloorPlanMarker
 *   imageUrl="/floor-plans/warehouse-a.png"
 *   marker={{ x: 50, y: 30 }}
 *   onMarkerChange={(marker) => setMarker(marker)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import { MapPin, Move, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Input } from '../input'
import type { PrecisionMarker } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface FloorPlanMarkerProps {
  /** URL to floor plan image */
  imageUrl: string
  /** Current marker position (null if not placed) */
  marker: PrecisionMarker | null
  /** Called when marker is placed or moved */
  onMarkerChange: (marker: PrecisionMarker | null) => void
  /** Show description input field */
  showDescription?: boolean
  /** Disable interaction */
  disabled?: boolean
  /** Additional className */
  className?: string
  /** Placeholder for description input */
  descriptionPlaceholder?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FloorPlanMarker({
  imageUrl,
  marker,
  onMarkerChange,
  showDescription = true,
  disabled = false,
  className,
  descriptionPlaceholder = 'Describe the exact spot (optional)',
}: FloorPlanMarkerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Calculate position from mouse/touch event
  const getPositionFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!containerRef.current) return null

      const rect = containerRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY

      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100

      // Clamp to bounds
      return {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      }
    },
    []
  )

  // Handle click to place marker
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isDragging) return

    const position = getPositionFromEvent(e)
    if (position) {
      onMarkerChange({
        ...position,
        description: marker?.description,
      })
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.stopPropagation()
    setIsDragging(true)

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const position = getPositionFromEvent(moveEvent)
      if (position) {
        onMarkerChange({
          ...position,
          description: marker?.description,
        })
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!marker) return
    onMarkerChange({
      ...marker,
      description: e.target.value,
    })
  }

  // Clear marker
  const handleClear = () => {
    onMarkerChange(null)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Floor plan image with marker */}
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-lg border overflow-hidden bg-muted-bg',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-crosshair',
          marker ? 'border-accent' : 'border-default'
        )}
        onClick={handleClick}
      >
        {/* Image */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt="Floor plan"
            className={cn(
              'w-full h-auto min-h-[200px] max-h-[400px] object-contain',
              !imageLoaded && 'invisible'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            draggable={false}
          />
        ) : (
          <div className="flex items-center justify-center h-[200px] text-tertiary">
            <p className="text-sm">Could not load floor plan</p>
          </div>
        )}

        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-sm text-tertiary">Loading floor plan...</div>
          </div>
        )}

        {/* Marker */}
        {marker && imageLoaded && (
          <div
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-full',
              disabled ? 'cursor-not-allowed' : 'cursor-move'
            )}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onMouseDown={!disabled ? handleDragStart : undefined}
            onTouchStart={!disabled ? handleDragStart : undefined}
          >
            {/* Pulse effect - red tones */}
            <div className="absolute -inset-3 bg-error/20 rounded-full animate-ping" />
            {/* Marker icon - red with white center */}
            <div className="relative">
              <MapPin
                className="h-10 w-10 text-error drop-shadow-lg"
                fill="currentColor"
                strokeWidth={1.5}
              />
              {/* White circle in center of pin */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-sm" />
              {/* Drag indicator */}
              {!disabled && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-surface rounded-full border border-default shadow-sm flex items-center justify-center">
                  <Move className="h-3 w-3 text-tertiary" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        {!marker && imageLoaded && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <div className="bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-default">
              <p className="text-sm text-secondary flex items-center gap-2">
                <MapPin className="h-4 w-4 text-error" />
                Tap to mark the exact spot
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description input */}
      {showDescription && marker && (
        <div className="flex gap-2">
          <Input
            value={marker.description || ''}
            onChange={handleDescriptionChange}
            placeholder={descriptionPlaceholder}
            disabled={disabled}
            className="flex-1"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2.5 text-tertiary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
              aria-label="Clear marker"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Position info */}
      {marker && (
        <p className="text-xs text-tertiary">
          Position: {marker.x.toFixed(1)}%, {marker.y.toFixed(1)}%
          {marker.description && ` • ${marker.description}`}
        </p>
      )}
    </div>
  )
}

FloorPlanMarker.displayName = 'FloorPlanMarker'

export default FloorPlanMarker
