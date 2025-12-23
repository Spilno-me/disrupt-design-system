/**
 * What3WordsMap - Map preview for selected what3words location
 *
 * Supports two modes:
 * 1. Real what3words map (requires API keys)
 * 2. Static fallback preview (no API keys needed)
 *
 * @example
 * ```tsx
 * // With real map (requires API keys in env)
 * <What3WordsMap
 *   value={{ words: 'filled.count.soap', ... }}
 *   apiKey={process.env.W3W_API_KEY}
 *   googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
 * />
 *
 * // Static fallback (no API keys)
 * <What3WordsMap value={{ words: 'filled.count.soap', ... }} />
 * ```
 */

import * as React from 'react'
import { MapPin, Globe, Copy, Check, ExternalLink } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import type { What3WordsMapProps, What3WordsValue } from './types'

// =============================================================================
// EXTENDED PROPS
// =============================================================================

interface ExtendedWhat3WordsMapProps extends What3WordsMapProps {
  /** what3words API key (enables real map) */
  apiKey?: string
  /** Google Maps API key (required for real map) */
  googleMapsApiKey?: string
  /** Map height */
  height?: string | number
  /** Show zoom controls */
  showZoomControl?: boolean
  /** Show fullscreen control */
  showFullscreenControl?: boolean
  /** Initial zoom level */
  zoom?: number
}

// =============================================================================
// REAL MAP COMPONENT (Lazy loaded)
// =============================================================================

const RealWhat3WordsMap = React.lazy(() =>
  import('@what3words/react-components').then((module) => ({
    default: ({ value, apiKey, googleMapsApiKey, height, zoom, showZoomControl, showFullscreenControl }: {
      value: What3WordsValue
      apiKey: string
      googleMapsApiKey: string
      height: string | number
      zoom: number
      showZoomControl: boolean
      showFullscreenControl: boolean
    }) => {
      const What3wordsMap = module.What3wordsMap

      return (
        <What3wordsMap
          api_key={apiKey}
          map_api_key={googleMapsApiKey}
          words={value.words}
          zoom={zoom}
          selected_zoom={20}
          zoom_control={showZoomControl}
          fullscreen_control={showFullscreenControl}
          disable_default_ui={!showZoomControl && !showFullscreenControl}
        >
          <div
            slot="map"
            style={{
              width: '100%',
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          />
        </What3wordsMap>
      )
    },
  }))
)

// =============================================================================
// STATIC FALLBACK COMPONENT
// =============================================================================

function StaticMapPreview({
  value,
  className,
}: {
  value: What3WordsValue
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`///${value.words}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Calculate marker position (simplified mercator)
  const getMarkerPosition = () => {
    const x = ((value.coordinates.lng + 180) / 360) * 100
    const y = ((90 - value.coordinates.lat) / 180) * 100
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) }
  }

  const markerPos = getMarkerPosition()

  return (
    <div className={cn('rounded-lg border border-default bg-surface overflow-hidden', className)}>
      {/* Map visualization */}
      <div className="relative h-[140px] bg-gradient-to-br from-wave-100 via-wave-50 to-harbor-100 dark:from-wave-900/30 dark:via-abyss-800 dark:to-harbor-900/30">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
        >
          <div className="absolute -inset-2 bg-error/20 rounded-full animate-ping" />
          <MapPin className="h-6 w-6 text-error drop-shadow-md" fill="currentColor" />
        </div>

        {/* Grid */}
        <div
          className="absolute w-12 h-12 border-2 border-error/50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
        >
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={cn('border border-error/30', i === 4 && 'bg-error/20')} />
            ))}
          </div>
        </div>

        {/* "No API key" badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-surface/80 backdrop-blur-sm rounded text-xs text-tertiary">
          Preview mode
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 w-6 h-6 rounded bg-error/10 flex items-center justify-center">
              <span className="text-xs font-bold text-error">///</span>
            </div>
            <span className="text-sm font-semibold text-primary truncate">{value.words}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleCopy} className="shrink-0 h-7 px-2">
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="ml-1 text-xs">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="ml-1 text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-tertiary">{value.nearestPlace}, {value.country}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-tertiary/70 font-mono">
            {value.coordinates.lat.toFixed(6)}, {value.coordinates.lng.toFixed(6)}
          </p>
          <a
            href={`https://what3words.com/${value.words}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-strong transition-colors"
          >
            <span>View map</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-dashed border-default bg-muted-bg/50 p-6 flex flex-col items-center justify-center text-center min-h-[140px]',
        className
      )}
    >
      <Globe className="h-8 w-8 text-tertiary mb-2" />
      <p className="text-sm text-tertiary">No location selected</p>
      <p className="text-xs text-tertiary/70 mt-1">Type a what3words address or use GPS</p>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function What3WordsMap({
  value,
  className,
  apiKey,
  googleMapsApiKey,
  height = 200,
  showZoomControl = true,
  showFullscreenControl = false,
  zoom = 18,
}: ExtendedWhat3WordsMapProps) {
  // Empty state
  if (!value) {
    return <EmptyState className={className} />
  }

  // Check if we have API keys for real map
  const hasApiKeys = apiKey && googleMapsApiKey

  // Real what3words map
  if (hasApiKeys) {
    return (
      <div className={cn('rounded-lg border border-default overflow-hidden isolate', className)}>
        <React.Suspense
          fallback={
            <div
              className="flex items-center justify-center bg-muted-bg"
              style={{ height: typeof height === 'number' ? `${height}px` : height }}
            >
              <div className="animate-pulse text-sm text-tertiary">Loading map...</div>
            </div>
          }
        >
          <RealWhat3WordsMap
            value={value}
            apiKey={apiKey}
            googleMapsApiKey={googleMapsApiKey}
            height={height}
            zoom={zoom}
            showZoomControl={showZoomControl}
            showFullscreenControl={showFullscreenControl}
          />
        </React.Suspense>

        {/* Details below map */}
        <div className="p-3 border-t border-default bg-surface">
          <div className="flex items-center gap-2">
            <div className="shrink-0 w-5 h-5 rounded bg-error/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-error">///</span>
            </div>
            <span className="text-sm font-medium text-primary">{value.words}</span>
          </div>
          {value.nearestPlace && (
            <p className="text-xs text-tertiary mt-1 ml-7">{value.nearestPlace}, {value.country}</p>
          )}
        </div>
      </div>
    )
  }

  // Static fallback
  return <StaticMapPreview value={value} className={className} />
}

What3WordsMap.displayName = 'What3WordsMap'

export default What3WordsMap
