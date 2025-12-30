import * as React from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Border radius class mapping for skeleton variants */
const ROUNDED_CLASSES = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const

/** Aspect ratio class mapping for image skeletons */
const ASPECT_CLASSES = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  auto: '',
} as const

// =============================================================================
// TYPES
// =============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  /**
   * Animation variant
   * @deprecated The variant prop is deprecated and will be removed in v3.0.0.
   * Skeleton now uses a single, consistent 'shimmer' animation for design consistency.
   * All variants will render as shimmer in v2.x for backwards compatibility.
   */
  variant?: 'pulse' | 'shimmer' | 'wave'
  /** Border radius style */
  rounded?: keyof typeof ROUNDED_CLASSES
}

interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  aspectRatio?: keyof typeof ASPECT_CLASSES
}

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Skeleton loading placeholder component.
 * Use to indicate content is loading while maintaining layout structure.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="w-[200px] h-[20px]" />
 *
 * // With animation variants
 * <Skeleton variant="shimmer" />
 * <Skeleton variant="wave" />
 * <Skeleton variant="pulse" />
 *
 * // With data-testid (consumer provides context)
 * <Skeleton
 *   className="w-full h-[60px]"
 *   data-testid="profile-skeleton"
 * />
 * <Skeleton data-testid="list-item-skeleton-1" />
 * ```
 */
export function Skeleton({
  className = '',
  variant: _variant = 'shimmer',  // Deprecated, but kept for backwards compat
  rounded = 'lg',
  ...props
}: SkeletonProps) {
  // Always use shimmer for consistency (ignore variant prop)
  // Deprecated variants still work in v2.x but render as shimmer
  const animation = 'skeleton-shimmer'

  return (
    <div
      {...props}
      className={cn(
        // Use muted-bg token for better contrast on elevated surfaces
        // bg-muted-bg (#EFEDF3) provides ~1.06:1 on elevated (#FFFEF9)
        // Adding slight transparency maintains subtle appearance while staying visible
        'bg-muted-bg/80',
        ROUNDED_CLASSES[rounded],
        animation,
        className
      )}
      aria-hidden="true"
      role="presentation"
    />
  )
}

Skeleton.displayName = "Skeleton"

/**
 * Image skeleton with proper aspect ratio maintenance.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SkeletonImage aspectRatio="16/9" />
 * <SkeletonImage aspectRatio="square" />
 *
 * // With data-testid (consumer provides context)
 * <SkeletonImage
 *   aspectRatio="square"
 *   data-testid="avatar-skeleton"
 * />
 * ```
 */
export function SkeletonImage({
  className = '',
  aspectRatio = '4/3',
  ...props
}: SkeletonImageProps) {
  return (
    <Skeleton
      {...props}
      className={cn('w-full', ASPECT_CLASSES[aspectRatio], className)}
      rounded="2xl"
      variant="shimmer"
    />
  )
}

SkeletonImage.displayName = "SkeletonImage"

/**
 * Text skeleton for paragraphs.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SkeletonText lines={4} />
 *
 * // With data-testid (consumer provides context)
 * <SkeletonText
 *   lines={3}
 *   data-testid="description-skeleton"
 * />
 * ```
 */
export function SkeletonText({ lines = 3, className = '', ...props }: SkeletonTextProps) {
  return (
    <div {...props} className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          rounded="sm"
          variant="shimmer"
        />
      ))}
    </div>
  )
}

SkeletonText.displayName = "SkeletonText"
