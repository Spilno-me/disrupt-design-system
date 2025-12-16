/**
 * TreeNode Component
 * Renders a single 3D node in the token tree
 *
 * Note: Uses Three.js components which have different styling requirements.
 */

/* eslint-disable no-restricted-syntax */

import { useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { TreeNode as TreeNodeType, TreeConfig } from './types'
import { hexToThreeColor, isColorValue } from './utils/colorUtils'

interface TreeNodeProps {
  node: TreeNodeType
  config: TreeConfig
  isExpanded: boolean
  isSelected: boolean
  onClick: () => void
  showLabel: boolean
}

export function TreeNode({
  node,
  config,
  isExpanded,
  isSelected,
  onClick,
  showLabel,
}: TreeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Animate scale on hover/select
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const targetScale = isSelected
      ? config.nodeSize.selected
      : hovered
        ? config.nodeSize.hover
        : config.nodeSize.base

    // Smooth interpolation
    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 10)
    meshRef.current.scale.setScalar(newScale)
  })

  // Determine node color based on value or type
  const getNodeColor = (): THREE.Color => {
    // If node has a color value, use it
    if (node.value && isColorValue(node.value)) {
      return hexToThreeColor(node.value)
    }

    // Type-based colors
    if (isSelected) return hexToThreeColor(config.colors.nodeSelected)
    if (hovered) return hexToThreeColor(config.colors.nodeHover)

    // Default by type
    switch (node.type) {
      case 'root':
        return hexToThreeColor('#08A4BD') // DEEP_CURRENT[500]
      case 'category':
        return hexToThreeColor('#5E4F7E') // DUSK_REEF[500]
      case 'scale':
        return hexToThreeColor('#2D3142') // ABYSS[500]
      case 'token':
        return hexToThreeColor('#64748B') // SLATE[500]
      default:
        return hexToThreeColor(config.colors.nodeDefault)
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick()
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  if (!node.position) return null

  const nodeColor = getNodeColor()
  const hasChildren = node.children.length > 0

  // Choose geometry based on node type
  const getGeometry = () => {
    switch (node.type) {
      case 'root':
        return <dodecahedronGeometry args={[0.4, 0]} />
      case 'category':
        return <octahedronGeometry args={[0.3, 0]} />
      case 'scale':
        return <icosahedronGeometry args={[0.25, 0]} />
      case 'value':
        // Color values are cubes to display the color better
        return node.value && isColorValue(node.value) ? (
          <boxGeometry args={[0.3, 0.3, 0.3]} />
        ) : (
          <sphereGeometry args={[0.15, 12, 12]} />
        )
      default:
        return <sphereGeometry args={[0.2, 16, 16]} />
    }
  }

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={nodeColor}
          metalness={node.type === 'value' ? 0.1 : 0.3}
          roughness={node.type === 'value' ? 0.2 : 0.5}
          emissive={hovered || isSelected ? nodeColor : undefined}
          emissiveIntensity={hovered ? 0.3 : isSelected ? 0.4 : 0}
        />
      </mesh>

      {/* Expand indicator ring for nodes with children */}
      {hasChildren && !isExpanded && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshBasicMaterial
            color={hexToThreeColor('#08A4BD')}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label overlay */}
      {showLabel && (hovered || isSelected || node.depth <= 1) && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(45, 49, 66, 0.95)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: '"Fixel", system-ui, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(8, 164, 189, 0.3)',
            }}
          >
            <span style={{ color: '#08A4BD', marginRight: '6px' }}>
              {node.type === 'root'
                ? '/'
                : node.type === 'category'
                  ? '#'
                  : node.type === 'scale'
                    ? '@'
                    : ''}
            </span>
            {node.name}
            {node.value && isColorValue(node.value) && (
              <span
                style={{
                  marginLeft: '8px',
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: node.value,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  verticalAlign: 'middle',
                }}
              />
            )}
            {hasChildren && !isExpanded && (
              <span
                style={{
                  marginLeft: '8px',
                  color: '#08A4BD',
                  fontSize: '10px',
                }}
              >
                +{node.metadata?.childCount || node.children.length}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
