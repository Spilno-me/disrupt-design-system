/**
 * TreeConnection Component
 * Renders lines connecting parent and child nodes in the tree
 */

import { Line } from '@react-three/drei'
import type { TreeConnectionProps } from './types'

export function TreeConnection({
  parentPosition,
  childPosition,
  color,
  opacity = 0.4,
}: TreeConnectionProps) {
  return (
    <Line
      points={[parentPosition, childPosition]}
      color={color}
      lineWidth={1.5}
      opacity={opacity}
      transparent
    />
  )
}
