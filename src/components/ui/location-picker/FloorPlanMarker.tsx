/**
 * FloorPlanMarker - Interactive floor plan with clickable marker
 *
 * Allows workers to mark the precise location of an incident on a floor plan.
 * Supports:
 * - Click to place marker
 * - Drag to reposition
 * - Pinch-to-zoom and pan for precision
 * - Optional description input
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
import { useState, useRef, useCallback, useEffect } from 'react'
import { MapPin, Move, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Input } from '../input'
import { Button } from '../button'
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
  /** Enable zoom and pan (default: true) */
  enableZoom?: boolean
  /** Minimum zoom level */
  minZoom?: number
  /** Maximum zoom level */
  maxZoom?: number
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
  enableZoom = true,
  minZoom = 1,
  maxZoom = 4,
}: FloorPlanMarkerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Zoom and pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  // Reset zoom/pan when image changes
  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setImageLoaded(false)
    setImageError(false)
  }, [imageUrl])

  // Calculate position from mouse/touch event (accounting for zoom/pan)
  const getPositionFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!containerRef.current || !imageRef.current) return null

      const rect = containerRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY

      // Adjust for pan and zoom
      const relX = (clientX - rect.left - pan.x) / zoom
      const relY = (clientY - rect.top - pan.y) / zoom

      // Convert to percentage of original image size
      const imgWidth = rect.width / zoom
      const imgHeight = rect.height / zoom

      const x = (relX / imgWidth) * 100
      const y = (relY / imgHeight) * 100

      // Clamp to bounds
      return {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      }
    },
    [zoom, pan]
  )

  // Handle click to place marker
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isDragging || isPanning) return

    const position = getPositionFromEvent(e)
    if (position) {
      onMarkerChange({
        ...position,
        description: marker?.description,
      })
    }
  }

  // Handle marker drag start
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

  // Handle pan start
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 1 || disabled) return
    e.preventDefault()

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    panStartRef.current = {
      x: clientX,
      y: clientY,
      panX: pan.x,
      panY: pan.y,
    }
    setIsPanning(true)

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY

      const deltaX = moveX - panStartRef.current.x
      const deltaY = moveY - panStartRef.current.y

      setPan({
        x: panStartRef.current.panX + deltaX,
        y: panStartRef.current.panY + deltaY,
      })
    }

    const handleEnd = () => {
      setIsPanning(false)
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

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enableZoom || disabled) return
      e.preventDefault()

      const delta = e.deltaY > 0 ? -0.2 : 0.2
      setZoom((prev) => Math.max(minZoom, Math.min(maxZoom, prev + delta)))
    },
    [enableZoom, disabled, minZoom, maxZoom]
  )

  // Attach wheel listener
  useEffect(() => {
    const container = containerRef.current
    if (!container || !enableZoom) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel, enableZoom])

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(maxZoom, prev + 0.5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(minZoom, prev - 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
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
      <div className="relative rounded-lg border overflow-hidden bg-muted-bg">
        {/* Zoom controls */}
        {enableZoom && imageLoaded && !disabled && (
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-surface/90 backdrop-blur-sm shadow-sm"
              onClick={handleZoomIn}
              disabled={zoom >= maxZoom}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom in</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-surface/90 backdrop-blur-sm shadow-sm"
              onClick={handleZoomOut}
              disabled={zoom <= minZoom}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom out</span>
            </Button>
            {zoom > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-surface/90 backdrop-blur-sm shadow-sm"
                onClick={handleResetZoom}
              >
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Reset zoom</span>
              </Button>
            )}
          </div>
        )}

        {/* Zoom level indicator */}
        {enableZoom && zoom > 1 && imageLoaded && (
          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-surface/90 backdrop-blur-sm rounded text-xs font-medium text-primary shadow-sm">
            {Math.round(zoom * 100)}%
          </div>
        )}

        {/* Image container */}
        <div
          ref={containerRef}
          className={cn(
            'relative',
            disabled ? 'cursor-not-allowed' : zoom > 1 ? 'cursor-grab' : 'cursor-crosshair',
            isPanning && 'cursor-grabbing',
            marker ? 'border-accent' : 'border-default'
          )}
          onClick={handleClick}
          onMouseDown={zoom > 1 ? handlePanStart : undefined}
          onTouchStart={zoom > 1 ? handlePanStart : undefined}
        >
          {/* Image */}
          {!imageError ? (
            <div
              className="overflow-hidden"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'top left',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <img
                ref={imageRef}
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
            </div>
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
                'absolute transform -translate-x-1/2 -translate-y-full pointer-events-auto',
                disabled ? 'cursor-not-allowed' : 'cursor-move'
              )}
              style={{
                left: `calc(${marker.x}% * ${zoom} + ${pan.x}px)`,
                top: `calc(${marker.y}% * ${zoom} + ${pan.y}px)`,
              }}
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
              <div className="bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-default">
                <p className="text-sm text-secondary flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-error" />
                  Tap to mark the exact spot
                </p>
              </div>
            </div>
          )}

          {/* Zoom hint */}
          {enableZoom && imageLoaded && !disabled && zoom === 1 && (
            <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-tertiary">
              Scroll to zoom • Drag to pan when zoomed
            </div>
          )}
        </div>
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
