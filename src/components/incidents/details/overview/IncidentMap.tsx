/**
 * IncidentMap - Interactive map preview for incident location
 *
 * Displays a map centered on the incident coordinates.
 * Falls back to a static grid preview if coordinates are unavailable
 * or if Leaflet fails to load.
 *
 * Uses Leaflet with OpenStreetMap tiles (free, no API key required).
 *
 * @example
 * ```tsx
 * <IncidentMap
 *   coordinates={{ lat: 49.8397, lng: 24.0297 }}
 *   what3words="///appealing.concluded.mugs"
 *   height={180}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { IncidentMapProps } from '../types'

/**
 * Static fallback map preview
 * Shows a grid pattern with a marker when map can't load
 */
function StaticMapPreview({
  what3words,
  height,
  className,
}: {
  what3words?: string
  height: number | string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        'bg-muted-bg',
        className
      )}
      style={{ height }}
    >
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-border-default) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border-default) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Center marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 -m-2 rounded-full bg-accent/20 animate-ping" />
          {/* Marker icon */}
          <div className="relative bg-accent rounded-full p-2">
            <MapPin className="size-5 text-on-accent" />
          </div>
        </div>
      </div>

      {/* What3words overlay */}
      {what3words && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-surface/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono text-secondary">
            {what3words}
          </div>
        </div>
      )}

      {/* "Map" label */}
      <div className="absolute top-2 right-2">
        <span className="text-xs text-tertiary bg-surface/80 px-1.5 py-0.5 rounded">
          Map Preview
        </span>
      </div>
    </div>
  )
}

/**
 * Leaflet map component (lazy loaded)
 */
function LeafletMap({
  coordinates,
  zoom,
  height,
  interactive,
  showMarker,
  className,
}: {
  coordinates: { lat: number; lng: number }
  zoom: number
  height: number | string
  interactive: boolean
  showMarker: boolean
  className?: string
}) {
  // Dynamic imports from react-leaflet have complex generic types that don't export cleanly
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<any>
    TileLayer: React.ComponentType<any>
    Marker: React.ComponentType<any>
  } | null>(null)
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [error, setError] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ])
      .then(([reactLeaflet, L]) => {
        // Fix default marker icon issue with Leaflet + webpack
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        setMapComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
        })
      })
      .catch(() => {
        setError(true)
      })
  }, [])

  if (error || !MapComponents) {
    return null
  }

  const { MapContainer, TileLayer, Marker } = MapComponents

  return (
    <div className={cn('rounded-lg overflow-hidden', className)} style={{ height }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showMarker && (
          <Marker position={[coordinates.lat, coordinates.lng]} />
        )}
      </MapContainer>
    </div>
  )
}

/**
 * IncidentMap - Map preview component with fallback
 */
export function IncidentMap({
  coordinates,
  what3words,
  height = 180,
  zoom = 15,
  interactive = false,
  showMarker = true,
  className,
}: IncidentMapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [leafletError, setLeafletError] = useState(false)

  // Check if Leaflet CSS is loaded
  useEffect(() => {
    // Add Leaflet CSS if not already present
    const existingLink = document.querySelector('link[href*="leaflet"]')
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.onload = () => setLeafletLoaded(true)
      link.onerror = () => setLeafletError(true)
      document.head.appendChild(link)
    } else {
      setLeafletLoaded(true)
    }
  }, [])

  // If no coordinates, show static preview
  if (!coordinates) {
    return (
      <StaticMapPreview
        what3words={what3words}
        height={height}
        className={className}
      />
    )
  }

  // If Leaflet failed to load or is still loading, show static preview
  if (leafletError || !leafletLoaded) {
    return (
      <StaticMapPreview
        what3words={what3words}
        height={height}
        className={className}
      />
    )
  }

  // Try to render Leaflet map with static fallback
  return (
    <React.Suspense
      fallback={
        <StaticMapPreview
          what3words={what3words}
          height={height}
          className={className}
        />
      }
    >
      <LeafletMap
        coordinates={coordinates}
        zoom={zoom}
        height={height}
        interactive={interactive}
        showMarker={showMarker}
        className={className}
      />
    </React.Suspense>
  )
}

export default IncidentMap
