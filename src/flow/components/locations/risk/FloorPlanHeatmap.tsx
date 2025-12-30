/**
 * FloorPlanHeatmap - Floor plan with incident marker overlay
 *
 * Displays a floor plan image with:
 * - Incident markers at their precision locations
 * - Optional heatmap density overlay
 * - Zoom/pan controls
 * - Click-to-view incident details
 */

import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import {
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Eye,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { Badge } from '../../../../components/ui/badge'
import type { FloorPlanHeatmapProps, LocationIncident, RiskSeverity } from './types'
import { MultiFloorSelector } from './MultiFloorSelector'

// =============================================================================
// CONSTANTS
// =============================================================================

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

const SEVERITY_MARKER_COLORS: Record<RiskSeverity, { bg: string; border: string; pulse: boolean }> = {
  critical: { bg: 'bg-error', border: 'border-error-dark', pulse: true },
  high: { bg: 'bg-warning', border: 'border-warning-dark', pulse: false },
  medium: { bg: 'bg-aging', border: 'border-aging', pulse: false },
  low: { bg: 'bg-success', border: 'border-success-dark', pulse: false },
  none: { bg: 'bg-muted-bg', border: 'border-default', pulse: false },
}

// =============================================================================
// INCIDENT MARKER
// =============================================================================

interface IncidentMarkerProps {
  incident: LocationIncident
  onClick?: (incident: LocationIncident) => void
}

function IncidentMarker({ incident, onClick }: IncidentMarkerProps) {
  const { precisionMarker, severity, title, incidentId } = incident
  if (!precisionMarker) return null

  const colors = SEVERITY_MARKER_COLORS[severity]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onClick?.(incident)}
          className={cn(
            'absolute -translate-x-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center',
            'size-6 rounded-full border-2 shadow-lg',
            'cursor-pointer transition-transform hover:scale-125',
            colors.bg,
            colors.border,
            colors.pulse && 'animate-pulse'
          )}
          style={{
            left: `${precisionMarker.x}%`,
            top: `${precisionMarker.y}%`,
          }}
        >
          <AlertTriangle className="size-3 text-white" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64">
        <div className="space-y-1">
          <p className="text-xs text-tertiary">{incidentId}</p>
          <p className="text-sm font-medium">{title}</p>
          <Badge
            variant={severity === 'critical' ? 'destructive' : 'secondary'}
            size="sm"
            className="capitalize"
          >
            {severity}
          </Badge>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// =============================================================================
// HEATMAP OVERLAY
// =============================================================================

interface HeatmapOverlayProps {
  incidents: LocationIncident[]
  width: number
  height: number
}

function HeatmapOverlay({ incidents, width: _width, height: _height }: HeatmapOverlayProps) {
  // Generate SVG radial gradients for each incident cluster
  const markersWithCoords = incidents.filter((i) => i.precisionMarker)
  if (markersWithCoords.length === 0) return null

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-5"
      viewBox={`0 0 100 100`}
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="heatGradient">
          <stop offset="0%" stopColor="var(--color-error)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="var(--color-warning)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      {markersWithCoords.map((incident, i) => (
        <circle
          key={incident.id || i}
          cx={incident.precisionMarker!.x}
          cy={incident.precisionMarker!.y}
          r="8"
          fill="url(#heatGradient)"
        />
      ))}
    </svg>
  )
}

// =============================================================================
// ZOOM CONTROLS
// =============================================================================

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onFullScreen?: () => void
}

