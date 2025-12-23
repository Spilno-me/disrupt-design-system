/**
 * UseMyLocationButton - GPS location button for What3Words
 *
 * Requests the user's GPS location and converts it to a what3words address.
 * Handles permission states and loading gracefully.
 *
 * @example
 * ```tsx
 * <UseMyLocationButton
 *   onLocationFound={(coords) => console.log('GPS:', coords)}
 *   onError={(err) => console.error('GPS failed:', err)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import { MapPin, Loader2, MapPinOff } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import type {
  UseMyLocationButtonProps,
  GpsPermissionStatus,
} from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function UseMyLocationButton({
  onLocationFound,
  onError,
  disabled = false,
  className,
}: UseMyLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [permissionStatus, setPermissionStatus] =
    useState<GpsPermissionStatus>('prompt')

  // Check if geolocation is available
  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable')
      return
    }

    // Check permission status if API available
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state as GpsPermissionStatus)

          // Listen for permission changes
          result.onchange = () => {
            setPermissionStatus(result.state as GpsPermissionStatus)
          }
        })
        .catch(() => {
          // Permissions API not fully supported, assume prompt
          setPermissionStatus('prompt')
        })
    }
  }, [])

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      return
    }

    setIsLoading(true)

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          })
        }
      )

      setPermissionStatus('granted')
      onLocationFound({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (error) {
      const geoError = error as GeolocationPositionError
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setPermissionStatus('denied')
      }
      onError?.(geoError)
    } finally {
      setIsLoading(false)
    }
  }

  // Determine button state
  const isDisabled =
    disabled ||
    isLoading ||
    permissionStatus === 'denied' ||
    permissionStatus === 'unavailable'

  const getButtonTitle = () => {
    if (permissionStatus === 'unavailable') {
      return 'GPS not available on this device'
    }
    if (permissionStatus === 'denied') {
      return 'Location permission denied. Please enable in browser settings.'
    }
    return 'Use my current location'
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    if (permissionStatus === 'denied' || permissionStatus === 'unavailable') {
      return <MapPinOff className="h-4 w-4" />
    }
    return <MapPin className="h-4 w-4" />
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      onClick={requestLocation}
      disabled={isDisabled}
      title={getButtonTitle()}
      aria-label={getButtonTitle()}
      className={cn(
        'shrink-0 h-12 md:h-10 px-3',
        permissionStatus === 'denied' && 'text-tertiary',
        className
      )}
    >
      {getButtonIcon()}
      <span className="sr-only md:not-sr-only md:ml-2">
        {isLoading ? 'Locating...' : 'GPS'}
      </span>
    </Button>
  )
}

UseMyLocationButton.displayName = 'UseMyLocationButton'

export default UseMyLocationButton
