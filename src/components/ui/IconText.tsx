import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Icon-Text Alignment Configuration
 *
 * Maps font sizes to their optimal icon sizes and optical adjustments.
 * Based on the formula: iconSize ≈ fontSize × 1.33 (rounded to nearest 4px)
 * Optical adjustment compensates for font cap-height vs mathematical center.
 */
const SIZE_CONFIG = {
  xs: { fontSize: 12, iconSize: 16, lineHeight: 16, opticalAdjust: 0.5 },
  sm: { fontSize: 14, iconSize: 16, lineHeight: 16, opticalAdjust: 0.5 },
  base: { fontSize: 16, iconSize: 20, lineHeight: 20, opticalAdjust: 1 },
  lg: { fontSize: 18, iconSize: 24, lineHeight: 24, opticalAdjust: 1 },
  xl: { fontSize: 20, iconSize: 24, lineHeight: 24, opticalAdjust: 1 },
  '2xl': { fontSize: 24, iconSize: 32, lineHeight: 32, opticalAdjust: 1.5 },
  '3xl': { fontSize: 30, iconSize: 36, lineHeight: 36, opticalAdjust: 2 },
} as const

type Size = keyof typeof SIZE_CONFIG

interface IconProps {
  size?: number
  style?: React.CSSProperties
}

export interface IconTextProps {
  /** The icon element (Lucide icon recommended) */
  icon: React.ReactElement<IconProps>
  /** Text content */
  children: React.ReactNode
  /** Size preset - controls font size, icon size, and alignment */
  size?: Size
  /** Gap between icon and text (default: 8px for sm, 12px for lg+) */
  gap?: number | string
  /** HTML element to render as */
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label'
  /** Additional class names */
  className?: string
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  /** Icon color (defaults to currentColor) */
  iconColor?: string
  /** Text color */
  textColor?: string
  /** Disable optical adjustment (use mathematical center) */
  disableOpticalAdjust?: boolean
  /** Custom optical adjustment in pixels */
  opticalAdjust?: number
  /** Style overrides */
  style?: React.CSSProperties
}

/**
 * IconText - Automatically aligned icon + text component
 *
 * Handles the tricky UX problem of vertically aligning icons with text.
 * Uses matched line-height + optical adjustment for pixel-perfect alignment.
 *
 * @example
 * ```tsx
 * <IconText icon={<Info />} size="lg" as="h2" weight="semibold">
 *   Why We Moved
 * </IconText>
 * ```
 */
export function IconText({
  icon,
  children,
  size = 'base',
  gap,
  as: Component = 'div',
  className,
  weight = 'normal',
  iconColor,
  textColor,
  disableOpticalAdjust = false,
  opticalAdjust: customOpticalAdjust,
  style,
}: IconTextProps) {
  const config = SIZE_CONFIG[size]
  const computedGap = gap ?? (config.fontSize >= 18 ? 12 : 8)
  const opticalAdjust = customOpticalAdjust ?? (disableOpticalAdjust ? 0 : config.opticalAdjust)

  const weightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }[weight]

  // Clone icon with computed size
  const iconElement = React.cloneElement(icon, {
    size: config.iconSize,
    style: {
      flexShrink: 0,
      color: iconColor,
      ...icon.props.style,
    },
  })

  return (
    <Component
      className={cn('flex items-center', weightClass, className)}
      style={{
        gap: typeof computedGap === 'number' ? `${computedGap}px` : computedGap,
        ...style,
      }}
    >
      {iconElement}
      <span
        style={{
          fontSize: `${config.fontSize}px`,
          lineHeight: `${config.lineHeight}px`,
          color: textColor,
          transform: opticalAdjust ? `translateY(${opticalAdjust}px)` : undefined,
        }}
      >
        {children}
      </span>
    </Component>
  )
}

/**
 * Preset components for common use cases
 */
export function IconHeading1(props: Omit<IconTextProps, 'as' | 'size' | 'weight'>) {
  return <IconText as="h1" size="3xl" weight="bold" {...props} />
}

export function IconHeading2(props: Omit<IconTextProps, 'as' | 'size' | 'weight'>) {
  return <IconText as="h2" size="lg" weight="semibold" {...props} />
}

export function IconHeading3(props: Omit<IconTextProps, 'as' | 'size' | 'weight'>) {
  return <IconText as="h3" size="base" weight="semibold" {...props} />
}

export function IconLabel(props: Omit<IconTextProps, 'as' | 'size' | 'weight'>) {
  return <IconText as="label" size="sm" weight="medium" {...props} />
}
