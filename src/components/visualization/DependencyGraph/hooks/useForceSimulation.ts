/**
 * useForceSimulation Hook
 * Manages D3 force simulation for the dependency graph
 */

import { useRef, useCallback, useLayoutEffect } from 'react'
import * as d3Force from 'd3-force'
import type { GraphNode, GraphLink, GraphConfig } from '../types'
import { getNodeRadius } from '../utils/nodeStyles'

interface UseForceSimulationOptions {
  nodes: GraphNode[]
  links: GraphLink[]
  config: GraphConfig
  onTick: () => void
}

interface UseForceSimulationReturn {
  simulation: d3Force.Simulation<GraphNode, GraphLink> | null
  restart: () => void
  stop: () => void
  reheat: () => void
}

export function useForceSimulation({
  nodes,
  links,
  config,
  onTick,
}: UseForceSimulationOptions): UseForceSimulationReturn {
  const simulationRef = useRef<d3Force.Simulation<GraphNode, GraphLink> | null>(null)
  const onTickRef = useRef(onTick)
  const hasRunRef = useRef(false)

  // Keep onTick ref updated
  onTickRef.current = onTick

  // Initialize simulation - run to completion (static layout)
  // Use useLayoutEffect to run before paint, and only once
  useLayoutEffect(() => {
    // Only run once per node/link set
    if (nodes.length === 0) return

    // Skip if already computed for this data
    if (hasRunRef.current && simulationRef.current) {
      return
    }

    const { width, height, forces } = config

    // Create simulation
    const simulation = d3Force
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3Force
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => {
            // Token links are shorter than component links
            const linkType = (d as GraphLink).type
            return linkType === 'uses-token' ? forces.linkDistance * 0.7 : forces.linkDistance
          })
          .strength(0.5)
      )
      .force(
        'charge',
        d3Force.forceManyBody<GraphNode>().strength(forces.chargeStrength)
      )
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3Force
          .forceCollide<GraphNode>()
          .radius((d) => getNodeRadius(d) + forces.collisionRadius)
      )
      // Keep nodes within bounds
      .force('x', d3Force.forceX(width / 2).strength(0.03))
      .force('y', d3Force.forceY(height / 2).strength(0.03))

    // Run simulation to completion synchronously (no animation)
    simulation.stop()
    for (let i = 0; i < 300; i++) {
      simulation.tick()
    }

    // Store ref
    simulationRef.current = simulation
    hasRunRef.current = true

    // Single render after layout is complete
    onTickRef.current()

    // Cleanup
    return () => {
      simulation.stop()
      hasRunRef.current = false
    }
  }, [nodes, links, config.width, config.height, config.forces.chargeStrength, config.forces.collisionRadius, config.forces.linkDistance])

  // Restart simulation
  const restart = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart()
    }
  }, [])

  // Stop simulation
  const stop = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.stop()
    }
  }, [])

  // Reheat simulation (for drag events)
  const reheat = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart()
    }
  }, [])

  return {
    simulation: simulationRef.current,
    restart,
    stop,
    reheat,
  }
}

/**
 * Create drag behavior for nodes
 */
export function createDragBehavior(
  simulation: d3Force.Simulation<GraphNode, GraphLink> | null
) {
  if (!simulation) return null

  return {
    onDragStart: (node: GraphNode) => {
      simulation.alphaTarget(0.3).restart()
      node.fx = node.x
      node.fy = node.y
    },
    onDrag: (node: GraphNode, x: number, y: number) => {
      node.fx = x
      node.fy = y
    },
    onDragEnd: (node: GraphNode) => {
      simulation.alphaTarget(0)
      node.fx = null
      node.fy = null
    },
  }
}
