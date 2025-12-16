/**
 * TokenTree3D Component
 * Main wrapper component for the 3D token hierarchy visualization
 *
 * Note: Uses Three.js/React Three Fiber which requires specific styling patterns.
 */

/* eslint-disable no-restricted-syntax */

import React, { Suspense, useState, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import type { TreeNode as TreeNodeType, TokenTree3DProps, TreeConfig } from './types'
import { TreeNode } from './TreeNode'
import { TreeConnection } from './TreeConnection'
import { NodeDetailPanel } from './NodeDetailPanel'
import { transformTokensToTree } from './utils/tokenTransformer'
import { useTreeLayout, getVisibleNodes, getVisibleConnections } from './hooks/useTreeLayout'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ABYSS, DEEP_CURRENT, DUSK_REEF } from '@/constants/designTokens'

/** Default configuration for the tree visualization */
const DEFAULT_CONFIG: TreeConfig = {
  rotationSpeed: 0.5,
  nodeSize: {
    base: 1,
    hover: 1.3,
    selected: 1.5,
  },
  colors: {
    connection: DEEP_CURRENT[300],
    nodeDefault: ABYSS[400],
    nodeHover: DEEP_CURRENT[500],
    nodeSelected: DEEP_CURRENT[600],
    label: '#FFFFFF',
    labelBackground: ABYSS[500],
  },
  animation: {
    expand: 0.4,
    hover: 0.2,
    camera: 0.6,
  },
  layout: {
    baseRadius: 3,
    radiusIncrement: 2.5,
    verticalSpread: 1.5,
  },
}

/** Loading fallback for Suspense */
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#08A4BD" wireframe />
    </mesh>
  )
}

/** Scene content - separated for proper hook usage */
function TokenTreeScene({
  treeData,
  config,
  expandedNodeIds,
  selectedNodeId,
  onNodeClick,
  showLabels,
}: {
  treeData: TreeNodeType
  config: TreeConfig
  expandedNodeIds: Set<string>
  selectedNodeId: string | null
  onNodeClick: (node: TreeNodeType) => void
  showLabels: boolean
}) {
  const layoutedTree = useTreeLayout(treeData, expandedNodeIds, config.layout)

  const visibleNodes = useMemo(() => getVisibleNodes(layoutedTree), [layoutedTree])
  const connections = useMemo(() => getVisibleConnections(layoutedTree), [layoutedTree])

  return (
    <>
      {/* Connections */}
      {connections.map(({ parent, child }) => (
        <TreeConnection
          key={`${parent.id}-${child.id}`}
          parentPosition={parent.position!}
          childPosition={child.position!}
          color={config.colors.connection}
          opacity={0.3}
        />
      ))}

      {/* Nodes */}
      {visibleNodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          config={config}
          isExpanded={expandedNodeIds.has(node.id)}
          isSelected={selectedNodeId === node.id}
          onClick={() => onNodeClick(node)}
          showLabel={showLabels}
        />
      ))}
    </>
  )
}

/** Main TokenTree3D component */
export function TokenTree3D({
  initialExpanded = ['primitives', 'alias'],
  onNodeSelect,
  showLabels = true,
  autoRotate = true,
  className = '',
  height = '600px',
}: TokenTree3DProps) {
  const isMobile = useIsMobile()
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(initialExpanded)
  )

  // Generate tree data once
  const treeData = useMemo(() => transformTokensToTree(), [])

  // Handle node click - toggle expansion and selection
  const handleNodeClick = useCallback(
    (node: TreeNodeType) => {
      setSelectedNode(node)
      onNodeSelect?.(node)

      // Toggle expansion for nodes with children
      if (node.children.length > 0) {
        setExpandedNodeIds((prev) => {
          const next = new Set(prev)
          if (next.has(node.id)) {
            next.delete(node.id)
          } else {
            next.add(node.id)
          }
          return next
        })
      }
    },
    [onNodeSelect]
  )

  // Close detail panel
  const handleCloseDetail = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Copy value callback
  const handleCopyValue = useCallback((value: string) => {
    console.log('Copied:', value)
  }, [])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        background: `linear-gradient(135deg, ${ABYSS[700]} 0%, ${ABYSS[900]} 100%)`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: [0, 8, 15],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ antialias: !isMobile }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color={DUSK_REEF[400]} />

          {/* Background stars */}
          <Stars
            radius={50}
            depth={50}
            count={isMobile ? 1000 : 3000}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Tree visualization */}
          <TokenTreeScene
            treeData={treeData}
            config={DEFAULT_CONFIG}
            expandedNodeIds={expandedNodeIds}
            selectedNodeId={selectedNode?.id ?? null}
            onNodeClick={handleNodeClick}
            showLabels={showLabels && !isMobile}
          />

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={40}
            dampingFactor={0.1}
            enableDamping
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />
        </Suspense>
      </Canvas>

      {/* Detail panel overlay */}
      <NodeDetailPanel
        node={selectedNode}
        onClose={handleCloseDetail}
        onCopyValue={handleCopyValue}
      />

      {/* Instructions overlay */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(45, 49, 66, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          fontFamily: '"Fixel", system-ui, sans-serif',
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 600, color: '#08A4BD', marginBottom: '4px' }}>
          Controls
        </div>
        <div>Drag to rotate</div>
        <div>Scroll to zoom</div>
        <div>Click nodes to expand</div>
      </div>
    </div>
  )
}
