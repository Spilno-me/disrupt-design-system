/**
 * LocationForm - Create/Edit form for locations
 *
 * Shared form component with:
 * - Mode-aware title (Create/Edit)
 * - Sections: Basic Information, Geographic Information, Floor Plans
 * - Character counters for limited fields
 * - Form validation with react-hook-form
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Info, Globe, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Textarea } from '../../../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import {
  FloorPlanUploader,
  type FloorPlanUploadItem,
} from '../../../../components/ui/floor-plan-uploader'
import {
  LOCATION_TYPE_OPTIONS,
  TIMEZONE_OPTIONS,
  type LocationFormData,
  type LocationFormProps,
  type FloorPlan,
} from '../types'

// Field limits
const FIELD_LIMITS = {
  name: 50,
  description: 500,
  address: 200,
  code: 50,
} as const

export function LocationForm({
  mode,
  location,
  parentLocation,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: LocationFormProps) {
  // Floor plans state (managed separately from react-hook-form for complex array handling)
  const [floorPlans, setFloorPlans] = useState<FloorPlanUploadItem[]>([])

  // Initialize floor plans from location data
  useEffect(() => {
    if (location?.floorPlans) {
      setFloorPlans(location.floorPlans as FloorPlanUploadItem[])
    } else if (location?.floorPlanImage) {
      // Legacy support: convert single image URL to array
      setFloorPlans([{ imageUrl: location.floorPlanImage, name: 'Floor Plan' }])
    } else {
      setFloorPlans([])
    }
  }, [location])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LocationFormData>({
    defaultValues: {
      name: location?.name ?? '',
      type: location?.type ?? 'facility',
      code: location?.code ?? '',
      description: location?.description ?? '',
      address: location?.address ?? '',
      timezone: location?.timezone ?? '',
      latitude: location?.latitude,
      longitude: location?.longitude,
      parentId: location?.parentId ?? parentLocation?.id ?? null,
    },
  })

  // Watch field values for character counters
  const nameValue = watch('name')
  const descriptionValue = watch('description')
  const addressValue = watch('address')
  const codeValue = watch('code')
  const typeValue = watch('type')
  const timezoneValue = watch('timezone')

  const onFormSubmit = async (data: LocationFormData) => {
    // Convert FloorPlanUploadItem[] to FloorPlan[] (strip upload-specific fields)
    const cleanFloorPlans: FloorPlan[] = floorPlans.map((fp) => ({
      imageUrl: fp._previewUrl || fp.imageUrl, // Use preview URL for new uploads until uploaded
      imageWidth: fp.imageWidth,
      imageHeight: fp.imageHeight,
      name: fp.name,
      bounds: fp.bounds,
      calibrationPoints: fp.calibrationPoints,
    }))

    await onSubmit({
      ...data,
      floorPlans: cleanFloorPlans.length > 0 ? cleanFloorPlans : undefined,
      floorPlanImage: cleanFloorPlans[0]?.imageUrl, // Set primary floor plan for convenience
    })
  }

  const title = mode === 'create' ? 'Create Location' : 'Editing Location'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-default">
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent-strong/10">
          <MapPin className="size-5 text-accent-strong" />
        </div>
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
      </div>

      {/* Form content */}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex-1 overflow-auto"
      >
        <div className="p-6 space-y-6">
          {/* BASIC INFORMATION */}
          <fieldset className="space-y-4 rounded-lg border border-default p-4">
            <legend className="flex items-center gap-2 px-2 text-xs font-semibold text-secondary uppercase tracking-wider">
              <Info className="size-3.5 text-tertiary" />
              Basic Information
            </legend>

            {/* Location Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">
                  Location Name <span className="text-error">*</span>
                </Label>
                <span className="text-xs text-tertiary">
                  {nameValue?.length || 0}/{FIELD_LIMITS.name}
                </span>
              </div>
              <Input
                id="name"
                placeholder="Enter location name"
                maxLength={FIELD_LIMITS.name}
                {...register('name', {
                  required: 'Location name is required',
                  maxLength: {
                    value: FIELD_LIMITS.name,
                    message: `Maximum ${FIELD_LIMITS.name} characters`,
                  },
                })}
                aria-invalid={errors.name ? 'true' : undefined}
              />
              {errors.name && (
                <p className="text-xs text-error">{errors.name.message}</p>
              )}
            </div>

            {/* Location Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Location Type <span className="text-error">*</span>
              </Label>
              <Select
                value={typeValue}
                onValueChange={(value) =>
                  setValue('type', value as LocationFormData['type'])
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-error">{errors.type.message}</p>
              )}
            </div>

            {/* Location Code */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">
                  Location Code <span className="text-error">*</span>
                </Label>
                <span className="text-xs text-tertiary">
                  {codeValue?.length || 0}/{FIELD_LIMITS.code}
                </span>
              </div>
              <Input
                id="code"
                placeholder="Enter location code (e.g., FAC-001)"
                maxLength={FIELD_LIMITS.code}
                {...register('code', {
                  required: 'Location code is required',
                  maxLength: {
                    value: FIELD_LIMITS.code,
                    message: `Maximum ${FIELD_LIMITS.code} characters`,
                  },
                })}
                aria-invalid={errors.code ? 'true' : undefined}
              />
              {errors.code && (
                <p className="text-xs text-error">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <span className="text-xs text-tertiary">
                  {descriptionValue?.length || 0}/{FIELD_LIMITS.description}
                </span>
              </div>
              <Textarea
                id="description"
                placeholder="Enter a description for this location (optional)"
                maxLength={FIELD_LIMITS.description}
                rows={3}
                {...register('description', {
                  maxLength: {
                    value: FIELD_LIMITS.description,
                    message: `Maximum ${FIELD_LIMITS.description} characters`,
                  },
                })}
              />
              {errors.description && (
                <p className="text-xs text-error">{errors.description.message}</p>
              )}
            </div>
          </fieldset>

          {/* GEOGRAPHIC INFORMATION */}
          <fieldset className="space-y-4 rounded-lg border border-default p-4">
            <legend className="flex items-center gap-2 px-2 text-xs font-semibold text-secondary uppercase tracking-wider">
              <Globe className="size-3.5 text-tertiary" />
              Geographic Information
            </legend>

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="address">Address</Label>
                <span className="text-xs text-tertiary">
                  {addressValue?.length || 0}/{FIELD_LIMITS.address}
                </span>
              </div>
              <Textarea
                id="address"
                placeholder="Enter the location address (optional)"
                maxLength={FIELD_LIMITS.address}
                rows={2}
                {...register('address', {
                  maxLength: {
                    value: FIELD_LIMITS.address,
                    message: `Maximum ${FIELD_LIMITS.address} characters`,
                  },
                })}
              />
              {errors.address && (
                <p className="text-xs text-error">{errors.address.message}</p>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">
                Timezone <span className="text-error">*</span>
              </Label>
              <Select
                value={timezoneValue}
                onValueChange={(value) => setValue('timezone', value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && (
                <p className="text-xs text-error">{errors.timezone.message}</p>
              )}
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 40.7589"
                  {...register('latitude', {
                    valueAsNumber: true,
                    validate: (value) =>
                      value === undefined ||
                      value === null ||
                      isNaN(value) ||
                      (value >= -90 && value <= 90) ||
                      'Latitude must be between -90 and 90',
                  })}
                  aria-invalid={errors.latitude ? 'true' : undefined}
                />
                {errors.latitude && (
                  <p className="text-xs text-error">{errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. -73.9851"
                  {...register('longitude', {
                    valueAsNumber: true,
                    validate: (value) =>
                      value === undefined ||
                      value === null ||
                      isNaN(value) ||
                      (value >= -180 && value <= 180) ||
                      'Longitude must be between -180 and 180',
                  })}
                  aria-invalid={errors.longitude ? 'true' : undefined}
                />
                {errors.longitude && (
                  <p className="text-xs text-error">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* FLOOR PLANS */}
          <fieldset className="space-y-4 rounded-lg border border-default p-4">
            <legend className="flex items-center gap-2 px-2 text-xs font-semibold text-secondary uppercase tracking-wider">
              <ImageIcon className="size-3.5 text-tertiary" />
              Floor Plans
            </legend>

            <p className="text-sm text-tertiary">
              Upload floor plan images to enable precise incident marking.
              Workers can tap on the floor plan to mark exactly where an incident occurred.
            </p>

            <FloorPlanUploader
              floorPlans={floorPlans}
              onChange={setFloorPlans}
              maxPlans={5}
              disabled={isSubmitting}
            />
          </fieldset>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-default bg-surface">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="size-4 mr-1.5" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-1.5 animate-spin" />}
            <MapPin className="size-4 mr-1.5" />
            {mode === 'create' ? 'Create Location' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}

LocationForm.displayName = 'LocationForm'

export default LocationForm
