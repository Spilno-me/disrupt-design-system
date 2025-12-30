/**
 * LocationsPage - Main orchestrator for Location Management
 *
 * Responsive layout:
 * - Desktop: Master-detail two-panel layout
 * - Mobile: Full-width tree with bottom sheet for details
 *
 * Mobile UX:
 * - Bottom sheet for create/edit/view modes
 * - Swipe-to-reveal actions on tree items
 * - 44px minimum touch targets
 */

import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { MapPin, RefreshCw, Plus, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { AppCard } from '../../../components/ui/app-card'
import { TooltipProvider } from '../../../components/ui/tooltip'
import { LocationTree } from './tree/LocationTree'
import { LocationEmptyState } from './panels/LocationEmptyState'
import { LocationForm } from './panels/LocationForm'
import { LocationInfo } from './panels/LocationInfo'
import { DeleteLocationDialog } from './dialogs/DeleteLocationDialog'
import { LocationDetailSheet } from './mobile/LocationDetailSheet'
import { useIsMobile } from './hooks/useIsMobile'
import { useLocationRiskData } from './hooks/useLocationRiskData'
import { useRiskRollup } from './hooks/useRiskRollup'
import type { LocationIncident, LocationRiskData } from './risk/types'
import {
  countDescendants,
  findLocationById,
  flattenLocations,
  type Location,
  type LocationFormData,
  type LocationsPageProps,
  type RightPanelMode,
} from './types'

export function LocationsPage({
  locations,
  isLoading: _isLoading = false,
  onLocationCreate,
  onLocationUpdate,
  onLocationDelete,
  onRefresh,
  incidents = [],
  onViewIncident,
  onViewAllIncidents,
  onScheduleAudit,
}: LocationsPageProps) {
  // ==========================================================================
  // RESPONSIVE
  // ==========================================================================

  const isMobile = useIsMobile()

  // ==========================================================================
  // STATE
  // ==========================================================================

  // Tree state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')

  // Panel mode
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  const selectedLocation = selectedId
    ? findLocationById(locations, selectedId)
    : null

  const deleteChildCount = locationToDelete
    ? countDescendants(locationToDelete)
    : 0

  // ==========================================================================
  // RISK DATA COMPUTATION
  // ==========================================================================

  // Convert incidents to LocationIncident format
  const locationIncidents: LocationIncident[] = useMemo(
    () =>
      incidents.map((inc) => ({
        id: inc.id,
        incidentId: inc.incidentId,
        locationId: inc.locationId,
        severity: inc.severity,
        type: inc.type as LocationIncident['type'],
        status: inc.status as LocationIncident['status'],
        title: inc.title,
        createdAt: inc.createdAt,
        closedAt: inc.closedAt,
        precisionMarker: inc.precisionMarker,
      })),
    [incidents]
  )

  // Flatten locations for risk calculations
  const flatLocations = useMemo(() => flattenLocations(locations), [locations])

  // Compute risk data per location (direct incidents only)
  const { riskDataMap: directRiskMap, incidentsByLocation } = useLocationRiskData(
    locationIncidents,
    { calculateSparkline: true }
  )

  // Roll up children risk to parents
  const { rolledUpRiskMap: riskDataMap } = useRiskRollup(
    locations,
    directRiskMap
  )

  // Get risk data for selected location
  const selectedRiskData = selectedId ? riskDataMap.get(selectedId) : null

  // Get incidents for selected location
  const selectedIncidents = selectedId
    ? incidentsByLocation.get(selectedId) || []
    : []

  // Get sibling locations for comparison (same parent)
  const siblingLocations = useMemo(() => {
    if (!selectedLocation) return []

    // Find siblings (same parentId)
    const siblings = flatLocations.filter(
      (loc) =>
        loc.parentId === selectedLocation.parentId &&
        loc.id !== selectedLocation.id
    )

    // Return with their risk data
    return siblings
      .map((loc) => ({
        location: loc,
        riskData: riskDataMap.get(loc.id),
      }))
      .filter(
        (item): item is { location: Location; riskData: LocationRiskData } =>
          !!item.riskData
      )
  }, [selectedLocation, flatLocations, riskDataMap])

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleExpandToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedId(location.id)
    setPanelMode('view')
  }, [])

  const handleAddClick = useCallback(() => {
    setSelectedId(null)
    setPanelMode('create')
  }, [])

  const handleEditClick = useCallback((location: Location) => {
    setSelectedId(location.id)
    setPanelMode('edit')
  }, [])

  const handleDeleteClick = useCallback((location: Location) => {
    setLocationToDelete(location)
    setDeleteDialogOpen(true)
  }, [])

  const handleCancelForm = useCallback(() => {
    if (selectedId) {
      setPanelMode('view')
    } else {
      setPanelMode('empty')
    }
  }, [selectedId])

  const handleCreateSubmit = useCallback(
    async (data: LocationFormData) => {
      if (!onLocationCreate) return

      setIsSubmitting(true)
      try {
        await onLocationCreate({
          ...data,
          code: data.code,
        })
        setPanelMode('empty')
        setSelectedId(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onLocationCreate]
  )

  const handleEditSubmit = useCallback(
    async (data: LocationFormData) => {
      if (!onLocationUpdate || !selectedId) return

      setIsSubmitting(true)
      try {
        await onLocationUpdate({
          ...data,
          id: selectedId,
          code: data.code,
        })
        setPanelMode('view')
      } finally {
        setIsSubmitting(false)
      }
    },
    [onLocationUpdate, selectedId]
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!onLocationDelete || !locationToDelete) return

    setIsSubmitting(true)
    try {
      await onLocationDelete(locationToDelete.id)
      setDeleteDialogOpen(false)
      setLocationToDelete(null)
      // Clear selection if the deleted location was selected
      if (selectedId === locationToDelete.id) {
        setSelectedId(null)
        setPanelMode('empty')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [onLocationDelete, locationToDelete, selectedId])

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return

    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh])

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Common tree props
  const treeProps = {
    locations,
    expandedIds,
    selectedId,
    searchValue,
    onExpandToggle: handleExpandToggle,
    onSelect: handleLocationSelect,
    onSearchChange: setSearchValue,
    onAddClick: handleAddClick,
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
    isMobile,
    riskDataMap,
  }

  // Handle sheet close on mobile
  const handleSheetClose = useCallback((open: boolean) => {
    if (!open) {
      setPanelMode('empty')
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 min-h-screen">
        {/* Page Header - ActionCard style */}
        <PageActionPanel
          icon={<MapPin className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Location Management"
          subtitle="Manage facility locations and zones"
          primaryAction={
            onLocationCreate ? (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedId(null)
                  setPanelMode('create')
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </Button>
            ) : undefined
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              {isRefreshing ? (
                <Loader2 className={cn('size-4', isRefreshing && 'animate-spin')} />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </Button>
          }
        />

        {/* Main Content - Responsive Layout */}
        {isMobile ? (
          // MOBILE: Full-width tree with bottom sheet
          <div className="flex flex-col flex-1 min-h-0">
            <AppCard variant="surface" className="flex-1 overflow-hidden">
              <LocationTree {...treeProps} />
            </AppCard>

            {/* Bottom sheet for details */}
            <LocationDetailSheet
              open={panelMode !== 'empty'}
              onOpenChange={handleSheetClose}
              mode={panelMode}
              location={selectedLocation}
              onSubmit={panelMode === 'create' ? handleCreateSubmit : handleEditSubmit}
              onCancel={handleCancelForm}
              onEditClick={() => setPanelMode('edit')}
              isSubmitting={isSubmitting}
              riskData={selectedRiskData}
              incidents={selectedIncidents}
              siblingLocations={siblingLocations}
              onViewIncident={onViewIncident}
              onViewAllIncidents={
                onViewAllIncidents && selectedLocation
                  ? () => onViewAllIncidents(selectedLocation.id)
                  : undefined
              }
              onScheduleAudit={
                onScheduleAudit && selectedLocation
                  ? () => onScheduleAudit(selectedLocation.id)
                  : undefined
              }
            />
          </div>
        ) : (
          // DESKTOP: Two-panel layout
          <div className="grid grid-cols-[550px_1fr] gap-6 flex-1">
            {/* Left Panel - Location Tree */}
            <AppCard variant="surface" className="overflow-hidden">
              <LocationTree {...treeProps} />
            </AppCard>

            {/* Right Panel - Context Sensitive */}
            <AppCard className="overflow-hidden min-h-[500px]">
              {panelMode === 'empty' && <LocationEmptyState />}

              {panelMode === 'create' && (
                <LocationForm
                  mode="create"
                  onSubmit={handleCreateSubmit}
                  onCancel={handleCancelForm}
                  isSubmitting={isSubmitting}
                />
              )}

              {panelMode === 'edit' && selectedLocation && (
                <LocationForm
                  mode="edit"
                  location={selectedLocation}
                  onSubmit={handleEditSubmit}
                  onCancel={handleCancelForm}
                  isSubmitting={isSubmitting}
                />
              )}

              {panelMode === 'view' && selectedLocation && (
                <LocationInfo
                  location={selectedLocation}
                  onEditClick={() => setPanelMode('edit')}
                  riskData={selectedRiskData}
                  incidents={selectedIncidents}
                  siblingLocations={siblingLocations}
                  onViewIncident={onViewIncident}
                  onViewAllIncidents={
                    onViewAllIncidents
                      ? () => onViewAllIncidents(selectedLocation.id)
                      : undefined
                  }
                  onScheduleAudit={
                    onScheduleAudit
                      ? () => onScheduleAudit(selectedLocation.id)
                      : undefined
                  }
                />
              )}
            </AppCard>
          </div>
        )}

        {/* Delete Dialog - works on both mobile and desktop */}
        <DeleteLocationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          location={locationToDelete}
          childCount={deleteChildCount}
          onConfirm={handleDeleteConfirm}
          isSubmitting={isSubmitting}
        />
      </div>
    </TooltipProvider>
  )
}

LocationsPage.displayName = 'LocationsPage'

export default LocationsPage
