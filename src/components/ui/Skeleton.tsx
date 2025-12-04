import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  /** Animation variant */
  variant?: 'pulse' | 'shimmer' | 'wave'
  /** Border radius style */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

/**
 * Skeleton loading placeholder component.
 * Use to indicate content is loading while maintaining layout structure.
 */
export function Skeleton({
  className = '',
  variant = 'shimmer',
  rounded = 'lg',
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    wave: 'skeleton-wave',
  }

  return (
    <div
      className={cn(
        'bg-muted/30',
        roundedClasses[rounded],
        animationClasses[variant],
        className
      )}
      aria-hidden="true"
      role="presentation"
    />
  )
}

interface SkeletonImageProps {
  className?: string
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
}

/**
 * Image skeleton with proper aspect ratio maintenance.
 */
export function SkeletonImage({
  className = '',
  aspectRatio = '4/3',
}: SkeletonImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    auto: '',
  }

  return (
    <Skeleton
      className={cn('w-full', aspectClasses[aspectRatio], className)}
      rounded="2xl"
      variant="shimmer"
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

/**
 * Text skeleton for paragraphs.
 */
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
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
