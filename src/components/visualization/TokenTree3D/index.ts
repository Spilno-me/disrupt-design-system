/**
 * TokenTree3D - 3D Token Hierarchy Visualization
 *
 * Interactive Three.js visualization of the DDS token architecture
 */

export { TokenTree3D } from './TokenTree3D'
export type {
  TreeNode,
  TreeNodeType,
  TreeNodeMetadata,
  TreeConfig,
  TokenTree3DProps,
} from './types'

// Utilities for advanced usage
export { transformTokensToTree, countNodes, flattenTree, findNodeById } from './utils/tokenTransformer'
export { hexToThreeColor, getContrastColor, isColorValue } from './utils/colorUtils'
