/**
 * FloorPlanUploader - Admin component for uploading floor plan images
 *
 * Used in Location Management to attach floor plans to locations.
 * Supports drag-and-drop, multiple floor plans, and reordering.
 *
 * @example
 * ```tsx
 * <FloorPlanUploader
 *   floorPlans={location.floorPlans || []}
 *   onChange={(plans) => updateLocation({ floorPlans: plans })}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  X,
  Image as ImageIcon,
  GripVertical,
  Plus,
  Trash2,
  Eye,
  Edit2,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { Input } from '../input'
import type { FloorPlan } from '../../../flow/components/locations/types'

// =============================================================================
// TYPES
// =============================================================================

export interface FloorPlanUploadItem extends FloorPlan {
  /** Temporary ID for new uploads before saving */
  _tempId?: string
  /** File object for new uploads */
  _file?: File
  /** Preview URL for new uploads */
  _previewUrl?: string
}

export interface FloorPlanUploaderProps {
  /** Current floor plans */
  floorPlans: FloorPlanUploadItem[]
  /** Called when floor plans change */
  onChange: (floorPlans: FloorPlanUploadItem[]) => void
  /** Maximum number of floor plans allowed */
  maxPlans?: number
  /** Disable interaction */
  disabled?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// HELPERS
// =============================================================================

function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FloorPlanUploader({
  floorPlans,
  onChange,
  maxPlans = 5,
  disabled = false,
  className,
}: FloorPlanUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))

      if (imageFiles.length === 0) return

      const newPlans: FloorPlanUploadItem[] = imageFiles
        .slice(0, maxPlans - floorPlans.length)
        .map((file, index) => ({
          imageUrl: '', // Will be set after upload
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          _tempId: generateTempId(),
          _file: file,
          _previewUrl: URL.createObjectURL(file),
        }))

      onChange([...floorPlans, ...newPlans])

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [floorPlans, onChange, maxPlans]
  )

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled) return

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )

      if (files.length === 0) return

      const newPlans: FloorPlanUploadItem[] = files
        .slice(0, maxPlans - floorPlans.length)
        .map((file) => ({
          imageUrl: '',
          name: file.name.replace(/\.[^/.]+$/, ''),
          _tempId: generateTempId(),
          _file: file,
          _previewUrl: URL.createObjectURL(file),
        }))

      onChange([...floorPlans, ...newPlans])
    },
    [floorPlans, onChange, maxPlans, disabled]
  )

  // Remove a floor plan
  const handleRemove = useCallback(
    (index: number) => {
      const plan = floorPlans[index]
      // Revoke object URL if it's a preview
      if (plan._previewUrl) {
        URL.revokeObjectURL(plan._previewUrl)
      }
      onChange(floorPlans.filter((_, i) => i !== index))
    },
    [floorPlans, onChange]
  )

  // Update floor plan name
  const handleNameChange = useCallback(
    (index: number, name: string) => {
      const updated = [...floorPlans]
      updated[index] = { ...updated[index], name }
      onChange(updated)
    },
    [floorPlans, onChange]
  )

  // Reorder floor plans via drag
  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', String(index))
      e.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDragOverIndex(index)
    },
    []
  )

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleReorder = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault()
      setDragOverIndex(null)

      const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
      if (isNaN(sourceIndex) || sourceIndex === targetIndex) return

      const updated = [...floorPlans]
      const [moved] = updated.splice(sourceIndex, 1)
      updated.splice(targetIndex, 0, moved)
      onChange(updated)
    },
    [floorPlans, onChange]
  )

  const canAddMore = floorPlans.length < maxPlans

  return (
    <div className={cn('space-y-4', className)}>
      {/* Floor plan list */}
      {floorPlans.length > 0 && (
        <div className="space-y-2">
          {floorPlans.map((plan, index) => {
            const imageUrl = plan._previewUrl || plan.imageUrl
            const isEditing = editingIndex === index

            return (
              <div
                key={plan._tempId || plan.imageUrl || index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border bg-surface transition-all',
                  dragOverIndex === index
                    ? 'border-accent bg-accent/5'
                    : 'border-default',
                  disabled && 'opacity-60'
                )}
                draggable={!disabled && floorPlans.length > 1}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleReorder(e, index)}
              >
                {/* Drag handle */}
                {floorPlans.length > 1 && !disabled && (
                  <GripVertical className="h-4 w-4 text-tertiary cursor-grab shrink-0" />
                )}

                {/* Thumbnail */}
                <div
                  className="w-16 h-12 rounded overflow-hidden bg-muted-bg shrink-0 cursor-pointer"
                  onClick={() => setPreviewIndex(index)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={plan.name || 'Floor plan'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-tertiary" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <Input
                      value={plan.name || ''}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onBlur={() => setEditingIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingIndex(null)
                      }}
                      placeholder="Floor plan name"
                      className="h-8"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-medium text-primary truncate">
                      {plan.name || `Floor Plan ${index + 1}`}
                    </p>
                  )}
                  {plan._file && (
                    <p className="text-xs text-tertiary">
                      {(plan._file.size / 1024 / 1024).toFixed(2)} MB • Pending upload
                    </p>
                  )}
                </div>

                {/* Actions */}
                {!disabled && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(index)}
                      className="p-1.5 text-tertiary hover:text-primary hover:bg-muted-bg rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(index)}
                      className="p-1.5 text-tertiary hover:text-primary hover:bg-muted-bg rounded transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 text-tertiary hover:text-error hover:bg-error/10 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && !disabled && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-accent hover:bg-accent/5',
            floorPlans.length === 0
              ? 'border-default'
              : 'border-default/50 py-4'
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload floor plan"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {floorPlans.length === 0 ? (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-tertiary" />
              <p className="text-sm font-medium text-primary">
                Upload Floor Plan
              </p>
              <p className="text-xs text-tertiary mt-1">
                PNG, JPG up to 10MB • Drag & drop or click to browse
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-tertiary hover:text-accent">
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add another floor plan</span>
            </div>
          )}
        </div>
      )}

      {/* Limit message */}
      {floorPlans.length > 0 && (
        <p className="text-xs text-tertiary">
          {floorPlans.length} of {maxPlans} floor plan{maxPlans !== 1 ? 's' : ''}
          {floorPlans.some((p) => p._file) && ' • Some plans pending upload'}
        </p>
      )}

      {/* Preview Modal */}
      {previewIndex !== null && floorPlans[previewIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-surface rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-default">
              <h3 className="font-medium text-primary">
                {floorPlans[previewIndex].name || `Floor Plan ${previewIndex + 1}`}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="p-1.5 text-tertiary hover:text-primary hover:bg-muted-bg rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-60px)]">
              <img
                src={
                  floorPlans[previewIndex]._previewUrl ||
                  floorPlans[previewIndex].imageUrl
                }
                alt={floorPlans[previewIndex].name || 'Floor plan preview'}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

FloorPlanUploader.displayName = 'FloorPlanUploader'

export default FloorPlanUploader
