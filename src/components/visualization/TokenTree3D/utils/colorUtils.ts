/**
 * Color Utilities for TokenTree3D
 * Helpers for converting colors between formats
 *
 * Note: Works with raw hex values for Three.js color conversions.
 */

/* eslint-disable no-restricted-syntax */

import * as THREE from 'three'

/**
 * Convert hex color string to THREE.Color
 * Handles both #RRGGBB and #RGB formats
 */
export function hexToThreeColor(hex: string): THREE.Color {
  // Handle rgba strings - extract the RGB portion
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
    const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      const r = parseInt(match[1], 10) / 255
      const g = parseInt(match[2], 10) / 255
      const b = parseInt(match[3], 10) / 255
      return new THREE.Color(r, g, b)
    }
  }

  return new THREE.Color(hex)
}

/**
 * Get a contrasting text color (white or black) for a given background
 */
export function getContrastColor(hex: string): string {
  const color = new THREE.Color(hex)
  // Calculate relative luminance
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const color = new THREE.Color(hex)
  color.r = Math.min(1, color.r + (1 - color.r) * percent)
  color.g = Math.min(1, color.g + (1 - color.g) * percent)
  color.b = Math.min(1, color.b + (1 - color.b) * percent)
  return `#${color.getHexString()}`
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const color = new THREE.Color(hex)
  color.r = Math.max(0, color.r * (1 - percent))
  color.g = Math.max(0, color.g * (1 - percent))
  color.b = Math.max(0, color.b * (1 - percent))
  return `#${color.getHexString()}`
}

/**
 * Check if a string is a valid hex color
 */
export function isHexColor(str: string): boolean {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(str)
}

/**
 * Check if a string is a valid color (hex or rgba)
 */
export function isColorValue(str: string): boolean {
  if (!str) return false
  return isHexColor(str) || str.startsWith('rgba') || str.startsWith('rgb')
}

/**
 * Get color for a node based on its type and value
 */
export function getNodeColor(
  nodeType: string,
  value: string | undefined,
  defaults: { category: string; scale: string; token: string; value: string }
): string {
  // If node has a color value, use it
  if (value && isColorValue(value)) {
    return value
  }

  // Otherwise use type-based defaults
  switch (nodeType) {
    case 'root':
      return defaults.category
    case 'category':
      return defaults.category
    case 'scale':
      return defaults.scale
    case 'token':
      return defaults.token
    case 'value':
      return defaults.value
    default:
      return defaults.token
  }
}