function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset, onFullScreen }: ZoomControlsProps) {
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 p-1 rounded-lg bg-surface/90 backdrop-blur-sm border border-default shadow-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onZoomIn}
            disabled={zoom >= MAX_ZOOM}
          >
            <ZoomIn className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom in</TooltipContent>
      </Tooltip>

      <div className="text-xs text-tertiary text-center py-0.5 font-mono">
        {Math.round(zoom * 100)}%
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onZoomOut}
            disabled={zoom <= MIN_ZOOM}
          >
            <ZoomOut className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Zoom out</TooltipContent>
      </Tooltip>

      <div className="h-px bg-default my-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" onClick={onReset}>
            <RotateCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Reset view</TooltipContent>
      </Tooltip>

      {onFullScreen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" onClick={onFullScreen}>
              <Maximize2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Full screen</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

// =============================================================================
// LEGEND
// =============================================================================

function Legend({ showHeatmap }: { showHeatmap: boolean }) {
  return (
    <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2 p-2 rounded-lg bg-surface/90 backdrop-blur-sm border border-default">
      {Object.entries(SEVERITY_MARKER_COLORS)
        .filter(([key]) => key !== 'none')
        .map(([severity, colors]) => (
          <div key={severity} className="flex items-center gap-1.5">
            <div
              className={cn(
                'size-3 rounded-full border',
                colors.bg,
                colors.border
              )}
            />
            <span className="text-xs text-secondary capitalize">{severity}</span>
          </div>
        ))}
      {showHeatmap && (
        <>
          <div className="w-px h-4 bg-default" />
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-gradient-radial from-error/60 to-transparent" />
            <span className="text-xs text-secondary">Density</span>
          </div>
        </>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FloorPlanHeatmap({
  imageUrl,
  incidents,
  floorPlans,
  selectedFloorId,
  onFloorChange,
  onIncidentClick,
  showHeatmap = false,
  enableZoom = true,
  className,
}: FloorPlanHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 })

  // Filter incidents for selected floor
  const floorIncidents = incidents.filter((inc) => {
    if (!selectedFloorId || !inc.precisionMarker?.floorPlanId) return true
    return inc.precisionMarker.floorPlanId === selectedFloorId
  })

  // Get actual image URL (could be from floorPlans array or direct prop)
  const displayImageUrl = floorPlans?.find(
    (fp) => fp.imageUrl === selectedFloorId || fp.name === selectedFloorId
  )?.imageUrl || imageUrl

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableZoom || zoom <= 1) return
    setIsPanning(true)
    setLastPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - lastPan.x,
      y: e.clientY - lastPan.y,
    })
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Image load handler
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImgSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enableZoom) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)))
    },
    [enableZoom]
  )

  if (!displayImageUrl) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-default bg-muted-bg/50',
          className
        )}
      >
        <Eye className="size-8 text-tertiary mb-2" />
        <p className="text-sm text-tertiary">No floor plan available</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Multi-floor selector (if multiple floors) */}
      {floorPlans && floorPlans.length > 1 && onFloorChange && (
        <div className="absolute top-3 left-3 z-20">
          <div className="p-2 rounded-lg bg-surface/90 backdrop-blur-sm border border-default">
            <MultiFloorSelector
              floorPlans={floorPlans}
              selectedId={selectedFloorId}
              onSelect={onFloorChange}
            />
          </div>
        </div>
      )}

      {/* Zoom controls */}
      {enableZoom && (
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />
      )}

      {/* Floor plan container */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-lg border border-default bg-muted-bg',
          isPanning ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Image with markers */}
        <div
          className="relative transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Floor plan image */}
          <img
            src={displayImageUrl}
            alt="Floor plan"
            className="w-full h-auto max-h-[500px] object-contain"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Heatmap overlay */}
          {showHeatmap && (
            <HeatmapOverlay
              incidents={floorIncidents}
              width={imgSize.width}
              height={imgSize.height}
            />
          )}

          {/* Incident markers */}
          {floorIncidents.map((incident) => (
            <IncidentMarker
              key={incident.id}
              incident={incident}
              onClick={onIncidentClick}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <Legend showHeatmap={showHeatmap} />

      {/* Incident count badge */}
      {floorIncidents.length > 0 && (
        <div className="absolute top-3 right-16 z-20">
          <Badge variant="secondary" className="bg-surface/90 backdrop-blur-sm">
            <AlertTriangle className="size-3 mr-1" />
            {floorIncidents.length} incident{floorIncidents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  )
}

FloorPlanHeatmap.displayName = 'FloorPlanHeatmap'

export default FloorPlanHeatmap
